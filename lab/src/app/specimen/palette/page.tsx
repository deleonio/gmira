import { Source_Serif_4, Cutive_Mono } from "next/font/google";

/*
  Specimen plate for the gmira-palette skill.

  The material world: a 1962 mineral pigment field survey, six pigments ground
  from named minerals and recorded on aged manila card. One pigment, cinnabar,
  is committed as the plate: it owns the widest field on this card, the way
  doctrine section 3.2 asks a committed colour to own a region rather than a
  scattered accent.

  Every ratio printed below is the true WCAG relative luminance contrast
  between the two colours shown together, computed with the same formula the
  skill's own step 5 script runs against computed styles, not eyeballed from
  the swatch. Specimen 05 is a deliberate failure: a plain muted grey tried as
  secondary copy on the plate, exactly the mistake doctrine 3.2 names. It
  measures 2.4:1 and is marked rejected.

  The survey date, locality and accession number are fictional, invented only
  to give this specimen card something concrete to hold.
*/

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--specimen-serif",
});

const mono = Cutive_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--specimen-mono",
});

const SERIF = "font-[family-name:var(--specimen-serif)]";
const MONO = "font-[family-name:var(--specimen-mono)]";

const STOCK = "#EAE0C6"; // aged manila card stock: the ground
const INK = "#241C12"; // lamp black ink, dense on manila: primary copy
const INK2 = "#5E5440"; // ink at a weak wash: secondary copy and captions
const CINNABAR = "#9C3620"; // ground cinnabar, mercury sulfide: the plate, committed
const MALACHITE = "#386148"; // ground malachite, copper carbonate: second role
const AZURITE = "#33546C"; // ground azurite, copper carbonate: third role
const REJECT = "#9B9488"; // a default muted grey, tried on the plate and rejected below

const RULE = `color-mix(in oklab, ${CINNABAR} 26%, ${STOCK})`; // the plate tinted into the stock, never flat grey

type SwatchProps = {
  spec: string;
  role: string;
  name: string;
  material: string;
  ratio: string;
  pairing: string;
  oklch: string;
  bg: string;
  fg: string;
  fg2?: string;
  wide?: boolean;
  big?: boolean;
};

function Swatch({ spec, role, name, material, ratio, pairing, oklch, bg, fg, fg2, wide, big }: SwatchProps) {
  const secondary = fg2 ?? fg;
  return (
    <div
      className={`flex flex-col justify-between px-6 py-5 ${wide ? "col-span-2" : ""}`}
      style={{ backgroundColor: bg }}
    >
      <div className={`${MONO} flex items-baseline justify-between text-[12px] leading-none tracking-[0.06em]`}>
        <span style={{ color: secondary }}>
          {spec}, {role}
        </span>
        <span style={{ color: secondary }}>PASS</span>
      </div>

      <div>
        <p
          className={`${SERIF} font-bold leading-none ${big ? "text-[32px]" : "text-[22px]"}`}
          style={{ color: fg }}
        >
          {name}
        </p>
        <p
          className={`${SERIF} mt-1 italic leading-snug ${big ? "max-w-[48ch] text-[15px]" : "max-w-[28ch] text-[13px]"}`}
          style={{ color: secondary }}
        >
          {material}
        </p>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p
            className={`${SERIF} tabular-nums font-black leading-none ${big ? "text-[74px]" : "text-[42px]"}`}
            style={{ color: fg }}
          >
            {ratio}
          </p>
          <p className={`${MONO} mt-1 text-[12px] leading-snug tracking-[0.02em]`} style={{ color: secondary }}>
            {pairing}
          </p>
        </div>
        <p className={`${MONO} shrink-0 text-[12px] leading-snug`} style={{ color: secondary }}>
          {oklch}
        </p>
      </div>
    </div>
  );
}

function Rejected() {
  return (
    <div
      className="flex flex-col justify-between border-2 border-dashed px-6 py-5"
      style={{ backgroundColor: STOCK, borderColor: CINNABAR }}
    >
      <div className={`${MONO} flex items-baseline justify-between text-[12px] leading-none tracking-[0.06em]`}>
        <span style={{ color: INK2 }}>SPEC. 05, REJECTED</span>
        <span style={{ color: CINNABAR }}>FAILS</span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`${SERIF} text-[22px] font-bold leading-none`} style={{ color: INK }}>
            Muted grey
          </p>
          <p className={`${SERIF} mt-1 max-w-[24ch] text-[13px] italic leading-snug`} style={{ color: INK2 }}>
            tried as secondary copy on the plate
          </p>
        </div>
        <span
          className={`${MONO} shrink-0 border-2 px-2 py-0.5 text-[12px] leading-snug uppercase tracking-[0.05em]`}
          style={{ borderColor: CINNABAR, color: CINNABAR, transform: "rotate(-8deg)" }}
        >
          Rejected
        </span>
      </div>

      <div className="flex items-center justify-between px-3 py-2" style={{ backgroundColor: CINNABAR }}>
        <span className={`${MONO} text-[13px] leading-snug`} style={{ color: REJECT }}>
          Secondary copy
        </span>
        <span className={`${MONO} text-[13px] leading-snug`} style={{ color: REJECT }}>
          2.4:1
        </span>
      </div>

      <p className={`${MONO} text-[12px] leading-snug`} style={{ color: INK2 }}>
        fails the 4.5 floor: retint from the hue
      </p>
    </div>
  );
}

export default function PalettePlate() {
  return (
    <div
      className={`${serif.variable} ${mono.variable} flex h-[750px] w-[1200px] flex-col overflow-hidden px-10 py-10`}
      style={{ backgroundColor: STOCK, color: INK, boxShadow: `inset 0 0 0 1px ${RULE}` }}
    >
      <header className="flex items-start justify-between gap-8 border-b pb-4" style={{ borderColor: RULE }}>
        <div className="min-w-0 flex-1">
          <p className={`${MONO} text-[13px] leading-none uppercase tracking-[0.16em]`} style={{ color: INK2 }}>
            Material world, field survey 1962
          </p>
          <h1
            className={`${SERIF} mt-2 text-[46px] font-black leading-[1.05] tracking-[-0.01em]`}
            style={{ color: CINNABAR }}
          >
            The Plate Commits the Page
          </h1>
          <p className={`${SERIF} mt-2 text-[16px] italic leading-snug`} style={{ color: INK2 }}>
            Six ground pigments, one committed plate. Measured, not eyeballed.
          </p>
        </div>

        <div className="shrink-0 border px-4 py-3 text-right" style={{ borderColor: RULE }}>
          <p className={`${MONO} text-[13px] leading-none tracking-[0.06em]`} style={{ color: INK }}>
            NO. 014-B
          </p>
          <p className={`${MONO} mt-1 text-[12px] leading-snug tracking-[0.06em]`} style={{ color: INK2 }}>
            STRATEGY: COMMITTED
          </p>
        </div>
      </header>

      <div className="mt-5 grid h-[476px] grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[repeat(2,minmax(0,1fr))] gap-4">
        <Swatch
          spec="SPEC. 01"
          role="GROUND"
          name="Stock"
          material="Aged manila card, warm and dulled"
          ratio="12.8:1"
          pairing="ink on stock"
          oklch="oklch(0.91 0.04 89)"
          bg={STOCK}
          fg={INK}
          fg2={INK2}
        />
        <Swatch
          spec="SPEC. 02"
          role="PLATE / COMMITTED"
          name="Cinnabar"
          material="Ground mercury sulfide, the survey's second ink"
          ratio="5.4:1"
          pairing="stock reversed on cinnabar"
          oklch="oklch(0.48 0.14 34)"
          bg={CINNABAR}
          fg={STOCK}
          wide
          big
        />
        <Swatch
          spec="SPEC. 03"
          role="SECOND ROLE"
          name="Malachite"
          material="Ground copper carbonate, green"
          ratio="5.4:1"
          pairing="stock on malachite"
          oklch="oklch(0.46 0.06 156)"
          bg={MALACHITE}
          fg={STOCK}
        />
        <Swatch
          spec="SPEC. 04"
          role="THIRD ROLE"
          name="Azurite"
          material="Ground copper carbonate, blue"
          ratio="6.1:1"
          pairing="stock on azurite"
          oklch="oklch(0.43 0.06 241)"
          bg={AZURITE}
          fg={STOCK}
        />
        <Rejected />
      </div>

      <footer
        className={`${MONO} mt-4 flex items-center justify-between border-t pt-2 text-[12px] leading-none tracking-[0.02em]`}
        style={{ borderColor: RULE, color: INK2 }}
      >
        <span className="border px-2 py-1" style={{ borderColor: RULE }}>
          gmira-palette
        </span>
        <span>field survey and accession number are fictional</span>
      </footer>
    </div>
  );
}
