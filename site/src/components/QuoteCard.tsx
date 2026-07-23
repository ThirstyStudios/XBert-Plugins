import { motion } from "motion/react";

export interface QuoteCardProps {
  /** Quote text, verbatim, WITHOUT surrounding quote marks — the component renders them. */
  quote: string;
  /** Attribution name, e.g. "Cath Hopson". */
  name: string;
  /** Firm, e.g. "Hands on Bookkeeping". */
  firm: string;
  /**
   * "card" — testimonial card for grids (Home §8).
   * "pull" — large centred pull-quote (Features, between Areas 05 and 06).
   */
  variant?: "card" | "pull";
  /** Stagger index for whileInView entrance (card variant). */
  index?: number;
  className?: string;
}

/**
 *   <QuoteCard quote="XBert is like having that ultra efficient staff member on board"
 *              name="Cath Hopson" firm="Hands on Bookkeeping" index={0} />
 *   <QuoteCard variant="pull" quote="As the practice manager, …" name="Karen Hirst" firm="KBas" />
 */
export function QuoteCard({
  quote,
  name,
  firm,
  variant = "card",
  index = 0,
  className = "",
}: QuoteCardProps) {
  if (variant === "pull") {
    return (
      <motion.figure
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`max-w-3xl mx-auto text-center py-6 ${className}`}
      >
        {/* No decorative open-quote glyph — the blockquote already carries
            typographic quotes, so a mark here opens the quote twice. */}
        <blockquote className="text-xl md:text-2xl font-medium tracking-tight leading-snug text-neutral-900 dark:text-white">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <figcaption className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          {name} · {firm}
        </figcaption>
      </motion.figure>
    );
  }

  return (
    <motion.figure
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: 0.05 * index, ease: "easeOut" }}
      className={`rounded-2xl border border-black/10 bg-gradient-to-b from-black/[0.03] to-black/[0.01] dark:border-white/10 dark:from-white/[0.04] dark:to-white/[0.01] p-6 flex flex-col ${className}`}
    >
      <blockquote className="flex-1 text-sm md:text-base text-neutral-800 dark:text-neutral-200 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="text-sm font-semibold text-neutral-900 dark:text-white">{name}</div>
        <div className="text-xs text-neutral-600 dark:text-neutral-400">{firm}</div>
      </figcaption>
    </motion.figure>
  );
}
