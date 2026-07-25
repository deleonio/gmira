import { Archivo_Black, Fragment_Mono, IM_Fell_English, IM_Fell_Great_Primer } from "next/font/google";

/*
  gmira-typeset specimen plate.

  World: a type foundry specimen book (heavy laid paper, letterpress impression,
  one face shown at every size the foundry cuts, the point size printed in the
  margin). Display and text are two historic cuts of the same Fell types: Great
  Primer for display, English for reading, the way the original foundry cut a
  separate matrix per size rather than scaling one drawing. Archivo Black carries
  the margin numerals. Fragment Mono carries every measured value: the rem sizes,
  the character ruler, the tracking figures. That is the only role this skill
  allows mono to play, and every other size on this plate is copied straight from
  the doctrine (the eight 1.25 rungs, the 11px label floor, nothing invented).
*/

const display = IM_Fell_Great_Primer({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const text = IM_Fell_English({
  variable: "--font-text",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const numeral = Archivo_Black({
  variable: "--font-numeral",
  subsets: ["latin"],
  weight: "400",
});

const mono = Fragment_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
});

// The 1.25 ratio, copied from the doctrine: text-lg through text-7xl, with the
// tracking figure the doctrine binds to each step. 5.96rem is the single element
// on this plate that approaches the 6rem display ceiling.
const SCALE = [
  { rem: 1.25, label: "1.25rem", tracking: "0em" },
  { rem: 1.563, label: "1.563rem", tracking: "-0.01em" },
  { rem: 1.953, label: "1.953rem", tracking: "-0.015em" },
  { rem: 2.441, label: "2.441rem", tracking: "-0.02em" },
  { rem: 3.052, label: "3.052rem", tracking: "-0.025em" },
  { rem: 3.815, label: "3.815rem", tracking: "-0.03em" },
  { rem: 4.768, label: "4.768rem", tracking: "-0.03em" },
  { rem: 5.96, label: "5.960rem", tracking: "-0.03em" },
];

// Column width per rung is proportional to the rung's own rem value, so the grid
// itself draws the 1.25 progression, not just the glyphs sitting inside it.
const SCALE_COLUMNS = SCALE.map((s) => `${s.rem}fr`).join(" ");

// Ruler ticks every five characters, 0 to 85.
const TICKS = Array.from({ length: 18 }, (_, i) => i * 5);

function BandLabel({ index, label, value }: { index: string; label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span
        className="font-[family-name:var(--font-mono)] tabular-nums"
        style={{ fontSize: "0.6875rem", color: "var(--ink-dim)" }}
      >
        {index}
      </span>
      <span
        className="font-[family-name:var(--font-numeral)] uppercase"
        style={{ fontSize: "0.6875rem", letterSpacing: "0.06em", color: "var(--ink)" }}
      >
        {label}
      </span>
      <span
        className="font-[family-name:var(--font-mono)] uppercase tabular-nums"
        style={{ fontSize: "0.6875rem", letterSpacing: "0.02em", color: "var(--stamp)" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function TypesetSpecimenPage() {
  return (
    <div
      className={`${display.variable} ${text.variable} ${numeral.variable} ${mono.variable} relative h-[750px] w-[1200px] overflow-hidden border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] antialiased`}
      style={
        {
          "--paper": "#efe9dc",
          "--ink": "#1a1714",
          "--ink-dim": "#5c564a",
          "--rule": "#7a7263",
          "--stamp": "#a32d25",
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(26,23,20,0.035) 0px, rgba(26,23,20,0.035) 1px, transparent 1px, transparent 3px)",
          boxShadow: "inset 0 0 0 1px rgba(26,23,20,0.08)",
        } as React.CSSProperties
      }
    >
      <div className="flex h-full flex-col px-14 py-[26px]">
        {/* Header */}
        <header className="flex items-start justify-between border-b border-[var(--rule)] pb-4">
          <div>
            <div className="flex items-baseline gap-3">
              <span
                className="font-[family-name:var(--font-numeral)] uppercase"
                style={{ fontSize: "0.6875rem", letterSpacing: "0.06em", color: "var(--ink-dim)" }}
              >
                Plate 3.1
              </span>
              <span
                className="font-[family-name:var(--font-mono)]"
                style={{ fontSize: "0.6875rem", color: "var(--ink-dim)" }}
              >
                gmira-typeset
              </span>
            </div>
            <h1 className="mt-3 flex items-baseline gap-3 text-balance">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "3.052rem",
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                  color: "var(--ink)",
                }}
              >
                Display
              </span>
              <span
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: "1.563rem",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  color: "var(--ink-dim)",
                }}
              >
                and Text
              </span>
            </h1>
            <p
              className="mt-2 italic"
              style={{ fontFamily: "var(--font-text)", fontSize: "0.8125rem", color: "var(--ink-dim)" }}
            >
              Two cuts of the Fell types, each shown at the size its job requires.
            </p>
          </div>
          <p
            className="whitespace-nowrap text-right font-[family-name:var(--font-numeral)] uppercase"
            style={{ fontSize: "0.6875rem", letterSpacing: "0.06em", color: "var(--ink-dim)" }}
          >
            Type Foundry
            <br />
            Specimen Book
          </p>
        </header>

        {/* Band 1, the scale */}
        <section className="border-b border-[var(--rule)] py-4">
          <BandLabel index="01" label="The Scale" value="1.25 ratio" />
          <div
            className="mt-4 grid items-baseline"
            style={{ gridTemplateColumns: SCALE_COLUMNS, columnGap: "8px" }}
          >
            {SCALE.map((s) => (
              <span
                key={s.label}
                className="justify-self-center"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: `${s.rem}rem`,
                  letterSpacing: s.tracking,
                  lineHeight: 1,
                  color: "var(--ink)",
                }}
              >
                Aa
              </span>
            ))}
          </div>
          <div
            className="mt-3 grid border-t border-[var(--rule)] pt-2"
            style={{ gridTemplateColumns: SCALE_COLUMNS, columnGap: "8px" }}
          >
            {SCALE.map((s) => (
              <span
                key={s.label}
                className="justify-self-center whitespace-nowrap font-[family-name:var(--font-mono)] tabular-nums"
                style={{
                  fontSize: "0.6875rem",
                  color: "var(--ink-dim)",
                  fontVariantNumeric: "tabular-nums slashed-zero",
                }}
              >
                {s.label}
              </span>
            ))}
          </div>
        </section>

        {/* Band 2, the measure */}
        <section className="flex flex-1 flex-col justify-center border-b border-[var(--rule)] py-4">
          <BandLabel index="02" label="The Measure" value="65 to 75 ch" />
          <div className="mt-5 flex items-center gap-10">
            <div>
              <div
                className="relative"
                style={{ fontFamily: "var(--font-text)", fontSize: "1rem", height: "34px", width: "88ch" }}
              >
                <div
                  className="absolute top-0 bottom-0"
                  style={{
                    left: "65ch",
                    width: "10ch",
                    background: "color-mix(in oklab, var(--stamp) 12%, var(--paper))",
                  }}
                />
                {TICKS.map((n) => {
                  const boundary = n === 65 || n === 75;
                  const isSet = n === 70;
                  const major = n % 10 === 0;
                  const tall = major || boundary;
                  const tone = boundary || isSet ? "var(--stamp)" : "var(--ink-dim)";
                  return (
                    <div
                      key={n}
                      className="absolute bottom-0 flex flex-col items-center"
                      style={{ left: `${n}ch`, transform: "translateX(-50%)" }}
                    >
                      {tall && (
                        <span
                          className="mb-1 font-[family-name:var(--font-mono)] tabular-nums"
                          style={{ fontSize: "0.6875rem", color: tone, fontVariantNumeric: "tabular-nums slashed-zero" }}
                        >
                          {n}
                        </span>
                      )}
                      <span
                        style={{ display: "block", width: "1px", height: tall ? "14px" : "7px", background: tone }}
                      />
                    </div>
                  );
                })}
              </div>
              <p
                className="mt-1 text-pretty"
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  width: "70ch",
                  color: "var(--ink)",
                }}
              >
                This column is set seventy characters wide. Sixty-five to seventy-five is
                the working range: short enough that the eye returns to the correct line
                unaided, long enough that a sentence can breathe before it turns. The
                ruler above uses the same face and size as this paragraph.
              </p>
            </div>
            <div className="flex-none -rotate-3 border-2 border-[var(--stamp)] p-1">
              <div className="flex flex-col items-center gap-1 border border-[var(--stamp)] px-4 py-3">
                <span
                  className="font-[family-name:var(--font-mono)] uppercase"
                  style={{ fontSize: "0.6875rem", letterSpacing: "0.06em", color: "var(--stamp)" }}
                >
                  Measure
                </span>
                <span
                  className="whitespace-nowrap font-[family-name:var(--font-mono)]"
                  style={{ fontSize: "1rem", color: "var(--stamp)" }}
                >
                  65 to 75 ch
                </span>
                <span
                  className="whitespace-nowrap font-[family-name:var(--font-mono)] uppercase"
                  style={{ fontSize: "0.6875rem", letterSpacing: "0.06em", color: "var(--stamp)" }}
                >
                  Set at 70
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Band 3, the tracking floor */}
        <section className="py-4">
          <BandLabel index="03" label="The Floor" value="min -0.04em" />
          <div className="mt-4 flex items-end gap-10">
            <div>
              <p
                className="text-balance"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.441rem",
                  letterSpacing: "0em",
                  lineHeight: 1.05,
                  color: "var(--ink)",
                }}
              >
                Hold The Line
              </p>
              <p
                className="mt-2 font-[family-name:var(--font-mono)]"
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.02em",
                  color: "var(--ink-dim)",
                  fontVariantNumeric: "tabular-nums slashed-zero",
                }}
              >
                0EM, DEFAULT
              </p>
            </div>
            <div className="h-14 w-px flex-none self-center bg-[var(--rule)]" />
            <div>
              <p
                className="text-balance"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.441rem",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  color: "var(--ink)",
                }}
              >
                Hold The Line
              </p>
              <p
                className="mt-2 font-[family-name:var(--font-mono)]"
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.02em",
                  color: "var(--stamp)",
                  fontVariantNumeric: "tabular-nums slashed-zero",
                }}
              >
                -0.04EM, FLOOR
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto flex items-end justify-between border-t border-[var(--rule)] pt-3">
          <p className="italic" style={{ fontFamily: "var(--font-text)", fontSize: "0.8125rem", color: "var(--ink-dim)" }}>
            Set in IM Fell English and IM Fell Great Primer, with Archivo Black and Fragment Mono.
          </p>
          <span className="font-[family-name:var(--font-mono)]" style={{ fontSize: "0.6875rem", color: "var(--ink-dim)" }}>
            doctrine sec. 3.1
          </span>
        </footer>
      </div>
    </div>
  );
}
