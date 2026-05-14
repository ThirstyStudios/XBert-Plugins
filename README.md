# XBert Plugins

The public plugin marketplace for **XBert** — Claude Code plugins for accounting practices and bookkeepers.

- **Live storefront:** https://plugins.xbert.io
- **Add this marketplace in Claude Code:** `/plugin marketplace add ThirstyStudios/XBert-Plugins`

## What's inside

```
.
├── .claude-plugin/marketplace.json   # authoritative catalog (read by Claude Code)
├── plugins/                          # individual plugins
│   ├── xbert-review/
│   └── xbert-reconcile/
├── bundles/bundles.json              # curated groupings (site-only)
├── scripts/build-catalog.mjs         # pre-build catalog loader for the site
├── site/                             # React storefront (Vite + React 19 + Tailwind v4)
└── staticwebapp.config.json          # Azure Static Web Apps config
```

## Run the storefront locally

```bash
cd site
pnpm install     # one-time
pnpm dev         # http://localhost:5173
```

The `predev` script regenerates `site/src/generated/catalog.json` from the plugins folder before each `vite dev`.

## Add a plugin

1. Create `plugins/<name>/.claude-plugin/plugin.json` (with the `x-xbert` namespace for site-only fields).
2. Add commands under `plugins/<name>/commands/*.md` and skills under `plugins/<name>/skills/<skill-name>/SKILL.md`.
3. Add a `README.md` for the plugin detail page.
4. Append the plugin to `.claude-plugin/marketplace.json` using the absolute GitHub source form.
5. Commit + push. The site rebuilds and deploys automatically.

## Install plugins (end users)

In Claude Code:

```
/plugin marketplace add ThirstyStudios/XBert-Plugins
/plugin install xbert-review@xbert
/plugin install xbert-reconcile@xbert
```

Each `/plugin install` runs as a separate command — Claude Code doesn't batch.

## License

MIT.
