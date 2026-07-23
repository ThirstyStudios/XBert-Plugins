# XBert GST Prep (NZ)

Pre-lodgement GST readiness check for New Zealand clients. Verifies the books are ready and produces a Word audit document for IRD filing.

## What it does
- Pulls bank reconciliation, GST boxes 5-15, control accounts, KiwiSaver / PAYE liabilities, AP, AR and outstanding XBerts from XBert
- Computes GST on sales (Box 8 = Box 7 x 3/23) and GST on purchases (Box 12 = Box 11 x 3/23)
- Compares the period to the prior GST period and flags variances
- Respects March (due 7 May) and November (due 15 January) special due dates
- Produces a Word audit document with a unique check reference ID and QMS certification

## Prerequisites
- XBert account
- Client connected to a New Zealand-domiciled ledger
- GST registration and filing frequency (monthly / two-monthly / six-monthly) configured

## Usage
After installing, type:

    /gst-prep-nz

in Claude Code or Claude Desktop.

## Support
hello@xbert.io
