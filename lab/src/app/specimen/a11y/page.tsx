import { Oswald, JetBrains_Mono } from "next/font/google";

/*
  SPECIMEN      gmira-a11y
  WORLD         A contrast meter's calibration plate. An instrument reads a swatch,
                prints the ratio, and stamps a verdict, the way a multimeter reads a
                circuit. The scale panel is the meter's track: two floors drawn as
                dashed lines, five readings plotted against them.
  SHOWS         Five text on background pairs, three passing and two failing, each
                walked through the WCAG 2.1 relative luminance formula this skill's
                own console script runs. Readings 03 and 05 sit in the same numeric
                band, one passes and one fails, because text size moves the floor
                from 4.5:1 down to 3:1. A focus ring detail on the right shows a
                control with the ring always drawn, since a still plate cannot be
                tabbed into.
  MODE          Read. The plate reports a measurement, it does not sell one.
  NOTE          All five ratios below are computed with the standard WCAG formula
                (relative luminance, then contrast ratio), not eyeballed or invented.
*/

const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--a11y-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--a11y-mono",
});

const DISPLAY = "font-[family-name:var(--a11y-display)]";
const MONO = "font-[family-name:var(--a11y-mono)]";

const PAPER = "#eef1ec";
const CARD = "#f7f9f5";
const INK = "#13181a";
const INK_SOFT = "#56635c";
const AMBER = "#a5670d";
const FAIL = "#b3261e";
const PASS = "#1f7a4d";
const FOREST = "#0f2d1e";
const BANNER = "#ae7a1e";
const RULE = "rgba(19,24,26,0.18)";

type Pair = {
  id: string;
  name: string;
  requirement: string;
  fg: string;
  bg: string;
  ratio: number;
  pass: boolean;
  sample: string;
  large?: boolean;
  pos?: number;
  overflow?: boolean;
};

const PAIRS: Pair[] = [
  {
    id: "01",
    name: "Ink on paper",
    requirement: "BODY TEXT, FLOOR 4.5:1",
    fg: INK,
    bg: PAPER,
    ratio: 15.71,
    pass: true,
    sample: "Reads clearly",
    overflow: true,
  },
  {
    id: "02",
    name: "Placeholder grey on paper",
    requirement: "BODY TEXT, FLOOR 4.5:1",
    fg: "#9b978a",
    bg: PAPER,
    ratio: 2.56,
    pass: false,
    sample: "Hard to read",
    pos: 22.34,
  },
  {
    id: "03",
    name: "Headline blue on paper",
    requirement: "LARGE TEXT, FLOOR 3:1",
    fg: "#5a7a9d",
    bg: PAPER,
    ratio: 3.92,
    pass: true,
    sample: "Aa",
    large: true,
    pos: 41.67,
  },
  {
    id: "04",
    name: "Sage on forest",
    requirement: "BODY TEXT, FLOOR 4.5:1",
    fg: "#6e9a85",
    bg: FOREST,
    ratio: 4.68,
    pass: true,
    sample: "Reads clearly",
    pos: 52.61,
  },
  {
    id: "05",
    name: "Card white on amber banner",
    requirement: "BODY TEXT, FLOOR 4.5:1",
    fg: CARD,
    bg: BANNER,
    ratio: 3.54,
    pass: false,
    sample: "Hard to read",
    pos: 36.26,
  },
];

function NamePlateRow({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-[5px] ${last ? "" : "border-b"}`}
      style={{ borderColor: RULE }}
    >
      <span
        className={`${MONO} text-[9.5px] font-semibold uppercase tracking-[0.1em]`}
        style={{ color: INK_SOFT }}
      >
        {k}
      </span>
      <span className={`${MONO} text-[11px] font-semibold`} style={{ color: INK }}>
        {v}
      </span>
    </div>
  );
}

function Row({ pair }: { pair: Pair }) {
  return (
    <div className="flex flex-1 items-center gap-3">
      <span className={`${MONO} w-[16px] shrink-0 text-[11px] font-bold`} style={{ color: INK_SOFT }}>
        {pair.id}
      </span>
      <div
        className="flex h-[46px] w-[104px] shrink-0 items-center justify-center px-1 text-center"
        style={{ backgroundColor: pair.bg }}
      >
        <span
          className={pair.large ? `${DISPLAY} font-bold` : DISPLAY}
          style={{
            color: pair.fg,
            fontSize: pair.large ? 26 : 12.5,
            fontWeight: pair.large ? 700 : 500,
            lineHeight: 1.15,
          }}
        >
          {pair.sample}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className={`${DISPLAY} truncate text-[14px] font-medium`} style={{ color: INK }}>
          {pair.name}
        </p>
        <p className={`${MONO} mt-[1px] text-[9px] tracking-[0.04em]`} style={{ color: INK_SOFT }}>
          {pair.requirement}
        </p>
      </div>
      <p
        className={`${MONO} shrink-0 text-right text-[21px] font-bold leading-none tabular-nums`}
        style={{ color: pair.pass ? PASS : FAIL, minWidth: 82 }}
      >
        {pair.ratio.toFixed(2)}:1
      </p>
      <span
        className={`${MONO} shrink-0 px-[6px] py-[3px] text-[9px] font-bold tracking-[0.06em]`}
        style={{
          color: pair.pass ? PASS : FAIL,
          border: `1.3px solid ${pair.pass ? PASS : FAIL}`,
        }}
      >
        {pair.pass ? "PASS" : "FAIL"}
      </span>
    </div>
  );
}

function Tick({ pos }: { pos: number }) {
  return (
    <div className="absolute top-0" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
      <div className="h-[6px] w-px" style={{ backgroundColor: INK_SOFT, opacity: 0.4 }} />
    </div>
  );
}

function ThresholdLine({ pos, value, label }: { pos: number; value: string; label: string }) {
  return (
    <>
      <div
        className="absolute"
        style={{
          left: `${pos}%`,
          top: -24,
          height: 42,
          width: 0,
          borderLeft: `2px dashed ${AMBER}`,
          transform: "translateX(-50%)",
        }}
      />
      <div
        className="absolute w-max text-center"
        style={{ left: `${pos}%`, top: -52, transform: "translateX(-50%)" }}
      >
        <p className={`${MONO} text-[10.5px] font-bold leading-tight`} style={{ color: INK }}>
          {value}
        </p>
        <p className={`${MONO} text-[7.5px] leading-tight tracking-[0.03em]`} style={{ color: INK_SOFT }}>
          {label}
        </p>
      </div>
    </>
  );
}

function Marker({ pos, color, id, below }: { pos: number; color: string; id: string; below?: boolean }) {
  return (
    <div className="absolute top-0" style={{ left: `${pos}%`, transform: "translate(-50%, -50%)" }}>
      <div
        className="h-[10px] w-[10px] rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 0 2px ${CARD}` }}
      />
      <span
        className={`${MONO} absolute left-1/2 whitespace-nowrap text-[9.5px] font-bold`}
        style={{ color, transform: "translateX(-50%)", top: below ? 11 : -15 }}
      >
        {id}
      </span>
    </div>
  );
}

export default function A11ySpecimen() {
  return (
    <div
      className={`${display.variable} ${mono.variable} ${DISPLAY} flex h-[750px] w-[1200px] flex-col overflow-hidden px-10 py-8`}
      style={{ backgroundColor: PAPER, color: INK, boxShadow: `inset 0 0 0 1px ${RULE}` }}
    >
      <header className="flex items-start justify-between gap-8 border-b pb-3" style={{ borderColor: RULE }}>
        <div className="min-w-0">
          <p
            className={`${MONO} text-[11px] font-semibold uppercase tracking-[0.18em]`}
            style={{ color: INK_SOFT }}
          >
            Gmira / a11y skill
          </p>
          <h1
            className={`${DISPLAY} mt-1 text-[38px] font-bold leading-[1.02] tracking-[-0.01em]`}
            style={{ color: INK }}
          >
            Contrast, Measured
          </h1>
          <p className={`${DISPLAY} mt-1 max-w-[540px] text-[14px] leading-snug`} style={{ color: INK_SOFT }}>
            Five text-on-background pairs, walked against WCAG 2.1 relative luminance.
          </p>
        </div>
        <div className="w-[204px] shrink-0 border px-3 py-2" style={{ borderColor: RULE }}>
          <NamePlateRow k="Standard" v="WCAG 2.1 AA" />
          <NamePlateRow k="Floor" v="Body 4.5:1" />
          <NamePlateRow k="Floor" v="Large 3:1" last />
        </div>
      </header>

      <div className="mt-4 flex flex-1 gap-6">
        <section className="flex w-[664px] shrink-0 flex-col border px-6 py-4" style={{ borderColor: RULE, backgroundColor: CARD }}>
          <p className={`${MONO} text-[10px] font-semibold uppercase tracking-[0.14em]`} style={{ color: INK_SOFT }}>
            Readings 01 to 05
          </p>
          <h2 className={`${DISPLAY} mt-[2px] text-[19px] font-semibold`} style={{ color: INK }}>
            Five pairs, measured
          </h2>
          <div className="mt-2 flex flex-1 flex-col gap-1">
            {PAIRS.map((pair) => (
              <Row key={pair.id} pair={pair} />
            ))}
          </div>
        </section>

        <section className="flex flex-1 flex-col border px-6 py-4" style={{ borderColor: RULE, backgroundColor: CARD }}>
          <p className={`${MONO} text-[10px] font-semibold uppercase tracking-[0.14em]`} style={{ color: INK_SOFT }}>
            Detail
          </p>
          <h2 className={`${DISPLAY} mt-[2px] text-[19px] font-semibold`} style={{ color: INK }}>
            Focus ring
          </h2>

          <div className="flex flex-1 flex-col items-center justify-center gap-5">
            <div className="flex items-center gap-9">
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  className={`${DISPLAY} text-[14px] font-medium`}
                  style={{
                    color: INK,
                    backgroundColor: CARD,
                    border: `1.5px solid ${INK}`,
                    padding: "9px 20px",
                  }}
                >
                  Save
                </button>
                <span className={`${MONO} text-[9.5px] tracking-[0.04em]`} style={{ color: INK_SOFT }}>
                  no focus ring
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  className={`${DISPLAY} text-[14px] font-medium`}
                  style={{
                    color: CARD,
                    backgroundColor: INK,
                    border: "1.5px solid transparent",
                    padding: "9px 20px",
                    outline: `3px solid ${AMBER}`,
                    outlineOffset: "3px",
                  }}
                >
                  Continue
                </button>
                <span className={`${MONO} text-[9.5px] tracking-[0.04em]`} style={{ color: INK_SOFT }}>
                  focus ring, always shown
                </span>
              </div>
            </div>

            <p className={`${MONO} max-w-[280px] text-center text-[10.5px] leading-snug`} style={{ color: INK_SOFT }}>
              Ring measures 4.36:1 against this panel. Controls and focus indicators need
              3:1.
            </p>
          </div>
        </section>
      </div>

      <div
        className="relative mt-4 shrink-0 border px-9"
        style={{ borderColor: RULE, backgroundColor: CARD, height: 112 }}
      >
        <p
          className={`${MONO} absolute left-9 top-3 text-[10px] font-semibold uppercase tracking-[0.12em]`}
          style={{ color: INK_SOFT }}
        >
          Scale, 1:1 to 8:1
        </p>

        <div className="absolute" style={{ left: 36, right: 36, top: 66, height: 2, backgroundColor: "rgba(19,24,26,0.3)" }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <Tick key={n} pos={((n - 1) / 7) * 100} />
          ))}

          <ThresholdLine pos={28.57} value="3:1" label="LARGE TEXT FLOOR" />
          <ThresholdLine pos={50} value="4.5:1" label="BODY TEXT FLOOR" />

          {[...PAIRS]
            .filter((p) => !p.overflow)
            .sort((a, b) => (a.pos ?? 0) - (b.pos ?? 0))
            .map((p, i) => (
              <Marker
                key={p.id}
                pos={p.pos as number}
                color={p.pass ? PASS : FAIL}
                id={p.id}
                below={i % 2 === 0}
              />
            ))}

          {(() => {
            const off = PAIRS.find((p) => p.overflow);
            if (!off) return null;
            return (
              <div className="absolute text-right" style={{ right: 0, top: -24 }}>
                <p
                  className={`${MONO} whitespace-nowrap text-[10px] font-bold leading-tight`}
                  style={{ color: off.pass ? PASS : FAIL }}
                >
                  {off.id}, {off.ratio.toFixed(2)}:1 &#8594;
                </p>
                <p
                  className={`${MONO} whitespace-nowrap text-[7.5px] leading-tight tracking-[0.03em]`}
                  style={{ color: INK_SOFT }}
                >
                  past the scale
                </p>
              </div>
            );
          })()}

          <span className={`${MONO} absolute left-0 text-[9px]`} style={{ color: INK_SOFT, top: 16 }}>
            1:1
          </span>
          <span className={`${MONO} absolute text-[9px]`} style={{ color: INK_SOFT, top: 16, right: 0 }}>
            8:1
          </span>
        </div>
      </div>

      <footer className="mt-3 flex items-center justify-between border-t pt-2" style={{ borderColor: RULE }}>
        <span className={`${MONO} border px-2 py-1 text-[11px]`} style={{ borderColor: RULE, color: INK }}>
          gmira-a11y
        </span>
        <p className={`${MONO} text-[10.5px]`} style={{ color: INK_SOFT }}>
          Specimen plate. All five ratios are computed with the WCAG 2.1 formula, not estimated.
        </p>
      </footer>
    </div>
  );
}
