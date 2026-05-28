---
description: Run the annual FBT exposure scan for an Australian client — vehicles, entertainment, employee benefits — and produce a Word working paper with estimated liability and recommended actions.
---

**Prerequisite:** The client's bank reconciliation must be current to 31 March (FBT year-end) before the FBT scan begins. Unreconciled bank lines distort the expense-account scan that drives the benefit-trigger taxonomy.

**Downstream:** This plugin should run BEFORE `/stp-finalisation`. Reportable Fringe Benefit Amounts (RFBA) identified here flow into STP Phase 2 — running STP first under-reports RFBA on the income statement.

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
4. Build the working-paper payload conforming to the schema in the `fbt-prep` skill (sections, blocking flags, prior-period table, QMS block).
5. Save the payload to `outputs/<check_reference_id>/payload.json` and invoke the `xbert-working-paper:render-docx` skill. Wait for its JSON response. Do not declare success until `status == "ok"` and `opens_cleanly == true`.
6. Present the saved working-paper path to the user with a chat-side summary of the top blocking issues to resolve before lodgement.

Use the `fbt-prep` skill for the trigger taxonomy, gross-up factors, exemption thresholds, and audit-document structure. Use Australian English (organisation, behaviour, colour), dd/MM/yyyy dates, and $0.00 currency formatting. Never use emojis.
