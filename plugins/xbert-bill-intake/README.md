# XBert Bill Intake

Inbox-to-ledger bill processing with dedup guard, AI coding suggestions, and supplier dedup. **v1 scope: dedup + coding + approval task creation. Approver routing is v2.**

## What it does
- Extracts the bill (supplier, reference, date, total, line items) from PDF or image
- Runs two-tier duplicate detection (Tier 1: ref+total; Tier 2: contact+total+date)
- Matches the supplier to an existing contact via ABN-first, then name
- Predicts account code and tax code per line using the supplier's coding history
- Flags low-confidence coding and new-supplier coding for human review
- Posts the bill and creates an approval task

## v1 limitations
- The approval task is assigned to the user invoking the plugin — it is NOT routed to a specific approver per the client's approval matrix. Approver routing is v2.

## Prerequisites
- XBert account
- Client with AP ledger connected (Xero, MYOB, or QuickBooks Online)
- The bill (PDF or image) you want to process

## Usage
After installing, type:

    /bill-intake

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
