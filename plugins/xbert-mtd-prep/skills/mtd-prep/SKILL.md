---
name: mtd-prep
description: Making Tax Digital for Income Tax readiness assessment for UK clients — assess chart of accounts mapping to HMRC categories, determine income threshold and mandate date, check simplified vs full reporting eligibility, identify issues before quarterly digital reporting. Use when the user asks about MTD readiness, MTD for ITSA, chart-to-HMRC mapping, MTD threshold, or runs the /mtd-prep slash command. Also triggers on: "is the client MTD ready", "MTD ITSA assessment", "HMRC category mapping", "quarterly MTD reporting".
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# MTD Prep

A readiness assessment for UK Making Tax Digital for Income Tax Self Assessment. Determines whether the client's bookkeeping is mapped, classified, and structured for MTD quarterly reporting to HMRC.

## MTD ITSA framework

### Mandate timeline

| Qualifying income | Mandatory from |
|---|---|
| Over £50,000 | 6 April 2026 |
| £30,000 - £50,000 | 6 April 2027 |
| £20,000 - £30,000 | 6 April 2028 (proposed) |
| Under £20,000 | Voluntary |

### What is qualifying income

- Self-employment income (SA103)
- Property income (SA105)
- Both combined for threshold determination

PAYE wages, dividends and pensions do **not** count towards the MTD threshold.

### Simplified reporting

- Under £90,000 annual turnover: two-line / three-line accounts format permitted
- Over £90,000: full HMRC category breakdown required

## HMRC self-employment categories (SA103)

- Car, van and travel expenses
- Rent, rates, power and insurance costs
- Repairs and renewals of property and equipment
- Phone, fax, stationery and other office costs
- Advertising and marketing
- Business entertaining costs
- Interest on bank and other loans
- Bank, credit card and other financial charges
- Irrecoverable debts written off
- Accountancy, legal and other professional fees
- Depreciation and loss/profit on sale of assets
- Other business expenses
- Cost of goods bought for resale
- Wages, salaries and other staff costs

## HMRC property categories (SA105)

- Rent paid, repairs, insurance and costs of services
- Loan interest and other financial costs (split residential vs commercial)
- Legal, management and other professional fees
- Other allowable property expenses

## Readiness checks

| Check | Description |
|---|---|
| Unmapped accounts | Flag custom accounts not mapped to HMRC categories |
| Split coding needed | Identify expenses requiring business / personal allocation |
| Missing categories | Alert if expected HMRC categories have no transactions |
| Income threshold | Determine MTD obligation (over £50K / £30K / £20K) |
| Simplified eligibility | Check if under £90K for two-line reporting |
| Property separation | Ensure property and self-employment income are separate |
| Finance cost separation | Verify residential vs commercial mortgage costs are split |

## Severity classification

- **High** — must be resolved before MTD reporting (unmapped income, mixed property / self-employment, missing splits)
- **Medium** — should be reviewed but may not block (custom accounts that can be mapped at quarter end)
- **Low** — advisory (alignment recommendations)

## Working paper structure

Generate a Word document containing:
1. Cover page — client name, UTR, income types covered, generation date
2. Readiness status — MTD Ready / MTD Not Ready
3. MTD obligation — mandatory from when, threshold tier, voluntary option
4. Income summary — self-employment and property separately, qualifying income totalled
5. Chart-to-HMRC mapping audit — unmapped accounts by severity with recommended category
6. Simplified vs full reporting determination
7. Actions required per finding
8. QMS block — practice / firm name + ID, preparer name + ID, timestamp, check reference ID

## Output format

- British English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `£` prefix
- UK date format (dd/MM/yyyy)
- Markdown headings (##, ###) in chat preview
- Bold severity labels and account names
- Tables for mapping audit
- Never use emojis

## Always

- Only count qualifying income (self-employment + property) for threshold
- Distinguish PAYE / dividends / pensions — they do not count
- Property and self-employment income must be tracked separately
- Residential and commercial finance costs must be separated (different relief rules)
- If a client straddles two threshold tiers, use the most recent completed year for the determination and note the trend
- The working paper must be filable as evidence the MTD readiness was assessed
