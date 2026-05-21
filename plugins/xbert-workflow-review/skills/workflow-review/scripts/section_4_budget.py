"""
Section 4 — Budget accuracy.

Templates whose budgeted time is materially out of step with actual time
logged. Ranked by annualised hours of variance (variance × annual volume)
so the recommendations land in impact order, not severity-of-variance order.

A daily task that's 200% over budget but only fires twice a year matters less
than a daily task that's 60% over budget and fires every day.
"""

import pandas as pd
from constants import BUDGET_VARIANCE_THRESHOLD, BUDGET_MIN_COMPLETIONS


def analyse_budget(df: pd.DataFrame) -> dict:
    """
    Compute budget variance per template, surface those exceeding the
    threshold, rank by annualised hours of impact.

    The effective budget for a template is its EffectiveEstimatedTimeMinutes
    on the (Client × Template × Schedule) row — this accounts for schedule
    overrides. But the analysis groups by template, so we use the average
    effective budget across that template's schedules (weighted by volume).
    """
    configured = df[~df["IsNoWorkflowPlaceholder"]].copy()

    # Only schedules that have actually produced enough completions for the
    # average actual to be reliable.
    usable = configured[
        configured["NotificationsCompletedAllTime"].fillna(0) >= BUDGET_MIN_COMPLETIONS
    ]

    if len(usable) == 0:
        return {
            "sparse": True,
            "reason": (
                "no templates have enough completions yet for budget analysis "
                f"(minimum {BUDGET_MIN_COMPLETIONS} completions per schedule)."
            ),
        }

    # Group by template — variance is a per-template signal, not per-schedule.
    # Use weighted means by NotificationsCompletedAllTime so high-volume
    # schedules dominate the template-level average appropriately.
    findings = []
    for tid, group in usable.groupby("TemplateId"):
        weights = group["NotificationsCompletedAllTime"].fillna(0)
        total_weight = weights.sum()
        if total_weight == 0:
            continue

        # Weighted average of EffectiveEstimatedTimeMinutes — the effective
        # budget across this template's actual usage.
        budgeted = (
            group["EffectiveEstimatedTimeMinutes"].fillna(
                group["TemplateEstimatedTimeMinutes"]
            )
            * weights
        ).sum() / total_weight

        actuals = (
            group["AvgInstanceActualTimeMinutes"].fillna(0) * weights
        ).sum() / total_weight

        if budgeted <= 0:
            continue

        variance_minutes = actuals - budgeted
        variance_fraction = variance_minutes / budgeted

        if abs(variance_fraction) < BUDGET_VARIANCE_THRESHOLD:
            continue

        annual_volume = group["NotificationsCreatedLast12Months"].fillna(0).sum()
        annualised_hours = (variance_minutes * annual_volume) / 60.0

        findings.append({
            "template_id": tid,
            "template_name": group["TemplateName"].iloc[0],
            "budgeted_minutes": round(float(budgeted), 1),
            "actual_minutes": round(float(actuals), 1),
            "variance_minutes": round(float(variance_minutes), 1),
            "variance_fraction": round(float(variance_fraction), 3),
            "annual_volume": int(annual_volume),
            "annualised_hours_impact": round(float(annualised_hours), 1),
            "direction": "over" if variance_minutes < 0 else "under",
            # `over`  = budgeted exceeds actual (over-budgeted → phantom hours)
            # `under` = actual exceeds budgeted (under-budgeted → real squeeze)
        })

    findings.sort(
        key=lambda f: abs(f["annualised_hours_impact"]),
        reverse=True,
    )

    total_annualised_hours = sum(
        abs(f["annualised_hours_impact"]) for f in findings
    )

    return {
        "sparse": False,
        "templates_assessed": int(usable["TemplateId"].nunique()),
        "count_flagged": len(findings),
        "total_annualised_hours_variance": round(total_annualised_hours, 1),
        "findings": findings,
        "top_finding": findings[0] if findings else None,
    }
