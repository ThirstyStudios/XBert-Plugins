---
name: fs-pack
description: Compose a year-end financial statement pack for an Australian client — SPFS structure by default, GPFS variant for audit clients. Use when the user asks to produce the year-end financial statements, generate the FS pack, draft the annual accounts, build the partner pack, or runs the /fs-pack slash command. Also triggers on "year-end accounts", "annual statements", "directors' declaration", "SPFS pack".
---

# FS Pack

## Goal
Produce a partner-ready year-end financial statement pack — cover page, directors' declaration, BS, P&L, cashflow, statement of changes in equity, and notes-to-accounts shell — in Word and PDF, with the comparative-period column populated.

## Metrics
- **Comparative coverage** — every financial statement section has the prior-year column populated
- **Notes completeness** — notes shell covers every disclosable item present on the BS / P&L
- **First-pass quality** — pack is partner-readable without manual data entry beyond narrative paragraphs

## Default thresholds (practice-configurable)
| Threshold | Value | Used in |
|---|---|---|
| Default structure | SPFS | Pack type |
| Materiality for notes disclosure | $1,000 or 1% of revenue | Notes shell |
| Related-party balance disclosure | Any balance | Notes shell |
| FX revaluation disclosure | $500 unrealised | Notes shell |
| Provisions ageing band | 12 months (current / non-current split) | Working papers |

## Pack structure

### SPFS (default — small proprietary company)
1. Cover page — entity name, ABN, year-end date, pack type
2. Directors' declaration shell
3. Statement of profit or loss
4. Statement of financial position (balance sheet)
5. Statement of cashflows (indirect method)
6. Statement of changes in equity
7. Notes to the financial statements:
   - Note 1: Statement of significant accounting policies (shell)
   - Note 2: Revenue
   - Note 3: Expenses (key categories)
   - Note 4: Income tax
   - Note 5: Cash and equivalents
   - Note 6: Trade and other receivables
   - Note 7: Property, plant and equipment + accumulated depreciation
   - Note 8: Trade and other payables
   - Note 9: Provisions (annual leave, long service leave, doubtful debts)
   - Note 10: Issued capital
   - Note 11: Related party transactions
8. Working papers: provisions and accruals schedule

### GPFS (audit clients)
- All of SPFS, plus:
- Deeper accounting policies note with measurement bases per asset class
- Segment reporting where applicable
- Financial instruments disclosures (credit, liquidity, market risk)
- Detailed related-party schedule with transactions during the period
- Subsequent events note placeholder
- Auditor's independence declaration placeholder

## Cashflow derivation (indirect method)
When the ledger does not produce a cashflow:
1. Start with net profit from the P&L
2. Add back non-cash items (depreciation, amortisation, provisions, unrealised FX)
3. Adjust for working capital movements (Δ receivables, Δ inventory, Δ payables, Δ provisions)
4. Result = Cashflow from operations
5. Investing and financing sections pulled from BS movements on PP&E, borrowings, equity

## Process / rules
- Read-only — never post a journal, never change a ledger account
- Default to SPFS unless the user explicitly requests GPFS
- Always populate the comparative period from the prior-year BS/P&L
- Notes that have no underlying data: keep the heading, mark "Nil for the period" — do not silently drop
- Missing organisation settings (no ABN, no signing director) — surface as a blocker before generation; do not produce a half-populated cover page

## Always
- Read-only — the pack is a document, not a ledger operation
- Default structure is SPFS — never silently switch to GPFS
- Comparative period is mandatory — if prior year is unavailable, state it on the cover page and proceed
- Surface missing organisation settings before generating, not after
- Word + PDF are both produced — Word for editing, PDF for circulation
