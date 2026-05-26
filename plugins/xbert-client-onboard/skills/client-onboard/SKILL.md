---
name: client-onboard
description: "Drive a new client through the four-phase onboarding workflow — engagement, connection, configuration, go-live — with gate checks at each phase boundary. Use this skill when the user is onboarding a new client, asks to run the onboarding checklist, asks if a client is ready for go-live, or runs the /client-onboard slash command. Also triggers on: 'new client setup', 'onboarding checklist', 'engagement letter on file', 'ready for go-live'. v1 scope: orchestration + checklist + gates + rules baseline assignment; COA + opening-balance load remain manual ledger work."
---

# Client Onboard

## Goal
Get every new client through the four-phase onboarding lifecycle the same way every time, with gate checks that prevent skipping ahead. Engagement before configuration. Configuration before go-live. Rules baseline assigned before the first month closes. The cost of skipping a step is months of downstream cleanup, so the plugin enforces the gates and the bookkeeper does the work.

## Metrics
- **Phase completion** — each phase has a checklist; completion = all items checked or explicitly waived.
- **Gate-check failures** — counted per onboarding; high counts signal practice-template gaps.
- **Time-to-go-live** — days from Phase 1 start to Phase 4 complete.
- **Rules baseline assigned** — yes/no flag at go-live.

## Default thresholds (practice-configurable)
| Band | Threshold |
|---|---|
| Stuck onboarding (warn) | Phase active for > 14 days with no item ticked |
| Stuck onboarding (escalate) | Phase active for > 30 days |
| Time-to-go-live target | <= 21 days for standard engagement |
| Rules baseline required by | end of Phase 3 (configuration) |

## Process / rules

### Four phases (in order)

**Phase 1 — Engagement (the practice-owner gate)**
- [ ] Engagement letter signed and on file
- [ ] Services scope confirmed in writing
- [ ] Pricing agreed and recorded
- [ ] Key contacts captured (decision-maker, day-to-day contact, payments contact)

Gate: Phase 2 cannot start unless all Phase 1 items are checked. This is the practice-owner gate — the partner/principal signs off, not the bookkeeper alone.

**Phase 2 — Connection**
- [ ] Ledger connected (Xero / MYOB / QuickBooks Online)
- [ ] Bank feeds requested (one task per bank account)
- [ ] Payroll connection live if in scope
- [ ] Document storage linked (Hubdoc / Dext / Xero Files etc.)

Gate: Phase 3 cannot start unless ledger connection is confirmed (other items can be in-flight).

**Phase 3 — Configuration**
- [ ] COA template chosen (industry-specific or practice default)
- [ ] COA created in the ledger **(v1: manual checklist item — bookkeeper completes in the ledger)**
- [ ] Opening balances loaded **(v1: manual checklist item — bookkeeper completes in the ledger)**
- [ ] Rules baseline assigned (XBert rule pack — **explicit approval gate; see Rules baseline assignment below**)
- [ ] Approval matrix set (who approves bills, who approves journals)
- [ ] Bank rules / matching rules configured in the ledger

Gate: Phase 4 cannot start unless rules baseline is assigned (with the approval gate satisfied AND the rollback block emitted) AND COA is confirmed present.

**Phase 4 — Go-live**
- [ ] First bank reconciliation completed
- [ ] First month-end completed
- [ ] Client trained on portal access
- [ ] Handover to BAU bookkeeper completed (if onboarding bookkeeper is different)

Onboarding marked complete when all Phase 4 items are checked.

### Template-task creation
- Every checklist item maps to a practice workflow template
- Tasks are created from those templates (not free-form) so practice-wide consistency holds
- Default assignee per template; bookkeeper can reassign

### Rules baseline assignment — explicit approval gate (no auto-assign)
The practice has a standard rules baseline (which XBert checks fire, which thresholds apply, which approvers are default). The baseline write is **gated by explicit approval against the resolved client name — scope-confirm earlier in the onboarding is NOT authorisation to write configuration**, because the resolved client tenant under the resolved Connect must be verbalised back to the user before any write.

Per assignment, the plugin must:
1. **Re-read names.** Read the client tenant name and Connect tenant name from XBert and SHOW them in the approval prompt (not just the IDs).
2. **Dry-run summary.** SHOW the rule pack name, the count of rules in the pack, and any rules that conflict with the client's existing configuration. List each conflict so the user can resolve before approving.
3. **Explicit approval prompt** — use this exact line:
   > Assign rule pack `<pack name>` (`<N>` rules) to client `<client name>` under Connect `<connect name>`? Reply `yes` to proceed or `no` to stop.
   STOP until the user replies with exactly `yes`. Anything else (`no`, silence, an unrelated message) means do NOT write.
4. **On approval: capture the rollback state.** Write the baseline AND immediately record (a) every rule id + name assigned, (b) the prior state of any rule that was overwritten, (c) a reversal block (paste-back instructions the user can use to roll the assignment back to the pre-write state). The reversal block is the audit-trail artefact.
5. **Phase 3 is not complete until the reversal block has been emitted to chat.**

Apply the same name-confirmation principle (steps 1-3, minus the rollback in step 4) to **task creation** in Phase 2 / 3 and to the **onboarding flow + scope client-note write** in Phase 3 (step 6 of the command): re-read the resolved client name and have the user confirm it matches before any record is created under that tenant — the wrong-client risk applies to those writes too.

## v1 limitations (surface in every run)
- **COA creation**: this plugin does not create the chart of accounts in the ledger. It tracks COA-create as a checklist item; the bookkeeper does the work in Xero/MYOB/QBO. (v2: automate the COA creation through the ledger.)
- **Opening balance load**: this plugin does not load opening balances. It tracks the step as a checklist item; the bookkeeper does the work in the ledger. (v2: automate the opening-balance load through the ledger.)
- These limitations should appear in the run summary so the bookkeeper knows what's still manual.

## Always
- Never skip a phase gate — surface the blocker explicitly when a gate fails
- Never auto-progress to go-live without all Phase 4 items checked
- **Never assign the rules baseline without the explicit approval gate** (see Rules baseline assignment above) — scope-confirm does NOT authorise the write, and the user must reply `yes` to a prompt that names the resolved client and Connect tenants
- **Always emit the rollback block** to chat after the baseline write — Phase 3 is incomplete without it
- Always confirm the resolved client name (not just the ID) before any task creation or client-note write — wrong-client writes are a wrong-tenant risk
- Always create tasks from practice templates — never free-form
- Always surface v1 limitations (COA, opening balances) so the bookkeeper knows what's manual
- Always log the onboarding state changes as client notes for audit trail
- Australian English throughout (organisation, recognised, behaviour, programme)
