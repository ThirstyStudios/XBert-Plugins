import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export interface TabItem {
  /** Stable id, e.g. "claude". */
  id: string;
  /** Tab label, verbatim, e.g. "Claude (web & Desktop)". */
  label: string;
  content: ReactNode;
}

export interface TabGroupProps {
  tabs: TabItem[];
  /** Accessible name for the tablist, e.g. "Connect your assistant". */
  label: string;
  /** id of the initially selected tab. Defaults to the first tab. */
  defaultTab?: string;
  className?: string;
}

/**
 * Accessible tabs (roving tabindex, arrow-key navigation) in the site's card
 * idiom — used for the Get started §3 "Connect your assistant" section.
 *
 *   <TabGroup label="Connect your assistant" tabs={[
 *     { id: "claude", label: "Claude (web & Desktop)", content: <StepFlow variant="list" steps={…} /> },
 *     { id: "claude-code", label: "Claude Code", content: … },
 *     { id: "other", label: "Other MCP-aware assistants", content: … },
 *   ]} />
 */
export function TabGroup({ tabs, label, defaultTab, className = "" }: TabGroupProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  const reduceMotion = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next >= 0) {
      e.preventDefault();
      setActive(tabs[next].id);
      tabRefs.current[next]?.focus();
    }
  }

  return (
    <div
      className={`rounded-2xl border border-black/10 bg-white/70 dark:border-white/10 dark:bg-black/40 overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40 backdrop-blur-sm ${className}`}
    >
      <div
        role="tablist"
        aria-label={label}
        className="flex flex-wrap items-center gap-1 px-2 py-2 border-b border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02]"
      >
        {tabs.map((t, i) => {
          const selected = t.id === activeTab?.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={selected}
              // Only the selected panel is mounted, so an aria-controls on the
              // unselected tabs would point at a non-existent element.
              aria-controls={selected ? `panel-${t.id}` : undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`relative flex-1 basis-full sm:basis-0 whitespace-nowrap px-3 py-2 rounded-lg text-sm transition ${
                selected
                  ? "bg-black/[0.06] text-neutral-900 dark:bg-white/[0.08] dark:text-white font-medium"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.03] dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-white/[0.03]"
              }`}
            >
              {t.label}
              {selected && (
                // Hidden below sm: the tabs stack full-width there, so an
                // underline hung 9px below the button would land on the next tab.
                <motion.span
                  layoutId="tabgroup-underline"
                  className="hidden sm:block absolute inset-x-2 -bottom-[9px] h-px bg-gradient-to-r from-transparent via-xbert-indigo dark:via-xbert-cyan to-transparent"
                />
              )}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab?.id}
          role="tabpanel"
          id={`panel-${activeTab?.id}`}
          aria-labelledby={`tab-${activeTab?.id}`}
          // Some panels hold no focusable content — keep them Tab-reachable.
          tabIndex={0}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="p-6"
        >
          {activeTab?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
