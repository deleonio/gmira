import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";

/*
  DIRECTION CONTRACT  (gmira-direction, world drawn by external index)

  DRAW            node -e "const s='ai-school|2026-07-25';let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0"
                  -> 2728833633, mod 5 = 3 -> ai-school.md section 6, world index 3 of 0..4:
                  the machine shop job traveller. Assigned, not chosen.

  RUT (excluded)      Near-black hero, particle mesh, violet gradient headline, greyscale
                      tool logo bar, twelve collapsed accordion rows, three circular
                      instructor avatars reading "ex-Google", an unsourced metric band.
  COUNTER (excluded)  White page, LaTeX serif, numbered theorems. And its cousin, the
                      terminal-green monospace page with a blinking cursor.

  THESIS          This programme is a routing: nine numbered operations, each with a
                  stamped acceptance test you can read in full before you pay.
  OWN-WORLD       A machine shop job traveller, the card that follows a part through the
                  shop. Manila stock punched for the rack, two rule weights only (heavy
                  block outline, hairline row rule), field captions printed in condensed
                  caps and filled in mono, an inspection stamp in green ink, a hold stamp
                  in red.
                  TELL: every operation is numbered in tens, OP 010 to OP 090, and carries
                  a hard-edged square stamp box holding the responsible operator's three
                  character code, set in mono and rotated 4.5 degrees off square. The one
                  empty box on the card is OP 090, whose sheet is not released until week 9.
  STORY           Opens at the card head and the route. Ends at nonconformance, refunds and
                  the exits. Route first, money last, no reordering to flatter either.
  FIRST VIEWPORT  Card head lying on a bench: shop mark, part number AIE-12, routing rev C,
                  lot C07, released and due dates, quantity and hours, the RELEASED stamp,
                  and the incoming inspection block already begun. No photograph, no hero.
  FORM            One traveller card on a bench, never a card grid. Operations are rows in a
                  routing table under a single column header. Exactly two rule weights.
                  Corner radius 0 everywhere except the punched holes. The work order rides
                  in a sticky right column from 1024px and becomes a fixed bottom rail below
                  that. Zero registry components: a neon PCB primitive on manila card stock
                  would be this page inheriting a registry's house style instead of the
                  brief's, so every mark here is CSS written for this card.
*/

const form = Barlow_Condensed({
  variable: "--font-form",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const stamp = IBM_Plex_Mono({
  variable: "--font-stamp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AIE-12 routing / Second Shift",
  description:
    "The full routing for Applied AI Engineering: nine operations, their acceptance criteria, the operators who run them, the price, and the refund schedule quoted from the contract.",
};

/* Everything below is CSS written for this card. The keyframe block is the page's one
   authored moment: the RELEASED stamp presses onto the card head, once, on load.
   Reduced motion removes it outright rather than slowing it, and the resting state is
   already the composed frame, so nothing is lost when it never runs. */
const CSS = `
.tv-press {
  /* The resting state IS the composed still frame: a stamp that landed off square. The
     animation only travels to it, so killing the animation under reduced motion leaves
     the same picture rather than a squared-up stamp that lost the tell. */
  transform: rotate(-4.5deg);
  animation: tv-press 420ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
}
@keyframes tv-press {
  0%   { opacity: 0; transform: rotate(-13deg) scale(1.55); }
  55%  { opacity: 1; }
  100% { opacity: 1; transform: rotate(-4.5deg) scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .tv-press { animation: none; }
}

/* Punched for the rack. Holes read through to the bench, so the card is a physical
   object rather than a panel. */
.tv-punch {
  background-image: radial-gradient(circle at 50% 50%, var(--bench) 0 5.5px, transparent 6px);
  background-size: 100% 52px;
  background-position: 0 26px;
  background-repeat: repeat-y;
}

/* Surface grinding on the bench top. Sits in its own layer, never as an ancestor
   background, so measured contrast stays computable everywhere on the page. */
.tv-grain {
  background-image:
    repeating-linear-gradient(112deg, rgba(255,255,255,0.022) 0 1px, transparent 1px 6px),
    repeating-linear-gradient(68deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 4px);
}

.tv-f:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 3px;
  background-color: var(--card-3);
}
.tv-f-inv:focus-visible {
  outline: 2px solid var(--card);
  outline-offset: 3px;
  background-color: var(--bench-2);
}
`;

export default function SchoolLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${form.variable} ${body.variable} ${stamp.variable} relative min-h-screen bg-[var(--bench)] font-[family-name:var(--font-body)] text-[var(--ink)]`}
      style={
        {
          // Manila card stock on a painted steel bench. Ink is warm near-black; the two
          // stamp pads are inspection green and hold red. Nothing here is gray: every
          // secondary tone is the card's own hue taken darker.
          "--bench": "#23251f",
          "--bench-2": "#2c2e27",
          "--bench-ink": "#ded2b6",
          "--bench-ink-2": "#a99a7c",
          "--card": "#ded2b6",
          "--card-2": "#d1c2a1",
          "--card-3": "#e9dfc7",
          "--ink": "#1b1a15",
          "--ink-2": "#504a38",
          "--ink-3": "#574f3a",
          "--rule": "#ab9d7b",
          "--rule-2": "#7c6f52",
          "--stamp": "#1a5a3d",
          "--hold": "#8f2e1a",
        } as React.CSSProperties
      }
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div aria-hidden className="tv-grain pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
