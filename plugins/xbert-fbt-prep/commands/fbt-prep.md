---
description: Run the annual FBT exposure scan for an Australian client — vehicles, entertainment, employee benefits — and produce a Word working paper with estimated liability and recommended actions.
---

You are running an annual FBT (Fringe Benefits Tax) exposure review for an Australian client. The goal is to identify potential FBT triggers, estimate the liability, and produce a working paper for the file before the 21 May return deadline.

Steps:
1. Ask the user which client and which FBT year (1 April to 31 March). If the trigger is the slash command and the user has named a client, default to the most recently completed FBT year.
2. Pull from XBert via the connected MCP:
   - Organisation context — confirm country code is AU, company type, employer obligations
   - Full P&L for the FBT year
   - Balance sheet — motor vehicles, employee loans, related assets
   - Trial balance for detailed account balances
   - Fixed asset register for company-owned vehicles
3. Scan expense and asset accounts per the `fbt-prep` skill — motor vehicle expenses, entertainment and meals, staff amenities, employee benefits, financial benefits (loans, debt waivers, salary packaging). Apply Type 1 (2.0802) or Type 2 (1.8868) gross-up. Estimate FBT at 47%. Identify minor-benefits exemption opportunities.
4. Generate a Word document containing:
   - Cover page with client name, ABN, FBT year, generation date
   - Executive summary — total estimated FBT exposure, highest-risk benefits, recommended actions
   - Section per benefit category with the underlying transactions, gross-up calculation, estimated FBT
   - Reportable Fringe Benefit candidates (grossed-up value > $2,000 per employee)
   - Filing obligations — 21 May (or 25 June via tax agent), quarterly instalments
   - Assumptions, exclusions, and recommended next steps
5. Present the document to the user with a chat-side summary of the top 3 exposures and any blocking issues (no logbook, no FBT return historically filed despite apparent exposure). Never apply FBT calculations to the ledger.

Use the `fbt-prep` skill for the trigger taxonomy, gross-up factors, exemption thresholds, and audit-document structure. Use Australian English (organisation, behaviour, colour), dd/MM/yyyy dates, and $0.00 currency formatting. Never use emojis.
