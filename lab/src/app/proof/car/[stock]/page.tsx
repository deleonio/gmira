import Link from "next/link";
import { notFound } from "next/navigation";
import { GRADE_KEY, LOTS, SALE, fmtEur, fmtKm, type Lot } from "../data";

export function generateStaticParams() {
  return LOTS.map((l) => ({ stock: l.stockNumber }));
}

export async function generateMetadata({ params }: { params: Promise<{ stock: string }> }) {
  const { stock } = await params;
  const lot = LOTS.find((l) => l.stockNumber === stock);
  if (!lot) return { title: "Lot not found" };
  return {
    title: `Lot ${lot.lot} / ${lot.make} ${lot.model} / Grade ${lot.grade}`,
    description: `${lot.make} ${lot.model} ${lot.trim}. First registered ${lot.firstRegistration}, ${fmtKm(lot.mileage.value)} km, ${lot.priorOwners} prior owners. Condition grade ${lot.grade}.`,
  };
}

/* A register row. Units live in the label so the value column stays scannable. */
function Row({ k, unit, children }: { k: string; unit?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(9rem,14rem)_1fr] gap-4 border-b border-[var(--rule)] py-2.5">
      <dt className="font-[family-name:var(--font-lot)] text-[11px] uppercase tracking-[0.12em] text-[var(--ink-35)]">
        {k}
        {unit ? <span className="normal-case tracking-normal"> ({unit})</span> : null}
      </dt>
      <dd className="font-[family-name:var(--font-lot)] text-[13.5px] tabular-nums">{children}</dd>
    </div>
  );
}

function Register({ lot }: { lot: Lot }) {
  const e = lot.energy;
  return (
    <div className="grid gap-x-12 gap-y-0 lg:grid-cols-2">
      <section aria-labelledby="reg-id">
        <h3 id="reg-id" className="mb-2 font-[family-name:var(--font-lot)] text-[10px] uppercase tracking-[0.18em] text-[var(--stamp)]">
          Identity
        </h3>
        <dl>
          <Row k="Stock number">{lot.stockNumber}</Row>
          <Row k="VIN">
            <span className="text-[var(--ink-35)]">**********</span>
            {lot.vinLast6}
            <span className="ml-2 text-[11px] text-[var(--ink-35)]">full on request</span>
          </Row>
          <Row k="Body">{lot.bodyStyle}</Row>
          <Row k="Paint">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-3.5 w-3.5 border border-[var(--rule)]"
                style={{ background: lot.exteriorColor.hex, borderRadius: 1 }}
              />
              {lot.exteriorColor.name}, {lot.exteriorColor.finish}
            </span>
          </Row>
          <Row k="Interior">{lot.interior}</Row>
        </dl>

        <h3 className="mb-2 mt-8 font-[family-name:var(--font-lot)] text-[10px] uppercase tracking-[0.18em] text-[var(--stamp)]">
          Age and use
        </h3>
        <dl>
          <Row k="Model year">{lot.modelYear}</Row>
          <Row k="First registration">{lot.firstRegistration}</Row>
          <Row k="Odometer" unit="km">
            {fmtKm(lot.mileage.value)}{" "}
            <span className="text-[11px] text-[var(--ink-35)]">read {lot.mileage.readAt}</span>
          </Row>
          <Row k="Registered keepers">{lot.priorOwners}</Row>
          <Row k="Previous use">{lot.previousUse.replace("_", " ")}</Row>
          <Row k="Inspection due">{lot.inspectionDue}</Row>
        </dl>
      </section>

      <section aria-labelledby="reg-drive">
        <h3 id="reg-drive" className="mb-2 font-[family-name:var(--font-lot)] text-[10px] uppercase tracking-[0.18em] text-[var(--stamp)]">
          Drivetrain
        </h3>
        <dl>
          <Row k="Power" unit="kW">
            {lot.power.kw} <span className="text-[var(--ink-35)]">/ {lot.power.hp} PS</span>
          </Row>
          <Row k="Transmission">{lot.transmission}</Row>
          <Row k="Driven axle">{lot.drivetrain.toUpperCase()}</Row>
        </dl>

        <h3 className="mb-2 mt-8 font-[family-name:var(--font-lot)] text-[10px] uppercase tracking-[0.18em] text-[var(--stamp)]">
          {e.kind === "electric" ? "Battery and charging" : "Engine and emissions"}
        </h3>
        <dl>
          {e.kind === "electric" ? (
            <>
              <Row k="Usable capacity" unit="kWh">{e.batteryNetKwh}</Row>
              <Row k="Gross capacity" unit="kWh">{e.batteryGrossKwh}</Row>
              <Row k="Chemistry">{e.chemistry}</Row>
              <Row k="State of health" unit="%">
                {e.stateOfHealthPercent ? (
                  <>
                    {e.stateOfHealthPercent}{" "}
                    <span className="text-[11px] text-[var(--ink-35)]">
                      {e.sohMeasuredAt}, {e.sohMethod}
                    </span>
                  </>
                ) : (
                  <span className="text-[var(--ink-35)]">not measured</span>
                )}
              </Row>
              <Row k="Range, WLTP" unit="km">{e.rangeWltpKm}</Row>
              <Row k="Range, measured" unit="km">
                {e.rangeMeasured ? (
                  <>
                    {e.rangeMeasured.km}{" "}
                    <span className="text-[11px] text-[var(--ink-35)]">
                      {e.rangeMeasured.conditions}, {e.rangeMeasured.measuredAt}
                    </span>
                  </>
                ) : (
                  <span className="text-[var(--ink-35)]">we have not measured this car</span>
                )}
              </Row>
              <Row k="DC peak" unit="kW">{e.dcPeakKw}</Row>
              <Row k="DC 10 to 80" unit="min">{e.dcTenToEightyMinutes}</Row>
              <Row k="AC onboard" unit="kW">{e.acOnboardChargerKw}</Row>
              <Row k="Heat pump">
                {e.heatPump ? "Fitted" : <span className="text-[var(--stamp)]">Not fitted</span>}
              </Row>
            </>
          ) : (
            <>
              <Row k="Displacement" unit="ccm">{e.displacementCcm}</Row>
              <Row k="Cylinders">{e.cylinders}</Row>
              <Row k="Fuel">{e.fuel}</Row>
              <Row k="Consumption, WLTP" unit="l/100 km">{e.consumptionCombinedL100}</Row>
              <Row k="CO2, WLTP" unit="g/km">{e.co2CombinedGkm}</Row>
              <Row k="Emissions class">{e.emissionsClass}</Row>
            </>
          )}
        </dl>

        <h3 className="mb-2 mt-8 font-[family-name:var(--font-lot)] text-[10px] uppercase tracking-[0.18em] text-[var(--stamp)]">
          Tyres
        </h3>
        <dl>
          <Row k="Tread, front" unit="mm">{lot.tyres.frontMm.toFixed(1)}</Row>
          <Row k="Tread, rear" unit="mm">{lot.tyres.rearMm.toFixed(1)}</Row>
          <Row k="Season">{lot.tyres.season}</Row>
          <Row k="Second set">{lot.tyres.secondSetIncluded ? "Included" : "Not included"}</Row>
        </dl>
      </section>
    </div>
  );
}

export default async function LotPage({ params }: { params: Promise<{ stock: string }> }) {
  const { stock } = await params;
  const lot = LOTS.find((l) => l.stockNumber === stock);
  if (!lot) notFound();

  const idx = LOTS.findIndex((l) => l.stockNumber === stock);
  const prev = LOTS[idx - 1];
  const next = LOTS[idx + 1];
  const quoted = lot.advisories.filter((a) => a.quoteEur);
  const quoteTotal = quoted.reduce((n, a) => n + (a.quoteEur ?? 0), 0);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-24 pt-8 md:px-10">
      <nav aria-label="Breadcrumb" className="font-[family-name:var(--font-lot)] text-[11px] uppercase tracking-[0.16em] text-[var(--ink-35)]">
        <Link href="/proof/car" className="underline decoration-[var(--rule)] underline-offset-4 hover:text-[var(--ink)]">
          Sale {SALE.number}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--ink-60)]">Lot {lot.lot}</span>
      </nav>

      {/* Lot header. Grade is the organising fact, so it sits with the identity, not the price. */}
      <header className="mt-5 border-b border-[var(--rule)] pb-7">
        <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-5">
          <div className="min-w-0 flex-1">
            <p className="font-[family-name:var(--font-lot)] text-[13px] tabular-nums text-[var(--ink-35)]">
              <span className="text-[10px] uppercase tracking-[0.16em]">Lot </span>
              <span className="text-2xl font-bold text-[var(--ink)]">{lot.lot}</span>
              <span className="ml-3">{lot.stockNumber}</span>
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-plate)] text-[clamp(2rem,4.6vw,3.4rem)] leading-[1] tracking-[-0.02em]">
              {lot.make} {lot.model}
              <span className="block text-[var(--ink-60)]">{lot.trim}</span>
            </h1>
          </div>

          <div className="flex items-start gap-6">
            <div className="text-center">
              <span
                aria-hidden
                className="grid h-16 w-16 -rotate-6 place-items-center border-[3px] border-[var(--stamp)] font-[family-name:var(--font-lot)] text-3xl font-bold text-[var(--stamp)]"
                style={{ borderRadius: 2 }}
              >
                {lot.grade}
              </span>
              <p className="mt-2 font-[family-name:var(--font-lot)] text-[10px] uppercase tracking-[0.14em] text-[var(--ink-35)]">
                Grade
              </p>
            </div>
            <div className="text-right">
              <p className="font-[family-name:var(--font-lot)] text-[10px] uppercase tracking-[0.16em] text-[var(--ink-35)]">
                Hammer estimate
              </p>
              <p className="font-[family-name:var(--font-lot)] text-[clamp(1.15rem,2.2vw,1.6rem)] font-medium tabular-nums">
                {fmtEur(lot.estimate.low)} to {fmtEur(lot.estimate.high)}
              </p>
              <p className="font-[family-name:var(--font-lot)] text-[11px] text-[var(--ink-35)]">
                EUR / {lot.vat.kind === "margin_scheme" ? lot.vat.statute : `${lot.vat.ratePercent}% MwSt. ausweisbar`}
              </p>
              {lot.status !== "available" ? (
                <p className="mt-1 font-[family-name:var(--font-lot)] text-[11px] uppercase tracking-[0.16em] text-[var(--stamp)]">
                  {lot.status}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-[68ch] text-[15px] leading-relaxed text-[var(--ink-60)]">
          {GRADE_KEY[lot.grade].note} Standing at {lot.location}. Odometer read {lot.mileage.readAt}.
        </p>
      </header>

      {/* Advisories first. In this world the condition report is the artifact, not an apology
          buried under a gallery. A grade A lot says so in the same place. */}
      <section aria-labelledby="adv" className="border-b border-[var(--rule)] py-9">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="adv" className="font-[family-name:var(--font-plate)] text-3xl tracking-[-0.01em]">
            Advisories
          </h2>
          {quoteTotal > 0 ? (
            <p className="font-[family-name:var(--font-lot)] text-[13px] tabular-nums text-[var(--ink-60)]">
              Rectification quoted at{" "}
              <span className="font-bold text-[var(--ink)]">{fmtEur(quoteTotal)} EUR</span>
            </p>
          ) : null}
        </div>

        {lot.advisories.length === 0 ? (
          <p className="mt-4 max-w-[66ch] text-[15px] leading-relaxed">
            None recorded at inspection on {lot.mileage.readAt}. Paint gauge readings and the
            inspection sheet are in the lot file and travel with the car.
          </p>
        ) : (
          <ol className="mt-5">
            {lot.advisories.map((a, i) => (
              <li key={a.item} className="grid grid-cols-[2rem_1fr_auto] gap-x-4 border-t border-[var(--rule)] py-4">
                <span className="font-[family-name:var(--font-lot)] text-[13px] tabular-nums text-[var(--stamp)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="font-[family-name:var(--font-lot)] text-[13px] font-medium">{a.item}</p>
                  <p className="mt-1 max-w-[62ch] text-[14.5px] leading-relaxed text-[var(--ink-60)]">
                    {a.detail}
                  </p>
                </div>
                <span className="font-[family-name:var(--font-lot)] text-[13px] tabular-nums text-[var(--ink-60)]">
                  {a.quoteEur ? `${fmtEur(a.quoteEur)} EUR` : <span className="text-[var(--ink-35)]">no quote</span>}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* The measurement register. */}
      <section aria-labelledby="reg" className="border-b border-[var(--rule)] py-9">
        <h2 id="reg" className="mb-6 font-[family-name:var(--font-plate)] text-3xl tracking-[-0.01em]">
          Register
        </h2>
        <Register lot={lot} />
      </section>

      {/* Service history as a chronological log, not a collapsed accordion. */}
      <section aria-labelledby="svc" className="border-b border-[var(--rule)] py-9">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="svc" className="font-[family-name:var(--font-plate)] text-3xl tracking-[-0.01em]">
            Service log
          </h2>
          <p className="font-[family-name:var(--font-lot)] text-[12px] uppercase tracking-[0.14em] text-[var(--ink-35)]">
            {lot.serviceComplete ? "Book complete" : "Book incomplete"}
          </p>
        </div>
        <ol className="mt-5">
          {lot.serviceEntries.map((s) => (
            <li key={s.date} className="grid grid-cols-[6.5rem_1fr] gap-x-5 gap-y-1 border-t border-[var(--rule)] py-4 sm:grid-cols-[6.5rem_7rem_1fr]">
              <span className="font-[family-name:var(--font-lot)] text-[13px] tabular-nums">{s.date}</span>
              <span className="font-[family-name:var(--font-lot)] text-[13px] tabular-nums text-[var(--ink-35)]">
                {fmtKm(s.mileage)} km
              </span>
              <span className="col-span-2 text-[14.5px] leading-snug text-[var(--ink-60)] sm:col-span-1">
                {s.work}
                <span className="text-[var(--ink-35)]"> / {s.workshop}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* A named person with a direct line beats every trust badge. */}
      <section aria-labelledby="ct" className="border-b border-[var(--rule)] py-9">
        <h2 id="ct" className="font-[family-name:var(--font-plate)] text-3xl tracking-[-0.01em]">
          Viewing this lot
        </h2>
        <div className="mt-5 grid gap-x-12 gap-y-6 sm:grid-cols-2">
          <div>
            <p className="max-w-[58ch] text-[15px] leading-relaxed text-[var(--ink-60)]">
              Viewing from {SALE.viewingFrom} at {lot.location}. Bring a licence and ID for a road
              test. Forty-five minutes, no appointment needed before 16:00.
            </p>
            <a
              href="tel:+494321000000"
              className="mt-5 inline-block border border-[var(--ink)] px-5 py-2.5 font-[family-name:var(--font-lot)] text-xs uppercase tracking-[0.14em] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--stamp)]"
              style={{ borderRadius: 2 }}
            >
              Call the yard
            </a>
          </div>
          <dl className="font-[family-name:var(--font-lot)] text-[13px]">
            <Row k="Lot handler">Marek Sobota</Row>
            <Row k="Direct">+49 4321 000000</Row>
            <Row k="Standing at">{lot.location}</Row>
            <Row k="Record updated">{lot.updatedAt}</Row>
          </dl>
        </div>
      </section>

      <nav aria-label="Adjacent lots" className="flex items-stretch justify-between gap-4 py-8">
        {prev ? (
          <Link href={`/proof/car/${prev.stockNumber}`} className="group max-w-[45%] text-left">
            <span className="font-[family-name:var(--font-lot)] text-[10px] uppercase tracking-[0.16em] text-[var(--ink-35)]">
              Lot {prev.lot}
            </span>
            <span className="block font-[family-name:var(--font-plate)] text-lg leading-tight group-hover:underline group-hover:underline-offset-4">
              {prev.make} {prev.model}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/proof/car/${next.stockNumber}`} className="group max-w-[45%] text-right">
            <span className="font-[family-name:var(--font-lot)] text-[10px] uppercase tracking-[0.16em] text-[var(--ink-35)]">
              Lot {next.lot}
            </span>
            <span className="block font-[family-name:var(--font-plate)] text-lg leading-tight group-hover:underline group-hover:underline-offset-4">
              {next.make} {next.model}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <p className="border-t border-[var(--rule)] pt-5 font-[family-name:var(--font-lot)] text-[11px] text-[var(--ink-35)]">
        {SALE.note}
      </p>
    </main>
  );
}
