import Link from "next/link";
import { notFound } from "next/navigation";
import s from "../bill.module.css";
import {
  ARCHETYPE_LABEL,
  CARD,
  PERF_SOURCE_LABEL,
  PLATFORM_LABEL,
  TEARDOWNS,
  adById,
  briefById,
  fmtInt,
  instructorById,
  specById,
  teardownBySlug,
  timecode,
  type AdAsset,
} from "../data";

const BILL = "font-[family-name:var(--font-bill)]";
const SPEC = "font-[family-name:var(--font-spec)]";

export function generateStaticParams() {
  return TEARDOWNS.filter((t) => t.isPublic).map((t) => ({ bout: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ bout: string }> }) {
  const { bout } = await params;
  const t = teardownBySlug(bout);
  if (!t) return { title: "Bout not on this card" };
  const ad = adById(t.adAssetId);
  return {
    title: `${t.boutName} vs ${t.opponent} / ${t.billing}`,
    description: `${t.thesis} ${ad ? `${PLATFORM_LABEL[ad.platform]}, ${ad.aspectRatio}, ${ad.durationS ?? 0} seconds.` : ""} Illustrative teardown, synthetic advertiser data.`,
  };
}

function Illustrative() {
  return (
    <span
      className={`${SPEC} inline-block border border-[var(--spot)] px-1.5 py-[1px] align-middle text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--spot)]`}
    >
      Illustrative
    </span>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 border-t border-[var(--rule)] py-2">
      <dt className="w-[8rem] shrink-0 text-[var(--ink-2)]">{k}</dt>
      <dd className="max-w-[29rem] flex-1">{children}</dd>
    </div>
  );
}

/* The archived MP4 is not in this build, so the frame is reconstructed from the shot
   list and the spec instead of faked as a screenshot. It is drawn entirely in CSS,
   which makes it a teaching artifact rather than a placeholder: the dashed bands are
   the platform safe zones at their real pixel values, and the ticks down the left rail
   are the beats at their real timecodes. */
function FrameReconstruction({
  ad,
  safe,
}: {
  ad: AdAsset;
  safe: { topPx: number; bottomPx: number; leftPx: number; rightPx: number; note: string };
}) {
  const H = ad.resolution.height;
  const W = ad.resolution.width;
  const pctT = (safe.topPx / H) * 100;
  const pctB = (safe.bottomPx / H) * 100;
  const pctL = (safe.leftPx / W) * 100;
  const pctR = (safe.rightPx / W) * 100;
  const dur = ad.durationS ?? 1;

  return (
    <div
      className="relative w-full max-w-[19rem] shrink-0 bg-[var(--plate)] text-[var(--plate-ink)]"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      {/* safe zone guides */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 border-b border-dashed border-[var(--spot-hi)]"
        style={{ height: `${pctT}%` }}
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 border-t border-dashed border-[var(--spot-hi)]"
        style={{ height: `${pctB}%` }}
      />
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 border-r border-dashed border-[var(--spot-hi)]"
        style={{ width: `${pctL}%` }}
      />
      <span
        aria-hidden
        className="absolute inset-y-0 right-0 border-l border-dashed border-[var(--spot-hi)]"
        style={{ width: `${pctR}%` }}
      />

      {/* beat rail with real timecodes */}
      <span aria-hidden className="absolute bottom-0 left-[3px] top-0 w-px bg-[var(--plate-ink-2)] opacity-60" />
      {ad.beats.map((b) => (
        <span
          key={`${b.atS}-${b.label}`}
          aria-hidden
          className="absolute left-0 h-px w-[11px] bg-[var(--spot-hi)]"
          style={{ top: `${Math.min(99, (b.atS / dur) * 100)}%` }}
        />
      ))}

      {/* the readable part of the frame */}
      <div
        className="absolute flex flex-col justify-between"
        style={{
          top: `${pctT + 2}%`,
          bottom: `${pctB + 2}%`,
          left: `${pctL + 4}%`,
          right: `${pctR + 4}%`,
        }}
      >
        <div>
          <p className={`${SPEC} text-[10.5px] uppercase tracking-[0.12em] text-[var(--plate-ink-2)]`}>
            Frame 0
          </p>
          {ad.hook.onScreenText ? (
            <p className={`${BILL} mt-2 text-[clamp(1.1rem,3.4vw,1.6rem)] uppercase leading-[0.95]`}>
              {ad.hook.onScreenText}
            </p>
          ) : (
            <p className={`${SPEC} mt-2 text-[11.5px] leading-snug text-[var(--plate-ink-2)]`}>
              No on screen text at frame zero.
            </p>
          )}
        </div>
        <p className="text-[11.5px] leading-snug">{ad.hook.firstFrameDescription}</p>
        {ad.burnedInCaptions && ad.hook.spokenOpener ? (
          <p className={`${SPEC} bg-[#2a2413] px-2 py-1 text-[10.5px] leading-snug text-[var(--plate-ink)]`}>
            {ad.hook.spokenOpener}
          </p>
        ) : (
          <p className={`${SPEC} text-[10.5px] text-[var(--plate-ink-2)]`}>No burned in captions.</p>
        )}
      </div>
    </div>
  );
}

export default async function BoutPage({ params }: { params: Promise<{ bout: string }> }) {
  const { bout } = await params;
  const t = teardownBySlug(bout);
  if (!t || !t.isPublic) notFound();

  const ad = adById(t.adAssetId);
  if (!ad) notFound();

  const spec = specById(t.rebuildSpecId);
  const brief = briefById(t.briefId);
  const author = instructorById(t.authorId);
  const publicList = TEARDOWNS.filter((x) => x.isPublic);
  const idx = publicList.findIndex((x) => x.slug === t.slug);
  const prev = publicList[idx - 1];
  const next = publicList[idx + 1];
  const hookEndsAt = ad.hook.lengthMs / 1000;
  const perf = ad.performance;
  const tape = t.controlComparison;

  return (
    <main className="mx-auto max-w-[1240px] px-5 pb-0 pt-8 md:px-9">
      <nav
        aria-label="Breadcrumb"
        className={`${SPEC} text-[11.5px] uppercase tracking-[0.13em] text-[var(--ink-2)]`}
      >
        <Link
          href="/proof/ads"
          className={`${s.focusable} underline decoration-[var(--spot)] decoration-2 underline-offset-4 hover:text-[var(--ink)]`}
        >
          {CARD.promoter}
        </Link>
        <span aria-hidden className="mx-2">
          /
        </span>
        <span>{t.billing}</span>
      </nav>

      {/* ---------------------------------------------------------------- *
          The bout, billed.
       * ---------------------------------------------------------------- */}
      <header className="mt-5">
        <span aria-hidden className="block h-[6px] w-full bg-[var(--ink)]" />
        <div
          className={`${SPEC} mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[12px] uppercase tracking-[0.13em] text-[var(--ink-2)]`}
        >
          <span>{t.billing}</span>
          <span className="tabular-nums">
            {PLATFORM_LABEL[ad.platform]} / {ad.format} / {ad.aspectRatio} / {ad.resolution.width}x
            {ad.resolution.height}
            {ad.durationS ? ` / ${ad.durationS} s` : ""}
          </span>
        </div>

        <h1
          className={`${BILL} mt-5 flex flex-col items-center gap-1 uppercase leading-[0.88] md:flex-row md:justify-center md:gap-6`}
        >
          <span className={`${s.stareLeft} text-center text-[clamp(1.9rem,5.4vw,3.5rem)] md:flex-1 md:text-right`}>
            {t.boutName}
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden className={`${s.stareRule} block h-[2px] w-8 bg-[var(--spot)] md:w-12`} />
            <span className="text-[clamp(1rem,1.9vw,1.35rem)] text-[var(--spot)]">vs</span>
            <span aria-hidden className={`${s.stareRule} block h-[2px] w-8 bg-[var(--spot)] md:w-12`} />
          </span>
          <span
            className={`${s.stareRight} text-center text-[clamp(1.9rem,5.4vw,3.5rem)] text-[var(--ink-2)] md:flex-1 md:text-left`}
          >
            {t.opponent}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-[35rem] text-[clamp(1rem,1.5vw,1.1rem)] leading-relaxed">
          {t.thesis}
        </p>

        <span aria-hidden className="mt-7 block h-[2px] w-full bg-[var(--ink)]" />
        <dl className={`${SPEC} mt-4 flex flex-wrap gap-x-10 gap-y-3 text-[12.5px]`}>
          {[
            ["Advertiser", ad.advertiser.name],
            ["Ad library id", ad.adLibraryId ?? "none recorded"],
            ["Ran", `${ad.ranFrom} to ${ad.ranTo}`],
            ["Torn down by", author?.name ?? "unattributed"],
            ["Published", t.publishedAt],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]">{k}</dt>
              <dd className="mt-1 tabular-nums">{v}</dd>
            </div>
          ))}
          <div>
            <dt className="text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]">Verifiable</dt>
            <dd className="mt-1">
              No. Synthetic <Illustrative />
            </dd>
          </div>
        </dl>
      </header>

      {/* ---------------------------------------------------------------- *
          The hook, with the frame reconstructed rather than faked.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="hook" className="pt-14">
        <h2 id="hook" className={`${BILL} text-[clamp(2rem,5vw,3.2rem)] uppercase leading-[0.9]`}>
          The hook
        </h2>
        <p className={`${SPEC} mt-3 text-[12.5px] uppercase tracking-[0.11em] text-[var(--spot)]`}>
          Ends at {hookEndsAt.toFixed(1)} s / {ARCHETYPE_LABEL[ad.hook.archetype]}
        </p>

        <div className="mt-7 flex flex-col gap-x-12 gap-y-8 lg:flex-row">
          <figure className="m-0 shrink-0">
            <FrameReconstruction
              ad={ad}
              safe={
                spec?.safeZones ?? {
                  topPx: 200,
                  bottomPx: 480,
                  leftPx: 60,
                  rightPx: 60,
                  note: "Generic safe zone.",
                }
              }
            />
            <figcaption className={`${SPEC} mt-3 max-w-[19rem] text-[11.5px] leading-relaxed text-[var(--ink-2)]`}>
              Frame reconstruction, drawn in CSS from the shot list. The dashed bands are the safe
              zones at their real pixel values and the ticks on the left rail are the beats at their
              real timecodes. {ad.archivedCopy.note}
            </figcaption>
          </figure>

          <div className="min-w-0 flex-1">
            {ad.hook.spokenOpener ? (
              <blockquote className="border-l-[3px] border-[var(--spot)] pl-5">
                <p className={`${BILL} text-[clamp(1.4rem,3.4vw,2.2rem)] leading-[1.02]`}>
                  {ad.hook.spokenOpener}
                </p>
                <footer className={`${SPEC} mt-2 text-[11.5px] uppercase tracking-[0.12em] text-[var(--ink-2)]`}>
                  The literal first line
                </footer>
              </blockquote>
            ) : (
              <p className="max-w-[33rem] text-[15px] leading-relaxed">
                No spoken opener. The whole argument is carried by the frame.
              </p>
            )}

            <dl className={`${SPEC} mt-7 max-w-[44rem] text-[12.5px]`}>
              <Row k="First frame">{ad.hook.firstFrameDescription}</Row>
              <Row k="On screen">{ad.hook.onScreenText ?? "Nothing at frame zero"}</Row>
              <Row k="Archetype">{ARCHETYPE_LABEL[ad.hook.archetype]}</Row>
              <Row k="Hook length">
                <span className="tabular-nums">{ad.hook.lengthMs} ms</span>
              </Row>
              <Row k="Shot on">{ad.shotOn.replace(/_/g, " ")}</Row>
              <Row k="Captions">{ad.burnedInCaptions ? "Burned in" : "None, which is a fault"}</Row>
              <Row k="Sound">{ad.hasSound ? "Yes, works muted" : "None"}</Row>
              <Row k="Production cost">
                {ad.productionCost ? (
                  <>
                    <span className="tabular-nums">
                      {fmtInt(ad.productionCost.amount)} {ad.productionCost.currency}
                    </span>
                    <span className="text-[var(--ink-2)]">. {ad.productionCost.note}</span>
                  </>
                ) : (
                  "Not recorded"
                )}
              </Row>
            </dl>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- *
          Round by round. The beats, on a scorecard.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="rounds" className="pt-16">
        <h2 id="rounds" className={`${BILL} text-[clamp(2rem,5vw,3.2rem)] uppercase leading-[0.9]`}>
          Round by round
        </h2>
        <p className="mt-4 max-w-[33rem] text-[15px] leading-relaxed">
          Every beat with its timecode and the job it does. The rule marks where the hook ends. After
          it, nothing is being won, only held.
        </p>

        <ol className="mt-8">
          {ad.beats.map((b, i) => {
            const annotation = t.annotations.find((a) => a.atS === b.atS);
            const crossesHook =
              i > 0 && ad.beats[i - 1].atS < hookEndsAt && b.atS >= hookEndsAt && hookEndsAt > 0;
            return (
              <li key={`${b.atS}-${b.label}`}>
                {crossesHook ? (
                  <p
                    className={`${SPEC} flex items-center gap-4 border-t-2 border-[var(--spot)] py-2 text-[11.5px] uppercase tracking-[0.13em] text-[var(--spot)]`}
                  >
                    <span className="tabular-nums">{timecode(hookEndsAt)}</span>
                    <span>Hook ends. Retention maintenance from here.</span>
                  </p>
                ) : null}
                <div className="grid grid-cols-[4.5rem_1fr] gap-x-5 gap-y-1 border-t border-[var(--rule)] py-4 sm:grid-cols-[4.5rem_6.5rem_1fr]">
                  <span className={`${SPEC} text-[12.5px] tabular-nums text-[var(--spot)]`}>
                    {timecode(b.atS)}
                  </span>
                  <span
                    className={`${SPEC} text-[11px] uppercase tracking-[0.12em] text-[var(--ink-2)]`}
                  >
                    {b.purpose}
                  </span>
                  <div className="col-span-2 sm:col-span-1">
                    <p className={`${BILL} text-[clamp(1rem,2vw,1.3rem)] uppercase leading-tight`}>
                      {b.label}
                    </p>
                    <p className="mt-1.5 max-w-[31rem] text-[14px] leading-relaxed text-[var(--ink-2)]">
                      {b.note}
                    </p>
                    {annotation ? (
                      <p className="mt-2 max-w-[31rem] border-l-2 border-[var(--spot)] pl-3 text-[14px] leading-relaxed">
                        {annotation.note}
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <dl className={`${SPEC} mt-6 max-w-[34rem] text-[12.5px]`}>
          <Row k="Call to action">
            {ad.cta.spoken ?? ad.cta.onScreen ?? "None"}
            <span className="text-[var(--ink-2)]">
              {" "}
              at <span className="tabular-nums">{timecode(ad.cta.atS)}</span>, to the{" "}
              {ad.cta.destination === "pdp" ? "product page" : ad.cta.destination === "lp" ? "landing page" : ad.cta.destination}
            </span>
          </Row>
          <Row k="Objections handled">
            {ad.objectionsAddressed.length > 0 ? ad.objectionsAddressed.join(". ") : "None, which is why it lost"}
          </Row>
          <Row k="Social proof device">{(ad.socialProofDevice ?? "none").replace(/_/g, " ")}</Row>
        </dl>
      </section>

      {/* ---------------------------------------------------------------- *
          Tale of the tape. Every figure with its denominator, all illustrative.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="tape" className="pt-16">
        <span aria-hidden className="block h-[6px] w-full bg-[var(--ink)]" />
        <h2 id="tape" className={`${BILL} mt-6 text-[clamp(2rem,5vw,3.2rem)] uppercase leading-[0.9]`}>
          Tale of the tape
        </h2>

        {tape && perf ? (
          <>
            <p className="mt-4 max-w-[33rem] text-[15px] leading-relaxed">
              The same audience, the same window, the same offer. A figure without the thing it beat
              is half a figure, so the control sits beside it and the denominator sits under the
              label. <Illustrative />
            </p>

            <dl className={`${SPEC} mt-6 flex flex-wrap gap-x-10 gap-y-3 text-[12.5px]`}>
              {[
                ["Read from", PERF_SOURCE_LABEL[tape.sharedSource]],
                ["Window", `${tape.sharedWindow.from} to ${tape.sharedWindow.to}`],
                ["Spend", perf.spend ? `${fmtInt(perf.spend.amount)} ${perf.spend.currency}` : "not recorded"],
                ["Impressions", perf.impressions ? fmtInt(perf.impressions) : "not recorded"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]">{k}</dt>
                  <dd className="mt-1 tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mx-auto mt-8 max-w-[58rem] border-t-2 border-[var(--ink)]">
              <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-x-4 py-4">
                <p className={`${BILL} text-right text-[clamp(0.95rem,2.2vw,1.35rem)] uppercase leading-none`}>
                  This ad
                </p>
                <p className={`${SPEC} w-[9rem] px-2 text-center text-[11px] uppercase tracking-[0.12em] text-[var(--spot)] sm:w-[13rem]`}>
                  vs
                </p>
                <div>
                  <p className={`${BILL} text-[clamp(0.95rem,2.2vw,1.35rem)] uppercase leading-none`}>
                    Control
                  </p>
                  <p className={`${SPEC} mt-2 max-w-[15rem] text-[11.5px] leading-snug text-[var(--ink-2)]`}>
                    {tape.controlLabel}
                  </p>
                </div>
              </div>

              <dl>
                {tape.rows.map((r) => {
                  const adWins = r.betterIs === "higher" ? r.thisAd > r.control : r.thisAd < r.control;
                  return (
                    <div
                      key={r.metric}
                      className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-x-4 border-t border-[var(--rule)] py-3.5"
                    >
                      <dd
                        className={`${SPEC} col-start-1 text-right text-[clamp(0.95rem,2vw,1.15rem)] tabular-nums ${
                          adWins ? "font-semibold text-[var(--ink)]" : "text-[var(--ink-2)]"
                        }`}
                      >
                        {r.thisAd}
                        {r.unit === "%" ? "%" : r.unit === "x" ? "x" : ""}
                        {adWins ? <span className="ml-1.5 text-[var(--spot)]">&bull;</span> : null}
                      </dd>
                      <dt className="col-start-2 w-[9rem] text-center sm:w-[13rem]">
                        <span
                          className={`${SPEC} block text-[11.5px] uppercase tracking-[0.08em] text-[var(--ink)]`}
                        >
                          {r.metric}
                          {r.unit === "EUR" ? ", EUR" : ""}
                        </span>
                        <span
                          className={`${SPEC} mt-0.5 block text-[11px] leading-tight text-[var(--ink-2)]`}
                        >
                          {r.denominator}
                        </span>
                      </dt>
                      <dd
                        className={`${SPEC} col-start-3 text-[clamp(0.95rem,2vw,1.15rem)] tabular-nums ${
                          adWins ? "text-[var(--ink-2)]" : "font-semibold text-[var(--ink)]"
                        }`}
                      >
                        {!adWins ? <span className="mr-1.5 text-[var(--spot)]">&bull;</span> : null}
                        {r.control}
                        {r.unit === "%" ? "%" : r.unit === "x" ? "x" : ""}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </>
        ) : perf ? (
          <>
            <p className="mt-4 max-w-[33rem] text-[15px] leading-relaxed">
              No control ran against this one, so there is no tape. What there is: the account, the
              window and the spend beside the result, which is the least a figure needs to mean
              anything. <Illustrative />
            </p>
            <dl className={`${SPEC} mt-6 max-w-[34rem] text-[12.5px]`}>
              <Row k="Read from">{PERF_SOURCE_LABEL[perf.source]}</Row>
              <Row k="Window">
                <span className="tabular-nums">
                  {perf.window.from} to {perf.window.to}
                </span>
              </Row>
              <Row k="Spend">
                <span className="tabular-nums">
                  {perf.spend ? `${fmtInt(perf.spend.amount)} ${perf.spend.currency}` : "not recorded"}
                </span>
              </Row>
              <Row k="Impressions">
                <span className="tabular-nums">{perf.impressions ? fmtInt(perf.impressions) : "not recorded"}</span>
              </Row>
              <Row k="Hook rate">
                <span className="tabular-nums">{perf.hookRatePercent}%</span>
                <span className="text-[var(--ink-2)]"> of impressions reached 3 seconds</span>
              </Row>
              <Row k="Hold rate">
                <span className="tabular-nums">{perf.holdRatePercent}%</span>
                <span className="text-[var(--ink-2)]"> of those 3 second views became thruplays</span>
              </Row>
              <Row k="Outbound CTR">
                <span className="tabular-nums">{perf.outboundCtrPercent}%</span>
              </Row>
              <Row k="CPM">
                <span className="tabular-nums">{perf.cpm} EUR</span>
              </Row>
              <Row k="CPA">
                <span className="tabular-nums">{perf.cpa} EUR</span>
              </Row>
              <Row k="Return on spend">
                <span className="tabular-nums">{perf.roas}x</span>
                <span className="text-[var(--ink-2)]"> attributed, 7 day click</span>
              </Row>
            </dl>
          </>
        ) : (
          <p className="mt-4 max-w-[33rem] text-[15px] leading-relaxed">
            No performance data is attached to this bout. Rather than fill the space with a figure
            nobody can trace, the space stays empty and says so.
          </p>
        )}
      </section>

      {/* ---------------------------------------------------------------- *
          Steal and do not copy.
       * ---------------------------------------------------------------- */}
      <section aria-labelledby="steal" className="pt-16">
        <h2 id="steal" className={`${BILL} text-[clamp(1.7rem,4vw,2.6rem)] uppercase leading-[0.92]`}>
          Steal this, leave that
        </h2>
        <div className="mt-6 grid gap-x-12 gap-y-8 lg:grid-cols-2">
          <div>
            <h3 className={`${SPEC} text-[11px] uppercase tracking-[0.13em] text-[var(--spot)]`}>
              Steal
            </h3>
            <ul className="mt-3 max-w-[33rem]">
              {t.whatToSteal.map((x) => (
                <li key={x} className="border-t border-[var(--rule)] py-2.5 text-[14.5px] leading-snug">
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={`${SPEC} text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]`}>
              Do not copy, it only worked for them
            </h3>
            <ul className="mt-3 max-w-[33rem]">
              {t.whatNotToCopy.map((x) => (
                <li key={x} className="border-t border-[var(--rule)] py-2.5 text-[14.5px] leading-snug">
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- *
          The brief behind it, where there is one.
       * ---------------------------------------------------------------- */}
      {brief ? (
        <section aria-labelledby="brief" className="pt-16">
          <h2 id="brief" className={`${BILL} text-[clamp(1.7rem,4vw,2.6rem)] uppercase leading-[0.92]`}>
            The brief it came from
          </h2>
          <p className={`${SPEC} mt-3 text-[12.5px] uppercase tracking-[0.11em] text-[var(--spot)]`}>
            {brief.campaign} / {brief.objective}
          </p>

          <div className="mt-6 grid gap-x-12 gap-y-8 lg:grid-cols-2">
            <dl className={`${SPEC} max-w-[34rem] text-[12.5px]`}>
              <Row k="Audience">{brief.audience.description}</Row>
              <Row k="Pain">{brief.audience.painPoint}</Row>
              <Row k="Doing instead">{brief.audience.currentSolution}</Row>
              <Row k="Objection">{brief.audience.objection}</Row>
              <Row k="Offer">{brief.offer}</Row>
              <Row k="Variants">
                <span className="tabular-nums">{brief.variantCount}</span>, with{" "}
                <span className="tabular-nums">{brief.revisionRounds}</span> revision round
                {brief.revisionRounds === 1 ? "" : "s"}
              </Row>
              <Row k="Rate">
                <span className="tabular-nums">
                  {fmtInt(brief.rate.amount)} {brief.rate.currency}
                </span>{" "}
                {brief.rate.perDeliverable ? "per deliverable" : "for the set"}
              </Row>
              <Row k="Rights">
                {brief.usageRights.termDays} days, {brief.usageRights.territory.join(" ")},{" "}
                {brief.usageRights.whitelisting ? "whitelisting included" : "no whitelisting"},{" "}
                {brief.usageRights.exclusivityDays > 0
                  ? `${brief.usageRights.exclusivityDays} days category exclusivity`
                  : "no exclusivity"}
              </Row>
            </dl>

            <div>
              <h3 className={`${SPEC} text-[11px] uppercase tracking-[0.13em] text-[var(--spot)]`}>
                Prohibited on this brief
              </h3>
              <ul className="mt-3 max-w-[33rem]">
                {brief.prohibitedClaims.map((c) => (
                  <li key={c} className="max-w-[29rem] border-t border-[var(--rule)] py-2 text-[13.5px] leading-snug">
                    {c}
                  </li>
                ))}
              </ul>
              <h3 className={`${SPEC} mt-7 text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]`}>
                Concepts written against it
              </h3>
              <ul className="mt-3 max-w-[33rem]">
                {brief.concepts.map((c) => (
                  <li key={c.name} className="border-t border-[var(--rule)] py-2.5">
                    <span className={`${BILL} text-[1.05rem] uppercase leading-tight`}>{c.name}</span>
                    <span className="block max-w-[29rem] text-[13.5px] leading-snug text-[var(--ink-2)]">
                      {c.hookIdea}. Angle: {c.angle.toLowerCase()}.
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------------------- *
          The rebuild. The assignment, with its mechanical requirements.
       * ---------------------------------------------------------------- */}
      <section
        aria-labelledby="rebuild"
        className="mt-16 bg-[var(--plate)] px-5 py-11 text-[var(--plate-ink)] sm:px-9"
      >
        <h2 id="rebuild" className={`${BILL} text-[clamp(2rem,5.5vw,3.4rem)] uppercase leading-[0.9]`}>
          Rebuild it
        </h2>
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <p className="max-w-[33rem] text-[clamp(1rem,1.5vw,1.1rem)] leading-relaxed">
            {t.rebuildBrief}
          </p>

          {spec ? (
            <dl className={`${SPEC} max-w-[34rem] text-[12.5px]`}>
              {[
                ["Deliverable", spec.name],
                ["Frame", `${spec.resolution.width} x ${spec.resolution.height}, ${spec.aspectRatio}`],
                ["Runtime", `${spec.maxDurationS} s maximum`],
                ["Container", `${spec.container}, ${spec.codec}`],
                [
                  "Safe zones",
                  `top ${spec.safeZones.topPx} px, bottom ${spec.safeZones.bottomPx} px, left ${spec.safeZones.leftPx} px, right ${spec.safeZones.rightPx} px`,
                ],
                ["Captions", spec.captionRequirement.replace(/_/g, " ")],
                ["Audio", spec.audioRequirement.replace(/_/g, " ")],
                ["File name", spec.namingConvention],
                ["Spec checked", spec.checkedOn],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 border-t border-[#3a3320] py-2">
                  <dt className="w-[7rem] shrink-0 text-[var(--plate-ink-2)]">{k}</dt>
                  <dd className="min-w-0 flex-1 [overflow-wrap:anywhere] tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        {spec ? (
          <p className="mt-6 max-w-[31rem] text-[14px] leading-relaxed text-[var(--plate-ink-2)]">
            {spec.safeZones.note}
          </p>
        ) : null}
      </section>

      {/* ---------------------------------------------------------------- *
          The rest of the card.
       * ---------------------------------------------------------------- */}
      <nav aria-label="Other bouts on this card" className="pt-14">
        <h2 className={`${BILL} text-[clamp(1.5rem,3.4vw,2.2rem)] uppercase leading-[0.95]`}>
          Also on the card
        </h2>
        <ul className="mt-5">
          {publicList.map((x) => {
            const on = x.slug === t.slug;
            const xad = adById(x.adAssetId);
            return (
              <li key={x.id} className="border-t border-[var(--rule)]">
                {on ? (
                  <p
                    aria-current="page"
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3.5"
                  >
                    <span className={`${SPEC} w-[6.5rem] shrink-0 text-[11px] uppercase tracking-[0.12em] text-[var(--spot)]`}>
                      {x.billing}
                    </span>
                    <span className={`${BILL} text-[clamp(1.05rem,2.2vw,1.4rem)] uppercase leading-tight text-[var(--ink-2)]`}>
                      {x.boutName}
                    </span>
                    <span className={`${SPEC} text-[11.5px] text-[var(--ink-2)]`}>you are here</span>
                  </p>
                ) : (
                  <Link
                    href={`/proof/ads/${x.slug}`}
                    className={`${s.focusable} group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3.5`}
                  >
                    <span className={`${SPEC} w-[6.5rem] shrink-0 text-[11px] uppercase tracking-[0.12em] text-[var(--ink-2)]`}>
                      {x.billing}
                    </span>
                    <span className={`${BILL} text-[clamp(1.05rem,2.2vw,1.4rem)] uppercase leading-tight transition-colors group-hover:text-[var(--spot)]`}>
                      {x.boutName}
                    </span>
                    <span className={`${SPEC} text-[11.5px] tabular-nums text-[var(--ink-2)]`}>
                      {xad ? `${PLATFORM_LABEL[xad.platform]}, ${xad.durationS ?? 0} s` : ""}
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap items-stretch justify-between gap-6 border-t-2 border-[var(--ink)] pt-6">
          {prev ? (
            <Link href={`/proof/ads/${prev.slug}`} className={`${s.focusable} group max-w-[46%]`}>
              <span className={`${SPEC} block text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]`}>
                Previous bout
              </span>
              <span className={`${BILL} mt-1 block text-[clamp(1.05rem,2.2vw,1.4rem)] uppercase leading-tight transition-colors group-hover:text-[var(--spot)]`}>
                {prev.boutName}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/proof/ads/${next.slug}`} className={`${s.focusable} group max-w-[46%] text-right`}>
              <span className={`${SPEC} block text-[11px] uppercase tracking-[0.13em] text-[var(--ink-2)]`}>
                Next bout
              </span>
              <span className={`${BILL} mt-1 block text-[clamp(1.05rem,2.2vw,1.4rem)] uppercase leading-tight transition-colors group-hover:text-[var(--spot)]`}>
                {next.boutName}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </div>
      </nav>

      <footer className="py-10">
        <p className={`${SPEC} max-w-[27rem] text-[12px] leading-relaxed text-[var(--ink-2)]`}>
          Illustrative teardown built as a GMIRA proof surface. The advertiser, the ad library id
          and every figure on this page are synthetic. Teardown published{" "}
          <span className="tabular-nums">{t.publishedAt}</span>.
        </p>
        <Link
          href="/proof/ads"
          className={`${s.focusable} ${BILL} mt-5 inline-block border-2 border-[var(--ink)] px-5 py-2.5 text-[15px] uppercase tracking-[0.06em] transition-colors hover:bg-[var(--ink)] hover:text-[var(--stock)]`}
        >
          Back to the card
        </Link>
      </footer>
    </main>
  );
}
