# Changelog

All notable changes to GMIRA. Format follows Keep a Changelog. Versions follow SemVer.

## [0.1.0] 2026-07-25

First public release. 21 skills, 5 playbooks, 40 material worlds, 4 verified proof surfaces.

### The library

- **Router plus 20 skills**, each separately invocable, grouped Decide, Build, Craft, Gate.
  `gmira` routes when you do not know which one you want.
- **Decide:** `gmira-brief`, `gmira-direction`, `gmira-palette`, `gmira-typeset`.
- **Build:** `gmira-hero`, `gmira-scroll`, `gmira-catalog`, `gmira-detail`, `gmira-flow`,
  `gmira-proof`, `gmira-nav`.
- **Craft:** `gmira-arsenal`, `gmira-canvas`, `gmira-motion`, `gmira-states`.
- **Gate:** `gmira-slop`, `gmira-a11y`, `gmira-perf`, `gmira-verify`, `gmira-ship`.

### The doctrine

- **Three laws, each proven by building rather than by reading.** A registry component is an
  engine and not a design. The arsenal is broken on arrival. An effect must earn its place at
  frame 0 with no input.
- **The GPU floor.** Frame budget, pixel ratio caps, shader precision, context loss handling,
  teardown, offscreen pause, reduced motion, and the rule that everything the page says stays
  readable with the canvas element deleted. The design skill this learned most from ships numeric
  floors for type, colour, layout and motion and none for GPU work; this fills that gap.
- **Twelve visual tells no detector catches**, each with a concrete check.
- **Ten gates**, checked on the built result rather than on intent.

### The arsenal

- Seven shadcn registries wired and verified reachable: `@componentry`, `@canvas-ui`, `@bklit`,
  `@ncdai`, `@kibo-ui`, `@react-bits`, `@soundcn`. 514 components.
- A documented repair pass, because 12 of 56 componentry components ship `cn` imports that cannot
  resolve and 10 import packages they never declared.

### Anti-default mechanics

- 40 material worlds spanning eight material families, drawn by external hash index rather than
  preference, because a models ranking is a deterministic function of its priors and only an
  outside assignment defeats a prior.
- `scripts/draw.mjs` performs the draw and prints the drawn entries.
- The five block direction contract, with the falsifiability test that a block reading like a mood
  means the direction is not decided yet.

### The gate

- `scripts/verify.mjs` captures five viewports and measures contrast from computed styles,
  overflow that actually clips content, measure using each elements real glyph advance, tracking,
  focus styles by focusing each element, heading order, alt text, and canvas pixel ratio.
- Three false positive classes were found and fixed before release: visually hidden text reported
  as overflow, focus styles read in the resting state so every correct page failed, and rotated
  elements that clip nothing. A gate that cries wolf stops being read.

### Proofs

Four verticals, one library, no shared house style. Each drew its world by external index.

- Car dealership, index 0, industrial auction catalogue.
- Applied AI school, index 3, machine shop job traveller.
- Ads and UGC school, index 0, boxing fight poster.
- Direct to consumer store, index 1, a seed packet rack fused with a dyer shade card. Mode is
  Operate, so the effect budget is near zero and no WebGL component was installed.

All routes: zero console errors, zero contrast failures, zero clipped elements, zero interactive
elements without a focus style, at 1920x1080, 1440x900, 1024x768, 834x1112 and 390x844.

### Documentation

- README in Simplified Chinese as the default, English secondary.
- `research/` carries the extracted technique from five studied sources, two findings proven by
  build, the doctrine, and a harvest of 17,647 saved bookmarks.
