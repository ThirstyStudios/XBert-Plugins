---
description: Run the annual STP Phase 2 finalisation check for an Australian client — verify every employee's YTD figures are accurate before the 14 July ATO deadline. Produces a Word working paper.
---

**Prerequisites — run-order matters:**
- **Run `/fbt-prep` FIRST** if the client provides any reportable fringe benefits. Reportable Fringe Benefit Amounts (RFBA) identified by the FBT scan flow into STP Phase 2; running STP finalisation first means RFBA gets under-reported on the income statement.
- The client's bank reconciliation must be current to 30 June (financial year end) before STP finalisation begins, so the GL payroll reconciliation behind the YTD check is trustworthy.

You are running an annual STP Phase 2 finalisation check for an Australian client. The goal is to verify each employee's year-to-date wages, PAYG withholding, super, allowances, RFB and termination payments are accurate before the FINAL event is sent to the ATO by the 14 July deadline.

Steps:
1. Ask the user which client and which financial year (default to the year ending 30 June just past). If the trigger is the slash command and the user has named a client, proceed.
2. Pull from XBert via the connected MCP:
   - Organisation context — confirm country code is AU, STP Phase 2 enabled
   - Full year payrun history and employee pay data
   - Payroll reconciliation against general ledger
   - Super reconciliation for YTD super contributions per employee
   - Employee STP classifications — income type, tax treatment code, country code
   - Outstanding XBerts touching payroll for the year
3. Run the finalisation checks per the `stp-finalisation` skill — per-employee YTD reconciliation, income-type mapping, allowance disaggregation, RFB threshold check, termination payment classification, missing TFN flags, year-end leave balance sanity check.
4. Build the working-paper payload conforming to the schema in the `stp-finalisation` skill (sections, blocking flags, prior-period table, QMS block).
5. Save the payload to `outputs/<check_reference_id>/payload.json` and invoke the `xbert-working-paper:render-docx` skill. Wait for its JSON response. Do not declare success until `status == "ok"` and `opens_cleanly == true`.
6. Present the saved working-paper path to the user with a chat-side summary of the top blocking issues to resolve before lodgement.

Use the `stp-finalisation` skill for Phase 2 income types, allowance categories, RFB rules and termination treatment. Use Australian English, dd/MM/yyyy dates, $0.00 currency. Never use emojis.
