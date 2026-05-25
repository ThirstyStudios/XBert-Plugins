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
- [ ] Rules baseline assigned (XBert rule pack — automated by this plugin once scope confirmed)
- [ ] Approval matrix set (who approves bills, who approves journals)
- [ ] Bank rules / matching rules configured in the ledger

Gate: Phase 4 cannot start unless rules baseline is assigned AND COA is confirmed present.

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

### Rules baseline assignment
- The practice has a standard rules baseline (which XBert checks fire, which thresholds apply, which approvers are default)
- Assigned automatically at the end of Phase 3 (after scope is confirmed) — not at Phase 1 (because scope might change)

## v1 limitations (surface in every run)
- **COA creation**: this plugin does not create the chart of accounts in the ledger. It tracks COA-create as a checklist item; the bookkeeper does the work in Xero/MYOB/QBO. (v2: automate the COA creation through the ledger.)
- **Opening balance load**: this plugin does not load opening balances. It tracks the step as a checklist item; the bookkeeper does the work in the ledger. (v2: automate the opening-balance load through the ledger.)
- These limitations should appear in the run summary so the bookkeeper knows what's still manual.

## Always
- Never skip a phase gate — surface the blocker explicitly when a gate fails
- Never auto-progress to go-live without all Phase 4 items checked
- Never assign the rules baseline before scope is confirmed (Phase 3 only)
- Always create tasks from practice templates — never free-form
- Always surface v1 limitations (COA, opening balances) so the bookkeeper knows what's manual
- Always log the onboarding state changes as client notes for audit trail
- Australian English throughout (organisation, recognised, behaviour, programme)
