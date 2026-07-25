# Componentry registry: full catalog and build guide

Source of truth: `https://componentry.dev/r/registry.json` (56 items) plus every individual `https://componentry.dev/r/{name}.json`, fetched raw. Docs surface: `https://componentry.dev/docs`, `https://componentry.dev/docs/mcp`, `https://componentry.dev/llms.txt`.

`componentry.fun` is a 301 to `componentry.dev` at the path level (`https://componentry.fun/r/matrix-rain.json` -> `301` -> `https://componentry.dev/r/matrix-rain.json`). Both work. The registry's own `homepage` field and the docs still say `componentry.fun`, so either URL is safe in `components.json`.

Tagline from `llms.txt`: "built with TypeScript, Tailwind CSS, and Framer Motion. Open Source. Copy and paste into your apps."

---

## 1. Install and MCP wiring

### 1.1 Index shape (important)

The registry index is **minimal**. It carries only `name` and `type` per item. There are no titles, descriptions, dependencies, registryDependencies, or file lists at the index level:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "componentry",
  "homepage": "https://componentry.fun",
  "aliases": ["componentry", "componentryui", "ui", "cmp"],
  "items": [
    { "name": "animated-gradient", "type": "registry:ui" },
    { "name": "ascii-effect", "type": "registry:ui" }
  ]
}
```

All 56 items are `registry:ui` except `gradient-hero-01`, which is `registry:block`. To learn anything about a component you must fetch its own `r/{name}.json`. Those per-item files carry `$schema`, `name`, `type`, `title`, `description`, `dependencies`, `devDependencies`, `registryDependencies`, `files`, and (on the one block) `categories` and `meta`. Several items omit `title` and/or `description` entirely, and roughly a dozen have the placeholder description `"Component for <name>"`.

**`registryDependencies` is empty on all 56 items.** Nothing pulls in shadcn primitives such as `button`, `dialog`, or `card`. Every component is self-contained. That means no cross-registry chaining and no surprise overwrites of your existing shadcn files.

### 1.2 components.json registries block

Exactly as documented at `/docs/mcp`:

```json
{
  "registries": {
    "@componentry": "https://componentry.fun/r/{name}.json"
  }
}
```

`https://componentry.dev/r/{name}.json` is equivalent and skips the redirect hop.

### 1.3 Add command

```
npx shadcn@latest add @componentry/magnetic-dock
```

Generalised: `npx shadcn@latest add @componentry/<name>`. Multiple names in one call work normally. Docs show `bun`, `npm`, `pnpm`, and `yarn` tabs, so `pnpm dlx shadcn@latest add @componentry/<name>` is equally valid.

### 1.4 MCP init

```
pnpm dlx shadcn@latest mcp init
```

That is the entire documented MCP setup. The docs state it "Supports Claude Code, Cursor, etc." and there is **no componentry-specific MCP server**. The shadcn CLI writes the client MCP config for you; componentry piggybacks on it purely through the `registries` block above. There is no `.mcp.json` snippet published, no auth, no API key, no headers. Documented usage is natural language: "Add a badge component", "Add a blur reveal animation", "Add a vertical marquee of logos".

There is also a `llms.txt` at `https://componentry.dev/llms.txt` listing 40 documented components grouped by category, useful as a second index.

### 1.5 What lands on disk

Every `registry:ui` item writes one main file:

```
components/ui/<name>.tsx
```

Three exceptions add a second file:

* `bouncy-accordion` also writes `lib/ease.ts`
* seven WebGL items also write `components/ui/webgl-error-boundary.tsx` (identical content across all seven, so installing several is idempotent): `animated-gradient`, `dither-prism-hero`, `image-ripple-effect`, `particle-galaxy`, `ripple-transition`, `silk-aurora`, `webgl-liquid`
* `gradient-hero-01` is the one block: source `registry/blocks/gradient-hero-01/gradient-hero-01.tsx`, target `components/gradient-hero-01.tsx`, file type `registry:component`

`webgl-error-boundary.tsx` exports a `WebGLErrorBoundary` class plus a `WebGLFallback` gradient placeholder with `role="status"`. Worth knowing: the WebGL heroes degrade to a dark zinc gradient with a text message on unsupported devices rather than crashing.

### 1.6 Prerequisites and gotchas

Nothing is documented as a prerequisite, so this is from reading the source:

* **`@/lib/utils` with a `cn` export** is imported by 40 of 56 components. Standard shadcn setup covers this.
* **Broken import paths in 12 components.** Ten import `cn` from `@workspace/ui/lib/utils`, a leaked monorepo alias that will not resolve in a normal Next.js or Vite app: `circuit-board`, `cursor-driven-particle-typography`, `hyper-text`, `letter-cascade`, `scroll-based-velocity`, `scroll-choreography`, `scrub-input`, `spotlight-card`, `testimonial-marquee`, `text-repel`. Two more import `../lib/utils`, which resolves to `components/lib/utils` and is also wrong: `hero-geometric`, `liquid-chrome`. **Fix after install: rewrite those imports to `@/lib/utils`.** This is the single highest-frequency breakage in the registry.
* **Ten components have undeclared runtime dependencies.** The `dependencies` array is empty but the file imports a package, so `shadcn add` will not install it and the build fails:

  | component | missing package |
  |---|---|
  | collection-surfer | framer-motion |
  | eye-tracking | framer-motion |
  | letter-cascade | framer-motion |
  | music-player | framer-motion |
  | scroll-choreography | framer-motion |
  | scroll-split-card | framer-motion |
  | text-repel | framer-motion |
  | image-trail | gsap |
  | layered-stack | gsap |
  | mac-keyboard | lucide-react |

* **One over-declared dependency.** `testimonial-marquee` declares `framer-motion` but never imports it; it is pure CSS. Safe to drop.
* **Three components need Tailwind keyframes you must supply.** `shimmer-button` uses `animate-shimmer-slide` and `animate-spin-around` with no `cssVars`, `css`, or `tailwind` block in its registry item, so those utilities do not exist until you define them. `split-flap-display` and `testimonial-marquee` ship their own inline `@keyframes` in a `<style>` tag and are fine.
* **No item defines `cssVars`, `css`, or `tailwind` blocks.** Nothing is injected into your globals. All styling is Tailwind utility classes plus inline styles.
* **Remote assets in default props.** These reach out at runtime unless you pass your own data: `collection-surfer`, `infinite-image-field`, `ripple-transition`, `sticky-scroll-cards` (images.unsplash.com), `scroll-split-card` (framerusercontent.com), `github-calendar` (github-contributions-api.deno.dev, a live third-party API), `music-player` (youtube.com in demo data). Add the hosts to `next.config` `images.remotePatterns` or swap in local assets.
* **`framer-motion`, not `motion`.** Every animated component imports from `framer-motion`, the pre-v11 package name. If your project uses the newer `motion` package you will need an alias or a find-and-replace.
* **`"use client"`** is present on the interactive components. Next.js App Router safe.

---

## 2. Full catalog: all 56

Technique legend: `webgl` = GPU shader, `canvas2d` = 2D canvas raster loop, `css` = CSS only, `dom` = React state or motion values driving DOM transforms, `svg` = SVG markup.

| name | category | technique | npm deps | description |
|---|---|---|---|---|
| animated-gradient | background | webgl (raw WebGL2) | none | Mesh gradient shader with swirl, distortion, softness, shape scale and grain; five named presets (Aurora, Oceanic, Amber, Toxic, Ghost). |
| ascii-effect | background | canvas2d | none | Renders any image as ASCII art with Floyd-Steinberg or Bayer dithering; image, flow and glitch variants. |
| auth-modal | card | dom + css | framer-motion, lucide-react | Animated sign-in dialog with social buttons and backdrop blur. |
| border-beam | chrome | css (offset-path) | framer-motion | Gradient beam that travels the container border via CSS `offsetPath`. |
| bouncy-accordion | input | dom | framer-motion, lucide-react | Spring-bounce accordion; also writes `lib/ease.ts`. |
| circuit-board | background | svg + dom | framer-motion | Node and trace circuit diagram with animated electricity pulses; four prebuilt patterns, theme-aware. |
| closing-plasma | background | webgl (raw WebGL1) | clsx, tailwind-merge | Simplex-noise plasma tuned for footers and CTA bands; separate light and dark palettes, cursor influence, sparkle. |
| collection-surfer | card | dom (3D transform) | none declared (needs framer-motion) | Scroll and hover carousel of collection tiles; magnetic, uplift and simple variants. |
| command-menu | input | dom | cmdk, framer-motion, lucide-react | macOS Spotlight-style command palette with groups, empty state and a configurable shortcut key. |
| cursor-driven-particle-typography | text | canvas2d | none declared | Text rasterised via `getImageData` into particles that disperse from the cursor and spring back. |
| dither-gradient | background | canvas2d | none | Bayer-matrix dithered three-stop gradient. 3.5 KB, zero deps, cheapest atmospheric background in the set. |
| dither-prism-hero | hero | webgl (three + R3F) | @react-three/fiber, @react-three/drei, three, framer-motion, @types/three (dev) | Full hero: 8x8 Bayer dither, prismatic refraction, holographic iridescence, cursor ripple and lens distortion, optional particle layer. |
| dithered-logo | background | canvas2d | none | Rasterises a logo image into a serpentine Floyd-Steinberg particle field with cursor ripples. |
| eye-tracking | chrome | dom | none declared (needs framer-motion) | Eyes that track the cursor with spring physics, blinking and reactive pupils; realistic, cartoon, minimal, cyber variants. |
| flight-status-card | card | svg + dom | framer-motion | Dot-matrix departure-board flight card with progress bar and ETA; also exports light and adaptive variants. |
| github-calendar | chrome | svg | framer-motion | GitHub contribution heatmap; four cell shapes, five colour schemas, three variants. Calls a live third-party API. |
| gradient-hero-01 | hero | css | none | Static centred hero: layered radial and linear gradients with `color-mix`, badge, two CTAs. The only `registry:block`. |
| hero-geometric | hero | webgl (three + R3F) | framer-motion, lucide-react, three, @react-three/fiber, @react-three/drei | Two-line headline over a 4x4 Bayer-dithered simplex gradient plane with corner-weighted vignette. |
| hyper-text | text | dom | none | Character scramble reveal on load or hover. 2 KB. |
| image-ripple-effect | background | webgl (three + R3F + drei) | three, @types/three, @react-three/fiber, @react-three/drei | Cursor paints a brush-stroke displacement map that refracts layered image planes in real time. |
| image-trail | background | dom | none declared (needs gsap) | Images trail the cursor with a delayed fade, driven by GSAP tweens. |
| infinite-image-field | background | canvas2d | none | Infinitely tiled photo grid that pans toward the cursor with velocity damping. |
| interactive-hover-button | input | css | lucide-react | Button that slides in a label and arrow on hover. |
| kinetic-text-reveal | text | dom | framer-motion | Masked directional reveal split by word, character or line, with optional blur and an imperative `play`/`reset` ref. |
| layered-stack | card | dom | none declared (needs gsap) | GSAP hover stack of layered cards. Props are plain `ComponentProps<"div">`, so composition is entirely yours. |
| letter-cascade | text | dom (3D transform) | none declared (needs framer-motion) | Letters scatter outward with spring physics and blur, then reassemble; stagger from first, last or centre. |
| liquid-blob | background | dom + css | framer-motion | Blurred morphing blob shapes tracking the mouse. Pure CSS blur, no GPU shader, very cheap. |
| liquid-chrome | background | webgl (raw WebGL1) | none | Domain-warped FBM liquid metal shader with mouse distortion and vignette. |
| mac-keyboard | chrome | dom | none declared (needs lucide-react) | Interactive Mac keyboard with per-key press states and optional key sound. |
| magnet-lines | background | dom | framer-motion | Grid of line elements that rotate to face the cursor. |
| magnetic-dock | chrome | svg + dom | framer-motion | macOS dock with proximity scaling; four positions, glass/solid/transparent variants, seven bundled icons. |
| matrix-rain | background | canvas2d | none | Digital rain; default, cyan and rainbow variants, or a fixed colour. |
| music-player | chrome | dom | none declared (needs framer-motion) | Vinyl record player with swinging tonearm; takes `src`, `coverArt`, `autoPlay`. |
| noise-texture | background | canvas2d | none | Animated film-grain overlay; fine/medium/coarse grain, five blend modes. |
| orbit-card-stack | card | dom | framer-motion, lucide-react | Hover deck that fans outward and lifts the active card without recolouring or re-angling it. |
| particle-galaxy | background | webgl (three, no R3F) | three | 10,000-point spiral galaxy on a custom `ShaderMaterial`; drag rotate, wheel zoom, pinch, additive or normal blend. |
| pixel-canvas | background | canvas2d | none | Pixel grid that lights up on hover and decays over time; default, trail, glow variants. |
| prism-gradient | background | webgl (raw WebGL2) | next-themes, clsx, tailwind-merge | Theme-aware swirled prism field with electric-blue refraction and a grain overlay. |
| pulsating-button | input | css | none | Button with a pulsing glow ring. |
| ripple-transition | background | webgl (raw WebGL1) | framer-motion | Click-origin ripple image transition with chromatic aberration, glow, noise warp and pinch. |
| scroll-based-velocity | scroll | dom | framer-motion | Marquee text that skews and accelerates with scroll velocity. |
| scroll-choreography | scroll | dom | none declared (needs framer-motion) | Four corner images converge and diverge on scroll. Fixed four-image API. |
| scroll-split-card | scroll | dom (3D transform) | none declared (needs framer-motion) | A card splits into three panels and flips as you scroll past it. |
| scroll-tilted-grid | scroll | dom (3D transform) | framer-motion, lenis | Image grid that tilts and blurs, resolving to flat and sharp as each frame crosses the viewport. |
| scrub-input | input | dom | none | Pill-shaped drag-to-scrub numeric input with min, max, step and label. |
| shimmer-button | input | css | none | Shimmer-sweep button. Requires you to define `animate-shimmer-slide` and `animate-spin-around` keyframes. |
| showcase-card | card | svg + dom (3D transform) | framer-motion | Portfolio card with 3D tilt and parallax image; also exports compact, horizontal and grid wrappers. |
| signature | chrome | svg | framer-motion, opentype.js | Draws text as a hand-written SVG signature stroke; accepts a `fontUrl` for a custom typeface. |
| silk-aurora | hero | webgl (raw WebGL1) | none | Satin aurora ribbons over FBM warp with pearlescence, glint, grain and cursor depth; headline slots built in. |
| split-flap-display | chrome | css (3D keyframes) | none | Vintage departure-board flip characters; inline `@keyframes`, sm/md/lg sizes, per-cell stagger. |
| spotlight-card | card | dom + css | none | Cursor-spotlight card family: `SpotlightCard`, `MultiSpotlightCard`, `BeamSpotlightCard`, `GradientFollowCard`, `TiltSpotlightCard`, plus header/title/description/content slots. |
| sticky-scroll-cards | scroll | dom | framer-motion, lenis | Cards pin and scale down as you scroll past, creating a layered depth stack. |
| testimonial-marquee | chrome | css | framer-motion declared but unused | Infinite testimonial marquee; five layout variants (default, stacked, dual, flush, flush-dual), inline `@keyframes`. |
| text-animate | text | dom | framer-motion | Generic enter animation by text, word or character with `startOnView` and a polymorphic `as` prop. |
| text-repel | text | dom | none declared (needs framer-motion) | Letters repel or attract around the cursor with per-letter springs (stiffness, damping, mass). |
| webgl-liquid | hero | webgl (raw WebGL1) | clsx, tailwind-merge | Cinematic liquid FBM shader hero with reveal timing, contrast, opacity, grain and built-in headline slots. |

### Documented vs undocumented

Only 40 of the 56 appear in `llms.txt` and on the docs site. The other 16 are installable but undocumented, so there is no preview page for them: `auth-modal`, `border-beam`, `command-menu`, `gradient-hero-01`, `hyper-text`, `interactive-hover-button`, `liquid-blob`, `noise-texture`, `particle-galaxy`, `pulsating-button`, `scrub-input`, `shimmer-button`, `showcase-card`, `spotlight-card`, `testimonial-marquee`, `text-animate`.

Several of the undocumented ones are recognisably ported Magic UI primitives (`border-beam`, `shimmer-button`, `pulsating-button`, `interactive-hover-button`, `hyper-text`, `text-animate`, `scroll-based-velocity`). Treat those as commodity.

Docs category names, for cross-reference: Text Animations, Components, Hero Backgrounds, Visual Effects, ASCII Effects.

---

## 3. Deep dives

### 3.1 dither-prism-hero (the flagship)

* **Technique**: three.js via `@react-three/fiber` on a full-screen plane. Custom `ShaderMaterial`. The heaviest item in the registry (25.6 KB main file, 36.5 KB JSON).
* **Shader**: uniforms `uTime`, `uResolution`, `uMouse`, `uMouseIntensity`, `uColor1..3`, `uDitherIntensity`, `uPrismIntensity`. GLSL functions: `hash`, `hash3`, `permute`, `snoise`, `fbm`, `bayer8x8`, `blueNoise`, `iridescence`, `prism`, `diamond`, `morphShape`, `mouseGlow`, `mouseLensDistort`, `mouseRipple`. It combines an 8x8 ordered Bayer matrix with animated blue noise, applies prismatic refraction only at edges and transitions, layers holographic iridescence, then adds concentric cursor ripples plus a lens distortion and a bright cursor aura.
* **Extras**: an optional `THREE.Points` particle layer for depth, and `framer-motion` for the headline entrance.
* **Props**: `title1`, `title2`, `color1`, `color2`, `color3`, `speed` (1), `ditherIntensity` (0.15), `prismIntensity` (0.5), `particleCount`, `showParticles`, `particleColor`, `children`. Extends `React.HTMLAttributes<HTMLDivElement>`.
* **Export**: `DitherPrismHero`.
* **Cost**: three + R3F + drei + framer-motion. This is the most expensive single component in the registry.

### 3.2 dither-gradient (the cheap alternative)

* **Technique**: 2D canvas, Bayer matrix dithering, `requestAnimationFrame`. No WebGL, no dependencies, 3.5 KB.
* **Props**: `className`, `colorFrom` (`#4f46e5`), `colorTo` (`#ec4899`), `colorMid` (`#a855f7`), `intensity` (0.15), `speed` (3), `angle` (45).
* **Export**: `DitherGradient`.
* **Why it matters**: gives you 80 percent of the dither-hero look for zero bundle cost. Use this first, upgrade to `dither-prism-hero` only if the client wants the interaction.

### 3.3 webgl-liquid

* **Technique**: raw WebGL1, hand-written context, no three.js. Ships `webgl-error-boundary`.
* **Shader**: uniforms `u_time`, `u_res`, `u_speed`, `u_flowStrength`, `u_colorDeep`, `u_colorMid`, `u_colorHighlight`, `u_contrast`, `u_grain`, `u_opacity`, `u_reveal`. Functions `hash`, `noise`, `fbm`, `applyContrast`. Classic FBM flow field with a contrast curve and film grain.
* **Props**: `title`, `subtitle`, `description`, `colorDeep`, `colorMid`, `colorHighlight`, `speed` (1), `flowStrength` (1), `grain` (0.05), `contrast` (1.1), `opacity` (0.95), `reveal` (true), `delayMs` (0), `revealDuration` (1.2), `className`, `children`, `style`.
* **Export**: `WebGLLiquid`.
* **Note**: the headline is baked in via `title`/`subtitle`/`description`, so it is a hero section, not just a background. `children` renders on top.

### 3.4 liquid-chrome

* **Technique**: raw WebGL1, zero dependencies, 7.5 KB. Full fragment shader is short and readable.
* **Shader gist**: 2D value noise, 4-octave FBM with a rotation matrix, then two-level domain warping (`q` warps `p`, `r` warps `p + 4q`). Colour is built by mixing shadows, silver midtones and white speculars against `u_baseColor` with `smoothstep` bands, finished with a vignette. Mouse produces an exponential-falloff radial distortion.
* **Props**: `className`, `baseColor` (`[0.1, 0.1, 0.1]`, an RGB tuple not a hex string), `speed` (1.0), `amplitude` (0.6), `interactive` (true).
* **Export**: `LiquidChrome`.
* **Gotcha**: imports `cn` from `../lib/utils`. Fix to `@/lib/utils`.

### 3.5 silk-aurora

* **Technique**: raw WebGL1, zero dependencies, ships the error boundary. Respects `prefers-reduced-motion` and clamps DPR.
* **Shader gist**: hash + value noise + 5-octave FBM with a rotation matrix, then a custom `ribbon()` function that folds `p.y` with two sine terms and `smoothstep`s a soft band. Three ribbons at different scales and phases are additively composited over a base-to-mid vertical gradient, plus a `pearlescent` term, a sparse `glint` term, a pointer falloff highlight, a vignette and hash grain.
* **Props**: `title`, `subtitle`, `description`, `baseColor`, `midColor`, `sheenColor`, `accentColor`, `speed` (1), `intensity` (1), `grain` (0.85), `vignette` (1), `mouseInfluence` (1), `interactive` (true), `children`.
* **Exports**: `SilkAurora`, `SilkAuroraProps`.
* **Best in class** if you want a premium dark hero with no three.js. It is the strongest quality-to-cost ratio in the whole registry.

### 3.6 prism-gradient

* **Technique**: raw **WebGL2**, `next-themes` aware, `ResizeObserver`, DPR clamp, `prefers-reduced-motion`.
* **Shader**: uniforms `u_time`, `u_resolution`, `u_pixelRatio`, `u_color1..3`, `u_rotation`, `u_scale`, `u_shapeScale`, `u_softness`, `u_distortion`, `u_swirl`, `u_swirlIterations`, `u_proportion`. Functions `random`, `noise`, `rotate`, `blendColors`. Same shader family as `animated-gradient`.
* **Props**: `speed` (1), `noise` (`{ opacity, scale? }`), `radius` (`"0px"`), `style`, `className`. Deliberately narrow surface: the palette is theme-driven rather than prop-driven.
* **Exports**: `PrismGradient`, `PrismGradientProps`, `PrismGradientNoise`.
* **Pick this** when the site already uses `next-themes` and you want the background to flip with the theme for free.

### 3.7 animated-gradient

* **Technique**: raw WebGL2, same shader family as `prism-gradient` (adds a `u_shape` uniform and `blend_colors`). Zero npm deps, ships the error boundary.
* **Props**: `config`, `noise`, `radius`, `style`, `className`. A `PresetName` union of `"Aurora" | "Oceanic" | "Amber" | "Toxic" | "Ghost"` drives `config`.
* **Export**: `AnimatedGradient`.
* **Pick this** over `prism-gradient` when you want explicit palette control and no `next-themes` dependency.

### 3.8 closing-plasma

* **Technique**: raw WebGL1, `ResizeObserver`, DPR clamp. Only deps are `clsx` and `tailwind-merge`.
* **Shader**: uniforms `u_time`, `u_res`, `u_mouse`, `u_speed`, `u_turbulence`, `u_mouseInfluence`, `u_grain`, `u_sparkle`, `u_vignette`, `u_opacity`, `u_isDark`, plus **two full palettes** (`u_darkA/B/C`, `u_lightA/B/C`). Functions `mod289`, `permute`, `snoise`, `fbm`. Real simplex noise, not value noise.
* **Props**: `themeMode` (`"auto" | "light" | "dark"`), `speed`, `turbulence`, `mouseInfluence`, `grain`, `sparkle`, `vignette`, `opacity`, `interactive`, `darkColorA/B/C`, `lightColorA/B/C`, `children`.
* **Exports**: `ClosingPlasma`, `ClosingPlasmaProps`.
* **Designed for footers and CTA bands**, per the docs. Pair it with a `webgl-liquid` or `silk-aurora` hero for a bookended page without adding a second library.

### 3.9 particle-galaxy

* **Technique**: three.js **directly, without R3F**. `BufferGeometry` with per-point attributes, custom `ShaderMaterial` with uniforms `uTime`, `uSize`, `uDensity`, `uGlow`, `uPulsate`, `uPulsateSpeed`. Circular point sprites drawn in the fragment shader.
* **Interaction**: drag to rotate with damping, wheel zoom with clamped min/max, pinch zoom, single-touch drag, hover tilt, optional auto-rotate and gentle camera drift, smooth return to centre.
* **Props** (22 of them): `particleCount` (10000), `particleSize` (0.02), `rotationSpeed` (0.001), `spiralArms` (3), `colors` (a 3-tuple, default indigo/violet/pink), `mouseInfluence` (0.5), `autoRotate` (true), `blendMode` (`"additive" | "normal"`), `spread` (2.5), `density` (0.7), `glow` (60), `cameraMovement` (true), `centerConcentration` (0.5), `pulsate` (true), `pulsateSpeed` (1), `enableZoom`, `enableDrag`, `enableTouch`, `damping` (0.1), `minZoom` (1.5), `maxZoom` (10), `className`.
* **Export**: `ParticleGalaxy`.
* **Only needs `three`**, no R3F and no drei. That is a much smaller install than `dither-prism-hero`. Use `blendMode: "normal"` on light backgrounds or the whole thing washes out.

### 3.10 pixel-canvas

* **Technique**: 2D canvas, per-cell intensity with a `targetIntensity` easing toward zero, `colorPhase` interpolating through the palette as the trail decays. `requestAnimationFrame`, DPR-aware. Zero deps.
* **Props**: `gap` (6), `speed` (0.02), `colors` (4-colour default), `noFocus` (false), `variant` (`"default" | "trail" | "glow"`). Extends `React.HTMLAttributes<HTMLDivElement>`.
* **Export**: `PixelCanvas`.
* Cheap, tactile, works as a card hover surface as well as a section background.

### 3.11 matrix-rain

* **Technique**: 2D canvas, per-column drop positions, `ResizeObserver`. Zero deps, 4.2 KB.
* **Props**: `className`, `variant` (`"default" | "cyan" | "rainbow"`), `width`, `height`, `fontSize` (16), `speed` (50), `fixedColor`.
* **Export**: `MatrixRain`.
* Note `speed` is an interval in milliseconds, not a multiplier. Lower is faster.

### 3.12 circuit-board

* **Technique**: SVG paths plus `framer-motion`, no canvas and no WebGL. Traces are orthogonal SVG paths with animated pulse dots travelling along them.
* **Data model**: you supply `nodes: CircuitNode[]` (`id`, `x`, `y`, `label?`, `icon?`, `status?: "active" | "inactive" | "processing" | "error"`, `size?: "sm" | "md" | "lg"`) and `connections: CircuitConnection[]` (`from`, `to`, `animated?`, `bidirectional?`, `color?`, `pulseColor?`).
* **Props**: `nodes`, `connections`, `width` (600), `height` (400), `gridSize` (20), `showGrid` (true), `gridColor`, `traceColor`, `pulseColor`, `nodeColor`, `pulseSpeed` (2), `traceWidth` (2), `variant` (`"light" | "dark" | "auto"`).
* **Exports**: `CircuitBoard`, `CircuitNode`, `CircuitPattern`, `CircuitTrace`, plus types. `CircuitPattern` takes `pattern: "data-flow" | "network" | "processor" | "tree"` and generates the nodes and connections for you.
* **This is the best "explain a pipeline" component in the registry.** It is a real diagram primitive, not decoration.
* **Gotcha**: imports from `@workspace/ui/lib/utils`.

### 3.13 ascii-effect

* **Technique**: 2D canvas sampling into a character grid. Real dithering options, not a lookup table.
* **Props** (31): `imageSrc` (required), `alt`, `variant` (`"image" | "flow" | "glitch"`), `chars`, `fontSize`, `fontFamily`, `fontWeight`, `lineHeight`, `characterSpacing`, `brightnessBoost`, `contrast`, `threshold`, `posterize`, `dither` (`"none" | "floyd-steinberg" | "bayer"`), `ditherStrength`, `flowSpeed`, `flowDirection`, `flowStrength`, `flowFrequency`, `mouseRadius`, `mouseStrength`, `mouseWaveSpeed`, `scale`, `fit` (`"cover" | "contain" | "stretch"`), `colors`, `colorMode` (`"gradient" | "source"`), `backgroundColor`, `invert`, `glitchIntensity`, `glitchFrequency`, `revealDuration`.
* **Exports**: `AsciiEffect`, plus preset wrappers `AsciiImage`, `AsciiFlow`, `AsciiGlitch` (each `Omit<AsciiEffectProps, "variant">`).
* Zero dependencies. Needs a source image.

### 3.14 magnet-lines

* **Technique**: DOM, not canvas. A CSS grid of line elements, each rotated toward the pointer with `framer-motion`.
* **Props**: `rows`, `columns`, `containerSize`, `lineColor`, `lineWidth`, `lineHeight`, `baseAngle`, `className`, `style`.
* **Export**: `MagnetLines`. 3 KB.
* Cheap and reads as intentional design rather than as an effect. Good section divider.

### 3.15 text-repel

* **Technique**: DOM, per-letter `useMotionValue` + `useSpring`, distance falloff around the pointer. No canvas.
* **Props**: `text` (required), `className`, `letterClassName`, `radius`, `strength`, `mode` (`"repel" | "attract"`), `stiffness`, `damping`, `mass`.
* **Export**: `TextRepel`.
* **Gotchas**: imports from `@workspace/ui/lib/utils`, and `framer-motion` is undeclared.
* Because it is DOM text, it stays selectable and accessible, unlike the canvas particle version.

### 3.16 kinetic-text-reveal

* **Technique**: `framer-motion` with clipping masks per segment. No canvas.
* **Props**: `text` (required), `className`, `segmentClassName`, `maskClassName`, `splitBy` (`"words" | "characters" | "lines"`), `direction`, `distance`, `stagger`, `staggerFrom`, `transition` (a full framer `Transition`), `blur`, `autoPlay`, `delay`, `onRevealStart`, `onRevealComplete`.
* **Ref API**: `KineticTextRevealRef` with `play()` and `reset()`, so you can drive it from scroll or from another component.
* **Export**: `KineticTextReveal`.
* The most controllable text component in the registry and the one to reach for on headlines.

### 3.17 cursor-driven-particle-typography

* **Technique**: 2D canvas. Text is drawn offscreen, read back with `getImageData`, and every lit pixel above the density threshold becomes a particle with an origin. Cursor proximity pushes particles, `returnSpeed` lerps them home. `ResizeObserver`, DPR clamp.
* **Props**: `text` (required), `className`, `fontSize` (120), `fontFamily` (`"Inter, sans-serif"`), `particleSize` (1.5), `particleDensity` (6, lower means more particles), `dispersionStrength` (15), `returnSpeed` (0.08), `color`.
* **Exports**: `CursorDrivenParticleTypography`, plus the props type.
* **Accessibility warning**: the text exists only as canvas pixels. Screen readers and SEO see nothing. Always duplicate the string in a visually hidden element.
* **Gotcha**: imports from `@workspace/ui/lib/utils`; `particleDensity` at 1 with a large `fontSize` will generate tens of thousands of particles.

### 3.18 scroll-choreography

* **Technique**: `useScroll` + `useTransform` + `useSpring`. Four images animate from the corners as the section scrolls.
* **Props**: `className`, `images: { topLeft, topRight, bottomLeft, bottomRight }`. That is the entire API.
* **Export**: `ScrollChoreography`.
* **Rigid.** Exactly four images, fixed layout. Great when it fits, useless when it does not.
* **Gotchas**: `@workspace/ui/lib/utils` import, undeclared `framer-motion`.

### 3.19 scroll-tilted-grid

* **Technique**: `framer-motion` scroll values driving `rotateX` and `filter: blur()` in a perspective container, with `lenis/react` for smooth scroll. `IntersectionObserver` + `ResizeObserver`, respects reduced motion, supports infinite looping by cycling the image array.
* **Props**: `images` (required, `{ src, alt }[]`), `loop` (false), `initialCycles` (2), `maxCycles` (4), `smoothScroll` (true), `aspectRatio` (`"4 / 5"`), `perspective` (1000), `maxTilt` (62), `maxBlur` (7), `rounded` (`"0.25rem"`), `sectionPadding` (`"18vh"`), `className`.
* **Exports**: `ScrollTiltedGrid`, `ScrollTiltedGridImage`, `ScrollTiltedGridProps`.
* The most polished scroll component here. Best gallery/portfolio primitive in the set.

### 3.20 sticky-scroll-cards

* **Technique**: `useScroll` per card with a `range` and `targetScale`, sticky positioning, `lenis/react` smooth scroll.
* **Props**: `cards?: { title, src }[]`, `hint?`, `className?`.
* **Exports**: `StickyScrollCards`, `StickyScrollCardItem`.
* Very small API. Default cards pull from Unsplash, so pass your own.

### 3.21 scroll-split-card

* **Technique**: `useScroll` + `useTransform`, 3D `rotateX` and blend modes. A card divides into three panels and flips.
* **Props**: `className`, `imageSrc` (required), `cards: { title, description, bgColor, textColor, icon? }[]`, `containerRef?` so you can drive it from an outer scroll container.
* **Export**: `ScrollSplitCard`.
* **Gotchas**: undeclared `framer-motion`; default demo assets point at framerusercontent.com.

### 3.22 orbit-card-stack

* **Technique**: pure DOM transforms with `framer-motion`. No scroll, hover only. Explicitly designed so the active card keeps its colour and angle while the rest fan out.
* **Props**: `items?: OrbitStackItem[]` (`name`, `role`, `description`, `accent?`, `initials?`, `stat?`, `image?`), `className`, `cardClassName`, `defaultActiveIndex` (2), `spread` (168), `lift` (34), `onActiveChange(item, index)`.
* **Export**: `OrbitCardStack`.
* The `onActiveChange` callback makes this usable as a real selector, not just decoration. Team pages, plan pickers, testimonial decks.

### 3.23 infinite-image-field

* **Technique**: 2D canvas. Images tile infinitely in both axes; pointer position sets a velocity vector that is smoothed and integrated into an offset. `ResizeObserver`, DPR clamp. Zero deps.
* **Props**: `images?: string[]`, `imageWidth` (200), `imageHeight` (280), `gap` (28), `maxSpeed` (5), `smoothing` (0.07), `borderRadius` (0), `className`. Extends div attributes minus children.
* **Exports**: `InfiniteImageField`, `InfiniteImageFieldProps`, `INFINITE_IMAGE_FIELD_IMAGES` (the Unsplash default set).
* Because it is canvas, the images are not links. This is a mood surface, not a navigable gallery.

### 3.24 image-trail

* **Technique**: GSAP tweens positioning absolutely-placed images behind the cursor once movement exceeds `threshold`.
* **Props**: `images: string[]`, `imageWidth` (200), `imageHeight` (200), `threshold` (50), `duration` (1.6).
* **Export**: `ImageTrail`.
* **Gotcha**: `gsap` is imported but not declared. Install it yourself. This and `layered-stack` are the only two GSAP components; if you are not already using GSAP, that is a whole extra animation library for one effect.

### 3.25 collection-surfer

* **Technique**: `framer-motion` with `useScroll`, `useTransform`, `useSpring`, `useMotionValue`, 3D transforms and blend modes.
* **Props**: `items?: CollectionItem[]` (`id`, `image`, `title`), `variant?: "magnetic" | "uplift" | "simple"`.
* **Exports**: `CollectionSurfer`, `CollectionItem`, `CollectionSurferVariant`.
* No `title`, `description`, `dependencies` or `registryDependencies` at all in its registry item, and `framer-motion` is undeclared. Defaults hit Unsplash. Smallest documented API surface of the card components.

### 3.26 ripple-transition (bonus, worth knowing)

* **Technique**: raw WebGL1 with two texture samplers (`u_texA`, `u_texB`) and a progress uniform driven by `framer-motion`. Functions `hash21`, `vnoise`, `fbm`, `coverUv`. Uniforms include `u_center`, `u_progress`, `u_waveSpeed`, `u_sigma`, `u_waveFreq`, `u_pushAmt`, `u_caStrength`, `u_glow`, `u_noiseWarp`, `u_pinch`, `u_swap`.
* **Props**: `images?: readonly string[]`, `duration`, `ease`, `autoPlay`, `autoPlayInterval`, `autoPlayOrigin` (`"center" | "random"`), `waveSpeed`, `sigma`, `waveFreq`, `pushAmt`, `caStrength`, `glow`, `noiseWarp`, `pinch`, `borderRadius`, `background`, `label`.
* **Exports**: `RippleTransition`, `RippleTransitionProps`.
* Click anywhere to set the ripple origin. Only needs `framer-motion` and the bundled error boundary, no three.js. Strong product-gallery component.

---

## 4. Dependency footprint

### Declared dependency frequency across 56 items

| package | declared by | notes |
|---|---|---|
| framer-motion | 22 | plus 7 more that import it without declaring it, so 29 real consumers |
| lucide-react | 6 | plus `mac-keyboard` undeclared, so 7 real |
| three | 4 | `dither-prism-hero`, `hero-geometric`, `image-ripple-effect`, `particle-galaxy` |
| @react-three/fiber | 3 | `dither-prism-hero`, `hero-geometric`, `image-ripple-effect` |
| @react-three/drei | 3 | only `image-ripple-effect` actually imports it |
| clsx | 3 | `closing-plasma`, `prism-gradient`, `webgl-liquid` |
| tailwind-merge | 3 | same three |
| lenis | 2 | `scroll-tilted-grid`, `sticky-scroll-cards` |
| cmdk | 1 | `command-menu` |
| @types/three | 1 (dev) | `dither-prism-hero` |
| next-themes | 1 | `prism-gradient` |
| opentype.js | 1 | `signature` |
| ogl | 0 | **no component uses ogl** |
| gsap | 0 declared | but `image-trail` and `layered-stack` import it |

### Stack tiers

**Tier 0: zero runtime dependencies (28 components).** These add nothing to `package.json` beyond React:

`animated-gradient`, `ascii-effect`, `dither-gradient`, `dithered-logo`, `gradient-hero-01`, `hyper-text`, `infinite-image-field`, `liquid-chrome`, `matrix-rain`, `noise-texture`, `pixel-canvas`, `pulsating-button`, `scrub-input`, `shimmer-button`, `silk-aurora`, `split-flap-display`, `spotlight-card`, `testimonial-marquee`, `cursor-driven-particle-typography`, plus `collection-surfer`, `eye-tracking`, `image-trail`, `layered-stack`, `letter-cascade`, `mac-keyboard`, `music-player`, `scroll-choreography`, `scroll-split-card`, `text-repel` (the last ten of those need a package installed manually despite declaring none).

Genuinely dependency-free and import-clean: `animated-gradient`, `ascii-effect`, `dither-gradient`, `dithered-logo`, `gradient-hero-01`, `hyper-text`, `infinite-image-field`, `matrix-rain`, `noise-texture`, `pixel-canvas`, `pulsating-button`, `shimmer-button`, `silk-aurora`, `split-flap-display`. **That set alone gives you a full hero, a background, a gallery surface, and buttons for zero install cost.**

**Tier 1: framer-motion only.** Adds roughly 35 KB gzipped and covers 29 components including every text animation, every scroll component (minus lenis), and every card. If you pick exactly one animation library, pick this one. It unlocks the largest share of the registry.

**Tier 2: framer-motion + lenis.** Two extra components (`scroll-tilted-grid`, `sticky-scroll-cards`) but both are among the strongest scroll pieces. Lenis is small and you probably want smooth scroll anyway.

**Tier 3: three.js.** Only justified for `particle-galaxy` (three alone) or `dither-prism-hero` / `hero-geometric` / `image-ripple-effect` (three + R3F, plus drei for the ripple one). That is roughly 600 KB of extra JavaScript. **Avoid unless the client is paying for the galaxy specifically.**

**Tier 4: gsap.** Only `image-trail` and `layered-stack`. Not worth a whole library. Reimplement the trail with framer-motion or skip it.

### The cheap-stack recommendation

```
framer-motion   (unlocks 29 components)
lenis           (unlocks 2 more, both high value)
lucide-react    (icons, you want this anyway)
```

That is your whole install. It reaches **every non-three.js component in the registry**, including all four raw-WebGL heroes (`silk-aurora`, `webgl-liquid`, `liquid-chrome`, `closing-plasma`), because raw WebGL needs no library at all. `clsx` and `tailwind-merge` are already in any shadcn project via `cn`.

Skip `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `opentype.js`, `cmdk` unless a specific component earns it.

---

## 5. Selection guide by site type

### 5.1 Car dealership

The job is metal, light, and a hero that makes a photograph look expensive. Chrome and reflection read as automotive; particles and matrix rain do not.

| component | why |
|---|---|
| `liquid-chrome` | Literal liquid metal shader. Zero deps, raw WebGL. This is the single most on-brand background in the registry for automotive. |
| `ripple-transition` | Click-to-ripple image swap between vehicle photos, with chromatic aberration on the wavefront. Only needs framer-motion. Better than a carousel. |
| `image-ripple-effect` | Cursor-driven refraction over vehicle cards if you want the showroom-glass feel and can afford three + R3F + drei. Pick this **or** the one above, not both. |
| `scroll-tilted-grid` | Gallery of the inventory that resolves into focus as you scroll. Cinematic without being loud. |
| `spotlight-card` | Cursor spotlight over model cards. Zero deps, five variants, reads as showroom lighting. |
| `split-flap-display` | Departure-board flip for price, range, or 0-60 figures. Zero deps, mechanical, distinctive. |
| `showcase-card` | 3D tilt plus parallax for the featured model. Comes with compact, horizontal and grid layouts. |
| `noise-texture` | Fine grain overlay on hero photography. Two KB, kills the flat-render look. |

**Avoid**: `matrix-rain` and `circuit-board` (wrong industry semantics), `particle-galaxy` (600 KB for a space nebula on a car site), `eye-tracking` and `music-player` (toys), `border-beam` and `shimmer-button` (the most cloned Magic UI primitives on the internet; every AI-generated landing page has them).

### 5.2 E-commerce store

Product imagery has to stay clickable and indexable. That rules out canvas-based galleries. Backgrounds should be quiet.

| component | why |
|---|---|
| `dither-gradient` | 3.5 KB atmospheric backdrop for category headers. Cheap enough to use on every page without touching Core Web Vitals. |
| `ripple-transition` | Product image transitions on variant switch. Click origin follows the tap point. |
| `spotlight-card` | Product tiles. Zero deps, stays semantic HTML so the whole card remains a link. |
| `orbit-card-stack` | Collection or bundle picker. `onActiveChange` makes it a real control, not decoration. |
| `testimonial-marquee` | Social proof band. Pure CSS, five layouts, no JavaScript animation cost. Drop the phantom framer-motion declaration. |
| `sticky-scroll-cards` | Editorial "shop the look" scroll section between grid pages. |
| `kinetic-text-reveal` | Category headlines. Real DOM text, so it stays selectable and crawlable. |
| `scrub-input` | Price or size filter. Zero deps, a genuinely useful primitive rather than an effect. |

**Avoid**: `infinite-image-field` (canvas, so products are not links, not crawlable, not accessible), `cursor-driven-particle-typography` (canvas text is invisible to search engines, fatal on commerce pages), `image-trail` (adds GSAP and hurts interaction on touch), `particle-galaxy`, `dither-prism-hero` (the three.js weight will cost you conversions), `magnetic-dock` (a macOS dock on a store is cosplay).

### 5.3 Applied AI engineering school

The brief is "this is a real technical curriculum". Diagrams beat decoration. The one place in this registry where the technical-looking components are actually correct.

| component | why |
|---|---|
| `circuit-board` | The standout. A real node-and-edge diagram primitive with `status: "active" \| "processing" \| "error"` per node and animated pulses along traces. Use it to draw the RAG pipeline, the agent loop, the eval harness. Four prebuilt patterns (`data-flow`, `network`, `processor`, `tree`). |
| `silk-aurora` | Hero. Premium and dark without cliché, zero dependencies, headline slots built in. Signals "serious" rather than "hackathon". |
| `ascii-effect` | Turn an instructor photo or a logo into ASCII. Reads as terminal culture and is genuinely uncommon. Zero deps. |
| `hyper-text` | Character-scramble on module names and technical terms. 2 KB. Restrained enough to use in nav. |
| `github-calendar` | Contribution heatmap for instructors or for a "your first 12 weeks" commitment visual. Real data, real credibility. |
| `scroll-choreography` | Curriculum sections with four-corner image convergence. Rigid API, but if your module has four artefacts it is a perfect fit. |
| `mac-keyboard` | Shortcut and CLI teaching visuals. Interactive keys, unusual, genuinely instructional. |
| `split-flap-display` | Cohort start dates, seats remaining, placement stats. Mechanical rather than SaaS-generic. |
| `closing-plasma` | Footer and enrolment CTA band, matching the `silk-aurora` hero without a second library. |

**Avoid**: `matrix-rain` (the single most exhausted "we do AI" cliché; using it undercuts the exact credibility you are buying), `particle-galaxy` (neural-network-as-nebula is the second most exhausted one, and it costs 600 KB), `dither-prism-hero` (three.js weight on a page whose job is to convert on mobile), `eye-tracking`, `music-player`, `flight-status-card` (off-topic novelty), `border-beam` and `shimmer-button` (every AI bootcamp landing page already has them).

### 5.4 GTM / UGC ads school

The audience is marketers who judge by whether the page itself looks like it converts. Motion should feel expensive and fast. Text has to be big, kinetic, and quotable.

| component | why |
|---|---|
| `webgl-liquid` | Hero. Cinematic, headline slots built in, configurable reveal timing so the copy lands after the shader settles. Only needs clsx and tailwind-merge. |
| `scroll-based-velocity` | Big velocity-skewed marquee for the offer statement. Instantly reads as a modern ad-creative site. |
| `letter-cascade` | Headline letters scatter and reassemble. High-impact and unusual enough to feel bespoke. |
| `scroll-tilted-grid` | The UGC creative wall. Ad frames tilting into focus is precisely what this component does. Best-in-class here. |
| `testimonial-marquee` | Student results and screenshots. Five layouts, pure CSS, zero runtime cost on a page you will run paid traffic to. |
| `sticky-scroll-cards` | The offer stack: modules pinning and scaling as you scroll. Classic high-ticket sales-page motion. |
| `text-repel` | One interactive headline. DOM text so it stays selectable, and the cursor interaction reliably gets played with. |
| `orbit-card-stack` | Pricing or cohort tier picker. `onActiveChange` wires straight into your checkout state. |
| `magnet-lines` | Cheap 3 KB section divider that looks designed rather than templated. |

**Avoid**: `dither-prism-hero` and `particle-galaxy` (page weight is revenue on a paid-traffic landing page), `cursor-driven-particle-typography` (your headline must be crawlable and readable on mobile; canvas text is neither), `command-menu` and `mac-keyboard` (developer-tool signals on a marketing page), `image-trail` (GSAP for one effect, and it is dead weight on touch where most of your traffic lives), `border-beam`, `shimmer-button`, `pulsating-button`, `interactive-hover-button` (the four most-cloned Magic UI primitives; your prospects have seen them on a hundred other course pages this month).

### 5.5 Universal avoid list

Overused to the point of being a tell that a page was assembled rather than designed:

* `border-beam`, `shimmer-button`, `pulsating-button`, `interactive-hover-button`, `hyper-text`, `text-animate`, `scroll-based-velocity`. All are Magic UI ports available in a dozen registries. If you use one, use it once and restyle it.
* `matrix-rain` on anything AI-adjacent.
* `particle-galaxy` as a generic hero background. It is a good component used badly by everyone.
* `liquid-blob` reads as 2021 Dribbble gradient-blob. Skip it; `dither-gradient` or `silk-aurora` costs the same or less and looks current.

Underused and worth reaching for because almost nobody ships them: `circuit-board`, `split-flap-display`, `ascii-effect`, `dithered-logo`, `scrub-input`, `orbit-card-stack`, `silk-aurora`.

---

## 6. Quick reference

**Install a component**

```
npx shadcn@latest add @componentry/silk-aurora
```

**Post-install checklist**

1. If the component is in the `@workspace/ui/lib/utils` or `../lib/utils` list (section 1.6), rewrite the import to `@/lib/utils`.
2. If it is in the undeclared-dependency table, `npm i` the missing package.
3. If it is `shimmer-button`, add the `shimmer-slide` and `spin-around` keyframes to your Tailwind config.
4. If it ships default Unsplash or framerusercontent assets, replace them or whitelist the host.
5. WebGL components already ship an error boundary; you do not need to wrap them again.

**Cheapest premium hero**: `silk-aurora` (zero deps, raw WebGL, headline slots).
**Cheapest atmospheric background**: `dither-gradient` (3.5 KB, zero deps).
**Best diagram primitive**: `circuit-board`.
**Best gallery**: `scroll-tilted-grid`.
**Best product-image transition**: `ripple-transition`.
**Only components that justify three.js**: `particle-galaxy` (three alone) and `dither-prism-hero` (three + R3F).
