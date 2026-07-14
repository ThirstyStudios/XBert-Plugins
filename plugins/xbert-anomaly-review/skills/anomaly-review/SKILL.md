---
name: anomaly-review
description: Anomaly-review methodology — verify the Anomaly Review agent is configured with linked XBerts, then present every anomaly XBert that fired across the period as a flat ranked list with per-firing verification and recommended action. No invented pattern labels, no user attribution, no Journal data. Use when the user asks to review anomalies, run an anomaly sweep, debug a recurring anomaly, or runs the /anomaly-review slash command. Also triggers on "anomaly review", "GL anomaly sweep", "fire XBert review", "anomaly evidence pack".
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Anomaly Review

A per-firing review of every anomaly XBert that fired across the period. Detection is owned deterministically by Custom XBerts (the XBerts are the heroes); this skill surfaces what they caught, verifies each firing against the underlying records, presents them as a ranked list, and drives resolution per firing.

## Goal

Convert the period's anomaly XBert firings into a single ranked list the reviewer can walk top-to-bottom, with the underlying transaction, a verification result, and a recommended next action per firing. Optionally sub-group on deterministic facets (vendor, account, period bucket) — never under invented pattern labels.

## What the XBerts can deterministically detect (on the available data types)

The supported set of anomaly patterns is bounded by what the linked Custom XBerts can detect on Bill / BankTransaction / Invoice / Contact / account balances. Typical examples:

- Same vendor + amount + date appearing more than once on Bill or BankTransaction
- Period-over-period balance jump in an account beyond expected variance
- Same vendor coded to a different account than its recurring pattern
- Round-number-recurring vendor postings
- Volume spikes per vendor or per account in the period

The agent reasons only over what the customer's linked XBerts have actually wired up — never assume the list above is what's enabled in any given portal. Surface what fired; don't invent what didn't.

## Metrics

- **Firings in period** — total count surfaced by the linked anomaly XBerts (must reconcile to `totalLinkedXBerts` from `Data_GetLinkedXBertsForAgent`)
- **Recurrence by vendor** — vendors with two or more firings (deterministic fact, not pattern label)
- **Recurrence by account** — accounts with two or more firings
- **Recurrence by period bucket** — firings spiked within a date range (e.g. last week of the period)

## Methodology

1. **Plugin version.** Read `version` from this plugin's `.claude-plugin/plugin.json` (the installed plugin directory; `${CLAUDE_PLUGIN_ROOT}` when available). Use `"unknown"` if unreadable. It goes into the payload as `plugin_version` and into the QMS block.
2. **Agent setup gate.** Call `Data_GetAgentSetupStatus` with `agentCommand: "anomaly-review"`. If `setup.configured` is false — agent missing, inactive, or with no linked XBerts — STOP. Relay the tool's `reason` and `guidance`: the user must add the Anomaly Review agent in the XBert Connect portal via **Automation → Agents → Browse Agents**, then link the Custom XBerts that should drive the review (Agent → Linked XBerts). If the tool is not available on the connected gateway, STOP with the same setup message. NEVER fall back to `Data_XBertNotificationSummary`, `Features_GetWork`, or any generic worklist tool — a dump of all outstanding XBerts is not an anomaly review.
3. **Pull firings.** Call `Data_GetLinkedXBertsForAgent` with the gate's `agentId` for the client and period, with the underlying Bill / BankTransaction / Invoice / account balance and the vendor / account context. The response is the complete set — no cap, no pagination; the ranked list must contain exactly `totalLinkedXBerts` rows, never a subset presented as the review. State the period window and date anchor (transaction date, falling back to detection date) in the output; flag any firing dated outside the window or in the future instead of silently including it.
4. **Verify per firing.** Before recommending an action, check the firing against the underlying records: duplicate-contact firings need both contact records compared on ABN/tax number and address via `Data_Contacts_Get` (different ABN/address = likely false positive — recommend reviewing the XBert, not merging); overdue-invoice firings need the invoice's current outstanding amount confirmed via `Data_Invoices` (settled = stale firing — recommend resolving in XBert, not chasing the client).
5. **Rank.** Order by impact (use the XBert's reported amount and / or risk level as the sort key). One row per firing, carrying its source `notificationId`.
6. **XBert health check.** For each linked XBert with contradicted or suspect firings, compare its intent (natural-language rule) against what the evidence showed and propose a concrete prompt refinement (exclusion term, word-boundary match, additional field check such as ABN or account class). The user applies the change in the XBert portal — this skill never edits an XBert.
7. **Sub-group on deterministic facets (optional).** If the list is long, sub-group by vendor, by account, or by period bucket. The label IS the data facet — never invent a pattern label.
8. **Per-firing action.** Propose the next action per firing: recode, request supporting doc, accept-as-correct, escalate, resolve-as-stale, or flag-XBert-for-review. Don't draft client communications.
9. **Compose evidence pack.** Cover page, ranked list, XBert health check, optional facet sub-groupings with counts, source links to every XBert firing.

## Evidence pack structure

1. Cover page — client name, period, generation date
2. Summary — total firings (reconciled to the tool's count), recurrence by vendor / account / period bucket (counts only)
3. Ranked list — one row per firing with the data above, including verification result and source notificationId
4. XBert health check — per linked XBert with suspect firings: intent, observed gap, suggested prompt refinement
5. Optional facet sub-groupings — counts per vendor / account / period bucket where useful
6. Source links — hyperlinks to every underlying XBert firing
7. QMS block — practice name + ID, preparer name + ID, timestamp, unique check reference ID, plugin version, compliance statement

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

- Run the agent setup gate first. If the Anomaly Review agent is not configured with linked XBerts, stop and walk the user through setup — do not substitute generic worklist data.
- Never invent pattern labels. The label IS the data facet the XBerts already surface ("5 firings on Vendor X" not "round-tripping cluster").
- Never attribute a firing to a posting user, cardholder or employee — no such property exists on the data.
- Never claim Journal data — no Journal or ManualJournal data type in MCP today.
- Never auto-apply; never lodge; never send. Output is for review.
- Every figure and row must be traceable to an MCP tool response from this run — carry the source `notificationId` per firing and never present records the tools did not return.
- Verify duplicate-contact firings on ABN/address and overdue-invoice firings on current outstanding amount before recommending merge or collections.
- Recurrence by vendor / account / period bucket is a deterministic fact (a count), not a pattern label.

## Payload schema

After running the analysis, structure the result as JSON conforming to the render-docx payload schema (defined in `xbert-working-paper/skills/render-docx/SKILL.md`). Required fields:

- `plugin`: `"xbert-anomaly-review"`
- `plugin_version`: the version read in Methodology step 1
- `check_reference_id`: a unique ID for the run
- `tenant_name`, `period`, `prepared_by`, `prepared_at`
- `title`, `subtitle` (optional)
- `executive_summary`: two sentences naming the headline finding
- `sections[]`: one entry per major finding, each with `heading`, `body`, optional `blocking: true`, optional `table` with `columns` and `rows` — including a "XBert health check" section when step 6 produced findings
- `qms_block`: `{ firm_name, preparer, reviewer, certification }`
- `appendix[]` (optional)

Section ordering and content must match the document structure described above.

## Output handoff

1. Save the payload to `outputs/<check_reference_id>/payload.json`.
2. Invoke the `xbert-working-paper:render-docx` skill. It will write `outputs/<check_reference_id>/working-paper.docx` and emit a single JSON line on stdout with `status`, `path`, `exists`, `size_bytes`, `opens_cleanly`, `paragraph_count`.
3. Pass the path and a one-line summary back to the user.

## Verification gate

Do not report the document as produced until the render skill's JSON has `status == "ok"` and `opens_cleanly == true`. If the gate fails, surface the JSON to the user verbatim and stop — do not retry silently and do not claim success.
