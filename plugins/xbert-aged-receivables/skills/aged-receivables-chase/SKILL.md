---
name: aged-receivables-chase
description: "Turn an aged receivables report into a prioritised call list with promise-tracking and escalation ladders. Use this skill when the user asks for the weekly debtor chase, asks who to chase first, asks about cashflow from receivables, asks to send overdue reminders, or runs the /aged-receivables slash command. Also triggers on: 'who owes us money', 'aged debtors review', 'AR chase plan', 'broken promise debtors', 'cashflow is tight this week'."
---

# Aged Receivables Chase

## Goal
Turn the aged receivables report into a structured weekly chase plan — call the right debtor first, send the right reminder tone, escalate consistently, and track every promise so the next conversation builds on the last one. The bookkeeper does the conversations; the plugin does the prep.

## Metrics
- **Working-capital impact** — dollar amount × days overdue × payment-history reliability factor (0.5-1.5).
- **Payment-history reliability** — historical ratio of promises kept vs broken; days from invoice to payment vs payment terms.
- **Promise status** — open (made but not yet due), kept (paid on/before promise date), broken (promise date passed without payment).
- **Escalation step** — current rung on the escalation ladder per debtor.

## Default thresholds (practice-configurable)
| Band | Threshold |
|---|---|
| Current ageing | 0-30 days overdue |
| 30 ageing | 31-60 days overdue |
| 60 ageing | 61-90 days overdue |
| 90+ ageing | 91+ days overdue |
| Reliable debtor | >= 80% promises kept on time |
| Unreliable debtor | <= 50% promises kept on time |
| Stop-supply trigger | 60+ days overdue AND >= 2 broken promises |
| Handover trigger | 90+ days overdue AND >= 3 broken promises OR no contact in 30 days |
| Materiality floor | $250 outstanding (below this, batch into "small balances" summary) |

## Process / rules

### Scoring
`impact_score = outstanding_amount * log(days_overdue + 1) * reliability_factor`
- reliability_factor: reliable = 0.8 (less urgent, will likely pay), neutral = 1.0, unreliable = 1.5 (more urgent, won't self-correct)
- Apply broken-promise multiplier of 1.3 if any open broken promise exists

### Escalation ladder
1. **Gentle nudge** (0-30 days overdue, no prior promises broken): friendly reminder, "just a heads up these invoices are now due"
2. **Formal reminder** (30-60 days, or 1 broken promise): clear list of overdue invoices, expected payment date request, account contact details
3. **Stop-supply warning** (60+ days AND >= 2 broken promises, OR materiality > $5k): notice that further supply will be paused pending payment, request for payment plan discussion
4. **Handover** (90+ days AND >= 3 broken promises, OR no contact in 30 days): formal handover to debt collection or solicitor; bookkeeper escalates to client/owner for sign-off

Never skip a rung silently — if a debtor jumps from gentle nudge to handover, surface the reason explicitly.

### Promise tracking
- Every reminder send creates a follow-up task with the promised-by date (or +14 days if no specific promise)
- Mark a promise as broken when the promise date passes without payment; the next reminder cycle uses the next escalation rung
- Mark a promise as kept when the invoice is paid by the promise date; reliability factor improves

### Output
- Numbered call list capped at requested top-N
- Per debtor: name, total outstanding, ageing breakdown, prior promise summary (count kept / count broken / last contact date), suggested escalation step with one-line reason, draft reminder copy
- Footer: small-balances summary (count + total) for amounts below materiality floor

## Always
- Never auto-send reminders — every send requires per-debtor user approval
- Never escalate beyond the user-approved step
- Never recommend write-off without explicit user sign-off
- Always show the reasoning behind the escalation step (which trigger fired)
- Always preserve prior promise history; a broken promise this week is context for the next reminder, not a fresh start
- Distinguish between "no contact" debtors (need a touch) and "in-conversation" debtors (recent kept promise, leave alone)
- Australian English in all reminder drafts (organisation, behaviour, programme)
