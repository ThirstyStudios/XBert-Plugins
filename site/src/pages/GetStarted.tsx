import { Link } from "react-router";
import { motion } from "motion/react";
import { Check, Info } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { ROUTE_META } from "../lib/route-meta";
import { Chip } from "../components/Chip";
import { SectionHeading } from "../components/SectionHeading";
import { AddressChip } from "../components/AddressChip";
import { MCP_ADDRESS } from "../components/AddressChip";
import { TabGroup } from "../components/TabGroup";
import { StepFlow } from "../components/StepFlow";
import { CopyButton } from "../components/CopyButton";
import { AskPrompt } from "../components/AskPrompt";
import { CtaBand } from "../components/CtaBand";
import { ThemeImage } from "../components/ThemeImage";

const SETUP_GUIDE_URL =
  "https://support.xbert.io/en/articles/14492922-how-to-add-xbert-as-a-custom-mcp-connector-in-claude";

const CLAUDE_CODE_COMMAND = `claude mcp add --transport http xbert ${MCP_ADDRESS}`;

const STRONG = "font-semibold text-neutral-900 dark:text-white";
const MONO = "font-mono text-neutral-900 dark:text-neutral-100";
const LINK =
  "text-xbert-indigo dark:text-xbert-cyan hover:underline focus-visible:underline";

const CHECKLIST = [
  {
    n: "01",
    title: "An XBert account",
    body: (
      <>
        With your clients' files connected as usual — Xero, QuickBooks, MYOB or FreeAgent,
        plus Xero Practice Manager if you use it. The MCP works with what's already in
        XBert. Not on XBert yet? Start at{" "}
        <a href="https://xbert.io" target="_blank" rel="noopener noreferrer" className={LINK}>
          xbert.io
        </a>
        .
      </>
    ),
  },
  {
    n: "02",
    title: "An assistant that speaks MCP",
    body: (
      <>
        Claude on the web or Desktop, Claude Code in the terminal, ChatGPT, or any other
        assistant that supports MCP connectors.
      </>
    ),
  },
  {
    n: "03",
    title: "Your normal login",
    body: (
      <>
        That's the security model in one line: the assistant signs in as you and can only
        see what your XBert role allows. If you can't see a client in XBert, your
        assistant can't either. If connector settings are locked in your workspace, ask
        your admin to switch them on.
      </>
    ),
  },
];

const CONNECT_TABS = [
  {
    id: "claude",
    label: "Claude (web & Desktop)",
    content: (
      <div>
        <StepFlow
          variant="list"
          steps={[
            {
              title: "",
              body: (
                <>
                  Open <strong className={STRONG}>Settings → Connectors</strong> (on some
                  plans it's labelled <strong className={STRONG}>Integrations</strong>).
                </>
              ),
            },
            {
              title: "",
              body: (
                <>
                  Choose <strong className={STRONG}>Add custom connector</strong>.
                </>
              ),
            },
            {
              title: "",
              body: (
                <>
                  Name it <strong className={STRONG}>XBert</strong> and paste the address
                  above, then add it.
                </>
              ),
            },
            {
              title: "",
              body: (
                <>
                  Select <strong className={STRONG}>Connect</strong> and sign in with your
                  XBert account in the window that opens.
                </>
              ),
            },
            {
              title: "",
              body: <>Back in the chat, XBert now appears in your tools menu. Ask away.</>,
            },
          ]}
        />
        <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
          Step-by-step with screenshots in{" "}
          <a href={SETUP_GUIDE_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
            the setup guide →
          </a>
          .
        </p>
      </div>
    ),
  },
  {
    id: "claude-code",
    label: "Claude Code",
    content: (
      <div>
        <StepFlow
          variant="list"
          steps={[
            {
              title: "",
              body: (
                <>
                  Run:
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04] p-3">
                    <code className="font-mono text-[13px] text-neutral-900 dark:text-neutral-100 break-all">
                      {CLAUDE_CODE_COMMAND}
                    </code>
                    <CopyButton text={CLAUDE_CODE_COMMAND} />
                  </div>
                </>
              ),
            },
            {
              title: "",
              body: (
                <>
                  In your next session, run <span className={MONO}>/mcp</span> and complete
                  the XBert sign-in when prompted.
                </>
              ),
            },
            {
              title: "",
              body: <>Ask in plain English — or add plugins for slash-command workflows.</>,
            },
          ]}
        />
        <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
          On an older Claude Code? Run <span className={MONO}>claude mcp add --help</span>{" "}
          to check the syntax. Plugins live at{" "}
          <Link to="/plugins" className={`font-mono ${LINK}`}>
            /plugins
          </Link>
          .
        </p>
      </div>
    ),
  },
  {
    id: "other",
    label: "Other MCP-aware assistants",
    content: (
      <div>
        <StepFlow
          variant="list"
          steps={[
            {
              title: "",
              body: (
                <>
                  Find where your assistant manages connectors or MCP servers — ChatGPT and
                  others each name it slightly differently.
                </>
              ),
            },
            {
              title: "",
              body: <>Add a remote MCP server with the address above.</>,
            },
            {
              title: "",
              body: <>Complete the XBert sign-in when your browser opens, then start asking.</>,
            },
          ]}
        />
        <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
          If your assistant asks for a transport type, choose HTTP (sometimes shown as
          &ldquo;streamable HTTP&rdquo;). If it speaks MCP, it speaks XBert.
        </p>
      </div>
    ),
  },
];

const FIRST_PROMPTS = [
  "What can you do with my XBert account?",
  "List the clients I look after.",
  "Summarise this week's XBert alerts for [client].",
  "Show me aged receivables for [client] — who should I chase first?",
  "What's on my worklist today?",
];

const ACCESS_BLOCKS = [
  {
    title: "Turn it off in one place.",
    body: "Remove or disable the XBert connector in your assistant's settings and the connection is gone. Reconnect any time by signing in again.",
  },
  {
    title: "Access follows your role.",
    body: "The assistant only ever holds the permissions of the person signed in. Change someone's role in XBert and their assistant's reach changes with it — nothing is granted beyond that.",
  },
  {
    title: "Everything leaves a trail.",
    body: "Actions are proposed and recorded with an audit trail, so you can always see what was asked and what was done.",
  },
];

const BEST_PRACTICES = [
  {
    lead: "Start with questions, not changes.",
    body: "Spend your first week asking — balances, alerts, worklists. Move to drafting tasks and write-backs once the answers have earned your trust.",
  },
  {
    lead: "Be specific.",
    body: "Client, period, and what good looks like. Specific asks get specific answers.",
  },
  {
    lead: "One client before twenty.",
    body: "Prove a routine on a single file, then let the assistant repeat it across the portfolio.",
  },
  {
    lead: "Review anything client-facing yourself.",
    body: "Always. The assistant drafts; you decide what leaves the practice.",
  },
  {
    lead: "Treat it like a bright new hire.",
    body: "Clear instructions, check the work early on. Trust builds the same way it does with people — quickly, when the work keeps standing up.",
  },
];

export default function GetStartedPage() {
  usePageMeta(ROUTE_META.getStarted);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid pointer-events-none" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-14 md:pt-32 md:pb-28">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <Chip>Works with Claude · Claude Code · ChatGPT &amp; other MCP-aware assistants</Chip>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]"
              >
                Connected in about five minutes.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-6 text-lg md:text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl leading-relaxed"
              >
                No code, no API keys, nothing to install on a server. You paste one address,
                sign in with your XBert account, and start asking. Most people get their
                first real answer before the kettle's boiled.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-6 space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400"
              >
                <p>Under the hood: a remote MCP server with OAuth. That's the whole trick.</p>
                <p>
                  Full illustrated guide with screenshots:{" "}
                  <a
                    href={SETUP_GUIDE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK}
                  >
                    the XBert setup guide →
                  </a>
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block"
            >
              {/* Deliberate dark accent panel: the SVG has an opaque near-black
                  background; the light theme gets its own light-canvas
                  variant rather than a dark slab on white. */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-xbert-canvas dark:bg-xbert-ink p-4 md:p-6 overflow-hidden">
                <ThemeImage
                  lightSrc="/illustrations/get-started-path-light.svg"
                  darkSrc="/illustrations/get-started-path.svg"
                  width={1216}
                  height={896}
                  loading="eager"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BEFORE YOU BEGIN */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading title="Before you begin, you need three things." />
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {CHECKLIST.map((item, i) => (
            <motion.div
              key={item.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6"
            >
              <div className="text-xs font-mono font-semibold text-xbert-indigo dark:text-xbert-cyan">
                {item.n}
              </div>
              <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONNECT YOUR ASSISTANT */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading title="Connect your assistant." />
        <div className="mt-8 max-w-3xl">
          <div className="mb-6">
            <AddressChip label="XBert MCP address" />
          </div>
          <TabGroup label="Connect your assistant" tabs={CONNECT_TABS} />
        </div>
      </section>

      {/* FIRST PROMPTS */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading
          title="Your first five prompts."
          lead="Start read-only. Get a feel for how it answers before you ask it to do anything."
        />
        <div className="mt-8 space-y-2 max-w-3xl">
          {FIRST_PROMPTS.map((text, i) => (
            <AskPrompt key={text} text={text} index={i} />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mt-6 flex items-start gap-3 rounded-xl border border-xbert-indigo/25 bg-xbert-indigo/[0.06] dark:border-xbert-cyan/20 dark:bg-xbert-cyan/[0.05] px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 max-w-3xl"
        >
          <Info
            size={16}
            aria-hidden
            className="mt-0.5 text-xbert-indigo dark:text-xbert-cyan flex-shrink-0"
          />
          <p>
            Name the client and the period. &ldquo;Bayside Cafe, last quarter&rdquo; beats
            &ldquo;that cafe file&rdquo; every time.
          </p>
        </motion.div>
      </section>

      {/* MANAGING ACCESS */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading id="manage-access" title="Managing and removing access." />
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {ACCESS_BLOCKS.map((block, i) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6"
            >
              <h3 className="text-base font-semibold italic">{block.title}</h3>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
                {block.body}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400">
          Sign-in uses OAuth. Your credentials stay with XBert — the assistant never sees
          your password.
        </p>
      </section>

      {/* BEST PRACTICES */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading title="How to work with it well." />
        <ul className="mt-10 grid md:grid-cols-2 gap-x-10 gap-y-6">
          {BEST_PRACTICES.map((item, i) => (
            <motion.li
              key={item.lead}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="flex items-start gap-3 list-none"
            >
              <Check
                size={16}
                aria-hidden
                className="mt-0.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
              />
              <div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {item.lead}
                </div>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* NEXT STEPS */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-20 md:pt-20 md:pb-24">
        <CtaBand
          heading="Connected? Here's where it gets fun."
          primary={{ label: "See everything you can ask", to: "/features" }}
          secondary={{ label: "Browse ready-made workflows", to: "/plugins" }}
        />
      </section>
    </div>
  );
}
