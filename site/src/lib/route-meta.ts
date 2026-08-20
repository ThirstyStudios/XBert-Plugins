export const SITE_ORIGIN = "https://intelligence.xbert.io";

export type RouteMeta = {
  title: string;
  description: string;
  /** Route path used for the canonical URL, e.g. "/features". */
  path: string;
};

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
      "Connect Claude, Claude Code or any MCP-aware assistant to XBert — 200 tools across your clients' books and your practice's own jobs, WIP and capacity. ChatGPT with extra setup.",
    path: "/",
  },
  getStarted: {
    title: "Get started — connect Claude to XBert",
    description:
      "Connect Claude, Claude Code or another MCP-aware assistant to the XBert MCP — about five minutes on Claude, longer on ChatGPT. Three steps, first prompts, and best practices.",
    path: "/get-started",
  },
  features: {
    title: "XBert MCP features — 200 tools in plain English",
    description:
      "What Claude, Claude Code or your AI does with XBert — every capability area in plain English: receivables, payables, payroll, reporting, WIP, capacity, alerts.",
    path: "/features",
  },
  insideXBert: {
    title: "Inside XBert — one product, two surfaces",
    description:
      "How the XBert MCP and the XBert app fit together — same data, same rules, same audit trail.",
    path: "/inside-xbert",
  },
  notFound: {
    title: "Page not found — XBert MCP",
    description: "That page doesn't exist. Head back to the XBert MCP overview.",
    path: "/404",
  },
} satisfies Record<string, RouteMeta>;

/**
 * Every route the build prerenders to static HTML: the four public pages.
 * Consumed by scripts/prerender.mjs.
 */
export function prerenderRoutes(): RouteMeta[] {
  return [
    ROUTE_META.home,
    ROUTE_META.getStarted,
    ROUTE_META.features,
    ROUTE_META.insideXBert,
  ];
}
