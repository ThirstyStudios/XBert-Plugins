---
description: Run the pre-lodgement BAS readiness check for an Australian client and produce a Word audit document with the supporting evidence.
---

You are running BAS (Business Activity Statement) preparation for an Australian client. The goal is to determine whether the client is ready to lodge for the nominated BAS period and produce an audit document for the file.

Steps:
1. Ask the user which client and which BAS period to check (quarter end date, or month-end if monthly filer). If the trigger is the slash command and the user has named a client, proceed.
2. Pull from XBert via the connected MCP:
   - Organisation context (try `Data_GetOrganisation` — confirm country code is AU, financial method, GST registration — or `tools_search` if the name differs)
   - Bank reconciliation status across every bank account (try `Data_GetBankReconciliation` and `Data_GetReconciliationStatus`)
   - GST labels — sales (G1, G2, G3), purchases (G10, G11), and computed 1A / 1B (try `Data_GetGSTSummary` or `tools_search`)
   - PAYG withholding labels W1-W5 against payrun totals (try `Data_GetPayrollReconciliation`)
   - Superannuation posting and payment status (try `Data_GetSuperReconciliation`)
   - Outstanding XBerts for the period (try `Data_XBertNotificationSummary` per client)
   - Prior-period BAS for variance comparison
3. Run the readiness checks per the `bas-prep` skill — bank rec, GST data, PAYG-W, payroll, super, P&L review, balance sheet review, fixed assets, AP, AR, cash flow, outstanding XBerts, liability balances. ALL outstanding XBerts block lodgement.
4. Generate a Word document (try `GenerateWord` or `tools_search`) containing:
   - Cover page with client name, ABN, BAS period, generation date
   - First-page summary of readiness status and blocking issues
   - Each readiness section with pass/fail and supporting evidence
   - Prior-period variance comparison with explanations
   - QMS block: practice name, preparer, timestamp, unique check reference ID, compliance statement
5. Present the document to the user with a chat-side summary of the top blocking issues to resolve before lodgement. Never auto-resolve XBerts — surface them with resolution instructions only.

Use the `bas-prep` skill for thresholds, label definitions, and audit-document structure. Use Australian English (organisation, behaviour, colour), dd/MM/yyyy dates, and $0.00 currency formatting. Never use emojis.
