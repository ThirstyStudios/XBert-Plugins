---
name: practice-metrics
description: "Produce the XBert monthly Practice Metrics one-pager — standard partner KPIs, service-line P&L, prior-month variance commentary and RAG-banded client risk view. Use when the user asks for monthly metrics, partner-meeting pack, practice KPIs, lockup days, write-offs, WIP report, service-line P&L, or invokes the /practice-metrics slash command. Also triggers on 'monthly numbers', 'what are our KPIs this month', 'partner pack'."
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Practice Metrics

A monthly partner-meeting one-pager. Same shape every month. Designed for consistency, not novelty.

## Goal
Produce a repeatable artefact partners can compare month-on-month without questioning whether definitions changed.

## Metrics
- **Revenue** — invoiced in month
- **WIP** — logged time × billing rate not yet invoiced
- **Debtors** — open AR balance (from aged receivables)
- **Lockup days** — (WIP + debtors) / annualised revenue × 365
- **Write-offs** — billed minus invoiced for completed work in month
- **Service-line P&L** — revenue and direct cost by bookkeeping / tax / advisory
- **Client risk band (RAG)** — derived from lockup, write-off rate, and outstanding work flags per client

## Default thresholds (practice-configurable)
| Threshold | Value | Used in |
|---|---|---|
| Material mover (KPI) | >=10% MoM movement OR >5pt change in lockup days | Commentary |
| Service-line significance | >=5% of total revenue | Service-line table |
| RAG: Red | Lockup >120 days OR write-off rate >15% OR >=2 escalated workflows | Client risk |
| RAG: Amber | Lockup 80-120 days OR write-off rate 8-15% OR 1 escalated workflow | Client risk |
| RAG: Green | All below amber thresholds | Client risk |

## Process / rules
1. **Compute current-month and prior-month KPIs.** Use the same source per metric across runs to keep movement comparable.
2. **Build service-line P&L.** Derive lines from XPM service codes or tags; group anything unmapped as "other" and call it out.
3. **Variance commentary.** For each material mover, write one sentence: what moved, by how much, suspected driver from the underlying data.
4. **Client risk pass.** Band every client; list any client that changed band vs prior month.
5. **One-pager layout** — KPI table on top, service-line table middle, commentary block, RAG list. Excel companion holds the per-client detail.

## Always
- **Same shape every month.** Resist the urge to add or reorder sections.
- **Same source per metric.** Comparability matters more than choosing the "best" source mid-stream.
- **Commentary explains movers, not stable numbers.** Stable months get a brief "no material movers" line.
- **Service-line tagging caveat.** If significant revenue is unmapped, state the percentage; do not silently bucket.
- **Read-only.** This is the reporting artefact, not an enactment tool.
- **Definitions visible.** Footnote each KPI with its definition so prior-period comparisons are reproducible.

## Payload schema

After running the analysis, structure the result as JSON conforming to the render skill payload schemas (`xbert-working-paper/skills/render-docx/SKILL.md` for narrative outputs; `xbert-working-paper/skills/render-xlsx/SKILL.md` for spreadsheet outputs). For this plugin you produce:

- **one-pager narrative**: consumed by `xbert-working-paper:render-docx` (KPI table, service-line table, RAG client list, commentary block).
- **per-client workbook**: consumed by `xbert-working-paper:render-xlsx` — the Excel companion holding the per-client detail behind every metric.

Common fields across payloads: `plugin: "xbert-practice-metrics"`, `check_reference_id`, `tenant_name`, `period`, `prepared_by`, `prepared_at`, `title`, `qms_block`. The xlsx payload also needs `sheets[]` with `name`, `columns`, `rows`, `column_widths`, `freeze_top_row`, `number_format`. Cells starting with `=` are Excel formulas — always prefer formulas to hard-coded calculated values.

## Output handoff

1. Save each payload to `outputs/<check_reference_id>/<payload-name>.json`.
2. Invoke the matching render skill(s) in order:
   a. Save the one-pager narrative payload to `outputs/<check_reference_id>/payload.json` and invoke `xbert-working-paper:render-docx`. Wait for `status == "ok"`.
   b. Save the per-client workbook payload to `outputs/<check_reference_id>/workbook.json` and invoke `xbert-working-paper:render-xlsx`. Wait for `status == "ok"` and the `recalc.py` gate to pass with no error cells.
3. Each render skill emits a single JSON line on stdout with its own `status`/`path`/file-specific metadata.
4. Pass the saved path(s) and a one-line summary back to the user.

## Verification gate

Do not report any deliverable as produced until its render skill's JSON shows `status == "ok"`. For render-xlsx, `recalc.py` must also have run and returned no error cells. If any gate fails, surface the JSON to the user verbatim and stop — do not retry silently and do not claim success.
