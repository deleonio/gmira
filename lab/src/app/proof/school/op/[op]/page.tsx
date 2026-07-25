import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ACTIVE_COHORT,
  CAPSTONE_OP,
  INSTRUCTORS,
  MODULES,
  SHOP,
  instructorById,
  moduleByOp,
  opNumber,
  stampsFor,
  weekLabel,
  type Module,
  type Session,
} from "../../data";
import {
  Block,
  CardFoot,
  Field,
  MarginBlock,
  Masthead,
  StampBox,
  TravellerCard,
  WorkOrderRail,
} from "../../parts";

/* The routing is a closed set: OP 010 to OP 080 are issued, OP 090 is not released yet,
   nothing else was ever printed. `dynamicParams = false` makes an unissued sheet a real
   404 rather than a 200 carrying an apology, which `notFound()` alone cannot do here
   because loading.tsx opens a Suspense boundary and flushes the status first. */
export const dynamicParams = false;

export function generateStaticParams() {
  return MODULES.map((m) => ({ op: opNumber(m.index) }));
}

export async function generateMetadata({ params }: { params: Promise<{ op: string }> }) {
  const { op } = await params;
  const m = moduleByOp(op);
  if (!m) return { title: "Operation sheet not found" };
  return {
    title: `OP ${op} / ${m.title} / AIE-12`,
    description: `${m.thesis} Produces: ${m.deliverable.name}. ${m.deliverable.acceptanceCriteria.length} acceptance criteria, ${m.deliverable.estimatedHours} bench hours.`,
  };
}

const KIND_LABEL: Record<Session["kind"], string> = {
  lecture: "Lecture",
  workshop: "Workshop",
  review: "Review",
  office_hours: "Office hours",
  guest: "Guest",
  lab: "Lab",
};

function workCentres(m: Module) {
  const seen: Session["kind"][] = [];
  for (const s of m.sessions) if (!seen.includes(s.kind)) seen.push(s.kind);
  return seen.map((k) => KIND_LABEL[k]).join(" / ");
}

export default async function OperationSheet({ params }: { params: Promise<{ op: string }> }) {
  const { op } = await params;
  const m = moduleByOp(op);
  if (!m) notFound();

  const idx = MODULES.findIndex((x) => x.id === m.id);
  const prev = MODULES[idx - 1];
  const next = MODULES[idx + 1];
  const stamps = stampsFor(m);
  const operators = INSTRUCTORS.filter((i) => i.teachesModuleIds.includes(m.id));
  const before = m.prerequisiteModuleIds
    .map((id) => MODULES.find((x) => x.id === id))
    .filter((x): x is Module => Boolean(x));
  const liveMinutes = m.sessions.reduce((n, s) => n + s.durationMinutes, 0);
  const requiredReading = m.readings.filter((r) => r.required);
  const readingMinutes = requiredReading.reduce((n, r) => n + r.minutes, 0);

  return (
    /* An operation sheet is one document, not a dashboard. Capped narrower than the
       routing index so the head does not open a field of empty card to the right. */
    <div className="mx-auto max-w-[1120px] px-4 pb-28 pt-5 sm:px-6 md:pt-8 xl:px-8 xl:pb-12">
      <Masthead crumb={`${SHOP.formNumber} rev ${SHOP.formRev} / sheet ${op}`} />

      <nav aria-label="Breadcrumb" className="mb-3">
        <Link
          href="/proof/school"
          className="tv-f-inv font-[family-name:var(--font-stamp)] text-[12.5px] tabular-nums text-[var(--bench-ink-2)] underline decoration-[var(--bench-ink-2)] underline-offset-4 transition-colors duration-150 hover:text-[var(--bench-ink)]"
        >
          Routing {SHOP.partNumber}
        </Link>
        <span className="px-2 font-[family-name:var(--font-stamp)] text-[12.5px] text-[var(--bench-ink-2)]">/</span>
        <span className="font-[family-name:var(--font-stamp)] text-[12.5px] tabular-nums text-[var(--bench-ink)]">
          OP {op}
        </span>
      </nav>

      <main className="min-w-0">
        <TravellerCard>
          {/* ------------------------------------------------------ sheet head */}
          <header className="pb-6">
            <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
              <div className="min-w-0 flex-1">
                <p className="font-[family-name:var(--font-stamp)] text-[13px] tabular-nums text-[var(--ink-3)]">
                  Operation sheet
                  <span className="px-2 text-[var(--rule-2)]">/</span>
                  part {SHOP.partNumber}
                  <span className="px-2 text-[var(--rule-2)]">/</span>
                  routing rev {SHOP.routingRev}
                </p>
                <p className="mt-1 font-[family-name:var(--font-stamp)] text-[clamp(2.6rem,7vw,3.6rem)] font-bold leading-none tabular-nums">
                  OP {op}
                </p>
                <h1 className="mt-2 max-w-[22ch] font-[family-name:var(--font-form)] text-[clamp(1.9rem,4.4vw,3rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
                  {m.title}
                </h1>
              </div>

              <div className="flex shrink-0 flex-wrap items-start gap-3 pt-2">
                {operators.map((o) => (
                  <div key={o.id} className="text-center">
                    <StampBox code={o.stamp} label={`Operator ${o.name}, stamp ${o.stamp}`} size="lg" rotate={-5} />
                    <p className="mt-2.5 font-[family-name:var(--font-stamp)] text-[11.5px] text-[var(--ink-3)]">
                      {o.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-3.5 sm:grid-cols-3 lg:grid-cols-6">
              <Field label="Weeks" strong>
                {weekLabel(m.weekRange).replace("WK ", "")}
              </Field>
              <Field label="Work centre">{workCentres(m)}</Field>
              <Field label="Live" strong>
                {liveMinutes} min
              </Field>
              <Field label="Bench hrs" strong>
                {m.deliverable.estimatedHours}
              </Field>
              <Field label="Artifact">{m.deliverable.artifactType.replace(/_/g, " ")}</Field>
              <Field label="Operator">{stamps.join(" ")}</Field>
            </dl>

            <p className="mt-6 max-w-[32rem] text-[16px] leading-relaxed">{m.thesis}</p>

            {before.length > 0 ? (
              <p className="mt-4 font-[family-name:var(--font-stamp)] text-[12.5px] text-[var(--ink-2)]">
                <span className="uppercase tracking-[0.08em] text-[var(--ink-3)]">Preceding ops must be stamped: </span>
                {before.map((b, i) => (
                  <span key={b.id}>
                    {i > 0 ? ", " : ""}
                    <Link
                      href={`/proof/school/op/${opNumber(b.index)}`}
                      className="tv-f tabular-nums text-[var(--stamp)] underline decoration-[var(--rule)] underline-offset-4 transition-colors duration-150 hover:decoration-[var(--stamp)]"
                    >
                      OP {opNumber(b.index)}
                    </Link>
                  </span>
                ))}
              </p>
            ) : (
              <p className="mt-4 font-[family-name:var(--font-stamp)] text-[12.5px] text-[var(--ink-2)]">
                <span className="uppercase tracking-[0.08em] text-[var(--ink-3)]">Preceding ops: </span>
                none. This is the first operation on the routing.
              </p>
            )}
          </header>

          {/* ----------------------------------------------- routing position */}
          <nav
            aria-label="Position on the AIE-12 routing"
            className="border-y-[1.5px] border-[var(--rule-2)] py-3"
          >
            <ol className="flex flex-wrap items-center gap-1.5">
              {MODULES.map((x) => {
                const o = opNumber(x.index);
                const here = o === op;
                return (
                  <li key={x.id}>
                    <Link
                      href={`/proof/school/op/${o}`}
                      aria-current={here ? "step" : undefined}
                      title={x.title}
                      className={`tv-f block border px-2.5 py-1.5 font-[family-name:var(--font-stamp)] text-[13px] tabular-nums transition-colors duration-150 ${
                        here
                          ? "border-[var(--ink)] bg-[var(--ink)] font-bold text-[var(--card)]"
                          : "border-[var(--rule)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                      }`}
                      style={{ borderRadius: 0 }}
                    >
                      {o}
                    </Link>
                  </li>
                );
              })}
              <li>
                <span
                  className="block border border-dashed border-[var(--rule-2)] px-2.5 py-1.5 font-[family-name:var(--font-stamp)] text-[13px] tabular-nums text-[var(--ink-3)]"
                  style={{ borderRadius: 0 }}
                >
                  {CAPSTONE_OP}
                </span>
              </li>
            </ol>
          </nav>

          {/* ------------------------------------------------- feature produced */}
          <div className="mt-8">
            <Block
              id="feature"
              caption="Feature produced and inspection characteristics"
              meta={`${m.deliverable.acceptanceCriteria.length} characteristics / ${m.deliverable.estimatedHours} bench hours`}
            >
              <p className="max-w-[32rem] font-[family-name:var(--font-form)] text-[clamp(1.15rem,2.2vw,1.45rem)] font-semibold leading-snug">
                {m.deliverable.name}
              </p>
              <p className="mt-2 max-w-[32rem] text-[14px] leading-snug text-[var(--ink-2)]">
                Stamped when every characteristic below passes at the Thursday review. These are
                checks, not adjectives: a reviewer either can or cannot run them in front of you.
              </p>

              <ol className="mt-5 border-t-[1.5px] border-[var(--rule-2)]">
                {m.deliverable.acceptanceCriteria.map((c, i) => (
                  <li
                    key={c}
                    className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-2.5 border-b border-[var(--rule)] py-3 sm:grid-cols-[3rem_minmax(0,1fr)_2.5rem] sm:gap-x-3"
                  >
                    <span className="font-[family-name:var(--font-stamp)] text-[13px] tabular-nums text-[var(--ink-3)]">
                      {String((i + 1) * 10).padStart(3, "0")}
                    </span>
                    <p className="max-w-[32rem] text-[15px] leading-snug">{c}</p>
                    <span
                      aria-hidden
                      className="mt-0.5 hidden h-4 w-4 justify-self-end border border-[var(--rule-2)] sm:block"
                      style={{ borderRadius: 0 }}
                    />
                  </li>
                ))}
              </ol>
              <p className="mt-3 font-[family-name:var(--font-stamp)] text-[11.5px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                Boxes are stamped by the reviewer at the review, not by you
              </p>
            </Block>
          </div>

          {/* ------------------------------------------------ nonconformance */}
          <div className="mt-8">
            <section
              aria-labelledby="ncr"
              className="border-[1.5px] border-[var(--hold)] bg-[var(--card-3)]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-[1.5px] border-[var(--hold)] px-4 py-2 md:px-5">
                <h2
                  id="ncr"
                  className="font-[family-name:var(--font-form)] text-[17px] font-semibold uppercase leading-tight tracking-[0.1em] text-[var(--hold)]"
                >
                  Nonconformance note, carried forward
                </h2>
                <p className="font-[family-name:var(--font-stamp)] text-[11.5px] uppercase tabular-nums text-[var(--hold)]">
                  Raised on a previous lot
                </p>
              </div>
              <div className="grid gap-4 px-4 py-5 md:grid-cols-[4.5rem_minmax(0,1fr)] md:px-5">
                <div>
                  <StampBox code="NCR" label="Nonconformance report" tone="hold" size="md" rotate={-6} />
                </div>
                <p className="max-w-[32rem] text-[15.5px] leading-relaxed">{m.commonFailure}</p>
              </div>
            </section>
          </div>

          {/* ------------------------------------------------- process steps */}
          <div className="mt-8">
            <MarginBlock
              id="steps"
              caption="Process steps"
              meta={`${m.sessions.length} live sessions / ${liveMinutes} minutes / ${ACTIVE_COHORT.timezone}`}
            >
              <ol className="border-t-[1.5px] border-[var(--rule-2)]">
                {m.sessions.map((s, i) => (
                  <li
                    key={s.id}
                    className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 border-b border-[var(--rule)] py-3 md:grid-cols-[2.5rem_7rem_minmax(0,1fr)_8rem]"
                  >
                    <span className="font-[family-name:var(--font-stamp)] text-[13px] tabular-nums text-[var(--ink-3)]">
                      {String((i + 1) * 10).padStart(3, "0")}
                    </span>
                    <p className="font-[family-name:var(--font-stamp)] text-[12px] uppercase tracking-[0.06em] text-[var(--ink-2)]">
                      {KIND_LABEL[s.kind]}
                    </p>
                    <div className="col-span-2 min-w-0 md:col-span-1">
                      <p className="max-w-[32rem] text-[14.5px] leading-snug">{s.title}</p>
                      <p className="mt-0.5 font-[family-name:var(--font-stamp)] text-[11.5px] text-[var(--ink-3)]">
                        {s.recorded
                          ? `Recorded, kept ${s.recordingRetentionMonths} months`
                          : "Not recorded, on purpose"}
                        <span className="px-1.5">/</span>
                        {s.materials.length > 0
                          ? s.materials.map((x) => x.kind).join(", ")
                          : "no materials"}
                        <span className="px-1.5">/</span>
                        {s.instructorIds.map((id) => instructorById(id)?.stamp ?? id).join(" ")}
                      </p>
                    </div>
                    <p className="col-span-2 font-[family-name:var(--font-stamp)] text-[12.5px] tabular-nums text-[var(--ink-2)] md:col-span-1 md:text-right">
                      {s.liveAt?.replace("T", " ")}
                      <span className="block text-[11px] text-[var(--ink-3)]">
                        {s.durationMinutes} min, {s.timezone}
                      </span>
                    </p>
                  </li>
                ))}
              </ol>
            </MarginBlock>
          </div>

          {/* --------------------------------------------- process knowledge */}
          <MarginBlock id="concepts" caption="Process knowledge" meta="Named concepts, not tool logos" space="py-7">
            <ul className="flex flex-wrap gap-x-2 gap-y-2">
              {m.concepts.map((c) => (
                <li
                  key={c}
                  className="border border-[var(--rule)] px-2.5 py-1 font-[family-name:var(--font-stamp)] text-[13px] text-[var(--ink)]"
                  style={{ borderRadius: 0 }}
                >
                  {c}
                </li>
              ))}
            </ul>
          </MarginBlock>

          {/* ------------------------------------------------ reference docs */}
          <div className="mt-3">
            <Block
              id="refs"
              caption="Reference documents"
              meta={`${requiredReading.length} required / ${readingMinutes} minutes`}
            >
              <ul>
                {m.readings.map((r, i) => (
                  <li
                    key={r.url + r.title}
                    className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-[var(--rule)] py-3 last:border-b-0 md:grid-cols-[3rem_minmax(0,1fr)_6rem_4rem]"
                  >
                    <span className="font-[family-name:var(--font-stamp)] text-[13px] tabular-nums text-[var(--ink-3)]">
                      D{String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <a
                        href={r.url}
                        className="tv-f max-w-[32rem] text-[15px] font-medium leading-snug underline decoration-[var(--rule)] underline-offset-4 transition-colors duration-150 hover:decoration-[var(--ink)]"
                      >
                        {r.title}
                      </a>
                      <p className="mt-0.5 text-[13.5px] leading-snug text-[var(--ink-2)]">{r.author}</p>
                      <p className="mt-0.5 font-[family-name:var(--font-stamp)] text-[11.5px] text-[var(--ink-3)] break-all">
                        {r.url}
                      </p>
                    </div>
                    <p
                      className="font-[family-name:var(--font-stamp)] text-[12px] uppercase tracking-[0.06em]"
                      style={{ color: r.required ? "var(--hold)" : "var(--ink-3)" }}
                    >
                      {r.required ? "Required" : "Optional"}
                    </p>
                    <p className="font-[family-name:var(--font-stamp)] text-[12.5px] tabular-nums text-[var(--ink-2)] md:text-right">
                      {r.minutes} min
                    </p>
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          {/* ------------------------------------------------ adjacent ops */}
          <nav
            aria-label="Adjacent operations"
            className="mt-8 grid gap-4 border-t-[1.5px] border-[var(--rule-2)] pt-5 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/proof/school/op/${opNumber(prev.index)}`}
                className="tv-f group block border border-[var(--rule)] p-3 transition-colors duration-150 hover:bg-[var(--card-2)]"
                style={{ borderRadius: 0 }}
              >
                <span className="font-[family-name:var(--font-stamp)] text-[12px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                  Preceding op {opNumber(prev.index)}
                </span>
                <span className="mt-1 block font-[family-name:var(--font-form)] text-[19px] font-semibold uppercase leading-tight tracking-[0.02em]">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <p className="border border-dashed border-[var(--rule)] p-3 font-[family-name:var(--font-stamp)] text-[12.5px] text-[var(--ink-3)]">
                No preceding operation. OP {op} is where the routing starts.
              </p>
            )}
            {next ? (
              <Link
                href={`/proof/school/op/${opNumber(next.index)}`}
                className="tv-f group block border border-[var(--rule)] p-3 text-right transition-colors duration-150 hover:bg-[var(--card-2)]"
                style={{ borderRadius: 0 }}
              >
                <span className="font-[family-name:var(--font-stamp)] text-[12px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                  Following op {opNumber(next.index)}
                </span>
                <span className="mt-1 block font-[family-name:var(--font-form)] text-[19px] font-semibold uppercase leading-tight tracking-[0.02em]">
                  {next.title}
                </span>
              </Link>
            ) : (
              <p className="border border-dashed border-[var(--rule)] p-3 text-right font-[family-name:var(--font-stamp)] text-[12.5px] text-[var(--ink-3)]">
                Following op {CAPSTONE_OP}, capstone. Sheet released in week 9.
              </p>
            )}
          </nav>

          <CardFoot />
        </TravellerCard>
      </main>

      <WorkOrderRail />
    </div>
  );
}
