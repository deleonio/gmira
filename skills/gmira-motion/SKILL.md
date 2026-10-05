---
name: gmira-motion
description: "Use when adding, reviewing, or cutting motion on a web surface: scroll reveals, hero entrances, hover feedback, page and view transitions, pointer-following effects, and canvas or shader timing. Also use when every section fades up identically, when the page renders blank because a reveal script did not run, when an animation feels right on a 60Hz laptop and twitchy on a 120Hz phone, when reduced motion only slows things down instead of stopping them, or when someone asks to \"add some animation\" with no stated reason. Owns the one authored moment, the duration and easing table, the material palette past transform and opacity, and frame-rate independent easing."
---

# Motion

One authored moment. Not scattered effects, and not one identical entrance on every section.

Load `../gmira/references/DOCTRINE.md` first. This skill implements its Part 3.5.
Anything running on a canvas or a GPU also loads `gmira-canvas`.

## The premise

Motion that does not carry meaning is decoration, and decoration on a page is weight, latency, and
one more thing to break. The verification bar is a single sentence you must be able to finish for
every animation on the surface: **removing this would lose meaning or authored character.** If the
honest ending is "it would look a bit flatter", cut it and spend the budget on the one moment that
does carry meaning.

The failure this skill exists to stop is not a missing animation. It is twelve of them, each 0.6s,
each identical, each triggered by scroll.

## Step 1: write the motion thesis before touching a keyframe

Four parts, four lines, in the surface brief. Any animation that does not trace to one of these
lines does not get built.

| Part | Question |
|---|---|
| **Focal moment** | Which single sequence deserves authorship on this surface, if any |
| **Continuity** | Which state, layout, or navigation changes need explaining rather than replacing |
| **Feedback** | Which controls and outcomes need acknowledgment, and how small that can be |
| **Budget** | Which effects may be expensive, how often they run, and what stops them |

The focal moment comes from this product and this surface concept. **A generic fade-and-rise, a
hover lift, a parallax layer, or a scroll reveal is not a thesis.** If the focal moment could be
described without naming the product, go back to `gmira-direction`.

Budget per mode, from the doctrine:

| Mode | Motion budget |
|---|---|
| Persuade, Experience | Motion may carry the voice. One rehearsed focal sequence beats repeated section reveals. |
| Read | Low. Nothing animated inside the measure. Reading is the task. |
| Operate | Feedback, state, and continuity only. 150 to 250ms on most transitions. No page-load choreography. |

## Step 2: durations and easing

Timing expresses distance and consequence. Pick the range from what the thing is doing, not from a
house default applied everywhere.

| Duration | What the range is for | Examples |
|---|---|---|
| **100 to 150ms** | immediate feedback, the control acknowledging the pointer | button fill, checkbox tick, icon color, link underline |
| **150 to 300ms** | routine state change | tab switch, accordion, dropdown, toast entering, filter applying |
| **300 to 500ms** | layout, overlay, or view transition | modal, drawer, route change, shared-element move |
| **500 to 800ms** | the one authored focal entrance | the hero sequence, once per surface |

Three rules that hang off that table:

1. **Exit faster than entrance.** 60 to 70% of the entrance duration. An element leaving does not
   need to be admired.
2. **Above 800ms reads as latency, not intent.** The visitor stops reading it as design and starts
   reading it as a slow site.
3. **Cap total stagger at 300ms.** Twelve items at 100ms each is 1.2 seconds, and the last card
   arrives after the visitor has already scrolled past it. Twelve items across 300ms is 25ms each.
   Stagger is for a list that appears as a list, never for reinterpreting every scrolled section as
   one.

```css
:root {
  --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);   /* confident arrival, the default */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);   /* quieter, the Operate default */
  --ease-in-out:    cubic-bezier(0.65, 0, 0.35, 1);  /* only when a thing leaves and returns */
}
```

No bounce, no elastic, by reflex. Real objects decelerate smoothly. A spring is legitimate only
when the committed world named one: a toy, a game, a physical mechanism in the brief.

## Step 3: the resting state is the readable state

The default state in the stylesheet is what a visitor sees when the reveal script fails, arrives
late, is blocked by an extension, or throws on an unrelated error. **Never author `opacity: 0` as
the resting state.** A page whose content is hidden until JavaScript un-hides it is a page that
renders blank whenever JavaScript does not run.

```
INCORRECT   .reveal { opacity: 0; transform: translateY(24px) }
            .reveal.in { opacity: 1; transform: none; transition: all .6s }
            One failed chunk load and the entire page is a blank scroll.

CORRECT     .reveal { opacity: 1; transform: none;
                      transition: opacity 500ms var(--ease-out-expo),
                                  transform 500ms var(--ease-out-expo) }
            .js .reveal:not(.in) { opacity: 0; transform: translateY(16px) }
            The `js` class is written by the same script that does the revealing, so the
            hidden state only exists once the thing that can un-hide it is proven alive.
```

Verify on the built page. Anything over 20 characters of text sitting invisible at rest is the
failed-reveal signature:

```js
[...document.querySelectorAll('body *')].filter(e => {
  const s = getComputedStyle(e);
  return e.textContent.trim().length > 20 &&
         (parseFloat(s.opacity) === 0 || s.visibility === 'hidden');
}).length   // must be 0 with scripts running, and 0 with scripts disabled
```

## Step 4: the section-entrance reflex

Every section entering identically is tell number 5 in the doctrine's list. The page ends up with
no emphasis, only a queue: the visitor learns after two sections that nothing is coming and stops
watching.

```
INCORRECT   <motion.section initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}}
                            transition={{duration:0.6, delay:i*0.1}} />
            applied to all seven sections, so the entrance means "a section exists".

CORRECT     One section gets the authored moment: the hero mask wipes open along the
            product's own axis, 700ms, once. The other six enter by not entering. Their
            emphasis comes from density, scale, and spacing, which cost nothing and
            survive a failed script.
```

If several sections genuinely need to arrive rather than exist, differentiate what arrives: one
reveals by mask, one by measure (a rule drawing across), one by a counter settling. Same grammar,
different sentence. Identical is the tell, not motion.

Source-side check:

```bash
rg -c "whileInView|data-reveal|animate-fade-up" src/
rg -no "duration: *[0-9.]+" src/ | sed 's/.*duration: *//' | sort | uniq -c | sort -rn | head
```

Four or more sections sharing one duration, delay, and offset triple is a finding.

## Step 5: never `transition: all`

`transition: all` animates properties you did not choose, including ones that force layout, and it
turns every future style change on that element into an accidental animation. It is also the reason
a hover that was meant to change a background color also animates a border, a shadow, and a
transform at the same wrong duration.

```
INCORRECT   transition: all 300ms ease;
CORRECT     transition: background-color 150ms var(--ease-out-quart),
                        box-shadow      150ms var(--ease-out-quart);
```

```js
[...document.styleSheets].flatMap(s => { try { return [...s.cssRules] } catch { return [] } })
  .filter(r => r.style && /\ball\b/.test(r.style.transitionProperty || ''))
  .map(r => r.selectorText)
```

Tailwind: `transition-all` is the same bug with a shorter name. Use `transition-colors`,
`transition-transform`, `transition-opacity`, or a named `transition-[opacity,transform]`.

## Step 6: the material palette

Transform and opacity are a reliable foundation, not the whole palette. Each material communicates
something specific, and the choice is a meaning choice before it is a performance choice.

| Material | Communicates | Cost |
|---|---|---|
| `transform` translate, scale, rotate | position, arrival, relationship | compositor, cheapest |
| `opacity` | presence, attention | compositor, cheapest |
| `filter: blur()` | one plane receding, focus pulling | paint, bound the region |
| `backdrop-filter` | a surface in front of live content | paint, expensive over large areas |
| `clip-path` | reveal as composition, something uncovered | paint, animatable between same-type shapes only |
| `mask-image` position or size | a wipe that follows the world's own geometry | paint |
| `box-shadow` | elevation change under the pointer | paint, prefer animating a pseudo-element's opacity |
| color, gradient position | material and energy, temperature shift | paint, register with `@property` to interpolate |
| **displacement, refraction** | material under pressure, glass, depth | GPU tier |
| **flow field, advection** | current, direction, time passing | GPU tier |
| **feedback buffer** | persistence, trail, memory | GPU tier |
| **SDF morph** | one thing becoming another | GPU tier |
| **particle advection** | quantity, swarm, scale | GPU tier |

Pick the one whose meaning matches the brief. If two are equally apt, take the cheaper one. Do not
stack techniques for spectacle: one strong material idea carried through the focal sequence and
quiet supporting states is enough. The GPU tier belongs to `gmira-canvas` and carries the whole
Part 4 floor with it.

What not to animate: `width`, `height`, `top`, `left`, `margin`, `padding`. Use a transform, FLIP,
or `grid-template-rows: 0fr` to `1fr` for a height reveal. `will-change` goes on during a known
animation and comes off after; left on permanently it holds a compositor layer per element for the
life of the page.

## Step 7: frame-rate independent easing

A fixed lerp factor is a per-frame constant pretending to be a per-second one. The same code is a
different animation on every display, and nobody catches it because the authoring machine is 60Hz.

```
INCORRECT   x += (target - x) * 0.1;    // "10% per frame"

            Remaining distance after one second:
              30Hz   0.9^30  = 0.042
              60Hz   0.9^60  = 0.0018      <- what you authored against
              144Hz  0.9^144 = 0.0000003
            On a 120Hz phone the follow is roughly twice as fast as authored, which
            reads as twitch, and on a throttled tab it lags.

CORRECT     const delta = Math.min((now - last) / 1000, 1 / 30);   // clamp, see below
            last = now;
            const k = 1 - Math.exp(-delta / tau);                  // tau in seconds
            x += (target - x) * k;
```

`tau` is the time constant: after `tau` seconds the value has covered roughly 63% of the remaining
distance, on every display. Authoring values: **0.08 to 0.12** for a cursor follow that feels
attached to the pointer, **0.25 to 0.4** for a lazy parallax or a settling counter.

Two more forms of the same identity:

```js
const ease  = 1 - Math.exp(-delta * rate);            // rate form, higher is snappier
const decay = Math.pow(perFrameConstant, delta * 60); // converts an authored per-frame value
```

Three details that go with it:

1. **Clamp delta to `1/30`.** A backgrounded tab returns with a multi-second delta, and an
   unclamped integration jumps or explodes on the first frame back.
2. **Reset `last` on resume.** Starting a stopped loop without resetting the clock integrates the
   entire idle period.
3. **Snap on settle.** When the remaining distance is under an epsilon, assign the target exactly
   and stop the loop. The exponential tail never reaches zero, so without a snap the rAF runs
   forever for sub-pixel motion nobody can see.

## Step 8: reduced motion is a total kill switch

Not a slowdown, not a shorter duration. The CSS floor:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

That block does nothing for JavaScript timelines, rAF loops, canvas work, or a smooth-scroll
library. Query the media feature, listen for changes, and take one named strategy per effect:

| Strategy | Fits |
|---|---|
| Snap the easing constant to 1 | pointer followers, lenses, magnifiers: it still tracks, it just teleports |
| Kill the timeline, render the target state | timed sequences, glitch, looping ambience |
| Refuse new input, keep the render | splash and impulse effects |
| Pass a `reduced` uniform the shader branches on | canvas work with an authored still frame |

```js
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduced = mq.matches;
mq.addEventListener('change', () => { reduced = mq.matches; start(); });
const k = reduced ? 1 : 1 - Math.exp(-delta / tau);
```

Lenis and any smooth-scroll layer must be destroyed under reduced motion, not slowed. Verify in the
browser with devtools Rendering, "Emulate CSS media feature prefers-reduced-motion":

```js
document.getAnimations().filter(a => a.playState === 'running' &&
  (a.effect?.getTiming().duration || 0) > 1)      // must be empty
```

Canvas effects freeze at a still frame you chose by looking at it. `t = 0` is usually the least
composed frame the effect ever has.

## Checks before this skill is done

- [ ] The motion thesis exists in writing, and every animation on the surface traces to one of its four lines
- [ ] Exactly one authored focal moment, and no two sections enter identically
- [ ] Every duration falls in a range from the table, and every exit is faster than its entrance
- [ ] Zero `transition: all` and zero `transition-all` in the source
- [ ] Content is visible at rest with JavaScript disabled: the invisible-text query returns 0
- [ ] No rAF loop uses a fixed lerp factor; every one clamps delta and snaps on settle
- [ ] Reduced motion emulated in devtools: no running animations, rAF loops stopped, smooth scroll destroyed
- [ ] For every remaining animation you can finish the sentence "removing this would lose meaning or authored character"
