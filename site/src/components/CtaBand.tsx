import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export interface CtaLink {
  label: string;
  /** Internal route (react-router Link). Provide exactly one of to/href. */
  to?: string;
  /** External URL (opens in a new tab). */
  href?: string;
}

export interface CtaBandProps {
  /** Band heading, verbatim, e.g. "Your assistant is ready when you are." */
  heading: string;
  /** Optional body line under the heading. */
  body?: string;
  primary: CtaLink;
  secondary?: CtaLink;
  /** Extra content under the CTAs — e.g. <AddressChip /> on Home §10. */
  children?: ReactNode;
  /** Optional decorative background illustration (e.g. "/illustrations/hero-network-b.svg"). */
  backgroundSrc?: string;
  className?: string;
}

function CtaAnchor({ link, kind }: { link: CtaLink; kind: "primary" | "secondary" }) {
  const cls =
    kind === "primary"
      ? "group inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-xbert-indigo/20 ring-1 ring-black/10 dark:ring-white/40 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition"
      : "inline-flex items-center gap-2 rounded-md border border-black/15 bg-black/[0.03] text-neutral-900 hover:bg-black/[0.06] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] dark:hover:border-white/25 px-5 py-2.5 text-sm font-medium transition";
  const arrow =
    kind === "primary" ? (
      <ArrowRight
        size={16}
        strokeWidth={2.5}
        className="transition-transform group-hover:translate-x-0.5"
      />
    ) : null;
  if (link.to) {
    return (
      <Link to={link.to} className={cls}>
        {link.label}
        {arrow}
      </Link>
    );
  }
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {link.label}
      {arrow}
    </a>
  );
}

/**
 * Final call-to-action band — centred heading, primary/secondary CTAs and an
 * optional child row (address chip, microcopy).
 *
 *   <CtaBand
 *     heading="Your assistant is ready when you are."
 *     body="One address, one sign-in, and the books are a question away."
 *     primary={{ label: "Connect your assistant", to: "/get-started" }}
 *     secondary={{ label: "Read the setup guide", href: SETUP_GUIDE_URL }}
 *   >
 *     <AddressChip />
 *   </CtaBand>
 */
export function CtaBand({
  heading,
  body,
  primary,
  secondary,
  children,
  backgroundSrc,
  className = "",
}: CtaBandProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-3xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] px-6 py-12 md:px-12 md:py-16 text-center ${className}`}
    >
      {backgroundSrc && (
        <img
          src={backgroundSrc}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.06] dark:opacity-[0.18] pointer-events-none [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_10%,black_75%)]"
        />
      )}
      <div className="relative">
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">{heading}</h2>
        {body && (
          <p className="mt-3 text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-xl mx-auto">
            {body}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <CtaAnchor link={primary} kind="primary" />
          {secondary && <CtaAnchor link={secondary} kind="secondary" />}
        </div>
        {children && <div className="mt-6 flex justify-center">{children}</div>}
      </div>
    </motion.div>
  );
}
