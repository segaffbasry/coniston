/* Every word on the page, taken from conistonltd.co.uk (snapshot 9 October 2026, see scripts/scrape.py). Homepage copy
   is verbatim; the few lines added from inner pages say where they come from. House rule: no em or en dashes, so the
   two date ranges on project pages read "to". Links point at the real pages, checked against the live sitemaps. */

export const LIVE = "https://www.conistonltd.co.uk";
const u = (path: string) => `${LIVE}${path}`;

export const site = {
  title: "Home - Coniston",
  description:
    "We deliver complex construction projects across London and the South East, combining heritage-level care with modern build expertise.",
};

export type Link = { label: string; href: string };

// The live header menu, group by group (the live site nests these under Why Coniston and What we do).
export const menu: { label: string; href: string; children?: Link[] }[] = [
  { label: "Home", href: "#top" },
  {
    label: "Why Coniston", href: u("/why-coniston/"),
    children: [
      { label: "Our story", href: u("/why-coniston/our-story/") },
      { label: "How we work", href: u("/why-coniston/how-we-work/") },
      { label: "Our values", href: u("/why-coniston/our-values/") },
      { label: "Social value", href: u("/why-coniston/social-value/") },
      { label: "What our clients say", href: u("/why-coniston/what-our-clients-say/") },
    ],
  },
  { label: "Our people", href: u("/our-people/") },
  { label: "Our work", href: u("/our-work/") },
  {
    label: "What we do", href: u("/what-we-do/"),
    children: [
      { label: "Build", href: u("/what-we-do/build/") },
      { label: "Heritage & Iconic", href: u("/what-we-do/heritage-and-iconic/") },
      { label: "Decarbonisation", href: u("/what-we-do/decarbonisation/") },
      { label: "Frameworks", href: u("/what-we-do/frameworks/") },
      { label: "Facilities Management", href: u("/what-we-do/facilities-management/") },
    ],
  },
  { label: "News", href: u("/news/") },
  { label: "Contact", href: u("/contact/") },
];

// The pill in the header scrolls to sections of this page.
export const sectionLinks: Link[] = [
  { label: "Why Coniston", href: "#about" },
  { label: "Our work", href: "#work" },
  { label: "What we do", href: "#what-we-do" },
  { label: "News", href: "#news" },
];

export const hero = {
  title: ["When the project matters.", "People choose Coniston."],
  film: { src: "/media/hero.mp4", small: "/media/hero-sm.mp4", poster: "/media/hero.jpg", full: "/media/showreel.mp4" },
  // Stills from the live hero carousel (and one from the Royal Institution project page), either side of the film
  ribbon: [
    { src: "/media/ribbon-painted-hall.webp", alt: "The Painted Hall, Old Royal Naval College" },
    { src: "/media/ribbon-whitehall.webp", alt: "61 Whitehall from the street" },
    { src: "/media/ribbon-wallace.webp", alt: "A restored gallery, dressed and complete" },
    { src: "/media/ribbon-ri.webp", alt: "The lecture theatre at the Royal Institution of Great Britain" },
    { src: "/media/ribbon-national-gallery.webp", alt: "A completed gallery at the National Gallery" },
    { src: "/media/ribbon-sheerness.webp", alt: "Sheerness Dockyard Church from the air" },
  ],
  showreelLabel: "Watch the showreel",
};

export const about = {
  // The live intro, two lines
  lead: "We deliver complex construction projects across London and the South East, combining heritage-level care with modern build expertise.",
  second: "From iconic landmarks to major commercial refurbishments and prime residential schemes, we manage risk intelligently and deliver with confidence.",
  cards: [
    { title: "Why Coniston", line: "Built on trust. Proven over time.", cta: "Discover more", href: u("/why-coniston/"), image: "/media/about-why.webp", alt: "Coniston directors in the courtyard at Somerset House" },
    { title: "Our people", line: "Experts you can rely on. People you trust.", cta: "Meet the team", href: u("/our-people/"), image: "/media/about-people.webp", alt: "Coniston people" },
    // From /why-coniston/our-story/ and /our-people/ (John Rathbone founded Coniston in 1979)
    { title: "Our story", line: "Built on care, shaped by experience. Founded in 1979.", cta: "Read our story", href: u("/why-coniston/our-story/"), image: "/media/about-story.webp", alt: "Coniston directors in conversation on site" },
  ],
};

export type Project = { title: string; standfirst: string; category: string; sector: string; duration: string; href: string; image: string };

// The five projects the live homepage features, in its order; facts from each project page.
export const work = {
  title: "Projects that matter. Confidently delivered.",
  all: { label: "View all projects", href: u("/our-work/") },
  projects: [
    { title: "St Bartholomew’s Hospital", standfirst: "‘Sharing Historic Barts’ through complex heritage-led decarbonisation in a live hospital estate", category: "Decarbonisation", sector: "Culture & Arts / Health / Public Services", duration: "22 months", href: u("/our-work/st-bartholomews-hospital/"), image: "/media/work-barts.webp" },
    { title: "Maison Dieu, Dover", standfirst: "Award-winning project to reawaken a historic civic building", category: "Heritage & Iconic", sector: "Civic / Public", duration: "111 weeks", href: u("/our-work/maison-dieu-dover/"), image: "/media/work-maison-dieu.webp" },
    { title: "German Embassy, Belgrave Square", standfirst: "Complex quality refurbishment delivered in a live diplomatic environment with precision and discretion.", category: "Decarbonisation", sector: "Commercial / Public Services / Residential", duration: "70 weeks", href: u("/our-work/german-embassy-belgrave-square/"), image: "/media/work-german-embassy.webp" },
    { title: "Sheerness Dockyard Church", standfirst: "Award-winning heritage restoration delivered with exceptional craftsmanship & conservation leadership", category: "Heritage & Iconic", sector: "Public Services", duration: "84 weeks", href: u("/our-work/sheerness-dockyard-church/"), image: "/media/work-sheerness.webp" },
    { title: "King’s School Canterbury Rausing Science Centre", standfirst: "Complex redevelopment delivered within one of the UK’s most architecturally significant educational environments.", category: "Heritage & Iconic", sector: "Education", duration: "April 2019 to March 2023", href: u("/our-work/kings-school-canterbury-rausing-science-centre/"), image: "/media/work-kings-school.webp" },
  ] satisfies Project[],
};

// The live homepage's three quotes, in its order, each paired with the building it is about.
export const voices = [
  { quote: "I first worked with Coniston on the Painted Hall at Greenwich, and it was a very happy project. They provided exactly what I was looking for: a team that could work in partnership with us, our stakeholders and supply chain.", name: "Will Palin", role: "Barts Heritage chief executive", image: "/media/voice-painted-hall.webp", alt: "The Painted Hall at the Old Royal Naval College, Greenwich" },
  { quote: "Coniston have refurbished most of our buildings over the last 10 to 15 years. They know Somerset House inside out. I know I am putting the building in good hands whenever we carry out a project. Quality in the product is everything, especially on a building like this.", name: "Mick Figg, FCIOB", role: "Head of Buildings, Somerset House", image: "/media/voice-somerset-house.webp", alt: "The courtyard at Somerset House" },
  { quote: "Finding traditional skills is becoming harder and harder in the industry, and Coniston possess those skills. They understand historic buildings, they respect them, and they keep producing the quality these buildings deserve.", name: "Mick Figg", role: "Head of Buildings, Somerset House", image: "/media/voice-craft.webp", alt: "A Coniston joiner at work" },
];
export const voicesMore: Link = { label: "What our clients say", href: u("/why-coniston/what-our-clients-say/") };

// Framework clients, from /what-we-do/frameworks/
export const frameworks = {
  line: "Trusted framework partner to",
  href: u("/what-we-do/frameworks/"),
  logos: [
    { src: "/media/logo-royal-family.png", alt: "The Royal Household", w: 268, h: 244 },
    { src: "/media/logo-uk-parliament.png", alt: "UK Parliament", w: 480, h: 122 },
    { src: "/media/logo-london-ambulance-service.png", alt: "London Ambulance Service NHS Trust", w: 557, h: 120 },
    { src: "/media/logo-the-royal-parks.png", alt: "The Royal Parks", w: 384, h: 150 },
    { src: "/media/logo-historic-royal-palaces.png", alt: "Historic Royal Palaces", w: 488, h: 221 },
    { src: "/media/logo-somerset-house.png", alt: "Somerset House", w: 380, h: 108 },
  ],
};

export const whatWeDo = {
  title: "Complex projects, managed intelligently.",
  all: { label: "Our expertise", href: u("/what-we-do/") }, // the h1 of /what-we-do/
  body: [
    "We apply the meticulous planning, sequencing and risk management developed on some of the country’s most sensitive historic buildings to every project we deliver across London and the wider South East.",
    "Whether restoring, extending or building something new, our approach is consistent: intelligent preparation, calm problem-solving and uncompromising standards.",
  ],
  // The live homepage's two tiles
  lead: [
    { title: "Build", line: "Complex construction delivered with care, precision and complete confidence.", cta: "Explore Build", href: u("/what-we-do/build/"), image: "/media/do-build.webp", alt: "A completed residential build in London" },
    { title: "Heritage & Iconic", line: "Trusted expertise for nationally significant places.", cta: "Explore Heritage & Iconic", href: u("/what-we-do/heritage-and-iconic/"), image: "/media/do-heritage.webp", alt: "A restored state room" },
  ],
  // The other three services in the live menu; lines from /what-we-do/
  more: [
    { title: "Decarbonisation", line: "Smarter buildings, lower carbon, careful delivery.", href: u("/what-we-do/decarbonisation/"), image: "/media/do-decarbonisation.webp" },
    { title: "Frameworks", line: "Trusted partnerships built on consistency, quality and responsiveness.", href: u("/what-we-do/frameworks/"), image: "/media/do-frameworks.webp" },
    { title: "Facilities Management", line: "Keeping buildings safe, compliant and working as they should.", href: u("/what-we-do/facilities-management/"), image: "/media/do-fm.webp" },
  ],
};

// The six posts on the live homepage, newest first.
export const news = {
  title: "Insights from the work we deliver.",
  all: { label: "All news", href: u("/news/") },
  posts: [
    { title: "Take a look at our new showreel", date: "16 September 2026", iso: "2026-09-16", href: u("/news/take-a-look-at-our-new-showreel/"), image: "/media/news-showreel.webp" },
    { title: "Meet Meggan Larner, Coniston’s Head of Bid Submissions", date: "14 September 2026", iso: "2026-09-14", href: u("/news/meet-meggan-larner/"), image: "/media/news-meggan.webp" },
    { title: "Introducing Coniston’s new website", date: "7 September 2026", iso: "2026-09-07", href: u("/news/introducing-conistons-new-website/"), image: "/media/news-website.webp" },
    { title: "Playing our part in the story of the Theatre Royal Haymarket", date: "4 August 2026", iso: "2026-08-04", href: u("/news/playing-our-part-in-the-story-of-the-theatre-royal-haymarket/"), image: "/media/news-haymarket.webp" },
    { title: "Maison Dieu shortlisted for two national Museum & Heritage Awards", date: "7 April 2026", iso: "2026-04-07", href: u("/news/maison-dieu-shortlisted-for-two-national-museum-heritage-awards/"), image: "/media/news-maison-dieu.webp" },
    { title: "Coniston’s Deano Georgiou admitted as Freeman of The Worshipful Company of Constructors", date: "12 February 2026", iso: "2026-02-12", href: u("/news/conistons-deano-georgiou-admitted-as-freeman-of-the-worshipful-company-of-constructors/"), image: "/media/news-deano.webp" },
  ],
  readMore: "Read more",
};

// From /contact/ and the closing line of the service pages
export const contact = {
  title: "Whether you have a project in mind or want to know more, we’d love to hear from you",
  cta: { label: "Send us a message", href: u("/contact/") },
  phone: { label: "0208 051 5351", href: "tel:02080515351" },
  email: { label: "enquiries@conistonltd.co.uk", href: "mailto:enquiries@conistonltd.co.uk" },
  offices: [
    { name: "London", kind: "Head Office", lines: ["38 Dover Street", "London W1S 4NL"], directions: "https://www.google.com/maps/dir/current+location/38+Dover+Street,+London,+W1S+4NL" },
    { name: "Kent", kind: "Office", lines: ["Collingwood House, Schooner Court", "Crossways, Dartford", "Kent DA2 6QQ"] },
  ],
};

export const footer = {
  legal: [
    { label: "Terms and Conditions", href: u("/terms-and-conditions/") },
    { label: "Privacy Policy", href: u("/privacy-policy/") },
    { label: "Policies", href: u("/coniston-policies/") },
    { label: "Contact", href: u("/contact/") },
  ],
  linkedin: "https://in.linkedin.com/company/coniston-limited",
};
