import { Archivo_Narrow, Courier_Prime } from "next/font/google";

/*
  SPECIMEN      gmira-nav
  WORLD         A press proof sheet from a job shop, marked up by a proofreader in red pencil.
  SHOWS         Detail A: a header built from the screen-line rule system. The skip link shown
                revealed with its focus ring, aria-current styling the active item exactly the
                way the skill's own sample code drives it (muted by default, full ink on the
                current page).
                Detail B: the floating blurred pill nav named in the skill's refused table,
                struck out in red like a kill on a proof, with the body copy it would float
                over shown bleeding through the blur.
  MODE          Read. The plate explains a decision, it does not sell one.
*/

const display = Archivo_Narrow({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const mono = Courier_Prime({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const NAV_ITEMS = [
  { label: "Index", current: false },
  { label: "Plates", current: true },
  { label: "Registry", current: false },
  { label: "Ledger", current: false },
];

function RegMark({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="pointer-events-none absolute h-4 w-4" style={style}>
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: "1px solid var(--rule)" }}
      />
      <div
        className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
        style={{ backgroundColor: "var(--rule)" }}
      />
      <div
        className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2"
        style={{ backgroundColor: "var(--rule)" }}
      />
    </div>
  );
}

function Stamp({
  label,
  tone,
  rotate,
}: {
  label: string;
  tone: "blue" | "red";
  rotate: number;
}) {
  const color = tone === "blue" ? "var(--blue)" : "var(--red)";
  return (
    <span
      className="shrink-0 select-none whitespace-nowrap px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.18em]"
      style={{
        color,
        border: `1.5px solid ${color}`,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {label}
    </span>
  );
}

export default function NavSpecimen() {
  return (
    <div
      className={`${display.variable} ${mono.variable} relative h-[750px] w-[1200px] overflow-hidden font-[family-name:var(--font-display)]`}
      style={
        {
          "--paper": "#efe8d6",
          "--card": "#faf8ee",
          "--ink": "#1b150e",
          "--ink-soft": "#5a5140",
          "--rule": "#3c3527",
          "--blue": "#1e4a6e",
          "--red": "#9a2a1e",
          backgroundColor: "var(--paper)",
          color: "var(--ink)",
        } as React.CSSProperties
      }
    >
      <RegMark style={{ top: 8, left: 8 }} />
      <RegMark style={{ top: 8, right: 8 }} />
      <RegMark style={{ bottom: 8, left: 8 }} />
      <RegMark style={{ bottom: 8, right: 8 }} />

      <div
        className="absolute flex flex-col"
        style={{ inset: 26, border: "1.5px solid var(--rule)" }}
      >
        <div className="flex flex-1 flex-col px-9 py-6">
          <div
            className="flex items-start justify-between pb-5"
            style={{ borderBottom: "1.5px solid var(--rule)" }}
          >
            <div>
              <p
                className="font-[family-name:var(--font-mono)] text-[11.5px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--ink-soft)" }}
              >
                Press proof / job 26.07.25
              </p>
              <h1 className="mt-2 text-[46px] font-bold leading-[0.98] tracking-[-0.02em]">
                Screen-line header
              </h1>
              <p
                className="mt-2 text-[15px]"
                style={{ color: "var(--ink-soft)" }}
              >
                One rule token, applied edge to edge. Two verdicts below.
              </p>
            </div>
            <div className="pt-1 text-right">
              <p
                className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em]"
                style={{ color: "var(--ink-soft)" }}
              >
                Skill specimen
              </p>
              <p className="mt-1 font-[family-name:var(--font-mono)] text-[17px] font-bold">
                gmira-nav
              </p>
              <p
                className="mt-1 font-[family-name:var(--font-mono)] text-[11px]"
                style={{ color: "var(--ink-soft)" }}
              >
                Plate 01
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-stretch gap-10 pt-7">
            <div className="flex flex-[1.9] flex-col">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-[family-name:var(--font-mono)] text-[13px] font-bold tracking-[0.16em]"
                    style={{ color: "var(--blue)" }}
                  >
                    DETAIL A
                  </span>
                  <h2 className="text-[21px] font-semibold tracking-[-0.01em]">
                    Skip link, current state, focus ring
                  </h2>
                </div>
                <Stamp label="Approved" tone="blue" rotate={-3} />
              </div>

              <div
                className="relative flex flex-1 flex-col justify-center px-8"
                style={{
                  border: "1.5px solid var(--rule)",
                  backgroundColor: "var(--card)",
                }}
              >
                <div className="flex items-center gap-3">
                  <a
                    href="#main"
                    className="inline-flex items-center px-3 py-[7px] text-[14px] font-bold"
                    style={{
                      backgroundColor: "var(--ink)",
                      color: "var(--card)",
                      outline: "2px solid var(--blue)",
                      outlineOffset: "3px",
                    }}
                  >
                    Skip to content
                  </a>
                  <span
                    className="h-px w-8"
                    style={{ backgroundColor: "var(--rule)" }}
                  />
                  <span
                    className="font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.1em]"
                    style={{ color: "var(--blue)" }}
                  >
                    Skip link, focus ring shown
                  </span>
                </div>

                <div className="relative mt-10">
                  <nav
                    aria-label="Primary"
                    className="flex items-center gap-8 pb-4"
                  >
                    {NAV_ITEMS.map((item) => (
                      <a
                        key={item.label}
                        href="#"
                        aria-current={item.current ? "page" : undefined}
                        className="text-[19px] font-medium tracking-[-0.01em] aria-[current=page]:font-bold aria-[current=page]:text-[var(--ink)]"
                        style={{ color: "var(--ink-soft)" }}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                  <span
                    className="pointer-events-none absolute inset-x-0 bottom-0"
                    style={{ height: 2, backgroundColor: "var(--ink)" }}
                  />
                  <span
                    className="font-[family-name:var(--font-mono)] absolute -bottom-6 right-0 text-[11.5px] uppercase tracking-[0.1em]"
                    style={{ color: "var(--blue)" }}
                  >
                    aria-current styles Plates
                  </span>
                </div>
              </div>
            </div>

            <div
              className="w-[1.5px] self-stretch"
              style={{ backgroundColor: "var(--rule)" }}
            />

            <div className="flex flex-1 flex-col">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <span
                  className="font-[family-name:var(--font-mono)] text-[13px] font-bold tracking-[0.16em]"
                  style={{ color: "var(--red)" }}
                >
                  DETAIL B
                </span>
                <Stamp label="Kill" tone="red" rotate={4} />
              </div>
              <h2 className="mb-4 text-[21px] font-semibold tracking-[-0.01em]">
                Floating pill nav
              </h2>

              <div
                className="relative flex flex-1 items-center justify-center overflow-hidden"
                style={{
                  border: "1.5px solid var(--rule)",
                  backgroundColor: "var(--card)",
                }}
              >
                <div className="absolute inset-x-10 top-9 space-y-2.5 opacity-[0.35]">
                  <div
                    className="h-[7px] w-[85%]"
                    style={{ backgroundColor: "var(--ink-soft)" }}
                  />
                  <div
                    className="h-[7px] w-[62%]"
                    style={{ backgroundColor: "var(--ink-soft)" }}
                  />
                  <div
                    className="h-[7px] w-[74%]"
                    style={{ backgroundColor: "var(--ink-soft)" }}
                  />
                </div>

                <div className="relative">
                  <div
                    className="flex items-center gap-4 rounded-full px-6 py-3 backdrop-blur-md"
                    style={{
                      border: "1px solid rgba(27,21,14,0.28)",
                      backgroundColor: "rgba(255,255,255,0.55)",
                      boxShadow: "0 10px 20px rgba(27,21,14,0.2)",
                    }}
                  >
                    <span className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                      Index
                    </span>
                    <span className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                      Plates
                    </span>
                    <span className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                      Ledger
                    </span>
                  </div>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-[230px]"
                      style={{
                        height: 5,
                        backgroundColor: "var(--red)",
                        transform: "rotate(-13deg)",
                      }}
                    />
                  </div>
                </div>
              </div>

              <p
                className="mt-3 text-[12px] leading-snug"
                style={{ color: "var(--ink-soft)" }}
              >
                <span
                  className="font-[family-name:var(--font-mono)]"
                  style={{ color: "var(--red)" }}
                >
                  fixed, rounded-full, blurred.
                </span>{" "}
                Every AI-assembled site since 2024.
              </p>
            </div>
          </div>

          <div
            className="flex items-center justify-between pt-5"
            style={{ borderTop: "1.5px solid var(--rule)" }}
          >
            <p
              className="font-[family-name:var(--font-mono)] text-[12px]"
              style={{ color: "var(--ink-soft)" }}
            >
              Chrome that any product could reuse unchanged has decided nothing.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span
                  className="h-3.5 w-3.5"
                  style={{ backgroundColor: "var(--ink)" }}
                />
                <span
                  className="h-3.5 w-3.5"
                  style={{ backgroundColor: "var(--blue)" }}
                />
                <span
                  className="h-3.5 w-3.5"
                  style={{ backgroundColor: "var(--red)" }}
                />
                <span
                  className="h-3.5 w-3.5"
                  style={{ backgroundColor: "var(--ink-soft)" }}
                />
              </div>
              <span
                className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em]"
                style={{ color: "var(--ink-soft)" }}
              >
                Sheet 1/1
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
