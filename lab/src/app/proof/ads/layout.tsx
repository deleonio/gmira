import type { Metadata } from "next";
import { Anton, IBM_Plex_Mono, Libre_Franklin } from "next/font/google";

/*
  DIRECTION CONTRACT  (gmira-direction)
  World drawn by external index, seed "gtm-ugc|2026-07-25", hash 153508950, 153508950 mod 5 = 0,
  which selects world 1 of the five in playbooks/gtm-ugc-school.md section 6.

  THESIS          Paid creative is a fight for 1.2 seconds, so every ad is billed as a bout,
                  including the one that lost money.
  OWN-WORLD       A boxing fight bill and undercard. Goldenrod poster stock, black letterpress
                  ink, one oxblood spot, ultra condensed wood type, a tale of the tape, a
                  ticket band across the foot, a promoter's mark at the head.
                  TELL: on the undercard the display size is computed from each week's output
                  count, so week 1 at 40 written hooks is set largest and week 6 at 3 launched
                  variants smallest. The card carries exactly three rule weights, 6px, 2px, 1px.
  STORY           Opens as a bill of bouts with the evidence beside each one, closes as a ticket
                  band carrying the price, the close date and the refund wording in full.
  FIRST VIEWPORT  Promoter's mark, the illustrative card overprint, the card title, the main
                  event bout line (a named ad against the thumb) with its round count and
                  weight class, the venue line, then the ticket line.
  FORM            A bill, never a card grid. Every set is a stack of bouts divided by rules and
                  ordered by billing. Bout lines run full width with flush left and flush right
                  metadata around centred names. Everything off the bill (rate card, rights,
                  specs, compliance) is a flush left ledger in mono. No boxed card anywhere.

  COLOR STRATEGY  Committed. The goldenrod is the ground, not an accent on a neutral, so the
                  colour carries most of the surface. Oxblood is the single spot and is used
                  for the referee marks, the overprint and the loss. One reversed plate at the
                  foot, one at the venue strip.

  REFUSALS LOGGED (G2)
  - The vertical's rut (near black ground, acid accent, five rem income claim, VSL thumbnail,
    countdown, struck through bonus stack, gold guarantee seal): excluded.
  - The obvious counter (quiet Swiss editorial, white ground, thin serif, muted greys) and the
    second counter (brutalist all mono black page): both excluded.
  - No arsenal component installed. The playbook's picks for this vertical (webgl-liquid,
    scroll-tilted-grid, letter-cascade, sticky-scroll-cards) are all screen effects, and this
    world is print. Installing one would import that registry's house style into a letterpress
    bill, which is doctrine Part 5 tell 12. Page weight also matters here because the traffic
    is paid.
  - G0b idle: no pointer driven effect exists on either route, so Law 3 does not apply.
*/

const bill = Anton({
  variable: "--font-bill",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const copy = Libre_Franklin({
  variable: "--font-copy",
  subsets: ["latin"],
  display: "swap",
});

const spec = IBM_Plex_Mono({
  variable: "--font-spec",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Six Weeks On The Card / a working programme in paid creative",
  description:
    "Six weeks of paid creative taught by the bout: 40 hooks a week, a critique block, a rate card and a rights schedule. Illustrative card, synthetic advertiser data.",
};

export default function AdsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${bill.variable} ${copy.variable} ${spec.variable} min-h-screen bg-[var(--stock)] font-[family-name:var(--font-copy)] text-[var(--ink)]`}
      style={
        {
          // Poster stock, press black, one oxblood spot. Measured against the ground:
          // ink 10.5:1, ink-2 6.1:1, spot 5.8:1, all on --stock.
          "--stock": "#e4c02c",
          "--stock-2": "#d4b026",
          "--ink": "#16120a",
          "--ink-2": "#4a3c15",
          "--rule": "#a8891b",
          "--spot": "#7f171b",
          "--spot-hi": "#c1272d",
          "--plate": "#16120a",
          "--plate-ink": "#f3e6bd",
          "--plate-ink-2": "#b09a63",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
