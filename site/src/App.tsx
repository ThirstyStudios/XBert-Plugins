import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import HomePage from "./pages/Home";
import ConnectPage from "./pages/Connect";
import PluginsPage from "./pages/Plugins";
import PluginDetailPage from "./pages/PluginDetail";
import InstallPage from "./pages/Install";
import NotFoundPage from "./pages/NotFound";

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
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/plugins" element={<PluginsPage />} />
          <Route path="/plugins/:slug" element={<PluginDetailPage />} />
          <Route path="/install" element={<InstallPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
