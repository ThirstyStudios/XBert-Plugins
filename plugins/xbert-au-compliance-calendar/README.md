# XBert AU Compliance Calendar

One calendar for every Australian lodgement deadline across every client in your practice, with pre-lodgement validation and post-lodgement lock dates.

## What it does
- Pulls every upcoming AU lodgement (BAS, IAS, GST, super, FBT, STP finalisation, TPAR) per client
- Runs pre-lodgement reconciliations (BAS, GST, payroll, super) and refuses to mark "ready" until they pass
- Applies tax-agent program concessions where the client qualifies
- Sets the lock date in the ledger once a lodgement is accepted by the ATO (on user approval, per client)
- Status badges per (client, lodgement, period): not lodged / drafted / submitted / accepted / locked

## Prerequisites
- XBert account with at least one Australian client
- Payroll data maintained in the ledger where applicable (for super, STP, FBT)
- Tax registration status maintained per client (used to know which lodgements apply)

## Usage
After installing, type:

    /au-compliance-calendar

in any Claude chat (Desktop or Code).

## Scope notes
- **v1 ships**: BAS, IAS, GST, super guarantee, FBT, STP finalisation, TPAR
- **v2 adds**: state payroll-tax thresholds (waiting on a reliable threshold data source)
- Read-only on lodgement itself — XBert never lodges on your behalf. Lock dates are set only with explicit per-client approval.

This single consolidated plugin replaces the four-to-six separate compliance plugins from the Phase 2 audit — one workflow, every lodgement type.

## Support
hello@xbert.io
