# XBert Aged Receivables

Turn the aged receivables report into a prioritised debtor call list ranked by working-capital impact. Call the right debtor first; the bookkeeper makes the call and writes the message.

## What it does
- Scores debtors by working-capital impact (dollar × log(days overdue))
- Surfaces a top-N call list with named debtors, amounts, and ageing-bucket breakdowns
- Shows contact details (name, email, phone) and outstanding invoices for the next call
- Flags debtors needing attention (60+ days overdue, > $5k outstanding, or a large jump since the prior run) with the reason

## Out of scope (no backing data in XBert today)
- Prior-promise history (kept / broken)
- Payment-reliability weighting per debtor
- Stop-supply / handover-to-recovery status
- Drafted reminder copy in practice tone
- Broken-promise-after-N-days flags

If your portal has Custom XBerts that deterministically capture any of these signals, they appear via the regular XBert surface — the plugin surfaces what the XBerts caught rather than inventing the signal.

## Prerequisites
- XBert account
- Client with sales/AR ledger connected (Xero, MYOB, or QuickBooks Online)
- At least one overdue invoice on file

## Usage
After installing, type:

    /aged-receivables

in Claude Code or Claude Desktop.

## Support
hello@xbert.io
