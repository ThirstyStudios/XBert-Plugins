#!/usr/bin/env node
// check-version-sync.mjs
// CI gate: every plugin's .claude-plugin/plugin.json MUST match its
// .claude-plugin/marketplace.json entry on both `version` and `description`.
// Also verifies every plugin folder is registered, every registered plugin
// folder exists, and every bundles.json plugin slug exists in marketplace.json.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.dirname(path.dirname(__filename));

function fail(msg) {
  console.error(`::error::${msg}`);
  process.exitCode = 1;
}

function readJson(p) {
  let raw = fs.readFileSync(p, 'utf8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  return JSON.parse(raw);
}

const marketplacePath = path.join(repoRoot, '.claude-plugin', 'marketplace.json');
const pluginsDir = path.join(repoRoot, 'plugins');
const bundlesPath = path.join(repoRoot, 'bundles', 'bundles.json');

if (!fs.existsSync(marketplacePath)) fail(`marketplace.json missing at ${marketplacePath}`);
if (!fs.existsSync(pluginsDir)) fail(`plugins/ missing at ${pluginsDir}`);

const marketplace = readJson(marketplacePath);
const marketplaceByName = new Map(marketplace.plugins.map((p) => [p.name, p]));

const pluginFolders = fs.readdirSync(pluginsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

// 1. Every plugin folder appears in marketplace.json
for (const folder of pluginFolders) {
  if (!marketplaceByName.has(folder)) {
    fail(`Plugin folder plugins/${folder} is NOT registered in marketplace.json`);
  }
}

// 2. Every marketplace entry has a folder
for (const entry of marketplace.plugins) {
  const folderPath = path.join(pluginsDir, entry.name);
  if (!fs.existsSync(folderPath)) {
    fail(`marketplace.json registers '${entry.name}' but plugins/${entry.name} does not exist`);
  }
  const expectedSource = `./plugins/${entry.name}`;
  if (entry.source !== expectedSource) {
    fail(`marketplace.json '${entry.name}'.source should be '${expectedSource}', got '${entry.source}'`);
  }
}

// 3. Each plugin's plugin.json version/description must match marketplace.json
for (const folder of pluginFolders) {
  const manifestPath = path.join(pluginsDir, folder, '.claude-plugin', 'plugin.json');
  if (!fs.existsSync(manifestPath)) {
    fail(`Plugin plugins/${folder} is missing .claude-plugin/plugin.json`);
    continue;
  }
  let manifest;
  try {
    manifest = readJson(manifestPath);
  } catch (e) {
    fail(`plugins/${folder}/.claude-plugin/plugin.json failed to parse: ${e.message}`);
    continue;
  }
  const entry = marketplaceByName.get(folder);
  if (!entry) continue;
  if (manifest.name !== entry.name) {
    fail(`plugins/${folder}: plugin.json.name '${manifest.name}' != marketplace.json.name '${entry.name}'`);
  }
  if (manifest.version !== entry.version) {
    fail(`plugins/${folder}: version drift — plugin.json '${manifest.version}' vs marketplace.json '${entry.version}'. Bump both together.`);
  }
  if (manifest.description !== entry.description) {
    fail(`plugins/${folder}: description drift between plugin.json and marketplace.json. Update both together.\n  plugin.json:     ${manifest.description}\n  marketplace.json: ${entry.description}`);
  }
}

// 4. bundles.json references must resolve to marketplace.json
if (fs.existsSync(bundlesPath)) {
  let bundles;
  try {
    bundles = readJson(bundlesPath);
  } catch (e) {
    fail(`bundles.json failed to parse: ${e.message}`);
  }
  if (bundles && Array.isArray(bundles.bundles)) {
    for (const bundle of bundles.bundles) {
      for (const slug of bundle.plugins || []) {
        if (!marketplaceByName.has(slug)) {
          fail(`bundles.json bundle '${bundle.id}' references unknown plugin '${slug}'`);
        }
      }
    }
  }
}

if (process.exitCode) {
  console.error('\nVersion + manifest sync check FAILED. Fix the issues above before merging.');
  process.exit(1);
} else {
  console.log(`OK — ${pluginFolders.length} plugins synced with marketplace.json + bundles.json references resolve.`);
}
