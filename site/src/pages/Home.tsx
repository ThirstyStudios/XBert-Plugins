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
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/5 px-3 py-1 text-xs text-neutral-700 dark:text-neutral-300 mb-8"
          >
            <Sparkles size={12} className="text-blue-500 dark:text-blue-400" />
            New: 25 plugins for your accounting practice
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] max-w-4xl"
          >
            XBert turns your accounting practice into an{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #2563eb 0%, #0891b2 60%, #7c3aed 100%)",
              }}
            >
              AI-ready workspace
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-7 text-lg md:text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl leading-relaxed"
          >
            XBert exposes 200+ accounting tools — exception review,
            reconciliation, client comms, BI — through the Model Context
            Protocol and 25 ready-made plugins. Connect it to any MCP-aware AI
            assistant in a minute, and your books become something the
            assistant can actually work on.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/connect"
              className="group inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/10 ring-1 ring-black/10 dark:ring-white/40 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition"
            >
              Connect XBert to your AI
              <ArrowRight
                size={16}
                strokeWidth={2.5}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              to="/plugins"
              className="inline-flex items-center gap-2 rounded-md border border-black/15 bg-black/[0.03] text-neutral-900 hover:bg-black/[0.06] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] dark:hover:border-white/25 px-5 py-2.5 text-sm font-medium transition"
            >
              Browse plugins
            </Link>
            <a
              href="#install"
              className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition px-2 py-2.5"
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
              Connect XBert
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
              icon: <Zap size={18} className="text-blue-500 dark:text-blue-400" />,
              title: "200+ tools, one MCP",
              body: "XBert's MCP gives your AI assistant direct access to your ledgers, notifications, and BI — no glue code, no copy-paste between apps.",
            },
            {
              icon: <ShieldCheck size={18} className="text-emerald-500 dark:text-emerald-400" />,
              title: "Audit-trail first",
              body: "Every action is proposed, never auto-applied. OAuth 2.1 with PKCE — credentials stay with XBert. Markdown workpapers fall out the end.",
            },
            {
              icon: <FileSearch size={18} className="text-violet-500 dark:text-violet-400" />,
              title: "Skills, not prompts",
              body: "The 25 plugins layer slash commands and calibrated skills on top of the same MCP. Your AI assistant follows your firm's rules, not a generic LLM blob.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6"
            >
              <div className="inline-flex items-center justify-center size-9 rounded-lg border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.06] mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
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
              Plugins powered by XBert
            </h2>
            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-400">
              {plugins.length} XBert-powered plugin{plugins.length === 1 ? "" : "s"} grouped by workflow.
            </p>
          </div>
          <Link
            to="/plugins"
            className="text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white inline-flex items-center gap-1 group"
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
              title: "Add the XBert MCP to your AI",
              body: (
                <>
                  In your MCP-aware AI assistant, open <span className="font-mono text-neutral-900 dark:text-neutral-100">Settings → Integrations</span> and add a custom MCP connector pointing at <span className="font-mono text-neutral-900 dark:text-neutral-100">https://mcp-gateway.xbert.io/mcp</span>. Sign in with XBert.
                </>
              ),
            },
            {
              n: "02",
              title: "Ask the assistant to do practice work",
              body: "The assistant gets 200+ XBert tools — exception review, reconciliation, BI queries — and runs them with full auth and an audit trail.",
            },
            {
              n: "03",
              title: "Install plugins for preset workflows",
              body: "Want slash commands and skills built on the MCP? Install the XBert plugins (works in Claude Code and Claude Desktop). Same data, packaged into preset workflows.",
            },
          ].map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6"
            >
              <div className="text-xs font-mono text-blue-500 dark:text-blue-400">{s.n}</div>
              <h3 className="mt-2 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
                {s.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </section>
    </div>
  );
}
