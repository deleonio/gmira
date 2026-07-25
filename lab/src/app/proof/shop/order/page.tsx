import type { Metadata } from "next";
import Link from "next/link";
import { DYES, SHOP, eur, productByHandle, variantOf, type DyeId } from "../data";
import { FOCUS } from "../ui";
import { DeliveryForm, type BagLine } from "./form";

export const metadata: Metadata = {
  title: "Delivery / Faerbergarten Wilster",
  description:
    "Delivery step. The total, the postage and the duty treatment are on this screen, not on the last one.",
};

/* An illustrative bag, built from real rows of the catalogue so the arithmetic below is the
   arithmetic the rack would produce. Money is integer cents end to end. */
function buildBag(): BagLine[] {
  const rows: Array<{ handle: string; dye: DyeId; size: string; qty: number }> = [
    { handle: "marschdecke", dye: "woad", size: "160x220", qty: 1 },
    { handle: "kuechentuch", dye: "madder", size: "50x70", qty: 2 },
    { handle: "farbkarte", dye: "woad", size: "60x40", qty: 1 },
  ];
  const out: BagLine[] = [];
  for (const r of rows) {
    const p = productByHandle(r.handle);
    if (!p) continue;
    const v = variantOf(p, r.dye, r.size);
    const sizeSpec = p.sizes.find((s) => s.name === r.size) ?? p.sizes[0];
    const unit = v?.price?.cents ?? sizeSpec.priceCents;
    const dye: DyeId = v?.dye ?? r.dye;
    out.push({
      key: v?.id ?? `${p.handle}-${r.size}`,
      title: p.title,
      handle: p.handle,
      dyeName: DYES[dye].name,
      dyeVar: DYES[dye].cssVar,
      size: `${sizeSpec.finishedCm.width} x ${sizeSpec.finishedCm.length} cm`,
      sku: v?.sku ?? "no sku",
      lot: v?.dyeLot ?? "unlotted",
      qty: r.qty,
      unitCents: unit,
      lineCents: unit * r.qty,
      packedWeightG: sizeSpec.packedWeightG * r.qty,
    });
  }
  return out;
}

/* Berlin time, fixed offset for July. Computed on the server and handed over as a string so
   the client never recomputes it and the two can never disagree. */
function holdUntilBerlin(minutes: number) {
  const t = new Date(Date.now() + minutes * 60_000 + 2 * 3600_000);
  return `${String(t.getUTCHours()).padStart(2, "0")}:${String(t.getUTCMinutes()).padStart(2, "0")}`;
}

const STEPS = [
  { name: "Bag", state: "done" as const, href: "/proof/shop" },
  { name: "Delivery", state: "current" as const },
  { name: "Payment", state: "ahead" as const },
  { name: "Confirm", state: "ahead" as const },
];

export default function OrderPage() {
  const bag = buildBag();
  const goodsCents = bag.reduce((n, l) => n + l.lineCents, 0);
  const weightG = bag.reduce((n, l) => n + l.packedWeightG, 0);

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-24 pt-8 md:px-9">
      <nav aria-label="Shop" className="flex gap-6 border-b border-[var(--rail)] pb-3">
        <Link
          href="/proof/shop"
          className={`font-[family-name:var(--font-spec)] text-[12px] uppercase tracking-[0.14em] text-[var(--ink-2)] hover:text-[var(--ink)] hover:underline hover:underline-offset-[5px] ${FOCUS}`}
        >
          Rack
        </Link>
        <Link
          href="/proof/shop/order"
          aria-current="page"
          className={`font-[family-name:var(--font-spec)] text-[12px] uppercase tracking-[0.14em] underline decoration-[var(--ink)] decoration-2 underline-offset-[5px] ${FOCUS}`}
        >
          Bag and delivery
        </Link>
      </nav>

      <header className="pt-7">
        <h1 className="font-[family-name:var(--font-packet)] text-[clamp(1.9rem,4.4vw,3rem)] font-bold leading-[0.97] tracking-[-0.025em]">
          Where it goes
        </h1>

        {/* Named steps, all of them, from the start. No percentage, because a flow that can
            branch cannot own one. */}
        <nav aria-label="Order steps" className="mt-5">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-[family-name:var(--font-spec)] text-[12px]">
            {STEPS.map((s, i) => (
              <li key={s.name} className="flex items-center gap-2">
                {s.state === "done" && s.href ? (
                  <Link
                    href={s.href}
                    className={`underline decoration-[var(--rail)] underline-offset-4 hover:text-[var(--ink)] ${FOCUS}`}
                  >
                    {s.name}
                  </Link>
                ) : s.state === "current" ? (
                  <span
                    aria-current="step"
                    className="border-b-2 border-[var(--ink)] pb-0.5 font-medium text-[var(--ink)]"
                  >
                    {s.name}
                  </span>
                ) : (
                  <span className="text-[var(--ink-2)]">{s.name}</span>
                )}
                {i < STEPS.length - 1 ? (
                  <span aria-hidden className="text-[var(--ink-2)]">
                    to
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-2 max-w-[34em] font-[family-name:var(--font-spec)] text-[11.5px] text-[var(--ink)]">
            Payment and Confirm are named but not built in this proof, so they are not links. A
            step you cannot reach yet is still named from the start, because a bar that grows and
            then shrinks is worse than a list.
          </p>
        </nav>
      </header>

      {/* Form first in the DOM, so a phone gets the task. The bag is server rendered and
          handed to the client step as a child, which keeps the catalogue off the wire. */}
      <div className="mt-8">
        <DeliveryForm
          bag={bag}
          bagPanel={<BagPanel bag={bag} weightG={weightG} />}
          goodsCents={goodsCents}
          holdUntil={holdUntilBerlin(SHOP.holdMinutes)}
          holdMinutes={SHOP.holdMinutes}
        />
      </div>
    </main>
  );
}

/* The bag, with the real total beside it rather than on step four. */
function BagPanel({ bag, weightG }: { bag: BagLine[]; weightG: number }) {
  return (
    <section aria-labelledby="bag">
      <div className="bg-[var(--stock)] px-5 py-5 shadow-[0_8px_14px_-10px_rgba(30,26,17,0.55)]">
            <div className="flex items-baseline justify-between gap-4">
              <h2
                id="bag"
                className="font-[family-name:var(--font-packet)] text-[1.3rem] font-bold tracking-[-0.01em]"
              >
                In the bag
              </h2>
              <Link
                href="/proof/shop"
                className={`font-[family-name:var(--font-spec)] text-[11.5px] underline decoration-[var(--rule)] underline-offset-4 hover:text-[var(--ink)] ${FOCUS}`}
              >
                Change it
              </Link>
            </div>

            <ul className="mt-4">
              {bag.map((l) => (
                <li key={l.key} className="border-t border-[var(--rule)] py-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-[family-name:var(--font-packet)] text-[15px] font-semibold leading-tight">
                      <Link
                        href={`/proof/shop/packet/${l.handle}`}
                        className={`decoration-[var(--rule)] underline-offset-4 hover:underline ${FOCUS}`}
                      >
                        {l.title}
                      </Link>
                    </p>
                    <p className="shrink-0 font-[family-name:var(--font-spec)] text-[13px] tabular-nums">
                      {eur(l.lineCents)}
                    </p>
                  </div>
                  <p className="mt-1 font-[family-name:var(--font-spec)] text-[11.5px] tabular-nums text-[var(--ink-2)]">
                    <span
                      aria-hidden
                      className="mr-1.5 inline-block h-[9px] w-[9px] translate-y-[1px] border border-[var(--rule)]"
                      style={{ background: `var(${l.dyeVar})` }}
                    />
                    {l.dyeName}, {l.size}, lot {l.lot}
                  </p>
                  <p className="mt-0.5 font-[family-name:var(--font-spec)] text-[11.5px] tabular-nums text-[var(--ink-2)]">
                    {l.sku} / {l.qty} at {eur(l.unitCents)}
                  </p>
                </li>
              ))}
            </ul>

        <p className="mt-4 border-t border-[var(--rule)] pt-3 font-[family-name:var(--font-spec)] text-[11.5px] tabular-nums text-[var(--ink-2)]">
          {weightG} g packed, one parcel from {SHOP.company.address.split(",")[1].trim()}.
        </p>
      </div>
    </section>
  );
}
