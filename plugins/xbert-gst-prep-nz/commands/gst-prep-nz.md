---
description: Run the pre-lodgement GST readiness check for a New Zealand client and produce a Word audit document for IRD filing.
---

**Prerequisite:** The client's bank reconciliation must be current to the period-end date (ideally a few days post period-end) before lodgement preparation. If outstanding bank lines exist for the period, surface them in the readiness check and pause until cleared.

You are running GST (Goods and Services Tax) preparation for a New Zealand client. The goal is to determine whether the client is ready to file their GST101A return with the IRD for the nominated period and produce an audit document for the file.

Steps:
1. Ask the user which client, which GST period (e.g. "Jan-Feb 2026", "Nov-Dec 2025", or "current" for auto-detection), and the filing frequency (Monthly / TwoMonthly default / SixMonthly). If the trigger is the slash command and the user has named a client, proceed.
2. Pull from XBert via the connected MCP:
   - Organisation context — confirm country code is NZ, balance date, GST scheme
   - Bank reconciliation status
   - GST boxes 5-15 from sales and purchases for the nominated GST period and period type
   - P&L for the period for revenue cross-check
   - Balance sheet for GST control accounts, KiwiSaver and PAYE liability
   - Outstanding XBerts for the period
   - Prior period GST for variance comparison
3. Run the readiness checks per the `gst-prep-nz` skill — bank rec, GST data (boxes 5 through 15), P&L review, balance sheet, fixed assets, AP, AR, cash flow, outstanding XBerts, GST / PAYE / KiwiSaver liability balances. ALL outstanding XBerts block lodgement.
4. Generate a Word document containing:
   - Cover page with client name, IRD number, GST period, generation date
   - First-page summary of readiness status and blocking issues
   - Each readiness section with pass/fail and supporting evidence
   - GST boxes 5-15 table with computed values
   - Prior-period variance comparison with explanations
   - QMS block: practice name, preparer, timestamp, unique check reference ID, compliance statement
5. Present the document to the user with a chat-side summary of the top blocking issues to resolve before filing. Never auto-resolve XBerts.

Use the `gst-prep-nz` skill for box definitions, period rules, special due dates (March / November exceptions), and the audit-document structure. Use New Zealand English (organisation, behaviour, colour), dd/MM/yyyy dates, $0.00 currency. Never use emojis.
