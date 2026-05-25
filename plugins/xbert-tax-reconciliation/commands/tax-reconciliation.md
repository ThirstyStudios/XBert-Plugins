---
description: Walk from accounting profit to taxable income for a year-end tax reconciliation worksheet — per entity type, every adjustment tied to its source, Excel + PDF working papers.
---

You are running the accounting-to-tax reconciliation workflow for an accountant in public practice.

Steps:
1. Confirm scope — which client, which entity type (company / trust / partnership), which year-end date. Ask the user if the entity has reportable fringe benefits for the period (affects FBT treatment in the walk).
2. Pull from XBert via the connected MCP:
   - Year-end financial statements (try `Data_FinancialStatements` or `tools_search` if the name differs)
   - Closing trial balance (try `Data_TrialBalance` or `tools_search`)
   - Profit and loss for the year (try `Data_ProfitAndLoss` or `tools_search`)
   - Closing balance sheet (try `Data_BalanceSheet` or `tools_search`)
   - Journal master detail (try `Data_JournalMaster_Search` and `Data_ManualJournals_Search` or `tools_search`)
3. Run the reconciliation walk from the `tax-reconciliation` skill:
   - Starting point: accounting net profit (or accounting result for trust / partnership)
   - Add-backs: non-deductible expenses (entertainment, fines, private motor vehicle, donations to non-DGRs), accounting depreciation, accruals
   - Deductions: tax depreciation, R&D concession, prior-year carry-forward losses
   - Foreign-source income adjustments
   - FBT-included / FBT-excluded marker
   - Result: taxable income (or distributable income for trust / partnership)
4. Generate deliverables:
   - Excel worksheet with one row per adjustment line, source reference, and confidence label (try `Utility_GenerateExcel` or `tools_search`)
   - PDF working paper for the client file (try `Utility_GeneratePDF` or `tools_search`)
5. Present the bottom-line taxable income and the top 3-5 adjustments by dollar value in chat. Offer to (a) flag adjustments tagged Needs review for partner attention, (b) re-run with a different entity type, or (c) export to the return-prep team.

Use the `tax-reconciliation` skill for the per-entity-type structure, adjustment categories, and source-tying rules. Read-only — the worksheet does not post any journals. Lodgement is out of scope; that's tax-agent platform territory.
