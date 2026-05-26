---
name: stp-finalisation
description: Annual STP Phase 2 finalisation review for Australian clients — verify every employee's YTD payroll figures, income type, allowance disaggregation, RFB and termination payments before the 14 July FINAL event. Use when the user asks to run STP finalisation, finalise payroll for the year, check STP Phase 2 readiness, prep the income statement, or runs the /stp-finalisation slash command. Also triggers on: "STP year end", "income statement finalisation", "send FINAL event", "STP Phase 2 review".
---

# STP Finalisation

An annual reconciliation of every employee's year-to-date payroll figures against STP Phase 2 reporting requirements. Produces a Word working paper to file alongside the FINAL event submission.

## STP Phase 2 framework

- **Deadline** — 14 July for non-closely-held employees. **Closely-held payees:** finalisation is due by the payee's own individual tax return due date — NOT a flat 31 July. The historic "31 July for closely held" rule no longer applies; small employers must align finalisation to each closely-held payee's return-due date.
- **What is sent** — a FINAL event marking each employee's YTD figures as complete for the year
- **Locks** the employee income statement for tax return purposes
- **Corrections** after FINAL require a replacement FINAL event with revised YTD

### Phase 2 expanded reporting (vs Phase 1)
- Income types broken out per payee (Salary/Wages, Closely Held Payees, Working Holiday Makers, Foreign Employment, Inbound Assignees, Voluntary Agreement, Labour Hire)
- Tax treatment codes (6-character) replacing single tax categories
- Disaggregated gross — wages, paid leave, allowances, bonuses, commissions, overtime, directors' fees, lump sums all reported separately
- Allowance categories itemised (car, transport, laundry, meals, travel, tasks, qualifications, tool, KM, overtime meal, other)
- Country code for WHM employees
- Salary sacrifice (super, OTE) reported as a category

## Readiness checks

### Per-employee YTD reconciliation
1. Gross wages — sum of all payrun gross matches the YTD reported figure
2. PAYG withholding — sum of all payrun tax withheld matches YTD
3. Super — total SG plus salary-sacrificed super matches YTD super liability movements per employee
4. Allowances — each allowance type reconciled per category
5. Reportable Fringe Benefits — grossed-up value over $2,000 reported
6. Termination payments — ETP, lump sum A/B/D/E correctly classified
7. Salary sacrifice — super (post-tax category) and other (pre-tax) split correctly

### Classification verification
1. Income type assigned correctly per employee
2. Tax treatment code valid for the income type
3. Country code populated for WHM employees
4. Closely Held Payees flagged (different deadlines, can use estimated YTD)

### Blocking issues
1. Missing TFN — employee tax file number not recorded
2. Missing address — required for STP reporting
3. Unposted payruns within the year
4. Payrun period falls outside the financial year being finalised
5. Outstanding XBerts touching payroll or super

## Working paper structure

Generate a Word document containing:
1. Cover page — client name, ABN, financial year, generation date
2. First-page summary — employee count, items needing correction, FINAL readiness
3. Per-employee YTD table — gross, PAYG-W, super, allowances by type, RFB, ETP / lump sums
4. Classification verification per employee — income type, tax treatment code, country code
5. Items requiring correction — specific action per item, ordered by employee
6. RFB section — employees with grossed-up RFB over $2,000
7. Termination payments section — every ETP / lump sum with classification
8. QMS block — practice, preparer, timestamp, check reference ID

## Output format

- Australian English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings (##, ###) in chat preview
- Bold employees and items needing correction
- Tables for per-employee YTD data
- Never use emojis

## Always

- Never send the FINAL event from the plugin — the bookkeeper sends it from the ledger after reviewing corrections
- Name the specific employee and field behind every correction
- Distinguish blocking issues (must fix before FINAL) from advisory items (recommended but not required)
- If FINAL has already been sent, frame the document as compliance verification — and surface any post-FINAL correction needs
- The working paper must be filable as evidence the YTD figures were reviewed before FINAL
