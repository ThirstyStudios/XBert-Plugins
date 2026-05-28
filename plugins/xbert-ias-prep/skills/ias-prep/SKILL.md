---
name: ias-prep
description: IAS readiness methodology for Australian clients — verify the client is ready to lodge an Instalment Activity Statement with the ATO and produce a Word audit document with the supporting evidence. Use when the user asks to prep an IAS, check if a client is IAS-ready, run a monthly PAYG readiness review, or runs the /ias-prep slash command. Also triggers on: "is the IAS ready", "monthly PAYG lodgement", "PAYG withholding check".
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# IAS Prep

A structural readiness check for an Australian IAS lodgement. Verifies bookkeeping is complete, balanced, and audit-defensible before lodging with the ATO. Produces a Word audit document with a unique check reference ID, preparer details, and the supporting evidence.

## What an IAS reports

An IAS is the form for:
- **PAYG Withholding** (W labels) — tax withheld from employee wages
- **PAYG Instalments** (T labels) — business or investment income instalments
- **FBT Instalments** — if applicable

Used by entities NOT registered for GST, and medium withholders ($25K-$1M annual withholding) who must report monthly.

### Key labels

| Label | Description |
|---|---|
| W1 | Total salary, wages and other payments (gross) |
| W2 | Amount withheld from W1 payments |
| W3 | Other amounts withheld (interest, dividends, no TFN) |
| W4 | Amounts withheld where no ABN quoted |
| W5 | Total withheld (W2 + W3 + W4) |
| T1 | Instalment income (gross business + investment income — option-1 core field) |
| T2 | Applied instalment rate |
| T3 | New varied rate (if varying under option 1) |
| T4 | Reason code for an option-1 variation |
| T7 | Reason code for an option-2 variation |
| T8 | Variation amount |
| T9 | Instalment amount payable |
| T11 | Varied instalment amount (option 2) |

## Readiness checks

1. **Bank reconciliation** — all transactions for the IAS period reconciled
2. **Payroll data** — payruns posted, W1 source (gross wages) and W2 source (tax withheld) populated
3. **Superannuation** — SG posted for all payruns in the period
4. **PAYG-W labels** — W1, W2, W3, W4 and W5 verified against payrun totals
5. **PAYGW liability** — PAYGW account exists and balance matches W5 plus prior carry-over
6. **PAYG instalments** — T7 / T11 calculated correctly where applicable
7. **Outstanding XBerts** — ALL outstanding XBerts block lodgement

## Blocking rule

**All outstanding XBerts for the period block lodgement.** Do not filter by risk type. Surface each unresolved XBert with the resolution instruction; do not auto-resolve.

## Audit document structure

Generate a Word document containing:
1. Cover page — client name, ABN, IAS period, generation date
2. First-page summary — overall readiness status, count of blocking issues
3. Readiness sections (1-7 above) with pass/fail and evidence
4. QMS block — practice/firm name + ID, preparer name + ID, timestamp, unique check reference ID, system version, compliance statement

Audit notes are created without user assignment — they exist as audit record only.

## Output format

- Australian English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings (##, ###) in chat preview
- Bold key labels and figures
- Tables for comparative data
- Never use emojis
- Always include the check reference ID

## Always

- Never auto-apply changes or resolve XBerts — read-only readiness assessment
- Name the specific account or transaction behind every blocking issue
- If a data source is unavailable, state it explicitly and degrade gracefully
- The document must be filable without further editing

## Payload schema

After running the readiness checks, structure the result as JSON conforming to the render-docx payload schema (defined in `xbert-working-paper/skills/render-docx/SKILL.md`). Required fields:

- `plugin`: `"xbert-ias-prep"`
- `check_reference_id`: a unique ID for the run (e.g. `IAS-2026Q1-<tenantId>-001`)
- `tenant_name`, `period`, `prepared_by`, `prepared_at`
- `title`, `subtitle` (optional)
- `executive_summary`: two sentences naming the headline finding and overall readiness verdict
- `sections[]`: one entry per major readiness area, each with `heading`, `body`, optional `blocking: true`, optional `table` with `columns` and `rows`
- `qms_block`: `{ firm_name, preparer, reviewer, certification }`
- `appendix[]` (optional)

Section ordering and content must match the audit-document structure described above.

## Output handoff

1. Save the payload to `outputs/<check_reference_id>/payload.json`.
2. Invoke the `xbert-working-paper:render-docx` skill. It will write `outputs/<check_reference_id>/working-paper.docx` and emit a single JSON line on stdout with `status`, `path`, `exists`, `size_bytes`, `opens_cleanly`, `paragraph_count`.
3. Pass through to the user the path and the summary line the render skill prescribes (`Working paper saved to <path> — N sections, M blocking issues`).

## Verification gate

Do not report the working paper as produced until the render skill's JSON has `status == "ok"` and `opens_cleanly == true`. If the gate fails, surface the JSON to the user verbatim and stop — do not retry silently and do not claim success.
