---
description: Run the pre-lodgement IAS readiness check for an Australian client and produce a Word audit document with the supporting evidence.
---

You are running IAS (Instalment Activity Statement) preparation for an Australian client. The goal is to determine whether the client is ready to lodge for the nominated IAS period and produce an audit document for the file.

Steps:
1. Ask the user which client and which IAS period to check (month-end date). If the trigger is the slash command and the user has named a client and period, proceed.
2. Pull from XBert via the connected MCP:
   - Organisation context (try `Data_GetOrganisation` — confirm country code is AU and IAS reporting obligation — or `tools_search` if the name differs)
   - Bank reconciliation status (try `Data_GetBankReconciliation` and `Data_GetReconciliationStatus`)
   - Payrun data and W1 source (gross wages) plus W2 source (tax withheld) (try `Data_GetPayRunData` and `Data_GetPayrollReconciliation`)
   - Superannuation posting status (try `Data_GetSuperReconciliation`)
   - PAYG instalment amounts (T7, T11) if applicable
   - Outstanding XBerts for the period (try `Data_XBertNotificationSummary` per client)
3. Run the readiness checks per the `ias-prep` skill — bank rec, payroll data, PAYG-W labels W1-W5, super posting, PAYGW liability balance, outstanding XBerts. ALL outstanding XBerts block lodgement.
4. Generate a Word document (try `GenerateWord` or `tools_search`) containing:
   - Cover page with client name, ABN, IAS period, generation date
   - First-page summary of readiness status and blocking issues
   - Each readiness section with pass/fail and supporting evidence
   - QMS block: practice name, preparer, timestamp, unique check reference ID, compliance statement
5. Present the document to the user with a chat-side summary of the top blocking issues to resolve before lodgement. Never auto-resolve XBerts — surface them with resolution instructions only.

Use the `ias-prep` skill for label definitions and audit-document structure. Use Australian English (organisation, behaviour, colour), dd/MM/yyyy dates, and $0.00 currency formatting. Never use emojis.
