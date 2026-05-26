# XBert current agent + plugin coverage (2026-05-26)

State: 38 system agents + 28 plugins (after v3 removals — `cross-sell-opportunities` agent removed; `xbert-bill-intake`, `xbert-reconcile`, `xbert-cross-sell-opportunities` plugins removed).

Surface column legend: A = system agent (DB-backed, in-app XI command); P = plugin (Claude Code plugin, MCP-backed). Where both exist for the same `/command`, both rows are shown.

## By audience

### Bookkeepers
| /command | Surface | One-line job | Tier (v3) |
|---|---|---|---|
| `/my-work` | A | Personal daily summary of overdue, due-today, due-this-week + completed work | KEEP |
| `/scheduled-work` | A | Practice-wide or per-client scheduled work review + setup-issue scan | KEEP |
| `/xbert-checks` | A | Outstanding XBert automation checks ranked by risk + process category | KEEP |
| `/reconcile` | A | Bank rec status, stale items, duplicates, proposed matches (per-account) | review |
| `/aged-receivables` | A | Prioritised debtor call-list scored by $ x days x promise-reliability | KEEP |
| `/aged-receivables` | P | Same with task creation + drafted reminders per debtor | review |
| `/payment-run` | A | Weekly pay-run: include due-soon/overdue, exclude held/disputed, draft remittances | KEEP |
| `/payment-run` | P | Plugin wrapper — same logic, MCP-backed | KEEP |
| `/payroll-close` | A | Weekly pay-run close: pre-run validation + post-run GL reconciliation + jurisdiction exceptions | KEEP |
| `/payroll-close` | P | Same — plugin wrapper | KEEP |
| `/bas-ready` | A | AU BAS pre-lodgement readiness check + audit-evidence note | KEEP |
| `/bas-prep` | P | AU BAS readiness + Word audit doc with QMS certification | review |
| `/ias-ready` | A | AU IAS (no-GST PAYG) pre-lodgement readiness check | KEEP |
| `/ias-prep` | P | Same — plugin wrapper with Word audit doc | review |
| `/ird-gst-ready` | A | NZ GST101A pre-lodgement readiness check | KEEP |
| `/gst-prep-nz` | P | Same — plugin wrapper with Word audit doc | review |
| `/vat-ready` | A | UK VAT pre-submission readiness + MTD compliance check | KEEP |
| `/vat-prep` | P | Same — plugin wrapper with Word audit doc | KEEP |
| `/mtd-ready` | A | UK MTD-ITSA readiness (HMRC SA103/SA105 category mapping) | WORK |
| `/mtd-prep` | P | Same — plugin wrapper | review |
| `/stp-finalisation` | P | AU STP Phase 2 year-end finalisation: YTD verify, RFB, terminations | KEEP |
| `/super-check` | P | AU SG compliance: 12% rate, OTE base, quarterly due dates, SGC exposure | KEEP |
| `/tpar` | P | AU Taxable Payments Annual Report: contractor extraction + ABN validation | KEEP |
| `/trial-balance-alignment` | A | Match TB to accountant's signed-off FS, propose alignment journals | KEEP |
| `/trial-balance-alignment` | P | Same — plugin wrapper | KEEP |
| `/month-end-pack` | P | Fixed-format monthly pack: P&L vs budget, BS movement, cashflow, KPIs | KEEP |
| `/client-onboard` | A | Walk new client through engagement -> connection -> configuration -> go-live | review |
| `/client-onboard` | P | Same — plugin wrapper with rule baseline application | review |

### Accountants
| /command | Surface | One-line job | Tier (v3) |
|---|---|---|---|
| `/financial-review` | A | BS/P&L/bank-tx review with risk classification + advisory talking points | KEEP |
| `/depreciation-review` | A | Asset register review + jurisdiction-specific depreciation/capital-allowance compliance | KEEP |
| `/div7a-review` | A | AU Division 7A shareholder/director loan compliance scan | KEEP |
| `/div7a-schedule` | P | AU Div 7A loan ledger + minimum repayment schedule + benchmark-rate compute | KEEP |
| `/loan-review` | A | Loan/HP/lease facility review: classification, interest reasonableness, IFRS 16 | KEEP |
| `/directors-loan-review` | A | Director/shareholder loan review across Div 7A (AU), S455 (UK), IRD (NZ) | KEEP |
| `/fbt-review` | A | AU/NZ FBT exposure scan (vehicles, entertainment, employee benefits) | KEEP |
| `/fbt-prep` | P | AU FBT return prep: gross-up, statutory formula vs logbook, minor-benefit exemption | KEEP |
| `/withholding-review` | A | Payroll/contractor withholding review across PAYG/PAYE/NIC + TPAR/CIS reporting | review |
| `/trust-review` | A | Trust distribution compliance (AU resolution by 30 Jun; NZ disclosure; UPE/S100A) | KEEP |
| `/consolidation-review` | A | Multi-entity intercompany matching + elimination + group-tax review | KEEP |
| `/payroll-reporting-review` | A | STP Phase 2 (AU) / Payday Filing (NZ) / RTI (UK) payroll-to-GL reconciliation | KEEP |
| `/tax-reconciliation` | A | Schedule-M walk: accounting profit -> taxable income with journal evidence | KEEP |
| `/tax-reconciliation` | P | Same — plugin wrapper | KEEP |
| `/fs-pack` | A | Year-end SPFS/GPFS pack: comparative BS/P&L, derived cashflow, notes shell | KEEP |
| `/fs-pack` | P | Same — plugin wrapper | KEEP |
| `/balance-sheet-explain` | A | Line-by-line BS walk: opening/movement/closing with journal-sourced explanations | KEEP |
| `/balance-sheet-explain` | P | Same — plugin wrapper with FAR-to-GL reconciliation + Word narrative | review |
| `/instalment-variation` | A | PAYG-I / GST instalment vary-up/down recommendation with GIC exposure calc | review |
| `/instalment-variation` | P | Same — plugin wrapper | review |
| `/end-of-period-dashboard` | A | Per-client month/quarter/year-end readiness with named blockers | KEEP |
| `/end-of-period-dashboard` | P | Same — plugin wrapper | review |

### Principals / practice owners
| /command | Surface | One-line job | Tier (v3) |
|---|---|---|---|
| `/health-check` | A | Client health check + practice Connect-portal setup review | KEEP |
| `/practice-review` | A | Practice Connect-portal config audit: users/clients/roles/templates/capacity/XPM | KEEP |
| `/practice-health-check` | P | Portfolio-wide DQ + notifications + lock-dates roll-up | review |
| `/practice-metrics` | A | Monthly partner one-pager: revenue, WIP, debtors, lockup, utilisation, RAG bands | review |
| `/practice-metrics` | P | Same — plugin wrapper | review |
| `/capacity` | A | Individual/team capacity status + over/under capacity + at-risk users | KEEP |
| `/capacity` | P | Billable utilisation + WIP variance practice-level report | KEEP |
| `/workflow-review` | A | Audit templates/schedules/assignments/budgets + consolidation candidates | KEEP |
| `/workflow-review` | P | Same — plugin wrapper | KEEP |
| `/config-audit` | A | Per-client rule enablement drift: inconsistencies / gaps / drift findings | KEEP |
| `/config-audit` | P | Same — plugin wrapper with bulk-normalisation move | KEEP |
| `/billing-review` | A | XPM job billing, timesheet billable %, write-off %, profitability | review |
| `/client-fee-review` | P | Annual fee-review evidence pack: time logged x volumes x current fee per client | KEEP |
| `/pulse` | A | Rolling transactional tempo vs 2-3 month baseline (repricing / churn signal) | KEEP |
| `/pulse` | P | Same — plugin wrapper | review |

## By workflow category

### Compliance / lodgement (AU/NZ/UK)
- `/bas-ready` (A) / `/bas-prep` (P) — AU BAS quarterly/monthly
- `/ias-ready` (A) / `/ias-prep` (P) — AU IAS (PAYG-only, no GST)
- `/ird-gst-ready` (A) / `/gst-prep-nz` (P) — NZ GST101A
- `/vat-ready` (A) / `/vat-prep` (P) — UK VAT
- `/mtd-ready` (A) / `/mtd-prep` (P) — UK MTD-ITSA
- `/stp-finalisation` (P) — AU STP Phase 2 year-end
- `/tpar` (P) — AU Taxable Payments Annual Report
- `/super-check` (P) — AU Superannuation Guarantee
- `/withholding-review` (A) — cross-jurisdiction PAYG/PAYE/NIC + TPAR/CIS
- `/instalment-variation` (A+P) — AU PAYG-I / GST instalment vary
- `/payroll-reporting-review` (A) — STP/Payday Filing/RTI reconciliation

### Period close / financial statement preparation
- `/month-end-pack` (P) — monthly pack
- `/balance-sheet-explain` (A+P) — line-by-line BS walk
- `/fs-pack` (A+P) — year-end SPFS/GPFS pack
- `/trial-balance-alignment` (A+P) — TB vs signed-off FS reconciliation
- `/end-of-period-dashboard` (A+P) — multi-client month/quarter/year readiness
- `/financial-review` (A) — BS/P&L/bank-tx review with risk classification

### Reconciliation / data quality
- `/reconcile` (A) — bank reconciliation status + proposed matches
- `/xbert-checks` (A) — outstanding XBert risk-classified queue
- `/health-check` (A) — client + practice health diagnostics
- `/practice-health-check` (P) — portfolio DQ roll-up

### Practice operations (capacity, scheduling, workflow review)
- `/my-work` (A) — personal daily/weekly work view
- `/scheduled-work` (A) — practice scheduled work + setup issues
- `/capacity` (A+P) — capacity / utilisation / WIP
- `/workflow-review` (A+P) — template + schedule audit
- `/practice-review` (A) — Connect-portal config audit
- `/practice-metrics` (A+P) — partner one-pager
- `/config-audit` (A+P) — rule-enablement drift

### Advisory (cross-sell removed, fee review, etc.)
- `/client-fee-review` (P) — annual fee review evidence
- `/billing-review` (A) — XPM billing + write-off + profitability
- `/pulse` (A+P) — transactional tempo change detection

### Client onboarding / CoA / config
- `/client-onboard` (A+P) — engagement -> connection -> configuration -> go-live with phase gates
- (Note: COA creation and opening-balance load remain manual in ledger per `/client-onboard` v1 limitations)

### Payroll
- `/payroll-close` (A+P) — weekly pay-run close
- `/payroll-reporting-review` (A) — STP/Payday Filing/RTI reconciliation
- `/super-check` (P) — SG compliance
- `/stp-finalisation` (P) — STP Phase 2 year-end finalisation
- `/withholding-review` (A) — payroll + contractor withholding

### Tax (Div 7A, FBT, depreciation, etc.)
- `/div7a-review` (A) / `/div7a-schedule` (P) — Division 7A
- `/directors-loan-review` (A) — Div 7A / S455 / IRD director-loan rules
- `/loan-review` (A) — loan/HP/lease classification + IFRS 16
- `/fbt-review` (A) / `/fbt-prep` (P) — FBT exposure + return prep
- `/depreciation-review` (A) — asset register + capital allowance jurisdiction rules
- `/tax-reconciliation` (A+P) — accounting profit -> taxable income walk
- `/trust-review` (A) — trust distribution compliance
- `/consolidation-review` (A) — multi-entity intercompany + elimination

### Payments
- `/payment-run` (A+P) — weekly pay run + remittance drafts
- `/aged-receivables` (A+P) — debtor call-list

## Notable gaps you can already see in our own catalogue

1. **No inventory / stock review.** No agent or plugin touches stock-on-hand reconciliation, cost-of-goods variance, slow-moving inventory, or write-down workflow. Anyone with a product-based ledger is uncovered.
2. **No foreign-currency revaluation / FX exposure review.** No FX-revaluation agent, no realised/unrealised FX-gain review, no multi-currency netting check. Material gap for clients with overseas trade or FX bank accounts.
3. **No debtor / customer risk scoring beyond ageing.** `/aged-receivables` ranks by $ x days x prior-promise, but there's no credit-limit breach scan, no concentration-risk metric, no insolvency-signal monitoring.
4. **No GST / VAT classification correctness scan** (separate from period-end readiness). The "is this transaction coded to the right tax code" review is buried inside the period-end agents; there's no standalone "audit your GST coding across the quarter" workflow.
5. **No cashflow forecast or 13-week cashflow agent.** `/pulse` detects tempo change, `/instalment-variation` looks at cashflow run-rate, but neither produces a forward-looking cash forecast.
6. **No engagement-letter / scope-document generation.** `/client-onboard` references the engagement letter as a gate but doesn't produce one.
7. **Cross-sell intentionally removed** — both agent and plugin scored WORK in v3 because the lookalike-peer similarity model doesn't exist. Practice-development workflow has no replacement in the catalogue.

## Workflows we EXCLUDED on purpose

- **Receipt Capture stays mobile/web (xbert-capture).** Not exposed as an agent or plugin (CEO ruling 2026-05-05 — receipt capture requires a ledger, Micro+ only, mobile-first). Confirmed against MEMORY note `receipt_capture_requires_ledger`.
- **Custom XBert authoring is excluded from the plugin catalogue.** Custom XBerts are Python-only, AutoTune-narrated, and managed through the in-app Custom XBert UI + sandbox (`custom-xbert-service/`), not via Claude Code plugins (CEO ruling 2026-05-05).
- **Bank reconciliation matching engine (`xbert-reconcile`, `xbert-bill-intake`) removed** because MCP doesn't expose a propose-match / OCR / Bills_Create endpoint. Either rescope or build the missing tools before reintroducing.
- **Cross-sell-opportunities (agent + plugin) removed** because the lookalike-peer similarity primitive doesn't exist — `Data_FindSimilarClientTenants` is name-only.
- **Direct lodgement to ATO/HMRC/IRD is deliberately out of scope.** Every compliance agent stops at "ready / not ready" + audit document; the user lodges via the official portal or tax-agent software.
- **Direct posting (journals, bills, ABA payments) is deliberately out of scope.** Every agent surfaces proposals; the user approves and the ledger posts.
- **Interloan review (system agent) and intercompany / bank-statement-upload plugins removed in v3** per Aaron triage.


