#!/usr/bin/env node
// Deterministic screenshotter for the README gallery and the social card.
//
//   node scripts/shot.mjs <url> <out.png> [--w 1200] [--h 750] [--jpeg] [--wait 1200]
//   node scripts/shot.mjs --batch specimens.json
//
// Batch file shape: [{ "url": "...", "out": "...", "w": 1200, "h": 750 }, ...]

import { mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const argv = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 ? argv[i + 1] : dflt;
};
const has = (name) => argv.includes(`--${name}`);

// Resolve playwright from the project being shot, not from this script's location.
const req = createRequire(join(process.cwd(), "noop.js"));
let chromium;
for (const cand of ["playwright", "playwright-core"]) {
  try {
    const m = await import(pathToFileURL(req.resolve(cand)).href);
    chromium = m.chromium ?? m.default?.chromium;
    if (chromium) break;
  } catch { /* next */ }
}
if (!chromium) {
  console.error("playwright not resolvable from", process.cwd());
  process.exit(2);
}

let jobs;
const batch = flag("batch");
if (batch) {
  jobs = JSON.parse(await readFile(batch, "utf8"));
} else {
  const positional = argv.filter((a) => !a.startsWith("--") && argv[argv.indexOf(a) - 1]?.startsWith("--") !== true);
  const [url, out] = positional;
  if (!url || !out) {
    console.error("usage: node shot.mjs <url> <out.png> [--w N] [--h N] [--jpeg] [--wait ms]");
    process.exit(2);
  }
  jobs = [{ url, out, w: Number(flag("w", 1200)), h: Number(flag("h", 750)) }];
}

const wait = Number(flag("wait", 1200));
const jpeg = has("jpeg");
const browser = await chromium.launch();
let ok = 0;
const failures = [];

for (const j of jobs) {
  const w = j.w ?? 1200;
  const h = j.h ?? 750;
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: j.scale ?? 2,     // retina, so thumbnails stay crisp
    reducedMotion: "no-preference",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
  try {
    const res = await page.goto(j.url, { waitUntil: "networkidle", timeout: 45_000 });
    const status = res?.status() ?? 0;
    if (status >= 400) throw new Error(`HTTP ${status}`);
    await page.waitForTimeout(wait);
    await mkdir(dirname(j.out), { recursive: true });
    await page.screenshot({
      path: j.out,
      type: jpeg || j.out.endsWith(".jpg") ? "jpeg" : "png",
      quality: jpeg || j.out.endsWith(".jpg") ? 88 : undefined,
    });
    ok++;
    console.log(`ok    ${j.out}${errors.length ? `  (${errors.length} page errors)` : ""}`);
  } catch (e) {
    failures.push({ url: j.url, error: String(e).split("\n")[0].slice(0, 140) });
    console.log(`FAIL  ${j.url}  ${String(e).split("\n")[0].slice(0, 100)}`);
  }
  await ctx.close();
}

await browser.close();
console.log(`\n${ok} of ${jobs.length} captured`);
if (failures.length) {
  console.log("failures:");
  for (const f of failures) console.log(`  ${f.url}  ${f.error}`);
}
process.exit(failures.length ? 1 : 0);
