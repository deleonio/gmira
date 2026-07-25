import Link from "next/link";
import { ACTIVE_COHORT, PRICING, SHOP, fmtNum } from "./data";

/* ---------------------------------------------------------------- stamps */

type Tone = "stamp" | "hold" | "ink";

const TONE: Record<Tone, string> = {
  stamp: "var(--stamp)",
  hold: "var(--hold)",
  ink: "var(--ink-2)",
};

/**
 * The card's tell. A hard-edged stamp box holding a three character operator code,
 * rotated off square the way a hand-held stamp lands. An operation nobody is signed to
 * yet shows the empty box with its rule dashed.
 */
export function StampBox({
  code,
  label,
  tone = "stamp",
  size = "sm",
  rotate = -4.5,
}: {
  code?: string;
  label: string;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  rotate?: number;
}) {
  const dims =
    size === "lg"
      ? { width: 66, height: 46, fontSize: 19, borderWidth: 3 }
      : size === "md"
        ? { width: 52, height: 36, fontSize: 15, borderWidth: 2 }
        : { width: 42, height: 30, fontSize: 12.5, borderWidth: 2 };
  const color = TONE[tone];
  return (
    <span className="inline-flex shrink-0 items-center">
      <span
        aria-hidden
        className={`inline-grid place-items-center border-solid font-[family-name:var(--font-stamp)] font-bold uppercase leading-none tracking-[0.02em] ${
          code ? "" : "border-dashed"
        }`}
        style={{
          ...dims,
          borderStyle: code ? "solid" : "dashed",
          borderColor: color,
          color,
          transform: `rotate(${rotate}deg)`,
          borderRadius: 0,
        }}
      >
        {code ?? ""}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

/* ------------------------------------------------------------ card shell */

/** The physical object: manila stock, punched down the binder edge, one shadow and no
 *  border, because elevation is declared once. */
export function TravellerCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-w-0 grid-cols-1 bg-[var(--card)] shadow-[0_18px_46px_-14px_rgba(0,0,0,0.7)] md:grid-cols-[2.5rem_minmax(0,1fr)]">
      <div aria-hidden className="tv-punch hidden border-r border-[var(--rule)] md:block" />
      <div className="min-w-0 px-4 py-5 md:px-6 md:py-7 xl:px-7">{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- blocks */

/** Form block with a printed caption bar. Used where the content is a table of the same
 *  shape repeated: the routing, the tooling list, the inspection plan. */
export function Block({
  id,
  caption,
  meta,
  children,
  pad = "px-4 py-5 md:px-5 md:py-6",
  className = "",
}: {
  id: string;
  caption: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  pad?: string;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={`border-[1.5px] border-[var(--rule-2)] ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-[1.5px] border-[var(--rule-2)] bg-[var(--card-2)] px-4 py-2 md:px-5">
        <h2
          id={id}
          className="font-[family-name:var(--font-form)] text-[17px] font-semibold uppercase leading-tight tracking-[0.1em] text-[var(--ink)]"
        >
          {caption}
        </h2>
        {meta ? (
          <p className="font-[family-name:var(--font-stamp)] text-[11.5px] tabular-nums text-[var(--ink-2)]">{meta}</p>
        ) : null}
      </div>
      <div className={pad}>{children}</div>
    </section>
  );
}

/** Marginal-caption block. The caption sits in the left gutter the way a heading sits in
 *  the margin of an engineering document, which gives the page a second structure so it
 *  is not ten identical caption bars stacked. */
export function MarginBlock({
  id,
  caption,
  meta,
  children,
  space = "py-8",
}: {
  id: string;
  caption: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  space?: string;
}) {
  return (
    <section
      aria-labelledby={id}
      className={`grid gap-x-6 gap-y-4 border-t-[1.5px] border-[var(--rule-2)] lg:grid-cols-[9.5rem_minmax(0,1fr)] ${space}`}
    >
      <div>
        <h2
          id={id}
          className="font-[family-name:var(--font-form)] text-[17px] font-semibold uppercase leading-tight tracking-[0.1em] text-[var(--ink)]"
        >
          {caption}
        </h2>
        {meta ? (
          <p className="mt-1.5 font-[family-name:var(--font-stamp)] text-[11.5px] leading-snug tabular-nums text-[var(--ink-3)]">
            {meta}
          </p>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------ small type */

/** A printed field caption. Small condensed caps, the way a form prints the name of the
 *  box you write in. */
export function Cap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`font-[family-name:var(--font-form)] text-[12px] font-semibold uppercase leading-none tracking-[0.11em] text-[var(--ink-3)] ${className}`}
    >
      {children}
    </span>
  );
}

/** Head field: caption over a mono value. Used inside the card head grid and anywhere a
 *  number has to line up with the number under it. */
export function Field({
  label,
  children,
  strong = false,
}: {
  label: string;
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="min-w-0 border-t border-[var(--rule)] pt-1.5">
      <dt>
        <Cap>{label}</Cap>
      </dt>
      <dd
        className={`mt-1 font-[family-name:var(--font-stamp)] tabular-nums ${
          strong ? "text-[16px] font-semibold text-[var(--ink)]" : "text-[13.5px] text-[var(--ink)]"
        }`}
      >
        {children}
      </dd>
    </div>
  );
}

/* -------------------------------------------------------- the work order */

const seatWord = (n: number) => (n === 1 ? "seat" : "seats");

/** Sticky at 1280 and up, next to the routing, so commitment and price stay side by side
 *  while the reader scrolls the operations. Below that it is the fixed rail instead. */
export function WorkOrderCard() {
  const c = ACTIVE_COHORT;
  return (
    /* The wrapper is the grid item and stretches to the full row height, which is what
       gives `sticky` a range to travel in. A sticky element that is itself the
       content-height grid item never moves. */
    <div className="hidden xl:block">
      <aside
        aria-labelledby="wo"
        className="sticky top-6 border-[1.5px] border-[var(--rule-2)] bg-[var(--card-3)]"
      >
        <div className="border-b-[1.5px] border-[var(--rule-2)] bg-[var(--card-2)] px-4 py-2">
        <h2
          id="wo"
          className="font-[family-name:var(--font-form)] text-[17px] font-semibold uppercase leading-tight tracking-[0.1em]"
        >
          Work order
        </h2>
      </div>
      <div className="px-4 py-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Field label="Lot" strong>
            {c.id.toUpperCase()}
          </Field>
          <Field label="Status" strong>
            <span className="text-[var(--stamp)]">{c.status.toUpperCase()}</span>
          </Field>
          <Field label="Released">{c.startsOn}</Field>
          <Field label="Due">{c.endsOn}</Field>
          <Field label="Qty rel">{c.capacity}</Field>
          <Field label="Qty open" strong>
            {c.seatsRemaining}
          </Field>
          <div className="col-span-2 border-t border-[var(--rule)] pt-1.5">
            <dt>
              <Cap>Applications close</Cap>
            </dt>
            <dd className="mt-1 font-[family-name:var(--font-stamp)] text-[13.5px] tabular-nums">
              {c.applicationsCloseOn}
            </dd>
          </div>
          <div className="col-span-2 border-t border-[var(--rule)] pt-1.5">
            <dt>
              <Cap>Job cost</Cap>
            </dt>
            <dd className="mt-1 font-[family-name:var(--font-stamp)] text-[22px] font-semibold tabular-nums leading-none">
              {fmtNum(PRICING.listPrice.amount)} EUR
            </dd>
            <dd className="mt-1.5 text-[13px] leading-snug text-[var(--ink-2)]">
              {PRICING.listPrice.taxNoteShort}
            </dd>
          </div>
        </dl>

        <a
          href="#lot-release"
          className="tv-f mt-4 block border-2 border-[var(--ink)] bg-[var(--ink)] px-4 py-2.5 text-center font-[family-name:var(--font-form)] text-[15px] font-semibold uppercase tracking-[0.1em] text-[var(--card)] transition-colors duration-150 hover:bg-[var(--card-3)] hover:text-[var(--ink)]"
          style={{ borderRadius: 0 }}
        >
          Apply for lot {c.id.toUpperCase()}
        </a>
        <p className="mt-2.5 text-[13px] leading-snug text-[var(--ink-2)]">
          Six fields, then a 45 minute screen. Decision inside 8 days.
        </p>
        </div>
      </aside>
    </div>
  );
}

/** Below 1280 the work order becomes a fixed rail, because cohort date, price and apply
 *  have to be inside one thumb reach on a phone. The page reserves room for it rather
 *  than letting it sit on top of the last block. */
export function WorkOrderRail() {
  const c = ACTIVE_COHORT;
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-[var(--rule-2)] bg-[var(--bench-2)] px-4 py-2.5 xl:hidden"
      aria-label="Work order summary"
      role="region"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
        <dl className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-0.5">
          <div className="flex items-baseline gap-1.5">
            <dt className="font-[family-name:var(--font-form)] text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--bench-ink-2)]">
              Lot
            </dt>
            <dd className="font-[family-name:var(--font-stamp)] text-[14px] font-semibold tabular-nums text-[var(--bench-ink)]">
              {c.id.toUpperCase()}
            </dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="font-[family-name:var(--font-form)] text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--bench-ink-2)]">
              Rel
            </dt>
            <dd className="font-[family-name:var(--font-stamp)] text-[14px] tabular-nums text-[var(--bench-ink)]">
              {c.startsOn}
            </dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="font-[family-name:var(--font-form)] text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--bench-ink-2)]">
              Open
            </dt>
            <dd className="font-[family-name:var(--font-stamp)] text-[14px] tabular-nums text-[var(--bench-ink)]">
              {c.seatsRemaining} {seatWord(c.seatsRemaining)}
            </dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="font-[family-name:var(--font-form)] text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--bench-ink-2)]">
              Cost
            </dt>
            <dd className="font-[family-name:var(--font-stamp)] text-[14px] font-semibold tabular-nums text-[var(--bench-ink)]">
              {fmtNum(PRICING.listPrice.amount)} EUR
            </dd>
          </div>
        </dl>
        <Link
          href="/proof/school#lot-release"
          className="tv-f-inv shrink-0 border-2 border-[var(--bench-ink)] px-3.5 py-2 font-[family-name:var(--font-form)] text-[14px] font-semibold uppercase tracking-[0.1em] text-[var(--bench-ink)] transition-colors duration-150 hover:bg-[var(--bench-ink)] hover:text-[var(--bench)]"
          style={{ borderRadius: 0 }}
        >
          Apply
        </Link>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- page chrome */

/** The masthead lives on the bench, not on the card: two physical layers, kept apart. */
export function Masthead({ crumb }: { crumb?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 md:mb-6">
      <p className="font-[family-name:var(--font-form)] text-[19px] font-bold uppercase leading-none tracking-[0.16em] text-[var(--bench-ink)]">
        {SHOP.name}
      </p>
      <p className="font-[family-name:var(--font-stamp)] text-[12px] tabular-nums text-[var(--bench-ink-2)]">
        {crumb ?? `${SHOP.formNumber} rev ${SHOP.formRev}`}
      </p>
    </div>
  );
}

export function CardFoot() {
  return (
    <div className="mt-7 flex flex-wrap items-start justify-between gap-x-8 gap-y-2 border-t-[1.5px] border-[var(--rule-2)] pt-3">
      <p className="max-w-[30rem] text-[13px] leading-snug text-[var(--ink-2)]">{SHOP.specimenNote}</p>
      <p className="font-[family-name:var(--font-stamp)] text-[11.5px] tabular-nums text-[var(--ink-3)]">
        {SHOP.formNumber} rev {SHOP.formRev} / routing rev {SHOP.routingRev} / {SHOP.routingRevDate}
      </p>
    </div>
  );
}
