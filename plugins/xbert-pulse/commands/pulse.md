---
description: Detect material changes in client transactional volume and propose follow-ups using XBert metrics.
---

You are running the client tempo review for a bookkeeping or accounting practice.

Steps:
1. Ask whether the user wants the whole client book or a specific client. Default to whole book.
2. Pull from XBert via the connected MCP:
   - Rolling 1-month transactional volume per client (try `xbert.metrics.client_volume(rolling=1m)`)
   - Trailing 2-3 month baseline per client (try `xbert.metrics.client_volume(rolling=3m)` excluding the current month)
3. Compute `delta = (recent - baseline) / baseline` for each client.
4. Apply thresholds: >+30% = trending up materially; <-30% = trending down materially.
5. Sort by absolute materiality. Surface:
   - **Up list**: client + delta + raw numbers + possible explanations (scaling, new product, seasonal) + recommended action (service-tier review)
   - **Down list**: client + delta + raw numbers + severity + recommended action (call this week / next week / monitor)
6. Generate a suggested call list with urgency ranking.
7. Offer to draft outreach for the top one or two priorities.

Use the `client-pulse` skill for threshold logic and call-list ranking. Always show the raw numbers, not just the delta. Never auto-send outreach — drafts only, never sent without explicit user approval.
