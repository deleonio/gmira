import { Oswald, Share_Tech_Mono } from "next/font/google";

/*
  SPECIMEN      gmira-canvas
  WORLD         A riveted machine control panel, not a software dashboard: gunmetal
                housing, brushed metal, amber needles, phosphor green lamps, mono
                readouts for every measured value. No rounded cards, no blue accent,
                no floating drop shadows.
  SHOWS         The five checks named in the gmira-canvas skill floor, read as three
                dial instruments and two indicator lamps instead of a paragraph.
  NUMBERS       8.0ms effect ceiling inside a 16.7ms frame, 1.5x pixel ratio cap,
                mediump shader precision on mobile, context loss listener present,
                destroy() called. Every value on this plate comes from the skill's
                own floor table (SKILL.md, DOCTRINE.md Part 4), nothing invented.
*/

const fontPanel = Oswald({
  variable: "--font-panel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontGauge = Share_Tech_Mono({
  variable: "--font-gauge",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const BG0 = "#1c1f19";
const PANEL_TOP = "#23261f";
const PANEL_BOTTOM = "#1a1d17";
const BONE = "#f1ecdf";
const MUTED = "#c3bfae";
const AMBER = "#ffb347";
const GREEN = "#6ee7a0";
const RED = "#e2543c";

// Text colour pairs, checked as WCAG relative luminance contrast against the two
// surfaces this plate ever puts text on: bg0 (darkest) and the instrument housing
// gradient (lightest, capped at #34372c). Every pairing clears the 4.5:1 floor.
// bone  on bg0 about 13.8:1, on housing about 10.3:1
// amber on bg0 about 9.1:1,  on housing about 6.8:1
// green on bg0 about 10.5:1, on housing about 7.9:1
// muted on bg0 about 8.8:1,  on housing about 6.6:1
// red is never used as text fill, only as a stroke on the overrun arc and tick.

const HOUSING: React.CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 45%), linear-gradient(180deg, #2b2e26 0%, #1e2119 100%)",
  border: "1px solid rgba(241,236,223,0.09)",
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p0 = polar(cx, cy, r, a0);
  const p1 = polar(cx, cy, r, a1);
  const large = a0 - a1 > 180 ? 1 : 0;
  return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
}

function angleFor(value: number, min: number, max: number) {
  const f = Math.min(1, Math.max(0, (value - min) / (max - min)));
  return 180 - 180 * f;
}

type Zone = { from: number; to: number; color: string };
type Tick = { value: number; label: string; variant?: "cap" | "danger" };

function Dial({
  min,
  max,
  needle,
  zones,
  ticks,
  unit,
  readout,
  subreadout,
  label,
  caption,
}: {
  min: number;
  max: number;
  needle: number;
  zones: Zone[];
  ticks: Tick[];
  unit: string;
  readout: string;
  subreadout: string;
  label: string;
  caption: string;
}) {
  const cx = 120;
  const cy = 126;
  const r = 94;
  const needleAngle = angleFor(needle, min, max);
  const tip = polar(cx, cy, r * 0.76, needleAngle);
  const tail = polar(cx, cy, r * 0.18, needleAngle + 180);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 240 148" className="h-auto w-[208px] overflow-visible" aria-hidden="true">
        <path d={arcPath(cx, cy, r, 180, 0)} fill="none" stroke="rgba(241,236,223,0.08)" strokeWidth={15} />
        {zones.map((z) => (
          <path
            key={`${z.from}-${z.to}`}
            d={arcPath(cx, cy, r, angleFor(z.from, min, max), angleFor(z.to, min, max))}
            fill="none"
            stroke={z.color}
            strokeWidth={9}
          />
        ))}
        {ticks.map((t) => {
          const a = angleFor(t.value, min, max);
          const strong = t.variant === "danger" || t.variant === "cap";
          const p0 = polar(cx, cy, r + 8, a);
          const p1 = polar(cx, cy, r + (strong ? 19 : 15), a);
          const lp = polar(cx, cy, r - 21, a);
          const tickColor = t.variant === "danger" ? RED : t.variant === "cap" ? AMBER : "rgba(241,236,223,0.5)";
          const labelColor = t.variant === "danger" ? BONE : t.variant === "cap" ? AMBER : MUTED;
          return (
            <g key={t.value}>
              <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={tickColor} strokeWidth={strong ? 2.5 : 1.5} />
              <text
                x={lp.x}
                y={lp.y}
                fill={labelColor}
                fontFamily="var(--font-gauge)"
                fontSize={11}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {t.label}
              </text>
            </g>
          );
        })}
        <line x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y} stroke={BONE} strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={6.5} fill={BONE} stroke={BG0} strokeWidth={2} />
      </svg>

      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="leading-none" style={{ fontFamily: "var(--font-gauge)", color: AMBER, fontSize: 44 }}>
          {readout}
        </span>
        <span style={{ fontFamily: "var(--font-gauge)", color: BONE, fontSize: 17 }}>{unit}</span>
      </div>
      <div
        className="mt-1 uppercase"
        style={{ fontFamily: "var(--font-gauge)", color: MUTED, fontSize: 11, letterSpacing: "0.06em" }}
      >
        {subreadout}
      </div>
      <div
        className="mt-2.5 uppercase"
        style={{ fontFamily: "var(--font-panel)", color: BONE, fontSize: 16, fontWeight: 600, letterSpacing: "0.09em" }}
      >
        {label}
      </div>
      <div className="mt-1 text-center" style={{ fontFamily: "var(--font-panel)", color: MUTED, fontSize: 12.5 }}>
        {caption}
      </div>
    </div>
  );
}

function SelectorBar({ text, active }: { text: string; active: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-[9px] flex-1 rounded-[2px]"
        style={{
          background: active ? AMBER : "rgba(241,236,223,0.06)",
          border: active ? "none" : "1px solid rgba(241,236,223,0.22)",
        }}
      />
      <span
        className="w-[70px] shrink-0"
        style={{ fontFamily: "var(--font-gauge)", fontSize: 11, color: active ? BONE : MUTED, letterSpacing: "0.03em" }}
      >
        {text}
      </span>
    </div>
  );
}

function Lamp({ label, status, caption }: { label: string; status: string; caption: string }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="relative flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full"
        style={{
          background: "radial-gradient(circle at 38% 34%, #1f2e22, #12160f 72%)",
          border: "1px solid rgba(241,236,223,0.14)",
        }}
      >
        <div
          className="h-[19px] w-[19px] rounded-full"
          style={{ background: GREEN, boxShadow: `0 0 14px 3px ${GREEN}99, inset 0 0 3px 1px #eafff1` }}
        />
      </div>
      <div>
        <div
          className="uppercase"
          style={{ fontFamily: "var(--font-panel)", color: BONE, fontSize: 14.5, fontWeight: 600, letterSpacing: "0.07em" }}
        >
          {label}
        </div>
        <div className="mt-0.5 leading-none" style={{ fontFamily: "var(--font-gauge)", color: GREEN, fontSize: 27 }}>
          {status}
        </div>
        <div className="mt-1" style={{ fontFamily: "var(--font-panel)", color: MUTED, fontSize: 12 }}>
          {caption}
        </div>
      </div>
    </div>
  );
}

function Rivet({ style }: { style: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className="absolute h-[8px] w-[8px] rounded-full"
      style={{
        background: "radial-gradient(circle at 34% 30%, #6b6a58, #0e0d09 70%)",
        boxShadow: "0 1px 1px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.5)",
        ...style,
      }}
    />
  );
}

export default function Page() {
  return (
    <div
      className={`${fontPanel.variable} ${fontGauge.variable} relative h-[750px] w-[1200px] overflow-hidden`}
      style={{
        fontFamily: "var(--font-panel)",
        background:
          "radial-gradient(1100px 480px at 50% -10%, rgba(255,255,255,0.05), transparent 60%), repeating-linear-gradient(115deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 3px), linear-gradient(165deg, #22261e 0%, #1c1f19 50%, #15170f 100%)",
      }}
    >
      <Rivet style={{ top: 14, left: 14 }} />
      <Rivet style={{ top: 14, right: 14 }} />
      <Rivet style={{ bottom: 14, left: 14 }} />
      <Rivet style={{ bottom: 14, right: 14 }} />

      <div
        className="absolute inset-[18px] overflow-hidden rounded-[10px]"
        style={{
          background: `radial-gradient(900px 400px at 50% 0%, rgba(255,255,255,0.03), transparent 65%), linear-gradient(180deg, ${PANEL_TOP} 0%, ${PANEL_BOTTOM} 100%)`,
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.04), inset 0 -3px 12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex h-full w-full flex-col justify-between px-8 py-7">
          <div
            className="flex shrink-0 items-start justify-between border-b pb-4"
            style={{ borderColor: "rgba(241,236,223,0.14)" }}
          >
            <div className="flex items-center gap-5">
              <div
                className="flex flex-col gap-1 rounded-[3px] px-3 py-2"
                style={{ border: "1px solid rgba(241,236,223,0.16)" }}
              >
                <span
                  className="uppercase"
                  style={{ fontFamily: "var(--font-gauge)", color: MUTED, fontSize: 11, letterSpacing: "0.08em" }}
                >
                  Skill plate
                </span>
                <span style={{ fontFamily: "var(--font-gauge)", color: BONE, fontSize: 13 }}>gmira-canvas</span>
              </div>
              <div>
                <h1
                  className="uppercase leading-none"
                  style={{ color: BONE, fontSize: 52, fontWeight: 700, letterSpacing: "-0.01em" }}
                >
                  GPU Floor
                </h1>
                <p className="mt-2 uppercase" style={{ color: MUTED, fontSize: 13, letterSpacing: "0.18em" }}>
                  Render loop instrument panel
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 pt-1">
              <span
                className="uppercase"
                style={{ fontFamily: "var(--font-gauge)", color: MUTED, fontSize: 11, letterSpacing: "0.08em" }}
              >
                Floor check
              </span>
              <span className="flex items-center gap-2">
                <span
                  className="h-[7px] w-[7px] rounded-full"
                  style={{ background: GREEN, boxShadow: `0 0 8px 2px ${GREEN}88` }}
                />
                <span style={{ fontFamily: "var(--font-gauge)", color: GREEN, fontSize: 14 }}>Nominal</span>
              </span>
            </div>
          </div>

          <div className="flex h-[372px] shrink-0 items-stretch justify-between gap-6">
            <div className="flex flex-1 flex-col items-center justify-center rounded-[8px]" style={HOUSING}>
              <Dial
                min={0}
                max={20}
                needle={8}
                zones={[
                  { from: 0, to: 8, color: AMBER },
                  { from: 8, to: 16.7, color: "rgba(241,236,223,0.16)" },
                  { from: 16.7, to: 20, color: RED },
                ]}
                ticks={[
                  { value: 0, label: "0" },
                  { value: 5, label: "5" },
                  { value: 10, label: "10" },
                  { value: 16.7, label: "16.7", variant: "danger" },
                  { value: 20, label: "20" },
                ]}
                unit="ms"
                readout="8.0"
                subreadout="of 16.7 ms frame"
                label="Frame budget"
                caption="effect layer ceiling, 60fps target"
              />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center rounded-[8px]" style={HOUSING}>
              <Dial
                min={1}
                max={3}
                needle={1.5}
                zones={[
                  { from: 1, to: 1.5, color: AMBER },
                  { from: 1.5, to: 3, color: "rgba(241,236,223,0.12)" },
                ]}
                ticks={[
                  { value: 1, label: "1" },
                  { value: 1.5, label: "1.5", variant: "cap" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                ]}
                unit="x"
                readout="1.5"
                subreadout="hard cap, never raw dpr"
                label="Pixel ratio"
                caption="device pixel ratio, clamped"
              />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center rounded-[8px] px-6" style={HOUSING}>
              <div
                className="w-full rounded-[6px] px-4 py-5"
                style={{ background: "rgba(0,0,0,0.18)", border: "1px solid rgba(241,236,223,0.1)" }}
              >
                <div className="flex flex-col gap-3.5">
                  <SelectorBar text="LOWP" active={false} />
                  <SelectorBar text="MEDIUMP" active={true} />
                  <SelectorBar text="HIGHP" active={false} />
                </div>
              </div>
              <div className="mt-4 leading-none" style={{ fontFamily: "var(--font-gauge)", color: AMBER, fontSize: 30 }}>
                MEDIUMP
              </div>
              <div
                className="mt-2 uppercase"
                style={{ fontFamily: "var(--font-panel)", color: BONE, fontSize: 16, fontWeight: 600, letterSpacing: "0.09em" }}
              >
                GPU precision
              </div>
              <div className="mt-1 text-center" style={{ fontFamily: "var(--font-panel)", color: MUTED, fontSize: 12.5 }}>
                mobile, declared not defaulted
              </div>
              <div
                className="mt-0.5 text-center uppercase"
                style={{ fontFamily: "var(--font-gauge)", color: MUTED, fontSize: 11, letterSpacing: "0.04em" }}
              >
                desktop runs highp
              </div>
            </div>
          </div>

          <div className="flex h-[128px] shrink-0 items-stretch justify-between gap-6">
            <div className="flex flex-1 items-center rounded-[8px] px-7" style={HOUSING}>
              <Lamp label="Context loss listener" status="Present" caption="preventDefault, restore path armed" />
            </div>
            <div className="flex flex-1 items-center rounded-[8px] px-7" style={HOUSING}>
              <Lamp label="Destroy()" status="Called" caption="rAF cancelled, GPU handles freed" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
