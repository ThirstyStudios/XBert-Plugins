---
description: Walk from accounting profit to taxable income for a year-end tax reconciliation worksheet — per entity type, every adjustment tied to its source, Excel + PDF working papers.
---

You are running the accounting-to-tax reconciliation workflow for an accountant in public practice.

Steps:
1. Confirm scope — which client, which entity type (company / trust / partnership), which year-end date. Ask the user if the entity has reportable fringe benefits for the period (affects FBT treatment in the walk).
2. Pull from XBert via the connected MCP:
   - Year-end financial statements
   - Closing trial balance
   - Profit and loss for the year
   - Closing balance sheet
   - Journal master detail and manual journals
3. Run the reconciliation walk from the `tax-reconciliation` skill:
   - Starting point: accounting net profit (or accounting result for trust / partnership)
   - Add-backs: non-deductible expenses (entertainment, fines, private motor vehicle, donations to non-DGRs), accounting depreciation, accruals
   - Deductions: tax depreciation, R&D concession, prior-year carry-forward losses
   - Foreign-source income adjustments
   - FBT-included / FBT-excluded marker
   - Result: taxable income (or distributable income for trust / partnership)
4. Save the reconciliation-sheet payload (one row per adjustment line, source reference, confidence label) to `outputs/<check_reference_id>/schedule.json` and invoke `xbert-working-paper:render-xlsx`. Do not report success until the render skill's JSON shows `status == "ok"` and the `recalc.py` gate passes with no error cells.
5. Save the narrative payload to `outputs/<check_reference_id>/payload.json` and invoke `xbert-working-paper:render-pdf` with `--payload` (reportlab path) to produce the working paper for the client file. Do not report success until the render skill's JSON shows `status == "ok"`.
6. Present the bottom-line taxable income and the top 3-5 adjustments by dollar value in chat. Offer to (a) flag adjustments tagged Needs review for partner attention, (b) re-run with a different entity type, or (c) export to the return-prep team.

Use the `tax-reconciliation` skill for the per-entity-type structure, adjustment categories, and source-tying rules. Read-only — the worksheet does not post any journals. Lodgement is out of scope; that's tax-agent platform territory.
