"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { getLenis, setLenis } from "@/lib/scroll";
import { splitWords } from "@/lib/split";

gsap.registerPlugin(ScrollTrigger);

/* The curve family, from somerstone.com.au (the motion reference):
     EASE     "expo.out"  = Somerstone's Lenis easing, (t) => 1 - Math.pow(2, -10 * t). Everything that settles.
              The CSS twin is --ease-out: cubic-bezier(.19,1,.22,1) in globals.css.
     EASE_IO  "power3.inOut"  frames and curtains that open (the preloader exit, image clip reveals)
     EASE_IN  "power3.out"    Somerstone's own loader letters (y 40, .8s, stagger .08), used by the preloader */
export const EASE = "expo.out";
export const EASE_IO = "power3.inOut";
export const EASE_LETTER = "power3.out";

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Handover from the preloader: the hero, header and scroll wait for this.
export const INTRO_DONE = "intro:done";
export const introDone = () => document.documentElement.dataset.intro === "done";
export function onIntro(fn: () => void) {
  if (introDone()) { fn(); return () => {}; }
  window.addEventListener(INTRO_DONE, fn, { once: true });
  return () => window.removeEventListener(INTRO_DONE, fn);
}

/* Page-wide behaviour:
   - the link guard: a private demo, so links keep their real conistonltd.co.uk hrefs (the link check verifies them)
     but never leave the page. "#" links scroll through Lenis instead.
   - Lenis on the GSAP ticker, synced with ScrollTrigger, stopped while the preloader, the menu or the film is open
   - the reveal vocabulary, declared in markup with data-reveal (the table in README.md):
       head       a heading: the whole phrase fades and rises once
       statement  the intro statement: Somerstone's ".reveal-type", words brighten from 20% as you scroll past
       text       a paragraph: its words rise out of a line mask
       label      labels, buttons and small lines: a short fade and rise
       cards      a list: its children rise in batches as they arrive
       image      a frame that opens upward from its bottom edge; an <img data-parallax> inside drifts about 10%
     Anything inside [data-late] (the later sections) plays at 0.75 of the duration. */
export function Motion() {
  useEffect(() => {
    const guard = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      e.preventDefault();
      if (!href.startsWith("#")) return;
      const target = href === "#top" ? 0 : document.querySelector<HTMLElement>(href);
      if (target === null) return;
      const lenis = getLenis();
      // A link inside the menu fires while the menu still has Lenis stopped; start() first so this scroll survives.
      if (lenis) { lenis.start(); lenis.scrollTo(target as HTMLElement | number, { duration: 1.4 }); }
      else if (typeof target === "number") window.scrollTo({ top: 0 });
      else target.scrollIntoView();
      if (typeof target !== "number") target.focus?.({ preventScroll: true });
    };
    document.addEventListener("click", guard, true);
    document.addEventListener("auxclick", guard, true);
    const unguard = () => { document.removeEventListener("click", guard, true); document.removeEventListener("auxclick", guard, true); };

    if (reducedMotion()) return unguard;

    // Somerstone runs Lenis with duration 1.5 and the expo curve. lerp .12 is used instead: a fixed duration read
    // as a "jump" at the bottom of the page on an earlier demo, and lerp keeps the same glide without it.
    const lenis = new Lenis({ lerp: 0.12 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (document.documentElement.classList.contains("is-loading")) lenis.stop();

    const ctx = gsap.context(() => {
      const pace = (el: Element) => (el.closest("[data-late]") ? 0.75 : 1);
      const once = (el: Element, start = "top 88%") => ({ trigger: el, start, once: true });

      gsap.utils.toArray<HTMLElement>('[data-reveal="head"]').forEach((el) => {
        gsap.fromTo(el, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2 * pace(el), ease: EASE, scrollTrigger: once(el) });
      });

      // Somerstone's reveal-type, measured from its inline script: opacity from .2, start "top 90%", end "top 10%",
      // scrubbed. It splits by character; here it is by word (no per-character effects outside the intro), and it
      // ends at "top 25%" so the statement is fully lit while it still sits mid-screen.
      gsap.utils.toArray<HTMLElement>('[data-reveal="statement"]').forEach((el) => {
        const words = splitWords(el);
        gsap.set(el, { autoAlpha: 1 });
        gsap.fromTo(words, { opacity: 0.2 }, { opacity: 1, ease: "none", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 90%", end: "top 25%", scrub: true } });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="text"]').forEach((el) => {
        const words = splitWords(el);
        gsap.set(el, { autoAlpha: 1 });
        gsap.fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 1.1 * pace(el), ease: EASE, stagger: 0.006, scrollTrigger: once(el) });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="label"]').forEach((el) => {
        gsap.fromTo(el, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 * pace(el), ease: EASE, scrollTrigger: once(el, "top 94%") });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="cards"]').forEach((list) => {
        const items = Array.from(list.children) as HTMLElement[];
        gsap.set(list, { autoAlpha: 1 });
        gsap.set(items, { y: 36, autoAlpha: 0 });
        ScrollTrigger.batch(items, {
          start: "top 92%", once: true,
          onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1.1 * pace(list), ease: EASE, stagger: 0.08, clearProps: "transform" }),
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="image"]').forEach((el) => {
        gsap.set(el, { autoAlpha: 1 });
        gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3 * pace(el), ease: EASE_IO, scrollTrigger: once(el, "top 90%") });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
        const amount = Number(img.dataset.parallax) || 5; // yPercent each way: about 10% of travel in all
        gsap.fromTo(img, { yPercent: -amount, scale: 1.12 }, {
          yPercent: amount, scale: 1.12, ease: "none",
          scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });
    document.documentElement.classList.add("motion-ready");

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      unguard();
      window.removeEventListener("load", refresh);
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
