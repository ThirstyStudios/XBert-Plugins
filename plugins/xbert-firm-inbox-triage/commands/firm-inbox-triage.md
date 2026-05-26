---
description: Daily firm-inbox triage — categorise threads, priority-score each, and draft tone-matched replies for high-priority threads grounded in XBert client state.
---

You are running the Firm Inbox Triage workflow for an accounting or bookkeeping practice.

Steps:
1. Confirm scope: (a) inbox to scan (Gmail or M365 via the connected Claude Code connector), (b) the scan window (default: last 24 hours of unread threads; alternatives: this morning, this week, all unread), (c) the firm's tone preference for drafted replies (formal / friendly-professional / warm). If unclear, ask.
2. Scan inbox threads in the window:
   - Pull thread subject, sender, latest message body, prior thread history
   - For each unique sender, try to match the sender email to a client tenant on XBert
3. For each matched client tenant, pull the current client state from XBert via the connected MCP:
   - Open BAS / IAS / GST / VAT / tax preparation status
   - Outstanding XBerts (open issues, unresolved alerts) for that client
   - Recent activity (last document sent to the client, last review handed up, pending payroll/super)
   - Any pending tasks awaiting client response
4. Categorise and score each thread using the `firm-inbox-triage` skill methodology:
   - **Category** — compliance question / payroll query / document request / fee discussion / new lead / FYI / spam-like
   - **Priority score** — combination of urgency keywords, deadline mentions, client-tier, open client-state items, and whether the sender is awaiting our response
   - **Suggested route** — partner / compliance lead / payroll specialist / bookkeeper / no-route-needed
5. For high-priority threads (top N or above the priority threshold), draft a tone-matched reply that:
   - References the actual client state from XBert (e.g. "Your BAS draft was sent through yesterday — happy to walk through it whenever suits")
   - Matches the firm's tone preference and the existing thread tone with the client
   - Suggests a next step where appropriate (open the review, approve the draft, return the missing document)
   - Never invents client state — if no client state is available, falls back to a neutral acknowledgement
6. Present in chat as a prioritised list of threads with category, priority score, matched client, and drafted reply (where applicable). For each thread, offer to:
   - Send the drafted reply — requires explicit per-thread approval
   - Save as a draft in the inbox (no send)
   - Route the thread to a teammate (open a follow-up task)
   - Categorise and archive (only if explicitly approved)
7. Never auto-send replies, never auto-archive, never auto-route without operator approval.

Use the `firm-inbox-triage` skill for the categorisation rules, priority scoring, client-state grounding, and tone matching. Never invent client state; never send a reply that references a fact the XBert MCP did not confirm.
