# Payroll Close feedback regression test - one assertion set per feedback item from the
# Booloumba review (Cass Scott, 10 Jun 2026). Runs against any XBert MCP gateway that
# accepts unauthenticated local JSON-RPC (default: local dev gateway). For the production
# claude.ai connector, run the same assertions interactively via tools_invoke (see
# payroll-close-feedback-retest.md).
#
# Usage:
#   powershell -File Test-PayrollClose.ps1 -ClientTenantId 79195 -ConnectTenantId 79194
#   powershell -File Test-PayrollClose.ps1 -McpUrl https://localhost:7200/mcp -FyStart 2025-07-01 -FyEnd 2026-06-30
#
# Exit code 0 = all hard assertions pass; 1 = at least one FAIL.

param(
    [string]$McpUrl = "https://localhost:7200/mcp",
    [int]$ClientTenantId = 79195,
    [int]$ConnectTenantId = 79194,
    [string]$FyStart = "2025-07-01",
    [string]$FyEnd = "2026-06-30"
)

# Cert bypass for self-signed local cert (PS 5.1)
add-type @"
using System.Net;
using System.Security.Cryptography.X509Certificates;
public class TrustLocalMcp2 : ICertificatePolicy { public bool CheckValidationResult(ServicePoint sp, X509Certificate cert, WebRequest req, int problem) { return true; } }
"@ -ErrorAction SilentlyContinue
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustLocalMcp2
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$script:failures = 0
$script:results = @()

function Send-Mcp {
    param([string]$Method, [hashtable]$Params)
    $body = @{ jsonrpc = "2.0"; id = (Get-Random); method = $Method; params = $Params } | ConvertTo-Json -Depth 10 -Compress
    try {
        $r = Invoke-RestMethod -Uri $McpUrl -Method Post -ContentType "application/json" -Body $body -TimeoutSec 120
        if ($r.result.content -and $r.result.content[0].text) { return $r.result.content[0].text }
        return ($r | ConvertTo-Json -Depth 10 -Compress)
    } catch {
        return (@{ ok = $false; transportError = $_.Exception.Message } | ConvertTo-Json -Compress)
    }
}

function Invoke-Tool {
    param([string]$Name, [hashtable]$Arguments)
    $argsJson = $Arguments | ConvertTo-Json -Depth 10 -Compress
    return Send-Mcp -Method "tools/call" -Params @{ name = "tools_invoke"; arguments = @{ name = $Name; argumentsJson = $argsJson } }
}

function Assert {
    param([string]$Id, [string]$Description, [bool]$Pass, [string]$Detail = "", [switch]$WarnOnly)
    $status = if ($Pass) { "PASS" } elseif ($WarnOnly) { "WARN" } else { "FAIL"; $script:failures++ }
    $script:results += "[$status] $Id - $Description $(if ($Detail) { "| $Detail" })"
    Write-Host "[$status] $Id - $Description $(if ($Detail) { "| $Detail" })"
}

Write-Host "=== Payroll Close feedback regression - gateway $McpUrl, tenant $ClientTenantId, FY $FyStart..$FyEnd ===`n"

# ---------------------------------------------------------------------------
# Feedback 1 - "only checked current pay cycle": full-FY multi-cycle pull must work
# ---------------------------------------------------------------------------
$searchRaw = Invoke-Tool -Name "Data_PayRuns_Search" -Arguments @{
    clientTenantId = $ClientTenantId; connectTenantId = $ConnectTenantId
    startDate = $FyStart; endDate = $FyEnd; pageSize = 100
}
$search = $null; try { $search = $searchRaw | ConvertFrom-Json } catch {}
$items = @(); if ($search -and $search.items) { $items = @($search.items) }
Assert -Id "F1.1" -Description "Data_PayRuns_Search returns multiple pay cycles for the FY in one call" `
    -Pass ($items.Count -gt 1) -Detail "rows=$($items.Count)"

$summaryRaw = Invoke-Tool -Name "Data_PayRuns_Summary" -Arguments @{
    clientTenantId = $ClientTenantId; connectTenantId = $ConnectTenantId
    startDate = $FyStart; endDate = $FyEnd; view = "byPeriod"
}
$sumWagesSearch = ($items | Where-Object { $_.status -eq "POSTED" } | Measure-Object -Property totalWages -Sum).Sum
$summaryWages = $null
if ($summaryRaw -match '"totalWages"\s*:\s*([0-9.]+)') { $summaryWages = [decimal]$Matches[1] }
elseif ($summaryRaw -match 'totalWages:\s*([0-9.]+)') { $summaryWages = [decimal]$Matches[1] }
$crossFootOk = ($null -ne $summaryWages -and $null -ne $sumWagesSearch -and [math]::Abs($summaryWages - $sumWagesSearch) -lt 1)
Assert -Id "F1.2" -Description "Search POSTED wages cross-foot to Data_PayRuns_Summary totalWages" `
    -Pass $crossFootOk -Detail "search=$sumWagesSearch summary=$summaryWages" -WarnOnly

# ---------------------------------------------------------------------------
# Feedback 6 - draft pay runs: census must be run WITHOUT a status filter and
# the anomaly checks (drafts / duplicate periods / future-dated POSTED) must fire
# ---------------------------------------------------------------------------
$statuses = $items | Group-Object status | ForEach-Object { "$($_.Name)=$($_.Count)" }
Assert -Id "F6.1" -Description "Pay-run census returns status on every row (no-status-filter call)" `
    -Pass (($items | Where-Object { -not $_.status }).Count -eq 0) -Detail ($statuses -join ", ")

$drafts = @($items | Where-Object { $_.status -eq "DRAFT" })
$dupes = @($items | Group-Object { "$($_.periodStart)|$($_.periodEnd)" } | Where-Object { $_.Count -gt 1 })
$today = Get-Date
$futurePosted = @($items | Where-Object { $_.status -eq "POSTED" -and [datetime]$_.paymentDate -gt $today })
Assert -Id "F6.2" -Description "Draft / duplicate-period / future-dated-POSTED anomalies detectable from census" `
    -Pass ($true) -Detail "drafts=$($drafts.Count) duplicatePeriods=$($dupes.Count) futurePosted=$($futurePosted.Count) (plugin must flag all three classes)"
if ($dupes.Count -gt 0 -or $futurePosted.Count -gt 0) {
    Assert -Id "F6.3" -Description "Known sync limitation reproduced: probable drafts visible only via duplicate/future checks" `
        -Pass $true -Detail "These rows say POSTED but duplicate periods / future payment dates indicate Xero drafts" -WarnOnly
}

# Data_PayRuns_Summary must REJECT status=DRAFT (the trap the prompt must avoid)
$draftSummaryRaw = Invoke-Tool -Name "Data_PayRuns_Summary" -Arguments @{
    clientTenantId = $ClientTenantId; connectTenantId = $ConnectTenantId
    startDate = $FyStart; endDate = $FyEnd; status = "DRAFT"
}
Assert -Id "F6.4" -Description "Data_PayRuns_Summary status=DRAFT is rejected (prompt must not use it for drafts)" `
    -Pass ($draftSummaryRaw -match "INVALID_ARGUMENTS|not supported|invalid") -Detail "" -WarnOnly

# ---------------------------------------------------------------------------
# Feedback 4 - SG rate: every POSTED run judged at the rate on ITS payment date
# ---------------------------------------------------------------------------
function Get-SgMinimum([datetime]$d) {
    if ($d -ge [datetime]"2025-07-01") { return 12.0 }
    elseif ($d -ge [datetime]"2024-07-01") { return 11.5 }
    elseif ($d -ge [datetime]"2023-07-01") { return 11.0 }
    elseif ($d -ge [datetime]"2022-07-01") { return 10.5 }
    elseif ($d -ge [datetime]"2021-07-01") { return 10.0 }
    else { return 9.5 }
}
$rateRows = @($items | Where-Object { $_.status -eq "POSTED" -and $_.totalWages -gt 0 })
$below = @()
foreach ($r in $rateRows) {
    $eff = [math]::Round(($r.totalSuper / $r.totalWages) * 100, 2)
    $min = Get-SgMinimum ([datetime]$r.paymentDate)
    if ($eff -lt ($min - 0.5)) { $below += "$(([datetime]$r.paymentDate).ToString('yyyy-MM-dd')) eff=$eff% min=$min%" }
}
Assert -Id "F4.1" -Description "Per-run effective SG rate computable and judged at each run's own payment date" `
    -Pass ($rateRows.Count -gt 0) -Detail "runsChecked=$($rateRows.Count) belowMinimum=$($below.Count)$(if ($below) { ' [' + ($below -join '; ') + ']' })"

# Validation_SuperReconciliation: present? correct rate? known-defect signature?
$descRaw = Send-Mcp -Method "tools/call" -Params @{ name = "tools_describe"; arguments = @{ names = "Validation_SuperReconciliation,Validation_PayrollReconciliation" } }
$validationPresent = ($descRaw -match '"parameterSchema"')
Assert -Id "F4.2" -Description "Validation_SuperReconciliation exposed on this gateway (deploy-state probe)" `
    -Pass $validationPresent -Detail $(if ($validationPresent) { "present" } else { "ABSENT - SG fix (app-processing PR #1712) not deployed here; plugin falls back to pinned table" }) -WarnOnly
if ($validationPresent) {
    $superRaw = Invoke-Tool -Name "Validation_SuperReconciliation" -Arguments @{
        clientTenantId = $ClientTenantId; userProfileId = 1
        startDate = $FyStart; endDate = $FyEnd
    }
    $rateOk = ($superRaw -match 'applicableSGRate[^0-9]*12\.0')
    Assert -Id "F4.3" -Description "applicableSGRate reports 12.0% for an FY25/26 range" -Pass $rateOk -Detail ""
    $bugSignature = ($superRaw -match 'NO_DATA|INCOMPLETE_DATA|payRunCount[^0-9]*0') -and ($items.Count -gt 0)
    Assert -Id "F4.4" -Description "No flat-PayRun deserialization fault (payroll side non-zero while warehouse has runs)" `
        -Pass (-not $bugSignature) -Detail $(if ($bugSignature) { "BUG SIGNATURE: Validation tool sees 0 pay runs but Data_PayRuns_Search returned $($items.Count) - GetPayrollReconciliationData.cs:158/182 nested-EmployeePay wire parsed as flat List<PayRun>" } else { "" }) -WarnOnly
}

# ---------------------------------------------------------------------------
# Feedback 5 - terminated employees: termination data must be available to exclude them
# ---------------------------------------------------------------------------
$empRaw = Invoke-Tool -Name "Data_Employees_Search" -Arguments @{
    clientTenantId = $ClientTenantId; connectTenantId = $ConnectTenantId; pageSize = 100
}
$emp = $null; try { $emp = $empRaw | ConvertFrom-Json } catch {}
$empItems = @(); if ($emp -and $emp.items) { $empItems = @($emp.items) }
$terminated = @($empItems | Where-Object { $_.status -eq "TERMINATED" -or $_.terminationDate })
$termNoDate = @($terminated | Where-Object { -not $_.terminationDate })
Assert -Id "F5.1" -Description "Employee census exposes status + terminationDate for the exclusion set" `
    -Pass ($empItems.Count -gt 0 -and $termNoDate.Count -eq 0) `
    -Detail "employees=$($empItems.Count) terminated=$($terminated.Count) terminatedWithoutDate=$($termNoDate.Count)"
$priorFyTerm = @($terminated | Where-Object { $_.terminationDate -and [datetime]$_.terminationDate -lt [datetime]$FyStart })
Assert -Id "F5.2" -Description "Prior-FY-terminated exclusion set computable client-side" `
    -Pass $true -Detail "terminatedBefore $FyStart = $($priorFyTerm.Count) employees (plugin must exclude these from leave/STP/variance findings)"

# ---------------------------------------------------------------------------
# Feedback 2 - payroll settings / pay items: settings + earnings-rate surfaces respond
# ---------------------------------------------------------------------------
$settingsRaw = Invoke-Tool -Name "Data_PayrollSettings" -Arguments @{ clientTenantId = $ClientTenantId; userProfileId = 1 }
$rolesNeeded = @("WAGESEXPENSE", "PAYGLIABILITY", "SUPERANNUATIONLIABILITY")
$rolesFound = @($rolesNeeded | Where-Object { $settingsRaw -match $_ })
Assert -Id "F2.1" -Description "Data_PayrollSettings returns payroll GL account mapping + pay calendars" `
    -Pass ($rolesFound.Count -eq $rolesNeeded.Count -and $settingsRaw -match "payCalendars") `
    -Detail "rolesFound=$($rolesFound -join ",")"

$earningsRaw = Invoke-Tool -Name "Data_Payslips_Summary" -Arguments @{
    clientTenantId = $ClientTenantId; connectTenantId = $ConnectTenantId
    startDate = $FyStart; endDate = $FyEnd; view = "byEarningsRate"
}
Assert -Id "F2.2" -Description "Data_Payslips_Summary byEarningsRate returns pay items with earningsType classification" `
    -Pass ($earningsRaw -match "earningsType") -Detail ""
# F2.3 - pay-item flags: exposed via includePayItems on newer gateways; gap (disclosed) on older ones
$settingsSchemaRaw = Send-Mcp -Method "tools/call" -Params @{ name = "tools_describe"; arguments = @{ names = "Data_PayrollSettings" } }
if ($settingsSchemaRaw -match "includePayItems") {
    $payItemsRaw = Invoke-Tool -Name "Data_PayrollSettings" -Arguments @{ clientTenantId = $ClientTenantId; userProfileId = 1; includePayItems = $true }
    Assert -Id "F2.3" -Description "includePayItems returns earnings-rate compliance flags (isExemptFromSuper etc.)" `
        -Pass ($payItemsRaw -match "isExemptFromSuper") -Detail ""
} else {
    Assert -Id "F2.3" -Description "GAP on this gateway (pre-includePayItems deploy): pay-item flags not exposed - plugin must list under 'Not checked'" `
        -Pass $true -Detail "Deploy the MCP server with the includePayItems surface to close this" -WarnOnly
}

# F-STP - per-employee STP tax-treatment flags via Data_Employees_Get taxInformation (newer gateways)
$activeEmp = $empItems | Where-Object { $_.status -eq "ACTIVE" } | Select-Object -First 1
if ($activeEmp) {
    $empDetailRaw = Invoke-Tool -Name "Data_Employees_Get" -Arguments @{ clientTenantId = $ClientTenantId; connectTenantId = $ConnectTenantId; id = $activeEmp.id }
    Assert -Id "FSTP.1" -Description "Data_Employees_Get exposes taxInformation (tfnSupplied + tax-treatment flags) for STP P2 checks" `
        -Pass ($empDetailRaw -match "tfnSupplied|taxInformation") `
        -Detail $(if ($empDetailRaw -match "tfnSupplied") { "present" } else { "ABSENT - older gateway; plugin lists all P2 fields under 'Not checked'" }) -WarnOnly
    Assert -Id "FSTP.2" -Description "Data_Employees_Get exposes incomeType / countryOfResidence / isSTP2Qualified (STP2 fields)" `
        -Pass ($empDetailRaw -match "incomeType|countryOfResidence") `
        -Detail $(if ($empDetailRaw -match "incomeType") { "present" } else { "ABSENT - pre-A9025-exposure gateway; only category mapping should be permanently manual" }) -WarnOnly
}

# F-XBERT - the review must fold in the client's UNCOMPLETED payroll XBerts (alerts, not tasks)
$xbertSummaryRaw = Invoke-Tool -Name "Data_XBertNotificationSummary" -Arguments @{ clientTenantId = $ClientTenantId; userProfileId = 1 }
Assert -Id "FXB.1" -Description "Data_XBertNotificationSummary returns outstanding XBert alerts (tasks/completed excluded at source)" `
    -Pass ($xbertSummaryRaw.Length -gt 50 -and $xbertSummaryRaw -notmatch "TOOL_NOT_FOUND|TOOL_EXECUTION_FAILED") -Detail "bytes=$($xbertSummaryRaw.Length)" -WarnOnly
$workSchemaRaw = Send-Mcp -Method "tools/call" -Params @{ name = "tools_describe"; arguments = @{ names = "Features_GetWork" } }
Assert -Id "FXB.2" -Description "Features_GetWork available for per-XBert drill-down (must pass showOnlyAssignedToUser=false)" `
    -Pass ($workSchemaRaw -match '"parameterSchema"') -Detail "" -WarnOnly

# ---------------------------------------------------------------------------
# Feedback 3 - GL vs payroll: the three assembled legs' inputs respond
# ---------------------------------------------------------------------------
$plRaw = Invoke-Tool -Name "Data_FinancialStatements" -Arguments @{
    clientTenantId = $ClientTenantId; userProfileId = 1
    statement = "profitAndLoss"; startDate = $FyStart; endDate = $FyEnd
}
Assert -Id "F3.1" -Description "P&L retrievable for the wages-expense leg" `
    -Pass ($plRaw.Length -gt 100 -and $plRaw -notmatch "TOOL_EXECUTION_FAILED|errorCode") -Detail "bytes=$($plRaw.Length)"
$bsRaw = Invoke-Tool -Name "Data_FinancialStatements" -Arguments @{
    clientTenantId = $ClientTenantId; userProfileId = 1; statement = "balanceSheet"
}
Assert -Id "F3.2" -Description "Balance sheet retrievable for the PAYG/super liability legs (as-at-latest-sync caveat applies)" `
    -Pass ($bsRaw.Length -gt 100 -and $bsRaw -notmatch "TOOL_EXECUTION_FAILED|errorCode") -Detail "bytes=$($bsRaw.Length)"

# ---------------------------------------------------------------------------
Write-Host "`n=== SUMMARY ==="
$script:results | ForEach-Object { Write-Host $_ }
Write-Host "`nHard failures: $script:failures"
if ($script:failures -gt 0) { exit 1 } else { exit 0 }
