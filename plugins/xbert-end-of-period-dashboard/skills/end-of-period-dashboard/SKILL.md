---
name: end-of-period-dashboard
description: "Run the XBert End-of-Period Dashboard for a Connect tenant — fuse XBert work, ledger data quality and lodgement obligations into one per-client period-close readiness view. Use when the user asks about month-end, quarter-end, year-end, BAS readiness, payroll close, period-close status, who is ready to close, lodgement deadlines, or runs the /end-of-period-dashboard slash command. Also triggers on 'are we ready for month-end', 'who is at risk for BAS', 'what is blocking close', 'period-close stand-up'."
---

# End-of-Period Dashboard

A cadence-aware per-client readiness view that fuses XBert work-in-flight, ledger data quality, and lodgement obligations. v1 is AU-first and runs one cadence at a time.

## Goal
Replace the practice manager's intuition with a deterministic per-client readiness band for the chosen close cycle, with named blockers and deadlines.

## Metrics
- **Readiness band** — Ready / Almost / Blocked / At Risk (computed, see thresholds)
- **DQ score** — per-client data-quality score
- **Outstanding work** — count and priority from the outstanding work board
- **Reconciliation status** — current reconciliation state per client
- **Lock date** — current lock date per client
- **Validation status** — BAS / VAT / Payroll reconciliation results
- **Deadline runway** — days until next lodgement for the cadence

## Default thresholds (practice-configurable)
| Band | DQ | Outstanding work | Validations | Lock date |
|---|---|---|---|---|
| Ready | >=90 | 0 high-priority | All pass | Within period |
| Almost | >=80 | <=3 high-priority | <=1 warning | Within period |
| Blocked | >=70 | >3 high-priority | >=1 fail | Behind period |
| At Risk | <70 OR deadline <=7 days AND not Ready | any | any | any |

**At Risk overrides** the other bands when a lodgement is due within 7 days and readiness is not yet Ready.

## Process / rules
1. **Cadence selection** — month / quarter / year. Pull only the obligations relevant to that cadence.
2. **Per-client computation** — band, blockers (named — e.g. "12 unreconciled bank transactions"), deadline runway.
3. **Lodgement calendar (AU v1)** — month-end (payroll STP, super deadlines), quarter (BAS), year (FBT, tax-time hand-off). Derive deadlines from the cadence and AU calendar context; do not assume an external lodgement feed.
4. **Deadline-first ranking** — At Risk first, then Blocked, then Almost. Ready clients are summarised but not detailed.
5. **First-page summary** — clients per band, lodgements due in 7 / 14 / 30 days, top three repeating blockers.
6. **Per-client detail** — only for non-Ready clients. Name blockers, name responsible workflow step, suggest next action (do not enact).

## Coverage caveats
- v1 is AU-only. If the practice has non-AU clients, exclude them from the obligation calendar and note this in the document.
- Non-Xero / non-QBO clients may have partial validation coverage — note explicitly per client.

## Always
- **Specific blockers, named.** "12 unreconciled bank transactions over 30 days" beats "data issues".
- **Deadline-first ranking.** A near-deadline Blocked client outranks a comfortable Almost.
- **One cadence per run.** Do not mix month and quarter views in one document.
- **Read-only.** This is coordination, not enactment. Suggest, never apply.
- **AU-first.** State the jurisdiction assumption in the document; v2 is multi-jurisdiction.
- **Graceful degradation.** Where a validation tool returns nothing, mark the client "validation not available" — never speculate.
