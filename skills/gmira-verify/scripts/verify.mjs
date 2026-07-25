#!/usr/bin/env node
// gmira-verify: five-viewport capture + mechanical checks.
// Usage: node verify.mjs <url> [--out DIR] [--reduced] [--no-canvas]
//
// It captures and measures. It does not judge. Read the screenshots yourself.

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const VIEWPORTS = [
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "834x1112", width: 834, height: 1112 },
  { name: "390x844", width: 390, height: 844 },
];

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--"));
const outDir = argValue("--out") ?? "gmira-proofs";
const reduced = args.includes("--reduced");
const deleteCanvas = args.includes("--no-canvas");

function argValue(flag) {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : undefined;
}

if (!url) {
  console.error("usage: node verify.mjs <url> [--out DIR] [--reduced] [--no-canvas]");
  process.exit(2);
}

// The skill usually lives outside the project it is verifying, so a bare import
// resolves against the script path and misses the project's node_modules. Try the
// project first, then fall back to whatever is resolvable from here.
let chromium;
{
  const { createRequire } = await import("node:module");
  const { pathToFileURL } = await import("node:url");
  const fromCwd = createRequire(join(process.cwd(), "noop.js"));
  const candidates = [
    () => import(pathToFileURL(fromCwd.resolve("playwright")).href),
    () => import(pathToFileURL(fromCwd.resolve("playwright-core")).href),
    () => import("playwright"),
  ];
  for (const load of candidates) {
    try {
      const mod = await load();
      // playwright is CJS, so named-export detection can miss and only `default` lands
      chromium = mod.chromium ?? mod.default?.chromium;
      if (chromium) break;
    } catch { /* try the next candidate */ }
  }
  if (!chromium) {
    console.error("playwright not resolvable. install it in this project:");
    console.error("  pnpm add -D playwright && npx playwright install chromium");
    process.exit(2);
  }
}

// Runs in the page. Everything here is measured from computed styles, not guessed.
const AUDIT = () => {
  const out = {
    contrast: [],
    overflow: [],
    measure: [],
    tracking: [],
    focusless: [],
    canvases: [],
    headings: [],
    images: [],
  };

  const parseRGB = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(",").map((v) => parseFloat(v));
    return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
  };
  const lum = ({ r, g, b }) => {
    const f = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
  // Walk ancestors for the first opaque background. Elements over a canvas or image
  // are reported separately because their real backdrop is not computable here.
  const backdrop = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== "none") return { unknown: true };
      const bg = parseRGB(cs.backgroundColor);
      if (bg && bg.a >= 0.95) return bg;
      n = n.parentElement;
    }
    const bg = parseRGB(getComputedStyle(document.body).backgroundColor);
    return bg && bg.a >= 0.95 ? bg : { unknown: true };
  };
  const label = (el) => {
    const t = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60);
    return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}: ${t}`;
  };
  // Average glyph advance in px for a given CSS font shorthand, measured once per font and cached.
  // Uses a representative latin sample rather than a magic ratio.
  const SAMPLE = "etaoinshrdlucmfwypvbgkjqxz ETAOINSHRDLU ,.";
  const advCache = new Map();
  const measurer = document.createElement("canvas").getContext("2d");
  const advance = (font, size) => {
    if (advCache.has(font)) return advCache.get(font);
    let px = size * 0.5;
    try {
      measurer.font = font;
      const w = measurer.measureText(SAMPLE).width;
      if (w > 0) px = w / SAMPLE.length;
    } catch { /* keep the fallback */ }
    advCache.set(font, px);
    return px;
  };

  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const all = Array.from(document.querySelectorAll("body *"));

  for (const el of all) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);

    // Visually-hidden text is clipped and off-palette on purpose. Auditing it fills the
    // report with false positives, and a report with false positives stops being read.
    if (cs.position === "absolute" && (el.clientWidth <= 1 || el.clientHeight <= 1)) continue;

    // text-bearing leaf elements only
    const hasOwnText = Array.from(el.childNodes).some(
      (n) => n.nodeType === 3 && n.textContent.trim().length > 1
    );

    if (hasOwnText) {
      const fg = parseRGB(cs.color);
      const bg = backdrop(el);
      const size = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const isLarge = size >= 24 || (size >= 18.66 && weight >= 700);
      const need = isLarge ? 3 : 4.5;
      if (fg && !bg.unknown) {
        const r = ratio(fg, bg);
        if (r < need) {
          out.contrast.push({ el: label(el), ratio: +r.toFixed(2), need, size, weight });
        }
      } else if (fg && bg.unknown) {
        out.contrast.push({ el: label(el), ratio: null, need, note: "backdrop is an image, gradient, or canvas: check by eye" });
      }

      // tracking floor
      const ls = cs.letterSpacing;
      if (ls && ls.endsWith("px")) {
        const em = parseFloat(ls) / size;
        if (em < -0.04) out.tracking.push({ el: label(el), em: +em.toFixed(4) });
      }

      // Measure, real running copy only. Buttons and labels that happen to wrap are not
      // prose, and flagging them is how a gate stops being trusted.
      const textLen = (el.textContent || "").trim().length;
      const isProse = textLen > 90 && size >= 12 && size < 24 &&
        !el.closest("button, a, nav, label, th, [role=button]");
      if (isProse && el.getBoundingClientRect().height > size * 2.2) {
        // Measure the real average advance for THIS element's font instead of assuming 0.5em.
        // A mono face is nearer 0.6em, so the flat assumption over-reports mono measure badly.
        const ch = el.getBoundingClientRect().width / advance(cs.font || `${cs.fontSize} ${cs.fontFamily}`, size);
        // 65 to 75ch is the desktop target. A phone cannot reach it and should not try,
        // so the floor drops rather than reporting every mobile paragraph as too narrow.
        const floor = window.innerWidth < 600 ? 30 : 45;
        if (ch > 75 || ch < floor) out.measure.push({ el: label(el), ch: Math.round(ch), chars: textLen });
      }
    }

    // Overflow / clipping. Visually-hidden text is clipped on purpose, so skip it or the
    // report fills with false positives and stops being read.
    const srOnly = cs.position === "absolute" && (el.clientWidth <= 1 || el.clientHeight <= 1);
    if (srOnly) continue;
    // Only report overflow that actually cuts content off. An element wider than its box with
    // `overflow: visible` (a rotated stamp, a hanging bullet) loses nothing, and document-level
    // horizontal scroll is reported separately.
    const clipsX = cs.overflowX === "hidden" || cs.overflowX === "clip";
    if (clipsX && el.scrollWidth > el.clientWidth + 2) {
      out.overflow.push({ el: label(el), axis: "x", by: el.scrollWidth - el.clientWidth });
    }
    if (el.scrollHeight > el.clientHeight + 2 && cs.overflowY === "hidden") {
      out.overflow.push({ el: label(el), axis: "y", by: el.scrollHeight - el.clientHeight });
    }
  }

  // Focus styles. Reading the resting state cannot see a :focus-visible rule, so the element
  // has to actually be focused and the two states compared. Anything else reports every
  // correctly-styled page as failing.
  {
    const active = document.activeElement;
    const scrollY = window.scrollY;
    for (const el of document.querySelectorAll("a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])")) {
      if (!visible(el)) continue;
      const snap = (cs) => ({
        // outlineColor matters: a resting `outline: 2px solid transparent` that turns opaque on
        // focus is a correct and common pattern, and comparing only style and width calls it a miss.
        o: cs.outlineStyle, w: cs.outlineWidth, oc: cs.outlineColor, off: cs.outlineOffset,
        s: cs.boxShadow, b: cs.borderColor, bw: cs.borderWidth, bg: cs.backgroundColor,
        c: cs.color, td: cs.textDecorationLine,
      });
      const rest = snap(getComputedStyle(el));
      try { el.focus({ preventScroll: true }); } catch { /* not focusable */ }
      if (document.activeElement !== el) continue;   // genuinely not focusable, not a finding
      const now = snap(getComputedStyle(el));
      const changed = Object.keys(rest).some((k) => rest[k] !== now[k]);
      if (!changed) out.focusless.push({ el: label(el) });
    }
    try { el_blur(); } catch { /* noop */ }
    function el_blur() { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); }
    if (active instanceof HTMLElement) { try { active.focus({ preventScroll: true }); } catch {} }
    window.scrollTo(0, scrollY);
  }

  // canvas health
  for (const c of document.querySelectorAll("canvas")) {
    const r = c.getBoundingClientRect();
    const dpr = r.width ? +(c.width / r.width).toFixed(2) : null;
    let ctxLost = null;
    try {
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      ctxLost = gl ? gl.isContextLost() : "2d-or-none";
    } catch { ctxLost = "unavailable"; }
    out.canvases.push({
      css: `${Math.round(r.width)}x${Math.round(r.height)}`,
      buffer: `${c.width}x${c.height}`,
      effectiveDpr: dpr,
      dprOverCap: dpr !== null && dpr > 2.05,
      ariaHidden: c.getAttribute("aria-hidden") === "true",
      pointerEventsNone: getComputedStyle(c).pointerEvents === "none",
      contextLost: ctxLost,
    });
  }

  // heading order
  let prev = 0;
  for (const h of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
    const lvl = +h.tagName[1];
    if (prev && lvl > prev + 1) out.headings.push({ el: label(h), from: prev, to: lvl });
    prev = lvl;
  }

  // images without alt
  for (const img of document.querySelectorAll("img")) {
    if (img.getAttribute("alt") === null) out.images.push({ src: (img.currentSrc || img.src).slice(-70) });
  }

  out.textWithoutBackdrop = out.contrast.filter((c) => c.ratio === null).length;
  return out;
};

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const report = { url, when: new Date().toISOString(), reduced, deleteCanvas, viewports: [] };

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => pageErrors.push(String(e)));

  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => {});
  // let effects settle and any entrance animation finish
  await page.waitForTimeout(1400);

  if (deleteCanvas) {
    await page.evaluate(() => document.querySelectorAll("canvas").forEach((c) => c.remove()));
    await page.waitForTimeout(300);
  }

  const audit = await page.evaluate(AUDIT);

  const suffix = `${vp.name}${reduced ? "-reduced" : ""}${deleteCanvas ? "-nocanvas" : ""}`;
  const shot = join(outDir, `${suffix}.png`);
  await page.screenshot({ path: shot, fullPage: false });
  const shotFull = join(outDir, `${suffix}-full.png`);
  await page.screenshot({ path: shotFull, fullPage: true });

  const docOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );

  report.viewports.push({
    viewport: vp.name,
    screenshot: shot,
    screenshotFull: shotFull,
    consoleErrors,
    pageErrors,
    horizontalPageScroll: docOverflow,
    ...audit,
  });

  await context.close();
}

await browser.close();

// ---- summarize ----
const sum = (k) => report.viewports.reduce((n, v) => n + (Array.isArray(v[k]) ? v[k].length : 0), 0);
const totals = {
  consoleErrors: sum("consoleErrors") + sum("pageErrors"),
  contrastFailures: report.viewports.reduce(
    (n, v) => n + v.contrast.filter((c) => c.ratio !== null).length, 0),
  contrastUncheckable: report.viewports.reduce(
    (n, v) => n + v.contrast.filter((c) => c.ratio === null).length, 0),
  overflow: sum("overflow"),
  measureOutOfRange: sum("measure"),
  trackingTooTight: sum("tracking"),
  missingFocusStyles: sum("focusless"),
  headingSkips: sum("headings"),
  imagesMissingAlt: sum("images"),
  horizontalPageScroll: report.viewports.filter((v) => v.horizontalPageScroll).map((v) => v.viewport),
  dprOverCap: report.viewports.flatMap((v) => v.canvases.filter((c) => c.dprOverCap).map(() => v.viewport)),
};
report.totals = totals;

await writeFile(join(outDir, "report.json"), JSON.stringify(report, null, 2));

const g9 = totals.consoleErrors === 0;
const lines = [
  `# gmira-verify`,
  ``,
  `URL: ${url}`,
  `When: ${report.when}`,
  reduced ? `Mode: prefers-reduced-motion: reduce` : ``,
  deleteCanvas ? `Mode: canvas elements removed before audit` : ``,
  ``,
  `## Mechanical totals`,
  ``,
  `| Check | Count |`,
  `|---|---|`,
  `| Console + page errors | ${totals.consoleErrors} ${g9 ? "(G9 green)" : "(G9 FAILS)"} |`,
  `| Contrast failures | ${totals.contrastFailures} |`,
  `| Contrast uncheckable (text over image, gradient, or canvas) | ${totals.contrastUncheckable} |`,
  `| Clipped or overflowing elements | ${totals.overflow} |`,
  `| Body measure outside 45 to 75ch | ${totals.measureOutOfRange} |`,
  `| Tracking below -0.04em | ${totals.trackingTooTight} |`,
  `| Interactive elements with no focus style | ${totals.missingFocusStyles} |`,
  `| Heading level skips | ${totals.headingSkips} |`,
  `| Images with no alt attribute | ${totals.imagesMissingAlt} |`,
  `| Viewports with horizontal page scroll | ${totals.horizontalPageScroll.join(", ") || "none"} |`,
  `| Canvases above the DPR 2.0 cap | ${totals.dprOverCap.length} |`,
  ``,
  `## Screenshots`,
  ``,
  ...report.viewports.map((v) => `- ${v.viewport}: \`${v.screenshot}\``),
  ``,
  `## Still yours to do`,
  ``,
  `This script measured. It did not judge. Before reading the table above, open`,
  `the 1440x900 and 390x844 screenshots and write down what you see. Then run the`,
  `four checks no script can fake: delete the canvas, emulate reduced motion,`,
  `20 route changes for GPU teardown, and a full keyboard pass.`,
  ``,
];
await writeFile(join(outDir, "report.md"), lines.filter((l) => l !== "").join("\n") + "\n");

console.log(`\nwrote ${outDir}/report.md and report.json`);
console.log(`G9 console errors: ${totals.consoleErrors} ${g9 ? "OK" : "FAIL"}`);
console.log(`contrast failures: ${totals.contrastFailures}, overflow: ${totals.overflow}, no-focus: ${totals.missingFocusStyles}`);
console.log(`\nNow open the screenshots and look at them.\n`);

process.exit(g9 ? 0 : 1);
