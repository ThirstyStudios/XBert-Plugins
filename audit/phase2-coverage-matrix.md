# Phase 2 — Alignment Coverage Matrix

## Executive summary

Phase 1 surfaced **71 workflow rows** across three persona catalogues (22 bookkeeper + 24 accountant + 20 practice-owner + 5 cowork briefs collapsed in), of which **8 are de-facto duplicates** between catalogues (TB-alignment, end-of-period dashboard, fee review, health check, lock-date, manual journals, contact maintenance, EOFY payroll). Net unique workflow count: **63**.

Classification breakdown:
- **existing-plugin**: 8 rows already shipped by `xbert-reconcile`, `xbert-capacity`, `xbert-pulse`, `xbert-workflow-review`.
- **cowork-shipping**: 5 plugins already chartered (xbert-practice-health-check, xbert-end-of-period-dashboard, xbert-bank-statement-upload, xbert-trial-balance-alignment, xbert-client-fee-review). Cover 8 distinct catalogue rows.
- **audit-shipping** (new recommended): **8 net-new plugins** beyond cowork, where Intelligence data + MCP tools are already in place. These consolidate ~24 catalogue rows.
- **capability-gap**: 11 rows where the workflow is real but a key MCP tool or agent capability is missing — these need a capability-gap Plan filed before (or in parallel with) the dependent plugin ships.
- **chat-only**: 6 rows where bare-agent chat is the right answer (no methodology to package).
- **merge-into**: 8 rows that collapse into adjacent plugin recommendations.

Three tensions surfaced and resolved below:
1. The plan's "4 separate AU compliance plugins" (BAS, super, payroll-close, STP-finalisation) is wrong — they share the same data spine and cadence. **Recommend one consolidated `xbert-au-compliance-calendar` plugin** with sub-flows for BAS/IAS/STP/SG/FBT, plus a separate `xbert-payroll-close` for the weekly cycle (different cadence, different audience).
2. The practice-owner "fee/profit cluster" (rows 4+10+13+16) is best served by **one plugin** (`xbert-client-fee-review`, which the cowork brief already covers) plus a **lightweight sibling** (`xbert-practice-profitability`) for service-line/standardisation work — collapsing all four into the cowork plugin would overload its scope.
3. The bookkeeper-side onboarding pain (rows #6 + #16) overlaps with `xbert-bank-statement-upload` but is genuinely broader (COA, opening balances, rules baseline). **Recommend `xbert-client-onboard` as a separate v1 plugin** rather than expanding the cowork bank-statement scope.

Final shortlist: **5 cowork + 8 audit-recommended + 4 existing = 17 plugins total, with 8 net-new from this audit and 13 net-new in total** (vs the plan's planned 10). Two of the 8 net-new audit plugins (`xbert-au-compliance-calendar` and `xbert-payroll-close`) replace four of the plan's pre-baked 5 audit candidates; the consolidation is intentional.

---

## Coverage matrix

Notation:
- `B#n` = bookkeeper row n, `A#n` = accountant row n, `PO#n` = practice-owner row n, `CW#n` = cowork brief n.
- `classification` = existing-plugin | cowork-shipping | audit-shipping | capability-gap | chat-only | merge-into

| # | workflow_name | primary_audience | catalogue_source | routing_intelligence_agent | mcp_tools_available | classification | recommendation_slug | rationale |
|---|---|---|---|---|---|---|---|---|
| 1 | Reconcile bank account daily | Bookkeeper | B#1 | XBertAgent | Strong (Validation_BankReconciliation, XBert_GetResolveData, XBert_ExecuteAutoResolve) | existing-plugin | xbert-reconcile | Already shipped. Listed for closure. |
| 2 | Capture and process expense receipts | Bookkeeper | B#2 | ReceiptCaptureAgent | Strong (SemanticExtraction_*, Fabric_CreateBill) | chat-only | — | Internal pipeline served by xbert-capture mobile app + plan-approved exclusion `xbert-receipt-capture`. No customer-facing plugin needed. |
| 3 | Enter and route bills for approval | Bookkeeper | B#3 | ReceiptCaptureAgent | Partial (no "set approver" MCP) | capability-gap | xbert-bill-intake (v1-narrow) | Approval routing is in-ledger today; XBert adds dedup + coding + approver-task creation. Gap: `Fabric_SetBillApprover` or equivalent missing — see gap plan `agent-bill-approver-routing-gap.md`. |
| 4 | Prepare weekly payment run | Bookkeeper | B#4 | DataAgent | Partial (no ABA-file MCP) | capability-gap | xbert-payment-run (v1-narrow) | Pay-run prep can ship as data brief + remittance draft; ABA-file generation needs `Utility_GenerateABA` or ledger pass-through — see gap plan `agent-aba-payment-file-gap.md`. |
| 5 | Maintain contact / supplier master data | Bookkeeper | B#5 | DataAgent | Strong for read/dedup, gap on bank-detail-change alerting | chat-only | — | Routine maintenance; chat + existing reconcile flow handle the heavy lifting. Bank-detail-change fraud check is better added as a `xbert-reconcile` enhancement than a standalone plugin. |
| 6 | Onboard historical bank statements for new client | Bookkeeper | B#6 + CW#4 | DataAgent / ReceiptCaptureAgent pattern | Partial (SemanticExtraction_* yes, accounting-system upload format spec no) | cowork-shipping | xbert-bank-statement-upload | Cowork brief #4. Already chartered. |
| 7 | Aged receivables chase / call list | Bookkeeper | B#7 | FeaturesAgent | Strong (Data_AgedReceivables, Workflow_SendReminder, Features_CreateClientTask, Features_CreateClientNote) | audit-shipping | xbert-aged-receivables | Highest-leverage missing plugin per bookkeeper agent. Add promise-tracking + escalation ladders + dispute logging on top of existing tools. |
| 8 | Process weekly/fortnightly payroll run | Bookkeeper | B#8 | DataAgent | Strong on validation, gap on posting | audit-shipping | xbert-payroll-close | Consolidates B#8+B#17+B#18 (weekly payroll cycle, STP P2 hygiene, post-run reconciliation). Pre-run sanity + post-run reconciliation is XBert's natural lane — pay-run posting stays in ledger. |
| 9 | Quarterly super payment + clearing house reconciliation | Bookkeeper / Accountant | B#9 + A#6 | DataAgent | Strong (Validation_SuperReconciliation) | merge-into | xbert-au-compliance-calendar | SG due dates align with BAS quarters; same calendar UX, same data spine. Sub-flow within compliance plugin, not standalone. |
| 10 | BAS / GST coding review and lodgement prep | Bookkeeper / Accountant | B#10 + A#1 + A#2 + A#5 | DataAgent | Strong (Validation_BASReconciliation, Validation_VATReconciliation) | merge-into | xbert-au-compliance-calendar | Same plugin as #9 — BAS/IAS/GST share data spine + cadence. |
| 11 | Inter-account / inter-entity transfer matching | Bookkeeper | B#11 | XBertAgent | Strong | merge-into | xbert-reconcile (extend) | Adjacent to bank rec — extend existing plugin rather than spinning a sibling. |
| 12 | Merchant settlement reconciliation (Stripe/Square/PayPal/Tyro) | Bookkeeper | B#12 | DataAgent | Partial (no Stripe/Square MCP, manual statement download today) | capability-gap | xbert-merchant-settlement (deferred) | Plugin viable once merchant-connector MCP lands — see gap plan `agent-merchant-connectors-gap.md`. Hold v1 ship. |
| 13 | Lock-date enforcement at month-end | Bookkeeper / Accountant | B#13 + A#19 | FeaturesAgent | Strong (Data_LockDates, Workflow_SetLockDate) | merge-into | xbert-au-compliance-calendar | Lock-date update is the post-lodgement act in the same compliance flow. Cross-client lock view is a natural plugin section. |
| 14 | Prepare and post manual journals | Bookkeeper / Accountant | B#14 + A#11 + A#15 | DataAgent | Partial (read/template strong, no journal-post MCP) | chat-only | — | Templated recurring journals already covered by xbert-workflow-review template audit. Posting is in-ledger. Standalone plugin would only re-wrap chat. |
| 15 | Bank feed troubleshooting and catch-up | Bookkeeper | B#15 | DataAgent | Partial (per-client read fine; no "feeds at risk across portfolio" surface) | capability-gap | xbert-feed-health (deferred) | Cross-client feed-health monitoring needs a new aggregation tool — see gap plan `agent-feed-health-portfolio-gap.md`. |
| 16 | New-client onboarding (COA, opening balances, historical data) | Bookkeeper | B#16 + PO#9 (gate) | PracticeAgent | Partial (read tools yes, COA-create + opening-balance-load tools no) | capability-gap | xbert-client-onboard (v1-narrow) | Distinct from `xbert-bank-statement-upload` — covers COA setup, opening balances, XBert rules baseline, onboarding-gate enforcement. v1 = orchestration + checklist; full automation depends on `agent-coa-and-opening-balance-gap.md`. |
| 17 | Employee leave + STP Phase 2 reporting hygiene | Bookkeeper | B#17 | DataAgent | Strong | merge-into | xbert-payroll-close | Subsumed into payroll-close plugin (see #8). |
| 18 | Pay run variance and post-run reconciliation | Bookkeeper | B#18 | DataAgent | Strong | merge-into | xbert-payroll-close | Subsumed into payroll-close plugin. |
| 19 | Annual payroll tax / workers comp / leave provision review | Bookkeeper / Accountant | B#19 + A#7 (overlap) | DataAgent | Partial (no state-threshold knowledge) | capability-gap | xbert-payroll-eofy (split from payroll-close) | Annual cadence + state-by-state thresholds differ from weekly payroll-close. Ships as part of `xbert-au-compliance-calendar`'s EOFY view OR as sibling plugin — recommend folding into compliance calendar to avoid plugin sprawl. See gap plan `agent-state-payroll-tax-thresholds-gap.md`. |
| 20 | Weekly client work-in-progress and exceptions triage | Bookkeeper | B#20 | ExceptionCheckAgent | Strong (Data_XBertNotificationSummary, Features_GetWork, XBert_GetResolveData) | chat-only | — | Plan-approved exclusion `xbert-exception-check`. Bookkeeper Monday-morning routine is the bare agent's natural use case. |
| 21 | Month-end financial pack preparation | Bookkeeper / Accountant | B#21 (overlap with A#10/A#9) | DataAgent | Strong (Validation_BalanceSheetReview, Utility_GeneratePDF/Word) | audit-shipping | xbert-month-end-pack | Bookkeeper's hand-up pack to partner. Distinct from accountant's FS pack (A#10) by audience and depth. Consolidates B#21 + sub-elements of A#9. |
| 22 | End-of-financial-year wash-up and STP finalisation | Bookkeeper / Accountant | B#22 + A#4 | DataAgent | Strong (Validation_PayrollReconciliation, Validation_SuperReconciliation) | merge-into | xbert-au-compliance-calendar | STP finalisation is the EOFY apex of the same calendar (14-Jul deadline). Sub-flow within compliance plugin. |
| 23 | IAS lodgement (PAYG-W / PAYG-I) | Accountant | A#2 | DataAgent | Strong | merge-into | xbert-au-compliance-calendar | See #10. |
| 24 | PAYG/GST instalment variation decision | Accountant | A#3 | DataAgent | Strong (Data_ProfitAndLoss, Data_Cashflow, Data_BudgetAdherence) | audit-shipping | xbert-instalment-variation | High-judgement annual workflow with GIC penalty exposure. Strong fit for AI-assisted recommendation + audit trail. Sits *adjacent* to compliance calendar (different cadence — triggered by ATO notice, not period end) so keep standalone. |
| 25 | STP finalisation (annual) | Accountant | A#4 | DataAgent | Strong | merge-into | xbert-au-compliance-calendar | See #22. |
| 26 | VAT/GST reconciliation | Accountant | A#5 | DataAgent | Strong | merge-into | xbert-au-compliance-calendar | See #10. |
| 27 | Super guarantee compliance check (SG/SGC risk) | Accountant | A#6 | DataAgent | Strong | merge-into | xbert-au-compliance-calendar | See #9. |
| 28 | Payroll year-end / EOFY pack | Accountant | A#7 | DataAgent | Strong | merge-into | xbert-au-compliance-calendar | EOFY view of the compliance calendar. |
| 29 | Trial balance alignment vs working papers | Accountant | A#8 + CW#5 | DataAgent | Partial (SemanticExtraction yes, fuzzy-match strategy undecided) | cowork-shipping | xbert-trial-balance-alignment | Cowork brief #5. Already chartered. |
| 30 | Balance sheet review and explanation | Accountant | A#9 | DataAgent | Strong (Validation_BalanceSheetReview already exists — needs workflow shell) | audit-shipping | xbert-balance-sheet-explain | Validation tool exists, narrative shell missing. Quarterly + annual cadence, distinct from FS pack. |
| 31 | Financial statement preparation pack | Accountant | A#10 | DataAgent | Strong | audit-shipping | xbert-fs-pack | SPFS-shaped pack; pairs with row 30 + cowork #5. Word output is the primary deliverable. |
| 32 | Manual journal entry and review | Accountant | A#11 | DataAgent | Partial (no post MCP) | merge-into | — | See #14 — chat-only. |
| 33 | End-of-period dashboard / close readiness | Accountant | A#12 + CW#3 | PracticeAgent | Strong (Features_GetWork, Data_DataQualityScore, Data_ReconciliationStatus) | cowork-shipping | xbert-end-of-period-dashboard | Cowork brief #3. Already chartered. |
| 34 | Tax return preparation (individual / company / trust) | Accountant | A#13 | DataAgent | Strong on accounting side; cannot lodge | audit-shipping | xbert-tax-reconciliation | High-leverage value: accounting-to-tax reconciliation worksheet. Lodgement stays out of scope — that's tax-agent platform territory. |
| 35 | Division 7A loan tracking | Accountant | A#14 + A#15 | DataAgent | Strong (data) — gap on ATO benchmark rate lookup | capability-gap | xbert-div7a-schedule | Annual AU-only schedule. Gap: ATO benchmark interest rate lookup not in MCP — see gap plan `agent-ato-rate-lookup-gap.md`. Ship v1 with manual rate entry. |
| 36 | Depreciation schedule maintenance | Accountant | A#16 | DataAgent | Strong | chat-only | — | Asset register lives in ledger; XBert role is template + reminder, covered by xbert-workflow-review templates. |
| 37 | Fixed asset register reconciliation vs GL | Accountant | A#17 | DataAgent | Strong (Validation_BalanceSheetReview) | merge-into | xbert-balance-sheet-explain | Same Validation tool, same audience — fold into BS-explain plugin. |
| 38 | Year-end provisions and accruals | Accountant | A#18 | DataAgent | Strong | merge-into | xbert-fs-pack | Year-end MJ schedule is the FS-pack entry point. |
| 39 | Annual statutory accounts (GPFS / audit-clients) | Accountant | A#20 | DataAgent | Strong | merge-into | xbert-fs-pack | Heavier disclosure variant of FS pack — same plugin, different output template. |
| 40 | R&D tax incentive substantiation | Accountant | A#21 | DataAgent | Partial (labour-allocation worksheets not in ledger natively) | capability-gap | xbert-rd-substantiation (deferred) | Niche but high-fee. Needs labour-allocation derivation — see gap plan `agent-labour-allocation-gap.md`. Defer v1 ship. |
| 41 | FBT preparation | Accountant | A#22 | DataAgent | Strong | merge-into | xbert-au-compliance-calendar | FBT cycle (Apr-Mar) is part of the compliance calendar — sub-flow with RFBA hand-off to STP. |
| 42 | Inter-entity / intercompany reconciliation (groups) | Accountant | A#23 | DataAgent | Strong (Data_GetClientConnections is the unlock) | audit-shipping | xbert-intercompany-recon | Multi-tenant unlock is unique; cleanly orthogonal to single-client reconciliation. |
| 43 | TPAR | Accountant | A#24 | DataAgent | Strong (Tax_CheckRegistration for ABN validation) | merge-into | xbert-au-compliance-calendar | Annual lodgement (28-Aug) sits naturally in the AU compliance calendar. |
| 44 | Practice-wide capacity planning | Practice owner | PO#1 | FeaturesAgent | Strong | existing-plugin | xbert-capacity | Already shipped. |
| 45 | Billable utilisation review per team member | Practice owner | PO#2 | FeaturesAgent | Strong | merge-into | xbert-capacity (extend) | Drills to individual rather than aggregate — extend existing plugin with 1:1-brief output. Don't spin a sibling. |
| 46 | WIP variance and write-off review | Practice owner | PO#3 | FeaturesAgent + DataAgent | Strong | merge-into | xbert-capacity (extend) | Same data, owner-level question. Extend existing plugin. |
| 47 | Annual client fee review | Practice owner | PO#4 + CW#6 | FeaturesAgent + DataAgent | Strong | cowork-shipping | xbert-client-fee-review | Cowork brief #6. Already chartered. |
| 48 | Client churn signal monitoring | Practice owner | PO#5 | FeaturesAgent + DataAgent | Strong | existing-plugin | xbert-pulse | Already shipped. |
| 49 | Practice health check — descriptive roll-up | Practice owner / manager / bookkeeper | PO#6 + CW#2 | DataAgent | Strong | cowork-shipping | xbert-practice-health-check | Cowork brief #2. Already chartered. |
| 50 | Practice health check — diagnostic & prescriptive | Practice owner / manager | PO#6a | PracticeAgent + FeaturesAgent + XBertAgent | Strong (Practice_GetConnectAccountReview, Features_BulkUpdateXBertConfigurations) | cowork-shipping | xbert-practice-health-check (v2 scope) | Cowork brief #2 *named* the diagnostic layer as the gap — fold into the same plugin's v2 scope rather than splitting. |
| 51 | Connect-portal hygiene & XBert config audit | Practice owner | PO#7 | PracticeAgent | Strong (Practice_GetConnectAccountReview, Features_BulkUpdateXBertConfigurations) | audit-shipping | xbert-config-audit | Distinct from workflow-review (template quality) — looks at *whether XBert itself is consistently configured* across the book. Strong PracticeAgent use case. |
| 52 | Workflow / template audit | Practice owner | PO#8 | FeaturesAgent | Strong | existing-plugin | xbert-workflow-review | Already shipped. |
| 53 | New client onboarding gate | Practice owner | PO#9 | FeaturesAgent | Strong | merge-into | xbert-client-onboard | The gate-enforcement view of the same plugin as #16. |
| 54 | Engagement letter renewal cycle | Practice owner | PO#10 | DataAgent + FeaturesAgent | Strong on cohort data; engagement-letter platform integration absent | chat-only | — | Engagement-letter platforms (Practice Ignition, Ignition, FYI) own this. XBert's role is timing trigger + fee-review hand-off — both already in xbert-client-fee-review. |
| 55 | Team workload rebalancing | Practice owner | PO#11 | FeaturesAgent | Strong | merge-into | xbert-capacity (extend) | Prescriptive variant of capacity — extend existing plugin with "move X from Sarah to James" output. |
| 56 | Outsourced / offshore work allocation review | Practice owner | PO#12 | FeaturesAgent | Strong on capacity, partial on task-type complexity tagging | merge-into | xbert-capacity (extend) | Same data, additional offshore-cost dimension. Extend existing plugin. |
| 57 | Per-client profitability analysis (cost-to-serve vs fee) | Practice owner | PO#13 | DataAgent + FeaturesAgent | Strong | merge-into | xbert-client-fee-review | Cost-to-serve is the evidence base for fee review — cowork plugin already cites this data. Fold in. |
| 58 | Practice metrics dashboard (revenue, lockup, write-offs, NPS) | Practice owner | PO#14 | DataAgent | Strong | audit-shipping | xbert-practice-metrics | Monthly partner-meeting one-pager. Distinct from health check (data-quality view) and capacity (utilisation view) — owner's strategic KPI roll-up. Includes commentary on movers. |
| 59 | Client risk segmentation | Practice owner | PO#15 | DataAgent | Strong | merge-into | xbert-practice-metrics | Annual RAG segmentation feeds into the same dashboard. |
| 60 | Pricing model standardisation across the book | Practice owner | PO#16 | DataAgent | Strong | merge-into | xbert-client-fee-review | Programme-level view of the fee-review plugin — fold in rather than splitting (cowork brief covers per-client; standardisation is the same data rolled up). |
| 61 | Lead-to-client funnel review | Practice owner | PO#17 | (unrouted — CRM external) | Weak (no CRM MCP) | capability-gap | xbert-lead-funnel (deferred) | Plan-deferred. ANZ firms run BD in HubSpot/Pipedrive — needs CRM connector. See gap plan `agent-crm-connector-gap.md`. |
| 62 | Staff training / capability gap review | Practice owner | PO#18 | FeaturesAgent | Strong | merge-into | xbert-capacity (extend) | Skills matrix is a capacity-plugin extension, not a sibling. |
| 63 | Service line profitability (bookkeeping vs tax vs advisory) | Practice owner | PO#19 | DataAgent | Strong | merge-into | xbert-practice-metrics | Service-line P&L is the strategic view of the same dashboard. |
| 64 | Cross-sell opportunity identification | Practice owner | PO#20 | DataAgent | Strong (Data_FindSimilarClientTenants is the engine) | audit-shipping | xbert-cross-sell-opportunities | Distinct workflow with `Data_FindSimilarClientTenants` as differentiator. Quarterly cadence; pairs with fee-review but different output. |

Row count: **64** consolidated rows. (Bookkeeper 22 + Accountant 24 + Practice-owner 20 = 66 input rows; 2 deduplicated by collapsing A#14/A#15 into row 35 and A#7 partial-merging into row 19.)

---

## Plugin shortlist (final)

### 1. Cowork-shipping (5 plugins — already chartered)

| slug | audience | routes-to agent | MCP tools | capability-gap notes | workflows consolidated (matrix #) |
|---|---|---|---|---|---|
| xbert-practice-health-check | Bookkeeper / Manager / Owner | PracticeAgent (primary), DataAgent | Data_DataQualityScore, Data_XBertNotificationSummary, Data_GetAllAccessibleClients, Practice_GetConnectAccountReview, Utility_GenerateWord | Trend storage granularity unconfirmed; non-Xero coverage variance needs "check not supported" handling; v2 includes diagnostic+prescriptive layer | 49, 50 |
| xbert-end-of-period-dashboard | Bookkeeper / Manager / Owner | PracticeAgent (primary), FeaturesAgent, DataAgent | Data_GetAllAccessibleClients, Data_DataQualityScore, Validation_BAS/VAT/Payroll, Data_LockDates, Data_ReconciliationStatus, Utility_GenerateWord | Compliance obligation data per client per period may need derivation; external regulator due-date calendar absent; v1 AU-only | 33 |
| xbert-bank-statement-upload | Bookkeeper | DataAgent + SemanticExtraction-heavy | Data_BankAccounts, Data_BankStatements, SemanticExtraction_*, Utility_GenerateExcel | PDF extraction confidence + human-in-the-loop "preview and confirm" not first-class today; per-accounting-system upload format spec absent from MCP | 6 |
| xbert-trial-balance-alignment | Bookkeeper (primary), Accountant (secondary) | DataAgent + UtilityAgent + SemanticExtraction | Data_TrialBalance, Data_BalanceSheet, Data_FinancialStatements, Data_JournalMaster_*, SemanticExtraction_*, Utility_GenerateExcel/Word | PDF extraction confidence (shared with #6); account-name fuzzy-match strategy undecided; v1 = Xero only | 29 |
| xbert-client-fee-review | Owner (primary), Manager, Senior Bookkeeper | FeaturesAgent (primary), DataAgent, PracticeAgent | Features_GetActualTimeList, Features_Review, Data_XPMTimesheets_*, Data_XPMClients, Data_BankTransactions_*, Data_Bills/Invoices/PayRuns/Payslips/ManualJournals, Data_GetAllAccessibleClients, Utility_GenerateWord/Excel | Per-client per-service-category time aggregation may need new derivation; XPM scope-statement access depth unconfirmed; cost-base ingestion optional; multi-basis support undecided; commercial relationship with Cass's Strategic Pricing Tool unresolved | 47, 57, 60 |

### 2. Audit-shipping (8 net-new plugins recommended from this audit)

| slug | audience | routes-to agent | MCP tools | capability-gap notes | workflows consolidated (matrix #) |
|---|---|---|---|---|---|
| xbert-au-compliance-calendar | Bookkeeper + BAS Agent + Accountant | DataAgent (primary), FeaturesAgent | Validation_BASReconciliation, Validation_VATReconciliation, Validation_PayrollReconciliation, Validation_SuperReconciliation, Data_TaxRates, Data_PayRuns_*, Data_Payslips_*, Tax_CheckRegistration, Data_LockDates, Workflow_SetLockDate, Utility_GeneratePDF | State payroll-tax thresholds absent; ATO lodgement-date calendar source absent (shared with cowork #3) — see `agent-state-payroll-tax-thresholds-gap.md` + `agent-ato-calendar-source-gap.md` | 9, 10, 13, 19 (partial), 22, 23, 25, 26, 27, 28, 41, 43 |
| xbert-payroll-close | Bookkeeper | DataAgent | Data_PayRuns_*, Data_Payslips_*, Data_Employees_*, Data_LeaveApplications_*, Data_XPMTimesheets_*, Data_PayrollSettings, Validation_PayrollReconciliation, Validation_BankReconciliation | Pay-run posting MCP absent (in-ledger action) — XBert role = pre-run sanity + post-run reconciliation only | 8, 17, 18 |
| xbert-aged-receivables | Bookkeeper | FeaturesAgent | Data_AgedReceivables, Data_AgedSummary, Data_Contacts_*, Data_Invoices_*, Workflow_SendReminder, Features_CreateClientTask, Features_CreateClientNote, Memory_GetClientContext | None — strongest "everything we need is here" plugin in the audit | 7 |
| xbert-balance-sheet-explain | Accountant | DataAgent | Data_BalanceSheet, Data_TrialBalance, Data_AgedReceivables, Data_AgedPayables, Validation_BalanceSheetReview, Validation_BankReconciliation, Data_ReconciliationStatus | None | 30, 37 |
| xbert-fs-pack | Accountant | DataAgent | Data_FinancialStatements, Data_BalanceSheet, Data_ProfitAndLoss, Data_Cashflow, Data_TrialBalance, Utility_GenerateWord, Utility_GeneratePDF | None — heavy doc-gen workflow, mostly composition | 31, 38, 39 |
| xbert-month-end-pack | Bookkeeper | DataAgent | Data_ProfitAndLoss, Data_BalanceSheet, Data_Cashflow, Data_BudgetAdherence, Validation_BalanceSheetReview, Utility_GeneratePDF, Utility_GenerateWord | None | 21 |
| xbert-config-audit | Practice owner / Manager | PracticeAgent | Practice_GetConnectAccountReview, Features_BulkUpdateXBertConfigurations, Features_ManageXBertConfigurationTenantAssignment, XBert_GetFlowList, Data_GetClientConnections | None — PracticeAgent's natural use case | 51 |
| xbert-practice-metrics | Practice owner | DataAgent | Data_XPMTimesheets_*, Data_XPMClients, Features_GetActualTimeList, Data_GetAllAccessibleClients, Utility_GenerateExcel, Utility_GenerateWord | None — composition workflow | 58, 59, 63 |

### 3. Existing-plugin (4 already shipped — listed for closure)

| slug | extends-from-audit | workflows consolidated (matrix #) |
|---|---|---|
| xbert-reconcile | Extend to cover inter-entity transfers | 1, 11 |
| xbert-capacity | Extend with: per-user 1:1 brief, prescriptive moves, offshore allocation, skills matrix | 44, 45, 46, 55, 56, 62 |
| xbert-pulse | None — covers churn signal as-is | 48 |
| xbert-workflow-review | None — covers template audit as-is | 52 |

### 4. Capability-gap-deferred (5 plugins, ship after gap plan lands)

| slug | audience | routes-to agent | gap plan dependency | should v1 ship with narrow scope? | workflows |
|---|---|---|---|---|---|
| xbert-bill-intake | Bookkeeper | ReceiptCaptureAgent | agent-bill-approver-routing-gap.md | Yes — v1 = dedup + coding + task creation; approver routing waits | 3 |
| xbert-payment-run | Bookkeeper | DataAgent | agent-aba-payment-file-gap.md | Yes — v1 = pay schedule brief + remittance drafts; ABA generation waits | 4 |
| xbert-merchant-settlement | Bookkeeper | DataAgent | agent-merchant-connectors-gap.md | No — hold ship until connectors land | 12 |
| xbert-feed-health | Bookkeeper / Manager | DataAgent | agent-feed-health-portfolio-gap.md | No — hold ship until cross-client aggregation lands | 15 |
| xbert-client-onboard | Bookkeeper / Owner | PracticeAgent | agent-coa-and-opening-balance-gap.md | Yes — v1 = orchestration + checklist + onboarding gate; auto-creation waits | 16, 53 |
| xbert-div7a-schedule | Accountant | DataAgent | agent-ato-rate-lookup-gap.md | Yes — v1 = schedule with manual benchmark-rate entry | 35 |
| xbert-rd-substantiation | Accountant | DataAgent | agent-labour-allocation-gap.md | No — niche, defer | 40 |
| xbert-lead-funnel | Practice owner | (CRM-external) | agent-crm-connector-gap.md | No — defer until CRM connector exists | 61 |

### 5. Audit-shipping (additional, no gap)

| slug | audience | routes-to agent | MCP tools | workflows |
|---|---|---|---|---|
| xbert-instalment-variation | Accountant | DataAgent | Data_ProfitAndLoss, Data_BalanceSheet, Data_Cashflow, Data_BudgetAdherence, Data_TaxRates, Utility_GeneratePDF | 24 |
| xbert-tax-reconciliation | Accountant | DataAgent | Data_FinancialStatements, Data_TrialBalance, Data_ProfitAndLoss, Data_BalanceSheet, Data_JournalMaster_*, Utility_GeneratePDF | 34 |
| xbert-intercompany-recon | Accountant | DataAgent | Data_BalanceSheet, Data_TrialBalance, Data_Contacts_*, Data_JournalMaster_*, Data_GetAllAccessibleClients, Data_GetClientConnections, Utility_GenerateExcel | 42 |
| xbert-cross-sell-opportunities | Practice owner | DataAgent | Data_GetAllAccessibleClients, Data_FindSimilarClientTenants, Data_XPMClients, Data_XBertNotificationSummary, Utility_GenerateWord | 64 |

**Final shortlist counts:**
- 5 cowork-shipping (already chartered)
- 8 audit-shipping with no gap: `xbert-au-compliance-calendar`, `xbert-payroll-close`, `xbert-aged-receivables`, `xbert-balance-sheet-explain`, `xbert-fs-pack`, `xbert-month-end-pack`, `xbert-config-audit`, `xbert-practice-metrics` + 4 above (`xbert-instalment-variation`, `xbert-tax-reconciliation`, `xbert-intercompany-recon`, `xbert-cross-sell-opportunities`) = **12 audit-shipping**
- 4 existing-plugin (3 of which warrant extensions)
- 5 capability-gap-ship-narrow (`xbert-bill-intake`, `xbert-payment-run`, `xbert-client-onboard`, `xbert-div7a-schedule`, plus one of `xbert-merchant-settlement`/`xbert-feed-health` if MCP work prioritised)
- 3 capability-gap-deferred (`xbert-merchant-settlement`, `xbert-feed-health`, `xbert-rd-substantiation`, `xbert-lead-funnel` — call it 3-4 depending on cut)

**Net-new plugins beyond what's shipped: 17 (12 audit + 5 cowork)** — higher than the plan's 10 because consolidation didn't go as deep as the plan assumed *and* the practice-owner/accountant catalogues surfaced 5 strong candidates (intercompany, balance-sheet-explain, instalment-variation, tax-reconciliation, config-audit) that the plan's pre-baked list missed.

---

## Merge / consolidation decisions

### Decision 1 — Practice-owner fee/profit cluster (rows 47 + 54 + 57 + 60 + 63)
**Plan called for:** four separate plugins (fee review, profitability, standardisation, service-line P&L).
**Decision: TWO plugins, not four.**
- `xbert-client-fee-review` (cowork brief #6) absorbs rows 47 (cowork), 57 (cost-to-serve evidence), 60 (standardisation as the programme view of fee review).
- `xbert-practice-metrics` absorbs rows 58 (metrics dashboard), 59 (risk segmentation), 63 (service-line P&L).
- Engagement-letter renewal (54) is chat-only — letter platforms own it.

**Why two and not one:** Owner-level metrics dashboard (monthly partner meeting) and per-client fee evidence (annual review) have different cadences, different audiences within the owner's team, and different document shapes. Forcing them together overloads the cowork plugin's already-broad scope and makes the monthly metrics view harder to find.

### Decision 2 — AU Compliance cluster (rows 9 + 10 + 13 + 19-partial + 22-26-27-28-41-43)
**Plan called for:** four separate plugins (BAS prep, super check, payroll close, balance-sheet explain).
**Decision: ONE compliance plugin + ONE separate payroll plugin.**
- `xbert-au-compliance-calendar` consolidates ALL period-end compliance: BAS, IAS, GST, super, FBT, STP finalisation, TPAR, lock-date enforcement, EOFY payroll tax. All share the cycle UX, the data spine, and the deadline calendar.
- `xbert-payroll-close` stays separate. Different cadence (weekly/fortnightly), different audience (bookkeeper, not BAS agent), different outputs (variance report vs lodgement worksheet). Conflating them would force the bookkeeper's Tuesday-pay-cycle workflow into a quarterly-compliance shell.

**Why this is right per Phase 1 evidence:** Accountant agent explicitly proposed this consolidation in their A#52 note. Bookkeeper agent put payroll cycle in a separate cluster from BAS. Two clusters, two plugins.

### Decision 3 — Year-End Working Paper cluster (rows 29 + 30 + 31 + 37 + 38 + 39)
**Plan called for:** `xbert-balance-sheet-explain` as one of the audit plugins.
**Decision: THREE plugins covering the year-end stack.**
- `xbert-trial-balance-alignment` (cowork #5) — the alignment step.
- `xbert-balance-sheet-explain` — quarterly + annual BS walk, FAR rec folded in.
- `xbert-fs-pack` — Word-output document pack, year-end provisions + GPFS variant folded in.

**Why three:** Distinct deliverables (Excel workbook vs narrative review vs board-ready Word doc) and distinct frequencies (event-driven vs quarterly vs annual). Sequencing matters too: TB-alignment is upstream of BS-explain, which is upstream of FS-pack. Three plugins lets each one ship at its own cadence; one giant year-end plugin would be a Christmas-tree of scope.

### Decision 4 — Bookkeeper payroll cluster (rows 8 + 17 + 18 + 19)
**Plan called for:** four separate plugins (`xbert-payroll-close`, `xbert-super-check`, `xbert-stp-finalisation`, possibly `xbert-leave-hygiene`).
**Decision: ONE bookkeeper-side plugin (xbert-payroll-close) + super/STP-final/payroll-tax inside `xbert-au-compliance-calendar`.**
- Payroll-close absorbs the weekly cycle: pay-run prep, STP P2 hygiene per pay, post-run variance reconciliation. Bookkeeper-owned, weekly cadence.
- Compliance calendar absorbs the quarterly/annual statutory pieces: SG payment, payroll-tax, STP finalisation, EOFY. BAS-agent/accountant-owned, quarterly/annual cadence.

**Why this split:** Different humans, different cadences, different stakes. The bookkeeper running Tuesday's pay doesn't want quarterly SG due dates in their face; the BAS agent finalising STP doesn't care about Tuesday's variance.

### Decision 5 — Onboarding cluster (rows 6 + 16)
**Plan called for:** `xbert-bank-statement-upload` (cowork) and implicit "onboarding is covered by that".
**Decision: TWO plugins. Keep cowork bank-statement-upload narrow; spin sibling `xbert-client-onboard` for COA + opening balances + rules + gate.**
- Bookkeeper agent flagged onboarding as a 2-4-week multi-step project — broader than statement transformation.
- Bank statement upload alone is the right cowork scope (focused, shippable, validation-friendly).
- `xbert-client-onboard` v1 = orchestration + checklist + practice-owner gate enforcement. Wraps and triggers `xbert-bank-statement-upload`. COA-create / opening-balance-load automation depends on the gap plan.

### Decision 6 — Practice-owner capacity cluster (rows 44 + 45 + 46 + 55 + 56 + 62)
**Decision: extend `xbert-capacity`, don't spin siblings.**
Six rows all reach for `Features_GetUserCapacityAllocation` + timesheet data. Extending the existing plugin with: per-user 1:1 brief output (45), prescriptive move recommendations (55), offshore allocation lens (56), skills matrix overlay (62), WIP variance drill-down (46). Avoid plugin sprawl.

### Decision 7 — Health-check diagnostic split (rows 49 + 50)
**Decision: ONE plugin, v1 + v2 phases.**
Cowork brief #2 explicitly says the diagnostic+prescriptive layer is the *missing* part, but it's the same data pulled differently. Ship as `xbert-practice-health-check` v1 (descriptive roll-up) + v2 (diagnostic narrative + prescribed actions). Practice-owner agent's split into 6/6a is a *PRD* split, not a plugin split.

---

## Chat-only call-outs

| # | workflow | why chat-only |
|---|---|---|
| 2 | Capture and process expense receipts | Served by xbert-capture mobile + receipt-capture pipeline; plan-approved exclusion `xbert-receipt-capture`. |
| 5 | Maintain contact/supplier master data | Routine. Bank-detail-change fraud guard is a `xbert-reconcile` extension, not a plugin. |
| 14 / 32 | Manual journals (prepare + post + review) | Templated recurring JEs already covered by `xbert-workflow-review`; posting is in-ledger; standalone plugin would only wrap chat. |
| 20 | Weekly WIP / exceptions triage | Plan-approved exclusion `xbert-exception-check` — bare ExceptionCheckAgent is the natural fit. |
| 36 | Depreciation schedule maintenance | Asset register is in-ledger; XBert role is template+reminder already covered by `xbert-workflow-review`. |
| 54 | Engagement letter renewal cycle | Engagement-letter platforms (Practice Ignition, FYI Docs) own this. Fee-review hand-off lives in `xbert-client-fee-review`. |

---

## Capability gaps requiring plans

Each gap plan should live at `xbert-app-processing/Plans/<slug>.md` and follow the in-repo plan convention.

### 1. `agent-bill-approver-routing-gap.md`
**What's missing:** No MCP tool to set an approver on a bill after creation. Approval routing currently lives in Xero/MYOB/QBO workflow rules.
**What to build:** `Fabric_SetBillApprover(billId, approverUserId)` or pass-through to ledger workflow rules; plus `Features_GetApprovalPolicy(clientTenantId)` to look up the right approver per bill type/value threshold.
**Dependent plugin:** `xbert-bill-intake`.
**Ship recommendation:** Plugin can ship v1-narrow (dedup + coding + task creation) without this; approver routing is the v2 add.

### 2. `agent-aba-payment-file-gap.md`
**What's missing:** No MCP tool to generate an ABA (AU) or PEFT bank-payment file.
**What to build:** `Utility_GenerateABAFile(clientTenantId, billIds[])` returning a downloadable file URL.
**Dependent plugin:** `xbert-payment-run`.
**Ship recommendation:** v1-narrow plugin (payment brief + remittance drafts) ships now; ABA generation is the v2 unlock.

### 3. `agent-merchant-connectors-gap.md`
**What's missing:** No MCP tool pulls Stripe / Square / PayPal / Tyro settlement data. Bookkeepers manually download statements today.
**What to build:** Connector MCP tools for the top 4 merchant providers, surfacing `Data_MerchantSettlements(provider, clientTenantId, dateRange)`.
**Dependent plugin:** `xbert-merchant-settlement`.
**Ship recommendation:** Hold plugin ship until connectors land — without them v1 is just a manual-upload wizard.

### 4. `agent-feed-health-portfolio-gap.md`
**What's missing:** No cross-client "feeds at risk" aggregation. Per-client read tools exist but no portfolio view.
**What to build:** `Data_FeedHealthAcrossPortfolio(connectTenantId)` returning per-client feed status with last successful import date + failure reason.
**Dependent plugin:** `xbert-feed-health`.
**Ship recommendation:** Hold plugin ship.

### 5. `agent-coa-and-opening-balance-gap.md`
**What's missing:** No MCP tools to create a chart of accounts or load opening balances into a new client tenant. Bookkeepers do this manually in-ledger today.
**What to build:** `Fabric_CreateChartOfAccounts(clientTenantId, templateId)` + `Fabric_LoadOpeningBalances(clientTenantId, balances[])`.
**Dependent plugin:** `xbert-client-onboard`.
**Ship recommendation:** Plugin ships v1-narrow as orchestration + checklist; v2 unlocks full automation.

### 6. `agent-state-payroll-tax-thresholds-gap.md`
**What's missing:** No state-by-state payroll tax threshold knowledge. NSW/VIC/QLD/SA/WA/TAS/NT/ACT all differ.
**What to build:** `Tax_GetPayrollTaxThreshold(stateCode, financialYear)` returning threshold + rate + lodgement frequency. Static reference data, low ongoing maintenance.
**Dependent plugin:** `xbert-au-compliance-calendar`.
**Ship recommendation:** Calendar plugin v1 ships covering BAS/IAS/STP/SG/FBT/TPAR; payroll-tax sub-flow waits for threshold data.

### 7. `agent-ato-calendar-source-gap.md`
**What's missing:** No authoritative ATO lodgement-date calendar in MCP inventory. Cowork #3 flagged this; AU compliance calendar plugin needs it too.
**What to build:** `Tax_GetLodgementDueDate(lodgementType, period, clientTenantId)` with concession overrides (registered tax agent program) per client.
**Dependent plugins:** `xbert-end-of-period-dashboard`, `xbert-au-compliance-calendar`.
**Ship recommendation:** Cowork plugin ships v1 with conservative hard-coded dates; calendar plugin waits for dynamic source.

### 8. `agent-ato-rate-lookup-gap.md`
**What's missing:** ATO benchmark interest rate for Div 7A not available via MCP.
**What to build:** `Tax_GetATOBenchmarkRate(rateType, financialYear)` covering Div 7A benchmark + GIC + SIC rates.
**Dependent plugins:** `xbert-div7a-schedule`, `xbert-instalment-variation` (GIC exposure note).
**Ship recommendation:** Both plugins ship v1 with manual rate entry; rate lookup is the v2 polish.

### 9. `agent-labour-allocation-gap.md` (optional, low priority)
**What's missing:** R&D labour-allocation worksheets — accountant manually maps payroll cost to R&D activities.
**What to build:** Derivation layer over `Data_Payslips_*` + `Data_Employees_*` + a new `Data_RDActivityAllocation` capture surface.
**Dependent plugin:** `xbert-rd-substantiation`.
**Ship recommendation:** Defer — niche workflow, only ship plugin once gap closed.

### 10. `agent-crm-connector-gap.md`
**What's missing:** No HubSpot / Pipedrive / Salesforce connector. ANZ practices run BD outside XBert.
**What to build:** CRM connector MCP suite — likely the largest of the gap plans. Bidirectional sync for contacts + deals + activities.
**Dependent plugin:** `xbert-lead-funnel`.
**Ship recommendation:** Defer plugin. Build vs buy decision needed (Cass Scott input flagged this in cowork #6 prep — pricing tool needs similar integration).

---

## Specialist agents with zero plugins (after audit)

Plugin counts after this audit:

| Specialist | Plugins routed | Notes |
|---|---|---|
| DataAgent | 13 (xbert-au-compliance-calendar, xbert-payroll-close, xbert-balance-sheet-explain, xbert-fs-pack, xbert-month-end-pack, xbert-instalment-variation, xbert-tax-reconciliation, xbert-intercompany-recon, xbert-practice-metrics, xbert-cross-sell-opportunities, xbert-div7a-schedule, xbert-payment-run, xbert-feed-health) | Heavy concentration — expected, accountants/bookkeepers are data-readers. |
| FeaturesAgent | 5 (xbert-aged-receivables, xbert-capacity, xbert-workflow-review + co-routes via xbert-end-of-period-dashboard and xbert-client-fee-review) | Healthy. |
| PracticeAgent | 4 (xbert-practice-health-check, xbert-end-of-period-dashboard, xbert-config-audit, xbert-client-onboard) | Healthy — cowork brief #2/#3 + audit plugins drive utilisation. |
| XBertAgent | 2 (xbert-reconcile + co-route via xbert-config-audit) | Acceptable — exception-resolution is XBert agent's home. |
| ReceiptCaptureAgent | 1 (xbert-bill-intake, when it ships) | Plus the existing internal pipeline. |
| UtilityAgent | 0 routed plugins | **Chat-only.** Word/Excel/PDF generation is invoked *from* every plugin but not a customer-facing plugin entry point. Closure: no plugin needed. |
| SlackAgent | 0 routed plugins | **Chat-only.** Plan-approved exclusion `xbert-team-notify`. Slack messaging is an action within other plugins, not its own surface. |
| MemoryAgent | 0 routed plugins | **Chat-only.** Plan-approved exclusion `xbert-memory-coach`. Memory ops are invoked from other plugins (e.g. xbert-aged-receivables calls `Memory_GetClientContext`). |
| ExceptionCheckAgent | 0 routed plugins | **Chat-only.** Plan-approved exclusion `xbert-exception-check`. Bookkeeper Monday-morning triage is the bare agent's natural use case (B#20). |

**Verdict:** All 9 specialists either have plugins or have a clean chat-only rationale. UtilityAgent zero-count is structural (it's a generator, not an entry point) — flagged in case Phase 3 wants to revisit.

---

## Risks and open questions for Aaron

1. **`xbert-au-compliance-calendar` as one plugin or four?** This audit collapses BAS/IAS/STP-final/SG/FBT/TPAR into one plugin because they share the cadence/data/UX spine. The plan's pre-baked list had them as four separate plugins (`xbert-bas-prep`, `xbert-super-check`, `xbert-stp-finalisation`, ...). **Confirm the collapse before Phase 3 designers start** — splitting back into four after design starts would be expensive. Recommendation: **collapse to one** with sub-flow navigation, ship sub-flows progressively.

2. **`xbert-client-fee-review` scope — does it absorb pricing standardisation (PO#16) and cost-to-serve evidence (PO#13)?** This audit folds both in. The cowork brief is already broad; adding standardisation makes it broader. Alternative: ship cowork plugin narrow (per-client annual review only), spin `xbert-practice-pricing-strategy` for the programme-level standardisation work in Phase 3. **Confirm whether to keep the merge or split the strategy work into its own plugin.**

3. **`xbert-client-onboard` vs deferred onboarding entirely.** Bookkeeper agent flagged onboarding as the biggest underserved area. This audit recommends shipping v1-narrow (orchestration + checklist + gate) even before COA/opening-balance MCP work lands. Alternative: hold onboarding plugin entirely until gap plan #5 ships. **Confirm whether v1-narrow onboarding is worth shipping or wait for full capability.**

4. **Commercial relationship with Cass Scott's Strategic Pricing Tool** (already flagged in cowork brief #6) — unresolved. If Cass's tool is XBert's downstream consumer, then `xbert-client-fee-review` is positioned as "evidence engine"; if it's a competitor or independent, the plugin's scope grows. **Need a yes/no on the commercial relationship before Phase 3.**

5. **Plan-approved exclusion `xbert-custom-xbert-build` — reaffirm or revisit?** Phase 1 didn't surface a "build Custom XBert" workflow directly, which validates the exclusion. But the practice-owner config-audit plugin (xbert-config-audit) lives adjacent to Custom XBert assignment. **Confirm exclusion still holds, or flag if `xbert-config-audit` should grow into "configure + assign + build" territory.**

---

**Net-new plugin count for Phase 3 designers: 12 audit-shipping + 5 cowork-shipping = 17 plugins to design**, of which 5 are gap-dependent and either ship v1-narrow or defer based on Aaron's resolution of the questions above.
