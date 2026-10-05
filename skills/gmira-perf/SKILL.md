---
name: gmira-perf
description: "Use when a page carries effects and needs a budget gate: bundle weight, Core Web Vitals, frame cost, images, fonts, and GPU teardown. Also use when a hero is slow to appear, when the phone gets hot, when a route change leaves a dead black canvas behind, when a later page's canvas silently renders nothing, when three.js turned up in the bundle for one component, when the LCP image is lazy-loaded, or when scroll feels heavy on a mid-range device. Owns the GPU floor from the doctrine Part 4, the WebGL context cap of roughly 16, and the rule that the effect mounts after content and never blocks first contentful paint. Includes the Lighthouse and Playwright recipes to measure each number rather than guess it."
---

# Perf

The budget gate. Every number here is measured on the built page, never estimated.

Load `../gmira/references/DOCTRINE.md` first. This skill owns Part 4 and gate G8.

## The premise

Performance is a design material, not only a constraint. Load time, first-frame time, and thermal
behavior have consequences the visitor can see and feel, so they are decisions. A hero that takes
1.4 seconds to appear is a design choice about what the first second looks like, whether or not
anyone made it on purpose.

## The page budget

| Budget | Floor | Read it from |
|---|---|---|
| First Load JS, per route | **200 KB gzipped**, and every KB above 120 has a name | `pnpm build` route table |
| LCP, mobile, throttled | **2.5s** | Lighthouse, or the observer below |
| INP | **200ms** | `event` timing in the page, Lighthouse cannot measure it |
| CLS | **0.1** | `layout-shift` observer |
| Effect layer frame cost | **8ms** of the 16.7ms at 60fps | Performance panel, or the rAF histogram |
| p95 frame time, target device | **16.7ms** | rAF histogram with 4x CPU throttle |
| Font families / weights | **3 families, 7 weights** total | `document.fonts` |
| Preloaded fonts | **1**, the one in the first viewport | count the `<link rel=preload as=font>` tags |
| LCP image | exactly one marked priority, never lazy | the snippets below |

## The GPU floor

Every row is a build check on a rendered canvas, not an intention. This is the doctrine's Part 4
verbatim, and `gmira-canvas` carries the code for each.

| Check | Floor |
|---|---|
| Frame budget | 16.7ms total at 60fps, **the effect layer gets at most 8ms**. Measure, do not estimate. |
| Pixel ratio | Cap at **1.5 full-bleed, 2.0 bounded**. Never pass raw `devicePixelRatio`: a DPR-3 phone renders 9x the pixels for no visible gain. |
| Shader precision | `highp` desktop, **`mediump` mobile**. Declared, never defaulted. |
| Simulation grids | sim <= **128**, dye or display texture <= **512** for full-bleed. Double only inside a bounded region. |
| Context loss | `webglcontextlost` listener is mandatory, with `preventDefault()` and a restore path. Without it, a backgrounded tab returns to a dead black rectangle. |
| Teardown | explicit `destroy()`: cancel the rAF, delete textures, framebuffers, programs, buffers, disconnect observers, remove listeners. |
| Offscreen | pause on `IntersectionObserver` exit and on `visibilitychange`. Battery and thermals are visible to the user as a hot phone. |
| Reduced motion | freeze at a **chosen** still frame, not at t=0. |
| Failure readability | everything the page says stays readable and operable **with the canvas deleted**. |
| First frame | never delays first contentful paint, never blocks on shader compile. |
| Weight | three.js is roughly 600 KB. Only when the specific component earns it. |

**One heavy effect per route.** Two fluid sims is not twice as impressive, it is a blown frame
budget and a warm phone.

## Bundle weight

| Package | Roughly | When |
|---|---|---|
| `framer-motion` | 35 KB gzipped | the default. Unlocks 29 of the 56 componentry components. |
| `lenis` | 3 KB gzipped | smooth scroll, best in class, cheap enough to be uncontroversial |
| `lucide-react` | about 1 KB gzipped per icon imported by name | `import { X } from 'lucide-react'` is fine. `import * as Icons` ships the whole set. |
| raw WebGL | 0 | `silk-aurora`, `webgl-liquid`, `liquid-chrome`, `closing-plasma` all need no library |
| `gsap` | roughly 70 KB minified | two components need it. Try WAAPI or framer-motion first. |
| `three` | roughly 600 KB minified | only when one named component earns it, never speculatively |

The cheap stack, and it reaches every non-three.js component in the arsenal including all four raw
WebGL heroes:

```bash
pnpm add framer-motion lenis lucide-react
```

Measure rather than trust this table on your own route:

```bash
pnpm build                       # read First Load JS per route from the output table
ANALYZE=true pnpm build          # per-module treemap, needs @next/bundle-analyzer
npx source-map-explorer '.next/static/chunks/*.js'
```

```
INCORRECT   `import * as THREE from 'three'` at module scope in a page component, so
            600 KB lands in the route bundle before a single line of copy exists.
CORRECT     the copy renders on the server; the effect is a client component behind
            next/dynamic with ssr:false, imported only when its container is near the
            viewport, so the route's First Load JS never carries it.
```

## Core Web Vitals, on an effects-heavy page

### LCP, target 2.5s

The LCP element is almost always the hero headline or the hero image. A canvas paint is not an LCP
candidate, which is exactly why a canvas can wreck LCP without appearing in the report: it competes
for the main thread and the network while the real LCP element waits.

What moves it here: a display font arriving late and repainting the headline, the LCP image not
preloaded or (worse) lazy-loaded, a shader compile on the main thread before first paint, and a
client component that blocks hydration of the section above the fold.

```js
new PerformanceObserver(l => { const e = l.getEntries().at(-1);
  console.log('LCP', Math.round(e.startTime), e.element) })
  .observe({ type: 'largest-contentful-paint', buffered: true });
```

Log `.element` every time. Half of LCP work is discovering that the LCP element is not what you
assumed.

### INP, target 200ms

The killers on this kind of page: a rAF loop doing more than 8ms of work per frame, a non-passive
scroll or pointer listener, a layout animation over a large subtree, and a synchronous
`getBoundingClientRect` read inside a handler that also writes style.

```js
new PerformanceObserver(l => { for (const e of l.getEntries())
  console.log('slow interaction', e.name, Math.round(e.duration), e.target) })
  .observe({ type: 'event', buffered: true, durationThreshold: 200 });

new PerformanceObserver(l => { for (const e of l.getEntries())
  console.log('long task', Math.round(e.duration)) })
  .observe({ type: 'longtask', buffered: true });
```

Lighthouse does not measure INP: it performs no interactions. Total Blocking Time is its proxy and
it is not the same number. Measure INP in the page, with a real click and a real scroll.

### CLS, target 0.1

Killers: a web font swapping to different metrics, images with no width and height, and a reveal
that animates height instead of transform.

```js
let cls = 0;
new PerformanceObserver(l => { for (const e of l.getEntries())
  if (!e.hadRecentInput) { cls += e.value; console.log('shift', e.value.toFixed(4), e.sources?.[0]?.node) } })
  .observe({ type: 'layout-shift', buffered: true });
```

Fixes: `next/font` (it generates the `size-adjust` and `ascent-override` fallback for you), explicit
`width`/`height` or an `aspect-ratio` on every image and canvas, and transforms rather than height
animation for reveals.

## Images

- **Format:** AVIF first, WebP fallback. `next/image` negotiates it.
- **Sizing:** the `sizes` attribute has to match the real layout, or the browser picks the largest
  candidate. `sizes="(min-width: 1024px) 33vw, 100vw"` for a three-up grid.
- **Priority:** exactly one image per route gets `priority`. Marking three defeats the purpose: they
  compete for the same connection and none of them wins.
- **Never lazy-load the LCP image.** `loading="lazy"` above the fold delays the discovery of the
  most important byte on the page until layout runs.

```js
// lazy images that are already in the first viewport
[...document.images].filter(i => i.loading === 'lazy' && i.getBoundingClientRect().top < innerHeight)

// images shipped far larger than they are painted
[...document.images].filter(i => {
  const w = i.getBoundingClientRect().width;
  return w > 0 && i.naturalWidth > w * Math.min(devicePixelRatio, 2) * 1.5;
}).map(i => ({ src: i.currentSrc.slice(-40), natural: i.naturalWidth, painted: Math.round(i.getBoundingClientRect().width) }))
```

## Fonts

- **Subset** to the ranges actually used. A full unsubset variable face runs well past 100 KB per
  file, and most of it is scripts the page never renders.
- **`font-display: swap`** for body faces. `optional` for a decorative face that must not shift the
  layout when it is late.
- **Preload exactly one face**, the one in the first viewport. Every extra preload competes with the
  LCP image for the same early bandwidth.
- **Max 3 families and 7 weights** across the whole page. A variable font counts as one file and
  usually beats four static weights outright.

```js
console.log(document.fonts.size, 'faces loaded');
console.table([...document.fonts].map(f => ({ family: f.family, weight: f.weight, style: f.style, status: f.status })));
console.log([...document.querySelectorAll('link[rel=preload][as=font]')].length, 'preloaded');
```

## The effect mounts after content

The effect must not block first contentful paint, and it must not exist in the route bundle before
it is needed.

```tsx
const Aurora = dynamic(() => import('./aurora'), { ssr: false, loading: () => null });

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '200px' });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} className="relative">
      <h1>...</h1>           {/* server-rendered, present at first paint */}
      {near && <Aurora />}   {/* client-only, arrives after */}
    </section>
  );
}
```

The composition has to be complete before the effect arrives, which is the same requirement Law 3
imposes for a different reason. If the section looks broken for the 400ms before the canvas mounts,
the canvas was carrying the composition.

## Route-change teardown and the context cap

Browsers cap live WebGL contexts at **roughly 16** per page. Chrome drops the oldest when you pass
it. **A leak does not throw and logs nothing.** A later canvas asks for a context, gets `null`, and
renders nothing, on a page that has no bug of its own. That is why teardown is on the floor table
and not in a nice-to-have section.

```js
// after navigating away and back 20 times, ask for fresh contexts
let ok = 0;
for (let i = 0; i < 8; i++) { const c = document.createElement('canvas'); if (c.getContext('webgl2')) ok++ }
console.log(`${ok}/8 fresh contexts available`);   // below 8 means you leaked
```

Run that last and reload afterwards, since the probe itself takes contexts. The paired test is
forcing a loss and confirming the restore path:

```js
const gl = document.querySelector('canvas').getContext('webgl2');
gl.getExtension('WEBGL_lose_context').loseContext();      // the page must recover, not go black
```

Teardown order, which `gmira-canvas` carries in full: flag destroyed, cancel rAF, disconnect
observers, remove listeners, restore any mutated DOM, delete textures, framebuffers, programs,
shaders, buffers, then null the refs. In React this is the effect's return function and it must run
on every dependency change, not only on unmount.

## The measurement recipes

### Lighthouse

```bash
npx lighthouse http://localhost:3000 --preset=desktop --only-categories=performance \
  --output=json --output-path=.gmira/perf/desktop.json --quiet
npx lighthouse http://localhost:3000 --form-factor=mobile --only-categories=performance \
  --output=json --output-path=.gmira/perf/mobile.json --quiet
```

Read `audits['largest-contentful-paint'].numericValue`, `audits['cumulative-layout-shift']`,
`audits['total-blocking-time']`, and `audits['unused-javascript']`. Run against a production build,
never the dev server: the dev bundle is not the artifact anybody ships.

### The frame histogram, with a mid-range device simulated

```js
const client = await page.context().newCDPSession(page);
await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });   // roughly a mid-range phone
await page.goto(url);
await page.mouse.move(600, 400);                                    // wake pointer-driven effects
const deltas = await page.evaluate(() => new Promise(res => {
  const d = []; let last = performance.now(), n = 0;
  const tick = t => { d.push(t - last); last = t; ++n < 300 ? requestAnimationFrame(tick) : res(d) };
  requestAnimationFrame(tick);
}));
const s = deltas.slice(5).sort((a, b) => a - b);
console.log('p50', s[s.length >> 1].toFixed(1), 'p95', s[Math.floor(s.length * 0.95)].toFixed(1));
```

p95 above 16.7ms at 4x throttle means the effect is too expensive for the device half your traffic
uses. Simplify it, bound it to a smaller region, or drop the pixel ratio before touching anything
else.

### Isolating the effect layer's share

Record 300 frames with the canvas present, then with `canvas { display: none }` injected, and take
the difference in p50. That difference is the effect layer's cost, and the floor is 8ms.

## Checks before this skill is done

- [ ] First Load JS read from a production build, under budget, and every package above 30 KB has a named reason
- [ ] three.js is absent, or one named component justifies it in writing
- [ ] LCP element identified by logging `.element`, and it is the one you intended
- [ ] LCP under 2.5s on the mobile Lighthouse run, CLS under 0.1, no long task above 200ms on load
- [ ] INP measured in the page with real interactions, not inferred from Total Blocking Time
- [ ] Exactly one priority image, zero lazy images in the first viewport, no image shipped above 1.5x its painted size
- [ ] At most 3 font families, 7 weights, and one preloaded face
- [ ] The effect mounts after content, is behind a dynamic import, and the composition is complete without it
- [ ] p95 frame time under 16.7ms at 4x CPU throttle, effect layer share under 8ms
- [ ] 20 route changes then 8/8 fresh WebGL contexts still available
- [ ] Forced context loss recovers instead of going black
