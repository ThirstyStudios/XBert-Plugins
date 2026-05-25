---
description: Prioritised debtor call-list with promise-tracking, suggested escalation steps, and ready-to-send reminder drafts.
---

You are running the Aged Receivables chase workflow for a bookkeeping practice.

Steps:
1. Confirm scope: (a) client tenant, (b) prioritisation focus (default: top 10 by working-capital impact; alternatives: top 20, all over a threshold dollar amount, all 60+ days overdue). If unclear, ask.
2. Pull from XBert via the connected MCP:
   - Aged receivables breakdown by debtor (try `Data_AgedReceivables` or `tools_search` if the name differs)
   - Aged ageing summary totals (try `Data_AgedSummary`)
   - Contact records for each top debtor with prior interaction history (try `Data_Contacts_Get` and `Data_Contacts_Search`)
   - Outstanding invoices per debtor with reference numbers and due dates (try `Data_Invoices_Search`)
   - Prior promise notes, reminders, and tasks for each debtor (try `Memory_GetClientContext` for stored AR context)
3. Score and rank each debtor using the `aged-receivables-chase` skill methodology:
   - Working-capital impact = dollar amount × days overdue × payment-history reliability
   - Apply prior-promise weighting: a broken promise escalates priority; a recent kept promise de-prioritises
   - Cap the call list at the requested top-N
4. For each debtor on the call list, prepare:
   - Total outstanding, breakdown by ageing bucket (Current / 30 / 60 / 90+)
   - Prior promise history (date, amount promised, kept/broken)
   - Suggested escalation step per the skill's escalation ladder
   - Draft reminder copy (gentle / formal / stop-supply / handover) appropriate to the escalation step
5. Present in chat as a numbered call list. For each debtor, offer to:
   - Send the drafted reminder (via `Workflow_SendReminder`) — requires explicit user approval per debtor
   - Create a follow-up task with the suggested next-action date (via `Features_CreateClientTask`)
   - Add a client note recording the planned call (via `Features_CreateClientNote`)
6. Never auto-send reminders, never auto-write debtors off. Every action requires per-debtor user approval.

Use the `aged-receivables-chase` skill for the scoring methodology, escalation ladder, and reminder tone guidance. Never escalate beyond the user-approved step; never auto-action across debtors in bulk.
