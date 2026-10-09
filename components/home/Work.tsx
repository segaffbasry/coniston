"use client";

import { useState } from "react";
import { Button, external } from "@/components/ui";
import { work } from "@/lib/content";

/* The five projects the live homepage features, as a row of tall photographs (after Quinta's "Various Options"
   cards). One is open at a time: pointing at a photo, or tabbing to it, widens it and shows its title, standfirst
   and the facts from its project page under the picture, never over it. On phones the row becomes a swipeable
   strip with every caption showing. Each card links to the real project page; the button to all nine. */
export function Work() {
  const [active, setActive] = useState(0);
  return (
    <section className="work section" id="work" data-tone="light" aria-labelledby="work-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2" id="work-title" data-reveal="head">{work.title}</h2>
          <div data-reveal="label"><Button href={work.all.href}>{work.all.label}</Button></div>
        </div>
        <ul className="work-row" data-reveal="cards">
          {work.projects.map((p, i) => (
            <li key={p.href} className={`work-item${i === active ? " is-active" : ""}`} onPointerEnter={() => setActive(i)}>
              <a className="work-card" href={p.href} {...external(p.href)} onFocus={() => setActive(i)}>
                <span className="work-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="work-caption">
                  <span className="work-title">{p.title}</span>
                  <span className="work-stand">{p.standfirst}</span>
                  <span className="work-facts">
                    <span><b>Category</b> {p.category}</span>
                    <span><b>Sector</b> {p.sector}</span>
                    <span><b>Duration</b> {p.duration}</span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
