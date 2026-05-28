---
name: month-end-pack
description: "Assemble the month-end financial pack the partner hands to the client — P&L vs budget, BS movement walk, cashflow vs forecast, and KPI roll-up. Use this skill when the user asks to produce the monthly client pack, run month-end reporting, generate the financial pack, or runs the /month-end-pack slash command. Also triggers on: 'monthly client report', 'partner pack', 'month-end reporting', 'client board pack', 'rolling monthly financials'."
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Month-End Pack

## Goal
Produce a same-shape monthly financial pack the partner reviews in ten minutes and hands to the client without rebuilding. The bookkeeper drives the data assembly; the partner adds judgment via the scaffolded commentary fields. Format consistency matters more than format sophistication — same sections in the same order every cycle.

## Metrics
- **Budget variance** — actual vs budget per P&L line, by amount and by percentage.
- **Movement variance** — current vs prior month per BS account, by amount.
- **Forecast adherence** — actual cashflow vs forecast cashflow.
- **KPI roll-up** — gross margin, net margin, current ratio, debtor days, creditor days, working capital.

## Default thresholds (practice-configurable)
| Band | Threshold |
|---|---|
| P&L variance — material | >= $1,000 AND >= 10% of budget (for accounts <$10k); >= 5% (for accounts >=$10k) |
| BS movement — flag | >= 15% movement vs prior month OR >= $5,000 absolute |
| Cashflow forecast variance | >= 20% deviation from forecast |
| Debtor days — concern | > 60 days |
| Creditor days — concern | > 90 days (potential supplier-relationship risk) |
| Current ratio — concern | < 1.2 |

## Process / rules

### Document structure (fixed)
1. **Cover page** — client name, period (e.g. "April 2026"), generated date, prepared by (bookkeeper), reviewed by (partner — left blank).
2. **Executive summary** — single page: revenue actual vs budget, EBITDA actual vs budget, closing cash, top 3 variances by dollar.
3. **P&L section** — actual / budget / variance / prior-month / prior-year columns. Material variances flagged with commentary placeholders. Commentary scaffolds are templated phrases like "Revenue X% above budget driven by [_____]." — partner fills in.
4. **Balance sheet section** — actual / prior month / movement columns. Flagged accounts (per BS review tool) listed with reason. Bank reconciliation status badges (reconciled / unreconciled / partial) per bank account.
5. **Cashflow section** — opening cash → operating → investing → financing → closing cash bridge. Forecast comparison if forecast available.
6. **KPI dashboard** — table of all listed KPIs with current / prior / change columns. Concerns highlighted per thresholds.
7. **Appendix** — BS review detailed findings, data-sparsity notes.

### Commentary scaffolding
- Never write the commentary — write the prompt for the commentary
- Format: "[Variance description]. Suggested commentary: [_____]"
- Example: "Office supplies $4,200 above budget (+35%). Suggested commentary: Driven by [bulk purchase / one-off / category re-class]?"

### Materiality
- Apply both percentage AND dollar thresholds (a 50% variance on a $200 line is noise; a 5% variance on a $200k line is signal)
- Below materiality: roll into "other movements within tolerance" footer
- Above materiality: list by name with the scaffolded commentary

### Cross-checks
- P&L net profit must reconcile to BS retained earnings movement (after dividends/owner draws)
- Cashflow closing cash must equal BS cash balance
- Any cross-check failure = appendix note (not a hard stop — could be valid adjustments)

## Always
- Same section order every month — consistency is the product
- Never write the partner's commentary — scaffold it
- Never make accounting judgment calls in the pack — flag and place a commentary scaffold
- Always include the appendix even if empty (so the partner knows it was considered)
- Always note data sparsity (budget missing, prior-year missing) — degrade gracefully
- Output filename: `<client>-month-end-pack-<yyyy-mm>.docx` — keeps cycles findable
- Australian English throughout (organisation, optimise, behaviour, recognised)

## Payload schema

After running the analysis, structure the result as JSON conforming to the render-docx payload schema (defined in `xbert-working-paper/skills/render-docx/SKILL.md`). Required fields:

- `plugin`: `"xbert-month-end-pack"`
- `check_reference_id`: a unique ID for the run
- `tenant_name`, `period`, `prepared_by`, `prepared_at`
- `title`, `subtitle` (optional)
- `executive_summary`: two sentences naming the headline finding
- `sections[]`: one entry per major finding, each with `heading`, `body`, optional `blocking: true`, optional `table` with `columns` and `rows`
- `qms_block`: `{ firm_name, preparer, reviewer, certification }`
- `appendix[]` (optional)

Section ordering and content must match the document structure described above.

## Output handoff

1. Save the payload to `outputs/<check_reference_id>/payload.json`.
2. Invoke the `xbert-working-paper:render-docx` skill. It will write `outputs/<check_reference_id>/working-paper.docx` and emit a single JSON line on stdout with `status`, `path`, `exists`, `size_bytes`, `opens_cleanly`, `paragraph_count`.
3. Pass the path and a one-line summary back to the user.

## Verification gate

Do not report the document as produced until the render skill's JSON has `status == "ok"` and `opens_cleanly == true`. If the gate fails, surface the JSON to the user verbatim and stop — do not retry silently and do not claim success.
