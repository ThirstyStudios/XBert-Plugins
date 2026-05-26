---
description: Review the period's FX-exposure XBerts for a client — propose the period-end revaluation journal for partner approval before posting.
---

You are running an FX review for a client. The deterministic FX XBerts have already identified the exposure — your job is to orchestrate the review and propose the revaluation journal for partner approval.

Steps:
1. **Linked XBerts gate.** Resolve the system agent backing this plugin (matched by the `/fx-review` slug) and call `Data_GetLinkedXBertsForAgent` for the client and review period. If the returned list is EMPTY, STOP and tell the user: "No XBerts are linked to this agent in your Connect portal. Configure them under Agent → Linked XBerts before running this review — without linked XBerts there is nothing deterministic to reason over."
2. Ask the user which client and which review period to assess (default: the current open period). If the slash command has named a client, proceed.
3. Pull the firings of each linked FX XBert across the period, plus the underlying accounts, foreign-currency balances, posting-date rates, period-end rates and any intercompany trading entity context.
4. Compose the revaluation journal per the `fx-review` skill — per balance: source amount in foreign currency, rate at posting, rate at period end, the FX gain or loss, and the offsetting P&L line. Intercompany mismatches reconciled in the same pass.
5. Present the proposed journal to the partner — line by line with source XBert link, supporting rate evidence, and the net P&L impact summary. Capture explicit approval (or rejection with reason) per line.
6. Produce a working paper with cover page, journal preview, supporting rates and source links, partner sign-off, and a QMS block with check reference ID, preparer, timestamp. Never auto-post — output is partner-approved journal ready for the bookkeeper to enter.

Use the `fx-review` skill for revaluation methodology, intercompany reconciliation and the working-paper structure. Use Australian English (organisation, behaviour, colour). Plugin proposes; partner posts.
