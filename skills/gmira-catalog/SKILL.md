---
name: gmira-catalog
description: "Use when building or fixing any page that presents a set of things: vehicle inventory, product listing (PLP), category page, course or cohort catalog, module index, creative wall, project archive, team page, or search results. Also use when a set came out as a uniform card grid, when descriptions are line-clamped so every card matches height, when a filtered view cannot be shared as a URL, when infinite scroll made the footer unreachable or lost scroll position on back, or when a canvas gallery left products uncrawlable. Covers the seven set structures, faceted filtering and sorting, pagination, image crop discipline, zero-results and empty states, and loading as a design surface."
---

# Catalog

Any set of things. This is the anti-card-grid skill.

Load `../gmira/references/DOCTRINE.md` first. Part 5 tell 2 (the three-column reflex), tell 3
(one crop ratio everywhere), and tell 9 (perfectly even card heights) all live here.

## The premise

**The uniform card grid is what a page looks like when nobody decided.** It is the median rendered
to HTML: equal rectangles, equal photos, equal weight, three across. It is not neutral. It is a
claim that every item in the set matters exactly as much as every other item, and that claim is
almost never true of real inventory.

Real sets are lopsided. One vehicle has 22 photos, one owner, and a full service book; nineteen
others have eight photos and a history nobody wrote down. One course fills in a week; four take
months. A grid destroys that information and then the page needs a "Featured" badge to put back
what the layout removed.

## Step 1: read the set before choosing a structure

Answer these in writing. They pick the structure for you.

| Question | What the answer decides |
|---|---|
| How many items, at the median and at the maximum? | 6 vs 60 vs 6,000 are three different problems |
| What is the spread on the primary axis (price, date, level)? | Flat spread means comparison, wide spread means hierarchy |
| Is the visitor **comparing**, **browsing**, or **finding a known item**? | Compare wants a table, browse wants images, find wants search plus filters |
| Which 3 to 5 fields actually differentiate one item from its neighbor **in this set**? | Those are the card. Everything else is the detail page |
| Does one item deserve to be larger, and can you say why from the data? | If yes, the grid is already wrong |
| Mode (doctrine 2.1) | Experience can spend on effects. Operate and Read cannot |

If you cannot name the 3 to 5 differentiating fields, you do not have a content model yet and no
layout will save it.

## Step 2: pick a structure, from seven

| Structure | Right when | Wrong when |
|---|---|---|
| **The index (table)** | 20+ items bought on numbers, comparison is the job, the visitor sorts | Fewer than about 8 rows, or the photo carries the decision |
| **Editorial list with one featured** | The set has a real standout you can justify from data, and a long tail | Everything is genuinely equivalent; the feature then reads as an ad |
| **Density-varying grid** | Importance is a computable field (price percentile, photo count, days on lot) | Importance is a stylist's opinion; it becomes arbitrary noise |
| **Comparison rail** | 2 to 6 near-identical items differing on 4 to 8 specs | Items differ on more axes than fit in a row |
| **Map or spatial arrangement** | Position carries meaning: locations, floorplan, a curriculum dependency graph | Position is decorative. A scatter of cards is not a map |
| **Stacked spec sheet** | Parts-catalogue material: monospace fields, hairline rules, one small photo per row | The set is sold on desire rather than on numbers |
| **Filmstrip (scroll-snap track)** | 5 to 12 items with one strong image each, browsing, no comparison | The visitor must count, compare, or reach item 30 |

Mixing two is normal and usually correct: one featured row, a comparison rail for the close cluster,
an index table for the tail.

### The index, done properly

```tsx
<table className="w-full border-collapse text-sm">
  <caption className="sr-only">36 vehicles in stock, sortable</caption>
  <thead>
    <tr>
      <th scope="col"><SortLink field="model">Model</SortLink></th>
      <th scope="col" className="text-right"><SortLink field="first_registration">Reg.</SortLink></th>
      <th scope="col" className="text-right"><SortLink field="mileage_km">km</SortLink></th>
      <th scope="col" className="text-right">Gearbox</th>
      <th scope="col" className="text-right"><SortLink field="price_eur">EUR</SortLink></th>
    </tr>
  </thead>
  <tbody>
    {rows.map((v) => (
      <tr key={v.vin}>
        <th scope="row" className="font-normal">
          <a href={`/fahrzeuge/${v.slug}`} className="after:absolute after:inset-0">{v.model} {v.trim}</a>
        </th>
        <td className="text-right tabular-nums">{v.first_registration}</td>
        <td className="text-right tabular-nums">{intFmt.format(v.mileage_km)}</td>
        <td className="text-right">{v.gearbox}</td>
        <td className="text-right tabular-nums">{eur.format(v.price_eur)}</td>
      </tr>
    ))}
  </tbody>
</table>
```

`tabular-nums` on every numeric column is not cosmetic. Without it the digits have different widths,
the columns fail to align vertically, and the table stops being scannable, which was its only job.
Sort links are real anchors with the sort in the query string, so a sorted view is a shareable URL
and works before hydration.

### The density-varying grid

Weight comes from data, never from the index position or from taste.

```css
.set { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1px; background: var(--line); }
.set > [data-weight="lead"]   { grid-column: span 12; }
.set > [data-weight="high"]   { grid-column: span 6; }
.set > [data-weight="normal"] { grid-column: span 4; }
.set > [data-weight="tail"]   { grid-column: span 3; }
```

```ts
export function weight(v: Vehicle, set: Vehicle[]): Weight {
  if (v.price_eur >= p90(set, "price_eur") && v.photo_count >= 16) return "lead";
  if (v.owners === 1 && v.service_book === "complete") return "high";
  if (v.days_on_lot > 90) return "tail";
  return "normal";
}
```

Now the layout carries information. A visitor who never reads a word learns which cars the dealer
stands behind. If `weight()` cannot be written from real fields, do not use this structure.

## Step 3: unequal importance is content, not decoration

```
INCORRECT   36 vehicles, 36 identical cards, three columns, one photo each, model, price,
            "View details". The 2019 base model with 190,000 km sits in the same rectangle
            as the 14,000 km one-owner car with the full stamped book. The page has told the
            visitor nothing it was not forced to.
CORRECT     read the set, then build to it. The one car 40% above the median with 22 photos
            gets a full-width row with three images and the spec line. The six clustered
            within 5% on price and trim get a comparison rail with the differing fields
            emphasized. The remaining 29 go in the index table, sortable, because at 29 rows
            a table is faster to scan than 29 cards and does not pretend they are equivalent.
```

```
INCORRECT   line-clamp-2 on every description so all cards land at 384px.
            Real sentences are cut mid-clause to serve the grid.
CORRECT     the card does not carry a description at all. It carries the 3 to 5 fields that
            differentiate this item from its neighbors in this set, plus at most one line that
            is unique to it and complete. Rows use grid-auto-rows: auto. Cards are different
            heights, on purpose, and the difference is legible from across the room.
```

Truncating real content to fit a grid is doctrine tell 9. When you catch yourself reaching for
`line-clamp`, the field does not belong on the card.

## Step 4: filtering and sorting are first-class, not chrome

### URL state, always

Every filter, every sort, every page lives in the query string. A filtered view that cannot be
sent to a partner in a message is broken, and so is one that loses itself on browser back.

```tsx
import { useQueryState, useQueryStates, parseAsArrayOf, parseAsString, parseAsInteger } from "nuqs";

const [filters, setFilters] = useQueryStates({
  make:      parseAsArrayOf(parseAsString).withDefault([]),
  fuel:      parseAsArrayOf(parseAsString).withDefault([]),
  price_max: parseAsInteger.withDefault(60_000),
  km_max:    parseAsInteger.withDefault(200_000),
  sort:      parseAsString.withDefault("price_asc"),
}, { history: "push", shallow: false, clearOnDefault: true });
```

`history: "push"` so back undoes one filter. `clearOnDefault` so the URL stays short and the
canonical unfiltered page has no parameters. Server side, read the same shapes with
`createSearchParamsCache` from `nuqs/server` so the first render is already filtered and the page
works with JavaScript disabled.

### Facet counts, computed correctly

```ts
// A facet's own selection is EXCLUDED when counting that facet. Otherwise picking "Diesel"
// makes every other fuel read 0 and the filter becomes a dead end the visitor cannot leave.
function facetCounts<K extends keyof Filters>(all: Vehicle[], f: Filters, facet: K) {
  const base = all.filter((v) => matches(v, { ...f, [facet]: [] }));
  return countBy(base, facet);
}
```

Render the count next to every value, including the zeroes. A facet value at 0 stays visible and
disabled with the count showing, because "there are no diesels" is information. Hiding it makes the
filter list reflow on every click, which is worse.

### Range inputs

`scrub-input` (`@componentry`, zero dependencies) is a real filter primitive, not an effect: a
pill-shaped drag-to-scrub numeric input with min, max, step and label. It is on the doctrine's
underused list. Repair its `@workspace/ui/lib/utils` import first (Law 2, see `gmira-arsenal`),
then pair it with a real `<input type="text" inputMode="numeric">` so the value can be typed and
pasted. A scrub that cannot be typed into fails anyone who knows their exact budget.

### Sorting

Default sort is a decision, not "relevance". Name it in the control: "Newest listing first", not
"Sort". Every option must be stable (tie-break on a unique key) or pagination duplicates and drops
rows between pages.

## Step 5: pagination, not infinite scroll

Infinite scroll breaks five things at once:

1. **The footer becomes unreachable.** Contact, imprint, legal, and the second-tier navigation are
   below a list that grows faster than the visitor scrolls.
2. **Back returns to the top.** A visitor who opens item 40 and comes back lands at item 1, having
   lost the scroll position, the loaded pages, and their place in the decision.
3. **Nothing is shareable.** There is no URL for "the third page of these results".
4. **Crawlers stop at the first batch.** Items 25 and beyond may never be discovered.
5. **Print and Ctrl+F only see what happened to load.**

```
INCORRECT   an IntersectionObserver at the bottom that appends the next page and calls
            history.replaceState, so back exits the listing entirely.
CORRECT     real paginated URLs: /fahrzeuge?page=2, with <a> elements, rel="prev" and
            rel="next" in <head>, and the footer reachable in every state. If a "Load more"
            button is wanted for feel, keep it, and have it push the page parameter so the
            URL, back button, and crawler all still work.
```

An endless feed with no footer, no SEO job, and Experience mode is the one defensible case. Write
down that you took it and why.

## Step 6: the crawlability rule

**Canvas-rendered items are not links, not indexable, not focusable, and invisible to Ctrl+F.**
Fatal on commerce, on inventory, on anything with an SEO job. Doctrine 6.2.

| Component | Verdict on a set page |
|---|---|
| `infinite-image-field` | Canvas. Items are pixels. Mood surface only, never a navigable set |
| `cursor-driven-particle-typography` | Canvas text. Never on a page with an SEO job |
| `scroll-tilted-grid` | DOM images with transforms. Stays crawlable. Best gallery primitive in the arsenal |
| `spotlight-card` | Zero dependencies, stays semantic. The whole card remains one real link |
| `ripple-transition` | WebGL over images. Fine as an upgrade layer above real DOM, never as the only carrier |

If the canvas look is required, the canvas is an `aria-hidden` overlay with `pointer-events: none`
sitting above a real anchor grid. Test by deleting the canvas element in devtools: every item must
still be visible, clickable, and readable.

## Step 7: image crop discipline

One crop ratio everywhere is doctrine tell 3: nothing is featured, so the page has no emphasis.

Vary deliberately and by rule, not by accident:

| Slot | Ratio | Why |
|---|---|---|
| Lead item | 16:9 or 2:1 | Wide reads as cinematic and as "this one" |
| Standard row | 3:2 | The native ratio of most vehicle and product photography, so no crop is invented |
| Detail or accessory | 1:1 | Square reads as catalogue, and tiles without gaps |
| Portrait subject (instructor, garment on body) | 4:5 | Cropping a person to landscape cuts them |

Reserve the box so nothing shifts, and give `sizes` a real value or the browser downloads the
desktop image on a phone:

```tsx
<Image
  src={v.hero} alt={`${v.model} ${v.trim}, ${v.year}, exterior front three-quarter`}
  width={1200} height={800}
  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
  className="aspect-[3/2] w-full object-cover"
  priority={index < 3}
/>
```

Alt text names what is in the frame. "Vehicle image" is not alt text.

## Step 8: empty is three different states

They need three different screens. Collapsing them into one "No results" is the common bug.

| State | Cause | What it must contain |
|---|---|---|
| **Zero results** | Filters are too narrow | Which filter is responsible ("no diesel under 15,000 EUR"), the nearest result and its distance from the query ("the cheapest diesel is 17,400 EUR"), and one control that removes exactly one constraint |
| **Empty set** | The catalog itself has nothing yet | Why, when it changes, and one real alternative (contact, waitlist, the sibling category) |
| **Failure** | The query errored | That it is a fault on this side, whether a retry is safe, and a way through that is not the filter |

```
INCORRECT   "No results found." centered, with an illustration and a "Reset filters" button
            that clears all nine filters at once.
CORRECT     "No diesel automatics under 15,000 EUR. The closest is a 2019 Passat at
            17,400 EUR (2,400 over). [Raise budget to 18,000] [Include manual] [Clear fuel]"
```

The zero-results screen is where a filter set proves whether it was designed. Build it with real
filter combinations, not with a placeholder.

## Step 9: loading is a design surface

Doctrine tell 11: chrome standing in for content. A gray rounded rectangle is chrome.

Steal bklit's approach (`bklit-ui.md` section 3.10): the skeleton has the real geometry, the real
column count, and a plausible domain, so nothing moves when the data lands.

1. **Match the built layout exactly.** Same number of rows visible, same column widths, same image
   ratio. If the skeleton and the result differ, you shipped a layout shift.
2. **Shimmer with seeded stagger**, so it is identical across SSR, hydration, and replay:
   `seed = column * 1009 + row * 9176`, Lehmer RNG, reseeded on replay with `epoch * 524287`.
3. **Budget the stagger as `total - fadeDuration`** so the last cell still lands inside the stated
   window.
4. **Reduced motion kills the shimmer entirely**, leaving a static skeleton. Not a slower shimmer.
5. **Never hover a skeleton.** Gate interaction on the ready phase, not on a boolean.
6. If the request typically resolves under 200ms, render nothing and skip the skeleton. A skeleton
   that flashes is worse than a still frame.

## Checks before this skill is done

- [ ] The structure was chosen from the seven and the reason is written down, not defaulted
- [ ] The 3 to 5 differentiating fields are named, and they are the only fields on the card
- [ ] No `line-clamp` anywhere in the set, and card heights genuinely differ
- [ ] If a density grid is used, `weight()` reads real fields and is in the codebase
- [ ] Every filter, sort, and page is in the URL, survives back, and renders on the server
- [ ] Facet counts exclude their own facet, and zero-count values stay visible
- [ ] The footer is reachable at every scroll position and every page
- [ ] Canvas deleted in devtools: every item is still a real link with real text
- [ ] At least two crop ratios in use, each assigned by rule, `sizes` set on every image
- [ ] Zero-results, empty-set, and failure are three distinct screens with real copy
- [ ] Skeleton geometry matches the result, stagger is seeded, reduced motion kills it
- [ ] Squint test at 10%: the set still has a structure, not a queue of equal rectangles
