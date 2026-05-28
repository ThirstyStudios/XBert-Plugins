---
name: fs-pack
description: Compose a year-end financial statement pack for an Australian client — SPFS structure by default, GPFS variant for audit clients. Use when the user asks to produce the year-end financial statements, generate the FS pack, draft the annual accounts, build the partner pack, or runs the /fs-pack slash command. Also triggers on "year-end accounts", "annual statements", "directors' declaration", "SPFS pack".
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# FS Pack

## Goal
Produce a partner-ready year-end financial statement pack — cover page, directors' declaration, BS, P&L, cashflow, statement of changes in equity, and notes-to-accounts shell — in Word and PDF, with the comparative-period column populated.

## Metrics
- **Comparative coverage** — every financial statement section has the prior-year column populated
- **Notes completeness** — notes shell covers every disclosable item present on the BS / P&L
- **First-pass quality** — pack is partner-readable without manual data entry beyond narrative paragraphs

## Default thresholds (practice-configurable)
| Threshold | Value | Used in |
|---|---|---|
| Default structure | SPFS | Pack type |
| Materiality for notes disclosure | $1,000 or 1% of revenue | Notes shell |
| Related-party balance disclosure | Any balance | Notes shell |
| FX revaluation disclosure | $500 unrealised | Notes shell |
| Provisions ageing band | 12 months (current / non-current split) | Working papers |

## Pack structure

### SPFS (default — small proprietary company)
1. Cover page — entity name, ABN, year-end date, pack type
2. Directors' declaration shell
3. Statement of profit or loss
4. Statement of financial position (balance sheet)
5. Statement of cashflows (indirect method)
6. Statement of changes in equity
7. Notes to the financial statements:
   - Note 1: Statement of significant accounting policies (shell)
   - Note 2: Revenue
   - Note 3: Expenses (key categories)
   - Note 4: Income tax
   - Note 5: Cash and equivalents
   - Note 6: Trade and other receivables
   - Note 7: Property, plant and equipment + accumulated depreciation
   - Note 8: Trade and other payables
   - Note 9: Provisions (annual leave, long service leave, doubtful debts)
   - Note 10: Issued capital
   - Note 11: Related party transactions
8. Working papers: provisions and accruals schedule

### GPFS (audit clients)
- All of SPFS, plus:
- Deeper accounting policies note with measurement bases per asset class
- Segment reporting where applicable
- Financial instruments disclosures (credit, liquidity, market risk)
- Detailed related-party schedule with transactions during the period
- Subsequent events note placeholder
- Auditor's independence declaration placeholder

## Cashflow derivation (indirect method)
When the ledger does not produce a cashflow:
1. Start with net profit from the P&L
2. Add back non-cash items (depreciation, amortisation, provisions, unrealised FX)
3. Adjust for working capital movements (Δ receivables, Δ inventory, Δ payables, Δ provisions)
4. Result = Cashflow from operations
5. Investing and financing sections pulled from BS movements on PP&E, borrowings, equity

## Process / rules
- Read-only — never post a journal, never change a ledger account
- Default to SPFS unless the user explicitly requests GPFS
- Always populate the comparative period from the prior-year BS/P&L
- Notes that have no underlying data: keep the heading, mark "Nil for the period" — do not silently drop
- Missing organisation settings (no ABN, no signing director) — surface as a blocker before generation; do not produce a half-populated cover page

## Always
- Read-only — the pack is a document, not a ledger operation
- Default structure is SPFS — never silently switch to GPFS
- Comparative period is mandatory — if prior year is unavailable, state it on the cover page and proceed
- Surface missing organisation settings before generating, not after
- Word + PDF are both produced — Word for editing, PDF for circulation

## Payload schema

After running the analysis, structure the result as JSON conforming to the render skill payload schemas (`xbert-working-paper/skills/render-docx/SKILL.md` for narrative outputs; `xbert-working-paper/skills/render-xlsx/SKILL.md` for spreadsheet outputs). For this plugin you produce:

- **fs-pack narrative**: consumed by `xbert-working-paper:render-docx` to produce the partner-editable Word pack; then passed to `xbert-working-paper:render-pdf` in docx-convert mode to produce the circulated PDF.

Common fields across payloads: `plugin: "xbert-fs-pack"`, `check_reference_id`, `tenant_name`, `period`, `prepared_by`, `prepared_at`, `title`, `qms_block`. The xlsx payload also needs `sheets[]` with `name`, `columns`, `rows`, `column_widths`, `freeze_top_row`, `number_format`. Cells starting with `=` are Excel formulas — always prefer formulas to hard-coded calculated values.

## Output handoff

1. Save each payload to `outputs/<check_reference_id>/<payload-name>.json`.
2. Invoke the matching render skill(s) in order:
   a. Save the narrative payload to `outputs/<check_reference_id>/payload.json` and invoke `xbert-working-paper:render-docx`. Wait for `status == "ok"`.
   b. Then invoke `xbert-working-paper:render-pdf` with `--from-docx` pointing at the just-written `working-paper.docx`. Wait for `status == "ok"` and `mode == "docx-convert"`.
3. Each render skill emits a single JSON line on stdout with its own `status`/`path`/file-specific metadata.
4. Pass the saved path(s) and a one-line summary back to the user.

## Verification gate

Do not report any deliverable as produced until its render skill's JSON shows `status == "ok"`. For render-xlsx, `recalc.py` must also have run and returned no error cells. If any gate fails, surface the JSON to the user verbatim and stop — do not retry silently and do not claim success.
