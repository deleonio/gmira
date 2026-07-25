---
name: gmira-typeset
description: Use when setting or repairing the typography of a web surface: choosing a type pairing, building the size and tracking scale, wiring `next/font` and Tailwind v4 font tokens, or fixing a page whose type reads as a framework default. Also use when a heading overflows at 390px, when a line runs past 75 characters, when every heading carries the same tracking value, when mono is being worn as a costume for "technical", when display type was picked from a subject association (books want a serif, tech wants a mono), or when a set of items became a card grid and the page needs a structural device that is not a card. Covers measure, the 1.25 scale, the minus 0.04em tracking floor, the 11px functional floor, the reflex-face denylist, six named pairings each derived from a material world, and the `--color-line` screen-line rule system. Owns doctrine section 3.1.
---

# Typeset

Type is the part of the world that ships before the photography exists. It carries the direction or
it exposes that there was not one.

Load `../gmira/references/DOCTRINE.md` first. Section 3.1 is the floor this skill enforces.

## The premise

Two failures, and they look nothing alike. The first is the default: system sans, one tracking
value, a 1.125 ratio, and a page where primary, secondary, body, and metadata are indistinguishable
without reading the words. The second is the reflex: a face picked because the subject suggested it.
Books want a serif, a bookshop wants hand lettering, a technical product wants a mono. **Those
associations are the reason the reflex list exists, not a reason to satisfy it.**

The bar to clear: **primary, secondary, body, and metadata roles are recognizable without reading
the copy.**

## Step 1: the numbers

Each is a check on the built result. Read computed values.

| Rule | Value |
|---|---|
| Body measure | **65 to 75ch**. Past roughly 80ch the eye loses the line return. |
| Display ceiling | **6rem**. One element per page reaches it. |
| Tracking floor | **-0.04em**. Tighter than -0.05em is a failure. -0.02 to -0.03em usually reads better than the floor. |
| Wide tracking | above **0.05em** only on short uppercase labels. Never on body. |
| Functional text floor | **11px** for anything interactive or content-bearing. 10px only for non-interactive legal smallprint. |
| Body size floor | **1rem** unless a dense role or a platform convention earns less. |
| Leading, body | **1.5 to 1.7**. Below 1.3 is a failure. |
| Leading, display | 1.02 to 1.15 |
| Scale ratio | **1.25** on brand surfaces. **1.125 to 1.2** on Operate. |
| Families | one, plus a second only when it has a role the first cannot perform |
| Sizes and weights | 3 to 4 sizes and 2 to 3 weights carry most surfaces |

Three rules without numbers that decide more than the numbers do:

- **Tune line height inversely with measure.** A 72ch column needs more leading than a 48ch one.
  There is no universal ratio; tune to the face, the width, the language, and the contrast.
- **Compensate light text on dark surfaces on all three perceptual axes**: slightly more line
  height, a touch more tracking, and one more weight step when the face thins out.
- **Paragraph spacing or first-line indent, not both.** Combining them double-marks the boundary.

## Step 2: pick the pairing from the material world

### The reflex-face denylist

Naming one of these requires a reason no other face could satisfy, **and a subject association is
never that reason**:

Fraunces, Playfair Display, Cormorant, Lora, Crimson, Newsreader, Syne, Space Grotesk, Space Mono,
IBM Plex, Inter as a display face, DM Sans, DM Serif, Outfit, Plus Jakarta Sans, Instrument Sans.
Plus the three the detector flags on sight: Inter, Roboto, Geist.

Operate and Read surfaces are well served by system stacks and workhorse UI faces, so the denylist
bites hardest on Persuade and Experience, where the face is carrying the voice.

### Six pairings, each derived from a world

Every family below is on Google Fonts, which means it is also on npm as
`@fontsource-variable/<name>` and importable from `next/font/google`.

| World | Display | Text | Metadata | Why this and not a trend |
|---|---|---|---|---|
| **1970s parts catalogue on uncoated stock** (car shop, hardware, industrial inventory) | **Archivo** at `wdth 112` | **Archivo** at `wdth 100` | **Martian Mono**, `tnum` on | One superfamily with a real width axis (62 to 125). Hierarchy comes from width and weight, not from a second voice. Expanded at 5rem reads as a plate-printed cover. The mono is the parts list, which is an actual job. |
| **A reading machine: library reference and long-form scanning** (docs, curriculum, changelog) | **Literata**, `opsz` set to the rendered size | **Literata** | **Fragment Mono** | Literata's optical size axis (7 to 72) is the mechanism, and it is wasted if left at default. Fragment Mono ships one weight, so it cannot be bolded into a headline. That removes the temptation structurally. |
| **Swiss clinical packaging and dosage inserts** (dashboards, admin, checkout, filters) | none | **Hanken Grotesk** | **Spline Sans Mono**, `tnum` on | The insert has no display type at all. Hierarchy is rule weight, indent, and caps-height labels. Operate surfaces do not need a display and body pairing; one family plus a numeric face is the entire system. Hanken's x-height holds at 13px. |
| **Transit enamel signage and stencil plates** (campaign, cohort launch, GTM) | **Big Shoulders Display** | **Public Sans** | **Chivo Mono** | Condensed display at 5.5rem carries platform-sign scale without reaching the 6rem ceiling in width. Public Sans is the timetable body and is genuinely under-shipped. The mono is line and track numbers. |
| **A 1980s chart recorder and thermal print-out** (technical product, AI school, data surfaces) | **Doto**, one element only | **Familjen Grotesk** | **Martian Mono** | The dot-matrix face is the world's own mark-making, not a costume for "technical". Confine it to the run header at 4 to 6rem. Doto's `ROND` axis is the tuning control. At body size it is unreadable, so it never goes there. |
| **Auction catalogue, hot-metal Bodoni on coated stock** (portfolio, gallery, high-value inventory) | **Bodoni Moda** at `opsz 96` | **Onest** | **Fragment Mono** | The `opsz` axis (6 to 96) is the whole point: Bodoni Moda at default optical size scaled to 6rem renders blunt, because the hairlines never thin. Onest recedes so the Bodoni is the only voice. The mono carries lot numbers, dimensions, and provenance dates. |

The method behind the table, so it generalizes: **read `OWN-WORLD` from the direction contract,
ask what that world set its own type in, then find the closest available face with the axis that
reproduces the mechanism.** A signage world wants a width axis. A print world wants an optical size
axis. A machine world wants a face with a grid. If the answer is "any clean sans", the world was
not specific enough and the problem is upstream in `gmira-direction`.

```
INCORRECT   subject is a bookshop, so Fraunces for display and Lora for body.
CORRECT     OWN-WORLD is "a 1930s lending-library card catalogue: typed cards, rubber
            date stamps, hand-numbered spine labels". That names a typewriter grid and a
            stamped display, so: Doto for the stamped run head, Familjen Grotesk for the
            card body, Martian Mono for the accession numbers.
```

## Step 3: what mono is allowed to mean

**Mono carries metadata only.** File names, part numbers, VIN, SKU, measurements, timestamps,
coordinates, code, keyboard shortcuts, tabular figures, diff and log output, version strings.

Not allowed: headlines, eyebrows, nav labels, button text, body copy, a badge reading `v1.0` that
exists only as decoration, and the word "AI" set in mono so the page looks technical.

**The test: if the string is not a value someone could copy into a field or a terminal, it is not
mono.**

```bash
rg -n "font-mono" src app          # check every hit against the list above
```

Turn the features on, or the mono is doing half its job:

```css
@theme {
  --default-mono-font-feature-settings: "tnum" 1, "zero" 1;   /* tabular figures, slashed zero */
}
```

Any column of figures gets `font-variant-numeric: tabular-nums` whether or not it is mono. Prices
in a listing grid that shift horizontally between rows are a mono problem solved without mono.

## Step 4: wire it

```ts
// src/lib/fonts.ts
import { Archivo, Martian_Mono } from "next/font/google"
import { cn } from "@/lib/utils"

export const fontSans = Archivo({
  subsets: ["latin"], display: "swap", variable: "--font-archivo",
  axes: ["wdth"],                                  // 62 to 125. the width axis is the display cut.
})
export const fontMono = Martian_Mono({
  subsets: ["latin"], display: "swap", variable: "--font-martian-mono", weight: ["400", "600"],
})

// re-alias so components never name a vendor face
export const fontVariables = cn(fontSans.variable, fontMono.variable,
  "[--font-sans:var(--font-archivo)]", "[--font-mono:var(--font-martian-mono)]")
```

`--font-heading` is set to `var(--font-sans)` on purpose. **One family, with weight, width, and
tracking carrying the hierarchy**, is a real decision and it is right more often than a pairing.
Add a second family only when it has a job the first cannot do.

Tailwind v4, with tracking and leading bound to each size step so they cannot drift apart:

```css
@theme {
  --font-sans: var(--font-archivo), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-martian-mono), ui-monospace, monospace;
  --font-heading: var(--font-sans);

  --text-2xs: 0.6875rem;                    /* 11px, the functional floor */
  --text-2xs--line-height: 1.45;
  --text-label: 0.6875rem;                  /* same size, a different role */
  --text-label--line-height: 1.2;
  --text-label--letter-spacing: 0.06em;     /* wide tracking is bound to the role, not the size */
  --text-xs: 0.8125rem;   --text-xs--line-height: 1.5;
  --text-sm: 0.875rem;    --text-sm--line-height: 1.55;
  --text-base: 1rem;      --text-base--line-height: 1.6;

  /* 1.25 from here up: 1.25, 1.563, 1.953, 2.441, 3.052, 3.815, 4.768, 5.960 */
  --text-lg: 1.25rem;     --text-lg--line-height: 1.5;
  --text-xl: 1.563rem;    --text-xl--line-height: 1.35;  --text-xl--letter-spacing: -0.01em;
  --text-2xl: 1.953rem;   --text-2xl--line-height: 1.25; --text-2xl--letter-spacing: -0.015em;
  --text-3xl: 2.441rem;   --text-3xl--line-height: 1.18; --text-3xl--letter-spacing: -0.02em;
  --text-4xl: 3.052rem;   --text-4xl--line-height: 1.12; --text-4xl--letter-spacing: -0.025em;
  --text-5xl: 3.815rem;   --text-5xl--line-height: 1.08; --text-5xl--letter-spacing: -0.03em;
  --text-6xl: 4.768rem;   --text-6xl--line-height: 1.04; --text-6xl--letter-spacing: -0.03em;
  --text-7xl: 5.960rem;   --text-7xl--line-height: 1.02; --text-7xl--letter-spacing: -0.03em;
}
```

`--text-7xl` at 5.96rem sits just under the 6rem ceiling, and exactly one element on the page
reaches it.

Operate override, fixed rem and a 1.2 ratio, because a clamp-sized `h1` that shrinks inside a
sidebar looks worse, not better:

```css
.mode-operate {
  --text-lg: 1.2rem;  --text-xl: 1.44rem;  --text-2xl: 1.728rem;
  --text-3xl: 2.074rem; --text-4xl: 2.488rem;   /* the scale stops here */
}
```

The display width cut, applied where the world calls for it:

```css
.display { font-variation-settings: "wdth" 112; }   /* Archivo expanded, one axis, one decision */
```

**Negative tracking belongs to large sizes.** Applying -0.02em to 13px UI text closes the counters
and costs legibility at exactly the size where legibility is the whole job.

```
INCORRECT   body { letter-spacing: -0.02em }         one value, applied everywhere
CORRECT     tracking is a property of the size step, declared once in @theme,
            so a 13px label and a 76px headline cannot share a value.
```

## Step 5: real copy at every breakpoint

Not representative copy. **The longest real string in the dataset.** For German commercial stock
that means `Kraftstoffverbrauch kombiniert` at 31 characters in a label column, the longest model
and trim string, and the longest single equipment line out of 80.

Run at 390, 834, 1024, 1440, 1920. Zero rows is the pass condition.

```js
const probe = document.createElement("canvas").getContext("2d")
const chOf = (cs) => { probe.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
  return probe.measureText("0").width }

const bad = []
document.querySelectorAll("p, li, h1, h2, h3, h4, dd, td, blockquote, figcaption").forEach(el => {
  const cs = getComputedStyle(el), px = parseFloat(cs.fontSize)
  const measure = el.getBoundingClientRect().width / chOf(cs)
  const overflowX = el.scrollWidth - el.clientWidth
  const clipped = cs.overflow !== "visible" && el.scrollHeight - el.clientHeight > 1
  const track = (parseFloat(cs.letterSpacing) || 0) / px
  const lh = parseFloat(cs.lineHeight) / px
  const bodyish = el.matches("p, li, dd, blockquote")
  if (measure > 75 || overflowX > 1 || clipped || track < -0.04 || (bodyish && lh < 1.3) ||
      (px < 11 && el.closest("a, button, [role=button], label")))
    bad.push({ tag: el.tagName, measure: Math.round(measure), px, overflowX, clipped,
      track: +track.toFixed(3), lh: +lh.toFixed(2), text: el.textContent.trim().slice(0, 36) })
})
console.table(bad)
if (document.documentElement.scrollWidth > document.documentElement.clientWidth)
  console.warn("the page scrolls horizontally")
```

Stress list beyond the script: localization expansion (German runs 20 to 35% longer than English),
browser zoom at 200%, a narrow container, a missing weight in the fallback chain, and the moment
before the webfont loads. `display: "swap"` makes that moment visible, so check that the fallback
metrics are close enough that the reflow is not a jump.

## Step 6: balanced headings

```css
h1, h2, h3 { text-wrap: balance }   /* browsers cap balancing at roughly 4 to 6 lines */
p, li      { text-wrap: pretty }    /* kills the orphan without rebalancing the block */
```

Tailwind: `text-balance` on headings, `text-pretty` on body. **Never `balance` on a body
paragraph.** It changes the effective measure per paragraph, so the column edge goes ragged in a
way that reads as broken rather than as typeset.

## Step 7: rules instead of cards

The screen-line system. This is the concrete structural device that answers four of the visual
tells at once: uniform section rhythm, the three-column reflex, icon plus heading plus two lines,
and perfectly even card heights achieved by truncating real content.

One token and five utilities. The line color is deliberately softer than the border, and the dark
theme inherits the same formula against the dark background rather than declaring a second value:

```css
@theme {
  --color-line: color-mix(in oklab, var(--border) 64%, var(--background));
}

@utility screen-line-top {
  @apply relative;
  &:before { content: ""; @apply absolute top-0 left-[-100vw] -z-1 h-px w-[200vw] bg-line; }
}
@utility screen-line-bottom {
  @apply relative;
  &:after { content: ""; @apply absolute bottom-0 left-[-100vw] -z-1 h-px w-[200vw] bg-line; }
}
@utility screen-dashed-line-top {
  @apply screen-line-top;
  &:before { @apply bg-inherit bg-[linear-gradient(to_right,var(--color-line)_4px,transparent_2px)]
             bg-size-[6px_1px] bg-repeat-x; }
}
@utility diagonal-stripes {
  @apply [--pattern-foreground:var(--color-line)]/56;
  @apply bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]
         bg-size-[10px_10px];
}
@utility stripe-divider {
  @apply relative h-8;
  &:before { content: ""; @apply absolute left-[-100vw] -z-1 h-full w-[200vw] diagonal-stripes; }
}
```

**A `200vw` pseudo-element offset `-100vw` at `-z-1` runs every rule edge to edge regardless of
container width, behind the content.** That is the whole trick, and it is why the page reads as a
ruled sheet rather than as a stack of boxes.

The primitive that applies it:

```tsx
function Panel({ className, ...props }) {
  return <section data-slot="panel"
    className={cn("screen-line-top screen-line-bottom border-x border-line", className)} {...props} />
}
function PanelHeader({ className, ...props }) {
  return <header data-slot="panel-header"
    className={cn("screen-line-bottom",
      "has-data-[slot=panel-description]:*:data-[slot=panel-title]:screen-line-bottom",
      className)} {...props} />
}
function PanelTitle({ asChild = false, className, ...props }) {
  const Comp = asChild ? Slot.Root : "h2"
  return <Comp data-slot="panel-title"
    className={cn("font-heading text-3xl font-medium tracking-tight text-balance", className)} {...props} />
}
```

That `has-data-[slot=panel-description]:*:data-[slot=panel-title]:screen-line-bottom` is the design
rule "the title gets its own rule only when there is a description below it", written as a selector
instead of as a prop. **Conditional structure belongs in the selector, where it cannot be forgotten
at a call site.**

For a set of items, rules replace the card grid. The row rule draws only on the first item of each
row, per breakpoint, with the column rules on a separate layer behind:

```tsx
<li className={cn(
  "max-sm:screen-line-top max-sm:screen-line-bottom",
  "sm:max-md:nth-[2n+1]:screen-line-top sm:max-md:nth-[2n+1]:screen-line-bottom",
  "md:nth-[3n+1]:screen-line-top md:nth-[3n+1]:screen-line-bottom")} />
```

```tsx
<div className="pointer-events-none absolute inset-0 -z-1 hidden gap-2 sm:grid sm:grid-cols-2 md:grid-cols-3">
  <div className="border-r border-line" />
  <div className="border-l border-line md:border-x" />
  <div className="border-l border-line max-md:hidden" />
</div>
```

Page composition then becomes a flat list of panels with explicit separators, no nesting and no
outer grid, with the anchor scroll offset derived from the separator variable so it stays correct
when the rhythm changes:

```tsx
<div className="[--separator-height:--spacing(8)]
                **:data-[slot=panel]:scroll-mt-[calc(var(--header-height)+var(--separator-height))]">
```

```
INCORRECT   a set of 9 things becomes 9 rounded cards with a shadow, a 1px border,
            an icon, a heading, and two lines truncated so the heights match.
CORRECT     a ruled list. Items keep their real length. The rule bleeds to the viewport
            edge. Emphasis comes from which items get a stripe divider above them, and
            the item that matters gets more vertical room, not a different container.
```

Prose gets the same discipline: zero-specificity `&:where(...)` selectors, single-direction
`margin-block-start` only, one flow variable, and a `.not-typeset` escape hatch. Instances retune by
variable rather than by overriding rules:

```css
.typeset { --typeset-size: 1em; --typeset-leading: 1.75; --typeset-flow: 1.25em; }
.typeset-description { --typeset-size: 15px; --typeset-leading: 1.6; --typeset-flow: 1em; }
.typeset *:not(:where(.not-typeset, [data-not-typeset], .not-typeset *, [data-not-typeset] *)) {
  &:where(p) { margin-block-start: var(--typeset-flow); margin-block-end: 0 }
  &:where(h2) { font-size: 1.25em; line-height: 1.4; margin-block-start: calc(var(--typeset-flow) * 1.4) }
  &:where(h1 + *, h2 + *, h3 + *) { margin-block-start: 1em }   /* headings own the space below them */
}
```

More space above a heading than below it. Every time.

## Checks before this skill is done

- [ ] The pairing traces to the `OWN-WORLD` block, and the face was chosen for an axis that reproduces the world's mechanism
- [ ] No face from the reflex denylist, unless a logged reason no other face could satisfy
- [ ] Measure between 65 and 75ch at all five viewports, verified by the script
- [ ] Zero horizontal overflow and zero clipping, with the longest real strings in place
- [ ] Tracking is bound to the size step in `@theme`, no single value applied across sizes
- [ ] Nothing interactive or content-bearing renders below 11px
- [ ] Body leading between 1.5 and 1.7, never below 1.3
- [ ] Display ceiling 6rem, reached by exactly one element
- [ ] Every `font-mono` hit is a value someone could copy into a field or a terminal
- [ ] `tnum` and `zero` on, and every column of figures is tabular
- [ ] `text-balance` on headings, `text-pretty` on body, `balance` nowhere near a paragraph
- [ ] Primary, secondary, body, and metadata roles readable as roles with the copy blurred
- [ ] Checked at 200% zoom and with the webfont blocked
