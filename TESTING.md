# Testing the render upgrade — v0.2.0

This release wires 26 consumer plugins to the new `xbert-working-paper` plugin so they produce real `.docx`, `.xlsx`, and `.pdf` files instead of describing them. This document is the smoke test plan.

## What changed

- **New plugin** `xbert-working-paper` (v0.1.0) with three skills: `render-docx`, `render-xlsx`, `render-pdf`. Each ships bundled Python scripts and a mandatory verification gate.
- **26 consumer plugins bumped to v0.2.0**: every SKILL.md gained Payload schema / Output handoff / Verification gate sections, every command.md got explicit render-skill invocation steps, every plugin.json had one workflow step rewritten.
- **PLUGIN_GUIDE.md §4a** added: the render contract is now a contributor-mandatory section for any plugin whose deliverable is a file.

12 plugins did not change (chat-only deliverables): aged-receivables, ar-cadence, capacity, cashflow-13week, client-onboard, close-chase, end-of-period-dashboard, firm-inbox-triage, fx-review, payroll-close, pulse, receipt-review.

## Prerequisites

Before testing locally:

- Claude Code v2.1.145+ (required for `${CLAUDE_SKILL_DIR}` and the modern skill loader).
- Python 3.10+ on PATH. Verify: `python3 --version`.
- Recommended: LibreOffice on PATH (`soffice --version` should print). Without it, `render-pdf` cannot convert `.docx` to PDF and `render-xlsx` cannot force formula recalculation — both still function on the static-scan fallback.
- Pip-installable packages (the skills install on first run if missing): `python-docx`, `docxtpl`, `openpyxl`, `pandas`, `reportlab`, `pypdf`.

## Install

In a Claude Code session inside a clean test project:

```
/plugin marketplace add ThirstyStudios/XBert-Plugins
/plugin install xbert-working-paper@xbert
/plugin install xbert-bas-prep@xbert
/plugin install xbert-tax-reconciliation@xbert
/plugin install xbert-close-packet@xbert
```

(Substitute any other consumer plugin you want to test. `xbert-working-paper` must be installed alongside any plugin you exercise — Claude will not find the render skill otherwise.)

## Smoke tests

### Test 1 — render-docx (single Word output)

Plugin: `xbert-bas-prep` (representative of all 18 Word-only plugins)

1. Start Claude Code in a clean directory.
2. Run `/bas-prep`. Pick any client + period; the wiring is independent of real MCP data — Claude will produce a payload even from synthetic inputs if you guide it.
3. Expected behaviour:
   - Claude builds the payload conforming to the render-docx schema.
   - Saves `outputs/<check_reference_id>/payload.json`.
   - Invokes `xbert-working-paper:render-docx`.
   - The bundled Python script writes `outputs/<check_reference_id>/working-paper.docx`.
   - Emits a JSON line on stdout with `status: "ok"`, `opens_cleanly: true`, `paragraph_count > 0`.
   - Reports the file path back as the last line: `Working paper saved to outputs/.../working-paper.docx`.
4. Verify on disk: open the `.docx` in Word / LibreOffice. Confirm: title, executive summary, every section heading, blocking issues flagged with `⚠`, QMS block at end.
5. **Fail conditions**: stdout JSON shows `status: "errors_found"`, or the file is missing/under 1 KB, or Claude reports success without the path. Any of these means the render skill is mis-wired — file a bug naming the plugin and the JSON output verbatim.

### Test 2 — render-xlsx with recalc gate

Plugin: `xbert-tax-reconciliation` (exercises both `render-xlsx` and `render-pdf`)

1. Run `/tax-reconciliation`. Provide a tenant + FY.
2. Expected: two payloads saved (`schedule.json` for the workbook, `payload.json` for the PDF narrative), two render skill invocations, two files emitted.
3. Verify the `.xlsx`:
   - Open in Excel / LibreOffice.
   - Formulas are live (cells starting with `=` evaluate, not display as text).
   - No `#REF!`, `#DIV/0!`, `#VALUE!`, `#N/A`, `#NAME?` anywhere.
   - The `recalc.py` JSON output should have `status: "ok"` and `errors: []`.
4. Verify the `.pdf`:
   - Opens in any PDF reader.
   - At least one page, with the title, sections, and QMS block visible.
   - JSON output shows `mode: "reportlab"` (since this plugin authors from payload, not converts from docx).

### Test 3 — render-docx → render-pdf chain

Plugin: `xbert-close-packet` (covers all docx-then-pdf-convert plugins)

1. Run `/close-packet`.
2. Expected sequence:
   - render-docx runs first, emits `working-paper.docx` with `status: "ok"`.
   - render-pdf runs second with `--from-docx` pointing at the .docx, emits `working-paper.pdf` with `status: "ok"` and `mode: "docx-convert"`.
3. Verify both files exist in `outputs/<check_reference_id>/`. The PDF should be a faithful conversion of the .docx (page count >= 1, headings preserved).
4. If LibreOffice is not installed, render-pdf will fall back to reportlab authoring from the payload — that still works but the styling diverges. Expected `mode: "reportlab"` in that case.

### Test 4 — verification gate failure

Goal: confirm the gate actually fails loudly, doesn't paper over errors.

1. After Test 2 completes, manually corrupt the .xlsx (open it, type `=1/0` into an empty cell, save).
2. Run `python3 plugins/xbert-working-paper/skills/render-xlsx/scripts/recalc.py outputs/<id>/working-paper.xlsx 30` directly.
3. Expected: `status: "errors_found"`, with the cell location listed in `errors[]`.
4. This confirms the recalc gate scans correctly. A render orchestration that hit a real `#REF!` would surface it identically.

### Test 5 — copy honesty (no real file produced — verify error path)

Goal: confirm a missing dependency surfaces cleanly.

1. In a fresh project, uninstall `python-docx`: `pip uninstall -y python-docx docxtpl`.
2. Run `/bas-prep` and trigger render-docx.
3. Expected: render script exits non-zero, emits JSON with `status: "errors_found"` and `error: "missing dependency: docx. Install: pip install python-docx docxtpl"`.
4. Claude surfaces the JSON verbatim and does NOT claim the working paper was produced.
5. After install, retry — gate passes.

## What to look for in the field

When sharing v0.2.0 with pilot firms:

- **Output folder convention**: every run lands under `outputs/<check_reference_id>/`. The check reference ID is the consumer plugin's choice (e.g. `BAS-2026Q1-<tenantId>-001`). Don't change it between runs of the same period — the folder is the audit trail.
- **Dependency installs**: first-run users on Windows often lack LibreOffice. The skills tell them what to install; they do not auto-install. Document this in your firm's onboarding.
- **Branded templates**: out of the box every output uses the default XBert palette (#1C1B41 / #4E53BD) in python-docx / reportlab styling. To brand: hand-author a Jinja-tagged `.docx` and drop it at `plugins/xbert-working-paper/skills/render-docx/templates/<plugin>.docx`. The render script auto-detects by plugin name and switches to `docxtpl`.

## Known limitations (v0.2.0)

- `docxtpl` template path is wired but no templates are shipped — all output uses the python-docx default until you author them.
- `render-pdf --from-docx` requires LibreOffice; the reportlab fallback authors a different-looking document. Long-term we should commit to one path.
- The recalc gate uses LibreOffice headless if available. On Windows without LO, formulas are scanned statically (catches `#REF!`-as-string but not formulas that evaluate to errors at open time). LO is strongly recommended.
- No CI guardrail yet that fails PRs missing the render contract sections — that's the next ticket.

## Rollback

If a consumer plugin needs to roll back to chat-only:

1. Bump `version` back to `0.1.2` in `plugin.json` and `marketplace.json`.
2. Strip the Payload schema / Output handoff / Verification gate sections from SKILL.md.
3. Revert the command file's render steps.

The `xbert-working-paper` plugin can stay installed — consumer plugins that don't reference it simply don't trigger it.
