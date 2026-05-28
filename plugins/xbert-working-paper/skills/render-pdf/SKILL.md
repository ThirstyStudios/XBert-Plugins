---
name: render-pdf
description: Render an XBert working paper as a real .pdf. Use after render-docx has produced a working-paper.docx (preferred path — soffice converts the .docx to PDF preserving styling) or when a consumer plugin (Instalment Variation, Payment Run, Tax Reconciliation, Close Packet, Month-End Pack, FS Pack) emits a payload that needs a standalone authored PDF. Triggers include "PDF working paper", ".pdf", "PDF audit document", "remittance PDF", "render as PDF". Do NOT use for Word working papers (use render-docx) or Excel schedules (use render-xlsx) or chat-only outputs.
allowed-tools: Bash(python3 *) Bash(pip install *) Bash(soffice *) Bash(libreoffice *) Write(*) Read(*)
---

# Render a PDF working paper

Two paths, picked automatically by the bundled script:

1. **Preferred — convert from an existing .docx.** If `outputs/<run-id>/working-paper.docx` exists (because render-docx ran first), convert it to PDF via LibreOffice headless. The .docx styling carries over.
2. **Fallback — author the PDF from scratch with reportlab.** For plugins whose output is PDF-only (remittances, instalment variation notes), build from a payload using reportlab Platypus.

## Convert from .docx (preferred)

```!
python3 "${CLAUDE_SKILL_DIR}/scripts/render_pdf.py" --from-docx outputs/<check_reference_id>/working-paper.docx --out outputs/<check_reference_id>/working-paper.pdf
```

Requires LibreOffice on PATH (`soffice` or `libreoffice`). If not present the script falls back to reportlab authoring from a payload, if one was provided.

## Author from a payload

Same payload schema as render-docx (see [render-docx/SKILL.md](../render-docx/SKILL.md)). Save it as `outputs/<check_reference_id>/payload.json`.

```!
python3 "${CLAUDE_SKILL_DIR}/scripts/render_pdf.py" --payload outputs/<check_reference_id>/payload.json --out outputs/<check_reference_id>/working-paper.pdf
```

If `reportlab` is not installed:

```!
pip install --quiet reportlab
```

## Verification gate

The script emits JSON: `path`, `exists`, `size_bytes`, `page_count`, `mode` (`"docx-convert"` or `"reportlab"`), `status`.

Report success only when `status == "ok"` and `page_count >= 1`.

## Output handoff

> PDF saved to `outputs/INSTVAR-2026Q3-11752-001/working-paper.pdf` — 3 pages, authored via reportlab.

## What this skill does not do

- It does not generate the content; payload comes from the consumer plugin.
- It does not produce a Word version (use render-docx first, then optionally this skill to convert).
- It does not sign, encrypt, or watermark — out of scope for v1.
