import { Header } from "@/components/Header";
import { Motion } from "@/components/Motion";
import { Preloader } from "@/components/Preloader";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { News } from "@/components/home/News";
import { Voices } from "@/components/home/Voices";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { Work } from "@/components/home/Work";

/* conistonltd.co.uk's homepage in a new skin: the look after quintadamalia.com, the motion after somerstone.com.au.
   Every live block is here (hero, intro, Why Coniston and Our People tiles, quotes, Our Work, What We Do, News),
   regrouped into seven sections. The quotes move from before Our Work to after it, so the one dark band falls
   between two image-led light sections. Grounds: one Stone opening, a light page with Stone bands, and two Navy
   sections (the quotes and the closing contact). Copy: lib/content.ts. Systems: README.md. */
export default function Home() {
  return (
    <>
      <Motion />
      <Preloader />
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Work />
        <Voices />
        <WhatWeDo />
        <News />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
