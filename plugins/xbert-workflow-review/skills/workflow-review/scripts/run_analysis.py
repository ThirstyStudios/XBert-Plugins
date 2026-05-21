"""
Orchestrator for the Workflow Review analysis pipeline.

Loads the MCP extract, runs all six section analyses, and writes one
findings.json that the document-writing step consumes. Separating analysis
from formatting is a deliberate design — per spec Section 8.3, this keeps
the option open to feed an in-app XBert screen with the same findings.

Usage:
    python run_analysis.py <extract.json> <output_dir>

Writes:
    <output_dir>/findings.json  — structured findings, one entry per section
    <output_dir>/analysis.log   — brief log of what ran and what was sparse
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd

from load_extract import load_extract, summarise_sparsity
from section_1_snapshot import analyse_snapshot
from section_2_usage import analyse_usage
from section_3_consolidation import analyse_consolidation
from section_4_budget import analyse_budget
from section_5_health import analyse_health
from section_6_recommendations import build_recommendations


def run(extract_path: str | Path, output_dir: str | Path) -> dict:
    """
    Run the full analysis pipeline.
    Returns the findings dict (also written to disk).
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    df = load_extract(extract_path)
    sparsity = summarise_sparsity(df)

    # Snapshot time — point-in-time the extract reflects.
    # If the extract has a max LastNotificationCreatedTime, use that;
    # otherwise use now. The MCP contract guarantees point-in-time
    # consistency (spec Section 7.3) — whichever timestamp we use, all
    # rows are consistent with it.
    snapshot_time = _infer_snapshot_time(df)

    snapshot = analyse_snapshot(df)
    usage = analyse_usage(df, snapshot_time)
    consolidation = analyse_consolidation(df)
    budget = analyse_budget(df)
    health = analyse_health(df, snapshot_time)
    recommendations = build_recommendations(
        snapshot, usage, consolidation, budget, health
    )

    findings = {
        "meta": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "snapshot_time": snapshot_time.isoformat(),
            "extract_rows": len(df),
        },
        "sparsity": sparsity,
        "section_1_snapshot": snapshot,
        "section_2_usage": usage,
        "section_3_consolidation": consolidation,
        "section_4_budget": budget,
        "section_5_health": health,
        "section_6_recommendations": recommendations,
    }

    out_path = output_dir / "findings.json"
    with open(out_path, "w") as f:
        json.dump(findings, f, indent=2, default=str)

    _write_log(output_dir, findings)

    return findings


def _infer_snapshot_time(df: pd.DataFrame) -> pd.Timestamp:
    """Best-effort snapshot timestamp from the extract itself."""
    candidates = []
    for col in ["LastNotificationCreatedTime", "ScheduleLastModifiedTime",
                "TemplateLastModifiedTime"]:
        if col in df.columns and df[col].notna().any():
            candidates.append(df[col].max())
    if candidates:
        return max(candidates)
    return pd.Timestamp.now(tz="UTC")


def _write_log(output_dir: Path, findings: dict) -> None:
    """Brief log so a human can see what ran without parsing findings.json."""
    sparsity = findings["sparsity"]
    lines = [
        f"=== Workflow Review analysis ===",
        f"Generated: {findings['meta']['generated_at']}",
        f"Snapshot:  {findings['meta']['snapshot_time']}",
        f"",
        f"Clients (total / configured): "
        f"{sparsity['total_clients']} / {sparsity['configured_clients']}",
        f"Templates: {sparsity['total_templates']}",
        f"Schedules: {sparsity['total_schedules']}",
        f"Notifications (all-time): "
        f"{sparsity['total_notifications_all_time']:,}",
        f"",
        f"Status breakdown present:  {sparsity['has_notification_status_breakdown']}",
        f"Per-user time present:     {sparsity['has_per_user_time_data']}",
        f"Looks early-stage:         {sparsity['looks_early_stage']}",
        f"Clean-completion signal:   {sparsity['clean_completion_signal']}",
        f"",
        f"Sparse sections: "
        f"{', '.join(sparsity['sparse_sections']) if sparsity['sparse_sections'] else 'none'}",
        f"",
        f"Recommendations: "
        f"{len(findings['section_6_recommendations']['recommendations'])} surfaced",
    ]
    (output_dir / "analysis.log").write_text("\n".join(lines))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python run_analysis.py <extract.json> <output_dir>")
        sys.exit(1)
    findings = run(sys.argv[1], sys.argv[2])
    print(f"Findings written to {sys.argv[2]}/findings.json")
    print(f"Recommendations: "
          f"{len(findings['section_6_recommendations']['recommendations'])}")
