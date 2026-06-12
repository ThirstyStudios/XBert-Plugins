---
description: Pre-run sanity check, post-run reconciliation, or a full-period payroll review across every pay cycle in scope — including draft pay-run detection, SG rate compliance and GL-vs-payroll reconciliation.
---

**Prerequisite (post-run path):** the bank reconciliation of the payroll clearing account must be current to the bank-payment date before the post-run reconciliation can complete. Surface any unreconciled bank lines and pause the close until cleared.

You are running the Payroll Close workflow for a bookkeeping practice.

Steps:
1. Confirm scope: (a) client tenant, (b) the review **mode** — **pre-run** (before posting), **post-run** (after posting, before the bank file uploads), or **period review** (every pay cycle in a month, quarter or financial year), and (c) the period. A "payroll close review" or anything spanning more than one pay date is a **period review** — review every pay run in the range, never just the current cycle. If unclear, ask.
2. Pull from XBert via the connected MCP (exact tool names and traps are in the `payroll-close` skill playbook):
   - **Employee census first** — all employees with status and termination dates (`Data_Employees_Search`, paginated). Build the terminated-before-period exclusion set before any other check.
   - **Pay run census** — every pay run in the (widened) range with **no status filter** (`Data_PayRuns_Search`, paginated), so drafts, duplicates, future-dated and missing runs are visible.
   - Pay-run aggregates and per-employee rollups (`Data_PayRuns_Summary`), payslip detail for the cycles under review (`Data_PayRuns_Get` / `Data_Payslips_Get`)
   - Payroll settings: GL account mapping and pay calendars (`Data_PayrollSettings`); earnings-rate and deduction usage (`Data_Payslips_Summary view=byEarningsRate` / `byDeductionType`)
   - Leave applications, balances, and STP tax-treatment flags (`taxInformation` — TFN supplied, residency, tax-free threshold, study-loan flags) for **active** employees (`Data_Employees_Get`)
   - GL figures for the reconciliation legs (`Data_FinancialStatements`, `Data_ManualJournals_Search`), and `Validation_PayrollReconciliation` / `Validation_SuperReconciliation` when available (subject to the skill's fault guard)
   - Bank reconciliation status of the payroll clearing account (`Data_ReconciliationStatus`)
   - STP totals for FY-level reviews (`Data_StpFinalEvent`)
   - **The client's uncompleted payroll XBerts** (`Data_XBertNotificationSummary` — genuine XBert alerts only, not user tasks; outstanding only) — every payroll-relevant one must be referenced in the review; cite existing XBerts rather than re-raising, and use `Features_GetWork` (with `showOnlyAssignedToUser=false`) only for per-item drill-down
3. Analyse using the `payroll-close` skill methodology:
   - **Every mode**: pay-run census checks (drafts, duplicate periods, future-dated POSTED runs, cadence gaps), same-period reconciliation for any DELETED run (a deletion with a surviving same-period run is benign, not a gap), the terminated-employee exclusion, and **decomposition of super by contribution type (SGC vs salary-sacrifice vs employer-additional) before any super finding** — voluntary/employer-additional and salary-sacrifice super are not SG breaches, and super exceeding gross is not a blocker. When a variance breaches a band, name the earnings/contribution lines that explain it (e.g. a discrete bonus) rather than speculating
   - **Pre-run path**: new-starter check, termination-in-period final pay, leave-hit check, super-rate drift, address changes, hours-vs-expected
   - **Post-run path**: net-pay variance vs prior pay (banded), PAYG and super variance, STP submission status, ABA/bank-file total vs sum(net pay) reconciliation
   - **Period-review path**: per-cycle variance sweep across every pay run, per-run SG rate vs the skill's pinned statutory table (judged at each run's payment date), payroll settings review, three-leg GL-vs-payroll reconciliation (wages expense, PAYG/W1-W2, super), leave positions for active employees
4. Present results as a structured report in chat:
   - **Coverage statement** — how many pay runs were reviewed, the date range, and statuses found
   - **Uncompleted payroll XBerts** — outstanding XBert alerts cross-referenced: which findings XBert had already detected (cite the XBert with title, status and risk amount), and which uncompleted payroll XBerts the review did not reproduce — all payroll-relevant uncompleted XBerts appear in the report
   - **Blockers** (must fix before posting / bank upload / FY close) — named employees, named amounts
   - **Warnings** (should review but not blocking) — flagged with context
   - **Clean** (counted only, not enumerated)
   - **Bank-out reconciliation** (post-run — **mandatory**) — sum(net pay) vs the ABA/bank-file total to the cent, plus the clearing-account rec status; if the ABA total is not available, state that explicitly rather than omitting the section
   - **Next pay run** — the next payment date, any upcoming/draft run, and known new starters, terminations on notice or scheduled leave that will hit it
   - **Not checked — verify in the ledger** — every check that could not run on available data (e.g. STP Phase 2 field-level config, pay-item super exemption flags), stated explicitly
5. Offer next actions per blocker (e.g. "open Xero employee record for J Smith to approve the leave application"); never auto-apply or post the pay run.

Use the `payroll-close` skill for the methodology, tool playbook, variance thresholds, the pinned SG rate table, and STP Phase 2 hygiene rules. Never post the pay run or upload the bank file — those steps stay in the bookkeeper's hands. Never state a super guarantee rate from memory.
