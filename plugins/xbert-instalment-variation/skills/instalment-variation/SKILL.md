---
name: instalment-variation
description: Analyse a client's PAYG-I or GST instalment variation decision for a given quarter — YTD trend, cashflow run-rate, GIC exposure, and an audit-defence working paper. Use when the user asks to vary an instalment, run a PAYG variation, vary down the GST instalment, assess instalment exposure, or runs the /instalment-variation slash command. Also triggers on "ATO notice arrived", "do we vary the instalment", "PAYG headline rate is too high", "client wants to vary down".
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Instalment Variation

## Goal
Recommend a variation direction (up / down / stay) for a client's PAYG-I or GST instalment for the quarter, with a stated confidence level, the GIC exposure if varied down, and an audit-defence working paper that documents the underlying data.

## Metrics
- **YTD trend strength** — % movement in profit YTD vs prior-year same period
- **Cashflow runway** — months of operating expense covered by current liquidity
- **Variation gap** — % difference between ATO headline-rate annualised liability and YTD-projected annualised liability

## Default thresholds (practice-configurable)
| Threshold | Value | Used in |
|---|---|---|
| Material trend movement | 15% YTD vs prior year | Direction recommendation |
| Cashflow runway floor | 2 months | Variation-down gate |
| Variation-up confidence floor | 20% gap, profit up trend | Confidence label |
| Variation-down confidence floor | 20% gap, profit down trend, cashflow OK | Confidence label |
| GIC exposure flag | Estimated GIC > $500 if variation is wrong by 15% on final return | GIC note |
| Minimum YTD periods | 3 months closed | Sufficiency gate |

## Process / rules

### Step 1 — Project annual liability
- Take YTD profit / GST liability
- Annualise: (YTD / months elapsed) × 12
- Apply current company tax rate or GST rate for liability projection

### Step 2 — Compare to ATO headline rate
- Headline rate × 4 = ATO-implied annual liability
- Gap = (projected − implied) / implied

### Step 3 — Cashflow run-rate
- Current cash + short-term receivables vs upcoming 90-day obligations
- If runway < 2 months, the variation-down recommendation needs to be muted or refused — paying less tax now doesn't help if it's parked in GIC later

### Step 4 — Direction recommendation
- **Vary up** — gap > +15%, profit trending up, sufficient cashflow
- **Vary down** — gap < −15%, profit trending down, cashflow allows
- **Stay** — gap within ±15%, or signals conflict

### Step 5 — Confidence label
- **Direct** — trend material, prior-year comparable available, cashflow position clear
- **Likely** — trend material but prior-year not directly comparable (restructure, growth phase, COVID-era)
- **Needs review** — fewer than 6 months YTD, structural change in client, mid-year acquisition / disposal

### Step 6 — GIC exposure note
- For variation-down recommendations only
- Hypothesis: if YTD projection turns out wrong by 15% on the final return, what is the GIC?
- Calculate: shortfall × current GIC rate × average exposure period (estimated 9 months for a Q3 variation)
- v1 uses manually-entered GIC rate (automated benchmark-rate lookup is not yet available; capability gap noted)
- **Deductibility — material change from 1 July 2025.** GIC and SIC incurred on or after 1 July 2025 are **not deductible** for income tax (Treasury Laws Amendment (Tax Incentives and Integrity) Act 2024). Pre-1-Jul-2025 GIC/SIC remained deductible. Treat any post-1-Jul-2025 GIC as a permanent after-tax cost (no 25% / 30% recovery via deduction) when weighing the cost of varying down too far. If the variation period straddles 1 July 2025, split the exposure pre- and post-cutover.

### Step 7 — Working paper
- PDF with all inputs, the recommendation, and the confidence label
- Reproducible — anyone reading the working paper in 18 months can see what the recommendation was based on

## Always
- Never submit the variation — the plugin recommends and documents; the human enters the number into the ATO portal
- Be conservative on variation-down — surface GIC exposure explicitly
- If YTD periods closed < 3, refuse to recommend variation-down — recommend stay
- Cashflow position is a hard gate on variation-down — don't recommend "pay less" when cash is already squeezed
- v1 capability gap: automated benchmark-rate lookup is not available — user supplies the GIC rate manually
- The working paper is the deliverable; the chat summary is the cover-note

## Payload schema

After running the analysis, structure the result as JSON conforming to the render skill payload schemas (`xbert-working-paper/skills/render-docx/SKILL.md` for narrative outputs; `xbert-working-paper/skills/render-xlsx/SKILL.md` for spreadsheet outputs). For this plugin you produce:

- **audit-defence working paper**: consumed by `xbert-working-paper:render-pdf` authored directly via reportlab (no .docx step) — captures inputs, recommendation, confidence label, GIC exposure, and the reproducibility trail.

Common fields across payloads: `plugin: "xbert-instalment-variation"`, `check_reference_id`, `tenant_name`, `period`, `prepared_by`, `prepared_at`, `title`, `qms_block`. The xlsx payload also needs `sheets[]` with `name`, `columns`, `rows`, `column_widths`, `freeze_top_row`, `number_format`. Cells starting with `=` are Excel formulas — always prefer formulas to hard-coded calculated values.

## Output handoff

1. Save each payload to `outputs/<check_reference_id>/<payload-name>.json`.
2. Invoke the matching render skill(s) in order:
   a. Save the working-paper payload to `outputs/<check_reference_id>/payload.json` and invoke `xbert-working-paper:render-pdf` with `--payload` (reportlab path). Wait for `status == "ok"`.
3. Each render skill emits a single JSON line on stdout with its own `status`/`path`/file-specific metadata.
4. Pass the saved path(s) and a one-line summary back to the user.

## Verification gate

Do not report any deliverable as produced until its render skill's JSON shows `status == "ok"`. For render-xlsx, `recalc.py` must also have run and returned no error cells. If any gate fails, surface the JSON to the user verbatim and stop — do not retry silently and do not claim success.
