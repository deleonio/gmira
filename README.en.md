[简体中文](README.zh.md) | **English**

<h1 align="center">GMIRA ܓܡܝܪܐ</h1>

<p align="center">
<em>gmīrā</em>, Syriac for perfect, complete, finished. Root <em>g-m-r</em>, to complete. The word the Peshitta uses for "perfect" in Matthew 5:48.
</p>

<p align="center">
  <strong>A component library raises the ceiling. It does nothing to the floor.</strong>
</p>

<p align="center">
21 Claude Code skills for building web surfaces that do not look AI-generated. GMIRA forces a written visual direction before any element is placed, wires 7 shadcn registries (514 components) with a repair pass, holds a GPU performance floor for WebGL and canvas work, and gates every build with Playwright across 5 viewports. Next.js, React, Tailwind v4.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat" alt="MIT license"></a>
  <a href="#the-21-skills"><img src="https://img.shields.io/badge/skills-21-black?style=flat" alt="21 skills"></a>
  <a href="#install"><img src="https://img.shields.io/badge/registries-7-black?style=flat" alt="7 component registries"></a>
  <a href="#install"><img src="https://img.shields.io/badge/components-514-black?style=flat" alt="514 components"></a>
  <a href="#the-gate"><img src="https://img.shields.io/badge/gate-5%20viewports-2da44e?style=flat" alt="Playwright gate at 5 viewports"></a>
  <a href="https://github.com/OthmanAdi/gmira/stargazers"><img src="https://img.shields.io/github/stars/OthmanAdi/gmira?style=flat&color=yellow" alt="Stars"></a>
</p>

<p align="center">
  <a href="#the-problem">The problem</a> ·
  <a href="#what-it-does">What it does</a> ·
  <a href="#install">Install</a> ·
  <a href="#the-21-skills">The skills</a> ·
  <a href="#the-gpu-floor">GPU floor</a> ·
  <a href="#the-proof">The proof</a>
</p>

---

## The problem

Ask any coding agent for a website and you get the same page. Card grid, gradient headline, tracked uppercase eyebrow over every section, centered hero with two buttons. Competent, interchangeable, forgettable.

The usual fix is to reach for a better component library. That does not work, and there is a screenshot proving it.

### Exhibit A: a deliberate dark palette, ignored

First install from an arsenal of 514 components. A WebGL hero, given near-black, deep green, and gold. A restrained dark hero for a car dealership.

![A WebGL hero rendering a full-width rainbow smear with a blown-out white disc welded to the centre, none of the near-black, deep green, and gold palette visible](proofs/finding-01/01-defaults-slop.png)

Rainbow smear. Blown-out white disc welded to the middle. Zero console errors, so the component reported success. The palette never reached the pixels.

The cause is legible once you read the shader. It runs nine layers: the palette is applied once at layer 2, then six further layers **add** to the colour without renormalising, and only the final line clamps. The worst offender is a glow that adds roughly **+1.84 per channel before the clamp**, which is white whatever the palette says. Its position and intensity are hardcoded in the uniform block and re-set every frame, with no prop that reaches them. The component advertises "VISIBLE Mouse interaction" in its own source comments and never wires it to a mouse.

### Exhibit B: four lines later

![The same WebGL hero after the patch, rendering the intended near-black ground with deep green and gold, headline text fully legible](proofs/finding-01/02-tamed.png)

Same component. Same brief. Same palette props. The patch promotes the welded constant to a prop and defaults it off.

**A registry component is an engine, not a design. Its defaults are tuned to win a five second gallery GIF, and the gallery GIF is the new generic.** In 2026 the rainbow WebGL blob sits exactly where the purple CSS gradient sat in 2021.

Full writeup: [`research/FINDING-01-tame-the-arsenal.md`](research/FINDING-01-tame-the-arsenal.md).

## What it does

Generic output is not a talent problem, it is a **decision-avoidance** problem. A model's ranking of design options is a deterministic function of its priors, so instructing it to "be original" cannot beat the prior: the instruction gets evaluated by the thing it is meant to correct.

Only an external assignment defeats a prior. So GMIRA forces the decision first, then supplies the material to execute it.

```
1  BRIEF      what is true, who it is for, what the content actually is
2  DIRECTION  a 5 block contract, written down, before any element is placed
3  BUILD      surfaces, using the arsenal, repaired and tamed
4  GATE       slop, accessibility, performance, then eyes on real screenshots
```

Step 2 costs 150 words and is the whole difference. The contract has five blocks and one falsifiability test:

```
THESIS         one sentence: what this surface argues
OWN-WORLD      the material world it borrows from, named specifically
STORY          what changes between first viewport and last
FIRST VIEWPORT what is on screen before any scroll, in nouns
FORM           the structural decision: how the page is built, not how it feels
```

If a block reads like a mood, the direction is not decided yet. "Premium and modern" is a mood. "A 1970s Porsche parts catalogue: monospace part numbers, hairline rules, photographs on a neutral card, no rounded corners anywhere" is a direction.

The world is **drawn by an external index**, not picked. Assign, do not choose. 40 material worlds ship in the catalogue the direction skill draws from.

## Install

Copy the skills into your Claude Code skills directory:

```bash
git clone https://github.com/OthmanAdi/gmira.git
cp -r gmira/skills/* ~/.claude/skills/
```

Or from npm ([gmira](https://www.npmjs.com/package/gmira), all 21 skills in one package):

```bash
pi install npm:gmira
```

Then wire the component registries into your project's `components.json`:

```json
{
  "registries": {
    "@componentry": "https://componentry.dev/r/{name}.json",
    "@canvas-ui":   "https://canvasui.dev/r/{name}.json",
    "@bklit":       "https://ui.bklit.com/r/{name}.json",
    "@ncdai":       "https://chanhdai.com/r/{name}.json",
    "@kibo-ui":     "https://kibo-ui.com/r/{name}.json",
    "@react-bits":  "https://reactbits.dev/r/{name}.json",
    "@soundcn":     "https://soundcn.xyz/r/{name}.json"
  }
}
```

514 components across seven registries, all verified reachable. Connect the shadcn MCP with `npx shadcn@latest mcp init` and the agent can search and install from all of them.

Keep the install cheap. `framer-motion`, `lenis`, and `lucide-react` reach every non three.js component, including all four raw WebGL heroes, because raw WebGL needs no library. three.js costs roughly 600 KB and is only worth it when one named component earns it.

Type `/gmira` and the router picks. Or invoke any skill directly.

## The 21 skills

One router plus twenty, each a separately invocable skill with its own `SKILL.md`.

### Decide

| Skill | Use when |
|---|---|
| `gmira-brief` | Starting anything. Extracts product truth, mode, and the real content model. |
| `gmira-direction` | The 5 block direction contract, with the anti-default mechanics. Nothing gets built before this. |
| `gmira-palette` | The colour world. Committed strategy, 30 to 60 percent surface coverage, measured contrast. |
| `gmira-typeset` | The typographic voice. Measure, scale, tracking, and what mono is allowed to mean. |

### Build

| Skill | Use when |
|---|---|
| `gmira-hero` | The first viewport. Owns the effect budget and the frame zero problem. |
| `gmira-scroll` | Scroll choreography: pinned sections, scrub, tilt, reveal. One authored moment. |
| `gmira-catalog` | Any set of things: inventory, products, courses, creative walls. The anti card grid skill. |
| `gmira-detail` | A single thing in depth: PDP, vehicle detail, course page. Spec tables and variant state. |
| `gmira-flow` | Multi-step: checkout, enrollment, finance calculator, booking, application. |
| `gmira-proof` | Testimonials, results, logos, case studies, without inventing any of them. |
| `gmira-nav` | Header, command menu, footer, and the chrome that carries the world. |

### Craft

| Skill | Use when |
|---|---|
| `gmira-arsenal` | Installing any registry component. Runs the repair and taming pass. Not optional. |
| `gmira-canvas` | Authoring or auditing canvas and WebGL work. Owns the GPU floor. |
| `gmira-motion` | Choosing and building the one authored moment. |
| `gmira-states` | Hover, focus, disabled, loading, error, empty. The six that get skipped. |

### Gate

| Skill | Use when |
|---|---|
| `gmira-slop` | Auditing for the visual tells no detector catches. Run before showing the user. |
| `gmira-a11y` | Contrast, focus order, semantics, canvas fallback readability. |
| `gmira-perf` | Frame budget, bundle weight, DPR caps, GPU teardown. |
| `gmira-verify` | Playwright at five viewports, then read the screenshots with your own eyes. |
| `gmira-ship` | Build, stage, publish. Never deploys without an explicit go. |

Plus five reference playbooks (a car dealership, an e-commerce store, an applied AI engineering school, a GTM and UGC ads school) and a catalogue of 40 material worlds.

## Three laws, proven by build

Not read out of a style guide. These came out of installing the arsenal and looking at what rendered.

1. **A registry component is an engine, not a design.** Its defaults are tuned to win a five second gallery GIF. Install then tame, in the same breath. Grep for welded constants before use: a prop that exists for a thing, and a hardcoded value elsewhere that overrides it.
2. **The arsenal is broken on arrival.** Across componentry's 56 components, 12 ship `cn` imports that cannot resolve and 10 import packages they never declared. Repair before writing any page.
3. **An effect must earn its place at frame 0, with no input.** Pointer-driven effects are invisible in the state most visitors actually see. A gallery GIF never shows this, because the person recording it is already moving the mouse.

## The GPU floor

The design skill this library learned the most from ships numeric floors for type, colour, layout, and motion, and none for GPU work. Its own gap analysis says so. These are ours.

| Check | Floor |
|---|---|
| Frame budget | Effect layer at most 8ms of the 16.7ms at 60fps. Measure, do not estimate |
| Pixel ratio | 1.5 full-bleed, 2.0 bounded. Never pass raw `devicePixelRatio` |
| Precision | `highp` desktop, `mediump` mobile, declared not defaulted |
| Simulation grids | Sim grid at most 128, display texture at most 512 for full-bleed |
| Context loss | A `webglcontextlost` listener with a restore path, mandatory |
| Teardown | Explicit `destroy()`. Browsers cap live contexts at roughly 16, and a leak does not error, it silently breaks every later canvas |
| Offscreen | Pause on IntersectionObserver exit and on `visibilitychange` |
| Reduced motion | Freeze at a still frame you chose by looking at it, not at t=0 |
| First frame | Mount after content. Never block first contentful paint on shader compile |
| Failure | Everything the page says stays readable **with the canvas element deleted** |

Performance is treated as a design material here, not only as a constraint. Load time, first frame time, and thermal behaviour have visible consequences, so they are decisions.

## The gate

`gmira-verify` runs Playwright at 1920x1080, 1440x900, 1024x768, 834x1112, and 390x844. It measures computed contrast, text overflow, measure, tracking, focus styles by actually focusing each element, heading order, and canvas DPR. It writes screenshots and a report.

It cannot judge, and it says so. The last gate is G10: **the screenshots were read, by the agent, with findings written down.**

One method it enforces is worth stealing on its own. When you have both a deterministic checker and a judgment pass, **run judgment first, in isolation**, because otherwise the checker's output becomes the ceiling of the judgment. Look at the screenshot and write down what you see before you open the report. After you have read the report, that first look is no longer available to you.

## The proof

Four verticals, each built through the library, each drawing its material world by external hash index rather than by preference. Same stack, same skills, four pages that are not related to each other.

| Vertical | World drawn | What it changed |
|---|---|---|
| Car dealership | Industrial auction catalogue | Inventory became a lot list. Condition grade became the organising column instead of price. The damage report became the strongest artifact on the page rather than an apology at the bottom |
| Applied AI engineering school | Machine shop job traveller | The curriculum became a routing of nine numbered operations, each carrying a stamped acceptance test readable in full before you pay |
| GTM and UGC ads school | Boxing fight bill and undercard | Every ad is billed as a bout, including the one that lost money. Display size on the undercard is computed from each week's output count |
| Store | Seed packet rack fused with a dyer shade card | Products hang from a rail instead of sitting in a grid. Every colour carries a lightfastness figure drawn as eight filled boxes |

Every image below is a real capture from `lab/`, taken by `scripts/shot.mjs` at the same size, on the same day, from the same skill library. Nothing is a mockup.

<table>
  <tr>
    <td width="25%"><img src="docs/screenshots/car.jpg" alt="Car dealership lot list: mono lot numbers, hairline rules, rotated condition grade stamps, hammer estimate prices, no hero photograph and no cards" /></td>
    <td width="25%"><img src="docs/screenshots/school.jpg" alt="AI school routing card: part number, routing revision, a rotated RELEASED stamp, punched binder holes down the left edge, and a work order sidebar" /></td>
    <td width="25%"><img src="docs/screenshots/ads.jpg" alt="Ads school fight bill: goldenrod stock, heavy black wood type, a main event bout line and an undercard" /></td>
    <td width="25%"><img src="docs/screenshots/shop.jpg" alt="Store rack: natural dye lots with botanical names and blue wool lightfastness scales drawn as filled boxes" /></td>
  </tr>
  <tr>
    <td><b>Car dealership</b><br/><sub>Industrial auction catalogue</sub></td>
    <td><b>Applied AI school</b><br/><sub>Machine shop job traveller</sub></td>
    <td><b>Ads and UGC school</b><br/><sub>Boxing fight bill</sub></td>
    <td><b>Store</b><br/><sub>Seed packet rack</sub></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/car-lot.jpg" alt="Vehicle lot page: advisories listed first with rectification quotes, then a measurement register grouped by system with units in the label" /></td>
    <td><img src="docs/screenshots/school-op.jpg" alt="A single operation sheet from the routing, with its acceptance test and operator stamp" /></td>
    <td><img src="docs/screenshots/ads-teardown.jpg" alt="Creative teardown page, with every performance figure tagged illustrative and marked not resolvable" /></td>
    <td><img src="docs/screenshots/shop-order.jpg" alt="Checkout delivery step: named steps including the ones not built, a real stock hold deadline, and VAT disclosed in the total" /></td>
  </tr>
  <tr>
    <td><sub>Lot page. Advisories first</sub></td>
    <td><sub>Operation sheet</sub></td>
    <td><sub>Teardown, loss included</sub></td>
    <td><sub>Checkout, effects at zero</sub></td>
  </tr>
</table>

The car dealership drew index 0, industrial auction catalogue. No hero photograph. No cards. No gradient. Lot numbers in mono, condition grades struck as rotated stamps, prices printed as hammer estimates, one horizontal rule weight at 0.5px.

The store drew Operate mode, so its effect budget is near zero and no WebGL component was installed at all. That proof exists to show the library knows when to stop.

All ten gates green at five viewports, on every route above.

## FAQ

### Why does my AI-generated landing page look generic?

Because nothing was decided. An agent that has not committed to a direction reaches for the median, and the median rendered to HTML is the card grid, the gradient headline, the eyebrow over every section, and the centered hero with two buttons. Installing a more impressive component library relocates the problem rather than fixing it. GMIRA writes a five block direction contract before any element is placed, and the world in that contract is drawn by an external index so the model's own priors cannot pick it.

### Why does my shadcn or WebGL component ignore the palette I passed?

Usually a welded constant. A registry component often has a prop for a thing and a hardcoded value elsewhere that overrides it every frame, and an additive shader stack cannot honour a dark palette at all: more than two `col += ...` without renormalising trends to white. Verify by comparing rendered pixels against the source hexes, never by trusting prop names. `gmira-arsenal` runs a repair and taming pass on every install.

### Does this replace my component library?

No. It sits on top of one. GMIRA wires 7 shadcn registries totalling 514 components and treats each installed component as an engine to be repaired and tamed, not as a finished design. shadcn copies source into your repo precisely so you can edit it.

### How do I check whether a page is actually accessible and performant, not just green in the linter?

`gmira-verify` runs Playwright at five viewports and reads computed values rather than assumed ones: contrast from computed styles, focus styles by actually focusing each element, text overflow, measure, tracking, heading order, and canvas DPR. The GPU floor adds checks no accessibility linter has: context loss handling, explicit teardown, offscreen pause, reduced motion as a total kill switch, and readability with the canvas element deleted.

### What stack does it assume?

Next.js 16, React 19, Tailwind v4, shadcn v4, and the shadcn MCP for registry search and install. The doctrine, the craft floor, and the GPU floor are stack independent. The install commands and the registry wiring are not.

## One plate per skill

Twenty specimen plates, one for each skill, each built by the library itself and captured at the same size. Each one is a different printed world on purpose: if they all looked alike, the library would be failing its own claim inside its own documentation. Sources live in [`lab/src/app/specimen/`](lab/src/app/specimen/).

<table>
  <tr>
    <td width="25%"><img src="docs/specimens/brief.jpg" alt="gmira-brief: a surface brief typed onto a paper intake form, with the uninventable items marked" /></td>
    <td width="25%"><img src="docs/specimens/direction.jpg" alt="gmira-direction: the five block direction contract stamped committed, beside the rejected rut and its excluded opposite" /></td>
    <td width="25%"><img src="docs/specimens/palette.jpg" alt="gmira-palette: mineral pigment swatches with measured contrast printed on them, one of them failing" /></td>
    <td width="25%"><img src="docs/specimens/typeset.jpg" alt="gmira-typeset: a type scale, a measure ruler laid over a paragraph, and the tracking floor shown on two headlines" /></td>
  </tr>
  <tr>
    <td><b><code>gmira-brief</code></b><br/><sub>Brief typed onto an intake form</sub></td>
    <td><b><code>gmira-direction</code></b><br/><sub>Contract stamped, two exhibits rejected</sub></td>
    <td><b><code>gmira-palette</code></b><br/><sub>Swatches with measured contrast, one failing</sub></td>
    <td><b><code>gmira-typeset</code></b><br/><sub>Scale, measure ruler, tracking floor</sub></td>
  </tr>
  <tr>
    <td><img src="docs/specimens/hero.jpg" alt="gmira-hero: a film contact sheet comparing an empty frame-0 panel against a seeded one" /></td>
    <td><img src="docs/specimens/scroll.jpg" alt="gmira-scroll: six identical section fades beside one authored peak" /></td>
    <td><img src="docs/specimens/catalog.jpg" alt="gmira-catalog: the same six specimens rendered four ways, with the uniform card grid flagged as the default" /></td>
    <td><img src="docs/specimens/detail.jpg" alt="gmira-detail: a grouped and sourced spec table beside the flat list version marked as the failure" /></td>
  </tr>
  <tr>
    <td><b><code>gmira-hero</code></b><br/><sub>Empty frame 0 versus seeded</sub></td>
    <td><b><code>gmira-scroll</code></b><br/><sub>Six identical fades versus one peak</sub></td>
    <td><b><code>gmira-catalog</code></b><br/><sub>Four structures, one flagged default</sub></td>
    <td><b><code>gmira-detail</code></b><br/><sub>Grouped spec table beside its failure</sub></td>
  </tr>
  <tr>
    <td><img src="docs/specimens/flow.jpg" alt="gmira-flow: the six field states and a step bar that names the steps it cannot reach yet" /></td>
    <td><img src="docs/specimens/proof.jpg" alt="gmira-proof: a forbidden logo wall and star row struck through, beside the substitution ladder" /></td>
    <td><img src="docs/specimens/nav.jpg" alt="gmira-nav: a print proof sheet, the ruled header approved and the floating pill nav killed" /></td>
    <td><img src="docs/specimens/arsenal.jpg" alt="gmira-arsenal: the repair table above a welded constant versus its tamed prop diff" /></td>
  </tr>
  <tr>
    <td><b><code>gmira-flow</code></b><br/><sub>Six field states, honest step bar</sub></td>
    <td><b><code>gmira-proof</code></b><br/><sub>Forbidden proof beside the real ladder</sub></td>
    <td><b><code>gmira-nav</code></b><br/><sub>Ruled header approved, pill nav killed</sub></td>
    <td><b><code>gmira-arsenal</code></b><br/><sub>Repair table, welded versus tamed</sub></td>
  </tr>
  <tr>
    <td><img src="docs/specimens/canvas.jpg" alt="gmira-canvas: the GPU floor rendered as a riveted gauge cluster with real values" /></td>
    <td><img src="docs/specimens/motion.jpg" alt="gmira-motion: the duration and easing table drawn as physical timing tracks" /></td>
    <td><img src="docs/specimens/states.jpg" alt="gmira-states: six button states and the three kinds of empty state on one board" /></td>
    <td><img src="docs/specimens/slop.jpg" alt="gmira-slop: a printed audit sheet of the twelve visual tells, five found and seven clear" /></td>
  </tr>
  <tr>
    <td><b><code>gmira-canvas</code></b><br/><sub>GPU floor as a gauge cluster</sub></td>
    <td><b><code>gmira-motion</code></b><br/><sub>Duration and easing as timing tracks</sub></td>
    <td><b><code>gmira-states</code></b><br/><sub>Six states, three kinds of empty</sub></td>
    <td><b><code>gmira-slop</code></b><br/><sub>Audit sheet of the twelve tells</sub></td>
  </tr>
  <tr>
    <td><img src="docs/specimens/a11y.jpg" alt="gmira-a11y: five contrast pairs plotted against the WCAG threshold lines" /></td>
    <td><img src="docs/specimens/perf.jpg" alt="gmira-perf: a greenbar ledger of bundle weights, the WebGL context cap, and the LCP rule" /></td>
    <td><img src="docs/specimens/verify.jpg" alt="gmira-verify: the five viewports drawn to scale with the gate table and the quarantine rule" /></td>
    <td><img src="docs/specimens/ship.jpg" alt="gmira-ship: a steel clipboard checklist, ticked, with deploy held for an explicit go" /></td>
  </tr>
  <tr>
    <td><b><code>gmira-a11y</code></b><br/><sub>Contrast pairs against WCAG lines</sub></td>
    <td><b><code>gmira-perf</code></b><br/><sub>Greenbar ledger of the budget</sub></td>
    <td><b><code>gmira-verify</code></b><br/><sub>Five viewports, gates, quarantine</sub></td>
    <td><b><code>gmira-ship</code></b><br/><sub>Checklist, deploy held for go</sub></td>
  </tr>
</table>

## Built on

Studied, with thanks: [pbakaus/impeccable](https://github.com/pbakaus/impeccable) for the taste engine and the anti-default mechanics, [DavidHDev/canvas-ui](https://github.com/DavidHDev/canvas-ui) for html-in-canvas technique, [bklit/bklit-ui](https://github.com/bklit/bklit-ui) for chart composition and skill packaging, [ncdai/chanhdai.com](https://github.com/ncdai/chanhdai.com) for structural craft, and [componentry](https://componentry.dev) for the arsenal.

Their technique is extracted into [`research/`](research/), with what to steal and where to go further.

## License

MIT.

---

**Author:** [Ahmad-Othman Adi](https://github.com/OthmanAdi)
