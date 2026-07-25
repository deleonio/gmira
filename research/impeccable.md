# Impeccable: extracted design technique

Source: `gmira/_sources/impeccable` (skill v4+, 23 commands, 60 detector rules).
Read for: architecture patterns, the taste engine, the anti-slop registry, per-axis numbers.
Everything below is either quoted or tightly paraphrased from the repo. Rule ids in `<!-- rule:... -->` comments are the repo's own stable identifiers; they are worth stealing as a naming convention.

---

## 1. Architecture lessons

### One router skill, N sub-commands, zero standalone skills

There is **one** user-invocable skill, `impeccable`, with **23 commands** underneath it. Users type `/impeccable polish`, `/impeccable audit`.

The stated reason, verbatim from `CLAUDE.md`:

> **Do not add standalone skills** unless there's a strong reason. The consolidation was deliberate: the `/` menu pollution problem is real and gets worse as users install more plugins.

Shape of the source tree:

- `skill/SKILL.src.md` carries frontmatter (the auto-trigger-optimized description plus `allowed-tools`), the shared design laws, and the **Commands** router table. Provider `SKILL.md` files are generated from this single source with placeholder substitution (`{{model}}`, `{{config_file}}`, `{{command_prefix}}`, `{{scripts_path}}`, `{{available_commands}}`, `{{ask_instruction}}`).
- `skill/reference/<command>.md`, one per command. **The router loads exactly one reference file per request.** Nothing else is in context.
- `skill/scripts/command-metadata.json` is the single source of truth for each command's description and argument hint; both the build and `pin.mjs` read it.
- `skill/scripts/pin.mjs` creates lightweight redirect shims so a user can have `/audit` as a standalone shortcut that delegates to `/impeccable audit`. This is the escape valve that makes the one-skill rule survivable.

### What they deliberately refuse to do, and why

**No per-domain reference files.** v4 deleted `typography.md`, `color-and-contrast.md`, `spatial-design.md`, `motion-design.md`, `interaction-design.md`, `responsive-design.md`, `ux-writing.md`, `cognitive-load.md`, `personas.md`, `heuristics-scoring.md`, `build-floor.md`, `live-generation.md`.

> Their content lives in the command references and `craft-floor.md`, where it is loaded only when it applies.

The lesson: a domain file (typography.md) is loaded on the wrong pretext, at the wrong time, in the wrong amount. A task file (typeset.md) is loaded exactly when its task is invoked. Cognitive-load and heuristics and personas were folded **inline into critique.md** for the same reason: "they live inline now so the critique flow has all its deep context in one place."

**Accessibility is deliberately not in the top-level skill.** This is the sharpest design decision in the repo:

> **a11y lives in `audit.md`**, not in SKILL.md or the mode guidance. Models over-cautious themselves into safe, underdesigned output when reminded about accessibility at design time. The audit command is the dedicated place for that check.

**No mode field in the durable product artifact.** Mode is per surface, so it persists only in the surface brief under `.impeccable/surfaces/`. `PRODUCT.md`'s only bare-value field is `## Platform`. A leftover `## Register` section from v3 is reported at boot as deprecated and read by nothing.

**Retired fields carry a reason, not just a tombstone.** From `CLAUDE.md`:

> When you retire a PRODUCT.md field, add it to `PRODUCT_DEPRECATED_SECTIONS` in `lib/artifact-schema.mjs` with the reason. The reason is not decoration: told only that a field is deprecated, models preserve it "just in case", which is how a retired axis keeps steering current output.

**Never repair drift as a side effect of a design task.** A `CONTEXT_STALE` finding is reported, not acted on, unless the user asks. Exception: findings marked `auto`, which the next write to that file performs anyway.

**Maintenance tooling stays out of the design menu.** `doctor` is deliberately not in `IMPECCABLE_SUB_COMMANDS`, `command-metadata.json`, `SKILL_CATEGORIES`, or `pin.mjs`'s `VALID_COMMANDS`, and does not count toward the 23.

**The catalog is the moat.** The concept catalog (world cards, reference imagery, composition catalogs) lives in a private repo. `concept-seed.mjs` resolves data via `IMPECCABLE_CATALOG_DIR`, then a roll API, then a degraded promotion-only seed. "Never add catalog data files back to this repo; the catalog is the paid-service moat."

### The three-step Setup contract

Every session runs a fixed prelude, and each step has a stated cost rationale:

1. `node <scripts>/context.mjs` **once per session** (`rule:skill-setup-context`). Loads PRODUCT.md, DESIGN.md, the matching surface brief, and native-platform guidance. "follow its directives and do not rerun it."
2. Load **the one playbook that owns the request** (`rule:skill-setup-command-ref`), then inspect the target plus at least one representative source of incumbent visual truth: tokens, theme, CSS, component, or asset (`rule:skill-setup-read-project`).
3. Load `craft-floor.md` **immediately before editing UI**, never for planning-only work (`rule:skill-craft-floor-load`). It carries "the quality floor, the absolute bans, and the reflexes no detector catches."

### The verification budget is a hard rule, not advice

> Verify in bounded passes, not a loop: build fully, then inspect with one batched screenshot round (desktop and mobile together), fix everything it shows, and confirm with at most one more round. Per-tweak screenshot cycles burn the user's money without raising the bar; live mode is the channel for tweak-by-tweak iteration.

Two rounds is the ceiling. Fixes batch between them.

### The platform axis (orthogonal to mode)

`web` (default, no extra rulebook), `ios` (loads Apple HIG distilled), `android` (Material 3 distilled), `adaptive` (loads **both**).

- A missing `## Platform` field defaults to `web` so legacy projects are unaffected.
- A line naming both native targets (`ios, android`) reads as `adaptive`.
- Any unrecognized value falls back to web **and** prints a WARNING naming the bad value, "so a toolchain name or typo never silently gets web guidance."
- A Flutter/RN app that uses one look on both platforms is **not** adaptive; it takes that single platform's value.
- `context.mjs` **inlines** the native reference directly into its output so native conventions land without a second model-directed read.
- Where a command's native guidance diverges too much to share a file, it gets a `<command>.native.md` variant routed **instead of** the web file. Today: `audit.native.md`, `adapt.native.md`. Web files carry a one-line web-only guard redirecting stray native readers.
- Commands whose divergence the platform refs already cover (`animate`, `layout`) carry nothing extra: "don't add in-file translation notes, they make native runs pay for web content."
- Live mode, the `detect` CLI, and the design hook are **web-only** and skipped entirely on native platforms.

### Provider-conditional blocks inside one source

Reference files carry `<claude>`, `<codex>`, `<gemini>` blocks stripped per provider at build time. They encode **model-specific failure priors**, which is a technique worth copying wholesale. Example from `new-work.md`:

> `<claude>` Your measured rendition prior: warm, bookish, family, and child-facing subjects come out as cream grounds, serif display with italic accents, and lamplight, even when the assigned direction never asked for them. Treat that first palette as already spent. `</claude>`

And from `craft-floor.md`:

> `<gemini>` Never animate an image on hover, directly or through its parent. It is not an action target. Give the container the feedback. `</gemini>`

### Two-tier staleness as a performance contract

- **Tier 1** (`collectBootFindings`) may only spend what a boot already spends: markdown already in memory, a bounded set of stats, small JSON the boot reads anyway. **No directory walks, no git, no cross-workspace sweep.** "Adding an expensive check here taxes every session in every project."
- **Tier 2** (`staleness-deep.mjs`, run on demand by `doctor`) may use git log, per-workspace sweep, ignore-list validation against the live `ANTIPATTERNS` registry.
- Findings are data: `{ id, artifact, path, severity, summary, fix }` so the boot directive, the text report, and `--json` all render one set.
- **Severity says what should happen, not how bad it is**: `auto` (fix silently on the next write to that file), `mention` (state once, carry on), `route` (name the command that owns the repair).
- Emission discipline: Tier 1 emits **one** `CONTEXT_STALE` directive for the whole set; `mention` and `route` throttle to once a week per project.

### The no-argument menu is computed, never static

`routing.md`: run `context-signals.mjs` once, read its JSON, then lead with the **2 to 3 highest-value next commands**, each with a one-line reason pulled from the signals. **Never auto-run a command.** Concrete signal-to-command mappings:

- `setup.hasDesign` false while `setup.hasCode` true, route `document`.
- `critique.latest` is `null`, offer `critique <surface>`.
- `critique.latest` with a low score or non-zero p0/p1, route `polish` (which reads the snapshot as its backlog).
- `git.changedFiles` pointing at one surface, scope `audit`/`polish` to those files by name.
- `devServer.running` true, `live` is available; if false, do not lead with `live`.
- Run the detector over `scan.targets` and fold the hits in: many quality/contrast hits route `audit`/`polish`; a specific slop family routes the matching command (gradient text or eyebrows to `quieter`/`typeset`, flat or gray palette to `colorize`).

---

## 2. The Modes model

> The mode names what the visitor's success looks like on this surface.

| Mode | Definition | Surfaces | What wins |
|---|---|---|---|
| **Persuade** | the visitor decides and acts; design is the product | landing pages, marketing, campaigns, pricing | earn attention and action; ship real imagery when the brief needs it; follow the committed world, not category habit |
| **Operate** | the visitor completes a task | app UI, dashboards, editors, admin, settings, tools | scanability, consistency, native expectations, and the real usage scene outrank expression; brand lives in precise details |
| **Read** | the visitor understands something | docs, articles, guides, help, changelogs | structure for comprehension, then make the reading experience worth staying in |
| **Experience** | the visitor is inside the work itself | portfolios, galleries, showcases | let the artifact lead from the first viewport; the interface recedes |

### How mode is chosen

> Choose the mode from the requested **surface**, not the product, and persist it only in that surface brief. A tool's landing page is still Persuade; a fashion house's documentation is still Read; a docs index is Read, not Persuade. (`rule:skill-visitor-mode`)

Mode is per surface, not per project. It is not stored in PRODUCT.md. There are no per-mode reference files (`brand.md` and `product.md` are gone); `operate.md` carries deeper Operate and Read guidance, `new-work.md` owns new surfaces.

### What changes per mode

Every axis file opens with a "Visitor mode" block. The consistent split is **Persuade + Experience** vs **Operate + Read**.

| Axis | Persuade + Experience | Operate + Read |
|---|---|---|
| **Concept questions** (new-work) | Persuade: who must act, what they should believe, which real proof can earn it. Experience: what leads, how exploration unfolds, which interaction or transition matters. | Operate: the task, information, important states, frequency, constraints. Read: the reader's question, source material, structure, wayfinding. |
| **Color strategy** | permission for the bolder strategies (Committed, Full palette, Drenched); color may own large regions | Restrained is the floor and the default; color encodes action, selection, status, wayfinding, reading hierarchy. "Rarity gives an accent force." |
| **Type** | display type may carry the voice; decisive contrast, responsive scale | stability, scanability, measure first; one well-tuned family and a fixed role scale are often right |
| **Layout** | composition may be asymmetric, fluid, intentionally disruptive when the world earns it | predictable structure, stable density, navigable linearity are affordances |
| **Motion** | motion may carry the voice; prefer one rehearsed focal sequence to repeated section reveals | motion serves feedback, state, continuity; keep routine transitions fast; no page-load choreography |
| **Delight** | personality may run through voice, composition, motion, discovery, provided the artifact stays the focus | concentrate delight at first use, completion, recovery, mastery. "Reliability carries everything else." |
| **Quieter** | more restrained palette, more whitespace, more typographic air. "Drama is reduced, not eliminated; the POV stays intact." | fewer background accents, flatter cards, less color, less motion. "The tool should disappear more completely into the task." |
| **Heuristics** | heuristics 7 (Flexibility) and 10 (Help/Docs) may be scored `n/a` | all ten normally apply |

### Operate depth (`operate.md`), the parts with numbers

- **The product slop test**: "whether a category-fluent user can trust the interface immediately or must pause at every subtly-off component. Product UI's failure mode isn't flatness, it's strangeness without purpose."
- One family is often right; product UIs do not need display/body pairing.
- **Fixed rem scale, not fluid.** "Clamp-sized headings don't serve product UI. Users view at consistent DPI, and a fluid h1 that shrinks in a sidebar looks worse, not better."
- **Type scale ratio 1.125 to 1.2** between steps (vs the 1.25+ floor on brand surfaces). "More type elements here than on brand surfaces; exaggerated contrast creates noise."
- Line length 65 to 75ch for prose; tables at 120ch+ are fine.
- State-rich semantic color vocabulary, standardized: hover, focus, active, disabled, selected, loading, error, warning, success, info.
- A second neutral layer for sidebars, toolbars, panels (slightly cooler or warmer than the content surface).
- Every interactive component ships default, hover, focus, active, disabled, loading, error. "Don't ship with half of these."
- Skeleton states for loading, not spinners in the middle of content. Empty states that teach the interface, not "nothing here."
- Overlays escape their container: an absolutely positioned dropdown inside `overflow: hidden`/`auto` gets clipped. Use `<dialog>`, the popover API, `position: fixed`, or a portal.
- **Motion 150 to 250 ms** on most transitions. No orchestrated page-load sequences.
- Product bans: decorative motion, inconsistent component vocabulary, display fonts in UI labels/buttons/data, reinvented standard affordances, heavy or full-saturation accents on inactive states, "modal as first thought. Modals are usually laziness."
- Product permissions: system fonts, standard nav patterns, density, "consistency over surprise."

---

## 3. The design laws (from SKILL.src.md and craft-floor.md)

### Core stance

> This skill gives you the tools and permission to create design that earns to be called out-of-distribution craft: Whereas before, your design work would have been safe, timid and measured, you now approach every design task as an award-winning design director with impeccable understanding for what makes exceptional design work: production-grade code, peak creativity, a clear POV, deep understanding of the needs of the client and users, and exceptional craft.

- Go all out. No hedging, no shortcuts. The deliverable must be complete (except assets the user must provide).
- Dream big and bold. Distinct, beautiful, outstanding and highly inspiring work.
- Verify in bounded passes, not a loop (two screenshot rounds max).

### Authority laws

- **The brief wins.** "Honor pinned aesthetics, eras, materials, fonts, and palettes even when they conflict with a saturated-pattern warning. Redirecting a clear brief toward your taste is failure." (`rule:skill-brief-wins`)
- **Refinement preserves; redesign replaces.** "Refinement keeps the incumbent identity, behavior, copy, and everything outside scope. Ask before replacing factual copy or adding claims. Redesign keeps product truth, content, function, native affordances, and constraints, but treats the old look as evidence and anti-reference... **Never split the difference into polish on the discarded look.**" (`rule:skill-world-change-semantics`)
- **Visual authority is evidence, not a filename.** "Missing DESIGN.md alone does not make a project greenfield." (`rule:skill-new-work-gate`)
- **Scope is sovereign** (bolder.md): "'Everything else stays' is a literal instruction. Touch only the named target." If the existing system genuinely cannot express the direction, stop and ask, "naming the exact addition and the job it would do."

### The craft floor: verify (each is a check on the built result, not an intention)

- **Contrast:** body and placeholder text >= 4.5:1, large text >= 3:1. "On colored surfaces tint secondary text from that hue or the foreground; **never gray**." (`rule:skill-color-verify-contrast`)
- **Depth:** shadows carry an offset and a soft blur. "A zero-offset colored halo is decoration." (`rule:skill-color-no-glow-halo`)
- **Spacing:** tight groups, generous separation, **more space above a heading than below it**. Read the computed values. (`rule:skill-layout-spacing-rhythm`)
- **Type:** body measure **65 to 75ch**, display **max 6rem**, **tracking floor -0.04em**, balanced headings, obvious scale and weight steps. "Run the real copy at every breakpoint and fix what overflows." (`rule:skill-typo-floor`, `rule:skill-ban-text-overflow`)
- **Motion:** one authored moment, not scattered effects and not one identical entrance on every section. Exponential ease-out from an already-visible default. "Reach past transform and opacity: blur, backdrop-filter, clip-path, mask, and shadow belong to the palette when they stay smooth." (`rule:skill-motion-floor`, `rule:skill-motion-materials-palette`, `rule:skill-motion-no-section-fade`)
- **States:** hover, disabled, loading, error, empty. Plus real content, working controls, responsive composition, keyboard focus. (`rule:skill-floor-shipping`)
- **Copy:** the product's own language. "Controls name their action; errors name the problem and the recovery." (`rule:skill-copy-design-material`)
- **Coverage:** every brief requirement present and findable within seconds. (`rule:skill-floor-brief-coverage`)

### The craft floor: refuse

Framed precisely: "These are the category's defaults, not bans: the brief's own words can earn any of them. **Reaching for one when the axis is free means you were not deciding**; recognizing that means rewriting the element, not softening it."

Page scaffolds:

- Same-size cards of icon + heading + text as the page structure. "Cards are the lazy container; **nested cards are always wrong**." (`rule:skill-ban-identical-card-grids`, `rule:skill-layout-cards-lazy`)
- The hero-metric template: big number, small label, supporting stats, accent. (`rule:skill-ban-hero-metric`)
- A tracked uppercase eyebrow over every section. "One named kicker is a system; an eyebrow everywhere is grammar you did not choose." (`rule:skill-ban-eyebrow-on-every-section`)
- Section numbers (01 / 02 / 03) unless the sequence itself carries information the reader needs. (`rule:skill-ban-numbered-section-markers`)
- A modal for a task that needs neither interruption nor protected focus. (`rule:skill-reflex-modal-by-reflex`)

Surface habits:

- Gradient text. "Emphasis comes from weight or size." (`rule:skill-ban-gradient-text`)
- Glass and blur as decoration rather than as a specific effect. (`rule:skill-ban-glassmorphism-default`)
- A colored `border-left`/`border-right` above 1px on cards, list items, callouts, alerts. (`rule:skill-ban-side-stripe-borders`)
- Sparklines, progress rings, soft-shadowed rounded rectangles standing in for content. (`rule:skill-reflex-decorative-chrome`)
- Monospace as a costume for "technical" rather than for code, data, or measurement. (`rule:skill-reflex-mono-as-technical`)
- Light or dark picked by category. "Pick it from the use scene: who, where, under what ambient light." (`rule:skill-reflex-theme-by-habit`)

Codex-specific additions (worth generalizing):

- Tracking stops at -0.04em; -0.02 to -0.03em usually reads better.
- **Declare elevation once, border or shadow.** "A 1px border under a wide soft shadow is the ghost card." **Card radii stay at 12 to 16px; pills are for small controls.**
- "Real illustration or none." Sketch-style SVG scenes, `loose-sketch`/`doodle` class names, and `feTurbulence` grain read as amateur.
- "Backgrounds are surfaces, textured only from the subject's world." `repeating-linear-gradient` stripes and two-axis grid overlays need an actual canvas, map, blueprint, or measuring tool under them.
- Claims and configuration come from supplied truth; label illustrative values honestly. "Naming a concept and then ironizing it is not a claim."

Closing law: **"The floor holds the mechanics; it never picks the direction. With every check green, spend the page on the committed world, and when torn between refined and committed, commit."** (`rule:skill-floor-not-ceiling`)

---

## 4. The taste engine: `critique.md` in full method

This is the highest-value file in the repo. It is not a checklist, it is an **adversarial procedure** with anti-anchoring mechanics, a scoring rubric with renormalization, five simulated users, and a persistence/trend loop.

### 4.1 The core structural idea: two isolated assessments, then synthesis

> Assessment A (design review) and Assessment B (detector/browser evidence) are both required.
>
> Assessment A and B MUST run as two isolated sub-agents whenever a sub-agent/Task tool is exposed. Running them inline in this context is "possible" but is NOT permitted; it is a degraded run.
>
> **Assessment A must finish before detector findings enter the parent synthesis context. Detector output is deterministic, but it still anchors judgment.**

That last clause is the crown jewel of the whole design. Deterministic evidence is treated as **cognitively contaminating**: a machine-verified list of 14 findings will hijack a human-style aesthetic judgment if it arrives first. So the taste pass is quarantined and must complete before evidence lands.

**Degradation is loud, never silent.** If sub-agents are unavailable, the report's first line must be a banner:

```
⚠️ DEGRADED: single-context (<reason>)
```

> A silent degraded critique is a failed critique.
>
> "Unavailable" means exactly one thing: no sub-agent/Task tool is exposed in this session (or, on harnesses that ask, the user declined). **It does not mean inconvenient.**

Other hard invariants:

- "A skipped detector is a failed critique run unless `detect.mjs` is missing or crashes after a real attempt."
- Viewable targets require browser inspection when available.
- Each assessment creates **its own new tab**. "Never reuse an existing tab, even if it is already at the right URL."
- Any local server started for visualization must run in the background, have a recorded stop method, and be stopped before final reporting.
- "Do not claim a user-visible overlay exists unless script injection succeeded and the detector ran in the page."
- Report header must declare provenance: `Method: dual-agent (A: <agent-id> · B: <agent-id>)`.

### 4.2 Target resolution

> Prefer a source path over a dev-server URL when both identify the same surface; **ports drift, paths do not.**

- "the homepage" resolves to `site/pages/index.astro` or `index.html`
- "the settings modal" resolves to the primary component file
- "this page" resolves to the current URL or source file

Then slug it via `critique-storage.mjs slug` and never hand-write a slug. Read `.impeccable/critique/ignore.md` if present and drop matching findings silently: "it is the only prior-run input critique consumes."

### 4.3 Assessment A: what a design director actually evaluates

Five axes, in this order:

1. **Design specificity** (the lead question): "Is the composition, interaction, and visual language grounded in this product, or could an unrelated product use it unchanged? **Make this judgment before seeing detector output.**"
2. **Holistic design**: hierarchy, IA, emotional fit, discoverability, composition, typography, color, accessibility, states, copy, edge cases.
3. **Cognitive load**: checklist failures and any decision point with more than 4 visible options.
4. **Emotional journey**: peak-end rule, emotional valleys, reassurance at high-stakes moments.
5. **Nielsen heuristics**: all 10 scored 0 to 4, with `n/a` allowed under the mode-applicability rule.

Returns: design-specificity verdict, heuristic scores, cognitive load, emotional journey, 2 to 3 strengths, 3 to 5 priority issues, persona red flags, minor observations, provocative questions.

### 4.4 Assessment B: deterministic evidence

```bash
node <scripts>/detect.mjs --json [target]
```

- Pass markup files/directories; do not pass CSS-only files.
- For URLs, skip the CLI scan and use browser visualization.
- 500+ scannable files: narrow scope or ask.
- Exit 0 = clean; exit 2 = findings.

Browser overlay flow (5 steps): fresh tab and navigate (prefer the harness's native screenshot path before hand-rolling Playwright/Puppeteer); **preflight mutable injection** by setting `document.title` and appending a `<script>` tag ("read-only evaluate APIs do not count"); if mutation is unavailable, skip everything downstream and report the fallback signal; if available, start `live-server.mjs --background`, label the tab `[Human]`, scroll top, inject `detect.js`, wait 2 to 3 seconds, read `impeccable` console messages, stop the server. Multi-view targets: inject on 3 to 5 representative pages.

Reuse discipline: "After Assessment B returns usable CLI findings, reuse them. Do not rerun `detect.mjs` in the parent unless Assessment B failed, was truncated, or omitted count, rule names, or file locations."

### 4.5 Synthesis, not concatenation

> Synthesize both assessments into a single report. Do NOT simply concatenate. **Weave the findings together, noting where the LLM review and detector agree, where the detector caught issues the LLM missed, and where detector findings are false positives.**

The chat response is the primary deliverable. "do not replace it with a summary and a link."

### 4.6 The scoring axes: Nielsen 0-4, with real bands

| # | Heuristic |
|---|---|
| 1 | Visibility of System Status |
| 2 | Match Between System and Real World |
| 3 | User Control and Freedom |
| 4 | Consistency and Standards |
| 5 | Error Prevention |
| 6 | Recognition Rather Than Recall |
| 7 | Flexibility and Efficiency of Use |
| 8 | Aesthetic and Minimalist Design |
| 9 | Help Users Recognize, Diagnose, and Recover from Errors |
| 10 | Help and Documentation |

**Calibration statement:** "Be honest with scores. A 4 means genuinely excellent. **Most real interfaces score 20-32 out of 40.**"

**Mode applicability + renormalization:** heuristics 7 and 10 may be `n/a` on Persuade and Experience surfaces. Write `n/a` with a one-line reason and renormalize: "The applicable maximum is 4 times the number of heuristics you actually scored: /40 when all ten apply, /32 when two are n/a. **Never print /40 over a partial set.**"

Rating bands:

| Score Range | Rating | What it means |
|---|---|---|
| 36-40 | Excellent | Minor polish only; ship it |
| 28-35 | Good | Address weak areas, solid foundation |
| 20-27 | Acceptable | Significant improvements needed before users are happy |
| 12-19 | Poor | Major UX overhaul required; core experience broken |
| 0-11 | Critical | Redesign needed; unusable in current state |

When renormalized, read the band off the percentage: 90%+ Excellent, 70%+ Good, 50%+ Acceptable, 30%+ Poor, below Critical. "24/32 is 75%, so Good."

**Per-heuristic 0-4 language** (this is the taste vocabulary worth stealing; note that every rubric is written as a description of user experience, never as a feature checkbox):

- *Visibility of System Status*: 0 "No feedback; user is guessing what happened" / 2 "Partial; some states communicated, major gaps remain" / 4 "Excellent; every action confirms, progress is always visible"
- *Match System / Real World*: 0 "Pure tech jargon, alien to users" / 2 "Mixed; some plain language, some jargon leaks through" / 4 "Speaks the user's language fluently throughout"
- *User Control and Freedom*: 0 "Users get trapped; no way out without refreshing" / 1 "Difficult exits; must find obscure paths to escape" / 4 "Full control; undo, cancel, back, and escape everywhere"
- *Consistency and Standards*: 0 "Inconsistent everywhere; feels like different products stitched together" / 2 "Partially consistent; main flows match, details diverge" / 4 "Fully consistent; cohesive system, predictable behavior"
- *Error Prevention*: 0 "Errors easy to make; no guardrails anywhere" / 4 "Excellent; errors nearly impossible through smart constraints"
- *Recognition Rather Than Recall*: 0 "Heavy memorization; users must remember paths and commands" / 4 "Everything discoverable; users never need to memorize"
- *Flexibility and Efficiency*: 0 "One rigid path; no shortcuts or alternatives" / 4 "Highly flexible; multiple paths, power features, customizable"
- *Aesthetic and Minimalist Design*: 0 "Overwhelming; everything competes for attention equally" / 2 "Some clutter; main content clear, periphery noisy" / 4 "Perfectly minimal; **every element earns its pixel**"
- *Error Recovery*: 0 "Cryptic errors; codes, jargon, or no message at all" / 1 "Vague errors; 'Something went wrong' with no guidance" / 2 "Clear but unhelpful; names the problem but not the fix" / 4 "Perfect recovery; pinpoints issue, suggests fix, **preserves user work**"
- *Help and Documentation*: 0 "No help available anywhere" / 2 "Basic help; FAQ or docs exist, not contextual" / 4 "Excellent contextual help; right info at the right moment"

Sample check-fors that make the rubric operable: "Email is missing @" not "Invalid input"; "Labels on icons (not icon-only navigation)"; "Errors displayed near the source of the problem"; "Non-blocking error handling (don't wipe the form)"; "task-focused organization (not feature-organized)".

### 4.7 Issue severity P0-P3

| Priority | Name | Description | Action |
|---|---|---|---|
| **P0** | Blocking | Prevents task completion entirely | Fix immediately; showstopper |
| **P1** | Major | Causes significant difficulty or confusion | Fix before release |
| **P2** | Minor | Annoyance, but workaround exists | Fix in next pass |
| **P3** | Polish | Nice-to-fix, no real user impact | Fix if time permits |

The tiebreaker heuristic is excellent: **"Would a user contact support about this?" If yes, it's at least P1.**

### 4.8 Cognitive load model

Three types, with different verdicts on each:

- **Intrinsic load** (the task itself): "You can't eliminate this, but you can structure it." Manage with discrete steps, scaffolding (templates, defaults, examples), progressive disclosure, grouped decisions.
- **Extraneous load** (bad design): "**Eliminate this ruthlessly.** It's pure waste." Sources: confusing navigation requiring mental mapping, unclear labels forcing guessing, visual clutter, inconsistent patterns that prevent learning, unnecessary steps between intent and result.
- **Germane load** (learning effort): "This is *good* cognitive load; it leads to mastery." Support with progressive disclosure, consistent patterns that reward learning, confirming feedback, onboarding that teaches through action rather than walls of text.

**8-item checklist**, scored by counting failures:

- [ ] Single focus: primary task completable without distraction from competing elements
- [ ] Chunking: information in digestible groups (<= 4 items per group)
- [ ] Grouping: related items visually grouped (proximity, borders, shared background)
- [ ] Visual hierarchy: immediately clear what's most important
- [ ] One thing at a time: single decision before the next
- [ ] Minimal choices: <= 4 visible options at any decision point
- [ ] Working memory: no need to remember info from a previous screen
- [ ] Progressive disclosure: complexity revealed only when needed

**Scoring: 0-1 failures = low (good). 2-3 = moderate (address soon). 4+ = high (critical fix needed).**

**The Working Memory Rule:** "Humans can hold <= 4 items in working memory at once (Miller's Law revised by Cowan, 2001)."

- <= 4 items: within limits
- 5-7 items: pushing the boundary; consider grouping or progressive disclosure
- 8+ items: overloaded; "users will skip, misclick, or abandon"

Applied per surface type:

- Action buttons: 1 primary, 1 to 2 secondary, group the rest in a menu
- Navigation menus: <= 5 top-level items
- Long-form articles: one reading path; gather related links into a single block at the end instead of scattering them mid-flow
- Documentation sidebars: <= 4 sibling choices visible per level before grouping kicks in
- Portfolio and gallery indexes: one decision per screen (which piece to open), not filter, sort, and tag controls all at once

**The 8 named cognitive-load violations** (naming the failure mode is what makes it findable):

1. **The Wall of Options**: 10+ choices at once with no hierarchy. Fix: group into categories, highlight recommended, progressive disclosure.
2. **The Memory Bridge**: must remember info from step 1 to complete step 3. Fix: keep context visible, or repeat it where needed.
3. **The Hidden Navigation**: must build a mental map. Fix: always show current location (breadcrumbs, active states, progress).
4. **The Jargon Barrier**: technical language forces translation effort. Fix: plain language; define unavoidable terms inline.
5. **The Visual Noise Floor**: every element has the same visual weight; nothing stands out. Fix: one primary element, 2 to 3 secondary, everything else muted.
6. **The Inconsistent Pattern**: similar actions work differently in different places. Fix: same type of action = same type of UI.
7. **The Multi-Task Demand**: requires reading + deciding + navigating simultaneously. Fix: sequence the steps.
8. **The Context Switch**: must jump between screens/tabs/modals to gather info for one decision. Fix: co-locate the information needed per decision.

### 4.9 Persona-based testing: five archetypes

> Test the interface through the eyes of 5 distinct user archetypes. Each persona exposes different failure modes that a single "design director" perspective would miss.

Select 2 to 3, walk the primary user action as each, "Report specific red flags, not generic concerns." And the output rule: **"Be specific. Name the exact elements and interactions that fail each persona. Don't write generic persona descriptions; write what broke for them."**

**1. Impatient Power User: "Alex"** (expert with similar products; expects efficiency, hates hand-holding)
Behaviors: skips all onboarding, looks for keyboard shortcuts immediately, tries to bulk-select and batch-edit, frustrated by required steps that feel unnecessary, abandons if anything feels slow or patronizing.
Tests: core task in under 60 seconds? keyboard shortcuts? onboarding skippable? Esc dismisses modals? power-user path?
Red flags: forced tutorials, no keyboard nav for primary actions, slow unskippable animations, one-item-at-a-time workflows where batch is natural, redundant confirmation for low-risk actions.

**2. Confused First-Timer: "Jordan"** (never used this type of product; will abandon rather than figure it out)
Behaviors: reads all instructions, hesitates before unfamiliar clicks, hunts for help, misunderstands jargon, takes the most literal interpretation of any label.
Tests: first action obviously clear within **5 seconds**? all icons labeled? contextual help at decision points? terminology assumes prior knowledge? back/undo at every step?
Red flags: icon-only nav with no labels, technical jargon without explanation, no visible help, ambiguous next steps, no confirmation that an action succeeded.

**3. Accessibility-Dependent User: "Sam"** (screen reader, keyboard-only; may have low vision, motor impairment, or cognitive differences)
Behaviors: tabs linearly, relies on ARIA labels and heading structure, cannot see hover states, needs 4.5:1 contrast, may zoom to 200%.
Tests: entire primary flow keyboard-only? all interactive elements focusable with visible focus? meaningful alt text? WCAG AA contrast? screen reader announces state changes?
Red flags: click-only interactions, missing/invisible focus indicators, **meaning conveyed by color alone**, unlabeled fields or buttons, time-limited actions without extension, custom components that break screen reader flow.

**4. Deliberate Stress Tester: "Riley"** (pushes past the happy path)
Behaviors: tests empty states, long strings, special characters; submits emoji and RTL text; navigates backwards, refreshes mid-flow, opens multiple tabs; looks for gaps between what the UI promises and what happens.
Tests: what happens at 0 items, 1000 items, very long text? do error states recover or leave the UI broken? refresh mid-workflow, is state preserved? features that appear to work but produce broken results? paste from Excel?
Red flags: **features that appear to work but silently fail or produce wrong results**, error handling that exposes technical details, empty states that show nothing useful ("No results" with no guidance), workflows that lose data on refresh, inconsistent behavior between similar interactions.

**5. Distracted Mobile User: "Casey"** (one-handed on the go, frequently interrupted, possibly slow connection)
Behaviors: thumb only, prefers bottom-of-screen actions; interrupted mid-flow and returns later; app-switches; low patience; types as little as possible.
Tests: primary actions in the thumb zone (bottom half)? state preserved on leave/return? works on 3G? autocomplete and smart defaults? touch targets at least **44x44pt**?
Red flags: important actions at the top of the screen, no state persistence, large text inputs where selection would work, heavy assets with no lazy loading, tiny or crowded tap targets.

**Persona selection table:**

| Interface Type | Primary Personas | Why |
|---|---|---|
| Landing page / marketing | Jordan, Riley, Casey | First impressions, trust, mobile |
| Dashboard / admin | Alex, Sam | Power users, accessibility |
| E-commerce / checkout | Casey, Riley, Jordan | Mobile, edge cases, clarity |
| Onboarding flow | Jordan, Casey | Confusion, interruption |
| Data-heavy / analytics | Alex, Sam | Efficiency, keyboard nav |
| Form-heavy / wizard | Jordan, Sam, Casey | Clarity, accessibility, mobile |

**Project-specific personas**: derive 1 to 2 more from the `## Design Context` section if it exists, using a fixed template (Profile / Behaviors / Red Flags). "Only generate project-specific personas when real Design Context data is available. **Don't invent audience details.**"

Example output format given in the file, showing the expected specificity:

> **Alex (Power User)**: No keyboard shortcuts detected. Form requires 8 clicks for primary action. Forced modal onboarding. High abandonment risk.
>
> **Jordan (First-Timer)**: Icon-only nav in sidebar. Technical jargon in error messages ("404 Not Found"). No visible help. Will abandon at step 2.

### 4.10 Report structure and the language rules

Sections in order: Report header provenance, Design Health Score (heuristic table), **Design Specificity Verdict ("Start here")**, Overall Impression, What's Working (2 to 3, "be specific about why they work"), Priority Issues (3 to 5, each tagged P0-P3 with What / Why it matters / Fix / Suggested command), Persona Red Flags, Minor Observations, Questions to Consider.

Design Specificity Verdict has three sub-parts: **LLM assessment** (unanchored: overall coherence, structural sameness, category-interchangeable choices, missed opportunities for product character), **Deterministic scan** (counts, file locations, what the detector caught that you missed, false positives), **Visual overlays** (only if injection succeeded).

The critique voice rules, verbatim:

> - Be direct. Vague feedback wastes everyone's time.
> - Be specific. "The submit button," not "some elements."
> - Say what's wrong AND why it matters to users.
> - Give concrete suggestions. **Cut "consider exploring..." entirely.**
> - Prioritize ruthlessly. **If everything is important, nothing is.**
> - Don't soften criticism. Developers need honest feedback to ship great design.

"Questions to Consider" are modeled as provocations, not clarifications:

> - "What if the primary action were more prominent?"
> - "Does this need to feel this complex?"
> - **"What would a confident version of this look like?"**

### 4.11 Persistence and trend (the memory loop)

Write the body to a temp file, pass metadata as JSON in an env var, run the storage helper, delete the temp file whether or not the write succeeded, then read the trend:

```bash
IMPECCABLE_CRITIQUE_META='{"target":"...","total_score":N,"max_score":N,"na_heuristics":"7,10","p0_count":N,"p1_count":N}' \
  node <scripts>/critique-storage.mjs write "<resolved target>" <body-file>

node <scripts>/critique-storage.mjs trend "<resolved target>" 5
```

Emitted as one human line:

> **Trend for `<slug>` (last 5 runs): 24 → 28 → 32 → 29 → 32 (out of 40)**

When entries disagree on max: print each score with its own denominator (`24/32 → 30/40`) and note that the runs scored different heuristic sets, "so the line is not a like-for-like comparison." Missing `max_score` on an older entry is treated as 40. First run: "First run for this target, no trend yet."

"This is fire-and-forget. Do not show the user the helper's JSON output... Failures here should not block the rest of the flow."

### 4.12 The question round (findings-conditioned, never generic)

Four question slots, each required to reference a specific finding:

1. **Priority direction**: "I found problems with visual hierarchy, color usage, and information overload. Which area should we tackle first?" Offer the top 2 to 3 issue categories.
2. **Design intent**: if the critique found a tonal mismatch, ask if it was intentional: "The interface feels clinical and corporate. Is that the intended tone, or should it feel warmer/bolder/more playful?"
3. **Scope**: "I found N issues. Want to address everything, or focus on the top 3?" Options: Top 3 only / All issues / Critical only.
4. **Constraints** (optional): "Should any sections stay as-is?"

Rules: "Every question must reference specific findings from the report. **Never ask generic 'who is your audience?' questions.** Keep it to 2-4 questions maximum... Offer concrete options, not open-ended prompts. If findings are straightforward (e.g., only 1-2 clear issues), skip questions."

### 4.13 The handoff (critique feeds the command graph)

Recommended Actions maps every Priority Issue to a command, ordered by the user's stated priorities first, then impact. "Each item's description should carry enough context that the command knows what to focus on... Skip commands that would address zero issues... End with `polish` as the final step if any fixes were recommended." Closes with: "Re-run `impeccable critique` after fixes to see your score improve."

---

## 5. Concept and world-building: how they reach a non-generic direction

### 5.1 Decide what is already true (before inventing anything)

Four states, each with a different verdict:

- **Redesign**: preserve product truth, content, function, constraints, explicit brand commitments; **replace** the old visual world rather than polishing it. "The old look is evidence of what the subject is, not authority over what it becomes."
- **Established world**: inherit it. "A missing DESIGN.md does not erase a coherent identity already present in code; document that identity instead of inventing a replacement."
- **Incomplete brand**: preserve confirmed assets and recognizable traits, then expand the system for this new surface.
- **No visual authority**: create a new world with the user.

And the scope guard: "A section, component, feature, or state inside an established surface inherits that surface. **Do not turn a local addition into a new identity exercise.**"

### 5.2 The ask round

One round of two or three related questions through a structured question tool. Skip settled facts. Per mode, the questions differ (see the Modes table). Across all modes, three universal questions:

- what success looks like
- what must remain untouched
- **what would make a polished result feel wrong**

Hard constraint: **"Do not ask for CSS values or canned aesthetic lanes."**

`shape.md` adds the interview cadence rules:

- Two or three questions per round, then wait. One round default; a second only when answers expose a material gap.
- "Do not dump a questionnaire, repeat settled facts, or turn obvious facts into menus. **Assert the likely reading and invite correction.**"
- "A sparse prompt requires at least one answer round. A precise prompt may need only a compact confirmation."
- Round 1 (purpose, people, outcome): what is this for and what problem must it solve; who reaches it, in what situation and state of mind; what must they understand or do and what does success look like; **"What is uniquely true here that a neighboring product or generic template could not claim?"**
- Round 2 (material, behavior, boundaries): real content/evidence/data/assets with realistic min/typical/max ranges; which states and transitions matter (first-run, empty, loading, error, success, permissions, overflow, expert use); intended fidelity/breadth/interactivity; what must remain untouched and what would make the result feel wrong even if polished; binding platform/framework/perf/a11y/l10n constraints.

### 5.3 Three tiers of invention

- **Extend an existing surface**: inherit world and composition. Resolve only new purpose, content, hierarchy, states, interaction, and how the addition joins. "Do not run a concept tournament or change DESIGN.md."
- **Whole surface inside an established world**: keep the visual system fixed; derive **five to seven materially different structures** from content, task, and user behavior, ordered by resonance; then run `concept-seed.mjs --scope surface --mode <mode>`.
- **Create or replace the visual world**: the full procedure below.

### 5.4 The anti-default mechanics (the actual innovation)

**Mechanic 1: externalized dice.** The reason the seed script exists, stated plainly:

> The script assigns which structure gets built: **your top-ranked structure is what every run would ship, and a single ranking is deterministic, so the dice come from outside.**

A model's own ranking is a deterministic function of its priors. Ranking harder does not defeat the prior. Only an external assignment does.

**Mechanic 2: name the rut and exclude it.**

> Note the page this category always ships and its predictable opposite; name both as the rut and keep them out of the seven-candidate list, **so no die face is spent on the page the category already ships.**

Extended to literal readings: "A brief that paints its own picture, a product name, a titled artifact, a governing metaphor, adds its literal reading to the rut: spend at most one candidate on it and derive the rest from elsewhere in the audience's world."

**Mechanic 3: source material from the audience's world, not the subject's obvious artifact.**

> From that cultural world, list seven concrete visual systems, artifacts, places, or rituals the audience knows by heart, each with one line on why it resonates and can carry the mechanism, ordered by resonance.

Crucially, the definition of "concrete" is expanded past physical objects:

> The audience's world includes its graphic and screen traditions, the notation, publications, identity programs, data graphics, and interfaces it reads daily, not only its physical objects; a nameable abstract system (a school of poster, a documentation standard, a data-graphic tradition) is as concrete a candidate as any artifact.

Two generative prompts: **"What would this thing look like as a physical object; what did its world look like before the web?"**

And a diversity gate with a number: **"When more than three of the seven share one material family, the derivation stopped at the subject's most obvious artifact... dig until the list spans at least three families."**

**Mechanic 4: fused challengers judged on exactly two axes.**

> Fuse each challenger before judging it: **the challenger supplies the form and its system grammar, the product supplies every fact, and clarity wins conflicts.** Weigh fused challengers against the assigned direction on exactly two axes, **audience identification and product clarity**; losing to strong grounded material is a valid outcome, and beating a thin or tool-monoculture list is the point. (`rule:skill-concept-procedure`)

**Mechanic 5: never present a ranked menu of your own candidates.**

> Present **one direction, fully committed**: its world, first viewport, visitor path, signature interaction, cross-surface reach, and honest risk. Alongside it, offer the one or two fused challengers that survived the weighing as named alternates with a one-line case each, plus re-roll with an optional one-line steer. **What you never present is a ranked menu of your own grounded candidates; a lineup of those invites the safest card, while dealt challengers carry no such rut.**

**Mechanic 6: the standing exit (the safe option exists, but only the user may pick it).**

> every direction round offers one quiet, permanent alternative, the category standard, played straight. **It is the user's door, never yours: never recommend it, never weigh it against the roll, never let it soften the dealt directions.** When the user takes it... convention becomes the commitment: ask once for two or three products this should sit alongside, make their craft level the bar, and execute the canon at full fidelity, **without irony or smuggled quirk.** (`rule:skill-canon-standing-exit`)

**Mechanic 7: asymmetric re-roll rights.**

> Re-roll eliminates every direction already shown, grounded and challenger alike; after two consecutive re-rolls, ask what quality is missing. **You may re-roll on your own only on named factual grounds, when the assigned direction cannot carry the product's truth or task; taste is never grounds.** The user may re-roll freely, and a user- or brief-pinned direction beats the roll, always. (`rule:skill-assigned-plus-reroll`)

**Mechanic 8: catalog worlds are working systems, not moodboards.**

> Catalog worlds are working systems, not mood references. When one survives, carry its **palette and material, type and composition, topology, controls and state, and responsive rules** into the product. When the source is itself an interface language, commit to its native grammar across navigation, content, controls, and states.

Quality bar images set finish, not composition: "They set the craft level the build must reach, a rendered reference's finish, commitment, and art direction, **never the composition**; your surface serves this product."

**Mechanic 9: pre-roll viability gate.**

> Every direction the roll can land on must already be viable: every relationship and claim it visualizes true, a real palette and component family, a distinctive composition with one product-specific experience, workable at full-surface scale within the available assets, tools, and performance budget. **A candidate that fails on truth is replaced before the roll, never rescued by it.**

**Mechanic 10: truth binds claims, not demonstrations.**

> Truth binds claims, not demonstrations: in greenfield work, author whatever illustrative material the concept needs at full fidelity, label it synthetic wherever a visitor could mistake it for the real thing, and hand the user the list of what to replace with real material. What stays uninventable are commercial and factual claims: prices, customers, benchmarks, endpoints, capabilities the product does not have. **Refusing a bold direction because its demonstration data does not exist yet is the timidity reflex wearing honesty's clothes.** (`rule:skill-truth-binds-claims`)

### 5.5 The calibration block (a named list of saturated AI looks)

> AI-generated interfaces cluster around a few looks regardless of subject:
> 1. warm cream ground, high-contrast serif display, and a terracotta or signal-red accent;
> 2. near-black with one neon accent and glowing edges;
> 3. broadsheet-editorial hairlines, italic display serif, and small tracked mono labels.
>
> All are legitimate when the brief calls for them; the brief always wins. Where the brief leaves the aesthetic free, landing in one of them means the self-check failed: **if someone could guess your aesthetic from the category alone, or from category-plus-avoidance, rework until neither answer is obvious.** (`rule:skill-calibration-saturated-looks`)

"Category-plus-avoidance" is the subtle part: predictable contrarianism is also a prior.

Three companion corrections:

- **Energy is not the enemy of trust**: "a brief's negative constraints (no gamification, no hype) rule out those devices, not exuberance, and adjectives describing the product's behavior (quiet support, calm coaching) do not dictate the surface's energy." (`rule:skill-constraints-rule-out-devices-not-energy`)
- **A soft subject is not a license for a soft default**: "book cloth, thread, jackets, endpapers, and shelf ephemera span the whole saturated spectrum, and cream paper is the smallest corner of that world; landing on cream plus serif for a book subject is **the default wearing the subject's clothes**." (`rule:skill-book-subject-not-cream-license`)
- **A pinned world pins the world, not its softest rendition**: "the pinned world's full material range stays in play, and a rendition that matches what any model ships for that world failed the self-check at execution rather than selection." (`rule:skill-pinned-world-not-default-rendition`)

### 5.6 The commitment artifact: a 5-block contract written before code

> Before code, state the chosen direction as a contract in the artifact's opening comment, five short blocks, **150 words at most**, in a form that survives the production build: an HTML comment in the emitted markup, never only a templating-frontmatter comment the compiler strips. (`rule:skill-decide-then-build`)

| Block | Content |
|---|---|
| **THESIS** | the one idea this surface owns **and the category-default arrangement it refuses** |
| **OWN-WORLD** | the palette and component language, "specific enough to be recognizable with all content removed" |
| **STORY** | what the visitor understands, believes, and does |
| **FIRST VIEWPORT** | the exact composition, what is where and at what scale, and where the primary action sits |
| **FORM** | the chosen form, its position on your ordered list, the staging chosen for it, and the seed key the script printed |

The falsifiability test: **"If a block reads like a mood, the direction is not decided yet; the finishing review audits the render against this contract."**

### 5.7 DESIGN.md is written from the build, not before it

> On a new or replacement world, DESIGN.md is written at finish, from the built world, by the shipped documenter... **a rulebook written before the build gets defended against reality instead of describing it, and it hands the design-system detector an unstable target that buries the build in noise.** A new world shipped with no DESIGN.md is still an incomplete run. (`rule:skill-design-md-from-the-build`)

### 5.8 Visualize before build

> Whenever any image generation is available... the locked direction is visualized before it is built, never skipped: three compositional options rendered and put before the user for approval. **This step is proven to produce the most compositional and ambitious work.** (`rule:skill-visualize-before-build`)

### 5.9 Build with full commitment

> Build the assigned direction, not a safer interpretation of it. The form supplies structure, reading order, component conventions, and native motion; the product supplies every fact. **Commit every atom: nav, buttons, inputs, and links are rebuilt in the form's vocabulary, and a stock component inside a committed form is a lapse.** Land the first build fully committed; committing is the hard part, and the passes that follow exist to make the committed thing clear and effective, never to dilute it. **In unattended work, the safe rendition is the known risk.** (`rule:skill-commit-every-atom`)

The seven build laws:

1. **The first viewport is a thesis, not a header.** "Demonstrate the mechanism immediately, at the scale the form has in life; do not trap the concept inside a standard hero or card shell. **The memory test: if someone left after one viewport, what would they describe an hour later? If the honest answer is a mood, the concept has not committed yet.**"
2. **Prove, don't claim.** "Show the subject doing its job: the interface at work, the mechanism dramatized, specifics a competitor could not copy-paste. **Sections that restate a claim in different words add length, not substance.**"
3. **Author the assets; never substitute chrome.** "content is authorable, claims are labelable, no section is omittable... a viewport that wants atmosphere gets a full-bleed layered scene, and **a library of small centered subjects standardized for tidiness forecloses that before a line of code exists. Gradients, glass, and generic icon tiles where an authored asset belongs are the gap wearing chrome**; icons drawn in the world's own grammar are the remedy." (`rule:skill-author-assets-not-chrome`)
4. **Build the form's web leverage.** "When the chosen world names a technique (canvas, WebGL, view transitions, generative motion), **build the technique itself, not a static imitation of it**; the graceful fallback serves constrained clients, it is not the default experience."
5. **Pace the scroll like a studio.** "Vary density, scale, image, motion, and quiet inside one grammar; **a dense passage earns a quiet one**, and the page ends anchored by a real close. One spacing rhythm throughout, with more space above a heading than below it."
6. **Use real, verified imagery when the brief implies it.** "Search for the subject's physical object rather than the category; **one decisive photo beats five mediocre ones.** Verify stock URLs resolve."
7. **Author motion as material.** "The form has native motion, what it does in life between states; give the page that motion **once, orchestrated**, rather than scattered hover effects."

Plus the Persuade-specific conversion law: "Conversion lives inside the form's own vocabulary: a hook that lands in one line, a visible primary action, a legible reading order. **A committed form that hides the offer or the action has not finished translating.**" (`rule:skill-persuade-conversion-in-form`)

### 5.10 Finish: the review must not run in the build thread

> Capture desktop and mobile screenshots to files, then spawn the shipped finish reviewer... with the original request, confirmed answers, the artifact path, the screenshot paths, its direction contract, existing hook findings, and the QUALITY BAR card and approved comp paths. **The reviewer has no browser; screenshots you fail to pass are checks it cannot run.** Verify its return carries the five contract sections; on an empty or thrashed return, respawn once. **This review never runs inside the build thread.** ... Apply the material fixes, **promise by promise against the contract.** Do not run a second detector. (`rule:skill-finish-separate-reviewer`)

And the definition of done: **"A clean detector pass is not finished; finished is the contract kept, the comp honored, the review closed, and the system recorded."** (`rule:skill-documenter-records-the-world`)

### 5.11 `overdrive.md`: pushing past conventional limits

Opens with a literal banner the model must print:

```
──────────── ⚡ OVERDRIVE ─────────────
》》》 Entering overdrive mode...
```

The context law: **"A particle system on a creative portfolio is impressive. The same particle system on a settings page is embarrassing. But a settings page with instant optimistic saves and animated state transitions? That's extraordinary too."**

Mandatory propose-before-build: "This command has the highest potential to misfire. Do NOT jump straight into implementation." Think through 2 to 3 directions with described look and feel, present them with trade-offs (browser support, performance cost, complexity), get a pick. "Skipping this step risks building something embarrassing that needs to be thrown away."

Mandatory visual iteration: "Technically ambitious effects almost never work on the first try... **The gap between 'technically works' and 'looks extraordinary' is closed through visual iteration, not code alone.**"

The framing question: **"what would make a user of THIS specific interface say 'wow, that's nice'?"** Answered per surface type:

- **Visual/marketing**: sensory. Scroll-driven reveal, shader background, cinematic page transition, generative art responding to the cursor.
- **Functional UI**: how it FEELS. A dialog that morphs from its trigger button via View Transitions; a data table rendering 100k rows at 60fps via virtual scrolling; a form with streaming validation; drag-and-drop with spring physics.
- **Performance-critical**: "the 'wow' is invisible but felt: a search that filters 50k items without a flicker, a complex form that never blocks the main thread... **The interface just never hesitates.**"
- **Data-heavy**: fluidity. GPU rendering via Canvas/WebGL, animated transitions between data states, force-directed graphs that settle naturally.

The toolkit is organized **by intent, not by technology name**:

| Goal | Techniques |
|---|---|
| Make transitions feel cinematic | View Transitions API (same-doc: all browsers; cross-doc: no Firefox); `@starting-style`; spring physics (mass/tension/damping) via motion, GSAP, or a hand-rolled solver |
| Tie animation to scroll | `animation-timeline: scroll()` CSS-only (Chrome/Edge/Safari; Firefox flag-only; always ship a static fallback) |
| Render beyond CSS | WebGL (Three.js, OGL, regl); WebGPU (Chrome/Edge, Safari partial, always fall back to WebGL2); Canvas 2D / OffscreenCanvas; SVG filter chains (displacement maps, turbulence, morphology, CSS-animatable) |
| Make data feel alive | Virtual scrolling (TanStack Virtual for complex cases); GPU-accelerated charts (deck.gl, regl); animated data transitions (morph, don't replace) |
| Animate complex properties | `@property` (register typed custom props to interpolate gradients and complex values); Web Animations API |
| Push performance | Web Workers; OffscreenCanvas; WASM |
| Interact with the device | Web Audio API (requires user gesture); device APIs, sparingly, with permission |

Discipline:

- Progressive enhancement is non-negotiable, with the exact `@supports` / feature-detect pattern shown.
- **Target 60fps. If dropping below 50, simplify.**
- Lazy-initialize heavy resources (WebGL contexts, WASM modules) only when near viewport. Pause off-screen rendering. Test on real mid-range devices.
- "The gap between 'cool' and 'extraordinary' is in the last 20% of refinement... **Don't ship the first version that works; ship the version that feels inevitable.**"

NEVER list: ship jank on mid-range devices; use bleeding-edge APIs without a functional fallback; add sound without explicit opt-in; **"use technical ambition to mask weak design fundamentals; fix those first with other commands"**; **"layer multiple competing extraordinary moments. Focus creates impact, excess creates noise."**

Four verification tests:

- **The wow test**: show it to someone who hasn't seen it. Do they react?
- **The removal test**: take it away. Does the experience feel diminished, or does nobody notice?
- **The device test**: phone, tablet, Chromebook. Still smooth?
- **The context test**: does this make sense for THIS brand and audience?

Closing line worth stealing: **"'Technically extraordinary' isn't about using the newest API. It's about making an interface do something users didn't think a website could do."**

### 5.12 `delight.md`: personality without whimsy

> Delight is not a layer of generic whimsy; it is **product character revealed through a useful interaction, a humane response, or an unexpectedly considered detail.**

Six opportunity types to scan for: effort worth acknowledging; waiting that can become informative; an empty or first-use state that can orient; an error or recovery moment that needs empathy; an interaction whose physical or verbal response could express the brand; a useful capability people might enjoy discovering. "**Do not manufacture a celebration for an ordinary click.**"

Then: **"State in one sentence what the user should feel and why that feeling belongs to this product"**, and choose the smallest system that can deliver it. "Derive the treatment from product mechanism and visual world, not a stock catalog."

Per emotional moment:

- **Success**: match the response to the effort and consequence. "Major milestones can expand; routine saves should simply feel certain."
- **Waiting**: truthful progress, useful context, or product-specific activity. "**Never fake work or delay completion to stage a flourish.**"
- **Empty and first use**: make the next action clear before adding personality.
- **Error and recovery**: lead with the problem and recovery. "jokes must not trivialize loss, money, privacy, or blocked work."
- **Repeated interaction**: "keep the response satisfying after the hundredth use."
- **Discovery**: reward curiosity without hiding required functionality.

"Copy must use the product's language. **Generic whimsy is worse than neutral clarity.**"

Verification: "**The moment is specific enough that a neighboring product could not use it unchanged.**" And: "The interface remains fast and obvious without the flourish." And: "Repetition does not turn charm into friction."

### 5.13 `bolder.md`: amplification, not escalation

> The reflex answer, reaching for more effects, is the opposite of bold; reject it first.

The diagnosis, which is the genuinely original idea here:

> A section usually reads flat for reasons its neighbors have already solved. Look at what the rest of the page does that this section does not: the display type at full strength, the structural devices that carry meaning, the signature motif, the density and pacing. **A flat section is typically one that quietly opts out of the system's own strongest moves.** The most reliable bolder pass brings the target up to the expressive level its neighbors already reach, in the system's own vocabulary rather than a new one.

- "Amplify what the system already owns... **The bolder version should look more like the same brand, not less.**"
- "**Commit, then clarify.** Half-measures read as noise. Make the one decisive move completely, then quiet everything around it so the move is legible. **If every element got louder, the section got flatter.**"
- "Give it its own rhythm. The target should read as a peak in the scroll, a shift in density or pace."

**The skeleton test:**

> Strip the copy out of your planned section and study the bare structure. **Does the skeleton still say what this section is and why it matters, through hierarchy and the system's devices alone? If it only works once the words return, the boldness is in the text size, not the design.** A placeholder for an image or artifact names a job, an anchor and a piece of evidence, not a cue to drop in a decorative photo.

### 5.14 `distill.md` and `quieter.md`: the subtraction commands

`distill.md` framing: **"Simplicity is not about removing features. It's about removing obstacles between users and their goals."** And: "Simplification is hard. It requires saying no to good ideas to make room for great execution. Be ruthless."

Find the essence: what's the primary user goal (**there should be ONE**); what's necessary vs nice-to-have; what can be removed, hidden, or combined; what's the 20% that delivers 80%.

Concrete numbers from the visual-simplification section:

- Reduce color palette to **1 to 2 colors plus neutrals, not 5 to 7**
- Limit typography: **one font family, 3 to 4 sizes maximum, 2 to 3 weights**
- "Flatten structure: reduce nesting, remove unnecessary containers; **never nest cards inside cards**"
- "**Cards aren't needed for basic layout**; use spacing and alignment instead"
- Content: "Cut every sentence in half, then do it again." Active voice ("Save changes" not "Changes will be saved"). "No headers restating intros, no repeated explanations, say it once."
- Code: "Does that component need 12 variations, or can 3 cover 90% of cases?"

NEVER: remove necessary functionality; sacrifice a11y; "make things so simple they're unclear (**mystery ≠ minimalism**)"; eliminate hierarchy completely; "oversimplify complex domains (match complexity to actual task complexity)."

`quieter.md` framing: **"Quiet design is harder than bold design. Subtlety needs precision."** And: "'Quieter' doesn't mean boring or generic. It means refined and easier on the eyes. **Think luxury, not laziness.**" And: "**Quiet without intent collapses to generic.**"

Numbers: shift to **70 to 85% saturation**; neutrals dominate with color as accent (**10% rule**); reduce font weights (**900 → 600, 700 → 500**); animation distances **10 to 20px instead of 40px**; ease-out-quart, never bounce or elastic; tinted grays instead of pure gray; "**Never gray on color**: use a darker shade of that color or transparency."

NEVER: everything the same size/weight; remove all color (**quiet ≠ grayscale**); eliminate all personality; sacrifice usability; "make everything small and light (some anchors needed)."

---

## 6. Per-axis technique: the concrete numbers

### Typography

| Rule | Value | Source |
|---|---|---|
| Body measure (craft floor) | **65 to 75ch** | craft-floor.md |
| Body measure (typeset assessment) | comfortable **45 to 75 character** measure | typeset.md |
| Line-length failure threshold | wider than **~80 characters** | detector `line-length` |
| Web body size floor | **1rem / 16px** unless a dense role, platform convention, or user setting justifies otherwise | typeset.md |
| Tiny body text (fail) | below **12px**; use >= 14px, 16px ideal | detector `tiny-text` |
| Functional UI text floor | **11px** for anything interactive or content-bearing; **10px** softer floor for non-interactive legal smallprint only | detector `undersized-ui-text` |
| Line height (fail) | below **1.3x** font size; use **1.5 to 1.7** for body | detector `tight-leading` |
| Type scale step ratio (brand) | at least **1.25** between steps | detector `flat-type-hierarchy` |
| Type scale step ratio (Operate) | **1.125 to 1.2** | operate.md |
| Display size ceiling | **max 6rem** | craft-floor.md |
| Tracking floor | **-0.04em**, with "-0.02 to -0.03em usually reads better" | craft-floor.md |
| Crushed tracking (fail) | tighter than **~-0.05em** | detector `extreme-negative-tracking` |
| Wide tracking on body (fail) | above **0.05em**; reserve wide tracking for short uppercase labels | detector `wide-tracking` |
| Distill target | one family, **3 to 4 sizes max, 2 to 3 weights** | distill.md |

Rules without numbers, worth quoting:

- "**Tune line height inversely with measure**: wider lines generally need more leading."
- "**Compensate light text on dark surfaces on all three perceptual axes**: slightly more line height, a touch more tracking, and one step more weight when the face needs it."
- "Tune line height to the face, width, language, and contrast, **not a universal ratio**."
- "Use paragraph spacing **or** first-line indentation as the primary paragraph rhythm; **combining both usually double-marks the boundary**."
- "Combine size, weight, space, and tone deliberately instead of **asking size alone to do all the work**."
- "Role names and tokens should describe purpose rather than values."
- "Do not... introduce a second family without a clear role it alone can perform."
- Stress-test list: long headings, localization expansion, zoom, narrow containers, missing weights, font fallback.
- Verification bar: "**Primary, secondary, body, and metadata roles are recognizable without reading the copy.**"

**The reflex-face denylist** (`rule:skill-typo-reflex-faces`), which is a stronger idea than the detector's version:

> Operate and Read surfaces are well served by system stacks and workhorse UI faces; Persuade and Experience surfaces want faces with a point of view, and these training-data defaults mean you stopped looking: **Fraunces, Playfair Display, Cormorant, Lora, Crimson, Newsreader, Syne, Space Grotesk, Space Mono, IBM Plex, Inter-as-display, DM Sans, DM Serif, Outfit, Plus Jakarta Sans, Instrument Sans.** Naming one of these faces anyway requires a reason no other face could satisfy, and **a subject association is never that reason: books wanting a serif, bookshops wanting hand-lettering, and tech wanting a mono are the associations the list exists to break.**

Detector's shorter list (`overused-font`): Inter, Roboto, Fraunces, Geist, Plus Jakarta Sans, Space Grotesk.

Live-mode signature param for typeset:

```json
{"id":"scale","kind":"range","min":0.85,"max":1.3,"step":0.05,"default":1,"label":"Scale"}
```

### Color

**Pick a strategy before picking colors** (`rule:skill-color-strategy`), four named strategies:

| Strategy | Definition |
|---|---|
| **Restrained** | neutrals plus one accent; the default when the visitor came to operate or read |
| **Committed** | one saturated color carries **30 to 60% of the surface** |
| **Full palette** | 3 to 4 named roles |
| **Drenched** | the surface IS the color |

> Color commits at page scale: **fields that own whole regions, not accents scattered over a neutral ground.** Dark or light is never a default: **write one sentence of physical scene (who uses this, where, under what light) and let it force the answer.**

Contrast table (`colorize.md`):

| Content | WCAG AA minimum |
|---|---|
| body text | **4.5:1** |
| large text | **3:1** |
| controls, icons, focus indicators | **3:1** |

Role vocabulary to build rather than a bag of swatches: canvas and elevated surfaces; primary and secondary text; action, focus, selection; borders and separators; success/warning/error/information; data categories or scales.

Technique rules:

- "For a new web palette, prefer **OKLCH** because lightness and chroma can be adjusted predictably. Choose hue from product meaning and visual direction, **never from a default category association**."
- "When deriving OKLCH ramps, vary lightness and **reduce chroma near white and black. Do not keep high chroma at extreme lightness merely to make the math uniform.**"
- "**Prefer explicit colors over chains of translucent overlays** when alpha would make contrast context-dependent."
- "On colored surfaces, derive secondary text from the foreground or surface hue rather than using washed-out generic gray."
- "In dark mode, design surface elevation and contrast explicitly; **do not invert the light theme mechanically.**"
- "For data, use distinct lightness, chroma, shape, label, or pattern so **color is not the only code**."
- "Let the strongest color own a deliberate region or role instead of scattering tiny accents. **Keep the primary action easy to find; do not spend its color on decoration.**"
- "Theme changes should normally remap semantic roles" (primitive values plus semantic tokens).
- "Simulate common vision deficiencies."
- Verification: "The palette works across quiet, dense, interactive, error, and empty states."

Live-mode signature param:

```json
{"id":"color-amount","kind":"range","min":0,"max":1,"step":0.05,"default":0.5,"label":"Color amount"}
```

### Layout

- **Spacing scale: a 4-unit base.** "A 4-unit base usually provides the useful middle steps that an 8-only scale misses."
- **More space above a heading than below it.** Detector implementation: flags when the space above <= the space below, requiring at least **2 violations** on the page, a below-gap under **160px** (beyond that the heading is not binding to nearby content at all), and a deficit of at least **12px**. Rationale in the rule text: "**every section reads as if it captions the previous one.**"
- Container padding: at least **8px, ideally 12 to 16px** inside bordered, outlined, or colored containers. Detector fires below **2px** own-padding, or below **4px** wrapper padding against a visible boundary.
- Horizontal page padding: at least **16px, ideally 24 to 32px**. Detector fires below **4px** from the viewport edge.
- Card radii: **12 to 16px**; "pills are for small controls."
- Touch targets: **44x44pt** minimum (persona Casey).
- **The squint test**: "With detail blurred, can you still identify the primary element, the secondary element, and the major groups in order?"
- "Group by meaning. **Use proximity before adding containers or decoration.**" Corollary diagnostic: "**are containers compensating for weak proximity?**"
- "Create rhythm through deliberate contrast between tight and generous intervals" vs the failure "one spacing value repeated until everything has equal weight."
- "Are repeated cards, columns, or sections genuinely equivalent, **or merely a framework default**?"
- "Make responsive behavior **structural**: reorder, collapse, reflow, or reveal based on what remains important." (Not fluid typography.)
- "Prefer container-aware components when the same component appears in different contexts."
- "Use `gap` for sibling rhythm when it expresses the relationship more directly than child margins."
- "**Keep touch targets usable even when their visible marks are small.**"
- "Use depth only when it clarifies state or hierarchy."
- "**Make optical corrections only after inspecting the rendered result.**"
- "**Variation is not a goal by itself.** Repetition should support recognition; break it only when content or priority changes."
- Adaptation audit list: narrow, intermediate, wide, zoomed, localized. "Does DOM and focus order still agree with the visual order?"
- Extremes audit list: long content, empty states, overlays, sticky elements, safe areas, small touch targets.

Live-mode signature param:

```json
{"id":"density","kind":"range","min":0.6,"max":1.4,"step":0.05,"default":1,"label":"Density"}
```

### Motion

Duration table (`animate.md`), framed as "**Timing should express distance and consequence**":

| Duration | Typical use |
|---|---|
| **100 to 150 ms** | immediate feedback |
| **150 to 300 ms** | routine state change |
| **300 to 500 ms** | layout, overlay, or view transition |
| **500 to 800 ms** | a deliberately authored focal entrance |

Operate-mode override: **150 to 250 ms on most transitions.**

- **"Exit faster than entrance."**
- Default easing: `cubic-bezier(0.16, 1, 0.3, 1)` for confident arrivals. "**do not use bounce or elastic curves by reflex.**"
- **"Long feedback feels like latency."**
- Target 60fps; below 50fps, simplify (overdrive.md).
- Quieter-mode distances: **10 to 20px instead of 40px**.

The motion thesis has four required parts written before implementation: **Focal moment** (the one sequence that deserves authorship, if any), **Continuity** (state/layout/nav changes needing explanation), **Feedback** (controls and outcomes needing acknowledgment), **Budget** (which effects may be expensive and how often they run).

> The focal moment must come from this product and surface concept. **A generic fade-and-rise, hover lift, parallax layer, or scroll reveal is not a thesis.**

**Choose material by meaning** (the property palette, mapped to communication):

| Communicates | Materials |
|---|---|
| Continuity and relationship | shared-element motion, FLIP-style transforms, view transitions, deliberate spatial movement |
| Focus and depth | bounded blur, filter, backdrop, light, shadow changes |
| Reveal and composition | masks, clip paths, cropping, controlled occlusion |
| Material and energy | color, gradient position, texture, distortion, shader effects |
| State and feedback | the smallest change that makes cause and result unmistakable |

> Transform and opacity are reliable foundations, **not the entire palette.**
>
> Do not stack techniques for spectacle. **One strong material idea, carried through the focal sequence and quiet supporting states, is usually enough.**
>
> Sibling stagger is appropriate when a list appears as a list. Cap the total delay, and **never reinterpret every scrolled section as a staggered list.**

Runtime rules:

- CSS transitions/keyframes for declarative state and bounded sequences; WAAPI or the project's existing library for interruption, sequencing, dynamic values; View Transitions for cross-state continuity; scroll-driven motion **only when the scroll relationship itself carries meaning**, with a robust fallback.
- "**Do not add a dependency for an effect the existing stack can express cleanly.**"
- "**Keep content visible in the default state so failed scripts do not hide the page.**" (This is enforced by detector rule `content-hidden-at-rest`, severity error.)
- Avoid casually animating `width`, `height`, `top`, `left`, margins; use FLIP, transforms, or grid techniques.
- Bound blur, filter, shadow, canvas, and shader work to isolated regions. `will-change` only during known animation.
- "**Measure on target viewports and devices rather than assuming transform means fast.**"
- Nonessential loops stop when offscreen or hidden.

Verification bar: **"Removing an animation would lose meaning or authored character, not merely decoration."**

### Shape (the planning command, not a visual axis)

`shape.md` returns a confirmed design brief and **stops**: "shape never writes code or a direction contract." The 7-part brief:

1. Job and audience (who arrives, context, need, visitor mode)
2. Outcome and proof (primary task/action, success, real evidence, product-specific truth)
3. Selected direction (visual authority, structural/interaction thesis, sequence, focal moment, implementation consequence)
4. Scope and boundaries (fidelity, breadth, interactivity, named target, what stays untouched, **explicit anti-goals**)
5. States and ranges (realistic content/data ranges and material states)
6. Interaction and layout (hierarchy, topology, responsiveness, affordances, feedback, transitions; **intent, not CSS**)
7. Constraints and open decisions (**"choices a builder must not invent"**)

Sizing rule: "Use three to five bullets when the task is settled; use the full structure only for ambiguous, multi-screen, or standalone planning. **Do not restate the conversation.**"

---

## 7. The anti-pattern registry (complete)

`cli/engine/registry/antipatterns.mjs`, exported as `ANTIPATTERNS`. **60 rules: 33 `slop`, 27 `quality`.** Category semantics: `slop` = AI tells, `quality` = real design or a11y issues.

Severity semantics:
- no severity field = a normal failure (counts toward exit code 2, surfaced by the hook)
- `severity: 'advisory'` (12 rules) = reported under a separate Advisory section, never a failure
- `advisory: true` (1 rule, `em-dash-overuse`) = the same, derived from the registry so a rule only needs the flag
- `severity: 'error'` (2 rules) = the page is broken; fix before judging anything else

`scopes` power the CLI `--scope` flag: `type` and `layout` are the two scope tags in use.

Engine support map (`RULE_ENGINE_SUPPORT`): `regex` covers `source` + `page-analyzer`; `static-html` covers `element` + `page`; `browser` covers `element` + `page` + `layout`; `visual` covers `visual-contrast`.

| id | category | severity / scopes | name | what it detects |
|---|---|---|---|---|
| `side-tab` | slop | | Side-tab accent border | Thick colored border on one side of a card. "the most recognizable tell of AI-generated UIs". Gate: 3 to 12px band on one edge, other axis 0, chromatic color |
| `border-accent-on-rounded` | slop | | Border accent on rounded element | Thick accent border on a rounded card; the border clashes with the rounded corners |
| `overused-font` | slop | type | Overused font | Inter, Roboto, Fraunces, Geist, Plus Jakarta Sans, Space Grotesk. "Each new wave of AI-generated UIs converges on the same handful of faces" |
| `single-font` | slop | type | Single font without hierarchy | Only one font family for the entire page. Passes when weight and size contrast carry the hierarchy |
| `flat-type-hierarchy` | slop | type | Flat type hierarchy | Font sizes too close together; aim for at least a **1.25 ratio** between steps. Page-level rule |
| `gradient-text` | slop | | Gradient text | Gradient fill on text, especially headings and metrics |
| `ai-color-palette` | slop | | AI color palette | Purple/violet gradients and cyan-on-dark |
| `cream-palette` | slop | | Cream / beige palette | Warm cream or beige page background, "the default 'tasteful' AI surface, reached for by reflex" |
| `nested-cards` | slop | layout | Nested cards | Cards inside cards |
| `monotonous-spacing` | slop | layout | Monotonous spacing | The same spacing value used everywhere; no rhythm, no variation |
| `bounce-easing` | slop | | Bounce or elastic easing | Bounce and elastic timing functions. "Real objects decelerate smoothly" |
| `pulsing-dot` | slop | | Pulsing status dot | Tiny (<= 16px, square-ish), round, animated status dot simulating liveness decoratively |
| `blinking-cursor` | slop | advisory | Decorative blinking cursor | A blinking caret glyph animated into a hero or landing section (first ~1200px) where no input exists |
| `shape-assembled-illustration` | slop | advisory | Shape-assembled illustration | A large inline SVG building a pictorial scene from a pile of primitive shapes. "reads as placeholder clip art" |
| `dark-glow` | slop | | Glowing shadow accents | A zero-offset chromatic halo (box- or text-shadow) on any background, or any colored blurred shadow on a dark background |
| `radial-halo` | slop | | Radial-gradient background halo | Chromatic radial-gradient wash, saturated at center fading to transparent, as decorative background glow on a dark page |
| `radial-spotlight-glow` | slop | | Decorative radial spotlight glow | Soft low-opacity accent-colored radial gradient behind a hero or section as a "spotlight". "the translucent cousin of the saturated radial halo" |
| `marquee` | slop | | Auto-scrolling marquee | Continuously auto-scrolling content. "demands attention it has not earned and hides half its content at any moment" |
| `icon-tile-stack` | slop | layout | Icon tile stacked above heading | Small rounded-square icon container directly above a heading. "the universal AI feature-card template; every generator outputs this exact shape" |
| `italic-serif-display` | slop | type | Italic serif display headline | Oversized italic serif (Fraunces, Recoleta, Playfair, Newsreader-italic) as the primary hero headline. Editorial/magazine register may legitimately want this |
| `hero-eyebrow-chip` | slop | type | Hero eyebrow / pill chip | Tiny uppercase letter-spaced label immediately above an oversized hero headline, or the same shape as a pill chip |
| `repeated-section-kickers` | slop | advisory, type | Repeated section kicker labels | Repeating tiny uppercase tracked labels above section headings. "turns a brand page into AI editorial scaffolding" |
| `numbered-section-labels` | slop | advisory, type | Tiny numbered section labels | Small numeric index labels riding next to section headings, repeated section after section. "a page numbering its own chapters instead of earning structure" |
| `em-dash-overuse` | slop | `advisory: true` | Em-dash overuse | At least **8 em dashes** at a density near **one per 500 characters** of body text. Never fires on a long article that uses a few |
| `marketing-buzzword` | slop | | Marketing buzzword | streamline / empower / supercharge / world-class / enterprise-grade / next-generation / cutting-edge and similar |
| `aphoristic-cadence` | slop | | Aphoristic-cadence copy | **Three or more** sections landing on a short rebuttal ("X. No Y." / "X. Just Y.") or a manufactured-contrast aphorism ("Not a feature. A platform."). "Once is fine; the pattern is the tell" |
| `oversized-h1` | slop | type | Oversized hero headline | A **full-sentence** headline set at display size, dominating the viewport. A punchy one- or two-word headline at that size is fine |
| `extreme-negative-tracking` | slop | type | Crushed letter spacing | Letter-spacing tighter than **~-0.05em**, past the point where characters keep their own shapes |
| `broken-image` | quality | | Broken or placeholder image | `<img>` with empty src, missing src, or placeholder values |
| `script-error` | quality | **error** | Uncaught script error on load | A script threw an uncaught exception or failed to parse during load. "Fix the error before judging anything else" |
| `content-hidden-at-rest` | quality | **error**, layout | Content invisible at rest | A large share of page text at opacity 0 or visibility hidden after every reveal handler had a chance to run. "the failed-reveal signature" |
| `edge-flush-cards` | quality | layout | Cards flush against the scroller edge | Cards in a horizontal scroller or tab panel flush against the container edge at rest while keeping a gutter on the other side; edges and rounded corners get cut off |
| `text-occlusion` | quality | layout | Text occluded by an overlapping element | Text painted under an opaque element or a second text run, so part of it cannot be read |
| `first-viewport-column-overflow` | quality | layout | One column stretches the first viewport | A multi-column opening section where one column runs far past the fold while its sibling fits in one viewport; the short column floats in dead space |
| `gray-on-color` | quality | | Gray text on colored background | Gray text on a colored background. "Use a darker shade of the background color instead, or white/near-white" |
| `low-contrast` | quality | | Low contrast text | Below WCAG AA: **4.5:1** body, **3:1** large text. Handles color and gradient backgrounds |
| `layout-transition` | quality | | Layout property animation | Animating width, height, padding, or margin. "Use transform and opacity instead, or grid-template-rows for height animations" |
| `line-length` | quality | type, layout | Line length too long | Text lines wider than **~80 characters**. Fix: max-width **65ch to 75ch** |
| `cramped-padding` | quality | layout | Cramped padding | Two shapes: (1) an element with its own text where padding is too low for the font size (< ~2px), (2) a wrapper with text-bearing children and near-zero padding (< ~4px) against a visible boundary. Fix: >= 8px, ideally 12 to 16px |
| `body-text-viewport-edge` | quality | layout | Body text touching viewport edge | Body paragraphs flush against the left/right viewport edge (< ~4px) with no container padding. Fix: >= 16px, ideally 24 to 32px |
| `tight-leading` | quality | type | Tight line height | Line height below **1.3x** font size. Fix: 1.5 to 1.7 for body |
| `skipped-heading` | quality | type | Skipped heading level | h1 then h3 with no h2. "Screen readers use heading hierarchy for navigation" |
| `heading-rhythm` | quality | layout, type | Heading crowded against the previous block | Rendered space above a heading <= space below, across the page. Gates: >= 2 violations, below-gap < 160px, deficit >= 12px |
| `justified-text` | quality | type | Justified text | `text-align: justify` without hyphenation ("rivers of white") |
| `tiny-text` | quality | type | Tiny body text | Body text below **12px**. Use >= 14px, 16px ideal |
| `undersized-ui-text` | quality | type | Undersized functional text | Interactive and content-bearing UI text (links, buttons, nav, labels, table cells, meta rows, timecodes) below **11px**; **10px** softer floor for non-interactive legal smallprint. Exempts sup/sub, sr-only, code/terminal. "Being ON the DESIGN.md size ramp does not exempt a value here: adding 8px to the ramp launders the token but not the legibility problem" |
| `all-caps-body` | quality | type | All-caps body text | Long passages in uppercase. "We recognize words by shape (ascenders and descenders), which all-caps removes" |
| `wide-tracking` | quality | type | Wide letter spacing on body text | Letter spacing above **0.05em** on body text |
| `text-overflow` | quality | layout | Content overflowing its container | Content wider than its container, spilling out or forcing a horizontal scrollbar |
| `repeated-container-text` | quality | | Same text repeated inside one container | The same literal text rendered **three or more times** in structurally different spots inside a single card or panel. "usually a status or label wired into every slot of a template" |
| `clipped-overflow-container` | quality | layout | Positioned child clipped by overflow container | A clipping container (overflow hidden or clip) wrapping an absolutely positioned child, cutting off tooltips, menus, popovers |
| `design-system-font` | quality | type | Font outside DESIGN.md | A font family not declared in DESIGN.md typography |
| `design-system-color` | quality | advisory | Color outside DESIGN.md | A literal color outside the DESIGN.md palette and sidecar tonal ramps |
| `design-system-radius` | quality | advisory | Radius outside DESIGN.md | A border-radius value outside the DESIGN.md rounded scale |
| `design-system-font-size` | quality | advisory, type | Font size outside DESIGN.md | A literal font-size off the DESIGN.md type ramp |
| `gpt-thin-border-wide-shadow` | slop | advisory | Hairline border with wide shadow | Hairline border (<= 1.5px, alpha >= 0.28) paired with a wide diffuse shadow. "Commit to one, a defined edge or a soft elevation, rather than both at once" |
| `repeating-stripes-gradient` | slop | advisory | Repeating-gradient stripes | `repeating-linear-gradient` stripes used as surface decoration |
| `codex-grid-background` | slop | advisory | Decorative grid-line background | Decorative grid or line-field background drawn with hairline linear-gradient layers tiled by a fixed pixel cell. "Reserve grid overlays for actual canvas, map, blueprint, or measurement surfaces" |
| `theater-slop-phrase` | slop | advisory | Theater framing copy | Dismissing something as "theater". "a recurring generated-copy tic" |
| `image-hover-transform` | slop | advisory | Image hover transform | Scaling or rotating an image on hover |

### How rules are added (the TDD order is non-negotiable in their repo)

1. **Fixture** at `tests/fixtures/antipatterns/{rule-id}.html` with two columns (should-flag / should-pass), each case with a unique heading. **>= 4 flag cases and >= 5 false-positive shapes.** Use explicit pixel dimensions in CSS because jsdom does no layout.
2. **Failing test** using the snippet-substring pattern. "Run it and watch it fail before implementing."
3. **Rule entry** in `ANTIPATTERNS`: id, category, name, description, optional `skillSection` and `skillGuideline`.
4. **Pure check function** `checkXxx(opts)` returning `[{ id, snippet }]`. **No DOM access in the pure function.**
5. **Two adapters**: `checkElementXxxDOM(el)` for the browser (`getComputedStyle` + `getBoundingClientRect`) and `checkElementXxx(el, tag, window)` for jsdom (`parseFloat(style.width)` instead of layout). Wire **both** into **both** element loops. "Forgetting one is the most common mistake; symptom is 'test passes, live page silent' or vice versa."
6. **Verify on a live page**, including the homepage, for false positives.

Snippet format convention: wrap the identifying heading text in straight double quotes, e.g. `'icon tile above h3 "Lightning Fast"'`, so the fixture test can extract it.

Five artifacts stay in sync per rule change: the engine, the generated browser bundle (`build:browser`), the Chrome extension detector + `antipatterns.json` (`build:extension`), the site's generated counts, and the skill prose.

---

## 8. Prose style rules (`docs/STYLE.md`)

The bar, stated once: **"for every paragraph, point to the sentence that makes it specifically yours. If you can't, the paragraph is AI by default, even if a human typed it."**

### The 12 principles

1. **Open with the reader's wrong belief, your strongest claim, or the example.** No "in this guide", no "let's dive in".
2. **Take a position someone could disagree with.** "If the paragraph could be inverted without changing meaning, it has no position. Sign your stance."
3. **Name names. Use numbers.** Real competitors, customer names, version numbers, file paths, benchmarks. "Cut 'lightweight'; write '54 KB'."
4. **Verbs lead. Nouns follow.** Active voice. Cut nominalizations ("the implementation of" becomes "implementing").
5. **Vary sentence length on purpose.** Long, long, short. "**Smooth uniform rhythm is the deepest AI tell.**"
6. **Prose carries the load; structure supports it.** "Bullets are for parallel options. Paragraphs are for argument. Don't bullet what would be tighter as a sentence."
7. **Plain words. Technical terms only when something specifically rests on them.** "Mixing levels lets the technical terms hit harder."
8. **Allow ungrammatical fragments for rhythm.** Five words. Confidence signal.
9. **Respect the reader's competence.** No "developers should consider"; just "you might not need an effect".
10. **Read it aloud. Fix anything you stumble over.**
11. **Concrete over comprehensive.** "**Coverage is an AI obsession. Trade coverage for momentum. Leave things out.**"
12. **Close by handing off the next move.** "Don't summarize. End on the strongest sentence, give a directive ('Now do this'), or just stop."

### The denylist (build-enforced by `validateProse`)

| Banned | Why | Use instead |
|---|---|---|
| `load-bearing` | Almost always vague. The literal sense is rare. | Name the specific thing it does |
| `highest-leverage` | Vague claim of impact | Say what specifically pays off |
| `biggest unlock` | Marketing-speak | Describe the actual change |
| `reflex defaults` | Eval-team jargon | "Instincts", "first guesses", "default reaches" |
| `collapses into monoculture` | Eval-paper voice | Describe what specifically went wrong |
| `data-driven` | Empty marketing adjective | Cite the data |
| `seamless`, `seamlessly` | Hollow positive | Say what specifically works without friction |
| `robust`, `robustness` | Hollow positive | Cite the failure mode handled |
| `elevate`, `elevates` | Marketing verb | Use the specific verb (improve, raise, sharpen) |
| `empower`, `empowers` | Marketing verb | "Let you", "make possible" |
| `underscore`, `underscores` | AI tell | "Show", "make clear" |
| `pivotal` | Hollow positive | "Central", "key", or describe the role |
| `tapestry` | AI scenery noun | Cut |
| `delve`, `delves`, `delved`, `delving` | "The most-flagged AI tell of all" | "Look at", "explore", or delete the throat-clearing verb |
| `in today's ...` | Generic opener | Start at the actual point |
| `gone are the days` | Cliché opener | Make the point directly |
| `whether you're ...` | Audience-pandering; addresses no one | "Pick one reader. Write to them" |
| `let's dive in` | Throat-clearing | Just start |
| `in summary`, `in conclusion` | Restates what was just said | End on the strongest sentence |
| `moreover`, `furthermore` | Metronome transition crutch | Drop, use "also", or restructure |
| Em dash (`U+2014`, plus the HTML entities `&mdash;`, `&#8212;`, `&#x2014;`) | "Decision-avoidance: writer didn't pick a relationship between the clauses" | Comma, colon, semicolon, period, parentheses |
| ` -- ` (double hyphen) | "Worse than the em dash. Signals failed cleanup" | Real punctuation |

**Two gates, different strictness.** `validateProse` runs the full list on `README.md` / `README.npm.md`. A second gate, `validateSkillProse`, scans `skill/**/*.md` and enforces em dashes plus only the subset with no technical reading: `load-bearing`, `highest-leverage`, `biggest unlock`, `reflex defaults`, `collapses into monoculture`, `data-driven`, `delve`, `tapestry`, `in today's`, `gone are the days`, `let's dive in`, `in summary`, `in conclusion`. The words it does not enforce in `skill/` (`seamless`, `robust`, `elevate`) are "the ones with legitimate technical uses". Code comments in `.mjs` are exempt.

Governance rule: **"Do not silently work around the regex. If a banned word has earned a real meaning here, raise it as a `docs/STYLE.md` amendment."**

### The structural AI-tells no validator can catch

- **Negation pivot.** "It's not just X, it's Y." "Less about X, more about Y." "**This is now a stronger AI tell than any vocabulary item.** Most instances should be replaced with a direct positive claim."
- **Triadic everything.** Every list exactly three items; every adjective in groups of three ("fast, simple, and powerful"). "Vary count: use 2 or 4. Use 1."
- **The five-paragraph essay shape.** Intro, 3 sections, conclusion, on every page. "Lead with the example. Skip the conclusion. Let some sections be one sentence."
- **Uniform paragraph length.** "Insert a 4-word sentence. Insert a one-line paragraph."
- **Synthetic balance.** Pros and cons of equal length when one is clearly right. "Write the recommendation; note real exceptions briefly."
- **Hollow confidence.** "Powerful" without numbers. Replace with a concrete fact.
- **Hedging stacks.** "It might potentially be useful to consider..." "Each hedge is fine; stacked, they sound trained."
- **Interchangeable copy.** "Swap 'Impeccable' for a competitor name. **If nothing becomes false, the copy is generic.**"

Closer: "Read the paragraph aloud. If you stumble, rewrite. If a sentence describes nothing specific to this product, cut it."

---

## 9. What to steal, what to do differently

### Steal outright

1. **The anchoring quarantine.** "Assessment A must finish before detector findings enter the parent synthesis context." This is the single best idea in the repo and it generalizes far beyond design: any time you have both a deterministic checker and a judgment pass, run judgment first, in isolation, or the checker's output becomes the ceiling of the judgment. Apply to WebGL/shader review too: judge the *feel* before reading the frame-time trace.
2. **Loud degradation.** `⚠️ DEGRADED: single-context (<reason>)` as a mandatory first line, with a definition of "unavailable" that explicitly excludes "inconvenient". Steal the exact pattern for any skill with an optional-but-preferred execution path.
3. **Externalized dice.** A model's own ranking is a deterministic function of its priors, so "rank harder" cannot beat the prior; only an external assignment can. For a vertical-playbook library this maps to: seed the vertical's *unexpected* reference systems from a catalog, assign one, and force the fuse.
4. **Name the rut, exclude it, and exclude its opposite.** "if someone could guess your aesthetic from the category alone, **or from category-plus-avoidance**, rework until neither answer is obvious." Predictable contrarianism is also a prior. Most anti-slop skills miss the second half.
5. **The 5-block direction contract** (THESIS / OWN-WORLD / STORY / FIRST VIEWPORT / FORM), 150 words max, written into the emitted markup as an HTML comment so it survives the build, with the falsifiability test "if a block reads like a mood, the direction is not decided yet." This makes the finishing review auditable promise-by-promise instead of vibes-by-vibes.
6. **DESIGN.md written from the build, not before it.** "a rulebook written before the build gets defended against reality instead of describing it."
7. **The bounded verification budget.** Two screenshot rounds, fixes batched between them, stated with the cost rationale. Every agentic design skill needs this or it burns the user's budget on per-tweak loops.
8. **The named-failure-mode vocabulary.** "The Wall of Options", "The Memory Bridge", "The Visual Noise Floor", "the ghost card", "the default wearing the subject's clothes", "the gap wearing chrome", "the timidity reflex wearing honesty's clothes". Named failures are findable failures. Build a vocabulary before building a checklist.
9. **The skeleton test** (bolder.md), **the memory test** (new-work.md), **the removal test** and **the wow test** (overdrive.md), **the squint test** (layout.md), **the specificity test** ("could an unrelated product use it unchanged"). Each is a one-line falsifiable check. Six of these beat sixty guidelines.
10. **Severity that says what should happen, not how bad it is** (`auto` / `mention` / `route`), plus once-a-week throttling on non-actionable findings.
11. **Deliberately withholding a11y at design time** because the reminder produces timid output, and putting it in a dedicated audit command instead. Counter-intuitive, well-reasoned, and probably correct.
12. **Model-specific priors in provider-conditional blocks.** The `<claude>` block naming the cream/serif/lamplight rendition prior is more effective than any generic "avoid generic design" instruction, because it names the specific attractor.
13. **Truth binds claims, not demonstrations.** The cleanest resolution I have seen of the "I can't build a bold demo because I have no real data" deadlock.
14. **The standing exit.** The safe conventional option is always on the table, but the agent may never recommend it or weigh it. This preserves user agency without letting the agent's own risk aversion win.

### Where a new library can go further

1. **They are web-CSS-first and it shows.** The detector is a DOM/CSS rule engine. Every axis file is written in CSS vocabulary. WebGL, canvas, and shader work appear only as a toolkit list in `overdrive.md` and a single craft-floor line ("build the technique itself, not a static imitation"). There is **no** equivalent of the type/color/layout/motion numeric floors for GPU work. A WebGL-component-first library should ship the missing floors: frame budget per tier (60fps target, 50fps simplify is all they give), draw-call and instance ceilings, texture memory budgets per device class, shader precision defaults (`mediump` on mobile), pixel-ratio caps (typically 1.5 to 2 max on DPR-3 phones), context-loss handling, `prefers-reduced-motion` fallback for scroll-driven shader work, and a hard rule on what must remain readable when the canvas fails to initialize.
2. **Their motion "material palette" stops at CSS.** They correctly say "transform and opacity are reliable foundations, not the entire palette" and list blur/backdrop/clip-path/mask. A GPU-first library extends the same table: displacement, flow fields, feedback buffers, SDF morphs, particle advection, post-processing chains, each mapped to what it *communicates*, which is the part they got right and almost nobody else does.
3. **No component-level playbooks.** Impeccable is command-oriented (verbs: polish, distill, colorize) with zero surface-type playbooks. There is nothing that says "a pricing table looks like this", "a data grid looks like this", "a hero with a live shader looks like this". Vertical-specific playbooks are a genuinely open lane. Their own `operate.md` is the closest thing and it is only 62 lines.
4. **The concept engine's best material lives behind a paywall.** The catalog (world cards, quality-bar boards, rendered references) is in a private repo, so the open skill degrades to "promotion-only seed". A library that ships its reference catalog in the open, even a small one, gets most of the anti-default benefit without the API dependency.
5. **The persona set is generic.** Alex/Jordan/Sam/Riley/Casey are good archetypes but they are product-agnostic. Vertical playbooks should ship vertical personas (the clinician on a shared workstation, the trader with six monitors, the field tech on a cracked screen in daylight) with vertical red flags. Their own project-persona template is the hook to hang this on.
6. **Their scoring is Nielsen-only.** Nielsen 0-4 measures usability, not craft. Design specificity is scored in prose only, with no rubric. A stronger library would add a second scored axis with the same 0-4 discipline: specificity, material commitment, or craft finish, so the trend line tracks the thing the skill actually claims to improve.
7. **Advisory-vs-failure is the right idea, applied too narrowly.** 12 of 60 rules are advisory, mostly the newest ones. The interesting extension is **context-conditional severity**: `italic-serif-display` should be a failure on a fintech dashboard and a non-finding on an editorial site. They gesture at this ("Editorial / magazine register may legitimately want this, judge by context") but the engine cannot express it. A registry with `severityByMode` would.
8. **The prose style file is better than the design files at self-critique.** `STYLE.md`'s "patterns the validator can't catch" section has no design equivalent. A design library should ship "visual tells no detector can catch": uniform section rhythm, the three-column reflex, every image the same crop ratio, every section the same vertical padding, the single-accent-color-everywhere reflex. That list does not exist here and it is the design analogue of "uniform paragraph length".
9. **Nothing about performance as a design material.** They treat perf as a constraint (60fps, lazy-init, pause offscreen). For canvas/WebGL work, load time, first-frame time, and thermal behavior are *design decisions* with visible consequences. That framing is absent.
