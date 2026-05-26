---
name: close-packet
description: "Compose the month-end client packet — BS/P&L with variance commentary, material-journal narrative, outstanding XBerts inline, KPI page — into a single Word/PDF deliverable. Use this skill when the user asks for the close packet, month-end packet, client-ready close pack, partner pack composition, or runs the /close-packet slash command. Also triggers on: 'month-end client pack', 'quarter-end packet', 'board pack draft', 'year-end summary draft', 'compose the close pack', 'assemble client deliverable'."
---

# Close Packet

## Goal
Compose the month-end (or quarter-end / year-end) client packet as a single Word/PDF deliverable — balance sheet, P&L with variance commentary, material-journal narrative, KPI page, and outstanding XBerts inline. One file, same shape every period, partner reviews and sends.

## Metrics
- **Material variance** — P&L line actual vs budget by amount and percentage.
- **Material BS movement** — current vs prior period by amount and percentage.
- **Material journal** — single journal dollar value relative to account balance.
- **Outstanding-XBerts count** — open issues, risks, unresolved alerts at period end.
- **KPI roll-up** — gross margin, net margin, current ratio, debtor days, creditor days, working capital.

## Default thresholds (practice-configurable)
| Band | Threshold |
|---|---|
| P&L variance — material | >= $1,000 AND >= 10% (accounts <$10k); >= 5% (accounts >=$10k) |
| BS movement — flag | >= 15% movement vs prior period OR >= $5,000 absolute |
| Material journal | >= $2,500 OR >= 10% of the affected account balance |
| Cashflow forecast variance | >= 20% deviation from forecast |
| Reporting shape — SPFS | Default for most non-reporting entities |
| Reporting shape — GPFS | Required for disclosing entities; surfaces extra disclosure scaffolding |

## Process / rules

### Document structure (fixed)
1. **Cover page** — client name, period, reporting shape (SPFS/GPFS), generated date, prepared by (accountant), reviewed by (partner — left blank).
2. **What changed and why** — 5-7 bullet executive summary on a single page.
3. **P&L section** — actual / budget / variance / prior period columns. Material variances get scaffolded commentary paragraphs. **Outstanding XBerts that relate to a variance are listed inline beneath the relevant line** so risks sit beside the explanation.
4. **Balance sheet section** — actual / prior period / movement columns. Material movements flagged with the reason.
5. **Cashflow section** — opening → operating → investing → financing → closing bridge with forecast comparison if available.
6. **Material journal narrative** — one paragraph per material journal: description, accounts affected, dollar value, prior-period context.
7. **KPI page** — current vs prior with movement direction. Concerns highlighted per thresholds.
8. **Appendix** — full outstanding-XBerts list, data-sparsity notes.

### Variance commentary scaffolding
- Format: "[Line name] [direction] [variance amount] ([variance %]) vs [comparison frame]. Suggested commentary: [_____]."
- Example: "Revenue $42,300 below budget (-12%) vs April-26 budget. Suggested commentary: Driven by [delayed client onboard / lost contract / seasonal trough]?"
- Inline outstanding XBerts: list under the variance with one-line description each.

### Journal narrative scaffolding
- One paragraph per material journal: opens with the journal description, names the accounts moved, states the dollar value, references prior-period context.
- Never invent a reason — if the journal description is sparse, scaffold the narrative as "Journal entered without descriptive narrative — partner to confirm rationale."

### SPFS vs GPFS handling
- SPFS: standard structure as above.
- GPFS: adds disclosure scaffolding placeholders (accounting policies, related-party transactions, contingent liabilities) for the partner to complete.

### Composition rules
- Never recalculate numbers — pull from the same surfaces the underlying reports use.
- Same section order every period — consistency is the product.
- Outstanding XBerts inline in the variance section, full list in the appendix.
- Below materiality: roll into "other movements within tolerance" footer.

## Always
- Read-only — never auto-apply, never auto-send, never lodge.
- Partner reviews, edits commentary, approves send.
- Never make accounting judgment calls — scaffold commentary for the partner to complete.
- Always include the appendix even if empty (signal that outstanding XBerts and data-sparsity were considered).
- Output filename: `<client>-close-packet-<yyyy-mm>.docx` — keeps cycles findable.
- Australian English throughout (organisation, recognise, behaviour).
