---
description: Run the PAYE, payroll and pension control account review for a UK client — reconcile to HMRC RTI submissions, verify auto-enrolment compliance, produce a Word audit document.
---

You are running a PAYE compliance review for a UK client. The goal is to reconcile the PAYE, payroll and pension control accounts to source and produce an audit document for the file.

Steps:
1. Ask the user which client and which period to review (month or pay period). If the trigger is the slash command and the user has named a client, default to the most recently completed pay period.
2. Pull from XBert via the connected MCP:
   - Organisation context (try `Data_GetOrganisation` — confirm country code is GB — or `tools_search`)
   - Payrun data and RTI submission references (try `Data_GetPayRunData` and `Data_GetEmployeePayData`)
   - Payroll reconciliation (try `Data_GetPayrollReconciliation`)
   - PAYE control account (PAYGLIABILITY classification) movements (try `Data_GetBalanceSheet`)
   - Pension liability account (SUPERANNUATIONLIABILITY classification) movements
   - Outstanding XBerts touching payroll for the period
3. Run the checks per the `paye-prep` skill — PAYE control reconciles to RTI submissions (FPS / EPS), payroll control matches gross pay, pension liability matches employer plus employee contributions, auto-enrolment rates verified (3% employer, 8% total minimum), HMRC payment deadlines (22nd electronic / 19th cheque), aged balances over three months flagged.
4. Generate a Word document (try `GenerateWord` or `tools_search`) containing:
   - Cover page with client name, PAYE reference, period, generation date
   - First-page summary of readiness status and compliance gaps
   - PAYE control reconciliation — opening, payrun postings, HMRC payment, closing
   - Payroll control reconciliation — gross pay matched to payroll reports
   - Pension liability reconciliation — employer plus employee, qualifying earnings, contribution rates
   - Aged-balance section — any balance over three months with the period it relates to
   - HMRC deadline status — next payment due, amount
   - QMS block: practice name, preparer, timestamp, check reference ID
5. Present the document to the user with a chat-side summary of any aged balances or compliance gaps to action.

Use the `paye-prep` skill for HMRC rules, RTI requirements, auto-enrolment thresholds and the audit-document structure. Use British English (organisation, behaviour, colour), dd/MM/yyyy dates, £0.00 currency. Never use emojis.
