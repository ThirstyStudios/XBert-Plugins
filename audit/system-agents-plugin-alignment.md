# System Agents ↔ Plugins Alignment — 2026-05-25

## Executive summary

Of the 25 staging system agents and 25 catalogue plugins, **5 pairs map aligned-strong** (same workflow, same shape), **6 pairs map aligned-partial** (overlapping intent, scope or scale differs), **15 plugins have no system-agent counterpart yet** (the biggest gap is the practice-owner workflows — `xbert-practice-metrics`, `xbert-cross-sell-opportunities`, `xbert-config-audit`, `xbert-month-end-pack`, `xbert-fs-pack`, `xbert-tax-reconciliation`, `xbert-instalment-variation`, `xbert-aged-receivables` and friends), and **10 system agents have no direct plugin** (most are jurisdiction-specific compliance readiness agents — BAS / IAS / VAT / IRD GST / MTD / PAYE — that the catalogue rolled up into `xbert-au-compliance-calendar` plus a handful of risk-review specialists like Trust / Withholding / Intercompany / Loan / Consolidation / FBT / Depreciation / Directors Loan that genuinely belong as system agents but were not in the plugin shortlist).

Zero agents qualify for `review-only-skip` under a strict reading — none of the 25 are exclusively per-notification analysis surfaces. Every agent is shaped as a proactive workflow that the Review orchestrator *can* pick when a matching notification context exists, but they would all also work as a standalone Intelligence-page command. The closest to a review-only surface is `xbert-checks` (Automation Checks), which is the bare ExceptionCheckAgent UX; it is kept in scope but classified as `agent-only` because the workflow does not need a plugin counterpart.

**Recommendation shape:**
1. **ADD 11 new system agents** to mirror the plugin catalogue (one per practice/accountant/bookkeeper workflow plugin that currently has no system agent; skipping `xbert-bank-statement-upload` and `xbert-bill-intake` because the in-app UX is a different surface — bank-statement upload and bill capture both live in the existing XBert intake pipelines, not as conversational agents).
2. **RENAME 3 system agents** to match plugin commands so a customer's mental model is consistent across "install plugin" and "use agent" (`/recon-review` → `/reconcile` is the cleanest example).
3. **EXTEND 4 agents' instructions** to absorb plugin methodology where the system agent is rougher than the plugin's prompt.
4. **Keep 10 jurisdiction-/risk-review system agents as-is** — they have no plugin and the workflows are too narrow for the plugin catalogue's "everyday job" framing. They sit naturally as in-app specialist agents.
5. **Address two consolidation tensions**: AU compliance (one plugin vs three system agents BAS/IAS/FBT today) and weekly payroll close (no system agent today vs the `xbert-payroll-close` plugin).

---

## Coverage matrix

`Scope`: 1=Client, 2=User, 3=Practice. `alignment_status` legend: `aligned-strong`, `aligned-partial`, `plugin-only`, `agent-only`, `review-only-skip`. `recommendation`: `keep-as-is`, `add-system-agent`, `rename-system-agent`, `extend-instructions`, `skip-review-only`, `split-system-agent`.

| # | workflow_concept | system_agent (name + /command + scope) | plugin (slug + audience) | alignment_status | recommendation |
|---|---|---|---|---|---|
| 1 | Bank reconciliation (daily) | Bank Reconciliation & Trial Balance Review — `/recon-review` (Client) | xbert-reconcile (bookkeepers) | aligned-partial | `rename-system-agent`: also `split-system-agent` (see #2) — the agent bundles two plugin scopes |
| 2 | Trial balance alignment vs FS | Bank Reconciliation & Trial Balance Review — `/recon-review` (Client) | xbert-trial-balance-alignment (bookkeepers, accountants) | aligned-partial | `split-system-agent`: split the trial-balance methodology out of `/recon-review` into a sibling `/trial-balance-alignment` agent and leave `/recon-review` to bank rec only |
| 3 | Practice setup & Connect config review | Practice Review — `/practice-review` (Practice) | xbert-practice-health-check (principals, practice-managers, bookkeepers) | aligned-partial | `extend-instructions`: add the diagnostic+prescriptive layer that the plugin emphasises (today the agent is descriptive only) |
| 4 | Data quality across clients | Data Quality & Health — `/health-check` (Client) | xbert-practice-health-check (principals, practice-managers, bookkeepers) | aligned-partial | `extend-instructions`: pull in the portfolio-wide ranking + per-client diagnostic narrative |
| 5 | Capacity & utilisation | Capacity & Workload — `/capacity` (User) | xbert-capacity (principals, practice-managers) | aligned-strong | `keep-as-is` (one rename caveat — agent Scope is User, plugin audience is practice-wide; both views are valid) |
| 6 | Workflow / template audit | (none today) | xbert-workflow-review (principals, practice-managers, accountants) | plugin-only | `add-system-agent`: see "B1" in section A |
| 7 | Practice metrics one-pager | (none today) | xbert-practice-metrics (principals) | plugin-only | `add-system-agent`: see "B2" in section A |
| 8 | Cross-sell / lookalike opportunities | (none today) | xbert-cross-sell-opportunities (principals, practice-managers) | plugin-only | `add-system-agent`: see "B3" in section A |
| 9 | Client pulse / volume change detection | (none today — closest is `/pulse` analogue) | xbert-pulse (principals, practice-managers, accountants) | plugin-only | `add-system-agent`: see "B4" in section A |
| 10 | Client fee review (annual) | Billing & Revenue — `/billing-review` (Client) | xbert-client-fee-review (principals, practice-managers) | aligned-partial | `extend-instructions`: agent today is per-client XPM review; extend to portfolio-wide three-list (increase / stable / decrease) output the plugin produces |
| 11 | Config audit (XBert rule consistency) | (none today) | xbert-config-audit (principals, practice-managers) | plugin-only | `add-system-agent`: see "B5" in section A |
| 12 | Cross-tenant intercompany reconciliation | Intercompany Loan Review — `/interloan-review` (Client) AND Multi-Entity Consolidation Check — `/consolidation-review` (Client) | xbert-intercompany-recon (accountants) | aligned-partial | `extend-instructions`: keep the two specialist agents but extend `/consolidation-review` to walk every related entity in one pass (currently it asks the user to name siblings) |
| 13 | Aged receivables chase | (none today) | xbert-aged-receivables (bookkeepers, practice-managers) | plugin-only | `add-system-agent`: see "B6" in section A |
| 14 | Payment run (weekly) | (none today) | xbert-payment-run (bookkeepers) | plugin-only | `add-system-agent`: see "B7" in section A |
| 15 | Bill intake (daily) | (none today) | xbert-bill-intake (bookkeepers) | plugin-only — **but** skip | `skip-review-only`: in-app bill intake is the existing capture pipeline, not a conversational agent. See section D |
| 16 | Bank statement upload (onboarding) | (none today) | xbert-bank-statement-upload (bookkeepers) | plugin-only — **but** skip | `skip-review-only`: file-transformation utility; in-app this is the bank-statement importer, not a chat agent. See section D |
| 17 | Client onboarding orchestration | (none today) | xbert-client-onboard (bookkeepers, practice-managers) | plugin-only | `add-system-agent`: see "B8" in section A |
| 18 | Weekly payroll close | Payroll Reporting Compliance — `/payroll-reporting-review` (Client) | xbert-payroll-close (bookkeepers) | aligned-partial | `extend-instructions`: agent today is jurisdiction-spanning reporting compliance; extend to absorb the weekly pre-run + post-run cadence the plugin owns (or split — see open question 2) |
| 19 | Period-close readiness dashboard | (none today) | xbert-end-of-period-dashboard (accountants, principals, practice-managers) | plugin-only | `add-system-agent`: see "B9" in section A |
| 20 | Month-end pack (bookkeeper hand-up) | Financial Advisor — `/financial-review` (Client) | xbert-month-end-pack (bookkeepers) | aligned-partial | `extend-instructions`: today `/financial-review` does discrete BS/P&L/advisory views; extend to assemble the consolidated monthly pack the plugin produces |
| 21 | Year-end financial statements pack | Financial Advisor — `/financial-review` (Client) | xbert-fs-pack (accountants) | aligned-partial | `extend-instructions` or `add-system-agent`: prefer ADD because the year-end pack is a heavier deliverable with SPFS/GPFS variants — see "B10" in section A |
| 22 | Balance sheet review (quarterly / year-end) | Financial Advisor — `/financial-review` (Client) — BS section | xbert-balance-sheet-explain (accountants) | aligned-partial | `extend-instructions`: extend `/financial-review`'s BS branch to do the movement-by-movement walk + FAR-to-GL check the plugin specifies |
| 23 | Tax reconciliation (accounting profit → taxable income) | (none today) | xbert-tax-reconciliation (accountants) | plugin-only | `add-system-agent`: see "B11" in section A |
| 24 | PAYG / GST instalment variation | (none today) | xbert-instalment-variation (accountants) | plugin-only | `add-system-agent`: see "B12" in section A |
| 25 | AU BAS readiness | BAS Ready — `/bas-ready` (Client, AU) | xbert-au-compliance-calendar (accountants, bookkeepers) | aligned-partial | `keep-as-is` for the per-lodgement agent. The plugin is the consolidated calendar across BAS/IAS/GST/SG/FBT/STP/TPAR; the agent stays the deep-dive on one lodgement type. See open question 1 |
| 26 | AU IAS readiness | IAS Ready — `/ias-ready` (Client, AU) | xbert-au-compliance-calendar (accountants, bookkeepers) | aligned-partial | `keep-as-is` for the per-lodgement agent. Sub-flow of the plugin |
| 27 | NZ GST readiness | IRD GST Ready — `/ird-gst-ready` (Client, NZ) | (none today — calendar is AU-only) | agent-only | `keep-as-is`. NZ has no plugin counterpart yet; agent is the standalone surface |
| 28 | UK VAT readiness | VAT Ready — `/vat-ready` (Client, GB) | (none today — calendar is AU-only) | agent-only | `keep-as-is`. GB has no plugin yet |
| 29 | UK MTD readiness | MTD Ready — `/mtd-ready` (Client, GB) | (none today) | agent-only | `keep-as-is`. GB-specific |
| 30 | UK PAYE/payroll compliance | Payroll & Compliance — `/paye-review` (Client, GB) | (none today) | agent-only | `keep-as-is`. GB-specific |
| 31 | FBT review | FBT Review — `/fbt-review` (Client) | (none today — folded into `xbert-au-compliance-calendar` per Phase 2) | agent-only | `keep-as-is`. FBT is a deep risk-review specialist that the calendar plugin lists as a sub-flow but does not deliver in depth |
| 32 | Trust distribution review | Trust Distribution Review — `/trust-review` (Client) | (none today) | agent-only | `keep-as-is`. Risk-review specialist; no plugin counterpart and none recommended |
| 33 | Withholding tax review | Withholding Tax Review — `/withholding-review` (Client) | (none today) | agent-only | `keep-as-is`. Risk-review specialist |
| 34 | Loan / hire purchase review | Loan & Hire Purchase Review — `/loan-review` (Client) | (none today) | agent-only | `keep-as-is`. Risk-review specialist |
| 35 | Directors loan account review | Directors Loan Account Review — `/directors-loan-review` (Client) | (none today) | agent-only | `keep-as-is` (functionally overlaps `xbert-div7a-schedule` for AU clients but covers AU/NZ/GB jurisdictions, so retain) |
| 36 | Division 7A schedule (AU annual) | Division 7A Risk — `/div7a-review` (Client, AU) | xbert-div7a-schedule (accountants) | aligned-strong | `keep-as-is`. Agent does the risk scan; plugin produces the per-loan Excel schedule. Pair them — both valid surfaces |
| 37 | Fixed asset / depreciation review | Asset Depreciation Review — `/depreciation-review` (Client) | (none today — Phase 2 classifies as chat-only) | agent-only | `keep-as-is`. Risk-review specialist; no plugin recommended |
| 38 | Automation check triage (user surface) | Automation Checks — `/xbert-checks` (User) | (none today — Phase 2 plan-approved exclusion `xbert-exception-check`) | agent-only | `keep-as-is`. Standalone exception-triage surface; no plugin needed |
| 39 | Daily work summary (user surface) | Work Performance — `/my-work` (User) | (none today) | agent-only | `keep-as-is`. Personal-productivity surface; no plugin counterpart sensible |
| 40 | Scheduled work review | Work Scheduling — `/scheduled-work` (Client) | (folds into `xbert-workflow-review` plugin) | aligned-partial | `keep-as-is`. Agent covers per-client view; plugin covers practice-wide template audit. Both valid |

(40 rows — some workflows map to two system agents or two plugins, hence the row count exceeds 25 in each direction.)

---

## Detailed recommendations

### A. System agents to ADD

Twelve plugins lack a system-agent counterpart that would translate cleanly. Eleven of those should become system agents (skipping `xbert-bank-statement-upload` and `xbert-bill-intake` per section D). Twelve are listed below to also cover the year-end FS pack (B10) which is best as a new agent rather than an extension of `/financial-review`.

**Tone for all new agent Instructions:** in-app context (no document-output language like "Word doc drops to your file system" — instead, frame outputs as in-chat structured summaries the user can copy / export from the Intelligence page), graceful degradation when an MCP tool returns `DATA_ACCESS_DENIED` (state the limitation, continue with what's available, never silently skip), never auto-apply actions (always present the action and require explicit user approval per item).

---

**B1. Workflow Review (`/workflow-review`, Scope 3 — Practice)**

- **Name**: `Workflow Review`
- **Command**: `workflow-review`
- **Scope**: 3 (Practice)
- **CountryCode**: NULL
- **ToolPrefixes**: `Features_,Data_,XBert_`
- **Description**: Structural audit of your XBert workflow setup — template consolidation, budget accuracy, workload balance and setup hygiene. Names specific templates, users and processes that need cleanup.
- **Instructions** (≤200 lines, summarised here): Pull the workflow extract via `Features_*` and `XBert_GetFlowList`. Run six deterministic analyses: snapshot (templates, users, schedules in scope), usage reality (active vs orphaned), consolidation candidates (variants of the same base process), budget accuracy (estimated vs actual time variance), health flags (orphaned assignments, zombie schedules, stale templates, duplicate names), prioritised recommendations. Use confidence labels (Direct / Likely / Needs review). Present in chat as six sections with named findings. Offer to file follow-up tasks but never auto-apply changes.

---

**B2. Practice Metrics (`/practice-metrics`, Scope 3 — Practice)**

- **Name**: `Practice Metrics`
- **Command**: `practice-metrics`
- **Scope**: 3 (Practice)
- **CountryCode**: NULL
- **ToolPrefixes**: `Data_,Features_`
- **Description**: Monthly partner-meeting one-pager — revenue, WIP, debtors, lockup days, write-offs, service-line P&L and RAG-banded client risk. Same shape every month, with prior-month movers called out automatically.
- **Instructions**: Pull XPM timesheets + invoices + aged receivables + client data. Compute: revenue, WIP, debtors, lockup days, write-offs, billable utilisation, service-line P&L (bookkeeping / tax / advisory), RAG-banded client risk. Compare each metric to prior month, call out material movers with commentary. Present in chat as a fixed-structure one-pager so the layout is consistent every month. Degrade gracefully if XPM is not connected (note which metrics are unavailable and continue with the rest).

---

**B3. Cross-Sell Opportunities (`/cross-sell-opportunities`, Scope 3 — Practice)**

- **Name**: `Cross-Sell Opportunities`
- **Command**: `cross-sell-opportunities`
- **Scope**: 3 (Practice)
- **CountryCode**: NULL
- **ToolPrefixes**: `Data_,Features_`
- **Description**: Match each client to lookalike peers in your book and rank cross-sell opportunities by inferred fit and revenue uplift. Quarterly cadence, pairs with the annual fee review.
- **Instructions**: Use `Data_GetAllAccessibleClients`, `Data_FindSimilarClientTenants`, `Data_XPMClients`, `Data_XBertNotificationSummary`. For each client: find peers (lookalike pairs), identify services peers use that this client does not, rank by inferred fit × revenue uplift. Output per-client ranked opportunities with talking points. Requires ≥20 clients in the Connect to be useful; refuse politely if the cohort is too small.

---

**B4. Client Pulse (`/client-pulse`, Scope 3 — Practice)**

- **Name**: `Client Pulse`
- **Command**: `client-pulse`
- **Scope**: 3 (Practice)
- **CountryCode**: NULL
- **ToolPrefixes**: `Data_`
- **Description**: Detect material changes in client transactional tempo. Rolling 1-month vs 2-3 month baseline surfaces clients trending up, down, or off — before you notice on the next invoice.
- **Instructions**: For each accessible client, pull rolling 1-month and 2-3 month transactional volume. Compute percent change, rank by materiality, apply default thresholds (>30% material). Surface trending-up (potential repricing) and trending-down (potential churn) lists with a suggested call list. Requires ≥3 months of history for a usable baseline; refuse politely for new clients. Offer to draft outreach for the top one or two priority calls.

---

**B5. Config Audit (`/config-audit`, Scope 3 — Practice)**

- **Name**: `Config Audit`
- **Command**: `config-audit`
- **Scope**: 3 (Practice)
- **CountryCode**: NULL
- **ToolPrefixes**: `Practice_,Features_,XBert_,Data_`
- **Description**: Quarterly audit of XBert rule configuration across your book — surfaces inconsistencies, gaps and drift. Distinct from Workflow Review (templates and schedules); this looks at the rule configuration itself.
- **Instructions**: Pull `Practice_GetConnectAccountReview`, `XBert_GetFlowList`, per-client configuration assignments, `Data_GetClientConnections`. Build per-client enablement fingerprint for every rule. Segment clients (default by industry tag, fall back to whole-book). Identify three finding types: **Inconsistencies** (rule enabled for some clients in a segment, disabled for others), **Gaps** (rule enabled on ≥80% of segment but missing on the rest), **Drift** (rule was enabled, currently disabled). For each finding, propose the bulk-normalisation move. Never apply changes — present the proposal and require user approval.

---

**B6. Aged Receivables (`/aged-receivables`, Scope 1 — Client)**

- **Name**: `Aged Receivables`
- **Command**: `aged-receivables`
- **Scope**: 1 (Client)
- **CountryCode**: NULL
- **ToolPrefixes**: `Data_,Workflow_,Features_,Memory_`
- **Description**: Prioritised debtor call-list ranked by working-capital impact (dollar × days × payment reliability) with promise-tracking, suggested escalation steps and reminder drafts.
- **Instructions**: Pull `Data_AgedReceivables`, `Data_AgedSummary`, contact records, outstanding invoices, prior promise notes (`Memory_GetClientContext`). Score and rank debtors. Apply prior-promise weighting (broken promise escalates priority; recent kept promise de-prioritises). Cap at requested top-N. For each debtor: total outstanding, ageing bucket breakdown, prior promise history, suggested escalation step (gentle nudge / formal reminder / stop-supply / handover), draft reminder copy. Offer to send reminders (`Workflow_SendReminder`) and create follow-up tasks (`Features_CreateClientTask`) per debtor — explicit approval required per debtor. Never auto-send, never auto-action across debtors in bulk.

---

**B7. Payment Run (`/payment-run`, Scope 1 — Client)**

- **Name**: `Payment Run`
- **Command**: `payment-run`
- **Scope**: 1 (Client)
- **CountryCode**: NULL
- **ToolPrefixes**: `Data_,Features_`
- **Description**: Weekly pay-run brief with overdue + due-this-week inclusion logic, held / disputed exclusions, supplier grouping and remittance advice drafts. v1 scope: schedule + remittances; ABA file generation stays in the ledger.
- **Instructions**: Pull aged payables, apply inclusion logic (due in next 7 days + all overdue) and exclusion logic (held, disputed, unresolved approval). Group by supplier. For each supplier: draft a remittance advice. Present the pay schedule with included / excluded bills (excluded surfaced with reasons — never silently dropped), supplier groupings, and total amount. Approve remittance drafts per supplier. Never post the run for the user — they trigger the bank file in the ledger.

---

**B8. Client Onboard (`/client-onboard`, Scope 3 — Practice)**

- **Name**: `Client Onboard`
- **Command**: `client-onboard`
- **Scope**: 3 (Practice)
- **CountryCode**: NULL
- **ToolPrefixes**: `Practice_,Features_,Data_`
- **Description**: Structured new-client onboarding lifecycle — engagement → connection → configuration → go-live — with gate checks that prevent skipping ahead and a rules baseline assignment at go-live.
- **Instructions**: Confirm new client name, Connect tenant, engagement scope. Check current phase via `Practice_*` and `Features_*` tools. Present the gated checklist for the current phase. Walk through each phase's gate checks; create workflow tasks from practice templates as the user progresses (`Features_CreateClientTask`). Engagement letter and scope confirmation gate-checked before any configuration starts. Final go-live step assigns the rules baseline. Note explicitly that COA creation and opening-balance load remain manual steps in the ledger today (v1 limitation — capability gap on the roadmap).

---

**B9. End-of-Period Dashboard (`/end-of-period-dashboard`, Scope 3 — Practice, AU-only v1)**

- **Name**: `End-of-Period Dashboard`
- **Command**: `end-of-period-dashboard`
- **Scope**: 3 (Practice)
- **CountryCode**: `AU` (v1 AU-only)
- **ToolPrefixes**: `Data_,Features_,Validation_,Workflow_`
- **Description**: Period-close readiness across every client — fuses workflow, data quality and lodgement obligations into a single per-client view. Month / quarter / year cadences supported.
- **Instructions**: Choose cadence (month / quarter / year). Pull clients (`Data_GetAllAccessibleClients`), workflow status (`Features_GetWork`), data quality (`Data_DataQualityScore`), lock dates (`Data_LockDates`), reconciliation status, validation results (`Validation_BAS/VAT/Payroll`). Per client, compute readiness band (ready / blocked / at-risk), name the blockers, check upcoming deadlines for the cadence. Present in chat as a summary (X of Y ready, Z lodgements due in next N days) followed by per-client detail. Degrade gracefully where a client lacks a piece of data — state the gap and continue.

---

**B10. FS Pack (`/fs-pack`, Scope 1 — Client)**

- **Name**: `FS Pack`
- **Command**: `fs-pack`
- **Scope**: 1 (Client)
- **CountryCode**: NULL (defaults to AU-style SPFS but supports country-appropriate structure via client `Data_GetOrganisation`)
- **ToolPrefixes**: `Data_`
- **Description**: Year-end financial statement pack composition — pulls closing TB, derives cashflow, formats BS and P&L with comparative-period columns, populates notes shell and produces SPFS or GPFS structure for partner review.
- **Instructions**: Confirm client, year-end date, SPFS vs GPFS structure. Pull `Data_FinancialStatements`, `Data_BalanceSheet`, `Data_ProfitAndLoss`, `Data_Cashflow`, `Data_TrialBalance`, organisation settings. Compose: cover with entity name + ABN + registered address, comparative columns, notes-to-accounts shell, year-end provisions and accruals schedule. Cashflow derived via indirect method from BS comparative + P&L. Present as a structured pack the user can review section by section. Note explicitly when comparative period is unavailable.

---

**B11. Tax Reconciliation (`/tax-reconciliation`, Scope 1 — Client)**

- **Name**: `Tax Reconciliation`
- **Command**: `tax-reconciliation`
- **Scope**: 1 (Client)
- **CountryCode**: NULL
- **ToolPrefixes**: `Data_`
- **Description**: Accounting-to-tax reconciliation worksheet — walks from accounting profit to taxable income with every adjustment line (add-backs, deductions, FBT, prior-year losses) tied to its source journal or schedule. Per-entity structure (company / trust / partnership).
- **Instructions**: Confirm client, entity type (company / trust / partnership), year-end date. Pull `Data_FinancialStatements`, `Data_TrialBalance`, `Data_ProfitAndLoss`, `Data_BalanceSheet`, `Data_JournalMaster_*`. Walk Schedule M-style: starting accounting profit → add non-deductibles (entertainment, fines, private-use motor vehicle) → back out accounting depreciation, replace with tax depreciation → handle FBT base → apply prior-year tax losses → taxable income. Each adjustment line carries the supporting evidence (which journal, which account). Present in chat as a structured walk; offer to export the worksheet. Lodgement stays out of scope.

---

**B12. Instalment Variation (`/instalment-variation`, Scope 1 — Client, AU)**

- **Name**: `Instalment Variation`
- **Command**: `instalment-variation`
- **Scope**: 1 (Client)
- **CountryCode**: `AU`
- **ToolPrefixes**: `Data_`
- **Description**: PAYG-I / GST instalment variation recommendation with YTD profit trend, cashflow run-rate, prior-year comparison and explicit general interest charge (GIC) exposure note. Audit-defence working paper output.
- **Instructions**: Confirm client, instalment type (PAYG-I or GST), quarter. Pull `Data_ProfitAndLoss` (YTD vs prior year), `Data_BalanceSheet`, `Data_Cashflow`, `Data_BudgetAdherence`, `Data_TaxRates`. Recommend variation direction (up / down / stay) with a confidence label. For variation-down recommendations, calculate GIC exposure if the variation is wrong by 15% on the final return — state the exposure explicitly. Document the data, the recommendation, and the assumptions as a structured audit-defence note. Triggered by ATO notice arrival, not by calendar date.

---

### B. System agents to RENAME

Three system agents have plugin counterparts where matching the command name would help users move between the two surfaces. Be conservative — only the cleanest renames are proposed.

| current | proposed | rationale |
|---|---|---|
| `/recon-review` | `/reconcile` (bank rec branch) + new `/trial-balance-alignment` agent for the TB branch | The agent today bundles bank rec and trial balance review. The plugin shortlist has them as two separate plugins (`xbert-reconcile` and `xbert-trial-balance-alignment`). Recommend splitting — see open question 3 |
| `/billing-review` | `/client-fee-review` | "Billing & Revenue" today is per-client XPM analysis — the plugin (`xbert-client-fee-review`) frames it as a portfolio-wide annual review. Renaming aligns naming and signals the extension scope (extend instructions to support portfolio mode) |
| `/payroll-reporting-review` | `/payroll-close` (recommended split — see open question 2) | The plugin's `xbert-payroll-close` is the weekly cadence. The current agent is reporting-compliance focused (cadence-agnostic). Either rename + extend, or split (preferred) so weekly close and reporting compliance are distinct surfaces |

### C. System agents that are review-only (skip from alignment)

None of the 25 staging agents qualify as review-only under a strict reading. The Review module's orchestrator can pick any agent when a matching notification context exists, but no agent is *exclusively* per-notification analysis — every one is a proactive workflow that also works as a standalone command. Result: zero `skip-review-only`. (If a stricter line is wanted later, `/financial-review` and `/xbert-checks` are the closest to "general triage" surfaces that mostly run from a notification.)

### D. Plugins that should NOT have a system agent

| plugin | rationale |
|---|---|
| xbert-bank-statement-upload | File-transformation utility. In-app this is the existing bank-statement importer (a dedicated UI / pipeline), not a chat agent. Same workflow, different surface |
| xbert-bill-intake | Bill capture in-app is the existing receipt-capture / bill-import pipeline (the xbert-capture mobile app + AP intake screens). A conversational agent would duplicate the existing UX |

Both plugins are valid in Claude Code (where there is no native intake UI), but they don't translate to the in-app surface. Recommend keeping them plugin-only.

### E. Overlaps / consolidation opportunities

| concern | current state | recommendation |
|---|---|---|
| AU compliance plugins vs agents | Plugin: one consolidated `xbert-au-compliance-calendar`. Agents: three separate `/bas-ready`, `/ias-ready`, plus `/fbt-review` and the AU-flavoured payroll reporting | **Keep separate.** The per-lodgement agent UX is good — a customer who wants "BAS readiness for client X" types `/bas-ready` and gets the right depth; a customer who wants "every lodgement across my book" uses the plugin (or an aggregator agent — see open question 1). Do not collapse the per-lodgement agents |
| Bank rec + TB rolled into one agent today | `/recon-review` bundles both | **Split** into `/reconcile` and `/trial-balance-alignment` to mirror the plugin shortlist. See open question 3 |
| Payroll reporting (broad) vs weekly payroll close | `/payroll-reporting-review` is jurisdiction-spanning (STP P2 / Payday Filing / RTI). `xbert-payroll-close` is weekly cadence, bookkeeper-owned | **Split** into `/payroll-close` (weekly bookkeeper surface) and `/payroll-reporting-review` (cross-jurisdiction reporting compliance). See open question 2 |
| Directors loan vs Division 7A | `/directors-loan-review` covers AU/NZ/GB. `/div7a-review` is AU-only. `xbert-div7a-schedule` is AU-only Excel output | **Keep all three.** Director loans are a broad risk-review surface; Div 7A is the deep AU-only specialist; the plugin is the Excel schedule deliverable. They complement |
| Intercompany loan vs Multi-entity consolidation | `/interloan-review` (loans) + `/consolidation-review` (group reporting). Plugin: `xbert-intercompany-recon` (cross-tenant walk) | **Keep separate but extend.** Extend `/consolidation-review` to walk every related tenant automatically (today it asks the user). The two agents stay because they address different risk lenses |
| Practice Review vs Practice Health Check | `/practice-review` (Scope 3 — Connect setup) + `/health-check` (Scope 1 — client data quality). Plugin `xbert-practice-health-check` does portfolio-wide DQ + diagnostic narrative | **Keep separate; extend `/health-check`.** Add the portfolio-wide ranking + diagnostic+prescriptive layer to `/health-check`. `/practice-review` stays as the Connect-setup specialist |

---

## Open questions for Aaron

1. **AU compliance — keep three agents (BAS / IAS / FBT) plus add an aggregator agent that mirrors `xbert-au-compliance-calendar`, or rely on the plugin alone for the aggregate view?** This audit recommends keeping the per-lodgement agents (different depth than the calendar). An optional 13th new system agent could be `/au-compliance-calendar` that wraps the lot for the aggregate "every deadline this week" use case. Worth adding, or is the plugin enough on its own?

2. **Payroll: split `/payroll-reporting-review` into `/payroll-close` (weekly) + `/payroll-reporting-review` (compliance), or extend the single agent with a "weekly mode" parameter?** Split is cleaner but creates two surfaces for a workflow many users won't distinguish. Extension keeps one surface but loads up the prompt. Recommend split (mirrors the plugin), but it's a real call.

3. **Bank rec + TB alignment: split `/recon-review` into `/reconcile` + `/trial-balance-alignment`, or keep bundled?** Plugin shortlist splits them; user habits (today, after months of `/recon-review`) prefer keeping bundled. Recommend split for consistency with plugin catalogue, but acknowledge it's a habit break.

4. **`/financial-review` extension scope: extend its month-end-pack and balance-sheet-explain branches in place, or carve out new `/month-end-pack` and `/balance-sheet-explain` agents?** This audit recommends extension (avoids agent sprawl), but the plugin pattern is "one workflow, one command". If a clean one-command-per-plugin mapping is the goal, carve out — accept ~3 more new agents.

5. **Confirm there's no `xbert-receipt-capture` plugin counterpart needed.** Receipt capture is a mobile + intake-pipeline workflow today, not a chat agent. Phase 2 listed it as a plan-approved exclusion. This audit follows that — no system agent is proposed for receipt capture. Confirm that holds.
