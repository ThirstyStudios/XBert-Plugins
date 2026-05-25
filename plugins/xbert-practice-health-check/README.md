# XBert Practice Health Check

Portfolio-wide data-quality and financial-health snapshot for an accounting firm, with diagnostic and prescriptive recommendations per client.

## What it does
- Pulls data-quality scores, outstanding notification summaries and connection inventory across every client in your Connect tenant
- Bands the portfolio (Healthy / Watch / Risk / Critical) using deterministic thresholds
- Drills into the worst-performing N clients (default 10, configurable) with per-client findings
- Pairs every finding with "what this means" and "what's likely causing it"
- Produces a Word document with the portfolio snapshot, deterioration list and per-client diagnostics

## Prerequisites
- XBert account
- At least one connected client ledger (Xero, QuickBooks or XPM)
- Three or more months of operating history for the cohort being reviewed

## Usage
After installing, type:

    /practice-health-check

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
