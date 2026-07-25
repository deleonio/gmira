"use client";

import Link from "next/link";

/* Error state as an NCR: it names the problem and the recovery, and it prints the digest
   so a message about it can be acted on. Both controls are real. */
export default function SchoolError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 xl:px-8">
      <p className="mb-4 font-[family-name:var(--font-form)] text-[19px] font-bold uppercase tracking-[0.16em] text-[var(--bench-ink)]">
        Second Shift
      </p>
      <main className="bg-[var(--card)] p-5 shadow-[0_18px_46px_-14px_rgba(0,0,0,0.7)] md:p-7">
        <section aria-labelledby="err" className="border-[1.5px] border-[var(--hold)]">
          <div className="border-b-[1.5px] border-[var(--hold)] px-4 py-2">
            <h1
              id="err"
              className="font-[family-name:var(--font-form)] text-[17px] font-semibold uppercase tracking-[0.1em] text-[var(--hold)]"
            >
              Nonconformance: this card did not render
            </h1>
          </div>
          <div className="px-4 py-5">
            <p className="max-w-[32rem] text-[15px] leading-relaxed">
              The routing data is fine. The page that draws it threw before it finished, so nothing
              below the head was printed. Reissuing the sheet usually clears it.
            </p>
            <dl className="mt-4 max-w-[32rem]">
              <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-x-3 border-t border-[var(--rule)] py-2">
                <dt className="font-[family-name:var(--font-form)] text-[12px] font-semibold uppercase tracking-[0.11em] text-[var(--ink-3)]">
                  Digest
                </dt>
                <dd className="font-[family-name:var(--font-stamp)] text-[13px] tabular-nums break-all">
                  {error.digest ?? "not issued"}
                </dd>
              </div>
              <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-x-3 border-t border-[var(--rule)] py-2">
                <dt className="font-[family-name:var(--font-form)] text-[12px] font-semibold uppercase tracking-[0.11em] text-[var(--ink-3)]">
                  Recovery
                </dt>
                <dd className="text-[14px] leading-snug text-[var(--ink-2)]">
                  Reissue the sheet. If it fails twice, the routing index still renders and carries
                  every operation, its criteria and the price.
                </dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={reset}
                className="tv-f border-2 border-[var(--ink)] bg-[var(--ink)] px-5 py-2.5 font-[family-name:var(--font-form)] text-[16px] font-semibold uppercase tracking-[0.1em] text-[var(--card)] transition-colors duration-150 hover:bg-[var(--card-3)] hover:text-[var(--ink)]"
                style={{ borderRadius: 0 }}
              >
                Reissue the sheet
              </button>
              <Link
                href="/proof/school"
                className="tv-f border-2 border-[var(--ink)] px-5 py-2.5 font-[family-name:var(--font-form)] text-[16px] font-semibold uppercase tracking-[0.1em] transition-colors duration-150 hover:bg-[var(--card-2)]"
                style={{ borderRadius: 0 }}
              >
                Back to the routing
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
