import type { CSSProperties, ReactNode } from "react";
import { Bebas_Neue, Space_Mono } from "next/font/google";

/*
  SPECIMEN CONTRACT (gmira-catalog format, scaled to one fixed plate)

  SKILL       gmira-states
  WORLD       Split flap departure board (worlds.md, entry 16), played straight.
              Seed "gmira-states:2026-07-25", draw: 8, 31, 32, 15, 24, 16, 23.
              Candidate 8 (seed packet) is already claimed by proof/shop, excluded.
              16 wins on both axes: a status board is a real, recognisable object
              built entirely out of states, and a row of flap characters is the
              one structure where "state" is the content, not a metaphor bolted on.
  FORM        A legend row, then six fixed rows: state, control, signal. Never a
              card. The three empty kinds sit in their own column as advisory
              plates, same board, smaller unit.
  MATERIAL    Matte board, aluminium hairlines, warm paper white on near black.
              Amber for attention, coral for failure, green for resolved. No blue
              accent anywhere, no rounded card, radius capped at 2px on controls.
  TELL        Every control keeps a visible focus ring built from the two tone
              technique (inner ring matches the surface behind it, outer ring is
              the accent), because this plate is about states, and a state plate
              that hides its own focus ring would be a lie about its own subject.
  CONTRAST    ink 15.4:1, ink dim 5.8 to 6.3:1, amber 8.7 to 9.4:1,
              coral 5.3 to 5.7:1, green 7.6 to 8.1:1, each measured against
              both board tones used as real backgrounds on this plate.
*/

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata = {
  title: "gmira-states, specimen",
  description:
    "Six states of one button in a labelled column, plus the three kinds of empty state as small panels, on a split flap status board.",
};

const btnBase =
  "inline-flex h-9 items-center justify-center gap-2 border px-4 text-[13px] font-bold uppercase tracking-wide font-[family-name:var(--font-mono)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--amber)] focus-visible:ring-offset-[3px] focus-visible:ring-offset-[var(--board)]";

const chipBase =
  "inline-flex w-fit items-center gap-1 border border-[var(--frame-lit)] px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide font-[family-name:var(--font-mono)] text-[var(--ink)] cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--amber)] focus-visible:ring-offset-[3px] focus-visible:ring-offset-[var(--board-2)]";

function Row({
  code,
  name,
  control,
  signal,
}: {
  code: string;
  name: string;
  control: ReactNode;
  signal: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[150px_180px_1fr] items-center gap-5 border-b border-[var(--frame)] py-2 last:border-b-0">
      <div className="flex flex-col gap-0.5">
        <span className="text-[10.5px] tracking-[0.15em] text-[var(--ink-dim)]">
          NO.{code}
        </span>
        <span className="font-[family-name:var(--font-display)] text-[27px] leading-none text-[var(--ink)]">
          {name}
        </span>
      </div>
      <div className="flex items-center">{control}</div>
      <div className="text-[14.5px] leading-snug text-[var(--ink-dim)]">
        {signal}
      </div>
    </div>
  );
}

function Panel({
  accent,
  eyebrow,
  body,
  action,
  extra,
}: {
  accent: string;
  eyebrow: string;
  body: string;
  action: ReactNode;
  extra?: ReactNode;
}) {
  return (
    <div
      className="flex min-h-0 flex-col justify-center gap-2 border border-[var(--frame)] bg-[var(--board-2)] px-4 py-3"
      style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
    >
      <span
        className="text-[11.5px] font-bold tracking-[0.15em]"
        style={{ color: accent }}
      >
        {eyebrow}
      </span>
      <p className="text-[14.5px] leading-snug text-[var(--ink)]">{body}</p>
      {extra}
      {action}
    </div>
  );
}

export default function StatesSpecimen() {
  return (
    <div
      className={`${display.variable} ${mono.variable} relative flex h-[750px] w-[1200px] flex-col overflow-hidden bg-[var(--board)] p-8 font-[family-name:var(--font-mono)] text-[var(--ink)]`}
      style={
        {
          "--board": "#121317",
          "--board-2": "#1b1d22",
          "--board-3": "#24262c",
          "--frame": "#4a4e54",
          "--frame-lit": "#6b7078",
          "--ink": "#f0ede2",
          "--ink-dim": "#9a988e",
          "--amber": "#e8b23a",
          "--coral": "#e8695c",
          "--green": "#6fbf7a",
        } as CSSProperties
      }
    >
      <header className="flex shrink-0 items-end justify-between gap-6 border-b-2 border-[var(--frame)] pb-4">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-[var(--ink-dim)]">
            GMIRA / INTERACTIVE STATUS BOARD
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-[46px] leading-none text-[var(--ink)]">
            SIX STATES, ONE BUTTON
          </h1>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="text-[11px] tracking-[0.15em] text-[var(--ink-dim)]">
            REV 2026.07 / BOARD 06
          </span>
          <span className="border border-[var(--frame-lit)] px-2 py-0.5 text-[11.5px] tracking-wide text-[var(--ink)]">
            gmira-states
          </span>
        </div>
      </header>

      <div className="mt-4 flex min-h-0 flex-1">
        <div className="flex min-h-0 basis-[62%] flex-col pr-7">
          <div className="grid grid-cols-[150px_180px_1fr] gap-5 border-b border-[var(--frame)] pb-1.5 text-[11px] tracking-[0.2em] text-[var(--ink-dim)]">
            <span>STATE</span>
            <span>CONTROL</span>
            <span>SIGNAL</span>
          </div>

          <div className="mt-1 grid min-h-0 flex-1 grid-rows-6">
            <Row
              code="01"
              name="DEFAULT"
              control={
                <button
                  type="button"
                  className={`${btnBase} cursor-pointer border-[var(--frame-lit)] bg-[var(--board-3)] text-[var(--ink)]`}
                >
                  Publish
                </button>
              }
              signal="Ready. Nothing to report yet."
            />

            <Row
              code="02"
              name="HOVER"
              control={
                <div className="relative inline-flex">
                  <button
                    type="button"
                    className={`${btnBase} cursor-pointer border-2 border-[var(--amber)] bg-[var(--board-3)] text-[var(--ink)]`}
                  >
                    Publish
                  </button>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 -right-1.5 h-4 w-3.5 bg-[var(--ink)]"
                    style={{
                      clipPath:
                        "polygon(0% 0%, 0% 78%, 35% 60%, 55% 100%, 72% 92%, 50% 55%, 100% 55%)",
                    }}
                  />
                </div>
              }
              signal="On the button itself, not just the card."
            />

            <Row
              code="03"
              name="FOCUS"
              control={
                <button
                  type="button"
                  autoFocus
                  className={`${btnBase} cursor-pointer border-[var(--frame-lit)] bg-[var(--board-3)] text-[var(--ink)] outline-none ring-[3px] ring-[var(--amber)] ring-offset-[3px] ring-offset-[var(--board)]`}
                >
                  Publish
                </button>
              }
              signal="Tab stop. The ring reads on any ground."
            />

            <Row
              code="04"
              name="DISABLED"
              control={
                <button
                  type="button"
                  aria-disabled="true"
                  aria-describedby="publish-disabled-reason"
                  className={`${btnBase} cursor-not-allowed border-[var(--frame)] bg-[var(--board-2)] text-[var(--ink-dim)]`}
                >
                  Publish
                </button>
              }
              signal={
                <span id="publish-disabled-reason">
                  Reason: add a cover image first.
                </span>
              }
            />

            <Row
              code="05"
              name="LOADING"
              control={
                <button
                  type="button"
                  aria-busy="true"
                  aria-disabled="true"
                  className={`${btnBase} cursor-progress border-[var(--frame-lit)] bg-[var(--board-3)] text-[var(--ink)]`}
                >
                  <span
                    aria-hidden="true"
                    className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--ink-dim)] border-t-[var(--amber)] motion-reduce:animate-none"
                  />
                  Publishing
                </button>
              }
              signal="Shown past 200ms, held 300ms more."
            />

            <Row
              code="06"
              name="ERROR"
              control={
                <button
                  type="button"
                  className={`${btnBase} cursor-pointer border-[var(--coral)] bg-[var(--board-3)] text-[var(--ink)]`}
                >
                  Publish
                </button>
              }
              signal={
                <span role="alert" className="text-[var(--coral)]">
                  Title taken. Try another, or open it.
                </span>
              }
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col border-l border-[var(--frame)] pl-7">
          <p className="border-b border-[var(--frame)] pb-1.5 text-[11px] tracking-[0.2em] text-[var(--ink-dim)]">
            EMPTY / THREE KINDS
          </p>

          <div className="mt-4 grid min-h-0 flex-1 grid-rows-3 gap-4">
            <Panel
              accent="var(--ink-dim)"
              eyebrow="EMPTY / NEVER HAD DATA"
              body="Nothing published yet. Posts you publish will land here."
              extra={
                <div className="mt-0.5 flex items-center justify-between border border-dashed border-[var(--frame-lit)] px-2 py-1">
                  <span className="text-[11px] text-[var(--ink-dim)]">
                    Untitled draft
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.15em] text-[var(--ink-dim)]">
                    SAMPLE
                  </span>
                </div>
              }
              action={
                <button type="button" className={chipBase}>
                  + New post
                </button>
              }
            />

            <Panel
              accent="var(--amber)"
              eyebrow="EMPTY / NO RESULTS"
              body='No posts tagged "design". Clear it to see 12 again.'
              action={
                <button type="button" className={chipBase}>
                  Clear tag
                </button>
              }
            />

            <Panel
              accent="var(--green)"
              eyebrow="EMPTY / CLEARED"
              body="3 drafts deleted. Undo now, or return to all posts."
              action={
                <button type="button" className={chipBase}>
                  Undo
                </button>
              }
            />
          </div>
        </div>
      </div>

      <footer className="mt-4 shrink-0 border-t border-[var(--frame)] pt-3">
        <p className="text-[11.5px] text-[var(--ink-dim)]">
          A state you cannot trigger in the browser is a state you did not build.
        </p>
      </footer>
    </div>
  );
}
