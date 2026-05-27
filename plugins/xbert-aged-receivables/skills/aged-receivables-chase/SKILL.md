---
name: aged-receivables-chase
description: "Turn an aged receivables report into a prioritised call list ranked by working-capital impact. Use this skill when the user asks for the weekly debtor chase, asks who to chase first, asks about cashflow from receivables, or runs the /aged-receivables slash command. Also triggers on: 'who owes us money', 'aged debtors review', 'AR chase plan', 'cashflow is tight this week'."
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Aged Receivables Chase

## Goal
Turn the aged receivables report into a structured weekly chase plan — call the right debtor first by working-capital impact, with the ageing breakdown and contact details ready for the next call. The bookkeeper does the conversations and writes the messages; the plugin does the prep.

## Metrics
- **Working-capital impact** — dollar amount × log(days overdue + 1).
- **Oldest bucket** — the most overdue ageing bucket the debtor currently sits in. Used as the secondary sort.
- **Attention flag** — boolean per debtor with a reason (60+ days overdue, materiality > $5k, large jump since prior run).

## Default thresholds (practice-configurable)
| Band | Threshold |
|---|---|
| Current ageing | 0-30 days overdue |
| 30 ageing | 31-60 days overdue |
| 60 ageing | 61-90 days overdue |
| 90+ ageing | 91+ days overdue |
| Materiality floor | $250 outstanding (below this, batch into "small balances" summary) |
| Attention-flag — materiality | $5,000 outstanding |
| Attention-flag — ageing | 60+ days overdue |
| Attention-flag — momentum | Large jump in days-overdue since the prior run |

## Process / rules

### Scoring
`impact_score = outstanding_amount * log(days_overdue + 1)`

Secondary sort: oldest bucket the debtor sits in.

### Output
- Numbered call list capped at the requested top-N.
- Per debtor: name, total outstanding, ageing-bucket breakdown (Current / 30 / 60 / 90+), contact details (name, email, phone), outstanding invoices (reference, date, amount), and an attention flag (yes / no with reason).
- Footer: small-balances summary (count + total) for amounts below the materiality floor.

## Out of scope (do NOT include in output)

- Prior-promise history (kept / broken / open) — no promise-to-pay data type exists in XBert today; no promised-payment-date property on Contact or Invoice.
- Payment-reliability weighting per debtor — no behavioural-scoring property is captured.
- Stop-supply notice or handover-to-recovery status — no collection-escalation status property exists on Contact or Invoice.
- Drafted reminder copy in practice tone — the agent does not write messages.
- Broken-promise-more-than-N-days flags — no promised-payment-date data exists to compare against.

If a Custom XBert in the user's portal deterministically captures any of these signals, surface what the XBert caught — do not invent the signal yourself.

## Always
- **Read-only.** Never auto-send reminders; never bulk-action across debtors. Every action is per-debtor with explicit user approval.
- **Do not draft communication copy.** The user writes the message.
- **Do not propose stop-supply, handover, or formal-recovery actions.** Those decisions sit with the practice owner and have no deterministic signal in the data.
- Always show the reasoning behind the attention flag (which trigger fired) so the user can override.
- Distinguish "no contact details" debtors from "in scope" debtors and call them out separately at the bottom.
- Australian English throughout (organisation, behaviour, colour).
