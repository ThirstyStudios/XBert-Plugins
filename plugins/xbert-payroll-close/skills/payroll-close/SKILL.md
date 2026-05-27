---
name: payroll-close
description: "Run pre-run sanity checks and post-run reconciliation for a weekly pay cycle, including STP Phase 2 hygiene and bank-out reconciliation against net pays. Use this skill when the user is about to post a pay run, has just posted a pay run and needs to check it, or runs the /payroll-close slash command. Also triggers on: 'checking the pay before I post', 'reconcile the payroll', 'is the bank file right', 'STP compliance check', 'why did super go up this week'."
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Payroll Close

## Goal
Catch the cheap-to-fix errors before the pay run posts (pre-run) and before the bank file uploads (post-run). Payroll mistakes compound and surface late — usually via the employee — so the win is moving the check forward in time, not making it more sophisticated.

## Metrics
- **Net-pay variance** — current vs prior pay net pay per employee.
- **Super-rate compliance** — actual super % vs statutory minimum and vs employee-configured rate.
- **STP Phase 2 completeness** — income type, country code, tax treatment, category map present on every employee.
- **Bank-out reconciliation** — sum of payslip net pays = bank/ABA file total.
- **Leave-hit accuracy** — leave applications inside the pay period are approved and reflected in hours.

## Default thresholds (practice-configurable)
| Band | Threshold |
|---|---|
| Net-pay variance — investigate | >= 10% vs prior pay (per employee) |
| Net-pay variance — block | >= 25% vs prior pay (per employee) OR new employee with no prior |
| Super rate drift | actual super % differs from configured rate by >= 0.1pp |
| PAYG variance | >= 15% vs prior pay total |
| Bank-out mismatch | any difference > $0.01 between bank file total and sum(net pay) |
| New-starter cutoff | started in current pay period but no payslip generated = blocker |
| STP P2 missing fields | any required P2 field blank = blocker |
| Leave application unapproved | application hits pay period but status != approved = warning |

## Process / rules

### Pre-run (before posting the pay)
1. **New starters** — every employee with start date inside the pay period must have a payslip queued. If not: blocker.
2. **Terminations** — every employee with termination date in the pay period must have final pay calculated (unpaid leave loading, ETP, etc.). If not: blocker.
3. **Leave hits** — every leave application overlapping the pay period must be approved AND reflected in the payslip hours. Unapproved = warning; approved-but-not-reflected = blocker.
4. **Super rates** — for each employee, compare configured super % against the actual calculated %. Drift >= 0.1pp indicates a category or setting change wasn't picked up — flag.
5. **STP Phase 2 hygiene** — every active employee must have income type, country code, tax treatment, and category mapping populated. Missing any = blocker.
6. **Address changes** — employees with address changes since last pay get flagged (P2 implications).
7. **Hours vs expected** — for salaried staff, hours should equal standard hours. For wage staff, surface timesheet vs expected variance if data available.

### Post-run (after posting, before bank file upload)
1. **Net-pay variance** — compare per-employee net pay against prior pay. Apply banded thresholds. Any "block" band item halts the bank file recommendation.
2. **PAYG and super variance** — compare totals against prior pay. Investigate any movement > 15%.
3. **Bank-out reconciliation** — sum(payslip net pay) must equal the bank/ABA file total to the cent. Any mismatch is a blocker.
4. **STP submission status** — confirm the STP P2 event lodged successfully (if the ledger has filed it by the time of check).

## Always
- Never post the pay run; never upload the bank file — both stay in the bookkeeper's hands
- Always distinguish blockers (must fix) from warnings (should review) from clean (counted only)
- Always name the employee, the amount, and the suggested action in the ledger
- Always reconcile bank-out to the cent — payroll bank mismatches are the single highest-pain error
- Note when prior-pay data is sparse (new client, first pay run) — variance checks fall back to "warning only"
- STP Phase 2 has been mandatory since 1 January 2022 — treat missing P2 fields as blockers, not warnings
- Australian English in all output (organisation, optimise, behaviour)
