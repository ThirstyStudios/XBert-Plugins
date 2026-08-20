import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../lib/theme";

const NAV_ITEMS = [
  { label: "Get started", to: "/get-started" },
  { label: "Features", to: "/features" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `relative text-sm transition-colors ${
    isActive
      ? "text-neutral-900 dark:text-white"
      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
  }`;

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `py-2.5 text-sm transition-colors ${
    isActive
      ? "text-neutral-900 dark:text-white font-medium"
      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
  }`;

const squareButtonClass =
  "inline-flex items-center justify-center size-8 rounded-md border border-black/10 bg-black/[0.03] text-neutral-700 hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:bg-white/[0.08] transition";

const primaryButtonClass =
  "group items-center gap-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 text-sm font-semibold shadow-lg shadow-xbert-indigo/20 ring-1 ring-black/10 dark:ring-white/40 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition";

export function Header() {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-bg-soft)]/70 border-b border-black/[0.08] dark:border-white/[0.06]"
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <img src="/xbert-mark.svg" alt="" width={24} height={24} className="size-6" />
          <span>
            XBert <span className="text-neutral-500 dark:text-neutral-400 font-normal">MCP</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://xbert.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            xbert.io ↗
          </a>
          <button
            type="button"
            onClick={toggle}
            aria-label="Switch theme"
            title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            className={squareButtonClass}
          >
            {theme === "light" ? <Moon size={14} aria-hidden /> : <Sun size={14} aria-hidden />}
          </button>
          <Link to="/get-started" className={`hidden sm:inline-flex ${primaryButtonClass}`}>
            Connect your assistant
            <ArrowRight
              size={16}
              strokeWidth={2.5}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={`md:hidden ${squareButtonClass}`}
          >
            {menuOpen ? <X size={14} aria-hidden /> : <Menu size={14} aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="md:hidden absolute top-full inset-x-0 border-b border-black/[0.08] dark:border-white/[0.06] shadow-xl shadow-black/10 dark:shadow-black/40"
            style={{ backgroundColor: "var(--color-bg-soft)" }}
          >
            <nav aria-label="Mobile" className="max-w-6xl mx-auto px-6 py-4 flex flex-col">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={closeMenu} className={mobileLinkClass}>
                  {item.label}
                </NavLink>
              ))}
              <a
                href="https://xbert.io"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="py-2.5 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                xbert.io ↗
              </a>
              <Link
                to="/get-started"
                onClick={closeMenu}
                className={`mt-3 inline-flex justify-center ${primaryButtonClass}`}
              >
                Connect your assistant
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
