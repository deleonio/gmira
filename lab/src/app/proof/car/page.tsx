import Link from "next/link";
import { GRADE_KEY, LOTS, SALE, fmtEur, fmtKm, type Grade, type Lot } from "./data";

const GRADES: Grade[] = ["A", "B", "C", "D"];

function Stamp({ grade, status }: { grade: Grade; status: Lot["status"] }) {
  const sold = status !== "available";
  return (
    <span className="relative inline-flex shrink-0 items-center gap-1.5">
      <span
        aria-hidden
        className="grid h-9 w-9 -rotate-6 place-items-center border-2 border-[var(--stamp)] font-[family-name:var(--font-lot)] text-lg font-bold text-[var(--stamp)]"
        style={{ borderRadius: 2 }}
      >
        {grade}
      </span>
      <span className="sr-only">Condition grade {grade}</span>
      {sold ? (
        <span className="font-[family-name:var(--font-lot)] text-[10px] uppercase tracking-[0.18em] text-[var(--stamp)]">
          {status}
        </span>
      ) : null}
    </span>
  );
}

function energyLine(lot: Lot) {
  const e = lot.energy;
  if (e.kind === "electric") {
    const soh = e.stateOfHealthPercent ? `SoH ${e.stateOfHealthPercent}%` : "SoH not measured";
    return `${e.batteryNetKwh} kWh net / ${soh} / ${e.rangeWltpKm} km WLTP`;
  }
  return `${(e.displacementCcm / 1000).toFixed(1)} l ${e.fuel} / ${e.consumptionCombinedL100} l/100 km / ${e.emissionsClass}`;
}

export default async function LotListPage({
  searchParams,
}: {
  searchParams: Promise<{ grade?: string }>;
}) {
  const { grade } = await searchParams;
  const active = GRADES.includes(grade as Grade) ? (grade as Grade) : null;
  const lots = active ? LOTS.filter((l) => l.grade === active) : LOTS;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-24 pt-10 md:px-10">
      {/* Sale header. No photograph above the fold, per the direction contract. */}
      <header className="border-b border-[var(--rule)] pb-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h1 className="font-[family-name:var(--font-plate)] text-[clamp(2.4rem,5.5vw,4rem)] leading-[0.95] tracking-[-0.02em]">
            Sale {SALE.number}. {SALE.title}.
          </h1>
          <p className="font-[family-name:var(--font-lot)] text-xs uppercase tracking-[0.18em] text-[var(--ink-60)]">
            {SALE.location}
          </p>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 font-[family-name:var(--font-lot)] text-[13px] sm:grid-cols-4">
          {[
            ["Viewing from", SALE.viewingFrom],
            ["Sale", SALE.saleDate],
            ["Lots", String(SALE.lotsTotal)],
            ["Terms", "Sold as inspected"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-35)]">{k}</dt>
              <dd className="mt-1 tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* Condition grade key. The organising idea of the page, so it is stated before the lots. */}
      <section aria-labelledby="key" className="border-b border-[var(--rule)] py-6">
        <h2
          id="key"
          className="font-[family-name:var(--font-lot)] text-[10px] uppercase tracking-[0.16em] text-[var(--ink-35)]"
        >
          Condition grade
        </h2>
        <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          {GRADES.map((g) => (
            <li key={g} className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center border border-[var(--stamp)] font-[family-name:var(--font-lot)] text-sm font-bold text-[var(--stamp)]"
                style={{ borderRadius: 2 }}
              >
                {g}
              </span>
              <p className="text-[13px] leading-snug text-[var(--ink-60)]">{GRADE_KEY[g].note}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Filter. Server-rendered links, so a filtered view is shareable and needs no client JS. */}
      <nav aria-label="Filter by condition grade" className="flex flex-wrap items-center gap-x-1 gap-y-2 py-5">
        <span className="mr-3 font-[family-name:var(--font-lot)] text-[10px] uppercase tracking-[0.16em] text-[var(--ink-35)]">
          Show
        </span>
        <Link
          href="/proof/car"
          aria-current={!active ? "page" : undefined}
          className={`border px-3 py-1.5 font-[family-name:var(--font-lot)] text-xs transition-colors ${
            !active
              ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
              : "border-[var(--rule)] text-[var(--ink-60)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
          }`}
          style={{ borderRadius: 2 }}
        >
          All {LOTS.length}
        </Link>
        {GRADES.map((g) => {
          const n = LOTS.filter((l) => l.grade === g).length;
          const on = active === g;
          return (
            <Link
              key={g}
              href={`/proof/car?grade=${g}`}
              aria-current={on ? "page" : undefined}
              className={`border px-3 py-1.5 font-[family-name:var(--font-lot)] text-xs tabular-nums transition-colors ${
                on
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                  : "border-[var(--rule)] text-[var(--ink-60)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
              style={{ borderRadius: 2 }}
            >
              Grade {g} <span className="text-[var(--ink-35)]">{n}</span>
            </Link>
          );
        })}
      </nav>

      {/* The lot list. An index, never a card grid. */}
      {lots.length === 0 ? (
        <div className="border-y border-[var(--rule)] py-16">
          <p className="font-[family-name:var(--font-plate)] text-2xl">No lots at grade {active}.</p>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-[var(--ink-60)]">
            That grade is empty in this sale. The constraint that removed every lot is the grade
            filter, nothing else.
          </p>
          <Link
            href="/proof/car"
            className="mt-5 inline-block border border-[var(--ink)] px-4 py-2 font-[family-name:var(--font-lot)] text-xs uppercase tracking-[0.14em] hover:bg-[var(--ink)] hover:text-[var(--paper)]"
            style={{ borderRadius: 2 }}
          >
            Show all {LOTS.length} lots
          </Link>
        </div>
      ) : (
        <ol className="border-t border-[var(--rule)]">
          {lots.map((lot) => (
            <li key={lot.lot} className="border-b border-[var(--rule)]">
              <Link
                href={`/proof/car/${lot.stockNumber}`}
                className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 py-6 transition-colors hover:bg-[var(--paper-2)] md:grid-cols-[5.5rem_1fr_auto] md:gap-x-8"
              >
                {/* lot number */}
                <div className="font-[family-name:var(--font-lot)] text-[13px] tabular-nums text-[var(--ink-35)]">
                  <span className="block text-[10px] uppercase tracking-[0.16em]">Lot</span>
                  <span className="text-xl font-bold text-[var(--ink)]">{lot.lot}</span>
                </div>

                {/* identity + measurements */}
                <div className="min-w-0">
                  <h3 className="font-[family-name:var(--font-plate)] text-[clamp(1.35rem,2.4vw,1.85rem)] leading-tight group-hover:underline group-hover:decoration-[var(--rule)] group-hover:underline-offset-4">
                    {lot.make} {lot.model}
                    <span className="text-[var(--ink-60)]"> {lot.trim}</span>
                  </h3>

                  <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 font-[family-name:var(--font-lot)] text-[12.5px] tabular-nums text-[var(--ink-60)]">
                    <div className="flex gap-1.5">
                      <dt className="text-[var(--ink-35)]">EZ</dt>
                      <dd>{lot.firstRegistration}</dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-[var(--ink-35)]">km</dt>
                      <dd>{fmtKm(lot.mileage.value)}</dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-[var(--ink-35)]">kW</dt>
                      <dd>
                        {lot.power.kw} <span className="text-[var(--ink-35)]">({lot.power.hp} PS)</span>
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-[var(--ink-35)]">HU</dt>
                      <dd>{lot.inspectionDue}</dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-[var(--ink-35)]">Hd</dt>
                      <dd>{lot.priorOwners}</dd>
                    </div>
                  </dl>

                  <p className="mt-2 font-[family-name:var(--font-lot)] text-[12.5px] text-[var(--ink-35)]">
                    {energyLine(lot)}
                  </p>

                  {lot.advisories.length > 0 ? (
                    <p className="mt-2 text-[13px] leading-snug text-[var(--ink-60)]">
                      <span className="text-[var(--stamp)]">
                        {lot.advisories.length} {lot.advisories.length === 1 ? "advisory" : "advisories"}
                      </span>
                      <span className="text-[var(--ink-35)]"> / </span>
                      {lot.advisories[0].item}
                    </p>
                  ) : (
                    <p className="mt-2 text-[13px] text-[var(--ink-35)]">No advisories.</p>
                  )}
                </div>

                {/* grade stamp + hammer estimate */}
                <div className="col-span-2 flex items-center justify-between gap-6 md:col-span-1 md:flex-col md:items-end md:justify-start md:gap-3">
                  <Stamp grade={lot.grade} status={lot.status} />
                  <div className="text-right">
                    <p className="font-[family-name:var(--font-lot)] text-[10px] uppercase tracking-[0.16em] text-[var(--ink-35)]">
                      Estimate
                    </p>
                    <p className="font-[family-name:var(--font-lot)] text-[15px] font-medium tabular-nums">
                      {fmtEur(lot.estimate.low)} to {fmtEur(lot.estimate.high)}
                    </p>
                    <p className="font-[family-name:var(--font-lot)] text-[11px] text-[var(--ink-35)]">
                      EUR / {lot.vat.kind === "margin_scheme" ? lot.vat.statute : `${lot.vat.ratePercent}% MwSt.`}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}

      <footer className="mt-10 flex flex-wrap items-baseline justify-between gap-4 font-[family-name:var(--font-lot)] text-[11px] text-[var(--ink-35)]">
        <p>{SALE.note}</p>
        <p className="tabular-nums">Lot list updated 2026-07-23</p>
      </footer>
    </main>
  );
}
