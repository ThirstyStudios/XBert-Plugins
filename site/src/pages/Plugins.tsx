import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";
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

const COUNTRY_LABELS: Record<string, string> = {
  australian: "Australia",
  "new-zealand": "New Zealand",
  uk: "UK",
};
const COUNTRY_TAGS = Object.keys(COUNTRY_LABELS);

type CountryFilter = "all" | "global" | string;

function pluginIsInCountry(
  p: (typeof plugins)[number],
  country: CountryFilter
): boolean {
  if (country === "all") return true;
  const cats = p["x-xbert"].categories;
  const tagsOnPlugin = cats.filter((c) => COUNTRY_TAGS.includes(c));
  if (country === "global") return tagsOnPlugin.length === 0;
  return tagsOnPlugin.includes(country);
}

export default function PluginsPage() {
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [country, setCountry] = useState<CountryFilter>("all");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cats = useMemo(
    () => allCategories().filter((c) => !COUNTRY_TAGS.includes(c)),
    []
  );

  const available = useMemo(
    () => cats.filter((c) => !selected.includes(c)),
    [cats, selected]
  );

  const countryCounts = useMemo(() => {
    const counts: Record<CountryFilter, number> = {
      all: plugins.length,
      global: 0,
    };
    COUNTRY_TAGS.forEach((t) => (counts[t] = 0));
    plugins.forEach((p) => {
      const tagsOnPlugin = p["x-xbert"].categories.filter((c) =>
        COUNTRY_TAGS.includes(c)
      );
      if (tagsOnPlugin.length === 0) counts.global += 1;
      tagsOnPlugin.forEach((t) => (counts[t] += 1));
    });
    return counts;
  }, []);

  const suggestions = useMemo(() => {
    const q = text.trim().toLowerCase();
    const list = q
      ? available.filter((c) => c.toLowerCase().includes(q))
      : available;
    return list.slice(0, 8);
  }, [available, text]);

  useEffect(() => {
    setHighlight(0);
  }, [text, open]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered = useMemo(() => {
    let list = plugins;
    const q = text.trim();
    if (q) {
      const hits = new Set(
        ms.search(q, { prefix: true, fuzzy: 0.2 }).map((h) => h.id as string)
      );
      list = list.filter((p) => hits.has(p.slug));
    }
    if (selected.length) {
      list = list.filter((p) =>
        selected.every((c) => p["x-xbert"].categories.includes(c))
      );
    }
    if (country !== "all") {
      list = list.filter((p) => pluginIsInCountry(p, country));
    }
    return list;
  }, [text, selected, country]);

  function addCategory(cat: string) {
    if (!selected.includes(cat)) setSelected([...selected, cat]);
    setText("");
    inputRef.current?.focus();
  }

  function removeCategory(cat: string) {
    setSelected(selected.filter((c) => c !== cat));
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" && suggestions.length) {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp" && suggestions.length) {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && suggestions[highlight]) {
        e.preventDefault();
        addCategory(suggestions[highlight]);
      }
    } else if (e.key === "Backspace" && !text && selected.length) {
      removeCategory(selected[selected.length - 1]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

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
        <p className="mt-2 text-neutral-700 dark:text-neutral-400">
          {plugins.length} plugin{plugins.length === 1 ? "" : "s"} powered by the XBert MCP.
        </p>
      </motion.div>

      {/* Country filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            { key: "all", label: "All countries" },
            { key: "global", label: "Global" },
            ...COUNTRY_TAGS.map((t) => ({ key: t, label: COUNTRY_LABELS[t] })),
          ] as { key: CountryFilter; label: string }[]
        ).map((opt) => {
          const active = country === opt.key;
          const count = countryCounts[opt.key] ?? 0;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setCountry(opt.key)}
              disabled={opt.key !== "all" && count === 0}
              className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border transition inline-flex items-center gap-1.5 ${
                active
                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white"
                  : "bg-black/[0.03] text-neutral-700 border-black/10 hover:bg-black/[0.06] dark:bg-white/[0.04] dark:text-neutral-300 dark:border-white/10 dark:hover:bg-white/[0.08]"
              } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black/[0.03] dark:disabled:hover:bg-white/[0.04]`}
            >
              {opt.label}
              <span
                className={`text-[10px] font-mono ${
                  active
                    ? "opacity-80"
                    : "text-neutral-500 dark:text-neutral-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Smart search */}
      <div className="mt-6" ref={wrapRef}>
        <div className="relative w-full md:max-w-2xl">
          <div
            className="flex flex-wrap items-center gap-1.5 rounded-md bg-black/[0.03] border border-black/10 dark:bg-white/[0.04] dark:border-white/10 pl-3 pr-3 py-2 focus-within:border-black/25 focus-within:bg-black/[0.05] dark:focus-within:border-white/25 dark:focus-within:bg-white/[0.06] transition cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            <Search
              size={16}
              className="text-neutral-600 dark:text-neutral-500 shrink-0"
            />
            {selected.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black text-[11px] uppercase tracking-wider px-2 py-0.5"
              >
                {c}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(c);
                  }}
                  className="opacity-70 hover:opacity-100"
                  aria-label={`Remove ${c}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder={
                selected.length ? "Add filter or search…" : "Search plugins or filter by tag…"
              }
              className="flex-1 min-w-[8rem] bg-transparent text-sm placeholder:text-neutral-600 dark:placeholder:text-neutral-500 focus:outline-none py-0.5"
            />
            {(selected.length > 0 || text) && (
              <button
                type="button"
                onClick={() => {
                  setSelected([]);
                  setText("");
                  inputRef.current?.focus();
                }}
                className="text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              >
                Clear
              </button>
            )}
          </div>

          {open && suggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 shadow-lg overflow-hidden">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-neutral-500 border-b border-black/5 dark:border-white/5">
                Filter by tag
              </div>
              {suggestions.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => addCategory(c)}
                  className={`w-full text-left px-3 py-1.5 text-sm transition ${
                    i === highlight
                      ? "bg-black/[0.05] dark:bg-white/[0.06]"
                      : ""
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-10 grid md:grid-cols-2 gap-4">
        {filtered.map((p, i) => (
          <PluginCard key={p.slug} plugin={p} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-12 text-center text-neutral-700 dark:text-neutral-400">
            No plugins match that filter.
          </div>
        )}
      </div>
    </div>
  );
}
