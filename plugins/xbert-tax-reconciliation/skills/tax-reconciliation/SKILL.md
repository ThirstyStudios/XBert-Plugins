---
name: tax-reconciliation
description: Walk accounting profit to taxable income for a year-end tax reconciliation worksheet — company, trust, or partnership structure, with every adjustment tied to its source journal or account. Use when the user asks for the tax reconciliation, the accounting-to-tax walk, the Schedule M, the year-end tax worksheet, or runs the /tax-reconciliation slash command. Also triggers on "what's the taxable income", "build the tax walk", "post the tax-effect entries", "year-end tax adjustments".
---

# Tax Reconciliation

## Goal
Produce a Schedule M-style reconciliation from accounting profit to taxable income for a single entity, with each adjustment line tied to a journal, account or schedule. Structure adapts to entity type — company, trust, or partnership.

## Metrics
- **Adjustment coverage** — % of material adjustments tied to a named source (journal, account, schedule)
- **Reconciliation closure** — starting profit + add-backs − deductions = taxable income, no orphan lines
- **Confidence breakdown** — count of Direct vs Likely vs Needs-review adjustments

## Default thresholds (practice-configurable)
| Threshold | Value | Used in |
|---|---|---|
| Material adjustment | $500 | All sections |
| Non-deductible entertainment | 100% add-back | Add-back section |
| Non-deductible fines/penalties | 100% add-back | Add-back section |
| Private-use motor vehicle | FBT-method-dependent (logbook / stat) | Add-back section |
| Donation deductibility | DGR check required | Conditional add-back |
| Foreign-source income | Per-jurisdiction treatment | Conditional adjustment |

## Per-entity-type structure

### Company
- Starting: accounting profit before tax
- Add: non-deductible expenses
- Add: accounting depreciation
- Add: provisions movement (accounting basis)
- Less: tax depreciation
- Less: prior-year tax losses recouped
- Less: R&D concession
- Adjust: FBT (if reportable)
- Adjust: foreign-source income
- Result: taxable income → company tax @ current rate

### Trust
- Starting: trust accounting profit
- Same add-backs and deductions as company
- Distribution of net income to beneficiaries — flag if any income is undistributed (s99A risk)
- Result: net income for distribution

### Partnership
- Starting: partnership accounting profit
- Same add-backs and deductions
- Allocation to partners per agreed split — flag if split appears inconsistent with prior years
- Result: net partnership income per partner

## Adjustment categories

### Add-backs (always)
- Entertainment (fully non-deductible per ITAA s32-5)
- Fines and penalties
- Donations to non-DGRs
- Private-use portion of motor vehicle (logbook or statutory method)
- Capital expenditure expensed in books
- Accounting depreciation (replaced by tax depreciation)
- Accruals at year-end that aren't deductible until paid (e.g. annual leave for some entities)

### Deductions
- Tax depreciation per fixed asset register
- Prior-year tax losses (with carry-forward test)
- R&D tax concession where claimed
- Section 40-880 deductions (business-related capital)

### FBT marker
- Has the entity provided reportable fringe benefits in the period?
- If yes: FBT is an expense in its own right; ensure not double-counted in the walk

## Source-tying rules
- Every adjustment row must reference: journal id, account code, or schedule reference
- Adjustments without a source → labelled **Needs review** and surfaced explicitly for partner attention

## Process / rules
1. Read-only — the worksheet does not post any journals, including tax-effect entries
2. Per-entity-type structure — company, trust, partnership — never default to "company" silently
3. Lodgement is out of scope — the deliverable is the worksheet, not the return
4. FBT marker is mandatory per run — ask the user if not provided
5. Foreign-source income adjustments are deferred unless the client has identifiable foreign income (flag the assumption explicitly)

## Always
- Lodgement is out of scope — never offer to lodge from this plugin
- Read-only — no journal posting, including tax-effect entries
- Source-tie every adjustment — orphan adjustments get the Needs review label and surface for partner attention
- Be explicit about the entity type assumed — don't silently default
- DGR status for donations is a check, not an assumption
