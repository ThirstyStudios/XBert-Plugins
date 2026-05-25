# XBert FS Pack

Year-end financial statement pack composed from your XBert ledger — SPFS structure by default, GPFS variant for audit clients. Partner-ready on the first pass.

## What it does
- Pulls balance sheet, profit and loss, cashflow, trial balance, and organisation settings
- Composes a cover page, directors' declaration, full primary statements, and notes-to-accounts shell
- Populates the comparative-period column on every primary statement
- Derives cashflow from operations using the indirect method when the ledger doesn't produce one
- Surfaces missing organisation settings (entity name, ABN, signing director) as blockers before generation
- Outputs both a Word file (for editing) and a PDF (for circulation)

## Prerequisites
- XBert account
- Closed financial year with comparative-period available
- Organisation settings populated (entity name, ABN, registered address)

## Usage
After installing, type:

    /fs-pack

in any Claude chat (Desktop or Code).

## Scope notes
- Default structure is **SPFS** (small proprietary company). Use the GPFS variant for audit-bound clients.
- Read-only — the pack does not post anything to the ledger.
- Both Word and PDF outputs are produced. Use Word for editing, PDF for circulation.

## Support
hello@xbert.io
