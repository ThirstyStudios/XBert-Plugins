---
description: Monthly partner-meeting one-pager — revenue, lockup, write-offs, service-line P&L, client risk segmentation. Produces Word and Excel outputs.
---

You are producing the monthly Practice Metrics one-pager for a principal. The output is a consistent, repeatable partner-meeting artefact — same shape, same metrics, same order, every month.

Steps:
1. Confirm scope: Connect tenant and reporting month (default = previous calendar month). If invoked via slash command, default and proceed unless the user pushes back.
2. Pull from XBert via the connected MCP:
   - All accessible clients in the Connect
   - XPM client list
   - XPM timesheets summary for the month and the prior month
   - Practice-internal actual time list
   - Invoices for the month and the prior month
   - Aged receivables
3. Analyse using the `practice-metrics` skill methodology:
   - Compute the standard KPI set: revenue, WIP, debtors, lockup days, write-offs
   - Build service-line P&L (bookkeeping vs tax vs advisory — use XPM service codes or category tags)
   - Compute prior-month variance for each metric; flag material movers
   - Apply RAG bands to client risk based on lockup, write-off rate, and outstanding work
   - Write commentary for material movers and any client crossing a band
4. Save the one-pager narrative payload to `outputs/<check_reference_id>/payload.json` and invoke `xbert-working-paper:render-docx` (KPI table, service-line table, RAG client list, commentary block). Do not report success until the render skill's JSON shows `status == "ok"`.
5. Save the per-client workbook payload to `outputs/<check_reference_id>/workbook.json` and invoke `xbert-working-paper:render-xlsx` for the Excel companion holding the per-client detail. Do not report success until the render skill's JSON shows `status == "ok"` and the `recalc.py` gate passes with no error cells.
6. Present the Word document with a chat-side summary of the three biggest movers month-on-month and the count of clients changing RAG band. Offer follow-up questions.

Use the `practice-metrics` skill for definitions, materiality thresholds and the commentary tone. Never apply changes — this is reporting.
