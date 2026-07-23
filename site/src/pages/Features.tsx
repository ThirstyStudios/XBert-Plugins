import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { ROUTE_META } from "../lib/route-meta";
import { Chip } from "../components/Chip";
import { CountUp } from "../components/CountUp";
import { SectionHeading } from "../components/SectionHeading";
import { StepFlow } from "../components/StepFlow";
import { CapabilityCard } from "../components/CapabilityCard";
import { QuoteCard } from "../components/QuoteCard";
import { CtaBand } from "../components/CtaBand";
import { ThemeImage } from "../components/ThemeImage";

interface Area {
  id: string;
  /** Area name — used for the eyebrow and the jump-row chip label. */
  name: string;
  eyebrow: string;
  title: string;
  body: string;
  prompts: string[];
  approveChip?: boolean;
}

const AREAS: Area[] = [
  {
    id: "receivables",
    name: "Invoices, quotes & receivables",
    eyebrow: "Area 01 — Invoices, quotes & receivables",
    title: "Get paid sooner.",
    body: "Every invoice, quote, credit note, overpayment and prepayment — quick totals first, then the full paper trail with line items when you want it. Aged receivables summaries show who owes what, and for how long.",
    prompts: [
      "Show me aged receivables for Harbour Landscaping — who's worst?",
      "List Bayside Cafe's unpaid invoices over 60 days, with amounts and due dates.",
      "Any credit notes raised for Kelly's Auto this quarter?",
    ],
  },
  {
    id: "payables",
    name: "Bills, POs & payables",
    eyebrow: "Area 02 — Bills, POs & payables",
    title: "Pay the right people, on time.",
    body: "Supplier bills, purchase orders, payments and batch payment runs, plus aged payables — so “what do we owe and when?” is a question, not an afternoon.",
    prompts: [
      "What's due to suppliers in the next fortnight for Glenview Homes?",
      "Walk me through last week's batch payment run — who got paid what?",
      "Which purchase orders are still open from March?",
    ],
  },
  {
    id: "bank",
    name: "Bank, cash & reconciliation",
    eyebrow: "Area 03 — Bank, cash & reconciliation",
    title: "Know the cash position.",
    body: "Bank transactions from quick aggregates down to individual records, a cash-flow summary, and month-by-month activity — the raw material of every rec, without the export.",
    prompts: [
      "How's cash looking for Bayside Cafe? Summarise the last 90 days.",
      "What were the ten biggest bank transactions in June?",
      "Show me monthly transaction activity for the year so far.",
    ],
  },
  {
    id: "payroll",
    name: "Payroll, employees & super",
    eyebrow: "Area 04 — Payroll, employees & super",
    title: "Answer payroll questions in seconds.",
    body: "Employees with their leave, tax, super and bank details; pay runs and payslips; leave applications; STP Phase 2 finalisation totals; WorkCover wages. The questions that used to mean opening four screens now take one sentence.",
    prompts: [
      "Summarise the last pay run for Coastal Care — totals and who was paid.",
      "What leave applications are waiting, and what balances do those staff have?",
      "Give me the STP finalisation totals for this financial year.",
    ],
  },
  {
    id: "reports",
    name: "BI, ledger & financial reporting",
    eyebrow: "Area 05 — BI, ledger & financial reporting",
    title: "See the story behind the numbers.",
    body: "P&L and balance sheet, journals and manual journals, fixed assets with depreciation, budget versus actual, AU Activity Statement (BAS/IAS) values — plus a data-quality score for the file, so you know how much to trust what you're reading.",
    prompts: [
      "Run last quarter's P&L against budget and call out the misses.",
      "List the manual journals posted in June and what they touched.",
      "What are the Activity Statement values for this period?",
    ],
  },
  {
    id: "xpm",
    name: "Practice management (Xero Practice Manager)",
    eyebrow: "Area 06 — Practice management (Xero Practice Manager)",
    title: "Run the firm like a business.",
    body: "XPM clients and jobs — tasks, milestones, staff — plus timesheets, WIP and recoverability, and a live read on team capacity versus actual time. The partner questions, answered before the partner asks.",
    prompts: [
      "How much WIP is sitting on Fisher & Co, and how much will we recover?",
      "Who has capacity next week, and who's already over?",
      "Show me the milestones and staff on Glenview Homes' year-end job.",
    ],
  },
  {
    id: "workflow",
    name: "Workflow, tasks & worklist",
    eyebrow: "Area 07 — Workflow, tasks & worklist",
    title: "Keep every client moving.",
    body: "Your worklist, work item updates, client tasks (including from your own templates), assigning, snoozing, due dates and estimates, bulk subtasks, tags, workflow templates and recurring schedules. Delegate to the assistant the way you'd delegate to a coordinator — and review the same way too.",
    prompts: [
      "What's on my worklist today, across every client?",
      "Create a month-end task for Brightside Vet from our template and assign it to Priya.",
      "Snooze everything on Kelly's Auto until Monday.",
    ],
    approveChip: true,
  },
  {
    id: "notes",
    name: "Client notes & communication",
    eyebrow: "Area 08 — Client notes & communication",
    title: "Walk into every call prepared.",
    body: "Client notes with version history and topics, client conversations and chat messages, and sharing notes into conversations. Three years of context, summarised before your 2pm.",
    prompts: [
      "Summarise every note we hold on Harbour Landscaping, newest first.",
      "Find where we discussed the ute purchase with the client.",
      "Share the March pricing note into their conversation.",
    ],
    approveChip: true,
  },
  {
    id: "alerts",
    name: "XBert alerts & exception review",
    eyebrow: "Area 09 — XBert alerts & exception review",
    title: "Let nothing slip through.",
    body: "XBert already watches your clients' books and raises alerts when something's off. Through the MCP your assistant reads them with you: what fired, exactly what needs fixing and how, the review state, each exception's action history, and notification summaries — plus alert configuration in bulk when a rule needs changing across many clients.",
    prompts: [
      "What fired across my clients this week? Group it by type.",
      "For this duplicate-payment alert, what exactly needs fixing, and how?",
      "Which review exceptions are still open on Bayside Cafe, and what's been done so far?",
    ],
    approveChip: true,
  },
  {
    id: "custom",
    name: "Custom XBert automation",
    eyebrow: "Area 10 — Custom XBert automation",
    title: "Invent your own alerts.",
    body: "Wish XBert watched for something specific to your practice? Describe the problem in plain English and a Custom XBert is created — then tested on real client data, tuned from your feedback, promoted when you're happy, and rolled back or switched off when you're not. The whole lifecycle, in conversation.",
    prompts: [
      "Create an alert for any suspense balance over $500 that sits for more than a week.",
      "Test it on Kelly's Auto before it goes live.",
      "Too noisy — tune it to ignore amounts under $100.",
    ],
    approveChip: true,
  },
  {
    id: "actions",
    name: "Accounting write-back",
    eyebrow: "Area 11 — Accounting write-back",
    title: "Stop re-keying.",
    body: "Create and update contacts, create bills and bank transactions from documents, record bill payments and bank transfers, and add comments, statuses, reminders and file attachments to tasks. Every write is validated and checked against duplicates before anything is submitted to Xero, QuickBooks, MYOB or FreeAgent — and it's proposed to you first. The assistant does the entry; you do the approving.",
    prompts: [
      "Create this supplier bill from the invoice details — check it's not a duplicate first.",
      "Set up the new supplier as a contact and put a reminder on the task.",
      "Record the transfer between the trading and savings accounts.",
    ],
    approveChip: true,
  },
];

const COMPOSE_STEPS = [
  {
    title: "Find.",
    body: "Name the client — the assistant locates the right file across your whole portal.",
  },
  {
    title: "Sum up.",
    body: "Totals first. “How much is overdue?”",
  },
  {
    title: "Drill in.",
    body: "Then the exact records behind the total, line by line.",
  },
  {
    title: "Act — with your review.",
    body: "Anything that changes the books is proposed first. You approve, amend or bin it.",
  },
];

export default function FeaturesPage() {
  usePageMeta(ROUTE_META.features);

  return (
    <div>
      {/* §1 HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid pointer-events-none" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-14 md:pt-32 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Chip>
              <span>
                <CountUp to={200} suffix=" tools" className="font-mono" /> · 11 capability areas
              </span>
            </Chip>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] max-w-3xl"
          >
            Two hundred tools. Eleven jobs. Plain English.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-7 text-lg md:text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl leading-relaxed"
          >
            You'll never call a tool by name — you just ask, and your assistant picks the right
            ones. Here's everything it can do with XBert, organised the way your week actually
            runs. Each area below is a job your practice already does; the prompts are the words
            that get it done.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
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
          </motion.div>

          {/* 16:6, not 16:9 — the artwork sits in the middle ~45% of the frame,
              so the full aspect ratio ships ~250px of empty navy. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            className="mt-14 rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden aspect-[16/6]"
          >
            <ThemeImage
              lightSrc="/illustrations/features-banner-light.svg"
              darkSrc="/illustrations/features-banner.svg"
              width={1344}
              height={756}
              loading="eager"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* §2 HOW THE TOOLS COMPOSE */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading title="One question, four moves." />
        <StepFlow steps={COMPOSE_STEPS} className="mt-10" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-10 max-w-3xl"
        >
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {`Here's the shape in the wild: “Who owes us the most across the practice?” gets a summary. “Show me Harbour Landscaping's overdue invoices” gets the records. “Draft a chase task and assign it to Priya” gets a proposed action — which you approve, amend or bin. You'll fall into the rhythm without thinking about it.`}
          </p>
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            Numbers first. Detail second. Changes only with your OK.
          </p>
        </motion.div>
      </section>

      {/* §3–13 THE 11 CAPABILITY AREAS */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        {/* Owning heading for the eleven areas — without it every area h3 is
            attributed to the preceding "One question, four moves." h2. */}
        <h2 className="sr-only">The 11 capability areas</h2>
        {/* Area index — jump row */}
        <nav aria-label="Capability areas">
          <ul className="flex flex-wrap gap-2 pb-2 list-none">
            {AREAS.map((a) => (
              <li key={a.id} className="flex-shrink-0">
                <a
                  href={`#${a.id}`}
                  className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.04] text-neutral-700 hover:bg-black/[0.08] hover:text-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white px-3 py-1 text-xs whitespace-nowrap transition"
                >
                  {a.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 space-y-6">
          {AREAS.slice(0, 5).map((a, i) => (
            <CapabilityCard
              key={a.id}
              id={a.id}
              eyebrow={a.eyebrow}
              title={a.title}
              body={a.body}
              prompts={a.prompts}
              approveChip={a.approveChip}
              index={i}
            />
          ))}

          {/* Pull quote — renders only here, between Area 05 and Area 06 */}
          <QuoteCard
            variant="pull"
            quote="As the practice manager, the analytics have given me insights that I was previously unable to access."
            name="Karen Hirst"
            firm="KBas"
            className="py-10"
          />

          {AREAS.slice(5).map((a, i) => (
            <CapabilityCard
              key={a.id}
              id={a.id}
              eyebrow={a.eyebrow}
              title={a.title}
              body={a.body}
              prompts={a.prompts}
              approveChip={a.approveChip}
              index={i + 5}
            />
          ))}
        </div>
      </section>

      {/* §14 TRUST REPRISE */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading
          title="The rules don't change as you go deeper."
          lead="Every area above runs under the same three rules: the assistant only sees what your XBert role allows; anything that changes the books is validated, duplicate-checked and proposed for your review; and everything is recorded with an audit trail. Depth of capability, not depth of risk."
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
          className="mt-6 flex flex-wrap gap-2"
        >
          <Chip>Your role, exactly</Chip>
          <Chip>Proposed, not posted</Chip>
          <Chip>Audit trail on every action</Chip>
        </motion.div>
      </section>

      {/* §15 FINAL CTA */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <CtaBand
          heading="Stop reading. Start asking."
          body="Pick one client and ask one question — that's genuinely the best way in. Connect your assistant, ask about aged receivables, and see what comes back."
          primary={{ label: "Get connected", to: "/get-started" }}
          secondary={{ label: "Start from a ready-made workflow", to: "/plugins" }}
        />
      </section>
    </div>
  );
}
