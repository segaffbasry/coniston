"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { EASE, onIntro, reducedMotion } from "@/components/Motion";
import { FilmDialog } from "@/components/home/FilmDialog";
import { Button, Icon, MoreLink } from "@/components/ui";
import { hero } from "@/lib/content";

/* After quintadamalia.com's hero: the statement centred on a pale ground, the pill button under it, and a curved
   ribbon of images below, as if seen from inside a gallery. Quinta curves a row of stills; here the middle frame is
   Coniston's own showreel (muted loop, pause control, paused off-screen, local poster) and the frames either side
   are the stills from the live hero carousel. The ribbon is real 3D: each frame turns towards the centre and the
   outer ones come closer, so the top and bottom edges bow like Quinta's.
   Entrance (on intro:done): the two lines rise out of their masks, the actions follow, the frames rise from the
   centre outwards. On scroll (scrubbed, no pin) the outer frames drift apart and the film frame opens up. */
const SIDE = 3;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [film, setFilm] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const el = root.current, v = video.current; if (!el || !v) return;
    const reduce = reducedMotion();
    // The smaller encode on phones; chosen once, before the first frame loads.
    v.src = window.matchMedia("(max-width: 767px)").matches ? hero.film.small : hero.film.src;
    const play = () => { if (!userPaused.current && !reduce) v.play().catch(() => setPaused(true)); };
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) play(); else v.pause(); }, { threshold: 0.15 });
    v.addEventListener("pause", () => setPaused(true));
    v.addEventListener("play", () => setPaused(false));

    if (reduce) { v.removeAttribute("autoplay"); v.pause(); setPaused(true); io.observe(v); return () => io.disconnect(); }

    const q = (s: string) => el.querySelectorAll(s);
    const ctx = gsap.context(() => {
      gsap.set(q(".hero-line > span"), { yPercent: 112 });
      gsap.set(q(".hero-actions"), { autoAlpha: 0, y: 16 });
      gsap.set(q(".ribbon-frame"), { autoAlpha: 0, y: 70 });
    }, el);
    const off = onIntro(() => {
      ctx.add(() => {
        gsap.to(q(".hero-line > span"), { yPercent: 0, duration: 1.3, ease: EASE, stagger: 0.1 });
        gsap.to(q(".hero-actions"), { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, delay: 0.35 });
        gsap.to(q(".ribbon-frame"), { autoAlpha: 1, y: 0, duration: 1.4, ease: EASE, stagger: { each: 0.07, from: "center" }, delay: 0.15 });
        // Scroll: the outer frames part and the film frame opens up, then everything settles as the hero leaves.
        const st = { trigger: el, start: "top top", end: "bottom top", scrub: true };
        q(".ribbon-frame").forEach((f) => {
          const n = Number((f as HTMLElement).dataset.n);
          if (n === 0) gsap.to(f.querySelector(".ribbon-inner"), { scale: 1.12, ease: "none", scrollTrigger: st });
          else gsap.to(f.querySelector(".ribbon-inner"), { xPercent: Math.sign(n) * 18 * Math.abs(n), ease: "none", scrollTrigger: st });
        });
      });
      play();
    });
    io.observe(v);
    return () => { off(); io.disconnect(); ctx.revert(); };
  }, []);

  const toggle = () => {
    const v = video.current; if (!v) return;
    if (v.paused) { userPaused.current = false; v.play().catch(() => {}); }
    else { userPaused.current = true; v.pause(); }
  };

  const left = hero.ribbon.slice(0, SIDE), right = hero.ribbon.slice(SIDE, SIDE * 2);
  const frames = [
    ...left.map((r, i) => ({ ...r, n: i - SIDE })),
    { src: "", alt: "", n: 0 },
    ...right.map((r, i) => ({ ...r, n: i + 1 })),
  ];

  return (
    <section className="hero" id="top" data-tone="light" ref={root} aria-labelledby="hero-title">
      <div className="hero-head wrap">
        <h1 className="hero-title" id="hero-title">
          {hero.title.map((line) => <span key={line} className="hero-line"><span>{line}</span></span>)}
        </h1>
        <div className="hero-actions">
          <Button onClick={() => setFilm(true)} aria-haspopup="dialog">{hero.showreelLabel}</Button>
          <MoreLink href="#work">See our work</MoreLink>
        </div>
      </div>
      <div className="ribbon" aria-label="Coniston projects">
        <div className="ribbon-track">
          {frames.map((f) => (
            <figure key={f.n} className={`ribbon-frame${f.n === 0 ? " is-film" : ""}`} data-n={f.n}
              style={{ "--n": f.n, "--a": Math.abs(f.n) } as React.CSSProperties}>
              <div className="ribbon-inner">
                {f.n === 0 ? (
                  <>
                    <video ref={video} className="ribbon-media" muted loop playsInline autoPlay preload="metadata" poster={hero.film.poster} aria-label="Coniston showreel, muted" />
                    <button type="button" className="film-toggle" onClick={toggle} aria-label={paused ? "Play the showreel" : "Pause the showreel"}>
                      <Icon name={paused ? "play" : "pause"} />
                    </button>
                  </>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="ribbon-media" src={f.src} alt={f.alt} loading="eager" decoding="async" />
                )}
              </div>
            </figure>
          ))}
        </div>
      </div>
      <FilmDialog open={film} onClose={() => setFilm(false)} />
    </section>
  );
}
