---
name: super-check
description: Quarterly Superannuation Guarantee check for Australian clients — verify SG calculated, posted, paid through the clearing house, and lodged by the 28th deadline. Quantifies SGC risk where super is late or missed. Use when the user asks to check super, run an SG review, reconcile the clearing house, check super deadline, or runs the /super-check slash command. Also triggers on: "is super paid", "SG quarterly check", "super clearing house reconciliation", "SGC risk".
---

# Super Check

A quarterly SG verification for Australian employers. Confirms super is calculated at the current 12% rate, posted to the liability account, lodged with the clearing house, and paid by the 28th of the month following the quarter end. Quantifies SGC exposure for late or missed payments.

## SG framework

| Item | Value |
|---|---|
| SG rate | 12% (from 1 July 2025) |
| Base | Ordinary Time Earnings (OTE) |
| Quarter end | 30 Sep, 31 Dec, 31 Mar, 30 Jun |
| Payment deadline | 28th of month following quarter end |
| Payment method | SuperStream-compliant clearing house |
| Maximum contribution base | Indexed annually (per-quarter cap on OTE for SG) |

### Eligibility
- Employees aged 18+ paid wages
- Under 18 only if working more than 30 hours per week
- Contractors paid principally for labour treated as employees for SG
- Excludes some non-resident, defence, foreign-executive cases

### Ordinary Time Earnings (OTE)
- Gross salary / wages for ordinary hours
- Includes shift loadings, commissions, allowances paid for ordinary hours
- Excludes overtime, expense reimbursements, redundancy / termination payments
- The OTE basis vs gross-wages basis is the most common source of underpayment

## Readiness checks

1. **Eligibility** — every employee on the payroll assessed against SG eligibility rules
2. **OTE basis** — SG calculated on OTE, not on gross wages including overtime
3. **Rate** — 12% applied for the quarter (note transitional rate if quarter spans rate change)
4. **Payrun posting** — every payrun in the quarter posted with super calculated
5. **Liability posting** — super liability account credit matches sum of payrun super
6. **Clearing house lodgement** — lodgement reference exists for the quarter
7. **Bank payment** — bank debit clears the super liability account
8. **Deadline** — bank payment date on or before the 28th
9. **Fund details** — every employee has a current fund and member number
10. **Maximum contribution base** — high-earner OTE checked against the indexed cap

## Late-payment / SGC risk

If super is paid after the 28th:
- **Days late** — calendar days from the deadline to the bank payment date
- **SGC base — broader than SG.** Once SG is late, the SGC shortfall is calculated on **total salary and wages**, NOT on OTE. This is a wider base, so the SGC can exceed the original SG that was missed. Quote the SGC explicitly against total salary and wages per employee.
- **SGC components** — (a) shortfall amount on the total-salary-and-wages base + (b) nominal interest at 10% pa from the start of the quarter to the lodgement date + (c) administration fee of $20 per employee per quarter
- **Tax treatment** — SGC is NOT tax deductible (unlike on-time SG which is)
- **Lodgement** — SGC statement due 1 month after the 28th deadline (SGAA 1992 s17)

Surface the estimated SGC liability per employee and total. Recommend immediate payment to limit further interest.

## Working paper structure

Generate a Word document containing:
1. Cover page — client name, ABN, SG quarter, generation date
2. First-page summary — total SG paid, deadline status, SGC exposure if any
3. Per-employee contribution table — name, gross pay, OTE, SG rate, SG amount, fund, member ID, lodgement reference, bank payment date
4. Liability-to-bank trace — super liability opening, payrun credits, clearing house debit, closing balance
5. SGC-risk section — any late or missed employees with calculated SGC
6. Blocking issues — missing fund details, employees without OTE assessed, unposted payruns
7. QMS block — practice, preparer, timestamp, check reference ID

## Output format

- Australian English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings (##, ###) in chat preview
- Bold deadline-critical items
- Tables for per-employee contribution
- Never use emojis

## Always

- Never auto-pay super — read-only check
- Name the specific employee behind every blocking issue or SGC risk
- Distinguish OTE from gross wages — the most common source of SG underpayment
- The working paper must be filable as evidence the SG was paid on time
- If the 28th has not yet passed, frame the check as pre-deadline; if it has, frame as compliance verification
