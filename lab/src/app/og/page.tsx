import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

const sans = IBM_Plex_Sans({ variable: "--o-sans", subsets: ["latin"], weight: ["400", "600"] });
const mono = IBM_Plex_Mono({ variable: "--o-mono", subsets: ["latin"], weight: ["400", "500"] });

// Social card, screenshotted at exactly 1200x630 into docs/og.png.
// It is the two real screenshots from Finding 01, not an illustration, because the actual
// output is more persuasive than anything drawn on top of it.
//
// Both sources are 1440x900 and both carry a clipped last line and a small dev badge along
// their bottom edge, baked in at capture time. A 545x316 panel with object-top scales to the
// full width and crops only that bottom strip, so nothing that matters is lost.

const PANEL_W = 545;
const PANEL_H = 330;

export default function OgCard() {
  return (
    <>
      {/* the dev overlay is a custom element and would otherwise sit in the capture */}
      <style>{`nextjs-portal{display:none!important}`}</style>

      <div
        className={`${sans.variable} ${mono.variable} h-[630px] w-[1200px] overflow-hidden bg-[#12110e] font-[family-name:var(--o-sans)] text-[#efece4]`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between px-10 pt-8">
            <div>
              <h1 className="text-[52px] font-semibold leading-none tracking-[-0.035em]">
                GMIRA{" "}
                <span className="ml-1 align-middle text-[30px] text-[#d8b23a]">ܓܡܝܪܐ</span>
              </h1>
              <p className="mt-2.5 font-[family-name:var(--o-mono)] text-[13.5px] text-[#c2beb3]">
                A component library raises the ceiling. It does nothing to the floor.
              </p>
            </div>
            <p className="pt-1 text-right font-[family-name:var(--o-mono)] text-[11.5px] leading-[1.7] text-[#a7a399]">
              same component
              <br />
              same brief
              <br />
              same palette props
            </p>
          </div>

          <div className="flex justify-between px-10 pt-6">
            {[
              { src: "/og/slop.png", tag: "installed", note: "defaults honoured nothing" },
              { src: "/og/tamed.png", tag: "tamed", note: "four line patch" },
            ].map((p) => (
              <figure
                key={p.tag}
                className="relative shrink-0 overflow-hidden border border-[#3d3b35]"
                style={{ width: PANEL_W, height: PANEL_H, borderRadius: 2 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" className="h-full w-full object-cover object-top" />
                {/* Both sources are crops of a taller page, so whatever line the crop lands on
                    gets cut. A short fade to the card background makes that read as a fade
                    rather than as a mistake, and it is robust to the exact panel height. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
                  style={{ background: "linear-gradient(to bottom, rgba(18,17,14,0) 0%, rgba(18,17,14,0.92) 78%, #12110e 100%)" }}
                />
                <figcaption className="absolute left-0 top-0 flex items-baseline gap-2 bg-[#12110e] px-2.5 py-1.5">
                  <span className="font-[family-name:var(--o-mono)] text-[12px] font-medium uppercase tracking-[0.16em] text-[#d8b23a]">
                    {p.tag}
                  </span>
                  <span className="font-[family-name:var(--o-mono)] text-[10.5px] text-[#a7a399]">
                    {p.note}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-[#3d3b35] px-10 py-3.5">
            <p className="font-[family-name:var(--o-mono)] text-[12.5px] text-[#c2beb3]">
              21 Claude Code skills. Direction before elements.
            </p>
            <p className="font-[family-name:var(--o-mono)] text-[12.5px] text-[#a7a399]">
              github.com/OthmanAdi/gmira
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
