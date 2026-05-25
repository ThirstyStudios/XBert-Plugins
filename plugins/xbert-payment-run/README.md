# XBert Payment Run

Weekly pay-run brief with remittance drafts ready for review. **v1 scope: pay schedule + remittance drafts. ABA payment file generation is v2 — for now, the bookkeeper still triggers the file generation in the ledger.**

## What it does
- Pulls aged payables and applies due-this-week + overdue inclusion logic
- Excludes held, disputed, unapproved, and out-of-window bills (surfaced with reasons)
- Groups included bills by supplier and produces a pay schedule
- Runs a cashflow check against the available bank balance (warns at 80%, stops above 100%)
- Drafts one PDF remittance advice per supplier, ready for review and email
- Surfaces early-payment discount opportunities

## v1 limitations
- This plugin does NOT generate the ABA payment file — that step stays in the ledger. v2 will add ABA file generation.

## Prerequisites
- XBert account
- Client with AP ledger connected (Xero, MYOB, or QuickBooks Online)
- Bank account configured for payment runs in the ledger

## Usage
After installing, type:

    /payment-run

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
