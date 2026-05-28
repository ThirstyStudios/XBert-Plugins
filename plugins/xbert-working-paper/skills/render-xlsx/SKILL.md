---
name: render-xlsx
description: Render an XBert working-paper schedule as a real .xlsx file from a structured payload. Use when an XBert plugin (Tax Reconciliation, Div 7A Schedule, Trial Balance Alignment, Practice Metrics, FBT Prep, Payment Run, Month-End Pack and similar) has finished its analysis and produced a schedule-shaped payload that needs to become an Excel workbook with formula-live cells. Triggers include "Excel schedule", ".xlsx", "Excel workbook", "tax reconciliation Excel", "Div 7A schedule Excel", "trial balance Excel". Do NOT use for narrative working papers (use render-docx), PDF outputs (use render-pdf), chat-only summaries, or anything that isn't a structured spreadsheet payload.
allowed-tools: Bash(python3 *) Bash(pip install *) Bash(soffice *) Write(*) Read(*)
---

# Render an Excel schedule

Take a structured schedule payload from an XBert consumer plugin and write a `.xlsx` file with formula-live cells. Validate the workbook before reporting success, including a mandatory recalculation step that fails on `#REF!`, `#DIV/0!`, `#VALUE!`, `#N/A`, `#NAME?`.

## Payload schema

```json
{
  "check_reference_id": "TAXRECON-2026FY-11752-001",
  "plugin": "xbert-tax-reconciliation",
  "tenant_name": "Acme Pty Ltd",
  "period": "FY2026",
  "title": "Accounting-to-Tax Reconciliation",
  "sheets": [
    {
      "name": "Reconciliation",
      "columns": ["Item", "Accounting", "Adjustment", "Tax"],
      "column_widths": [40, 14, 14, 14],
      "rows": [
        ["Accounting profit",        125000.00, 0,        125000.00],
        ["Add: Entertainment 50%",      0,      2400.00,    2400.00],
        ["Less: Accounting depreciation", 0,  -18500.00,  -18500.00],
        ["Add: Tax depreciation",       0,    21300.00,   21300.00],
        ["Taxable income",            "=SUM(B2:B5)", "=SUM(C2:C5)", "=SUM(D2:D5)"]
      ],
      "header_style": "default",
      "freeze_top_row": true,
      "number_format": "#,##0.00;(#,##0.00)"
    }
  ]
}
```

Cells that start with `=` are interpreted as Excel formulas (per Anthropic's xlsx skill guidance — always prefer formulas to hard-coded calculated values). Save the payload to `outputs/<check_reference_id>/payload.json`.

## Render

```!
python3 "${CLAUDE_SKILL_DIR}/scripts/render_xlsx.py" --payload outputs/<check_reference_id>/payload.json --out outputs/<check_reference_id>/working-paper.xlsx
```

The script uses `openpyxl` for writing and `pandas` if numeric reshaping is needed. It emits a JSON line on stdout: `path`, `exists`, `size_bytes`, `sheet_count`, `cell_count`, `status`.

If `openpyxl` is not installed:

```!
pip install --quiet openpyxl pandas
```

## Mandatory recalc gate

After writing the file, force a recalculation pass and scan for errors. Anthropic's official xlsx skill mandates this:

```!
python3 "${CLAUDE_SKILL_DIR}/scripts/recalc.py" outputs/<check_reference_id>/working-paper.xlsx 30
```

If LibreOffice (`soffice`) is on PATH the script uses it headlessly to recalculate formulas; otherwise it scans the saved file for static error cells. Either way, the script returns JSON with `status: "ok"` or `status: "errors_found"` plus a list of offending cells.

## Verification gate

Report success **only** when:

- The render script JSON has `status == "ok"` and `cell_count > 0`.
- The recalc script JSON has `status == "ok"` and no errors listed.
- The file exists and `size_bytes > 1024`.

If anything fails, surface the offending cells (sheet + cell ref + error code) verbatim. Do not paper over `#REF!`.

## Output handoff

> Schedule saved to `outputs/TAXRECON-2026FY-11752-001/working-paper.xlsx` — 1 sheet (Reconciliation), 5 rows, formulas validated.

## What this skill does not do

- It does not compute the adjustments — the consumer plugin must build the payload with the right numbers (or formulas).
- It does not produce a narrative working paper — see [render-docx](../render-docx/SKILL.md).
- It does not convert to PDF — see [render-pdf](../render-pdf/SKILL.md).
