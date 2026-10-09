import type { Metadata, Viewport } from "next";
import { posthogSnippet } from "@/lib/posthog";
import { site } from "@/lib/content";
import "./globals.css";

// The live homepage's own title and description. Private demo: never indexed, never followed, no sitemap.
export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#F3F2F2" };

/* Runs before first paint. Unless reduced motion is requested it adds `js` (so reveal targets can start hidden
   without a flash) and `is-loading` for the preloader, which plays on every load. Without JavaScript nothing is
   hidden and the preloader never shows (see the <noscript> style). */
const boot = "(function(){var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.intro='done';d.classList.add('logo-landed');return}d.classList.add('js','is-loading')})()";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script dangerouslySetInnerHTML={{ __html: posthogSnippet }} />
        <link rel="preload" href="/fonts/albert-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/media/hero.jpg" as="image" />
        <noscript><style>{".preloader{display:none!important}.site-header,.hero-actions,.ribbon-frame{opacity:1!important;visibility:visible!important}.header-logo{visibility:visible!important}"}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
