---
description: Run the pre-submission VAT readiness check for a UK client — boxes 1-9 validated, MTD compliance verified, partial exemption and reverse charge flagged. Produces a Word audit document.
---

**Prerequisite:** The client's bank reconciliation must be current to the period-end date (ideally a few days post period-end) before lodgement preparation. If outstanding bank lines exist for the period, surface them in the readiness check and pause until cleared.

You are running VAT (Value Added Tax) preparation for a UK client. The goal is to determine whether the client is ready to submit their VAT return to HMRC for the nominated period and produce an audit document for the file.

Steps:
1. Ask the user which client and which VAT period to check (quarter end date, or month-end if monthly filer). If the trigger is the slash command and the user has named a client and period, proceed.
2. Pull from XBert via the connected MCP:
   - Organisation context — confirm country code is GB, VAT scheme, MTD status
   - Data quality score — score must be >= 50 to proceed
   - Lock date status — prior period must be locked
   - Bank reconciliation status
   - VAT boxes 1-9 calculated from sales and purchases
   - VAT control account movements — output VAT, input VAT, suspense
   - PAYE / NI reconciliation
   - Outstanding XBerts for the period
   - Prior-period VAT for variance comparison
3. Run the readiness checks per the `vat-prep` skill — data quality, lock dates, bank rec, VAT control accounts, VAT code accuracy, zero-rated vs exempt, credit notes, P&L review, balance sheet, payroll & PAYE, AP, AR, cash flow, outstanding XBerts, MTD compliance, reverse charge, partial exemption. ALL outstanding XBerts block submission.
4. Build the working-paper payload conforming to the schema in the `vat-prep` skill (sections, blocking flags, prior-period table, QMS block).
5. Save the payload to `outputs/<check_reference_id>/payload.json` and invoke the `xbert-working-paper:render-docx` skill. Wait for its JSON response. Do not declare success until `status == "ok"` and `opens_cleanly == true`.
6. Present the saved working-paper path to the user with a chat-side summary of the top blocking issues to resolve before lodgement.

Use the `vat-prep` skill for box definitions, VAT rates, MTD rules, reverse charge and partial exemption guidance, and the audit-document structure. Use British English (organisation, behaviour, colour), dd/MM/yyyy dates, and £0.00 currency formatting. Never use emojis.
