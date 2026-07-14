# XBert Anomaly Review

Surface every anomaly XBert that fired across the period as a flat ranked list, with the underlying transaction and a per-firing recommended action.

## What it does
- Checks the Anomaly Review agent is set up in your Connect portal with linked Custom XBerts before reviewing — if not, it stops and walks you through the setup rather than reviewing generic worklist data
- Resolves the period's linked anomaly XBert firings
- Verifies each firing against the underlying records before recommending an action (e.g. ABN/address comparison on duplicate-contact firings, current outstanding amount on overdue-invoice firings)
- Presents them as a ranked list: posting date, doc number, vendor, amount, account, the XBert that fired and its reason, the verification result, the recurrence count by vendor or account, the recommended next action
- Flags XBerts whose firings contradict their intent, with a suggested prompt refinement to apply in the XBert portal
- Optionally sub-groups on deterministic facets (by vendor, by account, by period bucket) where the list is long
- Produces an evidence pack with hyperlinks back to every source XBert firing, stamped with the plugin version that produced it

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
- Anomaly Review agent added via **Automation → Agents → Browse Agents** in the Connect portal
- Anomaly XBerts linked to the Anomaly Review agent (Agent → Linked XBerts)
- XBert Working Paper companion plugin installed (renders the Word document)

## Usage
After installing, type:

    /anomaly-review

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
