import { Archivo_Narrow, Special_Elite } from "next/font/google";

const form = Archivo_Narrow({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-form" });
const type = Special_Elite({ subsets: ["latin"], weight: "400", variable: "--font-type" });

export const metadata = {
  title: "gmira-brief, specimen",
  description: "A surface brief rendered as a filled in intake form, uninventable items struck in red.",
};

const INK = "#241f18";
const INK_SOFT = "#5c5344";
const RED = "#9a1b1b";
const RULE = "rgba(36,31,24,0.30)";
const RULE_FAINT = "rgba(36,31,24,0.15)";

type FieldRow = { field: string; range: string };

const FIELDS: FieldRow[] = [
  { field: "make, model, trim", range: "enum triplet, trim blank on about 20 percent of stock" },
  { field: "model year, first registration", range: "two separate fields, routinely conflated" },
  { field: "mileage, km", range: "0 to 320,000, typical 48,000" },
  { field: "power", range: "kW and PS both printed, PS is what gets read" },
  { field: "previous owners", range: "0 to 6, typical 1" },
  { field: "photographs", range: "8 to 60, typical 24, portrait and landscape mixed" },
  { field: "equipment lines", range: "12 to 80, typical 34, alphabetised" },
  { field: "accident declaration", range: "required, never optional" },
  { field: "VAT status", range: "section 25a margin scheme or 19 percent, changes the price block" },
];

const TRUE_ITEMS: string[] = [
  "8 lots on the block for Sale 14, Neumunster (DMS feed)",
  "battery health read by Aviloo, dated per lot (PDF protocol)",
  "VAT statute printed per lot, sec 25a or 19 percent (DMS feed)",
];

const ASPIRATIONAL_ITEMS: string[] = [
  "reads as the region's most trusted EV specialist",
  "every visitor decides tonight without phoning in",
];

const VOID_ITEMS: string[] = [
  "customer testimonials",
  "review count and star average",
  "trusted by, logos",
  "awards, press mentions",
  "years in business, headcount",
  "competitor price comparisons",
];

function MetaRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-[1.5px]">
      <span
        className="font-[family-name:var(--font-form)] text-[9.5px] uppercase leading-none tracking-[0.14em]"
        style={{ color: INK_SOFT }}
      >
        {label}
      </span>
      <span
        className={`font-[family-name:var(--font-type)] text-[12.5px] leading-none ${strong ? "font-bold" : ""}`}
        style={{ color: INK }}
      >
        {value}
      </span>
    </div>
  );
}

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-1.5 flex items-baseline gap-2 border-b pb-1" style={{ borderColor: RULE }}>
      <span className="font-[family-name:var(--font-form)] text-[11px] font-bold leading-none" style={{ color: RED }}>
        {n}
      </span>
      <span
        className="font-[family-name:var(--font-form)] text-[10.5px] font-semibold uppercase leading-none tracking-[0.16em]"
        style={{ color: INK }}
      >
        {title}
      </span>
    </div>
  );
}

// gmira-brief specimen plate. Renders the brief as a filled in intake form: product
// truth kept apart from aspiration, the visitor scene in one physical sentence, the
// real content model as a typed field list, and the uninventable list struck in red.
// The worked example is the car-lot surface already built in this lab, so the numbers
// below match proof/car/data.ts and the car-shop playbook rather than being invented
// for this plate. Doctrine gate G7 is the reason the last section exists at all.
export default function BriefSpecimen() {
  return (
    <div
      className={`${form.variable} ${type.variable} relative h-[750px] w-[1200px] overflow-hidden`}
      style={{
        background: "radial-gradient(ellipse 900px 700px at 30% 16%, #2c2318 0%, #1a130c 60%, #100b06 100%)",
      }}
    >
      <div
        className="absolute overflow-hidden"
        style={{
          left: 26,
          top: 26,
          right: 26,
          bottom: 26,
          background: "#f3ede0",
          boxShadow: "0 26px 55px -18px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.5) inset",
          transform: "rotate(-0.3deg)",
          backgroundImage: "radial-gradient(rgba(36,31,24,0.05) 1px, transparent 1.2px)",
          backgroundSize: "3px 3px",
        }}
      >
        <span
          className="absolute rounded-full"
          style={{
            left: 12,
            top: 128,
            width: 11,
            height: 11,
            background: "radial-gradient(circle at 35% 32%, #e6dfc9, #a99c7c 75%)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.55)",
          }}
        />
        <span
          className="absolute rounded-full"
          style={{
            left: 12,
            top: 428,
            width: 11,
            height: 11,
            background: "radial-gradient(circle at 35% 32%, #e6dfc9, #a99c7c 75%)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.55)",
          }}
        />

        <div className="flex h-full flex-col px-9 pb-4 pt-6">
          <div
            className="flex shrink-0 items-start justify-between gap-8 border-b-2 pb-2"
            style={{ borderColor: "rgba(36,31,24,0.72)" }}
          >
            <div>
              <p
                className="font-[family-name:var(--font-form)] text-[10.5px] font-semibold uppercase leading-none tracking-[0.24em]"
                style={{ color: INK_SOFT }}
              >
                Gmira studio, surface brief intake
              </p>
              <h1
                className="mt-1.5 font-[family-name:var(--font-form)] text-[42px] font-bold uppercase leading-[0.9] tracking-[-0.01em]"
                style={{ color: INK }}
              >
                Surface brief
              </h1>
              <p className="mt-1.5 font-[family-name:var(--font-type)] text-[13px] leading-none" style={{ color: INK_SOFT }}>
                what the build is not allowed to invent.
              </p>
            </div>
            <div className="w-[224px] shrink-0 border px-3 py-2" style={{ borderColor: RULE }}>
              <MetaRow label="form" value="GB-01" />
              <MetaRow label="slug" value="car-lot" />
              <MetaRow label="drawn" value="25.07.2026" />
              <MetaRow label="state" value="no visual authority" strong />
            </div>
          </div>

          <div
            className="mt-2 flex shrink-0 items-center gap-4 font-[family-name:var(--font-form)] text-[10.5px] uppercase leading-none tracking-[0.12em]"
            style={{ color: INK }}
          >
            <span style={{ color: INK_SOFT }}>mode, this surface only</span>
            <span className="font-bold">[x] persuade</span>
            <span style={{ color: INK_SOFT }}>[ ] operate</span>
            <span style={{ color: INK_SOFT }}>[ ] read</span>
            <span style={{ color: INK_SOFT }}>[ ] experience</span>
          </div>

          <div className="mt-2 grid grid-cols-[0.95fr_1.05fr] gap-8">
            <div className="flex flex-col gap-2">
              <div>
                <SectionLabel n="01" title="the visitor" />
                <p className="font-[family-name:var(--font-type)] text-[17px] leading-snug" style={{ color: INK }}>
                  On a phone in the yard at dusk, two other tabs open already. Knows engines
                  cold, battery chemistry not at all. Decides tonight or moves on.
                </p>
              </div>

              <div className="flex flex-col gap-1 border-t pt-1.5" style={{ borderColor: RULE_FAINT }}>
                <MetaRow label="job" value="leave trusting the odometer, no call" />
                <MetaRow label="only true here" value="battery measured here, not copied" />
              </div>

              <div className="border-t pt-1.5" style={{ borderColor: RULE_FAINT }}>
                <SectionLabel n="02" title="truth against aspiration" />
                <p
                  className="font-[family-name:var(--font-form)] text-[9.5px] font-bold uppercase leading-none tracking-[0.12em]"
                  style={{ color: INK }}
                >
                  true (t), source on file
                </p>
                <ul className="mt-1 space-y-1">
                  {TRUE_ITEMS.map((t) => (
                    <li
                      key={t}
                      className="font-[family-name:var(--font-type)] text-[12px] leading-tight"
                      style={{ color: INK }}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <p
                  className="mt-1.5 font-[family-name:var(--font-form)] text-[9.5px] font-bold uppercase leading-none tracking-[0.12em]"
                  style={{ color: INK_SOFT }}
                >
                  aspirational (a), not rendered as a claim
                </p>
                <ul className="mt-1 space-y-1">
                  {ASPIRATIONAL_ITEMS.map((a) => (
                    <li
                      key={a}
                      className="font-[family-name:var(--font-type)] text-[12px] italic leading-tight"
                      style={{ color: INK_SOFT }}
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <SectionLabel n="03" title="content model, item: lot" />
              <p className="mb-1.5 font-[family-name:var(--font-type)] text-[11.5px] leading-none" style={{ color: INK_SOFT }}>
                worked example: lot K-2291, VW ID.4
              </p>
              <div className="flex justify-between border-b pb-1" style={{ borderColor: RULE }}>
                <span
                  className="font-[family-name:var(--font-form)] text-[9px] font-bold uppercase leading-none tracking-[0.1em]"
                  style={{ color: INK_SOFT }}
                >
                  field
                </span>
                <span
                  className="font-[family-name:var(--font-form)] text-[9px] font-bold uppercase leading-none tracking-[0.1em]"
                  style={{ color: INK_SOFT }}
                >
                  range, min, typical, max
                </span>
              </div>
              {FIELDS.map((row) => (
                <div
                  key={row.field}
                  className="flex items-baseline justify-between gap-4 border-b py-[4.5px]"
                  style={{ borderColor: RULE_FAINT }}
                >
                  <span
                    className="shrink-0 font-[family-name:var(--font-type)] text-[13.5px] leading-none"
                    style={{ color: INK }}
                  >
                    {row.field}
                  </span>
                  <span
                    className="text-right font-[family-name:var(--font-form)] text-[10.5px] leading-tight"
                    style={{ color: INK_SOFT }}
                  >
                    {row.range}
                  </span>
                </div>
              ))}
              <p className="mt-2 font-[family-name:var(--font-type)] text-[12.5px] italic leading-snug" style={{ color: INK_SOFT }}>
                22 fields total. A card is a title, an icon, two lines. This is not a card.
              </p>
            </div>
          </div>

          <div className="mt-2.5 shrink-0 border-t pt-2" style={{ borderColor: RULE }}>
            <SectionLabel n="04" title="not to be invented, confirmed with client" />
            <div className="flex items-center justify-between gap-6">
              <ul className="grid grid-cols-2 gap-x-10 gap-y-1.5">
                {VOID_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="font-[family-name:var(--font-type)] text-[19px] leading-snug"
                    style={{
                      color: INK,
                      textDecorationLine: "line-through",
                      textDecorationColor: RED,
                      textDecorationThickness: "3px",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div
                className="shrink-0 border-2 px-3 py-1.5 text-center"
                style={{ borderColor: RED, transform: "rotate(-6deg)" }}
              >
                <p
                  className="font-[family-name:var(--font-form)] text-[11px] font-bold uppercase leading-none tracking-[0.14em]"
                  style={{ color: RED }}
                >
                  do not invent
                </p>
                <p
                  className="mt-1 font-[family-name:var(--font-form)] text-[8.5px] uppercase leading-none tracking-[0.1em]"
                  style={{ color: RED }}
                >
                  doctrine gate G7
                </p>
              </div>
            </div>
          </div>

          <div
            className="mt-2 flex shrink-0 items-baseline justify-between border-t pt-1.5"
            style={{ borderColor: RULE }}
          >
            <p className="font-[family-name:var(--font-type)] text-[11px] leading-none" style={{ color: INK_SOFT }}>
              gmira-brief
            </p>
            <p
              className="font-[family-name:var(--font-form)] text-[9px] uppercase leading-none tracking-[0.12em]"
              style={{ color: INK_SOFT }}
            >
              hand to gmira-direction next, form GB-01, page 1 of 1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
