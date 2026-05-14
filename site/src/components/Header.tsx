import { Link, NavLink } from "react-router";
import { motion } from "motion/react";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `relative text-sm transition-colors ${
    isActive ? "text-white" : "text-neutral-400 hover:text-white"
  }`;

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(7,9,13,0.7)] border-b border-white/[0.06]"
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
            XBert <span className="text-neutral-400 font-normal">Plugins</span>
          </span>
        </Link>
        <nav className="flex items-center gap-7">
          <NavLink to="/plugins" className={linkClass}>
            Browse
          </NavLink>
          <a
            href="https://docs.anthropic.com/en/docs/claude-code/setup"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Claude
          </a>
          <a
            href="https://xbert.io"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            xbert.io ↗
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
