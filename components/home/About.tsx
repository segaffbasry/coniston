import { MoreLink, external } from "@/components/ui";
import { about, frameworks } from "@/lib/content";

/* After somerstone.com.au's "About" block: one statement that brightens word by word as it scrolls past (its
   reveal-type), three photo cards with a short title and line under each, then a quiet row of client logos. The
   statement is the live homepage's two intro lines; the cards are its "Why Coniston" and "Our People" tiles plus
   Our story; the logos are the framework clients from /what-we-do/frameworks/. */
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
          <ul className="trust-logos" data-reveal="cards">
            {frameworks.logos.map((l) => (
              <li key={l.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.src} alt={l.alt} width={l.w} height={l.h} loading="lazy" decoding="async" style={{ "--ar": l.w / l.h } as React.CSSProperties} />
              </li>
            ))}
          </ul>
          <MoreLink href={frameworks.href} className="trust-more">Frameworks</MoreLink>
        </div>
      </div>
    </section>
  );
}
