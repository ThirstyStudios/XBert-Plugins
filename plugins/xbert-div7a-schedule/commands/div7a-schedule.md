---
description: Build a Division 7A loan schedule per shareholder loan — opening balance, advances, repayments, interest accrual at the benchmark rate, and minimum yearly repayment calc. Excel output, one tab per loan.
---

You are running the Div 7A loan schedule workflow for an accountant in public practice.

Steps:
1. Confirm scope — which client, which income year, and ask the user to enter the ATO benchmark interest rate for the income year. v1 is a manual input — automated benchmark-rate lookup is on the capability roadmap but not yet available.
2. Pull from XBert via the connected MCP:
   - Closing balance sheet for the income year
   - Journal master detail for shareholder loan movements during the year
   - Contacts list, focusing on shareholders and related-party individuals
3. Run the schedule build from the `div7a-schedule` skill:
   - Identify shareholder loan accounts on the balance sheet (account name pattern + contact link)
   - For each loan: opening balance, advances during the year, repayments during the year, interest accrual at the benchmark rate, closing balance
   - Calculate the minimum yearly repayment per loan (per Div 7A formula based on loan term and benchmark rate)
   - Compare actual repayments to minimum required — flag any shortfall
   - Note the assumption that a complying loan agreement is in place; if the user confirms it is not, flag the advance as a potential deemed dividend
4. Generate the Excel schedule:
   - One worksheet per loan
   - Opening / advances / repayments / interest / closing rows
   - Minimum repayment calc with pass / shortfall badge
   - Working paper tab listing the benchmark rate used and the assumption set
   - Next-year reminder cell noting when the next income year's benchmark rate needs to be entered
5. Present the top observations in chat — total advances, total minimum repayment shortfall (if any), any loans where the complying-loan-agreement assumption needs partner review. Offer to (a) email the shareholder with the minimum repayment required for the next year, or (b) flag any deemed-dividend risk for partner sign-off.

Use the `div7a-schedule` skill for the loan identification rules, minimum repayment formula, and complying-loan-agreement handling. Read-only on the ledger — no journals posted. v1 explicitly relies on user-entered benchmark rate; this is documented as a capability gap.
