"""Refreshes the content snapshot from conistonltd.co.uk.

Reads the live Yoast sitemaps (page, our-work, post), saves every page to _scrape/pages/<slug>.html, then extracts
what the homepage uses into _scrape/content.json:
  projects  every /our-work/ page: title, standfirst (h4), the Category / Sector / Duration lines, og:image
  news      every /news/ post: title, date (article:published_time), og:image
  people    the /our-people/ team: name and role, in page order
lib/content.ts is written by hand from this file (copy kept verbatim, dashes rewritten per the house rule).
Usage: python3 scripts/scrape.py [--offline]   (--offline re-parses the saved pages without fetching)
"""
import html, json, os, re, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..", "_scrape")
PAGES = os.path.join(ROOT, "pages")
LIVE = "https://www.conistonltd.co.uk"
UA = {"User-Agent": "Mozilla/5.0 (Macintosh) Chrome/130"}


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read().decode("utf-8", "replace")


def slug(url):
    s = url.replace(LIVE, "").strip("/").replace("/", "__")
    return s or "home"


def text(s):
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s))).strip()


def meta(page, prop):
    m = re.search(r'<meta property="%s" content="([^"]+)"' % re.escape(prop), page)
    return html.unescape(m.group(1)) if m else None


def main():
    os.makedirs(PAGES, exist_ok=True)
    urls = []
    for name in ("page", "our-work", "post"):
        path = os.path.join(ROOT, f"{name}-sitemap.xml")
        if "--offline" not in sys.argv:
            open(path, "w").write(get(f"{LIVE}/{name}-sitemap.xml"))
        urls += [u for u in re.findall(r"<loc>([^<]+)</loc>", open(path).read()) if "/wp-content/" not in u]
    for u in urls:
        out = os.path.join(PAGES, slug(u) + ".html")
        if "--offline" not in sys.argv:
            open(out, "w").write(get(u))

    projects, news = [], []
    for u in urls:
        page = open(os.path.join(PAGES, slug(u) + ".html")).read()
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", page, re.S)
        if "/our-work/" in u and u.rstrip("/") != f"{LIVE}/our-work":
            h4 = re.search(r"<h4[^>]*>(.*?)</h4>", page, re.S)
            facts = dict(re.findall(r"<p[^>]*>\s*<b>(Category|Sector|Duration|Architect|Location|Value|Client|Contract value):</b>\s*(.*?)</p>", page, re.S))
            projects.append({"url": u, "title": text(h1.group(1)), "standfirst": text(h4.group(1)) if h4 else "",
                             **{k.lower(): text(v) for k, v in facts.items()}, "image": meta(page, "og:image")})
        if "/news/" in u and u.rstrip("/") != f"{LIVE}/news":
            news.append({"url": u, "title": text(h1.group(1)) if h1 else meta(page, "og:title"),
                         "date": (meta(page, "article:published_time") or "")[:10], "image": meta(page, "og:image")})
    news.sort(key=lambda n: n["date"], reverse=True)

    team = open(os.path.join(PAGES, "our-people.html")).read()
    people, seen = [], set()
    for name, role in re.findall(r"<h5[^>]*>(.*?)</h5>\s*<p[^>]*>(.*?)</p>", team, re.S):
        if text(name) in seen:
            continue
        seen.add(text(name))
        people.append({"name": text(name), "role": text(role)})

    json.dump({"projects": projects, "news": news, "people": people}, open(os.path.join(ROOT, "content.json"), "w"), indent=1, ensure_ascii=False)
    print(f"{len(urls)} pages, {len(projects)} projects, {len(news)} posts, {len(people)} people")


if __name__ == "__main__":
    main()
