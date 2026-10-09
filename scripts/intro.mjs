// Preloader check: screenshots the opening at fixed moments, times the handover, and confirms that scrolling is
// locked until then and that the preloader is skipped with reduced motion.
// Usage: node scripts/intro.mjs <outDir> [url]
import { chromium } from "playwright-core";
const [out = "shots/intro", url = "http://127.0.0.1:3054/"] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => {
  window.__t0 = performance.now();
  window.addEventListener("intro:done", () => { window.__handover = performance.now() - window.__t0; });
});
await page.goto(url, { waitUntil: "commit" });
const marks = [300, 700, 1100, 1500, 1900, 2200, 2500, 2800, 3200];
const start = Date.now();
let locked = null;
for (const ms of marks) {
  await page.waitForTimeout(Math.max(0, ms - (Date.now() - start)));
  if (ms === 1100) { await page.mouse.wheel(0, 600); await page.waitForTimeout(80); locked = await page.evaluate(() => window.scrollY); }
  await page.screenshot({ path: `${out}/t${String(ms).padStart(4, "0")}.jpg`, type: "jpeg", quality: 60 });
}
const result = await page.evaluate(() => ({ handover: Math.round(window.__handover ?? -1), loading: document.documentElement.classList.contains("is-loading"), intro: document.documentElement.dataset.intro }));
const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await rm.goto(url, { waitUntil: "load" });
const reduced = await rm.evaluate(() => ({ intro: document.documentElement.dataset.intro, preloader: getComputedStyle(document.querySelector(".preloader")).display }));
console.log(JSON.stringify({ ...result, scrollYDuringIntro: locked, reduced }));
await browser.close();
