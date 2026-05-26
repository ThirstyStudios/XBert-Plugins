---
description: Compose the month-end client packet — BS/P&L with variance commentary, material-journal narrative, KPI page, and outstanding XBerts — into a single Word/PDF deliverable.
---

You are running the Close Packet composition workflow for an accounting practice.

Steps:
1. Confirm scope: (a) client tenant, (b) the period being closed (e.g. "April 2026" or "Q3 FY26"), (c) reporting shape — SPFS (Special Purpose Financial Statements) or GPFS (General Purpose Financial Statements). If unclear, ask.
2. Pull from XBert via the connected MCP:
   - Balance sheet at period end with prior-period comparison
   - Profit & loss for the period with budget and prior-period comparison
   - Cashflow for the period with forecast comparison
   - Trial balance at period end
   - Budget adherence summary
   - Material journals posted in the period (with descriptions, affected accounts, dollar value)
   - Outstanding XBerts at period end (open issues, risks, unresolved alerts on the ledger)
3. Compose using the `close-packet` skill methodology:
   - **BS section**: actual / prior period / movement columns with material movements flagged
   - **P&L section**: actual / budget / prior period columns with variance commentary drafted per material line
   - **Variance commentary block**: each material variance gets a scaffolded paragraph (driver, magnitude, comparison frame) — outstanding XBerts that relate to the variance are listed inline so risks sit beside the explanation
   - **Journal narrative block**: each material journal gets a one-paragraph narrative drafted from the journal description, affected accounts, dollar value, and prior-period context
   - **KPI page**: gross margin, net margin, current ratio, debtor days, creditor days, working capital — current vs prior with movement direction noted
   - **What changed and why summary**: 5-7 bullet roll-up of the period's story for the cover page
4. Generate the Word document (PDF fallback if Word unavailable) with these sections in this order:
   - Cover page (client name, period, reporting shape, prepared by, reviewed by — partner left blank)
   - What changed and why (executive summary)
   - P&L with variance commentary and inline outstanding-XBerts
   - Balance sheet with movement walk
   - Cashflow with forecast comparison
   - Material journal narrative
   - KPI page
   - Appendix: outstanding-XBerts full list, data-sparsity notes
5. Present a chat summary: top 3 variances with drafted commentary, top 3 BS movements, top 3 material journals, count of outstanding XBerts. Offer the file path.
6. Never auto-send the packet, never auto-lodge, never finalise. The partner reviews, edits commentary, and approves the send.

Use the `close-packet` skill for the section order, composition rules, and commentary scaffolding patterns. Never overwrite prior packets; output filename includes the period.
