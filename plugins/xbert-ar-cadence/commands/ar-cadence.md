---
description: Behaviour-driven AR cadence — per-debtor predicted-pay-date, recommended reminder window, tone-matched drafted reminder, ranked call list.
---

You are running the AR Cadence workflow for a bookkeeping practice.

Steps:
1. Confirm scope: (a) client tenant, (b) the firm's tone preference for drafted reminders (formal / friendly-professional / warm — default to the firm's prior tone if known). If unclear, ask.
2. Pull from XBert via the connected MCP:
   - Aged receivables breakdown by debtor
   - Open invoices per debtor with reference numbers and due dates
   - Per-debtor payment history (last 12 months, or as much as is available) including invoice due date and actual pay-date for each historic invoice
   - Contact records for each debtor with prior interaction history
3. Compute per-debtor cadence using the `ar-cadence` skill methodology:
   - **Per-debtor latency**: average (or median, if skewed) days from invoice due date to actual pay-date across the debtor's historic invoices
   - **Predicted pay-date** for each open invoice = invoice due date + per-debtor latency
   - **Recommended reminder window**: earlier for chronic-latency debtors, later for reliable payers, default baseline for new debtors with no history
   - **Reminder tone**: matched to debtor reliability (firm but courteous for unreliable; light touch for reliable; baseline-formal for new)
4. For each debtor on the call list, prepare:
   - Total outstanding and breakdown by ageing bucket
   - Per-debtor latency and predicted pay-date for each open invoice
   - Recommended reminder window (e.g. "send 3 days before predicted pay-date" or "send today — predicted pay-date already passed")
   - Drafted reminder text in the firm's tone, referencing the specific invoices and the relationship history
5. Present in chat as a ranked call list ordered by recommended-action urgency:
   - Predicted pay-date already passed and unreliable debtor — top
   - Predicted pay-date in the recommended-reminder window — next
   - Predicted pay-date still in future and reliable — bottom (no action needed)
   - Offer to send each drafted reminder — requires explicit user approval per debtor
   - Offer to create a follow-up task at the predicted pay-date for each debtor
6. Never auto-send reminders, never auto-batch sends across the cadence. Every reminder requires per-debtor user approval.

Use the `ar-cadence` skill for the latency model, reminder-window rules, and tone matching guidance. Never replace human judgment on relationship debtors — surface the cadence; the bookkeeper picks the calls.
