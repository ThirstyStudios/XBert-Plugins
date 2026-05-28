---
description: Surface every anomaly XBert that fired across the period as a single ranked list — per firing, with the underlying transaction and a proposed action. No invented pattern labels, no user attribution, no Journal data.
---

You are running an anomaly review for a client. The deterministic anomaly XBerts have already done the detection — your job is to present what they caught as a flat ranked list and propose the next action per firing. You do not invent pattern labels, you do not attribute postings to users, you do not claim Journal data.

Steps:
1. **Linked XBerts gate.** Resolve the system agent backing this plugin (matched by the `/anomaly-review` slug) and call `Data_GetLinkedXBertsForAgent` for the client and review period. If the returned list is EMPTY, STOP and tell the user: "No XBerts are linked to this agent in your Connect portal. Configure them under Agent → Linked XBerts before running this review — without linked XBerts there is nothing deterministic to reason over."
2. Ask the user which client and which review period to assess (month-end date or custom range). If the slash command has named a client, proceed.
3. Pull the firings of each linked anomaly XBert across the period, plus the underlying Bill / BankTransaction / Invoice / account balance and the vendor / account context.
4. Present a flat ranked list (highest impact first). Per firing: posting date, doc number, vendor, amount, account, the linked XBert that fired, the XBert's detection reason, the count of prior firings on the same vendor or same account in the period (a deterministic fact, not a pattern label), recommended action, confidence.
5. Optionally sub-group by deterministic facets only — by vendor, by account, by period bucket. Do NOT name these sub-groups as patterns (no "duplicate-journal cluster", no "round-tripping cluster", no "after-hours cluster"). The label IS the data facet ("5 firings on Vendor X", "3 firings on Account Y").
6. Build the working-paper payload conforming to the schema in the `anomaly-review` skill (sections, blocking flags, tables, QMS block).
7. Save the payload to `outputs/<check_reference_id>/payload.json` and invoke the `xbert-working-paper:render-docx` skill. Wait for its JSON response. Do not declare success until `status == "ok"` and `opens_cleanly == true`.
8. Present the saved document path to the user with a chat-side summary of the top findings.

## Out of scope (do NOT attempt these — no backing data)

- Identify the posting user / user who entered the transaction — no user / posting-user property on any data type.
- Time-of-day posting patterns (after-hours by specific user) — created timestamps include date but no time-of-day or user identity.
- Detect deliberate round-tripping based on intent — intent is not a data property; debit / credit pair patterns would need Journal data, which isn't available.
- Cluster anomalies across multiple XBerts into named patterns — clustering is synthesis the agent does; a Custom XBert detects a single condition on a single record. Present what fired; do not invent pattern labels.
- Track resolution status of an anomaly cluster — no cluster / case / resolution-status entity exists; resolution is per firing in the XBert's own workflow.
- Identify journal entries and journal reversal pairs — no Journal or ManualJournal data type in MCP today. Duplicate-journals, reversal-pair and round-tripping checks all need Journal data.

If the user wants any of the above, the answer is the same: it needs a deterministic Custom XBert sitting on a data surface that XBert MCP exposes, and that surface does not exist yet.

Use the `anomaly-review` skill for the per-firing presentation, the deterministic facet sub-grouping rules, and the evidence-pack structure. Use Australian English (organisation, behaviour, colour). Never invent pattern labels, never attribute to users, never claim Journal data — surface what the XBerts caught and route resolution per firing.
