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

type RationaleCard = {
  icon: React.ReactNode;
  title: string;
  body: string;
};

export default function InsideXBertPage() {
  usePageMeta(ROUTE_META.insideXBert);

  const dualityCards: DualityCard[] = [
    {
      eyebrow: "Chat surface",
      eyebrowIcon: (
        <MessageSquare size={12} aria-hidden className="text-xbert-indigo dark:text-xbert-cyan" />
      ),
      title: "Connect once. Ask in plain English.",
      body: "Add the XBert MCP to your assistant. Ask for a review, an audit or a workflow check and it works the same XBert data under the same rules, with the output dropping into your file system or back into the chat.",
      bullets: [
        {
          label: "Best for",
          value:
            "ad-hoc requests, exploratory questions, batch tasks across many clients",
        },
        {
          label: "Lives in",
          value:
            "Claude on the web or Desktop, Claude Code — or ChatGPT, with extra setup",
        },
        { label: "Connects via", value: "MCP" },
        {
          label: "What you get",
          value: "the full XBert tool catalogue",
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
      body: "The tools your assistant calls map to features inside the XBert app — Review module, Workflow, Capacity, Practice settings. Same data, same rules, persistent UI.",
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
            "native integration with Xero, QuickBooks, MYOB and FreeAgent, plus Xero Practice Manager",
        },
        {
          label: "What you get",
          value:
            "workflow templates, schedules, notifications, the Review module, audit history, role-based assignment",
        },
      ],
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
      body: "Both surfaces write back to the same XBert audit log. A run from chat is indistinguishable from an in-app run after the fact — same permissions, same artefacts, same compliance.",
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
        The MCP is part of XBert.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-6 text-lg md:text-xl text-neutral-700 dark:text-neutral-300 max-w-3xl leading-relaxed"
      >
        Every workflow your assistant runs also lives as a screen inside the
        XBert app. Same data, same rules, same audit trail — two ways in.
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
          you&apos;re doing the work. Claude takes that further: connect the
          XBert MCP and you get arbitrary output formats, plus everything else
          in your stack pulled into a single thread.
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
              See the same workflows your assistant runs, organised as a full
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
          </div>
        </motion.div>
      </section>
    </div>
  );
}
