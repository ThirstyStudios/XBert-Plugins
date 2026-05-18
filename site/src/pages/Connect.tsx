import { Link } from "react-router";
import { motion } from "motion/react";
import { Plug, ArrowRight, MessageSquare, FileText, Receipt, Wallet } from "lucide-react";
import { plugins } from "../lib/catalog";
import { installSnippet } from "../lib/install-snippet";
import { InstallSteps } from "../components/InstallSteps";

export default function ConnectPage() {
  const examplePrompts = [
    {
      icon: <Receipt size={14} className="text-blue-500 dark:text-blue-400" />,
      text: "Show me aged receivables for this client",
    },
    {
      icon: <MessageSquare size={14} className="text-emerald-500 dark:text-emerald-400" />,
      text: "Review the latest XBert notifications",
    },
    {
      icon: <FileText size={14} className="text-violet-500 dark:text-violet-400" />,
      text: "Generate a profit and loss report",
    },
    {
      icon: <Wallet size={14} className="text-amber-500 dark:text-amber-400" />,
      text: "Check bank reconciliation status",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/5 px-3 py-1 text-xs text-neutral-700 dark:text-neutral-300 mb-6">
          <Plug size={12} className="text-blue-500 dark:text-blue-400" />
          XBert MCP
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl">
          Connect XBert to Claude.
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
          XBert exposes 70+ accounting tools — exception review, reconciliation,
          BI, client comms — through the Model Context Protocol. Add the connector
          in Claude and your books become something Claude can actually work on.
          Already in Claude Code? Install the XBert plugins for slash commands
          and skills built on the same MCP.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-12 max-w-3xl"
      >
        <InstallSteps
          slugs={plugins.map((p) => p.slug)}
          cliSnippet={installSnippet(plugins.map((p) => p.slug))}
          searchHint="XBert"
        />
      </motion.div>

      {/* What you can do */}
      <section className="mt-20 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          What you can ask Claude once you're connected
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          A handful of starter prompts. Claude picks the right XBert tools, runs
          them, and explains the result.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          {examplePrompts.map((p, i) => (
            <motion.div
              key={p.text}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: 0.04 * i }}
              className="rounded-xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-4 flex items-start gap-3"
            >
              <span className="mt-0.5 inline-flex items-center justify-center size-7 rounded-md border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.06]">
                {p.icon}
              </span>
              <span className="text-sm text-neutral-800 dark:text-neutral-200 font-mono leading-relaxed">
                "{p.text}"
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Plugins CTA */}
      <section className="mt-20 max-w-4xl">
        <div className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              Working in Claude Code?
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
              The XBert plugins ship slash commands and skills on top of the
              MCP — preset prompts, calibrated methodology, and audit-friendly
              workpapers for end-to-end practice workflows.
            </p>
          </div>
          <Link
            to="/plugins"
            className="inline-flex items-center gap-2 rounded-md border border-black/15 bg-white/70 hover:bg-white text-neutral-900 dark:border-white/15 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-white px-4 py-2 text-sm font-medium transition shrink-0"
          >
            Browse plugins
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
