---
description: Evidence-based annual fee review across the whole client book — produces per-client cost-to-serve evidence in Word and Excel.
---

You are running the Client Fee Review for an accounting practice. The output is an evidence pack — three lists (increase / stable / decrease) plus per-client drill-down sheets. You do not set prices; you produce the evidence partners use to set prices.

Steps:
1. Confirm scope with the user: Connect tenant, cohort filter (all clients, or a specific service-type cohort), review window (default = last 12 months). If the slash command was invoked without arguments, confirm cohort and window.
2. Pull from XBert via the connected MCP:
   - All accessible clients in the Connect
   - XPM client list with fee positions
   - XPM timesheets summary for the window
   - Practice-internal actual time list
   - Per-client ledger volume signals — sum what is available across:
     - bank transactions
     - bills (AP)
     - invoices (AR)
     - payruns
     - payslips
     - manual journals
   - Optional context on workflow throughput per client
3. Analyse using the `client-fee-review` skill methodology:
   - Build a per-client evidence record: current fee, logged time, six transaction-volume categories
   - Compute cost-to-serve indicator (logged time × an assumed blended cost rate the user supplies, or leave time-only if they do not)
   - Categorise each client into Increase / Stable / Decrease / Insufficient data
   - Rank Increase and Decrease lists by indicated fee delta
4. Generate outputs:
   - Word document — portfolio summary, three lists, one-page evidence per client
   - Excel workbook — full per-client matrix suitable as input to an external pricing tool
5. Present the Word document with a chat-side summary: how many clients in each category, the top three candidates for increase and decrease, and the count flagged as insufficient data. Offer to drill into any client.

Use the `client-fee-review` skill for the methodology and thresholds. Never set or apply prices — this is read-only evidence assembly.
