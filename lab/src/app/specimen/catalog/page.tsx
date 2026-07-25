import type { ReactNode } from "react";
import { JetBrains_Mono, Caveat } from "next/font/google";

/*
  Specimen: gmira-catalog, the anti card grid skill.

  Concept: a continuous feed inventory printout. One export, four renders.
  Panel 1 is the raw default: identical tags, no system applied, which is
  exactly the doctrine's complaint. Panels 2 to 4 each apply one real
  structure to the same six rows. A red pen mark is the only human trace
  on the page, flagging the one panel nobody actually decided on.
*/

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const hand = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

type Specimen = {
  code: string;
  name: string;
  mass: number;
  site: string;
  year: number;
};

type Tier = "lead" | "high" | "normal" | "tail";

// Ordered by mass, descending. Doubles as accession order for this plate,
// so one array feeds the table, the density blocks and the editorial list.
const SPECIMENS: Specimen[] = [
  { code: "014", name: "Quartz", mass: 340, site: "Site 12", year: 2019 },
  { code: "027", name: "Galena", mass: 210, site: "Site 6", year: 2020 },
  { code: "038", name: "Azurite", mass: 120, site: "Site 9", year: 2018 },
  { code: "041", name: "Pyrite", mass: 65, site: "Site 4", year: 2021 },
  { code: "056", name: "Garnet", mass: 48, site: "Site 12", year: 2022 },
  { code: "063", name: "Beryl", mass: 30, site: "Site 2", year: 2023 },
];

const TOTAL_MASS = SPECIMENS.reduce((sum, s) => sum + s.mass, 0);

function tierOf(mass: number): Tier {
  if (mass >= 300) return "lead";
  if (mass >= 150) return "high";
  if (mass >= 80) return "normal";
  return "tail";
}

const PAPER = "#EEF0E6";
const BAR = "#CFE4CC";
const BAR_LINE = "#7FA07A";
const INK = "#14160F";
const INK_MUTED = "#4E5548";
const PEN_RED = "#A5271C";
const HIGHLIGHT = "#F2E58C";

export default function CatalogSpecimenPage() {
  return (
    <div
      className={`${mono.className} w-[1200px] h-[750px] overflow-hidden relative flex flex-col`}
      style={{ backgroundColor: PAPER, color: INK }}
    >
      <div
        aria-hidden
        className="absolute inset-y-0 left-3 w-0 border-l border-dashed pointer-events-none"
        style={{ borderColor: `${INK_MUTED}55` }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 right-3 w-0 border-l border-dashed pointer-events-none"
        style={{ borderColor: `${INK_MUTED}55` }}
      />

      <header
        className="flex items-start justify-between gap-6 px-10 pt-7 pb-5 border-b shrink-0"
        style={{ borderColor: INK }}
      >
        <div className="min-w-0">
          <div
            className="text-[11px] tracking-[0.2em]"
            style={{ color: INK_MUTED }}
          >
            INVENTORY EXPORT
          </div>
          <h1 className="mt-1.5 text-[40px] leading-[1.05] font-bold">
            6 SPECIMENS. 4 STRUCTURES.
          </h1>
          <p className="mt-1.5 text-[13px] leading-snug" style={{ color: INK_MUTED }}>
            // the grid is what a page looks like when nobody decided
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="px-3 py-1.5" style={{ backgroundColor: INK }}>
            <span className="text-[32px] leading-none font-bold tabular-nums" style={{ color: PAPER }}>
              06
            </span>
          </div>
          <div className="mt-1.5 text-[11px] tracking-[0.15em]" style={{ color: INK_MUTED }}>
            ROWS
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex px-10 py-6 gap-6">
        <PanelShell num="01" label="GRID" caption="// what a set looks like when nobody decided">
          <GridPanel />
        </PanelShell>
        <PanelShell num="02" label="INDEX" caption="// bought on numbers, not on photos">
          <IndexPanel />
        </PanelShell>
        <PanelShell num="03" label="DENSITY" caption="// cell size comes from mass, not taste">
          <DensityPanel />
        </PanelShell>
        <PanelShell num="04" label="EDITORIAL" caption="// one earns the space, five stay listed">
          <EditorialPanel />
        </PanelShell>
      </main>

      <footer
        className="flex items-center justify-between px-10 pt-3 pb-6 border-t shrink-0"
        style={{ borderColor: INK }}
      >
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] tracking-[0.15em]" style={{ color: INK_MUTED }}>
            SKILL
          </span>
          <span className="text-[13px] font-medium">gmira-catalog</span>
        </div>
        <p className="text-[12px]" style={{ color: INK_MUTED }}>
          // structure is a decision, not a default
        </p>
      </footer>
    </div>
  );
}

function PanelShell({
  num,
  label,
  caption,
  children,
}: {
  num: string;
  label: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <section className="flex-1 min-w-0 flex flex-col">
      <div className="flex items-baseline justify-between mb-1.5 shrink-0">
        <span className="text-[11px] tracking-[0.05em]" style={{ color: INK_MUTED }}>
          {num}
        </span>
        <span className="text-[11px] tracking-[0.1em] font-bold">{label}</span>
      </div>
      <div
        className="flex-1 min-h-0 relative p-2.5 border overflow-hidden"
        style={{ borderColor: INK_MUTED }}
      >
        {children}
      </div>
      <p className="mt-1.5 text-[11.5px] leading-snug shrink-0" style={{ color: INK_MUTED }}>
        {caption}
      </p>
    </section>
  );
}

function GridPanel() {
  return (
    <div className="h-full grid grid-cols-2 grid-rows-3 gap-2 relative">
      {SPECIMENS.map((s) => (
        <div
          key={s.code}
          className="min-h-0 min-w-0 border border-dashed flex flex-col justify-center gap-1.5 px-2"
          style={{ borderColor: INK_MUTED }}
        >
          <div className="text-[12px] truncate font-medium">{s.name}</div>
          <div className="h-[3px] w-[70%]" style={{ backgroundColor: INK_MUTED, opacity: 0.4 }} />
          <div className="h-[3px] w-[45%]" style={{ backgroundColor: INK_MUTED, opacity: 0.4 }} />
        </div>
      ))}
      <div className="absolute bottom-1.5 right-1.5 rotate-[4deg] border px-2.5 py-1.5" style={{ backgroundColor: PAPER, borderColor: PEN_RED }}>
        <div className="text-[11px] font-bold tracking-[0.06em]">DEFAULT</div>
        <div className={`${hand.className} text-[19px] leading-none mt-0.5`} style={{ color: PEN_RED }}>
          nobody decided
        </div>
      </div>
    </div>
  );
}

function IndexPanel() {
  return (
    <div>
      <div
        className="grid grid-cols-[22px_1fr_28px_38px] gap-x-1.5 pb-1 border-b-2 text-[11px] tracking-[0.05em]"
        style={{ borderColor: INK, color: INK_MUTED }}
      >
        <span>NO</span>
        <span>SPECIMEN</span>
        <span className="text-right">YR</span>
        <span className="text-right">G &#9662;</span>
      </div>
      {SPECIMENS.map((s, i) => (
        <div
          key={s.code}
          className="grid grid-cols-[22px_1fr_28px_38px] gap-x-1.5 items-baseline py-[6px] px-[2px]"
          style={{ backgroundColor: i % 2 === 0 ? BAR : "transparent" }}
        >
          <span className="text-[11px] tabular-nums" style={{ color: INK_MUTED }}>
            {s.code}
          </span>
          <span className="text-[13px] truncate font-medium">{s.name}</span>
          <span className="text-[11px] text-right tabular-nums" style={{ color: INK_MUTED }}>
            {s.year}
          </span>
          <span className="text-[12px] text-right tabular-nums font-bold">{s.mass}</span>
        </div>
      ))}
      <div
        className="mt-2 pt-1.5 border-t-2 grid grid-cols-[22px_1fr_28px_38px] gap-x-1.5 text-[11px]"
        style={{ borderColor: INK }}
      >
        <span />
        <span className="font-bold tracking-[0.05em]">TOTAL</span>
        <span />
        <span className="text-right tabular-nums font-bold">{TOTAL_MASS}</span>
      </div>
    </div>
  );
}

function DensityPanel() {
  const [lead, high, normal, ...tail] = SPECIMENS;
  return (
    <div className="h-full flex flex-col gap-1.5">
      <div
        className="flex-[5] min-h-0 p-2.5 flex flex-col justify-between"
        style={{ backgroundColor: INK, color: PAPER }}
      >
        <div className="flex items-baseline justify-between text-[11px] tracking-[0.06em]">
          <span>{lead.code}</span>
          <span>{tierOf(lead.mass).toUpperCase()}</span>
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-[34px] leading-none font-bold tabular-nums">{lead.mass}</span>
            <span className="text-[14px]">g</span>
          </div>
          <div className="text-[16px] mt-0.5 tracking-wide">{lead.name.toUpperCase()}</div>
        </div>
      </div>

      <div className="flex-[3] min-h-0 flex gap-1.5">
        <div
          className="flex-[3] min-w-0 p-2 flex flex-col justify-between border"
          style={{ backgroundColor: BAR, borderColor: BAR_LINE }}
        >
          <div className="flex items-baseline justify-between text-[11px]" style={{ color: INK_MUTED }}>
            <span>{high.code}</span>
            <span>{tierOf(high.mass).toUpperCase()}</span>
          </div>
          <div>
            <div className="text-[19px] leading-none tabular-nums font-bold">
              {high.mass}
              <span className="text-[11px] font-normal"> g</span>
            </div>
            <div className="text-[13px] mt-0.5 font-medium">{high.name}</div>
          </div>
        </div>
        <div
          className="flex-[2] min-w-0 p-2 flex flex-col justify-between border"
          style={{ backgroundColor: PAPER, borderColor: INK_MUTED }}
        >
          <div className="text-[11px]" style={{ color: INK_MUTED }}>
            {normal.code}
          </div>
          <div>
            <div className="text-[16px] leading-none tabular-nums font-bold">
              {normal.mass}
              <span className="text-[11px] font-normal"> g</span>
            </div>
            <div className="text-[12px] mt-0.5 truncate font-medium">{normal.name}</div>
          </div>
        </div>
      </div>

      <div className="flex-[2] min-h-0 flex gap-1.5">
        {tail.map((s, i) => (
          <div
            key={s.code}
            className="flex-1 min-w-0 p-1.5 flex flex-col justify-between border"
            style={{ backgroundColor: i === 1 ? BAR : PAPER, borderColor: INK_MUTED }}
          >
            <span className="text-[11px] tabular-nums" style={{ color: INK_MUTED }}>
              {s.mass}g
            </span>
            <span className="text-[11px] truncate font-medium">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorialPanel() {
  const [featured, ...rest] = SPECIMENS;
  return (
    <div>
      <div className="text-[11px] tracking-[0.1em] font-bold" style={{ color: INK_MUTED }}>
        FEATURED
      </div>
      <div className="mt-1 flex items-baseline gap-2 flex-wrap">
        <span className="text-[22px] font-bold px-0.5" style={{ backgroundColor: HIGHLIGHT, color: INK }}>
          {featured.name.toUpperCase()}
        </span>
        <span className="text-[13px] tabular-nums" style={{ color: INK_MUTED }}>
          {featured.mass}g
        </span>
      </div>
      <p className="mt-1.5 text-[12px] leading-snug" style={{ color: INK_MUTED }}>
        heaviest specimen, complete provenance: {featured.site}, {featured.year}
      </p>
      <div className="mt-3 pt-2 border-t space-y-1.5" style={{ borderColor: INK_MUTED }}>
        {rest.map((s, i) => (
          <div key={s.code} className="flex items-baseline justify-between gap-2 text-[12.5px]">
            <span className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-[11px]" style={{ color: INK_MUTED }}>
                {i + 2}
              </span>
              <span className="truncate font-medium">{s.name}</span>
            </span>
            <span className="tabular-nums shrink-0" style={{ color: INK_MUTED }}>
              {s.mass}g
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
