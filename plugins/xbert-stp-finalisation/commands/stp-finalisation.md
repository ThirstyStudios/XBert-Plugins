---
description: Run the annual STP Phase 2 finalisation check for an Australian client — verify every employee's YTD figures are accurate before the 14 July ATO deadline. Produces a Word working paper.
---

You are running an annual STP Phase 2 finalisation check for an Australian client. The goal is to verify each employee's year-to-date wages, PAYG withholding, super, allowances, RFB and termination payments are accurate before the FINAL event is sent to the ATO by the 14 July deadline.

Steps:
1. Ask the user which client and which financial year (default to the year ending 30 June just past). If the trigger is the slash command and the user has named a client, proceed.
2. Pull from XBert via the connected MCP:
   - Organisation context (try `Data_GetOrganisation` — confirm country code is AU, STP Phase 2 enabled — or `tools_search`)
   - Full year payrun history (try `Data_GetPayRunData` and `Data_GetEmployeePayData`)
   - Payroll reconciliation against general ledger (try `Data_GetPayrollReconciliation`)
   - Super reconciliation for YTD super contributions per employee (try `Data_GetSuperReconciliation`)
   - Employee STP classifications — income type, tax treatment code, country code (try `Data_GetPayrollSettings`)
   - Outstanding XBerts touching payroll for the year (try `Data_XBertNotificationSummary`)
3. Run the finalisation checks per the `stp-finalisation` skill — per-employee YTD reconciliation, income-type mapping, allowance disaggregation, RFB threshold check, termination payment classification, missing TFN flags, year-end leave balance sanity check.
4. Generate a Word document (try `GenerateWord` or `tools_search`) containing:
   - Cover page with client name, ABN, financial year, generation date
   - First-page summary — total employees, items needing correction, FINAL status
   - Per-employee YTD table — gross, PAYG-W, super, allowances by type, RFB, ETP / lump sums
   - Phase 2 classification verification per employee
   - Items requiring correction with the specific action needed before FINAL
   - QMS block: practice name, preparer, timestamp, check reference ID
5. Present the document to the user with a chat-side summary of any items needing correction before FINAL is sent. Never send the FINAL event from the plugin — the bookkeeper sends it from the ledger after the corrections are made.

Use the `stp-finalisation` skill for Phase 2 income types, allowance categories, RFB rules and termination treatment. Use Australian English, dd/MM/yyyy dates, $0.00 currency. Never use emojis.
