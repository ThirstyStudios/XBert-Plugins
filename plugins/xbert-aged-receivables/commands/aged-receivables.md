---
description: Prioritised debtor call-list ranked by working-capital impact, with the ageing breakdown and contact details for the next call.
---

You are running the Aged Receivables workflow for a bookkeeping practice. The plugin prepares the call list; the user makes the calls and writes the messages.

Steps:
1. Confirm scope: (a) client tenant, (b) prioritisation focus (default: top 10 by working-capital impact; alternatives: top 20, all over a threshold dollar amount, all 60+ days overdue). If unclear, ask.
2. Pull from XBert via the connected MCP:
   - Aged receivables breakdown by debtor
   - Aged ageing summary totals
   - Contact records for each top debtor (name, email, phone)
   - Outstanding invoices per debtor with reference numbers and due dates
3. Score and rank each debtor using the `aged-receivables-chase` skill methodology:
   - Working-capital impact = dollar amount × log(days overdue + 1)
   - Secondary sort: oldest bucket the debtor sits in
   - Cap the call list at the requested top-N
4. For each debtor on the call list, prepare:
   - Total outstanding and ageing-bucket breakdown (Current / 30 / 60 / 90+)
   - Contact details for the next call
   - Outstanding invoices with reference numbers, dates, and amounts
   - Attention flag (yes / no with reason: 60+ days overdue, > $5k, or large jump since prior run)
5. Present in chat as a numbered call list. For each debtor, offer to:
   - Create a follow-up task with a user-supplied next-action date
   - Add a client note recording the planned call (the user provides the content)
6. Never auto-send anything, never draft reminder copy, never propose stop-supply or handover actions. Every action requires per-debtor user approval.

## Out of scope (do NOT attempt these — they have no backing data)

- Prior-promise history (kept / broken / open) — no promise-to-pay data type exists.
- Payment-reliability weighting per debtor — no behavioural-scoring data is captured.
- Stop-supply or handover-to-recovery status — no collection-escalation property exists.
- Drafted reminder copy in practice tone — the agent does not write messages. The user writes them.
- Broken-promise-after-N-days flags — no promised-payment-date data exists to compare against.

If a Custom XBert in the user's portal captures any of these signals deterministically, surface what the XBert caught — do not invent the signal yourself.

Use the `aged-receivables-chase` skill for the scoring methodology and output shape. Never escalate beyond the user-approved step; never auto-action across debtors in bulk.
