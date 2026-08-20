import { motion } from "motion/react";
import type { ReactNode } from "react";
import { AskPrompt } from "./AskPrompt";
import { Chip } from "./Chip";

export interface CapabilityCardProps {
  /** Anchor id for deep links, e.g. "receivables". Adds scroll-mt for the sticky header. */
  id?: string;
  /** Eyebrow — area name, e.g. "Area 01 — Invoices, quotes & receivables" or a cluster name. */
  eyebrow?: string;
  /** Job-led heading, verbatim, e.g. "Get paid sooner." */
  title: string;
  /** Body copy, verbatim. */
  body: string;
  /** Optional "Ask it" prompts (verbatim, no surrounding quotes). */
  prompts?: string[];
  /** Render the `Makes changes — flagged for approval` chip. */
  approveChip?: boolean;
  /** Optional lucide icon (size 18) for cluster cards on Home. */
  icon?: ReactNode;
  /** Stagger index for whileInView entrance. */
  index?: number;
  className?: string;
}

/**
 * Capability area card — used for the 11 Features areas (with prompts) and
 * the 4 Home cluster cards (with icon, no prompts).
 *
 *   <CapabilityCard
 *     id="receivables"
 *     eyebrow="Area 01 — Invoices, quotes & receivables"
 *     title="Get paid sooner."
 *     body="Every invoice, quote, credit note…"
 *     prompts={["Show me aged receivables for Harbour Landscaping — who's worst?"]}
 *   />
 */
export function CapabilityCard({
  id,
  eyebrow,
  title,
  body,
  prompts,
  approveChip = false,
  icon,
  index = 0,
  className = "",
}: CapabilityCardProps) {
  return (
    <motion.section
      id={id}
      // Focusable-by-script so the area jump links move keyboard focus, not just scroll.
      tabIndex={id ? -1 : undefined}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: 0.05 * index, ease: "easeOut" }}
      className={`scroll-mt-24 rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6 md:p-8 ${className}`}
    >
      {icon && (
        <div className="inline-flex items-center justify-center size-9 rounded-lg border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.06] mb-4">
          {icon}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {/* Sentence case, not uppercase: "Bills, POs & payables" upper-cases to
            "POS", which an accounting reader parses as point-of-sale. */}
        {eyebrow && (
          <div className="text-xs tracking-wider text-xbert-indigo dark:text-xbert-cyan">
            {eyebrow}
          </div>
        )}
        {approveChip && <Chip variant="accent">Makes changes — flagged for approval</Chip>}
      </div>
      <h3 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl">
        {body}
      </p>
      {prompts && prompts.length > 0 && (
        <div className="mt-6">
          <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            Ask it
          </div>
          <div className="space-y-2">
            {prompts.map((p, i) => (
              <AskPrompt key={p} text={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
