---
name: gmira-brief
description: Use when starting any web surface and no written brief exists yet: a new landing page, a vehicle inventory site, a product detail page, a course or cohort page, a dashboard, a portfolio, a checkout. Also use when a build is about to invent content it has no right to invent (prices, customer names, logos, benchmarks, seat counts, review scores), when the requested page turns out to be several surfaces with different jobs, or when a first draft came back generic because nobody wrote down what is actually true. Extracts product truth against aspiration, the visitor scene, the real content model field by field, the surface mode, and the uninventable list, then commits all of it to `.gmira/surfaces/<slug>.md`. Run it before `gmira-direction`, every time, including on "just fix the hero".
---

# Brief

Extract what is true. Everything downstream is allowed to be bold about how it looks and about
nothing else.

Load `../gmira/references/DOCTRINE.md` first. This skill produces the input that Part 2 and
gate G7 both depend on.

## The premise

A brief is not a summary of what the user said. It is **the set of facts the build is not allowed
to invent**, plus the content model that decides what the layout can even be. A page built without
one defaults twice: once on the aesthetic, once on the shape of the data. The second default is the
one nobody names, and it is where card grids come from. **A card with a title, an icon, and two
lines is a shape. A vehicle listing has 22 fields and 24 photographs.**

The output is a written file. If the brief is not on disk, it does not exist, because the finishing
review has to audit against something.

## Step 1: name the state you are in

Four states, four different verdicts. Decide before asking anything.

| State | Verdict |
|---|---|
| **Redesign** | Preserve product truth, content, function, constraints, explicit brand commitments. Replace the old visual world rather than polishing it. The old look is evidence of what the subject is, not authority over what it becomes. |
| **Established world** | Inherit it. A missing design doc does not erase a coherent identity already present in the code. Document that identity instead of inventing a replacement. |
| **Incomplete brand** | Preserve the confirmed assets and the recognizable traits, then extend the system for this surface. |
| **No visual authority** | Create a new world with the user. Full anti-default procedure in `gmira-direction`. |

Scope guard, and it is the one people break: **a section, component, feature, or state inside an
established surface inherits that surface.** Do not turn a local addition into a new identity
exercise.

```
INCORRECT   user asks for a filter sidebar on an existing inventory page,
            agent proposes a new color world and a type pairing.
CORRECT     state = established world. Inherit tokens, type, spacing, and control vocabulary.
            The brief covers only the new fields, states, and how the addition joins.
```

## Step 2: ask, at most once

Two or three questions per message, then wait. **One round is the default.** A second round only
when an answer exposes a material gap, never to be thorough.

### The question list, in order

1. **What is this surface for, and what does the visitor have to understand or do on it before
   they leave?**
2. **Who reaches it, on what device, under what light, with how much time, and how expert are they
   in this category?** One sentence, physical. This is the scene, and it later forces dark versus
   light and the contrast floor.
3. **What is uniquely true here that a neighbouring product or a generic template could not
   claim?** If the answer is a category adjective, ask once more for the specific.
4. **Name the actual fields one item carries, and how many items there are at minimum, typically,
   and at maximum.** For a listing, a product, a course, a record. Not the card shape, the fields.
5. **What must remain untouched?** Domain, URLs, legal text, an existing logo, a component the
   client's team maintains, a data contract.
6. **What would make a polished result feel wrong?** The single most useful question in the list.
   It catches the constraints nobody states because they seem obvious.
7. **What is not allowed to be invented?** Prices, customer names, certifications, availability,
   capabilities, benchmark figures, headcount. Read back your own list and have it confirmed.

Five is the floor, seven is the ceiling. If the prompt already answered four of them, ask the
remaining two or three and stop.

### When to stop

- **Never ask for CSS values or a menu of aesthetic lanes.** "Modern or classic", "which of these
  three palettes", "do you want it playful" are all the same question and it is the wrong one.
  Direction is assigned in `gmira-direction`, not chosen from a list here.
- **Never ask which mode the surface is.** Infer it from question 1 and state the inference.
- **Never restate a settled fact as a question.** If the ask says "car dealership in Oldenburg with
  41 cars in stock", the location and the stock size are settled.
- **Assert the likely reading and invite correction.** "I am reading this as Persuade, a first visit
  from paid traffic on a phone, and the primary action is a test drive request. Correct me on any of
  the three." That costs one line and replaces three questions.
- A sparse prompt gets one full round. A precise prompt may need only the compact confirmation.
- Two consecutive rounds with no new constraint means you are interrogating. Write the brief with
  the inferences marked and move.

### What to infer instead of asking

Every inference goes in the file on an `INFERRED` line so it can be corrected in one word.

| Inferable | How |
|---|---|
| Mode | From the visitor's success condition in answer 1 |
| Effect budget | From mode, per the doctrine table |
| Dark or light | From the scene sentence in answer 2, resolved in `gmira-palette` |
| Content model gaps | From the category's real data shape, then flagged as assumed |
| Locale, currency, date format, units | From the business location |
| Breakpoint set | 390, 834, 1024, 1440, 1920. Fixed by the verify gate |
| Legal surface requirements | Impressum, Datenschutz, Widerruf for a German commercial site |

## Step 3: mode, per surface

Mode names what the visitor's success looks like **on the surface in hand**, not on the project.
A tool's landing page is Persuade even though the product is Operate. A fashion house's
documentation is Read.

| Mode | Visitor success | Effect budget |
|---|---|---|
| **Persuade** | decides and acts; design is the product | Highest. One heavy effect, bounded, in the first viewport. |
| **Experience** | is inside the work itself | Highest. The effect may be the content. |
| **Read** | understands something | Low. Nothing animated inside the measure. |
| **Operate** | completes a task | Near zero. A checkout with a fluid background is a bug. |

Mode also sets the type scale ratio (1.25 brand, 1.125 to 1.2 Operate), the color strategy floor
(Restrained is the default for Operate and Read), and where the budget goes instead: state coverage
and input latency.

```
INCORRECT   MODE: operate            (because the product is a dashboard)
CORRECT     one project, three briefs:
            /            MODE: persuade    marketing site, effect budget open
            /app         MODE: operate     effect budget near zero, ratio 1.2
            /docs        MODE: read        measure first, no motion in the column
```

## Step 4: the real content model

This is the half of the brief that people skip, and skipping it is what produces the card grid.
**Write the field list. The field count and the nesting depth decide what the layout can be.**

### Vehicle listing, German dealer stock

| Field | Note | Range |
|---|---|---|
| make, model, trim | trim absent on roughly 20% of stock | |
| model year **and** first registration MM/YYYY | two different fields, routinely conflated | |
| mileage km | the number buyers read second | 0 to 320,000, typical 48,000 |
| power kW **and** PS | both are shown, PS is the one that is read | |
| fuel, transmission, drivetrain, body, doors, seats | 6 enum fields | |
| exterior colour + paint type | uni, metallic, pearl | |
| interior material + colour | | |
| previous owners | | 0 to 6, typical 1 |
| service history | full, partial, none | |
| next HU date | absent on new stock | |
| emissions class, CO2 g/km, combined consumption | legally required on the page | |
| warranty months remaining | | 0 to 24 |
| VAT status | §25a versus ausweisbar, changes the price block for business buyers | binary |
| price, financing rate from, monthly | | |
| branch, VIN | | |
| photographs | portrait and landscape mixed, not one crop ratio | 8 to 60, typical 24 |
| equipment list | | 12 to 80 lines, typical 34 |
| free-text description | | 0 to 1200 chars, absent on 40% |
| accident and damage declaration | required, never optional | |

Twenty-two fields, mixed photo ratios, one long list, and one field that changes the price display
for a whole buyer class. That is a spec table plus a gallery plus a disclosure, not a card.

### Course or cohort

`course > module (4 to 12) > lesson (3 to 8) > resource`, four levels. Plus format, language, start
date, duration in weeks (4 to 24), hours per week, session schedule with timezone, cohort cap (8 to
40), seats remaining, prerequisites (0 to 5 lines), instructors (1 to 4, each a real bio and a real
link), project deliverable, certificate type and issuing body, funding eligibility (Bildungsgutschein,
AZAV certificate number, employer invoice), price, payment plan, refund window, waitlist state.

**A card grid flattens four levels to one.** That is the whole argument against it here.

### Product detail

Title, brand, SKU, variant axes (size 4 to 14 values, colour 2 to 12) with stock per combination,
price, compare-at, tax note, shipping lead time, returns window, weight, dimensions, materials,
care, spec table 6 to 20 rows, reviews 0 to 4000 with a real distribution, badge state
(new, sale, last one, preorder, backorder), bundle and cross-sell relations.

### Ranges are part of the model

Every repeating set gets min, typical, max, and the layout has to survive all three. A grid tuned
for the typical case breaks at min (one item, alone, in a three-column track) and at max (80
equipment lines in a container built for 12).

```
INCORRECT   "a list of features"
CORRECT     equipment: 12 / 34 / 80 lines, single-column at 390, two at 834,
            three at 1440, alphabetized inside groups, no truncation at any count.
            At 12 the block must not read as an empty grid.
```

## Step 5: what must not be invented

Two lists, and the distinction between them is the rule most often broken in both directions.

**Uninventable, always.** Commercial and factual claims: prices, customer names, logos,
testimonials, quoted people, benchmark numbers, certification and registration numbers, headcount,
funding amounts, API endpoints, availability dates, review counts, star ratings, "trusted by",
capabilities the product does not have, awards, press mentions, years in business.

**Illustrative, allowed when labeled.** Truth binds claims, not demonstrations. In greenfield work,
author whatever material the concept needs at full fidelity, label it wherever a visitor could
mistake it for real, and hand back the replacement list.

```
INCORRECT   refusing a spec-table hero because the client has not sent the stock feed,
            and shipping a centered headline with two buttons instead.
CORRECT     author one full vehicle record at real fidelity, mark it
            data-illustrative="true", render a visible "Beispieldatensatz" label,
            and list it under ILLUSTRATIVE in the brief with the field the real feed supplies.
```

Refusing a committed direction because its demonstration data does not exist yet is timidity
wearing honesty's clothes. Inventing a customer logo is not boldness, it is a false statement.

### True versus aspirational

Go through the ask sentence by sentence and mark each **T** or **A**. A T has a source you could
point at: a feed, an invoice, a certificate, a public register, a live count. An A is a hope, an
ambition, or a comparative with no measurement behind it.

| Sentence | Mark | Consequence |
|---|---|---|
| "41 cars in stock" | T, and it is queryable | renders, from the feed, never hardcoded |
| "largest independent Porsche specialist in Lower Saxony" | A | goes in ASPIRATIONAL, never renders as a claim |
| "AZAV certified, cert 12345-6" | T | renders with the number |
| "students land jobs fast" | A | renders only if a real outcome figure exists, otherwise cut |

Aspirational content is not deleted from the brief. It is recorded so that later, when someone asks
why the hero does not say it, the answer is on file.

## Step 6: write the file

`.gmira/surfaces/<slug>.md`. One file per surface, not per project. `gmira-direction` appends
its 5-block contract to the same file, which is how the finishing review audits promise by promise.

```
# <slug>

STATE          redesign | established-world | incomplete-brand | no-visual-authority
MODE           persuade | operate | read | experience
SCENE          one sentence, physical: who, device, light, time, expertise
JOB            what the visitor must understand or do before leaving
ONLY-TRUE-HERE the thing a neighbouring product could not claim

TRUE           verified facts, each with the source that backs it
ASPIRATIONAL   said in the ask, not yet true, does not render as a claim

CONTENT        item type, field list, min / typical / max per repeating set
STATES         which of empty, loading, error, partial, overflow, expert actually occur here

UNINVENTABLE   the explicit list, confirmed by the user
ILLUSTRATIVE   what may be authored, how it is labeled, what replaces it

UNTOUCHABLE    domains, URLs, legal text, owned components, data contracts
WRONG-EVEN-IF-POLISHED

INFERRED       one line per inference made instead of asking
OPEN           choices a builder must not invent, still unanswered
```

Three to five bullets per block when the task is settled. Use the full structure only for an
ambiguous, multi-screen, or standalone surface. **Do not restate the conversation.**

Then stop. The brief never writes code and never writes a direction contract. Hand to
`gmira-direction`.

## Checks before this skill is done

- [ ] `.gmira/surfaces/<slug>.md` exists on disk and every block has content
- [ ] Five to seven questions asked, in one round, none of them about CSS or an aesthetic lane
- [ ] Every inference made instead of asking is on an `INFERRED` line
- [ ] Mode is set from this surface's visitor success, not from the product
- [ ] The content model names actual fields, with min / typical / max for every repeating set
- [ ] Every sentence in the ask is marked T or A, and every T names its source
- [ ] The uninventable list was read back to the user and confirmed
- [ ] Anything illustrative has a label plan and a replacement line
- [ ] The scope guard held: a local addition did not become a new identity exercise
- [ ] No element was placed and no color was chosen inside this skill
