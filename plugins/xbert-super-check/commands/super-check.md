---
description: Run the quarterly Superannuation Guarantee check for an Australian client — verify SG calculated, posted, and paid through the clearing house by the 28th. Produces a Word working paper.
---

You are running a quarterly Superannuation Guarantee (SG) check for an Australian client. The goal is to verify SG is calculated correctly, posted to the liability account, and paid through the clearing house by the 28th deadline, and produce a working paper for the file.

Steps:
1. Ask the user which client and which SG quarter (Q1 Jul-Sep, Q2 Oct-Dec, Q3 Jan-Mar, Q4 Apr-Jun) to check. If the trigger is the slash command and the user has named a client, default to the most recently completed quarter.
2. Pull from XBert via the connected MCP:
   - Organisation context — confirm country code is AU
   - Payrun data and employee pay data for every payrun in the quarter
   - Super reconciliation
   - Super liability account movement and bank transactions tied to clearing house payments
   - Outstanding XBerts touching super or payroll for the quarter
3. Run the SG checks per the `super-check` skill — eligibility per employee, SG calculated at 12% on ordinary time earnings, super liability posted, clearing house lodgement reference exists, bank payment matches liability clearance, paid on or before the 28th. Quantify SGC exposure for any late or missed payment.
4. Generate a Word document containing:
   - Cover page with client name, ABN, SG quarter, generation date
   - First-page summary of SG paid, deadline status, and any SGC exposure
   - Per-employee contribution table — gross pay, OTE, SG calculated, SG paid, fund, clearing house reference
   - Liability-to-bank trace — super liability movement matched to clearing house and bank payment
   - SGC-risk section — any late employee, days late, estimated SGC, interest and admin fee
   - QMS block: practice name, preparer, timestamp, check reference ID
5. Present the document to the user with a chat-side summary of any blocking issues or late-payment risk. Never auto-pay super.

Use the `super-check` skill for SG rates, OTE definition, SGC calculation, and clearing-house reconciliation rules. Use Australian English, dd/MM/yyyy dates, $0.00 currency. Never use emojis.
