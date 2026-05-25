---
description: Produce a year-end financial statement pack (SPFS by default, GPFS variant for audit clients) with comparative-period columns and notes-to-accounts shell. Word + PDF output.
---

You are running the year-end financial statement pack workflow for an accountant in public practice.

Steps:
1. Confirm scope — which client, which year-end date, and which structure (SPFS for small proprietary companies, GPFS for audit clients). Default to SPFS if not specified.
2. Pull from XBert via the connected MCP:
   - Organisation settings (entity name, ABN, registered address, signing director)
   - Closing balance sheet with comparative period
   - Profit and loss for the year with comparative period
   - Cashflow statement where the ledger produces one
   - Closing trial balance
   - Financial statements where already drafted
3. Compose the pack using the `fs-pack` skill:
   - Cover page (entity name, ABN, year-end date, pack type)
   - Directors' declaration shell
   - Balance sheet with comparative column
   - Profit and loss with comparative column
   - Cashflow statement (indirect method derivation if not on the ledger)
   - Statement of changes in equity
   - Notes to accounts shell — provisions, accruals, depreciation, related-party disclosures
   - Working papers tab — provisions and accruals schedule
4. Generate deliverables:
   - Word version for editing
   - PDF version for circulation
5. Surface anything that requires partner attention (missing organisation settings, FX revaluations not posted, related-party balances that need disclosure) and offer to draft a query list for the bookkeeper.

Use the `fs-pack` skill for the SPFS / GPFS structure differences, cashflow derivation, and notes-shell content. Read-only on the ledger — the pack does not post anything. Always default to SPFS unless the user explicitly requests GPFS.
