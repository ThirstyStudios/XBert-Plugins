import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import HomePage from "./pages/Home";
import GetStartedPage from "./pages/GetStarted";
import FeaturesPage from "./pages/Features";
import PluginsPage from "./pages/Plugins";
import PluginDetailPage from "./pages/PluginDetail";
import InsideXBertPage from "./pages/InsideXBert";
import NotFoundPage from "./pages/NotFound";

/**
 * Runs inside each page's transition wrapper (keyed by pathname), so it
 * re-mounts on every navigation: jump to the hash target if the URL has one
 * (e.g. /get-started#manage-access), otherwise reset to the top.
 */
function ScrollReset() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView();
        // Move keyboard focus too, otherwise the next Tab returns to the top.
        (target as HTMLElement).focus({ preventScroll: true });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [hash]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/plugins" element={<PluginsPage />} />
          <Route path="/plugins/:slug" element={<PluginDetailPage />} />
          <Route path="/inside-xbert" element={<InsideXBertPage />} />
          <Route path="/connect" element={<Navigate to="/get-started" replace />} />
          <Route path="/install" element={<Navigate to="/get-started" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ScrollReset />
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Layout + routes without a router around them, so the browser entry can wrap
 * it in BrowserRouter and the build-time prerenderer (entry-server.tsx) in
 * StaticRouter, off the one component tree.
 */
export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white dark:focus:bg-white dark:focus:text-neutral-900"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
