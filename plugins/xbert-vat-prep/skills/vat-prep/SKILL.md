---
name: vat-prep
description: VAT readiness methodology for UK clients — verify the client is ready to submit their VAT return to HMRC via MTD and produce a Word audit document. Use when the user asks to prep VAT, check if a client is VAT-ready, run a pre-submission review, check MTD compliance, or runs the /vat-prep slash command. Also triggers on: "is the VAT ready", "VAT quarter close", "MTD submission check", "VAT return prep".
---

# VAT Prep

A structural readiness check for a UK VAT return submission. Verifies bookkeeping is complete, balanced, and HMRC-defensible before submitting via Making Tax Digital. Produces a Word audit document with a unique check reference ID, preparer details, and supporting evidence.

## VAT framework

- **Registration threshold** — £90,000 taxable turnover (mandatory)
- **Standard rate** — 20%
- **Reduced rate** — 5%
- **Zero-rated** — 0% (food, children's clothes, books, public transport)
- **Exempt** — insurance, finance, education, health services
- **Outside scope** — wages, dividends, non-business income
- **Filing** — quarterly (standard), monthly (repayment traders), annually (Annual Accounting Scheme)
- **Deadline** — 1 month and 7 days after the end of the VAT period
- **MTD** — all VAT-registered businesses must file digitally

### VAT return boxes (HMRC)

| Box | Description |
|---|---|
| 1 | VAT due on sales and other outputs |
| 2 | VAT due on acquisitions from EU member states (NI only) |
| 3 | Total VAT due (Box 1 + Box 2) |
| 4 | VAT reclaimed on purchases and other inputs |
| 5 | Net VAT to pay or reclaim (Box 3 - Box 4) |
| 6 | Total value of sales excluding VAT |
| 7 | Total value of purchases excluding VAT |
| 8 | Total value of supplies to EU excluding VAT (NI only) |
| 9 | Total value of acquisitions from EU excluding VAT (NI only) |

## Readiness checks

1. **Data quality** — score >= 50 to proceed
2. **Lock dates** — prior period must be locked
3. **Bank reconciliation** — all accounts reconciled for the period
4. **VAT control accounts** — output and input VAT accounts reconciled, suspense at zero
5. **VAT code accuracy** — correct codes on transactions
6. **Zero-rated vs exempt** — proper classification verified
7. **Credit notes** — correct VAT treatment
8. **P&L review** — revenue consistent with Box 6, compared to prior period
9. **Balance sheet review** — VAT accounts and suspense at zero
10. **Payroll & PAYE** — PAYE / NI deductions verified, pension auto-enrolment checked
11. **Accounts payable** — outstanding bills reviewed
12. **Accounts receivable** — outstanding invoices reviewed, debtor management flagged
13. **Cash flow** — period cash movements reviewed
14. **Outstanding XBerts** — ALL block submission
15. **MTD compliance** — digital filing path verified
16. **Reverse charge** — CIS domestic reverse charge transactions identified
17. **Partial exemption** — flag if business makes both taxable and exempt supplies

## Blocking rule

**All outstanding XBerts for the period block submission.** Do not filter by risk type. Surface each unresolved XBert with the resolution instruction.

## Prior-period comparison

Always compare the current VAT period to the prior period. Flag and explain:
- Box 1 (output VAT) variance over 25%
- Box 4 (input VAT) variance over 25%
- Box 6 (sales excl VAT) variance over 25%
- New account balances appearing for the first time
- Suspense or holding accounts with material balances

## Audit document structure

Generate a Word document containing:
1. Cover page — client name, VAT number, VAT period, generation date
2. First-page summary — overall readiness status, count of blocking issues
3. Readiness sections (1-17 above) with pass/fail and evidence
4. Prior-period variance review
5. MTD compliance section
6. QMS block — practice/firm name + ID, preparer name + ID, timestamp, unique check reference ID, system version, compliance statement

## Output format

- British English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `£` prefix
- UK date format (dd/MM/yyyy)
- Markdown headings (##, ###) in chat preview
- Bold key labels and figures
- Tables for comparative data
- Never use emojis
- Always include the check reference ID

## Always

- Never auto-apply changes or resolve XBerts — read-only readiness assessment
- Name the specific account or transaction behind every blocking issue
- Reference HMRC rules where relevant
- Flag MTD compliance issues explicitly — submission cannot proceed without it
- The document must be filable without further editing
