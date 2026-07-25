---
name: gmira-proof
description: Use when building or fixing any credibility surface: testimonials, reviews, case studies, results and outcome statistics, logo walls, "as seen in" bars, student or customer success sections, ratings, trust badges, or founder and instructor credibility panels. Also use when the client has no testimonials, no logos, and no numbers yet and something has to go in that space, when a page carries a stat with no source, when a quote has no name attached, when a greyed-out logo bar appeared out of nowhere, or when an auto-rotating testimonial carousel needs replacing. Enforces doctrine gate G7 (zero invented metrics, testimonials, logos, or client names) and supplies the substitutions, the attribution rules, and the honest-labeling rule for illustrative values.
---

# Proof

Credibility surfaces. The one skill in this library with a hard content constraint.

Load `../gmira/references/DOCTRINE.md` first. This skill implements **G7** and nothing here may
be traded away for visual completeness.

## The premise

> **G7 Content.** Real content model, zero invented metrics, testimonials, logos, or client names.
> Truth binds claims, not demonstrations: an illustrative value is fine when labeled as one.

Invented proof is not a lorem-ipsum placeholder that someone will swap out later. It is the thing
that ships, because nobody remembers to remove it and because removing it leaves a hole. A fake
logo row on a real business is a claim the business did not make and cannot support, and on a
regulated vertical it is an offense with a name.

**When there is no proof yet, the answer is never a placeholder. It is a different section.** The
work is finding what is true and building the space around that instead.

## Step 1: the refusal list

None of these ship. There is no version of them that is acceptable with better styling.

| Refused | Why | Replace with |
|---|---|---|
| The greyed-out logo bar | Almost always mixes real clients, tools the company uses, and companies an employee once worked at. Greyscale at 40% opacity is the visual signature of hoping nobody looks | Two real logos at full color, each linking to the engagement, each with the work and the date |
| A five-star row with no source | A rating with no platform, no count, and no date is a graphic, not a rating | The platform's own badge, linked, with the count and the date range |
| "Trusted by 10,000+" | No denominator, no definition of "trusted", no date | The real number with what it counts and when it was counted |
| The auto-rotating testimonial carousel | Near-zero engagement past slide one, moves text out from under a reader mid-sentence, and hides n-1 of n quotes from search and from Ctrl+F | Three quotes, all visible, in full, and a link to the rest |
| Counters that animate up on scroll | The animation makes the number feel like a performance rather than a fact, and doctrine 3.6 bans invented figures anyway | Print the number. Add its denominator and its date |
| Stock-photo headshots on quotes | The reverse image search takes four seconds and takes the whole page down with it | No photo. A name and a role outperform a stranger's face |
| "As seen in" from a press-release wire | Paying a distributor to syndicate is not coverage | The one real piece, linked, with the outlet and the date |
| Testimonials with a first name and an initial only | Reads as unverifiable, because it is | Full name and role with consent, or do not use the quote |

## Step 2: when there is nothing yet, use the ladder

Work down this list. Every rung is real, every rung is available on day one, and every rung beats
an invented logo wall.

| Rung | What it is | What it proves |
|---|---|---|
| **The method** | The actual syllabus week by week, the actual 84-point inspection checklist, the actual editing pipeline | That there is a method at all, which most competitors will not show |
| **The process, timestamped** | What happens on day 1, day 7, day 30, with who does it and how long it takes | That the work is understood, not improvised |
| **The guarantee** | The terms in full, including what voids it and who bears the cost | Risk transferred, in writing. This is the strongest rung and the least used |
| **The founder** | Named, with a history that resolves: repos, filings, a company register number, prior roles that can be checked | That a person is accountable |
| **The artifact** | The thing itself: a real student repo, a real inspection report as a PDF, a real delivery photo with its date and place | Capability, demonstrated rather than asserted |
| **The credential** | Registration number, trade body membership, AZAV or funding certification, insurance cover, HU date, Handelsregister number | Third-party verification that already exists |
| **True scarcity** | A cohort cap that is enforced, a stock count queried live, a real deadline | Urgency that survives a reload |

Two structural notes:

- **The method rung is usually the strongest opening for a new school or a new shop**, because it is
  the one thing an established competitor will not publish. Publishing it is itself the proof.
- If a rung is not true, skip it. A guarantee you will not honor is worse than no guarantee.

## Step 3: presenting real proof so it is credible

```
INCORRECT   "Amazing service, would recommend!" attributed to "Sarah M."
            An anonymous superlative. It proves nothing, it could be about anything, and its
            vagueness is exactly what a fabricated quote looks like.
CORRECT     a full name, a role that makes the claim relevant, a specific and falsifiable
            claim, a date, and a link to the original where one is public.
```

```tsx
<figure className="max-w-[64ch]">
  <blockquote cite="https://maps.app.goo.gl/REAL_REVIEW_ID">
    <p>
      The car was in Bremen on the Thursday they said, with the second key and the stamped
      service book. The dent in the tailgate was in the listing photos, so it was not a
      surprise when it arrived.
    </p>
  </blockquote>
  <figcaption className="mt-4 text-sm">
    <span className="font-medium">Katrin Vogel</span>
    <span className="text-muted-foreground">
      Bought a 2021 Passat Variant, delivered 2026-04-18
    </span>
    <a href="https://maps.app.goo.gl/REAL_REVIEW_ID" rel="nofollow">Original review on Google</a>
  </figcaption>
</figure>
```

Rules the markup encodes:

1. **`<figure>` plus `<blockquote>` plus `<figcaption>`.** The attribution is not part of the quote
   and must not be inside `<blockquote>`.
2. **A specific claim beats a superlative.** "Delivered on the Thursday they said, with the second
   key" is checkable. "Amazing service" is not, and readers discount it accordingly.
3. **Keep the caveat.** The sentence about the dent is what makes the whole quote credible. Quotes
   edited to remove every reservation read as marketing copy, because that is what they became.
4. **Date on the quote**, always. A testimonial with no date could be from 2015.
5. **Edit only for length**, with an ellipsis, and only for clarity, with square brackets, and never
   in a way that changes meaning. Say in the section intro that quotes are unedited if they are.
6. **`cite` and a real link** where a public original exists. A quote you can click through to is a
   different category of evidence.

### Numbers carry their denominator and their date

```
INCORRECT   "94% satisfaction"    "10,000+ happy customers"    "4.9 out of 5"
CORRECT     "41 of the 44 people who bought between January and June 2026 answered the
             follow-up survey. 38 said they would buy from us again."
             Source and date printed next to it, at readable size.
```

A number needs four things before it may appear: what it counts, out of how many, measured how, and
when. If any is missing the number does not ship. A statistic without a denominator is an invented
metric even when the numerator is real.

For outcome claims with legal weight (employment rates, earnings, medical or financial results),
also state the response rate and whether the data is self-reported. "31 of 44 graduates in the
January 2026 cohort had a paid role within six months (measured 2026-07-01, self-reported, 41 of 44
responded)" is long and it is the only version that is honest.

## Step 4: testimonial-marquee as pure CSS, and how to restyle it

`@componentry/testimonial-marquee` is the right primitive for a wall of real quotes on a page that
will carry paid traffic: it is pure CSS with an inline `<style>` block of `@keyframes`, so it costs
nothing at runtime. Five layout variants ship: `default`, `stacked`, `dual`, `flush`, `flush-dual`.

**Repair first** (Law 2, see `gmira-arsenal`):

```bash
npx shadcn@latest add @componentry/testimonial-marquee
# 1. cn imports from @workspace/ui/lib/utils. Rewrite to @/lib/utils.
# 2. It DECLARES framer-motion and never imports it. Drop the dependency.
```

Then restyle, in this order:

1. **Own the card entirely.** Replace its internal markup with the `<figure>` from step 3. The
   component's default card has no attribution structure and no `cite`.
2. **Slow it down.** Set the duration as a variable on the container
   (`style={{ "--marquee-duration": "72s" }}`) rather than editing the keyframes. Registry defaults
   run fast enough that nobody can finish a sentence, which is the tell that nobody expected them
   to be read.
3. **`aria-hidden="true"` on the duplicated track.** A marquee loops by rendering the set twice.
   Without this every quote is announced twice to a screen reader.
4. **Pause on hover and on `focus-within`**, so a keyboard user can stop and read one:
   `.marquee:hover [data-track], .marquee:focus-within [data-track] { animation-play-state: paused; }`
5. **Reduced motion is a kill switch, not a slowdown** (doctrine 3.5). Kill the animation entirely
   and let the track be an ordinary `overflow-x: auto` list:
   `@media (prefers-reduced-motion: reduce) { [data-track] { animation: none; } .marquee { overflow-x: auto; } }`
6. **Under eight real quotes, do not use a marquee at all.** With four it visibly repeats within one
   pass, and a repeating loop of four quotes reads as padding. Show them stacked instead.

## Step 5: github-calendar as real-data credibility

For a technical school or an engineering studio, a contribution graph is one of the few proof
elements that is verifiable by the reader in one click. It also has two failure modes.

**It calls a live third-party API.** `github-calendar` reaches
`github-contributions-api.deno.dev` at runtime by default. That is an availability dependency, a
privacy consideration, and a render-blocking client fetch. Own it server side (chanhdai's
`get-cached-contributions.ts` pattern):

```ts
export const getContributions = unstable_cache(
  async (username: string) => {
    const res = await fetch(`https://github-contributions-api.deno.dev/${username}.json`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return res.json();
  },
  ["gh-contributions"],
  { revalidate: 86_400 },
);
```

When it returns `null`, render the panel **without** the graph. Never a placeholder grid.
**A fabricated contribution graph on a page selling engineering credibility is the exact failure
this skill exists to prevent**, and it is one right-click away from being found.

**Say what it proves.** The graph proves this person pushed public commits on those dates. It does
not prove teaching quality, code quality, or employment. Label it for what it is: "Public commits,
last 12 months" with the username visible and linked. An engineer whose work is in private repos has
a sparse graph and is not worse; if the honest graph does not support the claim, use their shipped
artifacts instead and drop the graph. Choosing the metric that flatters is how invented metrics get
in through the back door.

## Step 6: honest labeling of illustrative values

The doctrine permits an illustrative value **when labeled as one**. Three conditions make a label
count.

1. **In the same visual group as the number**, not in a footnote, not behind an asterisk, never in a
   `title` attribute.
2. **Readable**: at or above the 11px functional floor and at or above 4.5:1 contrast. A caption at
   9px and 3:1 is not a label, it is a defense.
3. **Naming every assumption**, including the ones the visitor did not set.

```tsx
<div data-illustrative className="rounded-xl border p-6">
  <p className="font-mono text-5xl tabular-nums">{eur.format(1250)}</p>
  <p className="mt-1 text-sm">Monthly revenue at 50 orders</p>
  <p className="mt-3 text-xs text-muted-foreground">
    Worked example, not a projection and not an average. Assumes 50 orders at 25 EUR average
    basket and a 40% gross margin. Your numbers will differ.
  </p>
</div>
```

And the placement rule that catches the rest: **an illustrative number may not sit in a stat block
directly above a call to action.** Position makes it a claim regardless of the caption. Put worked
examples inside the explanation they illustrate, where a reader is already in a reasoning frame.

## Step 7: the two INCORRECT / CORRECT pairs to hold on to

```
INCORRECT   a row of six greyscale logos at 40% opacity under a heading reading
            "Trusted by teams at". Three are companies an employee worked at before,
            one is a SaaS tool the company pays for, one is a client who has not agreed
            to be named, and one was drawn from the component's demo data and never replaced.
CORRECT     nothing in that space, and the space goes to a rung of the ladder that is true.
            If two clients HAVE agreed in writing: two logos at full color, each linking to
            the case study, each with the engagement and the date under it. Two real ones
            outperform twelve borrowed ones, because twelve invites the reader to check
            and one wrong entry discredits the whole row.
```

```
INCORRECT   "This course changed my career." with no name, no role, no date, and a stock
            photograph of a smiling person who has never taken the course.
CORRECT     the quote does not ship until someone real has said something specific and
            agreed to be named. Until then the space holds the syllabus, the refund terms,
            or the first student's actual repository with its commit history. Every one of
            those is stronger than a quote a reader suspects is fabricated, because a
            suspected testimonial does not read as neutral, it reads as evidence against.
```

## Checks before this skill is done

- [ ] Every quote has a full name, a relevant role, a date, and consent to publish
- [ ] Every quote makes a specific falsifiable claim, and at least one keeps its caveat
- [ ] Attribution is in `<figcaption>`, never inside `<blockquote>`; `cite` set where a public original exists
- [ ] Every number states what it counts, out of how many, measured how, and when
- [ ] Outcome claims state the response rate and whether the data is self-reported
- [ ] Every logo is a real client who agreed in writing, at full color, linked, with a date
- [ ] Nothing on the refusal list is present in any styling
- [ ] No auto-rotating carousel; every quote is in the DOM and findable with Ctrl+F
- [ ] The marquee's duplicated track is `aria-hidden`, it pauses on hover and focus, and reduced motion kills it
- [ ] Fewer than eight quotes means no marquee
- [ ] Any live third-party proof source is cached server side and degrades to absence, never to a placeholder
- [ ] Every illustrative value is labeled in its own visual group, at readable size, with all assumptions
- [ ] No illustrative value sits in a stat block above a call to action
- [ ] Grep the built markup for the registry components' demo strings and names before shipping
