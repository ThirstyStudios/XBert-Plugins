---
description: Period-close readiness dashboard fusing workflow, data quality and lodgement obligations across every client. Produces a Word document.
---

You are running the End-of-Period Dashboard for an Australian accounting practice. The output is a per-client readiness view fused from three streams — XBert work in flight, ledger data quality, and lodgement obligations.

Steps:
1. Confirm scope with the user: cadence (month / quarter / year) and Connect tenant. If the slash command was invoked without arguments, ask for the cadence first. Default is the current period.
2. Pull from XBert via the connected MCP:
   - All accessible clients in the Connect
   - Per-client data-quality score
   - Reconciliation status
   - Lock dates per client
   - Outstanding work board
   - Outstanding notification summary
   - Validation status for the cadence:
     - Month / quarter: BAS reconciliation and payroll reconciliation checks
     - Quarter (international fallback): VAT reconciliation check
3. Analyse using the `end-of-period-dashboard` skill methodology:
   - Compute per-client readiness (Ready / Almost / Blocked / At Risk) for the chosen cadence
   - Derive upcoming lodgement obligations from cadence + Australian calendar context
   - Rank clients by deadline-risk first, then by blocker count
   - Name the specific blockers per client (not generic categories)
   - Compute first-page summary: clients per band, lodgements due in 7/14/30 days, top blocker patterns
4. Generate a Word document containing:
   - Cover page with practice name, cadence and run date
   - First-page summary (X of Y ready, lodgements due, top blocker patterns)
   - Deadline-risk client list (ordered)
   - Per-client detail blocks for any client not in the Ready band
   - Closing checklist of items needing decisions in the next week
5. Present the document with a chat-side summary of the top three at-risk clients and the most-common blocker. Offer follow-up questions.

Use the `end-of-period-dashboard` skill for the methodology, bands, and AU obligation calendar. Never apply changes — this is a coordination view, not an action runner.
