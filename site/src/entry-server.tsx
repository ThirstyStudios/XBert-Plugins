import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { MotionConfig } from "motion/react";
import { AppShell } from "./App";
import { ThemeProvider } from "./lib/theme";

/**
 * Build-time render entry, used only by scripts/prerender.mjs — never shipped
 * to the browser. Mirrors main.tsx except that the router is StaticRouter for a
 * fixed URL, and index.css is not imported (the built index.html template we
 * inject this markup into already links the stylesheet).
 */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <StaticRouter location={url}>
            <AppShell />
          </StaticRouter>
        </ThemeProvider>
      </MotionConfig>
    </StrictMode>
  );
}

/** Re-exported so the prerenderer takes its route list from the same bundle. */
export { prerenderRoutes, SITE_ORIGIN } from "./lib/route-meta";
