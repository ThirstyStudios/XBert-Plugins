# XBert Intercompany Reconciliation

Reconcile inter-entity loans, recharges, and trade balances across every entity in a group in one pass. A unique XBert capability — the cross-tenant relationship data is the unlock.

## What it does
- Discovers the group structure from XBert's cross-tenant relationship data
- Pulls each entity's balance sheet, trial balance, related-party contacts, and journal master
- Identifies related-party accounts (Loan To / Loan From / Recharge / Trade with related party)
- Pairs every inter-entity balance across entities (Loan to A→B with Loan from B←A)
- Flags mismatches — different amounts, missing-side transactions, inconsistent GST coding
- Produces an Excel workbook with per-entity tabs, a pairing tab, a mismatch tab, and a consolidated reconciliation tab

## Prerequisites
- XBert account with multi-entity group access (this is the core unlock — without it the plugin refuses to proceed)
- Each group entity connected as a XBert client tenant
- Inter-entity loan and recharge accounts identifiable in the chart of accounts (naming convention or COA mapping)

## Usage
After installing, type:

    /intercompany-recon

in any Claude chat (Desktop or Code).

## Scope notes
- **Cross-tenant access is mandatory.** If the user does not have multi-entity access on their XBert account, the plugin will explain and refuse to proceed.
- Read-only across every entity — no journals are posted, only proposed.
- GST consistency between recharge pairs is checked — a dollar-balanced pair with inconsistent GST is still flagged.

## Support
hello@xbert.io
