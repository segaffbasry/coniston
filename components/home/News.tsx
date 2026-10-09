import { Button, Icon, external } from "@/components/ui";
import { news } from "@/lib/content";

/* All six posts from the live homepage, newest first: the latest as a large card, the other five as a list beside
   it with small pictures. Each links to the real article. */
export function News() {
  const [first, ...rest] = news.posts;
  return (
    <section className="news section" id="news" data-tone="light" aria-labelledby="news-title" data-late>
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2" id="news-title" data-reveal="head">{news.title}</h2>
          <div data-reveal="label"><Button href={news.all.href}>{news.all.label}</Button></div>
        </div>
        <div className="news-grid">
          <a className="news-feature" href={first.href} {...external(first.href)} data-reveal="label">
            <span className="news-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={first.image} alt="" loading="lazy" decoding="async" />
            </span>
            <time dateTime={first.iso}>{first.date}</time>
            <span className="news-title">{first.title}</span>
            <span className="more"><span className="uline-text">{news.readMore}</span><Icon name="arrow" /></span>
          </a>
          <ul className="news-list" data-reveal="cards">
            {rest.map((p) => (
              <li key={p.href}>
                <a className="news-row" href={p.href} {...external(p.href)}>
                  <span className="news-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" loading="lazy" decoding="async" />
                  </span>
                  <span className="news-row-text">
                    <time dateTime={p.iso}>{p.date}</time>
                    <span className="news-row-title">{p.title}</span>
                  </span>
                  <span className="news-row-go" aria-hidden="true"><Icon name="arrow" /></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
