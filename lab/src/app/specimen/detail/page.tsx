import { Archivo_Narrow, IBM_Plex_Mono } from "next/font/google";

/*
  Specimen plate for gmira-detail.

  Direction contract (gmira-direction). World drawn by external index, seed
  "gmira-detail:2026-07-25" against gmira/references/playbooks/worlds.md: world A 12, world B 25.

  Thesis     A spec sheet either groups by system and cites its source, or it is a pile of
             unrelated facts wearing a table's clothes.
  Own world  World A: a Caterpillar or Deere heavy equipment service manual, ring bound, oil
             resistant paper, torque values carrying their tolerance, warnings boxed in a
             triangle. World B supplies the delta colour logic only, a swatch book's moss and
             rust, marking one measurement better than the baseline and one worse. Nothing else
             of world B is present.
  Story      Left plate: grouped, sourced, aligned. Right plate: the same nine facts flattened,
             stamped as the failure.
  Viewport   Both plates fill the frame at once, nothing sits below a fold.
  Form       Two ring bound pages side by side. Left is a real table, three tbody groups, unit
             in the row header, a baseline column, tabular numerals throughout. Right is a flat
             justified list, no table, no groups, no source, unit glued to every line, closing
             on a rejected stamp.
*/

const label = Archivo_Narrow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const data = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Two colour print budget: ink and warn, on paper, plus one delta pair (moss, rust) carried in
// from the fused world for the comparison column only. Every text colour is measured against
// PAPER: ink 13.9:1, ink70 6.2:1, warn 6.1:1, moss 7.5:1, rust 6.1:1, all above the 4.5:1 floor.
const PAPER = "#EAE7DE";
const PAPER_2 = "#E1DCCC";
const INK = "#1C1B17";
const INK_70 = "#5A5344";
const RULE = "#C9C2AE";
const RAIL = "#D6D0BB";
const WARN = "#9E2A17";
const YELLOW = "#F2C200";
const MOSS = "#3A4B3F";
const RUST = "#8C3B2E";

type Row = {
  spec: string;
  unit: string;
  value: string;
  base: string;
  delta: string;
  tone?: "moss" | "rust";
};

type Group = {
  system: string;
  rows: Row[];
};

const GROUPS: Group[] = [
  {
    system: "Engine",
    rows: [
      { spec: "Displacement", unit: "L", value: "2.2", base: "2.0", delta: "+0.2" },
      { spec: "Peak torque", unit: "Nm", value: "143 ± 4", base: "128 ± 4", delta: "+15" },
      { spec: "Noise at 7 m", unit: "dB(A)", value: "68", base: "72", delta: "-4", tone: "moss" },
    ],
  },
  {
    system: "Electrical output",
    rows: [
      { spec: "Rated power", unit: "kVA", value: "20.0", base: "18.0", delta: "+2.0" },
      { spec: "Power factor", unit: "ratio", value: "0.80", base: "0.80", delta: "unchanged" },
      { spec: "Fuel use, 75% load", unit: "L/h", value: "5.8", base: "5.4", delta: "+0.4", tone: "rust" },
    ],
  },
  {
    system: "Service and weights",
    rows: [
      { spec: "Dry weight", unit: "kg", value: "612", base: "585", delta: "+27" },
      { spec: "Fuel tank", unit: "L", value: "95", base: "95", delta: "unchanged" },
      { spec: "Runtime, 75% load", unit: "h", value: "14.5", base: "15.0", delta: "-0.5" },
    ],
  },
];

const FLAT = [
  { spec: "Displacement", value: "2.2 L" },
  { spec: "Peak torque", value: "143 Nm" },
  { spec: "Noise at 7 m", value: "68 dB(A)" },
  { spec: "Rated power", value: "20.0 kVA" },
  { spec: "Power factor", value: "0.80" },
  { spec: "Fuel use, 75% load", value: "5.8 L/h" },
  { spec: "Dry weight", value: "612 kg" },
  { spec: "Fuel tank", value: "95 L" },
  { spec: "Runtime, 75% load", value: "14.5 h" },
];

const HOLE_Y = [50, 138, 226, 314, 402, 490, 578, 666];

export default function Page() {
  return (
    <div
      className={`w-[1200px] h-[750px] overflow-hidden relative ${label.className}`}
      style={{ backgroundColor: PAPER, color: INK }}
    >
      <div className="flex h-full w-full">
        {/* Ring binder rail. Decorative only, carries no text. */}
        <div className="relative h-full w-[26px] shrink-0" style={{ backgroundColor: RAIL }}>
          {HOLE_Y.map((y) => (
            <span
              key={y}
              className="absolute left-1/2 h-[11px] w-[11px] -translate-x-1/2 rounded-full"
              style={{
                top: y,
                backgroundColor: PAPER,
                boxShadow: "inset 0 1px 2px rgba(20,18,12,0.4), 0 1px 0 rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>

        <div className="flex h-full min-w-0 flex-1 flex-col px-9 pt-6 pb-5">
          {/* Running head */}
          <div
            className={`${data.className} flex items-baseline justify-between text-[11px] uppercase tracking-[0.14em]`}
            style={{ color: INK_70 }}
          >
            <span>Service manual, section 4</span>
            <span>Form 4.2, rev C</span>
          </div>

          {/* Title block */}
          <div className="mt-2">
            <h1 className="text-[44px] font-bold leading-[1.02] tracking-[-0.01em]">
              Genset DG-220, specification data
            </h1>
            <p className="mt-1.5 text-[15px]" style={{ color: INK_70 }}>
              The same nine facts, two treatments.
            </p>
          </div>

          <div className="mt-4 h-px w-full shrink-0" style={{ backgroundColor: INK }} />

          {/* Two panels */}
          <div className="mt-5 grid min-h-0 flex-1 grid-cols-[1.68fr_1fr]">
            {/* CORRECT plate */}
            <section className="flex min-h-0 flex-col pr-8">
              <div className="flex items-center gap-2.5">
                <span
                  className={`${data.className} inline-flex items-center gap-1 px-2 py-[3px] text-[11px] font-semibold uppercase tracking-[0.08em]`}
                  style={{ backgroundColor: YELLOW, color: INK }}
                >
                  <span aria-hidden>{"✓"}</span> Correct
                </span>
                <span className="text-[13px]" style={{ color: INK_70 }}>
                  Grouped by system, unit in the label, aligned, sourced
                </span>
              </div>

              <table className="mt-3.5 w-full border-collapse">
                <caption className="sr-only">
                  Specification data, Genset DG-220, compared against the prior model DG-210
                </caption>
                <colgroup>
                  <col />
                  <col className="w-[96px]" />
                  <col className="w-[104px]" />
                  <col className="w-[88px]" />
                </colgroup>
                <thead>
                  <tr className="border-b-2" style={{ borderColor: INK }}>
                    <th scope="col" className="pb-2 text-left text-[12px] font-bold uppercase tracking-[0.08em]">
                      Specification
                    </th>
                    <th scope="col" className="pb-2 text-right text-[12.5px] font-bold">
                      This unit
                      <span
                        className={`${data.className} block text-[10px] font-normal normal-case tracking-normal`}
                        style={{ color: INK_70 }}
                      >
                        DG-220
                      </span>
                    </th>
                    <th scope="col" className="pb-2 text-right text-[12.5px] font-bold">
                      Baseline
                      <span
                        className={`${data.className} block text-[10px] font-normal normal-case tracking-normal`}
                        style={{ color: INK_70 }}
                      >
                        DG-210
                      </span>
                    </th>
                    <th scope="col" className={`${data.className} pb-2 text-right text-[13px] font-semibold`}>
                      <span aria-hidden>{"Δ"}</span>
                      <span className="sr-only">Change versus baseline</span>
                    </th>
                  </tr>
                </thead>
                {GROUPS.map((g) => (
                  <tbody key={g.system}>
                    <tr>
                      <th
                        scope="colgroup"
                        colSpan={4}
                        className="pt-3 pb-1.5 text-left text-[13px] font-bold uppercase tracking-[0.1em]"
                        style={{ color: INK, backgroundColor: PAPER_2 }}
                      >
                        {g.system}
                      </th>
                    </tr>
                    {g.rows.map((r) => (
                      <tr key={r.spec} className="border-t" style={{ borderColor: RULE }}>
                        <th scope="row" className="py-[6px] pr-2 text-left align-baseline text-[15px] font-normal">
                          {r.spec}{" "}
                          <span className={`${data.className} text-[11px]`} style={{ color: INK_70 }}>
                            {r.unit}
                          </span>
                        </th>
                        <td className={`${data.className} py-[6px] text-right text-[15px] font-medium tabular-nums`}>
                          {r.value}
                        </td>
                        <td
                          className={`${data.className} py-[6px] text-right text-[13.5px] tabular-nums`}
                          style={{ color: INK_70 }}
                        >
                          {r.base}
                        </td>
                        <td
                          className={`${data.className} py-[6px] text-right text-[13px] tabular-nums ${
                            r.tone ? "font-semibold" : ""
                          }`}
                          style={{ color: r.tone === "moss" ? MOSS : r.tone === "rust" ? RUST : INK_70 }}
                        >
                          {r.delta}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>

              <p className={`${data.className} mt-3 text-[12px]`} style={{ color: INK_70 }}>
                Baseline: DG-210, prior model, bench test, measured 2026-06-02.
              </p>
            </section>

            {/* INCORRECT plate */}
            <section className="relative flex min-h-0 flex-col border-l pl-8" style={{ borderColor: RULE }}>
              <div className="flex items-center gap-2.5">
                <span
                  className={`${data.className} inline-flex items-center gap-1.5 border px-2 py-[3px] text-[11px] font-semibold uppercase tracking-[0.08em]`}
                  style={{ borderColor: WARN, color: WARN }}
                >
                  <span aria-hidden className="relative inline-flex h-[13px] w-[15px] items-end justify-center">
                    <span
                      className="absolute inset-0"
                      style={{ backgroundColor: WARN, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                    />
                    <span className={`${data.className} relative bottom-[1px] text-[8px] font-bold`} style={{ color: PAPER }}>
                      !
                    </span>
                  </span>
                  Incorrect
                </span>
              </div>
              <p className="mt-1 text-[13px]" style={{ color: INK_70 }}>
                Same facts, flattened, unit glued to every line
              </p>

              <div className="mt-3.5">
                {FLAT.map((f) => (
                  <div
                    key={f.spec}
                    className="flex items-baseline justify-between border-b py-[6px]"
                    style={{ borderColor: RULE }}
                  >
                    <span className="text-[14px] font-normal">{f.spec}</span>
                    <span className="text-[14px] font-normal">{f.value}</span>
                  </div>
                ))}
              </div>

              <p className={`${data.className} mt-3 text-[12px]`} style={{ color: INK_70 }}>
                9 unrelated strings. No group. No source. No comparison.
              </p>

              <div
                aria-hidden
                className={`${data.className} absolute bottom-8 right-2 rotate-[-9deg] border-[3px] px-4 py-2 text-center`}
                style={{ borderColor: WARN, color: WARN, backgroundColor: "rgba(234,231,222,0.78)" }}
              >
                <div className="text-[22px] font-bold uppercase tracking-[0.06em]">Rejected</div>
                <div className="text-[10px] uppercase tracking-[0.14em]">Spec not to form</div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div
            className={`${data.className} mt-4 flex shrink-0 items-center justify-between text-[11px] uppercase tracking-[0.1em]`}
            style={{ color: INK_70 }}
          >
            <span>Genset DG-220 service data</span>
            <span>gmira-detail</span>
          </div>
        </div>
      </div>
    </div>
  );
}
