"""Copies the homepage photography from the live site into public/media, resized and re-encoded as WebP.

Every image is Coniston's own (wp-content/uploads on conistonltd.co.uk). Sources are fetched into _scrape/raw if they
are missing. Photos are kept in natural colour; the CSS takes saturation down slightly (house rule: no tints).
Usage: python3 scripts/images.py
"""
import os, urllib.request
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "..", "_scrape", "raw")
OUT = os.path.join(HERE, "..", "public", "media")
UP = "https://www.conistonltd.co.uk/wp-content/uploads/"

# (published name, source path under /wp-content/uploads/, max width)
IMAGES = [
    # Hero ribbon: the live hero carousel's own slides
    ("ribbon-wallace", "2026/05/Wallace-completed-dressed-2-1.0-scaled.jpg", 900),
    ("ribbon-whitehall", "2026/08/RUSI-Hero-gradient-sky.jpg", 900),
    ("ribbon-painted-hall", "2026/04/Completed-Images-Painted-Hall-39-1.0-scaled-e1779108291944.jpg", 900),
    ("ribbon-national-gallery", "2026/05/National-Gallery-Completed-Photos-1-1.0-scaled.jpg", 900),
    ("ribbon-sheerness", "2026/05/Sheerness-Drone.jpg", 900),
    ("ribbon-ri", "2026/05/Ri-Theatre_Credit-Matt-Chung-scaled.jpg", 900),  # the Royal Institution (a project page image)
    # About: the live "Why Coniston" and "Our People" tiles, plus Our story
    ("about-why", "2026/05/Untitled-design-51.jpg", 1000),
    ("about-people", "2026/05/Coniston-Office-April2026-39-e1778765406905.jpg", 1000),
    ("about-story", "2026/05/Untitled-design-39.jpg", 1000),
    # Our work: the five projects the live homepage features
    # The live card uses Untitled-design-43.jpg, which shows a phone showroom, not Barts. The Great Hall at Barts is used instead.
    ("work-barts", "2026/05/great-hall-looking-east-4.jpg", 1400),
    ("work-maison-dieu", "2026/04/Dover-Town-Hall-e1779103368710.jpg", 1400),
    ("work-german-embassy", "2026/04/german-embassy.jpg", 1400),
    ("work-sheerness", "2026/03/sheerness-dockyard-church.jpg", 1400),
    ("work-kings-school", "2026/04/Kings-School-Completed-Photos-21-1.0-scaled.jpg", 1400),
    # Client voices: the buildings each quote is about
    ("voice-painted-hall", "2026/05/placeholder.jpg", 1400),
    ("voice-somerset-house", "2026/05/Untitled-design-40.jpg", 1400),
    ("voice-craft", "2026/05/Untitled-design-38-1.jpg", 1400),
    # What we do: the live Build and Heritage & Iconic tiles, and each service page's own lead image
    ("do-build", "2026/04/build-hero.jpg", 1400),
    ("do-heritage", "2026/04/heritage-hero.jpg", 1400),
    ("do-decarbonisation", "2026/05/Untitled-design-47.jpg", 700),
    ("do-frameworks", "2026/05/Untitled-design-35.jpg", 700),
    ("do-fm", "2026/05/Hogarth-stairs-.jpg", 700),
    # News: each post's own image (og:image)
    ("news-showreel", "2026/05/Untitled-design-50.jpg", 1200),
    ("news-meggan", "2026/09/RUSI-Instagram-e1789384709779.png", 600),
    ("news-website", "2026/09/Conistons-new-website.png", 600),
    ("news-haymarket", "2026/08/Hero-Copy.jpg", 600),
    ("news-maison-dieu", "2026/04/meseums-heritage-awards.jpg", 600),
    ("news-deano", "2026/02/conistons-deano-georgiou-admitted-as-freeman-of-the-worshipful-company-of-constructors.jpg", 600),
]

# Framework client logos from /what-we-do/frameworks/ (kept as PNG with transparency)
LOGOS = ["logo-royal-family", "logo-uk-parliament", "logo-london-ambulance-service", "logo-the-royal-parks",
         "logo-historic-royal-palaces", "logo-somerset-house"]


def fetch(path):
    local = os.path.join(RAW, os.path.basename(path))
    if not os.path.exists(local):
        req = urllib.request.Request(UP + path, headers={"User-Agent": "Mozilla/5.0"})
        open(local, "wb").write(urllib.request.urlopen(req, timeout=60).read())
    return local


def main():
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(RAW, exist_ok=True)
    total = 0
    for name, path, width in IMAGES:
        im = Image.open(fetch(path)).convert("RGB")
        if im.width > width:
            im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        out = os.path.join(OUT, name + ".webp")
        im.save(out, "WEBP", quality=78, method=6)
        total += os.path.getsize(out)
    for name in LOGOS:
        im = Image.open(fetch(f"2026/04/{name}.png")).convert("RGBA")
        im = im.crop(im.getbbox())  # trim the transparent margin so every logo sits on the same baseline
        out = os.path.join(OUT, name + ".png")
        im.save(out, optimize=True)
        total += os.path.getsize(out)
    print(f"{len(IMAGES)} photos + {len(LOGOS)} logos, {total // 1024} KB")


if __name__ == "__main__":
    main()
