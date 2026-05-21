"""
Section 3 — Consolidation opportunities.

The highest-value section. Three sub-analyses:
  3.1 Base-process variant groups (templates sharing a BaseProcessTagId)
  3.2 Role-only variants (templates that differ only in role assignment)
  3.3 Time-budget variants vs schedule overrides
"""

import pandas as pd


def analyse_consolidation(df: pd.DataFrame) -> dict:
    """
    Run all three consolidation sub-analyses.
    """
    configured = df[~df["IsNoWorkflowPlaceholder"]].copy()

    return {
        "base_process_groups": _base_process_groups(configured),
        "role_only_variants": _role_only_variants(configured),
        "override_vs_duplicate": _override_vs_duplicate(configured),
    }


# ---------------------------------------------------------------------------
# 3.1 Base-process variant groups
# ---------------------------------------------------------------------------

def _base_process_groups(df: pd.DataFrame) -> dict:
    """
    Group templates by BaseProcessTagId. Any group with 2+ distinct templates
    is a consolidation candidate; groups of 3+ are stronger candidates.

    With BaseProcessTagId confirmed in the extract (v01), we assert these
    groups directly — no name-pattern inference needed.
    """
    templates = df.dropna(subset=["BaseProcessTagId"]).drop_duplicates(
        subset=["TemplateId"]
    )

    if len(templates) == 0:
        return {
            "sparse": True,
            "reason": "no BaseProcessTagId values present — can't assess base-process duplication.",
        }

    groups = (
        templates.groupby("BaseProcessTagId")
        .agg(
            process_name=("TemplateProcessName", "first"),
            variant_count=("TemplateId", "nunique"),
            template_names=("TemplateName", list),
            template_ids=("TemplateId", list),
            budgets=("TemplateEstimatedTimeMinutes", list),
        )
        .reset_index()
    )

    multi_variant = groups[groups["variant_count"] >= 2].sort_values(
        "variant_count", ascending=False
    )

    total_templates = templates["TemplateId"].nunique()
    redundant_in_groups = int((multi_variant["variant_count"] - 1).sum())
    potential_count_after = total_templates - redundant_in_groups

    reduction_pct = (
        (redundant_in_groups / total_templates) if total_templates > 0 else 0
    )

    return {
        "sparse": False,
        "total_templates": total_templates,
        "groups_with_variants": len(multi_variant),
        "templates_in_variant_groups": int(multi_variant["variant_count"].sum()),
        "redundant_templates": redundant_in_groups,
        "potential_count_after_collapse": potential_count_after,
        "reduction_pct": round(reduction_pct * 100, 1),
        "groups": [
            {
                "process_name": row["process_name"],
                "base_process_tag_id": row["BaseProcessTagId"],
                "variant_count": int(row["variant_count"]),
                "template_names": list(row["template_names"]),
                "budgets_minutes": [
                    float(b) if b is not None and not pd.isna(b) else None
                    for b in row["budgets"]
                ],
                "budget_consistent": _budgets_consistent(row["budgets"]),
            }
            for _, row in multi_variant.iterrows()
        ],
    }


def _budgets_consistent(budgets: list) -> bool:
    """Within a base-process group, are all template budgets identical?"""
    clean = [
        float(b) for b in budgets
        if b is not None and not pd.isna(b)
    ]
    if len(clean) < 2:
        return True
    return len(set(clean)) == 1


# ---------------------------------------------------------------------------
# 3.2 Role-only variants
# ---------------------------------------------------------------------------

def _role_only_variants(df: pd.DataFrame) -> dict:
    """
    Within a base-process group, are some templates differing solely because
    they're scheduled to different roles? If so, the recommendation is to
    collapse onto a single template with role-aware scheduling.

    Operationally: a group is a role-only-variant candidate when:
      - 2+ templates share a BaseProcessTagId
      - the distinct role-assignment values across those templates' schedules
        exceed 1, AND
      - the template budgets are consistent (or all null)
    """
    schedules = df.dropna(subset=["BaseProcessTagId"]).copy()
    if len(schedules) == 0:
        return {"sparse": True, "reason": "no BaseProcessTagId present."}

    candidates = []
    for tag_id, group in schedules.groupby("BaseProcessTagId"):
        templates_in_group = group["TemplateId"].dropna().unique()
        if len(templates_in_group) < 2:
            continue

        # Distinct roles used in schedules across this group.
        roles = (
            group["ScheduleAssignedRoleName"]
            .dropna()
            .unique()
        )
        users = (
            group["ScheduleAssignedUserName"]
            .dropna()
            .unique()
        )

        # Strong role-only signal: multiple roles in use, few or no named users.
        if len(roles) >= 2 and len(users) <= 1:
            template_names = (
                group.drop_duplicates("TemplateId")["TemplateName"].tolist()
            )
            candidates.append(
                {
                    "process_name": group["TemplateProcessName"].iloc[0],
                    "base_process_tag_id": tag_id,
                    "template_names": template_names,
                    "distinct_roles": list(roles),
                }
            )

    return {
        "sparse": False,
        "count": len(candidates),
        "candidates": candidates,
    }


# ---------------------------------------------------------------------------
# 3.3 Override-vs-duplicate
# ---------------------------------------------------------------------------

def _override_vs_duplicate(df: pd.DataFrame) -> dict:
    """
    Two distinct patterns for varying time budget across clients:
      A. ScheduleEstimatedTimeOverrideMinutes — a per-schedule override on a
         single template. Clean: one template, many overrides.
      B. Separate templates that exist solely to vary budget. Costly: N templates,
         each a near-duplicate of the others.

    Quantifies the split — how many schedules use overrides, vs how many
    distinct templates exist solely as budget variants within a base process.
    """
    schedules = df.dropna(subset=["ScheduleId"]).drop_duplicates(subset=["ScheduleId"])
    total_schedules = len(schedules)
    with_override = int(
        schedules["HasScheduleOverride"].fillna(False).sum()
    )

    # Templates that look like budget-variant duplicates: same BaseProcessTagId,
    # consistent assignment pattern, but differing TemplateEstimatedTimeMinutes.
    budget_variant_groups = []
    for tag_id, group in df.dropna(subset=["BaseProcessTagId"]).groupby(
        "BaseProcessTagId"
    ):
        templates_in_group = group.drop_duplicates("TemplateId")
        if len(templates_in_group) < 2:
            continue

        budgets = templates_in_group["TemplateEstimatedTimeMinutes"].dropna()
        if len(budgets.unique()) < 2:
            continue

        # If the templates differ only in budget and not in assignment, that's
        # a duplicate-for-budget-reasons pattern.
        roles = group["ScheduleAssignedRoleName"].dropna().unique()
        users = group["ScheduleAssignedUserName"].dropna().unique()
        single_assignment_pattern = (len(roles) <= 1) and (len(users) <= 1)

        if single_assignment_pattern:
            budget_variant_groups.append(
                {
                    "process_name": group["TemplateProcessName"].iloc[0],
                    "base_process_tag_id": tag_id,
                    "template_count": int(templates_in_group["TemplateId"].nunique()),
                    "budgets_minutes": sorted(
                        [float(b) for b in budgets.unique()]
                    ),
                    "template_names": templates_in_group[
                        "TemplateName"
                    ].tolist(),
                }
            )

    redundant_budget_variant_templates = sum(
        g["template_count"] - 1 for g in budget_variant_groups
    )

    return {
        "schedules_total": total_schedules,
        "schedules_with_override": with_override,
        "schedules_with_override_pct": (
            round(with_override / total_schedules * 100, 1)
            if total_schedules > 0
            else 0
        ),
        "budget_variant_groups": budget_variant_groups,
        "redundant_budget_variant_templates": redundant_budget_variant_templates,
    }
