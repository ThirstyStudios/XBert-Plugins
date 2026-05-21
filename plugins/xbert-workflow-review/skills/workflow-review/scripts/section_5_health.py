"""
Section 5 — Workflow health flags.

Five sub-analyses. None depends on usage history — these all run cleanly
on a configuration-only extract, which is why the spec marks this as one
of the "early-stage tenant" sections.
"""

from datetime import timedelta
import pandas as pd

from constants import STALE_TEMPLATE_DAYS


def analyse_health(df: pd.DataFrame, snapshot_time: pd.Timestamp) -> dict:
    """
    Run all five workflow-health analyses.
    """
    configured = df[~df["IsNoWorkflowPlaceholder"]].copy()

    return {
        "unassigned_schedules": _unassigned_schedules(configured),
        "stale_templates": _stale_templates(configured, snapshot_time),
        "empty_subtasks": _empty_subtasks(configured),
        "inconsistent_assignment": _inconsistent_assignment_patterns(configured),
        "duplicate_template_names": _duplicate_template_names(configured),
    }


def _unassigned_schedules(df: pd.DataFrame) -> dict:
    """Active schedules with neither a user nor a role assigned."""
    schedules = df.drop_duplicates(subset=["ScheduleId"])
    unassigned = schedules[
        schedules["ScheduleIsActive"].fillna(False)
        & schedules["ScheduleAssignedUserName"].isna()
        & schedules["ScheduleAssignedRoleName"].isna()
    ]
    return {
        "count": len(unassigned),
        "schedules": [
            {
                "schedule_name": row["ScheduleName"],
                "template_name": row["TemplateName"],
                "client_name": row["ClientName"],
            }
            for _, row in unassigned.iterrows()
        ],
    }


def _stale_templates(df: pd.DataFrame, snapshot_time: pd.Timestamp) -> dict:
    """
    Templates with no modification, no recent notification, and no recent
    completion within STALE_TEMPLATE_DAYS.
    """
    cutoff = snapshot_time - timedelta(days=STALE_TEMPLATE_DAYS)
    templates = df.drop_duplicates(subset=["TemplateId"])

    def is_stale(row):
        last_mod = row["TemplateLastModifiedTime"]
        last_notif = row["LastNotificationCreatedTime"]
        if pd.notna(last_mod) and last_mod >= cutoff:
            return False
        if pd.notna(last_notif) and last_notif >= cutoff:
            return False
        return True

    stale = templates[templates.apply(is_stale, axis=1)]

    return {
        "count": len(stale),
        "templates": [
            {
                "template_name": row["TemplateName"],
                "last_modified": (
                    row["TemplateLastModifiedTime"].isoformat()
                    if pd.notna(row["TemplateLastModifiedTime"])
                    else None
                ),
                "last_notification": (
                    row["LastNotificationCreatedTime"].isoformat()
                    if pd.notna(row["LastNotificationCreatedTime"])
                    else None
                ),
            }
            for _, row in stale.iterrows()
        ],
    }


def _empty_subtasks(df: pd.DataFrame) -> dict:
    """Templates with no subtask definitions — process steps undocumented."""
    templates = df.drop_duplicates(subset=["TemplateId"])
    empty = templates[
        (templates["SubTaskCount"].isna()) | (templates["SubTaskCount"] == 0)
    ]
    return {
        "count": len(empty),
        "templates": [
            {"template_name": row["TemplateName"]}
            for _, row in empty.iterrows()
        ],
    }


def _inconsistent_assignment_patterns(df: pd.DataFrame) -> dict:
    """
    Within a single BaseProcessTagId, are some schedules assigned to a named
    user and others to a role? That's an inconsistent pattern — pick one.
    """
    inconsistent = []
    for tag_id, group in df.dropna(subset=["BaseProcessTagId"]).groupby(
        "BaseProcessTagId"
    ):
        schedules = group.dropna(subset=["ScheduleId"]).drop_duplicates(
            subset=["ScheduleId"]
        )
        if len(schedules) < 2:
            continue

        assigned_to_user = schedules[
            schedules["ScheduleAssignedUserName"].notna()
        ]
        assigned_to_role = schedules[
            schedules["ScheduleAssignedRoleName"].notna()
            & schedules["ScheduleAssignedUserName"].isna()
        ]

        if len(assigned_to_user) > 0 and len(assigned_to_role) > 0:
            inconsistent.append({
                "process_name": group["TemplateProcessName"].iloc[0],
                "base_process_tag_id": tag_id,
                "user_assigned_count": len(assigned_to_user),
                "role_assigned_count": len(assigned_to_role),
            })

    return {
        "count": len(inconsistent),
        "groups": inconsistent,
    }


def _duplicate_template_names(df: pd.DataFrame) -> dict:
    """
    Templates whose trimmed, lowered names collide. Whitespace-only variants
    (e.g. " Bank Reconciliation" vs "Bank Reconciliation") are flagged
    separately because they're almost always accidental.
    """
    templates = df.drop_duplicates(subset=["TemplateId"])[
        ["TemplateId", "TemplateName"]
    ].dropna()

    if len(templates) == 0:
        return {"count": 0, "groups": []}

    templates = templates.copy()
    templates["normalised"] = (
        templates["TemplateName"].astype(str).str.strip().str.lower()
    )

    groups = []
    for normalised, group in templates.groupby("normalised"):
        if len(group) < 2:
            continue
        raw_names = group["TemplateName"].tolist()
        has_whitespace_variant = len(set(n.strip() for n in raw_names)) < len(
            set(raw_names)
        )
        groups.append({
            "normalised_name": normalised,
            "raw_names": raw_names,
            "count": len(group),
            "is_whitespace_collision": has_whitespace_variant,
        })

    return {
        "count": len(groups),
        "groups": groups,
    }
