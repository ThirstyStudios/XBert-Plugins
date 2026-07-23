import { motion } from "motion/react";
import type { ReactNode } from "react";

export interface SectionHeadingProps {
  /** Small uppercase eyebrow above the title (optional). */
  eyebrow?: string;
  /** Heading copy — verbatim from content-spec.md. */
  title: string;
  /** Intro/lead paragraph under the title (optional; ReactNode so links are allowed). */
  lead?: ReactNode;
  /** Heading level. Default "h2". */
  as?: "h1" | "h2" | "h3";
  /** Anchor id for in-page links, e.g. "how-it-works". */
  id?: string;
  /** Centre the block (used on narrow "What is it" style sections). */
  center?: boolean;
  className?: string;
}

const SIZE: Record<NonNullable<SectionHeadingProps["as"]>, string> = {
  h1: "text-5xl md:text-6xl leading-[1.05]",
  h2: "text-3xl md:text-4xl",
  h3: "text-xl md:text-2xl",
};

/**
 * Standard section heading with the site's whileInView entrance.
 *
 *   <SectionHeading
 *     id="how-it-works"
 *     title="Connected in three steps."
 *     lead="…intro body…"
 *   />
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  as = "h2",
  id,
  center = false,
  className = "",
}: SectionHeadingProps) {
  const Tag = as;
  return (
    <motion.div
      id={id}
      // Focusable-by-script so in-page anchors move keyboard focus, not just scroll.
      tabIndex={id ? -1 : undefined}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`scroll-mt-24 ${center ? "text-center mx-auto" : ""} ${className}`}
    >
      {eyebrow && (
        <div className="text-xs uppercase tracking-wider text-xbert-indigo dark:text-xbert-cyan mb-2">
          {eyebrow}
        </div>
      )}
      <Tag className={`font-semibold tracking-tight ${SIZE[as]}`}>{title}</Tag>
      {lead && (
        <p
          className={`mt-3 text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl ${
            center ? "mx-auto" : ""
          }`}
        >
          {lead}
        </p>
      )}
    </motion.div>
  );
}
