// Keyboard and behaviour check: opens the menu from the keyboard, confirms focus moves in, Tab stays trapped, Esc
// closes and focus returns to the toggle; confirms a link click does not navigate; opens and closes the showreel
// dialog; screenshots the button rest and hover states; and loads the page with reduced motion.
// Usage: node scripts/keys.mjs [outDir] [url]
import { chromium } from "playwright-core";
const [out = "shots/keys", url = "http://127.0.0.1:3054/"] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await page.goto(url, { waitUntil: "load" });
await page.waitForFunction(() => document.documentElement.dataset.intro === "done");
await page.waitForTimeout(900);
const active = () => page.evaluate(() => { const a = document.activeElement; return a ? `${a.tagName.toLowerCase()} ${(a.textContent || a.getAttribute("aria-label") || "").trim().slice(0, 30)}` : "none"; });
const r = {};
await page.focus(".menu-toggle");
await page.keyboard.press("Enter");
await page.waitForTimeout(1000);
r.afterOpen = await active();
r.expanded = await page.getAttribute(".menu-toggle", "aria-expanded");
await page.screenshot({ path: `${out}/menu.jpg`, type: "jpeg", quality: 70 });
const seen = new Set();
for (let i = 0; i < 40; i++) { await page.keyboard.press("Tab"); seen.add(await page.evaluate(() => !!document.activeElement?.closest("#site-menu, .menu-toggle"))); }
r.tabTrapped = !seen.has(false);
await page.keyboard.press("Escape");
await page.waitForTimeout(900);
r.afterEsc = await active();
r.menuHidden = await page.evaluate(() => getComputedStyle(document.querySelector("#site-menu")).visibility);
// Link guard
const before = page.url();
// Reveals only play once scrolled to, so bring the card in first.
await page.locator(".about-card").first().evaluate((e) => e.scrollIntoView({ block: "center" }));
await page.waitForTimeout(1600);
await page.click(".about-card >> nth=0");
await page.waitForTimeout(500);
r.navigated = page.url() !== before || page.context().pages().length > 1;
// Showreel dialog
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await page.click(".hero-actions .btn");
await page.waitForTimeout(800);
r.dialogOpen = await page.evaluate(() => document.querySelector(".film-dialog").open);
await page.screenshot({ path: `${out}/dialog.jpg`, type: "jpeg", quality: 70 });
await page.keyboard.press("Escape");
await page.waitForTimeout(400);
r.dialogClosed = await page.evaluate(() => !document.querySelector(".film-dialog").open);
r.afterDialog = await active();
// Button rest / hover
const btn = page.locator("#work .btn");
await btn.scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
await btn.screenshot({ path: `${out}/btn-rest.png` });
await btn.hover();
await page.waitForTimeout(1200);
await btn.screenshot({ path: `${out}/btn-hover.png` });
r.btnHover = await btn.evaluate((b) => { const c = getComputedStyle(b); return { bg: c.backgroundColor, color: c.color, border: c.borderColor, transition: c.transition, spin: getComputedStyle(b.querySelector(".btn-seal")).animationName }; });
r.errors = errors;
// Reduced motion
const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await rm.goto(url, { waitUntil: "load" });
await rm.waitForTimeout(800);
r.reduced = await rm.evaluate(() => ({
  hiddenReveals: [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).visibility === "hidden").length,
  lenis: document.documentElement.classList.contains("lenis"),
  preloader: getComputedStyle(document.querySelector(".preloader")).display,
  video: document.querySelector(".ribbon video").paused,
}));
await rm.screenshot({ path: `${out}/reduced.jpg`, type: "jpeg", quality: 70, fullPage: true });
console.log(JSON.stringify(r, null, 1));
await browser.close();
