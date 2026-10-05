---
name: gmira-canvas
description: "Use when authoring, integrating, or auditing any canvas or WebGL surface on a website: shader backgrounds, fluid and particle effects, html-in-canvas (drawElement) effects that displace live DOM, scroll-driven GPU work, and generative visuals. Also use when a canvas effect is slow, heats the device, renders black after a tab switch, breaks on mobile, disappears under reduced motion, or leaks GPU memory on route change. Owns the GPU performance floor and the canvas accessibility fallback."
---

# Canvas

The GPU floor. Impeccable ships numeric floors for type, color, layout, and motion, and none for
GPU work. These are ours, and they are checks on the built result.

Load `../gmira/references/DOCTRINE.md` (Part 4 is this floor).
Code for every pattern below: `../gmira/references/canvas-primitives.md` (14 lifted primitives)
and `../gmira/references/canvas-craft-rules.md`.

## Decide before you shade

Three questions, answered in writing, before a single line of GLSL.

1. **What does this effect communicate?** Not "it looks premium". Displacement reads as *material
   under pressure*. Flow fields read as *current*. Dithering reads as *print and limited palette*.
   Chrome reads as *metal*. Particles read as *quantity*. If the answer is only "movement", cut it.
2. **What is on screen at frame 0, with no input?** Law 3 of the doctrine. Pointer-driven effects
   are invisible in the state most visitors see. Pick one: seed it on mount along a designed path,
   give it autonomous idle motion, or accept it is a reward for interaction and make the
   composition complete without it.
3. **Is it bounded or full-bleed?** Full-bleed forces the effect quiet enough not to fight text,
   which is how it ends up reading as a filter someone left on. **A bounded region running at full
   strength reads as intent.** Prefer the panel, the masked band, the single figure.

## The floor

Every one of these is a build check, not an intention.

| Check | Floor | How to verify |
|---|---|---|
| Frame budget | Effect layer <= **8ms**, of the 16.7ms at 60fps | Performance panel, or an rAF delta histogram over 300 frames |
| Pixel ratio | **1.5** full-bleed, **2.0** bounded. Never raw `devicePixelRatio` | Read back `canvas.width / rect.width` |
| Precision | `highp` desktop, **`mediump` mobile**, declared not defaulted | grep the shader source for `precision` |
| Sim grids | sim <= 128, dye or display <= 512 full-bleed | read the options |
| Context loss | `webglcontextlost` listener with `preventDefault()` and a restore path | force it with `WEBGL_lose_context` |
| Teardown | explicit `destroy()`: cancel rAF, delete textures, framebuffers, programs, buffers, disconnect observers, remove listeners | navigate away and back 20 times, watch context count |
| Offscreen | pause on `IntersectionObserver` exit and on `visibilitychange` | scroll away, confirm rAF stops |
| Reduced motion | freeze at a **chosen** still frame | toggle the media query, look at the frame |
| Failure readability | everything the page says is readable and operable **with the canvas element deleted** | delete it in devtools |
| First frame | never blocks first contentful paint, never blocks on shader compile | Lighthouse, or mount after content |
| Weight | three.js is roughly 600 KB, only for a component that earns it | check the bundle |

Browsers cap live WebGL contexts at roughly **16**. A leak does not error, it silently makes every
later canvas fail. That is why teardown is on this list and not in a nice-to-have section.

## Non-negotiable code shape

### The self-stopping RAF machine

A loop that runs forever is a bug, not a default. It must stop when nothing is changing.

```
INCORRECT   const loop = () => { draw(); requestAnimationFrame(loop) }; loop()
CORRECT     idempotent start(), a `running` flag, stop() when settled or offscreen,
            lastTime reset on resume so there is no catch-up jump, delta clamped to 1/30,
            snap-to-target when within epsilon, and a `wake` closure the input handler calls.
```

Clamping delta matters: a backgrounded tab returns with a multi-second delta and an unclamped
simulation explodes on the first frame back.

### DPR sizing, done once

```js
const dpr = Math.min(window.devicePixelRatio || 1, 2);   // never unclamped
const w = Math.round(rect.width * dpr), h = Math.round(rect.height * dpr);
if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
```

The guard is not a micro-optimization: **writing `canvas.width` at all clears the drawing buffer and
resets GL state**, so an unguarded write inside a resize handler produces a flicker on every
scrollbar appearance.

Options authored in CSS pixels get multiplied by DPR **only at the uniform boundary**, never at
author time. Otherwise the effect changes size between a laptop and a phone.

### Cleanup that actually releases

```
cancelAnimationFrame  ->  deleteTexture x N  ->  deleteFramebuffer x N
->  deleteProgram / deleteShader  ->  deleteBuffer  ->  observer.disconnect()
->  removeEventListener  ->  null the refs
```

React: this is the effect's return function, and it must run on every dependency change, not only
unmount.

### Reduced motion is a kill switch, not a slowdown

Four valid strategies, pick per effect and say which: snap easing factors to 1, kill the timeline
and render the target state, refuse pointer input but keep the render, or pass a `reduced` uniform
the shader branches on.

**Freeze the clock at a time value you chose by looking at it.** `t = 0` is usually the least
composed frame the effect ever has.

### The fallback is the content, not a placeholder

```
INCORRECT   canvas fails -> show a static gradient image
CORRECT     the DOM content was never inside the canvas. The canvas is an overlay that
            is `aria-hidden` and `pointer-events: none`. Deleting it changes nothing
            about what the page says or what a visitor can do.
```

Test by deleting the element, never by trusting a fallback branch.

## html-in-canvas (`drawElement`)

The `@canvas-ui` family hosts real DOM inside `<canvas layoutsubtree>`, captures it with
`ctx.drawElementImage(content, 0, 0)` on `onpaint`, uses that as a GL texture, and shades it
through a `pointer-events: none` output canvas. Text stays selectable and links stay clickable.

Two facts that decide whether you can use it:

- It needs **Chrome or Edge 140+ with `chrome://flags/#canvas-draw-element`**, or a production
  origin trial token. Everywhere else it falls back to a WebGL overlay over ordinary DOM.
- Feature detection must be SSR-safe or it hydration-mismatches. The correct shape:
  `useSyncExternalStore(emptySubscribe, supportsHtmlInCanvas, () => false)`. The server snapshot
  returns `false`.

**Design for the fallback, treat the native path as the upgrade.** The reverse ships a site that
looks unfinished to almost everyone.

Drag-driven effects fight the DOM: when content is real DOM, a drag is a text selection. Drive from
`pointermove` with no button held, or set `user-select: none` and only on text nobody would copy.

## Where the effect goes, per mode

| Mode | Effect budget |
|---|---|
| Persuade | Highest. One heavy effect, in the first viewport, bounded. |
| Experience | Highest. The effect may be the content. |
| Read | Low. Nothing animated inside the measure. |
| Operate | Near zero. **A checkout with a fluid background is a bug.** Spend the budget on input latency and state coverage. |

**One heavy component per page.** Two fluid sims on one route is not twice as impressive, it is a
dropped frame budget and a hot phone.

Never put a lens, refraction, or displacement effect over a form field. The control has to be
legible while it is being used.

## Effect vocabulary, mapped to meaning

Reach past transform and opacity. Each of these communicates something specific:

| Technique | Reads as | Good for |
|---|---|---|
| Displacement / refraction | material under pressure, glass, depth | product hero, gallery |
| Flow field / advection | current, direction, time passing | data movement, process |
| Dither / quantize | print, limited palette, deliberate constraint | editorial, technical, retro |
| Chrome / anisotropic reflection | metal, weight, manufacture | automotive, hardware |
| Feedback buffer | persistence, trail, memory | motion history, energy |
| SDF morph | one thing becoming another | brand transitions, state change |
| Particle advection | quantity, swarm, scale | population, throughput |
| ASCII / glyph atlas | terminal, machine reading | developer and technical culture |
| Ordered dither on photography | print reproduction, grain | fashion, editorial photography |

Pick the one whose meaning matches the brief. If two are equally apt, take the cheaper one.

## Checks before this skill is done

- [ ] Every row of the floor table verified on the built page, not assumed
- [ ] The frame-0 question answered explicitly, and the answer is visible in the composition
- [ ] `destroy()` exists, is called, and 20 route changes do not grow the context count
- [ ] Canvas deleted in devtools: the page still says everything and does everything
- [ ] Reduced motion produces a still frame that was chosen by looking at it
- [ ] One heavy effect on the route, not two
- [ ] The effect's meaning matches the brief, and you can say what it is in one sentence
