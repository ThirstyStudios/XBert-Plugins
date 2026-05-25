---
name: paye-prep
description: PAYE, payroll and pension control account review for UK clients — reconcile to HMRC RTI submissions, verify auto-enrolment compliance, surface aged balances. Use when the user asks to review PAYE, reconcile the PAYE control, check pension auto-enrolment, run a payroll compliance review, or runs the /paye-prep slash command. Also triggers on: "PAYE control review", "PAYE reconciliation", "auto-enrolment check", "HMRC payroll compliance".
---

# PAYE Prep

A control-account review for UK PAYE, payroll and pension compliance. Reconciles each control account to source, verifies auto-enrolment, surfaces aged balances, and produces a Word audit document.

## Framework

### HMRC PAYE deadlines

- Monthly PAYE — due by the 22nd of the following month (electronic) or 19th (cheque)
- Quarterly PAYE — only for small employers with average monthly liability under £1,500

### RTI submissions

- **FPS** (Full Payment Submission) — sent every pay day with employee earnings, deductions, NI
- **EPS** (Employer Payment Summary) — sent for adjustments (SMP, SSP, CIS deductions, no payments)
- PAYE control account should reconcile to RTI totals

### Pension auto-enrolment

- Minimum employer contribution — 3%
- Minimum total contribution — 8%
- Applied to qualifying earnings (lower and upper limits indexed annually)
- Some schemes use full pay basis instead — verify against the scheme rules

### NIC categories

- A — standard
- B — married women / widows reduced rate (rare)
- C — over state pension age
- H — apprentice under 25
- J — deferred
- M / Z — under 21
- Check each employee against age and contribution history

### Student loan deductions

- Plan 1, Plan 2, Plan 4, Plan 5
- Each plan has different threshold and rate
- Verified against employee's tax code / starter declaration

## Readiness checks

1. **PAYE control account** — reconciles to RTI submissions; aged balances over three months flagged
2. **Payroll control account** — gross pay matches payroll reports; unreconciled items investigated
3. **Pension liability** — employer plus employee contributions match scheme statement; auto-enrolment rates compliant
4. **NIC categories** — each employee on the right category for age and contribution history
5. **Student loans** — correct plan applied; thresholds respected
6. **HMRC payment timing** — bank payment matches PAYE liability and lands by 22nd
7. **CIS deductions** — if applicable, deduction accuracy and EPS coverage
8. **Record keeping** — three years of payroll records retained

## Risk classification

**High Risk**
- Control accounts with aged balances over three months old
- Balances that don't match expected HMRC amounts
- Missing pension contributions or contribution rates below the minimum
- HMRC payment late or missing

**Medium Risk**
- Minor timing differences
- Rounding discrepancies
- Partially reconciled items

**Low Risk**
- Small timing differences within acceptable range

## Audit document structure

Generate a Word document containing:
1. Cover page — client name, PAYE reference, period, generation date
2. First-page summary — compliance status, count of issues
3. PAYE control reconciliation — opening, payrun postings, HMRC payment, closing balance
4. Payroll control reconciliation — gross pay matched to payroll reports
5. Pension liability reconciliation — employer plus employee, qualifying earnings, rates
6. Aged-balance section — any balance over three months with the period it relates to
7. HMRC deadline status — next payment due, amount, days until deadline
8. Auto-enrolment compliance per employee
9. QMS block — practice / firm name + ID, preparer name + ID, timestamp, check reference ID

## Output format

- British English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `£` prefix
- UK date format (dd/MM/yyyy)
- Markdown headings (##, ###) in chat preview
- Bold deadline-critical items and aged balances
- Tables for control account reconciliations
- Never use emojis
- Reference HMRC rules where relevant

## Always

- Never auto-clear control account balances — read-only review
- Name the specific account and period behind every aged balance
- Distinguish RTI reporting compliance from payment compliance — they are separate obligations
- The document must be filable as evidence the controls were reconciled and pension compliance was checked
