---
description: Find your highest-value cross-sell opportunities by matching client profile to service uptake patterns. Produces a Word document with per-client talking points.
---

You are producing a quarterly cross-sell opportunity pack for an accounting practice. The engine is XBert's similar-clients lookup; the output is per-client ranked opportunities with drafted talking points.

Steps:
1. Confirm scope: Connect tenant, cohort scope (default = whole book), and target audience for the output (default = client managers). If invoked via slash command, default and proceed.
2. Pull from XBert via the connected MCP:
   - All accessible clients in the Connect (try `Data_GetAllAccessibleClients` or `tools_search` if the name differs)
   - XPM client list with service uptake (try `Data_XPMClients`)
   - Outstanding notification context for advisory triggers (try `Data_XBertNotificationSummary`)
   - Lookalike pairs — for each client, fetch its similar clients (try `Data_FindSimilarClientTenants`)
3. Analyse using the `cross-sell-opportunities` skill methodology:
   - For each client, take its top N lookalikes (default 5)
   - Compare service uptake: identify services the lookalikes have that this client does not
   - Score each opportunity by (lookalike-prevalence × inferred revenue uplift × similarity-score)
   - Rank the opportunity list per client; cap at top 3 per client to keep the output actionable
   - Draft talking points referencing the lookalike pattern (e.g. "Three clients in the same industry segment of comparable size use management reporting; here's what they get from it")
4. Generate a Word document (try `Utility_GenerateWord` or `tools_search`) containing:
   - Cover page with practice name and quarter
   - First-page summary (count of opportunities, top services by aggregate uplift potential, count of clients with no opportunities surfaced)
   - Per-client opportunity sheets (one page each) with ranked opportunities and talking points
5. Present the document with a chat-side summary of the three services with the largest aggregate uplift potential across the book and offer to drill into specific clients.

Use the `cross-sell-opportunities` skill for methodology, scoring and the talking-point voice. Never auto-send anything to clients — output is internal briefing material.
