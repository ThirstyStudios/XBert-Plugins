import { motion } from "motion/react";
import { Globe, Plug, KeyRound, Sparkles, ShieldCheck } from "lucide-react";
import { CopyButton } from "./CopyButton";

/**
 * Compact "Make sure the XBert connector is set up" panel.
 * Used as a secondary section beneath the primary plugin-install steps.
 *
 * Default state is collapsed (a one-line summary). Pass `defaultOpen` to expand.
 */
export function MCPConnectorBox({
  defaultOpen = false,
}: {
  defaultOpen?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] overflow-hidden">
      <details open={defaultOpen} className="group">
        <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center size-9 rounded-lg border border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/[0.04]">
              <Plug size={16} className="text-blue-500 dark:text-blue-400" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                You'll also need the XBert MCP connector
              </h3>
              <p className="text-xs text-neutral-700 dark:text-neutral-400 mt-0.5 leading-relaxed">
                The connector is what powers the plugins — without it the slash
                commands can't reach your XBert data. Click to expand the
                4-step setup.
              </p>
            </div>
          </div>
          <span className="flex-shrink-0 text-xs text-neutral-500 group-open:rotate-180 transition-transform">
            ▾
          </span>
        </summary>

        <div className="px-5 pb-6 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
          <ol className="relative space-y-5 pl-9 mt-4">
            <span
              aria-hidden
              className="absolute left-[14px] top-1 bottom-1 w-px bg-gradient-to-b from-black/15 via-black/8 to-transparent dark:from-white/15 dark:via-white/8"
            />

            {STEPS.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -4 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.3, delay: 0.04 * i }}
                className="relative"
              >
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
                    {s.detail}
                  </div>
                  {s.action ? (
                    <div className="flex-shrink-0 mt-1">{s.action}</div>
                  ) : null}
                </div>
              </motion.li>
            ))}
          </ol>

          <div className="mt-5 rounded-xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-3 text-xs text-neutral-700 dark:text-neutral-400 leading-relaxed">
            <ShieldCheck
              size={12}
              className="inline mr-1 -mt-0.5 text-emerald-500 dark:text-emerald-400"
            />
            <span className="text-neutral-900 dark:text-neutral-200 font-medium">
              You must have an active XBert account with access to at least one
              business.
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
      </details>
    </section>
  );
}

const STEPS = [
  {
    icon: <Globe size={14} />,
    title: "Enable network egress",
    body: (
      <>
        In Claude, open{" "}
        <span className="font-mono text-neutral-900 dark:text-neutral-100">
          Settings → Capabilities
        </span>
        , scroll to{" "}
        <span className="font-mono text-neutral-900 dark:text-neutral-100">
          Code execution and file creation
        </span>
        , and turn on{" "}
        <span className="font-mono text-neutral-900 dark:text-neutral-100">
          Allow network egress
        </span>
        . Under{" "}
        <span className="font-mono text-neutral-900 dark:text-neutral-100">
          Domain allowlist
        </span>
        , allow all domains or specifically{" "}
        <span className="font-mono text-neutral-900 dark:text-neutral-100">
          mcp-gateway.xbert.io
        </span>{" "}
        and{" "}
        <span className="font-mono text-neutral-900 dark:text-neutral-100">
          auth.xbert.io
        </span>
        .
      </>
    ),
    action: null as React.ReactNode,
    detail: null as React.ReactNode,
  },
  {
    icon: <Plug size={14} />,
    title: "Add the XBert custom connector",
    body: (
      <>
        Open{" "}
        <span className="font-mono text-neutral-900 dark:text-neutral-100">
          Settings → Integrations
        </span>{" "}
        (or{" "}
        <span className="font-mono text-neutral-900 dark:text-neutral-100">
          Connectors
        </span>
        ) and click{" "}
        <span className="font-mono text-neutral-900 dark:text-neutral-100">
          Add Custom Connector
        </span>
        . Use the values below.
      </>
    ),
    action: (
      <CopyButton text="https://mcp-gateway.xbert.io/mcp" label="Copy URL" />
    ),
    detail: (
      <div className="mt-3 rounded-lg border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.03] px-3 py-2 text-xs font-mono text-neutral-700 dark:text-neutral-300">
        <div>
          <span className="text-neutral-500">Name:</span> XBert
        </div>
        <div>
          <span className="text-neutral-500">Server URL:</span>{" "}
          https://mcp-gateway.xbert.io/mcp
        </div>
      </div>
    ),
  },
  {
    icon: <KeyRound size={14} />,
    title: "Sign in with XBert",
    body: (
      <>
        Save the connector. Claude handles OAuth automatically — sign in with
        your XBert account and select the business or Connect Portal you want
        to work with. Credentials never leave XBert (OAuth 2.1 with PKCE).
      </>
    ),
    action: null,
    detail: null,
  },
  {
    icon: <Sparkles size={14} />,
    title: "You're connected",
    body: (
      <>
        Your AI assistant now has 200+ XBert tools available. The plugins you
        installed above will use these automatically — but you can also ask
        directly:{" "}
        <span className="font-mono text-neutral-900 dark:text-neutral-100">
          Show me aged receivables for this client
        </span>
        .
      </>
    ),
    action: null,
    detail: null,
  },
];
