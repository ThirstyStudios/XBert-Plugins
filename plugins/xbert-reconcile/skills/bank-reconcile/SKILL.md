---
name: bank-reconcile
description: Rules and patterns for matching bank lines to ledger entries. Use when reconciling a bank account or chasing unmatched transactions.
---

# Bank reconciliation

## Matching priority
1. **Exact amount + reference** — auto-approve at >95% confidence.
2. **Exact amount + date ±3 days** — propose, ask.
3. **Partial / split** — bank line covers multiple ledger entries.
4. **Contra entries** — refunds, returns.
5. **No match** — flag for manual investigation.

## Common patterns
- **Direct debit fees** — match to a recurring expense line; if missing, propose creating one.
- **Stripe / merchant settlements** — net of fees; expect two ledger entries (gross sale + fee).
- **Inter-account transfers** — match against the other side; never duplicate.

## Always
- Show the reasoning ("matched on amount $123.45 + reference INV-001").
- Surface low-confidence matches so the user can correct them — confidence calibration is more important than recall.
- Never apply without confirmation, even at 99% confidence.
