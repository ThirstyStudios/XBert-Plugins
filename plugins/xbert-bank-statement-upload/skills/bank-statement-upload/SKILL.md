---
name: bank-statement-upload
description: "Convert a client's bank statement (any common format) into the exact upload file their accounting system can ingest. Use this skill when the user asks to import a bank statement, convert a PDF statement to CSV/Excel, prepare statements for upload into Xero/MYOB/QuickBooks, or runs the /bank-statement-upload slash command. Also triggers on: 'this PDF won't import', 'need to load historic statements', 'bank doesn't have a feed', or any new-client onboarding scenario involving manual statement loading."
---

# Bank Statement Upload

## Goal
Take any common bank statement format the client supplies (PDF, CSV, OFX, QIF, Excel) and produce the upload file the target accounting system will accept on the first attempt. Confirm row-level accuracy with the human before output drops — this is a confirm-and-ship workflow, not a fire-and-forget one.

## Metrics
- **Row-extract confidence** — per-row score from semantic extraction (0.0-1.0).
- **Statement reconciliation** — opening balance + sum(transactions) = closing balance. Any mismatch is a hard stop.
- **Period overlap** — overlap with previously uploaded statements (existing transactions in the target system).
- **Format compliance** — output matches the target system's column order, date format, amount sign convention, and encoding.

## Default thresholds (practice-configurable)
| Band | Threshold |
|---|---|
| Auto-pass row | confidence >= 0.85 AND fields all present |
| Flag for review | confidence < 0.85 OR missing field (date / amount / description) OR amount unparseable |
| Hard stop | reconciliation mismatch > $0.01 OR > 5% of rows flagged |
| Period overlap warning | any transaction date inside an already-uploaded statement period |

## Process / rules

1. **Identify target system first.** Output format is decided by Xero / MYOB / QuickBooks Online — never produce a generic CSV. Per-system specs:
   - **Xero CSV**: columns `Date, Amount, Payee, Description, Reference, Cheque Number`. Date format `dd/mm/yyyy`. Negative amounts for debits.
   - **MYOB import (.txt or .qif)**: tab-delimited. Date format `dd/mm/yyyy`. Separate debit + credit columns.
   - **QuickBooks Online CSV**: columns `Date, Description, Amount`. Single amount column with sign. Date format `dd/mm/yyyy`.
2. **Extract by format**:
   - PDF: run text extraction then line-item structuring. Capture confidence per row.
   - CSV/Excel: detect header row, map columns by name (date/desc/amount/balance) with fuzzy matching.
   - OFX/QIF: parse natively — these formats are deterministic, confidence = 1.0.
3. **Reconcile**: opening balance + sum(rows) must equal closing balance to within $0.01. If not, stop and ask the user to confirm the source file isn't truncated.
4. **Period-overlap check**: pull existing bank statements for the same account and warn if any new transaction date falls inside a previously uploaded period. Recommend the user trim the input range rather than introduce duplicates.
5. **Confirm step is non-negotiable**: render the parsed rows in chat (or a summary if > 50 rows: counts + flagged-row detail) and require explicit user approval before generating the output file.
6. **Flagged-row handling**: walk the user through each flagged row one at a time — accept as-is, edit fields inline, or drop. Track edits in the audit trail.
7. **Output naming**: `<client-shortname>-<bank-account-name>-<yyyy-mm>-to-<yyyy-mm>.<ext>` — keeps it findable and unambiguous.

## Always
- Never auto-apply or auto-upload — this plugin produces a file; the bookkeeper triggers the upload in the ledger
- Always show a row preview and require explicit confirmation before file generation
- Always reconcile the statement maths; a mismatch is a hard stop, not a warning
- Always check for period overlap and warn — duplicate transactions are worse than missing ones
- Format the output to the exact target-system spec; a "close enough" CSV is a failed upload
- Note when source extraction confidence is sparse (PDF scans, faxed copies) — recommend the user spot-check more aggressively
- Australian English in all chat output and filenames
