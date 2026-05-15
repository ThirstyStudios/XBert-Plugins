import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { getPlugin, plugins } from "../lib/catalog";
import { installSnippet } from "../lib/install-snippet";
import { InstallSteps } from "../components/InstallSteps";
import { PluginCard } from "../components/PluginCard";

export default function PluginDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const p = getPlugin(slug);

  if (!p) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24">
        <p className="text-neutral-700 dark:text-neutral-300">Plugin not found.</p>
        <Link to="/plugins" className="text-blue-500 dark:text-blue-400 hover:underline">
          ← Back to browse
        </Link>
      </div>
    );
  }

  const x = p["x-xbert"];
  const related = plugins.filter((o) => o.slug !== p.slug).slice(0, 2);

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          to="/plugins"
          className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
        >
          <ArrowLeft size={14} /> All plugins
        </Link>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {x.categories.map((c) => (
              <span
                key={c}
                className="text-[10.5px] uppercase tracking-wider px-2 py-1 rounded-full bg-black/[0.05] text-neutral-700 border border-black/5 dark:bg-white/[0.06] dark:text-neutral-300 dark:border-white/5"
              >
                {c}
              </span>
            ))}
            {x.audience.map((a) => (
              <span
                key={a}
                className="text-[10.5px] uppercase tracking-wider px-2 py-1 rounded-full bg-blue-400/[0.10] text-blue-700 border border-blue-400/20 dark:bg-blue-400/[0.08] dark:text-blue-300 dark:border-blue-400/15"
              >
                {a}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            {x.displayName}
          </h1>
          <p className="mt-3 text-lg text-neutral-700 dark:text-neutral-300">{x.tagline}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-500 font-mono">
            <span>v{p.version}</span>
            <span>
              {x.includes.skills} skill{x.includes.skills === 1 ? "" : "s"}
            </span>
            <span>
              {x.includes.commands} command{x.includes.commands === 1 ? "" : "s"}
            </span>
            {x.includes.mcpTools > 0 && (
              <span>
                {x.includes.mcpTools} MCP tool{x.includes.mcpTools === 1 ? "" : "s"}
              </span>
            )}
            <span>by {p.author.name}</span>
          </div>
        </header>

        {/* Install */}
        <section className="mt-10">
          <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
            Install
          </h2>
          <InstallSteps
            slugs={[p.slug]}
            cliSnippet={installSnippet([p.slug])}
            searchHint={x.displayName}
          />
        </section>

        {/* Description */}
        <section className="mt-12">
          <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
            What it does
          </h2>
          <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line">
            {p.description}
          </p>
        </section>

        {/* Prerequisites */}
        {x.prerequisites.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
              Prerequisites
            </h2>
            <ul className="space-y-2">
              {x.prerequisites.map((pr) => (
                <li
                  key={pr}
                  className="flex items-start gap-2 text-neutral-800 dark:text-neutral-200"
                >
                  <Check
                    size={16}
                    className="mt-1 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
                  />
                  <span>{pr}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* README */}
        {p.readme && (
          <section className="mt-10">
            <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
              Documentation
            </h2>
            <pre className="rounded-2xl border border-black/10 bg-neutral-50 dark:border-white/10 dark:bg-black/40 p-6 text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap font-sans leading-relaxed overflow-x-auto">
              {p.readme}
            </pre>
          </section>
        )}

        {/* Links */}
        <section className="mt-10 flex flex-wrap gap-4 text-sm">
          {p.homepage && (
            <a
              href={p.homepage}
              className="inline-flex items-center gap-1 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              Homepage <ExternalLink size={13} />
            </a>
          )}
          <a
            href={`https://github.com/ThirstyStudios/XBert-Plugins/tree/main/plugins/${p.slug}`}
            className="inline-flex items-center gap-1 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          >
            View source on GitHub <ExternalLink size={13} />
          </a>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
              Other plugins
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {related.map((r, i) => (
                <PluginCard key={r.slug} plugin={r} index={i} />
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </article>
  );
}
