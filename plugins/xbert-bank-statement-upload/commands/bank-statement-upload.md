---
description: Convert any bank statement (PDF, CSV, OFX, QIF, Excel) into the upload file your accounting system needs — with a confirm step before output.
---

You are running the Bank Statement Upload workflow for a bookkeeping practice.

Steps:
1. Confirm scope with the user: (a) which client tenant, (b) the source file path or attachment, (c) the target accounting system (Xero, MYOB, QuickBooks Online), and (d) the bank account in the ledger the statement belongs to. If the trigger is the slash command and any of these are missing, ask.
2. Pull from XBert via the connected MCP:
   - Existing bank accounts on the client tenant — use this to validate the user's nominated bank account exists and to pull the account name/code for the output file header
   - Existing bank statement history if any, to detect overlap with the new statement period
3. Extract and parse the source file:
   - For PDFs: run text extraction to get raw text, then structure it into date / description / debit / credit / balance rows
   - For CSV / OFX / QIF / Excel: detect the format and map columns to the canonical schema (date, description, amount, balance)
   - Capture a per-row confidence score; any row below threshold (default 0.85) is flagged for human review
4. Analyse using the `bank-statement-upload` skill:
   - Validate statement period against existing history — warn on overlap, warn on gaps
   - Reconcile opening + sum(transactions) = closing balance; flag any arithmetic mismatch
   - Classify rows as high-confidence (auto-pass) vs low-confidence (flagged) per the skill thresholds
5. Present a confirmation table in chat: total rows parsed, rows passing automatically, rows flagged for review (with reasons). Walk the user through any flagged rows one-by-one — accept as-is, edit, or reject.
6. Only after the user explicitly confirms, generate the target upload file:
   - Produce the file in the target system's required format
   - Match the exact column order, date format, and amount sign convention the target system expects (per the skill's per-system specs)
   - Drop the file to the user's file system with a descriptive filename: `<client>-<account>-<period>.<ext>`
7. Summarise: rows included, rows excluded, file path, and the next step (upload into the target ledger).

Use the `bank-statement-upload` skill for the methodology, per-system upload format specifications, and confidence-band thresholds. Never auto-generate the output file without explicit user confirmation of the row preview.
