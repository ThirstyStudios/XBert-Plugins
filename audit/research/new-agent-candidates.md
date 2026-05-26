# New XBert agent / plugin candidates (synthesis, 2026-05-26)

## XBerts-as-heroes reorder (Aaron's lens, 2026-05-26)

**Positioning constraint** (CEO ruling, recorded in MEMORY 2026-05-05): XBerts are the heroes. The **deterministic XBert checks** (rule-led + Custom XBerts in Python) detect anomalies, fraud, policy violations, and data-quality issues. **AI plugins do NOT detect** — they orchestrate, synthesise, explain the patterns the XBerts surfaced, draft client communications, and drive resolution. The XBert narrative is "agents define jobs → agents build the deterministic tools (Custom XBerts) they need → determinism produces evidence → tools carry resolution, not just detection." A plugin that says "our AI scans the GL for anomalies" violates the positioning; a plugin that says "your anomaly XBerts found 47 issues this month — here's what's clustered and what to do" honours it.

Tier 1 candidates re-grouped through this lens:

### XBert-led (XBerts fire deterministically; plugin synthesises + resolves)

Each of these depends on the corresponding Custom XBert / rule-led XBert family existing. The plugin's job is to query `Data_XBertNotificationSummary`-style surfaces, cluster findings by pattern, explain root cause, and drive partner approval of the fix.

| # | Original slug | Re-framed name | What the XBerts catch | What the plugin does |
|---|---|---|---|---|
| 1 | `/close-chase` | `/close-chase` | Outstanding XBerts per client per close period (already exists) | Ranks the chase list, drafts reminders, records what was chased, produces delta on rerun |
| 2 | `/gl-anomaly-scan` | `/anomaly-review` | Duplicate journals, posted-and-reversed pairs, round-tripping, vendor-flip on recurring, period-over-period jumps, unusual-day postings — each a Custom XBert | Synthesises the cluster ("8 round-trippings across these 3 entities"), produces evidence pack, drives resolution |
| 3 | `/policy-spend-review` | `/policy-review` | Out-of-policy categories, vendor-anomaly, duplicate submissions, mileage-over-threshold, missing-receipt, receipt-forensic-signal — each a Custom XBert per firm policy | Synthesises weekly violations, drafts client follow-ups, recommends approval action |
| 4 | `/receipt-match` | `/receipt-review` | Orphan receipts + orphan bank lines (XBerts: "Receipt-without-ledger-match", "Bank-line-without-receipt") | Two-click batch approval of matches, drafted spender follow-ups for true orphans |
| 5 | `/inventory-review` | `/inventory-review` | Slow-mover, negative-stock posting, priced-below-cost — each a Custom XBert per client | Synthesises write-down candidates, drives partner sign-off on the write-down journal |
| 6 | `/fx-revaluation-review` | `/fx-review` | Unrevalued FX balance, intercompany FX mismatch, period-end revaluation gap — each a Custom XBert | Proposes revaluation journal, drives partner approval |
| 7 | `/audit-evidence-pack` | `/audit-evidence-pack` | Risk-weighted sample driven by XBerts firing on each transaction (the XBerts ARE the risk signal) | Composes hyperlinked workpapers with each finding's source XBert as evidence |

### Composition / synthesis (no detection involved; XBerts-as-heroes is preserved by design)

These don't run detection at all — they assemble, forecast, or generate. The XBert detection layer still feeds in (e.g. close-packet narrates outstanding XBerts in the variance section) but isn't the central act.

| # | Slug | What it does |
|---|---|---|
| 8 | `/close-packet` | Month-end packet: BS/P&L + variance commentary + journal narrative + outstanding XBerts |
| 9 | `/cashflow-13week` | Forward-looking cash forecast — composition over AR + AP + payroll + tax cadence |
| 10 | `/ar-cadence` | Behaviour-driven AR cadence — prediction + drafted reminder text |
| 11 | `/firm-inbox-triage` | Inbox categorisation + tone-matched drafted reply (grounded in XBert client state) |
| 12 | `/firm-sop-from-recording` | Screen-recording → SOP markdown → firm playbook |

### What changes vs the original synthesis below

- **Tier-1 #2 `/gl-anomaly-scan` → `/anomaly-review`**: re-positioned as the orchestration layer on top of anomaly XBerts. The MCP-gap family "Anomaly / risk-scoring (D)" becomes a Custom-XBert package, not an MCP tool — the deterministic logic lives in Python XBerts (the AutoTune surface), not in MCP.
- **Tier-1 #7 `/policy-spend-review` → `/policy-review`**: same — policy rules are Custom XBerts per firm, the plugin reads what fired.
- **Tier-1 #10/#11 `/inventory-review` and `/fx-revaluation-review`**: each is shipped as (a) a small Custom XBert pack covering the deterministic checks + (b) a plugin that orchestrates them. Coverage map's "named gap" is really two gaps: the XBert pack AND the orchestration plugin.

### What this changes for first-wave priority

The XBert-led group needs **the Custom XBert packs to exist** before the plugin ships. That means three reasonable first-wave shapes:

- **Composition-first wave** (no Custom XBert dependency): `/close-packet` + `/cashflow-13week` + `/ar-cadence`. Three Tier-1 plugins live in weeks, all reuse existing MCP, all preserve XBerts-as-heroes by design.
- **XBert-led pair wave**: pick one XBert-led plugin (e.g. `/anomaly-review`), build the matching Custom XBert pack alongside it. Slower but lands the more differentiated positioning.
- **Mixed wave**: `/close-chase` (XBerts already exist) + `/close-packet` (no XBerts needed) + `/cashflow-13week` (no XBerts needed). Best of both — `/close-chase` is the highest-signal external candidate AND already aligns because outstanding XBerts already drive it.

The original synthesis (below) keeps the candidate rationale intact; this section re-orders by Aaron's lens without rewriting the per-candidate detail.

---

Sourced from:
- `audit/research/jason-staats-claude-mcp.md` (Jason Staats demos + pitched ideas, 2025-2026)
- `audit/research/broader-accounting-ai-scan.md` (vendor + practitioner landscape 2025-2026)
- `audit/research/current-coverage-map.md` (38 system agents + 28 plugins after v3 removals)
- Cross-referenced against `audit/agent-plugin-test-results-local-v3.md` (KEEP / review / WORK tiering)

Selection rule: every Tier 1 candidate must (a) have an external signal in one of the research files, (b) name a clear gap in XBert's existing surface, and (c) fit the MainAgent -> specialist -> MCP-tools -> evidence-backed deliverable shape. Receipt-capture-on-desktop, Custom-XBert-authoring, pre-spend policy enforcement, and the recently-removed surfaces (`xbert-bill-intake`, `xbert-reconcile`, `xbert-cross-sell-opportunities`, `xbert-bank-statement-upload`, `xbert-intercompany-recon`, `interloan-review`) are out unless re-cast.

## Tier 1 - HIGH conviction (strong external signal + clear XBert gap + fits selling shape)

### 1. `/close-chase`
- **Audience:** bookkeeper | practice-manager
- **Surface:** both (system agent + plugin)
- **What it does:** Owns the month-end / quarter-end document chase across a Connect portal. Per client, identifies what is still outstanding (bank statements awaiting reconciliation, missing receipts for posted bills, unposted payroll for the period, missing supplier invoices implied by recurring payments) and produces a ranked chase list with drafted reminder text + recommended channel + SLA timestamp. Re-running it after a chase round closes the loop and produces a "still outstanding" delta.
- **Why now:** Jason Staats explicitly calls month-end close document collection "where AI agents still break down" and the highest-value next target ([jason-staats-claude-mcp.md - six use cases episode](https://www.jasononfirms.com/) podcast). Vendor scan echoes it: Sage Intacct Copilot ships proactive nudges to delayed close-checklist owners, and Truewind reads email/Slack/contracts to attach context to journals during close ([broader-accounting-ai-scan.md - Sage Copilot row](https://www.sage.com/en-us/sage-copilot/) + [Truewind row](https://www.truewind.ai/blog/top-5-ai-bookkeeping-software-for-accounting-firms-in-2025)). Two streams converge on the same job.
- **Why XBert wins:** XBert already holds the Connect/Client hierarchy, notifications, lock dates, bank-rec status, work board, and receipt capture surface. A chase agent stitches them together with a deterministic "still outstanding" definition; competitors stitch across third-party SaaS, we stitch inside our own data model.
- **MCP tool needs:**
  - Exists: `Data_XBertNotificationSummary`, `Data_ReconciliationStatus`, `Features_GetWork`, `Practice_GetConnectAccountReview`, `Data_Bills_Summary`, `Data_OrganisationSettings`.
  - Missing: `Practice_SendChaseMessage` (or compose-only equivalent that posts to Capture chat or queues a Karbon email) - does NOT exist today; v1 can degrade gracefully to drafted-text-only.
  - Missing: `Data_ChaseLedger_Get` / `Data_ChaseLedger_Mark` - small new table to record what was chased when, so the next run produces a delta not a re-chase. New, small.
- **Closest existing XBert overlap:** `/end-of-period-dashboard` (A+P) lists readiness per client; `/scheduled-work` shows work-board state. Neither produces the chase artefact, neither closes the loop with a recorded reminder + delta. `/close-chase` is the action layer on top of those reads.
- **v1 scope:**
  - Per Connect, list of clients with outstanding close items + ranked chase list (no auto-send; drafts only).
  - Drafted reminder text per outstanding item (email + Capture chat tone variants).
  - Record-of-chase in a new small `ChaseLedger` so next run shows what is still outstanding vs what was already chased.
- **Rough effort:** M

### 2. `/receipt-match`
- **Audience:** bookkeeper
- **Surface:** both (system agent + plugin)
- **What it does:** Periodic review that matches captured receipts (already in XDI via xbert-capture) to ledger transactions (bills, bank lines, expense claims) and surfaces the unmatched both ways. Output: (a) high-confidence proposed matches grouped for two-click approval, (b) orphan receipts that have no candidate transaction, (c) orphan bank lines that look like they should have a receipt. Drafts a follow-up to the spender for each orphan with photo-link.
- **Why now:** Jason demoes this manually in the 30-minute Cowork guide and **explicitly says it should run unattended on a folder watch** ([jason-staats-claude-mcp.md row 8:25 of 30-min guide](https://www.linkedin.com/posts/jstaats_a-30-minute-guide-to-claude-cowork-for-accounting-activity-7438979207868878848-IuSi)). He returns to "receipt capture is solved; receipt-to-ledger matching is not" multiple times. Vendor scan parallels: Intuit's cross-product matching auto-matches Payments/Bill Pay/Payroll back to bank feed ([broader-accounting-ai-scan.md - Intuit cross-product row](https://quickbooks.intuit.com/ai-accounting/)). Strong dual-stream signal.
- **Why XBert wins:** We already own the receipt-capture pipeline (`xbert-capture`, XDI fact extraction) and the ledger reads. The matching engine sits naturally between them. Nobody else has both halves under one roof for the firm + client.
- **MCP tool needs:**
  - Exists: `Data_Bills_Summary`, `Data_BankTransactions_Summary`, fact-extraction data already on `XDIAttachment`.
  - Missing: `Data_ReceiptCapture_Unmatched` (orphan-receipt list scoped to a date range + client) - does NOT exist today; would need new.
  - Missing: `Data_ReceiptMatch_Propose` (returns scored candidate ledger lines for a given receipt) - new lightweight scorer over existing data.
  - Missing: `Features_ReceiptMatch_Apply` (records the human approval; doesn't post to ledger - just marks the receipt + transaction as paired in XDI) - new.
- **Closest existing XBert overlap:** Receipt Capture itself stays mobile-only per CEO ruling (2026-05-05). This is the **review-side desktop workflow** that operates on what Capture has already collected. It does NOT recreate `xbert-bill-intake` (which was removed for trying to OCR + Bills_Create) - this runs after capture, against ledger transactions that already exist.
- **v1 scope:**
  - Surface orphan receipts (older than N days) + orphan bank lines that look like missing-receipt candidates.
  - Propose matches with confidence score; partner approves in batch (two-click).
  - On approval, mark the pairing in XDI; do NOT post anything new to the ledger.
- **Rough effort:** L

### 3. `/gl-anomaly-scan`
- **Audience:** accountant | principal
- **Surface:** both
- **What it does:** Period-end anomaly scan over the whole GL (not a sample). Flags duplicate journals, round-tripping between accounts, classification flips on recurring vendors, posted-then-reversed pairs, unusual-day-of-week postings, period-over-period account-balance jumps. Ranks each finding with a confidence + dollar exposure and produces an evidence pack the accountant signs off on as part of review.
- **Why now:** Jason ships a "fraud / anomaly detection skill against the GL" as one of three Claude Skills demos in Dec 2025 and frames it as "the thing every firm should have running every month" ([jason-staats-claude-mcp.md - YouTube HKfauHhIZ9M](https://www.youtube.com/watch?v=HKfauHhIZ9M)). Vendor scan: MindBridge's whole-paradigm is risk-scoring 100% of the GL population, not sampling ([broader-accounting-ai-scan.md - MindBridge row](https://www.mindbridge.ai/platform/)). Also called out in the broader-scan "Adjacent themes" list as something XBert doesn't fully cover. Two streams, same job.
- **Why XBert wins:** XBert's notification system + risk-classification is exactly the surface that an anomaly index drops into. Today our notification model is rule-led + Custom XBert led; an LLM-evidence anomaly layer on top of journal data lets a principal review the long-tail unusual-but-not-rule-defined risks per period.
- **MCP tool needs:**
  - Exists: `Data_JournalMaster_Search`, `Data_FinancialStatements`, `Data_OrganisationSettings`.
  - Missing: `Data_JournalAnomaly_Scan` (server-side enumeration of duplicates / reversals / vendor-flip patterns - too expensive to do in-LLM over thousands of journals) - new, M-sized backend.
  - Optional: `Data_PeriodOverPeriod_Variance` (already partially derivable from current statements, but a structured per-account % delta tool would speed it up) - new, S-sized.
- **Closest existing XBert overlap:** `/financial-review` does BS/P&L review with risk classification; `/xbert-checks` surfaces rule-led XBert notifications. Neither does whole-population anomaly enumeration over journals - they review specific bucket types (BS, P&L, notifications), not the journal stream itself.
- **v1 scope:**
  - Six fixed-pattern checks: duplicate journals, posted-and-reversed pairs, unusual-day postings, round-tripping, vendor-flip on recurring, period-over-period jump.
  - Per-finding evidence pack (journal lines + reason + $ exposure).
  - No auto-action; partner reviews and decides.
- **Rough effort:** M

### 4. `/close-packet`
- **Audience:** accountant | principal
- **Surface:** both
- **What it does:** Generates the close packet at month/quarter end: cover, BS/P&L with variance commentary, journal narrative for material adjustments, KPI page, narrative summary "what changed this period and why" sourced from journals + bank-tx changes. Output as a Word/PDF artefact ready to send to the client or partner.
- **Why now:** Vendor scan: Digits, Pilot, Truewind, Sage Copilot **all** ship a close packet / financial-statement narrative as a first-class artefact ([broader-accounting-ai-scan.md - "Adjacent themes" #1](https://www.truewind.ai/blog/top-5-ai-bookkeeping-software-for-accounting-firms-in-2025)). Coverage map flags explicitly "XBert does not produce a close packet; we could." Jason's "AI workpaper automation experiment" episode ([jason-staats-claude-mcp.md row 13](https://www.jasononfirms.com/)) points at the same artefact.
- **Why XBert wins:** We already have `/month-end-pack` (P) and `/balance-sheet-explain` (A+P) producing the data + narrative slices. They don't compose into a single client-deliverable packet. This stitches them.
- **MCP tool needs:**
  - Exists: `Data_FinancialStatements`, `Data_Cashflow`, `Data_BudgetAdherence`, `Data_JournalMaster_Search`, `Data_BankTransactions_Summary`.
  - Missing: nothing critical - this is a composition layer over existing tools + a Word render. Could borrow the BAS/VAT/FBT Word renderer used by the prep plugins.
- **Closest existing XBert overlap:** `/month-end-pack` (P) builds the monthly pack at fixed sections but doesn't synthesise the narrative. `/balance-sheet-explain` produces the line-by-line walk for one statement. `/close-packet` is "month-end-pack + balance-sheet-explain + journal-narrative -> single client-ready deliverable." Worth investigating whether this should be folded into `/month-end-pack` v2 instead of a new command.
- **v1 scope:**
  - Compose existing month-end-pack + balance-sheet-explain outputs + a new "material journals this period" narrative section.
  - Word/PDF render with cover page + KPI page.
  - Read-only; partner signs off before sending.
- **Rough effort:** S (reuses existing prep-plugin Word render + existing data plugins)

### 5. `/firm-inbox-triage`
- **Audience:** practice-manager | bookkeeper
- **Surface:** plugin
- **What it does:** Periodic (e.g. daily) scan of the firm's connected inbox (Gmail / M365 via Claude Code connectors). Categorises threads (client question, lodgement notice, supplier query, internal, marketing, escalation), priority-scores each, drafts a tone-matched reply for each high-priority item in the firm's voice, and produces a triage summary. Operator approves/edits the drafts before sending.
- **Why now:** Jason calls out "email triage" as the #1 place firms should build agents ([jason-staats-claude-mcp.md row 17 - five-levels-of-autonomy podcast](https://www.jasononfirms.com/)). Vendor scan: Karbon AI ships exactly this (tone-matched draft reply + thread summary + priority) and it's the most-deployed practice-mgmt AI feature ([broader-accounting-ai-scan.md - Karbon AI row](https://karbonhq.com/feature/ai/)). Dual signal.
- **Why XBert wins:** We have firm-level notification context, client-state context, and lodgement schedule context that Gmail-side AI can't see. A draft that says "BAS draft was sent to you yesterday - approve in `/bas-prep`?" beats a generic "thanks for your email" reply.
- **MCP tool needs:**
  - Missing entirely: an email-connector MCP layer. Could lean on Claude Code's built-in Gmail/M365 connectors (per Jason's pattern) - no new XBert tool needed for read.
  - Missing: `Data_ClientContext_ByEmailAddress` (given an email From: address, return the matching client tenant + recent notifications/lodgement state) - new, S-sized.
- **Closest existing XBert overlap:** `/my-work` shows daily work; doesn't include inbox. Karbon ships this directly so the wedge has to be the **client-state context** XBert provides that Karbon doesn't.
- **v1 scope:**
  - Plugin only (lives where the operator's Gmail/M365 already is - Claude Code).
  - Categorisation + priority + drafted reply for top N threads.
  - No auto-send; operator approves.
- **Rough effort:** M

### 6. `/ar-cadence`
- **Audience:** bookkeeper
- **Surface:** both
- **What it does:** Behaviour-driven AR cadence. For each debtor, predicts when they'll actually pay (based on prior payment latency vs. invoice due date), recommends reminder timing + tone, and drafts the per-debtor reminder. Output: a debtor call/send list ranked by $ x predicted-days-overdue, with drafted reminders in the firm's tone.
- **Why now:** Vendor scan: **both** Xero JAX and MYOB Smart Invoice Reminders ship behaviour-driven (not calendar-driven) reminders. Listed in the broader-scan adjacent themes as "predicted-payment / debtor-behaviour-aware AR cadence" and called out as "would slot into Capture/Connect cleanly" ([broader-accounting-ai-scan.md - Xero JAX + MYOB Smart Invoice Reminders + adjacent themes](https://www.techrepublic.com/article/xero-jax-significant-updates/)). Two ledger giants converging is a hard "table-stakes by 2027" signal.
- **Why XBert wins:** Our `/aged-receivables` already ranks by `$ x days x prior-promise`; it stops at the call list. The behavioural cadence + per-debtor predicted-pay-date + tone-matched draft moves it from "here's the list" to "here's what you should send and when". And it works **across** Xero + QBO + MYOB clients - the firm has one cadence regardless of ledger.
- **MCP tool needs:**
  - Exists: `Data_AgedSummary`, `Data_Invoices_Search`, `Data_Contacts_Get`, journal/payment history for latency.
  - Missing: `Data_DebtorLatency_Predict` (per-contact predicted-pay-date based on historic latency) - new, S-sized. Could be a simple median-of-last-N model in v1, not ML.
  - Missing: `Features_DraftDebtorReminder` (draft tone-matched reminder text) - probably no separate tool; live in the prompt with `Data_FirmTone` as a context source.
- **Closest existing XBert overlap:** `/aged-receivables` (A+P) does the call list + scoring but doesn't predict payment date or draft tone-matched reminders. This is `/aged-receivables` v2; consider folding rather than new command. Listed as new because the behavioural-prediction primitive is genuinely a new piece, not a tweak.
- **v1 scope:**
  - Per debtor: predicted-pay-date + recommended reminder window + drafted reminder text.
  - Output remains a list the operator works through; no auto-send.
  - v1 prediction = "median latency over last 12 invoices"; defer ML.
- **Rough effort:** M

### 7. `/policy-spend-review`
- **Audience:** bookkeeper | accountant
- **Surface:** plugin
- **What it does:** Periodic (weekly) review of posted expenses against firm + client policy. Flags: duplicate submissions, missing receipts, out-of-policy categories, vendor anomalies, fake-receipt forensic signals (copy-move / metadata / greyscale on the captured image). Produces a per-period audit pack for the bookkeeper.
- **Why now:** Vendor scan: Navan does this in real-time (per-transaction at submission) and Klippa runs forensic copy-move / metadata / greyscale checks on captured invoices ([broader-accounting-ai-scan.md - Navan + Klippa rows](https://navan.com/blog/ai-expense-management) + [Klippa](https://www.klippa.com/en/ocr/financial-documents/invoices/)). Ramp ships invoice-fraud agents flagging USD 1M+ in early access ([broader-accounting-ai-scan.md - Ramp AP row](https://ramp.com/blog/ramp-ap-agents-announcement)). Three vendors at the same job.
- **Why XBert wins:** Real-time pre-spend enforcement is **out of scope** (per the constraints). But the **periodic review** version - "here's last week's spend, here's what looks off" - is a natural extension of XBert's notification + Receipt Capture surfaces. We already have the receipt image and the posted transaction. The forensic checks (copy-move, metadata, greyscale) are cheap once the image is in XDI.
- **MCP tool needs:**
  - Exists: `Data_Bills_Summary`, `Data_BankTransactions_Summary`, receipt images in XDI.
  - Missing: `Data_ReceiptForensic_Scan` (copy-move + metadata + greyscale check on a captured receipt) - new, M-sized (image-forensics library work).
  - Missing: `Data_PolicyRules_Get` (firm + client policy rules - max per category, banned vendors, mileage thresholds) - new, S-sized; in v1 the rules live in the prompt + per-client tags, no dedicated table.
- **Closest existing XBert overlap:** `/financial-review` reviews P&L but not against policy. `/xbert-checks` surfaces rule-led notifications. No existing surface combines posted-expense review + receipt-forensic checks + policy match. Recasts the rejected "pre-spend enforcement" idea as a periodic review per the constraint.
- **v1 scope:**
  - Weekly review of posted expenses + receipts.
  - Six fixed checks: duplicate, missing receipt, out-of-policy category, vendor anomaly, mileage-over-threshold, forensic-signal-on-image.
  - Audit pack output; no auto-action.
- **Rough effort:** M

### 8. `/audit-evidence-pack`
- **Audience:** accountant
- **Surface:** plugin
- **What it does:** Produces an external-auditor-ready evidence pack for a chosen period: risk-weighted sample selection across journals + revenue + AP, source-document hyperlinks for each sample, lead schedule per material account, exception note summary. The deliverable is what a firm hands their external auditor at year-end.
- **Why now:** Vendor scan: Thomson Reuters Audit Intelligence (with Validis) ships **exactly this** - risk-based sample selection + automated workpaper hyperlinks ([broader-accounting-ai-scan.md - Audit Intelligence row](https://tax.thomsonreuters.com/blog/meet-audit-intelligence-test-the-end-of-manual-audit-testing/)). DataSnipper's DocuMine is "up 1,100% in 2025" doing workpaper assembly ([DataSnipper row](https://www.datasnipper.com/resources/ai-report-2025-the-revolution-in-audit-and-finance)). Jason's "AI workpaper automation experiment" episode points at the same artefact ([jason-staats-claude-mcp.md - workpaper experiment](https://www.jasononfirms.com/)). Three sources, same job.
- **Why XBert wins:** XBert already produces audit-evidence Word docs for BAS/VAT/IAS/GST under the QMS framing. Generalising that pattern to "audit evidence pack for external auditor" is a natural step. Our journal + bank-tx + fixed-asset surfaces feed it directly.
- **MCP tool needs:**
  - Exists: `Data_JournalMaster_Search`, `Data_FinancialStatements`, `Data_FixedAssets_Search`, `Data_Bills_Search`, `Data_Invoices_Search`.
  - Missing: `Data_RiskWeightedSample_Select` (given a period + account, return a risk-weighted sample of N transactions) - new, M-sized; v1 = simple stratified-by-amount sample, defer ML risk scoring.
  - Missing: `Data_SourceDocLink_Get` (hyperlink to the source document in XDI / Capture for a given transaction) - smallish but new.
- **Closest existing XBert overlap:** The QMS-Word output from `/bas-prep`, `/vat-prep` etc. is the same shape (evidence pack with hyperlinks). This generalises that pattern to "for an external auditor, here's the full period."
- **v1 scope:**
  - One period, one entity.
  - Sample-select across journals / revenue / AP at fixed stratification (top-by-amount + random sample).
  - Word/PDF output with hyperlinks to source docs in Capture/XDI.
- **Rough effort:** M

### 9. `/cashflow-13week`
- **Audience:** accountant | principal
- **Surface:** both
- **What it does:** Produces a 13-week rolling cashflow forecast per client. Combines actual bank balance + AR ageing with predicted-pay-dates (`/ar-cadence` model) + AP due dates + recurring payroll/tax obligations. Output: weekly cash position chart + named risk weeks + recommended actions (e.g. "delay supplier X by 7 days" or "draw down on facility on week 4").
- **Why now:** Coverage map directly flags: "No cashflow forecast or 13-week cashflow agent. `/pulse` detects tempo change, `/instalment-variation` looks at cashflow run-rate, but neither produces a forward-looking cash forecast" ([current-coverage-map.md "Notable gaps" #5](audit/research/current-coverage-map.md)). Vendor scan implies it via Pilot's "AI Accountant" and Digits' continuous close ([broader-accounting-ai-scan.md](https://www.accountingtoday.com/news/pilot-launches-fully-autonomous-ai-bookkeeper)). Internal-and-external signal agree.
- **Why XBert wins:** We hold AR + AP + payroll cadence + tax obligation data in one place. A 13-week forecast is a composition not a new ML model.
- **MCP tool needs:**
  - Exists: `Data_AgedSummary`, `Data_Bills_Summary`, `Data_PayRuns_Summary`, `Data_BankTransactions_Summary`, `Data_Cashflow`.
  - Reuses: `Data_DebtorLatency_Predict` (from `/ar-cadence`).
  - Missing: nothing critical if `/ar-cadence` ships first; otherwise needs the latency prediction.
- **Closest existing XBert overlap:** `/pulse` (rolling tempo, backward-looking), `/instalment-variation` (tax-instalment driven). Neither is forward-looking cash-position. This explicitly is.
- **v1 scope:**
  - One client, 13 weeks forward, weekly buckets.
  - AR + AP + payroll + tax + recurring bank-tx.
  - Named risk weeks + top 3 recommended actions.
- **Rough effort:** S (assuming `/ar-cadence` lands first)

### 10. `/inventory-review`
- **Audience:** accountant
- **Surface:** plugin
- **What it does:** Periodic stock-on-hand reconciliation for clients with a product-based ledger. Flags slow-moving items, COGS variance vs prior period, negative-stock postings, items priced below cost, and produces a write-down candidate list with $ exposure.
- **Why now:** Coverage map flags directly: "No inventory / stock review... Anyone with a product-based ledger is uncovered" ([current-coverage-map.md "Notable gaps" #1](audit/research/current-coverage-map.md)). Vendor scan doesn't surface a market-leading inventory-AI agent, which is itself signal: this is a gap competitors haven't filled either. Single-source signal (internal) but a clear hole.
- **Why XBert wins:** Existing ledger reads expose inventory accounts; we already do this kind of review across other domains (FBT, depreciation, trust). Same pattern, new domain.
- **MCP tool needs:**
  - Exists: `Data_FinancialStatements` (inventory accounts in BS), `Data_JournalMaster_Search` (cost-of-sales journals).
  - Missing: `Data_Inventory_Items` (per-item SKU list with on-hand qty + avg cost) - new, M-sized. Xero + QBO both expose this via their APIs but XBert doesn't surface it through MCP today.
- **Closest existing XBert overlap:** None. Inventory has zero dedicated coverage.
- **v1 scope:**
  - Product-based clients only (filtered by COA hint).
  - Slow-mover detection (no movement in N days), negative-stock postings, items priced below cost.
  - No write-down posting; partner approves manually.
- **Rough effort:** L (because the inventory-items MCP tool is genuinely new and per-ledger)

### 11. `/fx-revaluation-review`
- **Audience:** accountant
- **Surface:** plugin
- **What it does:** Reviews FX exposure for clients with multi-currency activity. Flags unrevalued foreign balances, unrealised vs realised FX gains, intercompany FX mismatches, and proposes the period-end revaluation journal.
- **Why now:** Coverage map flags directly: "No foreign-currency revaluation / FX exposure review... Material gap for clients with overseas trade or FX bank accounts" ([current-coverage-map.md "Notable gaps" #2](audit/research/current-coverage-map.md)). Vendor scan doesn't show a leading FX-revaluation AI agent specifically (most ERP tools have it built in but it's not their AI story). Internal-only signal but a clear capability gap.
- **Why XBert wins:** Same logic as `/inventory-review`: ledger reads expose multi-currency accounts; the pattern of "scan, propose journal, partner approves" matches existing FBT/Div7A/loan reviews.
- **MCP tool needs:**
  - Exists: `Data_FinancialStatements`, `Data_JournalMaster_Search`, `Data_OrganisationSettings`.
  - Missing: `Data_FxRates_Get` (period-end FX rates by currency pair) - new, S-sized; could lean on a public-FX-rate feed.
  - Missing: `Data_MultiCurrency_Balances` (per-account balances broken out by transaction currency, not just base) - new, M-sized.
- **Closest existing XBert overlap:** None.
- **v1 scope:**
  - One client per run.
  - Unrealised FX gain/loss on FX bank accounts and FX AR/AP.
  - Propose revaluation journal; partner approves.
- **Rough effort:** L (multi-currency balances tool is non-trivial)

### 12. `/firm-sop-from-recording`
- **Audience:** practice-manager | principal
- **Surface:** plugin
- **What it does:** Operator drops a screen recording + voice-over of a task they do regularly. Plugin produces a structured SOP markdown (steps, decision points, gotchas, who-it-applies-to) and offers to write it back into the firm's playbook. Re-runnable so the SOP improves as the task evolves.
- **Why now:** Jason calls SOP-from-screen-recording his "easiest AI-native firm policy update" and demoes it in the "six use cases" podcast ([jason-staats-claude-mcp.md row 4 - LinkedIn activity-7415074855433322497](https://www.linkedin.com/posts/jstaats_most-ai-apps-for-accounting-firms-suck-for-activity-7415074855433322497-z880)). Recurring theme: "AI exposes SOP debt." Vendor scan doesn't surface a leader specifically, which is itself signal.
- **Why XBert wins:** SOP debt directly blocks XBert's value (the more standardised the firm, the more agents can do). Bringing SOP creation inside the agent stack closes the loop: agents grounded in firm SOPs, SOPs generated from real firm work.
- **MCP tool needs:**
  - Missing: video transcription + frame analysis (probably leans on Claude's native computer-vision; no XBert tool needed).
  - Missing: `Features_FirmPlaybook_Get` / `Features_FirmPlaybook_Save` - new, S-sized. New small store for firm-level SOPs.
- **Closest existing XBert overlap:** None.
- **v1 scope:**
  - Single recording in, structured SOP markdown out.
  - Save to firm playbook (new small store).
  - No automatic agent grounding in v1 - that's v2.
- **Rough effort:** M

## Tier 2 - MEDIUM conviction

### 13. `/flux-explain`
- **Audience:** accountant
- **Surface:** plugin
- **What it does:** Account-by-account variance explanation between two periods using dimensional pivots and learned firm-specific reason codes. Output mirrors how a controller would walk a board through "what moved this month and why."
- **Why now:** Numeric ships this with NetSuite dimensional pivots + learned reason codes ([broader-accounting-ai-scan.md - Numeric row](https://www.numeric.io/product/ai-in-numeric)). Listed in adjacent themes. Single vendor signal but a clear next step from `/balance-sheet-explain`.
- **Closest existing XBert overlap:** `/balance-sheet-explain` does the BS line walk. `/flux-explain` is the P&L flux walk with learned reason codes - genuinely additive, not duplicate.
- **MCP tool needs:** `Data_FinancialStatements` exists; learned reason codes are a new small store (or in-prompt for v1).
- **Rough effort:** S

### 14. `/lease-extract`
- **Audience:** accountant
- **Surface:** plugin
- **What it does:** Reads a lease PDF, extracts commencement date / payment schedule / variable rent / options, maps to AASB 16 (AU) / IFRS 16 / FRS 102 (UK) required journals + disclosures, and produces the recognition + amortisation schedule.
- **Why now:** Trullion ships this for ASC 842 + ASC 606 ([broader-accounting-ai-scan.md - Trullion row](https://www.lido.app/blog/best-datasnipper-alternatives)). Coverage map flags "AASB 15/16 equivalent for AU is unaddressed" in adjacent themes. Single vendor + one internal-gap call-out.
- **Closest existing XBert overlap:** `/loan-review` does loan/HP/lease classification but doesn't extract from a contract PDF or produce the amortisation schedule.
- **MCP tool needs:** PDF extraction + new `Data_LeaseSchedule_Calc` for the amortisation math. M-sized backend.
- **Rough effort:** M

### 15. `/engagement-letter-draft`
- **Audience:** practice-manager | principal
- **Surface:** plugin
- **What it does:** Drafts an engagement letter for a new client (or annual refresh) given service mix + scope + fee structure. Pulls firm-specific clauses from the firm playbook. Output: Word/PDF ready to send via DocuSign / Ignition / paper.
- **Why now:** Ignition + Anchor both ship this directly ([broader-accounting-ai-scan.md - Ignition + Anchor rows](https://www.ignitionapp.com/product/engagement-letters)). Coverage map flags "`/client-onboard` references the engagement letter as a gate but doesn't produce one" - internal gap.
- **Closest existing XBert overlap:** `/client-onboard` (A+P) gates on the letter; this would produce it.
- **MCP tool needs:** Firm-playbook store (shared with `/firm-sop-from-recording`), Word render. Nothing new on top.
- **Rough effort:** S
- **Caveat:** Aaron's strategy may be "partnership-with-Ignition not build" (coverage map adjacent-themes note). Tier-2 not Tier-1 because of that strategic call.

### 16. `/au-tax-research`
- **Audience:** accountant
- **Surface:** plugin
- **What it does:** Conversational AU tax research with cited authority (ATO TRs, TDs, ID rulings, case law, GST/FBT determinations). Answers tend to "is this deductible?" / "what does this ruling say?" style questions with hyperlinks to source.
- **Why now:** Blue J ships this for 220+ jurisdictions; CoCounsel Tax bridges Checkpoint + AICPA/FASB/GASB/IFRS ([broader-accounting-ai-scan.md - Blue J + CoCounsel rows](https://www.cpa.com/tax-research)). Coverage map flags "AU equivalent (ATO/ATO TR rulings) does not exist at the same depth; potential XBert wedge" - direct wedge call.
- **Closest existing XBert overlap:** None. XBert has compliance readiness agents but no tax-research agent.
- **MCP tool needs:** `Data_AuTaxRuling_Search` (new) - retrieval over ATO content. L-sized backend (legal-content licensing question is the bigger blocker than tech).
- **Rough effort:** L
- **Caveat:** Tier 2 not Tier 1 because the licensing-for-ATO-content question is real and may dominate over engineering.

### 17. `/credit-risk-debtor`
- **Audience:** accountant | principal
- **Surface:** plugin
- **What it does:** Customer credit-risk scoring beyond ageing. Flags credit-limit breaches, concentration risk (top 5 debtors as % of AR), insolvency-signal monitoring (public AU/NZ/UK insolvency feeds), payment-latency deterioration on key customers.
- **Why now:** Coverage map directly flags "No debtor / customer risk scoring beyond ageing" ([current-coverage-map.md "Notable gaps" #3](audit/research/current-coverage-map.md)). Vendor scan doesn't surface a leader specifically. Internal-only signal but a clear hole.
- **Closest existing XBert overlap:** `/aged-receivables` is ageing-only. `/credit-risk-debtor` is the risk layer on top.
- **MCP tool needs:** `Data_InsolvencyFeed_Get` (new, M-sized; AU = ASIC + NZ = NZBN + UK = Companies House feeds).
- **Rough effort:** M

### 18. `/multi-site-policy-scan`
- **Audience:** principal | practice-manager
- **Surface:** plugin
- **What it does:** For practices that operate as multi-site groups (e.g. franchise networks, multi-branch retail), scans across all sites for policy violations and hidden SaaS subscriptions. Output: per-site exception report.
- **Why now:** PizzaExpress case (via Blake Oliver) uses AI to do exactly this across 350+ locations ([broader-accounting-ai-scan.md - PizzaExpress row](https://accounting.show/434/transcript)). Practitioner signal. Pattern transfers cleanly to multi-entity bookkeeping practices.
- **Closest existing XBert overlap:** `/consolidation-review` (A) does multi-entity intercompany + elimination. `/multi-site-policy-scan` is the operations-side equivalent - same multi-entity primitive but for policy compliance not intercompany.
- **MCP tool needs:** Uses existing multi-entity loop via `Data_GetClientConnections`. Reuses `/policy-spend-review`'s rule engine.
- **Rough effort:** S (if `/policy-spend-review` lands first)

### 19. `/data-quality-deep-dive`
- **Audience:** bookkeeper
- **Surface:** plugin
- **What it does:** Per-client deep-dive on data quality (vs. portfolio roll-up). Surfaces specific records causing the DQ score: unposted bank rules, contact dupes, COA misallocations, journal-tag inconsistencies. Produces a fix-list with one-click apply where safe.
- **Why now:** Coverage map flags `/practice-health-check` (review tier) is portfolio-roll-up only. The per-client drill-down doesn't exist as a dedicated workflow. Internal signal. Vendor scan: Truewind + Pilot + Digits all ship some form of "auto-tidy the books" - vendor signal.
- **Closest existing XBert overlap:** `/practice-health-check` (P) is rollup. `/health-check` (A) is mixed firm + client. Neither is a per-client deep-fix list.
- **MCP tool needs:** Existing `Data_DataQualityScore` + drill-down details (some new sub-tools for specific fix types).
- **Rough effort:** M

### 20. `/firm-tone-train`
- **Audience:** practice-manager
- **Surface:** plugin
- **What it does:** Plugin that ingests N sample emails / notes / client letters from the firm to learn a firm-tone profile, then exposes that profile to other agents (`/ar-cadence`, `/firm-inbox-triage`, `/close-chase`) so drafted client comms sound like the firm.
- **Why now:** Karbon AI does exactly this for the email-reply flow ([broader-accounting-ai-scan.md - Karbon AI row](https://karbonhq.com/feature/ai/)). Vendor signal. Listed in adjacent themes as "AI-drafted reply in firm's own tone of voice... voice-matching at firm level is the next step."
- **Closest existing XBert overlap:** None. Agents draft generic-tone text today.
- **MCP tool needs:** `Features_FirmTone_Get` / `Features_FirmTone_Save` (new, small).
- **Rough effort:** S
- **Caveat:** Genuinely useful but only if 2+ other agents consume it. Tier 2 until at least `/ar-cadence` or `/firm-inbox-triage` lands.

### 21. `/test-data-generator`
- **Audience:** practice-manager | engineering
- **Surface:** plugin
- **What it does:** Generates a realistic synthetic ledger (BS + P&L + bank tx + journal master + payroll) for training juniors and testing AI workflows without touching real client data. Configurable by industry / size / country.
- **Why now:** Jason demoes this as one of three Claude Skills in HKfauHhIZ9M and frames it as "solves the privacy block to AI adoption + training" ([jason-staats-claude-mcp.md - YouTube HKfauHhIZ9M](https://www.youtube.com/watch?v=HKfauHhIZ9M)). Single vendor + cross-cutting utility.
- **Closest existing XBert overlap:** None. Useful for XBert internal training data too.
- **MCP tool needs:** Nothing - generation is LLM-side. Write to a "training tenant" partition (`testTenantId`).
- **Rough effort:** S

## Tier 3 - LOW conviction (parking lot)

- **`/payroll-anomaly`** - per-pay-run anomaly scan (unusual hours / pay-rate jumps / new-starter without onboarding flow). Karbon-adjacent. Likely folds into `/payroll-close` v2 rather than new command.
- **`/contract-extract`** - generalised contract-PDF extraction (not just leases). Trullion adjacency. Lease is the high-value subset; generalised version is too broad for v1.
- **`/payroll-stp-finalisation-v2`** - extend STP finalisation to include classification suggestions for Phase 2 + RFB drafting. Probably already covered inside `/stp-finalisation` v1.
- **`/karbon-roll-up`** - if Karbon ships an MCP server (per Jason's prediction), wrap it as XBert tools and produce a "Karbon + ledger" combined daily brief. Speculative until the MCP exists.
- **`/treasury-crypto-dash`** - Jason's "crypto dashboard / treasury view" idea. Niche audience inside our user base.
- **`/ai-prospecting`** - Jason's "AI-powered prospecting" agent for firm growth. Firm-marketing not firm-operations; off-mission.
- **`/firm-billing-suggest`** - Ignition AI Price Insights pattern - benchmark fees by service mix. Useful but commercially sensitive and overlaps `/client-fee-review`.
- **`/audit-sampling-statistical`** - separates the sample-selection step from `/audit-evidence-pack` for firms that want bare sampling. Probably absorbed into Tier 1 #8.
- **`/board-deck-narrate`** - generate the narrative for a board pack from the close packet. Likely sits inside `/close-packet` v2.

## Considered and explicitly REJECTED

| Candidate | Why rejected (one line) |
|---|---|
| `/desktop-receipt-scan` | Receipt Capture stays mobile-only per CEO ruling 2026-05-05; would re-introduce the problem `xbert-bill-intake` was removed for. |
| `/custom-xbert-builder` | Custom XBerts are Python-only with their own AutoTune workstream; explicit out-of-scope per CEO ruling. |
| `/pre-spend-policy-enforcer` | Pre-spend behavioural enforcement explicitly out per constraints; the periodic-review version is `/policy-spend-review` (Tier 1 #7). |
| `/intercompany-recon` (recreate) | Removed in v3; `/consolidation-review` (A) already covers the intercompany matching primitive at the same level - no new wedge. |
| `/bank-statement-upload` (recreate) | Removed in v3; would need OCR + bank-statement-parse + bank-import write tools (none exist). Re-introduces same gap that caused removal. |
| `/interloan-review` (recreate) | Removed in v3; `/loan-review` (A) + `/directors-loan-review` (A) already cover the same surface. |
| `/cross-sell-lookalike` (recreate) | Removed in v3 - needs `Data_FindLookalikeClientsByProfile` similarity primitive (not just name). Out until that primitive lands. Listed as cross-cutting MCP gap below. |
| `/end-to-end-bookkeeper` (Pilot/Digits style) | "AI accountant that does it all" is not XBert's selling shape; we are agent-per-job with evidence packs and human approval. |
| `/zapier-glue-firm-internal` | Practitioner pattern (Liz Mason) but firm-internal automation glue is Karbon/Zapier territory, not ours. |
| `/proposal-generator` | Anchor / Ignition own this market and we have a partnership strategy; tactical Tier 2 entry `/engagement-letter-draft` only. |
| `/ledger-coding-on-bank-side` | Relay's pattern (code at bank layer). Bank-side is not XBert's surface. |
| `/qbo-tool-extender` | Eric Grill "143 tools on QBO via MCP" pattern; useful framing for our own surface but not a customer-facing slash command. |
| `/livedashboard-bankrec` | Jason's "bank rec dashboard as Live Artifact" demo. Live-artifact dashboards aren't our delivery shape - we ship Word + agent answers. Worth tracking as a UI experiment, not a candidate. |
| `/email-from-screenshot` | Sub-feature of `/firm-inbox-triage`; not a standalone command. |
| `/lodgement-direct-submit` | Direct lodgement to ATO/HMRC/IRD explicitly out-of-scope per coverage map. |
| `/post-journal-on-behalf` | Direct posting explicitly out-of-scope per coverage map; we draft, user approves and posts. |

## Cross-cutting MCP tool gaps surfaced

Grouping by theme so the gap-ticket batch is manageable.

**A. Receipt + bill capture write paths (blocks: `/receipt-match`, related recovery for removed `xbert-bill-intake`):**
- `Data_ReceiptCapture_Unmatched` - orphan receipt list (new)
- `Data_ReceiptMatch_Propose` - candidate ledger lines for a receipt (new)
- `Features_ReceiptMatch_Apply` - record the pairing (new, doesn't post)
- `Data_ReceiptForensic_Scan` - copy-move + metadata + greyscale forensic on captured image (new)

**B. Compliance label calculators (blocks: `/bas-prep` deepening, `/ias-prep`, `/gst-prep-nz`, `/vat-prep`, `/mtd-prep`, all listed in v3 cross-cutting #2):**
- `Validation_BASReconciliation` / `Compliance_AUBASLabels` - W1-W5 + G1-G11 + 1A/1B
- `Compliance_NZGST101Boxes`
- `Compliance_HMRCSACategoryMap`
- `Compliance_VATBoxes`

**C. Lookalike + similarity (blocks: recreating `/cross-sell-opportunities`):**
- `Data_FindLookalikeClientsByProfile` - real similarity model (industry + size + transaction-profile + service-mix), not name-based.

**D. Anomaly / risk-scoring (blocks: `/gl-anomaly-scan`, `/credit-risk-debtor`, `/audit-evidence-pack`):**
- `Data_JournalAnomaly_Scan` - whole-population GL anomaly enumeration (new)
- `Data_PeriodOverPeriod_Variance` - structured variance per account (new)
- `Data_RiskWeightedSample_Select` - risk-weighted sample selector (new)
- `Data_InsolvencyFeed_Get` - ASIC / NZBN / Companies House insolvency-signal feed (new)

**E. Forward-looking + behavioural prediction (blocks: `/cashflow-13week`, `/ar-cadence`):**
- `Data_DebtorLatency_Predict` - per-debtor predicted-pay-date (new, simple median model in v1)

**F. Multi-currency + inventory (blocks: `/fx-revaluation-review`, `/inventory-review`):**
- `Data_FxRates_Get` - period-end FX rates by currency pair (new)
- `Data_MultiCurrency_Balances` - per-account balances by transaction currency (new)
- `Data_Inventory_Items` - per-item SKU list with on-hand qty + avg cost (new)

**G. Chase ledger + reviewer queue (blocks: `/close-chase`, `/policy-spend-review` follow-up):**
- `Data_ChaseLedger_Get` / `Data_ChaseLedger_Mark` - new small store for "what did we chase, when, and what's still outstanding" (new)
- `Practice_SendChaseMessage` (or compose-only equivalent) - draft-or-send a chase message via Capture chat / Karbon email (new, optional - v1 can degrade to drafted-text)

**H. Firm-level metadata stores (blocks: `/firm-tone-train`, `/firm-sop-from-recording`, `/engagement-letter-draft`):**
- `Features_FirmTone_Get` / `Features_FirmTone_Save` - firm voice profile (new, small)
- `Features_FirmPlaybook_Get` / `Features_FirmPlaybook_Save` - firm SOPs + clauses store (new, small)
- `Features_PolicyRules_Get` - per-firm + per-client policy rules (new, small)

**I. Inbox connectors (blocks: `/firm-inbox-triage`):**
- Lean on Claude Code Gmail / M365 connectors per Jason's pattern; XBert tool needed = `Data_ClientContext_ByEmailAddress` so the email-side agent can pull XBert's client state when drafting replies (new, small).

**J. Source-doc hyperlinks (blocks: `/audit-evidence-pack`, sharpens `/close-packet`):**
- `Data_SourceDocLink_Get` - hyperlink to the source document in XDI/Capture for any transaction (new, small).

**K. Validation tools registered in canonical-241 but not in local MCP (from v3 cross-cutting #1):**
- `Validation_BankReconciliation`, `Validation_PayrollReconciliation`, `Validation_SuperReconciliation`, `Validation_BalanceSheetReview` - already canonical, just unregistered. Lowest-cost win, unblocks several review-tier surfaces.

**L. Connect-level rollup aggregators (from v3 cross-cutting #7, blocks: `/practice-health-check`, `/pulse` plugin, `/practice-metrics`):**
- A Connect-level aggregator family so portfolio-wide rollups don't need N x per-client loops (e.g. `Practice_DataQualityRollup`, `Practice_NotificationRollup`, `Practice_InvoicesRollup`).
