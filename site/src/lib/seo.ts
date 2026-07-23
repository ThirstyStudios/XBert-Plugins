import { useEffect } from "react";
import { SITE_ORIGIN, type RouteMeta } from "./route-meta";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

/**
 * Per-route SEO metadata for the SPA: document title, description,
 * canonical URL, Open Graph and Twitter card tags, updated on route change.
 *
 * Pass an entry from lib/route-meta — scripts/prerender.mjs bakes the same
 * tags into the static HTML from the same source, so the two stay in step.
 */
export function usePageMeta(meta: RouteMeta) {
  const { title, description, path } = meta;
  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    const canonical = SITE_ORIGIN + path;
    setMeta("property", "og:url", canonical);
    setCanonical(canonical);
  }, [title, description, path]);
}
