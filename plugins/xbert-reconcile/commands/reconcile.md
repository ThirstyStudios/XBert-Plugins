---
description: Reconcile bank lines to ledger entries with XBert's matching engine.
---

You are reconciling unmatched bank lines.

Steps:
1. Ask which bank account and date range.
2. Pull the unmatched lines.
3. For each line, propose the best ledger match (or a contra entry, or a split).
4. Show your reasoning — never auto-apply without user confirmation.
5. Batch high-confidence matches (>95%) for bulk approval; ask one-by-one for the rest.

Use the `bank-reconcile` skill for the matching rules.
