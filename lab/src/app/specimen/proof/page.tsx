import { Oswald, Space_Mono } from "next/font/google";

/*
  SPECIMEN   gmira-proof
  WORLD      A flattened package. Left: the glossy front panel, the claims a page reaches
             for when it has nothing yet. Right: the back panel, set like a mandated facts
             panel, plain and itemized because the law does not let it lie.
  SHOWS      Doctrine gate G7. A greyed seal wall and a five star row, both struck through
             in the one accent colour on the page and marked forbidden. Beside them, the
             ladder from step 2: seven real rungs to ship instead, in black ink only.
  MODE       Read. Two verdicts, no persuasion.
*/

const display = Oswald({
  variable: "--proof-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const mono = Space_Mono({
  variable: "--proof-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const BOARD = "#eef0e6";
const PANEL_FRONT = "#f8f8f2";
const PANEL_BACK = "#fbfbf7";
const INK = "#16180f";
const MUTE = "#55574a";
const RED = "#c0261c";
const SEAL_FILL = "#d7d9c9";
const SEAL_LINE = "#aeb29c";

const SHIP_LIST = [
  { n: "01", term: "Method", note: "the syllabus, published in full" },
  { n: "02", term: "Process", note: "day one, day seven, day thirty" },
  { n: "03", term: "Guarantee", note: "full terms, what voids it" },
  { n: "04", term: "Founder", note: "named, a history that checks out" },
  { n: "05", term: "Artifact", note: "the real thing itself, dated" },
  { n: "06", term: "Credential", note: "registration, membership, insurance" },
  { n: "07", term: "Scarcity", note: "a cap that is actually enforced" },
];

function Seal({ size }: { size: number }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: SEAL_FILL,
        border: `1px solid ${SEAL_LINE}`,
      }}
    />
  );
}

function Prohibited({ size }: { size: number }) {
  const bar = Math.max(3, Math.round(size / 11));
  return (
    <span
      className="relative inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, border: `${bar}px solid ${RED}` }}
    >
      <span
        className="absolute left-1/2 top-1/2"
        style={{
          width: size * 1.06,
          height: bar,
          backgroundColor: RED,
          transform: "translate(-50%, -50%) rotate(-45deg)",
        }}
      />
    </span>
  );
}

function Barcode() {
  const bars = [2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1];
  return (
    <div className="flex items-end gap-[2px]">
      {bars.map((w, i) => (
        <span
          key={i}
          style={{
            width: w,
            height: i % 6 === 0 ? 28 : 20,
            backgroundColor: INK,
          }}
        />
      ))}
    </div>
  );
}

function Strike({ rotate }: { rotate: number }) {
  return (
    <span
      className="pointer-events-none absolute inset-x-0"
      style={{
        top: "50%",
        height: 3,
        marginTop: -1.5,
        backgroundColor: RED,
        transform: `rotate(${rotate}deg)`,
      }}
    />
  );
}

export default function ProofSpecimen() {
  return (
    <div
      className={`${display.variable} ${mono.variable} relative h-[750px] w-[1200px] overflow-hidden`}
      style={{
        backgroundColor: BOARD,
        color: INK,
        fontFamily: "var(--proof-display)",
      }}
    >
      <div className="absolute left-[56px] right-[56px] top-[34px] flex items-start justify-between">
        <div>
          <p
            className="text-[12px] font-bold uppercase tracking-[0.28em]"
            style={{ color: RED, fontFamily: "var(--proof-mono)" }}
          >
            Doctrine gate G7
          </p>
          <h1 className="mt-[6px] text-[38px] font-semibold leading-[1.02] tracking-[-0.01em]">
            The label does not lie
          </h1>
        </div>
        <div className="flex flex-col items-end gap-[7px] pt-[3px]">
          <Barcode />
          <p
            className="text-[13px] font-bold"
            style={{ fontFamily: "var(--proof-mono)" }}
          >
            gmira-proof
          </p>
        </div>
      </div>

      <div
        className="absolute left-[56px] top-[118px] w-[528px] rounded-[22px] px-[30px] py-[26px]"
        style={{
          backgroundColor: PANEL_FRONT,
          border: `1.5px solid ${SEAL_LINE}`,
          boxShadow: "0 14px 26px rgba(22,24,15,0.10)",
        }}
      >
        <p
          className="text-[11px] font-bold uppercase tracking-[0.22em]"
          style={{ color: MUTE, fontFamily: "var(--proof-mono)" }}
        >
          Front of pack, typical
        </p>
        <h2 className="mt-[6px] text-[38px] font-bold uppercase leading-[0.95] tracking-[-0.01em]">
          Nothing on file
        </h2>
        <p className="mt-[6px] text-[14px]" style={{ color: MUTE }}>
          What a page reaches for anyway.
        </p>
        <div
          className="mt-[16px]"
          style={{ borderTop: `1.5px dashed ${SEAL_LINE}` }}
        />

        <div className="mt-[24px]">
          <p
            className="text-[12.5px] italic"
            style={{ color: MUTE, fontFamily: "var(--proof-mono)" }}
          >
            Trusted by teams at
          </p>
          <div className="relative mt-[10px] inline-flex items-center gap-[14px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <Seal key={i} size={56} />
            ))}
            <Strike rotate={-4} />
          </div>
          <div className="mt-[12px] flex items-center gap-[10px]">
            <Prohibited size={28} />
            <p
              className="text-[15px] font-bold uppercase tracking-[0.05em]"
              style={{ color: RED }}
            >
              Forbidden
            </p>
          </div>
          <p
            className="mt-[6px] text-[12.5px]"
            style={{ color: MUTE, fontFamily: "var(--proof-mono)" }}
          >
            No client agreed. One seal is a demo asset.
          </p>
        </div>

        <div className="mt-[30px]">
          <div className="relative inline-flex items-center gap-[10px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="text-[44px] leading-none">
                ★
              </span>
            ))}
            <Strike rotate={4} />
          </div>
          <div className="mt-[12px] flex items-center gap-[10px]">
            <Prohibited size={28} />
            <p
              className="text-[15px] font-bold uppercase tracking-[0.05em]"
              style={{ color: RED }}
            >
              Forbidden
            </p>
          </div>
          <p
            className="mt-[6px] text-[12.5px]"
            style={{ color: MUTE, fontFamily: "var(--proof-mono)" }}
          >
            No platform. No count. No date.
          </p>
        </div>

        <p
          className="mt-[24px] text-[12px]"
          style={{ color: MUTE, fontFamily: "var(--proof-mono)" }}
        >
          6 more refusals in the doctrine. None acceptable with better styling.
        </p>
      </div>

      <div
        className="absolute right-[56px] top-[118px] w-[528px] px-[26px] py-[24px]"
        style={{ backgroundColor: PANEL_BACK, border: `3px solid ${INK}` }}
      >
        <h2 className="text-[38px] font-bold uppercase leading-[0.95] tracking-[-0.01em]">
          Proof facts
        </h2>
        <p className="mt-[6px] text-[14px]" style={{ color: MUTE }}>
          7 rungs, strongest first.
        </p>
        <div className="mt-[10px]" style={{ height: 8, backgroundColor: INK }} />

        <div className="mt-[16px]">
          {SHIP_LIST.map((row, i) => {
            const isLast = i === SHIP_LIST.length - 1;
            const isGroupEnd = i === 3;
            const border = isLast
              ? "none"
              : `${isGroupEnd ? 2 : 1}px solid rgba(22,24,15,${
                  isGroupEnd ? 0.34 : 0.14
                })`;
            return (
              <div
                key={row.n}
                className="flex items-baseline gap-[14px] py-[9px]"
                style={{ borderBottom: border }}
              >
                <span
                  className="w-[20px] shrink-0 text-[11px]"
                  style={{ color: MUTE, fontFamily: "var(--proof-mono)" }}
                >
                  {row.n}
                </span>
                <span className="w-[128px] shrink-0 text-[18px] font-bold uppercase">
                  {row.term}
                </span>
                <span className="text-[13.5px]" style={{ color: MUTE }}>
                  {row.note}
                </span>
              </div>
            );
          })}
        </div>

        <p
          className="mt-[14px] text-[11.5px] leading-snug"
          style={{ color: MUTE, fontFamily: "var(--proof-mono)" }}
        >
          * Skip a rung that is not true yet. A false guarantee is worse than none.
        </p>
      </div>

      <div className="absolute left-[56px] right-[56px] bottom-[30px] flex items-end justify-between">
        <p
          className="text-[11px]"
          style={{ color: MUTE, fontFamily: "var(--proof-mono)" }}
        >
          Set in Oswald and Space Mono, gmira-proof.
        </p>
        <p
          className="text-[11px]"
          style={{ color: MUTE, fontFamily: "var(--proof-mono)" }}
        >
          Doctrine gate G7, specimen plate.
        </p>
      </div>
    </div>
  );
}
