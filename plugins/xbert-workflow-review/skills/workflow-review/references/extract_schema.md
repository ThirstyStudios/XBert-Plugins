# Data schema reference

The data fields used in the Workflow Review analysis, sourced from the XBert MCP gateway tools. This reference documents what data points Claude should collect and how they map to the six analysis sections.

## Data sources → Section mapping

| Data source | Data returned | Feeds sections |
|-------------|---------------|----------------|
| Review capacity snapshot | Capacity per user, outstanding work, available hours, utilisation | 1 (snapshot), 2.5 (per-user load), 4 (budget) |
| Review activity history | Activity by user, time period, activity type | 2.1 (live/dormant), 2.5 (per-user load), 4 (budget), 5.2 (stale) |
| Notification summary | Outstanding notifications by category/risk, completion rate | 2.1 (live/dormant/zombie), 2.4 (completion quality) |
| Template & schedule config | Template definitions, schedules, assignments, base processes | All sections |

## Key data points needed per section

### Section 1 — Snapshot
- Total client count (active, locked, deletion-pending)
- Total template count (with priority flag, with subtasks)
- Total schedule count (active vs inactive)
- Distinct BaseProcessTagId count
- Coverage: % of eligible clients with at least one active schedule

### Section 2 — Usage reality
- Per-schedule: last notification created time (for live/dormant/zombie classification)
- Per-schedule: notifications created all-time, last 3 months, last 12 months
- Per-schedule: notifications completed all-time (zero = zombie if recently fired)
- Per-schedule: assigned user active/inactive status (for orphaned detection)
- Per-template: notification disposition breakdown — cancelled, snoozed, dismissed (for completion quality)
- Per-user: minutes logged (for load distribution)

### Section 3 — Consolidation
- Per-template: BaseProcessTagId (the strongest grouping signal)
- Per-template: TemplateEstimatedTimeMinutes
- Per-schedule: assigned role name vs assigned user name
- Per-schedule: ScheduleEstimatedTimeOverrideMinutes / HasScheduleOverride

### Section 4 — Budget accuracy
- Per-template: EffectiveEstimatedTimeMinutes (resolved budget)
- Per-template: AvgInstanceActualTimeMinutes (actual time logged)
- Per-template: NotificationsCompletedAllTime (minimum 5 for reliability)
- Per-template: NotificationsCreatedLast12Months (annual volume for impact ranking)

### Section 5 — Health flags
- Per-schedule: assigned user/role (null = unassigned)
- Per-template: last modification time, last notification time (stale detection)
- Per-template: subtask count (zero = undocumented process)
- Per-process: mix of user-assigned vs role-assigned schedules
- Per-template: normalised name (duplicate detection)

### Section 6 — Recommendations
Synthesised from Sections 1-5. No additional data needed.

## Classification logic

### Live / dormant / zombie (Section 2.1)
| Classification | Condition |
|---|---|
| Live | Last notification created within 90 days |
| Quiet | Between 90-180 days |
| Dormant | No notification in 180+ days (or never) |
| Zombie | Notification within 90 days AND zero completions all-time |

### Budget variance direction (Section 4)
| Direction | Meaning |
|---|---|
| Over-budgeted | Budget exceeds actual → phantom hours in capacity plan |
| Under-budgeted | Actual exceeds budget → real capacity squeeze |

### Confidence labels (Section 6)
| Label | When to use |
|---|---|
| Direct | Data unambiguously supports the recommendation |
| Likely | One minor judgment call required |
| Needs review | Context the data doesn't carry; human judgment genuinely needed |
