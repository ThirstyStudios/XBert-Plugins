---
description: Reconcile a client's trial balance against the accountant's signed financial statements and produce an Excel comparative workbook plus a Word audit document.
---

You are running the trial balance alignment workflow for a bookkeeping or accounting practice.

Steps:
1. Confirm the scope — which client, which year-end date, and ask the user to attach the signed-off financial statements PDF. If they have not selected a client in XBert yet, walk them through that first.
2. Pull from XBert via the connected MCP:
   - Trial balance at the year-end date
   - Balance sheet at the year-end date
   - Existing financial statements where present
   - Manual journal summary across the period
   - Run text extraction over the supplied PDF and tabulate every account, parent group, and balance
3. Run the four-case matching algorithm from the `trial-balance-alignment` skill:
   - Case A: one-to-one exact (account names and balances align)
   - Case B: consolidated (multiple TB accounts roll into a single FS line)
   - Case C: unmatched on TB (FS line has no ledger counterpart — likely a year-end journal)
   - Case D: unmatched on FS (TB account does not appear in the FS — likely was renamed or rolled up)
   - Validate that the totals on both sides balance and that no account has been silently dropped
4. Save the comparative-workbook payload (one row per matched / unmatched account, the proposed journal, and a tab summarising variances by case) to `outputs/<check_reference_id>/workbook.json` and invoke `xbert-working-paper:render-xlsx`. Do not report success until the render skill's JSON shows `status == "ok"` and the `recalc.py` gate passes with no error cells.
5. Save the audit-narrative payload (walks each unmatched line and the recommended action) to `outputs/<check_reference_id>/payload.json` and invoke `xbert-working-paper:render-docx`. Do not report success until the render skill's JSON shows `status == "ok"`.
6. Present the top differences in chat with confidence labels, then offer to (a) draft the journal entries, (b) email a query list to the accountant for unmatched FS lines, or (c) re-run with a different PDF extraction strategy if any totals look off.

Use the `trial-balance-alignment` skill for the matching rules, thresholds, and audit-trail conventions. Never auto-post a journal — every adjustment is proposed for the user to approve and post manually. Always flag PDF extraction uncertainty rather than silently using a low-confidence number.
