"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Logo, Mark } from "@/components/Logo";
import { EASE, EASE_IO, EASE_LETTER, INTRO_DONE, reducedMotion } from "@/components/Motion";
import { MARK_CENTRE } from "@/lib/logo";
import { getLenis } from "@/lib/scroll";

const DIAL_UNITS = 12.4; // the Mark's viewBox width, in the lock-up's own units

/* The company signing its name, built from the real logo (components/Logo.tsx). Coniston's mark is a ring of 30
   ticks, so it is drawn the way a dial fills: the ticks arrive one by one, clockwise from the gap, while the number
   in the ring counts to 100. That ring is the progress element (clients asked for loaders they notice). Then it
   shrinks into its place beside the wordmark as the letters rise into view from behind a baseline mask, and the
   finished lock-up flies into the header. The ground is Stone, the hero's own ground, so nothing jumps.
   One timeline, about 2.35s:
     0.00 to 1.35  ticks, 35ms apart (each fades in and settles from 60% scale), counter 00 to 100
     1.30 to 1.80  the ring moves and shrinks to the lock-up's mark position; the counter fades
     1.25 to 1.80  "Coniston", 8 letters, rise 45ms apart (Somerstone's loader letters: power3.out)
     1.80          the small ring takes over from the large one
     1.80 to 2.35  exit: the lock-up flies into the header logo while the ground fades off the hero;
                   the handover fires at 1.80 so the hero's entrance overlaps it
   The stage stays hidden until its parts are set, so the finished logo never flashes before the build.
   Plays on every load; skipped with reduced motion; hidden without JavaScript; never holds the page past ~3s. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    let handed = false;
    const handover = () => {
      if (handed) return; handed = true;
      html.classList.remove("is-loading");
      html.dataset.intro = "done";
      getLenis()?.start();
      window.dispatchEvent(new Event(INTRO_DONE));
    };
    if (!el || !html.classList.contains("is-loading") || reducedMotion()) {
      if (el) el.style.display = "none";
      html.classList.add("logo-landed");
      handover();
      return;
    }
    window.scrollTo(0, 0);
    const q = (s: string) => el.querySelectorAll(s);
    const dial = el.querySelector<HTMLElement>(".pl-dial")!;
    const lockup = el.querySelector<HTMLElement>(".pl-logo")!;
    const counter = el.querySelector<HTMLElement>(".pl-count")!;

    // Where the ring sits inside the lock-up, measured when the move starts.
    const toMark = () => {
      const svg = lockup.querySelector("svg")!.getBoundingClientRect();
      const unit = svg.width / 220;
      const d = dial.getBoundingClientRect();
      return {
        x: svg.left + MARK_CENTRE.x * unit - (d.left + d.width / 2),
        y: svg.top + MARK_CENTRE.y * unit - (d.top + d.height / 2),
        scale: (DIAL_UNITS * unit) / d.width,
      };
    };
    const toHeader = () => {
      const target = document.querySelector<HTMLElement>(".header-logo .logo");
      if (!target) return { x: 0, y: -80, scale: 0.3 };
      const a = lockup.getBoundingClientRect(), b = target.getBoundingClientRect();
      return { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: b.width / a.width };
    };
    const progress = { v: 0 };
    const move = { x: 0, y: 0, scale: 1 };

    gsap.set(q('.pl-dial [data-part="tick"]'), { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" });
    gsap.set(q('.pl-logo [data-part="letter"]'), { y: 30 });
    gsap.set(q('.pl-logo [data-part="mark"]'), { autoAlpha: 0 });
    el.classList.add("is-ready");

    const tl = gsap.timeline({ onComplete: () => { el.style.display = "none"; html.classList.add("logo-landed"); } });
    tl.add(() => el.classList.add("is-active"), 0)
      .to(progress, { v: 100, duration: 1.3, ease: "power1.inOut", onUpdate: () => { counter.textContent = String(Math.round(progress.v)).padStart(2, "0"); } }, 0)
      .to(q('.pl-dial [data-part="tick"]'), { autoAlpha: 1, scale: 1, duration: 0.3, ease: EASE, stagger: 0.035 }, 0.02)
      .to(counter, { autoAlpha: 0, duration: 0.2, ease: "none" }, 1.3)
      .add(() => Object.assign(move, toMark()), 1.3)
      .to(dial, { x: () => move.x, y: () => move.y, scale: () => move.scale, duration: 0.5, ease: EASE_IO }, 1.3)
      .to(q('.pl-logo [data-part="letter"]'), { y: 0, duration: 0.55, ease: EASE_LETTER, stagger: 0.045 }, 1.25)
      .set(q('.pl-logo [data-part="mark"]'), { autoAlpha: 1 }, 1.8)
      .set(dial, { autoAlpha: 0 }, 1.8)
      .add(handover, 1.8)
      // Measured when the exit starts (tweens initialise lazily), so late layout shifts are accounted for.
      .to(lockup, { x: () => toHeader().x, y: () => toHeader().y, scale: () => toHeader().scale, duration: 0.55, ease: EASE_IO }, 1.8)
      .to(q(".pl-ground"), { autoAlpha: 0, duration: 0.5, ease: "power1.out" }, 1.85);

    // Never hold the page for long: if the tab was hidden or throttled, finish anyway.
    const failsafe = window.setTimeout(() => { tl.progress(1); }, 3200);
    return () => { window.clearTimeout(failsafe); tl.kill(); };
  }, []);

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="pl-ground" />
      <div className="pl-stage">
        <div className="pl-logo"><Logo id="pl" build title="" /></div>
        <div className="pl-dial">
          <Mark build />
          <span className="pl-count">00</span>
        </div>
      </div>
    </div>
  );
}
