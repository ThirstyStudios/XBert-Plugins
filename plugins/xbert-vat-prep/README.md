# XBert VAT Prep (UK)

Pre-submission VAT readiness check for UK clients. Verifies the books are ready and produces a Word audit document for the file before MTD submission.

## What it does
- Pulls bank reconciliation, VAT boxes 1-9, control accounts, PAYE / NI, AP, AR and outstanding XBerts from XBert
- Runs the 17-point readiness checklist including MTD compliance, reverse charge, and partial exemption
- Compares the period to the prior VAT period and flags variances
- Produces a Word audit document with a unique check reference ID and QMS certification

## Prerequisites
- XBert account
- Client connected to a UK-domiciled ledger
- VAT registration with HMRC and MTD-compatible bridging in place

## Usage
After installing, type:

    /vat-prep

in Claude Code or Claude Desktop.

## Support
hello@xbert.io
