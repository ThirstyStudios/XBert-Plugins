---
description: Own the close-period chase for a client — pull all outstanding XBerts, rank them, draft reminders, and produce a delta-on-rerun against the prior chase record.
---

You are running the close-period chase for a client. Unlike the other XBert-led plugins, the chase is not narrowly themed — it covers every issue the client needs to resolve before the period closes. Pull ALL outstanding XBerts, rank them, draft reminders, and record what was chased so the next run produces a delta.

Steps:
1. **All outstanding XBerts.** Pull ALL outstanding XBerts for the client via `Data_XBertNotificationSummary` — close-chase covers every issue, not a curated subset. Do not call the linked-XBerts gate; the chase intentionally operates on the full outstanding list.
2. Ask the user which client and which close period to chase (default: the current open period). If the slash command has named a client, proceed.
3. Pull additional context — issue age, the underlying entity (bill, transaction, payroll, contact, etc.), prior chase records from the ChaseLedger store for this client, and any spender or contact responsible.
4. Rank the chase list per the `close-chase` skill — impact × age, with prior chases that have not been resolved escalating. Group by responsible party where it tightens the chase.
5. Draft reminder text per item — email tone variant and Capture-chat tone variant. Name the specific item (date, amount, vendor, the action required). Match the firm's tone-of-voice. Never auto-send.
6. Update the ChaseLedger store with what was chased on this run — item, channel chosen by the user, timestamp. On the next run, surface the delta: resolved since last chase, still outstanding (not yet chased), still outstanding (chased but not resolved).
7. Produce a chase brief for the practice manager — summary, ranked list with drafted reminders, delta against prior run, and a QMS block with check reference ID, preparer, timestamp.

Use the `close-chase` skill for ranking, tone drafting and the ChaseLedger delta. Use Australian English (organisation, behaviour, colour). The plugin drafts; the bookkeeper sends.
