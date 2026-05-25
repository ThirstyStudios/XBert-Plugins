---
name: workflow-review
description: "Run the XBert Workflow Review against the customer's own Connect tenant — produces a structured audit document covering template consolidation, budget accuracy, workload balance, completion quality, and setup hygiene. Use this skill whenever the user asks to review, audit, or sanity-check their XBert workflow setup, asks how to clean up or rationalise their templates, asks whether their time budgets match reality, asks who is actually doing the work in their team, or runs the /workflow-review slash command. Also triggers on: 'our setup has gotten messy', 'we set this up and never came back to it', 'something is off with our templates', or any request implying a structural audit of workflow configuration."
---

# Workflow Review

A structural audit of a customer's XBert workflow setup, run against their own Connect tenant. Produces a Word document with six analytical sections plus a first-page summary, designed to be read by anyone from a workflow setup specialist through to a practice owner.

## When to use

Trigger on any of:
- The `/workflow-review` slash command
- Direct requests: "review my workflow", "audit our templates", "is our setup healthy"
- Symptom-led requests: "our template library has gotten messy", "I'm not sure our time budgets are right", "is someone carrying too much of the load"
- Mid-setup sanity checks: "we're partway through configuring workflow and want a second opinion"

If the user is asking about a single template or schedule, that's *not* this skill — the workflow review is a structural audit across the entire tenant. Stay deliberate about scope.

## Data sources

Pull data via the XBert MCP gateway. All data is tenant-scoped automatically via the authenticated session:

1. **Capacity data** — for the Connect tenant, all users. Returns workload distribution, outstanding work, available hours, utilisation per user.
2. **Activity data** — for the Connect tenant, the last 12 months. Returns activity metrics by user, time period, and type.
3. **Notification summary** — per client tenant. Returns outstanding notifications grouped by analytics category and risk level, plus 30-day completion rate.
4. **Template & schedule configuration** — for the Connect tenant. Returns template definitions, schedule configuration, and assignment details.

If a data source is unavailable, note it in the sparsity summary and degrade the relevant section gracefully.

## Analysis framework

### Section 1 — Snapshot
At-a-glance counts:
- Total clients, clients with active workflow, coverage %
- Total templates, priority templates, templates with subtasks
- Total schedules, active vs inactive
- Distinct base processes in use
- Estimated annual notification volume

### Section 2 — What's actually being used (six sub-analyses)

**2.1 Live / dormant / zombie classification**
- Live: produced a notification within 90 days
- Dormant: configured to fire but no notification in 180+ days
- Zombie: fired notifications within 90 days but zero completions all-time

**2.2 Zero-notification templates**
Templates that have never produced a notification across any client/schedule.

**2.3 Orphaned assignments**
Active schedules assigned to inactive users.

**2.4 Completion quality**
Templates where notifications fire but resolve via cancellation, snooze, or dismissal rather than completion.
- Gate 1: ≥10 notifications in the last 12 months
- Gate 2: non-completion rate ≥30%

**2.5 Per-user load**
Distribution of logged time across users.
- Concentration risk: top user holds >30% of total team time
- Floor: total team time ≥600 minutes before assessing
- Zero-load assigned users: assigned to schedules but no logged time

**2.6 Locked-client schedules**
Active schedules on clients flagged as locked or deletion-pending.

### Section 3 — Consolidation opportunities (three sub-analyses)

**3.1 Base-process variant groups**
Templates sharing a BaseProcessTagId. Any group with 2+ distinct templates is a consolidation candidate.

**3.2 Role-only variants**
Templates within a base-process group that differ solely by role assignment — collapse onto a single template with role-aware scheduling.

**3.3 Override vs duplicate pattern**
Quantify: how many schedules use per-schedule time overrides (clean) vs how many distinct templates exist solely as budget variants (costly duplication).

### Section 4 — Budget accuracy
Templates whose budgeted time is materially out of step with actual time logged.
- Threshold: ≥50% variance in either direction
- Minimum: ≥5 completions per schedule before assessing
- Ranked by annualised hours of variance (variance × annual volume)
- Direction: "over" (budgeted exceeds actual = phantom hours) or "under" (actual exceeds budget = real squeeze)

### Section 5 — Workflow health flags (five sub-analyses)
1. Unassigned schedules (no user or role)
2. Stale templates (no modification or activity in 365+ days)
3. Templates with no subtasks (process steps undocumented)
4. Inconsistent assignment patterns (mixing user-based and role-based within a process)
5. Duplicate template names (including whitespace-only collisions)

### Section 6 — Prioritised recommendations
5-10 actions ranked by impact. Each has:
- Title (short, specific — named templates/processes/users)
- Body (1-3 sentences)
- Confidence label: **Direct** (data unambiguous), **Likely** (one minor judgment call), **Needs review** (context the data doesn't carry)
- Expected outcome (concrete: hours saved, templates retired)
- Affected items (named)

Below 5: do not pad. Above 10: surface as "and N further smaller opportunities."

## Materiality thresholds (defaults)

| Threshold | Value | Used in |
|-----------|-------|---------|
| Budget variance | 50% either direction | Section 4 |
| Budget min completions | 5 per schedule | Section 4 |
| Non-completion rate | 30% | Section 2.4 |
| Non-completion min volume | 10 notifications (12m) | Section 2.4 |
| Top-user concentration | 30% of team time | Section 2.5 |
| Per-user min team minutes | 600 (10 hours) | Section 2.5 |
| Live window | 90 days | Section 2.1 |
| Dormant window | 180 days | Section 2.1 |
| Stale template | 365 days | Section 5.2 |
| Early-stage max notifications | 200 all-time | Sparsity |

## Document output

Generate a Word document containing:
1. Cover page — title, customer name, generated date
2. First-page benefits summary — highest-impact findings
3. Data-sparsity summary — what ran on full vs sparse data
4. Section 1-6 as detailed above
5. Closing summary with XBert-team support hook

Page size: A4 (Australian customer base). Default deliverable is `.docx`.

## Sparsity handling

If a data source is unavailable or a section has insufficient data:
- Explicitly state "this section can't be assessed yet — [reason]"
- Do not pad with speculation
- If the whole tenancy looks early-stage (<200 total notifications), flag it and suggest the customer qualify the review with the XBert team

## Tone and language

**Structural observation, not blame.** The person reading the review is often the person who built the setup being reviewed. "11 templates share a common base process and could be collapsed" — not "this looks messy."

**Specific, not generic.** Named templates, named processes, named users. "Collapse the 11 variants of Bank Reconciliation" beats "consolidate where possible."

**Confidence labels matter.** Preserve Direct / Likely / Needs review distinctions — they signal where the data is unambiguous vs where human judgment is genuinely required.

## What this skill does NOT do

- **Write operations.** This is read-only analysis. Suggest consolidations and corrections; never make them.
- **Per-instance notification analysis.** Use aggregated counts; don't query individual notifications.
- **Multi-tenant reviews.** One tenant per run.
- **Auto-scheduling.** The review runs on demand. Don't offer to schedule recurring runs.

## Always

- Never apply changes without user approval — this is a read-only audit
- Show the data that supports each recommendation
- Distinguish noise from signal — don't flag a 5% variance as a story
- If a section has nothing to report, say so explicitly, don't pad
- The document must be circulatable inside the firm without further editing
- Frame every recommendation as structural observation, never blame
