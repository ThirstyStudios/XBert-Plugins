# XBert Config Audit

A quarterly audit of XBert rule configuration consistency across your book.

## What it does
- Reads per-client XBert configuration across your Connect tenant
- Segments your clients (by industry tag, or whole-book) and computes per-segment enablement fingerprints
- Surfaces three finding types — inconsistencies inside a segment, gaps where always-on rules are missing, and drift where rules have been switched off
- Pairs every finding with a named bulk-normalisation move so cleanup is a list of decisions
- Produces a Word document with executive summary, segment breakdown and the normalisation backlog

Distinct from XBert Workflow Review — that plugin looks at templates and schedules; this one looks at XBert rule configuration itself.

## Prerequisites
- XBert account with multiple client tenants in a Connect
- Workflow and XBert configurations active on at least some clients
- Practice owner or manager-level access to the Connect

## Usage
After installing, type:

    /config-audit

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
