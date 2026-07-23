import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export interface Step {
  /** Step title, verbatim, e.g. "Point your assistant at XBert". */
  title: string;
  /** Step body — ReactNode so inline `font-mono` spans and links are allowed. */
  body: ReactNode;
}

export interface StepFlowProps {
  steps: Step[];
  /**
   * "grid" — columns with an animated connecting line drawn between the step
   *          numbers (Home "How it works", Features "One question, four moves").
   * "list" — vertical rail with numbered badges (Get started connect tabs).
   * Default "grid".
   */
  variant?: "grid" | "list";
  className?: string;
}

/**
 * Numbered step sequence. The grid variant draws a brand-gradient connection
 * line across the step numbers as it scrolls into view (skipped under
 * prefers-reduced-motion).
 *
 *   <StepFlow steps={[{ title: "Point your assistant at XBert", body: <>…</> }, …]} />
 */
const GRID_COLS: Record<number, string> = {
  1: "",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export function StepFlow({ steps, variant = "grid", className = "" }: StepFlowProps) {
  const reduceMotion = useReducedMotion();

  if (variant === "list") {
    return (
      <ol className={`relative space-y-5 pl-12 ${className}`}>
        <span
          aria-hidden
          className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-black/15 via-black/8 to-transparent dark:from-white/15 dark:via-white/8"
        />
        {steps.map((s, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.3, delay: 0.05 * i }}
            className="relative"
          >
            <span
              aria-hidden
              className="absolute -left-12 top-0 inline-flex items-center justify-center size-9 rounded-full border border-black/15 text-xbert-indigo dark:border-white/15 dark:text-xbert-cyan text-[11px] font-mono font-semibold"
              style={{ backgroundColor: "var(--color-bg-soft)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="text-sm font-semibold text-neutral-900 dark:text-white pt-1">
              {s.title}
            </div>
            <div className="mt-1 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
              {s.body}
            </div>
          </motion.li>
        ))}
      </ol>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Signature moment: connection line drawn across the step numbers. */}
      <motion.span
        aria-hidden
        className="hidden md:block absolute top-[18px] left-[10%] right-[10%] h-px origin-left bg-gradient-to-r from-xbert-indigo/0 via-xbert-indigo/50 to-xbert-cyan/40"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />
      <ol className={`grid grid-cols-1 gap-8 md:gap-6 ${GRID_COLS[Math.min(steps.length, 4)]}`}>
        {steps.map((s, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.12 * i, ease: "easeOut" }}
            className="relative list-none"
          >
            <span
              className="relative inline-flex items-center justify-center size-9 rounded-full border border-black/15 text-xbert-indigo dark:border-white/15 dark:text-xbert-cyan text-[11px] font-mono font-semibold"
              style={{ backgroundColor: "var(--color-bg)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
            <div className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
              {s.body}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
