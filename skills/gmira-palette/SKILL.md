---
name: gmira-palette
description: Use when choosing, deriving, or repairing the colors of a web surface: picking a strategy, building OKLCH ramps, wiring Tailwind v4 theme variables or shadcn base colors, or deciding dark versus light. Also use when the accent only ever shows up on one button, when secondary text on a colored panel came out gray, when a headline is set in gradient text, when contrast was eyeballed instead of measured, when a page reads as "one hue applied everywhere so it stopped meaning anything", or when a WebGL layer renders lighter and more saturated than every source hex you passed it. Covers the four color strategies, the 30 to 60 percent surface coverage floor for Committed, derivation from a named material world instead of a category default, contrast read from computed styles, and pixel verification of canvas surfaces. Owns doctrine section 3.2 and the palette half of Law 1.
---

# Palette

Color is decided at page scale, from a named material, and verified in measured numbers.

Load `../gmira/references/DOCTRINE.md` first. Section 3.2 is the floor this skill enforces;
Law 1 is the reason the last section exists.

## The premise

**Color commits at page scale: fields that own whole regions, not accents scattered over a neutral
ground.** The single most common failure is not an ugly hue, it is a palette that was never
committed to: one saturated color assigned to `--primary`, spent on a button and a link underline,
with everything else neutral. That page is Restrained pretending to be Committed, and it reads as a
default because it is one.

The second most common failure is deriving the hue from the category. Automotive gets red, finance
gets blue, sustainability gets green, AI gets violet. **Hue comes from the material world named in
the direction contract, never from a category association.**

## Step 1: pick a strategy, then pick colors

| Strategy | Definition | Coverage of the rendered surface |
|---|---|---|
| **Restrained** | neutrals plus one accent | accent under 10% |
| **Committed** | one saturated color carries the page | **30 to 60%**, measured |
| **Full palette** | 3 to 4 named roles, each owning a region | no single role above 45% |
| **Drenched** | the surface is the color | above 60%, neutrals become the accent |

Mode gates which are open:

| Mode | Open strategies |
|---|---|
| Persuade, Experience | all four. Color may own large regions. |
| Operate, Read | **Restrained is the floor and usually the answer.** Color encodes action, selection, status, wayfinding, and reading hierarchy. Rarity is what gives an accent force. |

### Committed is a measurement, not an intention

Screenshot the built page full height, then count.

```js
// node, sharp. share of the rendered surface owned by the committed color.
import sharp from "sharp"
const ACCENT = [0xc1, 0x46, 0x2a]                     // sampled from the built page, not from the token
const { data, info } = await sharp("full.png").removeAlpha()
  .raw().toBuffer({ resolveWithObject: true })
let hit = 0
for (let i = 0; i < data.length; i += 3) {
  const d = Math.max(Math.abs(data[i] - ACCENT[0]),
                     Math.abs(data[i + 1] - ACCENT[1]),
                     Math.abs(data[i + 2] - ACCENT[2]))
  if (d < 48) hit++
}
console.log((100 * hit / (info.width * info.height)).toFixed(1) + "%")
```

Under 30% with a Committed strategy declared means the strategy was declared and not executed. Fix
it by giving the color a region (a full-bleed band, the footer, the entire spec column, every
alternating row, the whole first viewport), not by adding more small accents.

```
INCORRECT   --primary: the brand color, used on buttons, links, and one icon. 4% coverage.
CORRECT     the plate color owns the section bands, the part-number column, the active
            filter chips, and the full-bleed footer. 38% coverage, measured from a screenshot.
```

## Step 2: dark or light comes from the scene, never the category

Write one sentence of physical scene from the brief's `SCENE` block and let it force the answer.
Do not pick dark because the product is technical. Do not pick light because the product is retail.

| Scene sentence | Forced answer |
|---|---|
| A workshop foreman checks stock on a wall-mounted 27 inch panel under fluorescent tubes at 07:00, reading from three metres. | Light, high contrast, large type. Dark mirrors the room and the panel becomes a mirror. |
| A student opens the syllabus at 23:40, in bed, phone at 20% brightness. | Dark is primary, light is the secondary theme, and the brightness floor matters more than the ceiling. |
| A buyer compares two listings on a phone, outdoors, in direct sun, standing on the forecourt. | Light, and the price and mileage go past AA to 7:1 because sunlight eats the bottom three stops. |

```
INCORRECT   dark, because the product is a developer tool and developer tools are dark.
CORRECT     the scene says a workshop foreman reads it from three metres under
            fluorescent tubes at 07:00. Light, with the figures at 7:1. The category
            never entered the decision.
```

If both themes ship, **design the dark surface explicitly. Do not invert the light theme
mechanically.** Elevation in dark comes from lighter surfaces, not from shadows, and the accent
usually needs its chroma reduced and its lightness raised to hold the same perceived weight.

A world may legitimately have no dark mode. A paper world inverted is not a dark mode, it is a
broken paper world. If the answer is "this world has one light state", ship one and say so in the
brief.

## Step 3: derive the palette from the material world

Five steps. The check at the end is the one that matters.

1. **Read `OWN-WORLD` from the direction contract.** No contract means no palette. Stop and run
   `gmira-direction`.
2. **List six actual materials from that world**, each written as what it physically is, not as a
   color name. "Uncoated newsprint, aged, warm" not "off-white".
3. **Sample each into OKLCH.** Physical materials are duller than screen colors. A 1970s spot-plate
   red lands near chroma 0.185, not 0.28. Keeping screen chroma is how a material world turns back
   into a default palette.
4. **Assign roles from the world's own logic.** Ground from the substrate. Ink from the mark.
   Accent from the second plate or the signal element. Rules and separators from the accent,
   tinted, **never from gray**.
5. **Delete anything that did not come from step 2.**

**The trace check: every token names the material it came from, in a comment. A token that cannot
be traced came from the default palette and has to go.**

```
INCORRECT   the vertical is automotive, so red: --primary: oklch(0.58 0.24 27)
CORRECT     the world is a 1970s parts catalogue and its second ink is a spot vermilion
            printed on uncoated stock: oklch(0.552 0.185 34). Duller and warmer than any
            screen red, because ink on absorbent paper is. The token comment names it.
```

### Worked example: a 1970s Porsche parts catalogue

The direction contract says: monospace part numbers, hairline rules, photographs on a neutral card,
no rounded corners anywhere. The materials, in order:

| Material | What it physically is | OKLCH |
|---|---|---|
| Uncoated stock, aged | warm off-white newsprint, never paper white | `oklch(0.962 0.010 88)` |
| Shaded block | the same stock under a 6% screen tint | `oklch(0.928 0.014 86)` |
| Press black | dense warm near-black with dot gain on uncoated | `oklch(0.235 0.014 62)` |
| Black at 60% tint | secondary copy and captions | `oklch(0.470 0.018 66)` |
| Spot plate | the second ink: signal vermilion, section bands and callout numbers | `oklch(0.552 0.185 34)` |
| Diagram ink | the technical blue-green of exploded-view callouts | `oklch(0.470 0.075 205)` |

Strategy: **Committed.** The plate owns the section bands, the part-number column, active states,
and the full-bleed footer. Measured coverage on the built page: 38%.

Rules are derived, not invented:

```css
--rule: color-mix(in oklch, var(--plate) 24%, var(--stock));   /* the plate at a 24% tint */
--line: color-mix(in oklab, var(--rule) 64%, var(--stock));    /* softer than the border, see gmira-typeset */
```

Contrast, measured on the built page, not calculated from the token:

| Pair | Ratio | Verdict |
|---|---|---|
| press black on stock | 11.2:1 | body, everywhere |
| 60% tint on stock | 5.6:1 | secondary copy, passes 4.5 |
| plate on stock | 5.2:1 | passes body but with no headroom, so plate is used for large text and fills, and body copy on stock stays ink |
| stock on plate | 5.5:1 | reversed copy inside the bands |
| secondary on plate | `color-mix(in oklch, var(--plate-ink) 84%, var(--plate))`, 4.7:1 | **the mix percentage is a starting point, then you measure.** 74% looked right and lands at 4.05:1, which fails |

That last row is the rule in doctrine 3.2 made concrete: **on colored surfaces, secondary text is
tinted from that hue or from the foreground. It is never gray, and the mix ratio is measured, not
guessed.**

```
INCORRECT   <div class="bg-plate"><p class="text-muted-foreground">Bestellnummer</p></div>
CORRECT     <div class="bg-plate"><p class="text-plate-ink/[0.84]">Bestellnummer</p></div>
            then measure it, because opacity over a saturated ground rarely lands where you expect.
```

## Step 4: wire it

Two blocks. Primitives carry values and comments. The semantic block carries only assignments.
**No new color value ever appears in the semantic block.**

```css
/* app/globals.css */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

:root {
  /* --- the material world, sampled. every line names its material. --- */
  --stock:      oklch(0.962 0.010 88);   /* uncoated newsprint, aged */
  --stock-2:    oklch(0.928 0.014 86);   /* the same stock under a 6% screen tint */
  --ink:        oklch(0.235 0.014 62);   /* press black on uncoated, with dot gain */
  --ink-2:      oklch(0.470 0.018 66);   /* press black at a 60% tint */
  --plate:      oklch(0.552 0.185 34);   /* the second ink: signal vermilion */
  --plate-ink:  oklch(0.978 0.012 60);   /* stock knocked out of the plate */
  --diagram:    oklch(0.470 0.075 205);  /* exploded-view callout ink */
  --rule:       color-mix(in oklch, var(--plate) 24%, var(--stock));
  --line:       color-mix(in oklab, var(--rule) 64%, var(--stock));

  /* --- shadcn roles. assignments only. --- */
  --background: var(--stock);
  --foreground: var(--ink);
  --card: var(--stock);
  --card-foreground: var(--ink);
  --popover: var(--stock-2);
  --popover-foreground: var(--ink);
  --primary: var(--plate);
  --primary-foreground: var(--plate-ink);
  --secondary: var(--stock-2);
  --secondary-foreground: var(--ink);
  --muted: var(--stock-2);
  --muted-foreground: var(--ink-2);
  --accent: var(--diagram);
  --accent-foreground: var(--plate-ink);
  --destructive: oklch(0.505 0.192 27);  /* the plate hue pushed to a warning register */
  --border: var(--rule);
  --input: var(--rule);
  --ring: var(--plate);
  --radius: 0rem;                        /* the contract says no rounded corners anywhere */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --color-line: var(--line);             /* gives bg-line, border-line, text-line */
  --color-plate: var(--plate);
  --color-plate-ink: var(--plate-ink);
}
```

`@theme inline` is what makes the roles available as utilities while keeping the runtime values in
`:root`, so a `.dark` block can remap them without regenerating classes.

Three technique rules that stop palettes from drifting:

- **Prefer explicit colors over chains of translucent overlays.** `bg-black/5` over `bg-muted` over
  an image makes contrast context-dependent and unmeasurable. Two stacked alphas is the limit.
- **When building an OKLCH ramp, vary lightness and reduce chroma near white and black.** Holding
  high chroma at extreme lightness to keep the math uniform produces the neon step that everyone
  can see is wrong and nobody can name.
- **Theme changes remap semantic roles**, they never rewrite primitives. That is the reason for the
  two-block split.

## Step 5: measure contrast from computed styles

Eyeballing fails on exactly the pairs that matter: mid-tone on mid-tone, and anything on a
saturated ground. Run this in the console at each of the five verify viewports, or through
`page.evaluate` in Playwright.

```js
const ctxLum = (c) => { const [r, g, b] = c.map(v => { v /= 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const parse = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number)
const bgOf = (el) => { for (let n = el; n; n = n.parentElement) {
    const c = getComputedStyle(n).backgroundColor
    if (c && !/rgba?\(0,\s*0,\s*0,\s*0\)|transparent/.test(c)) return parse(c) }
  return [255, 255, 255] }

const fails = []
document.querySelectorAll("body *").forEach(el => {
  if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return
  const cs = getComputedStyle(el)
  const px = parseFloat(cs.fontSize), w = parseInt(cs.fontWeight) || 400
  const large = px >= 24 || (px >= 18.66 && w >= 700)
  const L1 = ctxLum(parse(cs.color)), L2 = ctxLum(bgOf(el))
  const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
  const floor = large ? 3 : 4.5
  if (ratio < floor) fails.push({ ratio: +ratio.toFixed(2), floor, px,
    text: el.textContent.trim().slice(0, 40) })
})
console.table(fails)

// placeholders do not appear above: they live in a pseudo-element
document.querySelectorAll("input, textarea").forEach(el =>
  console.log(el.name || el.type, getComputedStyle(el, "::placeholder").color))
```

Floors: body and placeholder **4.5:1**, large text **3:1**, controls, icons, and focus indicators
**3:1**. Placeholder text is the one that fails most often, because the default `text-muted-foreground`
on a tinted input rarely survives the second surface.

Also simulate protanopia and deuteranopia once. **For data, encode with lightness, shape, label, or
pattern as well, so color is never the only code.**

## Step 6: verify the palette survived the effect layer

Doctrine Law 1. A registry shader sets the palette at layer 2 and then **adds** prism, iridescence,
and a glow at roughly +1.84 per channel before clamp. Prop names say the palette is honored. The
pixels say it is white. **Verify from rendered pixels, never from props.**

```js
// playwright: capture only the effect region, after it settles
await page.waitForTimeout(1200)
await page.screenshot({ path: "hero.png", clip: await page.locator("canvas").boundingBox() })
```

```js
// node: does the render still live inside the palette?
const { data } = await sharp("hero.png").resize(48, 48, { fit: "fill" })
  .removeAlpha().raw().toBuffer({ resolveWithObject: true })
const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
const chroma = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b)
let maxL = 0, maxC = 0, sumL = 0, n = 0
for (let i = 0; i < data.length; i += 3) {
  maxL = Math.max(maxL, lum(data[i], data[i + 1], data[i + 2]))
  maxC = Math.max(maxC, chroma(data[i], data[i + 1], data[i + 2]))
  sumL += lum(data[i], data[i + 1], data[i + 2]); n++
}
console.log({ meanL: +(sumL / n).toFixed(1), maxL: +maxL.toFixed(1), maxC: +maxC.toFixed(1) })
```

Compute the same three numbers for the source hexes you passed the component. Then:

| Symptom | Diagnosis | Fix |
|---|---|---|
| render `maxL` more than 12 above the lightest source | an additive glow layer | find the `col += ...` and zero its coefficient, or promote it to a prop defaulting to 0 |
| render `maxC` more than 20 above the most saturated source | prism or iridescence layer | same, and check for a hardcoded `vec3` added after the palette mix |
| render mean luminance above every source on a dark palette | more than two `col +=` without renormalizing | renormalize, or pick a different component |

Full repair procedure in `gmira-arsenal`, step 3a and 3b. A blown-out effect is not a color
problem you can fix in the palette; it is a welded constant in the shader.

## The bans, and how to grep for them

```bash
rg -n "bg-clip-text|text-transparent" src app          # gradient text. emphasis is weight or size.
rg -n "border-l-[2-9]|border-l-\[" src app             # colored left borders above 1px on cards, alerts, callouts
rg -n "text-gray-|text-zinc-|text-neutral-" src app    # check every hit that sits on a colored surface
rg -n "backdrop-blur" src app                          # glass as decoration rather than a specific effect
```

- **No gradient text.** Emphasis comes from weight or size.
- **Declare elevation once**: border or shadow, not both. A 1px border under a wide soft shadow is
  the ghost card.
- **Shadows carry an offset and a soft blur.** A zero-offset colored halo is decoration.
- **Never gray on a colored surface.** Tint from the hue or from the foreground.
- **A single accent applied everywhere stops meaning anything.** Give it a region and a job.

## Checks before this skill is done

- [ ] A strategy was named before any color was picked, and the mode allows it
- [ ] Committed coverage measured from a full-page screenshot, between 30 and 60%
- [ ] Dark versus light traced to the written scene sentence, not to the category
- [ ] Every primitive token carries a comment naming the material it came from
- [ ] The semantic block contains assignments only, zero new color values
- [ ] Contrast run from computed styles at all five viewports, zero rows in the fail table
- [ ] `::placeholder` colors checked separately and passing 4.5:1
- [ ] Secondary text on every colored surface is tinted from that hue, and the ratio was measured
- [ ] Zero `bg-clip-text` hits, zero colored left borders above 1px
- [ ] Canvas surfaces sampled from rendered pixels and compared against the source hexes
- [ ] Dark theme designed explicitly, or the world declared to have only one state
