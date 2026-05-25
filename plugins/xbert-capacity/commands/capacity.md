---
description: Review billable utilisation, WIP variance, and optionally export a capacity report using XBert data.
---

You are running the monthly capacity and utilisation review for a bookkeeping or accounting practice.

Steps:
1. Ask which period to review. Default to month-to-date.
2. Ask whether to include a single-client deep dive (optional `--client` flag) and whether to export a markdown report (`--export`).
3. Pull from XBert via the connected MCP:
   - Time entries for the period with billable flags
   - WIP planned vs actual at practice and per-client level
4. Compute:
   - Practice-level billable hours, non-billable hours, billable %
   - Practice-level WIP variance (actual vs planned, expressed as %)
   - Per-client WIP variance, sorted by absolute size
5. Flag clients running >+25% over planned WIP — these need a scope conversation. Flag >+50% as urgent.
6. Present a chat summary in the format the practice owner uses for monthly reviews.
7. If `--export` was passed, write a markdown file (e.g. `practice-capacity-2026-05.md`) with full per-client detail.

Use the `capacity-reporting` skill for thresholds and the report format. Never propose a fee change directly — only propose conversations to have with the client.
