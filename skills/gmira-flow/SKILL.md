---
name: gmira-flow
description: "Use when building or fixing any multi-step task surface: checkout, cart, enrollment or application, onboarding, a finance or leasing calculator, a test-drive or viewing booking, a quote request, a contact form with more than three fields, or an account setup wizard. Also use when validation fires on the first keystroke, when an error says \"invalid input\", when the browser back button exits the flow or loses data, when a step opened in a modal for no reason, when a mobile keyboard came up wrong, when autofill did nothing, or when a checkout has an animated background. Covers the six states per field and per step, validation timing, error copy, honest progress, save and resume, input types and autocomplete, and the real amortization math behind a payment calculator."
---

# Flow

Multi-step tasks. The mode is Operate, so almost nothing here is about how it looks.

Load `../gmira/references/DOCTRINE.md` first. Doctrine 2.1: **Persuade and Experience can spend,
Operate and Read cannot.** The effect budget on this surface is near zero and the whole budget goes
to state coverage and input latency.

## The premise

**A checkout with a fluid background is a bug.** Not a taste disagreement, a bug: it burns frame
budget that belongs to input latency, it competes with the only content that matters, and it fails
the one test this surface has, which is whether a distracted person on a phone with one bar of
signal completes the task.

The work here is unglamorous and it is the entire job: six states on every control, validation that
does not attack the visitor mid-word, errors that name the way out, a back button that works, and
arithmetic that is correct to the cent.

## Step 1: the effect budget, spent

| Allowed | Banned on this surface |
|---|---|
| A transition between steps under 200ms, or none | Any full-bleed canvas, shader, or particle background |
| Focus rings, hover, and pressed states | Scroll-driven choreography |
| A skeleton while a real request is in flight | Numbers that count up (`NumberFlow`, animated counters) on a price |
| An inline spinner inside the control doing async work | Parallax, tilt, magnetic buttons, cursor followers |
| `prefers-reduced-motion` killing all of the above | A lens, refraction, or displacement effect anywhere near a field |

A number that animates up while the visitor is reading it is a lie about latency. When a value
recalculates, set it.

## Step 2: six states, per field and per step

Doctrine 3.6 requires all six on every interactive surface. On a flow that means two lists.

**Per field**

| State | What it must be |
|---|---|
| Rest | A real `<label>` above the control. A placeholder is never the label: it vanishes on focus, fails contrast, and disappears from autofilled fields |
| Hover | Border and cursor only. No layout change, ever, or the field moves under the pointer |
| Focus | A visible ring at 3:1 or better against **both** the field and the page background. Never `outline: none` without a replacement |
| Disabled | Only for genuinely inapplicable input, with the reason rendered next to it, not in a tooltip |
| Loading | Async validation (IBAN, VAT number, address lookup, promo code): the control stays editable, the indicator is inside the field, submit is blocked with a named reason |
| Error | Message adjacent to the control, wired with `aria-describedby`, `aria-invalid` set, and never conveyed by color alone |
| Empty | Not the same as invalid. An untouched optional field is empty and fine and must not be red |

**Per step**

| State | What it must be |
|---|---|
| Idle | Reachable at its own URL, restorable from that URL |
| Submitting | The submit control is `aria-busy` with its label changed, the form is inert, and double submission is impossible |
| Error (server) | Names what failed, whether anything was charged or reserved, and whether a retry is safe |
| Success | The next step, or a confirmation carrying the reference number and what happens next with a date |
| Blocked | A prerequisite is missing. Names the prerequisite and links straight to it |
| Expired | A hold, a session, or a quote timed out. Says so before the visitor discovers it by failing |

An expiring hold gets a visible countdown from the moment it starts, not a surprise at submit. If
the slot hold is ten minutes, show the ten minutes.

## Step 3: validation timing

```
INCORRECT   onChange={(e) => setError(validate(e.target.value))}
            The visitor types "t" toward "tom@..." and is told the email is invalid.
            Then "to". Then "tom". They are corrected on every keystroke of every field
            for the entire form, which reads as the form arguing with them.
CORRECT     three triggers, in this order, and no others.
            onBlur    validate, but only if the field was touched and is not empty
            onSubmit  validate everything, then move focus to the first invalid control
            onChange  revalidate ONLY a field that has already errored, so the message
                      clears the instant it is fixed
```

```tsx
const [value, setValue] = useState("");
const [error, setError] = useState<string | null>(null);
const isLive = error !== null;            // errored once, so track it live from now on

<input
  id={id}
  value={value}
  onChange={(e) => { setValue(e.target.value); if (isLive) setError(check(e.target.value)); }}
  onBlur={() => { if (value !== "") setError(check(value)); }}
  aria-invalid={error ? true : undefined}
  aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
/>
{error && <p id={`${id}-err`} role="alert">{error}</p>}
```

Two more rules that belong to timing:

- **Never block a keystroke.** Input masks that reject characters break paste, break autofill, and
  break every non-US phone and IBAN format. Accept anything, normalize on blur, show the normalized
  form.
- **Never validate an empty optional field on blur.** Tabbing through a form must not leave a trail
  of red.

## Step 4: error copy names the problem and the recovery

Doctrine 3.6: errors name the problem **and** the recovery. Two facts, always.

```
INCORRECT   "Invalid input."
            "This field is required."
            "Something went wrong. Please try again."
            "Please enter a valid phone number."
CORRECT     "This card expired in 03/2024. Use another card, or update the expiry above."
            "We need a phone number so the delivery driver can reach you. Mobile or landline."
            "That 11:00 slot was booked 40 seconds ago. The next Saturday slot is 14:30.
             [Take 14:30]"
            "Your bank declined the payment. Nothing was charged. Try another card, or
             choose invoice at the payment step."
```

"Nothing was charged" is the single most valuable sentence in a payment error and it is almost
never there. When money or a reservation is involved, the error must always state what did **not**
happen.

Two more:

- **Errors are in the visitor's words, not the system's.** No field names, no codes, no "validation
  failed on `postal_code`". If you need a reference for support, print it small and separately.
- **On submit, focus moves to the first invalid control** and the page announces the count:
  `role="alert"` with "3 fields need attention". Scrolling without moving focus strands keyboard and
  screen reader users.

## Step 5: progress that is honest about length

```
INCORRECT   a four-segment bar reading 25% on step one, which then adds a conditional
            "verify your identity" step and jumps back to 20%.
CORRECT     name the steps, all of them, from the start.
            "Details -> Delivery -> Payment -> Confirm", the current one marked with
            aria-current="step". A conditional step is listed from the beginning with its
            condition stated: "Identity check (if paying by invoice)".
            No percentage on a flow that can branch.
```

Rules: never show a percentage that can decrease. Never label a step "Almost done" unless it is the
last one. If the number of steps depends on answers, show names, not counts. Steps already completed
are links back; steps ahead are not.

## Step 6: the back button, save, and resume

**Every step is a URL.** `/checkout/delivery`, `/bewerbung/schritt-2`. Not a `useState` index.

- Advance with `router.push`, never `replaceState`. `replaceState` eats the back button, which is the
  most-used control in any flow.
- Back returns to the previous step with every value intact. Persist to `sessionStorage` on blur, not
  on every keystroke, and restore on mount.
- **Never trap the visitor.** No `beforeunload` prompt unless real unsaved work would be destroyed,
  and never on a flow that autosaves.
- Refresh mid-flow returns to the same step with the same data. Test this by hand on every step.

Save and resume, when the flow is longer than about four steps or needs documents:

1. Mint a resume token on first save, put the state behind it server side, and never in the URL
   query string where it lands in logs and referrers.
2. Email the resume link on request, with the expiry stated in the email in the same sentence.
3. Show the expiry on the flow itself: "Saved. This application stays open until 2026-08-08."
4. On resume, land on the first incomplete step, not on step one.
5. On expiry, keep the data recoverable by support for a stated window and say so, rather than
   deleting it silently.

## Step 7: input types, keyboards, and autofill

Getting this table right is worth more to completion rate than anything visual on the page.

| Field | `type` | `inputMode` | `autocomplete` |
|---|---|---|---|
| Given name / family name | text | text | `given-name` / `family-name` |
| Email | email | email | `email` |
| Phone | tel | tel | `tel` |
| Street | text | text | `address-line1` |
| Postcode | text | numeric (DE, US) / text (UK, NL) | `postal-code` |
| City | text | text | `address-level2` |
| Country | select | | `country-name` |
| Card number | text | numeric | `cc-number` |
| Expiry | text | numeric | `cc-exp` |
| Security code | text | numeric | `cc-csc` |
| One-time code | text | numeric | `one-time-code` |
| New password | password | | `new-password` |
| Money, deposit, budget | **text** | decimal | `off` |
| Quantity (a true spinner) | number | numeric | `off` |

**`<input type="number">` is wrong for money.** It drops leading zeros, the scroll wheel silently
changes the value while the visitor scrolls the page, `1.234,56` fails in every comma-decimal locale,
and the spinner arrows are a 12px hit target. Use `type="text" inputMode="decimal"` and parse.

Also: `autocomplete="off"` on an address or payment field is almost always a mistake; browsers
increasingly ignore it and it only ever hurt the visitor. Give every input a stable `name` and `id`,
because autofill matches on those.

## Step 8: no modal for a step

Doctrine, category defaults to refuse: **a modal for a task needing neither interruption nor
protected focus.** A step in a flow is neither. It has a URL, it is bookmarkable, it is shareable
with a colleague who has the card, and it must survive a refresh. A modal has none of those.

Modals remain correct for exactly two things here: a destructive confirmation ("remove the last item
and lose the bundle price"), and a genuinely modal sub-task that must not lose the parent state
(a 3-D Secure challenge, a bank redirect returning inline). Both need protected focus. Nothing else
does.

## Step 9: a finance calculator, worked

The calculator is where a flow either earns trust or loses it, because the visitor can check the
arithmetic against their bank.

### The math

```ts
/** All money in integer cents. Never accumulate floats through an amortization. */
export function monthlyInstalmentCents(input: {
  priceCents: number;
  depositCents: number;
  balloonCents: number;      // final instalment / Schlussrate, 0 for a plain loan
  nominalAnnualPct: number;  // Sollzins, the NOMINAL rate
  termMonths: number;
}): number {
  const { priceCents, depositCents, balloonCents, nominalAnnualPct, termMonths } = input;
  const principal = priceCents - depositCents;
  if (principal <= 0 || termMonths <= 0) return 0;

  const i = nominalAnnualPct / 100 / 12;                    // nominal annual -> monthly
  if (i === 0) return Math.round((principal - balloonCents) / termMonths);

  const discount   = 1 - Math.pow(1 + i, -termMonths);      // annuity factor
  const pvBalloon  = balloonCents * Math.pow(1 + i, -termMonths);
  return Math.round(((principal - pvBalloon) * i) / discount);
}
```

**The rate conversion is the trap.** If the figure you were handed is an **effective** annual rate
(EU: effektiver Jahreszins; UK and US: APR), the monthly rate is not `apr / 12`:

```ts
const i = Math.pow(1 + effectiveAnnualPct / 100, 1 / 12) - 1;
```

At 7.9%, `apr / 12` gives 0.0065833 and the correct conversion gives 0.0063562. Over 48 months on
25,000 EUR that is a difference of roughly 2.60 EUR per month, and the visitor comparing against the
lender's own quote will find it. Label which rate the input is, in the input's own label.

### Rounding and totals

1. Compute in **integer cents** end to end.
2. Round the instalment **once**, at the end.
3. Derive the total from the **rounded** instalment, because that is what the contract charges:
   `total = monthly * (termMonths - 1) + finalInstalment + deposit + balloon`. Deriving it from the
   unrounded figure produces a total that does not equal the sum of the rows, and someone will add
   up the rows.
4. Absorb the rounding remainder in the **last** instalment and say so in one line.
5. Never display more precision than the lender guarantees.

### Display

```tsx
const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

<output htmlFor="deposit term rate" className="block font-mono text-4xl tabular-nums">
  {eur.format(monthlyCents / 100)}
  <span className="text-base text-muted-foreground"> / month</span>
</output>

<dl className="mt-4 text-sm [&_dd]:tabular-nums [&_dd]:text-right">
  <div><dt>Amount financed</dt><dd>{eur.format(principalCents / 100)}</dd></div>
  <div><dt>47 instalments of</dt><dd>{eur.format(monthlyCents / 100)}</dd></div>
  <div><dt>Final instalment</dt><dd>{eur.format(finalCents / 100)}</dd></div>
  <div><dt>Total payable</dt><dd>{eur.format(totalCents / 100)}</dd></div>
</dl>

<p className="mt-3 text-xs">
  Illustrative. 48 months, 3.90% Sollzins, 4.12% effektiver Jahreszins, {eur.format(9500)} deposit,
  {eur.format(11200)} final instalment, 15,000 km per year. Calculated 2026-07-25.
  Not an offer. Subject to credit approval.
</p>
```

- **`tabular-nums` on the recalculating figure is functional.** Without it the digit widths change as
  the value changes and the whole block jitters on every drag of the term slider.
- **`<output htmlFor>`** names the inputs the value derives from, so assistive technology connects
  them. Announce changes with `aria-live="polite"` on the output, not on the whole panel.
- **The assumptions line is mandatory** and lists every one, including the ones the visitor did not
  set. An illustrative figure with hidden assumptions is an invented metric under G7.
- **The controls are typed and paste-able.** `scrub-input` is a good deposit and term control
  (zero dependencies, on the doctrine's underused list, repair its `cn` import first per
  `gmira-arsenal`), but it must be paired with a real text input. Someone with an exact 9,500 EUR
  deposit will not drag to it.
- Recalculate on `input`, not on `change`, so the figure tracks the drag. No debounce over about
  50ms, and no animation on the number.

## Checks before this skill is done

- [ ] No canvas, shader, parallax, or animated counter anywhere in the flow
- [ ] Every field has a real `<label>`; no placeholder is doing a label's job
- [ ] All six field states and all six step states exist and were exercised by hand
- [ ] Nothing validates on the first keystroke; blur, submit, and post-error change are the triggers
- [ ] Every error names the problem and the recovery, and payment errors say what was not charged
- [ ] Submit moves focus to the first invalid control and announces the count
- [ ] Progress shows named steps; no percentage on a branching flow; nothing can decrease
- [ ] Each step has its own URL, back works, refresh restores, and no `replaceState` on advance
- [ ] `type`, `inputMode`, and `autocomplete` set per the table; no `type="number"` on money
- [ ] No step is in a modal; modals only for destructive confirmation or a protected sub-task
- [ ] All money is integer cents, rounded once, totals derived from the rounded instalment
- [ ] The rate input states whether it is nominal or effective, and the conversion matches
- [ ] The assumptions line lists every assumption and carries the calculation date
- [ ] `tabular-nums` on every figure that recalculates
- [ ] Completed on a throttled 3G phone profile, one-handed, without opening devtools
