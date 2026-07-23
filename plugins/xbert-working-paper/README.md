# XBert Working Paper

The shared render layer behind the XBert review plugins.

XBert plugins describe the methodology — what to check, what to compute, what's blocking. This plugin owns the layer underneath: bundled Python scripts that take a structured payload and write a real `.docx`, `.xlsx` or `.pdf` to your project folder, with a verification gate that fails loudly if the file didn't open cleanly.

## What it does

- **render-docx** — turns a working-paper payload into a styled Word document. Uses `docxtpl` when a Jinja-tagged template exists for the plugin (`templates/<plugin>.docx`), otherwise builds the doc from scratch with `python-docx`.
- **render-xlsx** — turns a schedule payload into a formula-live workbook with `openpyxl`. Includes the Anthropic-mandated recalc gate that scans for `#REF!` / `#DIV/0!` / `#VALUE!` / `#N/A` / `#NAME?` and fails the render if any are found.
- **render-pdf** — converts a `.docx` produced by render-docx to PDF via LibreOffice headless, or authors a PDF from scratch with `reportlab` Platypus when the consumer plugin's output is PDF-only.

Each skill emits a single JSON line on stdout after running so the verification gate can be checked deterministically — no "looks fine" outputs.

## Prerequisites

- Python 3.10+ on PATH
- First-run pip installs (the skills do this for you):
  - `python-docx` + optional `docxtpl`
  - `openpyxl` + optional `pandas`
  - `reportlab` + optional `pypdf`
- LibreOffice (`soffice` / `libreoffice`) on PATH is **recommended** — it powers xlsx recalc and docx→pdf conversion. Skills fail loudly and tell you what to install when it's missing.

## Usage

You do not normally invoke these skills directly, and this plugin adds no slash command of its own. A consumer plugin (XBert Anomaly Review, XBert Config Audit, XBert Workflow Review) completes its analysis, emits a structured payload, and Claude picks the right render skill. Output lands in `outputs/<check-reference-id>/`.

To run a renderer by hand, call the bundled script directly:

    python3 skills/render-docx/scripts/render_docx.py --payload outputs/MY-RUN/payload.json --out outputs/MY-RUN/working-paper.docx

Each skill's `SKILL.md` documents the payload schema in full.

## Adding a branded template

Drop a Jinja-tagged `.docx` into `skills/render-docx/templates/<plugin>.docx`. The render script detects it by plugin name and uses `docxtpl` instead of building from scratch. The Jinja context is the full payload (so `{{ tenant_name }}`, `{% for section in sections %}…{% endfor %}` etc.).

## Support

hello@xbert.io
