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
4. Build the working-paper payload conforming to the schema in the `tpar` skill (sections, blocking flags, prior-period table, QMS block).
5. Save the payload to `outputs/<check_reference_id>/payload.json` and invoke the `xbert-working-paper:render-docx` skill. Wait for its JSON response. Do not declare success until `status == "ok"` and `opens_cleanly == true`.
6. Present the saved working-paper path to the user with a chat-side summary of the top blocking issues to resolve before lodgement.

Use the `tpar` skill for industry rules, ABN validation, GST separation, and the working paper structure. Use Australian English, dd/MM/yyyy dates, $0.00 currency. Never use emojis.
