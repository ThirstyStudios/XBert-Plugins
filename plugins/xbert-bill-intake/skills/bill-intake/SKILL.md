---
name: bill-intake
description: "Process a single bill end-to-end — extract, dedup, supplier-match, AI-code, post, and create approval task. Use this skill when the user asks to process a bill, code a bill, check for duplicate bills, or runs the /bill-intake slash command. Also triggers on: 'enter this bill', 'is this a duplicate', 'code this invoice', 'who supplies this'. v1 scope: dedup + coding + task creation; v2 will add approver routing."
---

# Bill Intake

## Goal
Take one bill from inbox to ledger with two non-negotiables: duplicates never post, and coding never goes through unreviewed when AI confidence is low. v1 also creates an approval task for downstream routing; v2 will route the task to the right approver via the client's approval matrix.

## Metrics
- **Duplicate-detection precision** — Tier 1 (ref+total) and Tier 2 (contact+total+date) match rates and false-positive rate.
- **Coding confidence** — per-line AI confidence score for account code and tax code prediction.
- **Supplier-match rate** — successful matches to existing contacts via name + ABN.

## Default thresholds (practice-configurable)
| Band | Threshold |
|---|---|
| Tier 1 duplicate (hard stop) | exact match on (supplier reference, total) |
| Tier 2 duplicate (warn + confirm) | match on (contact, total, date ± 7 days) |
| Coding auto-pass | confidence >= 0.80 |
| Coding flag for review | confidence < 0.80 |
| Coding force-review | new supplier (no prior bills to learn from) OR new account code (never used on this client) |
| New-contact threshold | no contact match by name AND no contact match by ABN |

## Process / rules

### Extraction
1. Run text extraction then line-item processing on the bill.
2. Capture supplier name, ABN if present, reference, issue date, due date, subtotal, GST, total, and line items with per-line description/amount.

### Dedup (always before posting)
1. **Tier 1 (hard stop)** — exact match on (supplier reference, total amount). If matched, halt; show the matched bill ID to the user. Only a force-override with explicit user confirmation can proceed.
2. **Tier 2 (warn)** — match on (contact, total, date within ±7 days). Show the matched bill; require user to confirm "yes, post anyway — this is a different bill" before proceeding.
3. Both checks run; both must clear (or be force-overridden) before any further step.

### Supplier matching (ABN-first)
1. If ABN present on the bill: match contacts by ABN first. Exact ABN match = supplier confirmed.
2. If no ABN match (or no ABN on bill): match by name. Exact + case-insensitive name match = supplier confirmed.
3. No match by either path: propose creating a new contact. Show the user the bill supplier details and ask for explicit approval before creating.
4. Never create a new contact if an ABN match exists — even if names differ (e.g. trading name vs registered name).

### AI coding
1. Predict account code per line. Use the supplier's historical coding pattern as the primary signal.
2. Predict tax code per line. Default to standard supply tax code if not confidently inferred.
3. Any line below confidence threshold gets flagged for human review.
4. New suppliers (no prior bills): force-review all lines regardless of confidence — there's no history to learn from.

### Task creation
1. After successful post, create an approval task assigned to the user invoking the plugin.
2. Task title: "Approve bill: [supplier] [reference] $[total]"
3. Task includes: bill ID, supplier, total, due date.
4. **v1 limitation**: task is NOT routed to a specific approver per any approval matrix. Routing is v2.

## Always
- Never auto-post a bill — every post requires explicit user approval
- Never override a Tier 1 duplicate without explicit user force-override
- Never create a duplicate supplier when an ABN match exists
- Never auto-pass coding for a new supplier (no history = always review)
- Always show the human the parsed bill, the dedup result, the supplier match, and the coding before asking for approval
- Always create the approval task — bills posted without approval-task creation lose their downstream review hook
- v1 does NOT route the approval task to a specific approver; surface this limitation in every output so the user knows manual reassignment is required
- Australian English throughout (organisation, recognised, behaviour)
