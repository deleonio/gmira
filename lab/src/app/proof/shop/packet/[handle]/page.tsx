import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DYES,
  PRODUCTS,
  SHOP,
  dyesOf,
  eur,
  isBuyable,
  productByHandle,
  variantOf,
  type DyeId,
  type Product,
} from "../../data";
import { FOCUS, Fastness } from "../../ui";
import { Buy } from "./buy";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = productByHandle(handle);
  if (!p) return { title: "No such packet" };
  return { title: `${p.seo.title} / ${SHOP.name}`, description: p.seo.description };
}

/* ---- delivery dates, computed on the server so the client never recomputes them and
        never disagrees with the server about what day it is ---- */

const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}
function addBusinessDays(d: Date, n: number) {
  const x = new Date(d);
  let left = n;
  while (left > 0) {
    x.setUTCDate(x.getUTCDate() + 1);
    if (x.getUTCDay() !== 0 && x.getUTCDay() !== 6) left -= 1;
  }
  return x;
}
/* The shed hands parcels over Monday to Thursday. Friday cutting is for the next week. */
function nextShipDay(d: Date) {
  const x = new Date(d);
  while (x.getUTCDay() === 5 || x.getUTCDay() === 6 || x.getUTCDay() === 0) {
    x.setUTCDate(x.getUTCDate() + 1);
  }
  return x;
}
function deliveryLine(handlingDays: number, min: number, max: number) {
  const now = new Date();
  const base = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const ship = nextShipDay(addBusinessDays(base, handlingDays));
  const a = addBusinessDays(ship, min);
  const b = addBusinessDays(ship, max);
  return `Leaves ${DAY[ship.getUTCDay()]} ${iso(ship)}, with you ${iso(a)} to ${iso(b)}`;
}

/* ---- small pieces ---- */

function SpecRow({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-1 border-b border-[var(--rule)] py-2 sm:grid-cols-[7rem_1fr] xl:grid-cols-[8.5rem_1fr]">
      <dt className="font-[family-name:var(--font-spec)] text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
        {k}
      </dt>
      <dd className="font-[family-name:var(--font-spec)] text-[12.5px] tabular-nums max-w-[34em]">{children}</dd>
    </div>
  );
}

function defaultSelection(p: Product): { dye: DyeId; size: string } {
  const buyable = p.variants.find((v) => isBuyable(v));
  const made = buyable ?? p.variants.find((v) => v.madeInThisCombination) ?? p.variants[0];
  return { dye: made.dye, size: made.size };
}

/* ---- page ---- */

export default async function PacketPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ colour?: string; size?: string }>;
}) {
  const { handle } = await params;
  const { colour, size } = await searchParams;
  const p = productByHandle(handle);
  if (!p) notFound();

  const fallback = defaultSelection(p);
  const dyes = dyesOf(p);
  const wanted = colour as DyeId | undefined;
  const dye: DyeId = wanted && dyes.includes(wanted) ? wanted : fallback.dye;
  const sizeName =
    size && p.sizes.some((s) => s.name === size) && variantOf(p, dye, size)?.madeInThisCombination
      ? size
      : (variantOf(p, dye, fallback.size)?.madeInThisCombination
          ? fallback.size
          : (p.variants.find((v) => v.dye === dye && v.madeInThisCombination)?.size ??
             p.sizes[0].name));

  const deliveryBySize: Record<string, string> = {};
  for (const s of p.sizes) {
    deliveryBySize[s.name] = deliveryLine(p.shipping.handlingDays, 1, 3);
  }

  const idx = PRODUCTS.findIndex((x) => x.handle === p.handle);
  const prev = PRODUCTS[idx - 1];
  const next = PRODUCTS[idx + 1];

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-24 pt-8 md:px-9">
      <nav
        aria-label="Breadcrumb"
        className="font-[family-name:var(--font-spec)] text-[11.5px] uppercase tracking-[0.12em] text-[var(--ink-2)]"
      >
        <Link
          href="/proof/shop"
          className={`underline decoration-[var(--rail)] underline-offset-4 hover:text-[var(--ink)] ${FOCUS}`}
        >
          {SHOP.rackTitle}
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <Link
          href={`/proof/shop?dye=${dye}`}
          className={`underline decoration-[var(--rail)] underline-offset-4 hover:text-[var(--ink)] ${FOCUS}`}
        >
          {DYES[dye].name}
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span aria-current="page" className="text-[var(--ink)]">
          {p.title}
        </span>
      </nav>

      <header className="mt-5 border-b border-[var(--rail)] pb-6">
        <h1 className="font-[family-name:var(--font-packet)] text-[clamp(2.2rem,5.4vw,3.8rem)] font-bold leading-[0.95] tracking-[-0.025em]">
          {p.title}
        </h1>
        <p className="mt-2 font-[family-name:var(--font-spec)] text-[12.5px] text-[var(--ink-2)]">
          {p.gloss} / {p.productType} / on the rack since {p.launchedAt} / record updated{" "}
          {p.updatedAt}
        </p>
        <p className="mt-4 max-w-[34em] text-[16px] leading-relaxed text-[var(--ink)]">
          {p.subtitle}
        </p>
      </header>

      <div className="mt-8 grid items-start gap-x-10 gap-y-10 lg:grid-cols-[1fr_24rem] xl:grid-cols-[1fr_minmax(340px,25rem)]">
        {/* Buy panel first in the DOM, so a phone gets price and variant before the description.
            Desktop lifts it into the second column of the first row. */}
        <div className="lg:col-start-2 lg:row-start-1">
          <Buy
            product={p}
            initialDye={dye}
            initialSize={sizeName}
            deliveryBySize={deliveryBySize}
            zoneNote="Germany, DDP, VAT in the price"
          />

          <section
            aria-labelledby="semantics"
            className="mt-5 border-t-2 border-[var(--rail)] pt-4"
          >
            <h2
              id="semantics"
              className="font-[family-name:var(--font-spec)] text-[11px] uppercase tracking-[0.14em] text-[var(--ink)]"
            >
              Three states, kept apart
            </h2>
            <dl className="mt-3 text-[13px] leading-snug">
              <div className="border-b border-[var(--rule)] pb-2">
                <dt className="font-[family-name:var(--font-spec)] text-[12px] text-[var(--ink)]">
                  disabled, on the struck through option
                </dt>
                <dd className="mt-1 max-w-[34em] text-[var(--ink-2)]">
                  The real HTML attribute, only where the combination was never made. Out of the
                  tab order, because there is no date, no list and no price behind it. The reason
                  is printed under the axis rather than hidden in a tooltip.
                </dd>
              </div>
              <div className="border-b border-[var(--rule)] py-2">
                <dt className="font-[family-name:var(--font-spec)] text-[12px] text-[var(--ink)]">
                  aria-disabled, on the add control
                </dt>
                <dd className="mt-1 max-w-[34em] text-[var(--ink-2)]">
                  Only there. The button stays, it keeps its tab stop, it announces as
                  unavailable, and it names the reason instead of doing nothing. Putting this on a
                  control that still acts is the usual version of the bug, and every tool that
                  respects the attribute then refuses to operate the control.
                </dd>
              </div>
              <div className="pt-2">
                <dt className="font-[family-name:var(--font-spec)] text-[12px] text-[var(--ink)]">
                  out of stock, on neither
                </dt>
                <dd className="mt-1 max-w-[34em] text-[var(--ink-2)]">
                  A data state. A sold out option stays fully operable, because selecting it is
                  how the restock date appears, and it carries the words in its own label. Zero
                  with a next lot behind it is fully buyable, with the ship date on the button.
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* The left column: what the thing is, printed on the paper rather than on the board.
            Label ink is legible on kraft and is not legible on the fixture, which is why the
            colour rule in the layout says the board carries body ink only. */}
        <div className="bg-[var(--stock)] px-5 py-6 shadow-[0_8px_14px_-10px_rgba(30,26,17,0.55)] sm:px-7 lg:col-start-1 lg:row-start-1">
          <section aria-labelledby="made">
            <h2
              id="made"
              className="font-[family-name:var(--font-packet)] text-[1.6rem] font-bold tracking-[-0.01em]"
            >
              What it is made of
            </h2>
            <dl className="mt-4">
              {p.materials.map((m) => (
                <SpecRow key={m.component} k={m.component}>
                  {m.composition.map((c) => `${c.percent} percent ${c.fibre}`).join(", ")}
                  {m.weight ? `, ${m.weight.value} ${m.weight.unit}` : ""}
                  {m.mill ? `, milled at ${m.mill}` : ""}
                  <span className="block text-[11.5px] text-[var(--ink-3)]">
                    Country of origin {m.countryOfOrigin}.{" "}
                    {m.certifications.length
                      ? `Certified ${m.certifications.join(", ")}.`
                      : "No certification held for this component, so none is printed."}
                  </span>
                </SpecRow>
              ))}
              {p.loomWidthCm ? <SpecRow k="Loom width">{p.loomWidthCm} cm</SpecRow> : null}
              <SpecRow k="Made in">
                {p.madeIn}, {p.factory.name}, {p.factory.city}, {p.factory.workers} people
              </SpecRow>
              <SpecRow k="Construction">
                <ul>
                  {p.construction.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </SpecRow>
              <SpecRow k="Repair">
                {p.repairable
                  ? (p.repairNote ?? "We repair this one. Write and ask.")
                  : "Not economically repairable. It is a 24 EUR cloth and a repair costs more than a new one."}
              </SpecRow>
            </dl>
          </section>

          <section aria-labelledby="expect" className="mt-10">
            <h2
              id="expect"
              className="font-[family-name:var(--font-packet)] text-[1.6rem] font-bold tracking-[-0.01em]"
            >
              What it will do
            </h2>
            <ul className="mt-4">
              {p.expectedBehaviour.map((e) => (
                <li
                  key={e}
                  className="max-w-[34em] border-b border-[var(--rule)] py-2.5 text-[14.5px] leading-relaxed text-[var(--ink-2)]"
                >
                  {e}
                </li>
              ))}
            </ul>
            {p.lifespanNote ? (
              <p className="mt-4 max-w-[34em] text-[14.5px] leading-relaxed text-[var(--ink)]">
                {p.lifespanNote}
              </p>
            ) : null}
          </section>

          <section aria-labelledby="care" className="mt-10">
            <h2
              id="care"
              className="font-[family-name:var(--font-packet)] text-[1.6rem] font-bold tracking-[-0.01em]"
            >
              Care
            </h2>
            <ol className="mt-4">
              {p.careInstructions.map((c, i) => (
                <li
                  key={c}
                  className="grid max-w-[34em] grid-cols-[1.6rem_1fr] border-b border-[var(--rule)] py-2.5 text-[14.5px] leading-relaxed text-[var(--ink-2)]"
                >
                  <span className="font-[family-name:var(--font-spec)] text-[12px] tabular-nums text-[var(--ink-3)]">
                    {i + 1}
                  </span>
                  {c}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {/* Full width from here down: the reverse of the packet, on one sheet. */}
      <div className="mt-14 bg-[var(--stock)] px-5 py-7 shadow-[0_8px_14px_-10px_rgba(30,26,17,0.55)] sm:px-8">
      <section aria-labelledby="sizes">
        <h2
          id="sizes"
          className="font-[family-name:var(--font-packet)] text-[1.6rem] font-bold tracking-[-0.01em]"
        >
          Measured, not estimated
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left font-[family-name:var(--font-spec)] text-[12.5px]">
            <caption className="max-w-[36em] pb-2 text-left text-[12px] leading-snug text-[var(--ink-2)]">
              Method: {p.sizeChart.method === "garment_flat" ? "measured flat, not on a body" : "body measurement"}. Tolerance {p.sizeChart.tolerance}. {p.sizeChart.howMeasured}
            </caption>
            <thead>
              <tr className="border-b border-[var(--rail)]">
                <th scope="col" className="py-2 pr-4 font-medium">Size</th>
                <th scope="col" className="py-2 pr-4 font-medium">Width cm</th>
                <th scope="col" className="py-2 pr-4 font-medium">Length cm</th>
                <th scope="col" className="py-2 pr-4 font-medium">Packed g</th>
                <th scope="col" className="py-2 pr-4 font-medium">Postage class</th>
                <th scope="col" className="py-2 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {p.sizes.map((s) => (
                <tr key={s.name} className="border-b border-[var(--rule)]">
                  <th scope="row" className="py-2 pr-4 font-medium">
                    {s.name} <span className="font-normal text-[var(--ink-3)]">{s.label}</span>
                  </th>
                  <td className="py-2 pr-4 tabular-nums">{s.finishedCm.width}</td>
                  <td className="py-2 pr-4 tabular-nums">{s.finishedCm.length}</td>
                  <td className="py-2 pr-4 tabular-nums">{s.packedWeightG}</td>
                  <td className="py-2 pr-4">{s.shippingClass}</td>
                  <td className="py-2 tabular-nums">{eur(s.priceCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="reverse" className="mt-12 border-t border-[var(--rule)] pt-8">
        <h2
          id="reverse"
          className="font-[family-name:var(--font-packet)] text-[1.6rem] font-bold tracking-[-0.01em]"
        >
          The reverse of the packet
        </h2>
        <div className="mt-4 grid gap-x-12 gap-y-8 xl:grid-cols-2">
          <div>
            <h3 className="font-[family-name:var(--font-spec)] text-[11px] uppercase tracking-[0.16em] text-[var(--ink-2)]">
              Lots on this cloth
            </h3>
            <dl className="mt-3">
              {dyes.map((d) => {
                const v = p.variants.find((x) => x.dye === d && x.madeInThisCombination);
                return (
                  <SpecRow key={d} k={DYES[d].name}>
                    {v ? `Lot ${v.dyeLot}, vatted ${v.vattedOn}` : "no open lot"}
                    <span className="mt-1 flex flex-col gap-1">
                      <Fastness dye={d} grade={DYES[d].lightfastness} label="Light" />
                      <Fastness dye={d} grade={DYES[d].washfastness} max={5} label="Wash" />
                    </span>
                  </SpecRow>
                );
              })}
            </dl>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-spec)] text-[11px] uppercase tracking-[0.16em] text-[var(--ink-2)]">
              Paperwork
            </h3>
            <dl className="mt-3">
              <SpecRow k="Customs code">{p.compliance.hsCode}</SpecRow>
              <SpecRow k="EU liability">
                {p.compliance.euResponsiblePerson.name}
                <span className="block text-[11.5px] text-[var(--ink-3)]">
                  {p.compliance.euResponsiblePerson.address}, {p.compliance.euResponsiblePerson.email}
                </span>
              </SpecRow>
              <SpecRow k="Warnings">
                {p.compliance.warnings.length
                  ? p.compliance.warnings.join(". ")
                  : "None apply to this article."}
              </SpecRow>
              <SpecRow k="Packaging">
                <ul>
                  {p.compliance.packagingRecycling.map((x) => (
                    <li key={x.part}>
                      {x.part}: {x.material}, into {x.stream}
                    </li>
                  ))}
                </ul>
              </SpecRow>
              <SpecRow k="Ships from">
                {p.shipping.shipsFrom.warehouse}, {p.shipping.shipsFrom.countryCode}, handed over
                after {p.shipping.handlingDays} working{" "}
                {p.shipping.handlingDays === 1 ? "day" : "days"}
              </SpecRow>
              <SpecRow k="Returns">
                {SHOP.returns.windowDays} days, {SHOP.returns.condition} Back to{" "}
                {SHOP.returns.address}. Refund {SHOP.returns.refundProcessingDays} working days
                after it lands.
              </SpecRow>
            </dl>
          </div>
        </div>
      </section>

      {/* Plate index. No photographs ship with this proof, and inventing them would be the
          supplier-catalogue lie the playbook warns about. The written alt text is the content
          model of a real frame, so it is printed rather than faked. */}
      <section aria-labelledby="plates" className="mt-12 border-t border-[var(--rule)] pt-8">
        <h2
          id="plates"
          className="font-[family-name:var(--font-packet)] text-[1.6rem] font-bold tracking-[-0.01em]"
        >
          Plate index
        </h2>
        <p className="mt-2 max-w-[34em] text-[14px] leading-relaxed text-[var(--ink-2)]">
          This proof ships no photographs. Rather than fill the space with stand-in images, the
          frames are listed with the alt text each one carries, which is where the colourway, the
          scale reference and the detail actually live.
        </p>
        <ol className="mt-4">
          {p.media.map((m) => (
            <li
              key={m.plate}
              className="grid max-w-[52em] grid-cols-[3rem_6.5rem_1fr] gap-x-4 border-b border-[var(--rule)] py-2.5"
            >
              <span className="font-[family-name:var(--font-spec)] text-[12px] tabular-nums text-[var(--ink-3)]">
                {String(m.plate).padStart(2, "0")}
              </span>
              <span className="font-[family-name:var(--font-spec)] text-[12px] text-[var(--ink-3)]">
                {m.kind.replace(/_/g, " ")}
              </span>
              <span className="text-[14px] leading-snug text-[var(--ink-2)]">{m.alt}</span>
            </li>
          ))}
        </ol>
      </section>

      </div>

      <nav aria-label="Other packets" className="mt-12 flex items-stretch justify-between gap-6 border-t border-[var(--rail)] pt-6">
        {prev ? (
          <Link href={`/proof/shop/packet/${prev.handle}`} className={`group max-w-[46%] ${FOCUS}`}>
            <span className="font-[family-name:var(--font-spec)] text-[11px] uppercase tracking-[0.14em] text-[var(--ink-2)]">
              Back one hook
            </span>
            <span className="block font-[family-name:var(--font-packet)] text-[1.1rem] font-semibold leading-tight group-hover:underline group-hover:underline-offset-4">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/proof/shop/packet/${next.handle}`}
            className={`group max-w-[46%] text-right ${FOCUS}`}
          >
            <span className="font-[family-name:var(--font-spec)] text-[11px] uppercase tracking-[0.14em] text-[var(--ink-2)]">
              On one hook
            </span>
            <span className="block font-[family-name:var(--font-packet)] text-[1.1rem] font-semibold leading-tight group-hover:underline group-hover:underline-offset-4">
              {next.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <footer className="mt-8 border-t border-[var(--rail)] pt-4 font-[family-name:var(--font-spec)] text-[11.5px] text-[var(--ink)]">
        <p className="max-w-[34em]">{SHOP.illustrative}</p>
      </footer>
    </main>
  );
}
