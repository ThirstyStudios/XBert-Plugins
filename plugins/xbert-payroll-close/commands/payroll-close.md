---
description: Pre-run sanity check and post-run reconciliation for the current pay cycle, including STP Phase 2 hygiene and bank-out reconciliation.
---

You are running the Payroll Close workflow for a bookkeeping practice.

Steps:
1. Confirm scope: (a) client tenant, (b) the pay period (week ending date), (c) whether this is a **pre-run** check (before posting) or **post-run** check (after posting, before bank file uploads). If unclear, ask.
2. Pull from XBert via the connected MCP:
   - Pay-run summary for the period (try `Data_PayRuns_Summary` and `Data_PayRuns_Get` or `tools_search` if names differ)
   - Payslip detail for the current pay (try `Data_Payslips_Summary`)
   - Active employees with their settings (try `Data_Employees_Summary`)
   - Leave applications hitting this period (try `Data_LeaveApplications_Summary`)
   - Payroll configuration including super rates and STP setup (try `Data_PayrollSettings`)
   - Bank reconciliation status of the payroll clearing account (try `Validation_BankReconciliation` for the bank-out check)
   - Prior pay-run totals for variance comparison (re-use `Data_PayRuns_Summary` with date range covering the previous 1-3 pays)
3. Analyse using the `payroll-close` skill methodology:
   - **Pre-run path**: new-starter check, termination check, leave-hit check, super-rate drift, STP P2 hygiene, address changes, hours-vs-expected check
   - **Post-run path**: net-pay variance vs prior pay (banded), PAYG and super variance, STP submission status, ABA/bank-file total vs sum(net pay) reconciliation
4. Present results as a structured report in chat with three buckets:
   - **Blockers** (must fix before posting / before bank upload) — named employees, named amounts
   - **Warnings** (should review but not blocking) — flagged with context
   - **Clean** (counted only, not enumerated)
5. Offer next actions per blocker (e.g. "open Xero employee record for J Smith to approve the leave application"); never auto-apply or post the pay run.

Use the `payroll-close` skill for the methodology, variance thresholds, and STP Phase 2 hygiene rules. Never post the pay run or upload the bank file — those steps stay in the bookkeeper's hands.
