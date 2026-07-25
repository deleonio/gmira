# GMIRA

**A library of Claude Code skills that build websites nobody can tell were generated.**

Working name. Folder name is already `gmira`, so it stays until Ahmad renames it.
Tagline candidate: *"Websites that look like someone was there."*

---

## 0. Why this exists

The existing `vitrine` skill builds one self-contained HTML file with shaders, sound, and a
3D scroll deck. It is technically strong and visually loud, and it still loses, because:

1. **It has one look.** Every output is the same gold-on-warm-paper museum vitrine. A car
   dealership, a checkout page, and an AI school all come out as the same object. One look
   applied to every brief is the definition of generic, no matter how expensive that look is.
2. **The components are exotic, not usable.** 3D markdown slabs and a pentatonic drone bed
   are a demo, not a product surface. Nobody ships a cart with them.
3. **It has no component arsenal.** It composes everything from raw GLSL and hand-written
   DOM. Meanwhile there are four public libraries full of genuinely distinctive, production
   components that any agent can install in one command.
4. **It has no vertical knowledge.** It knows how to make a page shimmer. It does not know
   what a vehicle detail page needs, what a course syllabus needs, or what a checkout needs.

Gmira fixes all four. It is not a vitrine replacement in spirit; it is the opposite bet.
Vitrine spends its budget on one perceptual layer. Gmira spends it on **commitment to a
specific world per brief, executed with components that already exist and already work.**

## 1. The thesis

Generic output is not a talent problem. It is a **decision-avoidance** problem. When an agent
does not decide, it reaches for the median: the card grid, the gradient headline, the eyebrow
over every section, the three-column feature row, the centered hero with two buttons. Those are
what "no decision" looks like rendered to HTML.

So the library is built around forcing decisions and then supplying the material to execute them:

| Force the decision | Supply the material |
|---|---|
| A named visual world before a single element is placed | A curated arsenal of 150+ installable components |
| A mode per surface (persuade / operate / read / experience) | Vertical playbooks that know what the page actually needs |
| A refusal list of category defaults | Canvas and WebGL technique for the moments that earn it |
| A machine-checked craft floor | A Playwright verify gate that reads its own screenshots |

## 2. The arsenal

Cloned into `_sources/`, studied into `research/`, wired into `lab/`.

| Source | What it gives us | Install path |
|---|---|---|
| **componentry** (`componentry.dev`) | 56 components, heavy on WebGL and canvas: dither-prism-hero, webgl-liquid, liquid-chrome, silk-aurora, particle-galaxy, pixel-canvas, matrix-rain, circuit-board, ascii-effect, text-repel, kinetic-text-reveal, scroll-choreography, scroll-tilted-grid, orbit-card-stack | `@componentry` registry, shadcn MCP |
| **canvas-ui** (`DavidHDev/canvas-ui`) | Canvas-in-HTML UI primitives. The technique layer: DPR handling, RAF lifecycle, pointer normalization, reduced-motion degradation | shadcn registry |
| **bklit-ui** (`bklit/bklit-ui`) | Production component set plus its own shipped Claude skills to learn packaging from | `@bklit` -> `https://ui.bklit.com/r/{name}.json` |
| **chanhdai.com** (`ncdai/chanhdai.com`) | A real personal site with a real registry. The reference for "personal, not templated" | `@ncdai` -> `https://chanhdai.com/r/{name}.json` |
| **impeccable** (`pbakaus/impeccable`) | Not components: the **taste engine**. 23-command design skill, a 43KB critique reference, and a machine anti-pattern detector | studied, not installed |

Bonus registries discovered in chanhdai's `components.json` and worth wiring:
`@kibo-ui`, `@react-bits`, `@soundcn`.

## 3. What we take from impeccable, and where we go further

**Take:**
- The **modes** model (persuade / operate / read / experience) as a per-surface axis, not a per-project one.
- The **craft floor** as mechanical, verifiable checks rather than intentions.
- The **refusal list**: naming category defaults explicitly so reaching for one is a visible decision.
- The **anti-pattern detector** idea: slop as a machine-checkable property, not a vibe.
- The prose discipline: no em dashes, no AI-tell cadence, in every user-facing string the skill writes.

**Go further:**
- Impeccable is CSS-first and framework-agnostic by design. Gmira commits to one stack
  (Next 16 + React 19 + Tailwind v4 + shadcn v4) and buys, with that commitment, an arsenal
  of installable WebGL and canvas components impeccable cannot assume.
- Impeccable has no vertical knowledge. Gmira ships **playbooks** that know the content
  model of a vehicle listing, a course syllabus, an ad-creative library, a PDP.
- Impeccable stops at critique. Gmira closes the loop with a **Playwright verify gate** that
  screenshots at five viewports and reads them.

## 4. Architecture

Impeccable's CLAUDE.md is explicit that 23 standalone skills would pollute the `/` menu, so it
ships one skill with 23 sub-commands. Ahmad asked for a **library**, not one skill. The
resolution is a middle path, and it is deliberate:

```
gmira/                      <- 1 router skill, user-invocable
  |
  +-- world/                   <- 4 direction skills   (decide before you build)
  +-- build/                   <- 8 surface skills     (produce the page)
  +-- craft/                   <- 5 axis skills        (type, color, motion, canvas, states)
  +-- gate/                    <- 3 verify skills      (slop, a11y+perf, visual verify)
  +-- playbooks/               <- 5 vertical briefs    (not skills: loaded reference)
```

Each sub-skill is a real, separately invocable skill with its own `SKILL.md`, so the library
claim is true. The router exists so a user who does not know the library can type one thing.

Exact roster is fixed in `research/SYNTHESIS.md` once all four study agents report. Draft target
is 20 skills plus 5 playbooks.

## 5. The verticals

Every skill is proven against real briefs, not lorem. Four proofs ship as routes in `lab/`:

1. **Car shop**, a dealership. Inventory grid, vehicle detail page with real spec tables,
   finance calculator, trade-in flow, booking a test drive. Mode: persuade into operate.
   Hardest content model of the four.
2. **E-commerce**, a store. PLP, PDP with variant selection, cart, checkout. Mode: operate.
   The one where visual noise actively costs money, so it proves gmira knows when to stop.
3. **Applied AI engineering school**, cohort program. Curriculum, instructors, outcomes,
   application funnel. Mode: persuade into read.
4. **GTM / UGC ads school**, creator training. Creative library, hook teardowns, pricing,
   enrollment. Mode: persuade, loudest of the four.

A fifth, **our shop** (Ahmad's own), is scoped after the four land.

## 6. The gates

A build ships only when all of these are green. They are checks on the built result.

| Gate | Check |
|---|---|
| G1 Direction | A named world exists in writing before any element was placed, and the page can be traced to it |
| G2 Refusals | Zero category defaults present unless the brief's own words earned one, logged if so |
| G3 Contrast | Body and placeholder >= 4.5:1, large text >= 3:1, measured not assumed |
| G4 Type | Measure 65 to 75ch, tracking floor -0.04em, real copy at every breakpoint, zero overflow |
| G5 Motion | One authored moment, not an entrance on every section, reduced-motion is a real kill switch |
| G6 States | Hover, focus, disabled, loading, error, empty all present for every interactive surface |
| G7 Content | Real content model, zero invented metrics, testimonials, or logos |
| G8 Canvas | Every canvas or WebGL surface handles DPR, resize, cleanup, and reduced-motion, and degrades |
| G9 Console | Zero console errors at 1920x1080, 1440x900, 1024x768, 834x1112, 390x844 |
| G10 Eyes | The screenshots were read, by the agent, with findings written down |

## 7. Plan of record

- [x] **P1 Acquire.** Cloned the four repos, snapshotted the componentry registry index.
- [x] **P1b Wire.** Seven registries in `components.json`, all verified reachable (514 components).
      shadcn MCP wired at `md-stack/.mcp.json`. `lab/` scaffolded on Next 16 + React 19 + Tailwind v4.
- [x] **P2 Study.** Four parallel agents, one per source. `research/` holds 264 KB of extracted
      technique plus `CATALOG.md` (raw registry dump) and two findings proven by build.
- [x] **P3 Doctrine.** `research/SYNTHESIS.md`, copied to `skills/gmira/references/DOCTRINE.md`.
      Three laws proven by build, the GPU floor (this library's original contribution), the twelve
      visual tells, the ten gates.
- [x] **P4 Library.** 21 skills (router + 20), 5 playbooks, 40 material worlds, 4 technique
      references. 463 KB. Installed to `~/.claude/skills/`. Every skill routed, doctrine-linked,
      and closed with a verification checklist. Zero em dashes across the library.
- [ ] **P5 Proofs.** Car shop built and green at all ten gates on both routes. Three verticals
      in progress. `gmira-verify/scripts/verify.mjs` runs the five-viewport gate and had three
      false-positive classes fixed before it was trustworthy.
- [ ] **P6 Publish.** README and plugin manifest written. **Nothing pushed or deployed.** Waiting
      for the explicit go, and for a decision on the name.

## 9. Open decisions for Ahmad

1. **The name.** "gmira" is a working name I chose. Nothing is published under it, so changing it
   is free. It has to survive a repo, a README headline, and a tweet.
2. **Publish target.** A standalone public repo is the bold path and the one the reference class
   (Superpowers, impeccable) supports. The cautious path is a private repo first.
3. **The vitrine question.** Gmira does not replace vitrine, it makes the opposite bet. Whether
   vitrine stays a separate product, becomes one of Gmira's worlds, or is retired is a call I
   have not made.

## 8. Standing rules inherited from BRAIN.md

- Author of record is Ahmad only. No `Co-Authored-By` trailer on any commit, ever.
- No dashes as pause in prose. Compound hyphens are fine. Sachlich tone.
- Never publish, push, or deploy anywhere without Ahmad's explicit go. Build locally, stage, wait.
