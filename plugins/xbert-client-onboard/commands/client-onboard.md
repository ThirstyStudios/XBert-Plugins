---
description: Run the four-phase new-client onboarding workflow with gate checks, task creation, and rules baseline assignment. v1 leaves COA + opening-balance steps as manual ledger work.
---

You are running the Client Onboard workflow for a bookkeeping or accounting practice. **v1 scope**: orchestration + checklist + gates + rules baseline. COA creation and opening-balance load remain manual checklist items in the ledger.

Steps:
1. Confirm scope: (a) Connect tenant (the practice), (b) the new client name, (c) engagement type (full bookkeeping / payroll-only / month-end-only / other). If unclear, ask.
2. Determine current state via the XBert MCP:
   - Connect-level review to understand the practice's onboarding baseline (try `Practice_GetConnectAccountReview` or `tools_search` if the name differs)
   - List existing clients to confirm the new client isn't already onboarded (try `Data_GetAllAccessibleClients`)
   - If the client tenant exists, pull its connection state (try `Data_GetClientConnections`)
   - Pull organisation settings if connection is established (try `Data_OrganisationSettings`)
   - Pull any existing flows for this client (try `XBert_GetFlowList`)
3. Present the four-phase checklist with current state per item:
   - **Phase 1 — Engagement**: engagement letter signed? scope confirmed? services priced? key contacts captured?
   - **Phase 2 — Connection**: ledger connected (Xero/MYOB/QBO)? bank feeds requested? payroll connected? document storage linked?
   - **Phase 3 — Configuration**: COA template chosen? COA created in ledger (manual — v1)? opening balances loaded (manual — v1)? rules baseline assigned? approval matrix set?
   - **Phase 4 — Go-live**: first reconciliation run? first month-end completed? client trained on portal? handover-to-BAU complete?
4. Enforce the gate: do not proceed to a later phase if the prior phase has unchecked items. Surface the blocker explicitly: "Phase 2 cannot start: engagement letter not on file."
5. For each pending item, create a workflow task from the practice's template:
   - Use the practice's templates via `Features_*Template*` (search for the right template tool via `tools_search`)
   - Assign tasks per template default (usually the lead bookkeeper)
   - Create with `Features_CreateClientTask`
6. For configuration phase, when the user confirms scope:
   - Create the standard onboarding flow via `XBert_CreateFlow` using the practice's onboarding flow template
   - Document the engagement scope as a client note via `Features_CreateClientNote`
7. For go-live, when all prior phases pass:
   - Assign the rules baseline (find the right tool via `tools_search` — typically a rule-pack assignment tool)
   - Mark the onboarding complete in the audit trail
8. Output:
   - A status board showing the four phases with per-item state
   - The list of tasks just created
   - The list of manual ledger items the bookkeeper still has to do (COA create, opening-balance load — v1 limitation)

Use the `client-onboard` skill for the gate-check rules, phase sequencing, and template-task mapping. Never skip a phase gate. **v1 limitation**: COA-create and opening-balance-load are tracked as checklist items the bookkeeper completes in the ledger — they are not automated by this plugin.
