import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

export interface CountUpProps {
  /** Final value, e.g. 200. */
  to: number;
  /** Rendered before the number, e.g. "$". */
  prefix?: string;
  /** Rendered after the number, e.g. " tools" or "+". */
  suffix?: string;
  /** Animation duration in seconds. Default 1.4. */
  duration?: number;
  className?: string;
}

/**
 * Counts up from 0 when scrolled into view (once). Renders the final value
 * immediately under prefers-reduced-motion. Signature use: the "200 tools"
 * stat on Features/Home.
 *
 *   <CountUp to={200} suffix=" tools" className="font-mono" />
 */
export function CountUp({ to, prefix = "", suffix = "", duration = 1.4, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? to : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
