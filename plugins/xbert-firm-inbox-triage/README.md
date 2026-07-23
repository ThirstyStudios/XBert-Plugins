# XBert Firm Inbox Triage

Daily firm-inbox triage with the wedge Karbon AI doesn't have: client-state context. Categorises threads, priority-scores each, and drafts tone-matched replies that reference what the client is actually waiting on — not a generic acknowledgement.

## What it does
- Scans the connected Gmail or M365 inbox in the chosen window
- Matches each thread's sender to a client tenant where possible
- Categorises every thread (compliance / payroll / document / fee / lead / FYI / spam-like)
- Priority-scores each thread using urgency, deadline, client-tier, and open client-state items
- Drafts tone-matched replies for high-priority threads, grounded in the actual XBert client state

## Prerequisites
- XBert account
- Gmail or Microsoft 365 inbox connected via Claude Code connector
- Client tenants on XBert with sender email addresses recorded for matching

## Usage
After installing, type:

    /firm-inbox-triage

in Claude Code or Claude Desktop.

## Support
hello@xbert.io
