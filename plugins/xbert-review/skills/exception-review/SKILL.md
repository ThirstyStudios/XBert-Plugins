---
name: exception-review
description: Methodology and checklist for month-end exception review on an SME ledger. Triggers when the user is reviewing month-end exceptions, anomalies, or unreconciled items.
---

# Month-end exception review

## Goal
Catch material errors and unreconciled items before the month is closed and reports are issued.

## Categories to check
- Unreconciled bank lines older than 7 days
- Suspense / clearing account balances ≠ 0
- GST/VAT inconsistencies (mismatched tax codes, missing codes)
- Duplicate supplier invoices (same supplier, same amount, ±3 days)
- Negative inventory or impossible-quantity entries
- Manual journals posted by non-finance staff
- Large variances vs prior month (configurable threshold, default 20%)

## Process
1. **Triage** — sort by materiality (dollar value × age). Tackle highest first.
2. **Verify** — pull source documents (invoice PDF, bank statement line) before proposing fixes.
3. **Propose, don't apply** — every change is a recommendation. The user approves.
4. **Document** — for every accepted change, note the cause and remediation in the workpaper.

## Workpaper output
Markdown table with: Date | Account | Issue | Action taken | Approved by.
