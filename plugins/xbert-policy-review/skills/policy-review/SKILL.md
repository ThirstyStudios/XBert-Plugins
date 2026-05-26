---
name: policy-review
description: Policy-review methodology for posted spend caught by deterministic policy XBerts — group violations by category, draft per-spender follow-ups, produce an audit pack. Use when the user asks to review policy violations, run a weekly spend review, check out-of-policy spend, investigate a vendor anomaly, or runs the /policy-review slash command. Also triggers on: "weekly spend sweep", "spend policy review", "receipt forensic review", "out-of-policy review", "vendor anomaly check".
---

# Policy Review

A periodic review of every policy XBert that fired across the period. Enforcement is owned deterministically by Custom XBerts (the XBerts are the heroes); this skill orchestrates the review, groups violations by category, drafts per-spender follow-ups, and produces the audit pack.

## Goal

Convert a flat list of policy XBert firings into a categorised review with drafted spender follow-ups and a filable audit pack — without ever auto-sending a message or auto-resolving a violation.

## Policy categories

| Category | Pattern detected by linked XBerts |
|---|---|
| Out-of-policy category | Spend coded to an account or category the firm or client policy disallows |
| Banned vendor | Posting to a vendor on the deny list |
| Mileage-over-threshold | Mileage claims above the firm or client cap |
| Duplicate submission | The same receipt or expense submitted more than once |
| Missing-receipt-after-N-days | Receipt outstanding beyond the firm's grace period |
| Receipt forensic signals | Copy-move artefacts, metadata tampering, greyscale conversion, image-of-image — caught by Capture XBerts |

## Metrics

- **Violations per category** — to focus the reviewer on dominant categories
- **Spenders represented** — distribution across the team
- **Forensic flag rate** — proportion of receipts tripping a forensic signal
- **Repeat-offender count** — spenders who have appeared in prior weeks' reviews
- **Resolution outcome per violation** — actioned, accepted-with-exception, escalated

## Methodology

1. **Linked XBerts gate.** If no XBerts are linked to the Policy Review agent in the Connect portal for the client, STOP. Tell the user to configure linked XBerts first. The plugin reasons only over what the linked XBerts caught.
2. **Pull firings.** For every linked policy XBert, pull the period's firings with spender, vendor, category, amount, captured receipt and any forensic flags.
3. **Group.** Group by policy category (table above). Within each category, sub-group by spender where it tightens the narrative.
4. **Draft follow-ups.** For each violation, draft the spender follow-up — date, vendor, amount, the rule broken, what evidence is missing, the action required. Match the firm's tone-of-voice.
5. **Highlight forensic signals.** Receipt forensic flags get a dedicated sub-section with the specific signal (copy-move, metadata, greyscale, image-of-image) named per receipt.
6. **Compile audit pack.** Workpaper with category sections, drafted follow-ups, source links to every XBert firing and captured receipt.

## Audit pack structure

1. Cover page — client name, period, generation date
2. Summary — total violations, by-category breakdown, repeat-offender count
3. Category sections — description, firings list, drafted follow-ups, supporting evidence
4. Forensic-signal sub-section — flagged receipts with the specific signal named
5. Source links — hyperlinks to every underlying XBert firing and captured receipt
6. QMS block — practice name + ID, preparer name + ID, timestamp, unique check reference ID, compliance statement

## Output format

- Australian English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings in chat preview, bold key figures
- Tables for category breakdowns
- Never use emojis

## Always

- Never auto-apply; never lodge; never send. Output is for review.
- Name the specific date, vendor, amount and rule broken in every drafted follow-up — no generic messages
- If the linked-XBerts list is empty, stop and prompt the user — do not invent a fallback
- Receipt forensic signals must be named specifically — copy-move, metadata, greyscale, image-of-image — not generic "looks suspicious"
- Repeat-offender patterns from prior weeks must be flagged explicitly
