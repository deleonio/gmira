import { Azeret_Mono } from "next/font/google";

/*
  SPECIMEN      gmira-perf

  WORLD         A dot matrix ledger printout: greenbar continuous feed paper,
                sprocket holes down both edges, a red ink correction struck
                through by hand, a pressed rubber stamp. Close kin to the
                worlds.md shipping manifest and agate stock table entries
                (impact print, totals at the foot, tabular figures), run here
                as one committed world per the brief's own "budget sheet"
                framing rather than the day's drawn fusion (seed
                gmira-perf:2026-07-25, world 18 Beck diagram, world 24
                topographic survey). That pair has no slot for a struck ledger
                line or a pressed stamp, so it was excluded on that ground,
                not on taste.

  SHOWS         Three ledger lines (three.js voided, framer-motion and lenis
                kept) against the 200 KB route floor, the roughly 16 slot
                WebGL context drawer leaking to a silent null, and the 2.5s
                LCP line pressed like a paid ticket.

  NUMBERS       600 KB (three.js, minified, roughly), 35 KB (framer-motion,
                gzipped), 3 KB (lenis, gzipped), 200 KB (first load JS floor,
                gzipped, per route), 16 (webgl context cap, roughly), 2.5s
                (LCP, mobile, throttled). All read from the gmira-perf
                skill's own tables, nothing invented.
*/

const mono = Azeret_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "gmira-perf, specimen plate",
  description:
    "Bundle weight, WebGL context drawer and the LCP floor for the gmira-perf skill, read as a ledger sheet.",
};

const INK = "#1b2a1c";
const INK_MUTED = "#445241";
const RED = "#8a1f1a";
const BAND_LIGHT = "#f3f1e4";
const BAND_DARK = "#d9e8d2";
const RULE = "#a9bfa0";
const STRIPE = 30;
const COLS = "grid-cols-[176px_108px_92px_1fr]";

type BundleRow = {
  item: string;
  weight: string;
  note: string;
  voided: boolean;
};

const BUNDLE_ROWS: BundleRow[] = [
  {
    item: "THREE.JS",
    weight: "~600 KB",
    note: "earns its place per component, never by default",
    voided: true,
  },
  {
    item: "FRAMER-MOTION",
    weight: "35 KB",
    note: "the default, unlocks 29 of 56 components",
    voided: false,
  },
  {
    item: "LENIS",
    weight: "3 KB",
    note: "smooth scroll, cheap enough to be uncontroversial",
    voided: false,
  },
];

function Hole() {
  return (
    <span
      className="h-[10px] w-[10px] shrink-0 rounded-full"
      style={{
        background: "rgba(27,42,28,0.14)",
        boxShadow:
          "inset 0 1px 2px rgba(27,42,28,0.4), inset 0 -1px 1px rgba(255,255,255,0.5)",
      }}
    />
  );
}

function SprocketRail({ align }: { align: "left" | "right" }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-y-0 ${
        align === "left" ? "left-[14px]" : "right-[14px]"
      } flex w-[12px] flex-col items-center justify-between py-[22px]`}
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <Hole key={i} />
      ))}
    </div>
  );
}

function Stamp() {
  return (
    <div
      className="relative flex h-[104px] w-[104px] shrink-0 items-center justify-center"
      style={{ transform: "rotate(-9deg)" }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: `3px solid ${RED}`, opacity: 0.82 }}
      />
      <div
        className="absolute inset-[7px] rounded-full"
        style={{ border: `1.5px solid ${RED}`, opacity: 0.82 }}
      />
      <div
        className="flex flex-col items-center justify-center text-center leading-none"
        style={{ color: RED }}
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.14em]">lcp under</span>
        <span className="text-[27px] font-extrabold">2.5s</span>
        <span className="text-[8px] font-bold uppercase tracking-[0.1em]">hard line</span>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div
      className={`${mono.variable} relative h-[750px] w-[1200px] overflow-hidden select-none`}
      style={{
        fontFamily: "var(--font-mono)",
        color: INK,
        backgroundImage: `repeating-linear-gradient(to bottom, ${BAND_LIGHT} 0px, ${BAND_LIGHT} ${STRIPE}px, ${BAND_DARK} ${STRIPE}px, ${BAND_DARK} ${STRIPE * 2}px)`,
      }}
    >
      <SprocketRail align="left" />
      <SprocketRail align="right" />

      <div className="absolute inset-0 flex flex-col px-[46px] py-[26px]">
        <header className="flex shrink-0 items-start justify-between border-b-[3px] pb-3" style={{ borderColor: INK }}>
          <div className="min-w-0">
            <p className="text-[12px] font-medium uppercase tracking-[0.24em]" style={{ color: INK_MUTED }}>
              form perf-01 &middot; part 4 &middot; gate g8
            </p>
            <h1 className="mt-1 text-[52px] font-extrabold uppercase leading-[0.86] tracking-tight" style={{ color: INK }}>
              The Budget Sheet
            </h1>
            <p className="mt-2 text-[13px] uppercase tracking-[0.16em]" style={{ color: INK_MUTED }}>
              bundle weight &middot; context drawer &middot; paint time
            </p>
          </div>
          <div className="shrink-0 pt-1 text-right">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.2em]" style={{ color: INK_MUTED }}>
              skill
            </p>
            <p className="text-[16px] font-bold">gmira-perf</p>
            <p className="mt-2 text-[10.5px] font-medium uppercase tracking-[0.2em]" style={{ color: INK_MUTED }}>
              sheet
            </p>
            <p className="text-[16px] font-bold">1 of 1</p>
          </div>
        </header>

        <div className="mt-4 flex min-h-0 flex-1 gap-10">
          <div className="flex min-h-0 flex-[1.75] flex-col">
            <div className="flex shrink-0 items-baseline justify-between">
              <h2 className="text-[21px] font-bold uppercase tracking-wide">Bundle weight</h2>
              <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: INK_MUTED }}>
                gzipped, per package
              </span>
            </div>

            <div
              className={`mt-3 grid ${COLS} shrink-0 gap-x-5 text-[10.5px] font-bold uppercase tracking-[0.12em]`}
              style={{ color: INK_MUTED }}
            >
              <span>Item</span>
              <span className="text-right">Weight</span>
              <span>Entry</span>
              <span>Reason</span>
            </div>
            <div className="mt-1 shrink-0 border-t-[1.5px]" style={{ borderColor: INK }} />

            <div className="flex min-h-0 flex-1 flex-col">
              {BUNDLE_ROWS.map((row, i) => (
                <div
                  key={row.item}
                  className={`grid ${COLS} flex-1 items-center gap-x-5`}
                  style={i < BUNDLE_ROWS.length - 1 ? { borderBottom: `1px dashed ${RULE}` } : undefined}
                >
                  <span
                    className="text-[19px] font-bold uppercase"
                    style={{
                      color: row.voided ? INK_MUTED : INK,
                      textDecorationLine: row.voided ? "line-through" : "none",
                      textDecorationColor: RED,
                      textDecorationThickness: "2.5px",
                    }}
                  >
                    {row.item}
                  </span>
                  <span
                    className="text-right text-[19px] font-bold tabular-nums"
                    style={{
                      color: row.voided ? INK_MUTED : INK,
                      textDecorationLine: row.voided ? "line-through" : "none",
                      textDecorationColor: RED,
                      textDecorationThickness: "2.5px",
                    }}
                  >
                    {row.weight}
                  </span>
                  <span
                    className="text-[13.5px] font-bold uppercase tracking-wide"
                    style={{ color: row.voided ? RED : INK }}
                  >
                    {row.voided ? "X void" : "kept"}
                  </span>
                  <span className="text-[12px] leading-snug" style={{ color: INK_MUTED }}>
                    {row.note}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-1 shrink-0 border-t-[2.5px] pt-[10px]" style={{ borderColor: INK }}>
              <div className={`grid ${COLS} items-baseline gap-x-5`}>
                <span className="text-[15px] font-bold uppercase tracking-wide">Route floor</span>
                <span className="text-right text-[19px] font-bold tabular-nums">200 KB</span>
                <span className="text-[13.5px] font-bold uppercase tracking-wide" style={{ color: INK_MUTED }}>
                  floor
                </span>
                <span className="text-[12px] leading-snug" style={{ color: INK_MUTED }}>
                  first load js, gzipped, per route
                </span>
              </div>
              <p className="mt-2 text-[12px] leading-snug" style={{ color: INK_MUTED }}>
                38 KB kept leaves 162 KB of headroom. Three.js alone runs 3x the floor.
              </p>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4 pl-8" style={{ borderLeft: `2px dashed ${RULE}` }}>
            <div className="flex flex-[1.5] flex-col">
              <h2 className="shrink-0 text-[18px] font-bold uppercase tracking-wide">Context drawer</h2>
              <p className="shrink-0 text-[10.5px] uppercase tracking-[0.12em]" style={{ color: INK_MUTED }}>
                live webgl contexts, per page
              </p>

              <div className="mt-2 flex flex-1 items-center gap-5">
                <div className="flex shrink-0 flex-col items-center">
                  <span className="text-[56px] font-extrabold leading-none">16</span>
                  <span
                    className="mt-1 text-center text-[9.5px] font-bold uppercase leading-tight tracking-[0.1em]"
                    style={{ color: INK_MUTED }}
                  >
                    roughly,
                    <br />
                    the cap
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="flex items-center gap-3">
                    <div className="grid grid-cols-8 gap-[5px]" aria-hidden="true">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <span key={i} className="h-[17px] w-[17px]" style={{ background: INK }} />
                      ))}
                    </div>
                    <span
                      className="flex h-[20px] w-[20px] shrink-0 items-center justify-center text-[13px] font-bold"
                      style={{ border: `2px dashed ${RED}`, color: RED }}
                    >
                      X
                    </span>
                  </div>
                  <p className="text-center text-[11px] leading-snug" style={{ color: INK_MUTED }}>
                    16 slots leak full. The 17th call returns <span style={{ color: RED, fontWeight: 800 }}>null</span>, no throw, no log.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-5 border-t-[2px] pt-4" style={{ borderColor: RULE }}>
              <div className="min-w-0 flex-1">
                <h2 className="text-[18px] font-bold uppercase tracking-wide">Paint budget</h2>
                <p className="mt-1 text-[12px] leading-snug" style={{ color: INK_MUTED }}>
                  Largest contentful paint. Mobile, throttled. Measured, never estimated.
                </p>
              </div>
              <Stamp />
            </div>
          </div>
        </div>

        <footer className="mt-3 flex shrink-0 items-center justify-between border-t-[3px] pt-2" style={{ borderColor: INK }}>
          <span className="text-[13px] font-bold tracking-[0.04em]">gmira-perf</span>
          <span className="text-[11px] uppercase tracking-[0.2em]" style={{ color: INK_MUTED }}>
            measured, never estimated
          </span>
        </footer>
      </div>
    </div>
  );
}
