---
name: capacity-reporting
description: Methodology for billable utilisation and WIP variance reporting at practice and client level. Trigger when reviewing capacity, billable hours, WIP variance, overruns, or producing internal practice reports.
---

# Capacity & utilisation reporting

## Metrics
- **Billable %** = billable hours ÷ total tracked hours
- **WIP variance** = `(actual hours − planned hours) / planned hours`, expressed as %
- Both computed at **practice** and **per-client** level

## Healthy practice targets (defaults, practice-configurable)
- **Billable %**: 65-75% for full-service practice; 70-85% for bookkeeping-only
- **Practice WIP variance**: |variance| ≤ 10%
- **Per-client WIP variance**: |variance| ≤ 20% (above that = scope conversation)

## Materiality flags
- WIP variance > +25% on a client → call out for scope review
- WIP variance > +50% on a client → urgent; the engagement is materially under-priced
- WIP variance < -25% on a client → either over-planned, or not delivering

## Report shape (markdown export)

```
# Practice capacity & utilisation — <period>

## Practice level
- Billable: <H>h (<%>)
- Non-billable: <H>h (<%>)
- WIP variance: <±%> vs planned

## Top client variances
| Client | Planned | Actual | Variance | Action |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

## Recommended actions
- ...

## Methodology note
Thresholds: practice billable % target <range>, per-client variance flag at <%>. Data pulled from XBert <date> <time>.
```

## Always
- Present billable % and WIP variance together — one without the other misleads
- Note any team member with unsubmitted time (skews everything)
- Distinguish noise from signal — if WIP variance is +5% across the board, don't make it a story
- Frame fee/scope as "discuss with client", never as a unilateral change
- Trend over 3 months tells more than any single month
