---
name: payroll-close
description: "Run pre-run sanity checks, post-run reconciliation, or a full-period payroll review across every pay cycle in scope — including draft/duplicate pay-run detection, super guarantee rate compliance, payroll settings review, GL-vs-payroll reconciliation, STP Phase 2 hygiene and bank-out reconciliation. Use this skill when the user is about to post a pay run, has just posted a pay run and needs to check it, asks for a payroll close/review for a month, quarter or financial year, or runs the /payroll-close slash command. Also triggers on: 'checking the pay before I post', 'reconcile the payroll', 'is the bank file right', 'STP compliance check', 'why did super go up this week', 'review the payroll for the year'."
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing. Statutory rates (super guarantee) come from the pinned table in this skill or from tool rate fields — **never from general knowledge**.

# Payroll Close

## Goal
Catch the cheap-to-fix errors before the pay run posts (pre-run), before the bank file uploads (post-run), and across the whole period when closing a month, quarter or financial year (period review). Payroll mistakes compound and surface late — usually via the employee — so the win is moving the check forward in time and covering **every** pay cycle in scope, not just the latest one.

## Review modes — establish the mode before pulling data
1. **Pre-run** — the next unposted cycle, before the pay is posted.
2. **Post-run** — the most recent posted cycle, after posting but before the bank file uploads.
3. **Period review** — **every pay cycle** in a stated range (month, quarter, or financial year). A request for a "payroll close review", FY close, or anything spanning more than one pay date is a period review. In this mode you must enumerate every pay run in the range and review each one — never review only the current cycle and present it as the period. State in the report exactly how many pay runs were reviewed and the date range covered.

## Statutory super guarantee (SG) minimum — pinned table
| Effective from | SG minimum |
|---|---|
| 1 July 2014 | 9.5% |
| 1 July 2021 | 10.0% |
| 1 July 2022 | 10.5% |
| 1 July 2023 | 11.0% |
| 1 July 2024 | 11.5% |
| **1 July 2025** | **12.0% (legislated to remain at 12%)** |

Rules:
- Judge **each pay run at the rate effective on that pay run's payment date**. FY2025/26 pay runs (paid on or after 1 July 2025) are judged at 12.0%. Never report any other figure as the "current" SG minimum and never present a future date for the 12% start — it already applies.
- If `Validation_SuperReconciliation` is available on the gateway, prefer its `superSummary.applicableSGRate` and `payRunBreakdown[].applicableSGRate` fields (strings like `"12.0%"` — parse them). Otherwise compute each run's effective rate as `totalSuper / totalWages` from `Data_PayRuns_Search` rows and compare against the pinned table.
- The effective-rate calculation treats all wages as ordinary time earnings (OTE). Salary sacrifice, bonuses, overtime and non-OTE earnings legitimately push the apparent rate above or below the minimum — investigate before flagging, and say which earnings types explain the gap (use `Data_Payslips_Summary view=byEarningsRate`).
- **Decompose super by contribution type before judging any super finding.** Total super on a payslip or run is the sum of several contribution types, only one of which is the super guarantee. Pull `superLines[].contributionType` (`Data_Payslips_Get`) and separate `SGC` (the super guarantee) from `SALARYSACRIFICE` (employee, pre-tax), `EMPLOYERADDITIONAL` (voluntary employer / RESC) and `MEMBERVOLUNTARY` (employee, post-tax). Judge SG compliance on the **SGC component only**, against the pinned minimum. Salary-sacrifice and employer-additional contributions are discretionary and legitimately large — they are **not** an SG breach and must never be reported as a pay-item misconfiguration on rate grounds. Always state the SGC / sacrifice / employer-additional split in any super finding.
- **Total super exceeding gross pay is not, by itself, a blocker.** Voluntary employer and salary-sacrifice contributions can lawfully push total super above gross wages (common for directors topping up super). Never raise "super exceeds gross", "super rate too high" or an entity-level super-rate anomaly without first decomposing the super lines; flag only if the **SGC** portion is wrong for the wages it is calculated on, or a line genuinely carries no valid contribution type.

## XBert MCP tool playbook
Exact tool names below; discover/load them via the gateway's `tools_search` / `tools_describe` if needed. `userProfileId` is injected by the gateway — do not fabricate it. All dates are strict `yyyy-MM-dd`.

| Need | Tool | Critical behaviour |
|---|---|---|
| Every pay run in range, **any status** | `Data_PayRuns_Search` | `startDate`/`endDate` filter on **payment date** — widen the window ~1 month each side of the period, then keep runs whose `periodEnd` falls in scope. **Omit the `status` parameter** to receive all statuses including `DRAFT`. Paginate via `nextCursor` until exhausted (`pageSize` 100). Rows: `id, periodStart, periodEnd, paymentDate, status, totalWages, totalTax, totalSuper, totalNetPay, employeeCount`. |
| Period aggregates | `Data_PayRuns_Summary` | `view=byPeriod \| byEmployee \| byEmployeeFY \| superTotals \| taxTotals`. **POSTED-only by default** and `status=DRAFT` is rejected — never use this tool for draft detection. |
| Per-run payslip breakdown | `Data_PayRuns_Get` | Up to 25 ids from Search. Returns `payslips[]{employeeName, grossPay, tax, super, netPay}`. |
| Payslip lines / super lines | `Data_Payslips_Get`, `Data_Payslips_Search` | Get returns detail items (with `ratePerUnit` and `numberOfUnits` on newer gateways — usable for hours-vs-expected checks), leave accruals and `superLines[]{contributionType, amount}` (SGC vs employee/salary-sacrifice contributions). No pay-run status on payslip rows. |
| Earnings-rate / deduction usage | `Data_Payslips_Summary` | `view=byEarningsRate` → `{rateName, earningsType, allowanceType, totalAmount, lineCount}`; `view=byDeductionType` (older gateways return this empty — treat empty as "not checkable", not "no deductions"). This is the pay-item usage review surface. |
| Employee census incl. terminations | `Data_Employees_Search` | Rows carry `status` (ACTIVE/TERMINATED) and `terminationDate`. Paginate fully. `status` can be blank on some ledgers — treat `terminationDate != null` as the primary terminated signal. |
| Employee detail | `Data_Employees_Get` | `leaveBalances[]`, `leaveApplications[]` (with status incl. SCHEDULED), `superFunds[]`, `annualSalary`, `hourlyRate`, `employmentType`, bank accounts (masked), and on newer gateways: `taxInformation{tfnSupplied, tfnExemptionType, australianResidentForTaxPurposes, taxFreeThresholdClaimed, hasHELPDebt, hasSFSSDebt, hasTradeSupportLoanDebt, hasLoanOrStudentDebt, eligibleToReceiveLeaveLoading}` (the STP Phase 2 **tax treatment** components — raw TFN never returned, `tfnSupplied` is a presence flag) plus `incomeType` (STP2 income type), `isSTP2Qualified`, `countryOfResidence`, `classification`, `jobTitle`, `employeeGroupName`, `terminationReason`. An absent/null field means the ledger never asserted it — report as unverified, never assume. ≤25 ids. |
| Leave totals (DANGER) | `Data_Employees_Summary view=leaveBalanceTotals`, `Data_PayrollSettings includeLeaveBalances` | These aggregate **stale balances of terminated employees** with no termination join. Never report from them without cross-checking the employee census. |
| Payroll settings | `Data_PayrollSettings` | `payrollAccounts[]{type, code, name}` — the ledger's payroll GL mapping (WAGESEXPENSE, WAGESPAYABLELIABILITY, PAYGLIABILITY, SUPERANNUATIONEXPENSE, SUPERANNUATIONLIABILITY, BANK) — plus `payCalendars[]{name, calendarType, startDate, nextPaymentDate}`. Pass `includePayItems=true` (newer gateways) to also get the pay-item catalogue: `payItems.earningsRates[]{name, earningsType, rateType, accountCode, isExemptFromSuper, isExemptFromTax, isReportableAsW1, accruesLeave, allowanceType, etpType}`, `payItems.deductionTypes[]{name, accountCode, reducesTax, reducesSuper, isExemptFromW1}`, `payItems.leaveTypes[]{name, typeOfUnits, isPaidLeave}`. Flag values of `unknown` mean the ledger did not supply them — do not treat as compliant. |
| Chart of accounts | `Data_OrganisationSettings surface=chartOfAccounts` | Account codes/classifications for GL leg discovery. |
| GL figures | `Data_FinancialStatements` | `statement=profitAndLoss` (wages/super **expense** for the period), `statement=balanceSheet` (liability balances — **as at latest sync, not period end**; say so), `statement=trialBalance`. |
| Payroll journals | `Data_ManualJournals_Search`/`_Get`, `Data_JournalMaster_Search`/`_Get` | Find wages posted outside payroll and confirm liability postings. |
| STP totals | `Data_StpFinalEvent` | FY gross / PAYG / super / allowances / AL-payout-on-termination / termination payments per employee + firm. POSTED-only. `firmTotals.grossEarnings` is on the **same basis** as `Data_PayRuns_Summary` `totalWages` — the two must match exactly; a mismatch is a data fault to report, not to paper over. AL-payout bucketing is heuristic (LUMPSUMA/ETP rate names, plus leave lines paid within −7/+45 days of a termination) — say so when reporting final pays. |
| Bank rec status | `Data_ReconciliationStatus` | Pre-condition for the post-run bank-out leg. |
| Uncompleted payroll XBerts | `Data_XBertNotificationSummary` (primary), `Features_GetWork` (drill-down) | **XBerts = AI-detected alerts, not user-created tasks.** `Data_XBertNotificationSummary` (per `clientTenantId`) returns exactly the right set: outstanding-only (completed excluded) genuine XBerts (user tasks excluded at source), with title, status, risk level/amount, analytics group, due date and top-10 highest-risk items — keep the payroll-related ones (titles/groups mentioning payroll, super/superannuation/SG, wages, PAYG, STP, pay run, leave, payslip). For detail on a specific item use `Features_GetWork` — **trap:** `showOnlyAssignedToUser` defaults to **true**; pass it as false plus `notificationStatusIds="todo,in_progress"` and the `clientTenantId` filter, or you will silently miss unassigned XBerts. `Features_GetWork` returns tasks as well as XBerts — the summary tool is the authoritative XBert list. |
| Dedicated reconciliation (if present) | `Validation_PayrollReconciliation`, `Validation_SuperReconciliation` | **Fault guard:** if these return `payRunCount: 0`, `INCOMPLETE_DATA` or `NO_DATA` while `Data_PayRuns_Summary` shows pay runs in the same range, that is a known tool fault — discard the result and use the assembled checks below. Never tell the user "no payroll data" on that basis. |

## Process / rules

### Step 0 — every mode: census and hygiene
1. **Employee census** — `Data_Employees_Search`, all pages, no status filter. Partition into: *active*; *terminated inside the review period*; *terminated before the review period* (`terminationDate` < period start). **Exclude employees terminated before the review period from every leave, STP, super and variance finding.** Their stale leave balances are a ledger-tidiness note at most — if material, list separately as "data hygiene (not a payroll-close item)", never as a blocker or warning for this period. Employees terminated *within* the period get final-pay checks (unused leave payout, ETP) instead.
2. **Pay run census** — `Data_PayRuns_Search` over the widened range, **no status filter**, paginated. Flag:
   - any run with `status` ≠ POSTED — **draft pay runs in the current FY are a blocker for FY close** and a warning otherwise;
   - **duplicate runs for the same periodStart/periodEnd** on the same calendar — likely a draft or accidental double-posting even if both rows say POSTED (a known sync limitation can show Xero drafts as POSTED);
   - runs already POSTED with a **future payment date**;
   - zero-wage or single-employee anomaly runs;
   - **gaps in cadence** — compare the sequence of period dates against `payCalendars.calendarType`; a missing fortnight/week means an unposted or unsynced run.
   - **DELETED runs — reconcile against the same period before flagging a gap.** A `DELETED` run is only a schedule-gap risk if **no** live (POSTED or DRAFT) run covers the same `periodStart`/`periodEnd` on the same calendar. Always check for a same-period live run: if one exists, the deletion is benign (the run was deleted and re-created) — report it as informational, not as a blocker or gap risk, and review the **live** run instead. Only treat a deletion as a gap if the period has no surviving run.
   - **Always enumerate the adjacent runs.** Even in pre-run and post-run mode (which centre on one cycle), pull and list the runs immediately around it — at least the prior period and any **later already-posted** period. A later fortnight that is already posted, a duplicate, or a deletion-and-repost must surface; never report a single cycle's id without confirming what sits on either side of it.
   - Ledger caveats to disclose when relevant: MYOB AccountRight exposes only **recorded** pays via its API — there is no draft-pay-run object at all, so "no drafts found" is not provable on MYOB and unposted pays are simply invisible until recorded; Xero draft statuses may sync as POSTED on older syncs, which is why the duplicate/future-date checks above are mandatory and not optional.
3. **Uncompleted payroll XBerts** — pull the client's outstanding XBerts via `Data_XBertNotificationSummary` (this returns genuine AI-detected XBert alerts only — user-created tasks are excluded — and only uncompleted ones) and keep the payroll-related items (super, wages, PAYG, STP, pay run, leave, payslip). These are issues XBert has **already detected and that remain unresolved**: every one that is relevant to the review period MUST be referenced in the report. Cross-reference each review finding against them — cite the existing XBert (title, status, risk amount) instead of raising the same issue as new; list uncompleted payroll XBerts the review did not independently reproduce (they may cover checks outside this scope — they still belong in the report); and treat a large pile of outstanding or repeatedly-dismissed payroll XBerts as a finding in its own right.

### Pre-run (before posting the pay)
1. **New starters** — every employee with start date inside the pay period must have a payslip queued. If not: blocker.
2. **Terminations in period** — final pay calculated (unused leave, ETP). If not: blocker.
3. **Leave hits** — every leave application overlapping the pay period (from `Data_Employees_Get leaveApplications[]`) must be approved AND reflected in the payslip. **Confirm against the payslip, do not assume:** pull `Data_Payslips_Get` detail items / leave accruals for that employee and look for a discrete leave line (e.g. `Annual Leave`) matching the application's hours. If the leave line is present and the hours match, the leave is correctly processed — record it as confirmed/clear and do **not** warn to "verify it was processed" or that it may have been "silently absorbed". Flag only when the application is unapproved (warning) or no matching leave line appears / the hours don't match (approved-but-not-reflected = blocker). For a salaried employee whose gross is unchanged, a discrete leave line on the payslip is the correct treatment — confirm it, don't flag it.
4. **Super rates** — per employee, compare the calculated super % on the queued pay against the SG minimum for the payment date and the employee's configured rate. Drift ≥ 0.1pp = flag.
5. **STP Phase 2 hygiene** — for each active employee, check what the data exposes via `Data_Employees_Get` (newer gateways): `incomeType` null/missing = flag for ledger verification, present = report it; `countryOfResidence` likewise; `isSTP2Qualified` false or null = warning; `tfnSupplied` false on an active employee = blocker (no TFN declaration on file, unless `tfnExemptionType` explains it); residency, tax-free threshold, study/training-loan flags and leave loading = the **tax treatment** components — report each as set/not-asserted. STP2 **category mapping** is not exposed by any gateway — always list it under "verify in the ledger". On older gateways without these fields, list all P2 fields as "verify in the ledger".
6. **Address changes** — flag if visible since last pay.
7. **Hours vs expected** — salaried hours = standard hours; wage staff timesheet variance if data available.

### Post-run (after posting, before bank file upload)
1. **Net-pay variance** — per employee vs prior pay (`Data_PayRuns_Get` on the two most recent runs). Banded thresholds; any block-band item halts the bank-file recommendation. When a variance breaches a band, **explain it from the payslip — do not speculate.** Decompose the movement into the actual earnings lines (`Data_Payslips_Summary view=byEarningsRate`, `Data_Payslips_Get` detail items) and name what drove it: identify and label discrete bonuses (e.g. a `Bonus` earnings line), back-pay, new allowances or rate changes explicitly, and state whether each earnings type is OTE for super. Never write "likely a bonus, back-pay or catch-up" when the payslip lines are available to name it.
2. **PAYG and super variance** — totals vs prior pay; investigate movement > 15%. Decompose super movements by contribution type (SGC vs salary sacrifice vs employer-additional) — a jump driven by employer-additional or salary-sacrifice contributions is not an SG issue and is not a blocker.
3. **Bank-out reconciliation** — sum(payslip net pay) must equal the bank/ABA file total to the cent. Pre-condition: payroll clearing account bank rec current (`Data_ReconciliationStatus`) — surface unreconciled lines and pause if not.
4. **STP submission** — confirm lodgement if the ledger has filed by check time.

### Period review (every pay cycle in range)
1. **Per-cycle sweep** — for every pay run from the census: run-over-run net pay, PAYG and super variance; effective SG rate (`totalSuper/totalWages`) vs the pinned table **at that run's payment date**; explain spikes (super catch-up payments, bonuses, back-pay) rather than just flagging them.
2. **Payroll settings review** —
   - `Data_PayrollSettings` with `includePayItems=true`: all six payroll GL account roles mapped; pay calendars match the observed cadence; review every earnings rate's flags — `isExemptFromSuper` (the SG/OTE categorisation: an OTE-type rate marked exempt from super, or an allowance attracting super unexpectedly, is a warning), `isReportableAsW1` (activity statement gross payments), `accruesLeave`; deduction types' `reducesTax`/`reducesSuper`/`isExemptFromW1`. A flag of `unknown` means the ledger did not supply it — list it for manual verification, never assume compliant.
   - `Data_Payslips_Summary view=byEarningsRate` over the period: each pay item actually used has a sensible `earningsType` (ordinary time vs overtime vs bonus vs allowance with `allowanceType` set); `view=byDeductionType` for deductions; spot-check `superLines[].contributionType` on sample payslips (SGC vs salary sacrifice).
   - **Disclosure (mandatory):** if `includePayItems` is not accepted by this gateway (older deploy), pay-item configuration flags are not visible — list them under "Not checked — verify in the ledger". STP Phase 2 fields are checkable per employee via `Data_Employees_Get` on newer gateways (income type, country of residence, STP2-qualified flag, TFN supplied, residency, tax-free threshold, study-loan flags) — null values mean the ledger never asserted them and go to the verify-in-ledger list; STP2 **category mapping** is not exposed on any gateway — always list it for ledger verification. Never imply a check ran that did not.
3. **GL vs payroll reconciliation** (three legs, assembled from warehouse tools; also run the `Validation_*` tools when available, subject to the fault guard):
   - **Wages expense leg** — `Data_FinancialStatements statement=profitAndLoss` for the period: total of the wages/salaries expense account(s) (codes from `payrollAccounts` / chart of accounts) vs `Data_PayRuns_Summary totalWages`. Material variance → wages posted outside payroll (`Data_ManualJournals_Search`) or out-of-period postings.
   - **PAYG leg** — PAYG withholding liability account movement vs `totalTax`. Report the period's W1 (gross wages) and W2 (PAYG withheld) from payroll and whether the GL agrees — this is the tie-in to the IAS/BAS review.
   - **Super leg** — super expense vs super accrued (`totalSuper`); super payable balance vs unpaid super for the period.
   - **Caveat to state:** balance-sheet balances are as at the latest ledger sync, not as at period end. Use the trial balance and journals when an exact cut-off matters.
4. **STP totals** — `Data_StpFinalEvent` FY figures vs payroll totals: `firmTotals.grossEarnings` must equal `Data_PayRuns_Summary` `totalWages` for the same range (same POSTED-only basis — a mismatch is a data fault to surface). For employees terminated in the period, report the AL-payout-on-termination and termination-payment buckets, noting the bucketing is heuristic. Per-employee STP tax-treatment flags come from the employee census (`taxInformation`).
5. **Leave positions** — for **active** employees only: negative balances (advances needing written approval) and excessive accruals (e.g. > 400 hours annual leave = material liability — recommend a draw-down plan).

## Default thresholds (practice-configurable)
| Band | Threshold |
|---|---|
| Statutory SG minimum | 12.0% (from 1 July 2025 — judge each pay run at its own payment date per the pinned table) |
| Net-pay variance — investigate | >= 10% vs prior pay (per employee) |
| Net-pay variance — block | >= 25% vs prior pay (per employee) OR new employee with no prior |
| Super rate drift | **SGC component only** (decompose `superLines` first — exclude salary sacrifice & employer-additional) differs from the applicable SG minimum or the employee's configured rate by >= 0.1pp |
| Total super > gross pay | NOT a blocker on its own — decompose `superLines`; flag only if the SGC component is wrong |
| PAYG variance | >= 15% vs prior pay total |
| Bank-out mismatch | any difference > $0.01 between bank file total and sum(net pay) |
| Draft pay run in current FY | blocker for FY close; warning otherwise |
| Duplicate pay run for same period | warning — verify in the ledger which is real |
| New-starter cutoff | started in current pay period but no payslip generated = blocker |
| GL vs payroll variance (any leg) | > $1 investigate; unexplained > $500 = warning |
| Leave application unapproved | application hits pay period but status != approved = warning |
| Excessive annual leave accrual | > 400 hours (active employees) = recommend draw-down plan |

## Always
- Never post the pay run; never upload the bank file — both stay in the bookkeeper's hands
- Always distinguish blockers (must fix) from warnings (should review) from clean (counted only)
- Always name the employee, the amount, and the suggested action in the ledger
- Always reconcile bank-out to the cent — payroll bank mismatches are the single highest-pain error. In **post-run** mode the report MUST contain a dedicated **Bank-Out Reconciliation** section: sum(employee net pay) vs the ABA/bank-file total, plus the payroll clearing-account rec status (`Data_ReconciliationStatus`). If the ABA file total or rec status is not available on the connected data, say so explicitly under that heading — never silently omit the section
- Always include a **Next Pay Run** section: the next payment date (`payCalendars.nextPaymentDate`), the upcoming or draft run if one exists, and anything already known to hit it (new starters, terminations on notice, scheduled leave) — this is the forward-looking close-out the bookkeeper needs
- State the coverage honestly: how many pay runs were reviewed, the date range, and which statuses. Claim "every pay cycle" only after enumerating the full range with `Data_PayRuns_Search`
- Include a **"Not checked — verify in the ledger"** section whenever a check could not run on available data (STP2 category mapping, any STP2 field the ledger returned as null, ABA file contents, anything an older gateway does not expose). Never report a check as done that did not run
- Exclude employees terminated before the review period from all findings; never raise their stale leave balances as current payroll issues
- Source SG rates only from the pinned table or tool rate fields — never from general knowledge
- Note when prior-pay data is sparse (new client, first pay run) — variance checks fall back to "warning only"
- STP Phase 2 has been mandatory since 1 January 2022 — treat missing P2 fields as blockers once verifiable; until then they are "verify in ledger" items
- Australian English in all output (organisation, optimise, behaviour)
