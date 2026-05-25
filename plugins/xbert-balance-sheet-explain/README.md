# XBert Balance Sheet Explain

Walk a client's balance sheet opening to closing with movement narrative, reconciliation status, manual journal trace, and FAR-to-GL accumulated depreciation check. Produces a Word narrative review.

## What it does
- Pulls the comparative balance sheet, trial balance, AR/AP ageing, and manual journals
- Walks every line opening to closing with $ and % movement
- States the reconciliation status of cash, receivables, payables, and the fixed asset register
- Traces every material manual journal with a confidence label
- Flags unexpected movers — material movements without an obvious source
- Produces a Word narrative review ready for partner or auditor

## Prerequisites
- XBert account
- Comparative period available on the ledger (opening + closing balance sheets)
- Fixed asset register populated where the client carries depreciable assets

## Usage
After installing, type:

    /balance-sheet-explain

in any Claude chat (Desktop or Code).

## Scope notes
- Read-only. Every clean-up journal is **proposed** — nothing is auto-posted.
- Confidence labels (Direct / Likely / Needs review) appear on every journal trace and clean-up recommendation.

## Support
hello@xbert.io
