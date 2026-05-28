---
description: Run a PAYG-I or GST instalment variation analysis for a client — YTD trend, cashflow run-rate, GIC risk, and an audit-defence PDF working paper.
---

You are running the instalment variation workflow for an accountant in public practice. The trigger is usually the ATO notice arriving for the quarter.

Steps:
1. Confirm scope — which client, which instalment (PAYG-I or GST instalment), which quarter, and the current ATO notice headline rate. Ask the user for the notice details if not provided.
2. Pull from XBert via the connected MCP:
   - YTD profit and loss
   - Closing balance sheet
   - Cashflow position
   - Budget adherence YTD
   - Current tax rates
3. Run the analysis using the `instalment-variation` skill:
   - YTD profit trend vs prior-year same period
   - Cashflow run-rate — current liquidity vs upcoming obligations
   - Compare expected annual taxable income vs the ATO notice rate
   - Direction recommendation: vary up, vary down, or stay
   - Confidence label and GIC exposure note for any variation-down recommendation
4. Build the audit-defence working-paper payload containing:
   - Client, quarter, instalment type, ATO notice rate
   - YTD figures with prior-year comparison
   - Cashflow snapshot
   - The recommendation with direction, confidence, and GIC exposure
   - The data inputs the recommendation was based on (so the working paper is reproducible)
5. Save the payload to `outputs/<check_reference_id>/payload.json` and invoke `xbert-working-paper:render-pdf` with `--payload` (reportlab path — there is no .docx step for this plugin). Do not report success until the render skill's JSON shows `status == "ok"`.
6. Present the recommendation in chat with the underlying numbers. Offer to (a) draft the variation submission text for the bookkeeper to enter into the ATO portal, or (b) re-run with a different prior-year baseline, or (c) flag the recommendation for partner sign-off if confidence is Needs review.

Use the `instalment-variation` skill for the trend-vs-noise rules, GIC exposure calculation, and confidence labels. Never submit the variation on behalf of the user — the plugin produces the recommendation and the working paper; the human enters the number into the portal. Be conservative on variation-down recommendations — the audit-defence story matters.
