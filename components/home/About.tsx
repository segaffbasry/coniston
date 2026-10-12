import { MoreLink, external } from "@/components/ui";
import { about, frameworks } from "@/lib/content";

/* After somerstone.com.au's "About" block: one statement that brightens word by word as it scrolls past (its
   reveal-type), three photo cards with a short title and line under each, then a slowly scrolling row of client
   logos. The statement is the live homepage's two intro lines; the cards are its "Why Coniston" and "Our People"
   tiles plus Our story; the logos are the framework clients from /what-we-do/frameworks/. */
export function About() {
  return (
    <section className="about section" id="about" data-tone="light" aria-label="Why Coniston">
      <div className="wrap">
        <p className="statement" data-reveal="statement">
          {about.lead} <span className="statement-soft">{about.second}</span>
        </p>
        <ul className="about-cards" data-reveal="cards">
          {about.cards.map((c) => (
            <li key={c.title}>
              <a className="about-card" href={c.href} {...external(c.href)}>
                <span className="about-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={c.alt} loading="lazy" decoding="async" />
                </span>
                <span className="about-title">{c.title}</span>
                <span className="about-line">{c.line}</span>
                <span className="more"><span className="uline-text">{c.cta}</span></span>
              </a>
            </li>
          ))}
        </ul>
        <div className="trust">
          <p className="trust-line" data-reveal="label">{frameworks.line}</p>
          {/* A slow, endless marquee (client feedback: "can this be scrolling?"). The list is drawn twice and the track
              moves by exactly one copy, so the loop has no seam; the copy is hidden from assistive tech. It pauses on
              hover and stands still, wrapped, with reduced motion. */}
          <div className="trust-marquee" data-reveal="label">
            <div className="trust-track">
              {[0, 1].map((copy) => (
                <ul key={copy} className="trust-logos" aria-hidden={copy === 1 ? true : undefined}>
                  {frameworks.logos.map((l) => (
                    <li key={l.src}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={l.src} alt={copy === 1 ? "" : l.alt} width={l.w} height={l.h} loading="lazy" decoding="async" style={{ "--ar": l.w / l.h } as React.CSSProperties} />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <MoreLink href={frameworks.href} className="trust-more">Frameworks</MoreLink>
        </div>
      </div>
    </section>
  );
}
