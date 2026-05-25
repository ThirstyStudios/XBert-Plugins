---
name: fbt-prep
description: Annual FBT exposure scan for Australian clients — identify potential fringe benefit tax triggers from motor vehicles, entertainment, employee benefits and financial arrangements, estimate the liability, and produce a Word working paper. Use when the user asks to run an FBT review, scan for fringe benefit exposure, prep an FBT return, or runs the /fbt-prep slash command. Also triggers on: "FBT exposure check", "company car FBT", "entertainment FBT", "annual FBT review".
---

# FBT Prep

An annual exposure scan for Australian Fringe Benefits Tax. Identifies expense and balance sheet items that may trigger FBT, estimates the liability with the correct gross-up applied, and produces a Word working paper for the file.

## FBT framework

- **FBT year** — 1 April to 31 March
- **FBT rate** — 47% (top marginal rate + Medicare levy)
- **Gross-up factors** — Type 1 (GST credits available) 2.0802, Type 2 (no GST credits) 1.8868
- **Return due** — 21 May (or 25 June via registered tax agent)
- **Quarterly instalments** apply for FBT instalment payers
- **Minor benefits exemption** — benefits under $300, infrequent and irregular, are exempt
- **Reportable Fringe Benefits** — grossed-up value over $2,000 per employee must report via STP/payment summary
- **Small business car parking exemption** — turnover under $10M, employer-provided parking exempt

## Trigger taxonomy

### Motor vehicles
- Fuel, registration, insurance, maintenance, lease payments
- Parking (non-business)
- Toll charges
- Cross-reference against fixed asset register for company-owned vehicles
- Methods: statutory formula (20% of base value) or operating cost (logbook)

### Entertainment and meals
- Entertainment expense accounts
- Staff amenities
- Client entertainment
- Christmas parties and social events
- Food and drink expenses
- Methods: 50/50 split or actual; minor & infrequent exemption applies

### Employee benefits
- Private health insurance
- Gym memberships
- Education / training (not employment-related)
- Housing / accommodation
- Relocation expenses
- Tool / equipment allowances for personal use
- Personal use of company assets

### Financial benefits
- Low-interest or interest-free employee loans
- Debt waivers
- Salary packaging arrangements (novated leases, meal entertainment cards)

### Exempt benefits (flag for documentation)
- Work-related items
- Portable electronic devices (one per FBT year)
- Tools of trade

## Quantification

For each potential FBT item:
1. Identify the taxable value (cost, statutory percentage, or operating cost)
2. Apply the appropriate gross-up factor (Type 1 if GST credits claimed on the underlying expense, Type 2 otherwise)
3. Apply 47% FBT rate
4. Note exemption status (exempt, concessional, fully taxable)
5. Assess against the minor benefits threshold

## Risk classification

**High Risk**
- Company-owned motor vehicles with no logbook records
- Large entertainment expenses with no FBT return filed
- Employee loans at below-market rates without FBT treatment
- Salary packaging arrangements without FBT calculations
- No FBT return filed despite apparent benefits

**Medium Risk**
- Mixed personal / business vehicle use without clear records
- Entertainment expenses that may include non-deductible FBT items
- Staff amenities approaching thresholds
- Inconsistent treatment of similar benefits across employees

**Low Risk**
- Minor benefits clearly under $300 threshold
- Properly documented exempt benefits
- Small entertainment amounts within minor benefit rules

## Audit document structure

Generate a Word document containing:
1. Cover page — client name, ABN, FBT year, generation date
2. Executive summary — total estimated FBT exposure, top 3 categories, recommended actions
3. One section per benefit category with underlying transactions, gross-up, estimated FBT
4. Reportable Fringe Benefit candidates
5. Filing obligations and key dates
6. Assumptions, exclusions, recommended next steps

## Output format

- Australian English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings (##, ###) in chat preview
- Bold key risk items and estimated FBT amounts
- Tables for benefit summaries
- Never use emojis
- Reference specific FBT legislation where relevant

## Always

- Never apply FBT calculations to the ledger — read-only exposure scan
- Name the specific account or transaction behind every flagged benefit
- State assumptions explicitly (statutory formula vs operating cost, days of private availability)
- Distinguish estimated FBT from final FBT — the working paper is a starting point for the return, not the return itself
