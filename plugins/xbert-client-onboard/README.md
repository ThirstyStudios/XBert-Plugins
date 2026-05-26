# XBert Client Onboard

Structured new-client onboarding with checklist, scope gate, and rules baseline. **v1 scope: orchestration + checklist + practice-owner gates + rules baseline assignment. COA creation and opening-balance load are checklist items the bookkeeper completes in the ledger.**

## What it does
- Drives the new client through four phases: engagement, connection, configuration, go-live
- Enforces gate checks at each phase boundary (no skipping ahead)
- Creates workflow tasks from your practice templates per checklist item
- Assigns the practice's standard XBert rules baseline via an **explicit approval gate** (the prompt names the resolved client and Connect tenants — scope-confirm doesn't authorise the write); emits a rollback block recording every rule assigned for paste-back reversal
- Confirms the resolved client name (not just the ID) before any task or client-note write, so wrong-tenant writes are prevented
- Records onboarding state as client notes for audit trail
- Surfaces practice-owner gate (engagement letter, scope) before any configuration starts

## v1 limitations
- **COA creation**: not automated. Tracked as a checklist item; bookkeeper creates the chart of accounts in the ledger.
- **Opening-balance load**: not automated. Tracked as a checklist item; bookkeeper loads opening balances in the ledger.
- v2 will automate both steps.

## Prerequisites
- XBert account
- Practice with templates configured for new-client tasks
- Engagement letter signed and on file (gate-checked before configuration begins)

## Usage
After installing, type:

    /client-onboard

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
