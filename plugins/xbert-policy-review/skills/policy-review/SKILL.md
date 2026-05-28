---
name: policy-review
description: Policy-review methodology for posted spend caught by deterministic policy XBerts — surface what they caught on the supported categories (out-of-policy account, banned vendor, missing receipt, duplicate transaction, receipt forensic flag), propose per-firing action, produce an audit pack. Use when the user asks to review policy violations, run a weekly spend review, check out-of-policy spend, investigate a vendor anomaly, or runs the /policy-review slash command. Also triggers on "weekly spend sweep", "spend policy review", "receipt forensic review", "out-of-policy review", "vendor anomaly check".
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Policy Review

A periodic review of every policy XBert that fired across the period. Enforcement is owned deterministically by Custom XBerts (the XBerts are the heroes); this skill surfaces what they caught, groups firings on supported categories, proposes the next action per firing, and produces the audit pack. The user writes the communication.

## Goal

Convert a flat list of policy XBert firings into a categorised review with a per-firing proposed action and a filable audit pack — without ever auto-sending a message, auto-resolving a violation, or inventing a signal the XBerts cannot independently detect.

## Supported policy categories

| Category | Pattern detected by linked XBerts |
|---|---|
| Out-of-policy account | Spend coded to an account / category the firm or client policy disallows |
| Banned vendor | Posting to a vendor on the deny list (matched on vendor name) |
| Missing receipt | Transaction over the receipt-required threshold with no attachment |
| Duplicate transaction | Same vendor + amount + date appearing more than once on Bill or BankTransaction |
| Receipt forensic flag | Copy-move, metadata tampering, greyscale conversion or image-of-image caught on a captured receipt |

If a linked XBert does not fit one of these five buckets, surface it under "Other" with the XBert title verbatim — do NOT force-fit it into a per-employee or per-user bucket.

## Metrics

- **Firings per category** — focuses the reviewer on dominant categories
- **Recurrence by vendor** — vendors with two or more firings in the period (deterministic fact, not pattern label)
- **Recurrence by account** — accounts with two or more firings in the period
- **Forensic-flag rate** — proportion of receipts tripping a forensic signal

## Methodology

1. **Linked XBerts gate.** If no XBerts are linked to the Policy Review agent in the Connect portal for the client, STOP. Tell the user to configure linked XBerts first. The plugin reasons only over what the linked XBerts caught.
2. **Pull firings.** For every linked policy XBert, pull the period's firings with vendor, account, amount, date, captured receipt and any forensic flags.
3. **Bucket.** Group by supported category (table above). Within a category, sub-group by vendor or account where it tightens the narrative.
4. **Per-firing action.** Propose the next action per firing: recode, request supporting doc, accept-as-correct, escalate. Do not draft a communication — the user writes the message.
5. **Highlight forensic signals.** Receipt forensic flags get a dedicated sub-section with the specific signal (copy-move, metadata, greyscale, image-of-image) named per receipt.
6. **Compile audit pack.** Workpaper with category sections, recommended actions per firing, source links to every XBert firing and captured receipt.

## Audit pack structure

1. Cover page — client name, period, generation date
2. Summary — total firings, by-category breakdown, recurrence by vendor / account
3. Category sections — description, firings list, recommended action per firing, supporting evidence
4. Forensic-signal sub-section — flagged receipts with the specific signal named
5. Source links — hyperlinks to every underlying XBert firing and captured receipt
6. QMS block — practice name + ID, preparer name + ID, timestamp, unique check reference ID, compliance statement

## Out of scope (do NOT include in output — no backing data)

- Per-employee patterns (no employee identifier on transactions)
- Per-cardholder patterns (no cardholder link on BankTransaction)
- After-hours / time-of-day patterns (only created-date is available, not time-of-day or user identity)
- Approved-with-exception annotations (no annotation property exists)
- Manual journal forensic review (no journal data type in MCP)
- Expense claim review (no expense claim data type; only Bill / BankTransaction / Invoice)
- Mileage-over-threshold per employee (expense claim data, unsupported)
- Drafted spender follow-up text (the user writes the communication)

## Output format

- Australian English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings in chat preview, bold key figures
- Tables for category breakdowns
- Never use emojis

## Always

- Never auto-apply; never lodge; never send. Output is for review.
- Never draft communication copy — the user writes the message.
- Never invent per-employee, per-cardholder, per-user, after-hours or approved-with-exception signals. If the linked XBerts cannot deterministically detect it, it does not exist.
- If the linked-XBerts list is empty, stop and prompt the user — do not invent a fallback.
- Recurrence by vendor or account is a deterministic fact (a count), not a pattern label.
- Receipt forensic signals must be named specifically — copy-move, metadata, greyscale, image-of-image — not generic "looks suspicious".

## Payload schema

After running the analysis, structure the result as JSON conforming to the render-docx payload schema (defined in `xbert-working-paper/skills/render-docx/SKILL.md`). Required fields:

- `plugin`: `"xbert-policy-review"`
- `check_reference_id`: a unique ID for the run
- `tenant_name`, `period`, `prepared_by`, `prepared_at`
- `title`, `subtitle` (optional)
- `executive_summary`: two sentences naming the headline finding
- `sections[]`: one entry per major finding, each with `heading`, `body`, optional `blocking: true`, optional `table` with `columns` and `rows`
- `qms_block`: `{ firm_name, preparer, reviewer, certification }`
- `appendix[]` (optional)

Section ordering and content must match the document structure described above.

## Output handoff

1. Save the payload to `outputs/<check_reference_id>/payload.json`.
2. Invoke the `xbert-working-paper:render-docx` skill. It will write `outputs/<check_reference_id>/working-paper.docx` and emit a single JSON line on stdout with `status`, `path`, `exists`, `size_bytes`, `opens_cleanly`, `paragraph_count`.
3. Pass the path and a one-line summary back to the user.

## Verification gate

Do not report the document as produced until the render skill's JSON has `status == "ok"` and `opens_cleanly == true`. If the gate fails, surface the JSON to the user verbatim and stop — do not retry silently and do not claim success.
