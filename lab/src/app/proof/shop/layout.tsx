import type { Metadata } from "next";
import { Bitter, IBM_Plex_Mono, Libre_Franklin } from "next/font/google";

/*
  DIRECTION CONTRACT  (gmira-direction, world drawn by external index)

  Draw: node -e "const s='ecommerce|2026-07-25';let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0"
        -> 1015729786, mod 5 = 1 -> world 2 of ecommerce.md section 6, the seed packet rack.
        Fused with candidate 6, a dyer shade card. Full record: .gmira/surfaces/shop.md

  THESIS          A dyed cloth is a dated batch with a measured fastness, not a colourway.
  OWN-WORLD       A seed packet rack fused with a dyer shade card. Kraft stock, two ink colours
                  per packet, the dense reverse carrying the whole data model at 11px.
                  TELL: every product hangs from a rail. A 1px rail line crosses the full row
                  and each packet has a punched hang hole straddling it. Every colour carries a
                  lightfastness figure drawn as eight boxes filled to the blue wool grade.
  STORY           Opens as a rack read across three rails, resolves into one packet turned over.
  FIRST VIEWPORT  Rack header with the dye lot range, the four dye plants with their fastness
                  figures, the rail A label, and the lead packet already hanging. No photograph.
  FORM            A rack, never a grid. Three rails of decreasing format: one packet, then two
                  of unequal width, then small goods as rows. Colour lives on paper and never on
                  the board. Square corners on every packet, round only on the punched hole.

  MODE            Operate on all three routes. Effect budget spent: nothing. No canvas, no
                  shader, no scroll choreography, no animated counters, no parallax. The single
                  authored moment is a 140ms colour change on the dye band when the variant
                  switches, tied to the control that caused it, killed by prefers-reduced-motion.

  REFUSED (G2)    card grid, hero photograph, tracked uppercase eyebrow over every section,
                  three-icon value row, founder story, newsletter modal, announcement bar,
                  gradient text, canvas anything. None appear.

  COLOUR RULE     Body carries ink only (--ink on both boards, --ink-2 on --board only).
                  Paper carries ink, secondary ink, label ink and all four dye inks. A dye band
                  carries paper-coloured text only. Every pair measured at or above 4.5:1.
*/

const body = Libre_Franklin({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const packet = Bitter({
  variable: "--font-packet",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const spec = IBM_Plex_Mono({
  variable: "--font-spec",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Faerbergarten Wilster / Rack 2026",
  description:
    "Plant dyed wool and linen for the bed and the table. Every cloth carries its dye lot, its vat date and its blue wool fastness grade.",
};

export default function ShopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${body.variable} ${packet.variable} ${spec.variable} min-h-screen bg-[var(--board)] font-[family-name:var(--font-body)] text-[var(--ink)]`}
      style={
        {
          // The board is the shop fixture. Paper is the packet. Colour is the dye, and it
          // only ever appears on paper, which is why the board can stay a flat mid tone.
          "--board": "#b8b19a",
          "--board-2": "#a79f86",
          "--stock": "#f0e8d4",
          "--stock-2": "#e6dcc2",
          "--ink": "#1e1a11",
          "--ink-2": "#443d2c",
          "--ink-3": "#615941",
          "--rule": "#a49a7c",
          "--rail": "#6f684f",
          "--madder": "#963020",
          "--weld": "#6d5610",
          "--woad": "#284768",
          "--walnut": "#523e28",
          "--onion": "#8a4b16",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
