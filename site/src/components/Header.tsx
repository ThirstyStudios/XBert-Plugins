import { Link, NavLink } from "react-router";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/theme";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `relative text-sm transition-colors ${
    isActive
      ? "text-neutral-900 dark:text-white"
      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
  }`;

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-bg-soft)]/70 border-b border-black/[0.08] dark:border-white/[0.06]"
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            aria-hidden
            className="inline-block size-6 rounded-md"
            style={{
              background:
                "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.08), 0 8px 24px -8px rgba(59,130,246,0.6)",
            }}
          />
          <span>
            XBert <span className="text-neutral-500 dark:text-neutral-400 font-normal">MCP</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 md:gap-7">
          <NavLink to="/connect" className={linkClass}>
            Connect
          </NavLink>
          <NavLink to="/plugins" className={linkClass}>
            Plugins
          </NavLink>
          <a
            href="https://xbert.io"
            className="hidden sm:inline text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            xbert.io ↗
          </a>
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            className="inline-flex items-center justify-center size-8 rounded-md border border-black/10 bg-black/[0.03] text-neutral-700 hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:bg-white/[0.08] transition"
          >
            {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </nav>
      </div>
    </motion.header>
  );
}
