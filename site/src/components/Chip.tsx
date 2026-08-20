import type { ReactNode } from "react";

export interface ChipProps {
  children: ReactNode;
  /**
   * "default" — neutral pill (badges, chip rows).
   * "accent"  — brand-tinted pill (e.g. `Makes changes — flagged for approval`).
   */
  variant?: "default" | "accent";
  /** Optional leading icon (lucide, size 12). */
  icon?: ReactNode;
  className?: string;
}

/**
 * Small pill chip, matching the existing badge idiom.
 *
 *   <Chip icon={<Sparkles size={12} />}>200 tools · Works with Claude and Claude Code · ChatGPT with extra setup</Chip>
 *   <Chip variant="accent">Makes changes — flagged for approval</Chip>
 */
export function Chip({ children, variant = "default", icon, className = "" }: ChipProps) {
  const styles =
    variant === "accent"
      ? "border-xbert-indigo/30 bg-xbert-indigo/10 text-xbert-indigo dark:border-xbert-cyan/20 dark:bg-xbert-cyan/[0.06] dark:text-xbert-cyan"
      : "border-black/10 bg-black/[0.04] text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${styles} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
