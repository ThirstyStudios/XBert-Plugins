# Adding a plugin — XBert Plugins

A practical guide to building a new plugin in this repo, getting it into the marketplace.json, and rendering it on **plugins.xbert.io**. Everything from filesystem layout to the CSS classes the storefront uses.

---

## TL;DR

1. Pick a slug (e.g. `xbert-foo`) and a slash command (e.g. `/foo`).
2. Create `plugins/xbert-foo/` with this exact shape:
   ```
   plugins/xbert-foo/
   ├── .claude-plugin/plugin.json     # manifest + x-xbert namespace
   ├── commands/foo.md                # slash command body
   ├── skills/<skill-slug>/SKILL.md   # methodology
   └── README.md
   ```
3. Append the plugin to `.claude-plugin/marketplace.json` (use the relative source form).
4. Run `cd site && npm run dev`. The pre-build script auto-regenerates `site/src/generated/catalog.json` and the storefront picks it up.
5. Verify the detail page at `/plugins/xbert-foo`.
6. Commit & push. Re-sync the marketplace in Claude Desktop (Customize → Personal plugins → XBert-Plugins → ⋯ → Resync).

The rest of this document explains why each piece exists, what fields render where, and where the CSS lives.

---

## 1. Plugin anatomy

Every plugin lives under `plugins/<slug>/` and follows the Claude plugin spec, with the site-only fields tucked into an `x-xbert` namespace inside `plugin.json` (so we don't fork a second metadata file).

### Required files

| Path | Purpose |
|---|---|
| `plugins/<slug>/.claude-plugin/plugin.json` | Manifest. Read by Claude (Desktop, Code) **and** by the storefront. |
| `plugins/<slug>/commands/<cmd>.md` | One slash command. Filename = command name. |
| `plugins/<slug>/skills/<skill-slug>/SKILL.md` | Methodology / domain knowledge Claude loads when the skill triggers. |
| `plugins/<slug>/README.md` | Renders in the GitHub view. Storefront uses it as supplementary content. |

A plugin **must** ship at least one of: a command, a skill, or an MCP server. The XBert plugins always ship a command + a skill so the workflow is invokable AND Claude has methodology to follow.

### Folder skeleton

```
plugins/xbert-foo/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── foo.md
├── skills/
│   └── foo-methodology/
│       └── SKILL.md
└── README.md
```

---

## 2. plugin.json — the manifest

The manifest is split into two halves:

- **Standard Claude fields** (`name`, `version`, `description`, `author`, …) — consumed by Claude when the plugin is installed.
- **`x-xbert` namespace** — site-only fields that power the storefront's detail page. Claude ignores anything it doesn't know.

### Full template

```json
{
  "name": "xbert-foo",
  "version": "0.1.0",
  "description": "One-line description used in the marketplace card and Claude's plugin manager.",
  "author": { "name": "XBert Intelligence", "email": "hello@xbert.io" },
  "homepage": "https://plugins.xbert.io/plugins/xbert-foo",
  "license": "MIT",
  "keywords": ["bookkeeping", "foo"],
  "x-xbert": {
    "displayName": "XBert Foo",
    "tagline": "One sentence that sells what this plugin does.",
    "audience": ["bookkeepers"],
    "categories": ["foo-category", "weekly"],
    "prerequisites": [
      "XBert account",
      "Some specific data set up in XBert"
    ],
    "screenshots": [],
    "demoVideo": null,
    "includes": { "skills": 1, "commands": 1, "mcpTools": 0 },
    "longDescription": "Two paragraphs of marketing copy.\n\nSecond paragraph explains the product.",
    "useCases": [
      { "title": "Concrete scenario 1", "description": "When you'd reach for this." },
      { "title": "Concrete scenario 2", "description": "Another moment in the day." },
      { "title": "Concrete scenario 3", "description": "A third use case." },
      { "title": "Concrete scenario 4", "description": "Optional fourth — usually four is the sweet spot." }
    ],
    "benefits": [
      { "icon": "Clock", "title": "Outcome headline", "description": "What the user gets back, not what the plugin does." },
      { "icon": "Search", "title": "Second outcome", "description": "Outcome-focused, not feature-focused." },
      { "icon": "ShieldCheck", "title": "Third outcome", "description": "Three is the visual sweet spot for the grid." }
    ],
    "workflow": [
      "Type /foo in any Claude chat",
      "Confirm the relevant scope",
      "Plugin pulls data from XBert (see command for tool names)",
      "Walk through results, approve actions",
      "Output drops to your file system / chat"
    ]
  }
}
```

### Field-by-field reference

| Field | Required | Used by | Notes |
|---|---|---|---|
| `name` | Yes | Claude + site | Must match folder name (`plugins/<name>/`). |
| `version` | Yes | Claude + site | Semver. Must match `marketplace.json` entry. |
| `description` | Yes | Claude + site | One sentence, shown in Claude Desktop's plugin marketplace card. |
| `author` | Yes | Site | Shown on detail page meta line. |
| `homepage` | Recommended | Site | Always `https://plugins.xbert.io/plugins/<name>`. |
| `license` | Recommended | Site | We default to MIT. |
| `keywords` | Recommended | Site | Indexed by MiniSearch. Boost discoverability. |
| `x-xbert.displayName` | Yes | Site | The big headline (e.g. "XBert Foo"). |
| `x-xbert.tagline` | Yes | Site | One-sentence pitch under the headline. |
| `x-xbert.audience[]` | Yes | Site | Blue badges. Use: `bookkeepers`, `accountants`, `principals`, `practice-managers`. |
| `x-xbert.categories[]` | Yes | Site | Grey badges + filter pills on the Browse page. Free-form but be consistent. |
| `x-xbert.prerequisites[]` | Yes | Site | Green-checked list on the detail page. |
| `x-xbert.includes` | Yes | Site | `{ skills, commands, mcpTools }` counts in the meta line. Update if you add more. |
| `x-xbert.longDescription` | Recommended | Site | Multi-paragraph string (use `\n\n` for paragraph breaks). Falls back to `description` if omitted. |
| `x-xbert.useCases[]` | Recommended | Site | 2-4 cards. `{ title, description }`. |
| `x-xbert.benefits[]` | Recommended | Site | 3 cards with icons. `{ icon, title, description }`. **See icon system below.** |
| `x-xbert.workflow[]` | Recommended | Site | Ordered list of step strings. Renders as numbered timeline. |
| `x-xbert.screenshots[]` | Optional | Site | Reserved for future use. Leave `[]` for now. |
| `x-xbert.demoVideo` | Optional | Site | Reserved for future use. Leave `null` for now. |

---

## 3. The icon system

Benefit cards reference icons by **string name**. The storefront maps the string to a [lucide-react](https://lucide.dev/icons) component via a lookup map.

### Currently supported icon names

Defined in [`site/src/pages/PluginDetail.tsx`](site/src/pages/PluginDetail.tsx) — search for `const ICONS`:

```
Clock, Search, ShieldCheck, Zap, FileSearch, GitBranch, Sparkles,
Users, Scale, TrendingUp, PhoneCall, BarChart3, Wallet, FileText
```

### Adding a new icon

1. Pick a name from https://lucide.dev/icons.
2. Open `site/src/pages/PluginDetail.tsx`.
3. Add it to the lucide-react import block.
4. Add it to the `ICONS` map:
   ```ts
   const ICONS: Record<string, LucideIcon> = {
     // …existing icons
     YourNewIcon,
   };
   ```
5. Use the **exact** PascalCase name in the plugin.json `icon` field.

If a plugin references an unknown icon name, the storefront silently falls back to `Sparkles` — so missing icons don't crash the build, but they look generic.

---

## 4. Commands — `commands/<name>.md`

The filename **is** the slash command. `commands/foo.md` becomes `/foo`. One command per file.

### Template

```markdown
---
description: One-line description shown in Claude's slash-command picker.
---

You are running the [workflow name] for a bookkeeping or accounting practice.

Steps:
1. Ask the user [opening question to scope the work].
2. Pull from XBert via the connected MCP:
   - [data 1 — describe what data is needed, not which tool to call]
   - [data 2]
3. Compute / analyse [what you do with the data].
4. Present results in [format].
5. Offer next actions; never auto-apply without explicit user approval.

Use the `[skill-name]` skill for the methodology. Never [the thing you must not do].
```

### MCP tool naming convention

**Describe the data, let the runtime resolve the tool.** Do NOT hard-code MCP tool names (`Data_X`, `Features_Y`, etc.) in commands or skills — the agent will discover the right tool from its description and the canonical tool catalogue at runtime. This matches the system-agent Instructions sweep (2026-05-25) that stripped tool names from the database surface for the same reason: tool names drift, and a name that's correct today can be wrong next sprint. Describe the data you need ("organisation context", "current trial balance", "outstanding XBerts for the period"), not the function that fetches it.

---

## 5. Skills — `skills/<slug>/SKILL.md`

Skills hold the methodology, thresholds, and rules Claude follows when the plugin's command fires. The skill triggers automatically on relevant prompts.

### Template

```markdown
---
name: skill-slug
description: One-paragraph description of what this skill covers and when it triggers. Include trigger phrases like "use when ..." so Claude knows when to load it.
---

# [Skill title]

## Goal
One paragraph on what we're trying to achieve.

## Metrics
- **Metric 1** — definition
- **Metric 2** — definition

## Default thresholds (practice-configurable)
| Band | Threshold |
|---|---|
| Low | …% |
| High | …% |

## Process / rules
Numbered or bulleted methodology.

## Always
- The non-negotiable rules
- "Never auto-apply" is almost always one of them
- Note data quality caveats
```

Keep skills concise — 50-100 lines is plenty. They get loaded into Claude's context every time the skill triggers.

---

## 6. README.md per plugin

Renders on GitHub. Storefront also surfaces it on the detail page as supplementary documentation. Keep it short:

```markdown
# [Plugin display name]

One-paragraph what-it-does.

## What it does
- Bullet
- Bullet
- Bullet

## Prerequisites
- Prerequisite 1
- Prerequisite 2

## Usage
After installing, type:

    /command

in any Claude chat (Desktop or Code).

## Support
hello@xbert.io
```

---

## 7. marketplace.json — wiring the plugin in

Located at `.claude-plugin/marketplace.json` (repo root). This is the file Claude clones and reads.

```json
{
  "$schema": "https://json.schemastore.org/claude-code-marketplace.json",
  "name": "xbert",
  "description": "XBert plugins for accounting firms and bookkeepers.",
  "owner": { "name": "XBert Intelligence", "email": "hello@xbert.io" },
  "plugins": [
    {
      "name": "xbert-foo",
      "source": "./plugins/xbert-foo",
      "description": "Same description as plugin.json.description.",
      "version": "0.1.0"
    }
  ]
}
```

### Critical: source path format

**Use the relative form** (`./plugins/<slug>`) for plugins that live in this repo. This is what Claude Desktop's "Add marketplace" flow expects when the marketplace is added via git clone of an `owner/repo`.

The absolute `{"type":"github", ...}` form is for cross-repo plugins (where the marketplace and the plugin live in different repos). We don't use it here.

### Version sync rule

`marketplace.json[].version` must match `plugins/<slug>/.claude-plugin/plugin.json.version`. CI should catch this eventually — for now, bump both together by hand.

---

## 8. The pre-build catalog script

Plugin data flows into the site like this:

```
plugins/*/                                    bundles/bundles.json
        │                                              │
        └──> scripts/build-catalog.mjs <───────────────┘
                       │
                       ▼
              site/src/generated/catalog.json   (gitignored)
                       │
                       ▼
              site/src/lib/catalog.ts           (typed loader)
                       │
                       ▼
              Pages: Home, Plugins, PluginDetail, Install
```

The script is at [`scripts/build-catalog.mjs`](scripts/build-catalog.mjs). It:

1. Walks `plugins/*` with `readdirSync` (alphabetical order).
2. Reads each plugin's `.claude-plugin/plugin.json` + `README.md`.
3. Reads `bundles/bundles.json` if present.
4. Writes `site/src/generated/catalog.json`.

It runs automatically via the `predev` and `prebuild` hooks in `site/package.json`. You don't need to invoke it manually.

If you ever need to run it directly:

```bash
node scripts/build-catalog.mjs
```

---

## 9. Site flow — what renders where

| Page | File | What it reads | What it shows |
|---|---|---|---|
| `/` | `site/src/pages/Home.tsx` | All plugins (first 4 featured) | Hero + plugin cards + 3-step "how it works" + the `InstallSteps` walkthrough |
| `/plugins` | `site/src/pages/Plugins.tsx` | All plugins | Filterable grid with search (MiniSearch) and category pills |
| `/plugins/:slug` | `site/src/pages/PluginDetail.tsx` | One plugin | Header → longDescription → useCases grid → benefits cards → workflow timeline → prerequisites → compact install CTA → source links → related |
| `/install` | `site/src/pages/Install.tsx` | All plugins | CLI-only multi-plugin bundle builder with URL sync (`?p=slug1,slug2`) |
| `/connect` | `site/src/pages/Connect.tsx` | All plugins | Plugin install (primary) + MCP connector setup (collapsible secondary) |
| `/inside-xbert` | `site/src/pages/InsideXBert.tsx` | Static content | Explainer page — how XBert / MCP / Claude work together, the agents-build-tools narrative |

Component reuse:

- **`PluginCard`** — used in Home (featured), Plugins (grid), PluginDetail (related).
- **`InstallSteps`** — tabbed component (Claude Desktop / Claude Code CLI). Used on Home, PluginDetail, Connect.
- **`MCPConnectorBox`** — collapsible details panel. Used on Connect only.
- **`InstallBlock`** — raw CLI snippet block. Used on the Install bundle builder.

---

## 10. CSS / visual conventions

The site uses **Tailwind v4** with light + dark mode driven by a **`data-theme` attribute** on `<html>` (NOT a class). The provider at `site/src/lib/theme.tsx` sets `document.documentElement.dataset.theme = "light" | "dark"`. Tailwind's `dark:` prefix still works because the theme provider keeps the dataset value and the variant in sync; new code should keep using `dark:` prefixes inline.

### Theme tokens (post-XBert rebrand 2026-05)

Defined in [`site/src/index.css`](site/src/index.css):

```css
@theme {
  /* XBert brand palette */
  --color-xbert-ink: #1C1B41;          /* Deep ink — primary headings */
  --color-xbert-ink-medium: #2E2C53;
  --color-xbert-indigo: #4E53BD;       /* Brand indigo — primary accent */
  --color-xbert-cyan: #02FFFF;         /* Brand cyan — secondary accent */
  --color-xbert-teal: #00FDBF;
  --color-xbert-canvas: #FAF9FC;       /* Light-mode page background */
  --color-xbert-grey-30: #EAECF5;
  --color-xbert-grey-50: #9CA3BA;
  --color-xbert-grey-70: #616E91;
  --color-xbert-grey-80: #3e3f69;

  /* Semantic surface tokens (light mode defaults) */
  --color-bg: #ffffff;
  --color-bg-soft: var(--color-xbert-canvas);
  --color-fg: #0a0a0a;
  --color-muted: var(--color-xbert-grey-70);
  --color-accent: #4E53BD;             /* Brand indigo */
  --color-accent-2: #02FFFF;           /* Brand cyan */
}

/* Dark-mode variant (engaged by [data-theme="dark"] on html) */
[data-theme="dark"] {
  --color-bg: #07090d;
  --color-bg-soft: #0b0d12;
  --color-fg: #f5f6f7;
  --color-muted: #9aa0a6;
}
```

The brand gradient (used for the hero + select chrome) is `linear-gradient(135deg, #1C1B41 0%, #4E53BD 60%, #02FFFF 100%)`.

### Recurring class patterns

**Card with hover lift + gradient glow:**
```html
<div class="group relative overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-b from-black/[0.03] to-black/[0.01] hover:border-black/20 dark:border-white/10 dark:from-white/[0.04] dark:to-white/[0.01] dark:hover:border-white/20 p-6 transition-colors">
  <!-- content -->
</div>
```

**Subtle filled chip / badge:**
```html
<span class="text-[10.5px] uppercase tracking-wider px-2 py-1 rounded-full bg-black/[0.05] text-neutral-700 border border-black/5 dark:bg-white/[0.06] dark:text-neutral-300 dark:border-white/5">
  badge text
</span>
```

**Primary button (high contrast, works in both modes):**
```html
<a class="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/10 ring-1 ring-white/40 hover:bg-neutral-100 transition"
   style="color: #0a0a0a">
  Click me
</a>
```

**Secondary button:**
```html
<a class="inline-flex items-center gap-2 rounded-md border border-black/15 bg-white/70 hover:bg-white text-neutral-900 dark:border-white/15 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-white px-4 py-2 text-sm font-medium transition">
  Secondary
</a>
```

**Numbered timeline step (used for workflows + install steps):**
```html
<ol class="relative space-y-5 pl-9">
  <span aria-hidden class="absolute left-[14px] top-1 bottom-1 w-px bg-gradient-to-b from-black/15 via-black/8 to-transparent dark:from-white/15 dark:via-white/8" />
  <li class="relative">
    <span class="absolute -left-9 top-0 inline-flex items-center justify-center size-7 rounded-full border border-black/15 bg-black/[0.04] dark:border-white/15 dark:bg-white/[0.06]">
      <Icon size={14} />
    </span>
    <div class="text-[11px] font-mono text-blue-500 dark:text-blue-400 mb-0.5">01</div>
    <div class="text-sm font-semibold text-neutral-900 dark:text-white">Step title</div>
    <div class="mt-1 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">Step body</div>
  </li>
</ol>
```

**Section heading hierarchy:**
```html
<h1 class="text-4xl md:text-5xl font-semibold tracking-tight">Page title</h1>
<h2 class="text-2xl md:text-3xl font-semibold tracking-tight">Section</h2>
<h3 class="text-base font-semibold">Card heading</h3>
<div class="text-xs uppercase tracking-wider text-neutral-500">Eyebrow</div>
```

### Motion (animation) patterns

Using [`motion/react`](https://motion.dev) (formerly Framer Motion):

**Fade up on mount:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
```

**Fade in when scrolled into view:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-30px" }}
  transition={{ duration: 0.4, delay: 0.05 * index }}
>
```

**Hover lift on cards:**
```tsx
<motion.div whileHover={{ y: -3 }}>
```

Stagger sibling animations by passing `delay: 0.04 * index` to each item in a map.

### Dark/light mode

The site supports both. **Always pair light-mode classes with `dark:` variants:**

```html
<div class="bg-white text-neutral-900 dark:bg-black dark:text-white">
```

Common pairings:
- `bg-white` / `dark:bg-black`
- `text-neutral-900` / `dark:text-white`
- `border-black/10` / `dark:border-white/10`
- `bg-black/[0.02]` / `dark:bg-white/[0.02]` (subtle surface)

The theme provider lives in `site/src/lib/theme.tsx` and respects the user's system preference plus a manual toggle.

---

## 11. Bundles — `bundles/bundles.json`

A "bundle" is a curated grouping of plugins. Site-only — Claude doesn't know about bundles.

```json
{
  "bundles": [
    {
      "id": "bookkeeping-essentials",
      "name": "Bookkeeping Essentials",
      "tagline": "Daily and monthly bookkeeping workflows.",
      "audience": "bookkeepers",
      "plugins": ["xbert-review", "xbert-reconcile"]
    }
  ]
}
```

To add a bundle:

1. Append a new object to `bundles.json`.
2. The plugin slugs must already exist in `plugins/`.
3. The build script picks it up on next `npm run dev`.

(There isn't a dedicated `/bundles/:id` route in the current site, but the data is loaded and ready when one is added.)

---

## 12. Adding a plugin — step-by-step checklist

For a new plugin called `xbert-foo` with command `/foo`:

- [ ] **Create the folder structure.** `plugins/xbert-foo/{.claude-plugin,commands,skills/foo-skill}/`
- [ ] **Write `plugin.json`** with the full `x-xbert` namespace (use template above).
- [ ] **Write `commands/foo.md`** with YAML frontmatter `description:` and a Steps block.
- [ ] **Write `skills/foo-skill/SKILL.md`** with YAML frontmatter `name:` + `description:`.
- [ ] **Write `README.md`** for the plugin.
- [ ] **Append to `.claude-plugin/marketplace.json`** (relative source form).
- [ ] **If your benefit cards use new icons,** add them to `ICONS` in `site/src/pages/PluginDetail.tsx`.
- [ ] **`cd site && npm run dev`** — pre-build script regenerates the catalog automatically.
- [ ] **Visit `/plugins/xbert-foo`** in the browser. Check the header, longDescription, useCases, benefits, workflow, prerequisites, and install CTA all render.
- [ ] **Verify icon mapping.** If a benefit card shows a sparkle (default fallback) instead of your chosen icon, the icon name string doesn't match the `ICONS` map key.
- [ ] **Verify the install snippet** by copying it on the detail page and checking it generates `/plugin install xbert-foo@xbert`.
- [ ] **Commit & push.**
  ```bash
  git add plugins/xbert-foo .claude-plugin/marketplace.json site/src/pages/PluginDetail.tsx
  git commit -m "Add xbert-foo plugin"
  git push
  ```
- [ ] **Re-sync in Claude Desktop.** Customize → Personal plugins → XBert-Plugins → `⋯` → Resync.

---

## 13. Bumping a plugin version

1. Edit `plugins/<slug>/.claude-plugin/plugin.json` → bump `version`.
2. Edit `.claude-plugin/marketplace.json` → bump the matching entry's `version` (keep them in sync).
3. Optionally append a line to a plugin-local `CHANGELOG.md`.
4. Commit & push.

When we adopt **changesets** (the recommended next step from the architecture review), this will be automated — contributors add a `.changeset/*.md` per PR and a release workflow bumps `plugin.json` versions, opens a "Version Packages" PR, and tags as `xbert-foo@1.2.0`. Until then, manual.

---

## 14. Common pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| Used the absolute `type: github` form in marketplace.json | Plugin silently fails to install on Claude Desktop "Add marketplace" | Switch to `"source": "./plugins/<slug>"` |
| Forgot to bump version in **both** `plugin.json` and `marketplace.json` | Version-drift confusion in the marketplace listing | Bump both together (CI will catch this eventually) |
| Icon string doesn't match the `ICONS` map | Card renders a generic Sparkles icon | Check spelling and PascalCase; add to `ICONS` if it's a new icon |
| `commands/<x>.md` filename has hyphens but you typed `/x_with_underscores` | Slash command not found | Filename → slash command exactly (`/foo` ← `commands/foo.md`) |
| Multiple commands in one `.md` file | Only the first is registered | One command per file |
| Updated plugin.json but storefront still shows old content | The dev server didn't pick up the change | The pre-build script only runs on `npm run dev`/`build`. Stop and restart the dev server, or delete `site/src/generated/catalog.json` and re-run. |
| `longDescription` has hard line breaks but renders as one paragraph | Need `\n\n` for paragraph breaks | Use double newlines, not single |
| Plugin appears on the site but not in Claude Desktop | Marketplace not re-synced after push | Cust → Personal plugins → XBert-Plugins → `⋯` → Resync |
| Site won't dev-server-start with a TypeScript error in catalog | New `x-xbert` field added but type definition not updated | Open `site/src/lib/catalog.ts` and add the field to the `XbertExt` type |

---

## 15. Files you'll edit most often

- **For a new plugin**:
  - `plugins/<slug>/.claude-plugin/plugin.json` (the manifest)
  - `plugins/<slug>/commands/*.md` (the command)
  - `plugins/<slug>/skills/<name>/SKILL.md` (the methodology)
  - `plugins/<slug>/README.md`
  - `.claude-plugin/marketplace.json` (one new entry)

- **For a new icon used in benefits**:
  - `site/src/pages/PluginDetail.tsx` (add to import + `ICONS` map)

- **For a new content field on plugin detail pages**:
  - `site/src/lib/catalog.ts` (add to `XbertExt` type)
  - `site/src/pages/PluginDetail.tsx` (render it)
  - `plugins/<slug>/.claude-plugin/plugin.json` (provide the data)

- **For visual / brand changes**:
  - `site/src/index.css` (theme tokens, body background gradient)
  - `site/src/components/Header.tsx`, `Footer.tsx` (chrome)

---

## 16. Quick references

- **Storefront**: https://plugins.xbert.io
- **GitHub repo**: https://github.com/ThirstyStudios/XBert-Plugins
- **Add the marketplace in Claude Desktop**: Customize → Personal plugins → `+` → Create plugin → Add marketplace → `ThirstyStudios/XBert-Plugins`
- **Add the marketplace in Claude Code**: `/plugin marketplace add ThirstyStudios/XBert-Plugins`
- **Claude plugin docs**: https://code.claude.com/docs/en/plugin-marketplaces
- **lucide-react icons**: https://lucide.dev/icons
- **Tailwind v4 docs**: https://tailwindcss.com
- **motion/react docs**: https://motion.dev
- **React Router v7 docs**: https://reactrouter.com
