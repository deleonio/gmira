---
name: gmira-slop
description: Use when a built page needs the audit for the visual tells no detector catches, or when someone says a page looks generic, templated, bland, stock, or "AI-made" and cannot say why. Run it before showing any surface to the user, and again after a redesign pass. Detects uniform section rhythm, the three-column reflex, one crop ratio everywhere, accent-as-confetti, identical section entrances, the icon-plus-heading-plus-two-lines feature card, the ghost card, grids that truncate real content to stay even, decorative chrome standing in for data, a full-bleed effect turned down until it does nothing, and single-registry house style. Produces a findings table with severity that says what should happen, plus a specificity score per section.
---

# Slop

The audit for what a rule engine cannot see. None of these twelve are individually wrong. All of
them are signatures of assembly rather than design.

Load `../gmira/references/DOCTRINE.md` first. This skill implements its Part 5 and Part 7.

## The premise

A detector finds gradient text, tiny type, and low contrast. It cannot find a page where every
section has the same vertical padding, every set of things became three columns, and every image is
cropped 16:9, because each of those is a legal value. **The tell is the uniformity, not the value.**

That is also why this skill runs a judgment pass before it runs a single measurement.

## Step 0: the anchoring quarantine

Do this in order. It is the most important instruction in the file.

```
1  Open the page at 1440x900. Do not open the console. Do not run any snippet.
   Do not read the build log, the detector output, or any prior findings file.
2  Do the taste read (Step 1). Write it to .gmira/slop/<slug>-read.md and save.
3  Only now run the measurements in Step 2 and read any console or detector output.
4  Synthesize. Note where the read and the measurements agree, what the measurements
   caught that the read missed, and which measurements are false positives against the
   direction contract.
```

The reason: a machine-verified list of fourteen findings hijacks aesthetic judgment when it arrives
first. The reviewer stops looking once the machine's list is satisfied, and **the detector's output
becomes the ceiling of the judgment.** Deterministic evidence is treated here as cognitively
contaminating, which is why it is quarantined until the judgment is written down and saved.

```
INCORRECT   run the checks, read the fourteen findings, then look at the page and write
            the review. The review contains fourteen findings.
CORRECT     look at the page, write the review, save the file, then run the checks. The
            review contains the three things no check can see, and the checks add nine
            it could not have measured by eye.
```

**Loud degradation.** If the page cannot be rendered (no browser, no dev server, source only), the
first line of the report is mandatory:

```
WARNING DEGRADED: source-only read, no rendered page
```

A source-only pass finds roughly half of these tells and none of the measured ones. "Unavailable"
never includes "inconvenient".

## Step 1: the taste read, in isolation

Four things, written down before any measurement.

1. **The argument.** What does this page argue, in one sentence, read from the render alone. If you
   cannot say it without reading the copy, the design is not carrying it.
2. **Specificity, per section.** For each section, write the one sentence that could only be true of
   this product. Then run the swap: put a competitor's name in and see whether anything becomes
   false. If nothing does, mark the section GENERIC. **The specificity test applies per section,
   not per page.** A page can have a specific hero and six interchangeable sections, and that is the
   most common shape of the failure.
3. **The peak.** Which section is the peak of the scroll, and which sections are the queue. If there
   is no peak, that is finding number one and it outranks everything measured later.
4. **The memory test.** What would someone describe an hour after leaving. If the honest answer is a
   mood, the direction never committed and the fix is upstream in `gmira-direction`.

## Step 2: the twelve tells, with a check for each

Numbering matches the doctrine's Part 5 list. Each entry gives the check and the threshold at which
it becomes a finding.

**1. Uniform section rhythm.** Every section the same vertical padding, so the page has no emphasis,
only a queue. Check: computed block padding per section, bucketed to 16px. Finding at four or more
sections with 70% of them sharing one bucket.

**2. The three-column reflex.** Any set of things becomes three columns regardless of what the set
is. Check: count grids whose `grid-template-columns` resolves to exactly three tracks. Finding at
two or more, when they hold different kinds of things.

**3. One crop ratio everywhere.** Every image the same aspect, so nothing is featured. Check:
rounded width/height ratio per rendered image. Finding at six or more images with two or fewer
distinct ratios.

**4. Single accent applied everywhere.** Check: the most-used chromatic background color, its
element count, and the share of total page area it paints. Finding at fifteen or more elements with
under 5% surface coverage. A committed color strategy covers **30 to 60%** of the surface. Under 5%
across twenty elements is confetti, and the accent has stopped meaning anything.

**5. Every section entering identically.** Fade-up, 0.6s, stagger 0.1, forever. Check in source, it
is more reliable than the DOM:

```bash
rg -c "whileInView|data-reveal|animate-fade-up" src/
rg -no "duration: *[0-9.]+" src/ | sed 's/.*duration: *//' | sort | uniq -c | sort -rn | head
```

Finding at four or more sections sharing one duration, delay, and offset triple. Routes to
`gmira-motion`.

**6. Icon plus heading plus two lines** as the answer to every group of items. Check: headings whose
previous sibling contains an `svg` and whose next sibling is a `p`. Finding at three or more.

**7. Sentence-case everything, or title-case everything,** with no distinction earned by hierarchy.
Check:

```js
const cls = t => t === t.toUpperCase() ? 'UPPER'
  : /^[A-Z][^A-Z]*$/.test(t.replace(/[^\w ]/g, '')) ? 'Sentence' : 'Title';
console.table([...document.querySelectorAll('h1,h2,h3,h4,button,nav a')]
  .map(e => ({ tag: e.tagName, case: cls(e.textContent.trim()), text: e.textContent.trim().slice(0, 32) })));
```

Finding when one casing class covers every role. Hierarchy is then carried by size alone, and size
alone is doing all the work.

**8. The full-bleed effect that must stay quiet.** Turned down so far it reads as a filter left on.
This one needs pixels, not the DOM:

```js
// Playwright
const withFx = await page.screenshot();
await page.addStyleTag({ content: 'canvas{display:none!important}' });
const without = await page.screenshot();
const a = await sharp(withFx).raw().toBuffer();
const b = await sharp(without).raw().toBuffer();
let sum = 0; for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i]);
console.log('mean channel delta', (sum / a.length).toFixed(2));
```

Finding when the mean channel delta is **under 6 of 255** while the canvas covers more than 60% of
the viewport. The effect is paying full weight and doing no visible work. Two exits, both fine:
bound it to a region and run it at full strength, or cut it and take the bytes back. Routes to
`gmira-canvas`.

**9. Perfectly even card heights** achieved by truncating real content to fit the grid. Check:
elements with an active `-webkit-line-clamp`, or `text-overflow: ellipsis` with real overflow.
Finding at three or more. The content was written and then hidden so the boxes would match.

**10. The centered column with nothing to its left or right,** at every breakpoint, so the desktop
layout is the mobile layout with more air. Check: per section, the left gutter and the right gutter.
Finding when four or more sections are symmetric within 4px and identical to each other, with
nothing breaking the band at 1920.

**11. Chrome standing in for content.** Sparklines, progress rings, and soft-shadowed rounded
rectangles where the actual data should be. Check: `svg` containing `stroke-dasharray` rings or bare
polylines inside card-like containers with no data source. Finding at two or more. Read the result
with your own eyes, this one has false positives on real charts.

**12. Effects all from one registry,** so the page inherits that registry's house style instead of
the brief's. Check the provenance comments `gmira-arsenal` writes at install:

```bash
rg -n "gmira:" src/components/ui | head -20
rg -o "@(componentry|canvas-ui|bklit|ncdai|kibo-ui|react-bits|soundcn)" -r '$1' components.json | sort | uniq -c
```

Finding at three or more effects from a single source. Mix sources, or author the second effect
yourself.

### The measured ones, in one paste

Covers tells 1, 2, 3, 4, 6, 9, 10, 11, plus the ghost card. Run it only after Step 1 is saved.

```js
(() => {
  const out = [];
  const n = v => Math.round(parseFloat(v) || 0);
  const secs = [...document.querySelectorAll('main > *, body > section')]
    .filter(e => e.getBoundingClientRect().height > 240);

  // 1 uniform section rhythm
  const bucket = {};
  secs.forEach(s => { const c = getComputedStyle(s);
    const k = Math.round((n(c.paddingTop) + n(c.paddingBottom)) / 16) * 16;
    bucket[k] = (bucket[k] || 0) + 1; });
  const top1 = Object.entries(bucket).sort((a, b) => b[1] - a[1])[0];
  if (secs.length >= 4 && top1 && top1[1] / secs.length >= 0.7)
    out.push(['1 uniform-rhythm', `${top1[1]}/${secs.length} sections at ~${top1[0]}px block padding`]);

  // 2 three-column reflex
  const tracks = [...document.querySelectorAll('*')]
    .filter(e => getComputedStyle(e).display.includes('grid'))
    .map(e => getComputedStyle(e).gridTemplateColumns.split(' ').filter(Boolean).length);
  const threes = tracks.filter(t => t === 3).length;
  if (threes >= 2) out.push(['2 three-column', `${threes} of ${tracks.length} grids resolve to exactly 3 tracks`]);

  // 3 one crop ratio
  const ratios = [...document.images]
    .filter(i => i.getBoundingClientRect().width > 80)
    .map(i => { const r = i.getBoundingClientRect(); return (r.width / r.height).toFixed(2) });
  const uniq = new Set(ratios);
  if (ratios.length >= 6 && uniq.size <= 2)
    out.push(['3 one-crop', `${ratios.length} images, ${uniq.size} ratio(s): ${[...uniq].join(', ')}`]);

  // 4 accent as confetti
  const chroma = new Map();
  for (const e of document.querySelectorAll('body *')) {
    const v = (getComputedStyle(e).backgroundColor.match(/[\d.]+/g) || []).map(Number);
    if (v.length < 3 || (v[3] ?? 1) < 0.5) continue;
    if (Math.max(v[0], v[1], v[2]) - Math.min(v[0], v[1], v[2]) < 24) continue;   // neutral
    const r = e.getBoundingClientRect();
    const key = `rgb(${v[0]},${v[1]},${v[2]})`;
    const rec = chroma.get(key) || { count: 0, area: 0 };
    rec.count++; rec.area += Math.max(r.width, 0) * Math.max(r.height, 0);
    chroma.set(key, rec);
  }
  const acc = [...chroma.entries()].sort((a, b) => b[1].count - a[1].count)[0];
  if (acc) {
    const cover = acc[1].area / (innerWidth * document.body.scrollHeight) * 100;
    if (acc[1].count >= 15 && cover < 5)
      out.push(['4 accent-confetti', `${acc[0]} on ${acc[1].count} elements, ${cover.toFixed(1)}% of surface`]);
  }

  // 6 icon + heading + two lines
  const tiles = [...document.querySelectorAll('h2,h3,h4')].filter(h => {
    const p = h.previousElementSibling, x = h.nextElementSibling;
    return p && p.querySelector('svg') && x && x.tagName === 'P';
  }).length;
  if (tiles >= 3) out.push(['6 icon-heading-two-lines', `${tiles} instances of the feature-card shape`]);

  // 9 truncated to fit
  const clamped = [...document.querySelectorAll('body *')].filter(e => {
    const s = getComputedStyle(e);
    return (s.webkitLineClamp && s.webkitLineClamp !== 'none')
        || (s.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 1);
  });
  if (clamped.length >= 3) out.push(['9 truncated-to-fit', `${clamped.length} elements clipping real copy to hold a grid`]);

  // 10 the centered column
  const gut = secs.map(s => {
    const kids = [...s.children].map(k => k.getBoundingClientRect()).filter(r => r.width > 0);
    if (!kids.length) return null;
    return [Math.round(Math.min(...kids.map(r => r.left))),
            Math.round(innerWidth - Math.max(...kids.map(r => r.right)))];
  }).filter(Boolean);
  const centered = gut.filter(([l, r]) => Math.abs(l - r) <= 4 && l > 24).length;
  if (gut.length >= 4 && centered === gut.length)
    out.push(['10 centered-column', `all ${gut.length} sections symmetric at ~${gut[0][0]}px, nothing breaks the band`]);

  // 11 decorative chrome
  const chromeSvg = [...document.querySelectorAll('svg')].filter(s =>
    s.querySelector('[stroke-dasharray]') ||
    (s.querySelector('polyline,path') && s.closest('[class*="card"],[class*="stat"]') && !s.closest('a,button')));
  if (chromeSvg.length >= 2)
    out.push(['11 decorative-chrome', `${chromeSvg.length} sparkline or ring shapes with no data behind them`]);

  // the ghost card: elevation declared twice
  const blur = s => { const m = s.boxShadow.match(/-?[\d.]+px/g) || []; return m[2] ? Math.abs(parseFloat(m[2])) : 0 };
  const ghosts = [...document.querySelectorAll('body *')].filter(e => {
    const s = getComputedStyle(e);
    const bw = parseFloat(s.borderTopWidth) || 0;
    return bw > 0 && bw <= 1.5 && s.boxShadow !== 'none' && blur(s) >= 12;
  });
  if (ghosts.length) out.push(['ghost-card', `${ghosts.length} elements with a 1px border under a >=12px soft shadow`]);

  console.table(out.map(([id, evidence]) => ({ id, evidence })));
  return out.length;
})()
```

## Step 3: the refusal lists

Not bans. The brief's own words can earn any of them. **Reaching for one when the axis is free means
you were not deciding.** Present without a logged reason is a finding.

### Category defaults

| Default | Check |
|---|---|
| Same-size cards of icon plus heading plus text as the page structure | tell 6 above. Nested cards are always wrong: `rg "Card" src/ \| rg "Card.*Card"` or look for a bordered box inside a bordered box |
| The hero-metric template: big number, small label, supporting stats, accent | a first-viewport element above 3rem whose text is numeric |
| A tracked uppercase eyebrow over every section | count elements with `text-transform: uppercase` and `letter-spacing > 0.08em` above an `h2`. One named kicker is a system, one over every section is grammar you did not choose |
| Section numbers 01 / 02 / 03 with no information in the sequence | `rg -o ">0[1-9]<" src/` |
| A modal for a task needing neither interruption nor protected focus | count `Dialog` usages, and ask what each one protects |
| Glass and blur as decoration rather than as a specific effect | `backdrop-filter` on elements with nothing live behind them |
| A colored `border-left` above 1px on cards, list items, callouts | `border-left-width > 1px` with a chromatic `border-left-color` and zero width on the other axes |
| Light or dark picked by category rather than from the use scene | ask for the one sentence of physical scene that forced it |

### Components refused by default

The most-cloned primitives, present in a dozen registries and on every assembled landing page. Use
one at most, restyled past recognition, and log it.

```bash
rg -l "border-beam|shimmer-button|pulsating-button|interactive-hover-button|text-animate|hyper-text|scroll-based-velocity" src/
rg -l "matrix-rain|particle-galaxy|liquid-blob" src/
```

`matrix-rain` on anything AI-adjacent and `particle-galaxy` as a generic backdrop are the two most
exhausted "we do AI" cliches, and using them undercuts the exact credibility the page is buying.
`liquid-blob` reads as 2021 Dribbble.

Underused and worth reaching for instead: `circuit-board`, `split-flap-display`, `ascii-effect`,
`dithered-logo`, `scrub-input`, `orbit-card-stack`, `silk-aurora`.

## Step 4: the named-failure vocabulary

Named failures are findable failures. Use these names in the report so the same thing gets called
the same thing twice.

| Name | What it looks like | Route |
|---|---|---|
| **the welded constant** | a prop exists for a thing and a hardcoded value overrides it every frame | `gmira-arsenal` |
| **the gallery-GIF default** | the component still carries the settings tuned to win a five-second recording | `gmira-arsenal` |
| **the frame-zero void** | the effect only exists after pointer input, so most visitors never see it | `gmira-canvas` |
| **the filter left on** | a full-bleed effect turned down until it does no visible work | `gmira-canvas` |
| **the assembled page** | every section is a correct pattern and no section is a decision | `gmira-direction` |
| **the ghost card** | a 1px border under a wide soft shadow, elevation declared twice | auto-fix |
| **the wall of options** | ten or more choices at one decision point with no hierarchy | `gmira-flow` |

The wall of options has a check too:

```js
[...document.querySelectorAll('form, nav, fieldset, [role="group"]')]
  .map(g => ({ el: g, options: g.querySelectorAll('a,button,input,select,[role="option"]').length }))
  .filter(x => x.options >= 10)
```

When you find a failure that has no name here, name it, define it in one line, and add it. The
vocabulary is meant to grow.

## Step 5: score

Two axes, both 0 to 4, both honest. An inflated score makes the trend line useless.

**Specificity, per section.**

| Score | Meaning |
|---|---|
| 0 | an unrelated product could ship this section unchanged |
| 1 | only the copy is specific, the structure is a stock pattern |
| 2 | one element is specific, the rest is scaffolding |
| 3 | the structure carries a product fact a competitor would have to rebuild |
| 4 | the section could only exist for this product, and still reads with the copy removed |

Page specificity is the sum over `4 x sections scored`, printed as a percentage with the section
count. Never print a percentage without the denominator. Bands: 90%+ excellent, 70%+ good, 50%+
acceptable, 30%+ poor, below that critical.

**Commitment, once for the page.** Whether the direction contract is legible in the render.

| Score | Meaning |
|---|---|
| 0 | no direction is visible anywhere in the page |
| 2 | the direction is visible in the palette only |
| 4 | the direction is legible with all copy removed: the skeleton says what this is |

Calibration: most built pages land at 40 to 70% specificity and a commitment of 2. A 4 on either
axis is rare and means it.

## Step 6: the report

The chat response is the deliverable. Severity says **what should happen, not how bad it is.**

| Severity | Meaning |
|---|---|
| `auto` | fix it silently in the next write to that file, do not ask |
| `mention` | state it once and carry on, it is a judgment call the user owns |
| `route` | name the skill that owns the repair, and stop here |

```
Specificity 61% (11/18 over 5 sections, Acceptable) · Commitment 2/4

| # | Tell | Where | Evidence | Severity | Route |
|---|---|---|---|---|---|
| 1 | uniform section rhythm | main, all | 6/7 sections at 96px block padding | mention | gmira-scroll |
| 2 | ghost card | .price-card x3 | 1px border under a 24px shadow | auto | - |
| 3 | the filter left on | hero canvas | mean channel delta 3.1/255 over 78% of viewport | route | gmira-canvas |
| 4 | accent confetti | 22 elements | #C8102E on 22 elements, 1.4% of surface | route | gmira-palette |
| 5 | GENERIC section | "Why choose us" | swap test: nothing becomes false | route | gmira-direction |
```

Order by what blocks the most: sections marked GENERIC first, then `route`, then `auto`, then
`mention`. Be direct and specific. "The pricing card", not "some elements". Say what is wrong and
why it matters. Cut "consider exploring" entirely. If everything is important, nothing is.

## Finding nothing is a valid result

A clean page returns a clean report. Say so in one line, print the two scores, and stop.

**Padding the list is worse than an empty one.** A report with three real findings and four invented
ones sends the fix pass after the invented four, and the real three stay. When a check fires but the
direction contract earned it, that is not a finding, that is the contract working: note it as a
false positive in the synthesis and move on.

```
INCORRECT   twelve findings, four of them "the spacing could be more considered"
CORRECT     three findings with a measurement each, and a line saying the other nine
            checks passed
```

## Checks before this skill is done

- [ ] The taste read was written and saved before any snippet ran or any detector output was read
- [ ] The specificity swap test was applied per section, not once for the page
- [ ] All twelve tells were checked, with a measurement where one exists
- [ ] The refusal lists were grepped, and any hit is either logged as earned or reported
- [ ] Every finding names its failure from the vocabulary and carries evidence, not an adjective
- [ ] Every finding has a severity that says what should happen and a route where the repair lives
- [ ] Both scores printed with their denominators
- [ ] Nothing in the list was added to make the list longer
