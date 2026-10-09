import { LETTERS, LOGO_VIEWBOX, TICKS } from "@/lib/logo";

/* Coniston's own lock-up, rebuilt from the live header SVG by scripts/logo.py: the wordmark as 8 letter paths and the
   ring mark as its 30 ticks. Colour comes from currentColor, so one component serves light and dark grounds.
   `build` tags every part with data-part so the preloader can assemble it; otherwise it is a plain image. */
export function Logo({ id, build = false, title = "Coniston" }: { id: string; build?: boolean; title?: string }) {
  const labelled = Boolean(title);
  return (
    <svg className="logo" viewBox={LOGO_VIEWBOX} fill="currentColor" role={labelled ? "img" : undefined}
      aria-labelledby={labelled ? `${id}-t` : undefined} aria-hidden={labelled ? undefined : true} focusable="false">
      {labelled && <title id={`${id}-t`}>{title}</title>}
      {build && <clipPath id={`${id}-base`}><rect x="0" y="-4" width="220" height="34" /></clipPath>}
      {/* When built, the letters rise from behind the baseline: the clip is the wordmark's own box. */}
      <g data-part="word" clipPath={build ? `url(#${id}-base)` : undefined}>
        {LETTERS.map((d, i) => <path key={i} d={d} data-part={build ? "letter" : undefined} />)}
      </g>
      <g data-part="mark">
        {TICKS.map((d, i) => <path key={i} d={d} data-part={build ? "tick" : undefined} />)}
      </g>
    </svg>
  );
}

/* The ring mark alone, cropped to its own box (used large in the preloader and as the button badge). */
export function Mark({ className, build = false }: { className?: string; build?: boolean }) {
  return (
    <svg className={className} viewBox="203.35 2.37 12.4 12.4" fill="currentColor" aria-hidden="true" focusable="false">
      {TICKS.map((d, i) => <path key={i} d={d} data-part={build ? "tick" : undefined} />)}
    </svg>
  );
}
