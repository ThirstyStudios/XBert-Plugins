---
name: cross-sell-opportunities
description: "Run the XBert Cross-Sell Opportunities pack for a Connect tenant — use the similar-clients engine to find lookalike pairs inside the book, score services the lookalike has that the candidate does not, and produce per-client ranked opportunities with drafted talking points. Use when the user asks about cross-sell, upsell, client development, advisory expansion, service uptake, lookalike clients, or invokes the /cross-sell-opportunities slash command. Also triggers on 'what should we offer client X next', 'where is the advisory upside', 'we need a client-development pass'."
---

# Cross-Sell Opportunities

A quarterly per-client cross-sell pack driven by XBert's similar-clients engine.

## Goal
Replace memory-based cross-sell conversations with a ranked, evidence-backed list per client — so client managers walk into reviews with talking points already drafted.

## Metrics
- **Lookalike set** — top N similar clients per candidate (from XBert's similar-clients engine)
- **Service gap** — services the lookalike has that this client does not
- **Lookalike prevalence** — % of lookalikes using the service
- **Similarity score** — average similarity score of the lookalikes that use the service
- **Inferred uplift** — typical fee uptick observed for the service across the lookalikes (range, not point estimate)

## Default thresholds (practice-configurable)
| Threshold | Value | Used in |
|---|---|---|
| Lookalikes per candidate | 5 | Cohort size |
| Minimum lookalike prevalence | >=40% | Service-gap inclusion |
| Minimum similarity score | >=0.6 | Lookalike inclusion |
| Opportunities per client (output cap) | 3 | Per-client sheet |
| Minimum book size | 20 clients | Run guard |

If a client has fewer than 3 qualifying lookalikes, surface as "lookalike-thin — see general advisory checklist instead" and skip ranked opportunities.

## Process / rules
1. **Build lookalike set per client.** Use XBert's similar-clients engine. Filter to those above the minimum similarity score.
2. **Compute service uptake** for each candidate and each lookalike.
3. **Service gap** — for each service the lookalike has that the candidate does not, score (lookalike prevalence × similarity score × inferred uplift).
4. **Rank** per client. Cap at 3.
5. **Draft talking points** — reference the lookalike pattern explicitly: "Three clients in the same segment of comparable size use [service]". Avoid generic sales copy.
6. **Aggregate roll-up** — top services by aggregate uplift potential across the book, for the executive summary.

## Always
- **Per-client output capped at 3.** More than 3 is unusable as a meeting brief.
- **Talking points are internal.** Never auto-send to a client; this is briefing material.
- **Cite the pattern.** Every talking point references the lookalike evidence — not vendor talking points.
- **Read-only.** Suggest the conversation; the relationship lead decides whether and how to have it.
- **Honest exclusions.** Clients without enough lookalikes are surfaced with reason, not buried.
- **Quarterly cadence assumption.** Designed to be paired with annual fee review, not run weekly.
