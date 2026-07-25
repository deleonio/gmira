import Link from "next/link";
import s from "../bill.module.css";
import { TEARDOWNS } from "../data";

const BILL = "font-[family-name:var(--font-bill)]";
const SPEC = "font-[family-name:var(--font-spec)]";

export default function BoutNotFound() {
  const live = TEARDOWNS.filter((t) => t.isPublic);
  return (
    <main className="mx-auto max-w-[1240px] px-5 pt-10 md:px-9">
      <span aria-hidden className="block h-[6px] w-full bg-[var(--ink)]" />
      <h1 className={`${BILL} mt-6 text-[clamp(2rem,6vw,3.6rem)] uppercase leading-[0.9]`}>
        Not on this card
      </h1>
      <p className="mt-4 max-w-[33rem] text-[15px] leading-relaxed">
        There is no public teardown at that address. Some teardowns are held back for the cohort and
        never get a public page, so a link that used to work can stop working. Everything currently
        billed is listed below.
      </p>
      <ul className="mt-7 max-w-[46rem]">
        {live.map((t) => (
          <li key={t.id} className="border-t border-[var(--rule)]">
            <Link
              href={`/proof/ads/${t.slug}`}
              className={`${s.focusable} group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3.5`}
            >
              <span className={`${SPEC} w-[6.5rem] shrink-0 text-[11px] uppercase tracking-[0.12em] text-[var(--ink-2)]`}>
                {t.billing}
              </span>
              <span className={`${BILL} text-[clamp(1.05rem,2.2vw,1.4rem)] uppercase leading-tight transition-colors group-hover:text-[var(--spot)]`}>
                {t.boutName}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/proof/ads"
        className={`${s.focusable} ${BILL} mt-8 inline-block border-2 border-[var(--ink)] px-5 py-2.5 text-[15px] uppercase tracking-[0.06em] transition-colors hover:bg-[var(--ink)] hover:text-[var(--stock)]`}
      >
        Back to the card
      </Link>
    </main>
  );
}
