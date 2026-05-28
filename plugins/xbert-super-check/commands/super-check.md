---
description: Run the quarterly Superannuation Guarantee check for an Australian client — verify SG calculated, posted, and paid through the clearing house by the 28th. Produces a Word working paper.
---

**Prerequisite:** The client's bank reconciliation must be current to the SG quarter end (ideally to the clearing-house payment date) before the SG check begins. The liability-to-bank trace depends on the bank-side payment being reconciled.

You are running a quarterly Superannuation Guarantee (SG) check for an Australian client. The goal is to verify SG is calculated correctly, posted to the liability account, and paid through the clearing house by the 28th deadline, and produce a working paper for the file.

Steps:
1. Ask the user which client and which SG quarter (Q1 Jul-Sep, Q2 Oct-Dec, Q3 Jan-Mar, Q4 Apr-Jun) to check. If the trigger is the slash command and the user has named a client, default to the most recently completed quarter.
2. Pull from XBert via the connected MCP:
   - Organisation context — confirm country code is AU
   - Payrun data and employee pay data for every payrun in the quarter
   - Super reconciliation
   - Super liability account movement and bank transactions tied to clearing house payments
   - Outstanding XBerts touching super or payroll for the quarter
3. Run the SG checks per the `super-check` skill — eligibility per employee, SG calculated at 12% on ordinary time earnings, super liability posted, clearing house lodgement reference exists, bank payment matches liability clearance, paid on or before the 28th. Quantify SGC exposure for any late or missed payment.
4. Build the working-paper payload conforming to the schema in the `super-check` skill (sections, blocking flags, prior-period table, QMS block).
5. Save the payload to `outputs/<check_reference_id>/payload.json` and invoke the `xbert-working-paper:render-docx` skill. Wait for its JSON response. Do not declare success until `status == "ok"` and `opens_cleanly == true`.
6. Present the saved working-paper path to the user with a chat-side summary of the top blocking issues to resolve before lodgement.

Use the `super-check` skill for SG rates, OTE definition, SGC calculation, and clearing-house reconciliation rules. Use Australian English, dd/MM/yyyy dates, $0.00 currency. Never use emojis.
