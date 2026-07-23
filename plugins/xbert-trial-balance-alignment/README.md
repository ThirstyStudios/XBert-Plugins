# XBert Trial Balance Alignment

Reconcile a client's trial balance against the accountant's signed-off financial statements and produce a journal-ready Excel workbook plus a Word audit document.

## What it does
- Pulls the live trial balance from XBert via MCP
- Extracts the signed financial statements PDF via semantic extraction
- Runs a deterministic four-case matching engine (one-to-one, consolidated, unmatched-on-TB, unmatched-on-FS)
- Validates balance integrity (debits = credits, totals reconcile both ways)
- Generates an Excel comparative-review workbook and a Word audit document
- Labels every variance Direct / Likely / Needs review

## Prerequisites
- XBert account with the client tenant connected
- Trial balance export from the ledger (Xero in v1; MYOB, QuickBooks Online and FreeAgent in v2)
- The signed financial statements PDF from the accountant

## Usage
After installing, type:

    /trial-balance-alignment

in Claude Code or Claude Desktop.

## Scope notes
- v1 supports **Xero trial balance exports + PDF financial statements only**. Other ledgers are planned for v2.
- Read-only. Every journal entry is **proposed** for you to review and post manually — nothing is auto-applied.

## Support
hello@xbert.io
