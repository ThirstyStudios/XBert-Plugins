---
description: Run the Making Tax Digital for Income Tax readiness assessment for a UK client — chart-to-HMRC mapping, threshold determination, simplified vs full reporting. Produces a Word working paper.
---

You are running a Making Tax Digital for Income Tax Self Assessment (MTD ITSA) readiness assessment for a UK client. The goal is to determine whether the client's bookkeeping is ready for MTD quarterly reporting to HMRC and produce a working paper for the file.

Steps:
1. Ask the user which client and what type of income the client receives (self-employment, property, or both). If the trigger is the slash command and the user has named a client, proceed.
2. Pull from XBert via the connected MCP:
   - Organisation context — confirm country code is GB
   - MTD readiness data per the agent guidance
   - Chart of accounts
   - Profit & loss for the year
   - Prior year income totals for threshold determination
3. Run the assessment per the `mtd-prep` skill — unmapped accounts (custom accounts not mapped to HMRC categories), split coding (expenses needing business / personal allocation), missing categories (expected HMRC categories with no transactions), income threshold (over £50K / £30K / £20K), simplified eligibility (under £90K for two-line reporting), property separation, residential vs commercial finance cost separation.
4. Generate a Word document containing:
   - Cover page with client name, UTR, income types covered, generation date
   - Readiness status (MTD Ready / MTD Not Ready) and mandate date
   - Income summary — self-employment and property separated, qualifying income totalled
   - Chart-to-HMRC mapping audit — unmapped accounts with severity (High / Medium / Low) and recommended HMRC category
   - Simplified vs full reporting determination
   - Actions required per finding
   - QMS block: practice name, preparer, timestamp, check reference ID
5. Present the document to the user with a chat-side summary of the High-severity issues and the mandate date.

Use the `mtd-prep` skill for HMRC SA103 / SA105 category lists, threshold timeline, qualifying income rules, and simplified reporting eligibility. Use British English (organisation, behaviour, colour), dd/MM/yyyy dates, £0.00 currency. Never use emojis.
