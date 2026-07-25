"use client";

import Link from "next/link";
import s from "../bill.module.css";

const BILL = "font-[family-name:var(--font-bill)]";
const SPEC = "font-[family-name:var(--font-spec)]";

/* An error names the problem and the recovery. Next 16 passes the retry callback as
   unstable_retry; the older reset name is accepted too so this does not break on a
   version bump. */
export default function BoutError({
  error,
  unstable_retry,
  reset,
}: {
  error: Error & { digest?: string };
  unstable_retry?: () => void;
  reset?: () => void;
}) {
  const retry = unstable_retry ?? reset;
  return (
    <main className="mx-auto max-w-[1240px] px-5 pt-10 md:px-9">
      <span aria-hidden className="block h-[6px] w-full bg-[var(--spot)]" />
      <h1 className={`${BILL} mt-6 text-[clamp(2rem,6vw,3.6rem)] uppercase leading-[0.9] text-[var(--spot)]`}>
        This bout did not load
      </h1>
      <p className="mt-4 max-w-[33rem] text-[15px] leading-relaxed">
        The teardown data for this bout failed to render, so the page has nothing honest to show.
        Nothing was lost and nothing was sent. Retry loads the same bout again; the card lists every
        other bout that is working.
      </p>
      {error.digest ? (
        <p className={`${SPEC} mt-3 text-[12px] tabular-nums text-[var(--ink-2)]`}>
          Reference {error.digest}
        </p>
      ) : null}
      <div className="mt-7 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => retry?.()}
          className={`${s.focusable} ${BILL} border-2 border-[var(--ink)] bg-[var(--ink)] px-5 py-2.5 text-[16px] uppercase tracking-[0.06em] text-[var(--stock)] transition-colors hover:border-[var(--spot)] hover:bg-[var(--spot)]`}
        >
          Try this bout again
        </button>
        <Link
          href="/proof/ads"
          className={`${s.focusable} ${BILL} border-2 border-[var(--ink)] px-5 py-2.5 text-[16px] uppercase tracking-[0.06em] transition-colors hover:bg-[var(--ink)] hover:text-[var(--stock)]`}
        >
          Back to the card
        </Link>
      </div>
    </main>
  );
}
