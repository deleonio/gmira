---
name: gmira-states
description: Use when building or reviewing any interactive surface: buttons, links, forms, filters, tables, cards, uploads, and anything that fetches. Also use when a component only has a default state, when the focus outline was removed, when a spinner flashes on a fast connection, when a disabled button gives no reason, when an error says only that something went wrong, or when the empty screen says "No results" and nothing else. Covers the six states every interactive surface ships (hover, focus, disabled, loading, error, empty), the three kinds of disabled, the three kinds of empty, and how to force each one in the browser so it can actually be reviewed.
---

# States

Six states, always: hover, focus, disabled, loading, error, empty.

Load `../gmira/references/DOCTRINE.md` first. This skill implements its Part 3.6 and gate G6.

## The premise

**A state you cannot trigger in the browser is a state you did not build.** Most components ship
with one state and a hover, because those are the two that show up while you look at the page.
The other four appear on the visitor's worst day: slow connection, empty account, wrong input,
keyboard only. They are the states the product is judged on and the states nobody screenshots.

The fix is mechanical. Build a route that renders every state at once, screenshot it in the same
verification round as the page, and the four invisible states stop being invisible.

## The six, and what each owes

| State | Must communicate | Not enough |
|---|---|---|
| **hover** | this is a target, and the pointer is on it | a color shift on a whole card with no cursor change |
| **focus** | the keyboard is here, legible against both adjacent surfaces | the browser default removed with nothing in its place |
| **disabled** | why it cannot run, and what would make it run | 40% opacity and silence |
| **loading** | that work started, on the shape the result will have | a spinner centered in an empty content area |
| **error** | the problem and the recovery, next to the source | "Something went wrong" |
| **empty** | what belongs here, and the one action that puts it there | "No results" |

## 1. Hover

Hover is pointer-only. Touch has no hover, and a hover-only affordance is invisible on half your
traffic. Gate it so a tap does not leave a sticky hover state behind.

```css
@media (hover: hover) and (pointer: fine) {
  .card:hover { border-color: var(--accent); }
  .card:hover .card__media { transform: scale(1.02); }
}
```

Give the feedback to the container, never to an image on its own. An image is not an action target,
and scaling it on hover is on the doctrine's refusal list. The container moves, the image sits
inside it.

Cursor is part of the state: `cursor: pointer` on a real target, `cursor: not-allowed` on a
disabled one, default cursor on anything that is not clickable. A `cursor: pointer` on a `div` with
no keyboard path is a finding in `gmira-a11y`, not a style choice.

## 2. Focus

`:focus` fires on mouse click too, which is why developers remove it, which is why keyboard users
lose the page. `:focus-visible` fires when the browser judges a ring is warranted. **Style
`:focus-visible`. Never delete `:focus` without a replacement in the same rule block.**

```
INCORRECT   *:focus { outline: none }
INCORRECT   .btn:focus { outline: none }        with no :focus-visible anywhere

CORRECT     .btn:focus-visible {
              outline: 2px solid transparent;   /* survives forced-colors mode */
              outline-offset: 2px;
              box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--focus);
            }
```

The two-tone ring solves the real problem: a single ring color cannot hit 3:1 against both a dark
control and the dark page behind it. The inner ring is the surface color, the outer ring is the
focus color, so the ring reads on any ground. The transparent `outline` is not decoration: Windows
High Contrast Mode discards `box-shadow` and paints the outline, so removing the outline entirely
makes focus invisible for the users most likely to need it.

Focus must also be reachable. A custom control built on a `div` needs `tabindex="0"`, a role, and a
keydown handler for Enter and Space. If that is what you are writing, use the native element
instead.

Find outline removal with no replacement:

```js
const rules = [...document.styleSheets]
  .flatMap(s => { try { return [...s.cssRules] } catch { return [] } });
const hit = p => rules.filter(r => r.selectorText && r.selectorText.includes(p)).length;
console.table({ hover: hit(':hover'), focus: hit(':focus'), focusVisible: hit(':focus-visible') });
// focus > 0 with focusVisible === 0 means the ring was removed and never replaced
```

Tailwind projects: compare `rg -c "hover:" src/` against `rg -c "focus-visible:" src/`. The ratio
says which state got skipped.

## 3. Disabled, unavailable, and read-only are three things

They get collapsed into one gray button, and each one lies to a different user.

| Kind | Meaning | Treatment | Markup |
|---|---|---|---|
| **disabled** | the action exists, cannot run right now, and something the user does changes that | keep it focusable, state the reason next to it | `aria-disabled="true"` plus a guarded handler |
| **unavailable** | not part of this user's product at all | do not render a dead control, render the path to getting it | a link or a line of copy, no control |
| **read-only** | the value is real and shown, editing is not this screen's job | full contrast, selectable, focusable | `readonly` on inputs, plain text elsewhere |

Why `aria-disabled` instead of the `disabled` attribute: a `disabled` button leaves the tab order.
A keyboard user cannot land on it, cannot read the tooltip explaining it, and never learns the
control exists. Keep it focusable and guard the handler.

```tsx
<button
  aria-disabled={!canPublish}
  aria-describedby="publish-why"
  onClick={e => { if (!canPublish) { e.preventDefault(); return } publish() }}
  className="aria-disabled:cursor-not-allowed aria-disabled:bg-[--surface-2]"
>
  Publish
</button>
<p id="publish-why" className="mt-2 text-sm text-[--muted]">
  Add a cover image before publishing.
</p>
```

Contrast rule that gets broken every time: **a disabled label still has to be readable.** 40%
opacity on text that was 4.5:1 lands near 1.9:1. Carry the disabled signal in the surface, the
border, and the cursor. Keep the text at 4.5:1.

Read-only is not a faded input. It is a value, at full contrast, with the editing affordance
removed:

```
INCORRECT   <input value="ACME-4471" disabled />       gray, unfocusable, uncopyable
CORRECT     <input value="ACME-4471" readOnly />       full contrast, focusable, selectable,
            plus a one-line note saying where it does get changed
```

## 4. Loading is a design surface

**Skeletons match the shape of the real content.** Same number of lines, same line widths, same
card height, same image aspect. A gray rectangle where a two-line title plus a three-line body goes
is a different layout, so the page jumps when data lands and the layout shift is charged to CLS.

```tsx
// the skeleton is derived from the real component's geometry, not drawn separately
<article className="rounded-xl border p-5">
  <div className="aspect-[3/2] w-full animate-pulse rounded-lg bg-[--surface-2]" />
  <div className="mt-4 h-5 w-[70%] animate-pulse rounded bg-[--surface-2]" />
  <div className="mt-2 h-4 w-full animate-pulse rounded bg-[--surface-2]" />
  <div className="mt-1.5 h-4 w-[45%] animate-pulse rounded bg-[--surface-2]" />
</article>
```

**The 200ms rule.** An indicator shown for less than 200ms reads as a flash of broken interface,
not as feedback. Delay the indicator, never the content.

```css
.spinner { animation: fade-in 120ms var(--ease-out-quart) 200ms both; }
```

```tsx
const [show, setShow] = useState(false);
useEffect(() => { const t = setTimeout(() => setShow(true), 200); return () => clearTimeout(t) }, []);
```

Once shown, hold it for at least another 300ms so a response landing at 220ms does not produce a
flicker. Announce it: `aria-busy="true"` on the region being replaced, and a short
`aria-live="polite"` status for anything a sighted user learns from the spinner.

Never replace a form with a spinner. The user's typed work stays on screen while the request runs.

**Optimistic UI, and when it lies.** Apply the change immediately when all three hold:

1. the operation almost always succeeds,
2. reversing it is cheap and visible,
3. nothing the user does next depends on it having really landed.

It lies when failure is likely, when failure is silent, or when the next screen assumes success.
Payments, publishing, destructive deletes with no undo, and anything the user will screenshot as
proof: not optimistic. When you do go optimistic, the rollback is a designed state too, with the
reason, not a silent revert.

## 5. Error states name the problem and the recovery

```
INCORRECT   "Something went wrong."
INCORRECT   "Error 422: Unprocessable Entity"
INCORRECT   a red border on the field and nothing else

CORRECT     "That title is already used by another course. Pick a different title, or
             open the existing course."
             plus a link to the existing course, the typed value preserved, and the
             message rendered next to the field it belongs to.
```

The mechanics:

- Place the message at the source. A summary at the top of a long form is an addition, not a
  replacement, and it links to the fields.
- Preserve the user's work. A failed submit that clears the form is a worse bug than the failure.
- Never carry meaning in color alone. Icon plus text plus color.
- Wire it up: `aria-invalid="true"` on the field, `aria-describedby` pointing at the message id,
  `role="alert"` on a blocking failure, `aria-live="polite"` on inline validation. Do not fire
  `role="alert"` on every keystroke, validate on blur and on submit.
- Distinguish the three sources so the recovery can be right: the user's input (say what is wrong),
  the network (offer retry, keep state), the server (say it is not their fault, give a reference).

## 6. Empty states, three kinds, three treatments

The empty state is the first screen a new account sees and the last screen anybody designs. Most
projects ship one component saying "Nothing here yet" and reuse it everywhere, which answers none
of the three questions a visitor is actually asking.

| Kind | The visitor's real question | What the screen owes |
|---|---|---|
| **Never had data** (first run) | what is this for, and what do I do | one sentence naming the payoff, one primary action, and a picture of the filled state: a real preview or a labeled sample row, not an illustration standing in for the explanation |
| **No results for this filter** | which of my filters killed it | the specific filter that excluded everything, named, with a one-click way to drop it, and the count that comes back if you do |
| **Cleared everything** (done) | did that actually work | confirmation in the past tense, undo while it is still cheap, and the route back to the list |

```tsx
// no-results, the version that answers the question
<div role="status">
  <p className="text-lg">No vehicles under 40,000 EUR with all-wheel drive.</p>
  <p className="mt-2 text-[--muted]">
    Dropping the drivetrain filter brings back <strong>34</strong> vehicles.
  </p>
  <button onClick={() => clearFilter('drivetrain')} className="mt-4">
    Clear drivetrain filter
  </button>
</div>
```

Two rules that carry over from the doctrine: sample content shown in a first-run state is labeled
as sample, and no empty state invents a metric, a testimonial, or a logo to fill space (gate G7).

## Forcing each state for review

| State | How to force it |
|---|---|
| hover | devtools Elements, `:hov` panel, check `:hover`. Or Playwright `locator.hover()`. |
| focus-visible | Tab to it. Turn on Rendering, "Emulate a focused page", so it survives devtools taking focus. |
| disabled | flip the prop on the state route. Never delete the guard to see it. |
| loading | devtools Network, throttle to Slow 4G, or Block request URL on the endpoint. |
| error | devtools Network, Block request URL, or go offline, or a `?fail=1` flag the route handler honors. |
| empty | a seeded fixture with zero rows, and a `?state=` param on the state route. |

**The state route is the reliable version.** One page renders every component in all six states, it
gets screenshotted in the same round as the real page, and the four invisible states get eyes on
them.

```tsx
// app/_states/page.tsx   dev only, noindex, not in the sitemap
const CASES = ['default', 'hover', 'focus', 'disabled', 'loading', 'error', 'empty'] as const;

export default function States() {
  return (
    <div className="grid gap-10 p-10">
      {CASES.map(c => (
        <section key={c} data-case={c}>
          <h2 className="mb-3 font-mono text-xs uppercase tracking-wide">{c}</h2>
          <VehicleCard {...propsFor(c)} />
        </section>
      ))}
    </div>
  );
}
```

```js
// one Playwright pass, and the six states land in the verification round
await page.goto('/_states');
await page.locator('[data-case="hover"] button').hover();
await page.locator('[data-case="focus"] button').focus();
await page.screenshot({ path: '.gmira/shots/states-1440.png', fullPage: true });
```

Coverage check on the built page, before claiming G6:

```js
const targets = [...document.querySelectorAll('button, a[href], input, select, textarea, [role="button"]')];
console.log(targets.length, 'interactive elements');
console.log(targets.filter(e => e.matches(':disabled, [aria-disabled="true"]')).length, 'with a disabled variant present');
```

If the disabled, loading, error, and empty counts on the state route are zero, the surface has two
states and a claim.

## Checks before this skill is done

- [ ] Every interactive surface has all six states built, not just the two that show while you look at the page
- [ ] `:focus-visible` is styled everywhere `:focus` was suppressed, and the ring reads at 3:1 against both adjacent colors
- [ ] Hover is gated behind `@media (hover: hover)` and lands on the container, never on a bare image
- [ ] Disabled controls stay focusable, carry `aria-disabled` plus a stated reason, and keep their label at 4.5:1
- [ ] Read-only and unavailable are treated as their own things, not as a second gray button
- [ ] Skeletons match the real content's line count, widths, and aspect ratios, so nothing shifts when data lands
- [ ] No indicator can appear for under 200ms, and no request wipes a form
- [ ] Every error names the problem and the recovery, sits next to its source, and preserves typed input
- [ ] All three empty kinds are distinguished, and the filter-empty state names the filter and the count
- [ ] The state route exists, was screenshotted, and the images were read
