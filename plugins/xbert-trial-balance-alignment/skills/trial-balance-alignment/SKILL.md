---
name: trial-balance-alignment
description: Reconcile a client's trial balance against the accountant's signed financial statements using a four-case matching engine. Use when the user asks to align the trial balance, reconcile TB to FS, walk the year-end signed accounts back into the ledger, or post the year-end journals from the accountant's pack. Also triggers on "the accountant sent back the signed accounts", "TB doesn't match the FS", "year-end alignment", or any /trial-balance-alignment invocation.
---

# Trial Balance Alignment

## Goal
Reconcile every account on the ledger trial balance against the accountant's signed-off financial statements, classify each line into one of four matching cases, and produce a journal-ready Excel workbook plus Word audit document. Never silently drop an account.

## Metrics
- **Balance integrity** — workbook total debits = total credits AND ledger TB total = FS TB total (within materiality)
- **Match coverage** — percentage of accounts placed into Case A or B (one-to-one or consolidated)
- **Variance hours** — sum of unmatched amounts (absolute) by case

## Default thresholds (practice-configurable)
| Threshold | Value | Used in |
|-----------|-------|---------|
| Rounding tolerance | $1 per line | Case A, Case B |
| Materiality (per line) | $50 or 0.1% of FS total — whichever is greater | Variance flag |
| Materiality (total) | $100 or 0.05% of FS total | Hard-fail gate |
| Name fuzzy-match floor | 0.85 cosine similarity | Case A heuristic |
| PDF extraction confidence floor | 0.90 per cell | Re-extract trigger |

## Process / rules

### v1 scope
- **Ledger source**: Xero trial balance export pulled via the XBert MCP
- **FS source**: signed financial statements PDF supplied by the user; extracted via the XBert MCP text-extraction tool
- **MYOB / QuickBooks Online / FreeAgent**: deferred to v2

### Four-case matching engine
Apply in this order — first match wins:

1. **Case A — one-to-one exact**
   - Account name matches (fuzzy ≥0.85) AND balance matches within rounding tolerance
   - No action required; record as aligned
2. **Case B — consolidated**
   - One FS line whose balance equals the sum of N ledger accounts within tolerance
   - Or one ledger account whose balance equals the sum of N FS lines (rare; usually points to a sub-account reorg)
   - Action: propose either a renumbering / reparenting journal OR document the FS-side consolidation rule
3. **Case C — unmatched on TB**
   - FS line has no ledger counterpart
   - Typically: year-end accrual, provision, depreciation, manual journal the accountant added
   - Action: propose the missing journal with debit/credit split derived from the FS line
4. **Case D — unmatched on FS**
   - Ledger account does not appear in the FS at all
   - Typically: account was renamed, rolled into a parent, or zeroed by the accountant
   - Action: query the accountant OR propose a closing journal to zero the ledger account

### Audit-trail rules
- Variances are **directional** — record debit variance and credit variance separately, never net them
- Every Case C and Case D row in the workbook carries a confidence label: **Direct** (data unambiguous), **Likely** (one judgment call), **Needs review** (context the data doesn't carry)
- The workbook fails the balance check if total debits ≠ total credits OR if the matched + unmatched totals do not reconcile to both source totals — abort and tell the user before producing the Word document

### PDF extraction uncertainty
- If text extraction returns any cell below the confidence floor, surface that cell to the user before running matching
- Do not fall back to "best guess" silently — the audit trail must reflect the source

## Always
- Never auto-post a journal — every adjustment is proposed for the user to approve and post manually
- Never silently drop an account — every TB row and every FS row must end up in one of the four cases
- Variances are directional (debit ≠ credit at the line level)
- Flag PDF extraction uncertainty before running matching, not after
- v1 supports Xero exports + PDF FS only — refuse cleanly if the source ledger is MYOB/QBO/FreeAgent and direct the user to wait for v2
