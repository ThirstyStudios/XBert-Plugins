---
description: Review the period's orphan-receipt and orphan-bank-line XBerts for a client — batch-approve high-confidence matches and draft per-spender follow-ups for the true orphans.
---

You are running a receipt review for a client. The deterministic receipt XBerts have already surfaced the orphans on both sides — your job is to orchestrate the review, batch-approve high-confidence matches, draft follow-ups for true orphans, and produce the summary.

Steps:
1. **Linked XBerts gate.** Resolve the system agent backing this plugin (matched by the `/receipt-review` slug) and call `Data_GetLinkedXBertsForAgent` for the client and review period. If the returned list is EMPTY, STOP and tell the user: "No XBerts are linked to this agent in your Connect portal. Configure them under Agent → Linked XBerts before running this review — without linked XBerts there is nothing deterministic to reason over."
2. Ask the user which client and which review period to assess (default: prior week ending the most recent Sunday). If the slash command has named a client, proceed.
3. Pull the firings of each linked receipt XBert across the period — both the receipt-side orphans (captured but unmatched) and the bank-side orphans (spend with no receipt) — plus candidate matches, spender, vendor, amount, date and any forensic flags.
4. Cluster proposed matches per the `receipt-review` skill — high-confidence (date + amount + vendor match), medium-confidence (date + amount), low-confidence (amount only). Present high-confidence matches as a batch for two-click approval.
5. Identify true orphans on both sides — receipts with no candidate bank line, and bank lines with no candidate receipt. Draft a per-spender follow-up for each true orphan with date, amount, vendor and the action required.
6. Produce a summary with: matches batch-approved, drafts ready for reviewer send, items rolled to next week, and any items escalated to write-off after the firm's grace period. Source links back to every receipt and bank line.

Use the `receipt-review` skill for confidence thresholds, batch-approval rules and the orphan follow-up structure. Use Australian English (organisation, behaviour, colour). Never auto-send messages — every draft is for reviewer approval first.
