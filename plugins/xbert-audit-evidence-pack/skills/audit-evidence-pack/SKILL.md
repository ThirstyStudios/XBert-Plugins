---
name: audit-evidence-pack
description: Audit evidence pack methodology — risk-weighted sample driven by deterministic XBert firings, lead schedules per material account, hyperlinked workpapers ready for the external auditor. Use when the user asks to produce an audit pack, build year-end working papers, select an audit sample, drill into a material account, or runs the /audit-evidence-pack slash command. Also triggers on: "auditor evidence", "year-end workpapers", "risk-weighted sample", "audit lead schedule".
---

# Audit Evidence Pack

A bundled workpaper for the external auditor. XBert firings supply the risk signal that drives the sample selection (the XBerts are the heroes); this skill orchestrates the assembly — sample selection, lead schedules per material account, hyperlinks to every source XBert and source document.

## Goal

Produce a single bundled workpaper for the external auditor with a defensible risk-weighted sample, lead schedules per material account, partner sign-off and hyperlinks from every sample item down to the underlying XBert and source document.

## Risk-weighting methodology

XBert firings are the risk signal. Per transaction:

| Signal | Weight contribution |
|---|---|
| Single XBert fired | Baseline weight |
| Multiple XBerts fired on same transaction | Escalate weight (cumulative) |
| Severity of XBert | High-severity XBerts contribute more weight than informational |
| Prior-period recurrence | Transactions tied to recurring patterns escalate |
| Material account exposure | Account materiality multiplies transaction-level weight |

Coverage rule: every material account must have a minimum sample regardless of firing density — no material account is under-sampled even if it had a clean period.

## Metrics

- **Sample size** — total sample items selected
- **Risk concentration** — distribution of weights across the sample
- **Material accounts covered** — count of material accounts with sample representation
- **Sample-to-population ratio** — per account
- **Source document attachment rate** — proportion of sample items with linked source documents

## Methodology

1. **Linked XBerts gate.** If no XBerts are linked to the Audit Evidence agent in the Connect portal for the client, STOP. Tell the user to configure linked XBerts first.
2. **Pull firings.** For every linked audit XBert, pull the period's firings with the underlying transactions, accounts and source documents.
3. **Score transactions.** Compute risk weight per transaction using the table above.
4. **Identify material accounts.** Resolve the firm's materiality threshold and list the accounts that meet it for the period.
5. **Select sample.** Weighted selection within each material account, enforcing minimum coverage.
6. **Build lead schedules.** Per material account: opening balance, period movement, closing balance, sample items below with hyperlinks to source documents.
7. **Compose risk-methodology note.** Document the weighting approach used so the external auditor can interrogate it.
8. **Capture partner sign-off.** Sign-off page with name, ID, timestamp.

## Workpaper bundle structure

1. Cover page — client name, audit period, generation date, audit firm context if known
2. Partner sign-off page
3. Risk-methodology note — weighting approach, materiality threshold, coverage rule
4. Lead schedules — per material account
5. Sample sections — per account, with hyperlinks to source XBerts and source documents
6. Recurring-pattern appendix — patterns observed across multiple periods
7. Source links — full index of source XBert firings and source documents
8. QMS block — practice name + ID, preparer name + ID, timestamp, unique check reference ID, system version, compliance statement

## Output format

- Australian English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings in chat preview, bold key figures
- Tables for lead schedules and sample sections
- Never use emojis

## Always

- Never auto-apply; never lodge; never send. Output is for review.
- The pack is for the external auditor to interrogate — do not auto-resolve any finding inside it
- If the linked-XBerts list is empty, stop and prompt the user — do not invent a fallback
- Every material account must have minimum sample coverage
- Every sample item must hyperlink to its source XBert firing and source document
- The risk-methodology note must be present so weighting is defensible
