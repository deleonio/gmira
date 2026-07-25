import Link from "next/link";
import { MODULES, opNumber } from "../../data";
import { Masthead, StampBox, TravellerCard } from "../../parts";

/* Empty of the "wrong address" kind: the routing exists, this op number does not. The
   recovery is the list of op numbers that do, not a link back to the front page. */
export default function OpNotFound() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-28 pt-5 sm:px-6 md:pt-8 xl:px-8 xl:pb-12">
      <Masthead crumb="sheet not on this routing" />
      <main>
        <TravellerCard>
          <div className="py-4">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-stamp)] text-[13px] uppercase tracking-[0.08em] text-[var(--hold)]">
                  Sheet not on routing AIE-12
                </p>
                <h1 className="mt-2 max-w-[20ch] font-[family-name:var(--font-form)] text-[clamp(2rem,4.6vw,3rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
                  That operation number is not stamped on this card
                </h1>
                <p className="mt-4 max-w-[32rem] text-[15px] leading-relaxed text-[var(--ink-2)]">
                  Operations run in tens from OP 010 to OP 080, and OP 090 is the capstone, whose
                  sheet is not released until week 9. Anything else was never issued.
                </p>
              </div>
              <StampBox code="VOID" label="Void" tone="hold" size="lg" rotate={-7} />
            </div>

            <nav aria-label="Operation sheets on this routing" className="mt-7">
              <ol className="flex flex-wrap gap-2">
                {MODULES.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/proof/school/op/${opNumber(m.index)}`}
                      className="tv-f block border border-[var(--rule)] px-3 py-1.5 font-[family-name:var(--font-stamp)] text-[14px] tabular-nums transition-colors duration-150 hover:border-[var(--ink)] hover:bg-[var(--card-2)]"
                      style={{ borderRadius: 0 }}
                    >
                      {opNumber(m.index)}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>

            <Link
              href="/proof/school"
              className="tv-f mt-6 inline-block border-2 border-[var(--ink)] bg-[var(--ink)] px-5 py-2.5 font-[family-name:var(--font-form)] text-[16px] font-semibold uppercase tracking-[0.1em] text-[var(--card)] transition-colors duration-150 hover:bg-[var(--card-3)] hover:text-[var(--ink)]"
              style={{ borderRadius: 0 }}
            >
              Back to the routing
            </Link>
          </div>
        </TravellerCard>
      </main>
    </div>
  );
}
