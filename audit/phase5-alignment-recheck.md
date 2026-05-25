# Phase 5 — Alignment re-check

## Executive summary

**Result: PASS with 2 minor regressions, none blocking storefront spot-check.**

All 25 plugins promised by Phase 2 are scaffolded on disk with the full 4-artefact stack (plugin.json, command, SKILL.md, README.md). All 25 marketplace.json entries match the plugin folders by name and version (0.1.0 across the board). All 4 bundles resolve every plugin slug they claim. All 4 v1-narrow gap-shipping plugins carry their gap caveat in both `description` and `x-xbert.prerequisites`. Site catalogue generated 25 plugins + 4 bundles at `site/src/generated/catalog.json`.

The two regressions are scope drift on the gap-plan side, not the plugin side:

1. **`agent-feed-health-portfolio-gap.md` (#4) was not filed.** Phase 2 promised 10 numbered gap plans. The dependent plugin (`xbert-feed-health`) was correctly held back from ship — so no scaffolded plugin is broken — but the gap plan that would unblock it is missing. The Phase 4 closure statement of "8 capability-gap plans filed" is short by one against Phase 2's promise.
2. **`agent-labour-allocation-gap.md` (#9) was not filed.** Phase 2 flagged this as "optional, low priority" so it was always at higher risk of being dropped, but it was named in the matrix. Dependent plugin (`xbert-rd-substantiation`) was correctly held back.

Neither regression affects any of the 25 shipped plugins. The deferred plugins (`xbert-merchant-settlement`, `xbert-feed-health`, `xbert-rd-substantiation`, `xbert-lead-funnel`) are correctly absent from `plugins/`, `marketplace.json`, `bundles.json`, and the site catalogue — matching Phase 2's "do not ship v1" decision.

Green-light Aaron for storefront spot-check.

---

## Coverage matrix re-check

Notation: `audit-shipping` includes the 12 plugins under shortlist sections 2 + 5 (8 net-new + 4 additional no-gap). `gap-narrow` is the 4 v1-narrow gap-shippers from §4. `existing` is the 4 already-shipped plugins. Total = 25 rows.

| matrix_row | workflow | promised_plugin_slug | classification | scaffolded? | marketplace_entry? | bundle_membership? | result |
|---|---|---|---|---|---|---|---|
| 1 | Reconcile bank account daily | xbert-reconcile | existing-plugin | YES | YES v0.1.0 | bookkeeper-daily-pack | PASS |
| 3 | Bill intake / approval routing | xbert-bill-intake | gap-narrow | YES | YES v0.1.0 | (none — solo) | PASS |
| 4 | Weekly payment run | xbert-payment-run | gap-narrow | YES | YES v0.1.0 | (none — solo) | PASS |
| 6 | Historical bank statement onboarding | xbert-bank-statement-upload | cowork-shipping | YES | YES v0.1.0 | bookkeeper-daily-pack | PASS |
| 7 | Aged receivables chase | xbert-aged-receivables | audit-shipping | YES | YES v0.1.0 | bookkeeper-daily-pack | PASS |
| 8/17/18 | Payroll cycle (pre + post) | xbert-payroll-close | audit-shipping | YES | YES v0.1.0 | period-end-pack + au-compliance-pack (intentional cross-bundle) | PASS |
| 9/10/13/19p/22/23/25/26/27/28/41/43 | AU lodgement calendar | xbert-au-compliance-calendar | audit-shipping (merge) | YES | YES v0.1.0 | au-compliance-pack | PASS |
| 16/53 | Client onboarding | xbert-client-onboard | gap-narrow | YES | YES v0.1.0 | (none — solo) | PASS |
| 21 | Month-end financial pack | xbert-month-end-pack | audit-shipping | YES | YES v0.1.0 | period-end-pack | PASS |
| 24 | PAYG/GST instalment variation | xbert-instalment-variation | audit-shipping | YES | YES v0.1.0 | au-compliance-pack | PASS |
| 29 | Trial balance alignment | xbert-trial-balance-alignment | cowork-shipping | YES | YES v0.1.0 | period-end-pack | PASS |
| 30/37 | Balance sheet explain | xbert-balance-sheet-explain | audit-shipping | YES | YES v0.1.0 | period-end-pack | PASS |
| 31/38/39 | FS pack | xbert-fs-pack | audit-shipping | YES | YES v0.1.0 | (none — solo) | PASS |
| 33 | End-of-period dashboard | xbert-end-of-period-dashboard | cowork-shipping | YES | YES v0.1.0 | period-end-pack | PASS |
| 34 | Accounting-to-tax reconciliation | xbert-tax-reconciliation | audit-shipping | YES | YES v0.1.0 | (none — solo) | PASS |
| 35 | Division 7A schedule | xbert-div7a-schedule | gap-narrow | YES | YES v0.1.0 | au-compliance-pack | PASS |
| 42 | Intercompany reconciliation | xbert-intercompany-recon | audit-shipping | YES | YES v0.1.0 | (none — solo) | PASS |
| 44–46/55/56/62 | Practice capacity | xbert-capacity | existing-plugin | YES | YES v0.1.0 | principal-practice-pack | PASS |
| 47/57/60 | Client fee review | xbert-client-fee-review | cowork-shipping | YES | YES v0.1.0 | principal-practice-pack | PASS |
| 48 | Client churn signals | xbert-pulse | existing-plugin | YES | YES v0.1.0 | bookkeeper-daily-pack | PASS |
| 49/50 | Practice health check (v1+v2) | xbert-practice-health-check | cowork-shipping | YES | YES v0.1.0 | principal-practice-pack | PASS |
| 51 | XBert config audit | xbert-config-audit | audit-shipping | YES | YES v0.1.0 | principal-practice-pack | PASS |
| 52 | Workflow / template audit | xbert-workflow-review | existing-plugin | YES | YES v0.1.0 | principal-practice-pack | PASS |
| 58/59/63 | Practice metrics dashboard | xbert-practice-metrics | audit-shipping | YES | YES v0.1.0 | principal-practice-pack | PASS |
| 64 | Cross-sell opportunities | xbert-cross-sell-opportunities | audit-shipping | YES | YES v0.1.0 | principal-practice-pack | PASS |

**25/25 PASS.** Every Phase 2 promised plugin is on disk with full file set, listed in marketplace.json at the agreed v0.1.0, and where applicable surfaced through its intended bundle.

Six plugins ship as bundle-solo (only via the marketplace, not in any bundle): `xbert-bill-intake`, `xbert-client-onboard`, `xbert-fs-pack`, `xbert-intercompany-recon`, `xbert-payment-run`, `xbert-tax-reconciliation`. Phase 2 did not promise bundle membership for every plugin — bundles were defined later, so this is intentional curation not regression.

---

## Capability-gap plan re-check

Phase 2 named 10 numbered gap plans (§ "Capability gaps requiring plans" rows 1–10). Phase 4 reported 8 filed. Re-check confirms 8 of 10 filed; 2 missing.

| gap_plan | filed? | dependent_plugins_present? | ship_recommendation_respected? |
|---|---|---|---|
| #1 agent-bill-approver-routing-gap.md | YES (2,195 bytes) | YES — xbert-bill-intake scaffolded v1-narrow with explicit "approver routing in v2" caveat | YES — plugin ships v1-narrow without approver routing |
| #2 agent-aba-payment-file-gap.md | YES (2,095 bytes) | YES — xbert-payment-run scaffolded v1-narrow with "ABA file in v2" caveat | YES — plugin ships v1-narrow producing pay schedule + remittances |
| #3 agent-merchant-connectors-gap.md | YES (2,262 bytes) | YES (correctly deferred) — xbert-merchant-settlement NOT scaffolded | YES — plan says hold ship, plugin held |
| #4 agent-feed-health-portfolio-gap.md | **NO** — file missing | YES (correctly deferred) — xbert-feed-health NOT scaffolded | Partial — deferral honoured but plan never landed; xbert-feed-health blocked indefinitely |
| #5 agent-coa-and-opening-balance-gap.md | YES (2,260 bytes) | YES — xbert-client-onboard scaffolded v1-narrow with "COA + opening balance in v2" caveat | YES — plugin ships v1-narrow as orchestration + gate + checklist |
| #6 agent-state-payroll-tax-thresholds-gap.md | YES (2,180 bytes) | YES — xbert-au-compliance-calendar scaffolded; payroll-tax sub-flow explicitly held back per plan | YES — calendar ships v1 covering BAS/IAS/STP/SG/FBT/TPAR, payroll-tax sub-flow excluded |
| #7 agent-ato-calendar-source-gap.md | YES (2,496 bytes) | YES — both xbert-end-of-period-dashboard and xbert-au-compliance-calendar scaffolded | YES — both ship v1 with hard-coded date caveat |
| #8 agent-ato-rate-lookup-gap.md | YES (2,269 bytes) | YES — xbert-div7a-schedule scaffolded v1-narrow with manual benchmark-rate entry | YES — plugin ships with manual rate entry; mentioned in plugin.json prerequisites and longDescription |
| #9 agent-labour-allocation-gap.md | **NO** — file missing | YES (correctly deferred) — xbert-rd-substantiation NOT scaffolded | Partial — Phase 2 flagged as "optional, low priority"; plan never landed but no shipped plugin depends on it |
| #10 agent-crm-connector-gap.md | YES (2,367 bytes) | YES (correctly deferred) — xbert-lead-funnel NOT scaffolded | YES — plan says defer, plugin held |

**Net: 8 of 10 filed.** Two missing plans: `agent-feed-health-portfolio-gap.md` (regression — was a real workflow request) and `agent-labour-allocation-gap.md` (Phase 2-flagged as optional). Both dependent plugins are correctly absent — no broken plugin shipped — but the next person who comes back to unblock those plugins will hit "no plan filed" friction.

---

## Bundle membership audit

All 4 bundles resolve cleanly. Every slug claimed by a bundle exists in marketplace.json AND in `plugins/`.

### bookkeeper-daily-pack (4 plugins)
- xbert-reconcile → marketplace=Y, folder=Y → PASS
- xbert-pulse → marketplace=Y, folder=Y → PASS
- xbert-aged-receivables → marketplace=Y, folder=Y → PASS
- xbert-bank-statement-upload → marketplace=Y, folder=Y → PASS

### period-end-pack (5 plugins)
- xbert-end-of-period-dashboard → marketplace=Y, folder=Y → PASS
- xbert-trial-balance-alignment → marketplace=Y, folder=Y → PASS
- xbert-balance-sheet-explain → marketplace=Y, folder=Y → PASS
- xbert-payroll-close → marketplace=Y, folder=Y → PASS (cross-bundle, see below)
- xbert-month-end-pack → marketplace=Y, folder=Y → PASS

### au-compliance-pack (4 plugins)
- xbert-au-compliance-calendar → marketplace=Y, folder=Y → PASS
- xbert-instalment-variation → marketplace=Y, folder=Y → PASS
- xbert-div7a-schedule → marketplace=Y, folder=Y → PASS
- xbert-payroll-close → marketplace=Y, folder=Y → PASS (cross-bundle, see below)

### principal-practice-pack (7 plugins)
- xbert-workflow-review → marketplace=Y, folder=Y → PASS
- xbert-practice-health-check → marketplace=Y, folder=Y → PASS
- xbert-capacity → marketplace=Y, folder=Y → PASS
- xbert-client-fee-review → marketplace=Y, folder=Y → PASS
- xbert-practice-metrics → marketplace=Y, folder=Y → PASS
- xbert-cross-sell-opportunities → marketplace=Y, folder=Y → PASS
- xbert-config-audit → marketplace=Y, folder=Y → PASS

### Cross-bundle plugins
- **xbert-payroll-close** appears in both `period-end-pack` AND `au-compliance-pack`. **Confirmed intentional per Phase 2 Decision 4** ("bookkeeper-side weekly payroll cycle… super/STP-final/payroll-tax inside `xbert-au-compliance-calendar`") — payroll-close legitimately belongs to both the close-out workflow and the AU compliance cycle. PASS.

### Plugins not in any bundle (intentional)
6 plugins ship marketplace-only with no bundle: `xbert-bill-intake`, `xbert-client-onboard`, `xbert-fs-pack`, `xbert-intercompany-recon`, `xbert-payment-run`, `xbert-tax-reconciliation`. All have distinct enough audience or cadence that pairing them into existing bundles wasn't done by Phase 4. Not a regression — Phase 2 did not promise full bundle coverage.

---

## Specialist-agent coverage re-check

Phase 2 §"Specialist agents with zero plugins (after audit)" gave expected plugin counts per specialist. Re-check against scaffolded plugins:

| Specialist | Phase 2 expected | Scaffolded today | Result |
|---|---|---|---|
| DataAgent | ~13 (named: au-compliance-calendar, payroll-close, balance-sheet-explain, fs-pack, month-end-pack, instalment-variation, tax-reconciliation, intercompany-recon, practice-metrics, cross-sell-opportunities, div7a-schedule, payment-run, **feed-health**) | 12 — all of the above except `xbert-feed-health` which was correctly held back | PASS (held-back plugin matches gap-deferral decision) |
| FeaturesAgent | ~5 (aged-receivables, capacity, workflow-review + co-routes via end-of-period-dashboard and client-fee-review) | All 5 scaffolded | PASS |
| PracticeAgent | ~4 (practice-health-check, end-of-period-dashboard, config-audit, client-onboard) | All 4 scaffolded | PASS |
| XBertAgent | ~2 (reconcile + co-route via config-audit) | Both scaffolded | PASS |
| ReceiptCaptureAgent | ~1 (xbert-bill-intake) | Scaffolded | PASS |
| UtilityAgent | 0 — chat-only (generator, not a plugin entry point) | No plugins routed | PASS — rationale on record in Phase 2 |
| SlackAgent | 0 — plan-approved exclusion `xbert-team-notify` | No plugins routed | PASS — rationale on record |
| MemoryAgent | 0 — plan-approved exclusion `xbert-memory-coach`; called from other plugins | No plugins routed | PASS — rationale on record |
| ExceptionCheckAgent | 0 — plan-approved exclusion `xbert-exception-check` | No plugins routed | PASS — rationale on record |

**All 9 specialists either have plugins routed to them or have a Phase 2 chat-only rationale on record.** Caveat: routing is documented in the audit matrix, not declared in plugin.json — no `routesTo` / `x-xbert.agent` field on any plugin. If routing-by-manifest becomes a Phase 6 requirement, all 25 plugins will need a small metadata add.

---

## Regressions / drift

### REGRESSION 1 — `agent-feed-health-portfolio-gap.md` not filed
- **Expected:** Phase 2 §"Capability gaps requiring plans" #4 names this gap plan and routes `xbert-feed-health` (deferred plugin) to it.
- **Found:** No file at `xbert-app-processing/Plans/agent-feed-health-portfolio-gap.md`.
- **Impact:** Low. The dependent plugin (`xbert-feed-health`) was correctly deferred — no scaffolded plugin is broken. But the next person who unblocks the plugin will hit "no plan filed" and have to write the plan from scratch from the Phase 2 matrix.
- **Severity:** Non-blocking. Follow-up: file the plan when work on `xbert-feed-health` resumes.

### REGRESSION 2 — `agent-labour-allocation-gap.md` not filed
- **Expected:** Phase 2 §"Capability gaps requiring plans" #9 names this gap plan and routes `xbert-rd-substantiation` (deferred plugin) to it. Phase 2 itself tagged this as "optional, low priority".
- **Found:** No file at `xbert-app-processing/Plans/agent-labour-allocation-gap.md`.
- **Impact:** Minimal. R&D substantiation is the lowest-priority deferred plugin in the entire shortlist.
- **Severity:** Non-blocking. Phase 2 self-flagged this as optional.

### NO drift on the plugin/marketplace/bundle side
- 25/25 plugins scaffolded with all 4 required files.
- 25/25 marketplace.json entries match folder slugs at v0.1.0.
- 25/25 site catalogue entries match marketplace.
- 4/4 bundles resolve every slug.
- 4/4 v1-narrow gap-shipping plugins carry the gap caveat in BOTH `description` AND `x-xbert.prerequisites`. Spot-check excerpts:
  - `xbert-bill-intake`: `"v1 ships dedup + coding + approval task; approver routing is v2"` in description; `"v1 scope note: this plugin posts the bill and creates an approval task — it does NOT route to a specific approver (coming in v2)"` in prerequisites
  - `xbert-payment-run`: `"v1 produces the schedule + remittances; ABA payment file generation is v2"` in description
  - `xbert-client-onboard`: `"v1 orchestrates the workflow; COA + opening-balance steps are checklist items"` in description
  - `xbert-div7a-schedule`: `"v1 narrow: manual benchmark-rate entry until a Tax_GetATOBenchmarkRate tool ships"` in description
- 4/4 deferred plugins correctly NOT scaffolded: `xbert-merchant-settlement`, `xbert-feed-health`, `xbert-rd-substantiation`, `xbert-lead-funnel`. All four are absent from `plugins/`, `marketplace.json`, `bundles.json`, and `catalog.json`.

---

## Sign-off

**PASS.** Green-light Aaron for storefront spot-check.

The two missing gap plans (`agent-feed-health-portfolio-gap.md`, `agent-labour-allocation-gap.md`) are scope drift on the engineering-roadmap side, not the customer-facing storefront side. Every plugin that Phase 2 promised to ship in v1 (21 net-new + 4 existing = 25) is on disk, in the marketplace, in the site catalogue, and bundled where it was promised to be bundled. Every plugin that Phase 2 promised to ship as v1-narrow carries its gap caveat in the storefront-visible copy.

**Follow-up tickets (non-blocking):**
1. File `agent-feed-health-portfolio-gap.md` before resuming any work on `xbert-feed-health`.
2. File `agent-labour-allocation-gap.md` if `xbert-rd-substantiation` is ever pulled forward from "optional, low priority".
3. (Phase 6 consideration) Decide whether the specialist-agent routing recorded in `phase2-coverage-matrix.md` should also live in `plugin.json` as an `x-xbert.routesTo` field for downstream routing automation.
