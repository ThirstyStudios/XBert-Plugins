# XBert Tax Reconciliation

Walk from accounting profit to taxable income for a year-end tax reconciliation worksheet — per entity type, with every adjustment tied to its source. Excel + PDF working papers.

## What it does
- Pulls year-end financial statements, trial balance, P&L, balance sheet, and journal master
- Runs the Schedule M-style walk: starting accounting profit → add-backs → deductions → prior-year losses → taxable income
- Per-entity-type structure — company / trust / partnership
- Ties every adjustment to its source journal, account, or schedule
- Marks FBT-included or FBT-excluded for the period
- Outputs Excel worksheet for the return-prep team and PDF for the client file
- Labels every adjustment Direct / Likely / Needs review

## Prerequisites
- XBert account
- Year-end trial balance and financial statements available
- Manual journals tagged or identifiable for accruals, provisions, and non-deductibles

## Usage
After installing, type:

    /tax-reconciliation

in any Claude chat (Desktop or Code).

## Scope notes
- **Lodgement is out of scope** — this plugin produces the reconciliation worksheet only. Lodging the return belongs to your tax-agent platform.
- Read-only on the ledger. Tax-effect journals are **not** posted — they're proposed for your return-prep workflow.
- Per-entity structure is mandatory — company, trust, partnership reconciliations differ. The plugin will not silently default.

## Support
hello@xbert.io
