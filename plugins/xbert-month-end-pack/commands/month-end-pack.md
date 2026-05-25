---
description: Generate the month-end financial pack the partner can hand to the client — P&L vs budget, BS movement walk, cashflow vs forecast, and KPI roll-up.
---

You are running the Month-End Pack workflow for a bookkeeping practice.

Steps:
1. Confirm scope: (a) client tenant, (b) the month being closed (e.g. "April 2026"), (c) comparison frame (default: prior month + prior year same month + budget). Confirm with user if unclear.
2. Pull from XBert via the connected MCP:
   - Profit & loss for the period with budget comparison (try `Data_ProfitAndLoss` or `tools_search` if the name differs)
   - Balance sheet at period end (try `Data_BalanceSheet`)
   - Cashflow for the period vs forecast (try `Data_Cashflow`)
   - Budget adherence summary across all key lines (try `Data_BudgetAdherence`)
   - Balance sheet review for unexpected account movements (try `Validation_BalanceSheetReview`)
3. Analyse using the `month-end-pack` skill methodology:
   - **P&L section**: revenue and expense lines vs budget, vs prior month, vs prior year; flag material variances by line; surface the top 5-7 variances for commentary
   - **Balance sheet section**: movement walk by account, flag unexpected movements (per BS review tool), bank reconciliation status check
   - **Cashflow section**: opening cash → closing cash bridge, operating vs investing vs financing breakdown, vs forecast
   - **Budget adherence**: YTD revenue, YTD expense, YTD EBITDA against budget; surface major drivers of YTD variance
   - **KPI roll-up**: gross margin, net margin, current ratio, debtor days, creditor days, working capital — all calculated, plus prior-period comparison
4. Generate the Word document (try `Utility_GenerateWord` or `Utility_GeneratePDF` if Word unavailable; use `tools_search` if names differ) with these sections in this order:
   - Cover page (client name, period, generation date)
   - Executive summary (1-page roll-up of revenue, EBITDA, cash, top 3 variances)
   - P&L with budget and prior-period comparisons + commentary scaffolding
   - Balance sheet with movement walk + flagged accounts
   - Cashflow with forecast comparison
   - KPI dashboard table
   - Appendix: balance sheet review findings, data-sparsity notes
5. Present a chat summary: top 3 variances, top 3 BS movements, cash position, suggested partner-review focus areas. Offer to drop the file path.

Use the `month-end-pack` skill for the methodology, materiality thresholds, and commentary scaffolding patterns. Never overwrite prior packs; output filename includes the period. Never make accounting judgment calls — commentary is scaffolded for the partner to complete.
