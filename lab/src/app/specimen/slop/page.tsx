import { Special_Elite, Courier_Prime } from "next/font/google";

const display = Special_Elite({ weight: "400", subsets: ["latin"] });
const mono = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"] });

// Specimen for the gmira-slop skill: the twelve visual tells rendered as a printed
// audit sheet. Tell names, checks and thresholds are taken from the skill's own
// doctrine (SKILL.md). The found and clear split below is illustrative for this
// plate only, it is not a real audit of a real page.
//
// Every text node below carries an explicit pixel lineHeight. The browser's normal
// line height for this typeface runs tall, and this plate has a hard 750px frame
// with no scroll, so line height is pinned rather than left to the font metrics.

const INK = "#241f18";
const MUTED = "#4a4237";
const RED = "#7a1f18";
const AMBER = "#7a4d0f";
const GREEN = "#3c5a3f";
const PAPER = "#f1ead6";
const RULE = "#d9cfae";
const MARGIN_LINE = "#b5544a";

const COLS = "228px 340px 264px 224px";

type Severity = "auto" | "mention" | "route";

type Tell = {
  n: number;
  tell: string;
  check: string;
  threshold: string;
  status: "found" | "clear";
  severity?: Severity;
  route?: string;
};

const TELLS: Tell[] = [
  {
    n: 1,
    tell: "Uniform section rhythm",
    check: "Computed block padding per section",
    threshold: "4+ sections, 70% in one bucket",
    status: "clear",
  },
  {
    n: 2,
    tell: "Three column reflex",
    check: "Grids with exactly 3 tracks",
    threshold: "2+ grids, mixed content",
    status: "found",
    severity: "auto",
  },
  {
    n: 3,
    tell: "One crop ratio",
    check: "Width to height per image",
    threshold: "6+ images, 2 or fewer ratios",
    status: "clear",
  },
  {
    n: 4,
    tell: "Accent as confetti",
    check: "Surface share of top chroma color",
    threshold: "15+ elements, under 5% surface",
    status: "found",
    severity: "route",
    route: "gmira-palette",
  },
  {
    n: 5,
    tell: "Identical entrance",
    check: "Duration, delay, offset triple",
    threshold: "4+ sections share one triple",
    status: "found",
    severity: "route",
    route: "gmira-motion",
  },
  {
    n: 6,
    tell: "Icon, heading, two lines",
    check: "Heading between svg and p",
    threshold: "3 or more instances",
    status: "found",
    severity: "mention",
  },
  {
    n: 7,
    tell: "One case, every role",
    check: "Casing class per heading",
    threshold: "One class covers every role",
    status: "clear",
  },
  {
    n: 8,
    tell: "The filter left on",
    check: "Screenshot delta, effect off",
    threshold: "Under 6 of 255, over 60% view",
    status: "clear",
  },
  {
    n: 9,
    tell: "Truncated to fit",
    check: "Line clamp or true ellipsis",
    threshold: "3 or more elements",
    status: "clear",
  },
  {
    n: 10,
    tell: "The centered column",
    check: "Left and right gutter width",
    threshold: "4+ sections symmetric, 4px",
    status: "found",
    severity: "mention",
  },
  {
    n: 11,
    tell: "Decorative chrome",
    check: "Rings or lines inside cards",
    threshold: "2 or more instances",
    status: "clear",
  },
  {
    n: 12,
    tell: "One effects registry",
    check: "Source per installed effect",
    threshold: "3+ effects, one source",
    status: "clear",
  },
];

const FOUND_COUNT = TELLS.filter((t) => t.status === "found").length;
const CLEAR_COUNT = TELLS.length - FOUND_COUNT;

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="text-center">
      <p className="text-[22px] font-bold" style={{ color, lineHeight: "22px" }}>
        {value}
      </p>
      <p
        className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em]"
        style={{ color: MUTED, lineHeight: "10px" }}
      >
        {label}
      </p>
    </div>
  );
}

function SeverityCell({ t }: { t: Tell }) {
  if (t.status !== "found" || !t.severity) return <div />;
  const color = t.severity === "route" ? RED : t.severity === "mention" ? AMBER : MUTED;
  return (
    <div style={{ fontSize: "9px", lineHeight: "11px" }}>
      <span
        className="text-[10px] font-bold uppercase tracking-[0.1em]"
        style={{ color, lineHeight: "12px" }}
      >
        {t.severity}
      </span>
      {t.route ? (
        <div className="mt-0.5 text-[9px]" style={{ color: MUTED, lineHeight: "11px" }}>
          {"→ " + t.route}
        </div>
      ) : null}
    </div>
  );
}

export default function Page() {
  return (
    <div
      className={`relative h-[750px] w-[1200px] overflow-hidden ${mono.className}`}
      style={{
        backgroundColor: PAPER,
        backgroundImage:
          "repeating-linear-gradient(to bottom, rgba(36,31,24,0.035) 0px, rgba(36,31,24,0.035) 1px, transparent 1px, transparent 27px)",
        boxShadow: "inset 0 0 0 1px rgba(36,31,24,0.15)",
        color: INK,
      }}
    >
      {/* binder margin: three punch holes, a red rule line, a rotated specimen tag */}
      <div className="absolute left-0 top-0 h-[750px] w-[64px]">
        {[140, 375, 610].map((y) => (
          <div
            key={y}
            className="absolute left-[30px] h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              top: y,
              background: "#e6dcc2",
              border: "1px solid rgba(36,31,24,0.22)",
              boxShadow: "inset 0 1px 2px rgba(36,31,24,0.35)",
            }}
          />
        ))}
        <div
          className="absolute top-[22px] h-[706px] w-[1.5px]"
          style={{ left: 62, background: MARGIN_LINE, opacity: 0.5 }}
        />
        <div
          className="absolute flex items-center justify-center"
          style={{ left: 30, top: 492, width: 150, transform: "translate(-50%, -50%) rotate(-90deg)" }}
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: MUTED, lineHeight: "11px" }}>
            Specimen copy
          </span>
        </div>
      </div>

      {/* sheet content */}
      <div
        className="relative flex h-full flex-col"
        style={{ paddingLeft: 88, paddingRight: 40, paddingTop: 22, paddingBottom: 12 }}
      >
        {/* masthead */}
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: MUTED, lineHeight: "12px" }}
            >
              Gmira audit division, findings report
            </p>
            <h1
              className={`${display.className} mt-1 text-[40px]`}
              style={{ color: INK, lineHeight: "38px" }}
            >
              Twelve visual tells
            </h1>
            <p className="mt-2 text-[12px] italic" style={{ color: MUTED, lineHeight: "14px" }}>
              Every legal value, checked for uniformity.
            </p>
          </div>

          <div className="text-right">
            <div className="flex justify-end gap-1.5 text-[10.5px]" style={{ lineHeight: "13px" }}>
              <span className="font-bold" style={{ color: MUTED }}>
                FORM
              </span>
              <span className="font-bold" style={{ color: INK }}>
                VT.12
              </span>
              <span className="font-bold" style={{ color: MUTED }}>
                DATE
              </span>
              <span className="font-bold" style={{ color: INK }}>
                25 JUL 2026
              </span>
            </div>
            <div className="mt-2 flex justify-end gap-4">
              <Stat value={TELLS.length} label="Checked" color={INK} />
              <Stat value={FOUND_COUNT} label="Found" color={RED} />
              <Stat value={CLEAR_COUNT} label="Clear" color={GREEN} />
            </div>
          </div>
        </div>

        {/* letterhead double rule */}
        <div className="mt-2" style={{ borderTop: `1.5px solid ${INK}` }} />
        <div className="mt-[3px]" style={{ borderTop: `1px solid ${RULE}` }} />

        {/* table header */}
        <div
          className="mt-2"
          style={{
            display: "grid",
            gridTemplateColumns: COLS,
            paddingLeft: 12,
            paddingBottom: 6,
            borderBottom: `1.5px solid ${INK}`,
            lineHeight: "12px",
          }}
        >
          <span className="pr-3 text-[10px] font-bold uppercase tracking-[0.1em]">Tell</span>
          <span className="pr-3 text-[10px] font-bold uppercase tracking-[0.1em]">Check</span>
          <span className="pr-3 text-[10px] font-bold uppercase tracking-[0.1em]">Threshold</span>
          <span className="pr-3 text-[10px] font-bold uppercase tracking-[0.1em]">Severity</span>
        </div>

        {/* rows */}
        <div>
          {TELLS.map((t) => (
            <div
              key={t.n}
              style={{
                display: "grid",
                gridTemplateColumns: COLS,
                alignItems: "center",
                padding: "5px 0",
                paddingLeft: 8,
                borderLeft: `4px solid ${t.status === "found" ? RED : "transparent"}`,
                borderBottom: `1px solid ${RULE}`,
                backgroundColor: t.status === "found" ? "rgba(122,31,24,0.055)" : "transparent",
              }}
            >
              <div className="pr-3" style={{ fontSize: "9px", lineHeight: "11px" }}>
                {t.status === "found" ? (
                  <span
                    className="inline-block text-[9px] font-bold uppercase tracking-[0.08em]"
                    style={{ color: RED, border: `1.2px solid ${RED}`, padding: "0px 5px", lineHeight: "11px" }}
                  >
                    Found
                  </span>
                ) : (
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.06em]"
                    style={{ color: GREEN, lineHeight: "11px" }}
                  >
                    {"✓ Clear"}
                  </span>
                )}
                <div className="mt-0.5 text-[12px] font-bold" style={{ color: INK, lineHeight: "14px" }}>
                  {t.n}. {t.tell}
                </div>
              </div>
              <div className="pr-3 text-[11px]" style={{ color: MUTED, lineHeight: "13px" }}>
                {t.check}
              </div>
              <div className="pr-3 text-[11px] font-bold" style={{ color: INK, lineHeight: "13px" }}>
                {t.threshold}
              </div>
              <SeverityCell t={t} />
            </div>
          ))}
        </div>

        {/* footer */}
        <div className="mt-auto flex items-end justify-between pt-2" style={{ borderTop: `1px solid ${RULE}` }}>
          <div className="flex items-center gap-2">
            <span
              className="text-[8px] font-bold uppercase tracking-[0.14em]"
              style={{ color: MUTED, lineHeight: "10px" }}
            >
              Skill
            </span>
            <span className="text-[12px] font-bold" style={{ color: INK, lineHeight: "14px" }}>
              gmira-slop
            </span>
          </div>
          <p
            className="text-[9.5px] font-bold uppercase tracking-[0.08em]"
            style={{ color: MUTED, lineHeight: "12px" }}
          >
            Specimen plate, not an actual finding
          </p>
          <p
            className="text-[9.5px] font-bold uppercase tracking-[0.08em]"
            style={{ color: MUTED, lineHeight: "12px" }}
          >
            Sheet 1 of 1
          </p>
        </div>
      </div>
    </div>
  );
}
