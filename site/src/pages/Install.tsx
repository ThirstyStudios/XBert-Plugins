import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { Check, Terminal, Info } from "lucide-react";
import { plugins } from "../lib/catalog";
import { installSnippet } from "../lib/install-snippet";
import { InstallBlock } from "../components/InstallBlock";

export default function InstallPage() {
  const [search, setSearch] = useSearchParams();
  const initial = useMemo(() => {
    const raw = search.get("p");
    if (!raw) return new Set<string>();
    return new Set(raw.split(",").filter(Boolean));
  }, [search]);

  const [selected, setSelected] = useState<Set<string>>(initial);

  // Keep URL in sync (?p=slug1,slug2)
  useEffect(() => {
    const slugs = Array.from(selected);
    if (slugs.length === 0) {
      if (search.get("p")) {
        const next = new URLSearchParams(search);
        next.delete("p");
        setSearch(next, { replace: true });
      }
      return;
    }
    const next = new URLSearchParams(search);
    next.set("p", slugs.join(","));
    setSearch(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const snippet =
    selected.size === 0
      ? `/plugin marketplace add ThirstyStudios/XBert-Plugins\n# Tick plugins on the right to add /plugin install lines here.`
      : installSnippet(Array.from(selected));

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/5 px-3 py-1 text-xs text-neutral-700 dark:text-neutral-300 mb-6">
          <Terminal size={12} className="text-blue-500 dark:text-blue-400" />
          For Claude Code
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Build a multi-plugin install snippet.
        </h1>
        <p className="mt-3 text-neutral-700 dark:text-neutral-400 max-w-2xl">
          Tick the XBert plugins you want. The install snippet on the left
          updates live, and the URL stays in sync so you can share or bookmark a
          bundle. Paste the result into Claude Code.
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-400/20 bg-blue-400/[0.06] dark:border-blue-400/15 dark:bg-blue-400/[0.04] px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 max-w-2xl">
          <Info size={16} className="mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
          <div>
            On <span className="font-medium text-neutral-900 dark:text-white">Claude (claude.ai or Desktop)</span>,
            use the custom MCP connector instead of this CLI bundle.{" "}
            <Link to="/connect" className="text-blue-500 dark:text-blue-400 hover:underline">
              See connect steps →
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="mt-12 grid md:grid-cols-2 gap-8">
        {/* Snippet column - sticky on desktop */}
        <div className="md:sticky md:top-24 self-start">
          <div className="text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-500 mb-3">
            Your install snippet
          </div>
          <InstallBlock snippet={snippet} />
          <div className="mt-4 text-xs text-neutral-600 dark:text-neutral-500">
            {selected.size} plugin{selected.size === 1 ? "" : "s"} selected
            {selected.size > 0 && (
              <button
                type="button"
                className="ml-3 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white underline"
                onClick={() => setSelected(new Set())}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Plugin checklist */}
        <div>
          <div className="text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-500 mb-3">
            Available plugins
          </div>
          <div className="space-y-2">
            {plugins.map((p) => {
              const isSel = selected.has(p.slug);
              const x = p["x-xbert"];
              return (
                <motion.button
                  key={p.slug}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => toggle(p.slug)}
                  className={`w-full text-left rounded-xl border p-4 transition flex items-start gap-3 ${
                    isSel
                      ? "border-blue-400/40 bg-blue-400/[0.08] dark:bg-blue-400/[0.06]"
                      : "border-black/10 bg-black/[0.02] hover:bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className={`mt-0.5 inline-flex items-center justify-center size-5 rounded border transition ${
                      isSel
                        ? "bg-blue-500 border-blue-500 text-white dark:bg-blue-400 dark:border-blue-400 dark:text-black"
                        : "border-black/20 dark:border-white/20"
                    }`}
                  >
                    {isSel && <Check size={12} strokeWidth={3} />}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{x.displayName}</div>
                    <div className="text-sm text-neutral-700 dark:text-neutral-400 mt-0.5">
                      {x.tagline}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {x.categories.map((c) => (
                        <span
                          key={c}
                          className="text-[10.5px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-black/[0.05] text-neutral-700 border border-black/5 dark:bg-white/[0.06] dark:text-neutral-300 dark:border-white/5"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
