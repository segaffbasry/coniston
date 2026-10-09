import { Icon, MoreLink, external } from "@/components/ui";
import { whatWeDo } from "@/lib/content";

/* "What We Do" from the live homepage: its title and two paragraphs, its Build and Heritage & Iconic tiles as two
   large photographs with the copy beneath, then the other three services from the live menu as quiet rows. A row
   shows its service page's own photograph when pointed at or focused (always, small, on phones). */
export function WhatWeDo() {
  return (
    <section className="do section" id="what-we-do" data-tone="light" aria-labelledby="do-title" data-late>
      <div className="wrap">
        <div className="do-head">
          <h2 className="h2" id="do-title" data-reveal="head">{whatWeDo.title}</h2>
          <div className="do-copy">
            {whatWeDo.body.map((p) => <p key={p.slice(0, 20)} data-reveal="text">{p}</p>)}
          </div>
        </div>
        <ul className="do-lead" data-reveal="cards">
          {whatWeDo.lead.map((s) => (
            <li key={s.title}>
              <a className="do-tile" href={s.href} {...external(s.href)}>
                <span className="do-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt={s.alt} loading="lazy" decoding="async" />
                </span>
                <span className="do-tile-text">
                  <span className="do-tile-title">{s.title}</span>
                  <span className="do-tile-line">{s.line}</span>
                  <span className="more"><span className="uline-text">{s.cta}</span><Icon name="arrow" /></span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <ul className="do-rows" data-reveal="cards">
          {whatWeDo.more.map((s) => (
            <li key={s.title}>
              <a className="do-row" href={s.href} {...external(s.href)}>
                <span className="do-row-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="do-row-title">{s.title}</span>
                <span className="do-row-line">{s.line}</span>
                <span className="do-row-go" aria-hidden="true"><Icon name="arrow" /></span>
              </a>
            </li>
          ))}
        </ul>
        <div className="do-all" data-reveal="label"><MoreLink href={whatWeDo.all.href}>{whatWeDo.all.label}</MoreLink></div>
      </div>
    </section>
  );
}
