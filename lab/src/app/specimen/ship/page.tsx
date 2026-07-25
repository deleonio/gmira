import { Staatliches, JetBrains_Mono, Permanent_Marker } from "next/font/google";

/*
  Specimen: gmira-ship, pre-flight checklist plate.
  World: a steel clipboard, paper clamped under a metal clip, viewed straight on.
  Shows: seven checklist lines already ticked in pen (verify, build, the
  pre-flight table, the bundle grep, the route soak, console, staged), then one
  line that will not tick itself. The deploy box stays open, circled in red,
  and a marker note explains why: nothing is deployed, because nobody has said
  go yet. That closing line is drawn straight from the skill's own checklist.
  Mode: read. One prop, one voice change: printed form gives way to a hand.
*/

const display = Staatliches({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--ship-display",
});

const mono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--ship-mono",
});

const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--ship-marker",
});

const BOARD_1 = "#3a3f44";
const BOARD_2 = "#24272b";
const BOARD_3 = "#17191c";
const CLIP_LIGHT = "#e7eaed";
const CLIP_MID = "#aab0b6";
const CLIP_DARK = "#666c71";
const RIVET = "#0d0e0f";
const PAPER = "#f4efe2";
const PAPER_LINE = "rgba(33,29,22,0.05)";
const MARGIN_RULE = "rgba(156,31,22,0.28)";
const INK = "#211d16";
const MUTE = "#5c5040";
const RED = "#9c1f16";
const PEN = "#1f3a5f";
const ROW_RULE = "rgba(33,29,22,0.14)";

type ChecklistItem = { n: string; label: string; status: string };

const ITEMS: ChecklistItem[] = [
  { n: "01", label: "Verify", status: "All routes green" },
  { n: "02", label: "Build", status: "Exit 0, zero errors" },
  { n: "03", label: "Pre-Flight", status: "Table walked in full" },
  { n: "04", label: "Bundle", status: "No secrets found" },
  { n: "05", label: "Route Soak", status: "20 changes, flat" },
  { n: "06", label: "Console", status: "Zero warnings" },
  { n: "07", label: "Staged", status: "Four facts stated" },
];

function Tick() {
  return (
    <svg
      viewBox="0 0 28 28"
      className="pointer-events-none absolute -left-[3px] -top-[3px] h-[28px] w-[28px]"
      style={{ transform: "rotate(-5deg)" }}
      aria-hidden="true"
    >
      <path
        d="M5 15 L11 21 L23 6"
        fill="none"
        stroke={PEN}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HoldCircle() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="pointer-events-none absolute -left-[9px] -top-[9px] h-[40px] w-[40px]"
      style={{ transform: "rotate(-7deg)" }}
      aria-hidden="true"
    >
      <ellipse
        cx="20"
        cy="20"
        rx="17"
        ry="14.5"
        fill="none"
        stroke={RED}
        strokeWidth="2.6"
      />
    </svg>
  );
}

function Box({ ticked }: { ticked: boolean }) {
  return (
    <span
      className="relative inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[3px]"
      style={{ border: `2px solid ${INK}` }}
    >
      {ticked ? <Tick /> : null}
    </span>
  );
}

function MetaRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-[10px] py-[2px]">
      <span
        className="text-[9.5px] uppercase leading-none tracking-[0.14em]"
        style={{ color: MUTE }}
      >
        {label}
      </span>
      <span
        className={`text-[13px] leading-none ${strong ? "font-bold" : ""}`}
        style={{ color: strong ? RED : INK }}
      >
        {value}
      </span>
    </div>
  );
}

function Row({ item }: { item: ChecklistItem }) {
  return (
    <div
      className="flex items-center gap-[14px] py-[8px]"
      style={{ borderBottom: `1px solid ${ROW_RULE}` }}
    >
      <span className="w-[20px] shrink-0 text-[11px]" style={{ color: MUTE }}>
        {item.n}
      </span>
      <Box ticked />
      <span
        className="w-[184px] shrink-0 text-[18px] font-bold uppercase tracking-[0.01em]"
        style={{ color: INK }}
      >
        {item.label}
      </span>
      <span
        className="h-0 flex-1"
        style={{ borderBottom: "1.5px dotted rgba(33,29,22,0.32)" }}
      />
      <span
        className="shrink-0 text-[11.5px] uppercase tracking-[0.05em]"
        style={{ color: MUTE }}
      >
        {item.status}
      </span>
    </div>
  );
}

export const metadata = {
  title: "gmira-ship, specimen",
  description:
    "A pre-flight checklist rendered as a physical departure checklist: seven lines ticked, one line held for go.",
};

export default function ShipSpecimen() {
  return (
    <div
      className={`${display.variable} ${mono.variable} ${marker.variable} relative h-[750px] w-[1200px] overflow-hidden`}
      style={{
        background: `linear-gradient(160deg, ${BOARD_1} 0%, ${BOARD_2} 55%, ${BOARD_3} 100%)`,
        fontFamily: "var(--ship-mono)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(100deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 6px)",
        }}
        aria-hidden="true"
      />

      {[
        { left: 16, top: 16 },
        { left: 1176, top: 16 },
        { left: 16, top: 726 },
        { left: 1176, top: 726 },
      ].map((c, i) => (
        <span
          key={i}
          className="absolute h-[9px] w-[9px] rounded-full"
          style={{
            left: c.left,
            top: c.top,
            background: `radial-gradient(circle at 35% 30%, ${CLIP_LIGHT}, ${RIVET} 70%)`,
          }}
          aria-hidden="true"
        />
      ))}

      <div
        className="absolute left-1/2 top-[24px] z-10 h-[26px] w-[172px] -translate-x-1/2 rounded-[4px]"
        style={{ background: `linear-gradient(180deg, ${CLIP_DARK}, ${BOARD_3})` }}
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-[42px] z-10 h-[36px] w-[206px] -translate-x-1/2 rounded-[6px]"
        style={{
          background: `linear-gradient(180deg, ${CLIP_LIGHT} 0%, ${CLIP_MID} 55%, ${CLIP_DARK} 100%)`,
          boxShadow: "0 8px 14px rgba(0,0,0,0.4)",
        }}
        aria-hidden="true"
      >
        <span
          className="absolute left-1/2 top-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: RIVET,
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.3)",
          }}
        />
      </div>

      <div
        className="absolute overflow-hidden rounded-[2px]"
        style={{
          left: 24,
          right: 24,
          top: 58,
          bottom: 24,
          background: PAPER,
          boxShadow: "0 16px 34px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.15)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent 27px, ${PAPER_LINE} 27px, ${PAPER_LINE} 28px)`,
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 top-0"
          style={{ left: 40, width: 1.5, background: MARGIN_RULE }}
          aria-hidden="true"
        />

        <div className="relative flex h-full flex-col px-[52px] pb-[20px] pt-[30px]">
          <div className="flex shrink-0 items-start justify-between gap-[28px]">
            <div>
              <p
                className="text-[12px] font-bold uppercase leading-none tracking-[0.26em]"
                style={{ color: RED }}
              >
                Departure checklist
              </p>
              <h1
                className="mt-[10px] text-[78px] uppercase leading-[0.88] tracking-[-0.01em]"
                style={{ color: INK, fontFamily: "var(--ship-display)" }}
              >
                Pre-Flight
              </h1>
              <p
                className="mt-[10px] max-w-[560px] text-[14.5px] leading-snug"
                style={{ color: MUTE }}
              >
                Build locally, stage the deploy, wait for the order.
              </p>
            </div>
            <div
              className="mt-[4px] w-[196px] shrink-0"
              style={{ border: `2px solid ${INK}` }}
            >
              <div className="px-[13px] pb-[9px] pt-[10px]">
                <MetaRow label="Form" value="07 D" />
                <MetaRow label="Route" value="All routes" />
                <MetaRow label="Date" value="25.07.2026" />
              </div>
              <div
                className="px-[13px] py-[7px]"
                style={{ borderTop: `2px solid ${INK}` }}
              >
                <MetaRow label="Status" value="Hold" strong />
              </div>
            </div>
          </div>

          <div
            className="mt-[16px] shrink-0"
            style={{ borderTop: `3px solid ${INK}` }}
          />
          <div
            className="mt-[3px] shrink-0"
            style={{ borderTop: `1px solid ${INK}` }}
          />

          <div className="mt-[10px] shrink-0">
            {ITEMS.map((item) => (
              <Row key={item.n} item={item} />
            ))}
          </div>

          <div className="relative mt-[6px] flex flex-1 flex-col justify-center">
            <div className="flex items-center gap-[14px] py-[8px]">
              <span
                className="w-[20px] shrink-0 text-[11px]"
                style={{ color: MUTE }}
              >
                08
              </span>
              <span
                className="relative inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[3px]"
                style={{ border: `2px solid ${INK}` }}
              >
                <HoldCircle />
              </span>
              <span
                className="w-[184px] shrink-0 text-[18px] font-bold uppercase tracking-[0.01em]"
                style={{ color: INK }}
              >
                Deploy
              </span>
              <span
                className="shrink-0 rounded-[2px] px-[10px] py-[3px] text-[14px] leading-none"
                style={{
                  border: `2px solid ${RED}`,
                  color: RED,
                  fontFamily: "var(--ship-marker)",
                  transform: "rotate(-4deg)",
                }}
              >
                hold
              </span>
            </div>
            <p
              className="mt-[8px] text-[29px] leading-[1.16]"
              style={{
                color: RED,
                fontFamily: "var(--ship-marker)",
                transform: "rotate(-0.5deg)",
              }}
            >
              Nothing is deployed.
              <br />
              Nobody has said go yet.
            </p>
          </div>

          <div
            className="mt-[10px] flex shrink-0 items-end justify-between pt-[8px]"
            style={{ borderTop: "1px solid rgba(33,29,22,0.2)" }}
          >
            <p className="text-[11px]" style={{ color: MUTE }}>
              gmira-ship
            </p>
            <p
              className="text-[11px] uppercase tracking-[0.1em]"
              style={{ color: MUTE }}
            >
              Specimen plate, pre-flight checklist
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
