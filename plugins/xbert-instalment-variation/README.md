# XBert Instalment Variation

PAYG-I / GST instalment variation recommendation with YTD trend, cashflow run-rate, GIC-exposure note, and a PDF audit-defence working paper. Triggered by the ATO notice arriving — not by a calendar date.

## What it does
- Pulls YTD profit, balance sheet, cashflow, budget adherence, and tax rates
- Compares the YTD-projected annual liability to the ATO headline rate
- Checks cashflow run-rate — a variation-down with squeezed cash is muted
- Recommends a direction (vary up / down / stay) with a confidence label
- States GIC exposure if the variation turns out to be wrong on the final return
- Produces a PDF working paper that documents every input — reproducible in 18 months

## Prerequisites
- XBert account
- Current-year P&L data on the ledger
- Prior-year tax position available for trend comparison

## Usage
After installing, type:

    /instalment-variation

in any Claude chat (Desktop or Code).

## Scope notes
- v1 capability gap: a `Tax_GetATOBenchmarkRate` MCP tool is not yet available — the user supplies the GIC rate manually. The recommendation engine doesn't depend on this; only the GIC dollar projection does.
- The plugin **never submits the variation** — it recommends and documents. The human enters the number into the ATO portal.
- Be conservative on variation-down recommendations. The audit-defence story is the deliverable.

## Support
hello@xbert.io
