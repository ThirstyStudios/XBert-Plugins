# XBert Capacity & Utilisation

Billable, non-billable, WIP variance — and a clean report for your internal accountant.

## What it does
- Pulls billable / non-billable time and WIP planned-vs-actual from XBert
- Surfaces practice-level utilisation and per-client variance
- Flags clients running materially over scope
- Optionally exports a markdown report ready to hand off

## Prerequisites
- XBert account with time tracking and billable flags
- WIP plans entered per engagement

## Usage
After installing, type:

    /capacity

in Claude Code or Claude Desktop. Optional flags:

    /capacity --client "Smith Trading"
    /capacity --export

## Support
hello@xbert.io
