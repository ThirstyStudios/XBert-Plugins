---
name: config-audit
description: "Run the XBert Config Audit across a Connect tenant — fingerprint per-client XBert rule enablement, segment the book, and surface inconsistencies, gaps and drift with named bulk-normalisation moves. Use when the user asks about XBert configuration consistency, whether rules are set up the same across clients, configuration drift, standardisation, the /config-audit slash command, or 'are we set up consistently'. Distinct from the workflow review skill, which looks at templates and schedules."
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# Config Audit

A quarterly audit of XBert rule enablement across a Connect tenant. Looks at the rule configuration itself — not templates, not schedules. Pairs every finding with a named bulk-normalisation move.

## Goal
Identify and characterise drift in XBert rule configuration across the book before it becomes systemic. Output is decision-ready: every finding has a recommended bulk move.

## Metrics
- **Enablement fingerprint** — vector of enabled/disabled per rule per client
- **Segment cohesion** — % of clients within a segment that share the same fingerprint
- **Always-on rate** — % of clients in segment with a given rule enabled
- **Drift count** — rules where enablement state has changed from a previously-consistent baseline (where the data supports it)

## Default thresholds (practice-configurable)
| Finding | Trigger |
|---|---|
| Always-on candidate | Enabled on >=80% of segment AND disabled on the rest with no clear reason |
| Outlier (likely accidental enable) | Enabled on <=20% of segment AND not aligned with a known cohort |
| Inconsistent | Enabled on 21-79% of segment with no segmentable pattern |
| Drift | Currently disabled but historical signal indicates it was previously enabled |

Segment minimum: 3 clients. Below 3, treat as ungrouped and report whole-book only.

## Process / rules
1. **Scope the client set to CONNECTED clients first.** XBert rule configuration only means anything for a client whose ledger is connected. Pull the connection list (`Data_GetClientConnections`) and **drop every client that is not connected** — `IsConnectedToAccountingSoftware = false`, `IsDisconnected = true`, or never synced. Auditing a never-connected client produces meaningless results (the reviewer's "these are not, and never have been, connected clients" complaint). State how many clients were excluded and why; never fingerprint a client that has no live ledger.
2. **Build a genuinely per-client fingerprint.** Call `Data_XBertConfigurations` **once per connected client, with that client's own tenant id** — never call it once and reuse the result across clients. Confirm the response carries `scope: client` (the tool returns each client's *effective* set — configs assigned to all tenants OR to that client specifically). If a client comes back `scope: connect`, you passed a Connect id, not a client id — fix the call. The fingerprint is the per-client vector of `totalActiveConfigurations`, the by-business-function / risk-level / risk-type breakdowns, and the per-client custom-XBert set. **Counts are ACTIVE configs (`IsActive = 1`)** — if you also report a client's total including inactive/draft, label it separately; do not conflate "active" with "exists".
3. **Segment the book** — default by industry tag (`TenantTagIds` from the connection list) and the Connect account review; fallback = ledger type (`AccountingType`); final fallback = whole book.
4. **Compute segment statistics** — for each rule × segment, the always-on rate, from the per-client fingerprints.
5. **Classify findings** — Always-on candidate / Outlier / Inconsistent / Drift.
6. **Pair with bulk move** — for each finding, name the specific normalisation: "enable rule X on these 4 clients", "disable rule Y on these 2 clients", "surface for human decision because the split is even".
7. **Surface segments with most drift** — top three for the executive summary.

## Always
- **Write for the firm, not the API.** The reader is a bookkeeper, reviewer or practice owner. Never print internal identifiers (tenant IDs, `connectTenantId`, numeric tag IDs) or MCP field/tool names (`Data_XBertConfigurations`, `Data_GetClientConnections`, `analyticsGroup`, `tenantTagIds`, `isConnectedToAccountingSoftware`, `hasPayrollAccess`, `scope`, `autoComplete`, `MCP`, `MCP API`) in the executive summary, findings, observations, tables or QMS block. Refer to clients and the Connect by **name**. Refer to tags by **name** where the data provides one; if only numeric tag IDs are available, describe the group generically (e.g. "an industry-tag group of 4 clients") and place any numeric IDs only in a clearly-labelled **Technical Appendix** — never in the body. Your internal reasoning may use these identifiers freely; the document text must not.
- **Use XBert terminology.** Apply the mapping below when writing document text. Internal analysis terms may still appear in your reasoning — only the output document is constrained.

| Avoid (internal / analyst term) | Use instead (firm-facing) |
|---|---|
| (ID 79194), connectTenantId 79194, Tenant ID column | Connect / client name only; IDs → Technical Appendix if needed |
| Tag ID column of numbers (42274…) | Tag names; else "industry-tag group of N clients" |
| `Data_XBertConfigurations`, `XBert MCP API`, `MCP` | "XBert", "XBert configuration data" |
| `isConnectedToAccountingSoftware = false` | "not connected to accounting software" |
| `hasPayrollAccess = false` / `payroll = true, access = false` | "payroll access is not enabled in XBert" |
| `analyticsGroup` | "Business Function" |
| `scope: client` | _(omit — internal detail)_ |
| `autoComplete` / `autoComplete-enabled` | "Auto-Complete" |
| "configuration fingerprint" / "fingerprint" | "configuration profile" / "how the client is set up" |
| "segment cohesion 100%" / "zero drift" | "all clients are set up the same way" / "no differences between clients" |
| "drift" / "drift count 0" | "configuration differences" / "no inconsistencies" |
| "always-on candidate" | "configuration to review" / "scope review" |
| "per-rule enablement" / "per-rule fingerprint" | "which individual XBerts are switched on or off" |
| "Risk High" / "Risk Med" | "High" / "Medium" (XBert risk levels: High, Medium, Low, Information) |
| "aggregate active configuration counts" | "total active XBerts" |

- **Distinct from workflow review.** Subject is XBert rule configuration. Do not stray into templates or schedules.
- **Connected clients only.** Never audit, fingerprint, or report a client that is not connected to a ledger. Confirm connection from `Data_GetClientConnections` before including a client.
- **Per-client data, not Connect-level repeated.** Every fingerprint must come from a `scope: client` call keyed to that client's tenant id. If all clients return the *identical* fingerprint, that is only a real "cohesion" finding when the configs are genuinely all-tenants-assigned — say so explicitly. Never present one Connect-level aggregate copied across clients as cohesion or "zero drift".
- **"Business Function", not "Analytics Group".** The MCP field is `analyticsGroup`; the firm-facing term is **Business Function**. Label it that way in all output (headings, tables, prose).
- **Active vs total.** Headline counts are active configs (`IsActive = 1`). If you state a total that includes inactive/draft, label it distinctly so a "9 active" is never mistaken for "9 total".
- **Segment-aware reasoning.** A rule that is on for tax clients and off for bookkeeping-only clients is not drift — it is segmentation.
- **Name the bulk move.** Every finding has a concrete normalisation action. No abstract "consider standardising".
- **Even splits need human input.** A rule split 50/50 in a segment is a policy question, not a fix.
- **Read-only.** Suggest bulk moves; the user enacts them through XBert.
- **Segmentation transparency.** State the segmentation rule used; caveat where it was approximate.

## Payload schema

After running the analysis, structure the result as JSON conforming to the render-docx payload schema (defined in `xbert-working-paper/skills/render-docx/SKILL.md`). Required fields:

- `plugin`: `"xbert-config-audit"`
- `check_reference_id`: a unique ID for the run
- `tenant_name`, `period`, `prepared_by`, `prepared_at`
- `title`, `subtitle` (optional)
- `executive_summary`: two sentences naming the headline finding, **followed by an overall risk profile statement** (1–2 sentences summarising the engagement's posture, e.g. "Overall risk: Low–Medium. Configuration is consistent across the book; the main exposure is payroll XBerts running on clients without payroll access.")
- `sections[]`: one entry per major finding, each with `heading`, `body`, optional `blocking: true`, optional `table` with `columns` and `rows`
- `qms_block`: `{ firm_name, preparer, reviewer, certification }`
- `appendix[]` (optional) — use a "Technical Appendix" section here for any internal identifiers (tenant IDs, numeric tag IDs) needed for traceability

### Findings Summary table shape

The Findings Summary section must use a five-column table:

| Ref | Finding | Risk | Recommended Action | If Not Actioned |
|---|---|---|---|---|
| F1 | Payroll custom XBerts running on clients without payroll access | Medium | Restrict these 4 custom XBerts to payroll-enabled clients, or confirm all-clients assignment is intended | These XBerts keep raising alerts that can never be meaningful — adding dashboard noise, eroding trust in alerts, and risking real issues being lost in the noise |

- **Risk** uses XBert risk levels: High, Medium, Low, or Information.
- **If Not Actioned** is one plain sentence describing the consequence of inaction — written for the partner or reviewer who needs to prioritise.
- Every finding row must have all five columns populated.

Section ordering and content must match the document structure described above. All prose in sections must follow the terminology and ID-suppression rules in the "Always" block.

## Output handoff

1. Save the payload to `outputs/<check_reference_id>/payload.json`.
2. Invoke the `xbert-working-paper:render-docx` skill. It will write `outputs/<check_reference_id>/working-paper.docx` and emit a single JSON line on stdout with `status`, `path`, `exists`, `size_bytes`, `opens_cleanly`, `paragraph_count`.
3. Pass the path and a one-line summary back to the user.

## Verification gate

Do not report the document as produced until the render skill's JSON has `status == "ok"` and `opens_cleanly == true`. If the gate fails, surface the JSON to the user verbatim and stop — do not retry silently and do not claim success.
