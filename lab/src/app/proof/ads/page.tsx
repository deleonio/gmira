import Link from "next/link";
import s from "./bill.module.css";
import SpecSheetRequest from "./SpecSheetRequest";
import {
  AUDIENCE_PATHS,
  AD_ASSETS,
  CARD,
  COMPLIANCE,
  DEFAULT_RIGHTS,
  GTM_PLAYS,
  INSTRUCTORS,
  OFFER,
  PLATFORM_LABEL,
  PROGRAM,
  PROOF_LEDGER,
  RATE_CARD,
  SELF_PACED,
  SPECS,
  TEARDOWNS,
  adById,
  fmtInt,
  instructorById,
  type Platform,
} from "./data";

const BILL = "font-[family-name:var(--font-bill)]";
const SPEC = "font-[family-name:var(--font-spec)]";

/* Display size on the undercard is computed from the week's output count, which is
   the direction contract's TELL. Week 1 asks for 40 written hooks and is set largest.
   Week 6 asks for 3 launched variants and is set smallest. The bill descends with the
   count, not with importance. */
const billSize = (count: number) => {
  const max = 1.35 + (count / 40) * 2.9;
  const min = Math.min(max, 1.95);
  return `clamp(${min.toFixed(2)}rem, ${(max * 2.3).toFixed(1)}vw, ${max.toFixed(2)}rem)`;
};

function Illustrative() {
  return (
    <span
      className={`${SPEC} inline-block border border-[var(--spot)] px-1.5 py-[1px] align-middle text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--spot)]`}
    >
      Illustrative
    </span>
  );
}

function Field({
  k,
  children,
  wide,
}: {
  k: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className={`${SPEC} text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]`}>{k}</dt>
      <dd className="mt-1 max-w-[31rem] text-[14px] leading-snug">{children}</dd>
    </div>
  );
}

const FILTERS: Array<{ key: Platform | "all"; label: string; live: boolean }> = [
  { key: "all", label: "Whole card", live: true },
  { key: "meta", label: "Meta", live: true },
  { key: "tiktok", label: "TikTok", live: true },
  { key: "youtube", label: "YouTube", live: true },
  { key: "snapchat", label: "Snapchat", live: false },
];

export default async function CardPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string }>;
}) {
  const { platform } = await searchParams;
  const publicTeardowns = TEARDOWNS.filter((t) => t.isPublic);
  const active = FILTERS.find((f) => f.live && f.key === platform && f.key !== "all")?.key as
    | Platform
    | undefined;
  const shown = active
    ? publicTeardowns.filter((t) => adById(t.adAssetId)?.platform === active)
    : publicTeardowns;

  const mainTeardown = publicTeardowns[0];
  const mainAd = adById(mainTeardown.adAssetId)!;

  return (
    <main className="mx-auto max-w-[1240px] px-5 pb-0 pt-8 md:px-9">
      {/* ---------------------------------------------------------------- *
          The head of the bill: promoter, overprint, card title, main event.
       * ---------------------------------------------------------------- */}
      <header>
        <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-6">
          <div>
            <p className={`${BILL} text-[clamp(1.5rem,3.2vw,2.1rem)] uppercase leading-none tracking-[0.03em]`}>
              {CARD.promoter}
            </p>
            <span aria-hidden className="mt-2 block h-[2px] w-full bg-[var(--spot)]" />
            <span aria-hidden className="mt-[3px] block h-px w-full bg-[var(--spot)]" />
            <p className="mt-2 text-[13px] text-[var(--ink-2)]">{CARD.promoterLine}</p>
          </div>

          <div className="relative max-w-[25rem] border-2 border-[var(--spot)] px-4 py-3">
            <span aria-hidden className={`${s.hatch} pointer-events-none absolute inset-0`} />
            <p className={`${BILL} relative text-[clamp(1.05rem,2.4vw,1.4rem)] uppercase tracking-[0.05em] text-[var(--spot)]`}>
              {CARD.overprint.line1}
            </p>
            <p className="relative mt-1 max-w-[24rem] text-[13px] leading-snug">
              {CARD.overprint.line2}
            </p>
          </div>
        </div>

        <span aria-hidden className="mt-7 block h-[6px] w-full bg-[var(--ink)]" />

        <h1 className={`${BILL} mt-5 uppercase leading-[0.84] tracking-[-0.005em]`}>
          <span className="block text-[clamp(2.6rem,13vw,6rem)]">Six weeks</span>
          <span className="block text-[clamp(2.6rem,13vw,6rem)]">on the card</span>
        </h1>
        <p className="mt-5 max-w-[35rem] text-[clamp(1rem,1.5vw,1.1rem)] leading-relaxed">
          {CARD.strap}
        </p>

        {/* Main event. A named ad, billed against what it was fighting, with its
            evidence line directly under it. Decision 1 in the playbook. */}
        <section aria-labelledby="main-event" className="mt-9">
          <span aria-hidden className="block h-[2px] w-full bg-[var(--ink)]" />
          <div className={`${SPEC} mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[12px] uppercase tracking-[0.13em] text-[var(--ink-2)]`}>
            <span>Main event</span>
            <span className="tabular-nums">
              {PLATFORM_LABEL[mainAd.platform]} in feed / {mainAd.durationS} seconds /{" "}
              {mainAd.aspectRatio}
            </span>
          </div>

          <h2
            id="main-event"
            className={`${BILL} mt-5 flex flex-col items-center gap-1 uppercase leading-[0.88] md:flex-row md:justify-center md:gap-6`}
          >
            <span className={`${s.stareLeft} text-center text-[clamp(1.9rem,5.6vw,3.6rem)] md:flex-1 md:text-right`}>
              {mainTeardown.boutName}
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden className={`${s.stareRule} block h-[2px] w-8 bg-[var(--spot)] md:w-12`} />
              <span className="text-[clamp(1rem,1.9vw,1.35rem)] text-[var(--spot)]">vs</span>
              <span aria-hidden className={`${s.stareRule} block h-[2px] w-8 bg-[var(--spot)] md:w-12`} />
            </span>
            <span
              className={`${s.stareRight} text-center text-[clamp(1.9rem,5.6vw,3.6rem)] text-[var(--ink-2)] md:flex-1 md:text-left`}
            >
              {mainTeardown.opponent}
            </span>
          </h2>

          <div className="mt-6 grid gap-x-10 gap-y-5 lg:grid-cols-[1fr_20rem]">
            <p className="max-w-[33rem] text-[15px] leading-relaxed">{mainTeardown.thesis}</p>
            <dl className={`${SPEC} text-[12.5px]`}>
              <div className="flex gap-3 border-t border-[var(--rule)] py-1.5">
                <dt className="w-[7.5rem] shrink-0 text-[var(--ink-2)]">Ad library id</dt>
                <dd className="tabular-nums">{mainAd.adLibraryId}</dd>
              </div>
              <div className="flex gap-3 border-t border-[var(--rule)] py-1.5">
                <dt className="w-[7.5rem] shrink-0 text-[var(--ink-2)]">Ran</dt>
                <dd className="tabular-nums">
                  {mainAd.ranFrom} to {mainAd.ranTo}
                </dd>
              </div>
              <div className="flex gap-3 border-t border-[var(--rule)] py-1.5">
                <dt className="w-[7.5rem] shrink-0 text-[var(--ink-2)]">Resolvable</dt>
                <dd>
                  No. Synthetic id <Illustrative />
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={`/proof/ads/${mainTeardown.slug}`}
              className={`${s.focusable} ${BILL} border-2 border-[var(--ink)] bg-[var(--ink)] px-5 py-2.5 text-[16px] uppercase tracking-[0.06em] text-[var(--stock)] transition-colors hover:border-[var(--spot)] hover:bg-[var(--spot)]`}
            >
              Read the teardown
            </Link>
            <p className={`${SPEC} text-[12.5px] tabular-nums text-[var(--ink-2)]`}>
              Ticket {fmtInt(OFFER.listPrice.amount)} EUR net.{" "}
              <a
                href="#ticket"
                className={`${s.focusable} underline decoration-[var(--spot)] decoration-2 underline-offset-4 hover:text-[var(--ink)]`}
              >
                Terms at the foot of the card
              </a>
            </p>
          </div>
        </section>

        {/* Venue strip, reversed out. A bill states where and when before it states why. */}
        <div className="mt-8 bg-[var(--plate)] px-4 py-4 text-[var(--plate-ink)] sm:px-6">
          <dl className={`${SPEC} flex flex-wrap gap-x-10 gap-y-3 text-[12.5px]`}>
            {[
              ["Venue", CARD.venue],
              ["Run from", CARD.city],
              ["Card opens", CARD.cohortOpens],
              ["Doors close", CARD.doorsClose],
              ["Seats", `${CARD.seatsPerCohort} per cohort`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] uppercase tracking-[0.13em] text-[var(--plate-ink-2)]">
                  {k}
                </dt>
                <dd className="mt-1 tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ---------------------------------------------------------------- *
          On the card: the public teardowns. Proof before price, on every viewport.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="on-the-card" className="pt-16">
        <h2 id="on-the-card" className={`${BILL} text-[clamp(2rem,5vw,3.2rem)] uppercase leading-[0.9]`}>
          On the card
        </h2>
        <p className="mt-4 max-w-[33rem] text-[15px] leading-relaxed">
          Four public teardowns, one of them a loss. Each bout carries the format it shipped in,
          the run dates and the id. On a real card those ids open in the ad library and a stranger
          checks them without an account. Here they are synthetic, and the ledger under this
          section says so line by line.
        </p>

        <nav
          aria-label="Filter the card by platform"
          className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-2"
        >
          {FILTERS.map((f) => {
            const count =
              f.key === "all"
                ? publicTeardowns.length
                : publicTeardowns.filter((t) => adById(t.adAssetId)?.platform === f.key).length;
            const on = f.key === "all" ? !active : active === f.key;

            if (!f.live) {
              return (
                <span
                  key={f.key}
                  aria-disabled="true"
                  className={`${SPEC} cursor-not-allowed border border-dashed border-[var(--rule)] px-3 py-1.5 text-[12px] tabular-nums text-[var(--ink-2)]`}
                >
                  {f.label} <span className="opacity-70">not taught</span>
                </span>
              );
            }
            return (
              <Link
                key={f.key}
                href={f.key === "all" ? "/proof/ads" : `/proof/ads?platform=${f.key}`}
                aria-current={on ? "page" : undefined}
                className={`${s.focusable} ${SPEC} border px-3 py-1.5 text-[12px] tabular-nums transition-colors ${
                  on
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--stock)]"
                    : "border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--stock)]"
                }`}
              >
                {f.label} <span className={on ? "opacity-70" : "text-[var(--ink-2)]"}>{count}</span>
              </Link>
            );
          })}
        </nav>

        {shown.length === 0 ? (
          <div className="mt-8 border-y-2 border-[var(--ink)] py-14">
            <p className={`${BILL} text-[clamp(1.6rem,4vw,2.4rem)] uppercase leading-tight`}>
              No {active ? PLATFORM_LABEL[active] : ""} bout on this card
            </p>
            <p className="mt-3 max-w-[33rem] text-[15px] leading-relaxed">
              We teach the placement, but there is no public teardown for it yet. The only thing
              filtering it out is the platform filter, and the whole card is one click away.
            </p>
            <Link
              href="/proof/ads"
              className={`${s.focusable} ${BILL} mt-6 inline-block border-2 border-[var(--ink)] px-5 py-2.5 text-[15px] uppercase tracking-[0.06em] transition-colors hover:bg-[var(--ink)] hover:text-[var(--stock)]`}
            >
              Show the whole card
            </Link>
          </div>
        ) : (
          <ol className="mt-8">
            {shown.map((t) => {
              const ad = adById(t.adAssetId)!;
              const head = t.controlComparison?.rows[0];
              return (
                <li key={t.id} className="border-t-2 border-[var(--ink)] py-8">
                  <div
                    className={`${SPEC} flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[12px] uppercase tracking-[0.13em] text-[var(--ink-2)]`}
                  >
                    <span>{t.billing}</span>
                    <span className="tabular-nums">
                      {PLATFORM_LABEL[ad.platform]} / {ad.format} / {ad.aspectRatio}
                      {ad.durationS ? ` / ${ad.durationS} s` : ""}
                    </span>
                  </div>

                  <Link href={`/proof/ads/${t.slug}`} className={`${s.focusable} group mt-4 block`}>
                    <h3
                      className={`${BILL} flex flex-col items-center gap-1 uppercase leading-[0.9] md:flex-row md:justify-center md:gap-5`}
                    >
                      <span className="text-center text-[clamp(1.55rem,4.2vw,2.7rem)] transition-colors group-hover:text-[var(--spot)] md:flex-1 md:text-right">
                        {t.boutName}
                      </span>
                      <span className="text-[clamp(0.9rem,1.5vw,1.15rem)] text-[var(--spot)]">vs</span>
                      <span className="text-center text-[clamp(1.55rem,4.2vw,2.7rem)] text-[var(--ink-2)] md:flex-1 md:text-left">
                        {t.opponent}
                      </span>
                    </h3>
                  </Link>

                  <div className="mt-5 grid gap-x-10 gap-y-5 lg:grid-cols-[1fr_20rem]">
                    <div>
                      <p className="max-w-[33rem] text-[15px] leading-relaxed">{t.thesis}</p>
                      {head && t.controlComparison ? (
                        <p className={`${SPEC} mt-4 max-w-[28rem] text-[12.5px] leading-relaxed tabular-nums`}>
                          {head.metric} {head.thisAd}
                          {head.unit} against {head.control}
                          {head.unit} for the control, same audience, same window{" "}
                          {t.controlComparison.sharedWindow.from} to{" "}
                          {t.controlComparison.sharedWindow.to}. <Illustrative />
                        </p>
                      ) : (
                        <p className={`${SPEC} mt-4 text-[12.5px] text-[var(--ink-2)]`}>
                          No control comparison on this bout.
                        </p>
                      )}
                    </div>

                    <dl className={`${SPEC} text-[12.5px]`}>
                      <div className="flex gap-3 border-t border-[var(--rule)] py-1.5">
                        <dt className="w-[7.5rem] shrink-0 text-[var(--ink-2)]">Ad library id</dt>
                        <dd className="tabular-nums">{ad.adLibraryId}</dd>
                      </div>
                      <div className="flex gap-3 border-t border-[var(--rule)] py-1.5">
                        <dt className="w-[7.5rem] shrink-0 text-[var(--ink-2)]">Ran</dt>
                        <dd className="tabular-nums">
                          {ad.ranFrom} to {ad.ranTo}
                        </dd>
                      </div>
                      <div className="flex gap-3 border-t border-[var(--rule)] py-1.5">
                        <dt className="w-[7.5rem] shrink-0 text-[var(--ink-2)]">Torn down by</dt>
                        <dd>{instructorById(t.authorId)?.name}</dd>
                      </div>
                    </dl>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {/* ---------------------------------------------------------------- *
          The evidence ledger. Rare on this kind of page, and it converts.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="ledger" className="border-t-[6px] border-[var(--ink)] pt-10">
        <h2 id="ledger" className={`${BILL} text-[clamp(1.7rem,4vw,2.6rem)] uppercase leading-[0.92]`}>
          What is real on this page
        </h2>
        <p className="mt-4 max-w-[33rem] text-[15px] leading-relaxed">
          This is a proof build, so half the card is synthetic. Rather than hide that behind a
          disclaimer nobody reads, here is every claim with the evidence it would carry and whether
          that evidence exists in this build.
        </p>

        <ol className="mt-7">
          {PROOF_LEDGER.map((p) => (
            <li key={p.claimSupported} className="grid gap-x-8 gap-y-2 border-t border-[var(--rule)] py-4 lg:grid-cols-[1fr_1fr_7rem]">
              <p className="max-w-[32rem] text-[14.5px] font-medium leading-snug">{p.claimSupported}</p>
              <p className="max-w-[31rem] text-[13.5px] leading-relaxed text-[var(--ink-2)]">
                {p.wouldCarry}
              </p>
              <p className={`${SPEC} text-[11px] uppercase tracking-[0.1em] lg:text-right`}>
                {p.status === "real_in_this_build" ? (
                  <span>Real here</span>
                ) : (
                  <span className="text-[var(--spot)]">Synthetic here</span>
                )}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------------------------------------------------------- *
          Weight classes. Four audience paths, four different running orders.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="weights" className="pt-16">
        <h2 id="weights" className={`${BILL} text-[clamp(2rem,5vw,3.2rem)] uppercase leading-[0.9]`}>
          Weight classes
        </h2>
        <p className="mt-4 max-w-[33rem] text-[15px] leading-relaxed">
          The card is the same for everyone. The running order is not. Find the line that describes
          your week and read what changes.
        </p>

        <ol className="mt-8">
          {AUDIENCE_PATHS.map((p) => (
            <li key={p.key} className="grid gap-x-10 gap-y-3 border-t-2 border-[var(--ink)] py-7 lg:grid-cols-[16rem_1fr]">
              <div>
                <h3 className={`${BILL} text-[clamp(1.3rem,2.6vw,1.85rem)] uppercase leading-[0.95]`}>
                  {p.weightClass}
                </h3>
                <p className={`${SPEC} mt-2 text-[12px] uppercase tracking-[0.1em] text-[var(--spot)]`}>
                  {p.startsAt}
                </p>
              </div>
              <div>
                <p className="max-w-[33rem] text-[15px] leading-relaxed">{p.who}</p>
                <p className="mt-3 max-w-[33rem] text-[15px] leading-relaxed">{p.changesForYou}</p>
                <p className={`${SPEC} mt-3 max-w-[28rem] text-[12.5px] leading-relaxed text-[var(--ink-2)]`}>
                  Skip: {p.skip}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------------------------------------------------------- *
          Scratched. The notForYouIf list, stated as a withdrawal from the bill.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="scratched" className="pt-14">
        <h2 id="scratched" className={`${BILL} text-[clamp(1.5rem,3.4vw,2.2rem)] uppercase leading-[0.95] text-[var(--spot)]`}>
          Scratched from the card
        </h2>
        <p className="mt-3 max-w-[33rem] text-[15px] leading-relaxed">
          Five people this is wrong for. Written before you pay, not after.
        </p>
        <ul className="mt-6 max-w-[46rem]">
          {PROGRAM.notForYouIf.map((n) => (
            <li key={n} className="flex gap-4 border-t border-[var(--rule)] py-3.5">
              <span aria-hidden className={`${SPEC} shrink-0 text-[15px] font-semibold text-[var(--spot)]`}>
                &times;
              </span>
              <span className="max-w-[33rem] text-[14.5px] leading-relaxed">{n}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------------- *
          The undercard: six weeks, sized by output count.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="undercard" className="pt-20">
        <span aria-hidden className="block h-[6px] w-full bg-[var(--ink)]" />
        <h2 id="undercard" className={`${BILL} mt-6 text-[clamp(2.2rem,6vw,4rem)] uppercase leading-[0.88]`}>
          The undercard
        </h2>
        <p className="mt-4 max-w-[33rem] text-[15px] leading-relaxed">
          Six weeks, six deliverables. The size a week is set at on this bill comes from its output
          count: week one asks for 40 written hooks and week six asks for 3 launched variants. The
          bill descends with the count, not with the importance.
        </p>
        <dl className={`${SPEC} mt-5 flex flex-wrap gap-x-10 gap-y-3 text-[12.5px]`}>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]">Live</dt>
            <dd className="mt-1 tabular-nums">{PROGRAM.weeklyCommitment.liveHours} hours a week</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]">Production</dt>
            <dd className="mt-1 tabular-nums">
              {PROGRAM.weeklyCommitment.productionHours} hours a week
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]">Quota</dt>
            <dd className="mt-1 tabular-nums">
              {PROGRAM.outputQuota.hooksPerWeek} hooks, {PROGRAM.outputQuota.editsPerWeek} edits,{" "}
              {PROGRAM.outputQuota.postedPerWeek} posted
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]">Test spend</dt>
            <dd className="mt-1 tabular-nums">
              {PROGRAM.adSpendRequired?.amount} {PROGRAM.adSpendRequired?.currency} of your own
            </dd>
          </div>
        </dl>

        <ol className="mt-9">
          {PROGRAM.modules.map((m) => (
            <li key={m.index} className="border-t border-[var(--rule)] py-8 first:border-t-[2px] first:border-[var(--ink)]">
              <div className="grid items-baseline gap-x-6 gap-y-2 md:grid-cols-[6rem_1fr_11rem]">
                <p className={`${SPEC} text-[12px] uppercase tracking-[0.13em] tabular-nums text-[var(--ink-2)]`}>
                  Week {m.index}
                </p>
                <h3
                  className={`${BILL} uppercase leading-[0.9] md:text-center`}
                  style={{ fontSize: billSize(m.outputCount) }}
                >
                  {m.title}
                </h3>
                <p className={`${SPEC} text-[12.5px] tabular-nums text-[var(--ink-2)] md:text-right`}>
                  {m.outputCount} {m.outputUnit}
                </p>
              </div>

              <div className="mt-5 md:grid md:grid-cols-[6rem_1fr] md:gap-x-6">
                <span aria-hidden className="hidden md:block" />
                <div>
                  <p className="max-w-[33rem] text-[15px] leading-relaxed">{m.thesis}</p>
                  <dl className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                    <Field k="Deliverable">{m.deliverable}</Field>
                    <Field k="Critique">{m.critiqueFormat}</Field>
                    {m.teardownIds.length > 0 ? (
                      <Field k="Bouts studied" wide>
                        <span className="flex flex-wrap gap-x-4 gap-y-1">
                          {m.teardownIds.map((id) => {
                            const t = TEARDOWNS.find((x) => x.id === id);
                            if (!t) return null;
                            return (
                              <Link
                                key={id}
                                href={`/proof/ads/${t.slug}`}
                                className={`${s.focusable} underline decoration-[var(--spot)] decoration-2 underline-offset-4 hover:text-[var(--spot)]`}
                              >
                                {t.boutName}
                              </Link>
                            );
                          })}
                        </span>
                      </Field>
                    ) : null}
                  </dl>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------------------------------------------------------- *
          Tale of the tape. The two routes, measured against each other.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="tape" className="pt-20">
        <h2 id="tape" className={`${BILL} text-[clamp(2rem,5vw,3.2rem)] uppercase leading-[0.9]`}>
          Tale of the tape
        </h2>
        <p className="mt-4 max-w-[33rem] text-[15px] leading-relaxed">
          Two routes through the same brief set. The difference is the live block, the critique and
          the deadline, which is also the difference in price. Everything else is identical.
        </p>

        <div className="mx-auto mt-8 max-w-[58rem] border-t-2 border-[var(--ink)]">
          <div className={`${BILL} grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 py-4 text-[clamp(0.95rem,2.2vw,1.35rem)] uppercase leading-none`}>
            <p className="text-right">Live cohort</p>
            <p className={`${SPEC} px-2 text-[11px] uppercase tracking-[0.12em] text-[var(--spot)]`}>vs</p>
            <p>{SELF_PACED.title}</p>
          </div>

          <dl>
            {[
              ["Weeks", `${PROGRAM.durationWeeks}`, "Open"],
              ["Live hours a week", `${PROGRAM.weeklyCommitment.liveHours}`, `${SELF_PACED.liveHours}`],
              [
                "Production hours a week",
                `${PROGRAM.weeklyCommitment.productionHours}`,
                `${SELF_PACED.productionHours}`,
              ],
              ["Hooks a week", `${PROGRAM.outputQuota.hooksPerWeek}`, "Same set, no deadline"],
              ["Critique", "Live, 8 minutes each", SELF_PACED.critique],
              [
                "Test spend needed",
                `${PROGRAM.adSpendRequired?.amount} EUR`,
                `${SELF_PACED.adSpend} EUR`,
              ],
              ["Seats", `${CARD.seatsPerCohort}`, "No limit"],
              ["Cohort channel", "Kept after the card", "Read only"],
              [
                "Ticket, net",
                `${fmtInt(OFFER.listPrice.amount)} EUR`,
                `${fmtInt(SELF_PACED.price)} EUR`,
              ],
            ].map(([label, left, right]) => (
              <div
                key={label}
                className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-x-4 border-t border-[var(--rule)] py-3"
              >
                <dd className={`${SPEC} col-start-1 text-right text-[13.5px] tabular-nums`}>{left}</dd>
                <dt
                  className={`${SPEC} col-start-2 w-[8.5rem] text-center text-[11px] uppercase leading-tight tracking-[0.08em] text-[var(--ink-2)] sm:w-[12rem]`}
                >
                  {label}
                </dt>
                <dd className={`${SPEC} col-start-3 text-[13.5px] tabular-nums`}>{right}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-8 grid gap-x-10 gap-y-6 lg:grid-cols-2">
          <div>
            <h3 className={`${BILL} text-[1.3rem] uppercase leading-tight`}>What you leave holding</h3>
            <p className="mt-3 max-w-[33rem] text-[15px] leading-relaxed">
              {PROGRAM.portfolioOutcome}
            </p>
          </div>
          <div>
            <h3 className={`${BILL} text-[1.3rem] uppercase leading-tight`}>Tools and their cost</h3>
            <ul className={`${SPEC} mt-3 text-[12.5px]`}>
              {PROGRAM.toolsTaught.map((t) => (
                <li key={t.name} className="flex flex-wrap gap-x-3 border-t border-[var(--rule)] py-1.5">
                  <span className="min-w-[10rem] flex-1">{t.name}</span>
                  <span className="text-[var(--ink-2)]">{t.costToStudent}</span>
                  <span className={t.required ? "text-[var(--spot)]" : "text-[var(--ink-2)]"}>
                    {t.required ? "required" : "optional"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- *
          The purse. Off the bill, so it is a flush left ledger in mono.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="purse" className="pt-20">
        <span aria-hidden className="block h-[6px] w-full bg-[var(--ink)]" />
        <h2 id="purse" className={`${BILL} mt-6 text-[clamp(2rem,5vw,3.2rem)] uppercase leading-[0.9]`}>
          The purse
        </h2>
        <p className="mt-4 max-w-[33rem] text-[15px] leading-relaxed">
          Every course in this category teaches shooting and almost none teach pricing. Whitelisting,
          term and category exclusivity are three separate prices. This is the model week five hands
          you, with your own numbers in it.
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className={`${SPEC} w-full min-w-[42rem] border-collapse text-[12.5px]`}>
            <caption className="sr-only">
              Rate card by deliverable, with the multipliers that apply to each
            </caption>
            <thead>
              <tr className="border-y-2 border-[var(--ink)] text-left">
                <th scope="col" className="py-2.5 pr-6 text-[11px] font-semibold uppercase tracking-[0.11em]">
                  Deliverable
                </th>
                <th scope="col" className="py-2.5 pr-6 text-right text-[11px] font-semibold uppercase tracking-[0.11em]">
                  Base, EUR
                </th>
                <th scope="col" className="py-2.5 pr-6 text-right text-[11px] font-semibold uppercase tracking-[0.11em]">
                  Revisions
                </th>
                <th scope="col" className="py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.11em]">
                  Rush
                </th>
              </tr>
            </thead>
            <tbody>
              {RATE_CARD.map((line) => (
                <tr key={line.deliverable} className="border-b border-[var(--rule)] align-top">
                  <th scope="row" className="py-3.5 pr-6 text-left font-normal">
                    <span className="block text-[13px] font-medium">{line.deliverable}</span>
                    <span className="mt-1.5 block text-[11.5px] text-[var(--ink-2)]">
                      {line.modifiers
                        .map((m) => `${m.condition} x${m.multiplier.toFixed(2)}`)
                        .join("  /  ")}
                    </span>
                  </th>
                  <td className="py-3.5 pr-6 text-right tabular-nums">
                    {fmtInt(line.baseRate.amount)}
                  </td>
                  <td className="py-3.5 pr-6 text-right tabular-nums">{line.includesRevisions}</td>
                  <td className="py-3.5 text-right tabular-nums">
                    {line.rushFeePercent ? `+${line.rushFeePercent}%` : "n/a"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className={`${BILL} mt-12 text-[clamp(1.3rem,3vw,1.9rem)] uppercase leading-tight`}>
          The rights schedule that ships with it
        </h3>
        <dl className={`${SPEC} mt-5 grid max-w-[62rem] gap-x-10 gap-y-0 text-[12.5px] lg:grid-cols-2`}>
          {[
            ["Organic use", DEFAULT_RIGHTS.organic ? "Included" : "Not included"],
            ["Paid use", DEFAULT_RIGHTS.paid ? "Included" : "Not included"],
            [
              "Whitelisting",
              DEFAULT_RIGHTS.whitelisting ? "Included" : "Priced separately, because it is separate",
            ],
            ["Term", `${DEFAULT_RIGHTS.termDays} days from first run`],
            ["Territory", DEFAULT_RIGHTS.territory.join(", ")],
            [
              "Category exclusivity",
              DEFAULT_RIGHTS.exclusivityDays === 0
                ? "None. Priced per 30 days if asked for"
                : `${DEFAULT_RIGHTS.exclusivityDays} days`,
            ],
            ["Credit", DEFAULT_RIGHTS.creditRequired ? "Required" : "Not required"],
            ["Renewal", DEFAULT_RIGHTS.renegotiationTerms ?? ""],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-4 border-t border-[var(--rule)] py-2.5">
              <dt className="w-[7rem] shrink-0 text-[var(--ink-2)] sm:w-[9rem]">{k}</dt>
              <dd className="max-w-[29rem] flex-1">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------------------------------------------------------------- *
          Mechanical requirements. A media kit prints these and so does this card.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="specs" className="pt-16">
        <h2 id="specs" className={`${BILL} text-[clamp(1.7rem,4vw,2.6rem)] uppercase leading-[0.92]`}>
          Mechanical requirements
        </h2>
        <p className="mt-4 max-w-[33rem] text-[15px] leading-relaxed">
          The spec sheet students deliver against. Checked against the platform documentation on{" "}
          {SPECS[0].checkedOn}, and re-checked quarterly, because these numbers move and a spec sheet
          nobody dates is a spec sheet nobody can trust.
        </p>

        <div className="mt-7 overflow-x-auto">
          <table className={`${SPEC} w-full min-w-[52rem] border-collapse text-[12.5px]`}>
            <caption className="sr-only">
              Deliverable specifications by platform, with safe zones in pixels
            </caption>
            <thead>
              <tr className="border-y-2 border-[var(--ink)] text-left">
                {["Deliverable", "Frame", "Max", "Safe top", "Safe bottom", "Safe left", "Safe right", "Captions", "Audio"].map(
                  (h) => (
                    <th
                      key={h}
                      scope="col"
                      className="py-2.5 pr-5 text-[11px] font-semibold uppercase tracking-[0.11em] last:pr-0"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {SPECS.map((sp) => (
                <tr key={sp.id} className="border-b border-[var(--rule)] align-top">
                  <th scope="row" className="py-3 pr-5 text-left text-[12.5px] font-medium">
                    {sp.name}
                  </th>
                  <td className="py-3 pr-5 tabular-nums">
                    {sp.resolution.width}x{sp.resolution.height}
                  </td>
                  <td className="py-3 pr-5 tabular-nums">
                    {sp.maxDurationS > 0 ? `${sp.maxDurationS} s` : `${sp.maxFileMb} MB`}
                  </td>
                  <td className="py-3 pr-5 tabular-nums">{sp.safeZones.topPx}</td>
                  <td className="py-3 pr-5 tabular-nums">{sp.safeZones.bottomPx}</td>
                  <td className="py-3 pr-5 tabular-nums">{sp.safeZones.leftPx}</td>
                  <td className="py-3 pr-5 tabular-nums">{sp.safeZones.rightPx}</td>
                  <td className="py-3 pr-5">{sp.captionRequirement.replace("_", " ")}</td>
                  <td className="py-3">{sp.audioRequirement.replace(/_/g, " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`${SPEC} mt-4 max-w-[27rem] text-[12px] leading-relaxed text-[var(--ink-2)]`}>
          Naming convention on every delivery: {SPECS[0].namingConvention}. A file nobody can sort is
          a file a media buyer will not use.
        </p>
      </section>

      {/* ---------------------------------------------------------------- *
          The go to market half, which is the half that decides whether the
          creative had anything worth being attached to.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="gtm" className="pt-16">
        <h2 id="gtm" className={`${BILL} text-[clamp(1.7rem,4vw,2.6rem)] uppercase leading-[0.92]`}>
          What the ads are attached to
        </h2>
        <p className="mt-4 max-w-[33rem] text-[15px] leading-relaxed">
          Two motions are taught alongside the creative, because a hook rate is not a business. Each
          one is taught with its funnel definitions and its failure modes, and the economics below
          are worked examples.
        </p>

        <div className="mt-8">
          {GTM_PLAYS.map((play) => (
            <article key={play.id} className="border-t-2 border-[var(--ink)] py-8">
              <div className="grid gap-x-10 gap-y-5 lg:grid-cols-[1fr_1fr]">
                <div>
                  <h3 className={`${BILL} text-[clamp(1.3rem,2.8vw,1.9rem)] uppercase leading-[0.95]`}>
                    {play.name}
                  </h3>
                  <p className={`${SPEC} mt-2 text-[12px] uppercase tracking-[0.11em] text-[var(--spot)]`}>
                    {play.motion.replace(/_/g, " ")}
                  </p>
                  <dl className="mt-5 grid gap-y-4">
                    <Field k="Who">{play.icp.segment}</Field>
                    <Field k="Trigger">{play.icp.trigger}</Field>
                    <Field k="Blocker">{play.icp.blocker}</Field>
                    <Field k="Claim">{play.positioning.claim}</Field>
                    <Field k="Proof">{play.positioning.proof}</Field>
                  </dl>
                </div>

                <div>
                  <h4 className={`${SPEC} text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]`}>
                    Funnel, as instrumented
                  </h4>
                  <ol className={`${SPEC} mt-3 text-[12.5px]`}>
                    {play.funnel.map((f, i) => (
                      <li key={f.stage} className="flex gap-3 border-t border-[var(--rule)] py-2">
                        <span className="w-5 shrink-0 tabular-nums text-[var(--spot)]">{i + 1}</span>
                        <span className="flex-1">
                          <span className="font-medium">{f.stage}</span>
                          <span className="block max-w-[26rem] text-[11.5px] leading-snug text-[var(--ink-2)]">
                            {f.definition}. Read from {f.instrumentedBy.toLowerCase()}.
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>

                  <h4 className={`${SPEC} mt-6 text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]`}>
                    Worked economics <Illustrative />
                  </h4>
                  <dl className={`${SPEC} mt-3 flex flex-wrap gap-x-8 gap-y-2 text-[12.5px] tabular-nums`}>
                    {play.economics.aov ? (
                      <div className="flex gap-2">
                        <dt className="text-[var(--ink-2)]">AOV</dt>
                        <dd>
                          {play.economics.aov} {play.economics.currency}
                        </dd>
                      </div>
                    ) : null}
                    {play.economics.cac ? (
                      <div className="flex gap-2">
                        <dt className="text-[var(--ink-2)]">CAC</dt>
                        <dd>
                          {play.economics.cac} {play.economics.currency}
                        </dd>
                      </div>
                    ) : null}
                    {play.economics.mer ? (
                      <div className="flex gap-2">
                        <dt className="text-[var(--ink-2)]">MER</dt>
                        <dd>{play.economics.mer.toFixed(1)}</dd>
                      </div>
                    ) : null}
                    {play.economics.paybackMonths !== undefined ? (
                      <div className="flex gap-2">
                        <dt className="text-[var(--ink-2)]">Payback</dt>
                        <dd>{play.economics.paybackMonths} months</dd>
                      </div>
                    ) : null}
                  </dl>

                  <h4 className={`${SPEC} mt-6 text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]`}>
                    How it fails
                  </h4>
                  <ul className="mt-2 max-w-[29rem]">
                    {play.failureModes.map((f) => (
                      <li key={f} className="border-t border-[var(--rule)] py-2 text-[13.5px] leading-snug">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- *
          Compliance. Taught, because accounts get restricted for it.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="compliance" className="pt-14">
        <h2 id="compliance" className={`${BILL} text-[clamp(1.5rem,3.4vw,2.2rem)] uppercase leading-[0.95]`}>
          What you are not allowed to say
        </h2>
        <p className="mt-3 max-w-[33rem] text-[15px] leading-relaxed">{COMPLIANCE.intro}</p>

        <div className="mt-7 grid gap-x-12 gap-y-8 lg:grid-cols-2">
          <div>
            <h3 className={`${SPEC} text-[11px] uppercase tracking-[0.13em] text-[var(--spot)]`}>
              Prohibited on the brief
            </h3>
            <ul className="mt-3 max-w-[31rem]">
              {COMPLIANCE.prohibited.map((c) => (
                <li key={c} className="border-t border-[var(--rule)] py-2.5 text-[14px] leading-snug">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={`${SPEC} text-[11px] uppercase tracking-[0.13em] text-[var(--spot)]`}>
              Disclosure, which is not optional
            </h3>
            <ul className="mt-3 max-w-[31rem]">
              {COMPLIANCE.disclosure.map((c) => (
                <li key={c} className="border-t border-[var(--rule)] py-2.5 text-[14px] leading-snug">
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-[31rem] text-[14px] leading-relaxed text-[var(--ink-2)]">
              {COMPLIANCE.taught}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- *
          The free resource. Useful whether or not anybody enrols.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="free" className="pt-16">
        <h2 id="free" className={`${BILL} text-[clamp(1.5rem,3.4vw,2.2rem)] uppercase leading-[0.95]`}>
          Take the spec sheet first
        </h2>
        <p className="mt-3 max-w-[33rem] text-[15px] leading-relaxed">
          The spec sheet above and the rate card template, as two documents you can use tomorrow
          whether or not you ever take a seat. No sequence follows, and the address is not passed on.
        </p>
        <SpecSheetRequest />
      </section>

      {/* ---------------------------------------------------------------- *
          The ticket band. Reversed out, across the foot, price first.
       * ---------------------------------------------------------------- */}
      <section
        id="ticket"
        aria-labelledby="ticket-h"
        className="mt-20 bg-[var(--plate)] px-5 py-12 text-[var(--plate-ink)] sm:px-9"
      >
        <h2 id="ticket-h" className={`${BILL} text-[clamp(2.2rem,6vw,4rem)] uppercase leading-[0.88]`}>
          The ticket
        </h2>

        <div className="mt-8 grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className={`${BILL} text-[clamp(2.6rem,7vw,4.4rem)] leading-none tabular-nums`}>
              {fmtInt(OFFER.listPrice.amount)}
              <span className="ml-3 text-[0.32em] uppercase tracking-[0.12em] text-[var(--plate-ink-2)]">
                EUR net
              </span>
            </p>
            <p className={`${SPEC} mt-3 max-w-[28rem] text-[12.5px] leading-relaxed text-[var(--plate-ink-2)]`}>
              {OFFER.listPrice.taxNote}
            </p>

            <dl className={`${SPEC} mt-7 text-[12.5px]`}>
              {OFFER.paymentOptions.map((p) => (
                <div key={p.kind} className="border-t border-[#3a3320] py-3">
                  <dt className="flex flex-wrap items-baseline gap-x-3 text-[13px] font-medium">
                    <span className="uppercase tracking-[0.08em]">
                      {p.kind === "upfront" ? "Once" : `${p.count} instalments`}
                    </span>
                    <span className="tabular-nums text-[var(--plate-ink-2)]">
                      {p.amountEach ? `${fmtInt(p.amountEach)} EUR each, ` : ""}
                      {fmtInt(p.total)} EUR total
                      {p.feePercent ? `, ${p.feePercent}% finance fee` : ""}
                    </span>
                  </dt>
                  <dd className="mt-1.5 max-w-[28rem] leading-relaxed text-[var(--plate-ink-2)]">
                    {p.note}
                  </dd>
                </div>
              ))}
            </dl>

            <a
              href="mailto:seats@halbesekunde.example?subject=Seat%20on%20the%20September%20card"
              className={`${s.focusablePlate} ${BILL} mt-8 inline-block border-2 border-[var(--stock)] bg-[var(--stock)] px-6 py-3 text-[18px] uppercase tracking-[0.06em] text-[var(--plate)] transition-colors hover:bg-transparent hover:text-[var(--stock)]`}
            >
              Take a seat on the September card
            </a>
            <p className={`${SPEC} mt-3 max-w-[27rem] text-[12px] tabular-nums text-[var(--plate-ink-2)]`}>
              {CARD.seatsHeld} of {CARD.seatsPerCohort} seats held. The count is the register, not a
              device.
            </p>
          </div>

          <div>
            <h3 className={`${SPEC} text-[11px] uppercase tracking-[0.13em] text-[var(--plate-ink-2)]`}>
              When it closes, and why
            </h3>
            <p className={`${BILL} mt-2 text-[clamp(1.4rem,3.2vw,2rem)] uppercase leading-none tabular-nums`}>
              {OFFER.deadline?.closesAt}
            </p>
            <p className="mt-3 max-w-[30rem] text-[14px] leading-relaxed text-[var(--plate-ink-2)]">
              {OFFER.deadline?.reason}
            </p>

            <h3 className={`${SPEC} mt-8 text-[11px] uppercase tracking-[0.13em] text-[var(--plate-ink-2)]`}>
              Guarantee
            </h3>
            <p className="mt-2 max-w-[30rem] text-[14px] leading-relaxed">{OFFER.guaranteeAbsence}</p>

            <h3 className={`${SPEC} mt-8 text-[11px] uppercase tracking-[0.13em] text-[var(--plate-ink-2)]`}>
              Refund policy, quoted in full
            </h3>
            <blockquote className="mt-2 border-l-2 border-[var(--stock)] pl-4">
              <p className="max-w-[30rem] text-[14px] leading-relaxed">
                {OFFER.refundPolicy.quotedVerbatim}
              </p>
            </blockquote>
            <p className={`${SPEC} mt-2 text-[12px] text-[var(--plate-ink-2)]`}>
              {OFFER.refundPolicy.conditions}
            </p>

            <h3 className={`${SPEC} mt-8 text-[11px] uppercase tracking-[0.13em] text-[var(--plate-ink-2)]`}>
              What comes with the seat
            </h3>
            <ul className="mt-2">
              {OFFER.bonuses.map((b) => (
                <li key={b.name} className="max-w-[29rem] border-t border-[#3a3320] py-2.5">
                  <span className="text-[13.5px] font-medium">{b.name}. </span>
                  <span className="text-[13.5px] leading-relaxed text-[var(--plate-ink-2)]">
                    {b.description}
                  </span>
                </li>
              ))}
            </ul>
            <p className={`${SPEC} mt-3 max-w-[27rem] text-[12px] leading-relaxed text-[var(--plate-ink-2)]`}>
              {OFFER.bonusValueNote}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- *
          Foot of the bill.
       * ---------------------------------------------------------------- */}
      <footer className="py-10">
        <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-6">
          <div>
            <p className={`${BILL} text-[1.3rem] uppercase leading-none tracking-[0.03em]`}>
              {CARD.promoter}
            </p>
            <p className={`${SPEC} mt-2 max-w-[27rem] text-[12px] leading-relaxed text-[var(--ink-2)]`}>
              Taught by {INSTRUCTORS.map((i) => i.name).join(" and ")}.{" "}
              {INSTRUCTORS[0].doesWhat}. {INSTRUCTORS[1].doesWhat}.
            </p>
          </div>
          <p className={`${SPEC} max-w-[27rem] text-[12px] leading-relaxed text-[var(--ink-2)]`}>
            Illustrative card built as an Gmira proof surface. {AD_ASSETS.length} synthetic ads,{" "}
            {TEARDOWNS.length} synthetic teardowns, zero real advertisers. Card updated{" "}
            <span className="tabular-nums">2026-07-25</span>.
          </p>
        </div>
      </footer>
    </main>
  );
}
