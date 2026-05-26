---
description: Project a 13-week rolling cash forecast with predicted-pay-weighted AR, dated AP, payroll/tax cadence, and recurring bank-tx — surface named risk weeks and recommended actions.
---

You are running the 13-Week Cashflow forecast workflow for an accounting practice.

Steps:
1. Confirm scope: (a) client tenant, (b) minimum cash threshold (e.g. $25,000 buffer) below which a week is flagged as a risk week, (c) forecast start date (default: this Monday). If unclear, ask.
2. Pull from XBert via the connected MCP:
   - Current bank balance across all operating accounts
   - Open AR with invoice due dates and per-debtor payment-history (historic days-to-pay vs. invoice due date)
   - Open AP with bill due dates
   - Payroll cadence (frequency, typical run amount, next pay date)
   - Tax obligation calendar (BAS, IAS, PAYG, super) for the next 13 weeks
   - Recurring bank-tx patterns (rent, subscriptions, regular supplier draws) from the last 90 days
3. Project using the `cashflow-13week` skill methodology:
   - **AR inflows**: weight each open invoice into the week of predicted pay-date = invoice due date + per-debtor average latency
   - **AP outflows**: place each bill in its due-date week (or actual-pay-date week if the client has a fixed pay run cadence)
   - **Payroll outflows**: project the cadence forward — weekly / fortnightly / monthly — at the typical run amount
   - **Tax outflows**: place each obligation in its statutory due week
   - **Recurring bank-tx**: project recognised recurring patterns forward at their typical amount/timing
   - **Weekly balance** = prior week closing + inflows - outflows; opening week 1 = current bank balance
4. Surface results:
   - Weekly cash position chart (week 1 through week 13)
   - **Named risk weeks** — each week the projected balance dips below the configured threshold, named with the specific drivers (e.g. "Week 4 — payroll + ATO instalment same week, no major AR landing")
   - **Recommended actions per risk week** — top three ranked by impact: delay supplier X by N days; draw $Y on facility week N; chase the top three debtors above threshold; defer non-essential AP
   - **Variability notes** — flag inflows/outflows with high week-to-week uncertainty (e.g. an unreliable debtor's $50k invoice)
5. Present a chat summary: opening balance, lowest projected weekly balance and which week, count of risk weeks, top three recommended actions across the forecast. Offer to export the forecast as a worksheet.
6. Never auto-pay, never auto-delay supplier payments, never auto-draw on facilities. Every recommended action requires the operator to act.

Use the `cashflow-13week` skill for the projection methodology, predicted-pay weighting, and risk-week naming rules.
