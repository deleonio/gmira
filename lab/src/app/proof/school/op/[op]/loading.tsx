import { Masthead, StampBox, TravellerCard } from "../../parts";

/* Loading is a state, not a spinner. The sheet is being pulled from the rack, the card
   head is already the right shape, and nothing here moves, so reduced motion has nothing
   to switch off. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-28 pt-5 sm:px-6 md:pt-8 xl:px-8 xl:pb-12">
      <Masthead crumb="pulling sheet" />
      <main>
        <TravellerCard>
          <div role="status" className="py-4">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-[family-name:var(--font-stamp)] text-[13px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                  Operation sheet
                </p>
                <p className="mt-2 font-[family-name:var(--font-form)] text-[clamp(1.9rem,4.4vw,3rem)] font-bold uppercase leading-none tracking-[-0.02em] text-[var(--ink-2)]">
                  Pulling sheet from the rack
                </p>
              </div>
              <StampBox label="Sheet not yet on the bench" tone="ink" size="lg" rotate={-5} />
            </div>

            <div aria-hidden className="mt-8">
              {[14, 11, 13, 8, 12, 9].map((w, i) => (
                <div key={i} className="border-t border-dashed border-[var(--rule)] py-4">
                  <div className="h-3 bg-[var(--card-2)]" style={{ width: `${w * 6}%`, maxWidth: "100%" }} />
                </div>
              ))}
            </div>

            <p className="mt-6 max-w-[32rem] text-[14px] leading-snug text-[var(--ink-2)]">
              Every operation sheet on this routing is public. If this takes more than a moment,
              the routing index is still readable at the part number above.
            </p>
          </div>
        </TravellerCard>
      </main>
    </div>
  );
}
