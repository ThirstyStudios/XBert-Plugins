# XBert Payroll Close

Pre-run sanity checks and post-run reconciliation for every weekly pay cycle, including STP Phase 2 hygiene and bank-out reconciliation.

## What it does
- Runs pre-run checks before you post the pay (new starters, terminations, leave, super rates, STP P2)
- Runs post-run reconciliation against the prior pay (net pay, PAYG, super variances by employee)
- Reconciles the bank file total against the sum of employee net pays before the file uploads
- Catches missing STP Phase 2 fields (income type, country code, tax treatment, category map)
- Surfaces results as blockers / warnings / clean with named employees and amounts

## Prerequisites
- XBert account
- Client with active payroll in the connected ledger (Xero, MYOB, or QuickBooks Online)
- At least one prior pay run on file for variance comparison

## Usage
After installing, type:

    /payroll-close

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
