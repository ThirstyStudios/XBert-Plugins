---
description: Assemble the external-auditor-ready evidence pack for a client — risk-weighted sample driven by XBert firings, lead schedules per material account, hyperlinked workpapers.
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

You are assembling an audit evidence pack for a client. The deterministic audit XBerts have already fired across the period — their firings are the risk signal that drives the sample selection. Your job is to orchestrate the workpaper assembly, select the sample, build the lead schedules and bundle the pack.

Steps:
1. **Linked XBerts gate.** Resolve the system agent backing this plugin (matched by the `/audit-evidence-pack` slug) and call `Data_GetLinkedXBertsForAgent` for the client and audit period. If the returned list is EMPTY, STOP and tell the user: "No XBerts are linked to this agent in your Connect portal. Configure them under Agent → Linked XBerts before running this review — without linked XBerts there is nothing deterministic to reason over."
2. Ask the user which client and which audit period to pack (default: current financial year). If the slash command has named a client, proceed.
3. Pull the firings of each linked audit XBert across the period, the underlying transactions, the material accounts, captured source documents (receipts, supplier invoices, signed contracts, payroll records) and any prior-period audit pack context.
4. Build the risk-weighted sample per the `audit-evidence-pack` skill — transactions with multiple XBerts firing escalate up the risk weighting. Coverage across material accounts is enforced so no account is under-sampled.
5. Build lead schedules per material account — opening balance, period movement, closing balance, with the sample items listed underneath and hyperlinks down to each source document.
6. Build the working-paper payload conforming to the schema in the `audit-evidence-pack` skill (sections, blocking flags, tables, QMS block).
7. Save the payload to `outputs/<check_reference_id>/payload.json` and invoke the `xbert-working-paper:render-docx` skill. Wait for its JSON response. Do not declare success until `status == "ok"` and `opens_cleanly == true`.
8. Present the saved document path to the user with a chat-side summary of the top findings.

Use the `audit-evidence-pack` skill for sample-weighting methodology, lead-schedule structure and the workpaper bundle format. Use Australian English (organisation, behaviour, colour). Never auto-resolve audit findings — the pack is for the external auditor to interrogate.
