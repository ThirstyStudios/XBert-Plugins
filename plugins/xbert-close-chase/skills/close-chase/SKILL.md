---
name: close-chase
description: Close-period chase methodology — pull all outstanding XBerts for a client, rank by impact and age, draft per-item reminder text with email and Capture-chat tone variants, record the chase and produce a delta on the next run. Use when the user asks to chase outstanding items, run a close-period chase, draft client reminders, get a delta on prior chase, or runs the /close-chase slash command. Also triggers on: "month-end chase", "outstanding XBert chase", "client reminder draft", "close-period sweep".
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Close Chase

A close-period chase loop driven by every outstanding XBert for the client. This skill does NOT use the linked-XBerts gate that the other XBert-led plugins use — the chase intentionally covers every issue, not a curated subset. Drafts reminders, records what was chased, and produces a delta on the next run.

## Goal

Convert the client's full outstanding-XBert list into a ranked, drafted chase brief that the bookkeeper can act on, and close the loop on the next run with a delta of what moved.

## Why not the linked-XBerts gate

The other XBert-led plugins (anomaly, policy, receipt, fx, audit-evidence) gate on linked XBerts because each is a focused review over a curated subset. Close-chase is the opposite — its job is to surface everything outstanding so nothing slips through close. It pulls the full outstanding-XBert summary for the client and does not filter by agent linkage.

## Ranking signals

| Signal | Effect on rank |
|---|---|
| Issue age | Older outstanding items rank higher |
| Impact / severity | High-impact items rank higher within the same age bucket |
| Prior-chase status | Items chased but unresolved escalate above never-chased of the same age |
| Responsible party clustering | Group items by responsible party so a single chase covers multiple items |
| Period-locking risk | Items that will block period close rank top |

## Metrics

- **Outstanding count** — total outstanding XBerts for the client
- **Ranked top-N** — for the practice manager's eye
- **Drafted reminders** — count and channel split (email vs Capture chat)
- **Delta on rerun** — resolved since last chase, still outstanding (chased / not chased)
- **Recurring offenders** — responsible parties appearing in multiple consecutive runs

## ChaseLedger store

A small per-client store recording chase events. Each entry: item identifier, channel (email or Capture chat), draft text used, timestamp, who chased. On the next run the store is read first; resolved items are subtracted, unresolved chased items escalate.

## Methodology

1. **Pull all outstanding.** Pull ALL outstanding XBerts for the client. No linked-XBerts gate. No filtering by agent.
2. **Pull context.** Issue age, underlying entity, responsible party.
3. **Read ChaseLedger.** Load prior chase entries for the client.
4. **Rank.** Apply the signals table above.
5. **Group by responsible party.** Where one party owns multiple items, group so a single chase covers the lot.
6. **Draft reminders.** Per item draft email tone and Capture-chat tone variants. Name date, amount, entity reference, action required. Match firm tone-of-voice.
7. **Capture chase decision.** Let the user choose which items to chase and via which channel. Record in the ChaseLedger store.
8. **Compute delta.** Surface: resolved since last chase, still outstanding (chased but unresolved), still outstanding (not yet chased).

## Chase brief structure

1. Cover header — client name, close period, generation date
2. Summary — outstanding count, top-N ranked, delta from prior run
3. Ranked chase list — per-item rank, age, impact, responsible party, drafted reminder text (both channel variants)
4. Recurring-offender section — responsible parties appearing across multiple runs
5. Delta section — resolved, chased-unresolved, never-chased
6. QMS block — practice name + ID, preparer name + ID, timestamp, unique check reference ID, compliance statement

## Output format

- Australian English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings in chat preview, bold key figures
- Tables for ranked chase list and delta section
- Never use emojis

## Always

- Never auto-apply; never lodge; never send. Output is for review.
- The plugin drafts; the bookkeeper sends. The ChaseLedger only records what the user chose to chase
- Do not gate on linked XBerts — close-chase covers everything outstanding
- Drafted reminders must name date, amount and entity reference — no generic prompts
- Recurring offenders across consecutive runs must be flagged for practice-manager attention
- The delta on rerun is the loop-closing artefact — it must be visibly first on subsequent runs
