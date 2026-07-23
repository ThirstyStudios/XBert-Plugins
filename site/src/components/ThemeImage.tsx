type Props = {
  /** Artwork drawn for the light canvas. */
  lightSrc: string;
  /** Artwork drawn for the dark canvas. */
  darkSrc: string;
  width: number;
  height: number;
  className?: string;
  loading?: "lazy" | "eager";
};

/**
 * A decorative illustration that has a light and a dark variant.
 *
 * Both are rendered and swapped with CSS rather than picked in JS: the pages
 * are prerendered, so a JS-chosen src would bake the dark artwork into the
 * static HTML and flash it at light-theme readers before hydration.
 *
 * Purely decorative, so both images are aria-hidden with an empty alt — the
 * surrounding copy carries the meaning.
 */
export function ThemeImage({
  lightSrc,
  darkSrc,
  width,
  height,
  className = "",
  loading = "lazy",
}: Props) {
  const shared = {
    alt: "",
    "aria-hidden": true,
    width,
    height,
    loading,
    decoding: "async" as const,
  };
  return (
    <>
      <img {...shared} src={lightSrc} className={`${className} dark:hidden`} />
      <img {...shared} src={darkSrc} className={`${className} hidden dark:block`} />
    </>
  );
}
