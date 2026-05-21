---
name: workflow-review
description: Run a structural audit of your XBert workflow setup — template consolidation, budget accuracy, workload balance, and setup hygiene. Produces a Word document.
---

# /workflow-review

Triggers the Workflow Review plugin against the authenticated user's Connect tenant.

## What this command does

Invokes the `workflow-review` skill, which:
1. Calls the `get_workflow_extract` MCP tool (tenant-scoped automatically — no arguments required)
2. Runs six section analyses deterministically (Python)
3. Generates a Word document via the document writer (Node.js)
4. Returns the `.docx` via `present_files` with a brief summary of the top findings

Typical run time: under a minute for a small-to-mid tenancy. Large tenancies may take longer if the MCP tool paginates.

## Arguments

None. The plugin is deliberately argumentless in v01 — the tenant is auto-scoped, the output format defaults to `.docx`, and the materiality thresholds are hardcoded in `scripts/constants.py`. If the user wants a different format (PDF, markdown), they can say so in chat after the command.

## When to use this command vs the natural-language trigger

The skill also fires on natural-language requests like "review my workflow setup" or "audit our templates." The slash command is the equivalent — same behaviour, faster to type, and unambiguous about scope.

If the user is asking about a single template, a single schedule, or a question that doesn't require a structural audit, neither this command nor the skill is the right path — answer in chat directly.

## Output

A Word document containing:
- Cover page with customer name and generation date
- First-page summary with the highest-impact findings
- Data-sparsity summary (what ran on full vs sparse data)
- Six analytical sections (snapshot, usage reality, consolidation, budget, health, recommendations)
- Closing summary with the XBert-team support hook

Plus a short chat-side summary highlighting the top 2-3 recommendations.

## After the command

The user can ask follow-up questions about any finding ("tell me more about template X", "why was this flagged as needs-review") — these are answered from the existing `findings.json` and `extract.json` without re-running the pipeline.
