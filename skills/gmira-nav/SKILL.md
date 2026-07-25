---
name: gmira-nav
description: Use when building or auditing site chrome: header, primary navigation, mobile menu, command palette, breadcrumbs, table of contents, progress rail, theme toggle, skip link, footer. Also use when the nav is a floating blurred pill identical to every other site, when a hamburger appears on desktop, when six links became a mega-menu, when a command palette was added to a marketing page, when an overlay traps or loses keyboard focus, when Escape does not close, when the footer is four columns of invented links, or when the page has a strong direction that stops at the header. Owns skip link, focus return, aria-current, and the line-rule system that makes chrome feel authored.
---

# Nav

Chrome is where the material world is either carried through the whole page or quietly dropped.

Load `../gmira/references/DOCTRINE.md` first. Install anything from a registry via
`gmira-arsenal`.

## The premise

A page can have a committed direction in the hero and a completely undecided header, and almost
every generated site does. The header is the first thing built, before the direction exists, and it
is never revisited. So the specificity test applies hardest here:

**Could an unrelated product use this header unchanged?** If yes, nothing was decided. The header
is where a 1970s parts catalogue becomes hairline rules and part numbers, or fails to.

## Refuse these four

| Refused | Why it is a tell | Instead |
|---|---|---|
| The floating pill nav: `fixed top-6 rounded-full border backdrop-blur-md bg-white/60` | It is on every AI-assembled site shipped since 2024. Glass and blur as decoration rather than as a specific effect. | A header that touches the edges and is separated by a rule, or no header chrome at all above the fold. Declare elevation once: a border or a shadow, not both. |
| A hamburger on desktop | It hides a five-item list behind a click to buy back space nobody needed. | Show the links. If they do not fit, there are too many links, which is a content problem. |
| A mega-menu for six destinations | Chrome standing in for content. | Six links. A mega-menu is earned by inventory depth (a real catalogue with categories and counts), never by ambition. |
| `@componentry/magnetic-dock` on anything that is not a desktop-app metaphor | A macOS dock on a store is cosplay. It borrows a signal from an operating system the product is not. | Ordinary navigation, styled from the brief's own world. |

## Step 1: the shape comes from the mode

Mode is per surface. A developer tool's landing page is Persuade even though the product is Operate.

| Mode | The nav's job | Concrete shape |
|---|---|---|
| **Persuade** | Get out of the way, then convert | 3 to 5 destinations, **one** action, no search, no account menu. The action is the only filled control on the page's chrome. |
| **Operate** | Carry persistent state and get to anything fast | Current context always visible (workspace, project, filter count), search or command palette, account state, unsaved and error indicators. Effect budget near zero. |
| **Read** | Say where you are and how far there is to go | Section position, a table of contents or progress rail, previous and next at the end. `aria-current` on the active item is not decoration here, it is the whole feature. |
| **Experience** | Be part of the work, or disappear | Either the nav is a composed element of the piece, or it hides on scroll down and returns on scroll up. Pick one and commit. |

```
INCORRECT   a landing page header with Product, Solutions, Resources, Company, Pricing,
            Docs, Blog, a search icon, a theme toggle, Log in, and Get started.
CORRECT     Persuade: three destinations that a buyer actually needs, plus one action.
            Everything else lives in the footer, where a visitor who is looking will look.
```

## Step 2: the line system

The most transferable structural device for chrome is a rule token plus two utilities. It is
shipped as a CSS-only registry item, `@ncdai/style`, which writes no component files at all.

```css
--line: color-mix(in oklab, var(--border) 64%, var(--background));

@utility screen-line-top {
  @apply relative;
  &:before { content: ""; @apply absolute top-0 left-[-100vw] -z-1 h-px w-[200vw] bg-line; }
}
@utility screen-line-bottom {
  @apply relative;
  &:after { content: ""; @apply absolute bottom-0 left-[-100vw] -z-1 h-px w-[200vw] bg-line; }
}
@utility diagonal-stripes {
  @apply [--pattern-foreground:var(--color-line)]/56;
  @apply bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px];
}
```

A `200vw` pseudo-element offset `-100vw` at `-z-1` makes every rule run edge to edge regardless of
container width. The line color is deliberately softer than `--border`, and in dark mode the
override is **left out on purpose** so the same `color-mix` formula re-solves against the dark
background.

Applied, the header stops being a floating object and becomes part of a ruled sheet:

```tsx
<header className="screen-line-bottom sticky top-0 z-40 h-(--header-height) border-x border-line bg-background/95">
```

Two rules that come with it:

1. **Derive the anchor offset from the variables that create it.** If the header is
   `--header-height` and the section rhythm is `--separator-height`, then
   `scroll-mt-[calc(var(--header-height)+var(--separator-height))]` stays correct when either
   changes. Hardcoding `scroll-mt-24` is a bug waiting for a redesign.
2. **Apply the rules with selectors, not props.** `nth-[3n+1]:screen-line-top` draws the row rule
   only on the first item of each row at each breakpoint. `has-data-[slot=panel-description]:*:data-[slot=panel-title]:screen-line-bottom` is the design rule "the title gets its own rule only when
   there is a description below it", written as a selector.

If the brief's world is not ruled paper, this is still the pattern: pick one structural token
(a rule, a stripe, a notch, a registration mark), ship it as a utility, and apply it everywhere.
Chrome feels authored when one small idea is applied consistently, not when each part is styled.

## Step 3: the desktop header

```tsx
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3
                           focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2
                           focus:outline-2 focus:outline-offset-2 focus:outline-ring">
  Skip to content
</a>

<header className="screen-line-bottom sticky top-0 z-40 flex h-(--header-height) items-center gap-6">
  <nav aria-label="Primary" className="flex items-center gap-1">
    {items.map((item) => (
      <a key={item.href} href={item.href}
         aria-current={item.href === pathname ? "page" : undefined}
         className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-[color]
                    hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2
                    focus-visible:outline-ring aria-[current=page]:text-foreground">
        {item.label}
      </a>
    ))}
  </nav>
</header>
```

**Style from the accessible attribute.** `aria-[current=page]:text-foreground` means the
accessibility state and the appearance cannot diverge, because there is only one source. A separate
`isActive` boolean driving a class always drifts.

`@ncdai/line-nav` is the same idea taken further and is worth reading even if you do not install it:
the anchor is literally `h-px`, the marker is a `<span>` whose width animates 24 to 40 with a
spring, the hit target comes from an `::after` at `p-3.5` (28px) that changes no layout, and active
styling is `group-aria-[current=page]:`. `initial={false}` keeps it from animating on first paint.
Dependency: `motion`.

Sticky header with content behind it needs one of: an opaque background, `backdrop-filter` with a
tested contrast, or hide-on-scroll-down. Half-transparent with body text passing under it fails
contrast at some scroll position, and it fails silently.

## Step 4: mobile is not a full-screen overlay by default

The full-screen overlay is the reflex, and it is the heaviest possible answer: it needs a focus
trap, `inert` on the rest of the document, a scroll lock, an escape path, and a focus return. Most
sites need none of that.

| Destinations | Correct pattern | Focus handling |
|---|---|---|
| 3 to 6, Persuade | An inline disclosure that pushes content down, or an anchored dropdown | No trap. `aria-expanded` and `aria-controls` on the trigger, Escape closes, focus stays where it was. |
| 3 to 5, Operate | A persistent bottom bar with `aria-current` | None needed, it is always visible |
| 6 to 12, mixed | A bottom sheet that stops at about 60vh so the page stays visible behind it | Modal: trap, `inert`, Escape, focus return |
| The nav is the content (Experience, a menu with imagery, a full catalogue) | Full-screen overlay, and now it is earned | Modal, plus the overlay itself has to be a designed composition |

```
INCORRECT   const [open, setOpen] = useState(false)
            {open && <div className="fixed inset-0 z-50 bg-background">...links...</div>}
            // no role, no trap, no inert, no Escape, no focus return, and the background scrolls
CORRECT     <dialog ref={ref} className="m-0 h-svh max-h-none w-full max-w-none bg-background
                                          backdrop:bg-black/40">
            // opened with ref.current.showModal()
            // native <dialog> gives the focus trap, top-layer stacking, inert background,
            // and Escape for free. Add only: focus return on close, and the scroll lock.
```

Scroll lock without layout shift:

```css
html { scrollbar-gutter: stable; }
body:has(dialog[open]) { overflow: hidden; }
```

Focus return, which `showModal` does not do on its own:

```tsx
const trigger = useRef<HTMLButtonElement>(null);
const close = () => { dialogRef.current?.close(); trigger.current?.focus(); };
```

A keyboard trap is **correct** inside a modal dialog and **a bug** anywhere else. If the panel does
not block the rest of the page, do not trap; let Tab walk out of it.

## Step 5: command menu, earned or cosplay

`@componentry/command-menu` is a macOS Spotlight-style palette: `cmdk` plus `framer-motion` plus
`lucide-react`, with groups, an empty state, and a configurable shortcut key. `cmdk` is small. The
cost is not bundle size, it is the signal.

| Earned | Cosplay |
|---|---|
| Operate mode with more destinations than a nav can hold: an admin, a dashboard, a docs site with 200 pages, an inventory with real filters | A five-page marketing site where the palette lists the same five links as the header |
| The palette does something the nav cannot: run actions, jump to a record by name, switch workspace, toggle a setting | The palette is search over three headings, and search already exists |
| The audience is developers **and** the surface is the tool | The audience is developers and the surface is the pricing page. A developer-tool signal on a marketing page is cosplay. |

Same test kills `@componentry/mac-keyboard` on a course sales page and keeps it on a page that
teaches shortcuts.

If it is earned, three requirements: it must be reachable without the keyboard (a visible button,
not only Cmd+K), the shortcut must be shown on the button, and it must have a real empty state that
says what to try. A palette that returns "No results." to every typo is a demo.

## Step 6: the footer is a surface

The footer is the last thing a visitor reads before deciding whether the business is real. Four
columns of plausible-looking links is chrome standing in for content, and it usually contains
invented destinations, which fails doctrine G7 outright.

Rules:

- **Every link goes somewhere that exists.** No `href="#"`. No social icons for accounts nobody
  opened.
- **No invented metrics, testimonials, logos, or client names**, including in the footer's
  "trusted by" strip.
- The footer is a legitimate place for the page's second and last effect band, but only when it
  costs no new library. `@componentry/closing-plasma` is the raw-WebGL1 sibling of `silk-aurora`
  and `webgl-liquid`, so a hero from that family plus this footer bookends the page for the price
  of `clsx` and `tailwind-merge`. Props worth setting: `themeMode`, `turbulence`, `sparkle`,
  `vignette`, and the `darkColorA/B/C` plus `lightColorA/B/C` palettes.
- The line system continues here. A footer that drops the rule grammar reads as a different site.

### Content model per vertical

| Vertical | What actually belongs |
|---|---|
| Car shop | Physical address, opening hours per day, phone that dials, dealer registration number, the real inventory categories with counts, finance and APR representative example, part-exchange and warranty terms |
| E-commerce | Returns window and who pays postage, delivery times per region, size guide, payment methods actually accepted, legal entity and VAT number, a contact route with a response time |
| AI school | Cohort start dates, syllabus link, hours per week, admissions contact, refund and deferral policy, named instructors, prerequisites |
| GTM / UGC school | Earnings disclaimer, terms, refund window with the actual number of days, support email, only the social accounts that exist and post |

Legal and policy links are not filler. On a commerce or education surface they are the highest-read
links in the footer and they belong in one clearly labelled group, not scattered to balance columns.

Small figures (seats remaining, cohort dates, stock counts) can go to
`@componentry/split-flap-display`: zero dependencies, inline `@keyframes`, mechanical rather than
SaaS-generic. Only for real numbers.

## Accessibility, non-negotiable

| Requirement | Implementation | How to verify |
|---|---|---|
| Skip link | First focusable element in the DOM, visually hidden until focused, targets the `<main id="main">` | Load, press Tab once, it must be visible and land in main |
| Focus visible | `:focus-visible` outline with `outline-offset`, on every interactive element including the logo. Never `outline: none` without a replacement | Tab the whole header and footer; no invisible stops |
| Current position | `aria-current="page"` on the active nav item, `aria-current="step"` in a flow. Style from it | Inspect the active link; the attribute is present and drives the class |
| Escape closes | Every overlay, menu, and palette. Native `<dialog>` and Radix give it; a hand-rolled `div` does not | Open, press Escape, it closes |
| Focus returns | On close, focus goes back to the element that opened it | Open with the keyboard, close with Escape, next Tab continues from the trigger |
| Trap is scoped | Trapped inside modal dialogs only. Non-modal disclosures let Tab leave | Tab past the last item of a dropdown; focus should exit |
| Landmarks | One `<header>`, `<nav aria-label="Primary">`, `<main>`, `<footer>`. A second nav gets its own label | Screen reader landmark list has no duplicates |
| Names | Icon-only buttons carry `aria-label`. The theme toggle says which theme it switches to | Every control has an accessible name |
| Hit target | 44px minimum on touch, added with a pseudo-element so layout does not change: `after:absolute after:size-full after:p-3.5` | Measure on a 390px viewport |
| Reduced motion | Hide-on-scroll headers, marker springs, and menu transitions all off | Toggle the media query |

The six states apply to nav controls like anything else: hover, focus, disabled, loading, error,
empty. A search field in a header needs a loading state and an empty state, and both get skipped.

## Checks before this skill is done

- [ ] The header traces to the direction contract. An unrelated product could not use it unchanged.
- [ ] Zero of the four refused patterns, or one is present and logged with the brief words that earned it
- [ ] Link count and the single action match the surface's mode
- [ ] One structural token (rule, stripe, notch) is defined once and applied by selector across header, sections, and footer
- [ ] Anchor scroll offset derives from the header and rhythm variables, not a hardcoded value
- [ ] Skip link is the first focusable element and becomes visible on focus
- [ ] `aria-current` is present on the active item and is what drives its styling
- [ ] Every overlay: Escape closes, focus returns to the trigger, background is `inert` only when modal
- [ ] Mobile menu is not a full-screen overlay unless the nav is the content
- [ ] Scroll lock does not shift layout (`scrollbar-gutter: stable`)
- [ ] Command palette exists only if it does something the nav cannot, and is reachable without a keyboard
- [ ] Sticky header contrast measured at a scroll position where body text is behind it
- [ ] Every footer link resolves. Zero invented links, metrics, logos, or social accounts.
- [ ] Footer carries the vertical's real content model, not four balanced columns
- [ ] Second effect band, if any, adds no new dependency
