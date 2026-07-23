import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";
import MiniSearch from "minisearch";
import { plugins, allCategories, comingSoonCount } from "../lib/catalog";
import { PluginCard } from "../components/PluginCard";
import { Chip } from "../components/Chip";
import { SectionHeading } from "../components/SectionHeading";
import { InstallBlock } from "../components/InstallBlock";
import { usePageMeta } from "../lib/seo";
import { ROUTE_META } from "../lib/route-meta";

const INSTALL_SNIPPET = `/plugin marketplace add ThirstyStudios/XBert-Plugins
/plugin install <name>@xbert`;

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
  usePageMeta(ROUTE_META.plugins);

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
    <div className="max-w-6xl mx-auto px-6 pt-16 pb-14 md:pt-24 md:pb-20">
      {/* HERO */}
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]"
          >
            Ready-made workflows, built on the MCP.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-4 text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl"
          >
            Everything on this page runs on the same XBert MCP — the same 200
            tools, the same permissions, the same audit trail. A plugin simply
            packages a job into a slash command (plus supporting skills) for
            Claude Code or Claude Desktop: the prompts, the steps and the
            output, already decided. Type{" "}
            <span className="font-mono">/workflow-review</span> instead of
            explaining a workflow audit from scratch.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-5 text-sm font-mono text-neutral-600 dark:text-neutral-400"
          >
            {plugins.length} plugins · every one powered by the XBert MCP
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-4"
          >
            <Chip>Requires Claude Code or Claude Desktop</Chip>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden lg:block"
        >
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-xbert-ink p-4 md:p-6 overflow-hidden">
            <img
              src="/illustrations/plugins-blocks.svg"
              alt=""
              aria-hidden
              width={1216}
              height={896}
              className="block w-full h-auto rounded-xl"
            />
          </div>
        </motion.div>
      </div>

      {/* DO YOU NEED PLUGINS? */}
      <section className="mt-28 md:mt-32 max-w-3xl">
        <SectionHeading
          title="Do you need plugins? No."
          lead="The MCP on its own answers everything these plugins do — you just ask in your own words, in any chat. Plugins are the shortcut, not the starting line: they're for the jobs you repeat — the same prep, the same review, run the same way every time, by anyone on the team, from one command."
        />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-4 text-sm text-neutral-600 dark:text-neutral-400"
        >
          New to all this?{" "}
          <Link
            to="/"
            className="text-xbert-indigo dark:text-xbert-cyan hover:underline"
          >
            Start with the MCP overview →
          </Link>{" "}
          ·{" "}
          <Link
            to="/get-started"
            className="text-xbert-indigo dark:text-xbert-cyan hover:underline"
          >
            Get connected →
          </Link>
        </motion.p>
      </section>

      {/* INSTALL STRIP */}
      <section className="mt-28 md:mt-32 max-w-3xl">
        <SectionHeading as="h2" title="Two commands and you're in." />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-6"
        >
          <InstallBlock snippet={INSTALL_SNIPPET} showSkipHint={false} />
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Add the marketplace once, then install any plugin from it. The
            exact install line is shown on every plugin page.
          </p>
        </motion.div>
      </section>

      {/* Country filter */}
      <div className="mt-28 md:mt-32 flex flex-wrap gap-2">
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
              aria-pressed={active}
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
                    : "text-neutral-500 dark:text-neutral-400"
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
              aria-hidden
              className="text-neutral-600 dark:text-neutral-400 shrink-0"
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
                  <X size={12} aria-hidden />
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
              aria-label="Search plugins or filter by tag"
              role="combobox"
              aria-expanded={open && suggestions.length > 0}
              aria-controls="plugin-tag-listbox"
              aria-autocomplete="list"
              aria-activedescendant={
                open && suggestions[highlight] ? `tag-opt-${highlight}` : undefined
              }
              className="flex-1 min-w-[8rem] bg-transparent text-sm placeholder:text-neutral-600 dark:placeholder:text-neutral-400 py-0.5"
            />
            {(selected.length > 0 || text) && (
              <button
                type="button"
                onClick={() => {
                  setSelected([]);
                  setText("");
                  inputRef.current?.focus();
                }}
                className="text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              >
                Clear
              </button>
            )}
          </div>

          {open && suggestions.length > 0 && (
            <div
              id="plugin-tag-listbox"
              role="listbox"
              className="absolute z-20 mt-1 w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 shadow-lg overflow-hidden"
            >
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-black/5 dark:border-white/5">
                Filter by tag
              </div>
              {suggestions.map((c, i) => (
                <button
                  key={c}
                  id={`tag-opt-${i}`}
                  role="option"
                  aria-selected={i === highlight}
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
      <p className="sr-only" role="status" aria-live="polite">
        {filtered.length} plugin{filtered.length === 1 ? "" : "s"} shown
      </p>
      <div className="mt-10 grid md:grid-cols-2 gap-4">
        {filtered.map((p, i) => (
          <PluginCard key={p.slug} plugin={p} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-12 text-center text-neutral-700 dark:text-neutral-400">
            No plugins match that filter. Clear it and try a plainer word.
          </div>
        )}
      </div>

      {/* Coming soon teaser */}
      {comingSoonCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4 }}
          className="mt-10 rounded-2xl border border-dashed border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-8 text-center"
        >
          <Chip className="mb-3">Coming soon</Chip>
          <p className="text-neutral-700 dark:text-neutral-400 text-sm leading-relaxed max-w-lg mx-auto">
            {comingSoonCount} more plugins are in development. The MCP
            underneath already does the work — each new plugin simply wraps
            another job up, so there's nothing new to set up when they land.
          </p>
        </motion.div>
      )}
    </div>
  );
}
