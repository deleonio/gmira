import type { ReactNode } from "react";
import { IBM_Plex_Mono, Special_Elite } from "next/font/google";

/*
  Specimen plate for the gmira-direction skill.

  The skill's own deliverable is a written five block contract, so this plate stages
  it as a single sheet of paper pulled from a form book: pre printed field labels and
  rules in one ink, typed answers in a second ink, and a rubber chop in a third ink
  for the verdict. Red chops reject, the green chop commits. No colour plays a second
  role anywhere on the page, the same discipline the skill itself asks for.

  Brief, brand and every figure below are fictional, written only to give the
  contract something concrete to hold. Harrow and Vane does not exist.
*/

const display = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--dc-display",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--dc-mono",
});

const PAPER = "#f0e9d8";
const INK = "#1e1b15";
const INK_MUTED = "#4a4638";
const LABEL = "#3e4a63";
const RED = "#a02b1f";
const GREEN = "#1f6b3f";
const RULE = "rgba(30,27,21,0.24)";

const DISPLAY = "font-[family-name:var(--dc-display)]";
const MONO = "font-[family-name:var(--dc-mono)]";

const CONTRACT_COMMENT = `<!-- DIRECTION CONTRACT, specimen plate, fictional brief: Harrow and Vane
THESIS: a watch is not proven by a photograph. It is proven by a measurement.
OWN-WORLD: a chronometer rate certificate. Five position tests, deviation logged in seconds per day, plotted as one isolation line. TELL: every card states the real measured drift, never a rounded grade.
STORY: opens on one blank certificate. Scrolling fills each position. The case appears last, after the movement earns it.
FIRST VIEWPORT: one rate card, four blank position boxes, a wound crown, no product photograph.
FORM: one certificate per movement, never a carousel. One rule weight throughout, 0.5px.
THE RUT (excluded): a wrist in linen light, a gold wordmark, a 360 degree spinner, a grandfather mentioned by paragraph two.
THE COUNTER (excluded): all mono, black on white, calibre numbers blown to 200 point, a spec table with no photograph anywhere.
-->`;

function Eyebrow({
  children,
  color = LABEL,
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <p
      className={`${MONO} text-[10.5px] font-semibold uppercase tracking-[0.18em]`}
      style={{ color }}
    >
      {children}
    </p>
  );
}

function RegMark({ className }: { className: string }) {
  return (
    <div className={`pointer-events-none absolute h-[10px] w-[10px] opacity-40 ${className}`}>
      <div
        className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
        style={{ backgroundColor: INK }}
      />
      <div
        className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2"
        style={{ backgroundColor: INK }}
      />
    </div>
  );
}

function Stamp({
  text,
  color,
  rotate,
  className,
  size = "md",
}: {
  text: string;
  color: string;
  rotate: number;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <div
      aria-hidden
      className={`${MONO} pointer-events-none absolute select-none whitespace-nowrap font-bold uppercase ${
        size === "lg"
          ? "px-6 py-2.5 text-[25px] tracking-[0.13em]"
          : "px-3.5 py-1.5 text-[17px] tracking-[0.11em]"
      } ${className ?? ""}`}
      style={{
        color,
        border: `3px solid ${color}`,
        outline: `1.5px solid ${color}`,
        outlineOffset: "-6px",
        borderRadius: size === "lg" ? 14 : 5,
        transform: `rotate(${rotate}deg)`,
        background: "transparent",
      }}
    >
      {text}
    </div>
  );
}

function MetaRow({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div
      className={`grid grid-cols-[58px_1fr] gap-2 px-3 py-[5px] ${last ? "" : "border-b"}`}
      style={{ borderColor: RULE }}
    >
      <span
        className={`${MONO} text-[9.5px] font-semibold uppercase tracking-[0.08em]`}
        style={{ color: LABEL }}
      >
        {k}
      </span>
      <span className={`${MONO} text-[11.5px]`} style={{ color: INK }}>
        {v}
      </span>
    </div>
  );
}

function ContractRow({
  index,
  label,
  tell,
  children,
  first,
}: {
  index: string;
  label: string;
  tell?: string;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <li
      className={`grid grid-cols-[100px_1fr] gap-5 py-3 ${first ? "" : "border-t"}`}
      style={{ borderColor: RULE }}
    >
      <div
        className={`${MONO} pt-[3px] text-[12.5px] font-semibold uppercase leading-[1.15] tracking-[0.05em]`}
        style={{ color: LABEL }}
      >
        <span className="block text-[9.5px] font-normal opacity-70">{index}</span>
        {label}
      </div>
      <div>
        <p className={`${DISPLAY} text-[19px] leading-[1.3]`} style={{ color: INK }}>
          {children}
        </p>
        {tell ? (
          <p className={`${MONO} mt-1 text-[11px] leading-snug`} style={{ color: INK_MUTED }}>
            <span className="font-semibold" style={{ color: LABEL }}>
              TELL:
            </span>{" "}
            {tell}
          </p>
        ) : null}
      </div>
    </li>
  );
}

function RejectedCard({
  exhibit,
  title,
  rotate,
  children,
}: {
  exhibit: string;
  title: string;
  rotate: number;
  children: ReactNode;
}) {
  return (
    <div className="relative border p-3.5" style={{ borderColor: "rgba(30,27,21,0.32)" }}>
      <Eyebrow>{exhibit}</Eyebrow>
      <h3 className={`${DISPLAY} mt-1 text-[19px] leading-none`} style={{ color: INK }}>
        {title}
      </h3>
      <p className={`${DISPLAY} mt-2 text-[14px] leading-[1.38]`} style={{ color: INK_MUTED }}>
        {children}
      </p>
      <Stamp text="Excluded" color={RED} rotate={rotate} className="-right-3 -top-3" />
    </div>
  );
}

export default function DirectionSpecimen() {
  return (
    <div
      className={`${display.variable} ${mono.variable} ${DISPLAY} relative h-[750px] w-[1200px] overflow-hidden`}
      style={{
        backgroundColor: PAPER,
        color: INK,
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(30,27,21,0.06) 1px, transparent 0)",
        backgroundSize: "3px 3px",
      }}
    >
      <div
        aria-hidden
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: CONTRACT_COMMENT }}
      />

      <RegMark className="left-[10px] top-[10px]" />
      <RegMark className="right-[10px] top-[10px]" />
      <RegMark className="bottom-[10px] left-[10px]" />
      <RegMark className="bottom-[10px] right-[10px]" />

      <div
        className="absolute inset-[18px] flex flex-col px-9 py-7"
        style={{ border: `1.5px solid ${INK}` }}
      >
        <header className="flex items-start justify-between gap-8 border-b-2 pb-4" style={{ borderColor: INK }}>
          <div className="max-w-[560px]">
            <Eyebrow>Gmira / direction skill</Eyebrow>
            <h1 className={`${DISPLAY} mt-1 text-[38px] leading-[1.03]`} style={{ color: INK }}>
              Direction Contract
            </h1>
            <p className={`${MONO} mt-1.5 text-[12px] leading-snug`} style={{ color: INK_MUTED }}>
              Specimen brief: Harrow &amp; Vane, mechanical field watches (fictional client).
            </p>
          </div>
          <div className="w-[224px] shrink-0 border" style={{ borderColor: "rgba(30,27,21,0.4)" }}>
            <MetaRow k="Form" v="GD-01" />
            <MetaRow k="Brief" v="HARROW & VANE" />
            <MetaRow k="Status" v="COMMITTED" />
            <MetaRow k="Date" v="25 JUL 2026" last />
          </div>
        </header>

        <div className="mt-6 flex flex-1 items-stretch gap-8">
          <aside className="flex w-[336px] shrink-0 flex-col">
            <Eyebrow color={RED}>Rejected, two exhibits</Eyebrow>
            <div className="mt-2.5 flex flex-col gap-4">
              <RejectedCard exhibit="Exhibit A" title="The rut" rotate={-6}>
                Wrist in linen light, gold wordmark, a spinning 360 degree view, a
                grandfather mentioned by paragraph two.
              </RejectedCard>
              <RejectedCard exhibit="Exhibit B" title="The counter" rotate={4}>
                All mono, black on white, calibre numbers blown past 200 point, a
                spec table with no photograph anywhere.
              </RejectedCard>
            </div>
            <p className={`${DISPLAY} mt-3 text-[14px]`} style={{ color: INK }}>
              <span style={{ color: RED }}>&#9632;</span> Both excluded.
            </p>
            <div
              className="mt-4 flex-1"
              style={{
                border: "1px dashed rgba(30,27,21,0.32)",
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgba(30,27,21,0.07) 0px, rgba(30,27,21,0.07) 1.5px, transparent 1.5px, transparent 9px)",
              }}
            />
          </aside>

          <div className="w-px self-stretch" style={{ backgroundColor: "rgba(30,27,21,0.3)" }} />

          <section className="relative flex-1">
            <Eyebrow color={GREEN}>Committed direction, five blocks</Eyebrow>
            <ol className="mt-1.5">
              <ContractRow index="01" label="Thesis" first>
                A watch is not proven by a photograph. It is proven by a measurement.
              </ContractRow>
              <ContractRow
                index="02"
                label="Own-world"
                tell="every card states the real measured drift, never a rounded grade."
              >
                A chronometer rate certificate. Five position tests, deviation logged
                in seconds per day.
              </ContractRow>
              <ContractRow index="03" label="Story">
                Opens on one blank certificate. Scrolling fills each position. The
                case appears last, after the movement earns it.
              </ContractRow>
              <ContractRow index="04" label="First viewport">
                One rate card. Four blank position boxes. A wound crown. No product
                photograph.
              </ContractRow>
              <ContractRow index="05" label="Form">
                One certificate per movement, never a carousel. One rule weight
                throughout, 0.5px.
              </ContractRow>
            </ol>
            <Stamp text="Committed" color={GREEN} rotate={-8} size="lg" className="-bottom-5 -right-3" />
          </section>
        </div>

        <footer className="mt-5 flex items-center gap-3 border-t pt-3" style={{ borderColor: RULE }}>
          <span
            className={`${MONO} border px-1.5 py-[3px] text-[11px]`}
            style={{ borderColor: "rgba(30,27,21,0.4)", color: INK }}
          >
            gmira-direction
          </span>
          <p className={`${MONO} text-[11px]`} style={{ color: INK_MUTED }}>
            Specimen plate. Brief, brand and figures are fictional, written to demonstrate the contract.
          </p>
        </footer>
      </div>
    </div>
  );
}
