---
name: gmira-verify
description: "Use before handing any web surface back to a user, and whenever a page needs checking at real viewport sizes. Runs Playwright across five viewports, captures screenshots, collects console errors, measures computed contrast and text overflow, exercises pointer-driven effects with a real mouse, and checks reduced-motion and canvas-deleted fallbacks. Also use when something looks right in one browser size and wrong in another, when an effect \"works\" but nothing visible happens, or when a build passed lint but nobody has actually looked at it."
---

# Verify

The gate. Nothing goes back to the user without this, and the last step is looking with your own eyes.

Load `../gmira/references/DOCTRINE.md` (Part 7.3 is the budget, Part 8 is the gate table).

## The budget

**Two screenshot rounds, fixes batched between them.** Round one collects every finding across every
viewport. Round two confirms the batch.

A third round means the direction was wrong, not the details. Go back to `gmira-direction`
rather than iterating on pixels. Per-tweak screenshot loops burn the user's budget and converge on
nothing.

## The five viewports

Fixed, and they are not negotiable. They are the ones where the predecessor project's regressions
actually appeared.

```
1920x1080   desktop wide
1440x900    desktop, the design default
1024x768    small laptop and landscape tablet
834x1112    tablet portrait
390x844     phone
```

## Run it

```bash
node skills/gmira-verify/scripts/verify.mjs http://localhost:3000/route --out proofs/<slug>
```

The script writes one screenshot per viewport, a `report.json`, and a `report.md`. It collects
console errors, computed contrast failures, text overflow, missing focus styles, and canvas health.

It cannot judge. That part is yours, below.

## The anchoring quarantine

**Do the taste read first, in isolation, and write it down before opening the report.**

When you have both a deterministic checker and a judgment pass, the checker's output becomes the
ceiling of the judgment: once the machine's list is satisfied, looking stops. So the order is fixed:

```
1  open the 1440x900 screenshot, look at it, write 3 to 6 sentences on what it is and what is wrong
2  open the 390x844 screenshot, same
3  ONLY THEN read report.json, console output, and lint
4  synthesize
```

If you read the report first, step 1 is no longer possible for this page.

## Reading a screenshot properly

Not "does it look nice". Specific questions:

1. **Does it match the direction contract, block by block?** Pull `.gmira/surfaces/<slug>.md` and
   check FIRST VIEWPORT against the actual first viewport, in nouns. Absent promises are findings.
2. **The squint test.** At 10% zoom, is there a structure, or an even queue of blocks?
3. **What is the second thing you look at?** If everything is the same weight, nothing was designed.
4. **Section rhythm.** Is every section the same vertical padding? That is the most common tell.
5. **Is anything clipped, overlapping, or overflowing?** At every size, with real copy.
6. **Frame 0.** Is the effect visible with no input, and if not, which of the three permitted
   resolutions was taken?

Write findings down as you look. A finding you did not write down did not happen.

## Pointer-driven effects need a real mouse

Synthetic `new PointerEvent(...)` carries `movementX = 0`. Fluid solvers, trails, and repel effects
derive force from movement deltas, so a dispatched event injects **zero force and renders nothing**,
while the GL context reports perfectly healthy. A check built on `dispatchEvent` returns a false
negative and looks like a pass.

```
INCORRECT   el.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY }))
CORRECT     await page.mouse.move(x1, y1); await page.mouse.down();
            for (...) await page.mouse.move(xi, yi);   // real deltas
            await page.mouse.up();
```

Proven the hard way: `../gmira/references/finding-02-idle-state.md`.

## The four checks a script cannot fake

Run these manually, per route.

**1. Delete the canvas.** In devtools, remove every `<canvas>`. Everything the page says must still
be readable and everything it does must still work. Trusting a fallback branch is not the test.

**2. Reduced motion.** Emulate `prefers-reduced-motion: reduce`. Motion must be a **kill switch, not
a slowdown**, and the frozen frame must look composed. `t = 0` is usually the worst frame an effect
has.

**3. Route-change teardown.** Navigate away and back 20 times. Live WebGL contexts must not grow.
Browsers cap them at roughly 16, and a leak does not error, it silently makes every later canvas
fail.

**4. Keyboard only.** Tab through the whole page. Focus order matches visual order, focus is always
visible, no trap, escape closes what it opened, focus returns where it came from.

## The gate table

Nothing ships until all ten are green. Full definitions in the doctrine, Part 8.

| Gate | Green means |
|---|---|
| G1 Direction | built page traces to the contract block by block |
| G2 Refusals | no category defaults, no refused components, or logged with the reason |
| G3 Contrast | body and placeholder >= 4.5:1, large >= 3:1, from computed styles |
| G4 Type | measure 65 to 75ch, tracking >= -0.04em, zero overflow at five sizes |
| G5 Motion | one authored moment, reduced motion is a total kill switch |
| G6 States | hover, focus, disabled, loading, error, empty, all six, all present |
| G7 Content | zero invented metrics, testimonials, logos, client names |
| G8 GPU | DPR cap, precision, context loss, destroy, offscreen pause, canvas-deleted readable |
| G9 Console | zero errors at all five viewports |
| G10 Eyes | screenshots read, findings written down |

## Reporting

State what failed with the evidence, not a score. If tests failed, say so and quote the output. If a
check was skipped, say which and why. Do not report a gate green that you did not actually run.

Announce a degraded run on the first line: `WARNING DEGRADED: <reason>`. "Unavailable" never
includes "inconvenient".

## Checks before this skill is done

- [ ] All five viewports captured, both rounds
- [ ] Taste read written down before any report or console output was opened
- [ ] Every pointer-driven effect exercised with a real mouse, not synthetic events
- [ ] Canvas deleted, page still readable and operable
- [ ] Reduced motion emulated, frozen frame looks composed
- [ ] 20 route changes, WebGL context count flat
- [ ] Full keyboard pass, focus order and return verified
- [ ] Ten gates each explicitly green or explicitly reported as failed
