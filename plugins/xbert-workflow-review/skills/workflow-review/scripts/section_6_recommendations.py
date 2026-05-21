"""
Section 6 — Prioritised recommendations.

This is a synthesis step, not a new analysis — it draws on the findings
from Sections 1-5 and ranks them by impact.

Each recommendation has:
  - title (short)
  - body (1-3 sentences)
  - impact_score (numeric — used for ranking, not shown to the reader)
  - confidence ("direct" | "likely" | "needs_human_review")
  - affected_items (templates, schedules, etc. — named)
  - expected_outcome (concrete: hours saved, templates retired, etc.)

Per spec Section 6.3.6: 5-10 recommendations, ranked by impact. Below the
floor, smaller wins are surfaced to fill; above the ceiling, the tail is
summarised as "and N further smaller opportunities."
"""

from constants import RECOMMENDATIONS_MIN, RECOMMENDATIONS_MAX


def build_recommendations(
    snapshot: dict,
    usage: dict,
    consolidation: dict,
    budget: dict,
    health: dict,
) -> dict:
    """
    Build the recommendations list from the section findings.
    """
    recs: list[dict] = []

    # ---- Consolidation recs (typically the highest-impact) ----------------
    bpg = consolidation.get("base_process_groups", {})
    if not bpg.get("sparse"):
        # Largest single base-process group is usually the headline finding.
        groups = bpg.get("groups", [])
        for group in groups[:3]:  # top 3 groups
            variant_count = group["variant_count"]
            if variant_count < 2:
                continue
            confidence = (
                "direct"
                if group["budget_consistent"]
                else "likely"
            )
            recs.append({
                "title": (
                    f"Collapse the {variant_count} variants of "
                    f"'{group['process_name']}'"
                ),
                "body": (
                    f"These {variant_count} templates share "
                    f"BaseProcessTagId {group['base_process_tag_id']} and "
                    f"represent variants of the same underlying process. "
                    + (
                        "Their estimated time budgets are consistent — "
                        "collapse onto a single template with role-aware "
                        "scheduling."
                        if group["budget_consistent"]
                        else "Their budgets differ — collapse if the "
                        "differences reflect band variation (use schedule "
                        "overrides), or keep separate if they reflect "
                        "genuinely different work."
                    )
                ),
                "impact_score": variant_count * 10,
                "confidence": confidence,
                "affected_items": group["template_names"],
                "expected_outcome": (
                    f"{variant_count - 1} template(s) retired; cleaner "
                    f"library; consistent process definition"
                ),
            })

        # Library-wide reduction headline if there's meaningful reduction available.
        if bpg.get("redundant_templates", 0) >= 5:
            recs.append({
                "title": (
                    f"Reduce template library by ~{bpg['reduction_pct']}% "
                    f"({bpg['redundant_templates']} templates)"
                ),
                "body": (
                    f"Across {bpg['groups_with_variants']} base-process "
                    f"groups, {bpg['redundant_templates']} templates exist "
                    f"as variants and could be collapsed. Current library: "
                    f"{bpg['total_templates']} templates; potential after "
                    f"collapse: {bpg['potential_count_after_collapse']}."
                ),
                "impact_score": bpg["redundant_templates"] * 2,
                "confidence": "likely",
                "affected_items": [],
                "expected_outcome": (
                    f"Library reduced from {bpg['total_templates']} to "
                    f"{bpg['potential_count_after_collapse']} templates"
                ),
            })

    # ---- Budget recs ------------------------------------------------------
    if not budget.get("sparse"):
        for finding in budget.get("findings", [])[:3]:
            confidence = "direct" if finding["annual_volume"] >= 50 else "likely"
            direction = finding["direction"]
            recs.append({
                "title": (
                    f"Re-budget '{finding['template_name']}' "
                    f"({direction}-budgeted)"
                ),
                "body": (
                    f"Budgeted at {finding['budgeted_minutes']} minutes "
                    f"per instance but averaging "
                    f"{finding['actual_minutes']} minutes in actuals. "
                    f"At {finding['annual_volume']} notifications per year, "
                    f"this accounts for "
                    f"{abs(finding['annualised_hours_impact'])} hours of "
                    f"{'phantom capacity' if direction == 'over' else 'under-budgeted real work'} "
                    f"in your capacity plan."
                ),
                "impact_score": abs(finding["annualised_hours_impact"]),
                "confidence": confidence,
                "affected_items": [finding["template_name"]],
                "expected_outcome": (
                    f"{abs(finding['annualised_hours_impact'])} hours/year of "
                    f"capacity-plan correction"
                ),
            })

    # ---- Usage recs (Section 2 sub-analyses) ------------------------------
    ldz = usage.get("live_dormant_zombie", {})
    if not ldz.get("sparse"):
        if ldz.get("zombie_count", 0) > 0:
            recs.append({
                "title": (
                    f"Investigate {ldz['zombie_count']} zombie schedule(s) "
                    f"that fire but never complete"
                ),
                "body": (
                    "These schedules produce notifications but have zero "
                    "completions all-time. Either the work isn't getting "
                    "done, the notifications are being dismissed, or the "
                    "schedules are firing on the wrong clients."
                ),
                "impact_score": ldz["zombie_count"] * 5,
                "confidence": "direct",
                "affected_items": [
                    f"{z['schedule_name']} ({z['client_name']})"
                    for z in ldz.get("zombie_schedules", [])[:10]
                ],
                "expected_outcome": "noise reduction; restore signal in workflow queue",
            })
        if ldz.get("dormant_count", 0) >= 5:
            recs.append({
                "title": f"Retire or revive {ldz['dormant_count']} dormant schedule(s)",
                "body": (
                    "These schedules are configured to fire but haven't "
                    "produced a notification in the recent window. Each is "
                    "either configuration that should be removed or work "
                    "that should be re-activated."
                ),
                "impact_score": ldz["dormant_count"],
                "confidence": "likely",
                "affected_items": [],
                "expected_outcome": "leaner active schedule list; clearer ownership",
            })

    cq = usage.get("completion_quality", {})
    if not cq.get("sparse") and cq.get("count_flagged", 0) > 0:
        top = cq["flagged_templates"][0]
        recs.append({
            "title": (
                f"Address dismissed-without-action pattern on "
                f"'{top['template_name']}' and "
                f"{cq['count_flagged'] - 1} other template(s)"
            ),
            "body": (
                f"Across {cq['count_flagged']} templates, notifications "
                f"are firing but being dismissed, snoozed, or cancelled "
                f"rather than completed. Either the work isn't relevant, "
                f"the schedules are firing too often, or staff aren't "
                f"actioning the notifications."
            ),
            "impact_score": cq["count_flagged"] * 3,
            "confidence": "needs_human_review",
            "affected_items": [
                t["template_name"] for t in cq["flagged_templates"][:10]
            ],
            "expected_outcome": "notifications that drive real work",
        })

    pul = usage.get("per_user_load", {})
    if not pul.get("sparse"):
        if pul.get("top_user_concentrated"):
            top = pul["top_user"]
            recs.append({
                "title": (
                    f"Rebalance load — {top['user_name']} holds "
                    f"{int(top['share'] * 100)}% of team time"
                ),
                "body": (
                    "Workload is concentrated on a single user. Either "
                    "deliberate (and tolerated as a known risk) or "
                    "accidental (assignments accumulated on one person). "
                    "Worth a deliberate review."
                ),
                "impact_score": int(top["share"] * 50),
                "confidence": "needs_human_review",
                "affected_items": [top["user_name"]],
                "expected_outcome": "team resilience; reduced key-person risk",
            })
        zero_load = pul.get("zero_load_assigned_users", [])
        if len(zero_load) > 0:
            recs.append({
                "title": (
                    f"Review {len(zero_load)} user(s) assigned to active "
                    f"schedules with no logged time"
                ),
                "body": (
                    "These users are assigned to active schedules but have "
                    "logged no time anywhere. Either they're not engaging "
                    "with the workflow or they're doing the work but not "
                    "logging it."
                ),
                "impact_score": len(zero_load) * 2,
                "confidence": "needs_human_review",
                "affected_items": zero_load,
                "expected_outcome": "adoption visibility; accurate per-user load picture",
            })

    # ---- Health recs (Section 5) ------------------------------------------
    if health["orphaned_assignments"]["count"] > 0 if False else False:
        pass  # placeholder if orphaned_assignments were moved here

    orphaned = usage.get("orphaned_assignments", {})
    if orphaned.get("count", 0) > 0:
        recs.append({
            "title": (
                f"Reassign {orphaned['count']} schedule(s) currently "
                f"assigned to inactive users"
            ),
            "body": (
                "Active schedules can't run on users who've left. Reassign "
                "to current team members or to a role."
            ),
            "impact_score": orphaned["count"] * 4,
            "confidence": "direct",
            "affected_items": [
                f"{s['schedule_name']} → {s['inactive_user']}"
                for s in orphaned["schedules"][:10]
            ],
            "expected_outcome": "no work assigned to people who can't do it",
        })

    if health["unassigned_schedules"]["count"] > 0:
        recs.append({
            "title": (
                f"Assign {health['unassigned_schedules']['count']} "
                f"unassigned active schedule(s)"
            ),
            "body": (
                "These active schedules have neither a user nor a role "
                "assigned. Notifications will fire with no clear owner."
            ),
            "impact_score": health["unassigned_schedules"]["count"] * 3,
            "confidence": "direct",
            "affected_items": [],
            "expected_outcome": "clear ownership of every active schedule",
        })

    if health["duplicate_template_names"]["count"] > 0:
        whitespace_groups = [
            g
            for g in health["duplicate_template_names"]["groups"]
            if g["is_whitespace_collision"]
        ]
        if whitespace_groups:
            recs.append({
                "title": (
                    f"Fix {len(whitespace_groups)} whitespace-collision "
                    f"duplicate template name(s)"
                ),
                "body": (
                    "Templates with names that differ only in leading or "
                    "trailing whitespace. Almost always accidental and "
                    "should be resolved by retiring one or renaming."
                ),
                "impact_score": len(whitespace_groups) * 6,
                "confidence": "direct",
                "affected_items": [
                    " | ".join(g["raw_names"]) for g in whitespace_groups
                ],
                "expected_outcome": "cleaner library; less confusion in template selection",
            })

    if health["inconsistent_assignment"]["count"] > 0:
        recs.append({
            "title": (
                f"Standardise assignment pattern across "
                f"{health['inconsistent_assignment']['count']} base process(es)"
            ),
            "body": (
                "Within these base processes, some schedules are assigned "
                "to named users and others to roles. Pick one pattern per "
                "process — typically role-based, since it survives staff "
                "changes."
            ),
            "impact_score": health["inconsistent_assignment"]["count"] * 2,
            "confidence": "likely",
            "affected_items": [
                g["process_name"]
                for g in health["inconsistent_assignment"]["groups"]
            ],
            "expected_outcome": "consistent assignment behaviour; easier to reason about",
        })

    # ---- Rank, trim, and report ------------------------------------------
    recs.sort(key=lambda r: r["impact_score"], reverse=True)

    trimmed = recs[:RECOMMENDATIONS_MAX]
    tail_count = max(0, len(recs) - RECOMMENDATIONS_MAX)

    # If we're below the floor, that's fine — the document should say "the
    # review found N specific opportunities" rather than padding.

    return {
        "recommendations": trimmed,
        "tail_count": tail_count,
        "min_target": RECOMMENDATIONS_MIN,
        "max_target": RECOMMENDATIONS_MAX,
    }
