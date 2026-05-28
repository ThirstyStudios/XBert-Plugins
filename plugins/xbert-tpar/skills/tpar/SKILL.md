---
name: tpar
description: Annual TPAR (Taxable Payments Annual Report) preparation for Australian clients in reportable industries — identify contractors, validate ABNs, separate GST, surface errors, and produce a TPAR-ready breakdown and Word working paper. Use when the user asks to prep TPAR, run a contractor payments review, prepare the taxable payments report, or runs the /tpar slash command. Also triggers on: "TPAR annual report", "contractor payments report", "28 August TPAR deadline", "building industry TPAR".
---

**Source of truth — XBert MCP:** Every figure, client record, ledger transaction, payrun, and XBert notification referenced here must come from the connected XBert MCP server. Call XBert MCP tools to fetch the data — do not invent figures, estimate from context, or substitute from chat history. If the XBert MCP is not connected, ask the user to install and authenticate it before continuing.

# TPAR Prep

Annual contractor-payments report preparation for Australian businesses in TPAR-reportable industries. Identifies every reportable payment, validates the supplier data, and produces a TPAR-ready breakdown plus a Word working paper.

## TPAR framework

- **Deadline** — 28 August following the financial year end (30 June)
- **Report covers** — payments to contractors for services in TPAR-reportable industries
- **Reportable industries**:
  - Building and construction
  - Cleaning services
  - Courier services
  - Information technology services
  - Road freight services
  - Security, investigation or surveillance services
  - Government entities (always)
- **Mixed-business 10% test** — if the client's business is only partly in a reportable industry, TPAR lodgement is required only if income from reportable services is **10% or more of GST turnover** (current or projected). Below 10%, TPAR is not required for a mixed business. Wholly-reportable businesses (e.g. a pure cleaning company) always lodge regardless of size.

## What is reportable

- Payment to a contractor for services (labour) provided
- Includes payments for materials when supplied as part of the service
- Gross payment including GST
- Per-payment date, per-supplier aggregation

## What is NOT reportable

- Payments to employees (reported via STP)
- Payments for materials only (no service component)
- Payments to government entities (unless special rules apply)
- Pay-As-You-Go withholding amounts
- Incidental services (e.g. courier used by a non-courier business)
- Payments under $0 (refunds, credits)
- Foreign contractors not connected to Australia

## Preparation steps

1. **Pull suppliers and payments** — the full year of supplier register and bills paid plus any direct bank payments to contractors
2. **Apply industry filter** — segregate payments based on the nature of services and the chart of accounts mapping
3. **Identify reportable contractors** — flag payments to suppliers whose services fall within the TPAR industry
4. **Validate ABNs** — format check (11 digits, valid check digit) and surface missing or invalid ABNs
5. **Separate GST from gross** — TPAR reports gross including GST, but a working paper should show the split
6. **Aggregate per contractor** — sum gross, GST, net, payment count, first / last payment date
7. **Error sweep** — see error categories below
8. **Produce report and working paper**

## Error categories

- **Missing ABN** — contractor has no ABN recorded
- **Invalid ABN format** — does not pass the 11-digit check
- **Sole trader without ABN** — 47% no-ABN withholding rule may apply
- **Employee in accounts payable** — payments to an employee processed through AP rather than payroll
- **Duplicate suppliers** — same ABN appearing under two contact records
- **Non-reportable industry** — payment to a contractor outside the TPAR industry list (exclude)
- **Materials-only** — pure goods purchase with no service component (exclude)

## Working paper structure

Generate a Word document containing:
1. Cover page — client name, ABN, financial year, TPAR industry, generation date
2. Summary — total contractors, total gross reportable, total GST, count of payments
3. Per-contractor table — name, ABN, address, total gross, GST, net, payment count, first / last payment date
4. Error log — every contractor / payment with a flagged error and the suggested resolution
5. Industry filter rationale — which expense accounts were included / excluded and why
6. QMS block — practice / firm name + ID, preparer name + ID, timestamp, check reference ID

## Output format

- Australian English spelling (organisation, behaviour, colour)
- All monetary amounts with 2 decimal places and `$` prefix
- Australian date format (dd/MM/yyyy)
- Markdown headings (##, ###) in chat preview
- Bold contractor names and flagged errors
- Tables for per-contractor data and the error log
- Never use emojis

## Always

- Never lodge TPAR from the plugin — the bookkeeper enters into the ledger's TPAR module or via tax agent software
- Name the specific supplier and payment behind every flagged error
- Distinguish blocking issues (must fix before lodgement) from advisory items
- The working paper must be filable as evidence the TPAR was prepared and reviewed
- If the client's industry is unclear or mixed, ask the user to confirm before applying the filter

## Payload schema

After running the readiness checks, structure the result as JSON conforming to the render-docx payload schema (defined in `xbert-working-paper/skills/render-docx/SKILL.md`). Required fields:

- `plugin`: `"xbert-tpar"`
- `check_reference_id`: a unique ID for the run (e.g. `TPAR-FY2026-<tenantId>-001`)
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
