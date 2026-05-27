---
name: gst-prep-nz
description: GST readiness methodology for New Zealand clients — verify the client is ready to file their GST101A return with the IRD and produce a Word audit document. Use when the user asks to prep NZ GST, check if a client is GST-ready, run an IRD GST readiness review, or runs the /gst-prep-nz slash command. Also triggers on: "is the GST ready", "GST period close", "IRD filing readiness", "NZ GST101A prep".
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# GST Prep (NZ)

A structural readiness check for a New Zealand GST101A filing. Verifies bookkeeping is complete, balanced, and audit-defensible before filing with the IRD. Produces a Word audit document with a unique check reference ID, preparer details, and supporting evidence.

## GST framework

- **Standard rate** — 15%
- **Zero-rated** — 0% (exports etc.)
- **Filing frequency**:
  - Monthly — turnover over $24M
  - Two-monthly (default) — $500K to $24M
  - Six-monthly — under $500K
- **Standard due date** — 28th of month following period end
- **March period exception** — due 7 May (not 28 April)
- **November period exception** — due 15 January (not 28 December)

### GST101A boxes

| Box | Description |
|---|---|
| 5 | Total sales and income (including GST and zero-rated) |
| 6 | Zero-rated supplies (exports etc.) |
| 7 | Taxable sales (Box 5 - Box 6) |
| 8 | GST on sales (Box 7 x 3/23) |
| 9 | Debit adjustments |
| 10 | Total GST collected (Box 8 + Box 9) |
| 11 | Total purchases and expenses (including GST) |
| 12 | GST on purchases (Box 11 x 3/23) |
| 13 | Credit adjustments |
| 14 | Total GST credit (Box 12 + Box 13) |
| 15 | Net GST payable / refund (Box 10 - Box 14) |

## Period determination

### Two-monthly (default)
Jan-Feb, Mar-Apr, May-Jun, Jul-Aug, Sep-Oct, Nov-Dec

### Monthly (large businesses)
Each calendar month

### Six-monthly (small businesses)
Based on balance date — e.g. Apr-Sep / Oct-Mar for March balance date, Jan-Jun / Jul-Dec for July balance date

### Auto-detection
When `gstPeriod` is not provided, select the most recent completed period:
- Two-monthly — 7-day buffer
- Six-monthly — 14-day buffer

### Accepted period formats
- Two-monthly: "Jan-Feb 2026", "Nov-Dec 2025"
- Monthly: "Jan 2026", "January 2026"
- Six-monthly: "Jul-Dec 2025", "Jan-Jun 2026"

## Readiness checks

1. **Bank reconciliation** — every bank account reconciled for the period
2. **GST data** — boxes 5 through 15 computed from sales and purchases
3. **P&L review** — income and expenses compared to prior period
4. **Balance sheet review** — balances compared to prior period
5. **Fixed assets** — draft assets identified, depreciation current
6. **Accounts payable** — outstanding bills reviewed
7. **Accounts receivable** — outstanding invoices reviewed, debtor management flagged
8. **Cash flow** — period cash movements reviewed
9. **Outstanding XBerts** — ALL block lodgement, no exceptions
10. **Liability balances** — GST, PAYE, KiwiSaver accounts verified

## Blocking rule

**All outstanding XBerts for the period block lodgement.** Do not filter by risk type.

## Prior-period comparison

Always compare current GST period to the prior. Flag and explain:
- Box 8 (GST on sales) variance over 25%
- Box 12 (GST on purchases) variance over 25%
- Box 15 (net GST) flip from payable to refund or vice versa
- New account balances appearing for the first time

## Audit document structure

Generate a Word document containing:
1. Cover page — client name, IRD number, GST period, generation date
2. First-page summary — overall readiness status, count of blocking issues
3. Readiness sections (1-10 above) with pass/fail and evidence
4. GST boxes 5-15 table with computed values
5. Prior-period variance review
6. QMS block — practice / firm name + ID, preparer name + ID, timestamp, unique check reference ID, system version, compliance statement

## Output format

- New Zealand English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `$` prefix
- NZ date format (dd/MM/yyyy)
- Markdown headings (##, ###) in chat preview
- Bold key labels and figures
- Tables for comparative data
- Never use emojis
- Always include the check reference ID

## Always

- Never auto-apply changes or resolve XBerts — read-only readiness assessment
- Name the specific account or transaction behind every blocking issue
- Respect the March / November special due dates
- If the user does not specify a period, ask before defaulting
- The document must be filable without further editing
