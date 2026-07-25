# Canvas UI: CANVAS/WebGL UI technique extraction

Source repo: `C:\Users\oasrvadmin\Documents\md-stack\gmira\_sources\canvas-ui`
Upstream: `https://github.com/DavidHDev/canvas-ui`, site `https://canvasui.dev`
License: MIT + Commons Clause (free to use in commercial projects, only reselling the library itself is restricted).
Size: 25 components, 150 registry entries, ~28,300 lines under `src/lib`.

---

## 1. What this is + install path

### The core idea

Canvas UI is a shadcn-style **copy-in source registry** of WebGL2 effects that run *over live, interactive DOM*. Most of the library is built on Chrome's experimental **html-in-canvas** API. The trick:

1. A `<canvas layoutsubtree="true">` element hosts your real DOM children.
2. `canvas.onpaint` fires whenever the browser repaints that subtree.
3. Inside `onpaint`, `ctx.drawElementImage(contentEl, 0, 0)` rasterizes the live DOM into the 2D canvas.
4. That canvas is uploaded as a WebGL texture (`gl.texImage2D(..., sourceCanvas)`).
5. A second, `pointer-events: none` output canvas runs the fragment shader over the page texture.

Text stays selectable, links stay clickable, and hover states keep working, because the *real* DOM is still there underneath. The output canvas is purely visual.

Feature detection is a three-part probe repeated verbatim in every engine:

```ts
export function supportsHtmlInCanvas(): boolean {
  if (typeof document === "undefined") return false;
  const probe = document.createElement("canvas") as PaintableCanvas;
  const ctx = probe.getContext("2d") as ElementImageContext | null;
  return Boolean(
    ctx &&
    typeof ctx.drawElementImage === "function" &&
    typeof probe.requestPaint === "function",
  );
}
```

When unsupported, every component degrades in one of two ways, decided by a `uHasContent` uniform: either it renders a standalone WebGL overlay (Liquid, Glass, Ripple all have an `if (uHasContent < 0.5) { ... }` branch producing a self-contained look), or it renders nothing and the plain HTML shows through. No errors thrown, no layout change.

Three components (`dithered-object`, `glass-object`, `particle-object`) do not use html-in-canvas at all. They are pure three.js scenes and work in every WebGL2 browser.

### Requirements

- Chrome/Edge 140+ with `chrome://flags/#canvas-draw-element` enabled, **or** a registered Chrome origin trial token served via meta tag or HTTP header (bound to your domain).
- WebGL2 (all engines call `output.getContext("webgl2", {...})` and return `null` if it fails).
- TypeScript recommended. React 19 / Solid 1.9 / Preact 10 / Vue 3.5 / Svelte 5.

### Install commands

```sh
# one time
npx shadcn@latest init

# add a component: pattern is @canvas-ui/<component>-<framework>
npx shadcn@latest add @canvas-ui/liquid-react
npx shadcn@latest add @canvas-ui/glass-vue
npx shadcn@latest add @canvas-ui/shatter-svelte
npx shadcn@latest add @canvas-ui/hex-float-vanilla
```

### Exact registry URL pattern

| Thing | URL |
|---|---|
| Registry index | `https://canvasui.dev/r/registry.json` |
| Single item | `https://canvasui.dev/r/{name}.json` where `{name}` = `{component}-{framework}` |
| Example item | `https://canvasui.dev/r/liquid-react.json` |
| Namespace shorthand | `@canvas-ui/{component}-{framework}` |
| Direct URL install | `npx shadcn@latest add https://canvasui.dev/r/liquid-react.json` |

`{framework}` is one of `react | vue | svelte | solid | preact | vanilla`.
`{component}` is one of the 25 slugs: `asciify, bend, blaze, bubble, cloth, clouds, dithered-object, droplets, frost, glass, glass-object, glitch, grid, hex-float, laser, liquid, magnify, particle-object, particle-reveal, particle-scroll, peel, retro-dither, ripple, shatter, vhs`.

Pin the registry in your own `components.json`:

```json
{
  "registries": {
    "@canvas-ui": "https://canvasui.dev/r/{name}.json"
  }
}
```

MCP setup (shadcn MCP server, any shadcn-compatible registry):

```sh
npx shadcn@latest mcp init --client claude    # or cursor | vscode | opencode
```

Codex uses `~/.codex/config.toml`:

```toml
[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]
```

### Where files land

| Framework | Target path | File |
|---|---|---|
| react / solid / preact | `components/canvasui/` | `Liquid.tsx` |
| vue | `components/canvasui/` | `Liquid.vue` |
| svelte | `src/lib/components/canvasui/` | `Liquid.svelte` |
| vanilla | `components/canvasui/` | `LiquidVanilla.ts` |

### How the registry is built (worth stealing)

`scripts/build-registry.mts` + `src/lib/registry.ts`. The library is authored as **thin framework wrapper + shared vanilla engine**:

```
src/lib/Liquid/
  LiquidVanilla.ts    <- 900 lines, zero framework deps, the actual engine
  Liquid.tsx          <- 123 lines React wrapper, imports from ./LiquidVanilla
  Liquid.vue          <- Vue wrapper
  Liquid.svelte       <- Svelte wrapper
  Liquid.solid.tsx    <- Solid wrapper
  Liquid.preact.tsx   <- Preact wrapper
```

At build time `makeStandalone()` **inlines the engine into the wrapper** by regex-replacing the import line with the engine body, so the shipped file is a single self-contained module with no relative imports:

```ts
function vanillaImport(base: string) {
  return new RegExp(
    `[ \\t]*import\\s*\\{[^}]*\\}\\s*from\\s*["']\\./${base}Vanilla["'];\\r?\\n*`,
  );
}

function makeStandalone(base, wrapper, engine, kind) {
  const body = engine.trimEnd();
  if (kind === "react" || kind === "solid" || kind === "preact") {
    return wrapper
      .replace(vanillaImport(base), body + "\n\n")
      .replace(/\nexport type \{[^}]*\};\n?/, "\n");
  }
  const stripped = wrapper.replace(vanillaImport(base), "");
  if (kind === "vue") return `<script lang="ts">\n${body}\n</script>\n\n${stripped}`;
  const moduleTag = '<script module lang="ts">';
  if (stripped.includes(moduleTag)) {
    return stripped.replace(moduleTag, `${moduleTag}\n${body}\n`);
  }
  return `<script module lang="ts">\n${body}\n</script>\n\n${stripped}`;
}
```

`REGISTRY_ITEMS` is `Object.keys(COMPONENTS).flatMap(c => flavors.map(f => `${c}-${f}`))` = 25 x 6 = 150 JSON files written to `public/r/` plus a `registry.json` index. Dependencies are injected per flavor (`solid-js` for solid, `preact` for preact, `three` + `@types/three` for the three object components).

### Usage shape

Every html-in-canvas component wraps children:

```tsx
import { Liquid } from "@/components/canvasui/Liquid";

<Liquid rainbow style={{ height: 480 }}>
  <YourContent />
</Liquid>
```

Vanilla is a factory returning a small imperative handle:

```ts
import { createLiquid } from "@/components/canvasui/LiquidVanilla";

const liquid = createLiquid(
  {
    source:  document.querySelector<HTMLCanvasElement>("#source")!,
    content: document.querySelector<HTMLDivElement>("#content")!,
    output:  document.querySelector<HTMLCanvasElement>("#output")!,
  },
  { rainbow: true },
);

liquid.setOptions({ radius: 0.4 });
liquid.resize();
liquid.destroy();
```

---

## 2. Full component inventory

25 library components. All live under `src/lib/<Base>/`. Line counts are `React wrapper / vanilla engine`.

| Name | Path (engine) | Technique | What it does | Key props |
|---|---|---|---|---|
| **Asciify** | `src/lib/Asciify/AsciifyVanilla.ts` (124/551) | WebGL2 single pass, packed-bitmap glyph atlas in a `uint[16]` uniform, mipmap LOD sampling, pointer lens, theme MutationObserver | Redraws the live page as 5x5 ASCII glyphs inside a soft radius around the cursor. Three built-in ramps (ascii, blocks, binary) or custom packed bitmaps | `radius, softness, scale, spacing, charset, glyphs, background, backgroundOpacity, contrast, brightness, invert, strength, baseStrength, followSpeed` |
| **Bend** | `src/lib/Bend/BendVanilla.ts` (118/946) | WebGL2 single pass, inverse perspective mapping with a 40-step numerical arc search, wheel overscroll, full TS re-implementation of the shader for DOM hit-testing | Folds the top and bottom of the page over virtual cube edges as you scroll, with rounded creases, overscroll tumble and pointer tilt | `zone, angle, rounding, perspective, direction, ease, smoothing, top, bottom, tumble, tilt` |
| **Blaze** | `src/lib/Blaze/BlazeVanilla.ts` (118/672) | WebGL2 two pass, half-res FBO, voronoi particle sparks + domain-warped fbm smoke, multi-octave simplex heat distortion | Fire sparks, smoke and heat haze rising from the bottom edge, bending the content above them | `height, distortion, distortionScale, speed, sparks, sparkDensity, sparkSize, layers, smoke, glow, sparkColor, smokeColor` |
| **Bubble** | `src/lib/Bubble/BubbleVanilla.ts` (123/638) | WebGL2 single pass, 16-step SDF raymarch, exponential smooth-min metaballs over a 24-entry pointer trail, mipmap LOD frost, scissor-rect culling | A glassy droplet trailing the cursor as blending metaballs, refracting the page with dispersion, frost and iridescence | `size, trail, follow, blend, speed, refraction, dispersion, frost, shine, rim, iridescence, intensity, tint, tintStrength, colorA, colorB, fallbackOpacity` |
| **Cloth** | `src/lib/Cloth/ClothVanilla.ts` (118/886) | WebGL2 two programs, **CPU 97x97 wave-equation cloth sim** at fixed 1/120 dt, indexed mesh with dynamic VBO, arc-length foreshortening, contact shadow pass | Hangs the live HTML on fabric rippling in the wind with lit folds. Cursor strokes brush waves across it | `pin, wind, speed, amplitude, drape, brush, brushSize, damping, light, sheen, shadow, cornerRadius, backing, perspective` |
| **Clouds** | `src/lib/Clouds/CloudsVanilla.ts` (123/776) | WebGL2 three programs / three passes: coverage field FBO + ping-pong wind buffer + composite, every-frame `generateMipmap` on the field for soft shadows, theme observer | Procedural fog drifting over the page, blurring what it covers, parted by cursor wind, with a soft drop shadow | `scale, speed, cover, density, shading, color, opacity, shadow, shadowOffsetX, shadowOffsetY, shadowSoftness, wind, windRadius, refraction, fogBlur, quality` |
| **Dithered Object** | `src/lib/DitheredObject/DitheredObjectVanilla.ts` (58/661) | three.js + PMREM procedural studio room, offscreen `WebGLRenderTarget` with 4x MSAA, full-screen-triangle post pass, Bayer 4x4 ordered dither | Any GLB/glTF model floating in a studio scene rendered through a 1-bit dither | `src, gridSize, pixelSizeRatio, grayscale, invert, dither, background, highlight, environmentIntensity, roughness, scale, xOffset, yOffset, floatIntensity, rotationIntensity, floatSpeed, orbit, zoom, autoRotate, autoRotateSpeed, fov, cameraDistance, dracoDecoderPath, onLoad, onError` |
| **Droplets** | `src/lib/Droplets/DropletsVanilla.ts` (123/737) | WebGL2 two programs, quarter-res ping-pong wipe buffer, egg SDF drop bodies, numeric normal from 3 full evaluations of the drop field, scroll-locked offset | Rain droplets running down the screen, refracting the page behind them, wipeable with the pointer | `intensity, speed, scale, dropWidth, dropLength, refraction, blur, vignette, fallSpeed, wiggle, staticDrops, interactive, interactionRadius, interactionStrength, interactionDistortion, tint, tintStrength` |
| **Frost** | `src/lib/Frost/FrostVanilla.ts` (122/1186) | WebGL2 **six programs**, baked 1024² noise + 512² height textures, TS-generated Gaussian kernel injected into GLSL, separable blur chain, half-float ping-pong melt buffer with scroll reprojection, Fresnel refraction | A frozen pane of ice over the page. Hovering melts a hole that refreezes. Intro grows the frost in from the edges | `frost, strength, contrast, crispness, highlight, highlightStrength, haze, tintThin, tintThick, tintStrength, saturation, brightness, refraction, ior, detail, textureScale, fresnel, meltRadius, meltNoise, meltStrength, refreeze, edgeFade, meltEdges, introDuration, opacity, shimmer, quality` |
| **Glass** | `src/lib/Glass/GlassVanilla.ts` (118/611) | WebGL2 single pass, rounded-box SDF lens, `refract()` per wavelength (6 samples), Schlick fresnel + GGX specular, mipmap LOD blur, **scissor-rect culling**, `closest()` target zoom | A cursor-following glass lens that refracts the page like real glass, with a crystal-ball zoom over selected elements | `shape, size, aspect, corner, ior, edge, bevel, depth, aberration, blur, reflection, shine, zoom, targets, follow` |
| **Glass Object** | `src/lib/GlassObject/GlassObjectVanilla.ts` (58/1168) | three.js `MeshPhysicalMaterial` transmission + native dispersion, Beer-Lambert absorption, PMREM studio or canvas-baked equirect from the backdrop image, marching-squares contour trace + Douglas-Peucker + Chaikin + bezier fillets + `ExtrudeGeometry` for 2D assets | Turns any GLB, SVG or image into floating liquid glass with real refraction, dispersion, frost and tinted absorption | `src, ior, thickness, roughness, dispersion, clearcoat, tint, tintDensity, depth, bevel, highlight, environmentIntensity, background, backgroundImage, scale, xOffset, yOffset, floatIntensity, rotationIntensity, floatSpeed, orbit, zoom, autoRotate, autoRotateSpeed, fov, cameraDistance, dracoDecoderPath, onLoad, onError` |
| **Glitch** | `src/lib/Glitch/GlitchVanilla.ts` (118/424) | WebGL2 single pass, band-hash slice tearing, per-cell block corruption, RGB channel offset, envelope-driven burst timeline, imperative `burst()` API | Broadcast glitch bursts that tear the page into shifted slices with RGB splits and corrupted blocks, then settle clean | `intensity, interval, duration, slices, shift, rgbShift, blocks, noise` |
| **Grid** | `src/lib/Grid/GridVanilla.ts` (118/795) | WebGL2 two passes, RGBA32F 64x1 trail data texture, one-texel-per-tile heightmap FBO, screen-space raycast with inverse perspective + 3-step binary search for side walls, idle ambient ripples | Splits the page into a grid of 3D cube tiles that ripple in waves around the cursor | `tileSize, gap, cornerRadius, amplitude, waveSpeed, frequency, waveWidth, fadeTime, maxLift, jitter, liftHeight, perspective, tilt, shading, tint, tintStrength, idleRipples` |
| **Hex Float** | `src/lib/HexFloat/HexFloatVanilla.ts` (123/1616) | The biggest one. **Full GPU Navier-Stokes fluid** (96² sim) + hex-lattice DDA ray march (64 steps) + bloom/grain post chain, ~13 programs, adaptive supersampling, TS re-projection for DOM hit-testing, rewrites `:hover` rules across all stylesheets | Renders the live page onto a floor of beveled hex tiles that lean back in perspective, bob, and flatten into a readable window where the cursor stirs the fluid | `size, gap, bevel, tilt, perspective, float, speed, shine, lift, radius, flow, swirl, trail, iridescence, bloom, grain, gapColor` |
| **Laser** | `src/lib/Laser/LaserVanilla.ts` (118/641) | WebGL2 single pass, parabolic 1D beam envelope, inverse-power + exponential glow, reveal band with fbm smoke emission, Reinhard tonemap, **scroll activity accumulator**, DOM-measured beam width | Hides everything above a glowing laser beam near the bottom of the viewport. Scrolling prints new content in from behind it | `speed, offset, color, thickness, core, radius, glow, wave, width, flicker, reveal, heat, shimmer, sparkle, reactivity` |
| **Liquid** | `src/lib/Liquid/LiquidVanilla.ts` (123/900) | WebGL2 **9 programs, full Navier-Stokes fluid** (curl, vorticity, divergence, Jacobi pressure, gradient subtract, advect) on half-float double targets, sRGB-correct compositing | A pointer-driven fluid simulation over the page that warps and tints the content | `simResolution, dyeResolution, densityDissipation, velocityDissipation, pressure, pressureIterations, curl, radius, force, intensity, distortion, blend, color, rainbow` |
| **Magnify** | `src/lib/Magnify/MagnifyVanilla.ts` (123/689) | WebGL2 single pass, `fwidth()`-derived mipmap LOD for correct minification, analytic 2D SDF HUD reticle, 6-slot ripple uniform array, **creates a real DOM readout element**, scissor culling | A sci-fi scanner lens magnifying the page inside a HUD reticle, with click ripples that bend the page | `size, zoom, color, follow, hud, ring, crosshair, ticks, brackets, dot, grid, readout, aberration, haze, ripples, rippleSpeed, rippleWidth, rippleBendWidth, rippleBend, rippleGlow, rippleLife` |
| **Particle Object** | `src/lib/ParticleObject/ParticleObjectVanilla.ts` (58/1007) | three.js `Points` with `DynamicDrawUsage`, area-weighted triangle surface sampling with binary search, alpha-weighted pixel scan for 2D assets, **CPU spring/damper physics** with camera-space push field | Rebuilds any GLB, SVG or image as a cloud of particles the cursor pushes, swirls and springs back into shape | `src, count, size, sizeVariance, color, radius, strength, swirl, spring, damping, drift, background, scale, xOffset, yOffset, floatIntensity, rotationIntensity, floatSpeed, orbit, zoom, autoRotate, autoRotateSpeed, fov, cameraDistance, dracoDecoderPath, onLoad, onError` |
| **Particle Reveal** | `src/lib/ParticleReveal/ParticleRevealVanilla.ts` (123/512) | WebGL2 single pass, per-cell hash probability dust with background-contrast gating, radial + tangential edge warp, chromatic aberration ring | Renders the page as fine grayscale dust that merges back into crisp UI around the cursor | `radius, softness, size, scatter, drift, aberration, bend, fade, threshold, background, smoothing` |
| **Particle Scroll** | `src/lib/ParticleScroll/ParticleScrollVanilla.ts` (123/694) | WebGL2 two programs, **`gl.POINTS` with `gl_VertexID`-generated particles** (no attribute buffers), R32F row-progress texture as a 1D reveal timeline, windowed to the viewport | Dissolves everything below a chosen line into drifting sand that reassembles as you scroll up past it | `point, band, density, size, spread, gravity, drift, swirl, stagger, fade, settle, smoothing` |
| **Peel** | `src/lib/Peel/PeelVanilla.ts` (148/622) | WebGL2 single program, 97x97 vertex grid, **analytic cylinder curl in the vertex shader** with perspective divide via `gl_Position.w`, depth test, live `pointerEvents` gating, second DOM layer underneath | Peels the page back from a chosen edge as the cursor approaches, revealing a second layer | `side, mode, reveal, zone, curl, bow, shade, shine, shineDistance, shineColor, bulge, perspective, smoothing` |
| **Retro Dither** | `src/lib/RetroDither/RetroDitherVanilla.ts` (123/463) | WebGL2 single pass, 4x4 Bayer matrix as an `int[16]`, 4-level ordered quantization, palette lerp, hue-preserving mode, pointer lens with hash-based coverage | A retro dither lens that pixelates and quantizes the page around the cursor | `radius, softness, pixelSize, levels, darkColor, lightColor, colorize, contrast, brightness, strength, baseStrength, invert, scanlines, followSpeed` |
| **Ripple** | `src/lib/Ripple/RippleVanilla.ts` (118/502) | WebGL2 single pass, analytic **gradient of a Gaussian-windowed sine wave train** for up to 12 ripples in a `vec4[12]` uniform, dispersion, directional glint, CPU pruning | Water ripples spreading from every click, refracting the page like a pond surface with glints on the crests | `amplitude, speed, wavelength, rings, decay, refraction, dispersion, shine, trigger, interval` |
| **Shatter** | `src/lib/Shatter/ShatterVanilla.ts` (123/702) | WebGL2 single pass, per-fragment 5x5 neighbourhood loop, **analytic inverse of a per-tile 3D rotation + perspective**, jittered voronoi shard SDF with `smin`, two-layer depth resolve, cast shadows | Shatters the page into 3D glass shards that lift, tilt and float around the cursor, refracting content beneath | `radius, softness, tileSize, shards, corner, lift, tilt, scatter, perspective, gapColor, shadow, shading, refraction, dispersion, floatSpeed, strength, baseStrength, followSpeed` |
| **VHS** | `src/lib/VHS/VHSVanilla.ts` (118/545) | WebGL2 single pass, 7-octave value noise, row-coherent artifacts from one `lineNoise`, 11-tap horizontal bloom with **per-channel asymmetric tap windows**, barrel distortion, **CPU mirror of the GLSL noise** for frame-coherent scalars | Plays the page back like a worn VHS tape with tape wave, head-switch noise, chroma bleed and grain | `speed, wave, jitter, crease, switching, switchingHeight, bloom, aberration, acBeat, grain, scanlines, vignette, barrel, saturation, exposure` |

### Non-library files (docs site only, not in the registry)

`src/components/ui/*` (10 shadcn base primitives), `src/components/docs/*` (16 doc-site widgets), `src/components/landing/*` (16 marketing sections), `src/components/playground/*`, `src/demos/*-demo.tsx` (25 demo harnesses showing the prop-control patterns), `src/hooks/{use-demo-controls, use-preference, use-theme-toggle}.ts`. Useful as reference for building a controls panel over a canvas component, not as shippable effects.

---

## 3. Deep dives

### 3.1 Liquid: real-time Navier-Stokes fluid over the DOM

**The idea.** Run Pavel Dobryakov's WebGL fluid solver at low resolution, then use the resulting velocity field as a **UV displacement** on the page texture, and the dye field as a color overlay. The page becomes something you can stir.

**The algorithm.** 9 shader programs sharing one vertex shader that precomputes the four neighbour UVs (`vL, vR, vT, vB`), which removes four texel-size adds from every fragment in every stencil pass:

```glsl
uniform vec2 texelSize;
void main () {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}
```

Per frame, `step(delta)` does the standard incompressible-flow sequence on ping-ponged framebuffers:

1. **curl** = `R - L - T + B` on velocity, written to an R16F target.
2. **vorticity confinement**: build a force from the gradient of `|curl|`, normalize it with `force /= length(force) + 1.0` (avoids a divide-by-zero and softens outliers), scale by `uCurlStrength * C`, add to velocity. This is what makes the trail curl into eddies instead of dissipating into mush.
3. **divergence** = `0.5 * (R - L + T - B)`, with reflective boundary handling (`if (vL.x < 0.0) L = -C.x;`).
4. **pressure decay**: multiply the previous pressure by `Math.pow(config.pressure, delta * 60)` so carry-over is frame-rate independent.
5. **Jacobi pressure solve**, `config.pressureIterations` (default 4) iterations of `p = (L + R + B + T - divergence) * 0.25`.
6. **gradient subtract**: `velocity -= vec2(R - L, T - B)` on pressure, making the field divergence-free.
7. **advect** velocity by itself, then dye by velocity, both semi-Lagrangian: `coord = vUv - uDt * texture(uVelocity, vUv).xy * texelSize`.

The display pass is where the DOM enters. It is done in **linear light**, which is the detail most fluid-over-content demos get wrong:

```glsl
void main () {
  vec3 fluid = texture(uFluid, vUv).rgb;
  if (uHasContent < 0.5) {              // WebGL-only fallback path
    float mag = length(fluid);
    vec3 tint = uRainbow == 1.0 ? clamp(fluid / max(mag, 1e-3), 0.0, 1.0) : uColor;
    float overlay = (1.0 - exp(-mag * uIntensity * 0.5)) * 0.82;
    outColor = vec4(toSrgb(clamp(tint, 0.0, 1.0)) * overlay, overlay);
    return;
  }
  vec2 uv = vUv - fluid.rg * uDistortion * 0.001;
  vec4 content = texture(uContent, vec2(uv.x, 1.0 - uv.y));
  content.rgb = toLinear(content.rgb);
  vec3 tint = uRainbow == 1.0 ? fluid : uColor * length(fluid);
  vec4 blended = mix(content, vec4(tint, 1.0), uBlend * 0.01 * clamp(length(fluid), 0.0, 1.0));
  vec4 final = mix(blended, vec4(0.0), 1.0 - content.a);
  outColor = vec4(toSrgb(clamp(final.rgb, 0.0, 1.0)), final.a);
}
```

Note the flipped Y (`1.0 - uv.y`) on the content sample: `drawElementImage` writes top-down, WebGL reads bottom-up. Every engine in this library does the same flip.

**The performance guard.** The loop stops itself once the dye has faded below visibility, computed analytically from the dissipation constant rather than guessed:

```ts
function idleDelayMs() {
  const dissipation = Math.min(config.densityDissipation, 0.999);
  const frames = Math.log(1e-7) / Math.log(dissipation);
  return (frames / 60) * 1000;
}
```

Pointer splats are queued, not applied immediately, so multi-touch and fast movement produce one coherent batch per frame:

```ts
function onPointerMove(event: PointerEvent) {
  if (reducedMotion) return;
  const rect = output.getBoundingClientRect();
  const px = event.clientX - rect.left;
  const py = event.clientY - rect.top;
  const previous = pointers.get(event.pointerId);
  pointers.set(event.pointerId, { x: px, y: py });
  if (!previous) return;                       // first move gives no velocity
  const dx = (px - previous.x) * config.force;
  const dy = -(py - previous.y) * config.force;
  queued.push([px / rect.width, 1 - py / rect.height, dx, dy]);
  start();
}
```

`setOptions` deliberately **ignores resolution changes** (`const { simResolution, dyeResolution, ...rest } = next;`) because they would require reallocating every framebuffer.

**When to reach for it.** Hero sections where you want motion that responds to the visitor but never blocks reading. It works over any content because the distortion is a small UV nudge (`* 0.001`), not a warp. Good default for "make the fold feel alive" without a video file.

---

### 3.2 Glass: physically-motivated lens over live content

**The idea.** Instead of a CSS `backdrop-filter` blur circle, actually trace refraction through a virtual glass slab floating `depth` pixels above the page.

**The algorithm.** A rounded-box signed distance field defines the lens, and `-sd` distance to the rim drives a bevel factor:

```glsl
float sdf (vec2 p) {
  vec2 q = abs(p) - (uHalf - vec2(uCorner));
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uCorner;
}
```

The surface normal is a central difference of that SDF, blended between a nearly flat face and the steep rim:

```glsl
float edgeW = max(minHalf * (1.0 - clamp(uEdge, 0.0, 0.98)), 1.0);
float rim = pow(linearStep(-edgeW, 0.0, sd), uBevel);
vec2 grad = vec2(
  sdf(p + vec2(e, 0.0)) - sdf(p - vec2(e, 0.0)),
  sdf(p + vec2(0.0, e)) - sdf(p - vec2(0.0, e)));
vec3 rimNormal = vec3(normalize(grad + vec2(1e-5)), 0.0);
vec3 normal = normalize(mix(flatNormal, rimNormal, rim));
```

Refraction is GLSL's built-in `refract()` against that normal, and the ray is projected onto the page plane by dividing by its z component scaled to the optical depth:

```glsl
vec3 sampleRefraction (vec2 basePx, float rim, vec3 normal, float glassIor) {
  vec3 rv = refract(INCIDENT, normal, AIR_IOR / glassIor);
  rv /= abs(rv.z) / uDepth;
  return pageAA(basePx + rv.xy, uBlur * (1.0 + rim));
}
```

Chromatic aberration is done properly: **six wavelength-specific IORs** are traced and masked into RGB/CMY channels, then divided by 3, giving true rainbow fringing at the rim instead of a naive three-tap RGB offset.

```glsl
float iorForWavelength (float wavelength) {
  float ab = uAberration * 0.1;
  return mix(uIor + ab, uIor - ab,
    1.0 - pow(1.0 - linearStep(450.0, 650.0, wavelength), 4.0));
}
```

Reflection is Schlick fresnel with `F0 = ((ior - air) / (ior + air))²`, modulated by a GGX specular lobe, so the rim picks up a plausible highlight rather than a flat white ring. All of it happens in **linear space**: `page()` does `pow(texel, 2.2)` on read, `main()` does `pow(glass, 1/2.2)` on write.

**Performance guards.** Two that matter:

1. **Scissor rect.** Only the pixels under the lens are rasterized, not the whole viewport.

```ts
const cx = posX * dpr;
const cy = output.height - posY * dpr;
const margin = 4 * dpr;
const sx = Math.max(0, Math.floor(cx - halfW * dpr - margin));
const sy = Math.max(0, Math.floor(cy - halfH * dpr - margin));
gl.enable(gl.SCISSOR_TEST);
gl.scissor(sx, sy,
  Math.min(output.width - sx,  Math.ceil(halfW * dpr * 2 + margin * 2)),
  Math.min(output.height - sy, Math.ceil(halfH * dpr * 2 + margin * 2)));
```

2. **Mipmaps for blur.** The content texture uses `LINEAR_MIPMAP_LINEAR` and `generateMipmap()` runs on every upload, so `blur` is free (a `textureLod` level) instead of a multi-tap blur pass. `pageAA` picks a minimum LOD from the screen-space derivative so magnified samples do not alias:

```glsl
vec3 pageAA (vec2 px, float minLod) {
  float footprint = max(length(fwidth(px)), 1.0);
  return page(px, max(minLod, log2(footprint)));
}
```

**Crystal-ball zoom.** `targets` is a CSS selector. On pointermove it does `event.target?.closest?.(config.targets)` and eases `zoomTarget` between 1 and `config.zoom`. The zoom itself is one line in the shader: `vec2 basePx = uCenter + p / uZoom;`.

**When to reach for it.** Pricing tables, spec sheets, comparison grids: anywhere a visitor is scanning dense information and you want to give them a physical-feeling focus tool. Set `targets` to your headings and CTAs so the lens magnifies exactly the things you want read.

---

### 3.3 Shatter: analytic per-tile 3D transform without geometry

**The idea.** Break the page into thousands of independently rotated, lifted, perspective-projected shards with **zero vertex data**. Everything is solved backwards, per fragment.

**The algorithm.** For each fragment the shader walks a 5x5 neighbourhood of tiles. For each candidate tile it builds the tile's own rotation matrix and lift from a hash of the cell coordinate, then **inverts the forward transform** to find which point of that tile (if any) projects onto this fragment:

```glsl
bool invMap (vec2 P, mat3 R, float lift, vec2 anchor, out vec2 q) {
  vec2 w = P - anchor;
  float m11 = uPersp * R[0][0] + w.x * R[0][2];
  float m12 = uPersp * R[1][0] + w.x * R[1][2];
  float m21 = uPersp * R[0][1] + w.y * R[0][2];
  float m22 = uPersp * R[1][1] + w.y * R[1][2];
  float det = m11 * m22 - m12 * m21;
  if (abs(det) < 1e-4) return false;
  vec2 b = w * (uPersp - lift);
  q = vec2(m22 * b.x - m12 * b.y, m11 * b.y - m21 * b.x) / det;
  return true;
}
```

That is a hand-solved 2x2 linear system for `q` given the screen point `P`, the tile rotation `R`, the lift, and the perspective focal length. It replaces a full mesh, an index buffer and a depth buffer.

Shard shapes come from a jittered voronoi built with **exponential smooth-min**, which is what turns a hard voronoi into glass with slightly rounded fracture corners:

```glsl
float smin (float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float shardD (vec2 q, vec2 cell, float k) {
  float jit = uTile * 0.8 * clamp(uShards, 0.0, 1.0);
  vec2 s0 = (hash22(cell) - 0.5) * jit;
  float d = uTile;
  for (int i = 0; i < 9; i++) {
    if (i == 4) continue;
    vec2 g = vec2(float(i % 3 - 1), float(i / 3 - 1));
    vec2 sn = g * uTile + (hash22(cell + g) - 0.5) * jit;
    vec2 diff = sn - s0;
    float e = -dot(q - s0 - diff * 0.5, normalize(diff));
    d = smin(d, e, k);
  }
  return d;
}
```

Depth is resolved by keeping only the **two highest** contributors (`k1/a1/c1` and `k2/a2/c2`) and blending them by their lift separation, which gives correct-looking occlusion at a fraction of the cost of sorting. Cast shadows are a second `shardD` evaluation offset along the light vector, with the shadow only applied to tiles whose cell id differs from the caster.

**Performance guards.** Three early-outs before any work happens:

```glsl
float slack = 3.0 * uTile / uResolution.y;
float lensB = (1.0 - smoothstep(inner, radius, max(length(duv) - slack, 0.0))) * uActive;
float maskB = max(lensB, clamp(uBase, 0.0, 1.0)) * clamp(uStrength, 0.0, 1.0);
if (maskB < 1e-4) { outColor = vec4(0.0); return; }   // outside the lens entirely
...
float guard = step(uvR.x, uMaxX) * tex.a;
if (guard < 1e-4) { outColor = vec4(0.0); return; }   // transparent page pixel
...
if (cd > rr * rr) continue;                            // tile too far to matter
```

Time wraps at `TIME_WRAP = Math.PI * 800` so float precision never degrades in a long session, and the loop only advances `time` when tiles are actually floating:

```ts
const floating =
  !reducedMotion &&
  config.floatSpeed > 0.001 &&
  Math.min(config.strength, 1) > 0.001 &&
  (pointer.active > 1e-3 || Math.min(config.baseStrength, 1) > 0.001);
```

`uScroll` is fed from `content.scrollLeft/scrollTop`, so shards stay glued to the document rather than the viewport.

**When to reach for it.** Transitions and reveals rather than persistent decoration. A `baseStrength: 0` + pointer lens configuration reads as "the page is glass and your cursor is cracking it," which is a strong but tiring effect. Use it on one section, not the whole site.

---

### 3.4 Ripple: analytic wave-train gradient, 12 ripples in one uniform

**The idea.** Simulate a pond without a simulation. Each ripple is a closed-form damped sine wave train, and refraction comes from the **analytic derivative** of that wave, not from a normal map.

**The algorithm.** Each ripple is packed into a `vec4`: `(x, y, age, amplitude)`. The fragment loops over up to 12 of them and accumulates a gradient:

```glsl
for (int i = 0; i < 12; i++) {
  if (i >= uCount) break;
  vec4 rp = uRipples[i];
  vec2 dv = frag - rp.xy;
  float r = length(dv);
  float front = uSpeed * rp.z;            // wavefront radius = speed * age
  float s = r - front;                    // signed distance behind the front
  float env = exp(-s * s / w2)            // gaussian ring window
            * exp(-uDecay * rp.z)         // temporal decay
            * rp.w;                       // amplitude
  env *= smoothstep(0.0, 0.08, rp.z);     // fade in on birth
  env *= inversesqrt(1.0 + front / max(uWavelength, 1.0) * 0.2); // 1/sqrt(r) energy spread
  if (env < 0.0015) continue;
  float dh = (k * cos(s * k) - 2.0 * s / w2 * sin(s * k)) * env;
  grad += dv / max(r, 1.0) * dh * uWavelength * 0.16;
}
```

The `dh` line is the product rule applied to `env(s) * sin(s*k)`: the derivative of the sine gives `k*cos(s*k)`, the derivative of the Gaussian envelope gives `-2s/w² * sin(s*k)`. Getting this exactly right is what makes the crests look like water instead of like a blurred ring.

That gradient then does triple duty:

```glsl
float g = dot(grad, vec2(-0.55, -0.8));               // project onto a light direction
float glint = pow(clamp(g * 2.2, 0.0, 1.0), 2.0) * uShine;
float shade = pow(clamp(-g * 1.6, 0.0, 1.0), 2.0) * uShine * 0.3;
vec2 offs = grad * uRefraction / uResolution;          // UV displacement
col = vec3(page(pUv + offs * (1.0 + d)).r,             // dispersion
           page(pUv + offs).g,
           page(pUv + offs * (1.0 - d)).b);
```

**Performance guards.** Ripples are pruned on the CPU using two independent conditions (travelled past the diagonal, or decayed below threshold), so the uniform array is always dense:

```ts
function pruneRipples(delta: number) {
  const diag = Math.hypot(output.clientWidth, output.clientHeight);
  const speedPx = BASE_SPEED * Math.max(config.speed, 0.05);
  const width = config.wavelength * Math.max(config.rings, 1) * 0.5;
  for (let i = ripples.length - 1; i >= 0; i--) {
    const rp = ripples[i];
    rp.age += delta;
    const gone =
      rp.age * speedPx > diag + width * 3 ||
      Math.exp(-Math.max(config.decay, 0.05) * rp.age) * rp.amp < 0.012;
    if (gone) ripples.splice(i, 1);
  }
}
```

Hover mode has a minimum-distance gate so a slow drag does not spawn 60 ripples per second: `if (Math.hypot(x - hoverX, y - hoverY) < 56) return;`. When no ripples are alive the loop calls `renderIdle()` once and then stops entirely.

**When to reach for it.** Click feedback on the whole page. This is the single cheapest way to make an entire site feel responsive: `trigger: "click"`, moderate `refraction`, `interval: 0`. Costs nothing while idle.

---

### 3.5 Asciify: glyph atlas as packed integers in a uniform

**The idea.** Render text-mode ASCII art over the live page with **zero textures and zero font loading**. Each glyph is a 5x5 bitmap packed into the low 25 bits of a `uint`.

**The algorithm.** The ramps are literal integers:

```ts
const CHARSETS: Record<AsciifyCharset, number[]> = {
  ascii:  [0, 128, 131200, 14336, 459200, 469440, 4357252, 18157905, 11512810, 15724526],
  blocks: [0, 328000, 22041621, 22369621, 11512810, 33554431],
  binary: [0, 4591758, 15324974],
};
const MAX_GLYPHS = 16;
```

Bit extraction in the shader, with the x axis reversed so the packing reads left-to-right:

```glsl
float glyphBit (int index, ivec2 p) {
  if (p.x < 0 || p.x > 4 || p.y < 0 || p.y > 4) return 0.0;
  uint bits = uGlyphs[index];
  return float((bits >> uint((4 - p.x) + 5 * p.y)) & 1u);
}
```

Cell selection is where the quality comes from. The cell colour is sampled from a **mipmap level chosen to match the cell size**, so the glyph reflects the average brightness of everything under it rather than one arbitrary texel:

```ts
gl.uniform1f(uniforms.uLod, Math.max(0, Math.log2((5 + 2 * spacing) * glyphCss) - 1));
```

The density metric is contrast **against the page background**, not raw luminance. That is why it works on both light and dark themes:

```glsl
float lum = dot(pixel.rgb, vec3(0.299, 0.587, 0.114));
float amount = abs(lum - uBackingLum);
amount = clamp((amount - 0.5) * uContrast + 0.5 + uBrightness, 0.0, 1.0);
amount = mix(amount, 1.0 - amount, clamp(uInvert, 0.0, 1.0));
int index = min(int(amount * float(uGlyphCount)), uGlyphCount - 1);
```

Glyph colour is a **saturation restore**: dividing the colour difference from the background by the contrast pushes muted text back to full chroma so the ASCII does not turn grey mush.

```glsl
vec3 glyphColor = clamp(uBg + (pixel.rgb - uBg) / max(abs(lum - uBackingLum), 0.2), 0.0, 1.0);
```

**The lens dither.** The boundary of the effect is not a smooth alpha fade, which would look like a blur. It is a **per-cell hash threshold**, so cells flip to ASCII stochastically across the edge:

```glsl
float apply = mask < 0.003 ? 0.0 : step(hash21(cell), mask);
if (apply < 0.5) { outColor = vec4(0.0); return; }
```

`baseStrength` reuses the same mask, so `baseStrength: 0.15` sprinkles a permanent 15% of ASCII cells across the whole page with the cursor pushing it to 100% locally.

**Theme awareness.** Asciify re-samples the page background whenever the theme changes, with a 300ms follow-up read to catch CSS transitions:

```ts
let themeTimer = 0;
function onThemeShift() {
  syncBacking();
  start();
  window.clearTimeout(themeTimer);
  themeTimer = window.setTimeout(() => { syncBacking(); start(); }, 300);
}
const themeObserver = new MutationObserver(onThemeShift);
themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["class", "style", "data-theme"],
});
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", onThemeShift);
```

**When to reach for it.** Technical brands. Set `charset: "binary"` and `baseStrength: 0.1` and the whole site reads as a terminal without becoming unreadable, because the underlying DOM is untouched.

---

### 3.6 Retro Dither: the smallest complete example (463 lines)

**The idea.** The best file to read first. It is the shared skeleton plus roughly 40 lines of actual effect, which makes it the right template for a new component.

**The algorithm.** Two independent grids: a pixelation grid and a dither grid.

```glsl
float ditherQuant (float v, ivec2 cell) {
  float x = v * uLevels;
  int level = int(floor(fract(x) * 4.0));
  float add = 0.0;
  if (level == 1)      { if (cell.x % 4 == (2 * cell.y) % 4) add = 1.0; }
  else if (level == 2) { if (cell.x % 2 != cell.y % 2)       add = 1.0; }
  else if (level == 3) { if (cell.x % 4 != (2 * cell.y) % 4) add = 1.0; }
  return floor(x + add) / uLevels;
}

float bayer (ivec2 p) {
  int b[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return (float(b[(p.y % 4) * 4 + (p.x % 4)]) + 0.5) / 16.0;
}
```

`ditherQuant` is a 4-step ordered dither inside each quantization band. `bayer` is the canonical 4x4 matrix, used here not for colour but as the **lens edge threshold** (`float apply = step(bayer(ivec2(cell)), mask);`), which gives a crisp retro dissolve at the rim instead of a soft alpha ramp.

The palette blend keeps a hue-preserving option:

```glsl
vec3 palette = mix(uDark, uLight, q);
vec3 keepHue = pixel.rgb * (q / max(lum, 0.001));   // rescale original colour to the quantized level
vec3 dithered = mix(keepHue, palette, clamp(uColorize, 0.0, 1.0));
dithered *= 1.0 - uScanlines * 0.45 * mod(cell.y, 2.0);
```

**When to reach for it.** As a template. Also as a hover treatment on product thumbnails when you want a lo-fi brand signature that still shows real product colour (`colorize: 0.1` keeps 90% of the original hue).

---

### 3.7 Particle Reveal: dust that knows what is UI and what is background

**The idea.** Dissolve the page into grain, but only the parts that are actually content. Empty background stays flat, so the effect reads as "the UI is made of dust" and not "the screen is noisy."

**The algorithm.** The gate is contrast against a declared background colour, evaluated **twice**: once at the pixel's home position (to decide whether this cell should ever produce dust) and once at the wandered dust position (to decide the dust's colour and probability):

```glsl
float g0 = uThreshold * 0.6;
float g1 = uThreshold * 1.6 + 0.01;
vec3 lw = vec3(0.299, 0.587, 0.114);

float uiHome = smoothstep(g0, g1, dot(abs(baseRgb - uBg), lw));

float rad = uScatter * pow(n1, 2.5) * (1.0 - e);        // bright cells wander furthest
float ang = n2 * 6.2832 + uTime * uDrift * (0.5 + n3 * 1.5);
vec2 dustP = bp + vec2(cos(ang), sin(ang)) * rad;
...
float gate = smoothstep(g0, g1, dDust);
float falloff = 1.0 - 0.7 * rad / max(uScatter, 1.0);
float prob = clamp(gate * (0.15 + 1.2 * sqrt(dDust)) * falloff, 0.0, 1.0) * uiHome;
float speck = step(n4 * 0.999, prob);
```

`pow(n1, 2.5)` biases most grains to stay near home with a long tail of far strays, which is what real dispersal looks like. `n4` is re-hashed on a **quantized time step** (`float ft = floor(uTime * (2.0 + uDrift * 6.0));`), so the dust twinkles at a controlled rate rather than strobing at frame rate.

The reveal edge gets two treatments that sell it as an optical effect rather than a mask:

```glsl
float band = radius * 0.9;
float ring = smoothstep(inner, radius, dist)
           * (1.0 - smoothstep(radius, radius + band, dist)) * uActive;
vec2 dir  = (pc - uPointer) / max(dist, 1e-3);
vec2 tang = vec2(-dir.y, dir.x);
vec2 warp = (dir * -1.0 + tang * 0.6) * uBend * ring;   // radial pull + tangential swirl
float ca  = uAberration * ring;                          // chromatic split only at the rim
```

Colours are then sampled as `vec3(samp(p + dir*ca).r, samp(p).g, samp(p - dir*ca).b)`, giving a lens-like fringe that appears only in the transition ring.

**Reduced motion.** This component has the cleanest degradation in the library: a single uniform short-circuits the entire shader to a passthrough.

```glsl
if (uCrisp > 0.5) { outColor = samp(pc); return; }
```
```ts
gl.uniform1f(uniforms.uCrisp, reducedMotion || !htmlInCanvas ? 1 : 0);
```

**When to reach for it.** Gated content, "sign in to see prices", loading states, or an intro where the page assembles itself. `background` must match your actual page background or the threshold logic inverts.

---

### 3.8 Particle Scroll: attribute-free particles driven by a 1D progress texture

**The idea.** Millions of possible particles, no vertex buffers, and a reveal timeline that is *per document row* rather than per particle.

**The algorithm.** Two things make this unusual.

**1. Particles generated from `gl_VertexID`.** The draw call is `gl.drawArrays(gl.POINTS, 0, gridX * winLen)` against an **empty VAO**. Every particle derives its identity arithmetically:

```glsl
float fid = float(gl_VertexID);
vec2 local = vec2(mod(fid, uGrid.x), floor(fid / uGrid.x));
vec2 cell  = vec2(local.x, local.y + uWinStart);
float h1 = hash(cell);
float h2 = hash(cell + vec2(1.7, 9.1));
...
vec2 home = vec2((cell.x + 0.5) * uDensity, (cell.y + 0.5) * uDensity - uScroll);
```

Culled particles are pushed outside the clip volume rather than discarded in the fragment stage, which is much cheaper:

```glsl
if (vis < 0.5) {
  gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  gl_PointSize = 0.0;
  ...
  return;
}
```

**2. A `R32F` 1D texture as the reveal timeline.** CPU-side, one float per document row holds "how assembled is this row", eased toward a target derived from scroll position. Only rows in (or near) the viewport window are animated; everything else snaps.

```ts
function rowTargetFor(docRowY: number) {
  if (reducedMotion || !introDone) return 1;
  const h = Math.max(output.clientHeight, 1);
  const band = Math.max(config.band, 1);
  const max = content.scrollHeight - content.clientHeight;
  let line = Math.min(Math.max(config.point, 0), 1) * h;
  if (max <= 1) {
    line = h + band;                                    // no scroll: everything assembled
  } else {
    const endP = Math.min(Math.max((scrollSmooth - (max - h * 0.5)) / (h * 0.5), 0), 1);
    line += (h + band - line) * endP * endP;            // release the line at the page end
  }
  const vy = docRowY - scrollSmooth;
  return Math.min(Math.max((line + band - vy) / band, 0), 1);
}
```

Only the visible window is uploaded, which keeps the texture tiny regardless of document height:

```ts
rowWindow.fill(1);
const from = Math.min(Math.max(winStart, 0), docRows);
const to   = Math.min(winStart + winLen, docRows);
if (to > from) rowWindow.set(rowProgress.subarray(from, to), from - winStart);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, winLen, 1, 0, gl.RED, gl.FLOAT, rowWindow);
```

Both the background quad and the point shader read the **same** row texture with the **same** stagger hash, so a particle vanishes at exactly the moment its pixel appears in the base pass. No double-draw, no seam.

```glsl
float d = h1 * uStagger;                                   // per-particle delay
float t = clamp((p - d) / max(1.0 - d, 1e-3), 0.0, 1.0);   // remapped progress
// base pass:  float vis = step(0.9995, t);
// point pass: float vis = 1.0 - step(0.9995, t);
```

**Scroll lag.** Fast scrolling smears the cloud, which is the detail that makes it feel like matter:

```ts
lag += scrollTop - lastScrollTop;
lastScrollTop = scrollTop;
lag *= Math.exp(-delta / 0.22);
lag = Math.min(Math.max(lag, -400), 400);
if (reducedMotion || Math.abs(lag) < 0.1) lag = 0;
```

And a whole-page optimisation: `if (!htmlInCanvas || rowsAssembled) return;` skips the entire point draw once everything has settled.

**When to reach for it.** Long editorial pages, curricula, feature lists. It converts scrolling into a reward loop without any per-element `IntersectionObserver` wiring, and it works on content you did not author.

---

### 3.9 Peel: analytic curl in the vertex shader

**The idea.** Fold a sheet of DOM around a cylinder using nothing but a 97x97 vertex grid and closed-form geometry. No physics, no cloth solver, sub-millisecond.

**The algorithm.** Everything happens in the vertex shader. First the sheet is rotated into a canonical `(u, v)` frame so one code path serves all four edges:

```glsl
float crossLen = (uSide < 1.5) ? uRes.y : uRes.x;
float u; float v;
if (uSide < 0.5)      { u = p.x;            v = p.y; }   // left
else if (uSide < 1.5) { u = uRes.x - p.x;   v = p.y; }   // right
else if (uSide < 2.5) { u = p.y;            v = p.x; }   // top
else                  { u = uRes.y - p.y;   v = p.x; }   // bottom
```

Then the curl: everything with `u < c` wraps around a cylinder of radius `R`, and beyond half a turn it becomes a flat tangent segment lying back over the sheet.

```glsl
float A  = clamp(uPeel, 0.0, 1.0);
float f  = A * uReveal;
float R  = max(uCurl * A, 0.001);
float c0 = f + R;

float dvB = (uPointer.y - v) / max(crossLen * 0.28, 1.0);
float prox = clamp(1.0 - uPointer.x / max(c0 + uZone, 1.0), 0.0, 1.0);
float c = c0 + uBulge * A * prox * prox * exp(-dvB * dvB);   // gaussian bulge toward the cursor

float x = u, z = 0.0, sh = 0.0;
if (A > 0.001 && u < c) {
  float theta = (c - u) / R;
  if (theta <= PI) {
    x = c - R * sin(theta);
    z = R * (1.0 - cos(theta));
  } else {
    x = c + (theta - PI) * R;   // past half a turn: straight tangent
    z = 2.0 * R;
  }
  sh = sin(clamp(theta, 0.0, PI));   // shading follows the surface normal's tilt
}
z += uBow * A * sin(PI * v / max(crossLen, 1.0)) * clamp(z / max(R, 1.0), 0.0, 1.5);
z = clamp(z, -uFocal * 0.2, uFocal * 0.45);
```

The perspective divide is done by writing `w` directly instead of building a projection matrix:

```glsl
vec2 ndc = (q / uRes) * 2.0 - 1.0;
ndc.y = -ndc.y;
float w = (uFocal - z) / uFocal;
gl_Position = vec4(ndc, -z / uFocal, w);
```

That is the entire 3D pipeline: three lines. Depth testing (`gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);`) resolves the sheet folding over itself.

**The interaction detail nobody remembers.** When the sheet has peeled back, the DOM underneath is still receiving pointer events from a piece of page that is visually somewhere else. Peel fixes that by computing where the curl tail actually ends and toggling `pointerEvents` live:

```ts
function syncContentEvents() {
  const A = peel.a;
  const R = Math.max(config.curl * A, 0.001);
  const c = A * config.reveal + R + Math.max(config.bulge, 0) * A;
  const tailEnd = Math.max(c, 2 * c - Math.PI * R);
  const blocked = A > 0.02 && pointer.u < tailEnd;
  const next = blocked ? "none" : "auto";
  if (content.style.pointerEvents !== next) content.style.pointerEvents = next;
}
```

The `under` layer is kept `visibility: hidden` until the first successful capture, avoiding a one-frame flash of both layers:

```ts
if (under && htmlInCanvas) under.style.visibility = "hidden";
// ... later, in render():
if (under && hasTexture && under.style.visibility === "hidden") under.style.visibility = "";
```

Two drive modes, one function:

```ts
function updateTarget() {
  if (config.mode === "hover") {
    const open = peel.target > 0.5;
    const limit = open ? peel.a * config.reveal + config.zone : config.zone;  // hysteresis
    peel.target = pointer.u < limit ? 1 : 0;
    return;
  }
  const span = Math.max(config.zone + peel.a * config.reveal, 1);
  peel.target = Math.min(1, Math.max(0, 1 - pointer.u / span));
}
```

The `open ? ... : ...` limit is hysteresis: once open, the closing threshold is further away, so the peel does not flicker at the boundary.

**When to reach for it.** Reveal a second layer of information: price under a spec card, "what you will build" under a course module, a discount under a product tile. It is the most commercially usable component in the set because it maps directly onto a content pattern people already understand.

---

### 3.10 Cloth: CPU wave-equation fabric feeding a dynamic VBO

**The idea.** A real (if simplified) cloth simulation on the CPU driving a 97x97 mesh, with arc-length foreshortening so the fabric visibly *shortens* when it billows, which is the cue that sells depth.

**The algorithm.** The simulation is a damped 2D wave equation with a spring term, integrated with Verlet-style position stepping at a fixed 1/120s:

```ts
const c2 = WAVE_SPEED * WAVE_SPEED;
const dt2 = dt * dt;
const decay = Math.exp(-Math.min(Math.max(config.damping, 0.05), 8) * dt);
for (let y = 0; y < NODES; y++) {
  const up = Math.max(y - 1, 0) * NODES;
  const down = Math.min(y + 1, SEG) * NODES;
  const row = y * NODES;
  for (let x = 0; x < NODES; x++) {
    const i = row + x;
    const l = row + Math.max(x - 1, 0);
    const r = row + Math.min(x + 1, SEG);
    const h = hCur[i];
    const lap = hCur[l] + hCur[r] + hCur[up + x] + hCur[down + x] - 4 * h;
    const [a, b] = axisFor(x, y);
    const force = windAmp * rowForce[b] * colForce[a];
    const acc = c2 * lap - STIFFNESS * h + force;
    const next = 2 * h - hPrev[i] + dt2 * acc;
    let value = h + (next - h) * decay;
    if (value > 3.5) value = 3.5;
    else if (value < -3.5) value = -3.5;
    hNext[i] = value;
  }
}
```

Three buffers rotate (`hPrev`, `hCur`, `hNext`) with no allocation. Wind is **separable**: `rowForce[b] * colForce[a]`, precomputed as two 1D arrays per step instead of a 2D field, which cuts the inner loop cost dramatically. `axisFor()` remaps `(x, y)` so `pin: "top" | "bottom" | "left" | "right"` all reuse the same solver.

**Foreshortening** is the detail that makes it read as fabric. A displaced sheet covers less screen area than a flat one, so the code walks each grid line accumulating the horizontal shortfall from the arc length:

```ts
function foreshorten(axisStride, lineStride, ds, anchor, comp) {
  const ds2 = ds * ds;
  for (let l = 0; l < NODES; l++) {
    const base = l * lineStride;
    offsetData[(base + anchor * axisStride) * 2 + comp] = 0;
    let cum = 0;
    for (let k = anchor + 1; k < NODES; k++) {
      const i = base + k * axisStride;
      const dz = zField[i] - zField[i - axisStride];
      cum += ds - Math.sqrt(Math.max(ds2 - dz * dz, 0));
      offsetData[i * 2 + comp] = -cum;
    }
    cum = 0;
    for (let k = anchor - 1; k >= 0; k--) { /* mirror, opposite sign */ }
  }
}
```

Normals come from central differences of the z field, and a discrete Laplacian becomes a fold-darkening term:

```ts
const dzdx = (zField[r] - zField[l]) / (2 * cellW);
const dzdy = (zField[down + x] - zField[up + x]) / (2 * cellH);
const inv = 1 / Math.hypot(dzdx, dzdy, 1);
const curve = zField[l] + zField[r] + zField[up + x] + zField[down + x] - 4 * zField[i];
let fold = 1 - curve * 0.01;
if (fold < 0.86) fold = 0.86; else if (fold > 1.06) fold = 1.06;
vertexData[o] = zField[i];
vertexData[o + 1] = -dzdx * inv;
vertexData[o + 2] = -dzdy * inv;
vertexData[o + 3] = fold;
```

Only the z component is stored implicitly (`vNormal = vec3(nxy, sqrt(max(1.0 - dot(nxy, nxy), 0.04)))`), saving a third of the VBO bandwidth.

**The lighting is normalized against a flat sheet**, so a still cloth looks exactly like the original page and only the folds add shading. This is important: naive dot-product lighting darkens the whole surface and destroys contrast.

```glsl
float diffFlat = 0.58 + 0.42 * lightDir.z;
float diff     = 0.58 + 0.42 * dot(n, lightDir);
float shade    = mix(1.0, (diff / diffFlat) * vFold, uLight);
float specFlat = pow(halfway.z, 34.0);
float spec = max(pow(max(dot(n, halfway), 0.0), 34.0) - specFlat, 0.0) / (1.0 - specFlat);
```

The cursor brush uses a critically damped spring for the touch point plus a Gaussian imprint that pulls both `hCur` and `hPrev` (so it injects position without injecting artificial velocity):

```ts
const g = Math.exp(-(ox * ox + oy * oy));
if (g < 0.02) continue;
const pull = rate * g;
const goal = lift * g;
hCur[i]  += (goal - hCur[i])  * pull;
hPrev[i] += (goal - hPrev[i]) * pull;
```

The canvas is expanded by a 48px `BLEED` on all sides via inline style so the billowing fabric and its shadow are not clipped.

**When to reach for it.** Hero cards, testimonial panels, banner sections. Set `wind: 0` and it becomes a static draped panel that only reacts to the cursor, which is a much more usable default for commercial work than constant flapping.

---

### 3.11 Frost: the deepest multi-pass pipeline in the library

**The idea.** Six programs, two baked textures, a separable blur chain, and a half-float ping-pong melt buffer. This is the reference for "how do I build a real post-processing pipeline in a single self-contained file."

**Key techniques.**

**Baked static noise.** Two textures generated once at startup rather than per frame: a 1024² RGBA noise texture (R = domain-warped periodic fbm, G = mottle, B = sparkle, A = melt-edge irregularity) and a 512² `gl.REPEAT` height map. The warp function is periodic so it tiles seamlessly:

```glsl
float pwarp (vec2 p, float period, float g) {
  float val = 0.0;
  for (int i = 0; i < 2; i++) {
    val = pfbm(p + g * vec2(cos(6.28318 * val), sin(6.28318 * val)), period, 4);
  }
  return val;
}
```

**Gaussian weights computed in TypeScript and string-injected into GLSL.** This gives a compile-time-unrolled loop with no uniform array reads:

```ts
function buildBlurWeights(kernel: number): string {
  const weights: number[] = [];
  let total = 0;
  for (let i = 0; i < kernel; i++) {
    const w = Math.exp((-0.5 * (i * i)) / (kernel * kernel * 0.25));
    // ...
  }
  return [
    `#define KERNEL_SIZE ${kernel}`,
    `#define WEIGHT_CENTER ${normalized[0]}`,
    `const float WEIGHTS[KERNEL_SIZE - 1] = float[KERNEL_SIZE - 1](${normalized/* ... */});`,
  ].join("\n");
}
const blurProgram = createProgram(
  FRAG_BLUR.replace("WEIGHTS_PLACEHOLDER", buildBlurWeights(BLUR_KERNEL)),
);
```

**Half-float melt buffer with scroll reprojection.** The melt state ping-pongs at half resolution in `RGBA16F` when `EXT_color_buffer_float` is available, and is **reprojected by the scroll delta** (`uBackShift`) so the melted hole stays attached to the page content, not the viewport.

**Fresnel refraction from a height map.** Normals are central differences at two scales (broad at ~900px, fine at ~260px), combined, then refracted with Schlick weighting:

```glsl
vec2 offset = (R1.xy * 0.3 + R2.xy * uDetail * heightW * 0.5) * uRefraction * 0.2;
float F0 = pow((uIor - 1.0) / (uIor + 1.0), 2.0);
float fresnel = F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
```

**Watchdog instead of a dirty flag.** Because the melt decays asymptotically, a boolean "is it animating" is unreliable. Frost computes how long refreeze will take and keeps the loop alive until then:

```ts
function refreezeDelayMs() {
  const decay = Math.max(config.refreeze * 0.001, 1e-5);
  return (1 / decay / 60) * 1000 + 500;
}
```

**Public imperative API with a queue.** `melt(x, y)` pushes into `queuedMelts`, which are all replayed as extra ping-pong blits inside one frame, so programmatic melts do not need one frame each.

**When to reach for it.** Seasonal campaigns, "unlock" interactions, and as the architectural template when a single-pass shader is no longer enough. `introDuration` giving a grow-in-from-the-edges entrance is a genuinely good page-load moment.

---

### 3.12 Hex Float: fluid simulation as an interaction affordance

**The idea.** The most ambitious component. It tessellates the page onto floating hex tiles under a tilted camera, which makes the text unreadable, and then uses a **fluid simulation as the reading affordance**: where you stir with the cursor, the tiles flatten and fuse into a flat window you can read through, and the window slowly heals.

**Three subsystems in one 1616-line file.**

1. **GPU Navier-Stokes** at `SIM_RES = 96` (velocity RG16F, pressure/divergence/curl R16F, double-buffered) plus a 256² R16F flow field. Same solver as Liquid: curl, vorticity, divergence, 4 Jacobi pressure iterations, gradient subtract, advect.

2. **Hex lattice ray marching.** The hex cell comes from picking the nearer of two offset `mod` lattices:

```glsl
vec2 hextile (inout vec2 p) {
  const vec2 sz = vec2(1.0, SQ3);
  const vec2 hsz = 0.5 * sz;
  vec2 p1 = mod(p, sz) - hsz;
  vec2 p2 = mod(p - hsz, sz) - hsz;
  vec2 p3 = dot(p1, p1) < dot(p2, p2) ? p1 : p2;
  // ...
}
```

The camera is derived analytically from the tilt angle, `float focal = (D + sqrt(D * D + H * H * sa * sa)) / (H * ca);`, and a ray is DDA-walked across up to 64 hex cells, slab-intersected against three hex plane normals plus the z extrusion range.

The fluid drives both tile height and, critically, **half-width**, so stirred tiles widen until their seams close:

```glsl
hwc = mix(hw, 0.502, smoothstep(0.18, 0.85, fCell));
```

3. **Post chain**: bright-pass, two separable blur passes, composite with hash grain. Both `bloom` and `grain` skip the pass entirely at 0.

**Adaptive supersampling.** Two rotated-grid samples always, two more only when the first two disagree:

```glsl
if (dot(abs(a - b), vec4(1.0)) > 0.02) {
  c += shade(sUv + vec2(-0.375,  0.125) * px)
     + /* fourth sample */;
}
```

**The hard part: making a 3D-projected page still clickable.** HexFloat re-implements the exact camera in TypeScript and intersects the z=0 plane to convert a screen point back to a content point:

```ts
const t = -roZ / rdZ;
const px = (roX + rdX * t) * cell - scrollX;
```

Then, because CSS `:hover` no longer fires where the user sees the element, it **rewrites every `:hover` selector in every stylesheet** and drives a synthetic hover chain via an attribute plus a `--canvasui-cursor` custom property:

```ts
const HOVER_REWRITE =
  `:is([${HOVER_ATTR}], :hover:where(:not([${CONTENT_ATTR}], [${CONTENT_ATTR}] *)))`;
rule.selectorText = rule.selectorText.replace(/:hover\b/g, HOVER_REWRITE);
```

Text selection is handled by `caretPositionFromPoint` at the reprojected coordinates. Bend uses the same machinery (`mapPoint()` is a 40-iteration TS re-implementation of its own arc search).

**Perf.** `simActiveUntil = now + 4000` keeps the fluid stepping for four seconds after the last pointer event, then stops.

**When to reach for it.** Rarely, and knowingly. It is the most expensive component here and it deliberately obstructs reading. Use it for a single showcase moment (a "look what the web can do" page, a launch teaser), never over a conversion path. Extract the fluid-as-affordance pattern though: it generalizes to any "reveal what you touch" mechanic.

---

## 4. Canvas craft rules extracted from the codebase

These are the rules every one of the 25 engines follows. They are the actual value of this repo for a skill library.

### 4.1 DPR and retina handling

**Rule: clamp DPR at 2, always, no exceptions.** Every single engine has this line. A 3x phone display would otherwise triple fragment cost for no visible gain.

```ts
const dpr = Math.min(window.devicePixelRatio || 1, 2);
const width  = Math.max(1, Math.round(output.clientWidth  * dpr));
const height = Math.max(1, Math.round(output.clientHeight * dpr));
if (output.width !== width || output.height !== height) {
  output.width = width;
  output.height = height;
}
```

**Rule: guard the write.** `if (output.width !== width)` matters because assigning to `canvas.width` clears the backing store and resets all GL state on some drivers, even when the value is unchanged.

**Rule: derive DPR back from the canvas at render time, do not re-read `devicePixelRatio`.** This keeps uniforms consistent with whatever size the canvas actually is, including during a resize race:

```ts
const dpr = output.width / Math.max(output.clientWidth, 1);
```

**Rule: every CSS-pixel option is multiplied by DPR at the uniform boundary, never inside the shader.** The shader works in device pixels; the API works in CSS pixels.

```ts
gl.uniform1f(uniforms.uTile,    Math.max(config.tileSize, 24) * dpr);
gl.uniform1f(uniforms.uLift,    Math.max(config.lift, 0)      * dpr);
gl.uniform1f(uniforms.uScatter, Math.max(config.scatter, 0)   * dpr);
gl.uniform1f(uniforms.uPersp,   Math.max(config.perspective, 200) * dpr);
```

**Rule: the source canvas stays at CSS resolution, only the output canvas is DPR-scaled.** `drawElementImage` rasterizes at CSS pixel scale, so upscaling the source buys nothing:

```ts
const cssWidth  = Math.max(1, Math.round(source.clientWidth));
const cssHeight = Math.max(1, Math.round(source.clientHeight));
if (source.width !== cssWidth || source.height !== cssHeight) {
  source.width = cssWidth;
  source.height = cssHeight;
}
```

### 4.2 Resize strategy

**Rule: `ResizeObserver`, never a `window.resize` listener.** Window resize misses container-driven layout changes (sidebars, accordions, font loading). Observe both the output canvas and the content element:

```ts
const observer = new ResizeObserver(() => {
  syncCanvasSize();
  start();
});
observer.observe(output);
observer.observe(content);
```

**Rule: track content width separately from canvas width.** When the content is narrower than the canvas (scrollbar gutters, max-width containers), sampling past its edge gives garbage. Every engine passes a `uMaxX` uniform and clamps or discards beyond it:

```ts
contentMaxX = Math.min(1, Math.max(0.05, content.clientWidth / Math.max(output.clientWidth, 1)));
```
```glsl
if (uv.x > uMaxX) { outColor = vec4(0.0); return; }
// and inside every sampler:
p.x = clamp(p.x, 0.0005, uMaxX - 0.0005);
p.y = clamp(p.y, 0.0005, 0.9995);
```

The `0.0005` inset is deliberate: it prevents `CLAMP_TO_EDGE` from smearing edge texels when a displaced sample lands exactly on the boundary.

**Rule: resize triggers a repaint request, not just a canvas resize.** Otherwise the texture is stale at the new size for one frame:

```ts
if (htmlInCanvas) { /* ...resize source... */ paintable.requestPaint!(); }
```

**Rule: expose an imperative `resize()` on the instance** for cases the observer cannot see (manual transforms, canvas moved in the DOM).

### 4.3 RAF lifecycle and cleanup

This is the most transferable pattern in the repo. **The loop is not a loop, it is a state machine that stops.**

```ts
let raf = 0;
let lastTime = performance.now();
let destroyed = false;
let running = false;
let visible = true;

function frame(now: number) {
  if (destroyed) return;
  if (!visible) { running = false; return; }        // off-screen: stop, do not schedule

  const delta = Math.min((now - lastTime) / 1000, 1 / 30);   // hard clamp
  lastTime = now;

  // ... integrate state, render ...

  if (settled && !contentDirty) {
    // snap to exact targets so float drift never accumulates
    pointer.x = pointer.tx;
    pointer.y = pointer.ty;
    running = false;                                 // stop
    return;
  }
  raf = requestAnimationFrame(frame);
}

function start() {
  if (destroyed || running || !visible) return;      // idempotent, re-entrant safe
  running = true;
  lastTime = performance.now();                      // reset the clock, no catch-up jump
  raf = requestAnimationFrame(frame);
}
```

Rules encoded here:

1. **`start()` is idempotent.** Every event handler, observer callback and `setOptions` call ends in `start()`. Calling it 50 times in one tick schedules one frame.
2. **`lastTime = performance.now()` on every start.** Without this, a loop resuming after 10 seconds off-screen integrates a 10-second delta and the effect explodes.
3. **Delta is clamped to `1/30` (Cloth uses `1/20`).** A stalled tab must not produce a giant physics step.
4. **Snap on settle.** Before stopping, exponential easing is replaced with exact assignment, so the state is bit-exact and the next `start()` does not immediately re-detect motion.
5. **`contentDirty` keeps the loop alive.** When the DOM repaints, the texture must be re-uploaded even if nothing else moved.

**The wake pattern.** `onpaint` fires before `start` exists in scope, so a forward-declared closure is used:

```ts
let wake = () => {};
if (htmlInCanvas) {
  paintable.onpaint = () => {
    try {
      sourceCtx!.reset();
      sourceCtx!.drawElementImage!(content, 0, 0);
      contentDirty = true;
      wake();
    } catch {}
  };
}
// ...much later...
wake = start;
start();
```

Note the bare `catch {}`. `drawElementImage` can throw on cross-origin content or during teardown, and an exception inside `onpaint` would break the browser's paint loop.

**Destroy is exhaustive and ordered.** Every engine's `destroy()` follows the same order: flag, cancel RAF, disconnect observers, remove listeners, restore mutated DOM, delete GPU objects, null `onpaint`.

```ts
destroy() {
  destroyed = true;
  cancelAnimationFrame(raf);
  observer.disconnect();
  intersection.disconnect();
  themeObserver.disconnect();
  schemeQuery.removeEventListener("change", onThemeShift);
  window.clearTimeout(themeTimer);
  motionQuery.removeEventListener("change", onMotionChange);
  listenTarget.removeEventListener("pointermove", onPointerMove);
  listenTarget.removeEventListener("pointerleave", onPointerLeave);
  content.style.pointerEvents = "";          // restore what we mutated
  if (under) under.style.visibility = "";
  gl.deleteTexture(contentTexture);
  gl.deleteProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  gl.deleteBuffer(quad);
  gl.deleteVertexArray(vao);
  if (htmlInCanvas) paintable.onpaint = null;
}
```

The three.js components add: `renderer.setAnimationLoop(null)`, `controls.dispose()`, a `disposeObject()` traversal that disposes geometry plus every `THREE.Texture` found on each material, `pmrem.dispose()`, `envTarget.dispose()`, `draco.dispose()`, `renderer.dispose()`, and a `loadToken += 1` so in-flight async loads discard themselves.

### 4.4 Offscreen culling

**Rule: `IntersectionObserver` stops the loop, it does not just skip the render.** Skipping a render still costs a RAF callback per frame per instance.

```ts
const intersection = new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1]?.isIntersecting ?? true;
  if (visible) start();
});
intersection.observe(output);
```

`entries[entries.length - 1]` takes the most recent entry, because the callback can be batched with several stale entries. `?? true` fails open: if something is wrong, render rather than go blank.

The three.js components are the exception and the weakness: they use `renderer.setAnimationLoop` and only early-return inside the callback, so the RAF keeps ticking off-screen. If you lift those, add the stop.

**Rule: cull in screen space too.** Glass, Bubble and Magnify compute a bounding rect around the active region and `gl.scissor` to it, so a 120px lens on a 4K page rasterizes 120px worth of fragments.

### 4.5 prefers-reduced-motion

**Rule: query it once, listen for changes, and restart the loop on change.**

```ts
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = motionQuery.matches;
function onMotionChange() { reducedMotion = motionQuery.matches; start(); }
motionQuery.addEventListener("change", onMotionChange);
```

**Rule: reduced motion means the easing constant becomes 1, not that the effect disappears.** The lens still follows the cursor, it just teleports instead of gliding:

```ts
const ease = reducedMotion ? 1 : 1 - Math.exp(-delta * Math.max(config.followSpeed, 0.5));
```

Four distinct strategies appear, pick the one that matches your effect:

| Strategy | Component | Code |
|---|---|---|
| Snap easing to instant | RetroDither, Asciify, Shatter, Glass, Peel | `const k = reducedMotion ? 1 : 1 - Math.exp(-delta / tau);` |
| Kill the effect entirely | Glitch | `if (!reducedMotion) advanceTimeline(delta); else envelope = 0;` |
| Refuse new input | Liquid, Ripple | `function onPointerMove(e) { if (reducedMotion) return; ... }` and `splash()` early-returns |
| Passthrough uniform | ParticleReveal | `gl.uniform1f(uniforms.uCrisp, reducedMotion \|\| !htmlInCanvas ? 1 : 0);` plus a shader early-return |

**Rule: freeze the clock, do not just hide the motion.** Shatter gates its `time` accumulator so nothing drifts while reduced:

```ts
const floating = !reducedMotion && config.floatSpeed > 0.001 && /* ... */;
if (floating) { time += delta * config.floatSpeed; if (time >= TIME_WRAP) time -= TIME_WRAP; }
```

### 4.6 Pointer input normalization

**Rule: normalize against `getBoundingClientRect()`, not `offsetX`/`layerX`.** Those are inconsistent across browsers and wrong when the target is a child element.

```ts
function onPointerMove(event: PointerEvent) {
  const rect = output.getBoundingClientRect();
  pointer.tx = (event.clientX - rect.left) / Math.max(rect.width, 1);
  pointer.ty = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);   // flip to GL space
  pointer.target = 1;
  start();
}
```

**Rule: listen on `output.parentElement ?? output`, not on the canvas.** The output canvas is `pointer-events: none`, so it never receives events. The wrapper does.

```ts
const listenTarget = output.parentElement ?? output;
listenTarget.addEventListener("pointermove", onPointerMove);
listenTarget.addEventListener("pointerleave", onPointerLeave);
```

Components that need to know **which element** was hovered (Glass with its `targets` selector) listen on `content` instead, with `{ passive: true }`, so `event.target.closest(selector)` resolves to a real DOM node.

**Rule: separate raw target from eased value.** `{ x, y, tx, ty, active, target }` is the standard shape: `tx/ty` are set by the event, `x/y` are integrated in the frame loop.

**Rule: `active` is a 0..1 presence value, not a boolean.** Pointer enter and leave animate rather than pop:

```ts
const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, target: 0 };
// onPointerMove:  pointer.target = 1;
// onPointerLeave: pointer.target = 0;
// in frame():     pointer.active += (pointer.target - pointer.active) * ease;
```

**Rule: velocity requires a previous sample, and the first move must produce none.** Otherwise the first pointer event injects a huge impulse from the origin:

```ts
const previous = pointers.get(event.pointerId);
pointers.set(event.pointerId, { x: px, y: py });
if (!previous) return;
```

**Rule: multi-touch is a `Map` keyed by `pointerId`,** cleaned on both `pointerleave` and `pointercancel`.

**Rule: rate-limit continuous spawners by distance, not by time.**

```ts
if (Math.hypot(x - hoverX, y - hoverY) < 56) return;
```

**Rule: pointer speed is an exponential moving average with an explicit decay.** ParticleObject:

```ts
const dt = Math.max((now - lastPointerTime) / 1000, 1e-3);
pointerSpeed += (speed - pointerSpeed) * 0.35;
// every frame, independent of events:
pointerSpeed *= Math.exp(-3 * delta);
```

### 4.7 How they avoid layout thrash

1. **`getBoundingClientRect()` is called once per event, never per frame.** Frame loops read `output.clientWidth/clientHeight` (cheap, cached) or the already-known `output.width/height`.
2. **Nothing writes DOM layout in the render loop.** The only DOM writes anywhere are: Peel's `content.style.pointerEvents` (guarded by an equality check), Peel's `under.style.visibility` (once), Magnify's readout `<div>` (position + textContent, both non-layout-invalidating for an absolutely positioned element), and Cloth's one-time inline canvas expansion at construction.
3. **The DOM to texture path is the browser's own paint, not `html2canvas`.** `onpaint` fires *after* layout, so reading the DOM there is free.
4. **Background sampling walks `parentElement` once, at construction and on theme change**, never per frame, and writes the result to a 1x1 canvas rather than parsing CSS colour strings:

```ts
let el: Element | null = content;
while (el) {
  const bg = getComputedStyle(el).backgroundColor;
  if (bg && bg !== "transparent") {
    probeCtx.clearRect(0, 0, 1, 1);
    probeCtx.fillStyle = bg;
    probeCtx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = probeCtx.getImageData(0, 0, 1, 1).data;
    if (a > 0) { backingRgb = [r / 255, g / 255, b / 255]; break; }
  }
  el = el.parentElement;
}
```

5. **`setOptions` mutates a config object in place and calls `start()`.** No re-instantiation, no shader recompile, no buffer reallocation. Only Frost's `quality` and Liquid's resolutions are exempt, and Liquid explicitly discards them.
6. **Uniform locations are cached at link time by introspection**, so no `getUniformLocation` in the frame loop:

```ts
const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
for (let i = 0; i < count; i++) {
  const info = gl.getActiveUniform(program, i)!;
  uniforms[info.name] = gl.getUniformLocation(program, info.name)!;
}
```

### 4.8 How they degrade

Four layers of fallback, in order:

1. **No `document`** (SSR): `supportsHtmlInCanvas()` returns `false` immediately.
2. **No WebGL2**: `createXxx()` returns `null`. The React wrapper detects this and flips to plain DOM:

```tsx
instanceRef.current = createLiquid({ source, content, output }, initialOptions);
if (native && !instanceRef.current) setFailed(true);
```

3. **No html-in-canvas**: `htmlInCanvas` is `false`, the content texture stays 1x1 transparent, `uHasContent` is 0, and the shader takes a standalone overlay branch. Liquid draws a pure fluid, Glass draws a rim-lit lens outline, Ripple draws glints only.
4. **`prefers-reduced-motion`**: as above.

The React wrapper renders children in **one of two positions** depending on support, and hydration-safe:

```tsx
const supported = useSyncExternalStore(emptySubscribe, supportsHtmlInCanvas, () => false);
const native = supported && !failed;
// ...
<canvas ref={sourceRef} layoutsubtree="true" suppressHydrationWarning
  style={native ? { position:"absolute", inset:0, width:"100%", height:"100%" }
                : { display:"none" }}>
  {native ? <div ref={contentRef} style={{...}}>{children}</div> : null}
</canvas>
{!native ? <div ref={contentRef} style={{...}}>{children}</div> : null}
<canvas ref={outputRef} aria-hidden style={{ position:"absolute", inset:0, pointerEvents:"none" }} />
```

Three details worth copying: `useSyncExternalStore` with a server snapshot of `false` (so SSR always renders the non-native tree and hydration matches), `suppressHydrationWarning` on the canvas, and `aria-hidden` on the output canvas so screen readers never see the decorative layer.

---

## 5. Reusable primitives

Lift these verbatim into a skill library.

### 5.1 `supportsHtmlInCanvas()` + the capture bridge

```ts
type PaintableCanvas = HTMLCanvasElement & {
  onpaint?: (() => void) | null;
  requestPaint?: () => void;
};

type ElementImageContext = CanvasRenderingContext2D & {
  drawElementImage?: (element: Element, x: number, y: number) => void;
};

export function supportsHtmlInCanvas(): boolean {
  if (typeof document === "undefined") return false;
  const probe = document.createElement("canvas") as PaintableCanvas;
  const ctx = probe.getContext("2d") as ElementImageContext | null;
  return Boolean(
    ctx &&
    typeof ctx.drawElementImage === "function" &&
    typeof probe.requestPaint === "function",
  );
}

// wiring, inside the factory:
const sourceCtx = source.getContext("2d") as ElementImageContext | null;
const paintable = source as PaintableCanvas;
const htmlInCanvas = Boolean(
  sourceCtx &&
  typeof sourceCtx.drawElementImage === "function" &&
  typeof paintable.requestPaint === "function",
);

let contentDirty = false;
let wake = () => {};

if (htmlInCanvas) {
  paintable.onpaint = () => {
    try {
      sourceCtx!.reset();
      sourceCtx!.drawElementImage!(content, 0, 0);
      contentDirty = true;
      wake();
    } catch {}
  };
}
```

### 5.2 The self-stopping RAF state machine

```ts
let raf = 0;
let lastTime = performance.now();
let destroyed = false;
let running = false;
let visible = true;

function frame(now: number) {
  if (destroyed) return;
  if (!visible) { running = false; return; }
  const delta = Math.min(Math.max((now - lastTime) / 1000, 0), 1 / 30);
  lastTime = now;

  const k = reducedMotion ? 1 : 1 - Math.exp(-delta / tau);
  state.value += (state.target - state.value) * k;

  render();

  const settled = Math.abs(state.target - state.value) < EPSILON;
  if (settled && !contentDirty) {
    state.value = state.target;
    running = false;
    return;
  }
  raf = requestAnimationFrame(frame);
}

function start() {
  if (destroyed || running || !visible) return;
  running = true;
  lastTime = performance.now();
  raf = requestAnimationFrame(frame);
}

wake = start;
start();
```

### 5.3 Frame-rate independent exponential easing

The single most reused line in the library. Never use `value += (target - value) * 0.1`, which is frame-rate dependent.

```ts
// tau form: tau is the time constant in seconds, ~63% of the way there per tau
const k = 1 - Math.exp(-delta / Math.max(tau, 1e-4));

// rate form: higher is snappier
const ease = 1 - Math.exp(-delta * Math.max(rate, 0.5));

// per-frame decay constants (matching a "per 60fps frame" authoring value)
const dissipation = Math.pow(config.densityDissipation, delta * 60);
const decay = Math.exp(-dampingRate * delta);
const halfLife = Math.pow(0.5, delta / 0.7);
```

### 5.4 DPR-aware canvas sizing

```ts
let contentMaxX = 1;

function syncCanvasSize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width  = Math.max(1, Math.round(output.clientWidth  * dpr));
  const height = Math.max(1, Math.round(output.clientHeight * dpr));
  if (output.width !== width || output.height !== height) {
    output.width = width;
    output.height = height;
  }
  contentMaxX = Math.min(
    1,
    Math.max(0.05, content.clientWidth / Math.max(output.clientWidth, 1)),
  );
  if (htmlInCanvas) {
    const cssWidth  = Math.max(1, Math.round(source.clientWidth));
    const cssHeight = Math.max(1, Math.round(source.clientHeight));
    if (source.width !== cssWidth || source.height !== cssHeight) {
      source.width  = cssWidth;
      source.height = cssHeight;
    }
    paintable.requestPaint!();
  }
}

// at render time, derive DPR back from the canvas:
const dpr = output.width / Math.max(output.clientWidth, 1);
```

### 5.5 The observer trio

```ts
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = motionQuery.matches;
function onMotionChange() { reducedMotion = motionQuery.matches; start(); }
motionQuery.addEventListener("change", onMotionChange);

const observer = new ResizeObserver(() => { syncCanvasSize(); start(); });
observer.observe(output);
observer.observe(content);

const intersection = new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1]?.isIntersecting ?? true;
  if (visible) start();
});
intersection.observe(output);
```

### 5.6 Theme-aware background sampling

```ts
let backingRgb: [number, number, number] = [1, 1, 1];
let backingLum = 1;
const probe = document.createElement("canvas");
probe.width = probe.height = 1;
const probeCtx = probe.getContext("2d", { willReadFrequently: true });

function syncBacking() {
  backingRgb = [1, 1, 1];
  if (probeCtx) {
    let el: Element | null = content;
    while (el) {
      const bg = getComputedStyle(el).backgroundColor;
      if (bg && bg !== "transparent") {
        probeCtx.clearRect(0, 0, 1, 1);
        probeCtx.fillStyle = bg;
        probeCtx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = probeCtx.getImageData(0, 0, 1, 1).data;
        if (a > 0) { backingRgb = [r / 255, g / 255, b / 255]; break; }
      }
      el = el.parentElement;
    }
  }
  backingLum = 0.299 * backingRgb[0] + 0.587 * backingRgb[1] + 0.114 * backingRgb[2];
}

let themeTimer = 0;
function onThemeShift() {
  syncBacking();
  start();
  window.clearTimeout(themeTimer);
  themeTimer = window.setTimeout(() => { syncBacking(); start(); }, 300);  // catch CSS transitions
}
const themeObserver = new MutationObserver(onThemeShift);
themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["class", "style", "data-theme"],
});
const schemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
schemeQuery.addEventListener("change", onThemeShift);
```

A standalone CSS colour parser, used when the option is a plain string rather than "auto":

```ts
let colorProbe: CanvasRenderingContext2D | null = null;

function parseColor(input: string): [number, number, number] {
  if (typeof document === "undefined") return [0, 0, 0];
  if (!colorProbe) {
    const probe = document.createElement("canvas");
    probe.width = 1;
    probe.height = 1;
    colorProbe = probe.getContext("2d", { willReadFrequently: true });
  }
  if (!colorProbe) return [0, 0, 0];
  colorProbe.fillStyle = "#000000";   // reset so an invalid input does not inherit
  colorProbe.fillStyle = input;
  colorProbe.clearRect(0, 0, 1, 1);
  colorProbe.fillRect(0, 0, 1, 1);
  const data = colorProbe.getImageData(0, 0, 1, 1).data;
  return [data[0] / 255, data[1] / 255, data[2] / 255];
}
```

### 5.7 WebGL boilerplate: compile, link, introspect uniforms, fullscreen quad

```ts
const gl = output.getContext("webgl2", {
  alpha: true,
  depth: false,
  stencil: false,
  antialias: false,
  premultipliedAlpha: true,
});
if (!gl || gl.isContextLost()) return null;

function compile(type: number, text: string): WebGLShader {
  const shader = gl!.createShader(type)!;
  gl!.shaderSource(shader, text);
  gl!.compileShader(shader);
  if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
    console.error("shader error:", gl!.getShaderInfoLog(shader));
  }
  return shader;
}

function link(vertText: string, fragText: string) {
  const vert = compile(gl!.VERTEX_SHADER, vertText);
  const frag = compile(gl!.FRAGMENT_SHADER, fragText);
  const program = gl!.createProgram()!;
  gl!.attachShader(program, vert);
  gl!.attachShader(program, frag);
  gl!.linkProgram(program);
  const uniforms: Record<string, WebGLUniformLocation> = {};
  const count = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl!.getActiveUniform(program, i)!;
    uniforms[info.name.replace("[0]", "")] = gl!.getUniformLocation(program, info.name)!;
  }
  return { program, vert, frag, uniforms };
}

// fullscreen quad, no VAO needed if you only have one
const quad = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, quad);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
// draw with: gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
```

Standard vertex shader:

```glsl
#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main () {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
```

Note the `info.name.replace("[0]", "")` in `link()`: WebGL reports array uniforms as `uRipples[0]`, so stripping the suffix lets you write `uniforms.uRipples`. Asciify keeps the suffix and indexes `uniforms["uGlyphs[0]"]`; pick one convention.

### 5.8 Content texture upload with flip and mipmaps

```ts
const contentTexture = gl.createTexture()!;
gl.bindTexture(gl.TEXTURE_2D, contentTexture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);  // or LINEAR
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
  new Uint8Array([0, 0, 0, 0]));       // 1x1 transparent placeholder, valid before first paint
gl.generateMipmap(gl.TEXTURE_2D);

function uploadContent() {
  if (!htmlInCanvas || !contentDirty) return;
  contentDirty = false;
  gl.bindTexture(gl.TEXTURE_2D, contentTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  gl.generateMipmap(gl.TEXTURE_2D);     // only if you need LOD blur
}
```

Shader-side sampler with the Y flip and the content-width guard:

```glsl
vec4 page (vec2 p) {
  p.x = clamp(p.x, 0.0005, uMaxX - 0.0005);
  p.y = clamp(p.y, 0.0005, 0.9995);
  return texture(uContent, vec2(p.x, 1.0 - p.y));
}
```

Derivative-aware minification (from Glass and Magnify), for anything that scales the page down:

```glsl
vec3 pageAA (vec2 px, float minLod) {
  float footprint = max(length(fwidth(px)), 1.0);
  return page(px, max(minLod, log2(footprint)));
}
```

### 5.9 Ping-pong double framebuffer

```ts
interface Target { fbo: WebGLFramebuffer; texture: WebGLTexture; width: number; height: number; }
interface DoubleTarget { read: Target; write: Target; swap: () => void; }

function createDoubleTarget(size, internalFormat, format, filter): DoubleTarget {
  let read  = createTarget(size, internalFormat, format, filter);
  let write = createTarget(size, internalFormat, format, filter);
  return {
    get read()  { return read; },
    get write() { return write; },
    swap() { const t = read; read = write; write = t; },
  };
}

function blit(target: Target | null) {
  if (target) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    gl.viewport(0, 0, target.width, target.height);
  } else {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, output.width, output.height);
  }
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function bindTexture(texture: WebGLTexture, unit: number): number {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  return unit;                          // returns the unit so it composes with uniform1i
}
```

Float texture capability probe:

```ts
gl.getExtension("EXT_color_buffer_float");
const supportsLinear = Boolean(gl.getExtension("OES_texture_float_linear"));
const filtering = supportsLinear ? gl.LINEAR : gl.NEAREST;
```

### 5.10 The pointer state object

```ts
const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, target: 0 };
const listenTarget = output.parentElement ?? output;

function onPointerMove(event: PointerEvent) {
  const rect = output.getBoundingClientRect();
  pointer.tx = (event.clientX - rect.left) / Math.max(rect.width, 1);
  pointer.ty = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);
  pointer.target = 1;
  start();
}
function onPointerLeave() { pointer.target = 0; start(); }

listenTarget.addEventListener("pointermove", onPointerMove);
listenTarget.addEventListener("pointerleave", onPointerLeave);
```

### 5.11 Hash functions (verbatim, all used in production here)

```glsl
// 1 float from vec2, best quality/cost tradeoff, from Dave Hoskins
float hash12 (vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// vec2 from vec2
vec2 hash22 (vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy);
}

// cheap classic, fine for non-critical jitter
float hash21 (vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// interleaved gradient noise, ideal for temporal/spatial dithering
float ign (vec2 v) {
  return fract(52.9829189 * fract(0.06711056 * v.x + 0.00583715 * v.y));
}

// bayer 4x4 ordered dither threshold
float bayer (ivec2 p) {
  int b[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return (float(b[(p.y % 4) * 4 + (p.x % 4)]) + 0.5) / 16.0;
}

// exponential smooth-min: metaballs
float smoothMin (float d1, float d2, float k) {
  float h = exp(-k * d1) + exp(-k * d2);
  return -log(max(h, 1e-12)) / k;
}

// polynomial smooth-min: rounded SDF unions
float smin (float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// rounded box SDF
float sdf (vec2 p, vec2 half_, float corner) {
  vec2 q = abs(p) - (half_ - vec2(corner));
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - corner;
}
```

### 5.12 sRGB / linear conversion (do all blending in linear)

```glsl
vec3 toLinear (vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
}
vec3 toSrgb (vec3 c) {
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
```
```ts
function srgbToLinear(value: number): number {
  return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}
```

The cheap approximation used by Glass and Magnify when exactness is not needed: `pow(texel, 2.2)` on read, `pow(color, 1.0/2.2)` on write.

### 5.13 The React wrapper (all 22 html-in-canvas components share it)

```tsx
"use client";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createLiquid, supportsHtmlInCanvas, type LiquidInstance, type LiquidOptions } from "./LiquidVanilla";

export interface LiquidProps extends LiquidOptions {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const emptySubscribe = () => () => {};

export function Liquid({ children, className, style, ...options }: LiquidProps) {
  const sourceRef   = useRef<HTMLCanvasElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const outputRef   = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<LiquidInstance | null>(null);
  const [initialOptions] = useState(options);      // freeze construction-time options
  const [failed, setFailed] = useState(false);

  const supported = useSyncExternalStore(emptySubscribe, supportsHtmlInCanvas, () => false);
  const native = supported && !failed;

  useEffect(() => {
    const source = sourceRef.current, content = contentRef.current, output = outputRef.current;
    if (!source || !content || !output) return;
    instanceRef.current = createLiquid({ source, content, output }, initialOptions);
    if (native && !instanceRef.current) setFailed(true);
    return () => { instanceRef.current?.destroy(); instanceRef.current = null; };
  }, [initialOptions, native]);

  useEffect(() => { instanceRef.current?.setOptions(options); });   // no dep array: runs every render
  // ...JSX as shown in 4.8...
}
```

Two subtleties: `useState(options)` freezes the initial options so the construction effect does not re-run on every prop change, and the second effect has **no dependency array**, so live prop updates always reach `setOptions` without needing to enumerate 20 props.

### 5.14 Instance contract

Every engine returns the same shape. Keep this for any new component:

```ts
export interface XxxInstance {
  /** Update effect options live. */
  setOptions: (options: XxxOptions) => void;
  /** Re-read canvas size. Call when the element is resized. */
  resize: () => void;
  /** Stop the loop and release all GPU resources. */
  destroy: () => void;
  /** Optional: an imperative trigger, e.g. Glitch.burst(), Ripple.splash(x,y), Liquid.splat(...), Frost.melt(x,y) */
}
```

Options are always `Partial`, merged over a `Required<XxxOptions>` DEFAULTS object, with every property JSDoc'd including its unit and valid range. That JSDoc is what the docs site auto-generates the API table from, and it is what makes the components MCP-friendly.

---

## 6. Where each component fits a real commercial site

### 6.1 Car dealership

| Component | Concrete use |
|---|---|
| **Glass Object** | Hero: the dealership logo or a brand emblem as liquid glass, slowly turntabling. `autoRotate: true, dispersion: 0.4, tint: "#0b1f3a"`. Replaces a stock hero video. |
| **Particle Object** | "Configure your car" section: the model GLB rebuilds itself from particles as the visitor picks a trim, cursor scatters and it re-forms. Real GLBs from the manufacturer press kit. |
| **Glass** | Spec comparison table. `targets: "td, th, .spec-value"` so the lens magnifies exactly the numbers a buyer squints at. Solves a real legibility problem while looking premium. |
| **Peel** | Vehicle cards on the inventory grid. Front layer = photo + model name, `under` = price, mileage, finance rate. `side: "bottom", mode: "hover", reveal: 180`. Direct replacement for a CSS hover flip, with a physical feel. |
| **Magnify** | Damage/condition reports on used stock and 360 interior photos. The HUD readout reads as an inspection tool, which is exactly the trust signal a used-car page needs. `readout: true, hud: 0.6, zoom: 2.5`. |
| **Ripple** | Site-wide click feedback. `trigger: "click", refraction: 60`. Makes an inventory grid feel responsive on touch. |
| **Bend** | Full-page scroll treatment on a single model landing page, so the page reads like a folded brochure. `top: false, bottom: true, angle: 55`. |
| **Cloth** | The finance/warranty panel as a draped fabric card. `wind: 0, brush: 2` so it is still until touched. Reads as "premium upholstery" without saying it. |
| **Shatter** | Avoid on inventory. Acceptable as a one-shot transition between "old car" and "new car" in a trade-in calculator. |
| **Blaze** | Performance/sport trim section only. `height: 0.25, sparks: 0.6`. Cliché if used site-wide. |

Skip: Asciify, Retro Dither, VHS, Glitch, Hex Float (wrong register for a purchase where trust matters).

### 6.2 E-commerce store

| Component | Concrete use |
|---|---|
| **Peel** | The workhorse. Product tile hover reveals price, size availability or a discount. `side: "right", mode: "cursor", reveal: 220, shineColor: "auto"`. Its `pointerEvents` gating means the revealed layer is genuinely clickable. |
| **Glass** | Product detail page zoom, replacing the usual jQuery magnifier. `shape: "circle", size: 160, zoom: 2, targets: ".product-image"`. Refraction over a live DOM means annotations and badges zoom with the image. |
| **Retro Dither** | Category-level brand signature on thumbnails. `colorize: 0.1` keeps product colour truthful (critical: never distort product colour above ~0.15) while giving the grid a look. |
| **Ripple** | Add-to-cart confirmation. Call `splash(x, y, 1)` imperatively from the click handler at the button position. Costs nothing while idle. |
| **Particle Scroll** | Long-form product storytelling pages and lookbooks. `point: 0.68, band: 420`. Turns a scroll into a reveal without per-element animation wiring. |
| **Frost** | Seasonal campaign wrapper, or a "members only" price gate that melts under the cursor to tease the discount. `introDuration: 1.2` gives a strong page-load moment. |
| **Glass Object / Dithered Object** | A single hero product as a rotating 3D object. Glass Object for cosmetics, glassware, jewellery, fragrance. Dithered Object for hardware and streetwear where a 1-bit look is on-brand. `backgroundImage` on Glass Object lets the glass refract your campaign photo. |
| **Droplets** | Outdoor gear, rainwear, hydration, beverages. `interactive: true` so the visitor wipes the glass. On-theme rather than decorative. |
| **Clouds** | Sleep, wellness, skincare. `color: "auto"` follows the theme. Genuinely soft rather than gimmicky. |
| **Liquid** | Homepage hero over the live nav and headline. `rainbow: false`, brand `color`, `distortion: 0.25`. Low commitment, high perceived polish. |
| **Bubble** | Cursor treatment on a beauty or beverage brand. `frost: 0.3, iridescence: 1.2`. |

Skip: Glitch and VHS on any checkout or trust page. Shatter and Hex Float anywhere near a conversion path.

### 6.3 Applied-AI engineering school

| Component | Concrete use |
|---|---|
| **Asciify** | Signature effect. `charset: "binary", baseStrength: 0.08, radius: 0.35`. The whole site permanently reads 8% terminal with a cursor lens pushing it to full. Direct brand fit, and it costs one draw call. |
| **Particle Scroll** | Curriculum pages. Each module condenses out of sand as you scroll to it. `stagger: 0.7, settle: 1.2`. Reinforces "we build things from components." |
| **Particle Object** | The course logo, a neural-net mesh, or a bolt/lightning GLB rebuilt from ~14k particles that scatter under the cursor and spring home. Literal visual metaphor for the subject. `count: 20000, swirl: 0.8, spring: 1.2`. |
| **Laser** | Live-cohort or syllabus page: content prints in from behind a beam as you scroll. `reactivity: 1.5` so fast scrolling brightens the beam. Reads as a CRT terminal, and the DOM-measured beam width means it lines up with your text column automatically. |
| **Grid** | "How the platform works" section. Tiles ripple around the cursor over a real architecture diagram. `idleRipples: 4` keeps it alive when nobody is moving. |
| **Retro Dither** | Instructor headshots and student project thumbnails, `colorize: 0.9` for a strong 4-level palette look. Cheap way to unify photos from many sources. |
| **Glass** | Documentation and API reference pages. `targets: "code, pre, h2, h3"` gives readers a magnifier over code blocks. Genuinely useful, not decorative. |
| **Glitch** | Call `burst()` on a failed form submit or a 404. `interval: 0` for continuous on an error page only. |
| **Ripple** | Site-wide click feedback, `trigger: "click", shine: 0.4`. |
| **Hex Float** | One showcase page: an interactive demo of what the students will be able to build. Never on the enrolment funnel. |
| **Dithered Object** | Any GLB in a 1-bit look for the "projects" gallery, with `orbit: true` so visitors can spin them. |

Skip: Cloth, Droplets, Clouds, Blaze (wrong register, reads as decoration rather than capability).

### 6.4 Ads / UGC creator training school

| Component | Concrete use |
|---|---|
| **VHS** | The identity effect. `grain: 0.4, scanlines: 0.3, barrel: 0.4, switching: 1`. Every UGC creator knows this look from CapCut and TikTok filters. Applied to the whole site it is instantly legible as "we teach content." |
| **Glitch** | Section transitions and CTA emphasis. `interval: 4, duration: 0.35, rgbShift: 6`. Call `burst()` when the visitor scrolls past a testimonial or a stat. |
| **Shatter** | Before/after showcase: a bad ad shatters into a good one. `radius: 0.5, lift: 40, refraction: 1.8`. The right home for a component that is too aggressive elsewhere. |
| **Peel** | "Ad teardown" cards: the front shows the ad creative, `under` shows the annotated breakdown (hook, retention, CTA). `side: "left", mode: "hover"`. This is a genuinely great content pattern for this niche. |
| **Particle Reveal** | Gated content and the pricing table before signup. `threshold: 0.12, background: "#0a0a0a"`. The dust literally shows the shape of what is hidden without revealing it. |
| **Blaze** | "Viral" / "trending" section, or hot testimonials. `height: 0.35, sparks: 0.9, layers: 6`. On-brand here in a way it is not on a dealership site. |
| **Magnify** | Creative critique tool: a HUD lens over a real ad screenshot, with the readout showing coordinates. Reads as an analysis instrument. `hud: 1, readout: true, grid: true`. |
| **Liquid** | Hero, `rainbow: true, intensity: 3, blend: 8`. Loud is correct for this audience. |
| **Bubble** | Cursor decoration on the offer page. `size: 40, trail: 20, iridescence: 1.5`. |
| **Laser** | Course-module scroll reveal, same use as the AI school but with `color` set to a hot brand accent and higher `reactivity`. |
| **Asciify** | `charset: "blocks"` on a stats or leaderboard section for a pixel-art scoreboard feel. |
| **Particle Scroll** | Long sales page. Combine with **Ripple** for click feedback. |

Skip: Frost, Clouds, Cloth (too soft for the register), Hex Float (too slow to load on a page whose whole job is conversion speed).

### 6.5 Cross-cutting selection rules

- **One heavy component per page, maximum.** Frost, Hex Float, Cloth, Liquid, Clouds and Droplets each own the frame budget. Shatter, Grid and Blaze are mid-weight. Ripple, Glitch, Glass, Peel, Retro Dither and Asciify are cheap because they stop rendering when idle.
- **Never put a lens component over a form field.** Glass, Magnify, Bubble and Retro Dither distort input text.
- **`baseStrength` and `interval` are the "always on" knobs.** Set them to 0 for a component that only exists when the visitor engages, which is almost always the right commercial default.
- **Every component supports `setOptions` live**, so tie intensity to scroll depth or funnel stage: full effect on the hero, near zero by the checkout.
- **The three object components (`glass-object`, `particle-object`, `dithered-object`) need no Chrome flag** and work everywhere WebGL2 does. If you can only ship one thing to a general audience today, ship one of those.
- **Everything else needs the origin trial token** on your own domain to work for real visitors in stock Chrome. Without it, non-flagged visitors get the plain DOM (which is fine) but you should not build the layout around the effect being visible.
