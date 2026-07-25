import { Fraunces, IBM_Plex_Mono } from "next/font/google";

// gmira-scroll specimen plate. One authored moment versus the fade-up-on-every-section
// reflex. Rendered as a matted spec sheet: a paper plate on a board, ruled tracks standing
// in for the page, rust ink spent exactly once. That restraint is the whole argument.

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

const BOARD = "#d9d0b5";
const PAPER = "#f2ecdd";
const PAPER_2 = "#e8e0c8";
const INK = "#1c1912";
const INK_2 = "#4a4335";
const RUST = "#b83f22";
const RUST_INK = "#8f2d17";
const LINE = "rgba(28, 25, 18, 0.16)";

const ROW_H = 56;
const TRACK_W = 400;

type RowDatum = { n: string; tab: number; tone: "ink" | "rust"; note?: string };

const sectionNumbers = ["01", "02", "03", "04", "05", "06"];

const leftRows: RowDatum[] = sectionNumbers.map((n) => ({
  n,
  tab: 190,
  tone: "ink",
}));

const rightRows: RowDatum[] = sectionNumbers.map((n, i) =>
  i === 3
    ? { n, tab: 250, tone: "rust", note: "authored" }
    : { n, tab: 0, tone: "ink" }
);

function Track({
  title,
  caption,
  rows,
}: {
  title: string;
  caption: string;
  rows: RowDatum[];
}) {
  return (
    <div className="flex flex-col">
      <div
        className="uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "0.14em",
          color: INK,
        }}
      >
        {title}
      </div>

      <div style={{ marginTop: 14, width: TRACK_W, borderTop: `1px solid ${LINE}` }}>
        {rows.map((r, i) => (
          <div
            key={r.n}
            className="flex items-center"
            style={{
              height: ROW_H,
              borderBottom: `1px solid ${LINE}`,
              backgroundColor: i % 2 === 1 ? PAPER_2 : "transparent",
            }}
          >
            <span
              className="flex-none text-right"
              style={{
                width: 40,
                paddingRight: 12,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.04em",
                color: INK_2,
              }}
            >
              {r.n}
            </span>
            <span
              className="flex-none"
              style={{ width: 0, height: ROW_H, borderLeft: `2px solid ${INK}` }}
            />
            {r.tab > 0 ? (
              <span
                className="flex-none"
                style={{
                  width: r.tab,
                  height: r.tone === "rust" ? 32 : 26,
                  backgroundColor: r.tone === "rust" ? RUST : INK,
                }}
              />
            ) : (
              <span
                className="flex-none rounded-full"
                style={{
                  width: 7,
                  height: 7,
                  marginLeft: 11,
                  backgroundColor: INK_2,
                  opacity: 0.5,
                }}
              />
            )}
            {r.note ? (
              <span
                className="flex-none"
                style={{
                  marginLeft: 14,
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: RUST_INK,
                }}
              >
                {r.note}
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 12,
          fontFamily: "var(--font-mono)",
          fontSize: 12.5,
          color: INK_2,
        }}
      >
        {caption}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div
      className={`${display.variable} ${mono.variable} relative w-[1200px] h-[750px] overflow-hidden`}
      style={{ backgroundColor: BOARD }}
    >
      <span
        className="absolute"
        style={{ top: 13, left: 13, fontFamily: "var(--font-mono)", fontSize: 16, lineHeight: 1, color: INK_2, opacity: 0.4 }}
      >
        +
      </span>
      <span
        className="absolute"
        style={{ top: 13, right: 13, fontFamily: "var(--font-mono)", fontSize: 16, lineHeight: 1, color: INK_2, opacity: 0.4 }}
      >
        +
      </span>
      <span
        className="absolute"
        style={{ bottom: 13, left: 13, fontFamily: "var(--font-mono)", fontSize: 16, lineHeight: 1, color: INK_2, opacity: 0.4 }}
      >
        +
      </span>
      <span
        className="absolute"
        style={{ bottom: 13, right: 13, fontFamily: "var(--font-mono)", fontSize: 16, lineHeight: 1, color: INK_2, opacity: 0.4 }}
      >
        +
      </span>

      <span
        className="absolute"
        style={{
          bottom: 9,
          right: 42,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.05em",
          color: INK_2,
          opacity: 0.55,
        }}
      >
        1200 x 750
      </span>

      <div className="absolute" style={{ inset: 30 }}>
        <div className="h-full w-full" style={{ backgroundColor: PAPER, border: `1px solid ${LINE}` }}>
          <div className="flex h-full flex-col justify-between" style={{ padding: 34 }}>
            <div className="flex items-start justify-between">
              <div>
                <div
                  className="uppercase"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    color: RUST_INK,
                  }}
                >
                  Entrance motion, compared
                </div>
                <h1 style={{ fontFamily: "var(--font-display)", color: INK, margin: 0, marginTop: 14 }}>
                  <span style={{ display: "block", fontSize: 46, lineHeight: 1.05, fontWeight: 600 }}>
                    One moment, authored.
                  </span>
                  <span
                    style={{
                      display: "block",
                      marginTop: 6,
                      fontSize: 29,
                      lineHeight: 1.15,
                      fontWeight: 500,
                      fontStyle: "italic",
                      color: INK_2,
                    }}
                  >
                    Everything else just appears.
                  </span>
                </h1>
              </div>

              <div style={{ fontFamily: "var(--font-mono)" }}>
                <div className="text-right uppercase" style={{ fontSize: 11, letterSpacing: "0.16em", color: INK_2 }}>
                  Legend
                </div>
                <div className="flex items-center justify-end" style={{ gap: 9, marginTop: 12 }}>
                  <span style={{ fontSize: 12, color: INK }}>identical fade</span>
                  <span style={{ width: 13, height: 13, display: "inline-block", backgroundColor: INK }} />
                </div>
                <div className="flex items-center justify-end" style={{ gap: 9, marginTop: 7 }}>
                  <span style={{ fontSize: 12, color: RUST_INK }}>authored peak</span>
                  <span style={{ width: 13, height: 13, display: "inline-block", backgroundColor: RUST }} />
                </div>
              </div>
            </div>

            <div className="flex items-start justify-center" style={{ gap: 96 }}>
              <Track title="The reflex" caption="same fade, six sections" rows={leftRows} />
              <Track title="The moment" caption="quiet five times, loud once" rows={rightRows} />
            </div>

            <div
              className="flex items-center justify-between"
              style={{ borderTop: `1px solid ${LINE}`, paddingTop: 14 }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: INK,
                  border: `1px solid ${INK}`,
                  padding: "4px 9px",
                }}
              >
                gmira-scroll
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: INK_2 }}>
                When everything is emphasized, nothing is.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
