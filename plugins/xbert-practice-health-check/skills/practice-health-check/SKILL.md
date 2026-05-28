---
name: practice-health-check
description: "Run the XBert Practice Health Check across a Connect tenant — portfolio-wide data-quality and financial-health snapshot with diagnostic and prescriptive recommendations per client. Use when the user asks to assess practice health, sanity-check the book, identify deteriorating clients, find which clients need attention, run a monthly health check, or invokes the /practice-health-check slash command. Also triggers on 'how healthy is my book', 'which clients are slipping', 'where should I focus this month'."
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Practice Health Check

A portfolio-level diagnostic that rolls up data-quality and notification signals across every client in a Connect tenant, bands the portfolio, then drills into the worst-performing N with prescriptive recommendations.

## Goal
Move beyond descriptive scores. For every flagged client, answer "what this means" and "what's likely causing it" so the principal can act, not just observe.

## Metrics
- **DQ score** — per-client data-quality score (0-100)
- **Outstanding notification load** — count and risk-weight from the notification summary
- **30-day completion rate** — from notification summary
- **Coverage** — connections per client, ledger type (Xero / QuickBooks / XPM / none)
- **Cohort age** — months since first connection

## Default thresholds (practice-configurable)
| Band | DQ score | Outstanding notifications |
|---|---|---|
| Healthy | >=85 | <10 |
| Watch | 70-84 | 10-25 |
| Risk | 55-69 | 26-50 |
| Critical | <55 | >50 |

Bands take the worst of (score band, notification band). Cohort minimum: 3 months operating history; below that, mark as "early stage — assess later".

## Process / rules
1. **Portfolio snapshot** — total clients, count per band, deteriorating count (run-over-run; v1 = single snapshot, v2 = trend).
2. **Worst-N drill-down** — default 10, user-configurable. For each:
   - Top three findings (named: e.g. "32 unreconciled bank transactions over 30 days", not "data quality issues")
   - "What this means" — business impact in one sentence
   - "What's likely causing it" — pattern-matched root cause from the data
   - One prescriptive recommendation per finding, impact-ranked
3. **Coverage variance** — non-Xero clients get fewer signals; flag this explicitly, do not lower their score for missing data we cannot see.
4. **Top portfolio issues** — three patterns repeating across the book, ranked by how many clients are affected.

## Always
- **Diagnostic, not descriptive.** Every finding paired with what it means and what's causing it.
- **Specific, not generic.** Name the client, name the issue. "Acme Pty Ltd: 32 unreconciled bank transactions" beats "data quality issues observed".
- **Graceful degradation.** Mark thin-data clients "insufficient history" — never speculate.
- **Read-only.** Suggest never apply. The user actions changes in XBert.
- **Coverage honesty.** State which clients had partial signal sets and why.
- **Tone is structural observation, not blame.** The reader is often the person who built the setup being reviewed.

## Payload schema

After running the analysis, structure the result as JSON conforming to the render-docx payload schema (defined in `xbert-working-paper/skills/render-docx/SKILL.md`). Required fields:

- `plugin`: `"xbert-practice-health-check"`
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
