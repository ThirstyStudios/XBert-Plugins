# XBert Bank Statement Upload

Convert any bank statement format (PDF, CSV, OFX, QIF, Excel) into the exact upload file your accounting system needs — with a row-by-row confirm step before output drops.

## What it does
- Extracts transactions from PDF, CSV, OFX, QIF, or Excel statements
- Flags low-confidence rows for human review before output
- Reconciles opening + transactions = closing balance as a hard stop
- Warns on period overlap with previously uploaded statements
- Produces the upload file in the exact format Xero, MYOB, or QuickBooks Online expects

## Prerequisites
- XBert account
- A bank statement file from the client (PDF, CSV, OFX, QIF, or Excel)
- The target accounting system identified (Xero, MYOB, or QuickBooks Online)
- The bank account already configured on the client tenant in the ledger

## Usage
After installing, type:

    /bank-statement-upload

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
