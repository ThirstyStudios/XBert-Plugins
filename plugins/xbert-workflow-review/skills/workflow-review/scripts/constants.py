"""
Materiality thresholds and tunable constants for the Workflow Review plugin.

ALL tunable values live here. If a future version needs to change what counts as
"materially over budget" or "elevated non-completion rate," change it here once
and every analysis script picks it up.

See spec section 9, question 4 — these are hardcoded for v01 with a single
adjustment surface; user-configurability is deferred to v02.
"""

# ---------------------------------------------------------------------------
# Section 4 — Budget accuracy
# ---------------------------------------------------------------------------

# A template's budget is flagged as materially out of step with reality if the
# absolute variance between TemplateEstimatedTimeMinutes (or the effective
# override) and AvgInstanceActualTimeMinutes exceeds this fraction in either
# direction.
BUDGET_VARIANCE_THRESHOLD = 0.50  # 50%

# Templates with fewer completed instances than this are excluded from budget
# analysis — average actuals aren't reliable below this volume.
BUDGET_MIN_COMPLETIONS = 5


# ---------------------------------------------------------------------------
# Section 2.4 — Completion quality
# ---------------------------------------------------------------------------

# A template is surfaced under "notifications fire but the work isn't getting
# done" only when both gates are met:
#   1. enough notifications in the last 12 months to be a real signal, AND
#   2. the non-completion rate (cancelled + snoozed + dismissed over total)
#      exceeds this threshold.
COMPLETION_QUALITY_MIN_NOTIFICATIONS = 10
COMPLETION_QUALITY_NON_COMPLETION_THRESHOLD = 0.30  # 30%


# ---------------------------------------------------------------------------
# Section 2.5 — Per-user load
# ---------------------------------------------------------------------------

# A single user holding more than this share of the team's total logged time
# is flagged as concentration risk.
TOP_USER_CONCENTRATION_THRESHOLD = 0.30  # 30%

# Minimum total team minutes logged before per-user load is assessed at all.
# Below this, the data is too thin to draw conclusions from.
PER_USER_LOAD_MIN_TEAM_MINUTES = 600  # 10 hours across the whole team


# ---------------------------------------------------------------------------
# Section 2.1 — Live / dormant / zombie classification
# ---------------------------------------------------------------------------

# A schedule is "live" if it has produced a notification within this window.
LIVE_WINDOW_DAYS = 90

# A schedule is "dormant" if it's configured to fire but hasn't produced a
# notification within this window (and isn't live).
DORMANT_WINDOW_DAYS = 180

# A schedule is "zombie" if it has fired (created notifications) within
# LIVE_WINDOW_DAYS but has zero completions all-time.


# ---------------------------------------------------------------------------
# Section 5 — Workflow health flags
# ---------------------------------------------------------------------------

# A template is "stale" if neither it nor any of its schedules has been
# modified within this window and has no recent activity.
STALE_TEMPLATE_DAYS = 365

# Duplicate-name detection compares trimmed, case-folded template names.
# Whitespace-only variants (leading/trailing space) are always flagged
# regardless of this setting.


# ---------------------------------------------------------------------------
# Section 1 — Snapshot
# ---------------------------------------------------------------------------

# Coverage is reported as "% of clients with at least one active schedule
# configured." Clients flagged IsLocked or IsMarkedForDeletion are excluded
# from the denominator.


# ---------------------------------------------------------------------------
# Data-sparsity detection (Section 6.4)
# ---------------------------------------------------------------------------

# If total all-time notifications across the entire tenancy fall below this
# threshold, the data-sparsity summary flags this as an early-stage tenancy
# and suggests the customer qualify the review with the XBert team.
EARLY_STAGE_MAX_NOTIFICATIONS = 200

# If notification status breakdown fields are present in the extract but the
# sum of (cancelled + snoozed + dismissed) is exactly zero across the entire
# tenancy AND total notifications exceed this volume, we report it as a
# positive finding ("notifications appear to complete cleanly") rather than
# as missing data.
CLEAN_COMPLETION_MIN_VOLUME = 100


# ---------------------------------------------------------------------------
# Section 6 — Prioritised recommendations
# ---------------------------------------------------------------------------

# Minimum and maximum number of recommendations surfaced in Section 6.
# Below MIN, the plugin pads with smaller wins to reach the floor; above MAX,
# the long tail is summarised as "and N further smaller opportunities."
RECOMMENDATIONS_MIN = 5
RECOMMENDATIONS_MAX = 10
