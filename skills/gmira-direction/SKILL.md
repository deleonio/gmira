---
name: gmira-direction
description: Use before building or redesigning any web surface, and whenever a page has come out bland, templated, safe, or "AI-looking". Produces the written visual direction that everything else is built against: the material world, the thesis, the structural form, and what is on screen in the first viewport. Also use when a design review keeps producing small fixes that do not add up, when two people disagree about a page without being able to say why, or when output looks competent but interchangeable with any competitor.
---

# Direction

Nothing gets built before this. It costs 150 words.

Load `../gmira/references/DOCTRINE.md` (Part 2 is this skill's law).
World catalog: `../gmira/references/playbooks/worlds.md`.

## Why generic happens

Not a talent problem. A model's ranking of design options is a **deterministic function of its
priors**, so instructing it to "be original", "avoid generic", or "rank harder" cannot beat the
prior. The instruction is evaluated by the thing it is trying to correct.

Only an **external assignment** defeats a prior. That is the whole mechanism of this skill.

## Step 1: name the rut, and its opposite

Write both down. Two sentences each, concrete enough to be excluded.

```
THE RUT       what every site in this category already looks like
THE COUNTER   the obvious move away from it
```

For a car dealership the rut is: full-bleed hero photo of the car at golden hour, dark UI, red or
blue accent, a stats row, cards of vehicles with a heart icon. The counter is: brutalist, all-mono,
black and white, oversized type. **Both are excluded.**

> If someone could guess the aesthetic from the category alone, **or from
> category-plus-avoidance**, rework until neither answer is obvious.

Most anti-slop work misses the second half. Predictable contrarianism is also a prior.

## Step 2: draw the world, do not pick it

`worlds.md` holds 40 real material worlds. **Draw by an external index. Never pick a favorite.**

```
index = (hash of the project slug + today's date) mod 40
```

Any outside source works: a user-supplied number, a date, a hash. What matters is that the
selection is not the model's own preference, because the model's own preference is the prior.

Draw **seven** candidates spanning at least **three material families**. Discard any that collide
with the rut or the counter. From what survives, **fuse the two strongest** and judge the fusion on
exactly two axes:

1. Does it carry the product's actual truth, or does it fight it?
2. Is the TELL buildable on the web, in CSS or canvas, this week?

Fewer than seven candidates and the prior wins by default.

## Step 3: write the contract

Five blocks. **150 words total.** Committed to `.gmira/surfaces/<slug>.md` and emitted as an HTML
comment in the built markup so the finishing review can audit it promise by promise.

```
THESIS          one sentence: what this surface argues
OWN-WORLD       the material world, named specifically, with its TELL
STORY           what changes between the first viewport and the last
FIRST VIEWPORT  what is on screen before any scroll, in nouns
FORM            the structural decision: how the page is built, not how it feels
```

### The falsifiability test

**If a block reads like a mood, the direction is not decided yet.**

```
INCORRECT   OWN-WORLD: premium, modern, trustworthy, with a technical edge
CORRECT     OWN-WORLD: a 1970s Porsche parts catalogue. Newsprint-weight paper, part
            numbers in mono, hairline rules between every row, photographs printed
            small on a neutral card, no rounded corners anywhere.
            TELL: every vehicle carries a fabricated 6-digit stock number set in mono,
            and the rules between spec rows are 0.5px, not 1px.
```

The second one can be checked against a screenshot. The first one cannot be checked against
anything, which is why it always survives review and always produces a generic page.

Same test on FORM:

```
INCORRECT   FORM: clean, spacious, with clear hierarchy
CORRECT     FORM: a single 12-column index that never becomes cards. Vehicles are rows.
            One vehicle per screen gets promoted to a full-bleed plate. No section is
            centered. The page has exactly one horizontal rule weight.
```

## Step 4: the specificity test

**Could an unrelated product use this page unchanged?**

Apply it **per section**, not once per page. A hero can be specific while the three sections under
it are interchangeable, and that page still reads as generic, because most of it is.

## The standing exit

The safe conventional option is always available to the user. **You may never recommend it or weigh
it in.** Present it as available, then argue for the committed direction. This preserves the user's
agency without letting agent risk aversion decide the design.

## When there is already a direction

Do not rewrite it. Read `.gmira/surfaces/<slug>.md` and build against it. A direction that
changes per session is not a direction. If it genuinely needs replacing, say why in one line, then
run this skill fully rather than drifting.

## Torn between refined and committed

Commit. Refined-and-safe is the median with better spacing, and the median is what this whole
library exists to escape.

## Checks before this skill is done

- [ ] The rut and the counter are both written down, concretely, and both excluded
- [ ] Seven candidates were drawn by an external index, spanning three material families
- [ ] The world is a real artifact someone could hold or visit, not an adjective
- [ ] All five blocks written, 150 words total, none of them a mood
- [ ] The TELL is buildable in CSS or canvas and named specifically
- [ ] The contract is committed to `.gmira/surfaces/<slug>.md`
- [ ] The contract is emitted as an HTML comment in the built markup
- [ ] The specificity test applied to every planned section, not just the hero
