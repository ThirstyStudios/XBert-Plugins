import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  Check,
  X,
  Wallet,
  Users,
  BarChart3,
  ListChecks,
} from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { ROUTE_META } from "../lib/route-meta";
import { HeroMedia } from "../components/HeroMedia";
import { SectionHeading } from "../components/SectionHeading";
import { Chip } from "../components/Chip";
import { AskPrompt } from "../components/AskPrompt";
import { CapabilityCard } from "../components/CapabilityCard";
import { StepFlow } from "../components/StepFlow";
import { FaqItem, FaqJsonLd } from "../components/FaqItem";
import { CtaBand } from "../components/CtaBand";
import { AddressChip, MCP_ADDRESS } from "../components/AddressChip";
import { QuoteCard } from "../components/QuoteCard";
import { ThemeImage } from "../components/ThemeImage";

const SETUP_GUIDE_URL =
  "https://support.xbert.io/en/articles/14492922-how-to-add-xbert-as-a-custom-mcp-connector-in-claude";

const ASK_PROMPTS = [
  "Who owes us the most right now, across every client?",
  "Who's over capacity next week, and which jobs are running behind?",
  "What fired in XBert this week? Anything urgent?",
  "How many WIP hours are sitting on Fisher & Co, and how recoverable are they?",
  "Run last quarter's P&L for Bayside Cafe and compare it to budget.",
  "Draft a task for the tax coding fix and assign it to Priya — I'll review it first.",
];

const TRUST_ROWS: { can: string; never: string }[] = [
  {
    can: "See the clients and data your XBert role allows",
    never: "See any client or data outside your role",
  },
  {
    can: "Read numbers, lists and records when you ask",
    never: "Learn your XBert password — you sign in with XBert itself",
  },
  {
    can: "Draft changes for your approval, with an audit trail on every action",
    never:
      "Act outside your XBert permissions, or make a change that isn't written to the audit log",
  },
  {
    can: "Work only while connected",
    never:
      "Keep any access once you remove the connector in your assistant's settings",
  },
];

const CLUSTERS = [
  {
    title: "Money in, money out",
    body: "Invoices, quotes and receivables. Bills, purchase orders and payables. Bank activity and cash flow — totals first, exact records when you want them.",
    icon: <Wallet size={18} aria-hidden className="text-xbert-indigo dark:text-xbert-cyan" />,
  },
  {
    title: "The firm's own numbers",
    body: "Jobs, timesheets, WIP and recoverability. WIP comes through as time — hours, not dollars. Team capacity against the time actually worked, so you can see who's stretched and who has room. From Xero Practice Manager, if that's where your practice runs.",
    icon: <Users size={18} aria-hidden className="text-xbert-indigo dark:text-xbert-cyan" />,
  },
  {
    title: "The books and the story",
    body: "P&L, balance sheet, journals and budget vs actual, plus tax and activity statement figures (BAS and IAS in Australia). Pay runs, payslips, leave and retirement contributions (super in Australia). And every XBert alert, explained with its fix.",
    icon: <BarChart3 size={18} aria-hidden className="text-xbert-indigo dark:text-xbert-cyan" />,
  },
  {
    title: "The doing",
    body: "Worklists, tasks and schedules across the whole portfolio. Client notes and conversations. Write-back to the ledger with validation, duplicate checks and your sign-off.",
    icon: <ListChecks size={18} aria-hidden className="text-xbert-indigo dark:text-xbert-cyan" />,
  },
];

const QUOTES = [
  {
    quote: "XBert is like having that ultra efficient staff member on board",
    name: "Cath Hopson",
    firm: "Hands on Bookkeeping",
  },
  {
    quote:
      "Like an additional team member checking out our work! Love how it picks up things I wouldn't have thought to look for.",
    name: "Althea Marie Dizon",
    firm: "Hammerjack",
  },
  {
    quote:
      "I couldn't reach the level of efficiency or the number of clients I service without it.",
    name: "Tracey Rubens",
    firm: "Beachy Bookkeeping",
  },
];

const FAQS = [
  {
    question: "What is the XBert MCP?",
    answer:
      "MCP stands for Model Context Protocol — a standard, secure way for an AI assistant like Claude or ChatGPT to connect to software your practice already uses and work with it on your behalf. The XBert MCP connects your assistant to XBert: live client ledger data, alerts, workflow and practice management. You ask in plain English; the assistant uses XBert's 200 tools to answer, and to draft work for your review.",
  },
  {
    question: "Do I need to be technical to use it?",
    answer:
      "No. Setup is paste-one-address-and-sign-in, and from then on you type questions the way you'd ask a colleague. There's no code, no API keys and no syntax to learn.",
  },
  {
    question: "Which AI assistants work with it?",
    answer:
      "Claude on the web and Claude Desktop (via Settings → Connectors), Claude Code, and any other assistant that supports MCP connectors. ChatGPT works too, with more setting up — see Get started for what your plan and your workspace admin need to allow.",
  },
  {
    question: "Is my client data safe?",
    answer:
      "You sign in with your XBert account using OAuth, so your credentials stay with XBert and the assistant inherits your XBert role — it can only see what you can see. Write actions are marked for your assistant to confirm, and every action is written to the XBert audit log. You can disconnect the assistant at any time.",
  },
  {
    question: "Can the assistant change my clients' books without me?",
    answer:
      "Not without it being put to you first. Write actions — creating a bill, recording a payment, updating a contact — are validated, checked for duplicates and marked as changes to confirm, which is what makes Claude and other MCP clients stop and ask you before submitting. The approval step runs in your assistant; the permission check, the validation and the audit-log entry are XBert's.",
  },
  {
    question: "Which clients can my assistant work with?",
    answer:
      "Two things decide what your assistant can reach: your XBert role, and the client's plan. Role is the one most people think of — if you can't see a client in XBert, your assistant can't either. The second is the plan: the data and reporting tools only run for clients on an AI-enabled plan, so a client on another plan will answer for tasks, templates and notes, but not for its books. That isn't a fault when it happens; it's the plan.",
  },
  {
    question: "Do I need a new account or login?",
    answer:
      "No. You connect with your existing XBert login, and your existing XBert role and permissions carry over — there's nothing new to create. If you're not on XBert yet, start at xbert.io.",
  },
];

export default function HomePage() {
  usePageMeta(ROUTE_META.home);

  return (
    <div>
      {/* §1 HERO */}
      <section className="relative overflow-hidden">
        <HeroMedia
          src="/illustrations/hero-ambient.mp4"
          poster="/illustrations/hero-ambient-poster.jpg"
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-14 md:pt-32 md:pb-28">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <Chip icon={<Sparkles size={12} aria-hidden className="text-xbert-indigo dark:text-xbert-cyan" />}>
                  {"200 tools · Works with Claude and Claude Code · ChatGPT with extra setup"}
                </Chip>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
              >
                {"Every client, every job, "}
                <span className="brand-gradient-text">one question away.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-7 text-lg md:text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl leading-relaxed"
              >
                {
                  "You already use Claude or ChatGPT for the words — the XBert MCP puts that same assistant to work on the actual books: your clients' live ledgers, alerts and workflow. And — if you run Xero Practice Manager — the jobs, WIP and capacity that show how your own practice is running. You ask in plain English, it does the digging, and anything that changes the books is flagged for your approval first."
                }
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Link
                    to="/get-started"
                    className="group inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-xbert-indigo/20 ring-1 ring-black/10 dark:ring-white/40 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition"
                  >
                    Connect your assistant
                    <ArrowRight
                      size={16}
                      strokeWidth={2.5}
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                  <Link
                    to="/features"
                    className="inline-flex items-center gap-2 rounded-md border border-black/15 bg-black/[0.03] text-neutral-900 hover:bg-black/[0.06] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] dark:hover:border-white/25 px-5 py-2.5 text-sm font-medium transition"
                  >
                    See what you can ask
                  </Link>
                  <a
                    href="#how-it-works"
                    className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition px-2 py-2.5"
                  >
                    {"How it works ↓"}
                  </a>
                </div>
                <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                  Sign in with your XBert account. No code, no API keys.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden"
            >
              <ThemeImage
                lightSrc="/illustrations/hero-network-a-light.svg"
                darkSrc="/illustrations/hero-network-a.svg"
                width={1344}
                height={768}
                loading="eager"
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* §2 WHAT IS IT */}
      <section className="max-w-3xl mx-auto px-6 py-14 md:py-20 text-center">
        <SectionHeading
          center
          title="What's an MCP? The two-sentence version."
          lead={
            "MCP — the Model Context Protocol — is simply a secure, standard way for Claude, ChatGPT or whichever AI you use to connect to the software your practice already uses and work with it on your behalf. Think of it as the plumbing between your assistant and everything XBert already holds — your clients' books on one side, your practice's own worklists and tasks on the other — so you never see it: you just ask a question and the answer comes back from the live record, not from the assistant's imagination."
          }
        />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mt-4 text-sm text-neutral-500 dark:text-neutral-400"
        >
          {"One address, one sign-in, and you're talking to your practice."}
        </motion.p>
      </section>

      {/* §3 HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading id="how-it-works" title="Connected in three steps." />
        <StepFlow
          className="mt-10"
          steps={[
            {
              title: "Point your assistant at XBert",
              body: (
                <>
                  {"In your assistant's settings, add a connector with one address: "}
                  <span className="font-mono text-neutral-900 dark:text-neutral-100 break-words">
                    {MCP_ADDRESS}
                  </span>
                  {". That's the whole technical bit on Claude, done."}
                </>
              ),
            },
            {
              title: "Sign in to approve",
              body: "A browser window opens and you sign in with your XBert account. The assistant gets your permissions — no more, no less — and your credentials stay with XBert.",
            },
            {
              title: "Start asking",
              body: "Type the question the way you'd ask a colleague. “Who owes us the most?” and “who's over capacity next week?” work better than anything technical ever will.",
            },
          ]}
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <Link
            to="/get-started"
            className="group inline-flex items-center gap-2 self-start rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-xbert-indigo/20 ring-1 ring-black/10 dark:ring-white/40 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition"
          >
            {"Get connected — about five minutes on Claude"}
            <ArrowRight
              size={16}
              strokeWidth={2.5}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {"Prefer screenshots? "}
            <a
              href={SETUP_GUIDE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xbert-indigo dark:text-xbert-cyan hover:underline"
            >
              {"Follow the step-by-step guide →"}
            </a>
          </p>
        </motion.div>
      </section>

      {/* §4 WHAT YOU CAN ASK */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading
          title="Ask it like you'd ask your best senior."
          lead={
            "Start with the work, not the technology. Every practice has the same Tuesday-morning questions — some about a client's books, some about how the practice itself is tracking. Here's what they sound like once your assistant is connected."
          }
        />
        <div className="grid md:grid-cols-2 gap-3 mt-8">
          {ASK_PROMPTS.map((p, i) => (
            <AskPrompt key={p} text={p} index={i} />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {"Every answer comes from live XBert data, under your own login — not the assistant's memory. Data questions need the client on an AI-enabled plan."}
          </p>
          <Link
            to="/features"
            className="group inline-flex items-center gap-1 text-sm text-xbert-indigo dark:text-xbert-cyan hover:underline flex-shrink-0"
          >
            See all 11 capability areas
            <ArrowRight
              size={14}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </section>

      {/* §5 TRUST */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading
          title="You stay the reviewer."
          lead={
            "Think of it as giving a very capable new team member a supervised login. Letting an assistant near the books is a big step — here is exactly where the lines are. Every write is validated and checked for duplicates first, and each one is marked as a change to confirm, so your assistant stops and asks before it submits. That approval prompt belongs to the assistant rather than to XBert — what XBert guarantees is your permissions, the validation and an audit-log entry on every action."
          }
        />
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
                  <th
                    scope="col"
                    className="text-left px-5 py-3 text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-medium"
                  >
                    What the assistant can do
                  </th>
                  <th
                    scope="col"
                    className="text-left px-5 py-3 text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-medium"
                  >
                    What it can never do
                  </th>
                </tr>
              </thead>
              <tbody>
                {TRUST_ROWS.map((row, i) => (
                  <tr
                    key={row.can}
                    className={
                      i === TRUST_ROWS.length - 1
                        ? ""
                        : "border-b border-black/5 dark:border-white/5"
                    }
                  >
                    <td className="px-5 py-4 align-top text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      <span className="flex items-start gap-2">
                        <Check
                          size={14}
                          aria-hidden
                          className="mt-1 flex-shrink-0 text-emerald-500 dark:text-emerald-400"
                        />
                        {row.can}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      <span className="flex items-start gap-2">
                        <X
                          size={14}
                          aria-hidden
                          className="mt-1 flex-shrink-0 text-neutral-500"
                        />
                        {row.never}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Chip>Your role, exactly</Chip>
            <Chip>Flagged for your approval</Chip>
            <Chip>Audit trail on every action</Chip>
          </div>
          <Link
            to="/get-started#manage-access"
            className="mt-4 inline-flex items-center gap-1 text-sm text-xbert-indigo dark:text-xbert-cyan hover:underline"
          >
            {"How to manage or remove access →"}
          </Link>
        </motion.div>
      </section>

      {/* §6 FEATURES PREVIEW */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading title="200 tools: your clients' books, and the practice behind them." />
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {CLUSTERS.map((c, i) => (
            <CapabilityCard
              key={c.title}
              title={c.title}
              body={c.body}
              icon={c.icon}
              index={i}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <Link
            to="/features"
            className="group inline-flex items-center gap-1 text-sm text-xbert-indigo dark:text-xbert-cyan hover:underline"
          >
            Explore all 11 areas in plain English
            <ArrowRight
              size={14}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </section>

      {/* §8 SOCIAL PROOF */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading title={"These firms are talking about XBert itself. The MCP is the same work, in the chat window."} />
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {QUOTES.map((q, i) => (
            <QuoteCard
              key={q.name}
              quote={q.quote}
              name={q.name}
              firm={q.firm}
              index={i}
            />
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mt-6 text-sm text-neutral-500 dark:text-neutral-400"
        >
          From xbert.io customer stories. These are about the XBert platform, not the MCP.
        </motion.p>
      </section>

      {/* §9 FAQ */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <div className="max-w-3xl">
          <SectionHeading title="Questions people actually ask." />
          <FaqJsonLd items={FAQS} />
          <div className="mt-8 border-t border-black/10 dark:border-white/10">
            {FAQS.map((f) => (
              <FaqItem key={f.question} question={f.question} answer={f.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* §10 FINAL CTA */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <CtaBand
          heading="Your assistant is ready when you are."
          body="One address, one sign-in, and the whole practice is a question away."
          primary={{ label: "Connect your assistant", to: "/get-started" }}
          secondary={{ label: "Read the setup guide", href: SETUP_GUIDE_URL }}
          backgroundSrc="/illustrations/hero-network-b.svg"
        >
          <AddressChip />
        </CtaBand>
      </section>
    </div>
  );
}
