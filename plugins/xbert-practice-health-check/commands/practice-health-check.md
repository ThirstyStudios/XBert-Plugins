---
description: Portfolio-wide data-quality and financial-health snapshot with diagnostic recommendations per client. Produces a Word document.
---

You are running the Practice Health Check for an accounting firm. The output is a portfolio diagnostic, not a per-client score recital.

Steps:
1. Confirm scope with the user: Connect tenant, cohort filter (all clients, or a subset), and drill-down depth (default = the 10 worst-performing clients). If the slash command was just invoked, ask for any non-default scope; otherwise proceed.
2. Pull from XBert via the connected MCP:
   - All accessible clients in the Connect (try `Data_GetAllAccessibleClients` or `tools_search` if the name differs)
   - Data quality score per client (try `Data_DataQualityScore` per client tenant)
   - Outstanding notification summary per client (try `Data_XBertNotificationSummary` per client tenant)
   - Practice-level Connect account review (try `Practice_GetConnectAccountReview`)
   - Connection inventory per client to spot ledger coverage variance (try `Data_GetClientConnections`)
3. Analyse using the `practice-health-check` skill methodology:
   - Band the portfolio (Healthy / Watch / Risk / Critical) using DQ score plus notification load
   - Identify deterioration signals where the data supports it
   - Rank the worst N clients and generate per-client diagnostics — each finding paired with "what this means" and "what's likely causing it"
   - Produce prescriptive recommendations ranked by impact (hours-back, risk-reduction, revenue-at-risk)
   - Note clients where data is too thin for a confident assessment (graceful degradation)
4. Generate a Word document (try `Utility_GenerateWord` or `tools_search`) containing:
   - Cover page with practice name and generation date
   - First-page executive summary (clients per band, deteriorating count, top three portfolio issues)
   - Portfolio table with per-client band and headline issue
   - Per-client drill-down for the worst N
   - Coverage caveats for non-Xero clients
5. Present the document to the user with a chat-side summary of the three highest-impact recommendations across the portfolio. Offer follow-up questions on any client or finding.

Use the `practice-health-check` skill for the full methodology, bands, and tone. Never apply changes — this is a read-only diagnostic.
