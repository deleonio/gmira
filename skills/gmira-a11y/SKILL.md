---
name: gmira-a11y
description: Use when auditing a built page for contrast, keyboard operation, semantics, and canvas fallback. Also use when text sits on a colored or image background and nobody measured it, when the focus outline was removed, when tab order jumps around the screen, when a div is being used as a button, when a canvas or WebGL layer carries text or controls, when a form field has no label, or when reduced motion only slows an animation down. Runs at audit time and not during design, because an accessibility reminder while designing produces timid underdesigned output. Ships a runnable DOM audit that computes contrast from computed styles rather than eyeballing it.
---

# A11y

Contrast, semantics, keyboard, canvas fallback. Measured, on the built page.

Load `../gmira/references/DOCTRINE.md` first. This skill owns gate G3 and the readability half
of G8.

## Why this is an audit skill and not a design reminder

The doctrine puts this check here on purpose. Reminded about accessibility while designing, a model
talks itself into safe, timid, underdesigned output: smaller claims, flatter color, less commitment,
all in the name of a rule nobody measured. So the build skills say nothing about it and this one
says all of it, after the page exists, with numbers.

Do not import this checklist into a build skill. Run it here.

## What automated tooling does and does not cover

`@axe-core/playwright` is worth running and it finds roughly the machine-checkable half: missing
labels, bad roles, duplicate ids, contrast on plain backgrounds. It does not find focus order
disagreeing with visual order, a canvas carrying the page's only headline, an error message that
names a problem but no recovery, or a control that is reachable but not operable. Those are below.

```bash
pnpm add -D @axe-core/playwright
```

## 1. Contrast, measured

Floors, from the doctrine: **body and placeholder text 4.5:1**, **large text 3:1**, **controls,
icons, and focus indicators 3:1 against adjacent colors**. Large means 24px or larger, or 18.66px at
weight 700 or heavier.

Two rules that get broken constantly: placeholder text is body text and needs 4.5:1, and on colored
surfaces secondary text is tinted from that hue or the foreground, **never gray**. Gray on color is
both a contrast failure and the reason the surface looks unfinished.

```
INCORRECT   secondary text #6B6B6B on a #0F2D1E surface, because "gray reads as muted".
            Measured: 2.8:1. It reads as a rendering fault, not as hierarchy.
CORRECT     tint the secondary from the surface hue: #6E9A85 on #0F2D1E measures 4.7:1
            and still reads as the quieter of the two.
```

The walker resolves the real background through ancestors and composites alpha, which is the part
eyeballing and most quick scripts get wrong:

```js
(() => {
  const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 };
  const lum = ([r, g, b]) => 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  const parse = s => (s.match(/[\d.]+/g) || []).map(Number);
  const over = (fg, bg) => { const a = fg[3] ?? 1; return [0, 1, 2].map(i => fg[i] * a + bg[i] * (1 - a)) };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) };

  const bgOf = el => {                       // walk up, composite every translucent layer
    const stack = []; let e = el;
    while (e) {
      const c = parse(getComputedStyle(e).backgroundColor);
      if (c.length >= 3 && (c[3] ?? 1) > 0) { stack.push(c); if ((c[3] ?? 1) === 1) break }
      e = e.parentElement;
    }
    return stack.reverse().reduce((acc, c) => over(c, acc), [255, 255, 255]);
  };

  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) continue;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) continue;
    const size = parseFloat(s.fontSize), weight = parseInt(s.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const bg = bgOf(el);
    const r = ratio(over(parse(s.color), bg), bg);
    const need = large ? 3 : 4.5;
    if (r < need) out.push({ ratio: +r.toFixed(2), need, size, text: el.textContent.trim().slice(0, 40), el });
  }
  for (const el of document.querySelectorAll('input[placeholder], textarea[placeholder]')) {
    const bg = bgOf(el);
    const r = ratio(over(parse(getComputedStyle(el, '::placeholder').color), bg), bg);
    if (r < 4.5) out.push({ ratio: +r.toFixed(2), need: 4.5, text: 'placeholder: ' + el.placeholder, el });
  }
  console.table(out); return out.length;
})()
```

Two cases the walker cannot resolve, so check them by eye with a color picker: text over an image or
a video, and text over a canvas. For those, sample the darkest and lightest pixels under the text
and measure against both. Text over a moving background needs a scrim, a solid plate, or a different
place to live.

## 2. Focus order matches visual order

Tab order follows DOM order. When the visual layout is reordered with `order`, `grid-area`, `row-reverse`,
or absolute positioning, they come apart and the keyboard walks the page in a sequence nobody sees.

```js
(() => {
  const sel = 'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
  const nodes = [...document.querySelectorAll(sel)]
    .filter(e => e.offsetParent !== null && !e.disabled && !e.closest('[inert],[aria-hidden="true"]'));
  const positive = nodes.filter(e => (parseInt(e.getAttribute('tabindex'), 10) || 0) > 0);
  const jumps = [];
  for (let i = 1; i < nodes.length; i++) {
    const a = nodes[i - 1].getBoundingClientRect(), b = nodes[i].getBoundingClientRect();
    if (b.top < a.top - 8 || (Math.abs(b.top - a.top) <= 8 && b.left < a.left - 8))
      jumps.push({ from: nodes[i - 1].textContent.trim().slice(0, 24), to: nodes[i].textContent.trim().slice(0, 24) });
  }
  console.table(jumps);
  if (positive.length) console.warn('positive tabindex found, that is the finding by itself', positive);
  return jumps.length;
})()
```

Any `tabindex` above 0 is a finding on its own: it jumps ahead of every natural element on the page
and the order becomes unmaintainable. Use 0 or -1 only.

Also confirm focus is never trapped and never lost. Open every overlay, tab to the end, and check
that focus cycles inside it and returns to the trigger on close. After a route change, focus moves
to the new page's heading or main, it does not stay on a button that no longer exists.

## 3. Every interactive element reachable and operable

The common failure is a `div` with a click handler: reachable by mouse, invisible to the keyboard.

```js
[...document.querySelectorAll('div,span,li,td,article,section')]
  .filter(e => getComputedStyle(e).cursor === 'pointer' &&
               !e.closest('a,button,label,summary,select,[role="button"],[role="link"],[tabindex]'))
```

Every hit is either converted to a real `button` or `a`, or given `tabindex="0"`, a role, and a
keydown handler for Enter and Space. The first option is right almost every time.

Operable means the whole interaction works from the keyboard, not just that focus can land on it:
menus open with Enter and close with Escape, sliders move with arrows, drag-and-drop has a
non-pointer path, a custom select is navigable with arrows and typeahead, and Escape dismisses every
overlay.

## 4. The skip link

One link, first in the tab order, visible once focused.

```html
<a href="#main"
   class="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50
          focus:rounded focus:bg-[--surface] focus:px-3 focus:py-2">Skip to content</a>
...
<main id="main" tabindex="-1">
```

`tabindex="-1"` on the target is required: without it, Chrome and Safari move the scroll position
but not the focus, so the next Tab goes back into the nav.

```js
const skip = document.querySelector('body a[href^="#"]');
console.log(skip?.getAttribute('href'), !!document.querySelector(skip?.getAttribute('href') || '#none'));
```

## 5. ARIA for the things that need it, and nothing else

The first rule of ARIA is not using ARIA. A `role="button"` on a `<button>` is noise at best and
overrides working semantics at worst.

| Use | For | Do not |
|---|---|---|
| `aria-current="page"` | the active link in a nav | do not also set `aria-selected` on it |
| `aria-expanded` | a control that opens something, on the **control**, not on the panel | do not leave it static when the panel toggles |
| `aria-controls` | pairing that control to the panel id | do not use it without `aria-expanded` |
| `aria-live="polite"` | async status text that appears with no focus change: result counts, save confirmations | do not wrap a whole region or a whole page |
| `role="alert"` | one blocking error that must interrupt | do not fire it on every keystroke |
| `aria-describedby` | the reason a control is disabled, a format hint, an error message | do not duplicate the label into it |
| `aria-label` | an icon-only control, a nav landmark that needs distinguishing | do not put it on an element that already has visible text |
| nothing at all | `<button>`, `<a href>`, `<nav>`, `<main>`, `<h2>`, `<table>` | `role` that restates the tag |

```js
[...document.querySelectorAll('[role]')].filter(e => ({
  BUTTON: 'button', A: 'link', NAV: 'navigation', MAIN: 'main', UL: 'list', LI: 'listitem',
}[e.tagName] === e.getAttribute('role')))                          // redundant roles

document.querySelectorAll('[aria-expanded]').forEach(e =>
  console.log(e.getAttribute('aria-expanded'), e.getAttribute('aria-controls'), e.textContent.trim().slice(0, 30)));
```

A live region must exist in the DOM before the text lands in it. Inserting the region and the
message at the same time announces nothing.

```
INCORRECT   <div role="button" tabIndex={0} aria-label="Close" onClick={close}>x</div>
            Three attributes rebuilding what one tag already does, and it still misses
            Space, Enter, form participation, and the disabled semantics.
CORRECT     <button type="button" onClick={close}>
              <span className="sr-only">Close</span>
              <XIcon aria-hidden="true" />
            </button>
```

## 6. The canvas rule

**Everything the page says must be readable and operable with the canvas element deleted.** Test by
deleting it, not by trusting a fallback branch.

```js
document.querySelectorAll('canvas').forEach(c => c.remove());
```

Then do three things: read the page, tab through the page, and complete the primary action. If a
headline, a price, a label, or a control went away with the canvas, it was never on the page. Canvas
text is invisible to screen readers, to search engines, and to Ctrl+F, which is why the doctrine
rules it out entirely on commerce, pricing, and any surface with an SEO job.

The correct shape is an overlay that owns no content:

```html
<canvas aria-hidden="true" style="position:absolute;inset:0;pointer-events:none"></canvas>
```

`aria-hidden` because a decorative layer must not appear in the accessibility tree, and
`pointer-events: none` because it must not intercept a click meant for the DOM under it.

## 7. Reduced motion is a real kill switch

A slowdown is not a fallback. Emulate the media feature in devtools Rendering, then verify:

```js
document.getAnimations().filter(a => a.playState === 'running' &&
  (a.effect?.getTiming().duration || 0) > 1)          // must be empty
```

Also confirm the rAF loops stopped (the frame counter in devtools Performance goes flat), that any
smooth-scroll layer was destroyed rather than slowed, and that a canvas effect froze on a still
frame someone chose by looking at it. Details and the four freeze strategies live in
`gmira-motion` and `gmira-canvas`.

## 8. Forms, headings, images

```js
// labels actually associated
[...document.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(f =>
  !f.labels?.length && !f.getAttribute('aria-label') && !f.getAttribute('aria-labelledby') && !f.closest('label'))

// heading order without skips
(() => { const ls = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => +h.tagName[1]);
  const bad = ls.map((l, i) => i && l > ls[i - 1] + 1 ? `h${ls[i - 1]} -> h${l}` : null).filter(Boolean);
  console.log('h1 count:', ls.filter(l => l === 1).length, 'skips:', bad); return bad })()

// images
[...document.images].filter(i => !i.hasAttribute('alt'))                                  // missing entirely
[...document.images].filter(i => /\.(png|jpe?g|webp|svg|avif)$/i.test(i.alt) ||
                                 /^(image|photo|picture|graphic) (of|showing)/i.test(i.alt))
```

Rules behind those queries:

- A placeholder attribute is not a label. It disappears on the first keystroke and it is the wrong
  contrast for a label anyway.
- Exactly one `h1` per page, and no skipped levels. Screen readers navigate by heading structure, so
  a jump from `h1` to `h3` removes a level of the outline.
- Alt says what matters in context, not what is in the file. **Empty alt is the correct answer for
  decorative images**, and omitting the attribute is not the same thing: a missing alt makes the
  screen reader read the filename out loud.

```
INCORRECT   <img src="/gt3-rear.jpg" />                        reader announces "gt3-rear.jpg"
INCORRECT   <img src="/gt3-rear.jpg" alt="image of a car" />   says less than the filename did
CORRECT     <img src="/gt3-rear.jpg" alt="911 GT3 from the rear, swan-neck wing raised" />
CORRECT     <img src="/grain.png" alt="" />                    decorative, and empty is the answer
```

- An icon-only button gets an `aria-label` that names the action, not the icon. "Close dialog", not
  "X icon".

## Running it at every viewport

Save the checks above into `.gmira/a11y.js` as one function that returns a count per check, then:

```js
const audit = fs.readFileSync('.gmira/a11y.js', 'utf8');
for (const [w, h] of [[1920,1080],[1440,900],[1024,768],[834,1112],[390,844]]) {
  await page.setViewportSize({ width: w, height: h });
  console.log(`${w}x${h}`, await page.evaluate(audit));
}
```

Contrast and focus order both change with viewport: a two-column layout that reflows to one column
reorders the tab sequence, and a hero that switches to a stacked layout puts text over a different
part of the image. Auditing at one width finds one width's failures.

## Checks before this skill is done

- [ ] Contrast walker run at all five viewports, zero body or placeholder findings under 4.5:1, zero large text under 3:1
- [ ] Text over images, video, or canvas measured against both the lightest and darkest pixels beneath it
- [ ] Secondary text on colored surfaces is tinted from the hue, not gray
- [ ] Focus order matches visual order at every viewport, and no positive `tabindex` exists
- [ ] Every overlay traps focus while open and returns it to the trigger on close
- [ ] Zero `cursor: pointer` elements without a keyboard path, and the primary flow completes keyboard-only
- [ ] Skip link present, first in tab order, visible on focus, targeting a `tabindex="-1"` main
- [ ] `aria-current`, `aria-expanded`, and `aria-live` present where needed, and no role restating a tag
- [ ] Canvas elements deleted in devtools: the page still says everything and still does everything
- [ ] Reduced motion emulated: no running animations, loops stopped, canvas frozen on a chosen frame
- [ ] Every form control has an associated label, one h1, no skipped heading levels
- [ ] Every image has alt that says what matters, or `alt=""` if it is decorative
