---
name: bas-prep
description: BAS readiness methodology for Australian clients — verify the client is ready to lodge a Business Activity Statement with the ATO and produce a Word audit document with the supporting evidence. Use when the user asks to prep a BAS, check if a client is BAS-ready, do BAS preparation, run a pre-lodgement review, or runs the /bas-prep slash command. Also triggers on: "is the BAS ready", "BAS quarter close", "lodgement readiness check", "pre-lodgement sweep".
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# BAS Prep

A structural readiness check for an Australian BAS lodgement. Verifies bookkeeping is complete, balanced, and audit-defensible before lodging with the ATO. Produces a Word audit document with a unique check reference ID, preparer details, and the supporting evidence behind every readiness decision.

## What a BAS reports

| Section | Labels | Description |
|---|---|---|
| GST | G1, G2, G3, G10, G11, 1A, 1B | Sales and purchases GST collected / paid |
| PAYG Withholding | W1, W2, W3, W4, W5 | Tax withheld from wages |
| PAYG Instalments | T1, T2, T3, T4, T7, T8, T9, T11 | Business income tax instalments |
| FBT Instalments | F-labels | If FBT instalment payer |

**PAYG-I labels:** T1 = instalment income (gross business + investment income, option 1 core field). T2 = applied rate. T3 = new varied rate (if varying). T4 = reason code for option-1 variation. T7 = reason code for option-2 variation. T8 = variation amount. T9 = instalment amount. T11 = varied instalment amount (option 2).

Standard GST rate 10%. Quarterly (default) or monthly filers. **Quarterly BAS due dates (electronic, tax-agent concessions apply):**

| Quarter | Period | Lodgement due |
|---|---|---|
| Q1 | Jul-Sep | 28 October |
| Q2 | Oct-Dec | **28 February** (extra month for Christmas/January) |
| Q3 | Jan-Mar | 28 April |
| Q4 | Apr-Jun | 28 July |

## Readiness checks

1. **Bank reconciliation** — every bank account reconciled to statement balance for the BAS period
2. **GST data** — G1 (total sales incl GST), G2 (export sales GST-free), G3 (other GST-free sales), G10 (capital purchases incl GST), G11 (non-capital purchases incl GST). 1A = G1 / 11. 1B = (G10 + G11) / 11
3. **PAYG withholding** — W1 gross wages, W2 tax withheld, W3 other withholding, W4 no-ABN withholding, W5 = W2 + W3 + W4. Tied back to payrun totals
4. **Payroll data** — payruns posted for every period in the BAS quarter
5. **Superannuation** — SG posted for all eligible employees, paid by 28th of month following quarter end (currently 12% from 1 July 2025)
6. **P&L review** — income and expenses compared to prior BAS period, variances explained
7. **Balance sheet review** — control account balances compared to prior period
8. **Fixed assets** — draft assets identified, depreciation current, G10 verified against fixed asset additions
9. **Accounts payable** — outstanding bills reviewed
10. **Accounts receivable** — outstanding invoices reviewed, aged debtor management flagged
11. **Cash flow** — period cash movements reviewed for unusual patterns
12. **Outstanding XBerts** — ALL outstanding XBerts block lodgement. No filtering by risk type
13. **Liability balances** — GST, PAYGW, Super, Wages control accounts verified against expected balances

## Blocking rule

**All outstanding XBerts for the period block lodgement.** This ensures data quality is satisfied before BAS is filed. Do not filter by risk type. Surface each unresolved XBert with the resolution instruction; do not auto-resolve.

## Prior-period comparison

Always compare the current BAS period to the prior BAS period. Flag and explain:
- GST collected (1A) variance over 25%
- PAYG-W (W2) variance over 15%
- Wages expense variance over 15%
- New account balances appearing for the first time
- Account balances dropping to zero that had material movement previously

## Audit document structure

Generate a Word document containing:
1. Cover page — client name, ABN, BAS period, generation date
2. First-page summary — overall readiness status, count of blocking issues
3. Readiness sections (1-13 above) with pass/fail and evidence
4. Prior-period variance review
5. QMS block — practice/firm name + ID, preparer name + ID, timestamp, unique check reference ID, system version, compliance statement

Note: audit notes are created without user assignment — they exist as audit record only.

## Output format

- Australian English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings (##, ###) in chat preview
- Bold key labels and figures
- Tables for comparative data
- Never use emojis
- Always include the check reference ID

## Always

- Never auto-apply changes or resolve XBerts — read-only readiness assessment
- Name the specific account or transaction behind every blocking issue
- If a data source is unavailable, state it explicitly and degrade gracefully
- Include all data needed for audit completeness — the document must be filable without further editing
