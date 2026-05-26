---
name: firm-inbox-triage
description: "Daily firm-inbox triage — categorise threads, priority-score each, draft tone-matched replies for high-priority threads grounded in XBert client state. Use this skill when the user asks for inbox triage, morning inbox review, daily email sweep, client-aware reply drafting, or runs the /firm-inbox-triage slash command. Also triggers on: 'what's in the inbox this morning', 'triage my email', 'which emails are urgent', 'draft a reply that references the client state', 'inbox overflow', 'pre-client-call inbox check'."
---

# Firm Inbox Triage

## Goal
Turn the daily firm inbox from a scroll-through into a prioritised work list. Every thread gets a category, a priority score, and (for high-priority items) a drafted reply that references the actual XBert client state — not a generic template. The operator approves each send.

## Metrics
- **Category** — compliance question / payroll query / document request / fee discussion / new lead / FYI / spam-like.
- **Priority score** — composite of urgency keywords, deadline mentions, client-tier weighting, open client-state items, awaiting-our-response flag.
- **Client-state references** — count of XBert-confirmed facts referenced in the drafted reply.
- **Matched-tenant rate** — proportion of threads matched to a client tenant by sender email.

## Default thresholds (practice-configurable)
| Band | Threshold |
|---|---|
| High priority — draft a reply | Score >= 7 |
| Medium priority — categorise only | Score 4-6 |
| Low priority — surface in list | Score 1-3 |
| Urgent keywords | "urgent", "asap", "today", "by EOD", "deadline", named statutory deadline within 7 days |
| Client-tier weighting | Top-tier clients +2, mid-tier +1, low-tier +0 |
| Scan window | Default last 24 hours unread threads |

## Process / rules

### Categorisation
- **Compliance question** — BAS/IAS/GST/VAT/tax/super queries
- **Payroll query** — pay run, leave, super, STP, EOFY summaries
- **Document request** — client asking for or sending a document
- **Fee discussion** — invoicing, engagement scope, fee disputes
- **New lead** — prospective client enquiry
- **FYI** — informational, no action required
- **Spam-like** — vendor pitches, unsolicited

### Priority scoring (composite)
- +3 for urgent keywords ("urgent", "asap", deadline within 7 days)
- +2 for top-tier client; +1 for mid-tier
- +2 if open XBert items relate directly to the thread topic (e.g. BAS thread + open BAS prep)
- +2 if the sender is awaiting our response (last message in thread is from the sender, not from us)
- +1 for new lead category (sales-sensitive)
- -2 for spam-like

### Client-state grounding (the wedge over generic triage)
- For each thread matched to a client tenant, pull the current XBert state
- Drafted replies reference confirmed facts only: "BAS draft sent yesterday, awaiting your approval" — only if MCP confirms that fact
- If no client state is available or the match is uncertain, fall back to a neutral acknowledgement — never invent
- Reference the open XBert plugin/workflow by name where helpful ("open /bas-prep to review")

### Tone matching
- Firm tone preference (formal / friendly-professional / warm)
- Existing thread tone with the client (if the client uses first names, match; if formal, match)
- Never auto-shift tone — preserve the relationship register

### Suggested routing
- Compliance question → compliance lead
- Payroll query → payroll specialist
- Fee discussion → partner
- New lead → partner or designated growth lead
- Routing is suggested, not auto-applied; operator decides

### Output
- Prioritised list ordered by score descending
- Per thread: category, priority score, matched client (or "unmatched"), summary of current client state if matched, drafted reply for high-priority threads
- Suggested route per thread

## Always
- Read-only — never auto-send replies, never auto-archive, never auto-route.
- Never invent client state — only reference facts the XBert MCP confirms.
- Every send requires per-thread operator approval.
- Always preserve the firm's tone preference and the thread's existing relationship register.
- Always show the priority score components so the operator can challenge the ranking.
- Australian English in all drafted replies (organisation, behaviour, recognise).
