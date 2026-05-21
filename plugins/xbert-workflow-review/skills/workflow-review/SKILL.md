---
name: workflow-review
description: "Run the XBert Workflow Review against the customer's own Connect tenant — produces a structured audit document covering template consolidation, budget accuracy, workload balance, completion quality, and setup hygiene. Use this skill whenever the user asks to review, audit, or sanity-check their XBert workflow setup, asks how to clean up or rationalise their templates, asks whether their time budgets match reality, asks who is actually doing the work in their team, or runs the /workflow-review slash command. Also use when the user expresses any of: 'our setup has gotten messy', 'we set this up and never came back to it', 'something is off with our templates', or any other request that implies a structural audit of their workflow configuration in XBert. The skill handles the full flow — pulling data from MCP, computing findings deterministically, and producing a Word document that can be circulated inside the firm without editing."
---

# Workflow Review

A structured audit of a customer's XBert workflow setup, run by the customer against their own Connect tenant. Produces a Word document with six analytical sections plus a first-page summary, designed to be read by anyone from a workflow setup specialist through to a practice owner.

This skill is the implementation of the v01 plugin spec. The spec lives alongside this skill (`cowork_plugin_1_workflow_review_spec_v01.md` in the project) and is the source of truth for what the review covers and why.

## When to use

Trigger on any of:
- The `/workflow-review` slash command
- Direct requests: "review my workflow", "audit our templates", "is our setup healthy"
- Symptom-led requests: "our template library has gotten messy", "I'm not sure our time budgets are right", "is someone carrying too much of the load"
- Mid-setup sanity checks: "we're partway through configuring workflow and want a second opinion"

If the user is asking about a single template or schedule, that's *not* this skill — the workflow review is a structural audit across the entire tenant. Stay deliberate about scope.

## How it works

The skill is structured as **compute findings, then format findings** (per spec Section 8.3 — this keeps the option open to feed an in-app screen later). Two layers:

1. **Analysis (Python).** Loads the MCP extract, runs six section analyses, writes `findings.json`. Deterministic — no LLM judgment in the numbers.
2. **Document writer (Node.js).** Reads `findings.json`, produces the Word document. Also deterministic — the document structure and tone are fixed, only the numbers and named items vary by run.

Claude's role is to orchestrate (call MCP, invoke the scripts, present the result) and to handle any follow-up questions the user asks *after* the document is produced. Follow-up questions can use the data more flexibly — they don't have to follow the fixed six-section structure.

## Workflow

### Step 1 — Confirm the user wants to run the review

If the trigger is the slash command or a clear direct request, skip ahead. Otherwise, briefly confirm: "I can run a Workflow Review against your tenant — this produces a Word document covering template consolidation, budget accuracy, workload balance, and setup hygiene. Go ahead?"

Don't run the review without a positive signal. The MCP call may be non-trivial for large tenants.

### Step 2 — Pull the extract

Call the MCP tool `get_workflow_extract`. The tool is tenant-scoped automatically via the authenticated MCP layer — the user does not specify a tenant ID, and you should not ask for one.

Save the response to a working directory:

```
workdir/
├── extract.json       # raw MCP response
├── findings.json      # written by run_analysis.py
├── analysis.log       # brief log of what ran
└── workflow_review.docx   # final output
```

A reasonable working directory is `/tmp/workflow-review-<timestamp>/` — create it fresh each run.

If the MCP call fails or returns an empty result, surface that to the user — don't try to proceed with no data. If it's empty because the tenant has no clients configured at all, say so.

### Step 3 — Run the analysis

```bash
python scripts/run_analysis.py <workdir>/extract.json <workdir>
```

This produces `findings.json` and `analysis.log`. If `analysis.log` reports many sparse sections or "looks early-stage: True", that's fine — the document will surface this in its data-sparsity summary. Don't editorialise about it before producing the document.

### Step 4 — Generate the document

```bash
node scripts/write_document.js <workdir>/findings.json <workdir>/workflow_review.docx
```

The output is an `.docx` ready to circulate. The document already contains everything — first-page summary, data-sparsity summary, the six sections, and a closing paragraph.

Default deliverable is `.docx`. If the user explicitly asked for PDF or markdown earlier in the conversation, generate the docx first and then convert (use the `docx` skill's PDF conversion path for PDF). Don't ask the user to choose a format up-front — most want the default.

### Step 5 — Present to the user

Make the document available via `present_files`. Keep the surrounding message brief — the document speaks for itself:

> Here's the Workflow Review for [customer name]. Top findings:
>   - [headline from the first-page summary]
>   - [second headline]
>   - [third headline]
>
> Open the document for the full detail. Happy to discuss any of the findings in more depth.

Pull the headlines from `findings.section_6_recommendations.recommendations` (the top 2-3 by impact). Don't reproduce the full first-page summary in chat — that's what the document is for.

### Step 6 — Follow-up questions

After the document is produced, the user may ask follow-up questions: "tell me more about [template name]", "why is this template flagged as needs-review", "show me which clients are missing workflow coverage". These can be answered directly from `findings.json` and the original `extract.json` without re-running the pipeline.

For genuinely new questions the structured findings don't answer (e.g. "what's the most common assignment role"), you can read the extract directly and answer ad-hoc.

## Tone and language

**Structural observation, not blame.** The person reading the review is often the person who built the setup being reviewed. Lines like "this looks messy" or "this is wrong" are out. Lines like "11 templates share a common base process and could be collapsed" are in.

**Specific, not generic.** Named templates, named processes, named users. "Collapse the 11 variants of Bank Reconciliation" beats "consolidate where possible."

**Confidence labels matter.** The document labels each recommendation as Direct, Likely, or Needs review. When discussing recommendations with the user, preserve those distinctions — they signal where the data is unambiguous vs where human judgment is genuinely required.

## Materiality thresholds

All thresholds live in `scripts/constants.py` — one place to adjust. Defaults:
- Budget variance: 50% in either direction
- Completion quality non-completion rate: 30% (with 10+ notification floor)
- Per-user concentration: 30% of team time held by one user
- Stale template: 365 days
- Live schedule window: 90 days

If the user wants the thresholds tuned for their context, they can edit `constants.py` and re-run. v01 does not expose them as slash command arguments.

## Sparsity handling

The analysis detects sparsity per section (see `load_extract.py:summarise_sparsity`) and the document writer renders thin sections with an explicit "can't be assessed yet" note rather than padding. Do not try to fill in missing sections with speculation — the spec's principle is "if a section has nothing to report, say so explicitly, don't pad."

Two specific sparsity cases the user may ask about:
- **Early-stage tenancy** (low total notification volume): the document's data-sparsity summary flags this and suggests the customer qualify the review with the XBert team. If the user is in this state, support that — don't push them to act on thin findings.
- **No per-user time data**: the per-user load sub-analysis is gracefully skipped. This is normal for firms that don't track time at the user level.

## What this skill does NOT do

- **Write operations.** This is read-only analysis. The plugin suggests consolidations and corrections; it never makes them.
- **Per-instance notification analysis.** Use the aggregated counts in the extract; don't try to query individual notifications.
- **Multi-tenant reviews.** One tenant per run. The user's tenant is determined automatically.
- **Auto-scheduling.** The review runs on demand. Don't offer to schedule recurring runs.

## Reference files

- `references/output_structure.md` — the canonical document structure, used when extending or refining the writer
- `references/extract_schema.md` — the exact shape of what `get_workflow_extract` returns, used when extending the analysis
- `scripts/constants.py` — all tunable thresholds in one place
- `scripts/run_analysis.py` — orchestrator entry point
- `scripts/write_document.js` — document writer
