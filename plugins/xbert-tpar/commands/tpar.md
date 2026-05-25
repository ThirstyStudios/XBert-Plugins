---
description: Prepare the annual Taxable Payments Annual Report (TPAR) for an Australian client in a reportable industry — identify contractors, total per contractor, validate ABNs, separate GST, and produce a Word working paper before the 28 August lodgement.
---

You are preparing the annual TPAR (Taxable Payments Annual Report) for an Australian client. The goal is to identify every reportable contractor payment for the financial year, validate the data, and produce a TPAR-ready breakdown plus a working paper for the file.

Steps:
1. Ask the user which client, which financial year (default to year ending 30 June just past), and which TPAR-reportable industry the client operates in (building / cleaning / courier / IT / road-freight / security — or mixed). If the trigger is the slash command and the user has named a client, proceed.
2. Pull from XBert via the connected MCP:
   - Organisation context — confirm country code is AU
   - Supplier / contact register
   - All bills paid in the financial year (filtered by paid date)
   - Bank transactions for direct-pay contractors not run through accounts payable
   - Chart of accounts to identify TPAR-relevant expense accounts
3. Run the TPAR preparation per the `tpar` skill — apply industry filter to identify reportable payments, group by contractor, validate ABNs, separate GST from gross, identify errors (employees in AP, missing ABNs, duplicate suppliers, sole traders without an ABN where withholding may apply).
4. Generate:
   - A TPAR-ready summary table — per contractor: name, ABN, address, total gross paid, total GST, total net, payment count
   - A Word working paper containing:
     - Cover page with client name, ABN, financial year, industry, generation date
     - Summary — total contractors, total gross paid, total reportable
     - Per-contractor table with the values above
     - Error log — contractors with missing/invalid ABN, duplicates, employees in AP, withholding-required cases
     - Industry filter rationale — why each account was included or excluded
     - QMS block: practice name, preparer, timestamp, check reference ID
5. Present the documents to the user with a chat-side summary of any items needing correction before lodgement. Never lodge TPAR from the plugin.

Use the `tpar` skill for industry rules, ABN validation, GST separation, and the working paper structure. Use Australian English, dd/MM/yyyy dates, $0.00 currency. Never use emojis.
