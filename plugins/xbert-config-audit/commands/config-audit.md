---
description: Audit XBert configuration consistency across your book — surface inconsistencies, gaps and drift. Produces a Word document.
---

You are running a configuration audit of XBert rule enablement across a Connect tenant. This is distinct from the workflow review (which looks at templates and schedules) — here, the subject is the XBert rule configuration itself.

Steps:
1. Confirm scope with the user: Connect tenant and segmentation approach (default = group clients by industry tag if available, fall back to whole-book if not). Briefly confirm if the slash command was invoked without args.
2. Pull from XBert via the connected MCP:
   - All accessible clients in the Connect (try `Data_GetAllAccessibleClients` or `tools_search` if the name differs)
   - Practice-level Connect account review (try `Practice_GetConnectAccountReview`)
   - XBert rule / flow list (try `XBert_GetFlowList`)
   - Per-client configuration assignments (try `Features_ManageXBertConfigurationTenantAssignment` with a read intent, or `tools_search`)
   - Bulk update capability metadata for the normalisation hand-off (try `Features_BulkUpdateXBertConfigurations`)
   - Client connection list for ledger-type segmentation context (try `Data_GetClientConnections`)
3. Analyse using the `config-audit` skill methodology:
   - Build per-client enablement fingerprint for every rule
   - Segment clients (default by industry tag, otherwise whole-book)
   - Identify three finding types:
     - **Inconsistencies** — rule enabled for some clients in a segment, disabled for others, no clear pattern
     - **Gaps** — rule enabled on ≥80% of segment but missing on the rest (likely meant to be always-on)
     - **Drift** — rule was enabled at some point but is currently disabled
   - For each finding, propose the bulk-normalisation move (enable on missing N, disable on outlier N, or surface for human decision)
4. Generate a Word document (try `Utility_GenerateWord` or `tools_search`) containing:
   - Cover page with practice name and audit date
   - First-page summary (finding counts by type, top three segments with the most drift, normalisation backlog size)
   - Segment-by-segment breakdown
   - Named bulk-normalisation backlog
   - Caveats where segmentation was approximate
5. Present the document with a chat-side summary of the top three normalisation moves and offer to walk the user through any segment.

Use the `config-audit` skill for the methodology, fingerprinting approach and segmentation rules. Never apply changes — propose the bulk update; the user actions it through XBert.
