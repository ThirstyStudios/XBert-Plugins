import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Clock,
  Search,
  ShieldCheck,
  Zap,
  FileSearch,
  GitBranch,
  Sparkles,
  Users,
  Scale,
  TrendingUp,
  PhoneCall,
  BarChart3,
  Wallet,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { getPlugin, plugins } from "../lib/catalog";
import { PluginCard } from "../components/PluginCard";

// Map JSON icon strings -> lucide components so manifests stay declarative.
const ICONS: Record<string, LucideIcon> = {
  Clock,
  Search,
  ShieldCheck,
  Zap,
  FileSearch,
  GitBranch,
  Sparkles,
  Users,
  Scale,
  TrendingUp,
  PhoneCall,
  BarChart3,
  Wallet,
  FileText,
};

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

  const paragraphs = (x.longDescription ?? p.description)
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <article className="max-w-4xl mx-auto px-6 py-16">
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

        {/* HEADER */}
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
<<<<<<< HEAD
          <p className="mt-3 text-lg md:text-xl text-neutral-300 max-w-2xl">
            {x.tagline}
          </p>
=======
          <p className="mt-3 text-lg text-neutral-700 dark:text-neutral-300">{x.tagline}</p>
>>>>>>> 51776bc7f2d180cd943cccdeaae92514fbd81ee6
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

        {/* LONG DESCRIPTION */}
        <section className="mt-12 space-y-5 max-w-3xl">
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className={`text-${i === 0 ? "lg" : "base"} leading-relaxed text-neutral-200`}
            >
              {para}
            </motion.p>
          ))}
        </section>

<<<<<<< HEAD
        {/* USE CASES */}
        {x.useCases && x.useCases.length > 0 && (
          <section className="mt-20">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                What you can do with it
              </h2>
              <span className="text-xs uppercase tracking-wider text-neutral-500">
                {x.useCases.length} use cases
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {x.useCases.map((u, i) => (
                <motion.div
                  key={u.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.35, delay: 0.04 * i }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-white/20 transition"
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at 0% 0%, rgba(59,130,246,0.06), transparent 50%)",
                    }}
                  />
                  <h3 className="relative text-base font-semibold text-white">
                    {u.title}
                  </h3>
                  <p className="relative mt-2 text-sm text-neutral-400 leading-relaxed">
                    {u.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}
=======
        {/* Description */}
        <section className="mt-12">
          <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
            What it does
          </h2>
          <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line">
            {p.description}
          </p>
        </section>
>>>>>>> 51776bc7f2d180cd943cccdeaae92514fbd81ee6

        {/* BENEFITS */}
        {x.benefits && x.benefits.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              How it changes your work
            </h2>
            <p className="mt-2 text-neutral-400 max-w-2xl">
              What XBert users actually get back when they bring this into their
              practice.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-3">
              {x.benefits.map((b, i) => {
                const Icon = ICONS[b.icon] ?? Sparkles;
                return (
                  <motion.div
                    key={b.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.4, delay: 0.06 * i }}
                    className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6"
                  >
                    <div
                      className="inline-flex items-center justify-center size-10 rounded-xl mb-4 border border-white/10"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(59,130,246,0.16), rgba(6,182,212,0.10))",
                      }}
                    >
                      <Icon size={18} className="text-blue-300" />
                    </div>
                    <h3 className="text-base font-semibold text-white">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                      {b.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* WORKFLOW */}
        {x.workflow && x.workflow.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              How it works
            </h2>
            <p className="mt-2 text-neutral-400">
              The flow when you run the command — under your control at every
              step.
            </p>
            <ol className="relative mt-10 space-y-5 pl-12 max-w-2xl">
              {/* Vertical track */}
              <span
                aria-hidden
                className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-white/15 via-white/8 to-transparent"
              />
              {x.workflow.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className="absolute -left-12 top-0 inline-flex items-center justify-center size-9 rounded-full border border-white/15 bg-white/[0.04] text-[11px] font-mono text-blue-300 font-semibold"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-neutral-200 leading-relaxed pt-1">
                    {step}
                  </p>
                </motion.li>
              ))}
            </ol>
          </section>
        )}

        {/* PREREQUISITES */}
        {x.prerequisites.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Prerequisites
            </h2>
            <ul className="mt-6 space-y-3 max-w-2xl">
              {x.prerequisites.map((pr) => (
                <motion.li
                  key={pr}
<<<<<<< HEAD
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3 text-neutral-200"
=======
                  className="flex items-start gap-2 text-neutral-800 dark:text-neutral-200"
>>>>>>> 51776bc7f2d180cd943cccdeaae92514fbd81ee6
                >
                  <Check
                    size={16}
                    className="mt-1 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
                  />
                  <span>{pr}</span>
                </motion.li>
              ))}
            </ul>
          </section>
        )}

<<<<<<< HEAD
        {/* COMPACT INSTALL CTA */}
        <section className="mt-20 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 md:p-10 max-w-3xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">
                Ready to add {x.displayName} to Claude?
              </h3>
              <p className="mt-2 text-sm text-neutral-400 max-w-md">
                Add the XBert marketplace once, then install just this plugin
                from the Personal tab.
              </p>
            </div>
            <Link
              to="/#install"
              style={{ color: "#0a0a0a" }}
              className="group inline-flex items-center gap-2 self-start md:self-auto rounded-md bg-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/10 ring-1 ring-white/40 hover:bg-neutral-100 transition flex-shrink-0"
=======
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
>>>>>>> 51776bc7f2d180cd943cccdeaae92514fbd81ee6
            >
              See install steps
              <ArrowRight
                size={16}
                strokeWidth={2.5}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </section>

        {/* SOURCE LINKS */}
        <section className="mt-12 flex flex-wrap gap-5 text-sm">
          <a
            href={`https://github.com/ThirstyStudios/XBert-Plugins/tree/main/plugins/${p.slug}`}
<<<<<<< HEAD
            className="inline-flex items-center gap-1 text-neutral-300 hover:text-white transition"
=======
            className="inline-flex items-center gap-1 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
>>>>>>> 51776bc7f2d180cd943cccdeaae92514fbd81ee6
          >
            View source on GitHub <ExternalLink size={13} />
          </a>
          <a
            href="mailto:hello@xbert.io"
            className="inline-flex items-center gap-1 text-neutral-300 hover:text-white transition"
          >
            Contact XBert <ExternalLink size={13} />
          </a>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-24">
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
