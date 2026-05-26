---
name: fx-review
description: FX-review methodology — surface which foreign-currency exposures the linked FX XBerts caught for the period, present the per-balance picture, and route the user to the ledger's native FX revaluation. The plugin does NOT compose the revaluation journal. Use when the user asks to review FX exposure, run a period-end FX sweep, list foreign-currency balances, or runs the /fx-review slash command. Also triggers on "FX exposure check", "foreign currency balances", "period-end FX sweep".
---

# FX Review

A narrow, honest period review of every FX-exposure XBert that fired across the period. Detection is owned deterministically by Custom XBerts (the XBerts are the heroes); this skill surfaces what they caught and routes the user to the ledger's native FX revaluation. **The plugin does not compose the revaluation journal — the data primitives for that don't exist in MCP today.**

## Goal

Convert the period's FX-exposure XBert firings into a per-balance list of surfaced foreign-currency exposures and direct the user to complete the period-end revaluation in their accounting system. The plugin does not propose journal lines.

## FX exposure categories (supported)

| Category | What the linked XBert deterministically detects |
|---|---|
| FX bank account with balance | A foreign-currency bank account currently carrying a non-zero balance |
| FX AR balance | An outstanding receivable denominated in a foreign currency |
| FX AP balance | An outstanding payable denominated in a foreign currency |
| Foreign-currency GL balance | Any other GL account currently carrying a foreign-currency balance |

## Metrics

- **Exposures surfaced** — count of accounts the linked FX XBerts flagged for the period
- **Distinct currencies** — count of currency codes represented in the surfaced exposures
- **Largest base-currency exposure** — the surfaced account with the highest base-currency value
- **Routing target** — which ledger native FX revaluation workflow to point the user to (Xero / MYOB / QBO)

## Methodology

1. **Linked XBerts gate.** If no XBerts are linked to the FX Review agent in the Connect portal for the client, STOP. Tell the user to configure linked XBerts first.
2. **Pull firings.** For every linked FX XBert, pull the period's firings with the underlying account, current foreign-currency amount, and current base-currency value (as held by the ledger).
3. **Categorise.** Bucket each surfaced exposure into one of the four supported categories.
4. **Present.** One row per surfaced exposure: account name + type, currency code, foreign-currency amount, base-currency value, the linked XBert, source link.
5. **Route.** End with a clear recommendation: "Run the period-end FX revaluation in <ledger> for the surfaced balances above. The XBert plugin cannot compose or post the revaluation journal because the historical rates, booking rates and revaluation history needed for the calculation are not exposed in MCP today."

## Working-paper structure

1. Cover page — client name, period, generation date, base currency
2. Summary — count of surfaced exposures, distinct currencies, largest base-currency exposure
3. Per-balance list — account, type, currency, foreign-currency amount, base-currency value, linked XBert
4. Routing recommendation — which ledger native FX revaluation workflow to run, scoped to the surfaced balances
5. Source links — hyperlinks to every underlying XBert firing and account
6. QMS block — practice name + ID, preparer name + ID, timestamp, unique check reference ID, compliance statement

## Out of scope (do NOT compute, propose, or display)

The following all require data that is not exposed in MCP. Surface this honestly when the user asks:

- Intercompany AR-vs-AP mismatch reconciliation between separate organisations (cross-entity not supported)
- Period-end rate vs booking rate comparison (no historical / booking rate property)
- Last-revalued date per currency balance (no last-revalued-date property)
- Realised vs unrealised gain / loss attribution split (no realisation-status property)
- Exposures > 10% of net assets without a hedging note (no hedging-note property)
- Period-end rate source verification (no rate-source property)
- Currencies with no revaluation for more than 2 periods (no revaluation-history property)
- Weighted-average booking rate detection across mixed-rate AR / AP (no booking-rate property on lines)

## Output format

- Australian English spelling (organisation, behaviour, colour)
- Foreign-currency amounts shown with currency code (e.g. USD 1,234.56)
- Base-currency amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings in chat preview, bold key figures
- Markdown table for the per-balance list
- Never use emojis

## Always

- Never compose a revaluation journal. Never propose lines with rates the plugin cannot trace. Never invent historical rates.
- Never auto-apply; never post; never lodge.
- Read-only — the output is a list of surfaced exposures plus a routing recommendation.
- If the linked-XBerts list is empty, stop and prompt the user — do not invent a fallback.
- Be explicit when the user asks for an unsupported check: state which property is missing and why.
- Plugin surfaces — the ledger revalues. Do not blur this boundary.
