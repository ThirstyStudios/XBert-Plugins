# XBert 13-Week Cashflow

13-week rolling cash forecast. Combines actual bank balance with AR predicted-pay weighting, AP due dates, payroll/tax cadence, and recurring bank-tx. Surfaces named risk weeks and the top three recommended actions per risk week.

## What it does
- Projects the client's cash position weekly for the next 13 weeks
- Weights AR inflows by per-debtor historic payment latency, not just invoice due date
- Places AP, payroll, tax, and recurring bank-tx in the week they actually land
- Names each risk week with its drivers (not just the dip)
- Recommends three actions per risk week — chase, delay, draw — ranked by impact

## Prerequisites
- XBert account
- Client ledger connected (Xero, MYOB, or QuickBooks Online)
- Bank feed connected with at least 90 days of transaction history
- Open AR and AP balances on file

## Usage
After installing, type:

    /cashflow-13week

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
