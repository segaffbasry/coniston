// Checks every link on the rendered homepage: conistonltd.co.uk pages must appear in the live Yoast sitemaps (page,
// our-work, post) and answer 200; other URLs must answer (LinkedIn refuses bots, so it is reported, not failed);
// every outbound link opens in a new tab with rel="noopener"; "#" links point at an element on the page; tel: and
// mailto: must appear on the live homepage or /contact/.
// Usage: node scripts/check-links.mjs [http://127.0.0.1:3054/]
const page = process.argv[2] ?? "http://127.0.0.1:3054/";
const UA = { "user-agent": "Mozilla/5.0 (Macintosh) Chrome/130" };
const LIVE = "https://www.conistonltd.co.uk";
const html = await (await fetch(page)).text();
let map = "";
for (const name of ["page", "our-work", "post"]) map += await (await fetch(`${LIVE}/${name}-sitemap.xml`, { headers: UA })).text();
const sitemap = new Set([...map.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/\/$/, "")));
let liveText = "";
for (const p of ["/", "/contact/"]) liveText += await (await fetch(LIVE + p, { headers: UA })).text();
const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const problems = [], seen = new Map();
for (const a of anchors) {
  const href = (a.match(/href="([^"]*)"/) ?? [])[1];
  if (!href) { problems.push("anchor without href"); continue; }
  const h = href.replace(/&amp;/g, "&");
  if (h.startsWith("#")) { if (h === "#") problems.push("bare # link"); else if (h !== "#top" && !ids.has(h.slice(1))) problems.push(`missing anchor ${h}`); continue; }
  if (h.startsWith("mailto:")) { if (!liveText.includes(h.slice(7))) problems.push(`not on the live site: ${h}`); seen.set(h, "live"); continue; }
  if (h.startsWith("tel:")) { if (!liveText.replace(/\s/g, "").includes(h.slice(4))) problems.push(`not on the live site: ${h}`); seen.set(h, "live"); continue; }
  if (!/target="_blank"/.test(a) || !/rel="noopener"/.test(a)) problems.push(`not new-tab/noopener: ${h}`);
  if (!seen.has(h)) seen.set(h, null);
}
for (const h of seen.keys()) {
  if (seen.get(h)) continue;
  const u = new URL(h);
  if (u.hostname === "www.conistonltd.co.uk" && !sitemap.has((u.origin + u.pathname).replace(/\/$/, ""))) problems.push(`not in the sitemaps: ${h}`);
  let status;
  try { status = (await fetch(h, { headers: UA, redirect: "follow", signal: AbortSignal.timeout(20000) })).status; } catch (e) { status = "error " + e.message; }
  seen.set(h, status);
  if (!(typeof status === "number" && status < 400)) (/linkedin/.test(h) ? console.log(`blocked (refuses bots, checked by hand): ${status} ${h}`) : problems.push(`${status}: ${h}`));
}
console.log(`${seen.size} unique destinations, ${anchors.length} links`);
for (const [h, s] of seen) console.log(String(s).padEnd(6), h);
console.log(problems.length ? "\nPROBLEMS\n" + problems.join("\n") : "\nAll links OK");
