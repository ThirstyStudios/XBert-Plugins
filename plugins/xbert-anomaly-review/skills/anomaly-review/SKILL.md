---
name: anomaly-review
description: Anomaly-review methodology for ledger anomalies caught by deterministic XBerts — cluster findings by pattern, explain root cause, drive partner sign-off, produce an evidence pack. Use when the user asks to review anomalies, run an anomaly sweep, cluster anomaly XBerts, debug a recurring anomaly pattern, or runs the /anomaly-review slash command. Also triggers on: "duplicate journal review", "reversal pair sweep", "vendor flip review", "anomaly cluster", "GL anomaly review".
---

# Anomaly Review

A pattern-clustering review of every anomaly XBert that fired across a period. Detection is owned deterministically by Custom XBerts (the XBerts are the heroes); this skill orchestrates the review of what they caught, clusters the findings, and drives partner sign-off with an evidence pack.

## Goal

Convert a flat list of anomaly XBert firings into a small set of analytics clusters, each with a named likely root cause and a partner sign-off decision, and produce the workpaper that proves it.

## Anomaly clusters

| Cluster | Pattern detected by linked XBerts |
|---|---|
| Duplicate journals | Two or more journals with matching amount, account, and counterparty within a tight time window |
| Reversal pairs | Posted-then-reversed pairs that may indicate fat-finger correction or attempted concealment |
| Vendor flip | A recurring supplier coded to a new account or new vendor record without explanation |
| Round-tripping | Funds moving between two accounts that net to zero with no economic substance |
| Period-jump | Period-over-period balance jumps in expense or revenue accounts beyond expected variance |
| Unusual-day-of-week | Postings on days the client does not normally trade (weekend / public holiday GL activity) |

## Metrics

- **Clusters surfaced** — count of analytics groups represented in the firings
- **Firings per cluster** — distribution to focus reviewer attention on dominant patterns
- **Impact × certainty score** — used to order clusters for partner sign-off
- **Prior-period recurrence** — has this cluster fired in earlier reviews? (recurring patterns escalate)
- **Resolution outcome per cluster** — actioned, accepted-as-noise, or escalated

## Methodology

1. **Linked XBerts gate.** If no XBerts are linked to the Anomaly Review agent in the Connect portal for the client, STOP. Tell the user to configure linked XBerts first. There is no fallback path — detection is deterministic and the plugin reasons only over what the linked XBerts caught.
2. **Pull firings.** For every linked anomaly XBert, pull the period's firings and the underlying journal lines, vendor and account context.
3. **Cluster.** Group by analytics cluster (table above). Within a cluster, sub-group by counterparty or account where it tightens the story.
4. **Root cause.** Per cluster, explain the most likely cause given the data — fat-finger correction, system import re-run, vendor master change, policy break.
5. **Prioritise.** Order clusters by impact × certainty for partner sign-off. Recurring patterns from prior periods escalate.
6. **Sign-off.** Capture per-cluster decisions: actioned (with resolution instruction), accepted-as-noise (with rationale), or escalated.
7. **Evidence pack.** Compose the workpaper with hyperlinks back to every source XBert and journal line.

## Evidence pack structure

1. Cover page — client name, period, generation date
2. Summary — clusters surfaced, total firings, partner sign-off summary
3. Cluster sections — pattern description, likely root cause, firings list, partner decision, supporting evidence
4. Source links — hyperlinks to every underlying XBert firing and journal line
5. QMS block — practice name + ID, preparer name + ID, timestamp, unique check reference ID, compliance statement

## Output format

- Australian English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings in chat preview, bold key figures
- Tables for cluster breakdowns
- Never use emojis

## Always

- Never auto-apply; never lodge; never send. Output is for review.
- Name the specific journal lines and counterparties behind every cluster — no generic findings
- If the linked-XBerts list is empty, stop and prompt the user — do not invent a fallback
- Recurring patterns from prior periods must be flagged explicitly
- Every cluster needs a partner sign-off decision before the pack is final
