---
name: ar-cadence
description: "Behaviour-driven AR cadence — predict per-debtor pay-date from historic latency, recommend the reminder window per debtor, and draft tone-matched reminders into a ranked call list. Use this skill when the user asks for behaviour-driven debtor reminders, per-debtor cadence, payment-latency-aware chase, AR cadence, drafted reminders, or runs the /ar-cadence slash command. Also triggers on: 'when should I chase this debtor', 'this debtor always pays late', 'this debtor is reliable, don't chase yet', 'predicted pay-date', 'reminder cadence per customer', 'firm voice reminders'."
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# AR Cadence

## Goal
Replace calendar-driven AR reminders ('send at 7 days overdue') with behaviour-driven cadence. Per debtor: predicted pay-date from historic latency, recommended reminder window, and drafted reminder text in the firm's tone. The output is a ranked call list the operator works through — no auto-send.

## Metrics
- **Per-debtor latency** — average (or median, if skewed) days from invoice due date to actual pay-date across historic invoices.
- **Predicted pay-date** — open invoice due date + per-debtor latency.
- **Reliability classification** — reliable / neutral / unreliable based on latency banding.
- **Reminder window** — recommended days-before-predicted-pay-date to send the reminder.

## Default thresholds (practice-configurable)
| Band | Threshold |
|---|---|
| Reliable debtor | latency <= +3 days from due date |
| Neutral debtor | latency +4 to +14 days |
| Unreliable debtor | latency >= +15 days |
| Minimum history for modelling | 3 paid invoices over the last 12 months |
| New debtor | < 3 paid invoices — fall back to practice baseline |
| Practice baseline reminder window | 3 days before due date |
| Latency median override | use median (not mean) if std dev > 0.5 × mean |
| Materiality floor | $250 outstanding (below this, batch into "small balances" summary) |

## Process / rules

### Latency modelling
- For each debtor with at least the minimum history, compute average days-from-due-to-paid across historic invoices
- If std dev exceeds 0.5 × mean, switch to median (the debtor is bimodal — averages mislead)
- For new debtors below the history threshold, use the practice baseline window

### Reminder-window rules
| Reliability | Recommended reminder window |
|---|---|
| Reliable | None — leave alone unless predicted pay-date is passed |
| Neutral | 3 days before predicted pay-date |
| Unreliable | 7 days before predicted pay-date and again on predicted pay-date if no payment |
| New | Practice baseline (3 days before due date) |

### Tone matching
- **Reliable** — light touch: "just a heads up your invoice is due next week"
- **Neutral** — courteous: "wanted to flag invoice X is approaching due — can you confirm the pay date?"
- **Unreliable** — firm but professional: "invoice X is overdue per our usual terms — when can we expect payment?"
- **New** — baseline formal: clear list of invoices, due date, payment terms reminder
- All drafts in the firm's voice (formal / friendly-professional / warm) — never auto-shift tone without operator confirmation

### Ranked call list ordering
1. Predicted pay-date already passed + unreliable debtor (top)
2. Predicted pay-date in the recommended reminder window
3. Predicted pay-date still in future and debtor reliable (bottom — no action)
- Small-balance debtors batched into a footer summary

### Output
- Per debtor: predicted pay-date per open invoice, latency, reliability band, recommended window, drafted reminder
- Ranked call list ordered by recommended-action urgency
- Footer: small-balances batch (count + total)

## Always
- Read-only — never auto-send, never auto-apply, never auto-batch sends.
- Every reminder requires per-debtor user approval.
- Never reclassify a debtor as unreliable based on a single late invoice — wait for the pattern.
- Always show the latency and reliability behind the recommendation so the operator can challenge it.
- Always preserve the firm's tone preference — never auto-escalate tone without operator confirmation.
- Australian English in all drafted reminders (organisation, behaviour, recognise).
