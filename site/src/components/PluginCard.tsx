import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Plugin } from "../lib/catalog";

type Props = {
  plugin: Plugin;
  index?: number;
};

function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 28) return `${Math.floor(days / 7)}w ago`;
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export function PluginCard({ plugin, index = 0 }: Props) {
  const x = plugin["x-xbert"];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.04 * index, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-b from-black/[0.03] to-black/[0.01] hover:border-black/20 dark:border-white/10 dark:from-white/[0.04] dark:to-white/[0.01] dark:hover:border-white/20 p-6 transition-colors"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle at 30% 0%, rgba(59,130,246,0.10), transparent 50%)",
        }}
      />
      <Link to={`/plugins/${plugin.slug}`} className="relative block">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-3">
            <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
              {x.displayName}
            </h3>
            <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
              {x.tagline}
            </p>
          </div>
          <ArrowUpRight
            size={18}
            aria-hidden
            className="mt-1 text-neutral-500 dark:text-neutral-400 transition-all group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {x.categories.map((c) => (
            <span
              key={c}
              className="text-[10.5px] uppercase tracking-wider px-2 py-1 rounded-full bg-black/[0.05] text-neutral-700 border border-black/5 dark:bg-white/[0.06] dark:text-neutral-300 dark:border-white/5"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
          {plugin.lastUpdated && (
            <>
              <span>{formatRelativeDate(plugin.lastUpdated)}</span>
              <span className="opacity-30">·</span>
            </>
          )}
          <span>
            {x.includes.skills} skill{x.includes.skills === 1 ? "" : "s"}
          </span>
          <span className="opacity-30">·</span>
          <span>
            {x.includes.commands} cmd{x.includes.commands === 1 ? "" : "s"}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
