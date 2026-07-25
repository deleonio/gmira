import { DYES, type DyeId, type VariantState } from "./data";

/* Written as an arbitrary property rather than the outline utilities so the ring cannot
   be lost to a utility rename. Every interactive element on this vertical carries it. */
export const FOCUS =
  "focus-visible:[outline:2px_solid_var(--madder)] focus-visible:[outline-offset:2px]";

export const FOCUS_LIGHT =
  "focus-visible:[outline:2px_solid_var(--stock)] focus-visible:[outline-offset:2px]";

/* The TELL. A hole punched through the paper flap at the top of every packet, with the wire
   running down from the rail into it. Board colour fills the hole, so the fixture shows
   through the packet exactly as it does on a rack. Decorative, and every fact beside it is
   real DOM text. `wire` is the run of wire drawn above the paper edge: rail A and B hang from
   the rail, rail C is clipped flat and gets a hole with no wire. */
export function HangHole({
  size = 16,
  left = 24,
  top = 6,
  wire = 0,
}: {
  size?: number;
  left?: number;
  top?: number;
  wire?: number;
}) {
  return (
    <span aria-hidden className="pointer-events-none absolute left-0 top-0" style={{ left }}>
      {wire > 0 ? (
        <span
          className="absolute left-1/2 block w-px -translate-x-1/2 bg-[var(--rail)]"
          style={{ top: -wire, height: wire + top + size / 2 }}
        />
      ) : null}
      <span
        className="absolute left-1/2 block -translate-x-1/2 rounded-full border border-[var(--rule)] bg-[var(--board)]"
        style={{ top, width: size, height: size }}
      />
    </span>
  );
}

/* Blue wool scale, 1 to 8, ISO 105-B02. The boxes echo the figure, they do not replace it:
   the grade is printed as text beside them. */
export function Fastness({
  dye,
  grade,
  max = 8,
  label,
}: {
  dye: DyeId;
  grade: number;
  max?: number;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span aria-hidden className="inline-flex gap-[2px]">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className="block h-[9px] w-[5px] border"
            style={{
              borderColor: "var(--rule)",
              background: i < grade ? `var(${DYES[dye].cssVar})` : "transparent",
            }}
          />
        ))}
      </span>
      <span className="font-[family-name:var(--font-spec)] text-[11px] tabular-nums text-[var(--ink-2)]">
        {label} {grade} of {max}
      </span>
    </span>
  );
}

/* One rail of the rack: a line across the full width, the rail letter and what hangs on it. */
export function Rail({
  id,
  letter,
  title,
  note,
  children,
}: {
  id: string;
  letter: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-14 first:mt-0">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 pb-3">
        <h2
          id={id}
          className="font-[family-name:var(--font-packet)] text-[clamp(1.1rem,2vw,1.4rem)] font-semibold leading-none"
        >
          <span className="font-[family-name:var(--font-spec)] text-[var(--ink-2)]">
            Rail {letter}
          </span>{" "}
          {title}
        </h2>
        <p className="font-[family-name:var(--font-spec)] text-[12px] text-[var(--ink-2)]">{note}</p>
      </div>
      <div className="relative border-t border-[var(--rail)] pt-0">{children}</div>
    </section>
  );
}

/* Availability, stated in words first. Colour never carries the meaning on its own. */
export function StockLine({ state, className = "" }: { state: VariantState; className?: string }) {
  const base = `font-[family-name:var(--font-spec)] text-[12px] tabular-nums ${className}`;
  switch (state.kind) {
    case "in_stock":
      return <p className={`${base} text-[var(--ink-2)]`}>{state.available} on the rack</p>;
    case "low_stock":
      return (
        <p className={`${base} text-[var(--madder)]`}>
          Only {state.available} left in this lot
        </p>
      );
    case "backorder":
      return (
        <p className={`${base} text-[var(--woad)]`}>
          None on the rack. Cut from lot 27, ships {state.restock}
        </p>
      );
    case "sold_out":
      return (
        <p className={`${base} text-[var(--madder)]`}>
          Sold out.{" "}
          {state.restock ? `Back ${state.restock}` : "Restock date not known yet"}
        </p>
      );
    case "not_made":
      return <p className={`${base} text-[var(--ink-3)]`}>Not made in this combination</p>;
  }
}

/* A dye band. Full width of the packet, paper coloured text on the dye. */
export function DyeBand({
  dye,
  right,
  transition = false,
}: {
  dye: DyeId;
  right?: string;
  transition?: boolean;
}) {
  const d = DYES[dye];
  return (
    <div
      className={`flex items-baseline justify-between gap-3 px-4 py-2 text-[var(--stock)] ${
        transition ? "motion-safe:transition-colors motion-safe:duration-150" : ""
      }`}
      style={{ background: `var(${d.cssVar})` }}
    >
      <span className="font-[family-name:var(--font-packet)] text-[15px] font-semibold leading-none">
        {d.name}
      </span>
      <span className="font-[family-name:var(--font-spec)] text-[11px] leading-none">
        {right ?? d.botanical}
      </span>
    </div>
  );
}
