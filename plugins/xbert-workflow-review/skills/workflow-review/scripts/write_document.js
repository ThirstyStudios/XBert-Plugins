/**
 * write_document.js
 *
 * Produces a Workflow Review .docx from findings.json.
 *
 * Layered design (per spec Section 8.3):
 *   - analysis (Python) produces structured findings
 *   - this script formats those findings into a Word document
 * The same findings.json could feed an in-app screen later without
 * changing the analysis layer.
 *
 * Usage:
 *   node write_document.js <findings.json> <output.docx>
 */

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  TabStopType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak
} = require("docx");

// ---------------------------------------------------------------------------
// Style helpers
// ---------------------------------------------------------------------------

const COLOURS = {
  accent: "2E75B6",
  text: "262626",
  muted: "595959",
  rowAlt: "F2F2F2",
  good: "548235",
  warn: "BF8F00",
  flag: "C00000",
};

const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function p(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, ...opts })],
    spacing: { after: opts.spacingAfter ?? 120 },
  });
}

function heading(text, level) {
  const levels = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
  };
  return new Paragraph({
    heading: levels[level],
    children: [new TextRun(text)],
  });
}

function bullet(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    children: [new TextRun(text)],
    spacing: { after: 80 },
  });
}

function cell(text, opts = {}) {
  const { bold = false, fill = null, width = 2340, color = null } = opts;
  const runOpts = { text: String(text ?? ""), bold };
  if (color) runOpts.color = color;
  return new TableCell({
    borders: cellBorders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({
      children: [new TextRun(runOpts)],
    })],
  });
}

function simpleTable(headerRow, dataRows, columnWidths) {
  const totalWidth = columnWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headerRow.map((text, i) =>
          cell(text, {
            bold: true,
            fill: COLOURS.accent,
            color: "FFFFFF",
            width: columnWidths[i],
          })
        ),
      }),
      ...dataRows.map((row, idx) => new TableRow({
        children: row.map((value, i) => cell(value, {
          fill: idx % 2 === 0 ? null : COLOURS.rowAlt,
          width: columnWidths[i],
        })),
      })),
    ],
  });
}

function confidenceLabel(confidence) {
  const labels = {
    direct: "Direct",
    likely: "Likely",
    needs_human_review: "Needs review",
  };
  const colours = {
    direct: COLOURS.good,
    likely: COLOURS.warn,
    needs_human_review: COLOURS.muted,
  };
  return new TextRun({
    text: ` [${labels[confidence] || confidence}]`,
    color: colours[confidence] || COLOURS.muted,
    italics: true,
  });
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

function buildCoverPage(findings) {
  const meta = findings.meta;
  const snap = findings.section_1_snapshot;
  const generatedDate = new Date(meta.generated_at).toLocaleDateString(
    "en-AU", { day: "numeric", month: "long", year: "numeric" }
  );

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 2400, after: 240 },
      children: [new TextRun({
        text: "Workflow Review", size: 56, bold: true, color: COLOURS.accent,
      })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 1200 },
      children: [new TextRun({
        text: snap.customer_name, size: 32, color: COLOURS.text,
      })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({
        text: `Generated ${generatedDate}`, size: 22, color: COLOURS.muted,
      })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function buildBenefitsSummary(findings) {
  const sections = [];
  sections.push(heading("Summary of findings", 1));
  sections.push(p(
    "This page summarises the highest-impact opportunities the review identified. "
    + "Detailed findings, named templates, and supporting numbers follow.",
    { spacingAfter: 240, color: COLOURS.muted }
  ));

  // Template library reduction
  const bpg = findings.section_3_consolidation.base_process_groups;
  if (!bpg.sparse && bpg.redundant_templates >= 1) {
    const headlineGroup = (bpg.groups || []).find(g => g.variant_count >= 3) || bpg.groups[0];
    sections.push(heading("Template library", 2));
    let line = `Library can be reduced from ${bpg.total_templates} to `
      + `${bpg.potential_count_after_collapse} templates `
      + `(${bpg.reduction_pct}% reduction). `;
    if (headlineGroup) {
      line += `Largest single opportunity: collapse the ${headlineGroup.variant_count} `
        + `variants of '${headlineGroup.process_name}' onto a single template `
        + `with appropriate scheduling.`;
    }
    sections.push(p(line));
  } else {
    sections.push(heading("Template library", 2));
    sections.push(p("No material template-library consolidation opportunities were identified."));
  }

  // Capacity plan correction
  const budget = findings.section_4_budget;
  if (!budget.sparse && budget.count_flagged > 0) {
    sections.push(heading("Capacity plan accuracy", 2));
    const top = budget.top_finding;
    let line = `${budget.count_flagged} template${budget.count_flagged === 1 ? "" : "s"} `
      + `${budget.count_flagged === 1 ? "is" : "are"} materially out of step with actuals, `
      + `representing ${budget.total_annualised_hours_variance.toFixed(1)} hours per year `
      + `of capacity-plan variance. `;
    if (top) {
      line += `Single largest correction: '${top.template_name}' is `
        + `${top.direction}-budgeted by ${Math.abs(top.variance_minutes).toFixed(0)} minutes per instance `
        + `(${Math.abs(top.annualised_hours_impact).toFixed(1)} hours/year).`;
    }
    sections.push(p(line));
  } else if (budget.sparse) {
    sections.push(heading("Capacity plan accuracy", 2));
    sections.push(p(`Budget accuracy could not be assessed — ${budget.reason}`));
  }

  // Setup hygiene
  const health = findings.section_5_health;
  const usage = findings.section_2_usage;
  const orphaned = usage.orphaned_assignments.count;
  const unassigned = health.unassigned_schedules.count;
  const dormant = usage.live_dormant_zombie.sparse ? 0 : (usage.live_dormant_zombie.dormant_count || 0);
  const duplicates = health.duplicate_template_names.count;
  const totalHygiene = orphaned + unassigned + dormant + duplicates;

  sections.push(heading("Setup hygiene", 2));
  if (totalHygiene === 0) {
    sections.push(p("Setup hygiene is clean — no orphaned, unassigned, dormant, or duplicate items detected. This is itself a positive finding."));
  } else {
    sections.push(p(
      `Found ${orphaned} orphaned, ${unassigned} unassigned, `
      + `${dormant} dormant, and ${duplicates} duplicate template name `
      + `${duplicates === 1 ? "group" : "groups"}. See Section 5 for the full list.`
    ));
  }

  // Workload balance
  const pul = usage.per_user_load;
  sections.push(heading("Workload balance", 2));
  if (pul.sparse) {
    sections.push(p(pul.reason));
  } else if (pul.top_user_concentrated) {
    sections.push(p(
      `Workload is concentrated: ${pul.top_user.user_name} holds `
      + `${Math.round(pul.top_user.share * 100)}% of team time. See Section 2.5.`
    ));
  } else {
    sections.push(p("Workload is reasonably distributed across the team."));
  }

  // Completion quality
  const cq = usage.completion_quality;
  sections.push(heading("Completion quality", 2));
  if (cq.sparse) {
    sections.push(p(cq.reason));
  } else if (cq.count_flagged > 0) {
    sections.push(p(
      `${cq.count_flagged} template${cq.count_flagged === 1 ? "" : "s"} `
      + `${cq.count_flagged === 1 ? "shows" : "show"} elevated non-completion rates `
      + `(dismissed, snoozed, or cancelled rather than completed). See Section 2.4.`
    ));
  } else if (findings.sparsity.clean_completion_signal) {
    sections.push(p("Notifications appear to complete cleanly across the tenancy — no elevated dismissal, snooze, or cancellation signal detected."));
  } else {
    sections.push(p("No templates exceeded the non-completion threshold."));
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildSparsitySummary(findings) {
  const out = [];
  const sp = findings.sparsity;

  out.push(heading("About this review", 2));

  if (sp.sparse_sections.length === 0 && !sp.looks_early_stage) {
    out.push(p("This review is running on a fully populated data set across all sections."));
    return out;
  }

  if (sp.looks_early_stage) {
    out.push(p(
      `This tenancy shows minimal workflow usage across `
      + `${sp.total_clients} client${sp.total_clients === 1 ? "" : "s"}, `
      + `which suggests either an early-stage setup or a partially-rolled-out `
      + `configuration. Sections 2 and 4 may not yet have enough history to be conclusive.`
    ));
    out.push(p(
      "If you're unsure whether to act on the findings below, the XBert team "
      + "can help interpret the results in context.",
      { italics: true, color: COLOURS.muted }
    ));
  }

  if (sp.sparse_sections.length > 0) {
    out.push(p("Sections running on sparse data in this review:"));
    sp.sparse_sections.forEach(s => out.push(bullet(s)));
  }

  return out;
}

function buildSection1(findings) {
  const s = findings.section_1_snapshot;
  const out = [];
  out.push(heading("1. Snapshot", 1));
  out.push(p(
    "An at-a-glance view of the workflow setup at the time of this review."
  ));

  out.push(simpleTable(
    ["Measure", "Count"],
    [
      ["Total clients", s.client_counts.total],
      ["Clients with active workflow", s.client_counts.with_active_schedule],
      ["Coverage", `${s.coverage_percent}%`],
      ["Total templates", s.template_counts.total],
      ["Total schedules", s.schedule_counts.total],
      ["Active schedules", s.schedule_counts.active],
      ["Distinct base processes", s.process_count],
      ["Estimated annual notification volume", s.annual_scheduled_volume.toLocaleString()],
    ],
    [4680, 4680]
  ));

  if (s.client_counts.locked > 0 || s.client_counts.deletion_pending > 0) {
    out.push(p(
      `${s.client_counts.locked} client${s.client_counts.locked === 1 ? " is" : "s are"} `
      + `locked and ${s.client_counts.deletion_pending} `
      + `${s.client_counts.deletion_pending === 1 ? "is" : "are"} marked for deletion. `
      + `Schedules on these clients are covered separately in Section 2.6.`,
      { spacingAfter: 240 }
    ));
  }

  return out;
}

function buildSection2(findings) {
  const u = findings.section_2_usage;
  const out = [];
  out.push(heading("2. What's actually being used", 1));
  out.push(p(
    "Six views of how the configured workflow is — or isn't — translating into work."
  ));

  // 2.1
  out.push(heading("2.1 Live, dormant, and zombie schedules", 2));
  const ldz = u.live_dormant_zombie;
  if (ldz.sparse) {
    out.push(p(ldz.reason));
  } else {
    out.push(simpleTable(
      ["Classification", "Count", "Meaning"],
      [
        ["Live", ldz.live_count, "Notifications in the last 90 days"],
        ["Quiet", ldz.quiet_count, "Recent but not last 90 days"],
        ["Dormant", ldz.dormant_count, "No notifications in the last 180+ days"],
        ["Zombie", ldz.zombie_count, "Firing but zero completions all-time"],
      ],
      [2340, 1170, 5850]
    ));
    if (ldz.zombie_count > 0) {
      out.push(p("Zombie schedules — firing but never completing:", { bold: true, spacingAfter: 80 }));
      ldz.zombie_schedules.slice(0, 10).forEach(z =>
        out.push(bullet(`${z.schedule_name} (${z.template_name}) on ${z.client_name} — ${z.notifications_created_last_3_months} fires in last 3 months`))
      );
    }
  }

  // 2.2
  out.push(heading("2.2 Templates that have never produced a notification", 2));
  const zero = u.zero_notification_templates;
  if (zero.count === 0) {
    out.push(p("Every template has produced at least one notification."));
  } else {
    out.push(p(`${zero.count} template${zero.count === 1 ? "" : "s"} configured but never used:`));
    zero.templates.slice(0, 20).forEach(t =>
      out.push(bullet(`${t.template_name} (${t.schedules} schedule${t.schedules === 1 ? "" : "s"})`))
    );
    if (zero.templates.length > 20) {
      out.push(p(`... and ${zero.templates.length - 20} further templates.`, { color: COLOURS.muted, italics: true }));
    }
  }

  // 2.3
  out.push(heading("2.3 Orphaned assignments", 2));
  const orph = u.orphaned_assignments;
  if (orph.count === 0) {
    out.push(p("No active schedules are assigned to inactive users."));
  } else {
    out.push(p(`${orph.count} schedule${orph.count === 1 ? " is" : "s are"} assigned to inactive users:`));
    orph.schedules.slice(0, 20).forEach(s =>
      out.push(bullet(`${s.schedule_name} (${s.template_name}, ${s.client_name}) → ${s.inactive_user}`))
    );
  }

  // 2.4
  out.push(heading("2.4 Completion quality", 2));
  const cq = u.completion_quality;
  if (cq.sparse) {
    out.push(p(cq.reason));
  } else if (cq.count_flagged === 0) {
    out.push(p(`${cq.templates_assessed} template${cq.templates_assessed === 1 ? "" : "s"} assessed; none exceeded the non-completion threshold.`));
  } else {
    out.push(p(`${cq.count_flagged} of ${cq.templates_assessed} assessed template${cq.templates_assessed === 1 ? "" : "s"} `
      + `${cq.count_flagged === 1 ? "shows" : "show"} elevated non-completion (dismissed, snoozed, or cancelled):`));
    out.push(simpleTable(
      ["Template", "Non-completion rate", "Created (12m)", "Cancelled", "Snoozed", "Dismissed"],
      cq.flagged_templates.slice(0, 15).map(t => [
        t.template_name,
        `${Math.round(t.non_completion_rate * 100)}%`,
        t.notifications_created_12m,
        t.cancelled_12m, t.snoozed_12m, t.dismissed_12m,
      ]),
      [3120, 1560, 1170, 1170, 1170, 1170]
    ));
  }

  // 2.5
  out.push(heading("2.5 Per-user load", 2));
  const pul = u.per_user_load;
  if (pul.sparse) {
    out.push(p(pul.reason));
  } else {
    out.push(p(
      `Team of ${pul.team_size} user${pul.team_size === 1 ? "" : "s"}, `
      + `${Math.round(pul.total_team_minutes / 60).toLocaleString()} hours logged in total.`
    ));
    if (pul.top_user_concentrated) {
      out.push(p(
        `Concentration risk: ${pul.top_user.user_name} holds `
        + `${Math.round(pul.top_user.share * 100)}% of total team time.`,
        { color: COLOURS.warn }
      ));
    }
    out.push(simpleTable(
      ["User", "Minutes logged", "Share of team time"],
      pul.user_loads.slice(0, 15).map(u => [
        u.user_name,
        u.minutes_logged.toLocaleString(),
        `${Math.round(u.share * 100)}%`,
      ]),
      [4680, 2340, 2340]
    ));
    if (pul.zero_load_assigned_users.length > 0) {
      out.push(p(
        `${pul.zero_load_assigned_users.length} user${pul.zero_load_assigned_users.length === 1 ? "" : "s"} `
        + `assigned to active schedules but with no logged time:`,
        { spacingAfter: 80 }
      ));
      pul.zero_load_assigned_users.slice(0, 10).forEach(u => out.push(bullet(u)));
    }
  }

  // 2.6
  out.push(heading("2.6 Locked-client schedules", 2));
  const lc = u.locked_client_schedules;
  if (lc.count === 0) {
    out.push(p("No active schedules on locked or deletion-pending clients."));
  } else {
    out.push(p(`${lc.count} active schedule${lc.count === 1 ? " is" : "s are"} on locked or deletion-pending clients:`));
    lc.schedules.slice(0, 15).forEach(s => out.push(bullet(
      `${s.schedule_name} (${s.template_name}, ${s.client_name}) — `
      + `${s.is_locked ? "locked" : ""}${s.is_locked && s.is_marked_for_deletion ? " and " : ""}${s.is_marked_for_deletion ? "deletion-pending" : ""}`
    )));
  }

  return out;
}

function buildSection3(findings) {
  const c = findings.section_3_consolidation;
  const out = [];
  out.push(heading("3. Consolidation opportunities", 1));
  out.push(p(
    "Where the template library is carrying duplication that can be collapsed. "
    + "This is typically the highest-impact section."
  ));

  // 3.1
  out.push(heading("3.1 Base-process variant groups", 2));
  const bpg = c.base_process_groups;
  if (bpg.sparse) {
    out.push(p(bpg.reason));
  } else if (bpg.groups_with_variants === 0) {
    out.push(p("No base-process groups have multiple template variants. The library appears one-template-per-process, which is the cleaner pattern."));
  } else {
    out.push(p(
      `${bpg.groups_with_variants} base process${bpg.groups_with_variants === 1 ? "" : "es"} `
      + `${bpg.groups_with_variants === 1 ? "has" : "have"} multiple template variants. `
      + `Collapsing these onto single templates with scheduling overrides would reduce the library `
      + `from ${bpg.total_templates} to ${bpg.potential_count_after_collapse} templates `
      + `(${bpg.reduction_pct}% reduction).`
    ));
    out.push(simpleTable(
      ["Base process", "Variants", "Budgets consistent", "Template names"],
      bpg.groups.slice(0, 20).map(g => [
        g.process_name,
        g.variant_count,
        g.budget_consistent ? "yes" : "no",
        g.template_names.join("; "),
      ]),
      [2340, 1170, 1170, 4680]
    ));
  }

  // 3.2
  out.push(heading("3.2 Role-only variants", 2));
  const rov = c.role_only_variants;
  if (rov.sparse) {
    out.push(p(rov.reason));
  } else if (rov.count === 0) {
    out.push(p("No role-only variant patterns detected."));
  } else {
    out.push(p(
      `${rov.count} base process${rov.count === 1 ? "" : "es"} `
      + `${rov.count === 1 ? "has" : "have"} multiple template variants distinguished only by role assignment. `
      + `These can be collapsed onto a single template with role-aware scheduling.`
    ));
    rov.candidates.slice(0, 15).forEach(c => out.push(bullet(
      `${c.process_name}: ${c.template_names.join(", ")} — roles in use: ${c.distinct_roles.join(", ")}`
    )));
  }

  // 3.3
  out.push(heading("3.3 Override vs duplicate pattern", 2));
  const od = c.override_vs_duplicate;
  out.push(p(
    `Across ${od.schedules_total} schedule${od.schedules_total === 1 ? "" : "s"}, `
    + `${od.schedules_with_override} use${od.schedules_with_override === 1 ? "s" : ""} a per-schedule time override (${od.schedules_with_override_pct}%). `
    + `In parallel, ${od.redundant_budget_variant_templates} template${od.redundant_budget_variant_templates === 1 ? "" : "s"} `
    + `appear${od.redundant_budget_variant_templates === 1 ? "s" : ""} to exist solely to vary budget within a base process.`
  ));
  if (od.budget_variant_groups.length > 0) {
    out.push(p("These groups would be better served by a single template plus per-schedule overrides:"));
    od.budget_variant_groups.slice(0, 10).forEach(g => out.push(bullet(
      `${g.process_name}: ${g.template_count} templates with budgets ${g.budgets_minutes.join(", ")} minutes`
    )));
  }

  return out;
}

function buildSection4(findings) {
  const b = findings.section_4_budget;
  const out = [];
  out.push(heading("4. Budget accuracy", 1));
  out.push(p(
    "Templates where budgeted time is materially out of step with actual time logged. "
    + "Ranked by annualised hours of variance — the impact on the firm's capacity plan, "
    + "not the severity of the per-instance gap."
  ));

  if (b.sparse) {
    out.push(p(b.reason));
    return out;
  }

  if (b.count_flagged === 0) {
    out.push(p(`${b.templates_assessed} template${b.templates_assessed === 1 ? "" : "s"} assessed; none exceed the variance threshold.`));
    return out;
  }

  out.push(p(
    `${b.count_flagged} of ${b.templates_assessed} assessed template${b.templates_assessed === 1 ? "" : "s"} `
    + `${b.count_flagged === 1 ? "is" : "are"} materially out of step with actuals. `
    + `Combined annualised variance: ${b.total_annualised_hours_variance.toFixed(1)} hours per year.`
  ));

  out.push(simpleTable(
    ["Template", "Budgeted (m)", "Actual (m)", "Direction", "Annual volume", "Hours/year impact"],
    b.findings.slice(0, 20).map(f => [
      f.template_name,
      f.budgeted_minutes.toFixed(0),
      f.actual_minutes.toFixed(0),
      f.direction === "over" ? "over-budgeted" : "under-budgeted",
      f.annual_volume.toLocaleString(),
      Math.abs(f.annualised_hours_impact).toFixed(1),
    ]),
    [3120, 1170, 1170, 1560, 1170, 1170]
  ));

  return out;
}

function buildSection5(findings) {
  const h = findings.section_5_health;
  const out = [];
  out.push(heading("5. Workflow health flags", 1));
  out.push(p(
    "Configuration issues that accumulate quietly and are cheap to fix when caught early."
  ));

  out.push(heading("5.1 Unassigned schedules", 2));
  if (h.unassigned_schedules.count === 0) {
    out.push(p("Every active schedule has a user or role assignment."));
  } else {
    out.push(p(`${h.unassigned_schedules.count} active schedule${h.unassigned_schedules.count === 1 ? " has" : "s have"} no assignment:`));
    h.unassigned_schedules.schedules.slice(0, 20).forEach(s => out.push(bullet(
      `${s.schedule_name} (${s.template_name}, ${s.client_name})`
    )));
  }

  out.push(heading("5.2 Stale templates", 2));
  if (h.stale_templates.count === 0) {
    out.push(p("No stale templates detected."));
  } else {
    out.push(p(`${h.stale_templates.count} template${h.stale_templates.count === 1 ? "" : "s"} with no modification or activity in the last 12 months:`));
    h.stale_templates.templates.slice(0, 30).forEach(t => out.push(bullet(t.template_name)));
  }

  out.push(heading("5.3 Templates with empty subtasks", 2));
  if (h.empty_subtasks.count === 0) {
    out.push(p("Every template has subtasks defined."));
  } else {
    out.push(p(`${h.empty_subtasks.count} template${h.empty_subtasks.count === 1 ? "" : "s"} `
      + `${h.empty_subtasks.count === 1 ? "has" : "have"} no subtasks — process steps are undocumented:`));
    h.empty_subtasks.templates.slice(0, 30).forEach(t => out.push(bullet(t.template_name)));
  }

  out.push(heading("5.4 Inconsistent assignment patterns", 2));
  if (h.inconsistent_assignment.count === 0) {
    out.push(p("Assignment patterns are consistent within each base process."));
  } else {
    out.push(p(`${h.inconsistent_assignment.count} base process${h.inconsistent_assignment.count === 1 ? "" : "es"} `
      + `${h.inconsistent_assignment.count === 1 ? "mixes" : "mix"} user-based and role-based assignments:`));
    h.inconsistent_assignment.groups.slice(0, 15).forEach(g => out.push(bullet(
      `${g.process_name}: ${g.user_assigned_count} schedule${g.user_assigned_count === 1 ? "" : "s"} to named users, `
      + `${g.role_assigned_count} to roles`
    )));
  }

  out.push(heading("5.5 Duplicate template names", 2));
  if (h.duplicate_template_names.count === 0) {
    out.push(p("No duplicate template names detected."));
  } else {
    out.push(p(`${h.duplicate_template_names.count} duplicate-name group${h.duplicate_template_names.count === 1 ? "" : "s"} detected:`));
    h.duplicate_template_names.groups.slice(0, 15).forEach(g => out.push(bullet(
      `${g.raw_names.map(n => `"${n}"`).join(" / ")}${g.is_whitespace_collision ? " (whitespace collision)" : ""}`
    )));
  }

  return out;
}

function buildSection6(findings) {
  const r = findings.section_6_recommendations;
  const out = [];
  out.push(heading("6. Prioritised recommendations", 1));
  out.push(p(
    "Actions ranked by expected impact. Each is labelled by confidence — "
    + "Direct (the data supports the call unambiguously), Likely (one minor "
    + "judgment call required), or Needs review (context the data doesn't carry)."
  ));

  if (r.recommendations.length === 0) {
    out.push(p("No specific recommendations surfaced from this review. Setup appears to be in good shape across the dimensions assessed."));
    return out;
  }

  r.recommendations.forEach((rec, idx) => {
    out.push(new Paragraph({
      spacing: { before: 240, after: 80 },
      children: [
        new TextRun({ text: `${idx + 1}. `, bold: true }),
        new TextRun({ text: rec.title, bold: true }),
        confidenceLabel(rec.confidence),
      ],
    }));
    out.push(p(rec.body));
    out.push(p(`Expected outcome: ${rec.expected_outcome}`, { italics: true, color: COLOURS.muted, spacingAfter: 80 }));
    if (rec.affected_items.length > 0) {
      out.push(p("Affected items:", { bold: true, spacingAfter: 40 }));
      rec.affected_items.slice(0, 12).forEach(item => out.push(bullet(item)));
      if (rec.affected_items.length > 12) {
        out.push(p(`... and ${rec.affected_items.length - 12} more.`, { color: COLOURS.muted, italics: true }));
      }
    }
  });

  if (r.tail_count > 0) {
    out.push(p(
      `Plus ${r.tail_count} further smaller opportunit${r.tail_count === 1 ? "y" : "ies"} `
      + `not listed above — see the detail sections.`,
      { italics: true, color: COLOURS.muted, spacingAfter: 240 }
    ));
  }

  return out;
}

function buildClosing(findings) {
  const out = [];
  out.push(heading("Closing summary", 1));

  const bpg = findings.section_3_consolidation.base_process_groups;
  const budget = findings.section_4_budget;
  const pul = findings.section_2_usage.per_user_load;
  const recCount = findings.section_6_recommendations.recommendations.length;

  const parts = [];
  if (!bpg.sparse && bpg.redundant_templates >= 1) {
    parts.push(`a ${bpg.reduction_pct}% template-library reduction`);
  }
  if (!budget.sparse && budget.count_flagged > 0) {
    parts.push(`${budget.total_annualised_hours_variance.toFixed(0)} hours/year of capacity-plan correction`);
  }
  if (!pul.sparse && pul.top_user_concentrated) {
    parts.push("a workload concentration finding worth reviewing");
  }

  let summary = `This review identified ${recCount} prioritised action${recCount === 1 ? "" : "s"}`;
  if (parts.length > 0) {
    summary += `, with the largest single opportunities being ${parts.join(", ")}`;
  }
  summary += ".";

  out.push(p(summary));
  out.push(p(
    "If you'd like help acting on these recommendations, the XBert team can work through them with you.",
    { italics: true, color: COLOURS.muted, spacingAfter: 240 }
  ));

  return out;
}

// ---------------------------------------------------------------------------
// Document assembly
// ---------------------------------------------------------------------------

function buildDocument(findings) {
  const children = [
    ...buildCoverPage(findings),
    ...buildBenefitsSummary(findings),
    ...buildSparsitySummary(findings),
    ...buildSection1(findings),
    ...buildSection2(findings),
    ...buildSection3(findings),
    ...buildSection4(findings),
    ...buildSection5(findings),
    ...buildSection6(findings),
    ...buildClosing(findings),
  ];

  return new Document({
    creator: "XBert Workflow Review",
    title: "Workflow Review",
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 32, bold: true, font: "Arial", color: COLOURS.accent },
          paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 26, bold: true, font: "Arial", color: COLOURS.text },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 22, bold: true, font: "Arial", color: COLOURS.muted },
          paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 } },
      ],
    },
    numbering: {
      config: [
        { reference: "bullets",
          levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },  // A4 — Australian context
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({
              text: `Workflow Review — ${findings.section_1_snapshot.customer_name}`,
              size: 18, color: COLOURS.muted, italics: true,
            })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Page ", size: 18, color: COLOURS.muted }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: COLOURS.muted }),
              new TextRun({ text: " of ", size: 18, color: COLOURS.muted }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: COLOURS.muted }),
            ],
          })],
        }),
      },
      children,
    }],
  });
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

if (require.main === module) {
  const [findingsPath, outputPath] = process.argv.slice(2);
  if (!findingsPath || !outputPath) {
    console.error("Usage: node write_document.js <findings.json> <output.docx>");
    process.exit(1);
  }
  const findings = JSON.parse(fs.readFileSync(findingsPath, "utf8"));
  const doc = buildDocument(findings);
  Packer.toBuffer(doc).then(buf => {
    fs.writeFileSync(outputPath, buf);
    console.log(`Wrote ${outputPath}`);
  });
}

module.exports = { buildDocument };
