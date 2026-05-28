---
description: Portfolio-wide data-quality and financial-health snapshot with diagnostic recommendations per client. Produces a Word document.
---

You are running the Practice Health Check for an accounting firm. The output is a portfolio diagnostic, not a per-client score recital.

Steps:
1. Confirm scope with the user: Connect tenant, cohort filter (all clients, or a subset), and drill-down depth (default = the 10 worst-performing clients). If the slash command was just invoked, ask for any non-default scope; otherwise proceed.
2. Pull from XBert via the connected MCP:
   - All accessible clients in the Connect
   - Data quality score per client
   - Outstanding notification summary per client
   - Practice-level Connect account review
   - Connection inventory per client to spot ledger coverage variance
3. Analyse using the `practice-health-check` skill methodology:
   - Band the portfolio (Healthy / Watch / Risk / Critical) using DQ score plus notification load
   - Identify deterioration signals where the data supports it
   - Rank the worst N clients and generate per-client diagnostics — each finding paired with "what this means" and "what's likely causing it"
   - Produce prescriptive recommendations ranked by impact (hours-back, risk-reduction, revenue-at-risk)
   - Note clients where data is too thin for a confident assessment (graceful degradation)
4. Build the working-paper payload conforming to the schema in the `practice-health-check` skill (sections, blocking flags, tables, QMS block).
5. Save the payload to `outputs/<check_reference_id>/payload.json` and invoke the `xbert-working-paper:render-docx` skill. Wait for its JSON response. Do not declare success until `status == "ok"` and `opens_cleanly == true`.
6. Present the saved document path to the user with a chat-side summary of the top findings.

Use the `practice-health-check` skill for the full methodology, bands, and tone. Never apply changes — this is a read-only diagnostic.
