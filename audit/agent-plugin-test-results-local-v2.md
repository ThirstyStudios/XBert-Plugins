# Agent + Plugin Test Results (LLM-in-loop, local MCP) — 2026-05-26 v2

**Test setup**: Local MCP gateway (https://localhost:7200/mcp), connectTenantId=11374 (Agents - The Future), clientTenantId=11668 (Peak Precision Accounting), userProfileId=1 (dev bypass mock user).

**Method**: Each system agent's **full Instructions** (or plugin's full command body) was loaded as the subagent's operating context. The subagent derived semantic search terms (NOT just the command name), invoked the best-fit MCP tool, and scored honestly on result usefulness.

**Summary**: 41 agents avg quality 3.2/5; 33 plugins avg quality 3.24/5. Compare to the prior keyword-harness pass: 2.6/5 and 2.79/5 respectively. Notable changes: 5 real tool-fails surfaced (vs 0 in keyword harness); only 2 agent-confused (vs 7). The LLM-in-loop methodology consistently finds the right tool by semantic intent.

**Methodology caveats**:
- Some subagents reported 'agent instructions reference stale tool names'. These reports reflect the agent Instructions dumped at the start of this session, BEFORE the strip-tool-names sweep (20260526_1000) was applied to staging. **Current staging Instructions have zero tool names** (verified). The structural findings (tool exists / doesn't exist) remain valid.
- Test client 11668 is a GB Xero company in GBP. AU/NZ-specific compliance plugins (BAS, IAS, super, TPAR, FBT, NZ GST) gracefully hit their country-check halt branch but couldn't be exercised end-to-end.
- The test mock user has access to only 3 client tenants (11668, 11377, 11673). Cross-tenant workflows tested via this set; production data depth limited.

## Counts by Surface

| Surface | n | works | works-partial | empty | agent-confused | tool-fail | avg Q |
|---|---|---|---|---|---|---|---|
| agent | 41 | 13 | 21 | 0 | 2 | 5 | 3.2 |
| plugin | 33 | 10 | 22 |  | 0 | 0 | 3.24 |

## Aligned Scored Table

| Command | Agent status | Agent Q | Agent tool | Plugin status | Plugin Q | Plugin tool | Avg Q | Recommendation |
|---|---|---|---|---|---|---|---|---|
| `/aged-receivables` | works | 5 | Data_AgedSummary | works | 5 | Data_AgedSummary | 5 | KEEP — works |
| `/balance-sheet-explain` | works | 4 | Data_FinancialStatements | works-partial | 4 | Data_FinancialStatements | 4 | KEEP — works |
| `/bank-statement-upload` | n/a | - | - | works-partial | 2 | Data_BankTransactions_Summary | 2 | WORK — capability gap |
| `/bas-prep` | n/a | - | - | works-partial | 3 | Data_OrganisationSettings | 3 | review — partial fit |
| `/bas-ready` | works-partial | 3 | Data_ReconciliationStatus | n/a | - | - | 3 | review — partial fit |
| `/billing-review` | tool-fail | 2 | Data_XPMClients | n/a | - | - | 2 | WORK — capability gap |
| `/bill-intake` | n/a | - | - | works-partial | 3 | Data_Bills_Search | 3 | review — partial fit |
| `/capacity` | works | 4 | Features_GetBatchCapacityAllocation | works-partial | 3 | Data_XPMTimesheets_Summary | 3.5 | review — partial fit |
| `/client-fee-review` | n/a | - | - | works | 4 | Data_GetAllAccessibleClients | 4 | KEEP — works |
| `/client-onboard` | works-partial | 3 | Data_GetClientConnections | works-partial | 3 | Data_GetClientConnections | 3 | review — partial fit |
| `/config-audit` | works | 4 | Data_XBertConfigurations | works | 5 | Data_XBertConfigurations | 4.5 | KEEP — works |
| `/consolidation-review` | works-partial | 3 | Data_OrganisationSettings | n/a | - | - | 3 | review — partial fit |
| `/cross-sell-opportunities` | works | 4 | Data_GetAllAccessibleClients | works-partial | 3 | Data_XBertNotificationSummary | 3.5 | review — partial fit |
| `/depreciation-review` | tool-fail | 1 | Data_FinancialStatements (balanceSheet fallback) | n/a | - | - | 1 | REMOVE / blocked |
| `/directors-loan-review` | works-partial | 3 | Data_OrganisationSettings (surface=organisation) | n/a | - | - | 3 | review — partial fit |
| `/div7a-review` | works-partial | 2 | Data_OrganisationSettings (surface=organisation) | n/a | - | - | 2 | WORK — capability gap |
| `/div7a-schedule` | n/a | - | - | works-partial | 3 | Data_FinancialStatements (balanceSheet) | 3 | review — partial fit |
| `/end-of-period-dashboard` | works-partial | 3 | Data_GetAllAccessibleClients | works | 4 | Data_GetAllAccessibleClients | 3.5 | review — partial fit |
| `/fbt-prep` | n/a | - | - | works-partial | 2 | Data_OrganisationSettings (surface=organisation) | 2 | WORK — capability gap |
| `/fbt-review` | works-partial | 3 | Data_OrganisationSettings (surface=organisation) | n/a | - | - | 3 | review — partial fit |
| `/financial-review` | works | 4 | Data_FinancialStatements (statement=balanceSheet) | n/a | - | - | 4 | KEEP — works |
| `/fs-pack` | works-partial | 3 | Data_OrganisationSettings | works | 5 | Data_OrganisationSettings | 4 | KEEP — works |
| `/gst-prep-nz` | n/a | - | - | works-partial | 2 | Data_OrganisationSettings | 2 | WORK — capability gap |
| `/health-check` | works-partial | 3 | Data_DataQualityScore | n/a | - | - | 3 | review — partial fit |
| `/ias-prep` | n/a | - | - | works-partial | 3 | Data_OrganisationSettings | 3 | review — partial fit |
| `/ias-ready` | works | 4 | Data_XBertNotificationSummary | n/a | - | - | 4 | KEEP — works |
| `/instalment-variation` | works-partial | 3 | Data_FinancialStatements (profitAndLoss) | works-partial | 2 | Data_FinancialStatements (P&L) | 2.5 | WORK — capability gap |
| `/intercompany-recon` | n/a | - | - | works | 4 | Data_GetClientConnections | 4 | KEEP — works |
| `/interloan-review` | tool-fail | 2 | Data_FinancialStatements (trialBalance) | n/a | - | - | 2 | WORK — capability gap |
| `/ird-gst-ready` | agent-confused | 1 | none | n/a | - | - | 1 | REMOVE / blocked |
| `/loan-review` | works-partial | 3 | Data_FinancialStatements | n/a | - | - | 3 | review — partial fit |
| `/month-end-pack` | works-partial | 3 | Data_FinancialStatements | works-partial | 3 | Data_FinancialStatements (profitAndLoss) | 3 | review — partial fit |
| `/mtd-prep` | n/a | - | - | works | 4 | Data_OrganisationSettings (organisation + chartOfAccounts) | 4 | KEEP — works |
| `/mtd-ready` | agent-confused | 1 | none | n/a | - | - | 1 | REMOVE / blocked |
| `/my-work` | works | 4 | Features_CountNotifications | n/a | - | - | 4 | KEEP — works |
| `/paye-review` | works-partial | 3 | Data_OrganisationSettings | n/a | - | - | 3 | review — partial fit |
| `/payment-run` | works | 5 | Data_AgedSummary | works-partial | 3 | Data_AgedSummary | 4 | KEEP — works |
| `/payroll-close` | works-partial | 3 | Data_OrganisationSettings | empty | 2 | Data_Employees_Summary | 2.5 | WORK — capability gap |
| `/payroll-reporting-review` | works-partial | 3 | Data_OrganisationSettings | n/a | - | - | 3 | review — partial fit |
| `/practice-health-check` | n/a | - | - | works | 4 | Data_GetAllAccessibleClients | 4 | KEEP — works |
| `/practice-metrics` | works | 4 | Data_GetAllAccessibleClients | works-partial | 3 | Data_XPMClients | 3.5 | review — partial fit |
| `/practice-review` | works | 5 | Practice_GetConnectAccountReview | n/a | - | - | 5 | KEEP — works |
| `/pulse` | works-partial | 3 | Data_BankTransactions_Summary | works | 4 | Data_BankTransactions_Summary (x2 â€” recent vs baseline window) | 3.5 | review — partial fit |
| `/reconcile` | tool-fail | 2 | Data_ReconciliationStatus | works-partial | 3 | Data_ReconciliationStatus | 2.5 | WORK — capability gap |
| `/scheduled-work` | works | 4 | Features_GetWork | n/a | - | - | 4 | KEEP — works |
| `/stp-finalisation` | n/a | - | - | works-partial | 3 | Data_PayRuns_Search | 3 | review — partial fit |
| `/super-check` | n/a | - | - | works-partial | 2 | Data_PayRuns_Summary | 2 | WORK — capability gap |
| `/tax-reconciliation` | tool-fail | 2 | Data_FinancialStatements | works-partial | 3 | Data_Bills_Summary | 2.5 | WORK — capability gap |
| `/tpar` | n/a | - | - | works-partial | 3 | Data_Bills_Summary | 3 | review — partial fit |
| `/trial-balance-alignment` | works-partial | 4 | Data_FinancialStatements | works | 4 | Data_FinancialStatements (trialBalance) | 4 | KEEP — works |
| `/trust-review` | works-partial | 3 | Data_OrganisationSettings | n/a | - | - | 3 | review — partial fit |
| `/vat-prep` | n/a | - | - | works-partial | 3 | Data_OrganisationSettings (organisation) | 3 | review — partial fit |
| `/vat-ready` | works-partial | 4 | Data_OrganisationSettings | n/a | - | - | 4 | KEEP — works |
| `/withholding-review` | works-partial | 2 | Data_OrganisationSettings | n/a | - | - | 2 | WORK — capability gap |
| `/workflow-review` | works-partial | 4 | Features_ListTemplates | works-partial | 3 | Features_Review | 3.5 | review — partial fit |
| `/xbert-checks` | works | 5 | Data_XBertNotificationSummary | n/a | - | - | 5 | KEEP — works |

## Tier Summary (sorted lowest score first)

### REMOVE / blocked (3)

- `/depreciation-review` (avg Q 1)
- `/ird-gst-ready` (avg Q 1)
- `/mtd-ready` (avg Q 1)

### KEEP — works (17)

- `/balance-sheet-explain` (avg Q 4)
- `/client-fee-review` (avg Q 4)
- `/financial-review` (avg Q 4)
- `/fs-pack` (avg Q 4)
- `/ias-ready` (avg Q 4)
- `/intercompany-recon` (avg Q 4)
- `/mtd-prep` (avg Q 4)
- `/my-work` (avg Q 4)
- `/payment-run` (avg Q 4)
- `/practice-health-check` (avg Q 4)
- `/scheduled-work` (avg Q 4)
- `/trial-balance-alignment` (avg Q 4)
- `/vat-ready` (avg Q 4)
- `/config-audit` (avg Q 4.5)
- `/aged-receivables` (avg Q 5)
- `/practice-review` (avg Q 5)
- `/xbert-checks` (avg Q 5)

### WORK — capability gap (12)

- `/bank-statement-upload` (avg Q 2)
- `/billing-review` (avg Q 2)
- `/div7a-review` (avg Q 2)
- `/fbt-prep` (avg Q 2)
- `/gst-prep-nz` (avg Q 2)
- `/interloan-review` (avg Q 2)
- `/super-check` (avg Q 2)
- `/withholding-review` (avg Q 2)
- `/instalment-variation` (avg Q 2.5)
- `/payroll-close` (avg Q 2.5)
- `/reconcile` (avg Q 2.5)
- `/tax-reconciliation` (avg Q 2.5)

### review — partial fit (24)

- `/bas-prep` (avg Q 3)
- `/bas-ready` (avg Q 3)
- `/bill-intake` (avg Q 3)
- `/client-onboard` (avg Q 3)
- `/consolidation-review` (avg Q 3)
- `/directors-loan-review` (avg Q 3)
- `/div7a-schedule` (avg Q 3)
- `/fbt-review` (avg Q 3)
- `/health-check` (avg Q 3)
- `/ias-prep` (avg Q 3)
- `/loan-review` (avg Q 3)
- `/month-end-pack` (avg Q 3)
- `/paye-review` (avg Q 3)
- `/payroll-reporting-review` (avg Q 3)
- `/stp-finalisation` (avg Q 3)
- `/tpar` (avg Q 3)
- `/trust-review` (avg Q 3)
- `/vat-prep` (avg Q 3)
- `/capacity` (avg Q 3.5)
- `/cross-sell-opportunities` (avg Q 3.5)
- `/end-of-period-dashboard` (avg Q 3.5)
- `/practice-metrics` (avg Q 3.5)
- `/pulse` (avg Q 3.5)
- `/workflow-review` (avg Q 3.5)

