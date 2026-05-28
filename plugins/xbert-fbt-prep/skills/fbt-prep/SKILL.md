---
name: fbt-prep
description: Annual FBT exposure scan for Australian clients — identify potential fringe benefit tax triggers from motor vehicles, entertainment, employee benefits and financial arrangements, estimate the liability, and produce a Word working paper. Use when the user asks to run an FBT review, scan for fringe benefit exposure, prep an FBT return, or runs the /fbt-prep slash command. Also triggers on: "FBT exposure check", "company car FBT", "entertainment FBT", "annual FBT review".
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

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
- **Small business car parking exemption** (s58GA ITAA 1936) — employer-provided parking is exempt if EITHER (a) total ordinary income for the year before the FBT year is less than $10M, OR (b) the employer is a small business entity with aggregated turnover less than $50M (extended to the $10M-$50M band from 1 April 2021). Clients in the $10M-$50M band still qualify under limb (b) — do not apply the old $10M-only test.

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

## Payload schema

After running the readiness checks, structure the result as JSON conforming to the render-docx payload schema (defined in `xbert-working-paper/skills/render-docx/SKILL.md`). Required fields:

- `plugin`: `"xbert-fbt-prep"`
- `check_reference_id`: a unique ID for the run (e.g. `FBT-2026-<tenantId>-001`)
- `tenant_name`, `period`, `prepared_by`, `prepared_at`
- `title`, `subtitle` (optional)
- `executive_summary`: two sentences naming the headline finding and overall readiness verdict
- `sections[]`: one entry per major readiness area, each with `heading`, `body`, optional `blocking: true`, optional `table` with `columns` and `rows`
- `qms_block`: `{ firm_name, preparer, reviewer, certification }`
- `appendix[]` (optional)

Section ordering and content must match the audit-document structure described above.

## Output handoff

1. Save the payload to `outputs/<check_reference_id>/payload.json`.
2. Invoke the `xbert-working-paper:render-docx` skill. It will write `outputs/<check_reference_id>/working-paper.docx` and emit a single JSON line on stdout with `status`, `path`, `exists`, `size_bytes`, `opens_cleanly`, `paragraph_count`.
3. Pass through to the user the path and the summary line the render skill prescribes (`Working paper saved to <path> — N sections, M blocking issues`).

## Verification gate

Do not report the working paper as produced until the render skill's JSON has `status == "ok"` and `opens_cleanly == true`. If the gate fails, surface the JSON to the user verbatim and stop — do not retry silently and do not claim success.
