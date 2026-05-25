---
name: practice-metrics
description: "Produce the XBert monthly Practice Metrics one-pager — standard partner KPIs, service-line P&L, prior-month variance commentary and RAG-banded client risk view. Use when the user asks for monthly metrics, partner-meeting pack, practice KPIs, lockup days, write-offs, WIP report, service-line P&L, or invokes the /practice-metrics slash command. Also triggers on 'monthly numbers', 'what are our KPIs this month', 'partner pack'."
---

# Practice Metrics

A monthly partner-meeting one-pager. Same shape every month. Designed for consistency, not novelty.

## Goal
Produce a repeatable artefact partners can compare month-on-month without questioning whether definitions changed.

## Metrics
- **Revenue** — invoiced in month
- **WIP** — logged time × billing rate not yet invoiced
- **Debtors** — open AR balance (from aged receivables)
- **Lockup days** — (WIP + debtors) / annualised revenue × 365
- **Write-offs** — billed minus invoiced for completed work in month
- **Service-line P&L** — revenue and direct cost by bookkeeping / tax / advisory
- **Client risk band (RAG)** — derived from lockup, write-off rate, and outstanding work flags per client

## Default thresholds (practice-configurable)
| Threshold | Value | Used in |
|---|---|---|
| Material mover (KPI) | >=10% MoM movement OR >5pt change in lockup days | Commentary |
| Service-line significance | >=5% of total revenue | Service-line table |
| RAG: Red | Lockup >120 days OR write-off rate >15% OR >=2 escalated workflows | Client risk |
| RAG: Amber | Lockup 80-120 days OR write-off rate 8-15% OR 1 escalated workflow | Client risk |
| RAG: Green | All below amber thresholds | Client risk |

## Process / rules
1. **Compute current-month and prior-month KPIs.** Use the same source per metric across runs to keep movement comparable.
2. **Build service-line P&L.** Derive lines from XPM service codes or tags; group anything unmapped as "other" and call it out.
3. **Variance commentary.** For each material mover, write one sentence: what moved, by how much, suspected driver from the underlying data.
4. **Client risk pass.** Band every client; list any client that changed band vs prior month.
5. **One-pager layout** — KPI table on top, service-line table middle, commentary block, RAG list. Excel companion holds the per-client detail.

## Always
- **Same shape every month.** Resist the urge to add or reorder sections.
- **Same source per metric.** Comparability matters more than choosing the "best" source mid-stream.
- **Commentary explains movers, not stable numbers.** Stable months get a brief "no material movers" line.
- **Service-line tagging caveat.** If significant revenue is unmapped, state the percentage; do not silently bucket.
- **Read-only.** This is the reporting artefact, not an enactment tool.
- **Definitions visible.** Footnote each KPI with its definition so prior-period comparisons are reproducible.
