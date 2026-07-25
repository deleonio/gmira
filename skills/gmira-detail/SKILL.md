---
name: gmira-detail
description: Use when building or fixing a page about one single thing in depth: a product detail page (PDP), a vehicle or listing detail page, a course or module page, a cohort page, an instructor or team-member profile, a property page, or a case study. Also use when specs are a flat list of label/value divs, when numbers do not align in columns, when an out-of-stock size is a dead disabled button, when the gallery is a canvas so the images are not indexable, when the sticky buy rail overruns the viewport, or when the mobile page is the desktop page in one column. Covers the per-vertical content model, readable spec tables, variant and configuration state, galleries, sticky rails, verifiable trust content, related items, and mobile ordering.
---

# Detail

One thing, in depth. The page where a decision is actually made.

Load `../gmira/references/DOCTRINE.md` first. Mode is usually Operate with a Persuade opening,
so the effect budget is small and the budget goes to the content model instead.

## The premise

A detail page is a **content model problem wearing a layout costume.** Almost every bad PDP is bad
because the fields are wrong, not because the grid is wrong. "Features", "Highlights", and
"Description" are placeholders for a model nobody built. The visitor arrived with three specific
questions and the page answers none of them because nobody wrote down what they were.

Get the fields right and the layout follows. Get the fields wrong and no amount of craft repairs it.

## Step 1: the real content model, per vertical

These are fields, not sections. Every one is a column in a database or a fact someone can check.

| Vertical | The model that actually decides |
|---|---|
| **Used vehicle** | `vin`, `first_registration` (month and year), `mileage_km` with the reading date, `gearbox`, `drivetrain`, `fuel`, `power_kw` and `power_ps`, `owners_count`, `service_history` (complete / partial / none, with stamp dates), `hu_valid_until` (MOT/TUV), `accident_declared`, `warranty_months_remaining` and who underwrites it, `tyre_season` and tread depth, `co2_g_km` and `efficiency_class`, `equipment_codes`, `keys_count`, `location` and delivery cost |
| **Physical product** | `sku`, materials with percentages, dimensions per variant, weight, country of manufacture, care instructions, `warranty_months`, stock per variant with a real number, restock date if known, shipping cost and delivery window to the visitor's country, return window and who pays the return |
| **Course or cohort** | Contact hours split live vs self-paced, cohort dates and time zone, `seats_cap` and seats taken, prerequisites stated as things you must already be able to do, tools installed and versions, assessment method, the artifact the student leaves with, refund window, funding eligibility (for DE: Bildungsgutschein, AZAV certification number), instructor per module, class size in previous cohorts |
| **Instructor or team member** | What they shipped, where, and when, each with a link that resolves; years in the specific practice, not "in tech"; what they teach and what they do not; public artifacts (repo, talk, paper, patent, portfolio) |

**Never write "features".** If a field is worth showing it has a name, a unit, and a source. If it
does not, it is copy, and copy belongs in one honest paragraph, not in a bulleted list of six.

Anything on this page that cannot be verified is governed by G7 and belongs to `gmira-proof`.

## Step 2: spec tables that are readable

```
INCORRECT   <div className="flex justify-between border-b py-2">
              <span>Mileage</span><span>84,300 km</span>
            </div>
            repeated 22 times in one flat list. Proportional numerals, so nothing aligns.
            Unit glued to each value, so the eye re-reads it 22 times. No grouping, so the
            engine facts and the paperwork facts are interleaved. Not a table, so a screen
            reader hears 44 unrelated strings.
CORRECT     a real <table>, one <tbody> per system with a group heading, unit in the column
            header, values right-aligned with tabular-nums, and a delta column against a
            named baseline where one exists.
```

```tsx
<table className="w-full text-sm [&_td]:tabular-nums">
  <caption className="sr-only">Technical data, 2021 Passat Variant 2.0 TDI</caption>
  <colgroup><col /><col className="w-28" /><col className="w-32" /></colgroup>
  <thead>
    <tr>
      <th scope="col">Specification</th>
      <th scope="col" className="text-right">This car</th>
      <th scope="col" className="text-right">Segment median</th>
    </tr>
  </thead>

  <tbody>
    <tr><th scope="colgroup" colSpan={3} className="pt-6 text-xs uppercase tracking-wide">Engine and drive</th></tr>
    <tr>
      <th scope="row" className="font-normal">Power <span className="text-muted-foreground">kW / PS</span></th>
      <td className="text-right">110 / 150</td>
      <td className="text-right text-muted-foreground">110 / 150</td>
    </tr>
    <tr>
      <th scope="row" className="font-normal">Consumption, combined <span className="text-muted-foreground">l/100 km</span></th>
      <td className="text-right">4.9</td>
      <td className="text-right text-muted-foreground">5.4 <span className="text-emerald-600">-0.5</span></td>
    </tr>
  </tbody>

  <tbody>
    <tr><th scope="colgroup" colSpan={3} className="pt-6 text-xs uppercase tracking-wide">History and paperwork</th></tr>
    <tr>
      <th scope="row" className="font-normal">Owners</th>
      <td className="text-right">1</td>
      <td className="text-right text-muted-foreground">2</td>
    </tr>
  </tbody>
</table>
```

Six rules the markup above encodes:

1. **`font-variant-numeric: tabular-nums`** on every numeric cell. Without it 1 is narrower than 8,
   the column edge wobbles, and the table stops being scannable.
2. **Unit in the header or in a muted span in the row header**, never repeated on every value. The
   value column then holds only digits and aligns cleanly.
3. **`<th scope="row">` and `<th scope="colgroup">`.** A screen reader announces "Owners, 1" instead
   of "Owners" then, forty rows later, "1".
4. **Group by system**, one `<tbody>` each. Four groups of six beat one list of 24.
5. **Compare against a stated baseline** where one honestly exists (segment median, the previous
   model year, the trim below). State the baseline's source and date, or omit the column entirely.
   A delta with no denominator is an invented metric and G7 kills it.
6. **Mono carries metadata only** (doctrine 3.1): VIN, part numbers, measurements. Mono as a costume
   for "technical" is banned.

On mobile a three-column comparison does not fit. Drop the baseline column below 640px rather than
scrolling horizontally, or ship one `overflow-x: auto` wrapper with a visible edge fade so the
scroll is discoverable.

## Step 3: variant and configuration state

### The disabled-versus-unavailable bug

```
INCORRECT   <button disabled={!v.inStock}>XL</button>
            The size leaves the tab order, so a keyboard user never learns it exists.
            The accessible name does not change, so a screen reader announces "XL, dimmed"
            with no reason. There is no path from here to buying an XL, ever.
CORRECT     unavailable is a state with content, not an absence. The control stays focusable,
            announces why, and offers the recovery.
```

```tsx
<button
  type="button"
  aria-disabled={!v.inStock || undefined}
  aria-describedby={!v.inStock ? `${v.id}-why` : undefined}
  data-selected={selected === v.id || undefined}
  onClick={() => (v.inStock ? select(v.id) : openRestockNotice(v.id))}
  className="data-[selected]:ring-2 aria-disabled:opacity-60 aria-disabled:[--strike:1]"
>
  {v.label}
  {!v.inStock && <span id={`${v.id}-why`} className="sr-only">
    Out of stock. Restocks {v.restockDate}. Opens a notify form.
  </span>}
</button>
```

Three distinct states, three treatments:

| State | Attribute | Focusable | What it must say |
|---|---|---|---|
| Available | none | yes | the label |
| **Unavailable** (exists, not stockable now) | `aria-disabled="true"` | **yes** | why, when it returns, and the recovery (notify, nearest size, backorder) |
| **Inapplicable** (does not exist in this configuration) | `disabled` | no | nothing, and it should ideally not be rendered at all |

The rule: `disabled` is for controls that are meaningless in the current configuration. Everything a
visitor might want and cannot have right now is `aria-disabled`, because it needs to carry a
sentence.

### Configuration lives in the URL

```tsx
const [config, setConfig] = useQueryStates({
  color: parseAsString.withDefault(product.defaultColor),
  size:  parseAsString,
  trim:  parseAsString,
}, { history: "push", shallow: false, clearOnDefault: true });
```

A configured item must be a shareable link, must survive back, and must restore on return. Update
the visible price, the stock line, the gallery, and the JSON-LD `offers` block together on change,
in one commit, so no intermediate frame shows the old price with the new color.

`ripple-transition` (`@componentry`, framer-motion only, no three.js) is the right variant-switch
transition: the ripple originates at the tap point. It sits **over** the real `<img>` elements and
is deleted under reduced motion. It is never the element that holds the image.

## Step 4: the gallery, without a canvas

The images are the product. They must stay real DOM: linkable, indexable, zoomable, right-clickable,
and present when JavaScript fails.

```tsx
<ul className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-fade-effect-x">
  {photos.map((p, i) => (
    <li key={p.id} className="snap-start shrink-0 basis-[86%] md:basis-[48%]">
      <a href={p.full} aria-label={`Open large: ${p.caption}`}>
        <Image src={p.src} alt={p.caption} width={1600} height={1067}
          sizes="(min-width: 768px) 48vw, 86vw"
          priority={i === 0} fetchPriority={i === 0 ? "high" : "auto"}
          loading={i === 0 ? "eager" : "lazy"}
          className="aspect-[3/2] w-full object-cover" />
      </a>
    </li>
  ))}
</ul>
```

- **Alt text names the frame**, not the product: "rear three-quarter, driver side, showing the
  20 inch alloys", "sole tread after 40 km". The caption is where the honest defect goes: a listing
  photo that shows the dent is worth more than three that hide it.
- **First image eager and `fetchPriority="high"`**, everything else lazy. The first gallery image is
  frequently the LCP element.
- **Reserve the ratio** on every image or the page reflows as they arrive.
- Scroll-snap plus an edge fade beats a carousel with arrows: it works with a trackpad, a thumb, a
  keyboard, and a screen reader, with no library.
- Never `infinite-image-field` or any canvas gallery here. Doctrine 6.2: canvas images are pixels,
  not products.

## Step 5: the sticky rail, and when it must not stick

Sticky is right when the page is long, the decision is single, and the rail is short.

**Do not stick when any of these is true:**

- The rail is taller than the viewport at any breakpoint. It then scrolls internally, traps the
  wheel, and hides its own primary button.
- On mobile. Replace it with a bottom bar carrying **one** action and the price, appearing only
  after the hero leaves the viewport, and with `padding-bottom: env(safe-area-inset-bottom)`.
- The page contains a second decision (configure, then book a viewing). Two sticky calls to action
  compete and both lose.
- The rail contains anything that must be read carefully. Sticky is for acting, not for reading.

```css
.buy-rail { position: sticky; top: calc(var(--header-height) + 1rem); align-self: start;
            max-height: calc(100svh - var(--header-height) - 2rem); }
@media (max-height: 40rem) { .buy-rail { position: static; } }
```

`svh` not `vh`, or the mobile browser chrome cuts the button. `align-self: start` or the grid item
stretches and sticky silently does nothing.

## Step 6: trust content that is real

G7: zero invented metrics, testimonials, logos, or client names. On a detail page the specific
temptations are the review score, the "12 people are viewing this", and the countdown.

| Verifiable, so it may ship | Invented, so it may not |
|---|---|
| The HU/MOT expiry date from the certificate | "Fully inspected" with no checklist |
| The inspection checklist, itemized, with the inspector's name and date | A generic quality badge |
| Stock queried live from the system, with the number | "Only a few left" |
| Reviews pulled from a named platform, linked, with the count and the date range | A star row with no source |
| The warranty terms in full, including what voids it | "Peace of mind guaranteed" |
| A countdown to a real deadline (cohort start, auction close) | A countdown that resets on reload |

Anything illustrative may ship **labeled as illustrative**, in the same visual group as the number,
at readable size. Details in `gmira-proof`.

## Step 7: any data figure uses bklit technique

If the page carries a chart (price against segment over 24 months, running cost, a cohort outcome
curve), install `@bklit/line-chart` rather than hand-rolling, and follow the library's own rules.

```tsx
<LineChart data={priceHistory} xDataKey="month" status={pending ? "loading" : "ready"} aspectRatio={2.4}>
  <Grid horizontal numTicksRows={4} />
  <XAxis /><YAxis />
  <Line dataKey="asking_eur"        stroke="var(--chart-1)" />
  <Line dataKey="segment_median_eur" stroke="var(--chart-3)" />
  <ChartTooltip />
</LineChart>
<p className="text-xs text-muted-foreground">
  Asking price against the segment median, 24 months. Source: internal listing archive,
  n = 412 comparable listings. Computed 2026-07-01.
</p>
```

Five rules carried over from `bklit-ui.md`:

1. **`status` is a lifecycle, not a boolean.** Loading is a designed state with a domain tween into
   the real data, so the grid does not snap when the numbers land.
2. **Reveal by animating a `clipPath` rect width**, never `scaleX`, which reveals from the center
   and reads as a zoom rather than as time passing.
3. **All color through tokens** (`--chart-1..5` categorical, `--chart-scale-01..05` sequential,
   the host's `--border` for gridlines). Never a hex in the JSX, never `dark:` on an SVG element.
4. **`tabular-nums` in the tooltip and in every axis label.**
5. **Under about 5 data points, print the numbers.** A three-point sparkline is doctrine tell 11,
   chrome standing in for content.

The caption naming source, sample size, and computation date is not optional. A chart with no
denominator is an invented metric with axes.

## Step 8: related items that are actually related

```
INCORRECT   four random items from the same category, or the four most recently added,
            labelled "You may also like".
CORRECT     a stated relation, in the heading, computed from real fields.
            "Same body style, within 3,000 EUR"       -> the visitor's real alternative set
            "The same car with the larger engine"     -> the trade-up
            "Also taught by Mira Kessler"             -> the reason they are on this page
            "Bought together in 31 of 44 orders"      -> real, with its denominator
```

Two to four items, each with the differing field emphasized against this one. If nothing genuinely
related exists, omit the section. An empty relation filled with filler is worse than a shorter page.

## Step 9: mobile order differs because the decision sequence differs

On desktop the visitor scans the gallery, then the rail. On mobile there is no rail, and the
sequence is: is this the right thing, what does it cost, can I act, then show me everything.

Keep **one DOM order**, the mobile one, which is also the correct reading order for a screen reader.
Re-place with grid areas on desktop instead of reordering markup.

```css
.detail {
  display: grid; gap: 1.5rem;
  grid-template-areas: "id" "price" "hero" "cta" "gallery" "specs" "history" "related";
}
@media (min-width: 64rem) {
  .detail {
    grid-template-columns: minmax(0, 1fr) 22.5rem;
    grid-template-areas:
      "hero    id"
      "hero    price"
      "gallery cta"
      "specs   cta"
      "history cta"
      "related related";
  }
}
```

The caveat that makes this honest: **grid placement moves things visually and does not move the tab
order.** Tab through the desktop layout and confirm the sequence still makes sense. If it does not,
the regions are too interleaved; split them into fewer, larger blocks rather than reordering markup
and breaking the mobile reading order.

## Checks before this skill is done

- [ ] Every field on the page comes from the vertical's real model and has a name, a unit, and a source
- [ ] The word "features" appears nowhere
- [ ] Specs are a real `<table>` with `scope`, grouped `<tbody>`, unit in the header, `tabular-nums`
- [ ] Any comparison column names its baseline, its sample size, and its date
- [ ] Unavailable variants are `aria-disabled`, focusable, and carry the reason plus a recovery
- [ ] `disabled` is used only for genuinely inapplicable controls
- [ ] Configuration is in the URL, survives back, and updates price, stock, gallery, and JSON-LD together
- [ ] Gallery deleted of all JavaScript: images still render, are still links, still have alt text
- [ ] First gallery image is eager with `fetchPriority="high"`, the rest lazy, every ratio reserved
- [ ] The sticky rail is shorter than the viewport at every breakpoint, or it does not stick
- [ ] Mobile has one bottom bar with one action, respecting the safe-area inset
- [ ] Every trust element on the page is verifiable, or labeled illustrative in the same visual group
- [ ] Any chart uses bklit tokens, a real `status` lifecycle, clip reveal, and a source caption
- [ ] The related heading states the relation and the relation is computed from fields
- [ ] Tab order on desktop was walked by hand after grid re-placement
