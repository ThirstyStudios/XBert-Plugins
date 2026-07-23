# XBert End-of-Period Dashboard

A cadence-aware per-client readiness view for period close — fuses XBert work, ledger data quality and lodgement obligations into one document.

## What it does
- Lets you pick the cadence (month, quarter or year) and runs the readiness view for that cycle
- Pulls outstanding work, data quality scores, reconciliation status, lock dates and validation results per client
- Bands every client (Ready / Almost / Blocked / At Risk) and ranks the book deadline-first
- Names the specific blockers per client rather than reporting generic categories
- Produces a Word document with a first-page summary and per-client detail for everyone not yet ready

## Prerequisites
- XBert account with workflow configured
- Client ledgers connected (Xero, QuickBooks)
- Practice operates in Australia (v1 is AU-only)

## Usage
After installing, type:

    /end-of-period-dashboard

in Claude Code or Claude Desktop.

## Support
hello@xbert.io
