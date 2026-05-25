---
name: balance-sheet-explain
description: Walk a client's balance sheet opening-to-closing with movement narrative, reconciliation status per account, manual journal trace, and fixed-asset-register-to-GL accumulated depreciation check. Use when the user asks to review the balance sheet, explain BS movements, prep for year-end or audit, walk the BS, or runs the /balance-sheet-explain slash command. Also triggers on "what moved on the balance sheet", "is the BS clean", "FAR doesn't match the GL", "explain the equity movement".
---

# Balance Sheet Explain

## Goal
Walk every line of the balance sheet from opening to closing, state the reconciliation status of every reconcilable account, trace every material manual journal, and check that the fixed asset register accumulated depreciation agrees with the GL. Produce a Word narrative review.

## Metrics
- **Movement coverage** — % of material movements with a named journal or reconciliation behind them
- **Reconciliation completeness** — count of reconcilable accounts (Cash, AR, AP, FAR) with stated rec status
- **FAR-GL agreement** — absolute variance between FAR accumulated depreciation and GL accumulated depreciation account

## Default thresholds (practice-configurable)
| Threshold | Value | Used in |
|---|---|---|
| Material movement (per account) | $1,000 or 5% of opening — whichever is greater | Section 1, Section 4 |
| Unexplained-mover flag | Material movement with no source journal | Section 4 |
| FAR-GL variance tolerance | $1 | Section 2 |
| Manual journal materiality | $500 | Section 3 |
| Aged AR / AP "overdue" threshold | 60+ days | Section 2 |

## Process / rules

### Section 1 — Opening → closing walk
- One row per balance sheet line item with opening balance, closing balance, $ movement, % movement
- Flag lines exceeding the material-movement threshold for narrative explanation
- Always present comparative period side-by-side — never close-only

### Section 2 — Reconciliation status
For each reconcilable account, state the status from the underlying data:
- **Cash / bank**: result of the bank reconciliation check
- **Aged receivables**: GL receivables total vs aged debtors total
- **Aged payables**: GL payables total vs aged creditors total
- **Fixed asset register vs GL**: FAR accumulated depreciation total vs GL accumulated depreciation account
- Status options: **Reconciled** (within tolerance), **Reconciled with variance** (named variance), **Not reconciled** (named gap), **No FAR present**

### Section 3 — Manual journal trace
- Pull every manual journal in the period above the materiality threshold
- For each: date, narration, accounts touched, $ amount, supporting doc reference if present
- Confidence label per journal: **Direct** (clear narration + supporting doc), **Likely** (clear narration only), **Needs review** (no narration, no doc, unclear purpose)

### Section 4 — Unexpected movers
- Lines that breach the material-movement threshold but cannot be tied to a single source journal or transaction stream
- Flag explicitly — these are the partner-conversation items

### Section 5 — Clean-up recommendations
- Unreconciled accounts with a proposed journal direction
- Aged AR / AP items over 60 days for write-off review
- FAR-GL variance with proposed correcting journal
- Each recommendation labelled **Direct / Likely / Needs review**

## Always
- Read-only review — never post a cleanup journal automatically
- Every observation has a $ figure behind it; no qualitative-only statements
- Confidence labels are mandatory on journal-trace and clean-up sections
- FAR-GL check fails closed — if the FAR isn't accessible, state it explicitly rather than reporting "reconciled"
- The Word document must be circulatable to a partner or auditor without further editing
