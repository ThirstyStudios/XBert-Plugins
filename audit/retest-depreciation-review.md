# /depreciation-review re-test (2026-05-26)

## Methodology
LLM-in-loop against local MCP gateway (`https://localhost:7200/mcp`) via `audit/local-mcp.ps1`. Walked the agent's Instructions step-by-step and asked which data sections it needs, then searched MCP for tools that satisfy each section before invoking the critical ones against client tenant 11668 (Peak Precision Accounting; actual countryCode = GB, not AU as briefed) under connect tenant 11374.

## Tools searched
- `fixed asset` -> Data_FixedAssets_Search, Data_FixedAssets_Get, Data_FixedAssets_Summary
- `depreciation` -> same three FixedAssets_* tools (Get summary explicitly mentions "depreciation history and asset-type settings")
- `asset register` -> same three FixedAssets_* tools
- `organisation` -> Data_OrganisationSettings, Features_GetReviewAuditContext, Data_LedgerForShare
- `balance sheet` -> Data_FinancialStatements (statement=balanceSheet|profitAndLoss|trialBalance), Data_LedgerForShare
- `profit and loss` -> Data_FinancialStatements, Data_BankTransactions_Summary, Data_JournalMaster_Summary
- `connect portal` -> Data_GetClientConnections (used to find connectTenantId)

## Tools the agent needs vs what exists
| Instructions section | MCP tool tried | Result |
|---|---|---|
| Organisation context (country, FYE, currency, company type) | `Data_OrganisationSettings` (surface=organisation) | works — returns countryCode, FYED/FYEM, baseCurrency, OTy, lineOfBusiness |
| Fixed asset register (Search) | `Data_FixedAssets_Search` | works — returns id, assetNumber, assetName, status (Draft/Registered/Disposed), purchasePrice, bookValue, disposalDate |
| Fixed asset full record incl. depreciation history | `Data_FixedAssets_Get` (up to 25 by id) | works — returns depreciationMethod, depreciationRate, depreciationCalculationMethod, effectiveLifeYears, costLimit, residualValue, priorTotalDepreciationAmount, currentDepreciationAmount, settingsLastDepreciationDate, disposalDate, accountingBookValue |
| Fixed asset aggregate (status counts, top types, disposals, depreciation totals) | `Data_FixedAssets_Summary` | works — schema matches the agent's Step 2/3/4 needs |
| Balance sheet (fixed asset account balances) | `Data_FinancialStatements` (statement=balanceSheet) | works — returns Total Fixed Assets plus per-account rows (Computer Equipment, Office Equipment) with amounts |
| P&L (depreciation expense, capital-vs-revenue scan) | `Data_FinancialStatements` (statement=profitAndLoss) | tool works (returns shape + dataRange) but recordCount=0 on both seeded clients — seed-data limitation, not a tool capability gap |

## Invocations
- `Data_OrganisationSettings {clientTenantId:11668,userProfileId:1,surface:organisation}` -> `Peak Precision Accounting, Xero, ACCRUAL, GBP, FYE 31/3, COMPANY, countryCode=GB, TZ=GMTSTANDARDTIME`
- `Data_GetClientConnections {userProfileId:1}` -> `connectTenantId:11374`, three child clients; 11668 has `hasAccountingFixedAssetPermissions:true`
- `Data_FixedAssets_Summary {clientTenantId:11668,connectTenantId:11374,userProfileId:"1",startDate:2025-04-01,endDate:2026-03-31}` -> empty (assets fall outside FY26 purchaseDate filter)
- `Data_FixedAssets_Search {clientTenantId:11668,connectTenantId:11374,userProfileId:"1",startDate:2020-01-01,endDate:2026-12-31,pageSize:25}` -> `totalCount:2` — FA-0001 "Coffee table for reception" £1,000 DRAFT (2024-03-13), FA-0002 "Laptop" £1,583.33 DRAFT (2023-12-14)
- `Data_FixedAssets_Get {assetIds:"6c6c71f3...,8abc2c0d..."}` -> full records including `depreciationMethod:"0", depreciationRate:0, depreciationCalculationMethod:"NONE", effectiveLifeYears:0, priorTotalDepreciationAmount:0` — both DRAFT with no depreciation set
- `Data_FinancialStatements {statement:balanceSheet, ...}` -> 17 rows; Total Fixed Assets £2,583.33 (Computer Equipment £1,583.33 + Office Equipment £1,000) — register and GL agree on totals; Office Equipment £1,000 reconciles to FA-0001, Computer Equipment £1,583.33 reconciles to FA-0002
- `Data_FinancialStatements {statement:profitAndLoss, startDate:2024-04-01, endDate:2026-03-31}` -> tool succeeds, recordCount=0 (no P&L journal data seeded for this tenant; same result on AU client 11377)

## Score
**Tier: KEEP**
**Quality: 4**

## Rationale
Every data section the Instructions ask for has a real, working MCP tool that returns real shaped data — and the dataset for client 11668 is rich enough that the agent can produce a credible review (two DRAFT assets, no depreciation rates set, register vs GL reconciles, country=GB which exercises the SBA/AIA/WDA branch of the instructions). The only soft spot is the P&L being empty in seed data, which blunts the "Capital vs Revenue scan" in Step 5 on this specific tenant — but the tool itself is correct. Marked 4 not 5 because the previous reviews calling this REMOVE were correct *at that time*; today the FixedAssets_* trio exists, and the date-window filtering on Search/Summary is a small footgun (DRAFT assets with old purchase dates get hidden by a tight FY window — agent will need a wide default range).

## Recommendation
**Keep as-is** and reverse the prior REMOVE decision. The agent is genuinely production-ready against current MCP. Two small follow-ups worth a low-priority ticket:
1. `Data_FixedAssets_Summary`/`Search` use `purchaseDate` for the `startDate`/`endDate` filter, so DRAFT or fully-depreciated old assets get hidden by a tight FY window — the agent should default to a wide range (e.g. `2000-01-01..today`) or these tools should accept `includeAllStatuses=true` to bypass purchase-date filtering when status=Draft|Disposed is what the reviewer cares about.
2. Surface guidance in the agent's Instructions that countryCode comes from `Data_OrganisationSettings` even though Aaron briefs clients with a country assumption (11668 was briefed as AU but actually GB).

---

## Re-test #2 (post tool updates) — 2026-05-26

### What changed in MCP since re-test #1
- `Data_FixedAssets_Search` — `startDate`/`endDate` are now **optional**; description spells out "register is a STOCK, not a flow" and that DRAFT + long-disposed assets return by default. New optional `searchTerm`, `status`, `assetType`; cursor-based pagination.
- `Data_FixedAssets_Summary` — description now spells out the **register-vs-window** distinction: register-wide totals (count, purchasePrice, bookValue, by-status, top-asset-types) cover the full register regardless of date range; startDate/endDate scope **only** the `disposalsInRange` bucket. (Note: the dates remain `required` in the schema — they just no longer filter register totals.)
- `Data_FixedAssets_Get` — singular `id` accepted as alias for `assetIds`; `userProfileId` retyped from integer to **string** (matches Search/Summary).
- `Data_LedgerForShare` — **removed** from MCP entirely.

### Invocations on tenant 11668 (Peak Precision Accounting, GB) under connectTenantId 11374, userProfileId="1"

| Test | Call | Result |
|---|---|---|
| Search WITHOUT date params (the prior footgun) | `Data_FixedAssets_Search {pageSize:25}` | `totalCount:2` — both DRAFT assets returned (FA-0001 Coffee table £1,000 purchased 2024-03-13, FA-0002 Laptop £1,583.33 purchased 2023-12-14) |
| Search with `status:"Draft"` filter | `Data_FixedAssets_Search {status:"Draft",pageSize:25}` | `totalCount:2` — both DRAFT records returned, status filter works |
| Search with old narrow FY26 window (control) | `Data_FixedAssets_Search {startDate:"2025-04-01",endDate:"2026-03-31"}` | `totalCount:0` — confirms the date params still filter by purchaseDate when supplied; the **fix is "omit by default"**, not the date filter behaviour |
| Get with singular `id` alias | `Data_FixedAssets_Get {id:"6c6c71f3-..."}` | itemCount:1 — Coffee table record returned with full depreciation/settings detail |
| Summary with narrow FY26 window | `Data_FixedAssets_Summary {startDate:"2025-04-01",endDate:"2026-03-31"}` | `totalAssetCount:2, totalPurchasePrice:2583.33, byStatus.DRAFT.count:2, disposalsInRange:0` — register-wide totals appear despite narrow window |
| Summary with wide window (control) | `Data_FixedAssets_Summary {startDate:"2000-01-01",endDate:"2026-12-31"}` | Identical register totals (2, £2583.33, 2 DRAFT) — proves register-wide totals are window-invariant |
| LedgerForShare search | `tools_search "ledger for share"` | Tool no longer in results; Instructions text never referenced it — agent unaffected |

### Answers to the brief

1. **Did the new optional date params fix the prior "DRAFT assets hidden by FY window" footgun? YES.**
   Proof: `Data_FixedAssets_Search` with **no date params** returns both DRAFT assets (`totalCount:2`). The same call with the FY26 window (`startDate:2025-04-01`,`endDate:2026-03-31`) still returns 0 — so the fix is the **omit-by-default** behaviour plus the new "STOCK, not a flow" guidance in the description, not a change to how date filtering works. An LLM following the updated description will omit dates for register reviews and never trip the footgun.

2. **Did `status=Draft` work? YES.**
   `Data_FixedAssets_Search {status:"Draft"}` returned the two DRAFT records. Status filter is case-insensitive per schema docs.

3. **Did the singular `id` alias work on Get? YES.**
   `Data_FixedAssets_Get {id:"6c6c71f3-d0fb-40f9-9eac-24195f9e0852"}` returned the full standard-detail Coffee table record (asset_uid, depreciationMethod, costLimit, residualValue, settingsLastDepreciationDate, etc.). The agent can now feed the `id` value verbatim from Search results without renaming.

4. **Does Summary show register-wide totals without a date window? EFFECTIVELY YES.**
   `startDate`/`endDate` are still `required` in the JSON schema, but the *semantics* changed: register totals (`totalAssetCount`, `totalPurchasePrice`, `byStatus`, `topAssetTypesByBookValue`) are window-invariant — narrow FY26 window vs. 2000–2026 window returned identical register totals. The window now only filters `disposalsInRange`. The prior re-test's "Summary empty under FY filter" footgun is gone.

5. **Did `Data_LedgerForShare` removal break the agent? NO.**
   Instructions text contains no reference to LedgerForShare (grepped). Step 5 (Capital vs Revenue) uses `Data_FinancialStatements` for P&L, which is the right primitive. No regression.

### Score

**Tier: KEEP**
**Quality: 5**

### Rationale vs re-test #1 (was KEEP Q4)

The single soft spot from re-test #1 — "Search/Summary use purchaseDate for the date filter, so DRAFT or long-disposed assets get hidden by a tight FY window" — is now neutralised at the tool level:
- Search dates are optional, with description telling the LLM to omit them for register reviews.
- Summary still requires dates but treats register totals as window-invariant; the LLM cannot accidentally hide the register by passing an FY window.

`status` filter + singular `id` alias remove two friction points the LLM previously had to work around (paginating then filtering client-side, renaming `id`→`assetIds`). `Data_LedgerForShare` removal is irrelevant — the agent never used it. Country mismatch caveat from re-test #1 still applies but is a briefing issue, not a tool issue; the agent correctly resolves country via `Data_OrganisationSettings`.

Bumping to **Q5**: every Instructions step now has a tool that returns correctly-shaped data with no footguns the agent has to work around. Real seeded data on 11668 is rich enough to drive a credible GB-jurisdiction review (two DRAFTs, no depreciation set, register vs GL reconciles £2,583.33). P&L being empty on seed remains a tenant-data limitation, not a tool gap.

### Recommendation
**Keep as-is — promote from Q4 to Q5.** No follow-up tickets required for the agent. Optional polish for a future MCP pass: make `Data_FixedAssets_Summary`'s `startDate`/`endDate` optional too (mirror Search) so the agent never has to invent a window when it only wants register totals; not blocking.
