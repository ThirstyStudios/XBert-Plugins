import { Link } from "react-router";
import { motion } from "motion/react";
import {
  GitFork,
  MessageSquare,
  LayoutDashboard,
  ShieldCheck,
  Users,
  ArrowRight,
  ExternalLink,
  FileText,
  Network,
} from "lucide-react";
import { plugins } from "../lib/catalog";
import { usePageMeta } from "../lib/seo";
import { ROUTE_META } from "../lib/route-meta";

type DualityBullet = { label: string; value: string };

type DualityCard = {
  eyebrow: string;
  eyebrowIcon: React.ReactNode;
  title: string;
  body: string;
  bullets: DualityBullet[];
};

type MappingRow = {
  plugin: string;
  chat: string;
  product: string;
};

type RationaleCard = {
  icon: React.ReactNode;
  title: string;
  body: string;
};

export default function InsideXBertPage() {
  usePageMeta(ROUTE_META.insideXBert);

  const dualityCards: DualityCard[] = [
    {
      eyebrow: "Plugins surface",
      eyebrowIcon: (
        <MessageSquare size={12} aria-hidden className="text-xbert-indigo dark:text-xbert-cyan" />
      ),
      title: "Install once. Slash-command everything.",
      body: "Add the XBert MCP and the plugins. Slash commands like /anomaly-review, /config-audit and /workflow-review run the same workflow XBert runs internally, with audit-ready output dropping into your file system or back into the chat.",
      bullets: [
        {
          label: "Best for",
          value:
            "ad-hoc requests, exploratory questions, batch tasks across many clients",
        },
        { label: "Lives in", value: "Claude Code or Claude Desktop" },
        { label: "Connects via", value: "MCP" },
        {
          label: "What you get",
          value: `the full XBert tool catalogue (200 tools) + ${plugins.length} calibrated plugins`,
        },
      ],
    },
    {
      eyebrow: "Product surface",
      eyebrowIcon: (
        <LayoutDashboard
          size={12}
          aria-hidden
          className="text-violet-500 dark:text-violet-400"
        />
      ),
      title: "Open XBert. See the same workflows as first-class screens.",
      body: "Every plugin maps to a feature inside the XBert app — Review module, Workflow, Capacity, Practice settings. Same data, same rules, persistent UI.",
      bullets: [
        {
          label: "Best for",
          value:
            "daily operations, team-shared visibility, persistent dashboards",
        },
        {
          label: "Lives in",
          value: "the XBert web app (browser)",
        },
        {
          label: "Connects via",
          value:
            "native integration with Xero, MYOB, QuickBooks Online, Xero Practice Manager",
        },
        {
          label: "What you get",
          value:
            "workflow templates, schedules, notifications, the Review module, audit history, role-based assignment",
        },
      ],
    },
  ];

  const mappingRows: MappingRow[] = [
    {
      plugin: "/anomaly-review",
      chat: "Ranked list of every anomaly XBert firing, verified (Word doc)",
      product: "Review module → Exception items",
    },
    {
      plugin: "/config-audit",
      chat: "XBert rule consistency across the book (Word doc)",
      product: "Connect → XBert configuration",
    },
    {
      plugin: "/workflow-review",
      chat: "Structural workflow audit (Word doc)",
      product: "Practice → Workflow review report",
    },
  ];

  const rationaleCards: RationaleCard[] = [
    {
      icon: <Users size={18} aria-hidden className="text-xbert-indigo dark:text-xbert-cyan" />,
      title: "Meet your team where they are",
      body: "Some of your team lives in chat; some live in the app. XBert serves both without making either compromise.",
    },
    {
      icon: (
        <ShieldCheck
          size={18}
          aria-hidden
          className="text-emerald-500 dark:text-emerald-400"
        />
      ),
      title: "Same audit trail, two entry points",
      body: "Both surfaces write back to the same XBert audit log. A plugin run from chat is indistinguishable from an in-app run after the fact — same approvals, same artefacts, same compliance.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/5 px-3 py-1 text-xs text-neutral-700 dark:text-neutral-300 mb-8">
          <GitFork size={12} aria-hidden className="text-xbert-indigo dark:text-xbert-cyan" />
          Two surfaces, one product
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] max-w-4xl"
      >
        These plugins are part of XBert.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-6 text-lg md:text-xl text-neutral-700 dark:text-neutral-300 max-w-3xl leading-relaxed"
      >
        Every workflow here also lives as a screen inside the XBert app. Same
        data, same rules, same audit trail — two ways in.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-10 flex flex-wrap items-center gap-3"
      >
        <a
          href="https://xbert.io"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-xbert-indigo/20 ring-1 ring-black/10 dark:ring-white/40 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition"
        >
          Open xbert.io
          <ExternalLink size={14} strokeWidth={2.5} aria-hidden />
        </a>
        <Link
          to="/plugins"
          className="inline-flex items-center gap-2 rounded-md border border-black/15 bg-black/[0.03] text-neutral-900 hover:bg-black/[0.06] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] dark:hover:border-white/25 px-5 py-2.5 text-sm font-medium transition"
        >
          Browse plugins
        </Link>
      </motion.div>

      {/* DUALITY: side-by-side */}
      <section className="mt-20">
        {/* Owning heading: without it the page skips h1 -> h3 and the two
            surface cards are parented to nothing. */}
        <h2 className="sr-only">One product, two surfaces</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {dualityCards.map((card, i) => (
            <motion.div
              key={card.eyebrow}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: 0.05 * i }}
              className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6 md:p-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.06] px-3 py-1 text-xs text-neutral-700 dark:text-neutral-300 mb-5">
                {card.eyebrowIcon}
                {card.eyebrow}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
                {card.title}
              </h3>
              <p className="mt-3 text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {card.body}
              </p>
              <dl className="mt-6 space-y-3 border-t border-black/10 dark:border-white/10 pt-5">
                {card.bullets.map((b) => (
                  <div
                    key={b.label}
                    className="grid grid-cols-[8rem_1fr] gap-3 text-sm"
                  >
                    <dt className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 pt-0.5">
                      {b.label}
                    </dt>
                    <dd className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
                      {b.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHERE YOUR ASSISTANT PULLS AHEAD */}
      <section className="mt-20">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Where your assistant pulls ahead
        </h2>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 max-w-3xl leading-relaxed">
          XBert is built to surface the right information at the moment
          you&apos;re doing the work. Your assistant — running the XBert
          plugins — takes that further: arbitrary output formats, and
          everything else in your stack pulled into a single thread.
        </p>
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {[
            {
              icon: (
                <FileText
                  size={18}
                  aria-hidden
                  className="text-xbert-indigo dark:text-xbert-cyan"
                />
              ),
              title: "Any document, any format",
              body: "XBert shows you the answer; your assistant shapes it into whatever you need. Board pack PDF, client email, Word brief, exported workpaper, plain summary — your assistant composes the artefact from live XBert data, then drops it back into your file system or the chat.",
            },
            {
              icon: (
                <Network
                  size={18}
                  aria-hidden
                  className="text-violet-500 dark:text-violet-400"
                />
              ),
              title: "Your whole stack, one thread",
              body: "Your assistant isn't just XBert. Through MCP it reaches your other connected systems — ledgers, mailbox, calendars, document store, and whatever else your firm runs. XBert is the accounting brain; your assistant brings the wider ecosystem into the same conversation.",
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: 0.05 * i }}
              className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6 md:p-8"
            >
              <div className="inline-flex items-center justify-center size-9 rounded-lg border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.06] mb-4">
                {c.icon}
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                {c.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {c.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MAPPING TABLE */}
      <section className="mt-20">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Every plugin maps to a feature in XBert
        </h2>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 max-w-2xl">
          How each published slash command lines up with screens in the
          product. The data, rules, and audit trail are the same either way.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45 }}
          className="mt-8 rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                  <th scope="col" className="text-left px-5 py-3 text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-medium">
                    Plugin
                  </th>
                  <th scope="col" className="text-left px-5 py-3 text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-medium">
                    What it does in chat
                  </th>
                  <th scope="col" className="text-left px-5 py-3 text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-medium">
                    Where it lives in XBert
                  </th>
                </tr>
              </thead>
              <tbody>
                {mappingRows.map((row, i) => (
                  <tr
                    key={row.plugin}
                    className={
                      i === mappingRows.length - 1
                        ? ""
                        : "border-b border-black/5 dark:border-white/5"
                    }
                  >
                    <td className="px-5 py-4 align-top">
                      <span className="font-mono text-sm text-neutral-900 dark:text-neutral-100">
                        {row.plugin}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {row.chat}
                    </td>
                    <td className="px-5 py-4 align-top text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {row.product}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* WHY BOTH SURFACES */}
      <section className="mt-20">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Why both surfaces?
        </h2>
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {rationaleCards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6"
            >
              <div className="inline-flex items-center justify-center size-9 rounded-lg border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.06] mb-4">
                {c.icon}
              </div>
              <h3 className="text-base font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
                {c.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="mt-20">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
        >
          <div className="max-w-xl">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
              Open xbert.io to see the product
            </h3>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
              See the same workflows as the plugins, organised as a full
              practice product — with workflow templates, schedules, role-based
              assignment, and a persistent audit trail.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://xbert.io"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-xbert-indigo/20 ring-1 ring-black/10 dark:ring-white/40 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition"
            >
              Open xbert.io
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
            <Link
              to="/plugins"
              className="inline-flex items-center gap-2 rounded-md border border-black/15 bg-black/[0.03] text-neutral-900 hover:bg-black/[0.06] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] dark:hover:border-white/25 px-5 py-2.5 text-sm font-medium transition"
            >
              Or install a plugin
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
