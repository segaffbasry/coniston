import type { ReactNode } from "react";
import { Mark } from "@/components/Logo";
import { brandIcons } from "@/lib/brand-icons";

const glyphs = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  out: <path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  left: <path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />,
  pause: <path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" />,
  close: <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
  plus: <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
};

export type IconName = keyof typeof glyphs | keyof typeof brandIcons;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const brand = (brandIcons as Record<string, string>)[name];
  return (
    <svg className={`icon ${className ?? ""}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {brand ? <path d={brand} fill="currentColor" /> : glyphs[name as keyof typeof glyphs]}
    </svg>
  );
}

// Outbound links open in a new tab (the link guard in components/Motion.tsx stops them navigating in this demo).
const outside = (href: string) => !href.startsWith("#") && !href.startsWith("tel:") && !href.startsWith("mailto:");
export const external = (href: string) => (outside(href) ? { target: "_blank", rel: "noopener" } : {});

/* The copied interaction: quintadamalia.com's hero "Say Hello" button (.tp-btn-black-2 in the Liko theme's
   liko-core.css, fetched 9 October 2026), rebuilt as is:
     shape    height 50px, padding 0 30px, border-radius 40px, 2px border (transparent at rest), 16px / 500 /
              letter-spacing .03em; the badge sits 12px after the label
     timing   transition: all .3s (the CSS default curve, ease)
     rest     filled: background black, text white; badge: a 30px seal in white with a black 10px arrow on top
     hover    background transparent, text black, border black; the arrow turns white and the seal (now black,
              it is currentColor) turns once every 10s: animation rotate2 10s linear infinite
     dark     on dark grounds (.liko-dark-active) the same rules with the colours swapped
   Two substitutions: Navy and White stand in for Quinta's #1E1E1E and #F5F7F5, and the seal is Coniston's own
   ring of ticks in place of the theme's scalloped rosette. The ring is open, not a solid disc, so the arrow takes
   the label colour in both states instead of inverting against the seal. Keyboard focus shows the hover state
   plus an outline. Styles: "copied interaction" in globals.css. */
type Tone = "navy" | "white";
export function Button({ href, children, tone = "navy", className, onClick, ...rest }: {
  href?: string; children: ReactNode; tone?: Tone; className?: string; onClick?: () => void; "aria-haspopup"?: "dialog";
}) {
  const cls = `btn btn-${tone} ${className ?? ""}`;
  const inner = (
    <>
      <span className="btn-label">{children}</span>
      <span className="btn-badge" aria-hidden="true">
        <span className="btn-seal"><Mark /></span>
        <svg className="btn-arrow" width="10" height="10" viewBox="0 0 10 10"><path d="M1 5h7.2M5 1.6 8.4 5 5 8.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </>
  );
  if (!href) return <button type="button" className={cls} onClick={onClick} {...rest}>{inner}</button>;
  return <a className={cls} href={href} {...external(href)}>{inner}</a>;
}

/* A text link with an arrow: a hairline grows under the label and the arrow nudges right. */
export function MoreLink({ href, children, icon = "arrow", className }: { href: string; children: ReactNode; icon?: IconName; className?: string }) {
  return (
    <a className={`more ${className ?? ""}`} href={href} {...external(href)}>
      <span className="uline-text">{children}</span><Icon name={icon} />
    </a>
  );
}
