---
description: Run the four-phase new-client onboarding workflow with gate checks, task creation, and rules baseline assignment. v1 leaves COA + opening-balance steps as manual ledger work.
---

You are running the Client Onboard workflow for a bookkeeping or accounting practice. **v1 scope**: orchestration + checklist + gates + rules baseline. COA creation and opening-balance load remain manual checklist items in the ledger.

Steps:
1. Confirm scope: (a) Connect tenant (the practice), (b) the new client name, (c) engagement type (full bookkeeping / payroll-only / month-end-only / other). If unclear, ask.
2. Determine current state via the XBert MCP:
   - Connect-level review to understand the practice's onboarding baseline
   - List existing clients to confirm the new client isn't already onboarded
   - If the client tenant exists, pull its connection state
   - Pull organisation settings if connection is established
   - Pull any existing flows for this client
3. Present the four-phase checklist with current state per item:
   - **Phase 1 — Engagement**: engagement letter signed? scope confirmed? services priced? key contacts captured?
   - **Phase 2 — Connection**: ledger connected (Xero/MYOB/QBO)? bank feeds requested? payroll connected? document storage linked?
   - **Phase 3 — Configuration**: COA template chosen? COA created in ledger (manual — v1)? opening balances loaded (manual — v1)? rules baseline assigned? approval matrix set?
   - **Phase 4 — Go-live**: first reconciliation run? first month-end completed? client trained on portal? handover-to-BAU complete?
4. Enforce the gate: do not proceed to a later phase if the prior phase has unchecked items. Surface the blocker explicitly: "Phase 2 cannot start: engagement letter not on file."
5. For each pending item, create a workflow task from the practice's template:
   - Use the practice's existing workflow templates
   - Assign tasks per template default (usually the lead bookkeeper)
   - Create the client task
6. For configuration phase, when the user confirms scope:
   - Re-read and SHOW the resolved client name plus the Connect tenant name; ask the user to confirm the client name matches before any write
   - Create the standard onboarding flow using the practice's onboarding flow template
   - Document the engagement scope as a client note
7. **Rules baseline — explicit approval gate (no auto-assign).** Scope-confirm earlier in the flow is NOT authorisation to write configuration.
   - Re-read the resolved client name and Connect tenant name.
   - Look up the practice's rules baseline rule pack and SHOW: pack name, number of rules in the pack, and any rules that conflict with existing client configuration (list them so the user can resolve before the write).
   - Ask exactly this approval line and STOP until you receive an explicit `yes`:
     > Assign rule pack `<pack name>` (`<N>` rules) to client `<client name>` under Connect `<connect name>`? Reply `yes` to proceed or `no` to stop.
   - On `no` (or anything other than `yes`): do NOT write. Surface what the user said and ask whether to revise the pack or skip the step.
   - On `yes`: write the baseline AND record (a) every rule id + name assigned, (b) the prior state of any rule that was overwritten, (c) a reversal block the user can paste back to roll the configuration back. Do NOT consider Phase 3 complete until the reversal block has been emitted to chat.
8. For go-live, when all prior phases pass:
   - Mark the onboarding complete in the audit trail
8. Output:
   - A status board showing the four phases with per-item state
   - The list of tasks just created
   - The list of manual ledger items the bookkeeper still has to do (COA create, opening-balance load — v1 limitation)

Use the `client-onboard` skill for the gate-check rules, phase sequencing, and template-task mapping. Never skip a phase gate. **v1 limitation**: COA-create and opening-balance-load are tracked as checklist items the bookkeeper completes in the ledger — they are not automated by this plugin.
