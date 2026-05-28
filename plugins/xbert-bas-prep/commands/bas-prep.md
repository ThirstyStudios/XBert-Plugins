---
description: Run the pre-lodgement BAS readiness check for an Australian client and produce a Word audit document with the supporting evidence.
---

**Prerequisite:** The client's bank reconciliation must be current to the period-end date (ideally a few days post period-end) before lodgement preparation. If outstanding bank lines exist for the period, surface them in the readiness check and pause until cleared — unreconciled bank lines distort GST, PAYG-W, and the control-account checks.

You are running BAS (Business Activity Statement) preparation for an Australian client. The goal is to determine whether the client is ready to lodge for the nominated BAS period and produce an audit document for the file.

Steps:
1. Ask the user which client and which BAS period to check (quarter end date, or month-end if monthly filer). If the trigger is the slash command and the user has named a client, proceed.
2. Pull from XBert via the connected MCP:
   - Organisation context — confirm country code is AU, financial method, GST registration
   - Bank reconciliation status across every bank account
   - GST labels — sales (G1, G2, G3), purchases (G10, G11), and computed 1A / 1B
   - PAYG withholding labels W1-W5 against payrun totals
   - Superannuation posting and payment status
   - Outstanding XBerts for the period
   - Prior-period BAS for variance comparison
3. Run the readiness checks per the `bas-prep` skill — bank rec, GST data, PAYG-W, payroll, super, P&L review, balance sheet review, fixed assets, AP, AR, cash flow, outstanding XBerts, liability balances. ALL outstanding XBerts block lodgement.
4. Build the working-paper payload conforming to the schema in the `bas-prep` skill (sections, blocking flags, prior-period table, QMS block).
5. Save the payload to `outputs/<check_reference_id>/payload.json` and invoke the `xbert-working-paper:render-docx` skill. Wait for its JSON response. Do not declare success until `status == "ok"` and `opens_cleanly == true`.
6. Present the saved working-paper path to the user with a chat-side summary of the top blocking issues to resolve before lodgement.

Use the `bas-prep` skill for thresholds, label definitions, and audit-document structure. Use Australian English (organisation, behaviour, colour), dd/MM/yyyy dates, and $0.00 currency formatting. Never use emojis.
