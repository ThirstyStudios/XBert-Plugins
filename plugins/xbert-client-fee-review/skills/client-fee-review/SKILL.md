---
name: client-fee-review
description: "Run the XBert Client Fee Review for a Connect tenant — assemble per-client evidence (logged time, six ledger-volume categories, current fee) and categorise the book into Increase / Stable / Decrease / Insufficient-data. Use when the user asks for an annual fee review, pricing review, fee-recovery analysis, cost-to-serve, pricing standardisation, or invokes the /client-fee-review slash command. Also triggers on 'are we charging the right fee', 'which clients are underpriced', 'we need to repricing the book'."
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Client Fee Review

Per-client cost-to-serve evidence pack. Produces three first-class outputs (Increase / Stable / Decrease) plus an insufficient-data list. Read-only evidence assembly — does not set prices.

## Goal
Replace 'feel' with evidence so that annual fee conversations start from data, not memory. Confirmed-healthy clients are an output, not an absence of output.

## Metrics
- **Current fee** — from the XPM client list
- **Logged time** — sum across XPM timesheet totals and practice-internal actual time
- **Six volume categories** — bank transactions, bills (AP), invoices (AR), payroll runs, payslips, manual journals
- **Cost-to-serve indicator** — logged time × user-supplied blended cost (optional)
- **Fee per hour indicator** — current fee / logged hours

## Default thresholds (practice-configurable)
| Category | Trigger |
|---|---|
| Increase | Fee/hr below practice median by >=25% AND >=12 months data |
| Stable | Fee/hr within +/-15% of practice median |
| Decrease | Fee/hr above practice median by >=30% AND no advisory/complex work tag |
| Insufficient data | <12 months history OR <20 logged hours OR no volume signals available |

Volume signals supplement time-based judgment: a client with low time but very high transaction volume signals a likely future cost spike — flag in the evidence sheet.

## Process / rules
1. **Build per-client evidence record** — fee, hours, six volumes, fee/hr, cost-to-serve (if blended rate supplied).
2. **Compute practice medians** — for fee/hr, hours/client, and each volume category. Use the medians as the comparison baseline.
3. **Categorise every client** — Increase / Stable / Decrease / Insufficient. Do not force every client into a change category; Stable is an output.
4. **Rank Increase and Decrease lists** — by indicated fee delta (absolute dollars), descending.
5. **Cohort filters** — if the user supplies a cohort (e.g. bookkeeping-only), compute medians and categorisation within the cohort, not across the whole book.
6. **Per-client drill-down** — one page each for Increase and Decrease, optional for Stable, mandatory for Insufficient (state why).

## Always
- **Three first-class outputs.** Stable and Insufficient lists are produced and reported — not buried.
- **Evidence is the deliverable.** Do not recommend a specific price. Suggest the bracket and reference the median.
- **Volume signals are forward-looking.** Flag clients with rising transaction volumes even if the current cost-to-serve looks fine.
- **Cohort awareness.** Different service types have different baselines — the user picks the cohort, the skill computes within it.
- **Read-only.** Never apply price changes; the evidence pack is the deliverable.
- **Insufficient-data is honest.** State the exact reason (months missing, hours below floor, no volumes). Never speculate.
