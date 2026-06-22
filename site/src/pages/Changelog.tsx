import { Link } from "react-router";
import { motion } from "motion/react";
import { changelog, getPlugin } from "../lib/catalog";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ChangelogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Changelog
        </h1>
        <p className="mt-2 text-neutral-700 dark:text-neutral-400">
          Recent updates to XBert plugins.
        </p>
      </motion.div>

      <div className="mt-12 space-y-10">
        {changelog.map((entry, i) => (
          <motion.div
            key={entry.date}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04 * i }}
          >
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
              {formatDate(entry.date)}
            </h2>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
              {entry.message}
            </p>
            {entry.plugins.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {entry.plugins.map((slug) => {
                  const p = getPlugin(slug);
                  const label = p ? p["x-xbert"].displayName : slug;
                  const cls =
                    "text-[10.5px] uppercase tracking-wider px-2 py-1 rounded-full bg-black/[0.05] text-neutral-700 border border-black/5 dark:bg-white/[0.06] dark:text-neutral-300 dark:border-white/5";
                  return p ? (
                    <Link
                      key={slug}
                      to={`/plugins/${slug}`}
                      className={`${cls} hover:bg-black/[0.08] dark:hover:bg-white/[0.10] transition-colors`}
                    >
                      {label}
                    </Link>
                  ) : (
                    <span key={slug} className={`${cls} opacity-50`}>
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </motion.div>
        ))}
        {changelog.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-12 text-center text-neutral-700 dark:text-neutral-400">
            No changelog entries yet.
          </div>
        )}
      </div>
    </div>
  );
}
