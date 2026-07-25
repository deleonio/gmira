import Link from "next/link";
import {
  DYES,
  DYE_ORDER,
  PRODUCTS,
  SHOP,
  dyesOf,
  eur,
  priceRange,
  stockSummary,
  variantState,
  type DyeId,
  type Product,
} from "./data";
import { DyeBand, FOCUS, Fastness, HangHole, Rail, StockLine } from "./ui";

function LotStamp({ text }: { text: string }) {
  return (
    <span className="font-[family-name:var(--font-spec)] text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
      {text}
    </span>
  );
}

/* ---------------------------------------------------------------- rail A */

function LeadPacket({ p, dye }: { p: Product; dye: DyeId }) {
  const range = priceRange(p);
  const sum = stockSummary(p);
  const body = p.materials[0];
  return (
    <article className="relative mt-5 bg-[var(--stock)] pt-7 shadow-[0_8px_14px_-10px_rgba(30,26,17,0.55)]">
      <HangHole left={34} wire={20} />
      <DyeBand dye={dye} right={`${DYES[dye].botanical} / lot ${p.variants.find((v) => v.dye === dye)?.dyeLot ?? "24"}`} />

      <div className="grid gap-x-10 gap-y-7 px-5 pb-7 pt-8 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        {/* front of the packet */}
        <div>
          <h3 className="font-[family-name:var(--font-packet)] text-[clamp(2rem,4.4vw,3.1rem)] font-bold leading-[0.98] tracking-[-0.02em]">
            <Link
              href={`/proof/shop/packet/${p.handle}`}
              className={`decoration-[var(--rule)] underline-offset-[6px] hover:underline ${FOCUS}`}
            >
              {p.title}
            </Link>
          </h3>
          <p className="mt-1 font-[family-name:var(--font-spec)] text-[13px] text-[var(--ink-3)]">
            {p.gloss} / {p.productType} / handle {p.handle}
          </p>
          <p className="mt-4 max-w-[34em] text-[15.5px] leading-relaxed text-[var(--ink-2)]">
            {p.subtitle}
          </p>

          <dl className="mt-6 border-t border-[var(--rule)]">
            {p.sizes.map((s) => {
              const cells = p.variants.filter((v) => v.size === s.name);
              const onRack = cells
                .filter((v) => v.madeInThisCombination)
                .reduce((n, v) => n + Math.max(0, v.inventory.available), 0);
              return (
                <div
                  key={s.name}
                  className="grid grid-cols-[1fr_auto_auto] items-baseline gap-x-4 border-b border-[var(--rule)] py-2"
                >
                  <dt className="font-[family-name:var(--font-spec)] text-[13px] tabular-nums">
                    {s.finishedCm.width} x {s.finishedCm.length} cm
                    <span className="ml-2 text-[var(--ink-3)]">{s.label}</span>
                  </dt>
                  <dd className="font-[family-name:var(--font-spec)] text-[12px] tabular-nums text-[var(--ink-3)]">
                    {onRack} on rack
                  </dd>
                  <dd className="font-[family-name:var(--font-spec)] text-[14px] font-medium tabular-nums">
                    {eur(s.priceCents)}
                  </dd>
                </div>
              );
            })}
          </dl>

          <p className="mt-4 max-w-[36em] font-[family-name:var(--font-spec)] text-[12px] tabular-nums text-[var(--ink-2)]">
            {sum.madeCells} of {sum.cells} colour and size combinations are made. {sum.onRack}{" "}
            cloths on the rack. Prices include 19 percent MwSt.
          </p>

          <Link
            href={`/proof/shop/packet/${p.handle}`}
            className={`mt-6 inline-block border border-[var(--ink)] px-5 py-2.5 font-[family-name:var(--font-spec)] text-[12px] uppercase tracking-[0.12em] transition-colors hover:bg-[var(--ink)] hover:text-[var(--stock)] ${FOCUS}`}
          >
            Turn the packet over
          </Link>
        </div>

        {/* the reverse, printed small and dense */}
        <div className="border-t border-[var(--rule)] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h4 className="font-[family-name:var(--font-spec)] text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
            Reverse
          </h4>
          <dl className="mt-3 font-[family-name:var(--font-spec)] text-[12.5px]">
            {[
              ["Composition", body.composition.map((c) => `${c.percent} percent ${c.fibre}`).join(", ")],
              ["Weight", body.weight ? `${body.weight.value} ${body.weight.unit}` : "not stated"],
              ["Mill", body.mill ?? "not stated"],
              ["Loom width", p.loomWidthCm ? `${p.loomWidthCm} cm` : "not stated"],
              ["Woven and dyed", `${p.factory.name}, ${p.factory.city}, ${p.factory.workers} people`],
              ["Certifications", body.certifications.length ? body.certifications.join(", ") : "none held, so none printed"],
              ["Shrinkage", "about 3 percent in length on the first wash, quoted size is the finished size"],
              ["Wash", p.careInstructions[0]],
              ["Ships from", `${p.shipping.shipsFrom.warehouse}, ${p.shipping.handlingDays} working days to hand over`],
              ["Returns", `${SHOP.returns.windowDays} days, label paid by us inside the EU`],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-x-3 border-b border-[var(--rule)] py-1.5">
                <dt className="text-[var(--ink-3)]">{k}</dt>
                <dd className="tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 font-[family-name:var(--font-spec)] text-[12px] tabular-nums text-[var(--ink-2)]">
            From {eur(range.low)} to {eur(range.high)} depending on size.
          </p>
        </div>
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------- rail B */

function MidPacket({ p, dye, width }: { p: Product; dye: DyeId; width: string }) {
  const range = priceRange(p);
  const dyes = dyesOf(p);
  const body = p.materials[0];
  return (
    <article
      className={`relative bg-[var(--stock)] pt-7 shadow-[0_8px_14px_-10px_rgba(30,26,17,0.55)] ${width}`}
    >
      <HangHole left={30} size={14} wire={20} />
      <DyeBand dye={dye} />
      <div className="px-5 pb-6 pt-7">
        <h3 className="font-[family-name:var(--font-packet)] text-[clamp(1.4rem,2.6vw,1.95rem)] font-bold leading-[1.02] tracking-[-0.015em]">
          <Link
            href={`/proof/shop/packet/${p.handle}`}
            className={`decoration-[var(--rule)] underline-offset-4 hover:underline ${FOCUS}`}
          >
            {p.title}
          </Link>
        </h3>
        <p className="mt-1 font-[family-name:var(--font-spec)] text-[12px] text-[var(--ink-3)]">
          {p.gloss} / {p.productType}
        </p>
        <p className="mt-3 max-w-[34em] text-[14.5px] leading-relaxed text-[var(--ink-2)]">
          {p.subtitle}
        </p>

        <dl className="mt-5 font-[family-name:var(--font-spec)] text-[12.5px]">
          <div className="grid grid-cols-[6.5rem_1fr] gap-x-3 border-t border-[var(--rule)] py-1.5">
            <dt className="text-[var(--ink-3)]">Cloth</dt>
            <dd className="tabular-nums">
              {body.weight ? `${body.weight.value} ${body.weight.unit} ` : ""}
              {body.composition.map((c) => c.fibre).join(" and ")}
            </dd>
          </div>
          <div className="grid grid-cols-[6.5rem_1fr] gap-x-3 border-t border-[var(--rule)] py-1.5">
            <dt className="text-[var(--ink-3)]">Sizes</dt>
            <dd className="tabular-nums">
              {p.sizes.map((s) => `${s.finishedCm.width} x ${s.finishedCm.length}`).join(", ")} cm
            </dd>
          </div>
          <div className="grid grid-cols-[6.5rem_1fr] gap-x-3 border-y border-[var(--rule)] py-1.5">
            <dt className="text-[var(--ink-3)]">Dyes</dt>
            <dd>
              {dyes.map((d, i) => (
                <span key={d} className="whitespace-nowrap">
                  <span
                    aria-hidden
                    className="mr-1 inline-block h-[9px] w-[9px] translate-y-[1px] border border-[var(--rule)]"
                    style={{ background: `var(${DYES[d].cssVar})` }}
                  />
                  {DYES[d].name}
                  {i < dyes.length - 1 ? <span className="text-[var(--ink-3)]">, </span> : null}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="font-[family-name:var(--font-spec)] text-[15px] font-medium tabular-nums">
            {eur(range.low)}
            {range.high !== range.low ? (
              <span className="text-[var(--ink-3)]"> to {eur(range.high)}</span>
            ) : null}
          </p>
          <LotStamp text={`Lot ${p.variants.find((v) => v.dye === dye)?.dyeLot ?? "24"}`} />
        </div>
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------- rail C */

function SmallRow({ p, dye }: { p: Product; dye: DyeId }) {
  const range = priceRange(p);
  const dyes = dyesOf(p);
  const first = p.variants.find((v) => v.dye === dye) ?? p.variants[0];
  return (
    <li className="relative border-b border-[var(--rule)] bg-[var(--stock)]">
      <div className="grid grid-cols-1 gap-x-8 gap-y-3 px-5 py-5 pl-14 sm:grid-cols-[minmax(0,1fr)_9rem_7rem] sm:items-baseline">
        <HangHole left={26} size={12} top={16} />
        <div className="min-w-0">
          <h3 className="font-[family-name:var(--font-packet)] text-[1.15rem] font-semibold leading-tight">
            <Link
              href={`/proof/shop/packet/${p.handle}`}
              className={`decoration-[var(--rule)] underline-offset-4 hover:underline ${FOCUS}`}
            >
              {p.title}
            </Link>
            <span className="ml-2 font-[family-name:var(--font-spec)] text-[12px] font-normal text-[var(--ink-3)]">
              {p.gloss}
            </span>
          </h3>
          <p className="mt-1.5 max-w-[34em] text-[14px] leading-snug text-[var(--ink-2)]">
            {p.subtitle}
          </p>
          <p className="mt-2 font-[family-name:var(--font-spec)] text-[11.5px] text-[var(--ink-3)]">
            {dyes.map((d, i) => (
              <span key={d} className="whitespace-nowrap">
                <span
                  aria-hidden
                  className="mr-1 inline-block h-[8px] w-[8px] translate-y-[1px] border border-[var(--rule)]"
                  style={{ background: `var(${DYES[d].cssVar})` }}
                />
                {DYES[d].name}
                {i < dyes.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>

        <div className="font-[family-name:var(--font-spec)] text-[12px] tabular-nums">
          <p className="text-[var(--ink-3)]">
            {p.sizes[0].finishedCm.width} x {p.sizes[0].finishedCm.length} cm
          </p>
          <StockLine state={variantState(first)} className="mt-1" />
        </div>

        <p className="font-[family-name:var(--font-spec)] text-[14px] font-medium tabular-nums sm:text-right">
          {eur(range.low)}
          {range.high !== range.low ? (
            <span className="block text-[12px] font-normal text-[var(--ink-3)]">
              to {eur(range.high)}
            </span>
          ) : null}
        </p>
      </div>
    </li>
  );
}

/* ---------------------------------------------------------------- page */

export default async function RackPage({
  searchParams,
}: {
  searchParams: Promise<{ dye?: string }>;
}) {
  const { dye } = await searchParams;
  const active = DYE_ORDER.includes(dye as DyeId) ? (dye as DyeId) : null;
  const shown = active ? PRODUCTS.filter((p) => dyesOf(p).includes(active)) : PRODUCTS;

  const bandFor = (p: Product): DyeId => active ?? dyesOf(p)[0];
  const railA = shown.filter((p) => p.rail === "A");
  const railB = shown.filter((p) => p.rail === "B");
  const railC = shown.filter((p) => p.rail === "C");
  const widths = ["lg:w-[57%]", "lg:w-[43%]"];

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-24 pt-8 md:px-9">
      <nav aria-label="Shop" className="flex gap-6 border-b border-[var(--rail)] pb-3">
        <Link
          href="/proof/shop"
          aria-current="page"
          className={`font-[family-name:var(--font-spec)] text-[12px] uppercase tracking-[0.14em] underline decoration-[var(--ink)] decoration-2 underline-offset-[5px] ${FOCUS}`}
        >
          Rack
        </Link>
        <Link
          href="/proof/shop/order"
          className={`font-[family-name:var(--font-spec)] text-[12px] uppercase tracking-[0.14em] text-[var(--ink-2)] hover:text-[var(--ink)] hover:underline hover:underline-offset-[5px] ${FOCUS}`}
        >
          Bag and delivery
        </Link>
      </nav>

      {/* Rack header. No photograph, per the contract. */}
      <header className="pt-7">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <h1 className="font-[family-name:var(--font-packet)] text-[clamp(2.1rem,5vw,3.6rem)] font-bold leading-[0.95] tracking-[-0.025em]">
              {SHOP.name}
            </h1>
            <p className="mt-2 max-w-[34em] text-[15px] leading-relaxed text-[var(--ink-2)]">
              {SHOP.strapline}. Every cloth carries its dye lot, the date the vat was made and the
              blue wool grade the colour actually scored.
            </p>
          </div>
          <dl className="font-[family-name:var(--font-spec)] text-[12px] tabular-nums">
            <div className="flex gap-3">
              <dt className="w-24 text-[var(--ink-2)]">Rack</dt>
              <dd>{SHOP.rackTitle}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 text-[var(--ink-2)]">Open lots</dt>
              <dd>{SHOP.lotRange}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 text-[var(--ink-2)]">Next vat</dt>
              <dd>
                Lot {SHOP.nextLot.lot}, from {SHOP.nextLot.vattingFrom}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 text-[var(--ink-2)]">Counted</dt>
              <dd>{SHOP.updatedAt}</dd>
            </div>
          </dl>
        </div>

        <p className="mt-6 max-w-[36em] border-y border-[var(--rail)] py-2 font-[family-name:var(--font-spec)] text-[12px] text-[var(--ink)]">
          {SHOP.illustrative}
        </p>
      </header>

      {/* The fastness strip. The organising figures, above the goods, at the cost of one band.
          The prose that explains each dye is the key further down, so this stays a legend. */}
      <section aria-labelledby="strip" className="mt-5 bg-[var(--stock)] px-5 py-4 sm:px-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2
            id="strip"
            className="font-[family-name:var(--font-packet)] text-[1.15rem] font-bold tracking-[-0.01em]"
          >
            Five dyes, five fastness figures
          </h2>
          <p className="font-[family-name:var(--font-spec)] text-[11.5px] text-[var(--ink-2)]">
            Blue wool scale 1 to 8, ISO 105-B02. Grey scale 1 to 5, ISO 105-C06.{" "}
            <a
              href="#key"
              className={`underline decoration-[var(--rule)] underline-offset-4 hover:text-[var(--ink)] ${FOCUS}`}
            >
              What each one does
            </a>
          </p>
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
          {DYE_ORDER.map((id) => {
            const d = DYES[id];
            return (
              <li key={id} className="border-t border-[var(--rule)] pt-2">
                <span
                  aria-hidden
                  className="block h-4 w-full"
                  style={{ background: `var(${d.cssVar})` }}
                />
                <p className="mt-2 font-[family-name:var(--font-packet)] text-[1rem] font-semibold leading-none">
                  {d.name}
                </p>
                <p className="mt-1 font-[family-name:var(--font-spec)] text-[11px] italic text-[var(--ink-3)]">
                  {d.botanical}
                </p>
                <span className="mt-1.5 flex flex-col gap-1">
                  <Fastness dye={id} grade={d.lightfastness} label="Light" />
                  <Fastness dye={id} grade={d.washfastness} max={5} label="Wash" />
                </span>
                {d.retired ? (
                  <p className="mt-1 font-[family-name:var(--font-spec)] text-[11px] text-[var(--madder)]">
                    Closed after lot {d.retired.lastLot}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Filter. Plain links, so a filtered rack is shareable and needs no client JS. */}
      <nav
        aria-label="Filter the rack by dye"
        className="flex flex-wrap items-center gap-x-1.5 gap-y-2 py-6"
      >
        <span className="mr-2 font-[family-name:var(--font-spec)] text-[11px] uppercase tracking-[0.14em] text-[var(--ink)]">
          Dyed with
        </span>
        <Link
          href="/proof/shop"
          aria-current={!active ? "page" : undefined}
          className={`border px-3 py-1.5 font-[family-name:var(--font-spec)] text-[12px] transition-colors ${FOCUS} ${
            !active
              ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--stock)]"
              : "border-[var(--rail)] text-[var(--ink)] hover:bg-[var(--stock)]"
          }`}
        >
          Everything {PRODUCTS.length}
        </Link>
        {DYE_ORDER.map((id) => {
          const n = PRODUCTS.filter((p) => dyesOf(p).includes(id)).length;
          const on = active === id;
          return (
            <Link
              key={id}
              href={`/proof/shop?dye=${id}`}
              aria-current={on ? "page" : undefined}
              className={`border px-3 py-1.5 font-[family-name:var(--font-spec)] text-[12px] tabular-nums transition-colors ${FOCUS} ${
                on
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--stock)]"
                  : "border-[var(--rail)] text-[var(--ink)] hover:bg-[var(--stock)]"
              }`}
            >
              <span
                aria-hidden
                className="mr-1.5 inline-block h-[9px] w-[9px] translate-y-[1px] border border-[var(--rule)]"
                style={{ background: `var(${DYES[id].cssVar})` }}
              />
              {DYES[id].name} {n}
            </Link>
          );
        })}
      </nav>

      {shown.length === 0 ? (
        <div className="border-y border-[var(--rail)] bg-[var(--stock)] px-6 py-14">
          <h2 className="font-[family-name:var(--font-packet)] text-[1.8rem] font-bold">
            Nothing on the rack is dyed with {DYES[active as DyeId].name.toLowerCase()}.
          </h2>
          <p className="mt-3 max-w-[34em] text-[15px] leading-relaxed text-[var(--ink-2)]">
            {DYES[active as DyeId].retired
              ? DYES[active as DyeId].retired?.reason
              : "That dye has no cloth against it in this rack."}{" "}
            The chips are still on the shade card so anyone who owns one can match it.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/proof/shop"
              className={`inline-block border border-[var(--ink)] px-4 py-2 font-[family-name:var(--font-spec)] text-[12px] uppercase tracking-[0.12em] hover:bg-[var(--ink)] hover:text-[var(--stock)] ${FOCUS}`}
            >
              Show all {PRODUCTS.length}
            </Link>
            <Link
              href="/proof/shop/packet/farbkarte"
              className={`inline-block border border-[var(--rail)] px-4 py-2 font-[family-name:var(--font-spec)] text-[12px] uppercase tracking-[0.12em] hover:border-[var(--ink)] ${FOCUS}`}
            >
              Open the shade card
            </Link>
          </div>
        </div>
      ) : (
        <>
          {railA.length > 0 ? (
            <Rail
              id="rail-a"
              letter="A"
              title="Blankets, 600 g and up"
              note="One cloth. Front and reverse, because the reverse is the reason to buy it."
            >
              {railA.map((p) => (
                <LeadPacket key={p.id} p={p} dye={bandFor(p)} />
              ))}
            </Rail>
          ) : null}

          {railB.length > 0 ? (
            <Rail
              id="rail-b"
              letter="B"
              title="Throws and covers"
              note="Hung at unequal width because the cloths are not the same size."
            >
              <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-7">
                {railB.map((p, i) => (
                  <MidPacket key={p.id} p={p} dye={bandFor(p)} width={widths[i] ?? "lg:w-1/2"} />
                ))}
              </div>
            </Rail>
          ) : null}

          {railC.length > 0 ? (
            <Rail
              id="rail-c"
              letter="C"
              title="Table, bed and small goods"
              note="Clipped along the bottom rail. Rows, because the names are worth more than the crop."
            >
              <ol className="mt-5">
                {railC.map((p) => (
                  <SmallRow key={p.id} p={p} dye={bandFor(p)} />
                ))}
              </ol>
            </Rail>
          ) : null}
        </>
      )}

      {/* The key in full, after the goods. A visitor who has seen the rack now wants to know
          what walnut actually does, and that is a paragraph, not a swatch. */}
      <section aria-labelledby="key" className="mt-16 bg-[var(--stock)] px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2
            id="key"
            className="font-[family-name:var(--font-packet)] text-[1.5rem] font-bold tracking-[-0.01em]"
          >
            What each dye does
          </h2>
          <p className="font-[family-name:var(--font-spec)] text-[11.5px] text-[var(--ink-2)]">
            Written from our own vat notes, not from a supplier sheet.
          </p>
        </div>

        <ul className="mt-5">
          {DYE_ORDER.map((id) => {
            const d = DYES[id];
            return (
              <li
                key={id}
                className="grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-2 border-t border-[var(--rule)] py-3 lg:grid-cols-[3.5rem_11rem_1fr_auto] lg:items-baseline"
              >
                <span
                  aria-hidden
                  className="h-8 w-14 border border-[var(--rule)]"
                  style={{ background: `var(${d.cssVar})` }}
                />
                <div>
                  <p className="font-[family-name:var(--font-packet)] text-[1.05rem] font-semibold leading-none">
                    {d.name}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-spec)] text-[11.5px] italic text-[var(--ink-3)]">
                    {d.botanical}
                  </p>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <p className="max-w-[34em] text-[13.5px] leading-snug text-[var(--ink-2)]">
                    {d.part}. {d.note}
                  </p>
                  {d.retired ? (
                    <p className="mt-1 max-w-[34em] font-[family-name:var(--font-spec)] text-[11.5px] leading-snug text-[var(--madder)]">
                      Closed after lot {d.retired.lastLot} on {d.retired.closedOn}. {d.retired.reason}
                    </p>
                  ) : null}
                </div>
                <div className="col-span-2 flex flex-col gap-1 lg:col-span-1 lg:items-end">
                  <Fastness dye={id} grade={d.lightfastness} label="Light" />
                  <Fastness dye={id} grade={d.washfastness} max={5} label="Wash" />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* The trust surface. Who ships it, who pays the return, who is liable. */}
      <section aria-labelledby="terms" className="mt-16 border-t border-[var(--rail)] pt-8">
        <h2
          id="terms"
          className="font-[family-name:var(--font-packet)] text-[1.5rem] font-bold tracking-[-0.01em]"
        >
          What it costs to get it and to send it back
        </h2>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left font-[family-name:var(--font-spec)] text-[12.5px]">
            <caption className="max-w-[36em] pb-2 text-left text-[11.5px] text-[var(--ink-2)]">
              Delivery, before checkout rather than at step four.
            </caption>
            <thead>
              <tr className="border-b border-[var(--rail)]">
                <th scope="col" className="py-2 pr-4 font-medium">Zone</th>
                <th scope="col" className="py-2 pr-4 font-medium">Carrier</th>
                <th scope="col" className="py-2 pr-4 font-medium">Working days</th>
                <th scope="col" className="py-2 pr-4 font-medium">Postage</th>
                <th scope="col" className="py-2 font-medium">Duty</th>
              </tr>
            </thead>
            <tbody>
              {SHOP.delivery.map((d) => (
                <tr key={d.zone} className="border-b border-[var(--rule)] align-top">
                  <td className="py-2 pr-4">{d.zone}</td>
                  <td className="py-2 pr-4">
                    {d.carrier} {d.service}
                  </td>
                  <td className="py-2 pr-4 tabular-nums">
                    {d.estimateBusinessDays.min} to {d.estimateBusinessDays.max}
                  </td>
                  <td className="py-2 pr-4 tabular-nums">
                    {eur(d.priceCents)}
                    {d.freeOverCents > 0 ? (
                      <span className="block text-[var(--ink-2)]">
                        free over {eur(d.freeOverCents)}
                      </span>
                    ) : null}
                  </td>
                  <td className="min-w-[19rem] max-w-[26rem] py-2 leading-snug">
                    <span className="font-medium">{d.dutiesHandling}.</span> {d.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
          <div>
            <h3 className="font-[family-name:var(--font-spec)] text-[11px] uppercase tracking-[0.16em] text-[var(--ink)]">
              Returns
            </h3>
            <p className="mt-2 max-w-[34em] text-[14.5px] leading-relaxed text-[var(--ink-2)]">
              {SHOP.returns.windowDays} days. {SHOP.returns.condition} We pay the label inside the
              EU. {SHOP.returns.outsideEuNote} Money back {SHOP.returns.refundProcessingDays}{" "}
              working days after the parcel reaches us.
            </p>
            <p className="mt-2 max-w-[36em] font-[family-name:var(--font-spec)] text-[12px] text-[var(--ink-2)]">
              Goes back to {SHOP.returns.address}
            </p>
            <p className="mt-2 max-w-[36em] font-[family-name:var(--font-spec)] text-[12px] text-[var(--ink-2)]">
              Not returnable: {SHOP.returns.exclusions.join(". ")}.
            </p>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-spec)] text-[11px] uppercase tracking-[0.16em] text-[var(--ink)]">
              Who this is
            </h3>
            <dl className="mt-2 font-[family-name:var(--font-spec)] text-[12px]">
              {[
                ["Company", SHOP.company.legalName],
                ["Register", SHOP.company.register],
                ["VAT ID", SHOP.company.vatId],
                ["Address", SHOP.company.address],
                ["Post", SHOP.company.email],
                ["Telephone", SHOP.company.phone],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-x-3 border-b border-[var(--rule)] py-1.5">
                  <dt className="text-[var(--ink-2)]">{k}</dt>
                  <dd className="tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <footer className="mt-10 flex flex-wrap items-baseline justify-between gap-4 border-t border-[var(--rail)] pt-4 font-[family-name:var(--font-spec)] text-[11.5px] text-[var(--ink)]">
        <p className="max-w-[34em]">{SHOP.illustrative}</p>
        <p className="tabular-nums">Rack counted {SHOP.updatedAt}</p>
      </footer>
    </main>
  );
}
