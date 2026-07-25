---
name: gmira-hero
description: Use when building, rewriting, or auditing the first viewport of any page: landing hero, campaign header, category header, vehicle detail top, course page opener, portfolio opener. Also use when a hero came out as a centered headline with two buttons, when the shader background looks like a filter someone left on, when the hero is blank until the visitor moves the mouse, when the headline uses gradient text or a tracked uppercase eyebrow, or when someone is about to install a three.js hero. Owns the page effect budget, the frame-0 decision, and the bounded-versus-full-bleed call.
---

# Hero

The first viewport spends the whole page's effect budget. Decide what it buys.

Load `../gmira/references/DOCTRINE.md` first. This skill implements Law 3 and Part 4.
For the shader itself load `gmira-canvas`. For install and repair load `gmira-arsenal`.

## The premise

**One heavy effect per route.** The hero is where it goes, or it goes nowhere. Every section below
the fold is then DOM, CSS, and type. That is not a compromise, it is the reason the hero reads as
the loudest thing on the page instead of one of nine competing loud things.

Two consequences that people skip:

1. If the hero spends the budget, the footer cannot have a second fluid sim. `closing-plasma` is
   the one exception in the arsenal because it is the same raw-WebGL1 family and adds no library.
2. If the brief cannot afford the effect (Operate, Read, paid traffic on mobile), the hero has to
   win on type, crop, and structure. That is a harder hero, not a lesser one.

## Step 1: write the first viewport in nouns

The direction contract's `FIRST VIEWPORT` block is a noun list, not a mood. Write it before placing
anything.

```
INCORRECT   FIRST VIEWPORT  a bold, premium hero that immediately communicates trust
CORRECT     FIRST VIEWPORT  the model name as a catalogue title, a 9-character stock number
                            in mono, one three-quarter photograph bleeding off the right edge,
                            a hairline rule under the title at 40% width, a bounded chrome
                            panel five columns wide behind the emblem, one link: See this car
```

If you cannot list the nouns, the hero is not decided and no component will fix it.

## Step 2: refuse these four shapes

Not bans. The brief's own words can earn any of them, and then you log it. Reaching for one when
the axis is free means you were not deciding.

| Refused shape | Why it is a tell | What to do instead |
|---|---|---|
| Centered headline, subhead, two buttons | It is the median rendered to HTML. `@componentry/gradient-hero-01` ships exactly this as a block. | Put the composition off-axis. One action, not two. A left column that is not the mirror of the right. |
| The hero-metric template: big number, small label, supporting stats, accent | Chrome standing in for content. The numbers are almost always invented. | Real content model or nothing. Doctrine G7. |
| Gradient text | `text-transparent bg-clip-text bg-gradient-to-b` is the 2021 move that never left. `dither-prism-hero` ships it as its default headline class. | Emphasis comes from weight or size. |
| A tracked uppercase eyebrow over the headline | One named kicker is a system. An eyebrow on every section is a habit. | Delete it, or make it carry information (a date, a cohort, a part number). |

Two more that are structural rather than visual: the centered column with nothing to its left or
right at every breakpoint, and the full-bleed effect turned down far enough to read as a filter.

## Step 3: answer frame 0, out loud

**An effect must earn its place at frame 0, with no input.** Most visitors land, read, and leave
without moving the pointer across the hero. A gallery GIF never shows this because the person
recording it is already dragging.

Three permitted resolutions. Pick one explicitly and write which one in the component comment.

| Resolution | What it means | Arsenal examples |
|---|---|---|
| **Seed it** | Inject motion on mount along a designed path, so the first second replays what a pointer would have done | `ripple-transition` with `autoPlay` and `autoPlayOrigin: "center"`, `kinetic-text-reveal` with `autoPlay` |
| **Autonomous idle** | The effect animates from its own clock; pointer input perturbs an already-moving surface | `silk-aurora`, `webgl-liquid`, `liquid-chrome`, `closing-plasma`, `dither-gradient`, `animated-gradient` |
| **Reward for interaction** | The composition is complete without the effect; the effect is a bonus for people who play | `text-repel`, `spotlight-card`, `magnet-lines`, `pixel-canvas` |

The cheapest resolution is to pick an effect with no pointer input at all. `dither-gradient` has
none, so frame 0 is never a question.

```
INCORRECT   <SilkAurora mouseInfluence={1} interactive />
            // the pointer term is the only thing carrying the composition
CORRECT     <SilkAurora speed={0.6} intensity={1} mouseInfluence={0.35} interactive>
            // gmira: Law 3 resolution = autonomous idle. Ribbons animate from u_time.
            // mouseInfluence is a perturbation of a composition that already reads at t=0.
```

## Step 4: bounded, at full strength

**Restrained settings make effects invisible; loud settings make them slop. The answer is
compositional, not parametric.**

A full-bleed backdrop must stay quiet enough not to fight the headline, which is exactly how it
ends up reading as a filter someone left on. A bounded region running at full strength reads as
intent.

```
INCORRECT   <section className="relative min-h-svh">
              <LiquidChrome className="absolute inset-0" amplitude={0.15} speed={0.4} />
              <h1 className="relative z-10 ...">   {/* text over the whole thing, effect turned down */}
CORRECT     <section className="relative grid min-h-svh grid-cols-12 items-end gap-6">
              <div className="col-span-5 col-start-7 row-start-1 relative aspect-[4/5] overflow-hidden">
                <LiquidChrome baseColor={[0.06, 0.07, 0.08]} amplitude={0.6} speed={1} />
              </div>
              <h1 className="col-span-5 row-start-1 self-end ...">   {/* text on clean ground */}
```

Bounded also raises the GPU ceiling: DPR caps at 2.0 inside a bounded surface versus 1.5 full
bleed, and sim or display textures may double. A 5-column panel at full strength costs less than a
full-bleed field at half strength and looks like a decision.

Where a full-bleed field is genuinely right (Experience mode, a gallery, a single-object page), mask
it rather than fade it: `mask-image: linear-gradient(to bottom, black 55%, transparent)` keeps the
top loud and clears the type band completely.

## Step 5: pick the component

Real names, real dependency cost. `clsx` and `tailwind-merge` are already in any shadcn project
via `cn`, so components declaring only those are effectively zero-install.

| Brief reads as | Component | Real npm cost | Key props | Frame 0 |
|---|---|---|---|---|
| metal, weight, manufacture | `@componentry/liquid-chrome` | **none**, raw WebGL1, 7.5 KB source | `baseColor` (RGB **tuple** `[0.1,0.1,0.1]`, not a hex string), `speed` 1.0, `amplitude` 0.6, `interactive` | autonomous, two-level domain-warped FBM |
| premium dark without cliche | `@componentry/silk-aurora` | **none**, raw WebGL1 | `baseColor`, `midColor`, `sheenColor`, `accentColor`, `speed` 1, `intensity` 1, `grain` 0.85, `vignette` 1, `mouseInfluence` 1 | autonomous, three ribbons on separate phases |
| cinematic, campaign, copy must land after the shader | `@componentry/webgl-liquid` | `clsx`, `tailwind-merge` | `colorDeep`, `colorMid`, `colorHighlight`, `flowStrength` 1, `contrast` 1.1, `grain` 0.05, `reveal` true, `delayMs`, `revealDuration` 1.2 | seeded, the reveal timeline runs on mount |
| print, limited palette, needed on every page | `@componentry/dither-gradient` | **none**, canvas2d, **3.5 KB** | `colorFrom`, `colorMid`, `colorTo`, `intensity` 0.15, `speed` 3, `angle` 45 | autonomous, no pointer input exists |
| footer or CTA band matching a raw-WebGL hero | `@componentry/closing-plasma` | `clsx`, `tailwind-merge` | `themeMode`, `turbulence`, `sparkle`, `vignette`, `darkColorA/B/C`, `lightColorA/B/C` | autonomous simplex plasma |
| background flips with the site theme for free | `@componentry/prism-gradient` | `next-themes`, `clsx`, `tailwind-merge` | `speed`, `noise: { opacity, scale }`, `radius`. Palette is theme-driven, not prop-driven | autonomous |
| explicit palette, WebGL2, five presets | `@componentry/animated-gradient` | **none** | `config` (`"Aurora" \| "Oceanic" \| "Amber" \| "Toxic" \| "Ghost"`), `noise`, `radius` | autonomous |

Seven items ship `webgl-error-boundary.tsx` alongside (`animated-gradient`, `dither-prism-hero`,
`image-ripple-effect`, `particle-galaxy`, `ripple-transition`, `silk-aurora`, `webgl-liquid`). It is
identical content each time, so installing several is idempotent, and you do not wrap them again.
**Its `WebGLFallback` is a dark zinc gradient with `role="status"`, which is not your palette.
Restyle it or the unsupported path ships someone else's brand.**

### The three that usually lose

| Component | Real cost | Why it loses |
|---|---|---|
| `dither-prism-hero` | `three` + `@react-three/fiber` + `@react-three/drei` + `framer-motion`, roughly **600 KB**, plus a 25.6 KB source file | Welded constants: `uMouse.value.set(0.5, 0.5)` and `uMouseIntensity.value = 0.8` are re-set every frame with no prop reaching them, and the glow they drive adds about +1.84 per channel before clamp. It cannot honor a dark palette. Its default headline class is gradient text. |
| `particle-galaxy` | `three` alone, roughly **600 KB** | The second most exhausted "we do AI" cliche after `matrix-rain`. Needs `blendMode: "normal"` on light backgrounds or it washes out. Good component, used badly by everyone. |
| `hero-geometric` | `three` + R3F + drei + `framer-motion` + `lucide-react`, roughly **600 KB** | It is a 4x4 Bayer-dithered simplex plane. `dither-gradient` gets you most of that look for 3.5 KB and zero deps. |

Trade to make explicitly: 600 KB of JavaScript against 3.5 KB. On a paid-traffic landing page, page
weight is revenue. Install three.js only when a named component earns it and the user knows the bill.

## Step 6: own the type, never the component's props

`silk-aurora`, `webgl-liquid`, and `dither-prism-hero` all ship `title` / `subtitle` / `description`
props. Those props carry the registry's house typography, including patterns the craft floor bans.

```
INCORRECT   <WebGLLiquid title="Built for speed" subtitle="Every trim, in stock" />
CORRECT     <WebGLLiquid colorDeep="#07100c" colorMid="#123024" colorHighlight="#d8b24a"
                         revealDuration={1.2} delayMs={0}>
              <h1 className="max-w-[16ch] text-[clamp(2.75rem,6vw,5.5rem)] font-medium
                             leading-[0.95] tracking-[-0.03em] text-balance">
                Built for speed
              </h1>
            </WebGLLiquid>
```

Type floor for a hero: display max **6rem**, tracking **-0.02em to -0.03em** (floor -0.04em), real
copy at every breakpoint, zero overflow, balanced headings. Mono only on metadata: part numbers,
stock numbers, measurements, cohort codes. Never mono as a costume for "technical".

## Step 7: delete the canvas

**Everything the page says must remain readable and operable with the canvas removed.** Test by
deleting the element in devtools, not by trusting a fallback branch.

This has one concrete design consequence people miss: with the canvas gone, the background is
whatever the parent's `background-color` is. So set that color explicitly, and measure the headline
contrast against **it**, not against the rendered shader.

```
INCORRECT   <section className="relative">      {/* transparent, inherits body */}
              <SilkAurora className="absolute inset-0" baseColor="#050807" />
              <h1 className="text-white">       {/* 21:1 against the shader, 1.1:1 against white body */}
CORRECT     <section className="relative bg-[#050807]">
              <SilkAurora className="absolute inset-0" aria-hidden baseColor="#050807" />
              <h1 className="relative text-[#f4f1ea]">   {/* measured against #050807 */}
```

The canvas is `aria-hidden` and `pointer-events: none`. The content was never inside it.

## Worked heroes

Four full recipes: world, component, palette, type, frame 0. Each traces to a direction contract.

### A. Car shop, single model page

- **World:** a 1970s Porsche parts catalogue. Monospace part numbers, hairline rules, photographs
  on a neutral card, no rounded corners anywhere.
- **Component:** `liquid-chrome`, bounded to a 5-column panel at `aspect-[4/5]`,
  `baseColor={[0.06, 0.07, 0.08]}`, `amplitude={0.6}`, `speed={1}`, `interactive`. Chrome reads as
  metal, weight, manufacture, which is the one shader family that is literally on brief here.
  Spec figures go to `split-flap-display` (zero deps, CSS 3D keyframes), not to a stat row.
- **Palette:** catalogue paper `#e8e4dc`, ink `#14161a`, one oxide `#b5451f` used on part numbers
  and the single link, chrome panel near-black. Accent covers the rules and the numbers, roughly
  35% of the surface, not one button.
- **Type:** one sans for everything, weight carries hierarchy. Title 4.5rem / -0.03em. Mono
  (`tnum`, slashed zero) on the stock number and every spec figure only.
- **Frame 0:** autonomous idle. The FBM has its own clock, so the panel is already flowing before
  any pointer event. `interactive` perturbs it.
- **Canvas deleted:** the panel becomes a flat `#0f1113` rectangle behind the emblem. The title,
  the stock number, the photograph, and the link all still read.
- **Repair note:** `liquid-chrome` imports `cn` from `../lib/utils`. Rewrite to `@/lib/utils`.

### B. Applied AI school, admissions page

- **World:** a lab notebook and an instrument panel. Ruled grid, labelled measurements, a real
  diagram rather than a metaphor.
- **Component:** `silk-aurora` full-bleed but **masked** to the top 55% so the type band is clean,
  `speed={0.6}`, `intensity={1}`, `grain={0.85}`, `mouseInfluence={0.35}`. Below it in the same
  viewport, `circuit-board` (SVG plus `framer-motion`, cheap) drawing the actual pipeline the
  course teaches: `nodes` with real `status` values, `connections` with `animated`. That is the
  diagram carrying the argument, not decoration.
- **Palette:** near-black `#050807`, deep green mid `#123024`, gold sheen `#d8b24a`. Verify by
  screenshot sampling: additive shader stacks trend to white, so compare rendered pixels against
  these hexes before trusting the props.
- **Type:** one family. Module codes in mono, everything else sans. No eyebrow.
- **Frame 0:** autonomous idle. Three ribbons on different phases plus the glint term move without
  input. Pointer adds a falloff highlight.
- **Refused explicitly:** `matrix-rain` and `particle-galaxy`. Using the two most exhausted "we do
  AI" cliches undercuts the exact credibility the page is buying.
- **Canvas deleted:** headline, the circuit diagram (SVG, unaffected), cohort dates, and the apply
  link all survive.

### C. GTM / UGC school, offer page

- **World:** a broadcast switcher rack and tape labels. Hot, fast, legible at a glance on a phone.
- **Component:** `webgl-liquid` full-bleed, `reveal={true}`, `revealDuration={1.2}`, `delayMs={0}`,
  `flowStrength={1.4}`, `contrast={1.15}`, `grain={0.05}`. Headline authored in `children`, timed
  to land after the shader settles. Total npm cost: `clsx` and `tailwind-merge`, both already
  present.
- **Palette:** `colorDeep="#120306"`, `colorMid="#5c0a1e"`, `colorHighlight="#ff4d1f"`. Loud is
  correct for this audience; the restraint is that the effect appears once, in the hero, and never
  again on the page.
- **Type:** display at the 6rem cap, `-0.03em`, `text-balance`, one line of body at 65ch. One
  action.
- **Frame 0:** seeded. The reveal timeline runs on mount, so the first second is authored rather
  than empty.
- **Refused explicitly:** `dither-prism-hero` and `particle-galaxy`. Page weight is revenue on paid
  traffic, and 600 KB of three.js buys nothing this audience will notice.
- **Canvas deleted:** `#120306` ground, headline at `#fff3ec`, CTA still clickable.

### D. E-commerce category header

- **World:** a printed swatch card. Dye lot numbers, registration marks, a limited palette that is
  the season's actual three colors.
- **Component:** `dither-gradient`, bounded to a 42vh header band, `colorFrom` / `colorMid` /
  `colorTo` taken from the season palette, `intensity={0.15}`, `speed={3}`, `angle={45}`. 3.5 KB,
  canvas2d, zero deps, cheap enough to ship on every category page without touching Core Web Vitals.
- **Palette:** the three dye colors, nothing else. Product photography carries the rest.
- **Type:** nothing above 3rem. The product names are the type. Category name at 2.25rem, count in
  mono.
- **Frame 0:** autonomous, and the component has no pointer input at all, so the question does not
  arise. This is the cheapest correct answer.
- **Refused explicitly:** `infinite-image-field` and `cursor-driven-particle-typography`. Canvas
  text and canvas images are invisible to search engines, screen readers, and `Ctrl+F`, which is
  fatal on a commerce surface.
- **Canvas deleted:** the band becomes a flat season color. The grid below is untouched.

## Checks before this skill is done

- [ ] `FIRST VIEWPORT` exists in nouns, in writing, and the built hero traces to it noun by noun
- [ ] Zero of the four refused shapes present, or one is present and logged with the brief words that earned it
- [ ] The Law 3 resolution is named in a comment in the component file
- [ ] Bounded at full strength, or full-bleed with a real mask and a documented reason
- [ ] The component's own `title` / `subtitle` / `description` props are unused; type is in `children`
- [ ] Headline contrast measured against the container `background-color`, not against the shader
- [ ] Canvas element deleted in devtools: headline, copy, and the action all still read and work
- [ ] `WebGLFallback`'s zinc gradient restyled to the brief's palette
- [ ] One heavy effect on the route, and it is this one
- [ ] Rendered pixels sampled from a screenshot match the intended palette (additive stacks trend to white)
- [ ] No three.js in `package.json` unless a named component earned it and the user was told the size
