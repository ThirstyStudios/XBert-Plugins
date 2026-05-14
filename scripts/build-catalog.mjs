// scripts/build-catalog.mjs
// Walks plugins/* and emits site/src/generated/catalog.json
// Runs as `prebuild` and `predev` from site/package.json.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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

const plugins = pluginSlugs.map((slug) => {
  const manifestPath = join(pluginsDir, slug, ".claude-plugin", "plugin.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

  let readme = "";
  const readmePath = join(pluginsDir, slug, "README.md");
  if (existsSync(readmePath)) readme = readFileSync(readmePath, "utf8");

  return { ...manifest, slug, readme };
});

let bundles = [];
if (existsSync(bundlesPath)) {
  try {
    bundles = JSON.parse(readFileSync(bundlesPath, "utf8")).bundles ?? [];
  } catch (e) {
    console.warn(`[catalog] could not parse bundles.json: ${e.message}`);
  }
}

const out = { plugins, bundles, generatedAt: new Date().toISOString() };
writeFileSync(join(outDir, "catalog.json"), JSON.stringify(out, null, 2));

console.log(
  `[catalog] wrote ${plugins.length} plugin(s), ${bundles.length} bundle(s) -> site/src/generated/catalog.json`
);
