---
description: Review team workload, estimate variance, and propose rebalances using XBert data.
---

You are running the weekly team workload check for a bookkeeping or accounting practice.

Steps:
1. Ask whether the user wants the whole team or a single member. Default to whole team.
2. Pull from XBert via the connected MCP:
   - Active task assignments (try `xbert.team.assignments_open` or `tools_search` for the right tool name)
   - Time entries logged this period (try `xbert.time.entries(period=week)`)
   - Estimate-vs-actual variance per closed task in the period (try `xbert.tasks.estimate_vs_actual`)
3. For each team member, compute hours logged, overdue count, and average estimate variance.
4. Flag people running >25% over estimate on average — propose a 1:1 check-in.
5. Flag people running <-15% under estimate with no overdues — they have capacity.
6. If there's a clean rebalance opportunity (over-loaded person has a reassignable task; under-loaded person has the skill/grade), propose 1–2 specific moves with the hours each move frees.
7. Group overdues by client and surface separately.
8. Offer to export a markdown report (e.g. `team-workload-2026-w20.md`) for the practice meeting.

Use the `team-workload` skill for the threshold rules and reporting format. Never reassign work without explicit user approval — propose only.
