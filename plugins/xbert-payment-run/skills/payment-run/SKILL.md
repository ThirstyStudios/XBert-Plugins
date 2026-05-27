---
name: payment-run
description: "Plan the week's pay run — inclusion/exclusion logic, supplier grouping, prioritisation, and per-supplier remittance drafting. Use this skill when the user asks to prep the pay run, draft remittances, decide what to pay this week, or runs the /payment-run slash command. Also triggers on: 'weekly pay schedule', 'what to pay this week', 'remittance advice drafts', 'supplier payment list'. v1 scope: schedule + remittances; ABA file generation is v2 (still happens in the ledger)."
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Payment Run

## Goal
Decide what to pay this week, what to exclude (and why), group by supplier, and draft the remittance advice per supplier ready for review. v1 stops at draft remittances; ABA payment file generation still happens in the ledger because the plugin doesn't ship that capability yet.

## Metrics
- **Run total** — sum of included bill amounts.
- **Supplier count** — number of distinct suppliers on the run.
- **Exclusion count** — bills excluded with reason categories (held / disputed / unapproved / outside-window / zero-outstanding).
- **Cashflow check** — run total vs available bank balance.

## Default thresholds (practice-configurable)
| Band | Threshold |
|---|---|
| Default pay window | due in next 7 days OR overdue |
| Cashflow warning | run total > 80% of available bank balance |
| Cashflow stop | run total > available bank balance (require user override) |
| Early-payment discount window | discount available + due within 14 days = prioritise inclusion |
| Materiality for exclusion summary | $100 — bills below this roll into "small excluded balances" |

## Process / rules

### Inclusion logic
A bill is **included** if all of:
- Status = awaiting payment
- Approval status = approved
- Due date within the pay window OR already overdue
- No hold flag set
- No dispute marker set
- Outstanding amount > 0

### Exclusion logic (surface with reason)
A bill is **excluded** for any of:
- **Held**: on-hold flag set — bookkeeper or client has flagged not-to-pay
- **Disputed**: dispute marker set — supplier is being challenged
- **Unapproved**: status = awaiting approval, not awaiting payment
- **Outside-window**: due after the pay window AND not overdue
- **Zero or negative outstanding**: already paid or credited

Never silently drop a bill. Every excluded bill appears in the exclusions list with its reason.

### Prioritisation (when cashflow is tight)
If the run total exceeds 80% of available bank balance:
1. Surface a cashflow warning.
2. Rank bills by composite score:
   - +10 if early-payment discount window active
   - +5 per week overdue
   - +5 if supplier flagged as critical/strategic
   - -5 if supplier has a long payment-terms relationship (60+ days)
3. Offer the user the option to defer the bottom-N bills to next week's run.

### Supplier grouping
- Group all included bills by supplier
- One remittance per supplier (never per bill)
- Include: bill reference, bill date, bill amount, total amount paid
- Remittance template: supplier name, payment date, payment method, list of bills paid, total, contact details for queries

### Remittance file naming
`<client-shortname>-remittance-<supplier-shortname>-<yyyy-mm-dd>.pdf` — keeps remittances findable and unambiguous when reviewing the run later.

## Always
- Never auto-pay; never generate the ABA file (v1 limitation — that stays in the ledger)
- Never silently exclude a bill; always show the exclusion reason
- Always run the cashflow check; warn at 80%, require explicit override above 100%
- Always group by supplier; one remittance per supplier, never per bill
- Always preserve the early-payment discount opportunity if it exists — surface it on the schedule
- Note when a supplier has no email on file — remittance still drafted but flag for manual send method
- Australian English in all remittance text (organisation, behaviour, programme, recognised)
