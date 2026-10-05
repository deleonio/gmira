---
name: gmira-scroll
description: "Use when building or auditing anything that happens because the page scrolled: reveal animations, pinned or sticky sections, scrub-driven timelines, parallax, tilted galleries, sticky card stacks, progress indicators, smooth scroll. Also use when every section fades up identically, when scrolling stutters or the page feels heavy on a trackpad, when two components fight over the same scroll position, when a pinned section jumps or double-counts, when someone is about to add a `scroll` listener, or when reduced motion still animates. Owns the one-authored-moment rule and the no-layout-reads-in-a-scroll-handler rule."
---

# Scroll

One authored moment. Everything else on the page just appears.

Load `../gmira/references/DOCTRINE.md` first. This skill implements Part 3.5 and Part 5 item 5.
Anything scroll-driven on a canvas also loads `gmira-canvas`.

## The premise

**Every section entering identically on scroll is the single most common tell that a page was
assembled rather than designed.** Fade-up, 0.6s, stagger 0.1, forever. It reads as a queue, not as
emphasis, because when everything is emphasized nothing is.

The correct budget for a page is **one** scroll moment that could not have been a static layout,
plus reveals that are so cheap and so short they are not really motion. If you cannot name in one
sentence what the one moment does to the argument of the page, cut it.

## Step 1: pick the one moment, and name what it does

| The moment | What it argues | Arsenal piece |
|---|---|---|
| A grid of frames resolving from tilted and blurred to flat and sharp | "these are finished pieces of work, one at a time" | `scroll-tilted-grid` |
| Cards pinning and scaling into a depth stack | "this is a stack of offers and they accumulate" | `sticky-scroll-cards` |
| A card splitting into panels and flipping | "there is more inside this one thing" | `scroll-split-card` |
| Four corner images converging on a center | "these separate artefacts are one module" | `scroll-choreography` |
| Content printing in from behind a beam | "this is a machine reading out" | `@canvas-ui` Laser |
| A section condensing out of particles | "this was built from components" | `@canvas-ui` Particle Scroll |

Everything not on that list is a reveal, and a reveal is one IntersectionObserver plus a CSS class.

```
INCORRECT   every <Section> wrapped in <motion.div initial={{opacity:0, y:24}}
                whileInView={{opacity:1, y:0}} transition={{duration:0.6, delay:i*0.1}}>
CORRECT     one authored moment on the section that carries the argument.
            Everywhere else: a single `[data-reveal]` attribute, one IntersectionObserver,
            one 220ms opacity+translate that fires once and then unobserves. Sections that
            are already the point (the hero, the price, the form) do not reveal at all.
```

The second half of that CORRECT matters as much as the first. A page where 80% of sections reveal
and 20% do not has rhythm. A page where 100% reveal has a queue.

## Step 2: reveals are IntersectionObserver, and they fire once

Never a `scroll` listener for a reveal. Never `whileInView` on forty elements.

```tsx
// one observer for the whole page, mounted once
useEffect(() => {
  const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((el) => el.setAttribute("data-revealed", "true"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "true");
        io.unobserve(entry.target);            // fires once, never again
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}, []);
```

```css
[data-reveal] {
  opacity: 0;
  translate: 0 12px;
  transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
              translate 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
[data-reveal][data-revealed="true"] { opacity: 1; translate: 0 0; }
@media (prefers-reduced-motion: reduce) {
  [data-reveal] { opacity: 1; translate: 0 0; transition: none; }
}
```

Three details that are the difference between this and the reflex version: `unobserve` on hit so a
scroll back up does not replay, `rootMargin` bottom inset of `-12%` so the element commits before it
is fully on screen, and **never `transition: all`**.

For a reading position (a table of contents, a progress rail) the observer is tuned differently:
`{ rootMargin: "0% 0% -80% 0%", threshold: 0.98 }` shrinks the detection band to the top fifth of
the viewport, so the active heading is the one being read rather than the last one to touch the
bottom edge. That is the `@ncdai/toc-minimap` configuration and it is worth copying verbatim.

## Step 3: the pinned moment has exactly one scroll value

The pinned-sticky pattern: a tall outer section, a `position: sticky` inner viewport, and a single
normalized progress `p` in `[0, 1]` derived from how far the outer section has travelled.

**Compute `p` once, publish it, and let everything read it.** Two components each reading `scrollY`
is the bug that produces jitter, drift between layers, and double-counted RAFs.

```tsx
// ONE owner. Everything inside reads from context or from the CSS variable.
function PinnedStage({ children }: { children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });

  // publish once, as a CSS custom property, so non-React children can read it too
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    outer.current?.style.setProperty("--p", v.toFixed(4));
  });

  return (
    <ScrollProgress.Provider value={scrollYProgress}>
      <div ref={outer} className="relative h-[320svh]">
        <div className="sticky top-0 h-svh overflow-hidden">{children}</div>
      </div>
    </ScrollProgress.Provider>
  );
}

// consumers derive, they never measure
function Layer({ from, to }: { from: number; to: number }) {
  const p = useContext(ScrollProgress);
  const y = useTransform(p, [0, 1], [from, to]);
  return <motion.div style={{ y }} />;
}
```

The published `--p` also unlocks pure CSS layers with no React involvement:

```css
.stage-caption { opacity: clamp(0, calc((var(--p) - 0.15) * 6), 1); }
.stage-rule    { scale: calc(0.2 + var(--p) * 0.8) 1; }
```

```
INCORRECT   <StickyCards />  and  <ParallaxHeadline />  in the same section, each calling
            useScroll() with its own target, each running its own rAF, each measuring
            its own offsets. They disagree by a frame and the layers slide against each other.
CORRECT     one useScroll() in the pinned wrapper, published as context plus --p.
            Children take p as an input. Zero of them touch window.scrollY.
```

Height math, stated once so nobody guesses: outer height `= 100svh + (steps * travel)`. Three cards
each getting one viewport of travel is `h-[400svh]`. Write the formula in a comment next to the
class, because the next person will change the card count and not the height.

## Step 4: the zero-JS option

Scroll-driven CSS animations remove the listener, the observer, and the React state entirely.

```css
@property --top-mask-height { syntax: "<length>"; inherits: true; initial-value: 0px; }

@keyframes reveal-panel { from { opacity: 0; translate: 0 16px; } to { opacity: 1; translate: 0 0; } }

.panel {
  animation: reveal-panel linear both;
  animation-timeline: view();
  animation-range: entry 10% cover 32%;
}
```

`view()` is the element's own progress through the viewport. `scroll(self)` is a scroll container's
own progress and is what `@ncdai/scroll-fade-effect` uses to animate two `@property`-registered
lengths on **different ranges**, so the top mask appears in the first 2rem of scroll and the bottom
mask disappears in the last 2rem, with zero JavaScript.

Support reality: Chromium has shipped it since 115 and Safari since 26. Firefox is the holdout.
Treat it as an enhancement and gate it, exactly as chanhdai does with a custom variant:

```css
@custom-variant supports-timeline-scroll (@supports (animation-timeline: scroll()));
```

```
INCORRECT   ship animation-timeline: view() as the only reveal mechanism, then discover
            the element is invisible in a browser without support because the from-state
            (opacity: 0) applied and the animation never ran.
CORRECT     the default state is VISIBLE. The scroll-driven animation is what makes it
            arrive. Put the hidden state inside @supports, never outside it.
```

That inversion is the whole trick. Progressive enhancement for scroll animation means the unenhanced
state is the finished state.

## Step 5: the arsenal pieces

Install and repair per `gmira-arsenal` before use. Deps listed are what the file actually
imports, which is not always what the registry declares.

| Component | Real deps | What it is actually good for | Watch out |
|---|---|---|---|
| `@componentry/scroll-tilted-grid` | `framer-motion`, `lenis` | The best gallery primitive in the set. `rotateX` plus `filter: blur()` in a perspective container, resolving to flat and sharp as each frame crosses the viewport. Creative walls, inventory, portfolio. | Props: `images` (required `{src, alt}[]`), `loop` false, `initialCycles` 2, `maxCycles` 4, `smoothScroll` true, `aspectRatio` `"4 / 5"`, `perspective` 1000, `maxTilt` 62, `maxBlur` 7, `sectionPadding` `"18vh"`. Already ships IntersectionObserver, ResizeObserver, and reduced motion. Set `smoothScroll={false}` if you own lenis at the app level, or you get two instances. |
| `@componentry/sticky-scroll-cards` | `framer-motion`, `lenis` | The offer stack, the module list, "shop the look". Cards pin and scale down into a layered depth stack. | Props: `cards?: {title, src}[]`, `hint?`, `className?`. Tiny API. **Defaults pull from images.unsplash.com.** Pass your own or you ship a demo's stock photos. |
| `@componentry/scroll-split-card` | `framer-motion` (**undeclared**, install it) | One thing that opens into three. Good for a single featured item, useless as a page structure. | Props: `imageSrc` (required), `cards: {title, description, bgColor, textColor, icon?}[]`, `containerRef?` so an outer scroll container can drive it. Defaults point at framerusercontent.com. |
| `@componentry/scroll-choreography` | `framer-motion` (**undeclared**), `cn` from `@workspace/ui/lib/utils` (**broken**) | Four corner images converging. Rigid: exactly four, fixed layout. Perfect when a module genuinely has four artefacts, useless otherwise. | Props: `className`, `images: { topLeft, topRight, bottomLeft, bottomRight }`. That is the entire API. |
| `@componentry/orbit-card-stack` | `framer-motion`, `lucide-react` | **Not a scroll component.** Hover only. A real selector: `onActiveChange(item, index)` wires into checkout or cohort state. Reach for it when the reflex is "make this a scroll section" and the thing is actually a picker. | Props: `items?: OrbitStackItem[]`, `defaultActiveIndex` 2, `spread` 168, `lift` 34. The active card deliberately keeps its color and angle while the rest fan out. |
| `@componentry/scroll-based-velocity` | `framer-motion`, broken `cn` import | A Magic UI port present in a dozen registries. On the refuse-by-default list. | Use at most one commodity primitive per page, restyled past recognition. |

Canvas-side, from `@canvas-ui`: Particle Scroll (`point: 0.68, band: 420`, `stagger: 0.7,
settle: 1.2`) turns a scroll into a reveal without wiring per-element animation, Laser prints
content in from behind a beam and measures the beam width from the DOM so it lines up with the text
column, and Bend treats the whole page as a folded sheet (`top: false, bottom: true, angle: 55`).
Each of those is the page's one heavy effect, so it competes with the hero, not with the reveals.

## Step 6: lenis, and what it costs

`lenis` is roughly 10 KB and it is the declared dependency of exactly two components,
`scroll-tilted-grid` and `sticky-scroll-cards`, both of which are best in class. That is the whole
case for it in the cheap stack.

Worth it when: a scrub-driven moment needs to feel continuous rather than stepped on a mouse wheel,
or you are already installing one of those two.

Not worth it when: the page is Operate or Read. Hijacking scroll on a dashboard or a doc breaks the
user's own scroll physics, their trackpad momentum, and their expectation that `End` lands at the
end.

Three rules if you take it:

1. **One instance, at the app root.** Two lenis instances fight and the page feels rubbery. Pass
   `smoothScroll={false}` to any component that would create its own.
2. **Disable it under reduced motion.** Smooth scroll is motion.
3. **Never let it break anchor navigation or `scroll-margin-top`.** Test a hash link into a section
   under a sticky header before shipping.

## Step 7: reduced motion is a total kill switch

Not a slowdown, not a shorter duration. Under `prefers-reduced-motion: reduce`:

- Reveals: elements start and stay visible. No transition at all.
- The pinned moment: `p` is not animated. Render the **end state** of the sequence, unpin the
  section, and let it scroll normally. A pinned section that no longer animates is 320svh of empty.
- lenis: off.
- Scroll-driven canvas: freeze at a still frame **you chose by looking at it**. `t = 0` is usually
  the least composed frame the effect has.
- Marquees and velocity text: stopped, showing the full string.

```tsx
const reduced = useReducedMotion();
// the pinned wrapper collapses entirely, it does not just stop animating
<div className={reduced ? "relative" : "relative h-[320svh]"}>
  <div className={reduced ? "" : "sticky top-0 h-svh overflow-hidden"}>
```

## Performance rules

**A scroll handler must not read layout.** `getBoundingClientRect()`, `offsetTop`, `clientHeight`,
and `getComputedStyle()` all force the browser to flush pending layout. Calling one inside a scroll
or RAF callback turns every frame into a forced synchronous layout, and the page feels heavy in a
way no profiler summary makes obvious.

```
INCORRECT   window.addEventListener("scroll", () => {
              const r = el.getBoundingClientRect();          // layout, every frame
              el.style.setProperty("--p", String(-r.top / r.height));   // then a write
            });
CORRECT     measure once, on mount and on ResizeObserver, into a ref:
              const box = useRef({ top: 0, height: 1 });
              const measure = () => { const r = el.getBoundingClientRect();
                                      box.current = { top: r.top + window.scrollY, height: r.height }; };
            then the frame does arithmetic only:
              const p = (window.scrollY - box.current.top) / box.current.height;
            Better still: no handler at all. IntersectionObserver for state changes,
            useScroll for progress, animation-timeline for the rest.
```

The rest of the floor:

| Rule | Why |
|---|---|
| Animate `transform`, `opacity`, `filter`, `clip-path`, `mask`. Never `top`, `height`, `margin`, or `width` on scroll | The first set composites, the second set relayouts |
| `will-change` only on the element actually being scrubbed, removed when the moment ends | Every `will-change` is a compositor layer and layers cost memory |
| Passive listeners if a listener is truly unavoidable: `{ passive: true }` | A non-passive scroll listener blocks scrolling until it returns |
| Durations 100 to 800ms, ease `cubic-bezier(0.16, 1, 0.3, 1)` from an already-visible default | Doctrine 3.5 |
| Pause any scroll-driven canvas on IntersectionObserver exit and on `visibilitychange` | A loop running off screen is battery and thermals the user can feel |

## Checks before this skill is done

- [ ] Exactly one authored scroll moment on the route, and you can say in one sentence what it argues
- [ ] Not every section reveals. The ones that are already the point do not.
- [ ] Every reveal is an IntersectionObserver that calls `unobserve` on hit
- [ ] Zero `scroll` event listeners, or each remaining one is passive and reads no layout
- [ ] `getBoundingClientRect` appears only in mount and resize paths, never in a scroll or RAF callback
- [ ] The pinned section has exactly one owner of the scroll value; nothing else reads `scrollY`
- [ ] The outer height formula is written in a comment next to the class
- [ ] At most one lenis instance in the whole app, and it is off under reduced motion
- [ ] `prefers-reduced-motion` unpins the section and renders the end state; nothing animates
- [ ] Any scroll-driven CSS animation degrades to the finished state, with the hidden state inside `@supports`
- [ ] Registry defaults pointing at unsplash.com or framerusercontent.com replaced with real assets
- [ ] No `transition: all` anywhere in the scroll layer
