# XBert Payroll Close

Pre-run sanity checks, post-run reconciliation, and full-period payroll reviews across every pay cycle — including draft pay-run detection, SG rate compliance, GL-vs-payroll reconciliation, STP Phase 2 hygiene and bank-out reconciliation.

## What it does
- Runs pre-run checks before you post the pay (new starters, terminations, leave, super rates)
- Runs post-run reconciliation against the prior pay (net pay, PAYG, super variances by employee)
- Period review mode walks **every pay cycle** in a month, quarter or financial year — per-cycle variances, super guarantee rate at each pay date, and payroll settings in use
- Surfaces draft, duplicate, future-dated and missing pay runs from a full-status pay run census
- Reconciles payroll to the general ledger: wages expense, PAYG withholding (the W1/W2 tie-in for the IAS), and super payable
- Judges every pay run's super rate against the statutory SG table (12% from 1 July 2025), never from model memory
- Excludes employees terminated in prior years from current findings
- Reconciles the bank file total against the sum of employee net pays before the file uploads
- Reports honestly: coverage statement plus an explicit "Not checked — verify in the ledger" list for anything the connected data cannot verify (e.g. STP Phase 2 field-level config, pay-item super exemption flags)
- Surfaces results as blockers / warnings / clean with named employees and amounts

## Prerequisites
- XBert account
- Client with active payroll in the connected ledger (Xero, MYOB, or QuickBooks Online)
- At least one prior pay run on file for variance comparison

## Known data limitations
- MYOB exposes only recorded pays via its API — draft pay runs do not exist there, so "no drafts found" cannot be proven on MYOB
- STP Phase 2 fields (income type, country of residence, STP2-qualified flag, TFN on file, residency, tax-free threshold, study loans) are checked per employee on current gateways; STP2 category mapping is not exposed and the report lists it — plus any field the ledger left blank — as manual verification steps

## Usage
After installing, type:

    /payroll-close

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
