import Link from "next/link";
import {
  ACTIVE_COHORT,
  ADMISSION,
  ARTIFACT_TYPES,
  ASSESSMENT,
  CAPSTONE,
  CAPSTONE_OP,
  COHORTS,
  CREDENTIAL,
  EXPECTED_BACKGROUND,
  INSTRUCTORS,
  MODULES,
  NOT_FOR_YOU_IF,
  OUTCOMES,
  OUT_OF_SCOPE,
  PREREQUISITES,
  PRICING,
  PROGRAM,
  RUBRIC,
  SHOP,
  TOOLCHAIN,
  TOTAL_DELIVERABLE_HOURS,
  TOTAL_SESSIONS,
  WEEKDAY_SHORT,
  fmtNum,
  opNumber,
  stampsFor,
  weekLabel,
  type Module,
} from "./data";
import {
  Block,
  Cap,
  CardFoot,
  Field,
  MarginBlock,
  Masthead,
  StampBox,
  TravellerCard,
  WorkOrderCard,
  WorkOrderRail,
} from "./parts";

const artifactLabel = (t: Module["deliverable"]["artifactType"]) => t.replace(/_/g, " ");

const chip =
  "tv-f border px-2.5 py-1 font-[family-name:var(--font-stamp)] text-[12px] uppercase tabular-nums transition-colors duration-150";

export default async function RoutingPage({
  searchParams,
}: {
  searchParams: Promise<{ artifact?: string }>;
}) {
  const { artifact } = await searchParams;
  const active = ARTIFACT_TYPES.includes(artifact as Module["deliverable"]["artifactType"])
    ? (artifact as Module["deliverable"]["artifactType"])
    : null;
  const ops = active ? MODULES.filter((m) => m.deliverable.artifactType === active) : MODULES;
  const liveWeekly = PROGRAM.weeklyCommitment.liveHours + PROGRAM.weeklyCommitment.asyncHours;

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-28 pt-5 sm:px-6 md:pt-8 xl:px-8 xl:pb-12">
      <Masthead />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <main className="min-w-0">
          <TravellerCard>
            {/* ---------------------------------------------------- card head */}
            <header className="pb-7">
              <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
                {/* Below 768 the stamp takes its own line above the title. A stamp squeezed
                    into a phone-width flex row leaves the positioning sentence 17 characters
                    wide, which is how a measure floor gets broken by a decoration. */}
                <div className="order-2 w-full min-w-0 md:order-1 md:w-auto md:flex-1">
                  <p className="font-[family-name:var(--font-stamp)] text-[13px] tabular-nums text-[var(--ink-3)]">
                    Part no.{" "}
                    <span className="font-semibold text-[var(--ink)]">{SHOP.partNumber}</span>
                    <span className="px-2 text-[var(--rule-2)]">/</span>
                    routing rev {SHOP.routingRev}
                    <span className="px-2 text-[var(--rule-2)]">/</span>
                    lot {ACTIVE_COHORT.id.toUpperCase()}
                  </p>
                  <h1 className="mt-1.5 font-[family-name:var(--font-form)] text-[clamp(2.5rem,6.2vw,4.25rem)] font-bold uppercase leading-[0.9] tracking-[-0.02em]">
                    Applied
                    <br />
                    AI Engineering
                  </h1>
                  <p className="mt-4 max-w-[32rem] text-[15.5px] leading-relaxed text-[var(--ink-2)]">
                    {PROGRAM.positioning}
                  </p>
                </div>

                {/* The one authored moment: this stamp presses on load, once. Everything it
                    says is also in the field grid below, so nothing depends on it. */}
                <div aria-hidden className="tv-press order-1 ml-auto shrink-0 md:order-2 md:pt-2 md:pr-2">
                  <div
                    className="grid place-items-center border-[3px] border-[var(--stamp)] px-4 py-2 text-center"
                    style={{ borderRadius: 0 }}
                  >
                    <span className="font-[family-name:var(--font-stamp)] text-[19px] font-bold uppercase leading-none tracking-[0.14em] text-[var(--stamp)]">
                      Released
                    </span>
                    <span className="mt-1 font-[family-name:var(--font-stamp)] text-[12.5px] tabular-nums text-[var(--stamp)]">
                      {ACTIVE_COHORT.startsOn}
                    </span>
                  </div>
                </div>
              </div>

              <dl className="mt-7 grid grid-cols-2 gap-x-5 gap-y-3.5 sm:grid-cols-3 lg:grid-cols-6">
                <Field label="Part no." strong>
                  {SHOP.partNumber}
                </Field>
                <Field label="Routing rev" strong>
                  {SHOP.routingRev}
                </Field>
                <Field label="Lot" strong>
                  {ACTIVE_COHORT.id.toUpperCase()}
                </Field>
                <Field label="Released">{ACTIVE_COHORT.startsOn}</Field>
                <Field label="Due">{ACTIVE_COHORT.endsOn}</Field>
                <Field label="Operations">{MODULES.length + 1}</Field>
                <Field label="Qty released">{ACTIVE_COHORT.capacity}</Field>
                <Field label="Qty open">{ACTIVE_COHORT.seatsRemaining}</Field>
                <Field label="Live hours">{PROGRAM.totalContactHours}</Field>
                <Field label="Bench hours">{TOTAL_DELIVERABLE_HOURS}</Field>
                <Field label="Shop">Live online, {ACTIVE_COHORT.timezone}</Field>
                <Field label="Planner">{SHOP.plannerStamp}</Field>
              </dl>

              <p className="mt-5 max-w-[32rem] text-[14px] leading-relaxed text-[var(--ink-2)]">
                {SHOP.why}
              </p>
            </header>

            {/* -------------------------------------------- incoming inspection */}
            <MarginBlock
              id="incoming"
              caption="Incoming inspection"
              meta={`${PREREQUISITES.filter((p) => p.hard).length} reject on fail, ${PREREQUISITES.filter((p) => !p.hard).length} advisory`}
            >
              <p className="max-w-[32rem] text-[15px] leading-relaxed">
                Material is checked before it enters OP 010, not after. Four of these stop an
                application. Two are advisory and we will say so at the screen rather than
                quietly hold them against you.
              </p>

              <ul className="mt-5">
                {PREREQUISITES.map((p) => (
                  <li key={p.requirement} className="border-t border-[var(--rule)] py-3.5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span
                        className="font-[family-name:var(--font-stamp)] text-[11px] font-semibold uppercase tracking-[0.08em]"
                        style={{ color: p.hard ? "var(--hold)" : "var(--ink-3)" }}
                      >
                        {p.hard ? "Reject on fail" : "Advisory"}
                      </span>
                      <p className="w-full max-w-[32rem] text-[15px] leading-snug sm:w-auto sm:flex-1">
                        {p.requirement}
                      </p>
                    </div>
                    {p.selfCheck ? (
                      <p className="mt-2 max-w-[30rem] border-l border-[var(--rule)] pl-3 text-[13.5px] leading-snug text-[var(--ink-2)]">
                        <span className="font-[family-name:var(--font-stamp)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                          Self check.{" "}
                        </span>
                        {p.selfCheck}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>

              <div className="mt-7 grid gap-x-8 gap-y-6 md:grid-cols-2">
                <div>
                  <h3 className="font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.09em] text-[var(--ink)]">
                    Material specification
                  </h3>
                  <ul className="mt-2.5">
                    {EXPECTED_BACKGROUND.map((b) => (
                      <li
                        key={b}
                        className="border-t border-[var(--rule)] py-2 text-[14px] leading-snug text-[var(--ink-2)]"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.09em] text-[var(--hold)]">
                    Reject tags
                  </h3>
                  <ul className="mt-2.5">
                    {NOT_FOR_YOU_IF.map((n) => (
                      <li
                        key={n}
                        className="border-t border-[var(--rule)] py-2 text-[14px] leading-snug text-[var(--ink-2)]"
                      >
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </MarginBlock>

            {/* ------------------------------------------------------- routing */}
            <div className="mt-9">
              <Block
                id="routing"
                caption="Routing"
                meta={`${MODULES.length + 1} operations / ${PROGRAM.durationWeeks} weeks / ${TOTAL_SESSIONS} live sessions`}
              >
                <nav
                  aria-label="Filter the routing by the artifact each operation produces"
                  className="flex flex-wrap items-center gap-1.5"
                >
                  <Cap className="mr-1.5">Artifact</Cap>
                  <Link
                    href="/proof/school"
                    aria-current={!active ? "page" : undefined}
                    className={`${chip} ${
                      !active
                        ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--card)]"
                        : "border-[var(--rule)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    All {MODULES.length + 1}
                  </Link>
                  {ARTIFACT_TYPES.map((t) => {
                    const n = MODULES.filter((m) => m.deliverable.artifactType === t).length;
                    const on = active === t;
                    return (
                      <Link
                        key={t}
                        href={`/proof/school?artifact=${t}`}
                        aria-current={on ? "page" : undefined}
                        className={`${chip} ${
                          on
                            ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--card)]"
                            : "border-[var(--rule)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                        }`}
                        style={{ borderRadius: 0 }}
                      >
                        {artifactLabel(t)} <span className={on ? "" : "text-[var(--ink-3)]"}>{n}</span>
                      </Link>
                    );
                  })}
                </nav>

                {ops.length === 0 ? (
                  <div className="mt-6 border-t border-[var(--rule)] pt-8 pb-4">
                    <h3 className="font-[family-name:var(--font-form)] text-[24px] font-semibold uppercase leading-tight tracking-[0.02em]">
                      No operation on this routing produces a {artifactLabel(active!)}
                    </h3>
                    <p className="mt-2 max-w-[32rem] text-[15px] leading-relaxed text-[var(--ink-2)]">
                      That is a real answer rather than an empty shelf. Nobody here hands you a
                      corpus. You bring 2,000 documents of your own to OP 030 and the eval set in
                      OP 020 is one you wrote.
                    </p>
                    <Link
                      href="/proof/school"
                      className="tv-f mt-5 inline-block border-2 border-[var(--ink)] px-4 py-2 font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.1em] transition-colors duration-150 hover:bg-[var(--ink)] hover:text-[var(--card)]"
                      style={{ borderRadius: 0 }}
                    >
                      Show the whole routing
                    </Link>
                  </div>
                ) : (
                  <ol className="mt-5 border-t-[1.5px] border-[var(--rule-2)]">
                    {ops.map((m) => {
                      const op = opNumber(m.index);
                      const stamps = stampsFor(m);
                      return (
                        <li key={m.id} className="border-b border-[var(--rule)]">
                          <Link
                            href={`/proof/school/op/${op}`}
                            className="tv-f grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 gap-y-3 py-5 md:gap-x-4 transition-colors duration-150 hover:bg-[var(--card-2)] lg:grid-cols-[5rem_minmax(0,1fr)_17rem]"
                          >
                            <div>
                              <span className="block font-[family-name:var(--font-stamp)] text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
                                Op
                              </span>
                              <span className="block font-[family-name:var(--font-stamp)] text-[24px] font-bold leading-none tabular-nums">
                                {op}
                              </span>
                              <span className="mt-3 block">
                                <StampBox
                                  code={stamps[0]}
                                  label={`Operator ${stamps.join(" and ")}`}
                                  size="sm"
                                />
                              </span>
                              {stamps.length > 1 ? (
                                <span
                                  aria-hidden
                                  className="mt-1.5 block font-[family-name:var(--font-stamp)] text-[11px] text-[var(--ink-3)]"
                                >
                                  +{stamps.slice(1).join(" ")}
                                </span>
                              ) : null}
                            </div>

                            <div className="min-w-0">
                              <h3 className="font-[family-name:var(--font-form)] text-[clamp(1.3rem,2.2vw,1.6rem)] font-semibold leading-tight tracking-[-0.005em]">
                                {m.title}
                              </h3>
                              <p className="mt-1.5 max-w-[32rem] text-[14.5px] leading-snug text-[var(--ink-2)]">
                                {m.deliverable.name}
                              </p>
                              <p className="mt-2 font-[family-name:var(--font-stamp)] text-[12px] text-[var(--ink-3)]">
                                {m.deliverable.acceptanceCriteria.length} acceptance criteria
                                <span className="px-1.5">/</span>
                                {m.sessions.length} live sessions
                              </p>
                            </div>

                            <dl className="col-span-2 grid grid-cols-3 gap-x-4 lg:col-span-1">
                              <div>
                                <dt>
                                  <Cap>Artifact</Cap>
                                </dt>
                                <dd className="mt-1 font-[family-name:var(--font-stamp)] text-[13px] uppercase">
                                  {artifactLabel(m.deliverable.artifactType)}
                                </dd>
                              </div>
                              <div>
                                <dt>
                                  <Cap>Weeks</Cap>
                                </dt>
                                <dd className="mt-1 font-[family-name:var(--font-stamp)] text-[13px] tabular-nums">
                                  {weekLabel(m.weekRange).replace("WK ", "")}
                                </dd>
                              </div>
                              <div>
                                <dt>
                                  <Cap>Bench hrs</Cap>
                                </dt>
                                <dd className="mt-1 font-[family-name:var(--font-stamp)] text-[13px] tabular-nums">
                                  {m.deliverable.estimatedHours}
                                </dd>
                              </div>
                            </dl>
                          </Link>
                        </li>
                      );
                    })}

                    {/* OP 090. The one operation whose sheet is not released yet, so the one
                        empty stamp box on the card. The control that would open it is
                        disabled and the reason is printed next to it, not hidden in a title. */}
                    {!active ? (
                      <li className="border-b border-[var(--rule)] bg-[var(--card-3)]">
                        <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 gap-y-3 py-5 md:gap-x-4 lg:grid-cols-[5rem_minmax(0,1fr)_17rem]">
                          <div>
                            <span className="block font-[family-name:var(--font-stamp)] text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
                              Op
                            </span>
                            <span className="block font-[family-name:var(--font-stamp)] text-[24px] font-bold leading-none tabular-nums text-[var(--ink-2)]">
                              {CAPSTONE_OP}
                            </span>
                            <span className="mt-3 block">
                              <StampBox label="No operator stamped. Sheet not released." tone="hold" />
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-[family-name:var(--font-form)] text-[clamp(1.3rem,2.2vw,1.6rem)] font-semibold leading-tight">
                              Capstone
                            </h3>
                            <p className="mt-1.5 max-w-[30rem] text-[14px] leading-snug text-[var(--ink-2)]">
                              {CAPSTONE.brief}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                              <button
                                type="button"
                                disabled
                                aria-describedby="op090-why"
                                className="cursor-not-allowed border-2 border-dashed border-[var(--rule-2)] px-3 py-1.5 font-[family-name:var(--font-form)] text-[14px] font-semibold uppercase tracking-[0.09em] text-[var(--ink-3)]"
                                style={{ borderRadius: 0 }}
                              >
                                Open OP 090 sheet
                              </button>
                              <span
                                id="op090-why"
                                className="font-[family-name:var(--font-stamp)] text-[12px] text-[var(--hold)]"
                              >
                                Sheet released on the first day of week {CAPSTONE.releasedInWeek}, with your
                                reviewer named two weeks ahead.
                              </span>
                            </div>
                          </div>
                          <dl className="col-span-2 grid grid-cols-3 gap-x-4 lg:col-span-1">
                            <div>
                              <dt>
                                <Cap>Artifact</Cap>
                              </dt>
                              <dd className="mt-1 font-[family-name:var(--font-stamp)] text-[13px] uppercase text-[var(--ink-2)]">
                                Yours
                              </dd>
                            </div>
                            <div>
                              <dt>
                                <Cap>Weeks</Cap>
                              </dt>
                              <dd className="mt-1 font-[family-name:var(--font-stamp)] text-[13px] tabular-nums text-[var(--ink-2)]">
                                09 to 12
                              </dd>
                            </div>
                            <div>
                              <dt>
                                <Cap>Bench hrs</Cap>
                              </dt>
                              <dd className="mt-1 font-[family-name:var(--font-stamp)] text-[13px] tabular-nums text-[var(--ink-2)]">
                                {CAPSTONE.estimatedHours}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </li>
                    ) : null}
                  </ol>
                )}

                <p className="mt-4 max-w-[29rem] text-[13.5px] leading-snug text-[var(--ink-2)]">
                  Every operation sheet is public before you pay, including its acceptance criteria
                  and the failure the last cohort hit. The template repository:
                  <span className="mt-1 block font-[family-name:var(--font-stamp)] text-[12.5px] break-all text-[var(--ink)]">
                    {PROGRAM.repositoryTemplateUrl}
                  </span>
                </p>
              </Block>
            </div>

            {/* --------------------------------------------- final inspection */}
            <div className="mt-9">
              <MarginBlock
                id="final-inspection"
                caption="Final inspection"
                meta={`${OUTCOMES.length} characteristics, each bound to the operation that evidences it`}
              >
                <ol>
                  {OUTCOMES.map((o, i) => {
                    const mod = MODULES.find((m) => m.id === o.evidencedBy)!;
                    const op = opNumber(mod.index);
                    return (
                      <li
                        key={o.statement}
                        className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 border-t border-[var(--rule)] py-3.5 sm:grid-cols-[2.5rem_minmax(0,1fr)_6.5rem]"
                      >
                        <span className="font-[family-name:var(--font-stamp)] text-[13px] tabular-nums text-[var(--ink-3)]">
                          {String((i + 1) * 10).padStart(3, "0")}
                        </span>
                        <p className="max-w-[32rem] text-[15px] leading-snug">{o.statement}</p>
                        <Link
                          href={`/proof/school/op/${op}`}
                          className="tv-f col-start-2 justify-self-start font-[family-name:var(--font-stamp)] text-[12.5px] tabular-nums text-[var(--stamp)] underline decoration-[var(--rule)] underline-offset-4 transition-colors duration-150 hover:decoration-[var(--stamp)] sm:col-start-3 sm:justify-self-end"
                        >
                          OP {op}
                        </Link>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-7">
                  <h3 className="font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.09em] text-[var(--ink)]">
                    Not on this routing
                  </h3>
                  <p className="mt-1.5 max-w-[32rem] text-[14px] leading-snug text-[var(--ink-2)]">
                    Printed because a syllabus that covers everything covers nothing, and because
                    you will otherwise find this out in week 5.
                  </p>
                  <ul className="mt-3 grid gap-x-8 md:grid-cols-2">
                    {OUT_OF_SCOPE.map((s) => (
                      <li
                        key={s}
                        className="border-t border-[var(--rule)] py-2 text-[14px] leading-snug text-[var(--ink-2)] line-through decoration-[var(--hold)] decoration-1"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </MarginBlock>
            </div>

            {/* --------------------------------------------------- shift pattern */}
            <MarginBlock
              id="shift"
              caption="Shift pattern"
              meta={`${PROGRAM.weeklyCommitment.liveHours} live plus ${PROGRAM.weeklyCommitment.asyncHours} bench hours a week`}
              space="py-8"
            >
              <div className="grid gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
                <div>
                  <h3 className="font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.09em]">
                    Live slots, every week, {ACTIVE_COHORT.timezone}
                  </h3>
                  <dl className="mt-3">
                    {ACTIVE_COHORT.liveSchedule.map((s) => (
                      <div
                        key={s.kind}
                        className="grid grid-cols-[3rem_4rem_3.5rem_minmax(0,1fr)] items-baseline gap-x-3 border-t border-[var(--rule)] py-2"
                      >
                        <dt className="font-[family-name:var(--font-stamp)] text-[13px] font-semibold">
                          {WEEKDAY_SHORT[s.weekday]}
                        </dt>
                        <dd className="font-[family-name:var(--font-stamp)] text-[13px] tabular-nums">
                          {s.startLocal}
                        </dd>
                        <dd className="font-[family-name:var(--font-stamp)] text-[13px] tabular-nums text-[var(--ink-2)]">
                          {s.durationMinutes} min
                        </dd>
                        <dd className="text-[14px] text-[var(--ink-2)]">{s.kind.replace(/_/g, " ")}</dd>
                      </div>
                    ))}
                    <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-3 border-t-[1.5px] border-[var(--rule-2)] py-2">
                      <dt className="font-[family-name:var(--font-stamp)] text-[13px] font-semibold">Sum</dt>
                      <dd className="font-[family-name:var(--font-stamp)] text-[13px] tabular-nums">
                        330 min, {PROGRAM.weeklyCommitment.liveHours} h live
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <p className="max-w-[32rem] text-[15px] leading-relaxed">
                    The bench figure is arithmetic, not a marketing number:{" "}
                    <span className="font-[family-name:var(--font-stamp)] tabular-nums">
                      {TOTAL_DELIVERABLE_HOURS} h
                    </span>{" "}
                    of deliverable estimates across nine operations, divided by{" "}
                    {PROGRAM.durationWeeks} weeks, is {PROGRAM.weeklyCommitment.asyncHours} hours a
                    week. With the live slots that is {liveWeekly} hours, and it lands on a Tuesday
                    to Friday evening.
                  </p>
                  <dl className="mt-4">
                    {[
                      ["Review format", ASSESSMENT.reviewFormat],
                      ["Feedback", `Written, inside ${ASSESSMENT.feedbackTurnaroundHours} hours of the review.`],
                      ["Attendance", ASSESSMENT.attendanceRule],
                      [
                        "Recordings",
                        "Every lecture, workshop and review is recorded and kept for 24 months. Office hours are not recorded, on purpose. The 24 months survive the cohort ending.",
                      ],
                      ["Support ratio", `${ACTIVE_COHORT.teachingAssistantRatio}. Cohort capped at ${ACTIVE_COHORT.capacity}.`],
                    ].map(([k, v]) => (
                      <div key={k} className="border-t border-[var(--rule)] py-2.5">
                        <dt>
                          <Cap>{k}</Cap>
                        </dt>
                        <dd className="mt-1 max-w-[30rem] text-[14px] leading-snug text-[var(--ink-2)]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </MarginBlock>

            {/* ------------------------------------------------------- tooling */}
            <div className="mt-3">
              <Block
                id="tooling"
                caption="Tooling and bill of material"
                meta={`${TOOLCHAIN.length} items / versions last reviewed ${PROGRAM.toolchainLastReviewedOn}`}
              >
                <ul>
                  {TOOLCHAIN.map((t) => (
                    <li
                      key={t.name}
                      className="grid gap-x-5 gap-y-1 border-b border-[var(--rule)] py-3 last:border-b-0 md:grid-cols-[14rem_minmax(0,1fr)_11rem]"
                    >
                      <div>
                        <p className="font-[family-name:var(--font-stamp)] text-[14px] font-semibold leading-tight">
                          {t.name}
                        </p>
                        <p className="font-[family-name:var(--font-stamp)] text-[12px] tabular-nums text-[var(--ink-3)]">
                          {t.version}
                        </p>
                      </div>
                      <p className="text-[14px] leading-snug text-[var(--ink-2)]">
                        {t.role}
                        {!t.alternativeAllowed ? (
                          <span className="font-[family-name:var(--font-stamp)] text-[11.5px] uppercase tracking-[0.06em] text-[var(--hold)]">
                            {" "}
                            / no substitute
                          </span>
                        ) : null}
                      </p>
                      <p className="font-[family-name:var(--font-stamp)] text-[12.5px] tabular-nums text-[var(--ink-2)]">
                        {t.costToStudent
                          ? `${t.costToStudent.amount} ${t.costToStudent.currency}`
                          : "no cost"}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 max-w-[29rem] text-[13.5px] leading-snug text-[var(--ink-2)]">
                  {PROGRAM.repositoryTemplateNote}
                </p>
              </Block>
            </div>

            {/* ----------------------------------------------------- operators */}
            <div className="mt-9">
              <MarginBlock
                id="operators"
                caption="Operators"
                meta="Systems built, with the mechanism named. Not a list of employers."
              >
                <ul>
                  {INSTRUCTORS.map((p) => (
                    <li
                      key={p.id}
                      className="grid gap-x-5 gap-y-3 border-t border-[var(--rule)] py-5 sm:grid-cols-[5rem_minmax(0,1fr)]"
                    >
                      <div>
                        <StampBox code={p.stamp} label={`Operator stamp ${p.stamp}`} size="lg" rotate={-5} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-[family-name:var(--font-form)] text-[20px] font-semibold uppercase tracking-[0.02em]">
                          {p.name}
                        </h3>
                        <p className="mt-0.5 font-[family-name:var(--font-stamp)] text-[12.5px] text-[var(--ink-2)]">
                          {p.role}
                        </p>
                        <ul className="mt-3">
                          {p.shipped.map((s) => (
                            <li key={s.what} className="border-t border-[var(--rule)] py-2">
                              <p className="max-w-[32rem] text-[14.5px] leading-snug">
                                {s.what}
                                <span className="text-[var(--ink-2)]">, {s.where}</span>
                              </p>
                              {s.scale ? (
                                <p className="mt-0.5 font-[family-name:var(--font-stamp)] text-[12px] tabular-nums text-[var(--ink-3)]">
                                  {s.scale}
                                </p>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                        {p.writing ? (
                          <p className="mt-2.5 max-w-[30rem] text-[13.5px] leading-snug text-[var(--ink-2)]">
                            <span className="font-[family-name:var(--font-stamp)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                              Writing.{" "}
                            </span>
                            {p.writing.map((w) => w.title).join(". ")}.
                          </p>
                        ) : null}
                        {p.availabilityNote ? (
                          <p className="mt-1.5 max-w-[30rem] text-[13.5px] leading-snug text-[var(--ink-2)]">
                            <span className="font-[family-name:var(--font-stamp)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                              Present.{" "}
                            </span>
                            {p.availabilityNote}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </MarginBlock>
            </div>

            {/* ------------------------------------------------ inspection plan */}
            <div className="mt-3">
              <Block
                id="inspection-plan"
                caption="Inspection plan"
                meta={`${RUBRIC.reduce((n, r) => n + r.weight, 0)} points across ${RUBRIC.length} criteria`}
              >
                <ul>
                  {RUBRIC.map((r) => (
                    <li
                      key={r.name}
                      className="grid gap-x-5 gap-y-2 border-b border-[var(--rule)] py-4 last:border-b-0 md:grid-cols-[9rem_minmax(0,1fr)]"
                    >
                      <div className="flex items-baseline gap-3 md:block">
                        <h3 className="font-[family-name:var(--font-form)] text-[17px] font-semibold uppercase tracking-[0.05em]">
                          {r.name}
                        </h3>
                        <p className="font-[family-name:var(--font-stamp)] text-[12.5px] tabular-nums text-[var(--ink-3)] md:mt-0.5">
                          weight {r.weight}
                        </p>
                      </div>
                      <dl>
                        {r.levels.map((l) => (
                          <div
                            key={l.label}
                            className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 py-1"
                          >
                            <dt
                              className="font-[family-name:var(--font-stamp)] text-[12px] uppercase tracking-[0.05em]"
                              style={{
                                color:
                                  l.label === "not yet"
                                    ? "var(--hold)"
                                    : l.label === "exceeds"
                                      ? "var(--stamp)"
                                      : "var(--ink-3)",
                              }}
                            >
                              {l.label}
                            </dt>
                            <dd className="text-[14px] leading-snug text-[var(--ink-2)]">{l.descriptor}</dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  ))}
                </ul>

                <dl className="mt-5 border-t-[1.5px] border-[var(--rule-2)] pt-4">
                  {[
                    ["Passing bar", ASSESSMENT.passingBar],
                    ["Resubmission", ASSESSMENT.retakePolicy],
                    [
                      "Certificate",
                      `${CREDENTIAL.accreditationNote}`,
                    ],
                  ].map(([k, v]) => (
                    <div key={k} className="grid gap-x-4 py-2 sm:grid-cols-[8rem_minmax(0,1fr)]">
                      <dt>
                        <Cap>{k}</Cap>
                      </dt>
                      <dd className="max-w-[32rem] text-[14px] leading-snug text-[var(--ink-2)]">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Block>
            </div>

            {/* ------------------------------------------------------ job cost */}
            <div className="mt-9">
              <MarginBlock id="job-cost" caption="Job cost" meta="Published in full. No call, no bracket, no 'from'.">
                <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
                  <p className="font-[family-name:var(--font-stamp)] text-[clamp(2.2rem,5.5vw,3.2rem)] font-semibold leading-none tabular-nums">
                    {fmtNum(PRICING.listPrice.amount)}
                    <span className="pl-2 text-[0.5em] font-normal text-[var(--ink-2)]">
                      {PRICING.listPrice.currency}
                    </span>
                  </p>
                  <p className="max-w-[22rem] text-[13.5px] leading-snug text-[var(--ink-2)]">
                    {PRICING.listPrice.taxNote}
                  </p>
                </div>

                <ul className="mt-6">
                  {PRICING.paymentOptions.map((o) => (
                    <li
                      key={o.kind}
                      className="grid gap-x-4 gap-y-1 border-t border-[var(--rule)] py-3 sm:grid-cols-[9rem_minmax(0,1fr)]"
                    >
                      <p className="font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.08em]">
                        {o.kind.replace(/_/g, " ")}
                      </p>
                      <p className="max-w-[30rem] text-[14px] leading-snug text-[var(--ink-2)]">
                        {o.note}
                        {o.kind === "instalments" ? (
                          <span className="font-[family-name:var(--font-stamp)] tabular-nums">
                            {" "}
                            ({o.count} x {fmtNum(o.amountEach)}, {o.feePercent} percent fee)
                          </span>
                        ) : null}
                        {o.kind === "upfront" ? (
                          <span className="font-[family-name:var(--font-stamp)] tabular-nums">
                            {" "}
                            ({o.discountPercent} percent off)
                          </span>
                        ) : null}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 grid gap-x-8 gap-y-6 lg:grid-cols-2">
                  <div>
                    <h3 className="font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.09em]">
                      Not included, and itemised
                    </h3>
                    <dl className="mt-2.5">
                      {PRICING.additionalCosts.map((a) => (
                        <div key={a.item} className="border-t border-[var(--rule)] py-2">
                          <dt className="font-[family-name:var(--font-stamp)] text-[13px] font-semibold">
                            {a.item}
                          </dt>
                          <dd className="mt-0.5 max-w-[30rem] text-[13.5px] leading-snug text-[var(--ink-2)]">
                            {a.estimate}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.09em]">
                      Second Shift seats
                    </h3>
                    {PRICING.scholarships.map((s) => (
                      <dl key={s.name} className="mt-2.5">
                        <div className="border-t border-[var(--rule)] py-2">
                          <dt>
                            <Cap>Criteria</Cap>
                          </dt>
                          <dd className="mt-0.5 max-w-[30rem] text-[13.5px] leading-snug text-[var(--ink-2)]">
                            {s.criteria}
                          </dd>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 border-t border-[var(--rule)] py-2">
                          <div>
                            <dt>
                              <Cap>Seats</Cap>
                            </dt>
                            <dd className="mt-0.5 font-[family-name:var(--font-stamp)] text-[13.5px] tabular-nums">
                              {s.seats}
                            </dd>
                          </div>
                          <div>
                            <dt>
                              <Cap>Deadline</Cap>
                            </dt>
                            <dd className="mt-0.5 font-[family-name:var(--font-stamp)] text-[13.5px] tabular-nums">
                              {s.deadline}
                            </dd>
                          </div>
                        </div>
                      </dl>
                    ))}
                  </div>
                </div>
              </MarginBlock>
            </div>

            {/* -------------------------------------------------- nonconformance */}
            <MarginBlock
              id="nonconformance"
              caption="Nonconformance and disposition"
              meta="What happens when it goes wrong, printed before you pay rather than after"
              space="py-8"
            >
              <div className="grid gap-x-8 gap-y-7 lg:grid-cols-2">
                <div>
                  <h3 className="font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.09em]">
                    Refund schedule, by day from lot release
                  </h3>
                  <dl className="mt-3">
                    {PRICING.refundPolicy.partialSchedule.map((s) => (
                      <div
                        key={s.beforeDay}
                        className="grid grid-cols-[minmax(0,1fr)_5rem] items-baseline gap-x-4 border-t border-[var(--rule)] py-2"
                      >
                        <dt className="font-[family-name:var(--font-stamp)] text-[13.5px] tabular-nums">
                          Notified before day {s.beforeDay}
                        </dt>
                        <dd className="text-right font-[family-name:var(--font-stamp)] text-[15px] font-semibold tabular-nums">
                          {s.refundPercent} %
                        </dd>
                      </div>
                    ))}
                    <div className="grid grid-cols-[minmax(0,1fr)_5rem] items-baseline gap-x-4 border-t border-[var(--rule)] py-2">
                      <dt className="font-[family-name:var(--font-stamp)] text-[13.5px] tabular-nums text-[var(--hold)]">
                        Day 43 onward
                      </dt>
                      <dd className="text-right font-[family-name:var(--font-stamp)] text-[15px] font-semibold tabular-nums text-[var(--hold)]">
                        0 %
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-3 max-w-[30rem] text-[13.5px] leading-snug text-[var(--ink-2)]">
                    {PRICING.refundPolicy.conditions}
                  </p>
                </div>

                <div>
                  <h3 className="font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.09em]">
                    Quoted verbatim, participation contract section 4
                  </h3>
                  <blockquote className="mt-3 border border-[var(--rule)] bg-[var(--card-3)] p-3.5">
                    <p className="max-w-[29rem] font-[family-name:var(--font-stamp)] text-[13.5px] leading-relaxed">
                      {PRICING.refundPolicy.quotedVerbatim}
                    </p>
                  </blockquote>
                  <dl className="mt-4">
                    <div className="border-t border-[var(--rule)] py-2.5">
                      <dt>
                        <Cap>Deferral</Cap>
                      </dt>
                      <dd className="mt-1 max-w-[30rem] text-[14px] leading-snug text-[var(--ink-2)]">
                        {PRICING.deferralPolicy.note}
                      </dd>
                    </div>
                    <div className="border-t border-[var(--rule)] py-2.5">
                      <dt>
                        <Cap>Guarantee</Cap>
                      </dt>
                      <dd className="mt-1 max-w-[30rem] text-[14px] leading-snug text-[var(--ink-2)]">
                        {PRICING.guaranteeNote}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </MarginBlock>

            {/* ----------------------------------------------------- lot release */}
            <div className="mt-3" id="lot-release">
              <Block
                id="lot-release-h"
                caption="Lot release and admission"
                meta={`Decision inside ${ADMISSION.decisionSlaDays} days of the screen`}
              >
                <ul className="border-t-[1.5px] border-[var(--rule-2)]">
                  {COHORTS.map((c) => {
                    const done = c.status === "completed";
                    return (
                      <li
                        key={c.id}
                        className="grid grid-cols-2 items-baseline gap-x-4 gap-y-2 border-b border-[var(--rule)] py-3.5 md:grid-cols-[5rem_7rem_7rem_6rem_minmax(0,1fr)]"
                      >
                        <p className="font-[family-name:var(--font-stamp)] text-[16px] font-bold uppercase tabular-nums">
                          {c.id}
                        </p>
                        <p
                          className="font-[family-name:var(--font-stamp)] text-[12px] uppercase tracking-[0.06em]"
                          style={{ color: done ? "var(--ink-3)" : "var(--stamp)" }}
                        >
                          {c.status}
                        </p>
                        <p className="font-[family-name:var(--font-stamp)] text-[13px] tabular-nums text-[var(--ink-2)]">
                          {c.startsOn}
                        </p>
                        <p className="font-[family-name:var(--font-stamp)] text-[13px] tabular-nums text-[var(--ink-2)]">
                          {c.seatsRemaining} of {c.capacity}
                        </p>
                        <p className="col-span-2 text-[14px] leading-snug text-[var(--ink-2)] md:col-span-1">
                          {done
                            ? `Ran to ${c.endsOn}. Three capstones from this lot are listed below.`
                            : c.status === "waitlist"
                              ? `Applications open after ${COHORTS[1].applicationsCloseOn}. The waitlist is ordered and we honour the order.`
                              : `Applications close ${c.applicationsCloseOn}. Ends ${c.endsOn}.`}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 grid gap-x-8 gap-y-7 lg:grid-cols-2">
                  <div>
                    <h3 className="font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.09em]">
                      Admission, four steps
                    </h3>
                    <ol className="mt-3">
                      {ADMISSION.steps.map((s) => (
                        <li
                          key={s.index}
                          className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 border-t border-[var(--rule)] py-2.5"
                        >
                          <span className="font-[family-name:var(--font-stamp)] text-[13px] tabular-nums text-[var(--ink-3)]">
                            {String(s.index).padStart(2, "0")}
                          </span>
                          <div className="min-w-0">
                            <p className="flex items-baseline justify-between gap-3 font-[family-name:var(--font-stamp)] text-[13.5px] font-semibold">
                              <span>{s.name}</span>
                              <span className="shrink-0 text-[12.5px] font-normal tabular-nums text-[var(--ink-3)]">
                                {s.typicalDays} d
                              </span>
                            </p>
                            <p className="mt-0.5 max-w-[28rem] text-[13.5px] leading-snug text-[var(--ink-2)]">
                              {s.whatHappens}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-3 max-w-[30rem] text-[13.5px] leading-snug text-[var(--ink-2)]">
                      {ADMISSION.acceptanceNote}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.09em]">
                      The screen, {ADMISSION.technicalScreen.durationMinutes} minutes
                    </h3>
                    <p className="mt-2 max-w-[30rem] text-[14px] leading-snug text-[var(--ink-2)]">
                      {ADMISSION.technicalScreen.format}
                    </p>
                    <ul className="mt-3">
                      {ADMISSION.technicalScreen.whatIsAssessed.map((w) => (
                        <li
                          key={w}
                          className="border-t border-[var(--rule)] py-2 text-[14px] leading-snug text-[var(--ink-2)]"
                        >
                          {w}
                        </li>
                      ))}
                    </ul>
                    <h3 className="mt-5 font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.09em]">
                      The whole application form
                    </h3>
                    <ol className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5">
                      {ADMISSION.applicationFields.map((f, i) => (
                        <li
                          key={f}
                          className="border border-[var(--rule)] px-2 py-1 font-[family-name:var(--font-stamp)] text-[12.5px] text-[var(--ink-2)]"
                        >
                          <span className="tabular-nums text-[var(--ink-3)]">{i + 1}. </span>
                          {f}
                        </li>
                      ))}
                    </ol>
                    <a
                      href="#routing"
                      className="tv-f mt-5 inline-block border-2 border-[var(--ink)] bg-[var(--ink)] px-5 py-2.5 font-[family-name:var(--font-form)] text-[16px] font-semibold uppercase tracking-[0.1em] text-[var(--card)] transition-colors duration-150 hover:bg-[var(--card-3)] hover:text-[var(--ink)]"
                      style={{ borderRadius: 0 }}
                    >
                      Read the routing first
                    </a>
                  </div>
                </div>

                <div className="mt-7 border-t-[1.5px] border-[var(--rule-2)] pt-4">
                  <h3 className="font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.09em]">
                    Capstones from lot C06
                  </h3>
                  <ul className="mt-3">
                    {CAPSTONE.examples.map((e) => (
                      <li key={e.title} className="border-t border-[var(--rule)] py-3">
                        <p className="font-[family-name:var(--font-form)] text-[17px] font-semibold uppercase tracking-[0.03em]">
                          {e.title}
                        </p>
                        <p className="mt-1 max-w-[32rem] text-[14px] leading-snug text-[var(--ink-2)]">
                          {e.oneLine}
                        </p>
                        <p className="mt-1 max-w-[26rem] font-[family-name:var(--font-stamp)] text-[12px] tabular-nums text-[var(--ink-3)] break-all">
                          {e.cohortId.toUpperCase()}
                          <span className="px-1.5">/</span>
                          {e.studentName ?? "attribution withheld, no consent on file"}
                          {e.repoUrl ? (
                            <>
                              <span className="px-1.5">/</span>
                              {e.repoUrl}
                            </>
                          ) : null}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 max-w-[29rem] text-[13.5px] leading-snug text-[var(--ink-2)]">
                    No placement rate and no salary figure is printed on this card, because neither
                    one could be sourced with a denominator and a date. The syllabus above is what
                    we have instead.
                  </p>
                </div>
              </Block>
            </div>

            <CardFoot />
          </TravellerCard>
        </main>

        <WorkOrderCard />
      </div>

      <WorkOrderRail />
    </div>
  );
}
