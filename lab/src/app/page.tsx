import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

const sans = IBM_Plex_Sans({ variable: "--i-sans", subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = IBM_Plex_Mono({ variable: "--i-mono", subsets: ["latin"], weight: ["400", "500"] });

// The index is a contents page, not a landing page, and it has no world of its own on purpose.
// Anything expressive here would leak a house style across the four proofs it links to.

const PROOFS = [
  {
    slug: "car",
    vertical: "Independent car dealership, used and EV stock",
    world: "Industrial auction catalogue",
    drawn: "index 0 of 5, seed car-shop|2026-07-25",
    mode: "Persuade into Operate",
    form: "A lot list. Condition grade is the organising column, price is last. One rule weight at 0.5px, no cards, no hero photograph.",
    routes: [
      { href: "/proof/car", label: "Lot list" },
      { href: "/proof/car/K-2291", label: "Lot 101, VW ID.4" },
    ],
    status: "green" as const,
  },
  {
    slug: "school",
    vertical: "Applied AI engineering school, cohort programme",
    world: "Machine shop job traveller",
    drawn: "index 3 of 5, seed ai-school|2026-07-25",
    mode: "Persuade into Read",
    form: "One manila card punched down the binder edge. Operations numbered in tens, each carrying a rotated operator stamp. Prerequisites are an incoming inspection with reject-on-fail and advisory grades.",
    routes: [
      { href: "/proof/school", label: "Routing card" },
      { href: "/proof/school/op/030", label: "OP 030" },
    ],
    status: "green" as const,
  },
  {
    slug: "ads",
    vertical: "GTM and UGC ads school",
    world: "Boxing fight poster and undercard bill",
    drawn: "index 0 of 5, seed gtm-ugc|2026-07-25",
    mode: "Persuade",
    form: "Wood type on goldenrod, three rule weights. Undercard display size is computed from each week's output count, so the type scale carries information rather than decoration.",
    routes: [
      { href: "/proof/ads", label: "The card" },
      { href: "/proof/ads/kapsel-4am", label: "Teardown" },
    ],
    status: "green" as const,
  },
  {
    slug: "shop",
    vertical: "Direct-to-consumer store, natural dye textiles",
    world: "Seed packet rack fused with a dyer shade card",
    drawn: "index 1 of 5, seed ecommerce|2026-07-25",
    mode: "Operate",
    form: "Effect budget near zero and no WebGL installed. Dye lots carry real ISO fastness scales. The checkout names the steps it has not built rather than hiding them.",
    routes: [
      { href: "/proof/shop", label: "The rack" },
      { href: "/proof/shop/packet/marschdecke", label: "Packet" },
      { href: "/proof/shop/order", label: "Checkout" },
    ],
    status: "green" as const,
  },
];

export default function LabIndex() {
  return (
    <div
      className={`${sans.variable} ${mono.variable} min-h-screen bg-[#111110] font-[family-name:var(--i-sans)] text-[#e8e6e0] [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-[#d8b23a]`}
    >
      <main className="mx-auto max-w-[1000px] px-6 pb-24 pt-14 md:px-10">
        <header className="border-b border-[#3d3b35] pb-8">
          <p className="font-[family-name:var(--i-mono)] text-[11px] uppercase tracking-[0.2em] text-[#a7a399]">
            Gmira / proof surfaces
          </p>
          <h1 className="mt-4 max-w-[24ch] text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Four verticals. One skill library. No shared house style.
          </h1>
          <p className="mt-5 max-w-[70ch] text-[15.5px] leading-relaxed text-[#c2beb3]">
            Each surface below drew its material world by an external hash index rather than by
            preference, then committed to a written five-block direction before any element was
            placed. If two of them look related, the library failed its own claim.
          </p>
        </header>

        <ol className="mt-2">
          {PROOFS.map((p) => (
            <li key={p.slug} className="border-b border-[#3d3b35] py-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h2 className="text-[1.35rem] font-medium tracking-[-0.01em]">{p.vertical}</h2>
                <span
                  className={`font-[family-name:var(--i-mono)] text-[11px] uppercase tracking-[0.16em] ${
                    p.status === "green" ? "text-[#9fc46a]" : "text-[#a7a399]"
                  }`}
                >
                  {p.status === "green" ? "10 gates green" : "building"}
                </span>
              </div>

              <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-[10rem_1fr]">
                <dt className="font-[family-name:var(--i-mono)] text-[11px] uppercase tracking-[0.14em] text-[#a7a399]">
                  World
                </dt>
                <dd className="text-[15px]">
                  {p.world}
                  <span className="ml-2 font-[family-name:var(--i-mono)] text-[12px] text-[#a7a399]">
                    {p.drawn}
                  </span>
                </dd>

                <dt className="font-[family-name:var(--i-mono)] text-[11px] uppercase tracking-[0.14em] text-[#a7a399]">
                  Mode
                </dt>
                <dd className="text-[15px]">{p.mode}</dd>

                <dt className="font-[family-name:var(--i-mono)] text-[11px] uppercase tracking-[0.14em] text-[#a7a399]">
                  Form
                </dt>
                <dd className="max-w-[68ch] text-[15px] leading-relaxed text-[#c2beb3]">{p.form}</dd>
              </dl>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {p.routes.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="border border-[#54514a] px-4 py-2 font-[family-name:var(--i-mono)] text-[12px] transition-colors hover:border-[#d8b23a] hover:text-[#d8b23a]"
                    style={{ borderRadius: 2 }}
                  >
                    {r.label}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <footer className="pt-8 font-[family-name:var(--i-mono)] text-[11.5px] leading-relaxed text-[#a7a399]">
          <p className="max-w-[74ch]">
            All stock, course, and product data on these surfaces is illustrative and labelled as
            such on each page. Doctrine gate G7 forbids presenting invented metrics, testimonials,
            logos, or client names as real.
          </p>
        </footer>
      </main>
    </div>
  );
}
