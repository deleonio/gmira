import { Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";

/*
  SPECIMEN PLATE: gmira-arsenal.

  World draw (gmira-arsenal:2026-07-25, worlds.md index): A27 Jacquard punch card
  chain, B10 1970s parts microfiche catalogue. World 10 supplies the surface: a warm
  backlit field, high contrast ink, and a table whose right column reads as a
  supersession note. World 27 supplies one mechanism only: the two diff cards read as
  one card relaced through a punched seam, not a redraw.

  Thesis: the arsenal ships broken and welded. Repair is a table read in one pass.
  Taming is one line moving from a hardcoded constant to a prop with a safe default.
  Everything sits in the first viewport, on purpose: this is a plate, not a page.
*/

const displayFont = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "900"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-plate-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const FIELD = "#F5F1E4";
const INK = "#17150F";
const INK_MUTED = "#584F3A";
const RULE = "#B7AD91";
const RED = "#8F2E1A";
const RED_WASH = "#F2E0DA";
const GREEN = "#1A5A3D";
const GREEN_WASH = "#DEEADD";

const repairRows: Array<{ item: string; fault: string; fix: string }> = [
  { item: "circuit-board", fault: "cn resolves outside @/", fix: "@/lib/utils" },
  { item: "scroll-choreography", fault: "framer-motion missing", fix: "declare dependency" },
  { item: "image-trail", fault: "gsap missing", fix: "declare dependency" },
  { item: "mac-keyboard", fault: "lucide-react missing", fix: "declare dependency" },
  { item: "testimonial-marquee", fault: "declares it, never imports it", fix: "drop the import" },
];

export const metadata = {
  title: "gmira-arsenal, specimen plate",
  description: "Repair pass and welded constant diff for the gmira-arsenal skill.",
};

export default function ArsenalSpecimenPlate() {
  return (
    <div
      className={`${displayFont.variable} ${monoFont.variable} relative h-[750px] w-[1200px] overflow-hidden select-none`}
      style={{ backgroundColor: FIELD, color: INK, fontFamily: "var(--font-plate-mono)" }}
    >
      {/* Backlit reader vignette: darker at the four corners, flat where the type sits. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 820px 600px at 50% 46%, transparent 58%, rgba(23,21,15,0.13) 100%)",
        }}
      />
      {/* Faint drafting grid: the line art a backlit fiche field is read against. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${INK} 1px, transparent 1px), linear-gradient(90deg, ${INK} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.045,
        }}
      />
      {/* Plate edge. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 border" style={{ borderColor: RULE }} />

      <div className="relative flex h-full flex-col px-10 py-7">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between">
          <div>
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: INK_MUTED }}
            >
              gmira arsenal
            </p>
            <h1
              className="mt-1 font-[family-name:var(--font-display)] text-[46px] font-black uppercase leading-[0.92] tracking-[-0.01em]"
              style={{ color: INK }}
            >
              Install then tame
            </h1>
          </div>
          <p
            className="pt-1 text-right text-[12px] uppercase tracking-[0.10em]"
            style={{ color: INK_MUTED }}
          >
            56 components audited
          </p>
        </div>

        {/* Repair pass */}
        <div className="mt-7 flex shrink-0 flex-col">
          <div className="flex items-baseline justify-between">
            <h2
              className="font-[family-name:var(--font-display)] text-[21px] font-bold uppercase tracking-[0.01em]"
              style={{ color: INK }}
            >
              Repair pass
            </h2>
            <p className="text-[11px] uppercase tracking-[0.10em]" style={{ color: INK_MUTED }}>
              run before any page is written
            </p>
          </div>
          <div className="mt-2 h-px w-full" style={{ backgroundColor: RULE }} />

          <div className="mt-4 flex items-center gap-8">
            {/* stat balloons */}
            <div className="flex w-[200px] shrink-0 flex-col gap-5">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border-2"
                  style={{ borderColor: RED }}
                >
                  <span
                    className="font-[family-name:var(--font-display)] text-[32px] font-black leading-none"
                    style={{ color: INK }}
                  >
                    12
                  </span>
                </div>
                <p
                  className="text-[11.5px] font-semibold uppercase leading-tight tracking-[0.06em]"
                  style={{ color: RED }}
                >
                  broken
                  <br />
                  imports
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border-2"
                  style={{ borderColor: RED }}
                >
                  <span
                    className="font-[family-name:var(--font-display)] text-[32px] font-black leading-none"
                    style={{ color: INK }}
                  >
                    10
                  </span>
                </div>
                <p
                  className="text-[11.5px] font-semibold uppercase leading-tight tracking-[0.06em]"
                  style={{ color: RED }}
                >
                  undeclared
                  <br />
                  deps
                </p>
              </div>
            </div>

            {/* table */}
            <div className="flex flex-1 flex-col">
              <div
                className="grid grid-cols-[210px_1fr_170px] gap-4 pb-[6px] text-[10.5px] font-semibold uppercase tracking-[0.10em]"
                style={{ color: INK_MUTED }}
              >
                <span>Item</span>
                <span>Fault</span>
                <span>Superseded by</span>
              </div>
              <div className="h-px w-full" style={{ backgroundColor: RULE }} />
              {repairRows.map((row) => (
                <div
                  key={row.item}
                  className="grid grid-cols-[210px_1fr_170px] items-center gap-4 border-b py-[7px] text-[13px]"
                  style={{ borderColor: "rgba(183,173,145,0.45)" }}
                >
                  <span className="truncate font-medium" style={{ color: INK }}>
                    {row.item}
                  </span>
                  <span className="flex items-center gap-2" style={{ color: INK_MUTED }}>
                    <span aria-hidden className="text-[14px] font-bold" style={{ color: RED }}>
                      &times;
                    </span>
                    {row.fault}
                  </span>
                  <span className="flex items-center gap-2" style={{ color: INK_MUTED }}>
                    <span aria-hidden className="text-[14px] font-bold" style={{ color: GREEN }}>
                      +
                    </span>
                    {row.fix}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diff panel */}
        <div className="mt-7 flex flex-1 flex-col">
          <div className="flex items-baseline justify-between">
            <h2
              className="font-[family-name:var(--font-display)] text-[21px] font-bold uppercase tracking-[0.01em]"
              style={{ color: INK }}
            >
              The welded constant
            </h2>
            <p className="text-[12px] tracking-[0.02em]" style={{ color: INK_MUTED }}>
              dither-prism-hero, uMouseIntensity
            </p>
          </div>
          <div className="mt-2 h-px w-full" style={{ backgroundColor: RULE }} />

          <div className="mt-4 flex flex-1 items-stretch">
            <DiffCard
              tone="red"
              chip="Welded"
              contextOpen="uniforms: {"
              marker="-"
              code="uMouseIntensity: { value: 0.8 },"
              contextClose="}"
              caption="No prop reaches this. Reassigned every frame."
            />

            <div className="relative w-10 shrink-0">
              <div
                aria-hidden
                className="absolute top-3 bottom-3 left-1/2 w-px -translate-x-1/2"
                style={{ backgroundColor: RULE }}
              />
              <div aria-hidden className="relative flex h-full flex-col items-center justify-between py-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-[7px] w-[7px] rounded-full border"
                    style={{ backgroundColor: FIELD, borderColor: RULE }}
                  />
                ))}
              </div>
            </div>

            <DiffCard
              tone="green"
              chip="Tamed"
              contextOpen="uniforms: {"
              marker="+"
              code="uMouseIntensity: { value: mouseIntensity },"
              contextClose="}"
              caption="Prop, default 0. Raise only if the surface tracks the pointer."
            />
          </div>
        </div>

        {/* Footer. Skill mark sits on the right: the left corner is reserved by the
            dev server's own floating badge, and a printed plate would never let its
            own colophon collide with someone else's stamp. */}
        <div
          className="mt-5 flex shrink-0 items-center justify-between border-t pt-3"
          style={{ borderColor: RULE }}
        >
          <p className="text-[12px] uppercase tracking-[0.10em]" style={{ color: INK_MUTED }}>
            Install, repair, tame
          </p>
          <p className="text-[12px] tracking-[0.04em]" style={{ color: INK_MUTED }}>
            gmira-arsenal
          </p>
        </div>
      </div>
    </div>
  );
}

function DiffCard({
  tone,
  chip,
  contextOpen,
  marker,
  code,
  contextClose,
  caption,
}: {
  tone: "red" | "green";
  chip: string;
  contextOpen: string;
  marker: string;
  code: string;
  contextClose: string;
  caption: string;
}) {
  const accent = tone === "red" ? RED : GREEN;
  const wash = tone === "red" ? RED_WASH : GREEN_WASH;
  return (
    <div className="flex flex-1 flex-col justify-center border p-5" style={{ borderColor: accent }}>
      <span
        className="mb-3 inline-flex w-fit items-center px-2 py-[3px] text-[11px] font-semibold uppercase tracking-[0.14em]"
        style={{ backgroundColor: accent, color: FIELD }}
      >
        {chip}
      </span>
      <div className="text-[15px] leading-[1.6]">
        <div style={{ color: INK_MUTED }}>{contextOpen}</div>
        <div
          className="-mx-2 flex items-baseline gap-2 px-2 font-semibold"
          style={{ backgroundColor: wash, color: accent }}
        >
          <span aria-hidden>{marker}</span>
          <span>{code}</span>
        </div>
        <div style={{ color: INK_MUTED }}>{contextClose}</div>
      </div>
      <p className="mt-3 text-[12.5px] leading-snug" style={{ color: INK_MUTED }}>
        {caption}
      </p>
    </div>
  );
}
