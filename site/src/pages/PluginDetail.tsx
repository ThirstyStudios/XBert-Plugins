import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  Clock,
  Info,
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
import { Chip } from "../components/Chip";
import { InstallBlock } from "../components/InstallBlock";
import { installSnippet } from "../lib/install-snippet";
import { usePageMeta } from "../lib/seo";
import { pluginMeta } from "../lib/route-meta";

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

  usePageMeta(pluginMeta(slug));

  if (!p) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24">
        <p className="text-neutral-700 dark:text-neutral-300">Plugin not found.</p>
        <Link to="/plugins" className="text-xbert-indigo dark:text-xbert-cyan hover:underline">
          ← Back to browse
        </Link>
      </div>
    );
  }

  const x = p["x-xbert"];
  const related = plugins.filter((o) => o.slug !== p.slug).slice(0, 2);
  // Plugins with no slash command are shared supporting layers — they render
  // another plugin's output rather than calling the MCP themselves.
  const runsOnMcp = x.includes.commands > 0;

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
          <ArrowLeft size={14} aria-hidden /> All plugins
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
                className="text-[10.5px] uppercase tracking-wider px-2 py-1 rounded-full bg-xbert-indigo/[0.10] text-xbert-indigo border border-xbert-indigo/25 dark:bg-xbert-cyan/[0.08] dark:text-xbert-cyan dark:border-xbert-cyan/20"
              >
                {a}
              </span>
            ))}
            <Chip>{runsOnMcp ? "Runs on the XBert MCP" : "Shared by the XBert plugins"}</Chip>
            <Chip>Claude Code or Claude Desktop</Chip>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            {x.displayName}
          </h1>
          <p className="mt-3 text-lg md:text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl">
            {x.tagline}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
            {p.lastUpdated && (
              <span>
                Updated{" "}
                {new Date(p.lastUpdated).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
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
              className={`text-${i === 0 ? "lg" : "base"} leading-relaxed text-neutral-800 dark:text-neutral-200`}
            >
              {para}
            </motion.p>
          ))}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4 }}
            className="text-sm italic text-neutral-600 dark:text-neutral-400"
          >
            Output lands as a working paper in your project folder — review it
            before anything goes to a client.
          </motion.p>
        </section>

        {/* USE CASES */}
        {x.useCases && x.useCases.length > 0 && (
          <section className="mt-20">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                What you can do with it
              </h2>
              <span className="text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
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
                  className="group relative overflow-hidden rounded-2xl border border-black/10 bg-black/[0.02] hover:border-black/20 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20 p-5 transition"
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at 0% 0%, rgba(59,130,246,0.06), transparent 50%)",
                    }}
                  />
                  <h3 className="relative text-base font-semibold text-neutral-900 dark:text-white">
                    {u.title}
                  </h3>
                  <p className="relative mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
                    {u.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* BENEFITS */}
        {x.benefits && x.benefits.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              How it changes your work
            </h2>
            <p className="mt-2 text-neutral-700 dark:text-neutral-400 max-w-2xl">
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
                    className="rounded-2xl border border-black/10 bg-gradient-to-b from-black/[0.03] to-black/[0.01] dark:border-white/10 dark:from-white/[0.04] dark:to-white/[0.01] p-6"
                  >
                    <div
                      className="inline-flex items-center justify-center size-10 rounded-xl mb-4 border border-black/10 dark:border-white/10"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(59,130,246,0.16), rgba(6,182,212,0.10))",
                      }}
                    >
                      <Icon size={18} aria-hidden className="text-xbert-indigo dark:text-xbert-cyan" />
                    </div>
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
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
            <div className="flex items-start gap-3 rounded-xl border border-xbert-indigo/25 bg-xbert-indigo/[0.06] dark:border-xbert-cyan/20 dark:bg-xbert-cyan/[0.05] px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 max-w-2xl mb-6">
              <Info size={16} aria-hidden className="mt-0.5 text-xbert-indigo dark:text-xbert-cyan flex-shrink-0" />
              <div>
                <span className="font-medium text-neutral-900 dark:text-white">First install this plugin</span>{" "}
                in Claude Code or Claude Desktop — see{" "}
                <a href="#install" className="text-xbert-indigo dark:text-xbert-cyan hover:underline">Install</a> below.
                {runsOnMcp
                  ? " The slash command & its skills load automatically once installed. Then:"
                  : " Its skills load automatically once installed. Then:"}
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              How it works
            </h2>
            <p className="mt-2 text-neutral-700 dark:text-neutral-400">
              The flow from start to finish — under your control at every
              step.
            </p>
            <ol className="relative mt-10 space-y-5 pl-12 max-w-2xl">
              {/* Vertical track */}
              <span
                aria-hidden
                className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-black/15 via-black/8 to-transparent dark:from-white/15 dark:via-white/8"
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
                    className="absolute -left-12 top-0 inline-flex items-center justify-center size-9 rounded-full border border-black/15 bg-black/[0.04] text-xbert-indigo dark:border-white/15 dark:bg-white/[0.04] dark:text-xbert-cyan text-[11px] font-mono font-semibold"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed pt-1">
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
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3 text-neutral-800 dark:text-neutral-200"
                >
                  <Check
                    size={16}
                    aria-hidden
                    className="mt-1 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
                  />
                  <span>{pr}</span>
                </motion.li>
              ))}
            </ul>
          </section>
        )}

        {/* INSTALL */}
        <section id="install" className="mt-20 max-w-3xl scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Install this plugin
          </h2>
          <div className="mt-6">
            <InstallBlock snippet={installSnippet([p.slug])} showSkipHint={false} />
          </div>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Add the marketplace once, then install any plugin from it.
          </p>
        </section>

        {/* FOOTER NOTE */}
        <div className="mt-20 border-t border-black/10 dark:border-white/10 pt-6 text-xs text-neutral-600 dark:text-neutral-400">
          Plugins add slash commands and skills on top of the XBert MCP — same
          data, same permissions, same audit trail as asking directly.
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-4">
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
