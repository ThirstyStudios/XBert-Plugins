---
name: team-workload
description: Methodology for evaluating team workload, estimate variance, and rebalance suggestions in an accounting or bookkeeping practice. Trigger when reviewing team capacity, weekly workload, who's overloaded, or estimate-vs-actual.
---

# Team workload review

## Goal
Find imbalance and act on it before it becomes burnout, a missed deadline, or a surprise on a client invoice.

## Metrics tracked
- **Hours logged this period** — typically a week, but configurable
- **Overdue count** — open tasks past their due date, weighted by criticality
- **Estimate variance** — `(actual − estimate) / estimate`, averaged across closed tasks in the period

## Default thresholds (practice-configurable)
- **Overloaded**: hours logged >45/week OR overdue count >3
- **Over-running**: avg variance >+25%
- **Under-utilised**: hours logged <30/week AND zero overdues
- **Under-running**: avg variance <-15% (finishing faster than estimated)

These should be tunable per practice — high-volume bookkeepers may run tighter, smaller firms looser.

## Rebalance rules
Only suggest a move when:
1. The over-loaded person has a task that can be reassigned (not client-bonded to that person)
2. The receiving person has the skill, grade, and capacity
3. The move frees at least 4 hours OR resolves an overdue

## Reporting shape
- **Per-person line**: hours, overdues, variance, one-word status (overloaded / on track / capacity)
- **Client overdues block**: count per client, sorted by criticality
- **Suggested rebalances block**: zero or more concrete proposals
- **Caveats**: note any team member with unsubmitted time, which skews everything

## Always
- Present numbers before opinions
- Surface client-grouped overdues separately — those matter more than per-person numbers
- Never reassign without user approval
- Flag if data is incomplete (missing time entries → tell the team to log time)
