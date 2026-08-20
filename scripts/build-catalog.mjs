// scripts/build-catalog.mjs
// Walks plugins/* and emits site/src/generated/catalog.json
// Run by hand: the site no longer reads the catalogue, so nothing invokes this
// on build. sitemap.xml is emitted by site/scripts/prerender.mjs.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const pluginsDir = join(repoRoot, "plugins");
const bundlesPath = join(repoRoot, "bundles", "bundles.json");
const outDir = join(repoRoot, "site", "src", "generated");

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const pluginSlugs = readdirSync(pluginsDir).filter((name) => {
  try {
    return statSync(join(pluginsDir, name)).isDirectory();
  } catch {
    return false;
  }
});

const allPlugins = pluginSlugs.map((slug) => {
  const manifestPath = join(pluginsDir, slug, ".claude-plugin", "plugin.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

  let readme = "";
  const readmePath = join(pluginsDir, slug, "README.md");
  if (existsSync(readmePath)) readme = readFileSync(readmePath, "utf8");

  let lastUpdated = null;
  try {
    const date = execSync(`git log -1 --format=%aI -- plugins/${slug}`, {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();
    if (date) lastUpdated = date;
  } catch {
    // git not available or no commits — leave as null
  }

  return { ...manifest, slug, readme, lastUpdated };
});

// Tranche One — only these plugins are publicly listed.
// Everything else is coming soon and excluded from the catalog.
const TRANCHE_ONE = new Set([
  "xbert-anomaly-review",
  "xbert-config-audit",
  "xbert-workflow-review",
  "xbert-working-paper",
]);

const plugins = allPlugins.filter((p) => TRANCHE_ONE.has(p.slug));
const comingSoonCount = allPlugins.length - plugins.length;

// bundles.json is not emitted: no page renders bundles, and every bundle is
// composed mostly of unpublished plugins, so shipping it only leaked their
// names into the JS bundle. Re-enable here if a bundles UI is ever built —
// filter to TRANCHE_ONE first.
const bundles = [];

const out = { plugins, bundles, comingSoonCount, generatedAt: new Date().toISOString() };
writeFileSync(join(outDir, "catalog.json"), JSON.stringify(out, null, 2));

console.log(
  `[catalog] wrote ${plugins.length} plugin(s), ${bundles.length} bundle(s), ${comingSoonCount} coming-soon -> site/src/generated/catalog.json`
);
