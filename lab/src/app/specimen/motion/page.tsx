import { Big_Shoulders_Stencil, Courier_Prime } from "next/font/google";

/*
  SPECIMEN      gmira-motion
  WORLD         An engineering drawing sheet: ruled border, bottom title block, four timing
                tracks laid out like a drafting table chart.
  SHOWS         The duration and easing table drawn as physical tracks: 100, 200, 400, 800 ms,
                each a distance bar whose marks sit at the real eased position for that curve,
                with the cubic-bezier plotted in the margin beside it.
  MODE          Read. The plate is reference material, not a pitch.
*/

const display = Big_Shoulders_Stencil({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const mono = Courier_Prime({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

/*
  Cubic bezier solve. The same Newton Raphson approach the CSS timing function
  itself uses: given elapsed time as a fraction from 0 to 1, find the curve
  parameter u whose X(u) equals that time, then read Y(u) at that u. Y is the
  physical position each track's mark gets plotted at, so the spacing below
  is the real curve, not a hand placed guess at one.
*/
function bezierA(a1: number, a2: number) {
  return 1 - 3 * a2 + 3 * a1;
}
function bezierB(a1: number, a2: number) {
  return 3 * a2 - 6 * a1;
}
function bezierC(a1: number) {
  return 3 * a1;
}
function bezierValue(t: number, a1: number, a2: number) {
  return ((bezierA(a1, a2) * t + bezierB(a1, a2)) * t + bezierC(a1)) * t;
}
function bezierSlope(t: number, a1: number, a2: number) {
  return 3 * bezierA(a1, a2) * t * t + 2 * bezierB(a1, a2) * t + bezierC(a1);
}
function solveT(x: number, x1: number, x2: number) {
  let t = x;
  for (let i = 0; i < 6; i++) {
    const slope = bezierSlope(t, x1, x2);
    if (Math.abs(slope) < 1e-6) break;
    t -= (bezierValue(t, x1, x2) - x) / slope;
  }
  return Math.min(1, Math.max(0, t));
}
function positionAt(time: number, x1: number, y1: number, x2: number, y2: number) {
  return bezierValue(solveT(time, x1, x2), y1, y2);
}

type Curve = { name: string; x1: number; y1: number; x2: number; y2: number; css: string };

const CURVE_QUART: Curve = { name: "ease-out-quart", x1: 0.25, y1: 1, x2: 0.5, y2: 1, css: "0.25, 1, 0.5, 1" };
const CURVE_EXPO: Curve = { name: "ease-out-expo", x1: 0.16, y1: 1, x2: 0.3, y2: 1, css: "0.16, 1, 0.3, 1" };
const CURVE_INOUT: Curve = { name: "ease-in-out", x1: 0.65, y1: 0, x2: 0.35, y2: 1, css: "0.65, 0, 0.35, 1" };

const SAMPLES = 9;

function sampleTicks(curve: Curve) {
  return Array.from({ length: SAMPLES }, (_, i) =>
    positionAt(i / (SAMPLES - 1), curve.x1, curve.y1, curve.x2, curve.y2)
  );
}

const RAW_TRACKS: { ms: number; index: string; role: string; example: string; curve: Curve }[] = [
  { ms: 100, index: "01", role: "Feedback", example: "button fill", curve: CURVE_QUART },
  { ms: 200, index: "02", role: "State change", example: "tab switch", curve: CURVE_EXPO },
  { ms: 400, index: "03", role: "Transition", example: "drawer, modal", curve: CURVE_INOUT },
  { ms: 800, index: "04", role: "Focal entrance", example: "hero sequence, once", curve: CURVE_EXPO },
];

const TRACKS = RAW_TRACKS.map((t) => ({ ...t, ticks: sampleTicks(t.curve) }));

function curvePath(curve: Curve) {
  const c1x = curve.x1 * 100;
  const c1y = 100 - curve.y1 * 100;
  const c2x = curve.x2 * 100;
  const c2y = 100 - curve.y2 * 100;
  return `M0,100 C${c1x},${c1y} ${c2x},${c2y} 100,0`;
}

const TITLE_BLOCK: { label: string; value: string; grow?: boolean }[] = [
  { label: "Project", value: "Gmira motion doctrine", grow: true },
  { label: "Dwg no", value: "gmira-motion" },
  { label: "Scale", value: "1:1 time" },
  { label: "Sheet", value: "1 of 1" },
  { label: "Rev", value: "A" },
];

export default function MotionSpecimen() {
  return (
    <div
      className={`${display.variable} ${mono.variable} relative h-[750px] w-[1200px] overflow-hidden font-[family-name:var(--font-mono)]`}
      style={
        {
          "--paper": "#e8dcc0",
          "--ink": "#201a10",
          "--ink-soft": "#57503c",
          "--rule": "#3f3520",
          "--red": "#9c341f",
          backgroundColor: "var(--paper)",
          color: "var(--ink)",
        } as React.CSSProperties
      }
    >
      <div className="absolute flex flex-col" style={{ inset: 20, border: "1.5px solid var(--rule)" }}>
        <div className="flex min-h-0 flex-1 flex-col px-8 pt-5">
          <header
            className="flex shrink-0 items-start justify-between gap-8 pb-3"
            style={{ borderBottom: "1.5px solid var(--rule)" }}
          >
            <div>
              <p className="text-[10.5px] uppercase tracking-[0.22em]" style={{ color: "var(--ink-soft)" }}>
                Motion doctrine, part 3.5
              </p>
              <h1 className="mt-1 text-[32px] font-extrabold leading-[0.95] tracking-tight font-[family-name:var(--font-display)]">
                Timing &amp; spacing
              </h1>
              <p className="mt-1 max-w-[62ch] text-[11.5px] leading-snug" style={{ color: "var(--ink-soft)" }}>
                Four duration tracks. Equal time steps plotted as position: bunched marks read slow, spread marks read fast.
              </p>
            </div>
            <div className="shrink-0 pt-1 text-right">
              <p className="text-[10.5px] uppercase tracking-[0.22em]" style={{ color: "var(--ink-soft)" }}>
                Reads as
              </p>
              <p className="mt-1 text-[12px] font-bold">4 tracks, 3 curves</p>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col">
            {TRACKS.map((t, idx) => (
              <div
                key={t.ms}
                className="flex min-h-0 flex-1 items-center gap-5"
                style={idx < TRACKS.length - 1 ? { borderBottom: "1px dashed var(--rule)" } : undefined}
              >
                <div className="w-[150px] shrink-0">
                  <p className="text-[9px] uppercase tracking-[0.16em]" style={{ color: "var(--ink-soft)" }}>
                    Track {t.index}
                  </p>
                  <p className="leading-none font-[family-name:var(--font-display)]">
                    <span className="text-[34px] font-bold tracking-tight">{t.ms}</span>
                    <span className="ml-1 align-top text-[11px] font-bold">ms</span>
                  </p>
                  <p className="mt-0.5 text-[10.5px] leading-snug">
                    <span className="font-bold uppercase tracking-[0.04em]">{t.role}</span>
                    <span className="italic" style={{ color: "var(--ink-soft)" }}>
                      {" "}
                      · {t.example}
                    </span>
                  </p>
                </div>

                <div className="relative h-[40px] flex-1">
                  <div
                    className="absolute left-0 right-0 top-1/2 h-[1.5px] -translate-y-1/2"
                    style={{ backgroundColor: "var(--ink)" }}
                  />
                  {[0, 0.25, 0.5, 0.75, 1].map((g) => (
                    <div
                      key={g}
                      className="absolute top-1/2 h-[12px] w-px -translate-y-1/2"
                      style={{ left: `${g * 100}%`, backgroundColor: "var(--rule)", opacity: 0.35 }}
                    />
                  ))}
                  {t.ticks.map((pos, i) => {
                    const edge = i === 0 || i === t.ticks.length - 1;
                    const r = edge ? 6 : 4;
                    return (
                      <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          left: `${pos * 100}%`,
                          top: "50%",
                          width: r * 2,
                          height: r * 2,
                          marginLeft: -r,
                          marginTop: -r,
                          backgroundColor: "var(--red)",
                          border: "2px solid var(--paper)",
                        }}
                      />
                    );
                  })}
                </div>

                <div className="flex w-[182px] shrink-0 items-center gap-2.5">
                  <svg width="64" height="64" viewBox="0 0 100 100" className="shrink-0" aria-hidden>
                    <rect x="0.5" y="0.5" width="99" height="99" fill="none" stroke="var(--ink)" strokeWidth="1.2" />
                    <line
                      x1="0"
                      y1="100"
                      x2="100"
                      y2="0"
                      stroke="var(--ink-soft)"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                      opacity={0.5}
                    />
                    <line
                      x1="0"
                      y1="100"
                      x2={t.curve.x1 * 100}
                      y2={100 - t.curve.y1 * 100}
                      stroke="var(--red)"
                      strokeWidth="1"
                      strokeDasharray="1.5 2"
                      opacity={0.6}
                    />
                    <line
                      x1="100"
                      y1="0"
                      x2={t.curve.x2 * 100}
                      y2={100 - t.curve.y2 * 100}
                      stroke="var(--red)"
                      strokeWidth="1"
                      strokeDasharray="1.5 2"
                      opacity={0.6}
                    />
                    <path d={curvePath(t.curve)} fill="none" stroke="var(--red)" strokeWidth="3.4" strokeLinecap="round" />
                    <circle
                      cx={t.curve.x1 * 100}
                      cy={100 - t.curve.y1 * 100}
                      r="3.2"
                      fill="var(--paper)"
                      stroke="var(--red)"
                      strokeWidth="2"
                    />
                    <circle
                      cx={t.curve.x2 * 100}
                      cy={100 - t.curve.y2 * 100}
                      r="3.2"
                      fill="var(--paper)"
                      stroke="var(--red)"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.04em]">{t.curve.name}</p>
                    <p className="mt-0.5 text-[9px] leading-snug" style={{ color: "var(--ink-soft)" }}>
                      cubic-bezier({t.curve.css})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="shrink-0 py-2 text-[10.5px] italic" style={{ color: "var(--ink-soft)" }}>
            Note: removing a track should cost meaning, not just motion.
          </p>
        </div>

        <div className="flex shrink-0" style={{ borderTop: "1.5px solid var(--rule)" }}>
          {TITLE_BLOCK.map((cell, i) => (
            <div
              key={cell.label}
              className={cell.grow ? "min-w-0 flex-[1.4] px-4 py-2" : "min-w-0 flex-1 px-4 py-2"}
              style={i > 0 ? { borderLeft: "1.5px solid var(--rule)" } : undefined}
            >
              <p className="text-[8.5px] uppercase tracking-[0.16em]" style={{ color: "var(--ink-soft)" }}>
                {cell.label}
              </p>
              <p className="mt-0.5 truncate text-[11.5px] font-bold">{cell.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
