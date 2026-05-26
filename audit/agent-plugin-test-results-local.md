# Agent + Plugin Local Test Results — 2026-05-26

**Test setup**: Local MCP gateway (https://localhost:7200/mcp), connectTenantId=11374 (Agents - The Future), clientTenantId=11668 (Peak Precision Accounting), userProfileId=1 (dev bypass mock user).

**Method**: For each agent/plugin slash command: tools_search by command keyword → tools_invoke on top result with minimal required args → score on response shape.

**Summary**: 40 agents avg quality 2.6/5; 33 plugins avg quality 2.79/5. Status codes: works (clean useful data), works-partial (returned but thin), empty (no data for test tenant), agent-confused (no matching tool found), tool-fail (gateway error), error (transport).

## Aligned Scored Table

| Command | Scope | Country | Agent Status | Agent Q | Agent Tool | Plugin Status | Plugin Q | Plugin Tool |
|---|---|---|---|---|---|---|---|---|
| `/aged-receivables` | Client | global | works | 4 | Data_AgedSummary | works | 4 | Data_AgedSummary |
| `/balance-sheet-explain` | Client | global | works | 4 | Data_Employees_Get | works | 4 | Data_Employees_Get |
| `/bank-statement-upload` |  |  | n/a | - | - | works | 4 | Data_BankTransactions_Get |
| `/bas-prep` |  |  | n/a | - | - | works | 4 | Data_ReconciliationStatus |
| `/bas-ready` | Client | AU | empty | 3 | Data_BankTransactions_Summary | n/a | - | - |
| `/billing-review` | Client | global | works-partial | 2 | Data_GetLinkedXBertsForAgent | n/a | - | - |
| `/bill-intake` |  |  | n/a | - | - | works | 4 | Data_Bills_Get |
| `/capacity` | User | global | works | 4 | Features_GetBatchCapacityAllocation | works | 4 | Features_GetBatchCapacityAllocation |
| `/client-fee-review` |  |  | n/a | - | - | works | 4 | Data_AgedSummary |
| `/client-onboard` | Client | global | works | 4 | Data_AgedSummary | works | 4 | Data_AgedSummary |
| `/config-audit` | Practice | global | works-partial | 2 | Data_GetLinkedXBertsForAgent | works-partial | 2 | Data_GetLinkedXBertsForAgent |
| `/consolidation-review` | Client | global | works-partial | 2 | Data_GetLinkedXBertsForAgent | n/a | - | - |
| `/cross-sell-opportunities` | Practice | global | works | 4 | Data_ReconciliationStatus | works | 4 | Data_ReconciliationStatus |
| `/depreciation-review` | Client | global | works-partial | 2 | Data_GetLinkedXBertsForAgent | n/a | - | - |
| `/directors-loan-review` | Client | global | works-partial | 2 | Data_GetLinkedXBertsForAgent | n/a | - | - |
| `/div7a-review` | Client | AU | works-partial | 2 | Data_GetLinkedXBertsForAgent | n/a | - | - |
| `/div7a-schedule` |  |  | n/a | - | - | tool-fail | 1 | Features_CreateClientTemplateSchedule |
| `/end-of-period-dashboard` | Practice | global | empty | 3 | Data_Employees_Search | empty | 3 | Data_Employees_Search |
| `/fbt-prep` |  |  | n/a | - | - | agent-confused | 1 |  |
| `/fbt-review` | Client | global | works-partial | 2 | Data_GetLinkedXBertsForAgent | n/a | - | - |
| `/financial-review` | Client | global | works | 4 | Data_FinancialStatements | n/a | - | - |
| `/fs-pack` | Client | global | agent-confused | 1 |  | agent-confused | 1 |  |
| `/gst-prep-nz` |  |  | n/a | - | - | agent-confused | 1 |  |
| `/health-check` | Client | global | works | 4 | Data_XBertNotificationSummary | n/a | - | - |
| `/ias-prep` |  |  | n/a | - | - | agent-confused | 1 |  |
| `/ias-ready` | Client | AU | agent-confused | 1 |  | n/a | - | - |
| `/instalment-variation` | Client | AU | agent-confused | 1 |  | agent-confused | 1 |  |
| `/intercompany-recon` |  |  | n/a | - | - | empty | 3 | Data_BankTransactions_Search |
| `/interloan-review` | Client | global | works-partial | 2 | Data_GetLinkedXBertsForAgent | n/a | - | - |
| `/ird-gst-ready` | Client | NZ | agent-confused | 1 |  | n/a | - | - |
| `/loan-review` | Client | global | works-partial | 2 | Data_GetLinkedXBertsForAgent | n/a | - | - |
| `/month-end-pack` | Client | global | empty | 3 | Data_BankTransactions_Summary | empty | 3 | Data_BankTransactions_Summary |
| `/mtd-prep` |  |  | n/a | - | - | agent-confused | 1 |  |
| `/mtd-ready` | Client | GB | agent-confused | 1 |  | n/a | - | - |
| `/my-work` | User | global | works | 4 | Features_CountNotifications | n/a | - | - |
| `/payment-run` | Client | global | works | 4 | Data_PayrollSettings | works | 4 | Data_PayrollSettings |
| `/payroll-close` | Client | global | works | 4 | Data_PayrollSettings | works | 4 | Data_PayrollSettings |
| `/payroll-reporting-review` | Client | global | works-partial | 2 | Data_GetLinkedXBertsForAgent | n/a | - | - |
| `/practice-health-check` |  |  | n/a | - | - | empty | 3 | Data_XBertConfigurations |
| `/practice-metrics` | Practice | global | works | 4 | Data_DataQualityScore | works | 4 | Data_DataQualityScore |
| `/practice-review` | Practice | global | works-partial | 2 | Data_GetLinkedXBertsForAgent | n/a | - | - |
| `/pulse` | Client | global | agent-confused | 1 |  | agent-confused | 1 |  |
| `/reconcile` | Client | global | empty | 3 | Data_BankTransactions_Search | empty | 3 | Data_BankTransactions_Search |
| `/scheduled-work` | Client | global | works | 4 | Features_CountNotifications | n/a | - | - |
| `/stp-finalisation` |  |  | n/a | - | - | works | 4 | Features_ListProcessTags |
| `/super-check` |  |  | n/a | - | - | works | 4 | Data_Employees_Get |
| `/tax-reconciliation` | Client | global | empty | 3 | Data_BankTransactions_Summary | empty | 3 | Data_BankTransactions_Summary |
| `/tpar` |  |  | n/a | - | - | agent-confused | 1 |  |
| `/trial-balance-alignment` | Client | global | works | 4 | Data_Employees_Get | works | 4 | Data_Employees_Get |
| `/trust-review` | Client | global | works-partial | 2 | Data_GetLinkedXBertsForAgent | n/a | - | - |
| `/vat-prep` |  |  | n/a | - | - | agent-confused | 1 |  |
| `/vat-ready` | Client | GB | agent-confused | 1 |  | n/a | - | - |
| `/withholding-review` | Client | global | works-partial | 2 | Data_GetLinkedXBertsForAgent | n/a | - | - |
| `/workflow-review` | Practice | global | works-partial | 2 | Data_GetLinkedXBertsForAgent | works-partial | 2 | Data_GetLinkedXBertsForAgent |
| `/xbert-checks` | User | global | works-partial | 2 | Data_GetLinkedXBertsForAgent | n/a | - | - |

## Counts by Surface

| Surface | n | works | works-partial | empty | agent-confused | tool-fail | error | avg Q |
|---|---|---|---|---|---|---|---|---|
| agent | 40 | 13 | 15 | 5 | 7 | 0 | 0 | 2.6 |
| plugin | 33 | 15 | 2 | 6 | 9 |  | 0 | 2.79 |

## Recommended Actions (sort by lowest score, prioritise removal/work)

| Command | Avg Q | Agent | Plugin | Recommendation |
|---|---|---|---|---|
| `/div7a-schedule` | 1 | n/a (-) | tool-fail (1) | REMOVE / blocked |
| `/fbt-prep` | 1 | n/a (-) | agent-confused (1) | REMOVE / blocked |
| `/fs-pack` | 1 | agent-confused (1) | agent-confused (1) | REMOVE / blocked |
| `/gst-prep-nz` | 1 | n/a (-) | agent-confused (1) | REMOVE / blocked |
| `/ias-prep` | 1 | n/a (-) | agent-confused (1) | REMOVE / blocked |
| `/ias-ready` | 1 | agent-confused (1) | n/a (-) | REMOVE / blocked |
| `/instalment-variation` | 1 | agent-confused (1) | agent-confused (1) | REMOVE / blocked |
| `/ird-gst-ready` | 1 | agent-confused (1) | n/a (-) | REMOVE / blocked |
| `/mtd-prep` | 1 | n/a (-) | agent-confused (1) | REMOVE / blocked |
| `/mtd-ready` | 1 | agent-confused (1) | n/a (-) | REMOVE / blocked |
| `/pulse` | 1 | agent-confused (1) | agent-confused (1) | REMOVE / blocked |
| `/tpar` | 1 | n/a (-) | agent-confused (1) | REMOVE / blocked |
| `/vat-prep` | 1 | n/a (-) | agent-confused (1) | REMOVE / blocked |
| `/vat-ready` | 1 | agent-confused (1) | n/a (-) | REMOVE / blocked |
| `/billing-review` | 2 | works-partial (2) | n/a (-) | WORK — capability gap |
| `/config-audit` | 2 | works-partial (2) | works-partial (2) | WORK — capability gap |
| `/consolidation-review` | 2 | works-partial (2) | n/a (-) | WORK — capability gap |
| `/depreciation-review` | 2 | works-partial (2) | n/a (-) | WORK — capability gap |
| `/directors-loan-review` | 2 | works-partial (2) | n/a (-) | WORK — capability gap |
| `/div7a-review` | 2 | works-partial (2) | n/a (-) | WORK — capability gap |
| `/fbt-review` | 2 | works-partial (2) | n/a (-) | WORK — capability gap |
| `/interloan-review` | 2 | works-partial (2) | n/a (-) | WORK — capability gap |
| `/loan-review` | 2 | works-partial (2) | n/a (-) | WORK — capability gap |
| `/payroll-reporting-review` | 2 | works-partial (2) | n/a (-) | WORK — capability gap |
| `/practice-review` | 2 | works-partial (2) | n/a (-) | WORK — capability gap |
| `/trust-review` | 2 | works-partial (2) | n/a (-) | WORK — capability gap |
| `/withholding-review` | 2 | works-partial (2) | n/a (-) | WORK — capability gap |
| `/workflow-review` | 2 | works-partial (2) | works-partial (2) | WORK — capability gap |
| `/xbert-checks` | 2 | works-partial (2) | n/a (-) | WORK — capability gap |
| `/bas-ready` | 3 | empty (3) | n/a (-) | review — partial fit |
| `/end-of-period-dashboard` | 3 | empty (3) | empty (3) | review — partial fit |
| `/intercompany-recon` | 3 | n/a (-) | empty (3) | review — partial fit |
| `/month-end-pack` | 3 | empty (3) | empty (3) | review — partial fit |
| `/practice-health-check` | 3 | n/a (-) | empty (3) | review — partial fit |
| `/reconcile` | 3 | empty (3) | empty (3) | review — partial fit |
| `/tax-reconciliation` | 3 | empty (3) | empty (3) | review — partial fit |
| `/aged-receivables` | 4 | works (4) | works (4) | KEEP — works |
| `/balance-sheet-explain` | 4 | works (4) | works (4) | KEEP — works |
| `/bank-statement-upload` | 4 | n/a (-) | works (4) | KEEP — works |
| `/bas-prep` | 4 | n/a (-) | works (4) | KEEP — works |
| `/bill-intake` | 4 | n/a (-) | works (4) | KEEP — works |
| `/capacity` | 4 | works (4) | works (4) | KEEP — works |
| `/client-fee-review` | 4 | n/a (-) | works (4) | KEEP — works |
| `/client-onboard` | 4 | works (4) | works (4) | KEEP — works |
| `/cross-sell-opportunities` | 4 | works (4) | works (4) | KEEP — works |
| `/financial-review` | 4 | works (4) | n/a (-) | KEEP — works |
| `/health-check` | 4 | works (4) | n/a (-) | KEEP — works |
| `/my-work` | 4 | works (4) | n/a (-) | KEEP — works |
| `/payment-run` | 4 | works (4) | works (4) | KEEP — works |
| `/payroll-close` | 4 | works (4) | works (4) | KEEP — works |
| `/practice-metrics` | 4 | works (4) | works (4) | KEEP — works |
| `/scheduled-work` | 4 | works (4) | n/a (-) | KEEP — works |
| `/stp-finalisation` | 4 | n/a (-) | works (4) | KEEP — works |
| `/super-check` | 4 | n/a (-) | works (4) | KEEP — works |
| `/trial-balance-alignment` | 4 | works (4) | works (4) | KEEP — works |
