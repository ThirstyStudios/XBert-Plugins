---
name: au-compliance-calendar
description: Manage the Australian compliance calendar across a practice — BAS, IAS, GST, super guarantee, FBT, STP finalisation, TPAR — with pre-lodgement validation and post-lodgement lock-date enforcement. Use when the user asks about BAS due dates, super deadlines, FBT, STP year-end, TPAR, contractor reporting, compliance calendar, ATO lodgements, or runs the /au-compliance-calendar slash command. Also triggers on "what's due next week", "ready the BAS", "lock the quarter", "finalise STP", "TPAR list".
---

# AU Compliance Calendar

## Goal
Give the practice one ranked view of every Australian lodgement across every client, gate lodgement on pre-lodgement reconciliations, and set the lock date once accepted by the ATO.

## Metrics
- **Deadline coverage** — % of clients whose next lodgement deadline is known and badged with status
- **Validation pass rate** — % of upcoming lodgements where every relevant reconciliation passes before the deadline
- **Lock-date adoption** — % of accepted lodgements that have a lock date set within 5 business days

## Default thresholds (practice-configurable)
| Threshold | Value | Used in |
|-----------|-------|---------|
| Imminent deadline | 7 days | Deadline sweep |
| Upcoming deadline | 30 days | Deadline sweep |
| Super shortfall flag | $1 | SG validation |
| GST coding variance | $50 per code | BAS validation |
| Payroll PAYG variance | $20 | Payroll validation |
| Lock-date set window | 5 business days after acceptance | Lock-date enforcement |
| TPAR contractor floor | $0 (reports all eligible) | TPAR sweep |

## Lodgement sub-flows (v1)

### BAS / IAS / GST
- Conservative monthly / quarterly due dates: 21st (monthly), 28th (quarterly without tax-agent extension)
- Tax-agent concession: add the published extension when the client qualifies — surface the concession dropdown rather than assuming
- Pre-lodgement: `Validation_BASReconciliation` + `Validation_VATReconciliation` both must pass
- Post-lodgement: set lock date at the BAS period end via `Workflow_SetLockDate`

### Super guarantee (SG)
- Quarterly due dates: 28 Oct, 28 Jan, 28 Apr, 28 Jul
- Pre-lodgement: `Validation_SuperReconciliation` — flag any employee with a shortfall ≥$1
- Note: SG paid late triggers SGC — surface this risk explicitly, don't silently include in "lodged" badge

### FBT
- Annual due date: 21 May (lodgement & payment) / 25 Jun (tax-agent extended for elec lodgement)
- Pre-lodgement: `Validation_PayrollReconciliation` — focus on motor-vehicle, entertainment, expense-payment categories

### STP finalisation
- Annual due date: 14 Jul
- Pre-lodgement: `Validation_PayrollReconciliation` over the full financial year
- Reconcile YTD gross/PAYG/super to the GL before any "finalise" action

### TPAR
- Annual due date: 28 Aug
- Pull contractor activity, validate ABN + GST registration via `Tax_CheckRegistration`
- Flag any contractor missing an ABN

### State payroll tax
- **Deferred to v2** — requires per-state threshold data. Do not assume a client has a state payroll-tax obligation in v1; surface as "not assessed".

## Status badges
- **Not lodged** — period closed but no draft / submission recorded
- **Drafted** — lodgement document prepared, not yet submitted
- **Submitted** — sent to ATO, awaiting acceptance
- **Accepted** — ATO acknowledgement received; ready for lock date
- **Locked** — period locked, no further transactions can be posted

## Process / rules
1. Always read the registration status per client before assuming a lodgement obligation
2. Always run the pre-lodgement validation BEFORE drafting any lodgement document
3. Concession-aware: prefer the tax-agent program deadline if the client qualifies, otherwise the public deadline
4. Lock date is set per client per period only on explicit user approval
5. If a validation fails, surface every failing item (named) — never aggregate a failure as "BAS not ready"

## Always
- Never lodge anything on behalf of the user — the plugin drafts and validates only
- Never set a lock date without explicit per-client user approval
- Never assume a state payroll-tax obligation in v1
- Surface concession eligibility rather than silently applying the extended date
- Flag SGC risk explicitly when super is paid after the SG deadline
- If a lodgement type is unfamiliar (FBT for a sole-trader, TPAR for a non-building client), confirm scope before pulling data
