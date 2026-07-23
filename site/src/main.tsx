import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./lib/theme";

/* createRoot, NOT hydrateRoot, even though scripts/prerender.mjs ships markup
   inside #root. That markup exists for crawlers and scrapers; the browser
   throws it away and renders from scratch. Hydrating instead would save one
   render but force the server markup to match the client's first paint, which
   it cannot: the theme comes from localStorage / prefers-color-scheme (see
   theme-init.js) and is unknowable at build time. */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* motion defaults to reducedMotion="never"; "user" makes every transform
        animation on the site honour prefers-reduced-motion. */}
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MotionConfig>
  </StrictMode>
);
