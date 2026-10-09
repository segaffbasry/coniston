"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { EASE, EASE_IO, onIntro, reducedMotion } from "@/components/Motion";
import { Icon, external } from "@/components/ui";
import { contact, footer, menu, sectionLinks } from "@/lib/content";
import { getLenis } from "@/lib/scroll";

/* Full-screen menu on Navy. The panel wipes down from the top edge (EASE_IO), then the live site's menu rises in one
   line after another (EASE). One GSAP timeline in, the same timeline reversed out. Focus is trapped inside (the
   header toggle, now "Close", is part of the trap), Esc closes, focus returns to the toggle. "Home" scrolls to the
   top through Lenis; every other item is the real page on conistonltd.co.uk. */
function Menu({ open, close }: { open: boolean; close: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const t = gsap.timeline({ paused: true, onReverseComplete: () => { el.style.visibility = "hidden"; } });
    t.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: EASE_IO }, 0)
      // opacity, not autoAlpha: the links must be focusable the moment the menu opens.
      .fromTo(el.querySelectorAll("[data-menu-in]"), { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: EASE, stagger: 0.04 }, 0.35);
    tl.current = t;
    return () => { t.kill(); };
  }, []);

  useEffect(() => {
    const el = root.current, t = tl.current; if (!el || !t) return;
    const lenis = getLenis();
    if (open) {
      el.style.visibility = "visible";
      t.timeScale(reducedMotion() ? 100 : 1).play();
      lenis?.stop();
      const focusables = () => [document.querySelector<HTMLElement>(".menu-toggle"), ...Array.from(el.querySelectorAll<HTMLElement>("a[href], button"))].filter((f): f is HTMLElement => !!f);
      focusables()[1]?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") { close(); return; }
        if (e.key !== "Tab") return;
        const f = focusables(), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
    if (t.progress() > 0) { lenis?.start(); t.timeScale(reducedMotion() ? 100 : 1.5).reverse(); }
  }, [open, close]);

  // "#" links close the menu first, then the page scrolls (the link guard in Motion does the scrolling).
  const onClick = (e: React.MouseEvent) => { if ((e.target as Element).closest('a[href^="#"]')) close(); };
  const big = menu.filter((m) => !m.children);
  const groups = menu.filter((m) => m.children);

  return (
    <div className="menu on-dark" id="site-menu" ref={root} role="dialog" aria-modal="true" aria-label="Menu" inert={!open} data-lenis-prevent onClick={onClick}>
      <div className="menu-inner wrap">
        <nav aria-label="Main" className="menu-main">
          <ul className="menu-big">
            {big.map((m) => <li key={m.label}><a href={m.href} {...external(m.href)} data-menu-in>{m.label}</a></li>)}
          </ul>
          <div className="menu-groups">
            {groups.map((g) => (
              <div key={g.label} className="menu-group" data-menu-in>
                <a className="menu-group-head" href={g.href} {...external(g.href)}>{g.label}</a>
                <ul>{g.children!.map((c) => <li key={c.href}><a className="uline" href={c.href} {...external(c.href)}>{c.label}</a></li>)}</ul>
              </div>
            ))}
          </div>
        </nav>
        <div className="menu-foot" data-menu-in>
          <a className="menu-strong" href={contact.phone.href}>{contact.phone.label}</a>
          <a className="uline" href={contact.email.href}>{contact.email.label}</a>
          <a className="menu-social" href={footer.linkedin} aria-label="Coniston on LinkedIn" {...external(footer.linkedin)}><Icon name="linkedin" /></a>
        </div>
      </div>
    </div>
  );
}

/* After quintadamalia.com's header: the logo on the left, the sections in a floating white pill in the middle, and
   (in place of Quinta's social buttons) the Menu toggle on the right. No bar behind it. The logo and toggle take
   their colour from the ground under them (sections declare data-tone="dark"); the whole header slides away on the
   way down and returns on the way up. The pill is solid white, not frosted: no backdrop blur over moving film. */
export function Header() {
  const [open, setOpen] = useState(false);
  // Kept in state, not added with classList: React rewrites className on every render (opening the menu is one).
  const [entered, setEntered] = useState(false);
  const [tone, setTone] = useState<"dark" | "light">("light");
  const bar = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => { setOpen(false); toggle.current?.focus(); }, []);

  useEffect(() => {
    const el = bar.current; if (!el) return;
    let last = window.scrollY, frame = 0;
    const tones = () => Array.from(document.querySelectorAll<HTMLElement>("[data-tone]"));
    const update = () => {
      frame = 0;
      const y = window.scrollY, d = y - last;
      const probe = 40;
      const under = tones().filter((s) => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; }).pop();
      setTone(under?.dataset.tone === "dark" ? "dark" : "light");
      if (y < 120) { el.classList.remove("is-hidden"); last = y; return; }
      if (Math.abs(d) < 6) return;
      el.classList.toggle("is-hidden", d > 0);
      last = y;
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", queue, { passive: true });
    update();
    const off = onIntro(() => setEntered(true));
    return () => { window.removeEventListener("scroll", queue); cancelAnimationFrame(frame); off(); };
  }, []);

  useEffect(() => { if (open) bar.current?.classList.remove("is-hidden"); }, [open]);

  const dark = open || tone === "dark";
  return (
    <>
      <header className={`site-header ${dark ? "on-dark" : "on-light"}${entered ? " is-in" : ""}${open ? " is-open" : ""}`} ref={bar}>
        <a href="#top" className="header-logo" aria-label="Coniston, back to the top"><Logo id="hd" title="" /></a>
        <nav className="header-pill" aria-label="Sections">
          {sectionLinks.map((s) => <a key={s.href} href={s.href}>{s.label}</a>)}
        </nav>
        <div className="header-right">
          <a className="header-call" href={contact.phone.href}>{contact.phone.label}</a>
          <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="site-menu" onClick={() => (open ? close() : setOpen(true))}>
            <span>{open ? "Close" : "Menu"}</span>
            <span className="menu-toggle-icon" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </header>
      <Menu open={open} close={close} />
    </>
  );
}
