---
name: client-pulse
description: Methodology for detecting and acting on transactional tempo changes in a practice's client book. Trigger when reviewing client metrics, tempo, churn risk, scaling clients, or whether to call a client.
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Client tempo monitoring

## Goal
Surface material changes in client transactional volume early enough to act commercially — before the client leaves, complains, or out-grows your fee structure.

## The comparison
- **Recent**: rolling 1-month transactional volume
- **Baseline**: trailing 2-3 month average, excluding the current month
- **Delta**: `(recent − baseline) / baseline`, expressed as %

## Materiality thresholds (defaults, practice-configurable)
| Band | Up | Down |
|---|---|---|
| Noise | 0 → +15% | 0 → -15% |
| Watching | +15% → +30% | -15% → -30% |
| Material | >+30% | <-30% |

Practices should override these — high-volume bookkeepers may use ±15% / ±30%; lower-volume accountants ±25% / ±50%.

## Up direction — action template
- **+30 to +50%**: monitor one more month, then consider service-tier review
- **+50 to +100%**: book a quarterly business review, raise service-tier conversation
- **+100%+**: urgent — client is scaling, your fee is almost certainly under-priced

## Down direction — action template
- **-30 to -50%**: schedule a check-in call this fortnight
- **-50 to -75%**: call this week, ask directly about changes or concerns
- **-75%+**: red flag — call today, possibly partner-level

## Always
- Show the raw numbers, not just the delta
- Note possible explanations (seasonal, new product, layoffs, M&A) without asserting them
- Never auto-send outreach — propose drafts only
- Flag if a client has <3 months of history (baseline unreliable)
- Distinguish a single anomalous month from a sustained trend
