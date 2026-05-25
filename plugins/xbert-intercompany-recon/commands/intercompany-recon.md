---
description: Reconcile inter-entity loans, recharges, and trade balances across every group entity in one pass — per-entity worksheet plus consolidated reconciliation in an Excel workbook.
---

You are running the intercompany reconciliation workflow for an accountant in public practice. This is a multi-entity (group) workflow — the unlock is XBert's cross-tenant access.

Steps:
1. Confirm scope — which group of entities. Use the connected MCP to discover the related entities:
   - List accessible clients (try `Data_GetAllAccessibleClients` or `tools_search` if the name differs)
   - Pull explicit client connections / group structure (try `Data_GetClientConnections` or `tools_search`)
   - Confirm the entity set with the user before proceeding
2. For each entity in the group, pull from XBert via the connected MCP:
   - Closing balance sheet (try `Data_BalanceSheet` or `tools_search`)
   - Closing trial balance (try `Data_TrialBalance` or `tools_search`)
   - Contacts list, focusing on related-party contacts (try `Data_Contacts_Search` or `tools_search`)
   - Journal master for inter-entity activity in the period (try `Data_JournalMaster_Search` or `tools_search`)
3. Run the intercompany matching from the `intercompany-recon` skill:
   - Identify related-party account types per entity (Loan To / Loan From / Recharge / Trade with related party)
   - Pair every Loan To on one side with a Loan From on the other
   - Reconcile recharge accounts both directions
   - Flag every mismatch (one side recorded, other didn't; different amounts; different GST treatment)
   - For each mismatch, propose the missing-side journal entry
4. Generate the deliverable Excel workbook (try `Utility_GenerateExcel` or `tools_search`):
   - One tab per entity with the related-party section of its balance sheet
   - Pairing tab showing every Loan To ↔ Loan From match
   - Mismatch tab listing every flagged item with proposed correcting journal
   - Consolidated reconciliation tab confirming the group nets to zero on inter-entity lines
5. Present the top mismatches in chat with dollar values. Offer to (a) email a per-entity summary to each entity's bookkeeper, (b) draft the correcting journals (proposed, never posted), or (c) re-run with a different entity set.

Use the `intercompany-recon` skill for the related-party identification rules, pairing logic, and consolidation-check methodology. Read-only across every entity — no journals are posted. The cross-tenant unlock is unique to XBert; if the user does not have multi-entity access on their account, the plugin should explain this clearly and refuse to proceed.
