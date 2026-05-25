---
description: Run a structural audit of your XBert workflow setup — template consolidation, budget accuracy, workload balance, and setup hygiene. Produces a Word document.
---

You are running a structural workflow review for the user's XBert Connect tenant.

Steps:
1. Confirm the user wants to run the review. If the trigger is the slash command or a clear direct request, skip ahead. Otherwise, briefly confirm scope.
2. Pull from XBert via the connected MCP:
   - Capacity and workload data for all users on the Connect tenant
   - Activity data for the last 12 months on the Connect tenant
   - Notification summary per client to assess completion patterns
   - Template and schedule configuration for the Connect tenant
3. Analyse using the `workflow-review` skill methodology:
   - Section 1: Snapshot (client counts, template counts, coverage)
   - Section 2: Usage reality (live/dormant/zombie schedules, orphaned assignments, completion quality, per-user load)
   - Section 3: Consolidation opportunities (base-process variant groups, role-only variants, override vs duplicate patterns)
   - Section 4: Budget accuracy (templates where budgeted time diverges from actuals, ranked by annualised impact)
   - Section 5: Health flags (unassigned schedules, stale templates, duplicate names, inconsistent assignments)
   - Section 6: Prioritised recommendations (5-10 actions ranked by impact with confidence labels)
4. Generate a Word document containing:
   - Cover page with customer name and generation date
   - First-page benefits summary with highest-impact findings
   - Data-sparsity summary (what ran on full vs sparse data)
   - Six analytical sections
   - Closing summary with the XBert-team support hook
5. Present the document to the user with a brief chat-side summary of the top 2-3 recommendations.
6. Offer to answer follow-up questions about any finding.

Use the `workflow-review` skill for the full methodology, thresholds, and tone guidance. Never apply changes — this is a read-only structural audit. Every recommendation is proposed, never enacted.
