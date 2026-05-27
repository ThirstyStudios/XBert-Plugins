---
name: receipt-review
description: Receipt-review methodology for orphan-receipt and orphan-bank-line XBerts — cluster proposed matches by confidence, batch-approve high-confidence, draft spender follow-ups for true orphans. Use when the user asks to review receipts, match orphan receipts, sweep orphan bank lines, chase missing receipts, or runs the /receipt-review slash command. Also triggers on: "orphan receipt review", "bank line without receipt", "receipt match approval", "weekly receipt sweep".
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Receipt Review

A two-sided review of every receipt and bank-line orphan XBert that fired across the period. Detection is owned deterministically by Custom XBerts (the XBerts are the heroes); this skill orchestrates the desktop-side review, batch-approves the high-confidence proposed matches, and drafts per-spender follow-ups for the true orphans.

## Goal

Resolve the period's two-sided orphans — receipts without matches and bank lines without receipts — by batch-approving the obvious matches and turning the true orphans into drafted spender follow-ups, without ever auto-sending a message.

## Two-sided detection

| XBert | What fires |
|---|---|
| Receipt-without-ledger-match | A captured receipt has no candidate transaction in the ledger |
| Bank-line-without-receipt | A bank line looks like it should have an attached receipt but none is found |

Receipt Capture stays mobile-only. This skill operates on the desktop review side of what Capture has already collected.

## Confidence clusters for proposed matches

| Cluster | Signal |
|---|---|
| High | Date within 2 days + amount exact + vendor match |
| Medium | Date within 5 days + amount exact + vendor partial |
| Low | Amount exact only — date or vendor diverge significantly |

High-confidence clusters present as a batch for two-click approval. Medium-confidence get reviewer eyes on each match. Low-confidence stay with the orphan list.

## Metrics

- **Match batch size** — count of high-confidence matches ready for batch approval
- **True orphans surfaced** — both sides (receipt-side and bank-side)
- **Spenders with follow-ups drafted** — distribution across the team
- **Grace-period roll-over count** — orphans crossing into write-off territory
- **Resolution outcome** — batch-approved, drafted for chase, escalated to write-off

## Methodology

1. **Linked XBerts gate.** If no XBerts are linked to the Receipt Review agent in the Connect portal for the client, STOP. Tell the user to configure linked XBerts first.
2. **Pull firings.** For both linked XBerts, pull the period's firings with the underlying receipt or bank-line, candidate matches, spender, vendor, amount, date and any forensic flags.
3. **Cluster proposed matches** by confidence (high / medium / low) using the table above.
4. **Batch-approve high-confidence.** Present as a single batch for reviewer two-click approval; itemise the match list inside.
5. **Draft follow-ups for true orphans.** Per-spender drafts with date, amount, vendor and the action required (send the receipt / explain the missing transaction).
6. **Grace-period escalation.** Orphans that have crossed the firm's grace threshold from prior weeks escalate to write-off candidates with a rationale.

## Summary output

1. Cover header — client name, period, generation date
2. Summary — matches batch-approved, drafts ready for reviewer send, grace-period escalations
3. Match clusters — high-confidence batch (with item list), medium-confidence (one-by-one)
4. Orphan sections — receipt-side and bank-side, with drafted follow-ups per spender
5. Source links — hyperlinks to every receipt and bank line
6. QMS block — practice name + ID, preparer name + ID, timestamp, unique check reference ID, compliance statement

## Output format

- Australian English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings in chat preview, bold key figures
- Tables for confidence clusters and orphan lists
- Never use emojis

## Always

- Never auto-apply; never lodge; never send. Output is for review.
- Receipt Capture is mobile-only — this skill is desktop review side only
- If the linked-XBerts list is empty, stop and prompt the user — do not invent a fallback
- Batch approval is a reviewer decision, not an automated apply
- Drafted follow-ups must name date, amount and vendor — no generic messages
- Grace-period escalations need explicit reviewer sign-off before write-off
