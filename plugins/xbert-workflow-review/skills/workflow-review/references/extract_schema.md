# Extract schema

The shape returned by the MCP tool `get_workflow_extract`. Refer here when extending the analysis or troubleshooting field-mismatch issues.

The full MCP contract lives in `mcp-contract/get_workflow_extract.md` (alongside the skill, not inside it). This file is the analyst's reference — what fields exist, what they mean, and how the analysis uses them.

## Shape

A JSON array of row objects. One row per (Client × Template × Schedule).

**Critical: every client appears in the array.** Clients with no schedules configured appear as rows with the template/schedule/usage fields null. A row with a null `TemplateId` means "this client has no workflow configured" — not "data is missing." The loader (`load_extract.py`) marks these with `IsNoWorkflowPlaceholder = True` and most analyses filter them out before computing.

## Field groups

### Customer and client
| Field | Type | Notes |
|---|---|---|
| `CustomerName` | string | The tenant's display name. Same across all rows. |
| `ClientTenantId` | string | Stable client identifier. |
| `ClientName` | string | |
| `ClientCode` | string | |
| `ClientCountry` | string | ISO 2-letter code or country name. |
| `AccountingType` | string | Xero / MYOB / QBO / etc. |
| `IsLocked` | bool | Client lifecycle flag. |
| `IsMarkedForDeletion` | bool | Client lifecycle flag. |

### Process (tag)
| Field | Type | Notes |
|---|---|---|
| `TemplateProcessName` | string | Human-readable process name. |
| `TemplateProcessOrder` | int | |
| `BaseProcessTagId` | string | **The strongest single signal in the data.** Authoritative grouping for template variants. |
| `ProcessIsDefaultBillable` | bool | |
| `ProcessXpmTaskUuid` | string | XPM linkage if any. |

### Template
| Field | Type | Notes |
|---|---|---|
| `TemplateId` | string | Null on no-workflow-placeholder rows. |
| `TemplateName` | string | |
| `TemplateIsPriority` | bool | |
| `TemplateSubTasks` | string (JSON) | JSON-encoded array of subtask definitions. |
| `TemplateEstimatedTimeMinutes` | int | Base budget; see also `EffectiveEstimatedTimeMinutes`. |
| `TemplateCreationTime` | ISO datetime | |
| `TemplateLastModifiedTime` | ISO datetime | |
| `TemplateCreatedByUserName` | string | |
| `TemplateInitialStatusName` | string | |
| `ClientNoteLinkingTagName` | string | |

### Schedule
| Field | Type | Notes |
|---|---|---|
| `ScheduleId` | string | |
| `ScheduleName` | string | |
| `ScheduleIsActive` | bool | |
| `ScheduleStartDate` | ISO datetime | |
| `SchedulePeriod` | string | "Day", "Week", "Fortnight", "Month", "Quarter", "HalfYear", "Year" |
| `SchedulePeriodValue` | int | Multiplier on the period — every N periods. |
| `ScheduleEndType` | string | "Never", "OnDate", "AfterRepeats", etc. |
| `ScheduleEndDateValue` | ISO datetime | |
| `ScheduleEndRepeatValue` | int | |
| `ScheduleFutureRecurringWeeks` | int | |
| `ScheduleDueDatePeriod` | string | |
| `ScheduleDueDateType` | string | |
| `ScheduleDueDateValue` | int | |
| `ScheduleNextRecurringTime` | ISO datetime | |
| `ScheduleLastRecurredTime` | ISO datetime | |
| `ScheduleCreationTime` | ISO datetime | |
| `ScheduleLastModifiedTime` | ISO datetime | |

### Assignment
| Field | Type | Notes |
|---|---|---|
| `ScheduleAssignedUserName` | string | Null if assigned to a role. |
| `ScheduleAssignedUserEmail` | string | |
| `ScheduleAssignedUserIsActive` | bool | **Inactive user + active schedule = orphaned.** |
| `ScheduleAssignedRoleName` | string | Null if assigned to a user. |
| `ScheduleAssignedRoleType` | string | |

### Schedule ↔ client link (overrides)
| Field | Type | Notes |
|---|---|---|
| `ScheduleClientLinkedTime` | ISO datetime | |
| `ScheduleEstimatedTimeOverrideMinutes` | int | Null if no override. |
| `EffectiveEstimatedTimeMinutes` | int | The resolved budget for this (Client × Template × Schedule) — uses override if set, otherwise template default. **Use this for budget analysis.** |
| `HasScheduleOverride` | bool | True iff `ScheduleEstimatedTimeOverrideMinutes` is set. |

### Usage — aggregate
| Field | Type | Notes |
|---|---|---|
| `NotificationsCreatedAllTime` | int | |
| `NotificationsCreatedLast3Months` | int | |
| `NotificationsCreatedLast12Months` | int | |
| `NotificationsCompletedAllTime` | int | |
| `LastNotificationCreatedTime` | ISO datetime | Drives the live/dormant/zombie classification. |
| `LastNotificationCompletedTime` | ISO datetime | |
| `AvgInstanceEstimatedTimeMinutes` | float | Avg estimated time per instance. |
| `AvgInstanceActualTimeMinutes` | float | Avg actual time logged per completed instance. Drives Section 4 budget analysis. |

### Usage — notification status breakdown (v01)
| Field | Type | Notes |
|---|---|---|
| `NotificationsCancelledAllTime` | int | |
| `NotificationsSnoozedAllTime` | int | |
| `NotificationsDismissedAllTime` | int | |
| `NotificationsCancelledLast12Months` | int | |
| `NotificationsSnoozedLast12Months` | int | |
| `NotificationsDismissedLast12Months` | int | |

These drive Section 2.4 (completion quality). If these are absent or all null across the tenant, the section degrades gracefully.

### Usage — per-user time (v01, Option B folded into main extract)
| Field | Type | Notes |
|---|---|---|
| `PerUserTimeJson` | string (JSON) | `{user_name: minutes_logged}` mapping for this (Client × Template × Schedule). Null if no per-user time data. |
| `TopUserLoadFraction` | float | Pre-aggregated — share of this row's logged time held by the top user. Useful for quick-flag checks; the full JSON is needed for team-wide aggregation. |
| `ZeroLoadAssignedUserCount` | int | Pre-aggregated — count of users assigned to this schedule with zero logged time. |

The analysis prefers the JSON column for team-wide rollup (so the same user across many templates is counted once). The pre-aggregated columns are a fast path for sparsity detection.

## Snapshot consistency

Per spec Section 7.3, all rows in one extract must reflect the same point-in-time. The MCP contract guarantees this. The loader uses the maximum `LastNotificationCreatedTime` in the extract as the snapshot timestamp (best available proxy); if no notifications have been created, it falls back to "now."

## Pagination

For large tenancies the MCP tool may paginate. The plugin assembles the full dataset before running the analysis — partial data should never reach `run_analysis.py`. If the MCP tool returns a continuation token, exhaust it in the orchestration step before invoking the analysis.
