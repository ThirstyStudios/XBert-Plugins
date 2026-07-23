# XBert AR Cadence

Behaviour-driven AR cadence. For each debtor: predicted pay-date from historic latency, recommended reminder window, and drafted reminder text in the firm's tone. Output is a ranked call list — no auto-send.

## What it does
- Computes per-debtor payment latency from historic pay-date vs. invoice due date
- Predicts pay-date for each open invoice (invoice due date + per-debtor latency)
- Recommends a reminder window per debtor — earlier for chronic latency, later for reliable payers
- Drafts each reminder in the firm's tone, matched to the debtor's reliability band
- Ranks the call list by recommended-action urgency

## Prerequisites
- XBert account
- Client with sales/AR ledger connected (Xero, MYOB, or QuickBooks Online)
- At least 60 days of debtor payment history for latency modelling

## Usage
After installing, type:

    /ar-cadence

in Claude Code or Claude Desktop.

## Support
hello@xbert.io
