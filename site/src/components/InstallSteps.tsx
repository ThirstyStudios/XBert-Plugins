import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  KeyRound,
  Plug,
  ShieldCheck,
  Sparkles,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";
import { CopyButton } from "./CopyButton";

type Mode = "claude" | "claude-code";

type Props = {
  /** Slugs to include in the Claude Code CLI install snippet. */
  slugs: string[];
  /** Build the CLI snippet from props (so this component owns the format). */
  cliSnippet: string;
  /** Optional plugin display name — kept for compatibility, not currently displayed. */
  searchHint?: string;
  /** Show the "skip line 1" hint under the CLI snippet. */
  showSkipHint?: boolean;
  /** Hide the link to the bundle builder (used on the builder page itself). */
  hideBundleLink?: boolean;
};

export function InstallSteps({
  cliSnippet,
  showSkipHint = true,
  hideBundleLink = false,
}: Props) {
  const [mode, setMode] = useState<Mode>("claude");

  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 dark:border-white/10 dark:bg-black/40 overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40 backdrop-blur-sm">
      {/* Tab bar */}
      <div
        role="tablist"
        className="flex items-center gap-1 px-2 py-2 border-b border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02]"
      >
        <TabButton
          active={mode === "claude"}
          onClick={() => setMode("claude")}
          icon={<Sparkles size={13} />}
          label="Claude"
          sublabel="claude.ai / Desktop"
        />
        <TabButton
          active={mode === "claude-code"}
          onClick={() => setMode("claude-code")}
          icon={<Terminal size={13} />}
          label="Claude Code"
          sublabel="CLI / Cowork"
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {mode === "claude" ? (
          <motion.div
            key="claude"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="p-6"
          >
            <ClaudeWalkthrough />
          </motion.div>
        ) : (
          <motion.div
            key="claude-code"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <CliPanel
              snippet={cliSnippet}
              showSkipHint={showSkipHint}
              hideBundleLink={hideBundleLink}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Sub-components ---------------- */

function TabButton({
  active,
  onClick,
  icon,
  label,
  sublabel,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
        active
          ? "bg-black/[0.06] text-neutral-900 dark:bg-white/[0.08] dark:text-white"
          : "text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.03] dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-white/[0.03]"
      }`}
    >
      <span className={active ? "text-blue-500 dark:text-blue-400" : "text-neutral-500"}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      <span className="text-[10.5px] uppercase tracking-wider text-neutral-500 hidden sm:inline">
        · {sublabel}
      </span>
      {active && (
        <motion.span
          layoutId="install-tab-underline"
          className="absolute inset-x-2 -bottom-[9px] h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
        />
      )}
    </button>
  );
}

function ClaudeWalkthrough() {
  const steps = [
    {
      icon: <Globe size={14} />,
      title: "Enable network egress",
      body: (
        <>
          In Claude, open <span className="font-mono text-neutral-900 dark:text-neutral-100">Settings → Capabilities</span>, scroll to <span className="font-mono text-neutral-900 dark:text-neutral-100">Code execution and file creation</span>, and turn on <span className="font-mono text-neutral-900 dark:text-neutral-100">Allow network egress</span>. Under <span className="font-mono text-neutral-900 dark:text-neutral-100">Domain allowlist</span>, allow all domains, or specifically allow{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">mcp-gateway.xbert.io</span> and{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">auth.xbert.io</span>.
        </>
      ),
    },
    {
      icon: <Plug size={14} />,
      title: "Add the XBert custom connector",
      body: (
        <>
          Open <span className="font-mono text-neutral-900 dark:text-neutral-100">Settings → Integrations</span> (or <span className="font-mono text-neutral-900 dark:text-neutral-100">Connectors</span>) and click <span className="font-mono text-neutral-900 dark:text-neutral-100">Add Custom Connector</span>. Use the values below.
        </>
      ),
      action: (
        <CopyButton text="https://mcp-gateway.xbert.io/mcp" label="Copy URL" />
      ),
      detail: (
        <div className="mt-3 rounded-lg border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.03] px-3 py-2 text-xs font-mono text-neutral-700 dark:text-neutral-300">
          <div><span className="text-neutral-500">Name:</span> XBert</div>
          <div><span className="text-neutral-500">Server URL:</span> https://mcp-gateway.xbert.io/mcp</div>
        </div>
      ),
    },
    {
      icon: <KeyRound size={14} />,
      title: "Sign in with XBert",
      body: (
        <>
          Save the connector. Claude handles OAuth automatically — sign in with your XBert account and select the business or Connect Portal you want to work with. Credentials never leave XBert (OAuth 2.1 with PKCE).
        </>
      ),
    },
    {
      icon: <Sparkles size={14} />,
      title: "Ask Claude to do practice work",
      body: (
        <>
          Try{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">Show me aged receivables for this client</span>,{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">Review the latest XBert notifications</span>, or{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">Check bank reconciliation status</span>. Claude has 70+ XBert tools.
        </>
      ),
    },
  ];

  return (
    <div>
      <ol className="relative space-y-5 pl-9">
        {/* Vertical track */}
        <span
          aria-hidden
          className="absolute left-[14px] top-1 bottom-1 w-px bg-gradient-to-b from-black/15 via-black/8 to-transparent dark:from-white/15 dark:via-white/8"
        />

        {steps.map((s, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * i }}
            className="relative"
          >
            {/* Numbered badge */}
            <span
              aria-hidden
              className="absolute -left-9 top-0 inline-flex items-center justify-center size-7 rounded-full border border-black/15 bg-black/[0.04] text-neutral-700 dark:border-white/15 dark:bg-white/[0.06] dark:text-neutral-300"
            >
              {s.icon}
            </span>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-mono text-blue-500 dark:text-blue-400 mb-0.5">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">{s.title}</div>
                <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {s.body}
                </div>
                {"detail" in s && s.detail ? s.detail : null}
              </div>
              {"action" in s && s.action ? (
                <div className="flex-shrink-0 mt-1">{s.action}</div>
              ) : null}
            </div>
          </motion.li>
        ))}
      </ol>

      {/* Verification / "what you can do" note */}
      <div className="mt-6 rounded-xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-4 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <span className="text-neutral-900 dark:text-neutral-200 font-medium">
          <ShieldCheck size={12} className="inline mr-1 -mt-0.5 text-emerald-500 dark:text-emerald-400" />
          You must have an active XBert account with access to at least one business.
        </span>{" "}
        Need more detail?{" "}
        <a
          href="https://support.xbert.io/en/articles/14492922-how-to-add-xbert-as-a-custom-mcp-connector-in-claude"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 dark:text-blue-400 hover:underline"
        >
          Read the full guide →
        </a>
      </div>
    </div>
  );
}

function CliPanel({
  snippet,
  showSkipHint,
  hideBundleLink,
}: {
  snippet: string;
  showSkipHint: boolean;
  hideBundleLink: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
          <Terminal size={14} className="text-blue-500 dark:text-blue-400" />
          <span>Run in Claude Code</span>
        </div>
        <CopyButton text={snippet} />
      </div>
      <pre className="p-4 text-[13px] leading-relaxed overflow-x-auto font-mono bg-neutral-50 dark:bg-transparent">
        <code className="text-neutral-900 dark:text-neutral-100">
          {snippet.split("\n").map((line, i) => (
            <span key={i} className="block">
              <span className="text-neutral-400 dark:text-neutral-500 select-none mr-3">
                {String(i + 1).padStart(2, " ")}
              </span>
              {line}
            </span>
          ))}
        </code>
      </pre>
      <div className="px-4 py-2.5 text-[11px] text-neutral-500 border-t border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] flex flex-wrap items-center justify-between gap-2">
        {showSkipHint ? (
          <span>
            Already added the XBert marketplace? Skip line 1. Each{" "}
            <span className="font-mono text-neutral-700 dark:text-neutral-400">/plugin install</span>{" "}
            runs as a separate command.
          </span>
        ) : (
          <span />
        )}
        {!hideBundleLink && (
          <Link
            to="/install"
            className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
          >
            Build a multi-plugin bundle
            <ArrowRight size={11} />
          </Link>
        )}
      </div>
    </div>
  );
}
