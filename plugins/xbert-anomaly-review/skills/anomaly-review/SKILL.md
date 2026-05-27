---
name: anomaly-review
description: Anomaly-review methodology — present every anomaly XBert that fired across the period as a flat ranked list with per-firing recommended action. No invented pattern labels, no user attribution, no Journal data. Use when the user asks to review anomalies, run an anomaly sweep, debug a recurring anomaly, or runs the /anomaly-review slash command. Also triggers on "anomaly review", "GL anomaly sweep", "fire XBert review", "anomaly evidence pack".
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Anomaly Review

A per-firing review of every anomaly XBert that fired across the period. Detection is owned deterministically by Custom XBerts (the XBerts are the heroes); this skill surfaces what they caught, presents them as a ranked list, and drives resolution per firing.

## Goal

Convert the period's anomaly XBert firings into a single ranked list the reviewer can walk top-to-bottom, with the underlying transaction and a recommended next action per firing. Optionally sub-group on deterministic facets (vendor, account, period bucket) — never under invented pattern labels.

## What the XBerts can deterministically detect (on the available data types)

The supported set of anomaly patterns is bounded by what the linked Custom XBerts can detect on Bill / BankTransaction / Invoice / Contact / account balances. Typical examples:

- Same vendor + amount + date appearing more than once on Bill or BankTransaction
- Period-over-period balance jump in an account beyond expected variance
- Same vendor coded to a different account than its recurring pattern
- Round-number-recurring vendor postings
- Volume spikes per vendor or per account in the period

The agent reasons only over what the customer's linked XBerts have actually wired up — never assume the list above is what's enabled in any given portal. Surface what fired; don't invent what didn't.

## Metrics

- **Firings in period** — total count surfaced by the linked anomaly XBerts
- **Recurrence by vendor** — vendors with two or more firings (deterministic fact, not pattern label)
- **Recurrence by account** — accounts with two or more firings
- **Recurrence by period bucket** — firings spiked within a date range (e.g. last week of the period)

## Methodology

1. **Linked XBerts gate.** If no XBerts are linked to the Anomaly Review agent in the Connect portal for the client, STOP. Tell the user to configure linked XBerts first.
2. **Pull firings.** For every linked anomaly XBert, pull the period's firings with the underlying Bill / BankTransaction / Invoice / account balance and the vendor / account context.
3. **Rank.** Order by impact (use the XBert's reported amount and / or risk level as the sort key). One row per firing.
4. **Sub-group on deterministic facets (optional).** If the list is long, sub-group by vendor, by account, or by period bucket. The label IS the data facet — never invent a pattern label.
5. **Per-firing action.** Propose the next action per firing: recode, request supporting doc, accept-as-correct, escalate. Don't draft client communications.
6. **Compose evidence pack.** Cover page, ranked list, optional facet sub-groupings with counts, source links to every XBert firing.

## Evidence pack structure

1. Cover page — client name, period, generation date
2. Summary — total firings, recurrence by vendor / account / period bucket (counts only)
3. Ranked list — one row per firing with the data above
4. Optional facet sub-groupings — counts per vendor / account / period bucket where useful
5. Source links — hyperlinks to every underlying XBert firing
6. QMS block — practice name + ID, preparer name + ID, timestamp, unique check reference ID, compliance statement

## Out of scope (do NOT include in output — no backing data)

- Posting user / created-by-user attribution (no such property on any data type)
- Time-of-day posting patterns (only created-date is available, not time-of-day)
- After-hours user attribution (no user identity available to attribute to non-finance users)
- Intent-based detection (no intent property; round-tripping needs Journal data)
- Named pattern clusters ("duplicate-journal cluster", "round-tripping cluster", "fraud ring") — present what fired, do not invent labels
- Cluster-level resolution tracking (no cluster / case / resolution-status entity)
- Journal-line detection (no Journal or ManualJournal data type in MCP)
- Duplicate-journals / reversal-pair / round-tripping checks (all need Journal data)

## Output format

- Australian English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings in chat preview, bold key figures
- Single markdown table for the ranked list
- Never use emojis

## Always

- Never invent pattern labels. The label IS the data facet the XBerts already surface ("5 firings on Vendor X" not "round-tripping cluster").
- Never attribute a firing to a posting user, cardholder or employee — no such property exists on the data.
- Never claim Journal data — no Journal or ManualJournal data type in MCP today.
- Never auto-apply; never lodge; never send. Output is for review.
- If the linked-XBerts list is empty, stop and prompt the user — do not invent a fallback.
- Recurrence by vendor / account / period bucket is a deterministic fact (a count), not a pattern label.
