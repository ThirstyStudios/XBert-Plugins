---
name: cashflow-13week
description: "Project a 13-week rolling cash forecast — predicted-pay-weighted AR, dated AP, payroll/tax cadence, recurring bank-tx — and surface named risk weeks with recommended actions. Use this skill when the user asks for a cashflow forecast, 13-week forecast, rolling cash forecast, working-capital projection, or runs the /cashflow-13week slash command. Also triggers on: 'cashflow looks tight', 'when does cash run low', 'project the bank balance forward', 'risk weeks ahead', 'should we draw on the facility', 'should we delay supplier payments'."
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# 13-Week Cashflow

## Goal
Project the client's cash position week-by-week for the next 13 weeks using predicted-pay weighting on AR, dated AP, payroll/tax cadence, and recurring bank-tx — surface the weeks where cash dips below threshold and the top three actions per risk week.

## Metrics
- **Weekly cash position** — opening balance + inflows - outflows per week.
- **Risk week** — any week where projected closing balance < minimum cash threshold.
- **Predicted pay-date** — invoice due date + per-debtor average latency (historic days-to-pay).
- **Per-debtor latency** — average (or median, if skewed) of days-from-due to days-paid across the debtor's payment history.
- **Recurring bank-tx confidence** — proportion of last 90 days containing the recognised pattern at the recognised amount.

## Default thresholds (practice-configurable)
| Band | Threshold |
|---|---|
| Minimum cash buffer | $25,000 (configurable per client) |
| Risk-week classification | Projected weekly closing < buffer |
| Reliable debtor latency | <= 3 days from due date |
| Unreliable debtor latency | >= 30 days from due date |
| Recurring bank-tx confidence | >= 75% of 90-day window for inclusion |
| Material AR for chase | >= $5,000 per invoice |
| Material AP for delay | >= $5,000 per bill |

## Process / rules

### Inflow projection (AR)
- For each open invoice: predicted pay-date = invoice due date + per-debtor average latency
- Assign the invoice to the week containing the predicted pay-date
- Flag invoices from unreliable debtors as "high variability" — note in the variability column
- Below-materiality invoices roll into a single "small AR" inflow per week

### Outflow projection (AP)
- Each open bill placed in the due-date week (or actual-pay-date week if the client has a fixed pay run cadence)
- Payroll: project the cadence forward at the typical run amount
- Tax obligations: place each in its statutory due week
- Recurring bank-tx: project forward at the recognised pattern's typical amount/timing
- Below-materiality bills roll into a single "small AP" outflow per week

### Risk-week naming
- A risk week must name the drivers, not just the dip: e.g. "Week 4 — payroll + ATO instalment same week, no major AR landing"
- Never produce an unnamed dip — if the cause isn't clear, name the suspect drivers and flag for review
- Ranked by severity: deepest dip first

### Recommended actions per risk week
- Three actions, ranked by impact and feasibility:
  1. **Chase** — name the top one to three debtors whose pay-date timing change would close the gap
  2. **Delay** — name the top one to three suppliers whose payment delay would close the gap (only suppliers with established relationships)
  3. **Draw** — facility drawdown amount and week (if facility limits known)
- Never recommend stopping payroll, super, or tax obligations.

### Output
- Weekly cash position chart (week-by-week bar or line)
- Risk-week list with drivers and recommended actions
- Variability column flagging high-uncertainty inflows/outflows
- Opening balance, lowest weekly balance, count of risk weeks at the top

## Always
- Read-only — never auto-pay, never auto-delay supplier payments, never auto-draw on facilities.
- Never recommend stopping payroll, super, or statutory tax payments.
- Always name the drivers of a risk week — no unnamed dips.
- Always show the predicted-pay weighting assumption per major AR inflow so the operator can challenge it.
- Always flag high-variability inflows so the forecast isn't read as a single point estimate.
- Australian English (organisation, behaviour, recognise).
