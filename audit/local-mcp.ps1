# Helper wrapper for sub-agents to call the local MCP gateway.
# Usage:
#   powershell -File local-mcp.ps1 -Op list
#   powershell -File local-mcp.ps1 -Op search -Query "aged receivables" -MaxResults 5
#   powershell -File local-mcp.ps1 -Op describe -Names "Data_AgedSummary,Data_BankTransactions_Get"
#   powershell -File local-mcp.ps1 -Op invoke -Name "Data_AgedSummary" -ArgsJson '{"clientTenantId":11668,"userProfileId":1,"direction":"receivables"}'

param(
    [Parameter(Mandatory)][ValidateSet("list","search","describe","invoke","session","clients")] [string]$Op,
    [string]$Query = "",
    [string]$Names = "",
    [string]$Name = "",
    [string]$ArgsJson = "{}",
    [int]$MaxResults = 5,
    [string]$McpUrl = "https://localhost:7200/mcp"
)

# Cert bypass for self-signed local cert (PS 5.1)
add-type @"
using System.Net;
using System.Security.Cryptography.X509Certificates;
public class TrustLocalMcp : ICertificatePolicy { public bool CheckValidationResult(ServicePoint sp, X509Certificate cert, WebRequest req, int problem) { return true; } }
"@ -ErrorAction SilentlyContinue
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustLocalMcp
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

function Send-Mcp {
    param([string]$Method, [hashtable]$Params)
    $body = @{ jsonrpc = "2.0"; id = (Get-Random); method = $Method; params = $Params } | ConvertTo-Json -Depth 10 -Compress
    try {
        $r = Invoke-RestMethod -Uri $McpUrl -Method Post -ContentType "application/json" -Body $body -TimeoutSec 60
        if ($r.result.content -and $r.result.content[0].text) {
            return $r.result.content[0].text
        }
        return ($r | ConvertTo-Json -Depth 10 -Compress)
    } catch {
        return (@{ ok = $false; error = $_.Exception.Message } | ConvertTo-Json -Compress)
    }
}

switch ($Op) {
    "list"     { Send-Mcp -Method "tools/list" -Params @{} }
    "session"  { Send-Mcp -Method "tools/call" -Params @{ name = "Auth_GetCurrentSession"; arguments = @{} } }
    "clients"  { Send-Mcp -Method "tools/call" -Params @{ name = "tools_invoke"; arguments = @{ name = "Data_GetAllAccessibleClients"; argumentsJson = "{}" } } }
    "search"   { Send-Mcp -Method "tools/call" -Params @{ name = "tools_search"; arguments = @{ query = $Query; max_results = $MaxResults } } }
    "describe" { Send-Mcp -Method "tools/call" -Params @{ name = "tools_describe"; arguments = @{ names = $Names } } }
    "invoke"   { Send-Mcp -Method "tools/call" -Params @{ name = "tools_invoke"; arguments = @{ name = $Name; argumentsJson = $ArgsJson } } }
}
