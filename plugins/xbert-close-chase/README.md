# XBert Close Chase

Own the close-period chase — outstanding XBerts become a ranked chase list with drafted reminders and a delta on re-run.

## What it does
- Pulls ALL outstanding XBerts for the client (not a curated subset — close-chase covers every issue)
- Ranks the chase list by impact and age, with prior-chase status escalating unresolved items
- Drafts reminder text per item with email and Capture-chat tone variants
- Records what was chased in a per-client ChaseLedger store
- On re-run, produces a delta of resolved, chased-unresolved and never-chased items

## Prerequisites
- XBert account
- Client connected to a ledger

## Usage
After installing, type:

    /close-chase

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
