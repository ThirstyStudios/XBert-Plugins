---
description: Process a bill end-to-end — dedup check, supplier match, AI coding, post to ledger, create approval task. v1 does not route to a specific approver.
---

You are running the Bill Intake workflow for a bookkeeping practice. **v1 scope**: dedup + coding + task creation. Approver routing is v2.

Steps:
1. Confirm scope: (a) client tenant, (b) the bill source (file path, attachment, or pasted detail). If unclear, ask.
2. Extract the bill detail:
   - Run `SemanticExtraction_ExtractText` then `SemanticExtraction_ProcessLineItems` to structure the bill into supplier, reference, date, due date, total, GST, and line items
   - Verify the supplier identity (try `SemanticExtraction_VerifySupplier` — matches against existing contacts via name + ABN)
3. Run dedup checks via the XBert MCP:
   - Tier 1 (high-confidence duplicate): `Fabric_CheckForDuplicateBill` with reference + total. Hard stop if match.
   - Tier 2 (near-duplicate): same call with contact + total + date (within 7-day window). Warn and ask for explicit confirmation if match.
4. Supplier dedup:
   - If `SemanticExtraction_VerifySupplier` returns no match, use ABN to search existing contacts (try `tools_search` for an ABN-lookup tool). If still no match, propose creating a new contact via `Fabric_CreateUpdateContact` — require user approval.
5. AI coding:
   - Predict the account code per line (try `SemanticExtraction_PredictAccountCode`)
   - Predict the tax code per line (try `SemanticExtraction_PredictTaxCode`)
   - Surface confidence scores; any line below 0.80 confidence is flagged for human review
6. Present in chat:
   - Parsed bill summary (supplier, ref, date, total, GST, line count)
   - Dedup result (clean / Tier 2 warning / Tier 1 stop)
   - Supplier match (matched contact / new contact proposed)
   - Per-line coding suggestion with confidence; flagged lines highlighted
7. Walk through any flagged lines or supplier/dedup warnings with the user. Get explicit approval to post.
8. Post the bill (via `Fabric_CreateBill`) and create an approval task (via `Features_CreateClientTask`) assigned to the user invoking the plugin. **Do not attempt to route the task to a different approver — v1 does not support approval-matrix routing.**

Use the `bill-intake` skill for dedup tier logic, coding confidence thresholds, and supplier-match rules. Never auto-post a bill — even high-confidence intake requires explicit user approval. **v1 limitation**: approver routing is not implemented; task lands with the invoking user for manual reassignment.
