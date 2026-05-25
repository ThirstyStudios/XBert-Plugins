---
name: config-audit
description: "Run the XBert Config Audit across a Connect tenant — fingerprint per-client XBert rule enablement, segment the book, and surface inconsistencies, gaps and drift with named bulk-normalisation moves. Use when the user asks about XBert configuration consistency, whether rules are set up the same across clients, configuration drift, standardisation, the /config-audit slash command, or 'are we set up consistently'. Distinct from the workflow review skill, which looks at templates and schedules."
---

# Config Audit

A quarterly audit of XBert rule enablement across a Connect tenant. Looks at the rule configuration itself — not templates, not schedules. Pairs every finding with a named bulk-normalisation move.

## Goal
Identify and characterise drift in XBert rule configuration across the book before it becomes systemic. Output is decision-ready: every finding has a recommended bulk move.

## Metrics
- **Enablement fingerprint** — vector of enabled/disabled per rule per client
- **Segment cohesion** — % of clients within a segment that share the same fingerprint
- **Always-on rate** — % of clients in segment with a given rule enabled
- **Drift count** — rules where enablement state has changed from a previously-consistent baseline (where the data supports it)

## Default thresholds (practice-configurable)
| Finding | Trigger |
|---|---|
| Always-on candidate | Enabled on >=80% of segment AND disabled on the rest with no clear reason |
| Outlier (likely accidental enable) | Enabled on <=20% of segment AND not aligned with a known cohort |
| Inconsistent | Enabled on 21-79% of segment with no segmentable pattern |
| Drift | Currently disabled but historical signal indicates it was previously enabled |

Segment minimum: 3 clients. Below 3, treat as ungrouped and report whole-book only.

## Process / rules
1. **Build per-client fingerprint** — for every rule, record enabled/disabled state.
2. **Segment the book** — default by industry tag from the client connection list and the Connect account review; fallback = ledger type; final fallback = whole book.
3. **Compute segment statistics** — for each rule × segment, the always-on rate.
4. **Classify findings** — Always-on candidate / Outlier / Inconsistent / Drift.
5. **Pair with bulk move** — for each finding, name the specific normalisation: "enable rule X on these 4 clients", "disable rule Y on these 2 clients", "surface for human decision because the split is even".
6. **Surface segments with most drift** — top three for the executive summary.

## Always
- **Distinct from workflow review.** Subject is XBert rule configuration. Do not stray into templates or schedules.
- **Segment-aware reasoning.** A rule that is on for tax clients and off for bookkeeping-only clients is not drift — it is segmentation.
- **Name the bulk move.** Every finding has a concrete normalisation action. No abstract "consider standardising".
- **Even splits need human input.** A rule split 50/50 in a segment is a policy question, not a fix.
- **Read-only.** Suggest bulk moves; the user enacts them through XBert.
- **Segmentation transparency.** State the segmentation rule used; caveat where it was approximate.
