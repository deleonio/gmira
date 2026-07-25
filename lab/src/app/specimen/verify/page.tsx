import type { CSSProperties } from "react";
import { JetBrains_Mono } from "next/font/google";

/*
  SPECIMEN CONTRACT

  SKILL       gmira-verify
  WORLD       Cyanotype blueprint plate. A scale drawing of the five fixed
              viewports sharing one origin corner, a punch style gate table,
              and a red ink verification stamp: the way a print shop hands
              back a checked drawing, not a dashboard.
  FORM        Header with title and stamp. Left: the five viewports drawn to
              scale from a common origin, plus a five item legend. Right:
              the ten gate table as a small grid, then the anchoring
              quarantine as a numbered rule with a stamped warning line.
  MATERIAL    Deep cyanotype navy, near white ink, pale blue ink for body
              text, bright cyan for section heads, red ink for the two
              viewports opened first and for the stamp. JetBrains Mono only,
              set in caps throughout, the way drafting lettering reads.
  CONTRAST    ink 14.5:1, ink dim 11.1:1, cyan 9.4:1, red 5.5:1, each
              measured against the plate navy #0a2540 used as the real
              background behind every text element on this plate.
*/

const mono = JetBrains_Mono({
  variable: "--font-jbm",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata = {
  title: "gmira-verify, specimen",
  description:
    "The five fixed viewports drawn to scale from one origin, the ten gate table, and the anchoring quarantine as a numbered rule.",
};

const PLATE = "#0a2540";
const INK = "#f3f8ff";
const INK_DIM = "#c7ddf2";
const CYAN = "#7fd4ff";
const RED = "#ff6b57";
const HAIR = "rgba(199,221,242,0.28)";
const GRID_LINE = "rgba(143,212,255,0.055)";

const GATES: { code: string; label: string }[] = [
  { code: "G1", label: "DIRECTION" },
  { code: "G2", label: "REFUSALS" },
  { code: "G3", label: "CONTRAST" },
  { code: "G4", label: "TYPE" },
  { code: "G5", label: "MOTION" },
  { code: "G6", label: "STATES" },
  { code: "G7", label: "CONTENT" },
  { code: "G8", label: "GPU" },
  { code: "G9", label: "CONSOLE" },
  { code: "G10", label: "EYES" },
];

const VIEWPORTS: { dims: string; name: string; accent: boolean }[] = [
  { dims: "1920×1080", name: "DESKTOP WIDE", accent: false },
  { dims: "1440×900", name: "DESIGN DEFAULT", accent: true },
  { dims: "1024×768", name: "SMALL LAPTOP", accent: false },
  { dims: "834×1112", name: "TABLET PORTRAIT", accent: false },
  { dims: "390×844", name: "PHONE", accent: true },
];

function CornerMark({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute h-4 w-4 ${className}`}
      style={{ borderColor: HAIR }}
    />
  );
}

function Tick() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7.4L5.6 10.5L11.5 3.6"
        stroke={CYAN}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StampBadge() {
  return (
    <div
      aria-hidden="true"
      className="relative shrink-0"
      style={{ width: 108, height: 108, transform: "rotate(-9deg)" }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: `2.5px solid ${RED}`, opacity: 0.9 }}
      />
      <div
        className="absolute rounded-full"
        style={{ inset: 8, border: `1.25px solid ${RED}`, opacity: 0.7 }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="text-[15px] font-extrabold tracking-[0.02em]" style={{ color: RED }}>
          VERIFIED
        </span>
        <span className="text-[11px] font-bold tracking-[0.08em]" style={{ color: RED }}>
          10 / 10
        </span>
      </div>
    </div>
  );
}

function GateBadge({ code, label }: { code: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 border px-1 py-2.5" style={{ borderColor: HAIR }}>
      <div className="flex items-center gap-1">
        <span className="text-[19px] font-bold leading-none" style={{ color: CYAN }}>
          {code}
        </span>
        <Tick />
      </div>
      <span
        className="text-center text-[9px] font-bold leading-tight tracking-[0.06em]"
        style={{ color: INK_DIM }}
      >
        {label}
      </span>
    </div>
  );
}

function LegendItem({ dims, name, accent }: { dims: string; name: string; accent: boolean }) {
  return (
    <div className="flex flex-1 flex-col gap-[3px]">
      <span
        className="block h-[3px] w-[30px]"
        style={{ backgroundColor: accent ? RED : INK_DIM, opacity: accent ? 1 : 0.5 }}
      />
      <span className="text-[13px] font-bold leading-none" style={{ color: accent ? RED : INK }}>
        {dims}
      </span>
      <span className="text-[8.5px] leading-tight tracking-[0.05em]" style={{ color: INK_DIM }}>
        {name}
      </span>
    </div>
  );
}

function QuarantineStep({ n, text, accent }: { n: string; text: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-3 border-b py-[7px] last:border-b-0" style={{ borderColor: HAIR }}>
      <span
        className="w-[26px] shrink-0 text-[17px] font-bold leading-none"
        style={{ color: accent ? RED : CYAN }}
      >
        {n}
      </span>
      <span className="text-[11.5px] leading-snug" style={{ color: INK_DIM }}>
        {text}
      </span>
    </div>
  );
}

export default function VerifySpecimen() {
  return (
    <div
      className={`${mono.variable} relative flex h-[750px] w-[1200px] flex-col overflow-hidden bg-[var(--plate)] p-10 font-[family-name:var(--font-jbm)] text-[var(--ink)]`}
      style={
        {
          "--plate": PLATE,
          "--ink": INK,
          "--ink-dim": INK_DIM,
          "--cyan": CYAN,
          "--red": RED,
          "--hair": HAIR,
          backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
          backgroundSize: "24px 24px, 24px 24px",
        } as CSSProperties
      }
    >
      <CornerMark className="left-3 top-3 border-l-2 border-t-2" />
      <CornerMark className="right-3 top-3 border-r-2 border-t-2" />
      <CornerMark className="bottom-3 left-3 border-b-2 border-l-2" />
      <CornerMark className="bottom-3 right-3 border-b-2 border-r-2" />

      <header className="flex shrink-0 items-center justify-between gap-10 border-b-2 pb-5" style={{ borderColor: HAIR }}>
        <div>
          <p className="text-[11px] tracking-[0.28em]" style={{ color: INK_DIM }}>
            GMIRA SKILL LIBRARY / VERIFICATION PLATE
          </p>
          <h1
            className="mt-2 text-[92px] font-extrabold leading-[0.85] tracking-[-0.03em]"
            style={{ color: INK }}
          >
            GMIRA-VERIFY
          </h1>
          <p className="mt-2 text-[15px] tracking-[0.02em]" style={{ color: INK_DIM }}>
            FIVE VIEWPORTS. TEN GATES. LOOK BEFORE YOU READ THE REPORT.
          </p>
        </div>
        <StampBadge />
      </header>

      <div className="mt-6 flex min-h-0 flex-1 gap-10">
        <div className="flex min-h-0 basis-[58%] flex-col">
          <div className="flex shrink-0 items-baseline justify-between">
            <h2 className="text-[15px] font-bold tracking-[0.06em]" style={{ color: CYAN }}>
              FIVE VIEWPORTS, COMMON ORIGIN
            </h2>
            <span className="text-[11px] tracking-[0.06em]" style={{ color: INK_DIM }}>
              SCALE 1:4
            </span>
          </div>
          <p className="mt-1 shrink-0 text-[10.5px] tracking-[0.02em]" style={{ color: INK_DIM }}>
            FIXED. NOT NEGOTIABLE. THE FIVE SIZES WHERE REGRESSIONS ACTUALLY APPEARED.
          </p>

          <div className="relative mt-2 min-h-0 flex-1">
            <svg
              viewBox="0 0 516 308"
              preserveAspectRatio="xMidYMid meet"
              className="h-full w-full"
              aria-hidden="true"
            >
              <line x1={24} y1={292} x2={34} y2={292} stroke={INK_DIM} strokeWidth={1.5} opacity={0.6} />
              <line x1={24} y1={292} x2={24} y2={282} stroke={INK_DIM} strokeWidth={1.5} opacity={0.6} />

              <rect x={24} y={14} width={208.5} height={278} fill="none" stroke={INK_DIM} strokeWidth={1.3} opacity={0.42} />
              <rect x={24} y={22} width={480} height={270} fill="none" stroke={INK_DIM} strokeWidth={1.3} opacity={0.42} />
              <rect x={24} y={100} width={256} height={192} fill="none" stroke={INK_DIM} strokeWidth={1.3} opacity={0.42} />
              <rect x={24} y={67} width={360} height={225} fill="none" stroke={RED} strokeWidth={2.4} opacity={0.95} />
              <rect x={24} y={81} width={97.5} height={211} fill="none" stroke={RED} strokeWidth={2.4} opacity={0.95} />
            </svg>
          </div>

          <div className="mt-3 flex shrink-0 items-start gap-3 border-t pt-3" style={{ borderColor: HAIR }}>
            {VIEWPORTS.map((v) => (
              <LegendItem key={v.dims} dims={v.dims} name={v.name} accent={v.accent} />
            ))}
          </div>
          <p className="mt-2 shrink-0 text-[9.5px] tracking-[0.03em]" style={{ color: INK_DIM }}>
            RED VIEWPORTS ARE READ FIRST. SEE THE RULE AT RIGHT.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col border-l pl-8" style={{ borderColor: HAIR }}>
          <div className="flex shrink-0 items-baseline justify-between">
            <h2 className="text-[15px] font-bold tracking-[0.06em]" style={{ color: CYAN }}>
              GATE TABLE
            </h2>
            <span className="text-[10px] tracking-[0.05em]" style={{ color: INK_DIM }}>
              TEN, ALL GREEN TO SHIP
            </span>
          </div>
          <div className="mt-2 grid shrink-0 grid-cols-5 gap-[3px]">
            {GATES.map((g) => (
              <GateBadge key={g.code} code={g.code} label={g.label} />
            ))}
          </div>

          <div className="mt-4 shrink-0 border-t-2 pt-3" style={{ borderColor: RED }}>
            <h2 className="text-[15px] font-bold tracking-[0.06em]" style={{ color: CYAN }}>
              ANCHORING QUARANTINE
            </h2>
            <p className="mt-0.5 text-[10px] tracking-[0.02em]" style={{ color: INK_DIM }}>
              OPEN THE REPORT LAST, NOT FIRST.
            </p>
          </div>

          <div className="mt-2 shrink-0">
            <QuarantineStep n="01" accent text="LOOK AT 1440×900 FIRST. WRITE 3 TO 6 SENTENCES." />
            <QuarantineStep n="02" accent text="LOOK AT 390×844. SAME." />
            <QuarantineStep n="03" text="ONLY THEN: REPORT.JSON, CONSOLE, LINT." />
            <QuarantineStep n="04" text="SYNTHESIZE." />
          </div>

          <div className="mt-3 shrink-0 border px-3 py-2" style={{ borderColor: RED }}>
            <p className="text-[11px] font-bold leading-snug tracking-[0.01em]" style={{ color: RED }}>
              READ THE REPORT FIRST AND STEP ONE NEVER HAPPENED.
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-5 flex shrink-0 items-center justify-between border-t pt-3" style={{ borderColor: HAIR }}>
        <span className="text-[10.5px] tracking-[0.05em]" style={{ color: INK_DIM }}>
          DOCTRINE PT.7.3 BUDGET / PT.8 GATE TABLE
        </span>
        <span className="text-[11px] tracking-[0.02em]" style={{ color: INK_DIM }}>
          gmira-verify
        </span>
      </footer>
    </div>
  );
}
