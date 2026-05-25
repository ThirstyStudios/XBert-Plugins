---
description: Walk the balance sheet opening-to-closing with movement explanations, reconciliation status, manual journal trace, and FAR-to-GL check. Produces a Word narrative review.
---

You are running the balance sheet explain workflow for an accountant in public practice.

Steps:
1. Confirm scope — which client, which comparative period (quarter end, half year, year-end). If the user did not name a period, default to the latest closed reporting period and confirm.
2. Pull from XBert via the connected MCP:
   - Comparative balance sheet at the period end
   - Trial balance at the same date
   - Aged receivables and aged payables
   - Reconciliation status of bank and key accounts
   - Bank reconciliation validation result
   - Full balance sheet review validation
   - Manual journals for the period
3. Run the balance sheet walk from the `balance-sheet-explain` skill:
   - Section 1: line-by-line opening → closing with movement and % change
   - Section 2: reconciliation status per account (Cash, AR, AP, FAR vs GL accumulated depreciation)
   - Section 3: manual journal trace — every material journal with reason, supporting doc reference, and confidence label
   - Section 4: unexpected-mover flags — movements above the materiality threshold without an obvious source journal
   - Section 5: clean-up recommendations
4. Generate a Word narrative review covering all five sections with named accounts, named journals, and confidence labels.
5. Present the top 3-5 observations in chat with the underlying numbers. Offer to (a) email a query list to the bookkeeper, (b) draft any cleanup journals (proposed only), or (c) re-run with a different comparative period.

Use the `balance-sheet-explain` skill for the materiality thresholds, walk methodology, and confidence-label rules. Never auto-post a cleanup journal — every adjustment is proposed for the user to review and post manually. Read-only review only.
