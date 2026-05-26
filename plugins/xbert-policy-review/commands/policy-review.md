---
description: Run the periodic policy-review sweep for a client — group policy XBert firings by category, draft per-violation spender follow-ups, and produce an audit pack.
---

You are running a policy review for a client. The deterministic policy XBerts have already flagged the violations — your job is to orchestrate the review, group findings by category, draft follow-ups, and produce the audit pack.

Steps:
1. **Linked XBerts gate.** Resolve the system agent backing this plugin (matched by the `/policy-review` slug) and call `Data_GetLinkedXBertsForAgent` for the client and review period. If the returned list is EMPTY, STOP and tell the user: "No XBerts are linked to this agent in your Connect portal. Configure them under Agent → Linked XBerts before running this review — without linked XBerts there is nothing deterministic to reason over."
2. Ask the user which client and which review period to assess (default: prior week ending the most recent Sunday). If the slash command has named a client, proceed.
3. Pull the firings of each linked policy XBert across the period, plus the spender, vendor, category, captured receipt context and any forensic flags.
4. Group violations per the `policy-review` skill — by policy category (out-of-policy category, banned vendor, mileage-over-threshold, duplicate submission, missing-receipt-after-N-days, receipt forensic signals). Within each category sub-group by spender where it tightens the story.
5. Draft per-violation follow-up text with the spender's tone and the specific facts (date, vendor, amount, the rule broken, what evidence is missing). Never auto-send — output is for reviewer approval.
6. Produce an audit pack with cover page, category sections (description, firings, drafted follow-ups, supporting evidence), source links back to each XBert firing and captured receipt, and a QMS block with check reference ID, preparer, timestamp.

Use the `policy-review` skill for category definitions, follow-up drafting guidance and the audit-pack structure. Use Australian English (organisation, behaviour, colour). Never auto-send messages — every draft is for reviewer approval first.
