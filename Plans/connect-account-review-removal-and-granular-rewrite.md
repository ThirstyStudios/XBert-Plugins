# Connect Account Review removal — granular-composition rewrite & Cassandra feedback fixes

**Date:** 2026-06-05
**Trigger:** Cassandra Scott's review of the "Config audit summary for Booloumba Enterprises" output.
**Decision (Aaron):** Hard-delete the monolithic `Practice_GetConnectAccountReview` MCP tool; the practice plugins/agents should compose **granular** MCP tools instead.

---

## 1. Status

### Done this session (xbert-app-processing, build verified — 0 errors)
- **Deleted the tool** `Practice_GetConnectAccountReview` — `XBert.Mcp.Server/Tools/Practice/ConnectAccountReview.cs` (tool + 9 nested model classes) and its 3 dedicated test files (`ConnectAccountReviewTests`, `Test_1232_GoalVerification`, `Test_1234_GoalVerification`).
- Removed the cache-TTL constant (`CacheTtlDefaults`), the capability-catalogue entry (swapped to the real `Practice_GetServerTime`), the `FilterParityWithGatewayTests` list entry, the `MultiAgent.cs` dispatcher's dead-tool synthetic step, and the gateway `TOOL-CATALOGUE.md` entry.
- **Removed dead references** from `PlanningAgent.md` (routing example + rule) and `PracticeAgent.md` (tools section replaced with a placeholder note; tool name struck from all 6 plugin descriptions).
- **Filed [xbert-app-processing#1670](https://github.com/ThirstyStudios/xbert-app-processing/issues/1670)** (→ `byooxbert`) for the roles data tool.

### Pending (this spec)
The **granular-composition rewrite** of the prompts/plugins + Cassandra's substantive fixes. Currently `PracticeAgent.md` and the 6 plugins simply *don't* report the removed areas; they need to be rebuilt on granular tools once the prerequisite tools exist.

---

## 2. Why the monolith was the only source — coverage matrix

Verified (adversarially) that 15 of 24 fields had **no** granular-tool equivalent. After the rewrite each area must come from:

| Area | Replacement tool | State |
|---|---|---|
| Clients, missing-payroll, disconnected, XPM-mapping | `Data_GetClientConnections` | ✅ exists, portal-wide |
| All accessible clients | `Data_GetAllAccessibleClients` | ✅ exists |
| Templates (+ has-schedule) | `Features_ListTemplates` | ✅ exists — **but no Group/adhoc field** (see §3.1) |
| Work (due-date / process / no-client) | `Features_GetWork` | ✅ exists (LLM filters) |
| Client Groups | `Features_GetAllTenantTags` | ✅ exists (Cassandra gap #4) |
| Note Topics | `Features_ListClientNoteTopics` | ✅ exists (Cassandra gap #4) |
| Note Link Tags | `Features_ListClientNoteLinkingTags` | ✅ exists (Cassandra gap #4) |
| Process tags | `Features_ListProcessTags` | ⚠️ exists but **strips `XpmTaskUuid`** — un-strip needed for "not mapped to XPM" |
| Integration features | — | ❌ fetched by old SP `usp_get_connect_review_features_and_integrations`, never exposed as a tool (Cassandra gap #4) |
| **Roles** (connect roles, set/not-set matrix, default-unassigned) | — | ❌ **no path** → ticket #1670 |
| **User counts** (active/inactive/admin) | data in `GetUserProfilesAsync` | ❌ no list tool — needs a list-all mode |
| **Users with no views** | `usp_get_connect_review_users` (`ViewConnectFilters`) | ❌ no path |
| **Statuses setup** | data in `GetNotificationStatuses` | ❌ no list tool |
| Country code | `Subscription.Country` | ❌ minor, no path |

---

## 3. MCP-layer prerequisites (mostly for byooxbert — blockers for full coverage)

1. **Roles tool** — ticket #1670. Wrap existing `xi.usp_get_connect_review_client_roles`.
2. **Users list tool / list-all mode** — `GetUserProfilesAsync(connectTenantId)` already returns all users with `IsActive`/`IsAdmin`; expose a portal-wide list (covers active/inactive/admin counts). No new SQL.
3. **Statuses list tool** — `GetNotificationStatuses(connectTenantId)` already exists; expose it (covers "statuses need setup").
4. **`Features_ListProcessTags`** — stop stripping `XpmTaskUuid` from the projection (one line) so "process tags not mapped to XPM" is derivable.
5. **`Features_ListTemplates`** — **add the template Group** (adhoc vs scheduled). This is Cassandra's central point: an unscheduled template that belongs to an adhoc Group is *correct*, not drift. Without this field the audit cannot distinguish them.
6. *(Minor)* users-with-no-views (`ViewConnectFilters`) and country — fold into #1670 or accept as dropped.

---

## 4. Cassandra's feedback → required prompt changes

1. **Unscheduled templates are not inherently bad.** Stop flagging "templates with no schedule" as high-concern drift. Use the template **Group** (prereq §3.5) to split adhoc-intended (expected, *good* — adhoc work is being mapped) from genuinely-incomplete. Until the Group field exists, present the count **neutrally** and state the adhoc/scheduled split cannot yet be determined — do not score it "High concern".
2. **Never dump template task IDs.** They add no value. Report template **names**; if names are unavailable, report counts only. Remove the raw-ID list entirely.
3. **Make "data quality limitations" clearer.** State plainly which specific fields were blank and what the reader must open in Connect to resolve — not a vague caveat.
4. **Add the missing Connect-environment coverage:** Client Groups (`Features_GetAllTenantTags`), Status (statuses tool §3.3), Note Topics (`Features_ListClientNoteTopics`), Note Link Tags (`Features_ListClientNoteLinkingTags`), and **integration features** (needs a tool, §2). The review is about the Connect environment, so these belong in it.

---

## 5. Per-surface rewrite plan

- **`PracticeAgent.md`** — replace the current placeholder note (§ Your Tools) with granular-composition guidance: which tool answers which question, the §4 rules baked in, and an explicit "do not claim roles/users/views/statuses until those tools exist".
- **The 6 plugins** (`xbert-config-audit`, `xbert-practice-health-check`, `xbert-client-onboard`, `xbert-end-of-period-dashboard`, `xbert-practice-metrics`, `xbert-cross-sell-opportunities`) — they never named the tool directly (they say "Connect account review" conceptually), so each needs its data-gathering step repointed to the granular tools above. Lightest touch is `xbert-config-audit` / health-check / end-of-period (which actually surface this data).
- **Dashboard** (`xbert-fabric-dashboard`) — ✅ **DONE (2026-06-08)**. The `SkFunctionName="ConnectAccountReview"` call already hit the legacy-deprecation branch in `UserQueryAssistantChat` (already non-functional). Removed `TestHealthCheckPromptAsync` from `XBertIntelligenceService.cs` + `IXBertIntelligenceService.cs` + the `SERVICE_LAYER_QUICK_REFERENCE.md` row. No frontend/controller caller existed. Application project builds green.
- **Orphaned stored procs** (xbert-data, 9 × `xi.usp_get_connect_review_*`) — do **not** drop `usp_get_connect_review_client_roles` until #1670's roles tool reuses/replaces it. The others can be dropped via the data pipeline once nothing references them. Not auto-dropped.

---

## 6. OPEN DECISION — what is `/config-audit`?

The committed `xbert-config-audit` plugin is a **rule-enablement fingerprint** audit (segmentation, drift, `Features_BulkUpdateXBertConfigurations`, render-docx working paper). The document Cassandra reviewed is a **Connect-setup review** (users/clients/templates/roles — the deleted tool's shape, PracticeAgent chart/table signatures). These are two different deliverables. Before rewriting, decide which `/config-audit` should produce (or whether the setup-review lives under a different command). The §4 fixes apply to whichever surface produces the setup review.

---

## 7. Verification

- Deletion: `dotnet build` of `XBert.Mcp.Server.Tests` + `XBert.App.XBertIntelligence` — green (done).
- Rewrite: exercise each affected plugin against a real Connect via the local gateway; confirm (a) no call to a non-existent tool, (b) §4 points addressed, (c) roles/users/statuses sections behave correctly given their tool's availability.
