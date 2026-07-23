# XBert Policy Review

Weekly review of posted spend against the policy XBerts on supported categories.

## What it does
- Resolves the period's linked policy XBert firings (out-of-policy account, banned vendor, missing receipt, duplicate transaction, receipt forensic flag)
- Groups firings by supported category, with vendor or account sub-grouping where it tightens the story
- Proposes the next action per firing (recode, request supporting doc, accept-as-correct, escalate)
- Produces an audit pack with hyperlinks back to every source XBert and captured receipt

## Out of scope (no backing data in MCP today)
- Per-employee or per-cardholder patterns
- After-hours / time-of-day posting attribution
- Manual journal forensic review
- Expense claim review (no expense claim data type)
- Mileage-over-threshold per employee
- Approved-with-exception annotations
- Drafted spender follow-up copy — the user writes the communication

If a Custom XBert lands later that captures any of these signals deterministically, the plugin will surface them; until then the agent says so honestly rather than invent the signal.

## Prerequisites
- XBert account
- Client connected to a ledger
- Policy XBerts linked to the Policy Review agent in the Connect portal

## Usage
After installing, type:

    /policy-review

in Claude Code or Claude Desktop.

## Support
hello@xbert.io
