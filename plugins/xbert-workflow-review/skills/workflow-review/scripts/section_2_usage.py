"""
Section 2 — What's actually being used.

Six sub-analyses. Each is independently nullable when its required data is
sparse — see spec Section 5.4 for the principle. Each returns either a
populated findings dict or a "sparse" placeholder with a one-line reason.
"""

from datetime import timedelta
import pandas as pd

from constants import (
    LIVE_WINDOW_DAYS,
    DORMANT_WINDOW_DAYS,
    COMPLETION_QUALITY_MIN_NOTIFICATIONS,
    COMPLETION_QUALITY_NON_COMPLETION_THRESHOLD,
    TOP_USER_CONCENTRATION_THRESHOLD,
    PER_USER_LOAD_MIN_TEAM_MINUTES,
)


def analyse_usage(df: pd.DataFrame, snapshot_time: pd.Timestamp) -> dict:
    """
    Produce all six sub-analyses for Section 2.

    `snapshot_time` is the point-in-time the extract reflects. The MCP
    contract guarantees one consistent snapshot across all rows
    (spec Section 7.3) — pass that value in here.
    """
    configured = df[~df["IsNoWorkflowPlaceholder"]].copy()

    return {
        "live_dormant_zombie": _classify_live_dormant_zombie(
            configured, snapshot_time
        ),
        "zero_notification_templates": _zero_notification_templates(configured),
        "orphaned_assignments": _orphaned_assignments(configured),
        "completion_quality": _completion_quality(configured),
        "per_user_load": _per_user_load(configured),
        "locked_client_schedules": _locked_client_schedules(configured),
    }


# ---------------------------------------------------------------------------
# 2.1 Live / dormant / zombie classification
# ---------------------------------------------------------------------------

def _classify_live_dormant_zombie(
    df: pd.DataFrame, snapshot_time: pd.Timestamp
) -> dict:
    """
    Classify each schedule into one of:
      - live: produced a notification within LIVE_WINDOW_DAYS
      - dormant: configured to fire but no notification within DORMANT_WINDOW_DAYS
      - zombie: produced notifications within LIVE_WINDOW_DAYS but zero
        completions all-time — work fires but never resolves
      - quiet: between live and dormant (recent but not active)
    """
    schedules = df.drop_duplicates(subset=["ScheduleId"]).copy()
    schedules = schedules[schedules["ScheduleIsActive"].fillna(False)]

    if len(schedules) == 0:
        return {
            "sparse": True,
            "reason": "no active schedules in extract.",
        }

    live_cutoff = snapshot_time - timedelta(days=LIVE_WINDOW_DAYS)
    dormant_cutoff = snapshot_time - timedelta(days=DORMANT_WINDOW_DAYS)

    last_notif = schedules["LastNotificationCreatedTime"]
    completions = schedules["NotificationsCompletedAllTime"].fillna(0)
    creates_recent = schedules["NotificationsCreatedLast3Months"].fillna(0)

    is_live = (last_notif.notna()) & (last_notif >= live_cutoff)
    is_dormant = (last_notif.isna()) | (last_notif < dormant_cutoff)
    is_zombie = is_live & (completions == 0) & (creates_recent > 0)
    is_quiet = ~is_live & ~is_dormant

    live_items = schedules[is_live & ~is_zombie]
    dormant_items = schedules[is_dormant]
    zombie_items = schedules[is_zombie]
    quiet_items = schedules[is_quiet]

    return {
        "live_count": len(live_items),
        "dormant_count": len(dormant_items),
        "zombie_count": len(zombie_items),
        "quiet_count": len(quiet_items),
        "zombie_schedules": [
            {
                "schedule_name": row["ScheduleName"],
                "template_name": row["TemplateName"],
                "client_name": row["ClientName"],
                "notifications_created_last_3_months": int(
                    row["NotificationsCreatedLast3Months"] or 0
                ),
            }
            for _, row in zombie_items.iterrows()
        ],
        "dormant_schedules_sample": [
            {
                "schedule_name": row["ScheduleName"],
                "template_name": row["TemplateName"],
                "client_name": row["ClientName"],
                "last_notification": (
                    row["LastNotificationCreatedTime"].isoformat()
                    if pd.notna(row["LastNotificationCreatedTime"])
                    else None
                ),
            }
            for _, row in dormant_items.head(20).iterrows()
        ],
    }


# ---------------------------------------------------------------------------
# 2.2 Zero-notification templates
# ---------------------------------------------------------------------------

def _zero_notification_templates(df: pd.DataFrame) -> dict:
    """
    Templates that have never produced a notification across any client/schedule.

    A template here is identified by TemplateId — same template across multiple
    clients counts once. Reports the count plus a list of the named templates.
    """
    by_template = (
        df.groupby("TemplateId", dropna=True)
        .agg(
            template_name=("TemplateName", "first"),
            total_notifications=("NotificationsCreatedAllTime", "sum"),
            schedule_count=("ScheduleId", "nunique"),
        )
        .reset_index()
    )

    zero = by_template[by_template["total_notifications"].fillna(0) == 0]

    return {
        "count": len(zero),
        "templates": [
            {
                "template_name": row["template_name"],
                "schedules": int(row["schedule_count"]),
            }
            for _, row in zero.iterrows()
        ],
    }


# ---------------------------------------------------------------------------
# 2.3 Orphaned assignments
# ---------------------------------------------------------------------------

def _orphaned_assignments(df: pd.DataFrame) -> dict:
    """
    Active schedules assigned to inactive users.
    """
    schedules = df.drop_duplicates(subset=["ScheduleId"])
    orphaned = schedules[
        schedules["ScheduleIsActive"].fillna(False)
        & schedules["ScheduleAssignedUserName"].notna()
        & (schedules["ScheduleAssignedUserIsActive"].fillna(True) == False)  # noqa: E712
    ]

    return {
        "count": len(orphaned),
        "schedules": [
            {
                "schedule_name": row["ScheduleName"],
                "template_name": row["TemplateName"],
                "client_name": row["ClientName"],
                "inactive_user": row["ScheduleAssignedUserName"],
            }
            for _, row in orphaned.iterrows()
        ],
    }


# ---------------------------------------------------------------------------
# 2.4 Completion quality (v01 addition)
# ---------------------------------------------------------------------------

def _completion_quality(df: pd.DataFrame) -> dict:
    """
    Templates where notifications fire but resolve via cancellation,
    snooze, or dismissal rather than completion.

    Returns sparse if the notification-status breakdown isn't in the extract.
    """
    needed = [
        "NotificationsCancelledLast12Months",
        "NotificationsSnoozedLast12Months",
        "NotificationsDismissedLast12Months",
    ]
    if not any(df[col].notna().any() for col in needed):
        return {
            "sparse": True,
            "reason": (
                "notification-status breakdown not present in extract — "
                "completion quality can't be assessed."
            ),
        }

    by_template = (
        df.groupby("TemplateId", dropna=True)
        .agg(
            template_name=("TemplateName", "first"),
            created_12m=("NotificationsCreatedLast12Months", "sum"),
            cancelled_12m=("NotificationsCancelledLast12Months", "sum"),
            snoozed_12m=("NotificationsSnoozedLast12Months", "sum"),
            dismissed_12m=("NotificationsDismissedLast12Months", "sum"),
        )
        .reset_index()
        .fillna(0)
    )

    by_template["non_completion_12m"] = (
        by_template["cancelled_12m"]
        + by_template["snoozed_12m"]
        + by_template["dismissed_12m"]
    )
    # Avoid divide-by-zero — only compute the rate where created > 0.
    by_template["non_completion_rate"] = by_template.apply(
        lambda r: (
            r["non_completion_12m"] / r["created_12m"]
            if r["created_12m"] > 0
            else 0
        ),
        axis=1,
    )

    flagged = by_template[
        (by_template["created_12m"] >= COMPLETION_QUALITY_MIN_NOTIFICATIONS)
        & (
            by_template["non_completion_rate"]
            >= COMPLETION_QUALITY_NON_COMPLETION_THRESHOLD
        )
    ].sort_values("non_completion_rate", ascending=False)

    return {
        "sparse": False,
        "templates_assessed": int(
            (by_template["created_12m"] >= COMPLETION_QUALITY_MIN_NOTIFICATIONS).sum()
        ),
        "count_flagged": len(flagged),
        "flagged_templates": [
            {
                "template_name": row["template_name"],
                "non_completion_rate": round(row["non_completion_rate"], 3),
                "notifications_created_12m": int(row["created_12m"]),
                "cancelled_12m": int(row["cancelled_12m"]),
                "snoozed_12m": int(row["snoozed_12m"]),
                "dismissed_12m": int(row["dismissed_12m"]),
            }
            for _, row in flagged.iterrows()
        ],
    }


# ---------------------------------------------------------------------------
# 2.5 Per-user load (v01 addition)
# ---------------------------------------------------------------------------

def _per_user_load(df: pd.DataFrame) -> dict:
    """
    Distribution of logged time across users. Two flags:
      - top user holds >TOP_USER_CONCENTRATION_THRESHOLD of total team time
      - users assigned to active schedules with zero logged time

    Returns sparse if neither the per-user JSON nor the aggregated
    TopUserLoadFraction has any values.
    """
    has_json = df["PerUserTimeJson"].notna().any()
    has_aggregates = df["TopUserLoadFraction"].notna().any()

    if not has_json and not has_aggregates:
        return {
            "sparse": True,
            "reason": (
                "this tenancy doesn't log time at the user level — "
                "per-user load can't be assessed."
            ),
        }

    # Build the team-wide per-user totals from the JSON column (when present).
    # Each PerUserTime entry maps user_name -> minutes logged on that
    # (Client × Template × Schedule). Sum across the whole extract.
    team_totals: dict[str, float] = {}
    if has_json:
        for entry in df["PerUserTime"].dropna():
            if not isinstance(entry, dict):
                continue
            for user, minutes in entry.items():
                try:
                    team_totals[user] = team_totals.get(user, 0) + float(minutes)
                except (TypeError, ValueError):
                    continue

    total_team_minutes = sum(team_totals.values())

    if total_team_minutes < PER_USER_LOAD_MIN_TEAM_MINUTES:
        return {
            "sparse": True,
            "reason": (
                f"total team time logged is {int(total_team_minutes)} minutes — "
                f"below the floor for meaningful per-user analysis "
                f"({PER_USER_LOAD_MIN_TEAM_MINUTES} minutes)."
            ),
        }

    user_loads = [
        {
            "user_name": user,
            "minutes_logged": round(minutes, 1),
            "share": round(minutes / total_team_minutes, 3),
        }
        for user, minutes in sorted(
            team_totals.items(), key=lambda kv: kv[1], reverse=True
        )
    ]

    top_user = user_loads[0] if user_loads else None
    top_concentrated = bool(
        top_user and top_user["share"] >= TOP_USER_CONCENTRATION_THRESHOLD
    )

    # Users assigned to active schedules but with zero logged time anywhere.
    schedules = df.drop_duplicates(subset=["ScheduleId"])
    assigned_users = set(
        schedules[
            schedules["ScheduleIsActive"].fillna(False)
            & schedules["ScheduleAssignedUserName"].notna()
        ]["ScheduleAssignedUserName"]
    )
    users_with_time = set(team_totals.keys())
    zero_load_assigned = sorted(assigned_users - users_with_time)

    return {
        "sparse": False,
        "total_team_minutes": int(total_team_minutes),
        "team_size": len(team_totals),
        "top_user_concentrated": top_concentrated,
        "top_user": top_user,
        "user_loads": user_loads,
        "zero_load_assigned_users": zero_load_assigned,
    }


# ---------------------------------------------------------------------------
# 2.6 Locked-client schedules
# ---------------------------------------------------------------------------

def _locked_client_schedules(df: pd.DataFrame) -> dict:
    """
    Active schedules on clients flagged as locked or deletion-pending.
    Usually configuration debt — the work won't run but the config carries on.
    """
    schedules = df.drop_duplicates(subset=["ScheduleId"])
    flagged = schedules[
        schedules["ScheduleIsActive"].fillna(False)
        & (
            schedules["IsLocked"].fillna(False)
            | schedules["IsMarkedForDeletion"].fillna(False)
        )
    ]

    return {
        "count": len(flagged),
        "schedules": [
            {
                "schedule_name": row["ScheduleName"],
                "template_name": row["TemplateName"],
                "client_name": row["ClientName"],
                "is_locked": bool(row["IsLocked"]) if pd.notna(row["IsLocked"]) else False,
                "is_marked_for_deletion": (
                    bool(row["IsMarkedForDeletion"])
                    if pd.notna(row["IsMarkedForDeletion"])
                    else False
                ),
            }
            for _, row in flagged.iterrows()
        ],
    }
