import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import MiniSearch from "minisearch";
import { plugins, allCategories } from "../lib/catalog";
import { PluginCard } from "../components/PluginCard";

const ms = new MiniSearch({
  fields: ["displayName", "tagline", "description", "keywords"],
  storeFields: ["slug"],
  idField: "slug",
});
ms.addAll(
  plugins.map((p) => ({
    slug: p.slug,
    displayName: p["x-xbert"].displayName,
    tagline: p["x-xbert"].tagline,
    description: p.description,
    keywords: (p.keywords ?? []).join(" "),
  }))
);

export default function PluginsPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const cats = useMemo(allCategories, []);

  const filtered = useMemo(() => {
    let list = plugins;
    if (q.trim()) {
      const hits = new Set(
        ms.search(q, { prefix: true, fuzzy: 0.2 }).map((h) => h.id as string)
      );
      list = list.filter((p) => hits.has(p.slug));
    }
    if (category) {
      list = list.filter((p) => p["x-xbert"].categories.includes(category));
    }
    return list;
  }, [q, category]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          All plugins
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {plugins.length} Claude Code plugin{plugins.length === 1 ? "" : "s"} powered by the XBert MCP.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="mt-10 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative w-full md:max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search plugins…"
            className="w-full rounded-md bg-black/[0.03] border border-black/10 dark:bg-white/[0.04] dark:border-white/10 pl-9 pr-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:border-black/25 focus:bg-black/[0.05] dark:focus:border-white/25 dark:focus:bg-white/[0.06] transition"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <CategoryPill
            label="All"
            active={category === null}
            onClick={() => setCategory(null)}
          />
          {cats.map((c) => (
            <CategoryPill
              key={c}
              label={c}
              active={category === c}
              onClick={() => setCategory(category === c ? null : c)}
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-10 grid md:grid-cols-2 gap-4">
        {filtered.map((p, i) => (
          <PluginCard key={p.slug} plugin={p} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-12 text-center text-neutral-600 dark:text-neutral-400">
            No plugins match that filter.
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border transition ${
        active
          ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white"
          : "bg-black/[0.03] text-neutral-700 border-black/10 hover:bg-black/[0.06] dark:bg-white/[0.04] dark:text-neutral-300 dark:border-white/10 dark:hover:bg-white/[0.08]"
      }`}
    >
      {label}
    </button>
  );
}
