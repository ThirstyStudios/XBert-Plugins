# XBert Super Check (AU)

Quarterly Superannuation Guarantee check for Australian clients. Verifies SG is calculated, posted, and paid through the clearing house by the 28th deadline, and quantifies SGC exposure if late.

## What it does
- Verifies SG at 12% on Ordinary Time Earnings for every eligible employee
- Reconciles super liability account against payrun credits and clearing house debit
- Confirms bank payment date is on or before the 28th
- Quantifies SGC exposure for late or missed payments (shortfall + 10% pa interest + $20 admin fee per employee)
- Produces a Word working paper with per-employee contribution detail and clearing house references

## Prerequisites
- XBert account
- Client connected to an Australian-domiciled ledger
- Payroll posted for the quarter with super calculated against eligible employees

## Usage
After installing, type:

    /super-check

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
