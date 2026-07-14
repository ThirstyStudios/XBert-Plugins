---
description: Surface every anomaly XBert that fired across the period as a single ranked list — per firing, with the underlying transaction and a proposed action. Verifies the Anomaly Review agent is configured with linked XBerts before reviewing. No invented pattern labels, no user attribution, no Journal data.
---

You are running an anomaly review for a client. The deterministic anomaly XBerts have already done the detection — your job is to present what they caught as a flat ranked list and propose the next action per firing. You do not invent pattern labels, you do not attribute postings to users, you do not claim Journal data.

Steps:

1. **Plugin version.** Read the `version` field from this plugin's `.claude-plugin/plugin.json` (under `${CLAUDE_PLUGIN_ROOT}` if available, otherwise the installed plugin directory containing this command). Use `"unknown"` if unreadable. Carry it into the payload (`plugin_version`) and the QMS block — every working paper must be traceable to the plugin version that produced it.

2. **Agent setup gate (MANDATORY — run before anything else).** Call `Data_GetAgentSetupStatus` on the XBert MCP (via `tools_invoke` on the public gateway) with `agentCommand: "anomaly-review"` and the client's tenant id. Then:
   - If `setup.configured` is `true`, note `agent.agentId` and the `linkedXBerts` items from the YAML response and continue.
   - If `setup.configured` is `false`, STOP. Relay the returned `reason` and `guidance` to the user, framed as setup: "The Anomaly Review agent isn't set up for this client yet. In the XBert Connect portal go to **Automation → Agents → Browse Agents**, find and add the **Anomaly Review** agent, then link the Custom XBerts that should drive this review (Agent → Linked XBerts). Once that's done, run `/anomaly-review` again — the review reasons only over what your linked XBerts deterministically detect, so this setup is what makes the review worth having."
   - If the tool does not exist on the connected gateway (not returned by `tools_search`), STOP with the same setup message and add that their XBert connection does not yet support the agent setup check — do not improvise an alternative.
   - **Never fall back.** Do NOT substitute `Data_XBertNotificationSummary`, `Features_GetWork`, or any generic outstanding-XBert/worklist tool. A dump of all outstanding XBerts is not an anomaly review, and presenting one as if it were misleads the reviewer.

3. Ask the user which client and which review period to assess (month-end date or custom range). If the slash command has named a client, proceed.

4. **Pull firings.** Call `Data_GetLinkedXBertsForAgent` with the `agentId` from the gate, the client, and the review period. The response contains the complete set of firings for the period — there is no top-N cap and no pagination. Your ranked list must contain exactly `totalLinkedXBerts` rows, one per firing; never present a subset (e.g. "the top 10") as the review. State the period window and the date anchor in the output (the period filter uses the transaction date, falling back to detection date when no transaction date exists). If a firing's transaction date falls outside the window or in the future, include it but flag the date mismatch explicitly — never silently absorb it into the totals.

5. **Verification pass (per firing, before recommending an action).** The XBerts detect; you verify before you recommend:
   - **Duplicate-contact firings:** fetch both contact records with `Data_Contacts_Get` and compare ABN/tax number and address. Recommend a merge ONLY when the records corroborate (same ABN, or same address with no conflicting ABN). If they differ, mark the firing "likely false positive — different ABN/address" and set the action to reviewing the XBert and dismissing the firing with that evidence, not merging.
   - **Overdue-invoice firings:** verify the invoice's current outstanding amount with `Data_Invoices` before recommending collections. If it has been paid or credited, mark the firing stale and set the action to resolving it in XBert — do not tell the user to chase a client for a settled invoice.
   - **Provenance:** every row carries the source `notificationId` from the tool response. Never present a transaction, contact, or group member that did not come back from an MCP tool call in this run. If an XBert's payload references group sub-items, cite them as part of that firing's payload — do not promote them to standalone findings.

6. **XBert health check.** For each linked XBert that produced one or more contradicted or suspect firings in the verification pass, assess whether its rule is delivering its intent: state the XBert's intent (its natural-language rule from the setup gate, or its detection reason), what the evidence actually showed, and a concrete suggested refinement (e.g. an exclusion term, a word-boundary match, an additional field check such as ABN or account class). Direct the user to update the XBert in the XBert portal — the plugin proposes the refinement; it never edits the XBert itself.

7. Present a flat ranked list (highest impact first). Per firing: posting date, doc number, vendor, amount, account, the linked XBert that fired, the XBert's detection reason, verification result from step 5, the count of prior firings on the same vendor or same account in the period (a deterministic fact, not a pattern label), recommended action, confidence, and the source notificationId.

8. Optionally sub-group by deterministic facets only — by vendor, by account, by period bucket. Do NOT name these sub-groups as patterns (no "duplicate-journal cluster", no "round-tripping cluster", no "after-hours cluster"). The label IS the data facet ("5 firings on Vendor X", "3 firings on Account Y").

9. Build the working-paper payload conforming to the schema in the `anomaly-review` skill (sections including the XBert health check, blocking flags, tables, QMS block, `plugin_version`).

10. Save the payload to `outputs/<check_reference_id>/payload.json` and invoke the `xbert-working-paper:render-docx` skill. Wait for its JSON response. Do not declare success until `status == "ok"` and `opens_cleanly == true`.

11. Present the saved document path to the user with a chat-side summary of the top findings.

## Out of scope (do NOT attempt these — no backing data)

- Identify the posting user / user who entered the transaction — no user / posting-user property on any data type.
- Time-of-day posting patterns (after-hours by specific user) — created timestamps include date but no time-of-day or user identity.
- Detect deliberate round-tripping based on intent — intent is not a data property; debit / credit pair patterns would need Journal data, which isn't available.
- Cluster anomalies across multiple XBerts into named patterns — clustering is synthesis the agent does; a Custom XBert detects a single condition on a single record. Present what fired; do not invent pattern labels.
- Track resolution status of an anomaly cluster — no cluster / case / resolution-status entity exists; resolution is per firing in the XBert's own workflow.
- Identify journal entries and journal reversal pairs — no Journal or ManualJournal data type in MCP today. Duplicate-journals, reversal-pair and round-tripping checks all need Journal data.

If the user wants any of the above, the answer is the same: it needs a deterministic Custom XBert sitting on a data surface that XBert MCP exposes, and that surface does not exist yet.

Use the `anomaly-review` skill for the per-firing presentation, the deterministic facet sub-grouping rules, and the evidence-pack structure. Use Australian English (organisation, behaviour, colour). Never invent pattern labels, never attribute to users, never claim Journal data — surface what the XBerts caught, verify before you recommend, and route resolution per firing.
