import { getPlugin, plugins } from "./catalog";

export const SITE_ORIGIN = "https://intelligence.xbert.io";

export type RouteMeta = {
  title: string;
  description: string;
  /** Route path used for the canonical URL, e.g. "/features". */
  path: string;
};

function truncate(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max - 1).trimEnd() + "…";
}

/**
 * Per-route title / description / canonical path, in ONE place: the pages read
 * it at runtime via usePageMeta, and scripts/prerender.mjs reads the very same
 * objects at build time to bake the tags into the static HTML. Editing a title
 * here updates both, so the two can never drift.
 */
export const ROUTE_META = {
  home: {
    title: "XBert MCP — every client, every job, one question away",
    description:
      "Connect Claude, ChatGPT or any MCP-aware assistant to XBert — 200 tools across your clients' books and your practice's own jobs, WIP and capacity.",
    path: "/",
  },
  getStarted: {
    title: "Get started — connect Claude or ChatGPT to XBert",
    description:
      "Connect Claude, Claude Code, ChatGPT or any MCP-aware assistant to the XBert MCP in about five minutes. Three steps, first prompts, and best practices.",
    path: "/get-started",
  },
  features: {
    title: "XBert MCP features — 200 tools in plain English",
    description:
      "What Claude, ChatGPT or your AI does with XBert — every capability area in plain English: receivables, payables, payroll, reporting, WIP, capacity, alerts.",
    path: "/features",
  },
  plugins: {
    title: "XBert plugins — ready-made workflows on the MCP",
    description:
      "Plugins package XBert MCP workflows into slash commands for Claude Code and Claude Desktop. Browse by country and tag; install with two commands.",
    path: "/plugins",
  },
  insideXBert: {
    title: "Inside XBert — one product, two surfaces",
    description:
      "How the XBert MCP, the plugins and the XBert app fit together — same data, same rules, same audit trail.",
    path: "/inside-xbert",
  },
  changelog: {
    title: "Changelog — XBert MCP updates",
    description: "What's new in the XBert MCP and plugins — updates listed newest first.",
    path: "/changelog",
  },
  notFound: {
    title: "Page not found — XBert MCP",
    description: "That page doesn't exist. Head back to the XBert MCP overview.",
    path: "/404",
  },
} satisfies Record<string, RouteMeta>;

/** Plugin-detail metadata, derived from the catalogue entry for `slug`. */
export function pluginMeta(slug: string | undefined): RouteMeta {
  const p = getPlugin(slug);
  return {
    title: p ? truncate(`${p["x-xbert"].displayName} — XBert plugin`, 60) : "XBert plugin",
    description: p ? truncate(p["x-xbert"].tagline, 155) : "Plugin not found.",
    path: `/plugins/${slug ?? ""}`,
  };
}

/**
 * Every route the build prerenders to static HTML: the six public pages plus
 * one page per published plugin. Consumed by scripts/prerender.mjs.
 */
export function prerenderRoutes(): RouteMeta[] {
  return [
    ROUTE_META.home,
    ROUTE_META.getStarted,
    ROUTE_META.features,
    ROUTE_META.plugins,
    ROUTE_META.insideXBert,
    ROUTE_META.changelog,
    ...plugins.map((p) => pluginMeta(p.slug)),
  ];
}
