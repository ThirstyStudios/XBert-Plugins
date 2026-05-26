# Local MCP gateway test harness
# Usage: powershell -File Test-LocalMcp.ps1 -ManifestPath <path>
# Output: results JSONL at audit/local-test-results.jsonl

param(
    [string]$ManifestPath = "C:\XBert Pty Ltd\XBert\xbert-plugins\audit\test-manifest.txt",
    [string]$OutputPath = "C:\XBert Pty Ltd\XBert\xbert-plugins\audit\local-test-results.jsonl",
    [string]$McpUrl = "https://localhost:7200/mcp",
    [int]$ClientTenantId = 11668,    # Peak Precision Accounting (accessible locally)
    [int]$ConnectTenantId = 11374,   # Agents - The Future (the local mock user's Connect)
    [int]$DelayMs = 500              # gentle pacing between requests
)

# Cert bypass for self-signed local cert (PS 5.1)
add-type @"
using System.Net;
using System.Security.Cryptography.X509Certificates;
public class TrustAllH : ICertificatePolicy { public bool CheckValidationResult(ServicePoint sp, X509Certificate cert, WebRequest req, int problem) { return true; } }
"@ -ErrorAction SilentlyContinue
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllH
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

function Invoke-Mcp {
    param([string]$ToolName, [hashtable]$Arguments, [int]$TimeoutSec = 60)
    $body = @{
        jsonrpc = "2.0"; id = (Get-Random)
        method = "tools/call"
        params = @{ name = $ToolName; arguments = $Arguments }
    } | ConvertTo-Json -Depth 10
    try {
        $r = Invoke-RestMethod -Uri $McpUrl -Method Post -ContentType "application/json" -Body $body -TimeoutSec $TimeoutSec
        return @{ ok = $true; data = $r.result.content[0].text }
    } catch {
        return @{ ok = $false; error = $_.Exception.Message }
    }
}

function Test-OneTool {
    param([string]$TestName, [string]$Kind, [string]$Command, [string]$Keyword, [string]$Scope, [string]$Country)

    $result = [PSCustomObject]@{
        timestamp = (Get-Date -Format "o")
        kind = $Kind                    # agent or plugin
        command = "/$Command"
        keyword = $Keyword
        scope = $Scope
        country = $Country
        status = $null                  # works|works-partial|tool-fail|agent-confused|empty|error
        quality = 0                     # 1-5
        tools_searched = 0
        top_tool = $null
        tool_invoked = $null
        response_size = 0
        response_preview = $null
        error = $null
    }

    # Step 1: tools_search
    $search = Invoke-Mcp -ToolName "tools_search" -Arguments @{ query = $Keyword; max_results = 3 } -TimeoutSec 20
    if (-not $search.ok) {
        $result.status = "error"
        $result.error = "tools_search failed: $($search.error)"
        return $result
    }
    $searchJson = $search.data | ConvertFrom-Json
    $result.tools_searched = $searchJson.totalMatches
    if ($searchJson.totalMatches -eq 0 -or -not $searchJson.results) {
        $result.status = "agent-confused"
        $result.quality = 1
        return $result
    }
    $top = $searchJson.results[0]
    $result.top_tool = $top.name

    # Step 2: build args from schema (required fields)
    $toolArgs = @{}
    if ($top.parameterSchema -and $top.parameterSchema.required) {
        foreach ($req in $top.parameterSchema.required) {
            switch -wildcard ($req) {
                "clientTenantId"  { $toolArgs[$req] = $ClientTenantId }
                "connectTenantId" { $toolArgs[$req] = $ConnectTenantId }
                "userProfileId"   { $toolArgs[$req] = 1 }
                "startDate"       { $toolArgs[$req] = (Get-Date).AddDays(-30).ToString("yyyy-MM-dd") }
                "endDate"         { $toolArgs[$req] = (Get-Date).ToString("yyyy-MM-dd") }
                "direction"       { $toolArgs[$req] = "receivables" }
                "asOfDate"        { $toolArgs[$req] = (Get-Date).ToString("yyyy-MM-dd") }
                "statement"       { $toolArgs[$req] = "balanceSheet" }
                "name"            { $toolArgs[$req] = "Test" }
                default           { $toolArgs[$req] = "" }
            }
        }
    }

    # Step 3: invoke top tool
    $invoke = Invoke-Mcp -ToolName "tools_invoke" -Arguments @{ name = $top.name; argumentsJson = ($toolArgs | ConvertTo-Json -Compress) } -TimeoutSec 60
    if (-not $invoke.ok) {
        $result.status = "error"
        $result.error = "invoke failed: $($invoke.error)"
        $result.quality = 1
        return $result
    }
    $result.tool_invoked = $top.name
    $result.response_size = $invoke.data.Length
    $result.response_preview = $invoke.data.Substring(0, [Math]::Min(400, $invoke.data.Length))

    # Step 4: score
    $body = $invoke.data
    if ($body -match 'DATA_ACCESS_DENIED|errorCode:|status: error|"success":false') {
        $result.status = "tool-fail"
        $result.quality = 1
    } elseif ($body -match '"totalCount":0|"results":\[\]|"items":\[\]|no_results|empty|"count":0') {
        $result.status = "empty"
        $result.quality = 3
    } elseif ($body.Length -lt 100) {
        $result.status = "works-partial"
        $result.quality = 2
    } else {
        $result.status = "works"
        $result.quality = 4
    }
    return $result
}

# Parse manifest into test cases. Manifest format:
# /command | scope=X | country=Y | description...
$cases = @()
$inAgents = $false
$inPlugins = $false
Get-Content $ManifestPath | ForEach-Object {
    if ($_ -match "^--AGENTS")  { $inAgents = $true;  $inPlugins = $false; return }
    if ($_ -match "^--PLUGINS") { $inAgents = $false; $inPlugins = $true;  return }
    if ($_ -match "^/([a-z0-9-]+)") {
        $cmd = $matches[1]
        # Derive search keyword: first 2-3 nouns from the command name
        $kw = ($cmd -replace "-", " ")
        $sc = if ($_ -match "scope=(\w+)") { $matches[1] } else { "" }
        $co = if ($_ -match "country=(\w+)") { $matches[1] } else { "" }
        $kind = if ($inAgents) { "agent" } else { "plugin" }
        $cases += [PSCustomObject]@{ Kind = $kind; Command = $cmd; Keyword = $kw; Scope = $sc; Country = $co }
    }
}

Write-Output "Parsed $($cases.Count) test cases. Running against $McpUrl ..."

# Clear output file
if (Test-Path $OutputPath) { Remove-Item $OutputPath }

$i = 0
foreach ($c in $cases) {
    $i++
    $pct = [Math]::Round(($i / $cases.Count) * 100, 0)
    Write-Output "[$i/$($cases.Count) $pct%] $($c.Kind) /$($c.Command) ($($c.Scope), $($c.Country))"
    $r = Test-OneTool -TestName "$($c.Kind)/$($c.Command)" -Kind $c.Kind -Command $c.Command -Keyword $c.Keyword -Scope $c.Scope -Country $c.Country
    ($r | ConvertTo-Json -Compress) | Add-Content -Path $OutputPath
    Write-Output "       -> $($r.status) q=$($r.quality) tool=$($r.top_tool)"
    Start-Sleep -Milliseconds $DelayMs
}

Write-Output ""
Write-Output "DONE. Results written to: $OutputPath"
