import { Link } from "react-router";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Zap, ShieldCheck, FileSearch } from "lucide-react";
import { plugins } from "../lib/catalog";
import { PluginCard } from "../components/PluginCard";
import { InstallSteps } from "../components/InstallSteps";
import { installSnippet } from "../lib/install-snippet";

export default function HomePage() {
  const featured = plugins.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid pointer-events-none" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300 mb-8"
          >
            <Sparkles size={12} className="text-blue-400" />
            New: official Claude Code marketplace for accounting practices
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] max-w-4xl"
          >
            Claude Code plugins that{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #60a5fa 0%, #22d3ee 60%, #a78bfa 100%)",
              }}
            >
              close the books
            </span>{" "}
            faster.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-7 text-lg md:text-xl text-neutral-300 max-w-2xl leading-relaxed"
          >
            Drop XBert's exception review, reconciliation and client-comms
            agents into Claude Code. One command per workflow, a full audit
            trail, no surprises.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/plugins"
              style={{ color: "#0a0a0a" }}
              className="group inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/10 ring-1 ring-white/40 hover:bg-neutral-100 transition"
            >
              Browse plugins
              <ArrowRight
                size={16}
                strokeWidth={2.5}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#install"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.04] text-white px-5 py-2.5 text-sm font-medium hover:bg-white/[0.08] hover:border-white/25 transition"
            >
              How to install
            </a>
          </motion.div>

          {/* Quick install */}
          <motion.div
            id="install"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-14 max-w-2xl scroll-mt-24"
          >
            <div className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
              Install the full set
            </div>
            <InstallSteps
              slugs={plugins.map((p) => p.slug)}
              cliSnippet={installSnippet(plugins.map((p) => p.slug))}
              searchHint="XBert"
            />
          </motion.div>
        </div>
      </section>

      {/* WHY */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Built for practice work, not just demos.
        </h2>
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {[
            {
              icon: <Zap size={18} className="text-blue-400" />,
              title: "One command per workflow",
              body: "Slash commands wrap the whole job: exception review, reconciliation, client comms. No prompt-engineering.",
            },
            {
              icon: <ShieldCheck size={18} className="text-emerald-400" />,
              title: "Audit-trail first",
              body: "Every action is proposed, never auto-applied. Markdown workpapers fall out the end, ready for review.",
            },
            {
              icon: <FileSearch size={18} className="text-violet-400" />,
              title: "Skills, not prompts",
              body: "Each plugin ships skills with calibrated methodology. Claude follows your firm's rules, not a generic LLM blob.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="inline-flex items-center justify-center size-9 rounded-lg bg-white/[0.06] border border-white/10 mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PLUGINS */}
      <section className="max-w-6xl mx-auto px-6 pt-4 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Latest plugins
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              {plugins.length} plugin{plugins.length === 1 ? "" : "s"} available.
            </p>
          </div>
          <Link
            to="/plugins"
            className="text-sm text-neutral-300 hover:text-white inline-flex items-center gap-1 group"
          >
            See all{" "}
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {featured.map((p, i) => (
            <PluginCard key={p.slug} plugin={p} index={i} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          How it works
        </h2>
        <ol className="mt-10 grid md:grid-cols-3 gap-4">
          {[
            {
              n: "01",
              title: "Open Claude Desktop",
              body: "Head into the Cowork tab, then Customize. The plugin marketplace lives there.",
            },
            {
              n: "02",
              title: "Install the plugins you want",
              body: "Search for XBert (or paste the GitHub repo) and click Install on each plugin. Authorize the permissions prompt.",
            },
            {
              n: "03",
              title: "Use the commands",
              body: "Type /review, /reconcile, or whichever slash command the plugin ships. Workflows fire end-to-end.",
            },
          ].map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="text-xs font-mono text-blue-400">{s.n}</div>
              <h3 className="mt-2 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                {s.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </section>
    </div>
  );
}
