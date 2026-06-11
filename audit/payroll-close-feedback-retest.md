# Payroll Close — feedback retest plan (Booloumba review, 10 Jun 2026)

Verifies that plugin v0.1.3 addresses every item in Cass Scott's review of
`Booloumba_Payroll_Close_Review_Jun2026.docx`. Three layers: (1) tool-level gateway
assertions (scripted), (2) prompt-level end-to-end rerun (manual, graded), (3) deploy-state
preconditions. Reference tenant: Booloumba Enterprises Pty Ltd (client 79195, connect 79194).

## Layer 1 — tool-level gateway assertions (scripted)

Run `audit/Test-PayrollClose.ps1` against the target gateway:

    powershell -File audit/Test-PayrollClose.ps1 -McpUrl https://localhost:7200/mcp -ClientTenantId 79195 -ConnectTenantId 79194

Works against the local dev gateway (start via /start-server-stack) or any environment that
accepts local JSON-RPC. For the **production claude.ai connector** (OAuth — script can't reach
it) run the same assertions through `tools_invoke` in a Claude session with the XBert connector,
after `Auth_SelectBusiness("Booloumba Enterprises Pty Ltd")`.

Production run executed 10 Jun 2026 via the claude.ai connector (read-only tools only):

| ID | Assertion | Prod result 10 Jun 2026 |
|---|---|---|
| F1.1 | Full-FY pay-run pull in one call | PASS — 31 pay runs FY25/26 |
| F6.1 | Census returns status on every row | PASS — all rows POSTED |
| F6.2 | Draft/duplicate/future anomalies detectable | PASS — 1 duplicate period (15–28 Jun ×2), 3 future-dated POSTED runs found |
| F6.3 | Sync limitation reproduced | WARN — probable Xero drafts visible as POSTED; duplicate/future checks are the working detector |
| F4.1 | Per-run effective SG rate computable | PASS — FY25/26 runs all at 12.0% |
| F4.2 | Validation_SuperReconciliation exposed | **ABSENT on prod** — PR #1712 not deployed; plugin falls back to pinned table |
| F5.1 | status + terminationDate on census | PASS — 20 employees, 17 terminated, all dated |
| F5.2 | Prior-FY-terminated exclusion computable | PASS — 17 employees excluded for an FY25/26 review |
| F2.1 | Payroll GL mapping + calendars | PASS — 6 account roles + fortnightly calendar |
| F2.2 | byEarningsRate pay-item classification | PASS — 4 rates with earningsType/allowanceType |
| F2.3 | Pay-item super-exemption flags | GAP (expected) — must appear under "Not checked" |
| F3.1/F3.2 | P&L + balance sheet legs | see script run output |

## Layer 2 — prompt-level end-to-end rerun (the real test)

Install plugin v0.1.3, open a fresh Claude (Desktop or Cowork) chat with the XBert connector
authenticated, and run exactly what Cassandra ran:

    /payroll-close — Booloumba Enterprises Pty Ltd, payroll close review for FY2025/26

Grade the produced report against this checklist. Every row must hold or the prompt fix failed:

| # | Feedback item | Required report behaviour |
|---|---|---|
| 1 | "Only checked current pay cycle" | Coverage statement names ~31 pay runs / full FY range; per-cycle findings reference multiple cycles (e.g. the 1–14 Jun super catch-up run, the $0 Dec run) — not just 18–31 May |
| 2 | "No payroll settings checked" | Settings section present: 6 GL account roles, calendar cadence vs observed runs, earnings-rate table (Ordinary Hours / Directors / Bonus / Phone Allowance with earningsType). On gateways with `includePayItems`: per-rate `isExemptFromSuper`/`isReportableAsW1`/`accruesLeave` flags reviewed; otherwise an explicit "Not checked" line for pay-item flags |
| 3 | "No GL checks" | Three reconciliation legs reported with numbers: wages expense vs $321,137 gross (FY25/26 POSTED), PAYG liability vs $80,976 (W1/W2 stated for IAS tie-in), super expense/payable vs $54,665 — with the as-at-latest-sync caveat |
| 4 | "SG rate is wrong" | Report states 12.0% as the FY25/26 statutory minimum (from 1 July 2025); the three active employees at 12.0% are CLEAN, not warned; no "rates increase 1 July 2026" language anywhere |
| 5 | "Terminated employees flagged" | No leave-balance findings for the 17 prior-FY-terminated employees (Beggan, Hair, McKinnon, Wootton, …); active employees' high AL balances (Cassandra/Stephen >1,200 hrs) still flagged |
| 6 | "Draft pay runs not flagged" | Pay-run census section flags: duplicate 15–28 Jun runs (probable draft), future-dated POSTED runs (15 Jun, 29 Jun ×2 — vs run date), $0 pay run 15–28 Dec; states the Xero-drafts-may-show-POSTED and MYOB-no-drafts caveats |
| — | Honesty | "Not checked — verify in the ledger" section lists STP2 category mapping (always) plus any STP2 field the ledger returned null and anything an older gateway doesn't expose; no check claimed that didn't run. On newer gateways the STP section must show per-employee incomeType / countryOfResidence / isSTP2Qualified / `tfnSupplied`/residency/threshold/study-loan findings |
| — | Payroll XBerts | Report contains an "Uncompleted payroll XBerts" section sourced from `Data_XBertNotificationSummary` (XBert alerts only — user tasks excluded; outstanding only): every payroll-relevant uncompleted XBert is referenced; findings XBert already detected cite the existing XBert (title/status/risk); ones the review did not reproduce are still listed |

Repeat the run twice (fresh chats) — tool-choice behaviour must be stable.

## Layer 3 — deploy-state preconditions (for full capability)

1. **Plugin publish**: commit + push xbert-plugins main; Claude auto-updates installed plugins
   on version bump (0.1.2 → 0.1.3).
2. **Prod MCP deploy of app-processing PR #1712** lights up `Validation_SuperReconciliation` /
   `Validation_PayrollReconciliation` (skill auto-prefers them). Deploy order: xbert-data
   `v_super_guarantee_rate` view FIRST (already applied to prod XBertW 10 Jun 2026), then MCP.
3. **MCP/sync defects — FIXED IN CODE 10 Jun 2026 (uncommitted, pending deploy).** The skill's
   fault guard and disclosure rules cover gateways running older builds:
   - FIXED: flat-PayRun deserialisation — `GetFabricData<PayRun>` (McpPluginBase) now fetches
     the nested A9027 `EmployeePay` wire and flattens `PayRuns[]`; the four Validation tools
     (`Payroll`/`Super`/`BAS`/`VATReconciliation`) count pay runs as distinct payrun dates and
     `Validation_SuperReconciliation.payRunBreakdown` groups per date.
   - FIXED: stale/ghost pay runs (the Booloumba duplicate "POSTED" pair) — fabric sync now
     re-verifies *volatile* pay runs each pass (`SQLManager.GetVolatilePayrollUIDs`: drafts +
     anything paid within the last 14 days or in the future) so runs deleted at source get
     marked DELETED via the missing-records path (Xero + QuickBooks managers).
   - FIXED: pay-item catalogue — `Data_PayrollSettings includePayItems=true` returns earnings
     rates with `isExemptFromSuper`/`isExemptFromTax`/`isReportableAsW1`/`accruesLeave`,
     deduction types with `reducesTax`/`reducesSuper`/`isExemptFromW1`, and leave types.
   - FIXED: MYOB ghost pay runs — MYOB pay runs are synthesised from `EmployeePayrollAdvice`
     rows, so a pay deleted (or re-dated) in MYOB vanished from the fetch and its warehouse row
     ghosted as POSTED forever. `MYOBManager.PayrollPayRunsAsync` now reconciles the fetched
     payment-date window against the warehouse and marks absent runs DELETED.
   - NOT A DEFECT (documented limitation): MYOB's hardcoded POSTED status is semantically
     correct — the AccountRight v2 API has no pay-run entity and no draft state; pay advices
     only exist for recorded pays. Draft detection is structurally impossible on MYOB; the
     skill discloses this.
   - PARTIALLY CLOSED (parallel session, 10 Jun): `Data_Employees_Get` now returns
     `taxInformation` (tfnSupplied/tfnExemptionType from the tax-declaration table — raw TFN
     never selected — plus residency, tax-free threshold, study-loan and leave-loading flags),
     `employmentType`, `annualSalary`, `hourlyRate`; `Data_Payslips_Summary byDeductionType`
     now returns data; `Data_Payroll_DerivedFields` is POSTED-only; `Data_StpFinalEvent`
     grossEarnings reconciles exactly to `Data_PayRuns_Summary` totalWages.
   - CLOSED (this session, 10 Jun): `Data_Employees_Get` now also returns `incomeType`
     (STP2 income type — pre-existing column), `isSTP2Qualified`, `countryOfResidence`,
     `classification`, `jobTitle`, `employeeGroupName`, `terminationReason` (A9025 columns).
     DEPLOY ORDER: the A9025 ALTER (Sql-Scripts/20260610_1200) must run on the target
     warehouse BEFORE this MCP build — Data_Employees_Search/Get SELECT the new columns.
     STILL OPEN: STP2 **category mapping** has no data source — permanently a
     verify-in-ledger item until the sync captures it.
