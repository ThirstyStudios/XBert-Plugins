"""
Loader for the workflow extract returned by get_workflow_extract.

Responsibilities:
  - Read the JSON the MCP tool returned (or a saved snapshot of one)
  - Normalise field types (dates, nullable numerics, JSON-encoded subtasks)
  - Distinguish "client with no workflow configured" (null TemplateId rows)
    from "client with workflow configured" rows, per spec Section 5
  - Surface what's missing/sparse so the document can render a sparsity
    summary without re-scanning the data
  - Provide one DataFrame the rest of the analysis works against

Why a DataFrame: the extract is denormalised to (Client × Template × Schedule)
specifically so the analysis can group/filter/aggregate without joins. pandas
is the right shape for that. Even a "large" tenancy is small enough to fit
in memory — the spec calls this out (Section 7.3).
"""

import json
import pandas as pd
from pathlib import Path
from datetime import datetime, timezone
from typing import Any


# ---------------------------------------------------------------------------
# Field groups — used to detect data sparsity and report what's present
# ---------------------------------------------------------------------------

CORE_REQUIRED_FIELDS = [
    "CustomerName",
    "ClientTenantId",
    "ClientName",
    "TemplateName",
    "ScheduleName",
]

USAGE_AGGREGATE_FIELDS = [
    "NotificationsCreatedAllTime",
    "NotificationsCreatedLast12Months",
    "NotificationsCompletedAllTime",
    "AvgInstanceActualTimeMinutes",
]

# v01 additions — Section 5.1
NOTIFICATION_STATUS_FIELDS = [
    "NotificationsCancelledAllTime",
    "NotificationsSnoozedAllTime",
    "NotificationsDismissedAllTime",
    "NotificationsCancelledLast12Months",
    "NotificationsSnoozedLast12Months",
    "NotificationsDismissedLast12Months",
]

# Per-user time, Option B (folded into main extract) — Section 7.1 resolved
# in v01 chat. Each row carries pre-aggregated per-user metrics plus an
# optional JSON column with the full breakdown for granular drilldown.
PER_USER_TIME_FIELDS = [
    "PerUserTimeJson",          # JSON-encoded {user_name: minutes_logged} or null
    "TopUserLoadFraction",      # float 0..1 — share of this template's time held by top user
    "ZeroLoadAssignedUserCount",  # int — users assigned to this schedule with 0 minutes logged
]

DATE_FIELDS = [
    "TemplateCreationTime",
    "TemplateLastModifiedTime",
    "ScheduleStartDate",
    "ScheduleNextRecurringTime",
    "ScheduleLastRecurredTime",
    "ScheduleCreationTime",
    "ScheduleLastModifiedTime",
    "ScheduleClientLinkedTime",
    "LastNotificationCreatedTime",
    "LastNotificationCompletedTime",
]


# ---------------------------------------------------------------------------
# Loading
# ---------------------------------------------------------------------------

def load_extract(source: str | Path | list[dict]) -> pd.DataFrame:
    """
    Load the workflow extract.

    Accepts either:
      - a path to a JSON file (a snapshot of what the MCP tool returned)
      - the raw list-of-dicts the MCP tool returns directly

    Returns a DataFrame normalised for analysis. The DataFrame always has
    the same set of columns even if the source had some missing — missing
    fields are filled with NaN/None so downstream scripts can rely on the
    schema. Sparsity is reported separately via summarise_sparsity().
    """
    if isinstance(source, (str, Path)):
        with open(source, "r") as f:
            rows = json.load(f)
    else:
        rows = source

    if not isinstance(rows, list):
        raise ValueError(
            "Extract must be a list of row dicts. "
            f"Got {type(rows).__name__}."
        )

    df = pd.DataFrame(rows)

    # Guarantee schema: any field referenced by analysis code must exist.
    expected = (
        CORE_REQUIRED_FIELDS
        + USAGE_AGGREGATE_FIELDS
        + NOTIFICATION_STATUS_FIELDS
        + PER_USER_TIME_FIELDS
        + DATE_FIELDS
        + [
            "ClientCode", "ClientCountry", "AccountingType",
            "IsLocked", "IsMarkedForDeletion",
            "TemplateProcessName", "TemplateProcessOrder",
            "BaseProcessTagId",
            "ProcessIsDefaultBillable", "ProcessXpmTaskUuid",
            "TemplateIsPriority", "TemplateSubTasks",
            "TemplateEstimatedTimeMinutes",
            "TemplateCreatedByUserName",
            "TemplateInitialStatusName", "ClientNoteLinkingTagName",
            "ScheduleIsActive",
            "SchedulePeriod", "SchedulePeriodValue",
            "ScheduleEndType", "ScheduleEndDateValue", "ScheduleEndRepeatValue",
            "ScheduleFutureRecurringWeeks",
            "ScheduleDueDatePeriod", "ScheduleDueDateType", "ScheduleDueDateValue",
            "ScheduleAssignedUserName", "ScheduleAssignedUserEmail",
            "ScheduleAssignedUserIsActive",
            "ScheduleAssignedRoleName", "ScheduleAssignedRoleType",
            "ScheduleEstimatedTimeOverrideMinutes",
            "EffectiveEstimatedTimeMinutes", "HasScheduleOverride",
            "NotificationsCreatedLast3Months",
            "AvgInstanceEstimatedTimeMinutes",
            "TemplateId", "ScheduleId",
        ]
    )
    for col in expected:
        if col not in df.columns:
            df[col] = None

    # Normalise dates.
    for col in DATE_FIELDS:
        df[col] = pd.to_datetime(df[col], utc=True, errors="coerce")

    # Booleans — accept None/null cleanly.
    for col in ["IsLocked", "IsMarkedForDeletion", "TemplateIsPriority",
                "ScheduleIsActive", "ScheduleAssignedUserIsActive",
                "HasScheduleOverride", "ProcessIsDefaultBillable"]:
        df[col] = df[col].map(_to_bool_or_none)

    # Numerics — coerce, leave NaN where missing.
    numeric_cols = (
        USAGE_AGGREGATE_FIELDS
        + NOTIFICATION_STATUS_FIELDS
        + [
            "TemplateEstimatedTimeMinutes",
            "ScheduleEstimatedTimeOverrideMinutes",
            "EffectiveEstimatedTimeMinutes",
            "AvgInstanceEstimatedTimeMinutes",
            "NotificationsCreatedLast3Months",
            "TopUserLoadFraction",
            "ZeroLoadAssignedUserCount",
            "TemplateProcessOrder",
            "ScheduleFutureRecurringWeeks",
        ]
    )
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Parse JSON-encoded subtasks into a length (we only need the count).
    df["SubTaskCount"] = df["TemplateSubTasks"].map(_count_subtasks)

    # Parse per-user-time JSON into a dict.
    df["PerUserTime"] = df["PerUserTimeJson"].map(_parse_per_user_json)

    # Annotate which rows are "no workflow configured for this client" placeholders.
    # A row is a placeholder if it has a client but no template.
    df["IsNoWorkflowPlaceholder"] = df["TemplateId"].isna() & df["ClientName"].notna()

    return df


# ---------------------------------------------------------------------------
# Sparsity reporting — fuels the document's data-sparsity summary
# ---------------------------------------------------------------------------

def summarise_sparsity(df: pd.DataFrame) -> dict[str, Any]:
    """
    Produce a structured summary of what's present and what's sparse in the
    extract. The document's data-sparsity summary (spec Section 6.4) renders
    from this.

    Returns keys:
      - total_clients, configured_clients, total_templates, total_schedules
      - total_notifications_all_time
      - has_notification_status_breakdown (bool)
      - has_per_user_time_data (bool)
      - looks_early_stage (bool) — triggers the early-stage XBert-team hook
      - clean_completion_signal (bool) — Section 5.4 positive case
      - sparse_sections (list[str]) — names of sections that should degrade
    """
    from constants import (
        EARLY_STAGE_MAX_NOTIFICATIONS,
        CLEAN_COMPLETION_MIN_VOLUME,
    )

    configured = df[~df["IsNoWorkflowPlaceholder"]]

    # Notification-status breakdown is "present" if any of the breakdown
    # fields has at least one non-null value across the extract.
    has_status = any(
        configured[col].notna().any() for col in NOTIFICATION_STATUS_FIELDS
    )

    # Per-user-time data is "present" if either the JSON column has any
    # non-null entry or the pre-aggregated TopUserLoadFraction has values.
    has_per_user = (
        configured["PerUserTimeJson"].notna().any()
        or configured["TopUserLoadFraction"].notna().any()
    )

    total_notifications = configured["NotificationsCreatedAllTime"].fillna(0).sum()

    # Distinguish "clean" from "missing" for the status breakdown:
    # if status fields are present, total notifications exceed the volume
    # floor, and the sum of non-completion statuses is zero, we report
    # this as a positive finding rather than as missing data.
    clean_completion = False
    if has_status and total_notifications >= CLEAN_COMPLETION_MIN_VOLUME:
        non_completion_total = sum(
            configured[col].fillna(0).sum()
            for col in NOTIFICATION_STATUS_FIELDS
            if col.endswith("AllTime")
        )
        clean_completion = non_completion_total == 0

    # Per-section sparsity flags — names align with the spec's section names.
    sparse_sections = []
    if total_notifications == 0:
        sparse_sections.append("Section 2 — What's actually being used")
        sparse_sections.append("Section 4 — Budget accuracy")
    if not has_status:
        sparse_sections.append("Section 2.4 — Completion quality")
    if not has_per_user:
        sparse_sections.append("Section 2.5 — Per-user load")

    return {
        "total_clients": int(df["ClientTenantId"].nunique()),
        "configured_clients": int(
            configured["ClientTenantId"].nunique()
        ),
        "total_templates": int(configured["TemplateId"].nunique()),
        "total_schedules": int(configured["ScheduleId"].nunique()),
        "total_notifications_all_time": int(total_notifications),
        "has_notification_status_breakdown": has_status,
        "has_per_user_time_data": has_per_user,
        "looks_early_stage": (
            total_notifications < EARLY_STAGE_MAX_NOTIFICATIONS
            and configured["ClientTenantId"].nunique() > 0
        ),
        "clean_completion_signal": clean_completion,
        "sparse_sections": sparse_sections,
    }


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _to_bool_or_none(v: Any) -> bool | None:
    if v is None or (isinstance(v, float) and pd.isna(v)):
        return None
    if isinstance(v, bool):
        return v
    if isinstance(v, str):
        s = v.strip().lower()
        if s in ("true", "1", "yes"):
            return True
        if s in ("false", "0", "no"):
            return False
    if isinstance(v, (int, float)):
        return bool(v)
    return None


def _count_subtasks(v: Any) -> int | None:
    """TemplateSubTasks is a JSON array (or null). Return its length."""
    if v is None or (isinstance(v, float) and pd.isna(v)):
        return None
    if isinstance(v, list):
        return len(v)
    if isinstance(v, str):
        try:
            parsed = json.loads(v)
            return len(parsed) if isinstance(parsed, list) else None
        except (json.JSONDecodeError, TypeError):
            return None
    return None


def _parse_per_user_json(v: Any) -> dict | None:
    if v is None or (isinstance(v, float) and pd.isna(v)):
        return None
    if isinstance(v, dict):
        return v
    if isinstance(v, str):
        try:
            parsed = json.loads(v)
            return parsed if isinstance(parsed, dict) else None
        except (json.JSONDecodeError, TypeError):
            return None
    return None
