import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MousePointerClick,
  RefreshCw,
  Search,
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
  slugs,
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
          label="Claude-Cowork"
          sublabel="Desktop"
        />
        <TabButton
          active={mode === "claude-code"}
          onClick={() => setMode("claude-code")}
          icon={<Terminal size={13} />}
          label="Claude-Cowork"
          sublabel="CLI"
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
            <DesktopPluginWalkthrough slugCount={slugs.length} />
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

      {/* Skill-included callout */}
      <div className="mx-6 mb-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] dark:border-emerald-400/15 dark:bg-emerald-400/[0.04] p-4 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 font-semibold text-xs uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-400/15 dark:bg-emerald-400/10">New</span>
          <div>
            <span className="font-semibold text-neutral-900 dark:text-white">
              Installing the plugin loads its skill too
            </span>
            <p className="mt-1">
              The plugin auto-loads its slash command and its skill (<span className="font-mono text-neutral-900 dark:text-neutral-100">skills/{"{name}"}/SKILL.md</span>) — no
              separate skill upload needed.
            </p>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-500">
              Advanced: just want the skill? Upload its <span className="font-mono">SKILL.md</span> via Customize → Skills.
            </p>
          </div>
        </div>
      </div>
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

function DesktopPluginWalkthrough({ slugCount }: { slugCount: number }) {
  const steps = [
    {
      icon: <MousePointerClick size={14} />,
      title: "Open Customize in Claude-Cowork",
      body: (
        <>
          In Claude-Cowork, open the{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">Customize</span>{" "}
          panel. In the sidebar you&apos;ll see{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">Skills</span>,{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">Connectors</span>, and{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">Personal plugins</span>.
        </>
      ),
    },
    {
      icon: <Search size={14} />,
      title: "Add the XBert marketplace",
      body: (
        <>
          Next to{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">Personal plugins</span>{" "}
          click <span className="font-mono text-neutral-900 dark:text-neutral-100">+</span> →{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">Create plugin</span> →{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">Add marketplace</span>.
          Paste the repo and click{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">Sync</span>.
        </>
      ),
      action: (
        <CopyButton text="ThirstyStudios/XBert-Plugins" label="Copy repo" />
      ),
    },
    {
      icon: <ShieldCheck size={14} />,
      title:
        slugCount > 1
          ? "Install only the plugins you want"
          : "Install the plugin",
      body: (
        <>
          The XBert marketplace appears under{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">Personal plugins</span>
          {slugCount > 1 ? ` with all ${slugCount} plugins listed.` : "."} Click{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">+</span> on each one
          you want — skip the rest. Authorize the permissions prompt.
        </>
      ),
    },
    {
      icon: <RefreshCw size={14} />,
      title: "Turn on auto-update",
      body: (
        <>
          Third-party marketplaces don&apos;t auto-update by default. To get new
          plugin versions automatically, run{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">/plugin</span> in any
          Claude chat →{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">Marketplaces</span> →
          select <span className="font-mono text-neutral-900 dark:text-neutral-100">XBert</span> →{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">Enable auto-update</span>.
          Updates refresh on Claude startup; you&apos;ll be prompted to run{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">/reload-plugins</span>
          {" "}when anything changes.
        </>
      ),
    },
    {
      icon: <Sparkles size={14} />,
      title: "Use the slash commands",
      body: (
        <>
          Skills and slash commands auto-load. Type{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">/anomaly-review</span>,{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">/bas-prep</span>,{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">/aged-receivables</span>,{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">/pulse</span>, or{" "}
          <span className="font-mono text-neutral-900 dark:text-neutral-100">/capacity</span> in any
          Claude chat.
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
            {/* Icon badge */}
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
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {s.title}
                </div>
                <div className="mt-1 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
                  {s.body}
                </div>
              </div>
              {"action" in s && s.action ? (
                <div className="flex-shrink-0 mt-1">{s.action}</div>
              ) : null}
            </div>
          </motion.li>
        ))}
      </ol>

      {/* Distribution note */}
      <div className="mt-6 rounded-xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-4 text-xs text-neutral-700 dark:text-neutral-400 leading-relaxed">
        <span className="text-neutral-900 dark:text-neutral-200 font-medium">
          Rolling out to a whole firm?
        </span>{" "}
        Each user adds the marketplace once on their own Claude-Cowork app. On{" "}
        <span className="text-neutral-900 dark:text-neutral-200">
          Claude Team or Enterprise
        </span>
        , an admin can sync it once in{" "}
        <span className="font-mono text-neutral-700 dark:text-neutral-300">
          Settings → Organization → Plugins
        </span>{" "}
        and every member gets it automatically.
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
          <span>Run in Claude-Cowork CLI</span>
        </div>
        <CopyButton text={snippet} />
      </div>
      <pre className="p-4 text-[13px] leading-relaxed overflow-x-auto font-mono bg-neutral-50 dark:bg-transparent">
        <code className="text-neutral-900 dark:text-neutral-100">
          {snippet.split("\n").map((line, i) => (
            <span key={i} className="block">
              <span className="text-neutral-500 dark:text-neutral-500 select-none mr-3">
                {String(i + 1).padStart(2, " ")}
              </span>
              {line}
            </span>
          ))}
        </code>
      </pre>
      <div className="px-4 py-2.5 text-[11px] text-neutral-600 dark:text-neutral-500 border-t border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] flex flex-wrap items-center justify-between gap-2">
        {showSkipHint ? (
          <span>
            Already added the XBert marketplace? Skip line 1. Each{" "}
            <span className="font-mono text-neutral-700 dark:text-neutral-400">
              /plugin install
            </span>{" "}
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
