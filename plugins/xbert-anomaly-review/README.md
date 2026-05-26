# XBert Anomaly Review

Surface every anomaly XBert that fired across the period as a flat ranked list, with the underlying transaction and a per-firing recommended action.

## What it does
- Resolves the period's linked anomaly XBert firings
- Presents them as a ranked list: posting date, doc number, vendor, amount, account, the XBert that fired and its reason, the recurrence count by vendor or account, the recommended next action
- Optionally sub-groups on deterministic facets (by vendor, by account, by period bucket) where the list is long
- Produces an evidence pack with hyperlinks back to every source XBert firing

## What it explicitly does NOT do (no backing data in MCP today)
- Identify the posting user / created-by-user (no user property on any data type)
- Time-of-day or after-hours posting patterns (only created-date is available)
- Intent-based detection (round-tripping by intent) — intent is not a data property
- Named pattern clusters (e.g. "duplicate-journal cluster") — the agent presents what fired; doesn't invent labels the XBerts cannot independently confirm
- Cluster-level resolution status tracking (no cluster / case / resolution-status entity)
- Journal-line / Manual-Journal detection (no Journal or ManualJournal data type in MCP) — duplicate-journals, reversal-pair and round-tripping checks all need Journal data

If a Custom XBert lands later that captures any of these signals deterministically, the plugin will surface them; until then the agent says so honestly rather than invent the signal.

## Prerequisites
- XBert account
- Client connected to a ledger
- Anomaly XBerts linked to the Anomaly Review agent in the Connect portal

## Usage
After installing, type:

    /anomaly-review

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
