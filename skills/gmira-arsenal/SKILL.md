---
name: gmira-arsenal
description: Use when installing, repairing, or taming any shadcn registry component (componentry, canvas-ui, bklit, ncdai, kibo-ui, react-bits, soundcn). Also use when an installed component fails to build, imports a package that is not there, renders the wrong colors, shows a blown-out glow, ignores its own props, or looks like the library's demo instead of the brief. Covers registry search, install, import repair, dependency repair, welded-constant auditing, and palette verification.
---

# Arsenal

Install, repair, tame. Three steps, never two.

Load `../gmira/references/DOCTRINE.md` first. This skill implements its Laws 1 and 2.

## The premise

A registry component is an **engine**, not a design. Its defaults exist to win a five-second
gallery GIF, and the gallery GIF is the new generic. shadcn copies source into the repo precisely
so it can be edited. **An unedited registry component is an unfinished one.**

## Step 1: find it

Seven registries are wired. Search before guessing a name.

```bash
npx shadcn@latest search @componentry              # list a registry
npx shadcn@latest search @componentry -q "hero"    # query within one
npx shadcn@latest view @componentry/silk-aurora    # full item before installing
```

`view` before `add`, always. It shows the declared dependencies, the files that will be written,
and whether the item is a `registry:ui` or a `registry:block`. That is where the repair list starts.

Registries and what each is for:

| Registry | Strength |
|---|---|
| `@componentry` | 56 items. WebGL and canvas heroes, backgrounds, scroll pieces. Highest ceiling, lowest reliability. |
| `@canvas-ui` | html-in-canvas (`drawElement`) effects that displace live DOM. Best-engineered of the seven. |
| `@bklit` | Composable visx charts. Use for any real data surface. |
| `@ncdai` | Personal-site craft: pointer-glow cards, line-rule systems, zero-JS type effects. |
| `@kibo-ui`, `@react-bits` | General component breadth. |
| `@soundcn` | UI sound. Only where a gesture deserves feedback. |

Cheap stack, and it reaches every non-three.js component in the arsenal:

```bash
pnpm add framer-motion lenis lucide-react
```

three.js is roughly 600 KB. Add it only when one named component earns it, never speculatively.

## Step 2: repair

**Run this immediately after `shadcn add`, before writing any page.** Measured across componentry:
12 of 56 items ship imports that cannot resolve, and 10 import a package they never declared.

### 2a. Fix the import paths

Ten items import `cn` from `@workspace/ui/lib/utils`, a leaked monorepo alias. Two import
`../lib/utils`, which resolves to `components/lib/utils`. Both fail in a normal app.

```bash
# from the project root, after any install
rg -l "@workspace/ui/lib/utils|from \"\.\./lib/utils\"" src/components \
  | xargs sed -i 's|@workspace/ui/lib/utils|@/lib/utils|g; s|"\.\./lib/utils"|"@/lib/utils"|g'
```

Known offenders: `circuit-board`, `cursor-driven-particle-typography`, `hyper-text`,
`letter-cascade`, `scroll-based-velocity`, `scroll-choreography`, `scrub-input`, `spotlight-card`,
`testimonial-marquee`, `text-repel`, `hero-geometric`, `liquid-chrome`.

### 2b. Install what the item forgot to declare

| Component | Missing |
|---|---|
| `collection-surfer`, `eye-tracking`, `letter-cascade`, `music-player`, `scroll-choreography`, `scroll-split-card`, `text-repel` | `framer-motion` |
| `image-trail`, `layered-stack` | `gsap` |
| `mac-keyboard` | `lucide-react` |

`testimonial-marquee` declares `framer-motion` and never imports it. Drop it, the component is pure CSS.

Generic check that catches the ones not on this list:

```bash
# every bare package import in the installed file, minus what package.json has
rg -o "from \"([a-z@][^\"./][^\"]*)\"" -r '$1' src/components/ui/<name>.tsx | sort -u
```

### 2c. The rest of the repair list

- **`framer-motion`, not `motion`.** Every animated item imports the pre-v11 name. Alias it or
  find-and-replace, but do not ship both.
- **Tailwind keyframes that do not exist.** `shimmer-button` uses `animate-shimmer-slide` and
  `animate-spin-around` and ships no `cssVars` or `tailwind` block. Define them or drop the component.
- **Remote assets in default props.** `collection-surfer`, `infinite-image-field`,
  `ripple-transition`, `sticky-scroll-cards` (unsplash), `scroll-split-card` (framerusercontent),
  `github-calendar` (a live third-party API), `music-player` (youtube). Swap for local assets or add
  the host to `next.config` `images.remotePatterns`. **Never ship a client site that hotlinks a
  demo's stock photos.**
- **No item defines `cssVars`, `css`, or `tailwind` blocks.** Nothing lands in globals. All styling
  is utility classes and inline styles, so theming is entirely on you.

Do not report the repair pass to the user as an accomplishment. It is table stakes. Report it only
if something could not be repaired.

## Step 3: tame

This is the step that decides whether the page looks designed or assembled.

### 3a. Audit for welded constants

A welded constant is a value the props cannot reach. Grep the installed file for numeric literals
assigned inside render loops, `useFrame` bodies, and uniform `useMemo` blocks:

```bash
rg -n "\.value\s*=|\.value\.set\(|uniforms\.\w+" src/components/ui/<name>.tsx
```

**The specific smell: a prop exists for a thing, and a hardcoded value elsewhere overrides it.**

Worked example, `dither-prism-hero`. It advertises `color1/2/3` and honors none of them, because:

```js
uniforms.uMouse.value.set(0.5, 0.5);   // never reads the pointer
uniforms.uMouseIntensity.value = 0.8;  // no prop reaches this, re-set every frame
```

and the glow that intensity drives adds roughly **+1.84 per channel before clamp**, which is pure
white whatever the palette says. Fix: promote the constant to a prop, default it to off.

```diff
-  uMouseIntensity: { value: 0.8 },
+  uMouseIntensity: { value: mouseIntensity },   // prop, default 0
```

Before and after on the identical brief: `../gmira/references/finding-01-tame-the-arsenal.md`.

### 3b. Check the palette actually survives

Additive effect stacks cannot honor a dark palette. If the shader does `col += ...` more than twice
without renormalizing, it trends to white regardless of input.

```
INCORRECT   pass the brand hexes, see that it renders, move on.
CORRECT     pass the brand hexes, screenshot, sample the rendered pixels, compare against
            the source hexes. If the render is lighter or more saturated than every input
            color, an additive layer is overriding the palette. Find it and zero its coefficient.
```

### 3c. Never use the component's own text props

They ship banned patterns. `dither-prism-hero`'s default headline class is
`text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 via-zinc-500 to-zinc-800`: gradient
text, which the craft floor bans (emphasis comes from weight or size).

```
INCORRECT   <DitherPrismHero title1="Fast" title2="Reliable" />
CORRECT     <DitherPrismHero ...>{/* own the type entirely in children */}</DitherPrismHero>
```

Use the `children` slot for every component that has one. If it has none, delete its internal
markup and re-author it.

### 3d. Restyle anything from the refuse list

`border-beam`, `shimmer-button`, `pulsating-button`, `interactive-hover-button`, `text-animate`,
`hyper-text`, `scroll-based-velocity` are Magic UI ports present in a dozen registries. Every
AI-assembled landing page has them. Use at most one, and restyle it past recognition.

Underused and worth reaching for: `circuit-board`, `split-flap-display`, `ascii-effect`,
`dithered-logo`, `scrub-input`, `orbit-card-stack`, `silk-aurora`.

### 3e. One registry is a house style, not a direction

If every effect on the page came from `@componentry`, the page inherits componentry's taste rather
than the brief's. Mix sources, or author the second effect yourself.

## Handing over

Record what was tamed, in the component file itself, as a comment that names the ceiling:

```tsx
// gmira: upstream welded uMouseIntensity to 0.8 with uMouse pinned at center, which
// blows out any dark palette. Now a prop, default 0. Raise only if the surface tracks the pointer.
```

The comment matters because the next `shadcn add` of the same item silently overwrites the file.
Anyone re-running install needs to know what they just lost.

## Checks before this skill is done

- [ ] `pnpm build` passes with the component in a real page, not just installed
- [ ] No import resolves outside `@/`
- [ ] Every imported package is in `package.json`
- [ ] Rendered pixels match the intended palette, verified from a screenshot, not from props
- [ ] No welded constant remains that the brief needs to control
- [ ] The component's own headline and body props are unused
- [ ] Every taming edit carries an `gmira:` comment naming what it changed and why
