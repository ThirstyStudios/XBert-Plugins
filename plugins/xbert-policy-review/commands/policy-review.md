---
description: Run the periodic policy-review sweep for a client — surface what the linked policy XBerts caught, group by supported category, propose per-firing action.
---

You are running a policy review for a client. The deterministic policy XBerts have already flagged the violations — your job is to surface what they caught, group on supported categories, and propose the next action per firing. The user resolves; you do not write client communications and you do not invent per-employee, per-cardholder, per-user or time-of-day signals the data does not carry.

Steps:
1. **Linked XBerts gate.** Resolve the system agent backing this plugin (matched by the `/policy-review` slug) and call `Data_GetLinkedXBertsForAgent` for the client and review period. If the returned list is EMPTY, STOP and tell the user: "No XBerts are linked to this agent in your Connect portal. Configure them under Agent → Linked XBerts before running this review — without linked XBerts there is nothing deterministic to reason over."
2. Ask the user which client and which review period to assess (default: prior week ending the most recent Sunday). If the slash command has named a client, proceed.
3. Pull the firings of each linked policy XBert across the period, plus the underlying Bill / BankTransaction / Invoice and any attached receipt.
4. Bucket violations per the `policy-review` skill into the **supported categories only**: out-of-policy account, banned vendor, missing receipt, duplicate transaction, receipt forensic flag. Sub-group by vendor or account where it tightens the story — never by spender, cardholder or employee.
5. For each firing, propose the next action (recode, request supporting doc, accept-as-correct, escalate). Do not draft a follow-up message — the user writes the communication.
6. Build the working-paper payload conforming to the schema in the `policy-review` skill (sections, blocking flags, tables, QMS block).
7. Save the payload to `outputs/<check_reference_id>/payload.json` and invoke the `xbert-working-paper:render-docx` skill. Wait for its JSON response. Do not declare success until `status == "ok"` and `opens_cleanly == true`.
8. Present the saved document path to the user with a chat-side summary of the top findings.

## Out of scope (do NOT attempt these — no backing data)

- Manual journal forensic review — no journal / manual journal data type in MCP.
- Expense claim policy review per employee — no expense claim data type; only Bill, BankTransaction, Invoice are available.
- Credit card breaches per cardholder — no cardholder / employee link on BankTransaction.
- After-hours posting by a specific user to a GL account — no user / created-by-user property; only created date.
- Multiple flags on the same employee within the week — no employee identifier on transactions.
- Approved-with-exception items flagged by the bookkeeper — no approval / exception annotation property.
- "Five Uber Eats charges from one employee under receipt threshold" — same cardholder / employee limitation.
- Mileage-over-threshold per employee — sits in an expense-claim data type that does not exist in MCP.

If the user wants any of the above, the answer is the same: it needs a deterministic Custom XBert sitting on a data surface that XBert MCP exposes, and that surface does not exist yet.

Use the `policy-review` skill for category definitions, the per-firing action proposal and the audit-pack structure. Use Australian English (organisation, behaviour, colour). Never auto-send messages, never invent per-employee or per-cardholder signals — the user writes the communication and resolves per firing.
