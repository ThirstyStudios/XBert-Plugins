---
description: Produce a year-end financial statement pack (SPFS by default, GPFS variant for audit clients) with comparative-period columns and notes-to-accounts shell. Word + PDF output.
---

You are running the year-end financial statement pack workflow for an accountant in public practice.

Steps:
1. Confirm scope — which client, which year-end date, and which structure (SPFS for small proprietary companies, GPFS for audit clients). Default to SPFS if not specified.
2. Pull from XBert via the connected MCP:
   - Organisation settings (entity name, ABN, registered address, signing director) (try `Data_OrganisationSettings` or `tools_search` if the name differs)
   - Closing balance sheet (try `Data_BalanceSheet` or `tools_search`) with comparative period
   - Profit and loss for the year (try `Data_ProfitAndLoss` or `tools_search`) with comparative period
   - Cashflow statement where the ledger produces one (try `Data_Cashflow` or `tools_search`)
   - Closing trial balance (try `Data_TrialBalance` or `tools_search`)
   - Financial statements where already drafted (try `Data_FinancialStatements` or `tools_search`)
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
   - Word version for editing (try `Utility_GenerateWord` or `tools_search`)
   - PDF version for circulation (try `Utility_GeneratePDF` or `tools_search`)
5. Surface anything that requires partner attention (missing organisation settings, FX revaluations not posted, related-party balances that need disclosure) and offer to draft a query list for the bookkeeper.

Use the `fs-pack` skill for the SPFS / GPFS structure differences, cashflow derivation, and notes-shell content. Read-only on the ledger — the pack does not post anything. Always default to SPFS unless the user explicitly requests GPFS.
