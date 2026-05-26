---
name: fx-review
description: FX-review methodology for period-end revaluation — surface unrevalued balances and intercompany mismatches caught by deterministic FX XBerts, propose the revaluation journal, capture partner approval. Use when the user asks to review FX exposure, propose a revaluation journal, reconcile intercompany FX, run a period-end FX sweep, or runs the /fx-review slash command. Also triggers on: "FX revaluation", "foreign currency reval", "period-end FX", "intercompany FX mismatch".
---

# FX Review

A period-end review of every FX-exposure XBert that fired across the period. Detection is owned deterministically by Custom XBerts (the XBerts are the heroes); this skill orchestrates the review and proposes the revaluation journal for partner approval. Plugin proposes — partner posts.

## Goal

Convert the period's FX-exposure XBert firings into a proposed revaluation journal that the partner can approve line by line, with supporting rate evidence and intercompany reconciliation captured in one working paper.

## FX exposure patterns

| Pattern | Detected by linked XBerts |
|---|---|
| Unrevalued foreign balance | Foreign-currency balance posted but not revalued at period end |
| Intercompany FX mismatch | Two related entities trading in different currencies with mismatched values |
| FX bank account | Foreign-currency bank account requiring period-end revaluation |
| FX AR / AP | Foreign-currency receivable or payable with rate movement since last revaluation |

## Metrics

- **Balances surfaced for revaluation** — count of accounts requiring a revaluation line
- **Net FX gain or loss** — period impact on the P&L
- **Intercompany mismatches** — count and net value of mismatches reconciled in this pass
- **Materiality cutoff** — balances below the firm's threshold may be aggregated
- **Approval outcome per line** — approved, rejected with reason, deferred

## Methodology

1. **Linked XBerts gate.** If no XBerts are linked to the FX Review agent in the Connect portal for the client, STOP. Tell the user to configure linked XBerts first.
2. **Pull firings.** For every linked FX XBert, pull the period's firings with the underlying accounts, foreign-currency balances, posting-date rates and period-end rates.
3. **Resolve rates.** For every balance requiring revaluation, capture the rate at posting (or last revaluation), the period-end rate, and the source of the rate.
4. **Compute revaluation lines.** Per balance: source amount in foreign currency, rate at posting, rate at period end, FX gain or loss, offsetting P&L line.
5. **Reconcile intercompany.** Where two related entities have mismatched FX values, propose the reconciling lines in the same journal.
6. **Aggregate below materiality.** Balances below the firm's materiality threshold may be aggregated into a single line with a footnote.
7. **Present to partner.** Line by line with the source XBert link and supporting rate evidence. Capture explicit approval, rejection (with reason), or deferral per line.

## Working-paper structure

1. Cover page — client name, period, generation date, base currency
2. Summary — net FX gain or loss, count of lines, intercompany reconciliations
3. Journal preview — proposed lines with source amount, rates, gain/loss, P&L line
4. Supporting rates — period-end rate by currency with source
5. Intercompany section — mismatches with the reconciling lines
6. Partner sign-off — per-line approval, rejection or deferral
7. Source links — hyperlinks to every underlying XBert firing and account
8. QMS block — practice name + ID, preparer name + ID, timestamp, unique check reference ID, compliance statement

## Output format

- Australian English spelling (organisation, behaviour, colour)
- Foreign-currency amounts shown with currency code (e.g. USD 1,234.56)
- Base-currency amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings in chat preview, bold key figures
- Tables for the journal preview and supporting rates
- Never use emojis

## Always

- Never auto-apply; never lodge; never send. Output is for review.
- Plugin proposes — partner posts. The revaluation journal is partner-signed before entry to the ledger
- If the linked-XBerts list is empty, stop and prompt the user — do not invent a fallback
- Every proposed line must show the source amount, both rates, and the gain or loss
- Intercompany mismatches must reconcile to zero in the proposed journal
- Materiality aggregations need an explicit footnote naming the threshold used
