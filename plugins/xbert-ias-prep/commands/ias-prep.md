---
description: Run the pre-lodgement IAS readiness check for an Australian client and produce a Word audit document with the supporting evidence.
---

**Prerequisite:** The client's bank reconciliation must be current to the period-end date (ideally a few days post period-end) before lodgement preparation. If outstanding bank lines exist for the period, surface them in the readiness check and pause until cleared.

You are running IAS (Instalment Activity Statement) preparation for an Australian client. The goal is to determine whether the client is ready to lodge for the nominated IAS period and produce an audit document for the file.

Steps:
1. Ask the user which client and which IAS period to check (month-end date). If the trigger is the slash command and the user has named a client and period, proceed.
2. Pull from XBert via the connected MCP:
   - Organisation context — confirm country code is AU and IAS reporting obligation
   - Bank reconciliation status
   - Payrun data and W1 source (gross wages) plus W2 source (tax withheld)
   - Superannuation posting status
   - PAYG instalment amounts (T1, T2, T3, T4, T7, T8, T9, T11) if applicable
   - Outstanding XBerts for the period
3. Run the readiness checks per the `ias-prep` skill — bank rec, payroll data, PAYG-W labels W1-W5, super posting, PAYGW liability balance, outstanding XBerts. ALL outstanding XBerts block lodgement.
4. Build the working-paper payload conforming to the schema in the `ias-prep` skill (sections, blocking flags, prior-period table, QMS block).
5. Save the payload to `outputs/<check_reference_id>/payload.json` and invoke the `xbert-working-paper:render-docx` skill. Wait for its JSON response. Do not declare success until `status == "ok"` and `opens_cleanly == true`.
6. Present the saved working-paper path to the user with a chat-side summary of the top blocking issues to resolve before lodgement.

Use the `ias-prep` skill for label definitions and audit-document structure. Use Australian English (organisation, behaviour, colour), dd/MM/yyyy dates, and $0.00 currency formatting. Never use emojis.
