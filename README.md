# Coniston: homepage redesign (private prospect demo)

A one-page rebuild of **conistonltd.co.uk**. It keeps Coniston's own logo, palette, copy, photography and showreel, and gives them a new skin. The look and layout follow **quintadamalia.com**; the motion follows **somerstone.com.au**.

- Next.js 16 App Router + TypeScript, GSAP + ScrollTrigger, Lenis. No UI kits, no CSS framework.
- One route: `/` (plus the framework's `/_not-found`, and `/icon.svg`). `next build` prerenders those three as static.
- Private demo: `noindex, nofollow`, no sitemap, PostHog EU analytics with no visible UI. Links keep their real hrefs but never leave the page.

```
npm install
npm run dev        # http://127.0.0.1:3054
npm run build && npm run start
npm run typecheck
```

## Recon (phase 1)

### Live homepage, every item (counts)

| Live block | Items | This build |
|---|---|---|
| Hero: h1 + Vimeo showreel + 10-slide photo carousel | 1 + 1 + 10 | Hero: the h1 verbatim, the showreel as the centre frame of the ribbon (and in full, with sound, behind "Watch the showreel"), 5 of the carousel stills plus 1 Royal Institution still either side |
| Intro (two h4 lines) | 2 | About: one statement, both lines verbatim |
| Why Coniston tile | 1 | About card 1 |
| Our People tile | 1 | About card 2 (the live tile's own photo) |
| Client quotes slider | 3 | Voices: all 3, verbatim, live order |
| Our Work: featured projects + "View all projects" | 5 + 1 | Work: the same 5, in live order, plus the link to all 9 |
| What We Do: title, 2 paragraphs, Build + Heritage & Iconic tiles | 1 + 2 + 2 | What we do: all of it, plus the menu's other 3 services as rows |
| News: latest posts | 6 | News: all 6 |
| Footer: Terms, Privacy, Policies, Contact, LinkedIn | 5 | Footer: all 5, plus the menu's pages |

**Added from inner pages**: Our story card (`/why-coniston/our-story/`, the 1979 founding from `/our-people/`), the project facts on each Work card (Category, Sector, Duration from each project page), the 6 framework client logos (`/what-we-do/frameworks/`), the services' one-liners (`/what-we-do/`), and the phone, email and two offices (`/contact/`).

**Left out, on purpose**: the 13-person team (`/our-people/`), the long-form client quotes (`/what-our-clients-say/`) and the four project pages that are not on the live homepage. The page is at its length cap and each is one click away. The live cookie banner is not rebuilt (no visible UI may be added). The live footer credit to the site's agency is left out, since this is not their build. The live contact form is not rebuilt (it would not send).

**Content gap explained**: the live St Bartholomew's card uses `Untitled-design-43.jpg`, which shows a phone showroom, not Barts. This build uses the Great Hall at Barts (`great-hall-looking-east-4.jpg`, from the same site) for that card.

### Brand assets

- **Logo.** The live header has the lock-up as inline vector (220 x 40): one path for the wordmark, one for the mark, which is a ring of 30 short ticks open on the right. `scripts/logo.py` splits it into 8 letter paths (a counter or a dot is grouped with its letter by overlap) and 30 tick paths sorted clockwise from the gap, written to `lib/logo.ts`. `components/Logo.tsx` rebuilds the lock-up from them in `currentColor`, so one component serves light and dark grounds. The favicon (`app/icon.svg`) is the ring on Stone.
- **Font.** The live site uses **IvyEpic** (Light 300, Medium 500) from an Adobe Fonts kit (`ryc3jsm`). That licence does not allow self-hosting, so the closest open match is used. Six candidates were rendered beside IvyEpic in the browser; **Albert Sans** is closest in width, the flat-topped `t` and the round `o`. It is self-hosted as the variable WOFF2 from `@fontsource-variable/albert-sans` and used for everything: the live site uses one family too, and an earlier client called a second display face "too AI".
- **Film.** The live hero plays the Coniston Showreel (Vimeo `1192228555`, 62 s, 4K). Vimeo's player cannot be reached from every network, so `scripts/film.py` documents fetching it from the player's HLS manifest (1080p + audio) and cuts the hero loop (to 54.4 s, before the end card), a phone encode, a poster frame and the full reel.
- **Socials.** LinkedIn only (the live footer's single account), as the Simple Icons path in `lib/brand-icons.ts`.

### Palette (confirmed 9 October 2026)

| Token | Hex | Source |
|---|---|---|
| Navy | `#1D2B46` | live text, header and footer (computed `rgb(29, 43, 70)`) |
| Steel | `#5B92B1` | live buttons and links (`rgb(91, 146, 177)`) |
| Stone | `#F3F2F2` | live page panels (`rgb(243, 242, 242)`) |
| White | `#FFFFFF` | the page |

No other hues are used. Softer text is Navy or White at reduced strength (Navy 74% is 5.9:1 on white; White 76% is 8.4:1 on Navy). Steel is 3.4:1 on white, so it only appears as the menu hover on Navy, never as small text on light grounds.

### Real site structure

Menu: Home, Why Coniston (Our story, How we work, Our values, Social value, What our clients say), Our people, Our work, What we do (Build, Heritage & Iconic, Decarbonisation, Frameworks, Facilities Management), News, Contact. Footer: Terms and Conditions, Privacy Policy, Policies, Contact, LinkedIn. All taken from the live header, footer and Yoast sitemaps (`page`, `our-work`, `post`).

## References: what each one gave

- **quintadamalia.com, LOOK & LAYOUT.** The server refuses connections from this network, so it was read through a reader proxy (HTML, full-page shot, and the theme's `liko-core.css`, all saved in `_scrape/ref/`). Taken: the centred statement on a pale ground with a pill button under it, the curved row of images below, the white pill nav in the middle of the header, softly rounded image frames, and tall image cards that open on hover.
- **somerstone.com.au, MOTION & SCROLL.** Measured from its inline scripts (`_scrape/ref/somer.html`): Lenis with the expo curve `1 - 2^(-10t)`, the `.reveal-type` statement that brightens as it scrolls (opacity from .2, `top 90%` to `top 10%`, scrubbed), its loader letters (y 40, .8 s, `power3.out`, stagger .08), and the About block layout (statement, three photo cards, a "trusted by" logo row).
- **edenbuild.co.uk** was also given. Its homepage is a header over a full-screen Vimeo film and nothing else. It confirms the industry convention of opening on film, which this build keeps in the hero, but it adds nothing the other two do not cover.
- **Copied interaction: Quinta's "Say Hello" button** (`.tp-btn-black-2`). See below.

## Sections and pacing

| # | Section | Ground | Imagery | Live items | Built |
|---|---|---|---|---|---|
| 1 | Hero (`#top`) | Stone | Showreel + 6 stills in a curved ribbon | 1 h1, 1 film, 10 slides | 1, 1, 6 |
| 2 | About (`#about`) | White | 3 photo cards + 6 client logos | 2 lines, 2 tiles | 2, 3 |
| 3 | Our work (`#work`) | Stone | 5 project photographs | 5 | 5 |
| 4 | Client voices | Navy | the building each quote is about | 3 | 3 |
| 5 | What we do (`#what-we-do`) | White | 2 large tiles, 3 rows with thumbnails | 2 paragraphs, 2 tiles | 2, 2 + 3 |
| 6 | News (`#news`) | Stone | 6 post images | 6 | 6 |
| 7 | Contact (`#contact`) | Navy | none (text-only, late in the page) | from `/contact/` | phone, email, 2 offices |
| | Footer | Navy | none | 5 links | 5 + the menu |

The hero and the next two sections are all photography-led. The only text-led section is the contact block at the end.

**Page height** (production build, measured by `npm run shots`):

| Width | Height | Viewports |
|---|---|---|
| 1440 | 6747 px | 7.5 |
| 768 | 6623 px | 6.5 |
| 375 | 7914 px | 9.7 |

Spacing scale: `--pad` 96 px desktop / 56 px phones, `--gap` 48 / 32 px. On phones the About cards, the Work cards and the What we do tiles become swipeable strips rather than tall stacks.

## How it works

### Preloader (`components/Preloader.tsx`)

Coniston's mark is a ring of 30 ticks, so the build draws it the way a dial fills. The ring is also the progress element: the ticks arrive one by one, clockwise from the gap, while the number inside counts to 100. Then the ring shrinks into its place beside the wordmark as the 8 letters rise from behind a baseline mask (Somerstone's loader letters, `power3.out`). The finished lock-up flies into the header logo while the Stone ground fades off the hero, which is also Stone, so there is no colour jump.

One GSAP timeline, about 2.35 s: ticks 0 to 1.35 s, ring move 1.3 to 1.8 s, letters 1.25 to 1.8 s, handover and exit 1.8 to 2.35 s. At handover it removes `is-loading` from `<html>`, sets `data-intro="done"`, starts Lenis and dispatches `intro:done`. The hero and header entrances wait for that event, so they overlap the exit. The stage stays hidden until its parts are set, so the finished logo never flashes first. It plays on every load (clients asked for loaders they notice). It is skipped with reduced motion, hidden by `<noscript>`, and a failsafe finishes it at 3.2 s. Measured on the production build: handover 1.88 s after navigation, scroll position 0 when a wheel scroll is attempted mid-intro (`npm run intro`).

### Motion system (`components/Motion.tsx`)

Lenis runs site-wide on the GSAP ticker and is synced with ScrollTrigger. Somerstone uses `duration: 1.5` with the expo curve; this build uses `lerp: .12` instead, because a fixed duration read as a jump at the bottom of the page on an earlier demo. Anchor links go through Lenis, and the preloader, menu and showreel dialog stop it. There is no scroll-driven background recolouring: each section has a fixed ground (clients dislike the page changing colour as they scroll).

| Move | Applied to | What it does | Duration / curve |
|---|---|---|---|
| `head` | section headings | the whole phrase fades and rises 28 px | 1.2 s, expo out |
| `statement` | the intro statement | Somerstone's reveal-type, by word: each word brightens from 20% as it scrolls past | scrubbed, `top 90%` to `top 25%` |
| `text` | paragraphs | words rise out of a line mask | 1.1 s, expo out, 6 ms per word |
| `label` | buttons, small lines | fade and rise 14 px | 0.9 s, expo out |
| `cards` | lists of cards and rows | children rise 36 px in batches | 1.1 s, expo out, 80 ms apart |
| `image` | the quote photograph | clip opens upward from the bottom edge | 1.3 s, power3 in-out |

Every move plays once. Sections marked `data-late` (What we do, News, Contact) play at 0.75 of the duration. There are no per-character effects outside the preloader. The footer has no reveals at all, since they fire in the last pixels and read as a jump. The curve family is Somerstone's: `expo.out` in GSAP and `--ease-out: cubic-bezier(.19,1,.22,1)` in CSS.

### Hero (`components/home/Hero.tsx`)

The statement is centred on Stone with the pill button under it, after Quinta. Below it is a curved ribbon in real 3D: each frame turns towards the middle and the outer frames come closer, so the top and bottom edges bow the way Quinta's row does. The centre frame is the showreel: muted, with a pause control, paused when off-screen, a local poster, and a smaller encode on phones. On `intro:done` the two lines rise out of their masks and the frames rise from the centre outwards. As the hero scrolls away (scrubbed, no pin), the outer frames drift apart and the film frame opens up. "Watch the showreel" plays the whole reel with sound in a native `<dialog>`.

### Header and menu (`components/Header.tsx`)

There is no bar behind the header. The logo sits on the left, the four sections in a solid white pill in the middle (after Quinta; solid rather than frosted, so there is no blur over moving film), and the phone and Menu toggle on the right. In the pill, one Stone chip sits behind the links and glides between them as the pointer or keyboard focus moves along, stretching to each item's width (0.55 s, expo out). It leans 20% towards the pointer within an item, fades in where the pointer enters, and fades out in place when it leaves. The logo and toggle take their colour from the section under them (`data-tone`). The header hides on the way down and returns on the way up. The menu is full-screen Navy: the panel wipes down, then the live menu's items rise in. It is one timeline, reversed to close. Focus is trapped, Esc closes it, and focus returns to the toggle. "Home" scrolls to the top; every other item is the real page.

### Copied interaction: Quinta's button (`components/ui.tsx`, "copied interaction" in `globals.css`)

From `.tp-btn-black-2` in Quinta's `liko-core.css`:

| Property | Quinta | Here |
|---|---|---|
| Shape | 50 px tall, `padding: 0 30px`, `border-radius: 40px`, 2 px transparent border | same |
| Label | 16 px / 500 / `letter-spacing: .03em` | same |
| Transition | `transition: all 0.3s` (default ease) | `--btn-dur: .3s`, `--btn-ease: ease` |
| Rest | black fill, white label; 30 px seal + 10 px arrow, 12 px after the label | Navy fill, white label; Coniston's ring as the seal |
| Hover | fill transparent, label and border black | fill transparent, label and border Navy |
| Seal on hover | `animation: rotate2 10s linear infinite` | the same keyframes and timing (`--btn-spin`) |
| Dark grounds | `.liko-dark-active` swaps the colours | `.btn-white` |

The one deliberate change is the seal. Quinta's scalloped rosette is replaced by Coniston's ring of ticks. That ring is open, not a solid disc, so the arrow takes the label colour in both states instead of inverting against the seal. Keyboard focus shows the hover state plus an outline. Quinta could not be loaded in a browser from this network for a live side-by-side, so the comparison was made rule by rule against its CSS. The rest and hover states are in `shots/keys/btn-rest.png` and `btn-hover.png` (`npm run keys`).

### Other sections

- **About**: Somerstone's About layout. The statement, three photo cards, then the framework client logos as a slow, endless marquee (client feedback, 11 October: "can this be scrolling?"). Each logo is sized to cover about the same area whatever its proportions. The list is drawn twice and the track moves by exactly one copy, so the loop has no seam. It runs at about 30 px/s, fades in and out at the edges, pauses on hover, and stands still (wrapped, one copy) with reduced motion.
- **Work**: five tall photographs in a row. Pointing at one, or tabbing to it, widens it (flex-grow, 0.9 s expo) and shows the title, standfirst and facts under the picture, never over it. On phones it becomes a swipeable strip with every caption showing.
- **Voices**: the quote beside a photo of its building. The names are tabs (arrow keys move between them), and quote and photo cross-fade. All three quotes share one grid cell, so nothing below jumps. Nothing advances on its own.
- **What we do**: the live title, paragraphs and two tiles, then three rows that reveal their service page's photo on hover or focus.

### Accessibility

There is a skip link and visible focus on everything. The menu is a modal dialog with a focus trap. The showreel uses a native dialog. The quotes are WAI tabs. With reduced motion there is no preloader, no Lenis, no reveals (`hiddenReveals: 0` in the check), and the film stays on its poster. Without JavaScript, `<noscript>` hides the preloader and shows everything. Contrast is checked on every ground (see Palette).

## Private demo settings

- `robots: noindex, nofollow, nocache` in `app/layout.tsx`. There is no sitemap or robots route.
- PostHog EU in `lib/posthog.ts`, injected in `<head>`: pageview, pageleave, autocapture and session recording on, surveys off, `site` and any UTM tags registered, and `scroll_depth` fired once each at 25/50/75/100. The key can be overridden with `NEXT_PUBLIC_POSTHOG_KEY`, with a literal fallback so Vercel works without setup. The script has no `id` attribute (an `id="posthog"` would shadow `window.posthog`).
- The link guard (`Motion.tsx`) stops every non-`#` link from navigating, while keeping the real hrefs, `target="_blank"` and `rel="noopener"`.

## Where the images came from

All photography is Coniston's own, from `wp-content/uploads` on conistonltd.co.uk, resized to WebP by `scripts/images.py`. Hero stills come from the live hero carousel (plus the Royal Institution project image). About uses the live Why Coniston and Our People tile photos and a site photo for Our story. Work uses each project's own image, with the Barts exception above. Voices uses the Painted Hall, the Somerset House courtyard and a joiner at work. What we do uses the live tiles and each service page's lead image. News uses each post's `og:image`. The logos come from `/what-we-do/frameworks/`. The films come from the Coniston Showreel. Photos are shown in natural colour, a touch desaturated (`saturate(.9)`), with no tints.

## Scripts

| Command | What it does |
|---|---|
| `npm run scrape` | re-fetches the live sitemaps and pages into `_scrape/` and extracts `content.json` (`--offline` re-parses) |
| `npm run logo` | splits the live header SVG into `lib/logo.ts` |
| `npm run media` | rebuilds `public/media` (images, then films) |
| `npm run links` | checks every link against the live sitemaps (78 links, 34 destinations, all OK) |
| `npm run shots -- <width> <dir>` | scrolls the page at one width, saves screenshots, reports height, overflow, broken images and console errors |
| `npm run intro` | screenshots the preloader at fixed moments, times the handover, checks the scroll lock and reduced motion |
| `npm run keys` | menu by keyboard, link guard, showreel dialog, button states, reduced motion |

`lib/content.ts` holds every word on the page. Homepage copy is verbatim; lines from inner pages are marked where they come from. The house rule of no em or en dashes means the two project date ranges read "to".
