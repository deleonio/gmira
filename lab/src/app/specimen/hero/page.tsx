import { Big_Shoulders, Space_Mono } from "next/font/google";

/*
  Specimen: gmira-hero, the frame 0 problem.

  This plate is a diagram, not a live effect. It shows the two resolutions named
  in gmira-hero step 3: an effect must earn its place at frame 0, with no input.

  Left panel: a pointer-driven effect with no seed and no autonomous clock, so the
  first paint is an empty rectangle. Right panel: the identical composition seeded
  on mount, so frame 0 is already complete. Both panels are static CSS and SVG
  standing in for what each resolution would actually render, not a working shader.
*/

const display = Big_Shoulders({
  variable: "--fh-display",
  subsets: ["latin"],
  weight: ["800", "900"],
});

const mono = Space_Mono({
  variable: "--fh-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const PAPER = "#ece4d1";
const VOID = "#e2d9c4";
const INK = "#171310";
const INK_SOFT = "#5a5044";
const CARBON = "#0c0d0a";
const CREAM = "#f4eee0";
const CREAM_SOFT = "#c9beac";
const OXIDE = "#9c2e1d";
const GOLD = "#d8b24a";
const RULE = "#b3a78c";

function Sprockets({ edge }: { edge: "top" | "bottom" }) {
  return (
    <div
      aria-hidden
      className={`absolute left-0 right-0 h-4 ${edge === "top" ? "top-0" : "bottom-0"}`}
      style={{
        backgroundColor: INK,
        backgroundImage: `radial-gradient(circle, ${PAPER} 2.4px, transparent 2.6px)`,
        backgroundSize: "26px 16px",
        backgroundPosition: "13px center",
      }}
    />
  );
}

function Stamp({ label, color, rotate }: { label: string; color: string; rotate: number }) {
  return (
    <div
      className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full text-[11px] font-bold tracking-[0.05em]"
      style={{ border: `2px solid ${color}`, color, transform: `rotate(${rotate}deg)` }}
    >
      {label}
    </div>
  );
}

export default function HeroSpecimen() {
  return (
    <div
      className={`${display.variable} ${mono.variable} relative h-[750px] w-[1200px] overflow-hidden font-[family-name:var(--fh-mono)]`}
      style={{ backgroundColor: PAPER, color: INK, border: `1px solid ${INK}` }}
    >
      <Sprockets edge="top" />
      <Sprockets edge="bottom" />

      <div className="absolute left-0 right-0 top-4 bottom-4 flex flex-col px-12 pb-5 pt-6">
        <div
          className="flex shrink-0 items-baseline justify-between text-[11px] tracking-[0.22em]"
          style={{ color: INK_SOFT }}
        >
          <span>GMIRA SKILL LIBRARY</span>
          <span>HERO · LAW 3 · FIRST VIEWPORT</span>
        </div>

        <h1
          className="mt-[8px] shrink-0 text-[126px] font-black leading-[0.85] tracking-[-0.02em]"
          style={{ fontFamily: "var(--fh-display)" }}
        >
          FRAME 0
        </h1>

        <p className="mt-[6px] shrink-0 text-[17px] leading-snug" style={{ color: INK_SOFT }}>
          What a pointer-driven effect shows before the pointer ever moves.
        </p>

        <div className="mt-[22px] flex min-h-0 flex-1 gap-7">
          {/* Panel A: no seed, no autonomous clock. Frame 0 renders nothing. */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div
              className="flex shrink-0 items-baseline justify-between text-[12px] tracking-[0.14em]"
              style={{ color: INK_SOFT }}
            >
              <span>A · NO SEED</span>
              <span>FRAME 0000</span>
            </div>
            <div
              className="relative mt-[8px] min-h-0 flex-1 overflow-hidden"
              style={{ backgroundColor: VOID, border: `1.5px solid ${INK}` }}
            >
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 opacity-[0.3]"
              >
                <div
                  className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
                  style={{ backgroundColor: INK_SOFT }}
                />
                <div
                  className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2"
                  style={{ backgroundColor: INK_SOFT }}
                />
              </div>
              <span
                className="absolute bottom-3 left-3 text-[10px] tracking-[0.1em]"
                style={{ color: INK_SOFT }}
              >
                NO AUTOPLAY
              </span>
              <Stamp label="NG" color={OXIDE} rotate={8} />
            </div>
            <div className="mt-[10px] shrink-0">
              <div
                className="text-[36px] font-extrabold leading-none"
                style={{ fontFamily: "var(--fh-display)" }}
              >
                NO INPUT
              </div>
              <p className="mt-[4px] text-[14px] leading-snug" style={{ color: INK_SOFT }}>
                Motion tied to the pointer. No pointer, no motion.
              </p>
            </div>
          </div>

          <div aria-hidden className="w-px shrink-0" style={{ borderLeft: `1px dashed ${RULE}` }} />

          {/* Panel B: seeded on mount. Frame 0 is already complete. */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div
              className="flex shrink-0 items-baseline justify-between text-[12px] tracking-[0.14em]"
              style={{ color: INK_SOFT }}
            >
              <span>B · SEEDED</span>
              <span>FRAME 0000</span>
            </div>
            <div
              className="relative mt-[8px] min-h-0 flex-1 overflow-hidden"
              style={{
                backgroundColor: CARBON,
                border: `1.5px solid ${INK}`,
                boxShadow: "inset 0 0 80px 8px rgba(0,0,0,0.6)",
              }}
            >
              <div
                aria-hidden
                className="absolute -left-12 -top-16 h-56 w-72 rounded-full"
                style={{ backgroundColor: GOLD, opacity: 0.45, filter: "blur(60px)" }}
              />
              <div
                aria-hidden
                className="absolute -bottom-20 -right-6 h-56 w-64 rounded-full"
                style={{ backgroundColor: OXIDE, opacity: 0.55, filter: "blur(64px)" }}
              />
              <svg
                aria-hidden
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 540 300"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="rbnGold" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={GOLD} stopOpacity="0" />
                    <stop offset="45%" stopColor={GOLD} stopOpacity="0.95" />
                    <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="rbnCream" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={CREAM} stopOpacity="0" />
                    <stop offset="50%" stopColor={CREAM} stopOpacity="0.75" />
                    <stop offset="100%" stopColor={CREAM} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M -20 220 C 110 150, 230 265, 380 160 S 560 70, 600 95"
                  stroke="url(#rbnGold)"
                  strokeWidth="3.5"
                  fill="none"
                />
                <path
                  d="M -20 95 C 130 45, 260 155, 400 75 S 540 25, 600 55"
                  stroke="url(#rbnCream)"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M -20 255 C 150 268, 300 195, 430 235 S 560 262, 600 225"
                  stroke="url(#rbnGold)"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.55"
                />
              </svg>
              <span
                className="absolute bottom-3 left-3 text-[10px] tracking-[0.1em]"
                style={{ color: CREAM_SOFT }}
              >
                AUTOPLAY: CENTER
              </span>
              <Stamp label="SEL" color={GOLD} rotate={-7} />
            </div>
            <div className="mt-[10px] shrink-0">
              <div
                className="text-[36px] font-extrabold leading-none"
                style={{ fontFamily: "var(--fh-display)" }}
              >
                SEEDED
              </div>
              <p className="mt-[4px] text-[14px] leading-snug" style={{ color: INK_SOFT }}>
                Motion seeded on load. No pointer, no problem.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-[16px] shrink-0">
          <p className="text-[14.5px] leading-snug" style={{ color: INK_SOFT }}>
            &quot;An effect must earn its place at frame 0, with no input.&quot; (gmira doctrine, law 3)
          </p>
          <div
            className="mt-[6px] flex items-baseline justify-between text-[11px] tracking-[0.18em]"
            style={{ color: INK_SOFT }}
          >
            <span>gmira-hero</span>
            <span>SPECIMEN PROOF, NOT FINAL ART</span>
          </div>
        </div>
      </div>
    </div>
  );
}
