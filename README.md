# XBert MCP

**XBert** is the MCP for accounting practices. This repo holds the public site at https://intelligence.xbert.io and the Claude Code plugins built on top of the XBert MCP.

- **Connect XBert to Claude (claude.ai / Desktop):** add a custom MCP connector pointing at `https://mcp-gateway.xbert.io/mcp` — full guide at https://support.xbert.io/en/articles/14492922-how-to-add-xbert-as-a-custom-mcp-connector-in-claude
- **Add the plugin marketplace in Claude Code:** `/plugin marketplace add ThirstyStudios/XBert-Plugins`

## What's inside

```
.
├── .claude-plugin/marketplace.json   # authoritative catalog (read by Claude Code)
├── plugins/                          # individual plugins
│   ├── xbert-workflow-review/
│   ├── xbert-bas-prep/
│   ├── xbert-pulse/
│   └── ... (see marketplace.json for the full list)
├── bundles/bundles.json              # curated groupings (site-only)
├── scripts/build-catalog.mjs         # pre-build catalog loader for the site
├── site/                             # React storefront (Vite + React 19 + Tailwind v4)
└── staticwebapp.config.json          # Azure Static Web Apps config
```

## Run the storefront locally

```bash
cd site
npm install      # one-time (CI uses npm; only package-lock.json is committed)
npm run dev      # http://localhost:5173
```

The `predev` script regenerates `site/src/generated/catalog.json` from the plugins folder before each `vite dev`.

## Add a plugin

1. Create `plugins/<name>/.claude-plugin/plugin.json` (with the `x-xbert` namespace for site-only fields).
2. Add commands under `plugins/<name>/commands/*.md` and skills under `plugins/<name>/skills/<skill-name>/SKILL.md`.
3. Add a `README.md` for the plugin detail page.
4. Append the plugin to `.claude-plugin/marketplace.json` using the **relative source form** (`"source": "./plugins/<name>"`) — matches the rest of the catalogue and the convention in `PLUGIN_GUIDE.md`.
5. Commit + push. The site rebuilds and deploys automatically.

## Install plugins (end users)

In Claude Code:

```
/plugin marketplace add ThirstyStudios/XBert-Plugins
/plugin install xbert-workflow-review@xbert
/plugin install xbert-bas-prep@xbert
```

Each `/plugin install` runs as a separate command — Claude Code doesn't batch. Browse the full catalogue at https://intelligence.xbert.io.

## License

MIT.

<!-- marketplace re-index nudge: force the Claude plugin index to pick up main (stp-finalisation #9 currency-safety fix, PR #10 merged 2026-06-30). Safe to remove. -->

