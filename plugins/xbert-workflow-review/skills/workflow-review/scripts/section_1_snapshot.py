"""
Section 1 — Snapshot.

The opening counts. This section does not depend on usage history and runs
cleanly even on an early-stage tenancy.
"""

import pandas as pd


def analyse_snapshot(df: pd.DataFrame) -> dict:
    """
    Produce the Section 1 findings.

    Returns a dict with:
      - customer_name
      - client counts (total, configured, locked, deletion-pending)
      - template counts (total, priority, with-subtasks)
      - schedule counts (total, active, inactive)
      - coverage_percent (% of non-locked clients with at least one active schedule)
      - annual_scheduled_volume (estimated notifications per year at current config)
      - process_count (distinct BaseProcessTagIds in use)
    """
    configured = df[~df["IsNoWorkflowPlaceholder"]]
    all_clients = df.drop_duplicates(subset=["ClientTenantId"])

    customer_name = (
        df["CustomerName"].dropna().iloc[0]
        if not df["CustomerName"].dropna().empty
        else "Unknown tenant"
    )

    locked_count = int(all_clients["IsLocked"].fillna(False).sum())
    deletion_count = int(all_clients["IsMarkedForDeletion"].fillna(False).sum())

    # Clients with at least one active schedule = the denominator for coverage.
    active_schedules = configured[configured["ScheduleIsActive"].fillna(False)]
    clients_with_active = active_schedules["ClientTenantId"].nunique()

    eligible_clients = all_clients[
        ~all_clients["IsLocked"].fillna(False)
        & ~all_clients["IsMarkedForDeletion"].fillna(False)
    ]
    eligible_client_count = len(eligible_clients)

    coverage = (
        clients_with_active / eligible_client_count
        if eligible_client_count > 0
        else 0.0
    )

    templates = configured.drop_duplicates(subset=["TemplateId"])
    priority_templates = templates[templates["TemplateIsPriority"].fillna(False)]
    templates_with_subtasks = templates[templates["SubTaskCount"].fillna(0) > 0]

    schedules = configured.drop_duplicates(subset=["ScheduleId"])
    active = schedules[schedules["ScheduleIsActive"].fillna(False)]

    return {
        "customer_name": customer_name,
        "client_counts": {
            "total": len(all_clients),
            "configured": configured["ClientTenantId"].nunique(),
            "with_active_schedule": int(clients_with_active),
            "locked": locked_count,
            "deletion_pending": deletion_count,
            "eligible_for_coverage": eligible_client_count,
        },
        "template_counts": {
            "total": len(templates),
            "priority": len(priority_templates),
            "with_subtasks_defined": len(templates_with_subtasks),
        },
        "schedule_counts": {
            "total": len(schedules),
            "active": len(active),
            "inactive": len(schedules) - len(active),
        },
        "coverage_percent": round(coverage * 100, 1),
        "process_count": int(
            configured["BaseProcessTagId"].dropna().nunique()
        ),
        "annual_scheduled_volume": _estimate_annual_volume(active),
    }


def _estimate_annual_volume(active_schedules: pd.DataFrame) -> int:
    """
    Estimate the number of notifications the active schedules will produce
    over the next 12 months at current configuration.

    The cleanest signal is NotificationsCreatedLast12Months summed across
    schedules — it captures the actual recent firing rate, not a model.
    Falls back to a period-based estimate if last-12-months is sparse.
    """
    last_12m = active_schedules["NotificationsCreatedLast12Months"].fillna(0).sum()
    if last_12m > 0:
        return int(last_12m)

    # Fallback: rough estimate from SchedulePeriod + SchedulePeriodValue.
    # Period values come through as strings like "Day", "Week", "Month", "Year".
    period_to_per_year = {
        "day": 365,
        "week": 52,
        "fortnight": 26,
        "month": 12,
        "quarter": 4,
        "halfyear": 2,
        "year": 1,
    }

    total = 0
    for _, row in active_schedules.iterrows():
        period = str(row.get("SchedulePeriod") or "").strip().lower()
        value = row.get("SchedulePeriodValue") or 1
        try:
            value = float(value)
        except (TypeError, ValueError):
            value = 1
        per_year = period_to_per_year.get(period, 0)
        if per_year and value > 0:
            total += per_year / value
    return int(total)
