---
name: render-docx
description: Render an XBert working paper as a real .docx file from a structured payload. Use when an XBert plugin (BAS Prep, IAS Prep, FBT Prep, STP Finalisation, Super Check, TPAR, VAT Prep, GST Prep NZ, MTD Prep, Tax Reconciliation, Close Packet, Month-End Pack, FS Pack, Trial Balance Alignment, Balance Sheet Explain, Practice Health Check, Workflow Review, Config Audit, Audit Evidence Pack, Anomaly Review, Policy Review, Client Fee Review, Practice Metrics) has finished its analysis and produced a working-paper payload that needs to become a Word document on disk. Triggers include "working paper", "audit document", "Word document", ".docx", "render the BAS pack", "render the FBT pack", or any consumer-plugin output that names a structured docx deliverable. Do NOT use for raw markdown summaries, chat-only deliverables, Excel schedules (use render-xlsx), PDF-only outputs (use render-pdf), or documents unrelated to XBert plugin payloads.
allowed-tools: Bash(python3 *) Bash(pip install *) Write(*) Read(*)
---

# Render a Word working paper

Take a structured payload from an XBert consumer plugin and write a branded `.docx` file to `outputs/<check-reference-id>/working-paper.docx`. Verify the file before reporting success.

## When this skill fires

A consumer plugin (e.g. `xbert-bas-prep`) has just completed its readiness work and produced a payload in the schema below. You — the model — call this skill to do the rendering.

## Payload schema

The consumer plugin gives you JSON conforming to this shape. If a field is missing, leave it empty; do not invent values.

`plugin_version` is optional but should be supplied by every consumer plugin (read from its own `.claude-plugin/plugin.json`) — it is stamped on the cover page and in the Quality management block so any working paper can be traced back to the plugin version that produced it.

```json
{
  "check_reference_id": "BAS-2026Q1-11752-001",
  "plugin": "xbert-bas-prep",
  "plugin_version": "0.2.1",
  "tenant_name": "Acme Pty Ltd",
  "period": "Jan-Mar 2026",
  "prepared_by": "Junior Bookkeeper Name",
  "prepared_at": "2026-05-28T09:15:00+10:00",
  "title": "BAS Readiness Working Paper",
  "subtitle": "Pre-lodgement check for Q3 2026",
  "executive_summary": "Two sentences naming the headline finding and whether the BAS is ready to lodge.",
  "sections": [
    {
      "heading": "Readiness summary",
      "body": "Markdown-style body. Paragraphs separated by blank lines.",
      "blocking": false,
      "table": null
    },
    {
      "heading": "Blocking issues",
      "body": "One paragraph naming each issue.",
      "blocking": true,
      "table": {
        "columns": ["Account", "Issue", "Action"],
        "rows": [
          ["1-1110 Cheque account", "Bank rec gap of $1,402.15", "Reconcile before lodging"],
          ["2-3100 GST collected", "G1 trace short by $84.10", "Investigate Mar invoice 4421"]
        ]
      }
    },
    {
      "heading": "Prior-period variance",
      "body": "...",
      "blocking": false,
      "table": null
    }
  ],
  "qms_block": {
    "firm_name": "XBert Test Firm",
    "preparer": "Junior Bookkeeper Name",
    "reviewer": null,
    "certification": "Prepared in accordance with the firm's BAS preparation methodology."
  },
  "appendix": [
    { "heading": "Supporting figures", "body": "Optional tables or notes." }
  ]
}
```

Save the payload to `outputs/<check_reference_id>/payload.json` so the run is reproducible.

## Render

Run the bundled script:

```!
python3 "${CLAUDE_SKILL_DIR}/scripts/render_docx.py" --payload outputs/<check_reference_id>/payload.json --out outputs/<check_reference_id>/working-paper.docx
```

The script:
1. Loads the payload.
2. If `templates/<plugin>.docx` exists inside this skill, fills it via docxtpl (Jinja-tagged). Otherwise builds the document from scratch with python-docx using the default XBert styling defined in `scripts/render_docx.py`.
3. Writes the file.
4. Returns a single JSON line on stdout with `path`, `exists`, `size_bytes`, `opens_cleanly`, `paragraph_count`, `status`.
5. Exits non-zero if `status != "ok"`.

If `python-docx` (and optionally `docxtpl`) is not installed, install it once:

```!
pip install --quiet python-docx docxtpl
```

## Verification gate

After the script runs, read the JSON it emitted. Do **not** report success unless:

- `status == "ok"`
- `exists == true`
- `size_bytes > 1024`
- `opens_cleanly == true`

If any check fails, surface the JSON to the user, name the failure, do not claim the working paper was produced.

## Output handoff

When the gate passes, tell the user where the file is and one line of what's in it:

> Working paper saved to `outputs/BAS-2026Q1-11752-001/working-paper.docx` — 4 sections, 2 blocking issues, prior-period variance table included.

Use the path verbatim. Do not paraphrase.

## Recommended Findings Summary shape

Consumer plugins that produce a Findings Summary section are encouraged to use this five-column table structure for consistency across working papers:

| Ref | Finding | Risk | Recommended Action | If Not Actioned |
|---|---|---|---|---|
| F1 | Description of the finding | High / Medium / Low / Information | Concrete action to resolve | One sentence: what happens if the firm does nothing |

This is a recommendation, not a hard requirement — the renderer handles any table shape. The `xbert-config-audit` plugin adopts this shape; other plugins may follow as they are updated.

## What this skill does not do

- It does not file the working paper into a client folder for you — that step is manual.
- It does not email or share the file.
- It does not generate the **content** — that's the consumer plugin's job. This skill takes a payload and renders it.
- It does not handle Excel schedules — see [render-xlsx](../render-xlsx/SKILL.md).
- It does not handle authored PDFs — see [render-pdf](../render-pdf/SKILL.md).
