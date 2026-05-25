---
description: Run the pre-submission VAT readiness check for a UK client — boxes 1-9 validated, MTD compliance verified, partial exemption and reverse charge flagged. Produces a Word audit document.
---

You are running VAT (Value Added Tax) preparation for a UK client. The goal is to determine whether the client is ready to submit their VAT return to HMRC for the nominated period and produce an audit document for the file.

Steps:
1. Ask the user which client and which VAT period to check (quarter end date, or month-end if monthly filer). If the trigger is the slash command and the user has named a client and period, proceed.
2. Pull from XBert via the connected MCP:
   - Organisation context (try `Data_GetOrganisation` — confirm country code is GB, VAT scheme, MTD status — or `tools_search`)
   - Data quality score (try `Data_GetDataQualityScore` — score must be >= 50 to proceed)
   - Lock date status — prior period must be locked
   - Bank reconciliation status (try `Data_GetBankReconciliation` and `Data_GetReconciliationStatus`)
   - VAT boxes 1-9 calculated from sales and purchases (try `Data_GetVATSummary` or `tools_search`)
   - VAT control account movements — output VAT, input VAT, suspense (try `Data_GetBalanceSheet`)
   - PAYE / NI reconciliation (try `Data_GetPayrollReconciliation`)
   - Outstanding XBerts for the period (try `Data_XBertNotificationSummary` per client)
   - Prior-period VAT for variance comparison
3. Run the readiness checks per the `vat-prep` skill — data quality, lock dates, bank rec, VAT control accounts, VAT code accuracy, zero-rated vs exempt, credit notes, P&L review, balance sheet, payroll & PAYE, AP, AR, cash flow, outstanding XBerts, MTD compliance, reverse charge, partial exemption. ALL outstanding XBerts block submission.
4. Generate a Word document (try `GenerateWord` or `tools_search`) containing:
   - Cover page with client name, VAT number, VAT period, generation date
   - First-page summary of readiness status and blocking issues
   - Each readiness section with pass/fail and supporting evidence
   - Prior-period variance comparison with explanations
   - QMS block: practice name, preparer, timestamp, unique check reference ID, compliance statement
5. Present the document to the user with a chat-side summary of the top blocking issues to resolve before submission. Never auto-resolve XBerts.

Use the `vat-prep` skill for box definitions, VAT rates, MTD rules, reverse charge and partial exemption guidance, and the audit-document structure. Use British English (organisation, behaviour, colour), dd/MM/yyyy dates, and £0.00 currency formatting. Never use emojis.
