import { motion } from "motion/react";
import { CopyButton } from "./CopyButton";

export interface AskPromptProps {
  /** The example prompt, verbatim, WITHOUT surrounding quotes — the component renders them. */
  text: string;
  /** Stagger index for the whileInView cascade. */
  index?: number;
  className?: string;
}

/**
 * An "Ask it" example prompt — chat-style monospace bubble with a copy
 * affordance. The copy button copies the raw prompt (no quote marks).
 *
 *   <AskPrompt text="Who owes us the most right now, across every client?" index={i} />
 */
export function AskPrompt({ text, index = 0, className = "" }: AskPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.35, delay: 0.05 * index, ease: "easeOut" }}
      className={`group flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.03] px-4 py-3 ${className}`}
    >
      <span className="font-mono text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
        <span aria-hidden className="select-none mr-2 text-xbert-indigo dark:text-xbert-cyan">
          ›
        </span>
        &ldquo;{text}&rdquo;
      </span>
      <span className="flex-shrink-0 opacity-100 md:opacity-70 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <CopyButton text={text} />
      </span>
    </motion.div>
  );
}
