---
description: Audit XBert configuration consistency across your book — surface inconsistencies, gaps and drift. Produces a Word document.
---

You are running a configuration audit of XBert rule enablement across a Connect tenant. This is distinct from the workflow review (which looks at templates and schedules) — here, the subject is the XBert rule configuration itself.

Steps:
1. Confirm scope with the user: Connect tenant and segmentation approach (default = group clients by industry tag if available, fall back to whole-book if not). Briefly confirm if the slash command was invoked without args.
2. Pull from XBert via the connected MCP:
   - All accessible clients in the Connect — then **filter to connected clients only** using the client connection list (`Data_GetClientConnections`): drop any client that is not connected to a ledger (`IsConnectedToAccountingSoftware = false` / `IsDisconnected = true` / never synced). Record how many were excluded.
   - Practice-level Connect account review
   - The XBert rule / flow list
   - Per-client configuration: call `Data_XBertConfigurations` **once per connected client, with that client's own tenant id**, and confirm each response carries `scope: client` (the tool returns that client's effective set — all-tenants OR per-client-assigned configs — via the `XBertConfigurationTenant` junction). Do not call once and reuse across clients.
   - Bulk-update capability metadata for the normalisation hand-off
   - Client connection list for connection filtering and ledger-type / industry-tag segmentation context
3. Analyse using the `config-audit` skill methodology:
   - Build a genuinely per-client enablement fingerprint (active-config count + Business Function / risk breakdowns + per-client custom-XBert set), connected clients only
   - Segment clients (default by industry tag, otherwise whole-book)
   - Identify three finding types:
     - **Inconsistencies** — rule enabled for some clients in a segment, disabled for others, no clear pattern
     - **Gaps** — rule enabled on ≥80% of segment but missing on the rest (likely meant to be always-on)
     - **Drift** — rule was enabled at some point but is currently disabled
   - For each finding, propose the bulk-normalisation move (enable on missing N, disable on outlier N, or surface for human decision)
4. Build the working-paper payload conforming to the schema in the `config-audit` skill (sections, blocking flags, tables, QMS block).
5. Save the payload to `outputs/<check_reference_id>/payload.json` and invoke the `xbert-working-paper:render-docx` skill. Wait for its JSON response. Do not declare success until `status == "ok"` and `opens_cleanly == true`.
6. Present the saved document path to the user with a chat-side summary of the top findings.

Use the `config-audit` skill for the methodology, fingerprinting approach and segmentation rules. Never apply changes — propose the bulk update; the user actions it through XBert.
