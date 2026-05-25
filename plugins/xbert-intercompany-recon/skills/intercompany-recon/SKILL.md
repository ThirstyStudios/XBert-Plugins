---
name: intercompany-recon
description: Reconcile inter-entity loans, recharges, and trade balances across every entity in a group in one pass. Use when the user asks to reconcile intercompany balances, walk inter-entity loans, check group recharges, prepare for consolidation, or runs the /intercompany-recon slash command. Also triggers on "the group doesn't balance", "loan to / loan from mismatch", "recharge wasn't posted on the other side", "pre-consolidation rec".
---

# Intercompany Reconciliation

## Goal
For every group entity, identify the related-party accounts, match every inter-entity balance and movement pairwise across entities, flag every mismatch, and confirm the group nets to zero on inter-entity lines. Produce a per-entity + consolidated Excel workbook.

## Metrics
- **Pair coverage** — % of related-party accounts successfully paired with a counterpart entity
- **Mismatch dollar value** — sum of absolute variances across all mismatches
- **Consolidation net** — sum of all inter-entity loan/recharge balances across the group (should be zero)

## Default thresholds (practice-configurable)
| Threshold | Value | Used in |
|---|---|---|
| Materiality (per pair) | $50 | Mismatch flag |
| Rounding tolerance | $1 | Match acceptance |
| Pair-confidence floor | Account name + related-party contact match | Pair acceptance |
| GST inconsistency flag | One side coded GST, other side not | Mismatch flag |
| Group-net tolerance | $5 across the whole group | Consolidation check |

## Process / rules

### Step 1 — Discover the group
- Pull the client connections to get explicit group relationships
- If group structure is not explicit, ask the user to confirm the entity set
- Refuse to proceed if user does not have multi-entity access on the account — this is the core unlock

### Step 2 — Identify related-party accounts per entity
For each entity, scan the chart of accounts and flag accounts that look like inter-entity:
- Naming patterns: "Loan to [EntityName]", "Loan from [EntityName]", "Recharge from [EntityName]", "Trade with [EntityName]"
- Related-party contact references in the AR/AP subledger
- Accounts mapped explicitly to related-party type in the COA

### Step 3 — Pair across entities
For each related-party account on Entity A:
- Find the counterpart account on the named related entity
- Loan to A→B should pair with Loan from B←A
- Recharge expense in A should pair with Recharge income in B
- Trade payable with related party B should pair with trade receivable from A on B
- A pair is acceptable when account name + related-party contact match — both signals required

### Step 4 — Match balances
For each pair:
- Compare closing balances (one should be the equal-and-opposite of the other)
- If within rounding tolerance: matched
- If outside tolerance: flag as mismatch with the variance amount and direction
- If counterpart not found: flag as unpaired with the missing-side entity named

### Step 5 — Check GST treatment
For recharge pairs:
- Both sides should have consistent GST coding (both with GST, or both without)
- If one side coded GST and the other didn't: flag, even if dollar amount balances

### Step 6 — Consolidated check
- Sum all inter-entity balances across every entity
- Group net should be zero within tolerance
- If not zero: surface the residual and identify which pair contributes most to the imbalance

### Step 7 — Workbook
- One tab per entity (related-party section of BS)
- Pairing tab (every Loan To ↔ Loan From match)
- Mismatch tab (every flagged item with proposed correcting journal)
- Consolidated tab (group net check)

## Always
- Read-only across every entity — no journals are posted, only proposed
- Refuse to proceed without multi-entity access on the user's XBert account — the cross-tenant unlock is the whole point
- Surface unpaired related-party accounts explicitly — don't silently treat them as zero on the missing side
- GST coding consistency is mandatory — a balanced pair with inconsistent GST is still a mismatch
- The consolidated tab must net to zero within tolerance — if it doesn't, surface the residual rather than rounding it
