/**
 * Build-time prerenderer.
 *
 * `vite build` emits a single empty SPA shell, so every route served the same
 * ~9 kB of markup with the homepage's <title>/description — nothing for
 * non-JS crawlers, AI answer engines or social scrapers to read. This script
 * runs straight after it:
 *
 *   1. builds src/entry-server.tsx as an SSR bundle (dist-ssr/, not deployed),
 *   2. renders every route in lib/route-meta's prerenderRoutes() to a string,
 *   3. injects that markup into dist/index.html at <div id="root"></div> and
 *      rewrites the head tags for that route,
 *   4. writes dist/<route>/index.html,
 *   5. writes dist/sitemap.xml from the same route list.
 *
 * Azure Static Web Apps matches a request against the uploaded static files
 * first and only falls through to navigationFallback when nothing matches, so
 * /features is served by dist/features/index.html with no config change.
 *
 * The client still boots with createRoot (see main.tsx), so this markup is
 * replaced wholesale on load — it is for crawlers, not for hydration.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(siteRoot, "dist");
const ssrDir = path.join(siteRoot, "dist-ssr");

function escapeAttr(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Replace an existing <meta> in the template, or append one before </head>. */
function setMeta(html, attr, key, content) {
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`;
  const existing = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`);
  if (existing.test(html)) return html.replace(existing, tag);
  return html.replace("</head>", `  ${tag}\n  </head>`);
}

function setLink(html, rel, href) {
  const tag = `<link rel="${rel}" href="${escapeAttr(href)}" />`;
  const existing = new RegExp(`<link\\s+rel="${rel}"\\s+href="[^"]*"\\s*/?>`);
  if (existing.test(html)) return html.replace(existing, tag);
  return html.replace("</head>", `  ${tag}\n  </head>`);
}

function injectHead(html, meta, origin) {
  const canonical = origin + meta.path;
  let out = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeAttr(meta.title)}</title>`
  );
  out = setMeta(out, "name", "description", meta.description);
  out = setMeta(out, "property", "og:title", meta.title);
  out = setMeta(out, "property", "og:description", meta.description);
  out = setMeta(out, "property", "og:url", canonical);
  out = setMeta(out, "name", "twitter:title", meta.title);
  out = setMeta(out, "name", "twitter:description", meta.description);
  out = setLink(out, "canonical", canonical);
  return out;
}

/** "/" -> dist/index.html, "/features" -> dist/features/index.html */
function outputFile(routePath) {
  return routePath === "/"
    ? path.join(distDir, "index.html")
    : path.join(distDir, routePath.replace(/^\//, ""), "index.html");
}

await build({
  root: siteRoot,
  logLevel: "warn",
  build: {
    ssr: "src/entry-server.tsx",
    outDir: "dist-ssr",
    emptyOutDir: true,
    ssrEmitAssets: false,
    // Nothing serves dist-ssr — don't copy public/ (fonts, video, og-card) into it.
    copyPublicDir: false,
  },
});

const entry = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const { render, prerenderRoutes, SITE_ORIGIN, ROUTE_META } = entry;

// Read the template once: the "/" route overwrites dist/index.html in the loop.
const template = await readFile(path.join(distDir, "index.html"), "utf8");
if (!template.includes('<div id="root"></div>')) {
  throw new Error(
    "dist/index.html has no empty #root — it looks already prerendered. Run `vite build` first."
  );
}

for (const meta of prerenderRoutes()) {
  const markup = render(meta.path);
  if (!markup.trim()) throw new Error(`Prerender produced no markup for ${meta.path}`);

  const html = injectHead(template, meta, SITE_ORIGIN).replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>`
  );

  const file = outputFile(meta.path);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html, "utf8");
  console.log(
    `[prerender] ${meta.path.padEnd(32)} ${String(Buffer.byteLength(html)).padStart(7)} bytes  ${path.relative(siteRoot, file)}`
  );
}

// sitemap.xml is written from the same prerenderRoutes() list rather than kept
// by hand in public/, so a route can never be added or removed without it.
{
  const today = new Date().toISOString().slice(0, 10);
  const routes = prerenderRoutes();
  const urls = routes.map(
    (meta) =>
      `  <url><loc>${SITE_ORIGIN}${meta.path}</loc><lastmod>${today}</lastmod></url>`
  );
  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
    ``,
  ].join("\n");
  await writeFile(path.join(distDir, "sitemap.xml"), xml, "utf8");
  console.log(`[prerender] ${"sitemap.xml".padEnd(32)} ${routes.length} urls`);
}

// Static Web Apps needs a dedicated file for its 404 responseOverride: pointing
// the override at index.html makes it serve the homepage and reset the status
// to 200, which is how unknown URLs became soft-404s.
{
  const meta = ROUTE_META.notFound;
  const markup = render("/__not-found__");
  const html = injectHead(template, meta, SITE_ORIGIN).replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>`
  );
  const file = path.join(distDir, "404.html");
  await writeFile(file, html, "utf8");
  console.log(
    `[prerender] ${"404".padEnd(32)} ${String(Buffer.byteLength(html)).padStart(7)} bytes  ${path.relative(siteRoot, file)}`
  );
}
