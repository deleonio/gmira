"use client";

import { useEffect, useRef, useState } from "react";
import {
  DYES,
  SHOP,
  eur,
  isBuyable,
  variantOf,
  variantState,
  vatContained,
  type DyeId,
  type Product,
  type Variant,
} from "../../data";
import { DyeBand, FOCUS, Fastness, HangHole, StockLine } from "../../ui";

/*
  Three different things, and this panel keeps them apart on purpose.

  1. disabled        the real HTML attribute, on an option for a combination that was never
                     made. It leaves the tab order because there is nothing behind it: no date,
                     no list, no price. The reason is printed under the axis, not in a tooltip.

  2. aria-disabled   on the add control, when the chosen cell is sold out. The control is there,
                     it is focusable, it announces as unavailable, and pressing it produces a
                     named reason rather than nothing. That is the whole point of the attribute
                     and it is the only place it belongs here.

  3. out of stock    a data state, not a control state. A sold out option is NOT aria-disabled,
                     because it is genuinely operable: selecting it is how the restock date and
                     the notify control appear. It carries "sold out" inside its own label, so
                     the accessible name says so. And available === 0 with a next lot behind it
                     is fully buyable, with the ship date printed on the button.

  Marking a control aria-disabled while it still acts is the common version of this bug: every
  tool that respects the attribute, Playwright included, will refuse to operate it.

  Nothing here animates except a 150ms colour change on the dye band, which is tied to the
  control that caused it. Mode is Operate.
*/

type Status = "idle" | "adding" | "added" | "error";

export function Buy({
  product,
  initialDye,
  initialSize,
  deliveryBySize,
  zoneNote,
}: {
  product: Product;
  initialDye: DyeId;
  initialSize: string;
  deliveryBySize: Record<string, string>;
  zoneNote: string;
}) {
  const [dye, setDye] = useState<DyeId>(initialDye);
  const [size, setSize] = useState<string>(initialSize);
  const [status, setStatus] = useState<Status>("idle");
  const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const dyes = product.variants
    .map((v) => v.dye)
    .filter((d, i, a) => a.indexOf(d) === i);

  const selected = variantOf(product, dye, size);
  const state = selected ? variantState(selected) : null;
  const priceCents = selected?.price?.cents ?? product.price.cents;
  const sizeSpec = product.sizes.find((s) => s.name === size) ?? product.sizes[0];

  /** Variant selection has to move the URL with everything else, or the page cannot be shared
      or reloaded onto the thing the visitor was actually looking at. replaceState rather than
      push, so forty swatch clicks do not bury the back button. */
  function sync(nextDye: DyeId, nextSize: string) {
    const url = `${window.location.pathname}?colour=${nextDye}&size=${encodeURIComponent(nextSize)}`;
    window.history.replaceState(null, "", url);
  }

  function pick(nextDye: DyeId, nextSize: string) {
    setDye(nextDye);
    setSize(nextSize);
    setStatus("idle");
    sync(nextDye, nextSize);
  }

  function add() {
    if (busy.current || !selected || !isBuyable(selected)) return;
    busy.current = true;
    setStatus("adding");
    timer.current = setTimeout(() => {
      busy.current = false;
      // The last cloth of a lot is the case that goes wrong in a real shop: two people reach
      // for it inside the same minute. It is wired to fail here so the error state can be read
      // without opening devtools.
      setStatus(selected.inventory.available === 1 ? "error" : "added");
    }, 550);
  }

  const optionBtn =
    "border px-3 py-2 text-left font-[family-name:var(--font-spec)] text-[12.5px] tabular-nums transition-colors disabled:cursor-not-allowed";

  function optionClass(v: Variant | undefined, on: boolean) {
    if (!v || !v.madeInThisCombination) {
      return `${optionBtn} border-[var(--rule)] text-[var(--ink-3)] line-through decoration-[var(--rule)]`;
    }
    const s = variantState(v);
    if (s.kind === "sold_out") {
      return `${optionBtn} border-dashed border-[var(--rule)] text-[var(--ink-3)] ${
        on ? "bg-[var(--stock-2)] text-[var(--ink)]" : ""
      }`;
    }
    return `${optionBtn} ${
      on
        ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--stock)]"
        : "border-[var(--ink-3)] text-[var(--ink)] hover:bg-[var(--stock-2)]"
    }`;
  }

  const notMadeNotes = [
    ...product.variants
      .filter((v) => !v.madeInThisCombination && (v.dye === dye || v.size === size))
      .map((v) => `${DYES[v.dye].name} in ${v.size}: ${v.notMadeReason ?? ""}`),
  ];

  return (
    <div className="relative bg-[var(--stock)] pt-7 shadow-[0_8px_14px_-10px_rgba(30,26,17,0.55)]">
      {/* Off the rail and in your hand, so the hole is punched but there is no wire in it. */}
      <HangHole left={32} top={8} />
      <DyeBand
        dye={dye}
        transition
        right={`Lot ${selected?.dyeLot ?? "closed"} / vatted ${selected?.vattedOn ?? "not vatted"}`}
      />

      <div className="px-5 py-6 sm:px-7">
        {/* price and identity move together with the variant, never the swatch alone */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="font-[family-name:var(--font-spec)] text-[clamp(1.5rem,3vw,2rem)] font-medium tabular-nums">
            {eur(priceCents)}
          </p>
          <p className="font-[family-name:var(--font-spec)] text-[11.5px] tabular-nums text-[var(--ink-2)]">
            includes {eur(vatContained(priceCents, product.price.taxRatePercent))} MwSt. at{" "}
            {product.price.taxRatePercent} percent
          </p>
        </div>
        <p className="mt-1 font-[family-name:var(--font-spec)] text-[12px] tabular-nums text-[var(--ink-3)]">
          {selected ? selected.sku : "no such combination"} / {sizeSpec.finishedCm.width} x{" "}
          {sizeSpec.finishedCm.length} cm / {sizeSpec.packedWeightG} g packed
        </p>

        {/* colour axis */}
        <fieldset className="mt-6 border-t border-[var(--rule)] pt-4">
          <legend className="sr-only">Dye, shown for size {size}</legend>
          <p
            aria-hidden
            className="mb-2 font-[family-name:var(--font-spec)] text-[11.5px] tracking-[0.06em] text-[var(--ink-2)]"
          >
            Dye, in {size} cm
          </p>
          <div className="grid grid-cols-2 gap-2">
            {dyes.map((d) => {
              const v = variantOf(product, d, size);
              const s = v ? variantState(v) : null;
              const made = !!v?.madeInThisCombination;
              const soldOut = s?.kind === "sold_out";
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => pick(d, size)}
                  disabled={!made}
                  aria-describedby={soldOut ? "stock-line" : undefined}
                  aria-pressed={dye === d}
                  className={`${optionClass(v, dye === d)} ${FOCUS}`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="inline-block h-3.5 w-3.5 shrink-0 border border-[var(--rule)]"
                      style={{ background: `var(${DYES[d].cssVar})` }}
                    />
                    {DYES[d].name}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-tight">
                    {!made
                      ? "not made"
                      : soldOut
                        ? "sold out"
                        : s?.kind === "backorder"
                          ? "next lot"
                          : `${v?.inventory.available} left`}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* size axis */}
        <fieldset className="mt-5">
          <legend className="sr-only">
            Size, shown for {DYES[dye].name.toLowerCase()}
          </legend>
          <p
            aria-hidden
            className="mb-2 font-[family-name:var(--font-spec)] text-[11.5px] tracking-[0.06em] text-[var(--ink-2)]"
          >
            Size in cm, in {DYES[dye].name.toLowerCase()}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {product.sizes.map((s) => {
              const v = variantOf(product, dye, s.name);
              const st = v ? variantState(v) : null;
              const made = !!v?.madeInThisCombination;
              const soldOut = st?.kind === "sold_out";
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => pick(dye, s.name)}
                  disabled={!made}
                  aria-describedby={soldOut ? "stock-line" : undefined}
                  aria-pressed={size === s.name}
                  className={`${optionClass(v, size === s.name)} ${FOCUS}`}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span>
                      {s.finishedCm.width} x {s.finishedCm.length}
                    </span>
                    <span className="text-[11px]">{s.label}</span>
                    <span>{eur(v?.price?.cents ?? s.priceCents)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {notMadeNotes.length > 0 ? (
          <ul className="mt-3">
            {notMadeNotes.map((n) => (
              <li
                key={n}
                className="max-w-[34em] pt-2 text-[13px] leading-snug text-[var(--ink-2)]"
              >
                <span className="font-[family-name:var(--font-spec)] text-[11.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
                  Not made.{" "}
                </span>
                {n}
              </li>
            ))}
          </ul>
        ) : null}

        {/* what is true about the selected cell */}
        <div id="stock-line" className="mt-5 border-t border-[var(--rule)] pt-4">
          {state ? <StockLine state={state} /> : null}
          {state?.kind === "sold_out" && state.note ? (
            <p className="mt-2 max-w-[34em] text-[13.5px] leading-snug text-[var(--ink-2)]">
              {state.note}
            </p>
          ) : null}
          {state?.kind === "backorder" ? (
            <p className="mt-2 max-w-[34em] text-[13.5px] leading-snug text-[var(--ink-2)]">
              You can order it now. It is cut from lot 27 and the money is taken when it ships,
              not today.
            </p>
          ) : null}
          <p className="mt-2 font-[family-name:var(--font-spec)] text-[12px] tabular-nums text-[var(--ink-2)]">
            {deliveryBySize[size]} / {zoneNote}
          </p>
          <p className="mt-1 font-[family-name:var(--font-spec)] text-[12px] text-[var(--ink-2)]">
            {sizeSpec.shippingClass}
          </p>
        </div>

        {/* the control */}
        <div className="mt-5">
          {selected && isBuyable(selected) ? (
            <button
              type="button"
              onClick={add}
              aria-busy={status === "adding" ? true : undefined}
              aria-disabled={status === "adding" ? true : undefined}
              className={`w-full border border-[var(--ink)] bg-[var(--ink)] px-5 py-3 font-[family-name:var(--font-spec)] text-[13px] uppercase tracking-[0.12em] text-[var(--stock)] transition-colors hover:bg-[var(--ink-2)] ${FOCUS}`}
            >
              {status === "adding"
                ? "Putting it in the bag"
                : variantState(selected).kind === "backorder"
                  ? "Order from lot 27"
                  : "Put it in the bag"}
            </button>
          ) : (
            <div>
              <button
                type="button"
                aria-disabled="true"
                onClick={() => setStatus("idle")}
                className={`w-full border border-[var(--rule)] px-5 py-3 font-[family-name:var(--font-spec)] text-[13px] uppercase tracking-[0.12em] text-[var(--ink-3)] ${FOCUS}`}
              >
                Cannot go in the bag
              </button>
              <p className="mt-2 max-w-[34em] text-[13.5px] leading-snug text-[var(--ink-2)]">
                {selected && !selected.madeInThisCombination
                  ? "This combination is not made, so there is nothing to reserve. Pick another dye or another size above."
                  : "This one is sold out. Nothing was charged and nothing is held."}
              </p>
              {selected && selected.madeInThisCombination ? (
                <button
                  type="button"
                  onClick={() => setStatus("added")}
                  className={`mt-3 border border-[var(--ink)] px-4 py-2 font-[family-name:var(--font-spec)] text-[12px] uppercase tracking-[0.12em] transition-colors hover:bg-[var(--ink)] hover:text-[var(--stock)] ${FOCUS}`}
                >
                  One message when it is back
                </button>
              ) : null}
            </div>
          )}

          <div aria-live="polite" className="mt-3">
            {status === "added" ? (
              <p className="font-[family-name:var(--font-spec)] text-[12.5px] text-[var(--woad)]">
                Done. Held for {SHOP.holdMinutes} minutes while you look at the rest of the rack.
              </p>
            ) : null}
          </div>

          {status === "error" ? (
            <p
              role="alert"
              className="mt-3 max-w-[34em] border-t-2 border-[var(--madder)] pt-2 text-[13.5px] leading-snug text-[var(--ink)]"
            >
              <span className="font-[family-name:var(--font-spec)] text-[11.5px] uppercase tracking-[0.1em] text-[var(--madder)]">
                Taken.{" "}
              </span>
              That was the last one in this lot and someone reached it 40 seconds before you.
              Nothing was charged and nothing is held. Lot 27 goes in the vat on 2026-09-09 and
              this size is in it, or pick another dye above.
            </p>
          ) : null}
        </div>

        {/* the fastness figures for the dye that is actually selected */}
        <div className="mt-6 flex flex-col gap-1.5 border-t border-[var(--rule)] pt-4">
          <Fastness dye={dye} grade={DYES[dye].lightfastness} label="Lightfastness" />
          <Fastness dye={dye} grade={DYES[dye].washfastness} max={5} label="Wash fastness" />
          <p className="mt-1 max-w-[34em] text-[13.5px] leading-snug text-[var(--ink-2)]">
            {DYES[dye].note}
          </p>
        </div>
      </div>
    </div>
  );
}
