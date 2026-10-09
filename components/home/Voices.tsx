"use client";

import { useState } from "react";
import { MoreLink } from "@/components/ui";
import { voices, voicesMore } from "@/lib/content";

/* The live homepage's three client quotes on the one dark ground of the page body. The quote sits beside a photo of
   the building it is about; the names below are tabs (arrow keys move between them, as in the WAI tabs pattern) and
   the quote and photo cross-fade between them. All three quotes share one grid cell, so the block keeps the height of
   the longest and nothing below it jumps. Nothing advances on its own. */
export function Voices() {
  const [active, setActive] = useState(0);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : voices.length - 1)) % voices.length;
    setActive(next);
    document.getElementById(`voice-tab-${next}`)?.focus();
  };
  return (
    <section className="voices section on-dark" id="voices" data-tone="dark" aria-label="What our clients say">
      <div className="wrap voices-grid">
        <div className="voices-media" data-reveal="image">
          {voices.map((v, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={v.image} src={v.image} alt={v.alt} className={i === active ? "is-active" : ""} loading="lazy" decoding="async" />
          ))}
        </div>
        <div className="voices-body">
          <div className="voices-quotes">
            {voices.map((v, i) => (
              <figure key={i} id={`voice-${i}`} role="tabpanel" aria-labelledby={`voice-tab-${i}`} className={`voice${i === active ? " is-active" : ""}`} inert={i !== active}>
                <blockquote><p>{v.quote}</p></blockquote>
                <figcaption><span className="voice-name">{v.name}</span><span className="voice-role">{v.role}</span></figcaption>
              </figure>
            ))}
          </div>
          <div className="voices-tabs" role="tablist" aria-label="Choose a quote" onKeyDown={onKey} data-reveal="label">
            {voices.map((v, i) => (
              <button key={i} id={`voice-tab-${i}`} type="button" role="tab" aria-selected={i === active} aria-controls={`voice-${i}`}
                tabIndex={i === active ? 0 : -1} className={`voice-tab${i === active ? " is-active" : ""}`} onClick={() => setActive(i)}>
                <span>{v.name}</span><small>{v.role}</small>
              </button>
            ))}
          </div>
          <MoreLink href={voicesMore.href} className="voices-more">{voicesMore.label}</MoreLink>
        </div>
      </div>
    </section>
  );
}
