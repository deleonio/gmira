import type { ReactNode } from "react";
import { B612, B612_Mono } from "next/font/google";

/*
  Specimen: gmira-flow, checklist plate.

  The brief: six field states in one column, plus a step bar that names steps it
  cannot reach yet. The world is an aircraft quick reference handbook: challenge
  and response rows, dotted leaders between steps, numbered checklist items instead
  of a mood board. Every value shown (name, email, phone, VAT id, card, IBAN) is
  illustrative placeholder data, not a real account. All six states are baked as
  fixed styles so the plate reads correctly as a still image, not only on hover.
*/

const sans = B612({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--ff-sans",
});

const mono = B612_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--ff-mono",
});

const BG = "#10131A";
const PANEL_LINE = "#242931";
const FRAME_LINE = "#262B33";
const INK = "#ECEAE1";
const MUTED = "#B7BCC0";
const DIM = "#82898F";
const AMBER = "#F2A20C";
const GREEN = "#4DA167";
const RED = "#D8452F";

const FMONO = "font-[family-name:var(--ff-mono)]";

type StepState = "done" | "now" | "ahead";

interface StepItem {
  name: string;
  state: StepState;
  cond?: string;
}

const STEPS: StepItem[] = [
  { name: "DETAILS", state: "done" },
  { name: "DELIVERY", state: "now" },
  { name: "PAYMENT", state: "ahead" },
  { name: "IDENTITY CHECK", state: "ahead", cond: "IF INVOICE" },
  { name: "CONFIRM", state: "ahead" },
];

type FieldTag = "DEFAULT" | "HOVER" | "FOCUS" | "DISABLED" | "ERROR" | "LOADING";

interface FieldRow {
  n: string;
  tag: FieldTag;
  accent: string;
  fieldLabel: string;
  value: string;
  caption: string;
}

const ROWS: FieldRow[] = [
  {
    n: "01",
    tag: "DEFAULT",
    accent: "#8A9096",
    fieldLabel: "GIVEN NAME",
    value: "Mara Lindqvist",
    caption: "Label sits above the field. Never a placeholder.",
  },
  {
    n: "02",
    tag: "HOVER",
    accent: "#C7CBCE",
    fieldLabel: "EMAIL",
    value: "mara@example.com",
    caption: "Border and fill change. The layout never moves.",
  },
  {
    n: "03",
    tag: "FOCUS",
    accent: AMBER,
    fieldLabel: "PHONE",
    value: "+49 30 5550142",
    caption: "Focus ring holds 3:1 against the field and the page.",
  },
  {
    n: "04",
    tag: "DISABLED",
    accent: DIM,
    fieldLabel: "VAT ID",
    value: "",
    caption: "Not applicable. Private purchase was selected above.",
  },
  {
    n: "05",
    tag: "ERROR",
    accent: RED,
    fieldLabel: "CARD EXPIRY",
    value: "03/24",
    caption: "This card expired 03/2024. Use another card, or update the expiry above.",
  },
  {
    n: "06",
    tag: "LOADING",
    accent: "#C7CBCE",
    fieldLabel: "IBAN",
    value: "DE89 3704 0044 0532 0130 00",
    caption: "Field stays editable. Submit waits, with a reason.",
  },
];

function StepNode({ step, index }: { step: StepItem; index: number }) {
  const isDone = step.state === "done";
  const isNow = step.state === "now";
  const ringColor = isDone ? GREEN : isNow ? AMBER : "#3A4048";
  const fill = isDone ? GREEN : "transparent";
  const numColor = isDone ? "#10131A" : isNow ? AMBER : DIM;
  const nameColor = isDone || isNow ? INK : "#8A9096";

  const marker = (
    <span
      className={`flex h-[26px] w-[26px] items-center justify-center border-2 ${FMONO} text-[12px] font-bold`}
      style={{ borderRadius: 2, borderColor: ringColor, background: fill, color: numColor }}
    >
      {index}
    </span>
  );

  const name = (
    <span
      className={`mt-2 block text-center text-[12.5px] font-bold leading-tight ${isDone ? "underline underline-offset-4" : ""}`}
      style={{ color: nameColor, textDecorationColor: isDone ? GREEN : undefined }}
    >
      {step.name}
    </span>
  );

  const sub = step.cond ? (
    <span className={`mt-0.5 block text-center ${FMONO} text-[9px]`} style={{ color: DIM }}>
      ({step.cond})
    </span>
  ) : isNow ? (
    <span className={`mt-1 block text-center ${FMONO} text-[9px] font-bold tracking-[0.14em]`} style={{ color: AMBER }}>
      NOW
    </span>
  ) : null;

  if (isDone) {
    return (
      <a href="#" className="flex flex-col items-center" style={{ width: 128 }}>
        {marker}
        {name}
        {sub}
      </a>
    );
  }

  return (
    <div className="flex flex-col items-center" style={{ width: 128 }} aria-current={isNow ? "step" : undefined}>
      {marker}
      {name}
      {sub}
    </div>
  );
}

function FieldRowView({ row }: { row: FieldRow }) {
  const id = `field-${row.n}`;
  const noteId = `${id}-note`;
  const base = `h-[36px] w-full border px-3 ${FMONO} text-[13.5px] outline-none`;

  let input: ReactNode;

  if (row.tag === "DISABLED") {
    input = (
      <input
        id={id}
        disabled
        value={row.value}
        aria-describedby={noteId}
        className={base}
        style={{
          borderRadius: 2,
          borderColor: "#2A2F36",
          background: "#171B21",
          color: DIM,
          cursor: "not-allowed",
        }}
      />
    );
  } else if (row.tag === "ERROR") {
    input = (
      <div className="relative">
        <input
          id={id}
          readOnly
          value={row.value}
          aria-invalid="true"
          aria-describedby={noteId}
          className={base}
          style={{
            borderRadius: 2,
            borderWidth: 1.5,
            borderColor: RED,
            background: "rgba(216,69,47,0.08)",
            color: INK,
            paddingRight: 32,
          }}
        />
        <svg width="14" height="14" viewBox="0 0 16 16" className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true">
          <path d="M8 1.5 L15 14.5 L1 14.5 Z" fill="none" stroke={RED} strokeWidth="1.4" strokeLinejoin="round" />
          <rect x="7.3" y="6" width="1.4" height="4.2" fill={RED} />
          <rect x="7.3" y="11" width="1.4" height="1.4" fill={RED} />
        </svg>
      </div>
    );
  } else if (row.tag === "LOADING") {
    input = (
      <div className="relative">
        <input
          id={id}
          readOnly
          value={row.value}
          aria-describedby={noteId}
          className={base}
          style={{
            borderRadius: 2,
            borderColor: "#3A4048",
            background: "transparent",
            color: INK,
            paddingRight: 30,
          }}
        />
        <span
          aria-hidden="true"
          className="absolute right-3 top-1/2 h-[13px] w-[13px] -translate-y-1/2 animate-spin rounded-full border-2"
          style={{ borderColor: "#4A515A", borderTopColor: AMBER }}
        />
      </div>
    );
  } else if (row.tag === "FOCUS") {
    input = (
      <input
        id={id}
        readOnly
        value={row.value}
        className={base}
        style={{
          borderRadius: 2,
          borderWidth: 1.5,
          borderColor: AMBER,
          background: "transparent",
          color: INK,
          boxShadow: "0 0 0 3px rgba(236,234,225,0.22)",
        }}
      />
    );
  } else if (row.tag === "HOVER") {
    input = (
      <input
        id={id}
        readOnly
        value={row.value}
        className={base}
        style={{
          borderRadius: 2,
          borderColor: "#9AA0A6",
          background: "rgba(255,255,255,0.035)",
          color: INK,
        }}
      />
    );
  } else {
    input = (
      <input
        id={id}
        readOnly
        value={row.value}
        className={base}
        style={{ borderRadius: 2, borderColor: "#3A4048", background: "transparent", color: INK }}
      />
    );
  }

  return (
    <div className="flex items-center gap-7">
      <div className="w-[58px] shrink-0">
        <p className={`${FMONO} text-[22px] font-bold leading-none`} style={{ color: row.accent }}>
          {row.n}
        </p>
        <p className={`mt-1 ${FMONO} text-[9px] tracking-[0.12em]`} style={{ color: DIM }}>
          {row.tag}
        </p>
      </div>
      <div className="w-[252px] shrink-0">
        <label htmlFor={id} className={`block ${FMONO} text-[9.5px] tracking-[0.12em]`} style={{ color: DIM }}>
          {row.fieldLabel}
        </label>
        <div className="mt-1.5">{input}</div>
      </div>
      <p
        id={noteId}
        role={row.tag === "ERROR" ? "alert" : undefined}
        className="flex-1 text-[14px] leading-snug"
        style={{ color: row.tag === "ERROR" ? INK : MUTED, fontWeight: row.tag === "ERROR" ? 700 : 400 }}
      >
        {row.caption}
      </p>
    </div>
  );
}

export default function FlowSpecimen() {
  return (
    <div
      className={`${sans.variable} ${mono.variable} relative h-[750px] w-[1200px] overflow-hidden`}
      style={{ background: BG, color: INK, fontFamily: "var(--ff-sans)" }}
    >
      <div className="pointer-events-none absolute inset-[16px] border" style={{ borderColor: FRAME_LINE }} />

      <div className="relative flex h-full flex-col px-[50px] pb-[22px] pt-[28px]">
        <header className="flex items-start justify-between gap-10">
          <div className="min-w-0">
            <p className={`${FMONO} text-[10.5px] tracking-[0.22em]`} style={{ color: DIM }}>
              GMIRA SKILL LIBRARY, SPECIMEN PLATE
            </p>
            <h1 className="mt-2 text-[36px] font-bold leading-[1.05] tracking-[-0.01em]" style={{ color: INK }}>
              Six field states. An honest step bar.
            </h1>
            <p className={`mt-2 ${FMONO} text-[12px]`} style={{ color: MUTED }}>
              gmira-flow: multi-step surfaces, read at zero effect budget.
            </p>
          </div>
          <div className="shrink-0 border px-4 py-2.5 text-right" style={{ borderColor: FRAME_LINE, borderRadius: 2 }}>
            <p className={`${FMONO} text-[13px] font-bold`} style={{ color: INK }}>
              gmira-flow
            </p>
            <p className={`mt-0.5 ${FMONO} text-[9.5px] tracking-[0.16em]`} style={{ color: DIM }}>
              SPEC 04
            </p>
          </div>
        </header>

        <section className="mt-6">
          <p className={`${FMONO} text-[10px] tracking-[0.22em]`} style={{ color: AMBER }}>
            PROGRESS, HONEST ABOUT LENGTH
          </p>
          <div className="mt-3 flex items-start">
            {STEPS.flatMap((step, i) => {
              const node = <StepNode key={step.name} step={step} index={i + 1} />;
              const connector =
                i < STEPS.length - 1 ? (
                  <div
                    key={`${step.name}-c`}
                    className="mt-[13px] h-0 flex-1 border-t-2"
                    style={{ borderColor: "#333A42", borderStyle: "dotted" }}
                  />
                ) : null;
              return connector ? [node, connector] : [node];
            })}
          </div>
          <p className={`mt-2.5 ${FMONO} text-[11px]`} style={{ color: DIM }}>
            Named from the start. Not a link yet.
          </p>
        </section>

        <div className="mt-6 grid flex-1 grid-rows-6 divide-y divide-[#242931] border-y border-[#242931]">
          {ROWS.map((row) => (
            <FieldRowView key={row.n} row={row} />
          ))}
        </div>

        <footer className="mt-4 flex items-center justify-between">
          <p className={`${FMONO} text-[10px]`} style={{ color: DIM }}>
            DOCTRINE 2.1: EFFECT BUDGET NEAR ZERO. DOCTRINE 3.6: ALL SIX STATES.
          </p>
          <p className={`${FMONO} text-[10px]`} style={{ color: DIM }}>
            ILLUSTRATIVE FORM DATA, NOT A REAL ACCOUNT.
          </p>
        </footer>
      </div>
    </div>
  );
}
