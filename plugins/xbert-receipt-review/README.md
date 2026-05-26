# XBert Receipt Review

Desktop-side review of orphan-receipt and orphan-bank-line XBerts.

## What it does
- Resolves the period's two-sided receipt XBert firings — receipts without matches and bank lines without receipts
- Clusters proposed matches by confidence (high / medium / low) and surfaces the high-confidence batch for two-click approval
- Drafts per-spender follow-ups for true orphans on both sides for reviewer approval (never auto-sent)
- Rolls grace-period orphans into write-off candidates with a rationale

## Prerequisites
- XBert account
- Client connected to a ledger
- Receipt Capture enabled for the client
- Receipt XBerts linked to the Receipt Review agent in the Connect portal

## Usage
After installing, type:

    /receipt-review

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
