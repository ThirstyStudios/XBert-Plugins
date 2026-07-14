# XBert Workflow Review

Run a structural audit of your XBert workflow setup with one command.

## What it does
- Pulls a point-in-time extract of your workflow configuration via MCP
- Runs six deterministic analyses: snapshot, usage reality, consolidation, budget accuracy, health flags, and recommendations
- Produces a Word document with named findings ranked by impact
- Labels each recommendation as Direct, Likely, or Needs review

## Prerequisites
- XBert account with workflow configured
- At least one active client with schedules
- XBert Working Paper companion plugin installed (renders the Word document)

## Usage
After installing, type:

    /workflow-review

in any Claude chat (Desktop or Code).

## What the document covers
1. **Snapshot** — client counts, template counts, coverage
2. **Usage reality** — live/dormant/zombie schedules, orphaned assignments, completion quality, per-user load
3. **Consolidation** — base-process variant groups, role-only variants, override vs duplicate patterns
4. **Budget accuracy** — templates where budgeted time diverges from actuals, ranked by annualised impact
5. **Health flags** — unassigned schedules, stale templates, duplicate names, inconsistent assignments
6. **Recommendations** — 5-10 prioritised actions with confidence labels and named affected items

## Support
hello@xbert.io
