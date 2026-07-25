import type { Metadata } from "next";
import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";

/*
  DIRECTION CONTRACT  (gmira-direction, drawn by external index, seed "car-shop|2026-07-25")

  THESIS          A used car is a documented object with a condition, not a lifestyle promise.
  OWN-WORLD       An industrial auction catalogue (Ritchie Bros machinery sale, Bonhams lot book).
                  Newsprint-weight paper, two-colour print budget, lot numbers set in mono,
                  hairline rules between every row, plates printed small with tight captions.
                  TELL: every vehicle carries a lot number and a condition grade struck as a
                  rotated red stamp, and the price is printed as a hammer estimate range.
  STORY           Opens as a sale schedule, resolves into one lot examined in full.
  FIRST VIEWPORT  Sale header with date and location, the lot count, the condition-grade key,
                  and the first three lots already visible as rows. No photograph above the fold.
  FORM            An index, never a card grid. Vehicles are rows in a lot list ordered by lot
                  number. Condition grade is the organising column, price is the last column.
                  One horizontal rule weight, 0.5px. Nothing is centered. No rounded corners
                  above 2px anywhere on the page.
*/

const archivo = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const serif = Instrument_Serif({
  variable: "--font-plate",
  subsets: ["latin"],
  weight: "400",
});

const mono = JetBrains_Mono({
  variable: "--font-lot",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Sale 14 / Neumünster / Kraftfahrzeuge",
  description:
    "Lot list for sale 14. Each lot is graded, documented, and sold as inspected.",
};

export default function CarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${archivo.variable} ${serif.variable} ${mono.variable} min-h-screen bg-[var(--paper)] font-[family-name:var(--font-body)] text-[var(--ink)] [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-[var(--stamp)]`}
      style={
        {
          // Two-colour print budget: ink and stamp, on paper. Everything else is a tint of ink.
          // Every tint below is measured against --paper and carries its ratio. The first pass
          // used #9b9585 for labels, which lands at 2.53:1 and failed 90 elements per viewport.
          // Hierarchy comes from size and weight instead, which is the doctrine's rule anyway.
          "--paper": "#efece4",
          "--paper-2": "#e5e1d6",
          "--ink": "#16150f", // 14.9:1
          "--ink-60": "#55503f", // 6.83:1  secondary body
          "--ink-35": "#6f6a5c", // 4.57:1  labels and units, the floor
          "--rule": "#c9c4b5", // non-text, decorative only
          "--stamp": "#a8321e", // 5.31:1
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
