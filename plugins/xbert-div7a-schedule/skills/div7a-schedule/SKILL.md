---
name: div7a-schedule
description: Build a Division 7A loan schedule per shareholder loan — opening, advances, repayments, interest at the benchmark rate, minimum yearly repayment, and complying-loan-agreement assumption check. Use when the user asks for the Div 7A schedule, the shareholder loan schedule, the minimum repayment calc, year-end Div 7A walk, or runs the /div7a-schedule slash command. Also triggers on "Div 7A", "shareholder loan", "loan to director", "deemed dividend risk", "complying loan agreement".
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Div 7A Schedule

## Goal
Build a year-end Division 7A loan schedule per shareholder loan — opening balance, advances, repayments, interest accrual at the ATO benchmark rate, closing balance, and minimum yearly repayment calculation. Output is an Excel workbook with one tab per loan.

## Metrics
- **Schedule coverage** — every identified shareholder loan has a complete walk
- **Minimum repayment compliance** — % of loans where actual repayment ≥ minimum required
- **Deemed-dividend risk count** — loans with non-complying agreement, shortfall, or other flag

## Default thresholds (practice-configurable)
| Threshold | Value | Used in |
|---|---|---|
| Shortfall materiality | $1 below minimum | Compliance flag |
| Loan term default | 7 years (unsecured) | Minimum repayment calc |
| Loan term (secured by real property) | 25 years | Minimum repayment calc |
| Benchmark rate source | User-entered (v1 capability gap) | Interest accrual |
| Loan identification confidence | Account name pattern + related-party contact link | Loan acceptance |

## Process / rules

### Step 1 — Identify shareholder loan accounts
Scan the chart of accounts for accounts that look like Div 7A in scope:
- Account name patterns: "Loan to [Shareholder]", "Director Loan", "Beneficiary Loan", "Loan Account — [Name]"
- Cross-reference against the contacts list for shareholder / related-party tags
- A loan is accepted into the schedule when both signals align (name pattern + contact link)
- If only one signal: surface for user confirmation rather than silently including/excluding

### Step 2 — Walk each loan
For each accepted loan:
- **Opening balance**: prior-year closing
- **Advances**: net new advances during the year (debit movements)
- **Repayments**: net repayments during the year (credit movements)
- **Interest**: opening balance × benchmark rate (or weighted-average balance for material in-year movements)
- **Closing balance**: opening + advances + interest − repayments

### Step 3 — Minimum yearly repayment
Per Div 7A formula:
- Minimum yearly repayment = closing balance / present value factor for remaining loan term at benchmark rate
- For a 7-year unsecured loan in year N (of 7), the formula collapses to a known annuity payment
- Calculate per loan — never aggregate across loans for a single shareholder

### Step 4 — Compliance check
- Compare actual repayments during the year vs minimum required
- Flag shortfall (any $ below the minimum) — this is a deemed-dividend trigger

### Step 5 — Complying-loan-agreement assumption
- v1 ASSUMES a complying loan agreement is in place
- The working paper notes this assumption explicitly
- If the user confirms there is no complying agreement: flag the underlying advance as a potential deemed dividend, surface for partner review

### Step 6 — Excel output
- One worksheet per loan
- Working paper tab with benchmark rate used + assumption set
- Next-year reminder cell

## Capability gap (v1)
- Automated ATO benchmark-rate lookup is not yet available in XBert
- v1 requires the user to enter the benchmark rate for the income year
- This is documented explicitly in the workflow — not a hidden limitation

## Always
- Read-only on the ledger — no journals posted
- One worksheet per loan; never aggregate minimum repayments across loans for a shareholder
- Surface single-signal loan identifications for user confirmation; don't silently include or exclude
- Complying-loan-agreement is an explicit assumption documented in the working paper — never silently assumed true
- Benchmark rate is user-entered in v1 — never guess

## Payload schema

After running the analysis, structure the result as JSON conforming to the render skill payload schemas (`xbert-working-paper/skills/render-docx/SKILL.md` for narrative outputs; `xbert-working-paper/skills/render-xlsx/SKILL.md` for spreadsheet outputs). For this plugin you produce:

- **per-loan schedule workbook**: consumed by `xbert-working-paper:render-xlsx` — one worksheet per loan (opening / advances / repayments / interest / closing rows, minimum repayment calc), a working paper tab listing benchmark rate + assumption set, and a next-year reminder cell.

Common fields across payloads: `plugin: "xbert-div7a-schedule"`, `check_reference_id`, `tenant_name`, `period`, `prepared_by`, `prepared_at`, `title`, `qms_block`. The xlsx payload also needs `sheets[]` with `name`, `columns`, `rows`, `column_widths`, `freeze_top_row`, `number_format`. Cells starting with `=` are Excel formulas — always prefer formulas to hard-coded calculated values.

## Output handoff

1. Save each payload to `outputs/<check_reference_id>/<payload-name>.json`.
2. Invoke the matching render skill(s) in order:
   a. Save the per-loan schedule workbook payload to `outputs/<check_reference_id>/workbook.json` and invoke `xbert-working-paper:render-xlsx`. Wait for `status == "ok"` and the `recalc.py` gate to pass with no error cells.
3. Each render skill emits a single JSON line on stdout with its own `status`/`path`/file-specific metadata.
4. Pass the saved path(s) and a one-line summary back to the user.

## Verification gate

Do not report any deliverable as produced until its render skill's JSON shows `status == "ok"`. For render-xlsx, `recalc.py` must also have run and returned no error cells. If any gate fails, surface the JSON to the user verbatim and stop — do not retry silently and do not claim success.
