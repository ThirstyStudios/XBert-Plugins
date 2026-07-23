import { useReducedMotion } from "motion/react";

export interface HeroMediaProps {
  /** Looping background video, e.g. "/illustrations/hero-ambient.mp4". */
  src: string;
  /** Poster frame — shown while loading and as the reduced-motion fallback. */
  poster: string;
  className?: string;
}

/**
 * Full-bleed ambient hero background: a dimmed looping video under a gradient
 * scrim that fades into the page background so copy stays legible on both
 * themes. The media opacity comes from --hero-media-opacity so the light
 * theme gets a tint rather than a wash. Honours prefers-reduced-motion by
 * rendering the poster image instead of the video.
 *
 * Usage — render as the FIRST child of a `relative overflow-hidden` section;
 * put content above it in a `relative` container:
 *
 *   <section className="relative overflow-hidden">
 *     <HeroMedia src="/illustrations/hero-ambient.mp4" poster="/illustrations/hero-ambient-poster.jpg" />
 *     <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">…</div>
 *   </section>
 */
export function HeroMedia({ src, poster, className = "" }: HeroMediaProps) {
  const reduceMotion = useReducedMotion();
  /* Theme-aware: 0.45 on the dark canvas, 0.16 on the light one — see index.css. */
  const mediaStyle = { opacity: "var(--hero-media-opacity)" };

  return (
    <div aria-hidden className={`absolute inset-0 pointer-events-none ${className}`}>
      {reduceMotion ? (
        <img
          src={poster}
          alt=""
          className="w-full h-full object-cover"
          style={mediaStyle}
        />
      ) : (
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          style={mediaStyle}
        />
      )}
      {/* Scrim: theme-aware, fades the loop into the page background. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-bg) 70%, transparent), color-mix(in srgb, var(--color-bg) 25%, transparent) 45%, var(--color-bg))",
        }}
      />
    </div>
  );
}
