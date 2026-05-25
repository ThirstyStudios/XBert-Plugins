# XBert Div 7A Schedule

Build a Division 7A loan schedule per shareholder loan — opening, advances, repayments, interest at the benchmark rate, and minimum yearly repayment calc. Excel output, one worksheet per loan.

## What it does
- Pulls the balance sheet, journal master, and shareholder / related-party contacts
- Identifies shareholder loan accounts via name pattern + contact link
- Walks each loan opening to closing with advances, repayments, interest accrual at the benchmark rate
- Calculates the minimum yearly repayment per loan (per Div 7A formula)
- Flags any shortfall below minimum as a deemed-dividend trigger
- Notes the complying-loan-agreement assumption explicitly in the working paper
- Outputs an Excel workbook with one tab per loan + working paper tab + next-year reminder

## Prerequisites
- XBert account
- Shareholder / related-party loan accounts identifiable in the chart of accounts (name pattern + contact link)
- **ATO benchmark interest rate for the income year** — entered manually in v1 (see scope notes)

## Usage
After installing, type:

    /div7a-schedule

in any Claude chat (Desktop or Code).

## Scope notes (v1 narrow)
- **Benchmark rate is entered manually.** An ATO benchmark rate lookup capability is on the roadmap; until it ships, you enter the rate when prompted.
- **Complying loan agreement is assumed.** The working paper notes this assumption explicitly. If you confirm the agreement is not in place, the underlying advance may already be a deemed dividend — that's flagged for partner review, not silently ignored.
- Read-only on the ledger. The schedule is a working paper; no journals are posted.

The v1 narrow scope ships now because the calculation + working paper are the bulk of the value, and the manual rate entry is a one-keystroke ask. The plugin will become zero-input when the benchmark-rate MCP tool ships.

## Support
hello@xbert.io
