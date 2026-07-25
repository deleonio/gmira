# chanhdai.com

Source: `C:\Users\oasrvadmin\Documents\md-stack\gmira\_sources\chanhdai.com`
Live: https://chanhdai.com | Registry: https://chanhdai.com/r/{name}.json | License: MIT
Author: Nguyen Chanh Dai (ncdai), Design Engineer. Self-description in README: "A pixel-perfect dev portfolio and shadcn registry showcasing my work as a Design Engineer."

---

## 1. What it is + install path

A single Next.js 16 app that is simultaneously three products: a personal portfolio, an MDX blog + component-docs site, and a **public shadcn registry** with 61 items. There is no monorepo. `src/registry/` is authored by hand, a Bun script transforms it, and `public/r/*.json` is served from the same deploy.

```
chanhdai.com/
├── src/app/          60 files. Route groups: (app) (llms) (preview) (rss)
├── src/components/   140 files. TWO shadcn trees: ui/ (Radix) and base/ui/ (Base UI)
├── src/registry/     241 files. Hand-authored source + generated transformed/ + __index__.tsx
├── src/features/     150 files. doc | blog | portfolio | sponsor
├── src/config/       site.ts, registry.ts, json-ld.ts
├── src/styles/       globals.css (618) typeset.css (499) scroll-fade-effect.css (111) style-preview.css (14)
├── registry.json     GENERATED, 1663 lines, never hand-edited
└── public/r/         62 generated JSON files
```

### Install pattern

`registry.json`: `"$schema": "https://ui.shadcn.com/schema/registry.json"`, `"name": "ncdai"`, `"homepage": "https://chanhdai.com/components"`, 61 items, every one carrying `"author": "ncdai <dai@chanhdai.com>"`.

Consumer side:

```bash
npx shadcn@latest add @ncdai/apple-hello-effect
npx shadcn@latest add https://chanhdai.com/r/elastic-slider.json
```

His own `components.json` is the interesting part. It is a **hub wired to six registries**, including a licensed one with header auth and a competitor's chart library:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": true, "tsx": true,
  "tailwind": { "config": "", "css": "src/styles/globals.css", "baseColor": "zinc", "cssVariables": true },
  "iconLibrary": "lucide",
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" },
  "registries": {
    "@ncdai":       "https://chanhdai.com/r/{name}.json",
    "@shadcncraft": { "url": "https://shadcncraft.com/r/{style}/{name}",
                      "headers": { "X-License-Key": "${SHADCNCRAFT_LICENSE_KEY}",
                                   "X-Instance-Name": "${SHADCNCRAFT_INSTANCE_NAME}" } },
    "@kibo-ui":     "https://kibo-ui.com/r/{name}.json",
    "@react-bits":  "https://reactbits.dev/r/{name}.json",
    "@soundcn":     "https://soundcn.xyz/r/{name}.json",
    "@bklit":       "https://ui.bklit.com/r/{name}.json"
  }
}
```

`.mcp.json` is four lines and gives the agent the shadcn MCP server:

```json
{ "mcpServers": { "shadcn": { "command": "npx", "args": ["shadcn@latest", "mcp"] } } }
```

`CLAUDE.md` is **12 bytes**: `@AGENTS.md`. One source of truth, imported.

Build pipeline (`package.json`):

```json
"build":             "pnpm registry:build && next build",
"registry:build":    "bun run ./src/scripts/build-registry.mts && shadcn build",
"registry:validate": "shadcn registry validate ./public/r/registry.json"
```

`AGENTS.md` states the generated-file boundary in caps:

> **NEVER EDIT** auto-generated outputs of `pnpm registry:build`: `registry.json`, `src/registry/__index__.tsx`, `src/registry/transformed/`, `public/r/*.json`

and the five-step add-a-component ritual: create in `src/registry/components/[name]/`, register in the matching `_registry.ts`, create an example in `src/registry/examples/`, run `pnpm registry:build`, add docs MDX in `src/features/doc/content/components/` (category derived from the folder, not frontmatter).

---

## 2. Full registry inventory

61 items: 38 `registry:component`, 11 `registry:block`, 9 `registry:style`, 2 `registry:hook`, 1 `registry:lib`.

### Components

| # | name | title | what | files | deps | registryDeps | category |
|---|---|---|---|---|---|---|---|
| 1 | `theme-switcher` | Theme Switcher | System/light/dark toggle for Next.js | `theme-switcher.tsx` | next-themes, motion | | controls |
| 2 | `text-flip` | Text Flip | Cycles children with y+blur flip | `text-flip.tsx` | motion | | text-effects |
| 3 | `apple-hello-effect` | Apple Hello Effect | SVG handwriting "hello" via pathLength | `apple-hello-effect-english.tsx` | motion | | text-effects |
| 4 | `apple-hello-effect-hindi` | + Hindi | same, नमस्ते | `-hindi.tsx` | motion | | text-effects |
| 5 | `apple-hello-effect-spanish` | + Spanish | same, hola | `-spanish.tsx` | motion | | text-effects |
| 6 | `apple-hello-effect-vietnamese` | + Vietnamese | same, xin chao | `-vietnamese.tsx` | motion | | text-effects |
| 7 | `wheel-picker` | Wheel Picker | iOS wheel with inertia + infinite loop | `wheel-picker.tsx` | @ncdai/react-wheel-picker | | controls |
| 8 | `chevrons-up-down-icon` | (no title) | Icon morphing up/down | `chevrons-up-down-icon.tsx` | motion | | effects |
| 9 | `typography` | Typography | **CSS only.** `prose-ncdai` utility | none | devDep @tailwindcss/typography | | typography |
| 10 | `work-experience` | Work Experience | Collapsible role list with logos | `work-experience.tsx` | react-markdown, date-fns | collapsible, separator, `chevrons-up-down-icon`, `typography` | marketing |
| 11 | `shimmering-text` | Shimmering Text | Per-character color sweep | `shimmering-text.tsx` | motion | | text-effects |
| 12 | `slide-to-unlock` | Slide to Unlock | iPhone slide gesture, compound API | `slide-to-unlock.tsx` | motion | `shimmering-text` | controls |
| 13 | `testimonials-marquee` | Testimonials Marquee | **No files.** Pure composition | none | | `@kibo-ui/marquee`, `testimonial` | marketing |
| 14 | `testimonial` | Testimonial | Author, avatar, verified badge | `testimonial.tsx` | | | marketing |
| 15 | `github-stars` | GitHub Stars | Star count + full-count tooltip | `github-stars.tsx` | | button, tooltip | data-display |
| 16 | `scroll-fade-effect` | Scroll Fade Effect | 29-line wrapper over a CSS scroll-timeline mask | `scroll-fade-effect.tsx` | | | effects |
| 17 | `consent-manager` | Consent Manager | c15t cookie banner | `consent-manager.tsx` | @c15t/nextjs | button | utilities |
| 18 | `copy-button` | Copy Button | Clipboard with visual + haptic + audio | `copy-button.tsx`, `use-copy-to-clipboard.ts` | motion, @rexa-developer/tiks, web-haptics | button, `icon-swap` | utilities |
| 19 | `code-block-command` | Code Block Command | Install command with pm switcher | `code-block-command.tsx`, `tabs.tsx` | @base-ui/react, motion, jotai | `icon-swap`, `copy-button` | data-display |
| 20 | `testimonial-spotlight` | Testimonial Spotlight | Hover spotlight card | `testimonial-spotlight.tsx` | | `testimonial` | marketing |
| 21 | `glow-card-grid` | Glow Card Grid | Pointer-driven blurred icon glow + mask-composite border | `glow-card-grid.tsx` | | | effects |
| 22 | `middle-truncation` | Middle Truncation | Binary-search pixel truncation | `middle-truncation.tsx` | | | typography |
| 23 | `twemoji` | Twemoji | Unicode to Twemoji SVG inline | `twemoji.tsx`, `lib/twemoji-regex.ts` | | | typography |
| 24 | `elastic-slider` | Elastic Slider | Rubber-band drag + magnetic decile snap | `elastic-slider.tsx` (565 LOC) | motion | `use-controllable-state` | controls |
| 25 | `contribution-graph` | Contribution Graph | GitHub-style calendar | `contribution-graph.tsx` (521) | date-fns | | data-display |
| 26 | `github-contributions` | GitHub Contributions | Year of activity + tooltips | `github-contributions.tsx`, `lib/get-cached-contributions.ts` | date-fns | tooltip, spinner, `contribution-graph` | data-display |
| 27 | `toc-minimap` | TOC Minimap | Hoverable dash minimap with sound | `toc-minimap.tsx` | | hover-card, `@soundcn/u-mini-map-open` | navigation |
| 28 | `fluid-gradient-text` | Fluid Gradient Text | SVG text, gradient x1 springs to pointer | `fluid-gradient-text.tsx` | motion | | text-effects |
| 29 | `brand-assets-menu` | Brand Assets Menu | Right-click to copy brand SVG | `brand-assets-menu.tsx` | @rexa-developer/tiks | context-menu, sonner | menus |
| 30 | `icon-swap` | Icon Swap | 31-line scale+blur+fade AnimatePresence | `icon-swap.tsx` | motion | | effects |
| 31 | `dot-grid-spotlight` | Dot Grid Spotlight | Canvas dot grid, cursor spotlight | `dot-grid-spotlight.tsx` | | | effects |
| 32 | `spinning-circular-text` | Spinning Circular Text | **Zero JS.** trig in CSS custom properties | `spinning-circular-text.tsx` | | | text-effects |
| 33 | `mobius-loop-icon` | Mobius Loop Icon | Morphs circles to infinity | `mobius-loop-icon.tsx` | motion | | effects |
| 34 | `logos-carousel` | Logos Carousel | Column-by-column staggered wave | `logos-carousel.tsx` | motion | | marketing |
| 35 | `testimonial-2` | Testimonial 2 | Quote + attribution + source | `testimonial-2.tsx` | | | marketing |
| 36 | `line-nav` | Line Nav | Line marker that grows 24 to 40px | `line-nav.tsx` | motion | | navigation |
| 37 | `share-menu` | Share Menu | Copy link, X, LinkedIn, native sheet | `share-menu.tsx` | | button, dropdown-menu, sonner | menus |
| 38 | `spotlight-logo` | Spotlight Logo | Cursor gradient traces the SVG stroke + press morph + metal click | `spotlight-logo.tsx` | motion | `@soundcn/metal-click` | effects |

### Hooks and lib

| name | type | files |
|---|---|---|
| `haptic` | registry:lib | `lib/haptic/haptic.ts` -> `@lib/haptic.ts` |
| `use-sound` | registry:hook | `hooks/sound/use-sound.ts`, `lib/sound/sound-engine.ts`, `lib/sound/sound-types.ts` |
| `use-controllable-state` | registry:hook | `hooks/use-controllable-state/use-controllable-state.tsx` |

### Blocks

| name | title | files | registryDeps | createdAt |
|---|---|---|---|---|
| `login-01` | Login 01 | `page.tsx` -> `app/login/page.tsx`, `login-form.tsx` | button, card, input, label, field | 2026-02-22 |
| `hero-01` | Hero 01 | `hero-01.tsx`, `hero-01-icons.tsx` | button, `style` | 2026-03-12 |
| `blog-01` | Blog 01 | `blog-01.tsx`, `article-item.tsx` | button | 2026-03-13 |
| `blog-02` | Blog 02 (lined grid) | `blog-02.tsx`, `article-item.tsx` | button, `style` | 2026-03-18 |
| `testimonials-01` | Dual marquees | `testimonials-01.tsx`, `testimonial-list.tsx` | kibo-ui marquee, `testimonial-spotlight` | 2026-03-20 |
| `testimonials-02` | Lined layout | `testimonials-02.tsx`, `testimonial-list.tsx` | kibo-ui marquee, `style`, `testimonial` | 2026-03-29 |
| `experience-01` | Lined work experience | `experience-01.tsx` | `style`, `work-experience` | 2026-03-28 |
| `team-01` | Glowing cards | `team-01.tsx` | `glow-card-grid` | 2026-03-30 |
| `metrics-01` | Metrics + line chart | `metrics-01.tsx`, `metric.tsx` | **`@bklit/line-chart`**, `style` | 2026-05-24 |
| `social-links-01` | Lined grid | `social-links-01.tsx` | `style` | 2026-06-16 |
| `social-proof-01` | Logos carousel | `social-proof-01.tsx` | `logos-carousel` | 2026-06-26 |

Blocks carry `meta.previewClassName` so the preview iframe frames them correctly, for example `"min-h-svh content-center-safe"`.

### Styles (CSS-only registry items)

| name | ships |
|---|---|
| `style` | `--color-line` token + `screen-line-top` / `screen-line-bottom` utilities |
| `thin-scrollbar` | 5px webkit scrollbar + `scrollbar-width: thin` |
| `theme-toggle-effect-triangle` | View Transition mask `m20 0 20 35H0z`, `scale 0.7s`, `mask-size: 300vmax` |
| `theme-toggle-effect-triangle-blur` | same + `feGaussianBlur stdDeviation=1` |
| `theme-toggle-effect-circle` | `<circle r=20>`, `1s`, `200vmax` |
| `theme-toggle-effect-circle-blur` | `<circle r=18 blur=2>`, plus explicit `.dark::view-transition-new(root)` |
| `theme-toggle-effect-circle-blur-top-left` | origin at `top left / 0`, `mask-origin: content-box`, `350vmax` |
| `theme-toggle-effect-polygon` | no mask, `@keyframes reveal-dark` / `reveal-light` with `clip-path: polygon(...)` |
| `theme-toggle-effect-polygon-gradient` | `M0 0H40L0 40V0Z` with a `linearGradient` mask, `1.5s` |

All seven share one easing token:

```
--expo-out: linear(0 0%, 0.1684 2.66%, 0.3165 5.49%, 0.446 8.52%, 0.5581 11.78%,
  0.6535 15.29%, 0.7341 19.11%, 0.8011 23.3%, 0.8557 27.93%, 0.8962 32.68%,
  0.9283 38.01%, 0.9529 44.08%, 0.9711 51.14%, 0.9833 59.06%, 0.9915 68.74%, 1 100%)
```

Nine categories for components (`src/config/registry.ts`): text-effects, typography, effects, controls, menus, navigation, marketing, data-display, utilities. Three for blocks: marketing, application, ecommerce.

### Non-registry components worth knowing about

`src/components/charts/` is a **19-file vendored subset of bklit-ui** (chart-context, chart-reveal-clip, use-mount-progress, grid, line, line-chart, x-axis, time-series-chart-shell, tooltip/*), used by the insights panel. `src/components/daikanoid/` is a full Breakout clone (11 files + its own CSS) at `/game`. `src/components/react-bits/electric-border.tsx` (427 LOC) and `magnet.tsx` are vendored from reactbits. `src/components/duck-follower/`, `command-menu.tsx` (706 LOC), `toc.tsx` (274), `icons.tsx` (702).

---

## 3. Deep dives

### 3.1 Apple Hello: handwriting is two paths and `pathLength`

`src/registry/components/apple-hello-effect/apple-hello-effect-english.tsx`, 85 lines total. The entire effect is `pathLength: 0 -> 1` on **two** motion paths, hand-split so the h-stem finishes before the rest of the word starts.

```tsx
const initialProps: TargetAndTransition = { pathLength: 0, opacity: 0 }
const animateProps: TargetAndTransition = { pathLength: 1, opacity: 1 }

export function AppleHelloEffectEnglish({ className, durationScale = 1, onAnimationComplete, ...props }) {
  const calc = (x: number) => x * durationScale

  return (
    <motion.svg
      className={cn("h-20", className)} viewBox="0 0 638 200"
      fill="none" stroke="currentColor" strokeWidth="14.8883" strokeLinecap="round"
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} {...props}
    >
      <title>hello</title>

      {/* h1 */}
      <motion.path d="M8.69214 166.553C36.2393 151.239 ..."
        initial={initialProps} animate={animateProps}
        transition={{ duration: calc(0.8), ease: "easeInOut", opacity: { duration: 0.4 } }} />

      {/* h2, ello */}
      <motion.path d="M55.1624 181.135C60.6251 133.114 ..."     // one 2.5kB path for the rest
        initial={initialProps} animate={animateProps}
        transition={{ duration: calc(2.8), ease: "easeInOut", delay: calc(0.7),
                      opacity: { duration: 0.7, delay: calc(0.7) } }}
        onAnimationComplete={onAnimationComplete} />
    </motion.svg>
  )
}
```

Details that make it feel right: `stroke="currentColor"` so it inherits theme with no props; `strokeLinecap="round"` gives the pen-nib ends; opacity is animated on a **different, shorter** curve than pathLength so the stroke does not pop in; the second path starts at `delay: 0.7` while the first is still running at `0.8`, a deliberate 0.1s overlap; `durationScale` is one number that scales the whole choreography through `calc()`; the SVG has a real `<title>hello</title>` so screen readers get the word.

### 3.2 Spotlight logo: a gradient stroke drawn twice

`src/registry/components/spotlight-logo/spotlight-logo.tsx`. The technique is stated in the file's own doc comment: define the outline **once** in `<defs>`, then `<use>` it twice, second time with a radial-gradient stroke whose center springs toward the pointer.

```tsx
const cx = useSpring(useTransform(mouseX, [0, 1], [0, 556]), { stiffness: 300, damping: 30, mass: 0.1 })
const cy = useSpring(useTransform(mouseY, [0, 1], [0, 354]), { stiffness: 300, damping: 30, mass: 0.1 })

useEffect(() => {
  if (shouldReduceMotion || !isInView) return
  if (window.matchMedia("(hover: none)").matches) return       // do not run on touch
  const handleMouseMove = (e: MouseEvent) => {
    mouseX.set(e.clientX / window.innerWidth)                   // normalized to viewport, not element
    mouseY.set(e.clientY / window.innerHeight)
  }
  window.addEventListener("mousemove", handleMouseMove)
  return () => window.removeEventListener("mousemove", handleMouseMove)
}, [shouldReduceMotion, isInView, mouseX, mouseY])
```

```tsx
<defs>
  <pattern id={ids.facePattern} width="10" height="10" patternUnits="userSpaceOnUse">
    <path d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2" stroke="var(--pattern)" strokeWidth="1" />
  </pattern>

  <motion.path id={ids.stroke}
    variants={{ normal:  { d: [/* 12 subpaths */].join("") },
                pressed: { d: [/* the same 12, each shifted */].join("") } }}
    transition={transition} />

  <motion.radialGradient id={ids.radialGradient} cx={cx} cy={cy} r="200" gradientUnits="userSpaceOnUse">
    <stop className="dark:[stop-color:#fff]" stopColor="var(--color-zinc-700)" />
    <stop className="dark:[stop-color:var(--color-zinc-600)]" offset="1"
          stopColor="var(--color-zinc-400)" stopOpacity="0" />
  </motion.radialGradient>
</defs>

<use href={`#${ids.faceFill}`} className="fill-background" />
<use href={`#${ids.faceFill}`} fill={`url(#${ids.facePattern})`} />
<use href={`#${ids.stroke}`} stroke="var(--stroke)" />
<use href={`#${ids.stroke}`} stroke={`url(#${ids.radialGradient})`} />
```

Theme hooks are local variables declared on the root element, not global tokens:

```tsx
className="h-auto w-full touch-manipulation
  [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))]
  [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]"
```

`useId()` namespaces every `<defs>` id so two instances on one page do not collide. `whileTap="pressed"` morphs `d` on all paths at once through shared variant names, and `onTap={() => play()}` fires a metal click from the `@soundcn` registry. The whole thing is inert on touch devices, out of view, and under reduced motion.

### 3.3 Dot grid spotlight: canvas, but rAF-gated to one draw per frame

`src/registry/components/dot-grid-spotlight/dot-grid-spotlight.tsx`. Falloff is linear in distance and drives radius, color, and alpha at once.

```tsx
const draw = () => {
  ctx.clearRect(0, 0, width, height)
  const offsetX = (width % spacing) / 2         // center the grid in the leftover space
  const offsetY = (height % spacing) / 2

  for (let x = offsetX; x <= width; x += spacing) {
    for (let y = offsetY; y <= height; y += spacing) {
      const dx = x - mouse.current.x, dy = y - mouse.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      let currentRadius = baseRadius, currentColor = dotColor, currentAlpha = 1.0
      if (mouse.current.isActive && distance < interactionRadius) {
        const factor = 1 - distance / interactionRadius
        currentRadius = baseRadius + (activeRadius - baseRadius) * factor
        currentColor = activeDotColor
        currentAlpha = activeMinAlpha + (activeMaxAlpha - activeMinAlpha) * factor
      }
      ctx.globalAlpha = currentAlpha
      ctx.beginPath(); ctx.arc(x, y, currentRadius, 0, Math.PI * 2)
      ctx.fillStyle = currentColor; ctx.fill()
    }
  }
  ctx.globalAlpha = 1.0                          // always restore
}
```

Three infrastructure moves: mouse position lives in a `useRef` (no React re-render on move); redraw is coalesced through a single rAF slot (`if (renderFrameId === null)`); DPR scaling on resize plus a fade-in gate so you never see the first unscaled paint.

```tsx
const dpr = window.devicePixelRatio || 1
canvas.width = width * dpr; canvas.height = height * dpr
canvas.style.width = `${width}px`; canvas.style.height = `${height}px`
ctx.scale(dpr, dpr)
draw()
requestAnimationFrame(() => { canvas.dataset.ready = "true" })
```
```tsx
className="pointer-events-auto absolute inset-0 block opacity-0
           transition-opacity! duration-500 data-[ready=true]:opacity-100"
```

A `ResizeObserver` on `canvas.parentElement` (not the canvas, which sizes itself) drives resize.

### 3.4 Glow card grid: pointer state pushed into CSS variables, effects done in CSS

`src/registry/components/glow-card-grid/glow-card-grid.tsx`. React writes two numbers per card. CSS does everything else.

```tsx
useEffect(() => {
  const handlePointerMove = (event: PointerEvent) => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll<HTMLElement>("[data-slot='glow-card']")
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const x = (event.clientX - centerX) / (rect.width / 2)     // -1 .. 1
      const y = (event.clientY - centerY) / (rect.height / 2)
      card.style.setProperty("--pointer-x", x.toFixed(3))
      card.style.setProperty("--pointer-y", y.toFixed(3))
    })
  }
  document.addEventListener("pointermove", handlePointerMove)
  return () => document.removeEventListener("pointermove", handlePointerMove)
}, [])
```

Every tunable is a CSS variable set on the grid, so a consumer can restyle without touching JS:

```tsx
style={{
  "--card-radius": `${cardRadius}px`,
  "--card-icon-blur": `${iconBlur}px`, "--card-icon-saturate": iconSaturate,
  "--card-icon-brightness": iconBrightness, "--card-icon-scale": iconScale,
  "--card-icon-opacity": iconOpacity,
  "--card-border-width": `${borderWidth}px`, "--card-border-blur": `${borderBlur}px`,
  "--card-border-saturate": borderSaturate, "--card-border-brightness": borderBrightness,
  "--card-border-contrast": borderContrast,
} as React.CSSProperties}
```

The glow is the card's own avatar, scaled 4x and blurred 25px, translated by the pointer using **container query units** so the travel scales with the card:

```tsx
"translate-x-[calc(var(--pointer-x,-10)*50cqi)] translate-y-[calc(var(--pointer-y,-10)*50cqh)] translate-z-0 scale-(--card-icon-scale)",
"blur-(--card-icon-blur) brightness-(--card-icon-brightness) saturate-(--card-icon-saturate)",
"opacity-(--card-icon-opacity) will-change-[transform,filter]"
```

Defaults of `-10` park the glow far off-card before the first pointer event. `translate-z-0` forces a compositing layer. The glowing border is a `mask-composite` ring, a border-box mask minus a padding-box mask, so a `backdrop-filter` applies only in the 3px border band:

```tsx
className={cn(
  "pointer-events-none absolute inset-0 translate-z-0 rounded-(--card-radius)",
  "border-(length:--card-border-width) border-solid border-transparent",
  "backdrop-blur-(--card-border-blur) backdrop-brightness-(--card-border-brightness) backdrop-contrast-(--card-border-contrast) backdrop-saturate-(--card-border-saturate)",
  "[clip-path:inset(0_round_var(--card-radius))]")}
style={{
  maskImage: "linear-gradient(#fff 0 100%), linear-gradient(#fff 0 100%)",
  maskOrigin: "border-box, padding-box",
  maskClip:   "border-box, padding-box",
  maskComposite: "exclude", WebkitMaskComposite: "xor",
} as React.CSSProperties}
```

### 3.5 Scroll fade: a 29-line component over a CSS scroll-driven animation

The component is trivial:

```tsx
export function ScrollFadeEffect({ className, orientation = "vertical", ...props }) {
  return (
    <div data-orientation={orientation}
      className={cn(
        "data-[orientation=horizontal]:overflow-x-auto data-vertical:overflow-y-auto",
        "data-[orientation=horizontal]:scroll-fade-effect-x data-vertical:scroll-fade-effect-y",
        className)}
      {...props} />
  )
}
```

The whole effect is `src/styles/scroll-fade-effect.css`. Four registered custom properties are animated by `animation-timeline: scroll(self)`, and the mask uses `mask-composite: exclude` so the two gradients cut into a solid third layer.

```css
@property --top-mask-height    { syntax: "<length>"; inherits: true; initial-value: 0px; }
@property --bottom-mask-height { syntax: "<length>"; inherits: true; initial-value: 64px; }

@keyframes show-top-mask    { to { --top-mask-height: var(--mask-height); } }
@keyframes hide-bottom-mask { to { --bottom-mask-height: 0px; } }

@utility scroll-fade-effect-y {
  --mask-height: 64px; --mask-offset-top: 0px; --mask-offset-bottom: 0px; --scroll-buffer: 2rem;

  mask-image:
    linear-gradient(to top, transparent, black 90%),
    linear-gradient(to bottom, transparent 0%, black 100%),
    linear-gradient(black, black);
  mask-size: 100% var(--top-mask-height), 100% var(--bottom-mask-height), 100% 100%;
  mask-repeat: no-repeat, no-repeat, no-repeat;
  mask-position: 0 var(--mask-offset-top), 0 calc(100% - var(--mask-offset-bottom)), 0 0;
  mask-composite: exclude;

  animation-name: show-top-mask, hide-bottom-mask;
  animation-timeline: scroll(self), scroll(self);
  animation-range: 0 var(--scroll-buffer), calc(100% - var(--scroll-buffer)) 100%;
  animation-fill-mode: both;
}
```

Two animations with **different ranges**: the top fade appears in the first 2rem of scroll, the bottom fade disappears in the last 2rem. Zero JS, zero scroll listeners. `globals.css` declares `@custom-variant supports-timeline-scroll` for the feature check.

### 3.6 Spinning circular text: trigonometry in CSS custom properties

`src/registry/components/spinning-circular-text/spinning-circular-text.tsx`. No JS math, no measurement, no effect. `sin()` in CSS solves the radius from character count and spacing.

```tsx
style={{
  "--sc-size": fontSize,
  "--sc-char-count": text.length,
  "--sc-char-spacing": charSpacing,
  "--sc-inner-angle": "calc((360 / var(--sc-char-count)) * 1deg)",
  "--sc-radius-factor": "calc(var(--sc-char-spacing) / sin(var(--sc-inner-angle)))",
  "--sc-radius": "calc(var(--sc-radius-factor) * -1ch)",
  "--sc-container-size": "calc(var(--sc-radius-factor) * var(--sc-size) * 2)",
} as React.CSSProperties}
```

Each character gets one index variable and the transform chain composes the placement:

```tsx
<div className={cn(
  "relative animate-spin-ccw text-(size:--sc-size) leading-none",
  "*:absolute *:top-1/2 *:left-1/2 *:inline-block",
  "*:[--sc-char-rotate:calc(var(--sc-inner-angle)*var(--sc-char-index))]",
  "*:transform-[translate(-50%,-50%)_rotate(var(--sc-char-rotate))_translateY(var(--sc-radius))]",
  spinClassName)} aria-hidden>
  {text.split("").map((char, index) => (
    <span key={index} style={{ "--sc-char-index": index } as React.CSSProperties}>
      {renderChar ? renderChar(char, index) : char}
    </span>
  ))}
</div>
<span className="sr-only">{text}</span>
```

The radius is in `ch` units, so it tracks the actual monospace advance width instead of a guessed pixel value. `renderChar` is the extension point (wrap a char in `motion.span` for per-character effects) and the doc comment says positioning is already handled. `spinClassName` exists purely so a consumer can override `duration-[10s]` without forking. The animation itself is a theme keyframe:

```css
--animate-spin-ccw: spin-ccw var(--tw-animation-duration, var(--tw-duration, 6s)) linear infinite;
@keyframes spin-ccw { to { rotate: -360deg; } }
```

### 3.7 Elastic slider: named constants for every feel decision

`src/registry/components/elastic-slider/elastic-slider.tsx`, 565 lines. Every tuning number has a name and a comment.

```ts
// Drag detection & rubber band
const CLICK_THRESHOLD = 3
const DEAD_ZONE = 32
const MAX_CURSOR_RANGE = 200
const MAX_STRETCH = 8

// Layout offsets used by the "handle dodges label/value" calculation.
const HANDLE_BUFFER = 8
const LABEL_OFFSET = 12 + 4
const VALUE_OFFSET = 12 - 8

// Magnetic snap to the nearest decile when within 3.125% of it.
function snapToDecile(rawValue: number, min: number, max: number): number {
  const normalized = (rawValue - min) / (max - min)
  const nearest = Math.round(normalized * 10) / 10
  if (Math.abs(normalized - nearest) <= 0.03125) return min + nearest * (max - min)
  return rawValue
}
```

Rubber band is `sqrt` falloff past a dead zone, so overdrag decelerates the way iOS does:

```ts
const computeRubberStretch = useCallback((clientX: number, sign: number) => {
  const rect = wrapperRectRef.current
  if (!rect) return 0
  const distancePast = sign < 0 ? rect.left - clientX : clientX - rect.right
  const overflow = Math.max(0, distancePast - DEAD_ZONE)
  return sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1))
}, [])
```

Click versus drag is distance-based, not timing-based, and coarse sliders get different snap behavior from continuous ones:

```ts
if (isClickRef.current && Math.hypot(dx, dy) > CLICK_THRESHOLD) {
  isClickRef.current = false
  setIsDragging(true)
}
// ...
// Coarse sliders (<=10 positions) snap to the nearest step;
// continuous sliders keep the decile-magnetic behavior.
const discreteSteps = (max - min) / step
const snapped = discreteSteps <= 10
  ? clamp(min + Math.round((rawValue - min) / step) * step, min, max)
  : snapToDecile(rawValue, min, max)
```

Two accessibility and correctness details most sliders miss. The focus ring is separated from the active state:

```ts
/** Ring only for Tab focus or keyboard value nudges, not pointer press/drag. */
const [keyboardFocusRing, setKeyboardFocusRing] = useState(false)
```

and the wrapper rect plus its CSS transform scale are snapshotted on pointer-down, so mid-drag layout shifts or a scaled ancestor do not corrupt the math:

```ts
const rect = wrapper.getBoundingClientRect()
wrapperRectRef.current = rect
scaleRef.current = rect.width / wrapper.offsetWidth
// later: const sceneX = (clientX - rect.left) / scaleRef.current
```

Value updates go through `fillPercent.jump()` (a motion value, imperative, no re-render) while React state holds only the rounded public value.

### 3.8 Slide to unlock: compound component sharing one MotionValue

`src/registry/components/slide-to-unlock/slide-to-unlock.tsx`. Four parts (`SlideToUnlock`, `Track`, `Text`, `Handle`) share `x` through context. The label opacity is a derived transform, not state.

```tsx
const x = useMotionValue(0)
const fadeDistance = handleWidth
const textOpacity = useTransform(x, [0, fadeDistance], [1, 0])

const handleDragEnd = useCallback(() => {
  setIsDragging(false)
  const trackWidth = trackRef.current?.offsetWidth || 0
  const maxX = trackWidth - handleWidth
  if (x.get() >= maxX) onUnlock?.()
  else animate(x, 0, { type: "spring", bounce: 0, duration: 0.25 })
}, [x, onUnlock, handleWidth])
```

```tsx
<motion.div data-slot="handle" style={{ width, x, ...style }}
  drag="x" dragConstraints={trackRef} dragElastic={0} dragMomentum={false}
  onDragStart={onDragStart} onDragEnd={onDragEnd} {...props} />
```

`dragElastic={0}` and `dragMomentum={false}` are correct here: an unlock affordance must not overshoot or coast. The text slot takes a **render function** so consumers can react to drag state without lifting it:

```tsx
children: JSX.Element | ((props: { isDragging: boolean }) => JSX.Element)
// <SlideToUnlockText>
//   {({ isDragging }) => <span>{isDragging ? "Release..." : "Slide to unlock"}</span>}
// </SlideToUnlockText>
```

Every part carries `data-slot` (`slide-to-unlock`, `track`, `text`, `handle`) and `data-dragging`, so styling hooks exist without prop drilling. The context hook throws by name if used outside the root.

### 3.9 Middle truncation: binary search on measured pixel width

`src/registry/components/middle-truncation/middle-truncation.tsx`. CSS cannot truncate in the middle, so this measures with a **singleton** canvas context and binary-searches the character count.

```ts
let cachedCanvas: HTMLCanvasElement | null = null
let cachedCtx: CanvasRenderingContext2D | null = null
function getCanvas(): CanvasRenderingContext2D {
  if (!cachedCtx) {
    cachedCanvas = document.createElement("canvas")
    const ctx = cachedCanvas.getContext("2d")
    if (!ctx) throw new Error("Failed to get 2d context from canvas")
    cachedCtx = ctx
  }
  return cachedCtx
}
function getComputedFont(el: HTMLElement) {
  const cs = window.getComputedStyle(el)
  return `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
}
```

```ts
// Strategy 1: Fixed end (always preserve exactly X chars at the end)
const endStr = text.slice(-end)
const available = containerW - measureText(ellipsis + endStr, font)
let lo = 0, hi = text.length - end
while (lo < hi) {
  const mid = Math.ceil((lo + hi) / 2)
  if (measureText(text.slice(0, mid), font) <= available) lo = mid
  else hi = mid - 1
}
return text.slice(0, lo) + ellipsis + endStr
```

Debounce is combined with rAF so the recalculation lands on a paint boundary:

```ts
function debounceWithRAF<Args extends unknown[], Return = void>(fn: (...a: Args) => Return, delay: number) {
  let timeoutId, rafId
  return (...args: Args): void => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    if (rafId !== undefined) cancelAnimationFrame(rafId)
    timeoutId = setTimeout(() => { rafId = requestAnimationFrame(() => fn(...args)) }, delay)
  }
}
```

The public API encodes mutual exclusion in the type system, so `end` and `minEnd` cannot both be passed:

```ts
export type MiddleTruncationProps = BaseProps &
  ( { end: number;    minEnd?: never }
  | { minEnd: number; end?: never }
  | { end?: never;    minEnd?: never } )
```

Uses `useLayoutEffect` (measure before paint), reads the **computed** font off the real element rather than taking a font prop, and always sets `title={children}` so the full string stays available.

### 3.10 Logos carousel: staggered wave, gated on page and viewport visibility

`src/registry/components/logos-carousel/logos-carousel.tsx`. The stagger constant carries its rationale in the comment.

```ts
/** How long each logo stays visible before cycling to the next one (ms). */
const CYCLE_INTERVAL = 1600
/**
 * Delay between adjacent columns within a single wave (ms). Kept smaller than
 * the enter/exit duration so neighbouring transitions overlap into a ripple.
 */
const STAGGER_DELAY = 125
const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const
```

```tsx
const reduceMotion = useReducedMotion() ?? false
const isPageInView = usePageInView()                             // document visibility
const isInView = useInView(containerRef, { margin: "100px" })     // element visibility
const shouldPlay = !reduceMotion && isPageInView && isInView
```

Three independent gates. Columns are round-robin distributed, and `direction` only remaps the wave index, not the layout:

```ts
function distributeLogos(logos: ReactNode[], columnCount: number): ReactNode[][] {
  const effectiveCount = Math.min(columnCount, logos.length)
  const columns = Array.from({ length: effectiveCount }, () => [] as ReactNode[])
  logos.forEach((logo, index) => { columns[index % effectiveCount].push(logo) })
  return columns
}
const waveIndex = direction === "rtl" ? columns.length - 1 - columnIndex : columnIndex
const swapDelay = reduceMotion ? 0 : waveIndex * (STAGGER_DELAY / 1000)
```

The current column list is mirrored into a ref that updates on every render, so the interval effect depends only on `shouldPlay` and never resets mid-wave:

```tsx
const columnsRef = useRef(columns)
useEffect(() => { columnsRef.current = columns })
useEffect(() => {
  if (!shouldPlay) return
  const beatId = setInterval(() => setActiveIndices((prev) =>
    columnsRef.current.map((column, i) => ((prev[i] ?? 0) + 1) % column.length)), CYCLE_INTERVAL)
  return () => clearInterval(beatId)
}, [shouldPlay])
```

Enter and exit are asymmetric (enter from `translateY(60%)` with `blur(2px)`, exit to `translateY(-50%)` with `blur(3px)`), which reads as continuous upward flow rather than a bounce.

### 3.11 Line nav: the marker is the layout

`src/registry/components/line-nav/line-nav.tsx`. Widths live in a JS object that is also fed to CSS so the connector segments match the marker exactly.

```ts
const lineVariants = { normal: { width: 24 }, active: { width: 40 }, hover: { width: 40 } }
```
```tsx
<nav className={cn("flex flex-col gap-2 py-5.25", className)}
  style={{ "--line-nav-width": `${lineVariants.normal.width}px` } as React.CSSProperties}>
```
```tsx
<motion.a aria-current={active ? "page" : undefined}
  className="group relative flex h-px items-center gap-3 after:absolute after:top-1/2 after:left-0 after:size-full after:-translate-y-1/2 after:p-3.5"
  initial={false} animate={active ? "active" : "normal"} whileHover="hover">
  <motion.span
    className="block h-px shrink-0 bg-foreground/20 transition-[background-color] ease-out group-hover:bg-foreground group-aria-[current=page]:bg-foreground"
    variants={lineVariants} transition={{ type: "spring", stiffness: 200, damping: 20 }} />
  <span className="text-sm whitespace-nowrap text-muted-foreground transition-[color] ease-out group-hover:text-foreground group-aria-[current=page]:text-foreground">
    {title}
  </span>
</motion.a>
{!isLast && (<><span className="block h-px w-(--line-nav-width) bg-foreground/20" />
              <span className="block h-px w-(--line-nav-width) bg-foreground/20" /></>)}
```

The anchor is literally `h-px`, and the ::after pseudo-element with `p-3.5` supplies a comfortable 28px hit target without changing layout. Active styling is driven by `aria-current="page"` via `group-aria-[current=page]:`, so the accessible attribute is the styling source of truth. `initial={false}` prevents an animation on first paint. The comment explains the framework-agnostic choice:

```
Rendered as a plain anchor to stay framework-agnostic. For client-side
navigation in Next.js, swap `motion.a` for `motion.create(Link)`.
```

### 3.12 TOC minimap: intersection observer tuned to read like a reading position

`src/registry/components/toc-minimap/toc-minimap.tsx`. Dash width encodes heading depth; the hover card is the full TOC.

```tsx
data-depth={item.depth} data-active={item.url === `#${activeHeading}`}
className={cn(
  "h-0.5 w-6 shrink-0 rounded-xs bg-ring/50 transition-[background-color] duration-200",
  "data-[depth=3]:ml-2 data-[depth=3]:w-4",
  "data-[depth=4]:ml-4 data-[depth=4]:w-2",
  "data-active:bg-foreground")}
```

The observer config is the whole trick:

```ts
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) if (entry.isIntersecting) setActiveId(entry.target.id)
}, { rootMargin: "0% 0% -80% 0%", threshold: 0.98 })
```

`-80%` bottom margin shrinks the detection zone to the top fifth of the viewport, so the active heading is the one you are actually reading, not the last one to touch the bottom edge. `threshold: 0.98` means it must be essentially fully inside that band. The trigger fades to `opacity-0` when the card opens (`data-popup-open:opacity-0`), a crossfade rather than a pop. Opening plays a sound from `@soundcn`.

---

## 4. Structural choices: what makes it feel personal, not templated

### Page composition: one column, panels, separators

`src/app/(app)/page.tsx` is a flat list. No hero, no grid, no cards. Fifteen panels stacked with striped separators between them.

```tsx
<div className="[--separator-height:--spacing(8)] **:data-[slot=panel]:scroll-mt-[calc(var(--header-height)+var(--separator-height))]">
  <div className="mx-auto md:max-w-3xl">
    <ProfileHeader />       <Separator />
    <Overview />
    <SocialLinks />
    <GitHubContributions /> <Separator />
    <Hello />               <Separator />
    <Testimonials />        <Separator />
    <Components />          <Separator />
    <Blog />                <Separator />
    <TechStack />           <Separator />
    <Experiences />         <Separator />
    <Education />           <Separator />
    <Projects />            <Separator />
    <Awards />              <Separator />
    <Certifications />      <Separator />
    <Bookmarks />           <Separator />
    <Suspense fallback={<InsightsSkeleton />}><Insights /></Suspense>
    <Separator />
    <Sponsors />
  </div>
</div>
```

Note the scroll offset is computed **from the separator variable**, so anchor landings stay correct if the rhythm changes. The separator is diagonal stripes bleeding to the viewport edges:

```tsx
function Separator({ className }) {
  return <div className={cn("stripe-divider h-(--separator-height) w-full border-x border-line", className)} />
}
```

### The screen-line system

The visual signature of the whole site is one idea, shipped as the `style` registry item so anyone can install it:

```css
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
  &:before { content: ""; @apply bg-inherit bg-[linear-gradient(to_right,var(--line)_4px,transparent_2px)] bg-size-[6px_1px] bg-repeat-x; }
}
@utility diagonal-stripes {
  @apply [--pattern-foreground:var(--color-line)]/56;
  @apply bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px];
}
@utility stripe-divider {
  @apply relative h-8;
  &:before { content: ""; @apply absolute left-[-100vw] -z-1 h-full w-[200vw] diagonal-stripes; }
}
```

A `200vw` pseudo-element offset `-100vw` makes every rule run edge to edge regardless of container width, at `-z-1` so it sits behind content. The line color is deliberately softer than the border:

```css
--line: color-mix(in oklab, var(--border) 64%, var(--background));
```

and in `.dark` it is **commented out on purpose** so it inherits the same formula against the dark background.

The `Panel` primitive applies the system:

```tsx
function Panel(props) {
  return <section data-slot="panel"
    className={cn("screen-line-top screen-line-bottom border-x border-line", className)} {...props} />
}
function PanelHeader(props) {
  return <header data-slot="panel-header"
    className={cn("screen-line-bottom has-data-[slot=panel-description]:*:data-[slot=panel-title]:screen-line-bottom", className)} {...props} />
}
function PanelTitle({ asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : "h2"
  return <Comp data-slot="panel-title"
    className={cn("group/panel-title font-heading text-3xl font-medium tracking-tight text-balance", className)} {...props} />
}
```

That `has-data-[slot=panel-description]:*:data-[slot=panel-title]:screen-line-bottom` is the design rule "the title gets its own rule only when there is a description below it", expressed as a selector instead of a prop.

Blocks apply the same grammar with nth-child modifiers so the row rules only draw on the first item of each row at each breakpoint:

```tsx
<li className={cn(
  "max-sm:screen-line-top max-sm:screen-line-bottom",
  "sm:max-md:nth-[2n+1]:screen-line-top sm:max-md:nth-[2n+1]:screen-line-bottom",
  "md:nth-[3n+1]:screen-line-top md:nth-[3n+1]:screen-line-bottom")}>
```

with a separate absolutely positioned column-rule layer behind:

```tsx
<div className="pointer-events-none absolute inset-0 -z-1 hidden gap-2 sm:grid sm:grid-cols-2 md:grid-cols-3">
  <div className="border-r border-line" />
  <div className="border-l border-line md:border-x" />
  <div className="border-l border-line max-md:hidden" />
</div>
```

### Typography stack

`src/lib/fonts.ts`: Geist Sans, Geist Mono, IBM Plex Serif (400 only, `display: swap`, serif fallback). Variables are re-aliased so components reference generic names:

```ts
export const fontVariables = cn(fontSans.variable, fontMono.variable, fontSerif.variable,
  "[--font-sans:var(--font-geist-sans)]", "[--font-mono:var(--font-geist-mono)]")
```

`--font-heading` is set to `var(--font-sans)`, which is a real decision: one family, weight and tracking carry the hierarchy. Mono has an explicit feature set:

```css
--default-mono-font-feature-settings: "ss11" 1, "zero" 1, "tnum" 1;
```

(stylistic set 11, slashed zero, tabular numerals).

Prose is handled twice, on purpose. `prose-ncdai` extends `@tailwindcss/typography` for MDX:

```css
@utility prose-ncdai {
  @apply prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-pretty md:prose-headings:text-balance prose-h2:text-xl prose-h3:text-lg;
  @apply prose-a:font-normal prose-a:wrap-break-word prose-a:text-foreground prose-a:link-underline;
  @apply prose-code:rounded-md prose-code:border prose-code:bg-muted/50 prose-code:px-1 prose-code:py-px prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none retina:prose-code:border-[0.5px];
  @apply prose-strong:font-medium;
  @apply prose-hr:border-line;
  @apply prose-blockquote:border-l prose-blockquote:border-line prose-blockquote:font-normal prose-blockquote:text-muted-foreground prose-blockquote:not-italic ...;
  @apply prose-ul:marker:text-xs/none;
}
```

Note `retina:prose-code:border-[0.5px]` and the custom variant behind it. That is the pixel-perfect claim made literal:

```css
@custom-variant retina { @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2x) { @slot; } }
```

Separately, `src/styles/typeset.css` (499 lines) vendors shadcn/typeset, a token-driven prose system with a scoped opt-out:

```css
.typeset {
  --typeset-font-body: inherit; --typeset-font-heading: var(--font-heading); --typeset-font-mono: var(--font-mono);
  --typeset-size: 1em; --typeset-leading: 1.75; --typeset-flow: 1.25em;
}
.typeset { font-size: calc(var(--typeset-size) * 1.125); margin-trim: block-start;
  @media (min-width: 48rem), print { font-size: var(--typeset-size); } }

.typeset *:not(:where(.not-typeset, [data-not-typeset], .not-typeset *, [data-not-typeset] *)) {
  &:where(p) { margin-block-start: var(--typeset-flow); margin-block-end: 0; }
  &:where(h2) { font-size: 1.25em; line-height: 1.4; margin-block-start: calc(var(--typeset-flow) * 1.4); }
  /* Headings own the space below them. */
  &:where(h1 + *, h2 + *, h3 + *, h4 + *, h5 + *, h6 + *) { margin-block-start: 1em; }
}
```

Every rule is `&:where(...)` at zero specificity, all margins are `margin-block-start` only (single-direction rhythm), the flow unit is one variable, and `.not-typeset` / `[data-not-typeset]` is the escape hatch. Instances retune by variable: `.typeset-description { --typeset-size: 15px; --typeset-leading: 1.6; --typeset-flow: 1em; }`.

### Theming

Base color zinc, all values `oklch`, each with a comment naming the Tailwind step. `@custom-variant dark (&:where(.dark, .dark *))` uses `:where()` so dark mode adds no specificity. Two custom variants beyond that: `retina` and `supports-timeline-scroll`.

Chart tokens (17 of them, `--chart-1..5`, `--chart-background/foreground/crosshair/grid/tooltip-*/marker-*/label`) exist in the site's own `globals.css` because the vendored bklit charts consume them.

The most interesting theming file is 14 lines:

```css
/* @scope cuts this style off at any `.style-isolate` subtree (other than its own wrapper)
   so a preview can override the document-default style without bleed. */
@scope (.style-preview) to (.style-isolate) {
  :scope {
    --chart-background: var(--background);
    --chart-foreground: var(--foreground);
    --chart-crosshair: var(--ring);
    --chart-grid: var(--line);
    --chart-tooltip-background: var(--popover);
    ...
  }
}
```

`@scope ... to ...` gives a real donut-shaped style boundary for component previews, which normally requires an iframe.

Theme switching runs through the View Transition API, with the effect chosen by which `theme-toggle-effect-*` registry style you installed. The toggle itself is deliberately un-clever, `next-themes` plus a meta-color update plus a hotkey plus a click sound:

```tsx
const switchTheme = () => {
  const next = resolvedTheme === "dark" ? "light" : "dark"
  click()
  setTheme(next === systemTheme ? "system" : next)   // collapses back to "system" when it matches
  setMetaColor(resolvedTheme === "dark" ? META_THEME_COLORS.light : META_THEME_COLORS.dark)
}
useHotkeys("d", () => switchTheme())
```
```tsx
<MoonIcon className="hidden [html.dark_&]:block" aria-hidden />
<SunMediumIcon className="hidden [html.light_&]:block" aria-hidden />
<span className="absolute size-12 pointer-fine:hidden" aria-hidden />   {/* touch hit area */}
```

### Data layer: content is typed TypeScript modules

There is **no CMS and no `src/data/`**. Portfolio content is typed modules under `src/features/portfolio/data/`, each with a matching type in `../types/`:

| file | lines | holds |
|---|---:|---|
| `user.ts` | 66 | the whole identity object |
| `social-links.ts` | 52 | keyed `SOCIAL` registry + derived `SOCIAL_LINKS` array |
| `experiences.tsx` | 270 | 5 companies, nested positions, markdown descriptions |
| `projects.ts` | 240 | 12 projects |
| `certifications.ts` | 181 | 21 certificates |
| `education.ts` | 79 | 3 schools |
| `awards.tsx` | 291 | 26 awards (JSX for rich prose) |
| `bookmarks.tsx` | 182 | 22 curated links |
| `tech-stack.tsx` | 413 | 32 technologies with inline icon JSX |
| `testimonials.tsx` | 473 | 49 testimonials split into two marquee rows |
| `github-contributions.ts` | 25 | `unstable_cache` fetch, 86400s revalidate |
| `insights.ts` | 52 | `unstable_cache` OpenPanel overview, 86400s revalidate |

`.tsx` where entries need JSX, `.ts` where they do not. That is the reason the tech stack and awards can carry inline SVGs and links with no serialization layer.

`USER` is the single identity source; everything derives from it:

```ts
export const USER: User = {
  firstName: "Chánh Đại", lastName: "Nguyễn", displayName: "Chánh Đại", username: "ncdai",
  pronouns: "he/him",
  bio: "Creating with code. Small details matter.",
  flipSentences: [
    "Creating with code. Small details matter.",
    "Design Engineer.", "Open source contributor.", "I own a vintage iPhone.",
  ],
  address: "Ho Chi Minh City, Viet Nam",
  phoneNumberB64: "Kzg0Nzc3ODg4MTQ4",     // E.164, base64 encoded (spam protection)
  emailB64: "ZGFpQGNoYW5oZGFpLmNvbQ==",
  jobTitle: "Design Engineer",
  jobs: [ { title: "Design Engineer", company: "shadcncraft", experienceId: "shadcncraft" },
          { title: "Founder", company: "Quaric", experienceId: "quaric" } ],
  avatar: "...chanhdai-avatar-ghibli.webp",
  avatarVariants: { lightOff: "...", lightOn: "...", darkOff: "...", darkOn: "..." },
  timeZone: "Asia/Ho_Chi_Minh",
  dateCreated: "2023-10-20",
}
```

`src/config/site.ts` derives everything downstream:

```ts
export const SITE_INFO = { name: USER.displayName, url: process.env.NEXT_PUBLIC_APP_URL || "https://chanhdai.com",
                           ogImage: USER.ogImage, description: USER.bio, keywords: USER.keywords }
export const X_HANDLE = SOCIAL.x.handle
export const GITHUB_USERNAME = SOCIAL.github.handle
export const META_THEME_COLORS = { light: "#ffffff", dark: "#09090b" }
```

Docs content is MDX under `src/features/doc/content/{blog,components}/`, 14 posts and 33 component docs, with **category derived from the folder** rather than frontmatter. One data layer serves both: `getAllDocs`, `getDocBySlug`, `getDocsByCategory`, `getBlogPosts`, `getComponentDocs`, `findNeighbour`.

### Machine-readable surface

`/llms.txt` is generated from the same data layer at build time:

```ts
const allComponents = getComponentDocs()
const allPosts = getBlogPosts()
const content = `# chanhdai.com

> A pixel-perfect dev portfolio and shadcn registry showcasing my work as a Design Engineer.

- [About](${SITE_INFO.url}/about.md): ...
- [Experience](${SITE_INFO.url}/experience.md): ...
## Components
${allComponents.map((i) => `- [${i.metadata.title}](${SITE_INFO.url}/components/${i.slug}.mdx): ${i.metadata.description}`).join("\n")}
## Blog
${allPosts.map((i) => `- [${i.metadata.title}](${SITE_INFO.url}/blog/${i.slug}.mdx): ${i.metadata.description}`).join("\n")}
`
export const revalidate = false
export const dynamic = "force-static"
```

Plus `/llms-full.txt`, `/about.md`, `/experience.md`, `/projects.md`, `/awards.md`, `/certifications.md`, `/vcard`, three RSS feeds, `/og/*` dynamic images, and content negotiation so any doc URL returns raw markdown when asked:

```ts
{ source: "/:section(blog|components)/:slug.mdx", destination: "/doc.mdx/:slug" },
{ source: "/:section(blog|components)/:slug", destination: "/doc.mdx/:slug",
  has: [{ type: "header", key: "accept", value: "(?<accept>.*text/markdown.*)" }] },
```

JSON-LD uses stable `@id` anchors so the `Person` node is defined once in the root layout and referenced by `@id` from the profile page rather than duplicated.

`next.config.ts` keeps a `LEGACY_BLOG_COMPONENT_SLUGS` array of 30 slugs generating permanent `/blog/<slug>` to `/components/<slug>` redirects, from when component docs used to be blog posts. Nothing published ever 404s.

### Icon-library agnosticism

Registry components use `IconPlaceholder`, which names the same icon in five libraries and resolves whichever the consumer configured:

```tsx
<IconPlaceholder
  lucide="ArrowUpRightIcon" tabler="IconArrowUpRight" hugeicons="ArrowUpRight03Icon"
  phosphor="ArrowUpRightIcon" remixicon="RiArrowRightUpLine"
  className="size-4 shrink-0 text-muted-foreground" />
```

```tsx
export function IconPlaceholder(props: { [K in IconLibraryName]: string } & React.ComponentProps<"svg">) {
  const iconName = props[iconLibrary]
  if (!iconName) return null
  return (
    <Suspense fallback={<SquareIcon {...props} />}>
      {iconLibrary === "lucide" && <IconLucide name={iconName} {...props} />}
      {/* tabler | hugeicons | phosphor | remixicon */}
    </Suspense>
  )
}
// Preload all icon renderer modules so switching libraries is instant.
void import("@/registry/icons/icon-lucide")
void import("@/registry/icons/icon-tabler")
// ...
```

with a per-library promise-cache loader using React `use()`:

```tsx
export function createIconLoader(libraryName: string) {
  const cache = getCache(libraryName)
  return function IconLoader({ name, strokeWidth = 2, ...props }) {
    if (!cache.has(name)) {
      cache.set(name, import(`./__${libraryName}__`).then((mod) => mod[name] || null))
    }
    const iconData = use(cache.get(name)!)
    if (!iconData) return null
    if (isIconData(iconData)) return <HugeiconsIcon icon={iconData} strokeWidth={2} {...props} />
    const IconComponent = iconData
    return <IconComponent {...props} />
  }
}
```

The `shadcn build` step runs `transformIcons` from `shadcn/utils`, so the published registry JSON contains the consumer's library, not his.

### Import order as architecture

`.prettierrc` encodes the layering with `@ianvs/prettier-plugin-sort-imports`. The order is a dependency-direction statement:

```json
"importOrder": [
  "^(react/(.*)$)|^(react$)", "^(next/(.*)$)|^(next$)", "<THIRD_PARTY_MODULES>", "",
  "^types$", "^@/types/(.*)$", "^@/config/(.*)$", "^@/lib/(.*)$", "^@/hooks/(.*)$",
  "^@/components/ui/(.*)$", "^@/components/(.*)$", "^@/registry/(.*)$",
  "^@/styles/(.*)$", "^@/app/(.*)$", "^@/features/(.*)$", "", "^[./]"
]
```
```json
"semi": false, "printWidth": 80, "trailingComma": "es5",
"tailwindFunctions": ["clsx", "cn", "cva"],
"tailwindStylesheet": "./src/styles/globals.css"
```

`pnpm-workspace.yaml` sets `minimumReleaseAge: 1440` (24 hours) as a supply-chain guard, with `shadcn` and `@base-ui/*` excluded so his own toolchain can move fast.

---

## 5. Craft rules extracted

**Effects**

1. Reach for CSS before JS. Scroll fade is `animation-timeline: scroll(self)` with `@property`-registered custom properties, zero listeners. Circular text is `sin()` in `calc()`, zero measurement. Theme transitions are the View Transition API with an SVG mask.
2. When you do need JS, its only job is writing numbers into CSS variables (`--pointer-x`, `--pointer-y`), and CSS does the rendering.
3. Never re-render for pointer position. Use `useRef` plus canvas, or `setProperty` on the element, or a `MotionValue`.
4. Coalesce redraws into a single rAF slot: `if (rafId === null) rafId = requestAnimationFrame(...)`.
5. Gate ambient animation on three signals: `useReducedMotion()`, `usePageInView()` (tab visibility), `useInView(ref, { margin })` (viewport).
6. Disable pointer-tracking effects on touch: `window.matchMedia("(hover: none)").matches`.
7. Define an SVG shape once in `<defs>`, `<use>` it multiple times with different paint. Namespace ids with `useId()`.
8. Morph SVG `d` between two variants for press states, rather than transforming the element.
9. Asymmetric enter and exit reads as flow. Enter from `+60%` with `blur(2px)`, exit to `-50%` with `blur(3px)`.
10. Fade in canvas after the first correctly scaled paint: `data-ready="false"` plus `opacity-0 data-[ready=true]:opacity-100`.
11. `mask-composite: exclude` with border-box and padding-box mask origins produces a ring you can apply a `backdrop-filter` to. That is how you get a glowing border without a pseudo-element hack.
12. Use container query units (`50cqi`, `50cqh`) so effect travel scales with the element.

**Interaction**

13. Name every feel constant and comment the reason: `CLICK_THRESHOLD = 3`, `DEAD_ZONE = 32`, `STAGGER_DELAY = 125` "kept smaller than the enter/exit duration so neighbouring transitions overlap into a ripple".
14. Rubber band with `sqrt` falloff past a dead zone.
15. Distinguish click from drag by distance (`Math.hypot(dx, dy) > 3`), not by time.
16. Snapshot `getBoundingClientRect()` and the element's CSS scale (`rect.width / offsetWidth`) on pointer-down; do all later math against the snapshot.
17. Separate the focus ring from the active state. Ring on Tab and keyboard nudges, not on pointer press.
18. Change behavior with granularity: coarse sliders (10 steps or fewer) snap to step, continuous ones snap magnetically to deciles within 3.125 percent.
19. `dragElastic={0}` and `dragMomentum={false}` for affordances that must not overshoot.
20. Add invisible hit area with an absolutely positioned pseudo-element or `<span>`, never by changing layout: `after:size-full after:p-3.5`, or `absolute size-12 pointer-fine:hidden`.

**API design**

21. Encode mutual exclusion in the type union (`{ end: number; minEnd?: never } | { minEnd: number; end?: never }`), not in a runtime warning.
22. Every prop gets a JSDoc with `@defaultValue`. This repo is consistent about it, and the docs site auto-generates prop tables from those comments.
23. One scalar that scales the whole choreography (`durationScale`, applied through a local `calc()` helper).
24. Ship a `renderX` extension point (`renderChar`, `renderPattern`) and a `xClassName` override slot (`spinClassName`) so consumers extend rather than fork.
25. Compound components share one `MotionValue` through context; the context hook throws by name.
26. Render-function children when a child needs parent state: `children: JSX.Element | ((p: { isDragging: boolean }) => JSX.Element)`.
27. `data-slot` on every part and `data-*` for every state. That is the styling contract.
28. Style from the accessible attribute: `group-aria-[current=page]:text-foreground`, so a11y and appearance cannot diverge.
29. Ship the a11y fallback next to the decorative render: `aria-hidden` on the animated glyphs, `<span className="sr-only">{text}</span>` alongside.
30. Explain the framework-agnostic choice in a comment when you deliberately use `<a>` over `<Link>`.

**Structure**

31. Compose the page as a flat list of panels with an explicit separator component. No nesting, no grid.
32. Ship the visual signature as a token plus two utilities (`--color-line`, `screen-line-top`, `screen-line-bottom`), then apply it everywhere with `nth-[3n+1]:` and `has-*:` variants.
33. Bleed rules to the viewport with a `200vw` pseudo-element at `left-[-100vw]` and `-z-1`.
34. Derive the anchor scroll offset from the layout variables that create it.
35. One font family for body and headings; carry hierarchy with weight and tracking. Add a serif only for accents.
36. Two prose systems is fine if they serve different jobs: a Tailwind Typography extension for MDX, a token-driven variable system for arbitrary rich content.
37. Zero-specificity prose (`&:where(...)`), single-direction margins, one flow variable, and a `.not-typeset` escape hatch.
38. `@scope (.a) to (.b)` for preview isolation without an iframe.
39. Dark mode as `&:where(.dark, .dark *)` so it adds no specificity.
40. Custom variants for real physical conditions: `retina`, `supports-timeline-scroll`, `pointer-fine`.

**Content and distribution**

41. Content is typed TypeScript modules. `.tsx` when entries need JSX, `.ts` when they do not. One `USER` object is the identity source; site config, JSON-LD, vCard, OG images, and llms.txt all derive from it.
42. Category from folder location, not frontmatter.
43. Generate the machine-readable surface (`llms.txt`, `*.md` routes, RSS) from the same data layer, `force-static`.
44. Content-negotiate markdown: `Accept: text/markdown` on any doc URL returns the raw MDX.
45. Never break a URL. Keep a legacy-slug array generating permanent redirects.
46. Base64-encode contact details in the data file to defeat scrapers.
47. Registry items can ship **no files**: CSS-only styles, and pure composition items whose entire content is `registryDependencies`.
48. A registry item can depend on another registry entirely (`metrics-01` requires `@bklit/line-chart`). Reuse across registries beats reimplementation.
49. Abstract the icon library at the component level and let the build transform it per consumer.
50. `CLAUDE.md` is one import line pointing at `AGENTS.md`. State the never-edit list for generated files in caps, and write the add-a-component ritual as numbered steps.

---

## 6. What to steal for a skill library

**Steal as ready-made technique entries** (each is small enough to be one skill rules file with an Incorrect/Correct pair):

| Technique | File | Rule |
|---|---|---|
| SVG handwriting | `apple-hello-effect-english.tsx` | `pathLength: 0 -> 1`, split paths for phrasing, opacity on a shorter curve, one `durationScale` |
| Cursor-traced gradient outline | `spotlight-logo.tsx` | Define stroke in `<defs>`, `<use>` twice, second with a spring-driven `radialGradient` center |
| Canvas spotlight grid | `dot-grid-spotlight.tsx` | Ref for mouse, single rAF slot, DPR scale, fade in on ready |
| Pointer variables + CSS effects | `glow-card-grid.tsx` | JS writes `--pointer-x/y`; CSS does blur/saturate/translate in `cq` units |
| Glowing border | `glow-card-grid.tsx` | `mask-composite: exclude` over border-box and padding-box, `backdrop-filter` in the ring |
| Scroll-driven edge fade | `scroll-fade-effect.css` | `@property` + `animation-timeline: scroll(self)` + two ranges + `mask-composite` |
| Circular text with no JS | `spinning-circular-text.tsx` | `sin()` in `calc()`, radius in `ch`, per-char index variable |
| Rubber-band drag | `elastic-slider.tsx` | `sqrt` falloff past a dead zone; snapshot rect and scale on pointer-down |
| Compound gesture component | `slide-to-unlock.tsx` | One shared `MotionValue`, derived `useTransform` opacity, `dragElastic={0}` |
| Middle truncation | `middle-truncation.tsx` | Singleton canvas measurement, binary search, `debounceWithRAF`, mutually exclusive prop union |
| Staggered wave | `logos-carousel.tsx` | Round-robin columns, wave index remapped by direction, three visibility gates |
| Line-marker nav | `line-nav.tsx` | `h-px` anchor + pseudo hit target, width variants, `aria-current` drives styling |
| Reading-position TOC | `toc-minimap.tsx` | `rootMargin: "0% 0% -80% 0%"`, `threshold: 0.98` |
| Icon-swap primitive | `icon-swap.tsx` | 31 lines: `AnimatePresence mode="popLayout"` + scale 0.25 + `blur(4px)` |
| Theme transition via mask | `styles/_registry.ts` | View Transition + SVG mask growing to `300vmax`, `--expo-out` linear() easing |
| Screen-line system | `styles/_registry.ts`, `globals.css` | `--color-line` + `200vw` pseudo rules + `nth-[3n+1]:` application |
| Panel primitive | `portfolio/components/panel.tsx` | `data-slot` parts, `has-*:` conditional rules, `asChild` title |
| Token-driven prose | `typeset.css` | `&:where()`, single-direction margins, one flow variable, `.not-typeset` opt-out |
| Preview style isolation | `style-preview.css` | `@scope (.style-preview) to (.style-isolate)` |
| Icon-library agnostic components | `registry/icons/*` | `IconPlaceholder` with five names, lazy loaders, `use()` promise cache, build-time transform |

**Steal as skill-library architecture:**

- The **hub `components.json`**: a project can point at six registries at once, including one with header-based license auth. A skill library should teach that pattern and the `${ENV_VAR}` header substitution.
- The **hand-authored `_registry.ts` per type** plus a generated `registry.json`, with the never-edit list stated in AGENTS.md. This is a cleaner separation than bklit's single hand-maintained `registry.json`.
- **File-less registry items**: CSS-only `registry:style`, and composition-only items whose entire body is `registryDependencies`. Both are underused and both are legitimate library primitives.
- The **five-step add-a-component ritual** as a skill workflow: create, register, example, build, docs.
- **`CLAUDE.md` as `@AGENTS.md`**: one file, one import.
- **`.mcp.json` with the shadcn MCP server** as a four-line default for any registry-consuming project.
- The **content-as-typed-modules** data layer, with `.tsx` for entries needing JSX, one identity object, and everything (site config, JSON-LD, vCard, OG, llms.txt, RSS) derived from it.
- The **machine-readable surface** as a first-class deliverable: llms.txt generated from the docs data layer, markdown content negotiation, `.md` routes per content section.

**Do not steal**: the two parallel shadcn UI trees (`components/ui/` Radix and `components/base/ui/` Base UI) unless you are genuinely mid-migration, the vendored bklit chart subset (install `@bklit/line-chart` instead, which is what `metrics-01` correctly does), and the personal data files themselves. The README says it plainly: remove all personal information before publishing.
