# Output structure

The canonical structure of the Workflow Review document. Use this reference when generating the Word document via the `GenerateWord` MCP tool.

## Document order

1. **Cover page** — title, customer name, generated date
2. **First-page benefits summary** (required) — the high-impact findings of this run
3. **Data-sparsity summary** — what's running on full vs sparse data
4. **Section 1: Snapshot**
5. **Section 2: What's actually being used** (six sub-analyses)
6. **Section 3: Consolidation opportunities** (three sub-analyses)
7. **Section 4: Budget accuracy**
8. **Section 5: Workflow health flags** (five sub-analyses)
9. **Section 6: Prioritised recommendations**
10. **Closing summary**

## First-page benefits summary — required content

Must include:
- Template library reduction available (current count, proposed count, reduction %, named largest opportunity)
- Capacity plan correction available (total annualised hours of variance, single highest-impact correction)
- Setup hygiene findings (counts of orphaned, dormant, duplicate, unassigned — explicitly say "zero" if zero)
- Workload balance signal (one sentence)
- Completion quality signal (one sentence)
- What's healthy — short statement of what's in good shape

The numbers on this page must reconcile to the body of the document — these are summaries, not approximations.

## Data-sparsity summary — content

Three modes:

- **All sections full data**: one sentence — "This review is running on a fully populated data set across all sections."
- **Some sections sparse**: list them with a one-line reason each.
- **Early-stage tenancy** (low total notification volume across many clients): explicit early-stage note plus an XBert-team escalation hook.

The escalation hook text:
> *Note: this tenancy shows minimal workflow usage across [N] clients, which suggests either an early-stage setup or a partially-rolled-out configuration. Sections 2 and 4 may not yet have enough history to be conclusive. If you're unsure whether to act on the findings below, the XBert team can help interpret the results in context.*

Match the supportive-not-promotional tone.

## Section 2 — six sub-analyses

1. Live / dormant / zombie classification
2. Zero-notification templates
3. Orphaned assignments
4. Completion quality (needs notification status breakdown)
5. Per-user load (needs per-user time data)
6. Locked-client schedules

Each must degrade gracefully if its required data is sparse.

## Section 6 — recommendations

5-10 actions, ranked by impact. Each has:
- Title (short, specific — named templates/processes/users)
- Body (1-3 sentences explaining the call)
- Confidence label: Direct, Likely, or Needs review
- Expected outcome (concrete: hours saved, templates retired, etc.)
- Affected items (named — bulleted)

Below 5 found: do not pad. Above 10: surface as "and N further smaller opportunities — see detail sections."

## Tone

**Structural observation, not blame.** The same person who built the setup may be reading the review. The document must be circulatable inside the firm without further editing.

**Specific over generic.** "Collapse the 11 variants of Bank Reconciliation" beats "consolidate where possible." Every consolidation, budget, or hygiene finding names the specific items involved.

**Cite-confidence honestly.** The Direct / Likely / Needs-review labels are not marketing — they signal where the data unambiguously supports the call vs where human judgment is required.

## Closing summary

Mirrors the first-page summary for readers who scroll to the bottom. Includes the XBert-team support hook (supportive, not promotional):

> *If you'd like help acting on these recommendations, the XBert team can work through them with you.*

## Format

`.docx` is the default output via the `GenerateWord` MCP tool. PDF and markdown are reasonable secondary options if asked for.

Page size is A4 (Australian customer base default).
