# XBert FX Review

Surface foreign-currency exposures the linked FX XBerts caught — and route the user to the ledger's native FX revaluation. The plugin does NOT compose the revaluation journal.

## What it does
- Resolves the period's linked FX XBert firings (FX bank accounts, FX AR, FX AP, foreign-currency GL balances)
- Lists each surfaced exposure with: account name, currency code, foreign-currency amount, base-currency value (as held by the ledger), linked XBert
- Recommends running the period-end FX revaluation in the client's ledger (Xero / MYOB / QBO) scoped to the surfaced balances

## What it explicitly does NOT do (no backing data in MCP today)
- Compose or post the period-end revaluation journal
- Compare period-end rate vs booking rate (no historical rate property)
- Show last-revalued date per balance (no last-revalued-date property)
- Split realised vs unrealised gain / loss (no realisation-status property)
- Reconcile intercompany AR-vs-AP between separate entities (cross-entity not supported)
- Verify the period-end rate source (no rate-source property)
- Flag currencies with no revaluation for more than 2 periods (no revaluation history)
- Detect weighted-average booking rate variance (no booking-rate on lines)
- Flag exposures > 10% of net assets without a hedging note (no hedging-note property)

If a Custom XBert lands later that captures any of these signals deterministically, the plugin will surface them; until then the agent says so honestly rather than invent the signal.

## Prerequisites
- XBert account
- Client connected to a multi-currency ledger
- FX XBerts linked to the FX Review agent in the Connect portal

## Usage
After installing, type:

    /fx-review

in Claude Code or Claude Desktop.

## Support
hello@xbert.io
