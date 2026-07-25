// ILLUSTRATIVE CATALOGUE. Every figure below is invented for the Gmira e-commerce proof:
// the dye garden, the mill, the lot numbers, the stock counts and the company registration are
// not a real business. Each route prints that fact on screen as well (doctrine G7). Field names
// follow the content model in references/playbooks/ecommerce.md section 1 so the pages render
// what a real PIM export actually carries, including the fields most stores drop.
//
// Money is integer cents end to end (gmira-flow step 9). Nothing accumulates floats.
// Formatting is done by hand rather than by Intl so the server and the client cannot disagree
// about a separator and produce a hydration error.

export type Currency = "EUR";
export type TaxMode = "inclusive" | "exclusive";

export interface Money {
  cents: number;
  currency: Currency;
  taxMode: TaxMode;
  taxRatePercent: number;
}

export interface Measurement {
  value: number;
  unit: "mm" | "cm" | "m" | "g" | "kg" | "gsm";
}

/* ---------------------------------------------------------------------------
   Dye plants. The organising axis of the whole store: colour is a batch of a
   named plant with a measured fastness, not a swatch name.
   Lightfastness is the blue wool scale, 1 to 8, ISO 105-B02.
   Wash fastness is grey scale, 1 to 5, ISO 105-C06.
--------------------------------------------------------------------------- */

export type DyeId = "madder" | "weld" | "woad" | "walnut" | "onion";

export interface Dye {
  id: DyeId;
  name: string;
  botanical: string;
  part: string;
  hex: string;
  cssVar: string;
  lightfastness: number;
  washfastness: number;
  note: string;
  /** A closed dye. Still in the key, because a buyer who owns one asks about it. */
  retired?: { lastLot: string; closedOn: string; reason: string };
}

export const DYES: Record<DyeId, Dye> = {
  madder: {
    id: "madder",
    name: "Madder",
    botanical: "Rubia tinctorum",
    part: "Root, third year",
    hex: "#963020",
    cssVar: "--madder",
    lightfastness: 6,
    washfastness: 4,
    note: "Shifts toward brick in a south window over one summer. It stops there and stays.",
  },
  weld: {
    id: "weld",
    name: "Weld",
    botanical: "Reseda luteola",
    part: "Whole plant, cut at flower",
    hex: "#6d5610",
    cssVar: "--weld",
    lightfastness: 4,
    washfastness: 4,
    note: "The least lightfast of the four. Grade 4 of 8. We print it rather than round it up.",
  },
  woad: {
    id: "woad",
    name: "Woad",
    botanical: "Isatis tinctoria",
    part: "First year leaf",
    hex: "#284768",
    cssVar: "--woad",
    lightfastness: 7,
    washfastness: 5,
    note: "Vat dyed, so the colour sits on the fibre. Rubs off on a white shirt for the first week.",
  },
  walnut: {
    id: "walnut",
    name: "Walnut",
    botanical: "Juglans regia",
    part: "Green hull",
    hex: "#523e28",
    cssVar: "--walnut",
    lightfastness: 5,
    washfastness: 4,
    note: "One harvest from eight trees behind the shed. When the hulls run out the lot closes.",
  },
  onion: {
    id: "onion",
    name: "Onion skin",
    botanical: "Allium cepa",
    part: "Dry outer skin",
    hex: "#8a4b16",
    cssVar: "--onion",
    lightfastness: 3,
    washfastness: 3,
    note: "Grade 3 of 8. It went orange in a window inside two summers and we stopped selling it.",
    retired: {
      lastLot: "19",
      closedOn: "2025-10-14",
      reason:
        "It is a good colour for two summers and a poor one after that, and we could not print that on a blanket costing 249 EUR.",
    },
  },
};

export const DYE_ORDER: DyeId[] = ["madder", "weld", "woad", "walnut", "onion"];
export const DYES_ACTIVE: DyeId[] = ["madder", "weld", "woad", "walnut"];

/* ---------------------------------------------------------------------------
   Inventory and the three availability semantics this proof exists to show.

   not_made   the combination was never produced and never will be in this lot.
              Its option carries the real HTML `disabled` attribute: it is out of
              the tab order because there is nothing to read and nothing to do,
              and the reason is printed next to the axis, not in a tooltip.
   sold_out   produced, currently zero, not orderable. Its option carries NO
              disabled attribute and NO aria-disabled, because it is genuinely
              operable: selecting it is how the restock date and the notify
              control appear. `aria-disabled` goes on the add control instead,
              which is the one thing that really cannot act.
   backorder  produced, currently zero, orderable against a named future lot.
              Fully selectable and fully buyable, with the ship date stated.
--------------------------------------------------------------------------- */

export interface Inventory {
  policy: "deny" | "continue";
  onHand: number;
  committed: number;
  available: number;
  lowStockThreshold: number;
  backorderable: boolean;
  restockExpected?: string;
  restockUnknownNote?: string;
  discontinued: boolean;
}

export interface Variant {
  id: string;
  sku: string;
  optionValues: { Colour: string; Size: string };
  dye: DyeId;
  size: string;
  price?: Money;
  inventory: Inventory;
  dyeLot?: string;
  vattedOn?: string;
  madeInThisCombination: boolean;
  notMadeReason?: string;
  measurements?: Record<string, Measurement>;
  weightOverride?: Measurement;
}

export type VariantState =
  | { kind: "in_stock"; available: number }
  | { kind: "low_stock"; available: number }
  | { kind: "backorder"; restock: string }
  | { kind: "sold_out"; restock?: string; note?: string }
  | { kind: "not_made"; reason: string };

export function variantState(v: Variant): VariantState {
  if (!v.madeInThisCombination) {
    return { kind: "not_made", reason: v.notMadeReason ?? "Not made in this combination." };
  }
  const a = v.inventory.available;
  if (a <= 0 && v.inventory.backorderable && v.inventory.restockExpected) {
    return { kind: "backorder", restock: v.inventory.restockExpected };
  }
  if (a <= 0) {
    return {
      kind: "sold_out",
      restock: v.inventory.restockExpected,
      note: v.inventory.restockUnknownNote,
    };
  }
  if (a <= v.inventory.lowStockThreshold) return { kind: "low_stock", available: a };
  return { kind: "in_stock", available: a };
}

/** Buyable means the add control can complete. Sold out and not made cannot. */
export function isBuyable(v: Variant): boolean {
  const s = variantState(v);
  return s.kind === "in_stock" || s.kind === "low_stock" || s.kind === "backorder";
}

/* --------------------------------------------------------------------------- */

export interface SizeSpec {
  name: string;
  label: string;
  finishedCm: { width: number; length: number };
  priceCents: number;
  packedWeightG: number;
  shippingClass: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  gloss: string;
  subtitle: string;
  productType: string;
  rail: "A" | "B" | "C";
  status: "active" | "draft" | "archived";
  launchedAt: string;
  seo: { title: string; description: string };

  materials: Array<{
    component: string;
    composition: Array<{ fibre: string; percent: number }>;
    weight?: Measurement;
    mill?: string;
    countryOfOrigin: string;
    certifications: string[];
  }>;
  construction: string[];
  madeIn: string;
  factory: { name: string; city: string; countryCode: string; workers: number };
  careInstructions: string[];
  expectedBehaviour: string[];
  lifespanNote?: string;
  repairable: boolean;
  repairNote?: string;

  loomWidthCm?: number;
  sizes: SizeSpec[];
  sizeChart: {
    method: "garment_flat" | "body";
    units: "cm";
    tolerance: string;
    howMeasured: string;
  };

  media: Array<{ plate: number; alt: string; kind: string; dye?: DyeId }>;

  price: Money;
  compareAtPrice?: Money;
  giftWrapAvailable: boolean;

  compliance: {
    hsCode: string;
    euResponsiblePerson: { name: string; address: string; email: string };
    warnings: string[];
    packagingRecycling: Array<{ part: string; material: string; stream: string }>;
  };

  shipping: {
    shipsFrom: { warehouse: string; countryCode: string };
    handlingDays: number;
    restrictions: string[];
  };

  variants: Variant[];
  updatedAt: string;
}

/* Helper so every variant still declares its own real numbers without 40 copies
   of the boilerplate fields. onHand minus committed is the number displayed. */
function stock(opts: {
  onHand: number;
  committed?: number;
  low?: number;
  backorderable?: boolean;
  restockExpected?: string;
  restockUnknownNote?: string;
  policy?: "deny" | "continue";
}): Inventory {
  const committed = opts.committed ?? 0;
  return {
    policy: opts.policy ?? "deny",
    onHand: opts.onHand,
    committed,
    available: opts.onHand - committed,
    lowStockThreshold: opts.low ?? 3,
    backorderable: opts.backorderable ?? false,
    restockExpected: opts.restockExpected,
    restockUnknownNote: opts.restockUnknownNote,
    discontinued: false,
  };
}

const RP = {
  name: "Faerbergarten Wilster GmbH",
  address: "Deichreihe 4, 25554 Wilster, Germany",
  email: "produkt@faerbergarten-wilster.example",
};

const PACKAGING = [
  { part: "Outer", material: "Corrugated board, 80 percent recycled", stream: "Papier" },
  { part: "Inner sleeve", material: "Unbleached kraft, no coating", stream: "Papier" },
  { part: "Tie", material: "Undyed cotton tape", stream: "Restmuell" },
];

/* =========================================================================
   RAIL A. One packet. The lead.
   ========================================================================= */

const MARSCHDECKE_SIZES: SizeSpec[] = [
  {
    name: "130x190",
    label: "Single",
    finishedCm: { width: 130, length: 190 },
    priceCents: 18900,
    packedWeightG: 1980,
    shippingClass: "Parcel, up to 5 kg",
  },
  {
    name: "160x220",
    label: "Double",
    finishedCm: { width: 160, length: 220 },
    priceCents: 24900,
    packedWeightG: 2820,
    shippingClass: "Parcel, up to 5 kg",
  },
  {
    name: "200x240",
    label: "King",
    finishedCm: { width: 200, length: 240 },
    priceCents: 31900,
    packedWeightG: 3840,
    shippingClass: "Parcel, up to 10 kg, bulky surcharge outside DE",
  },
];

function price(cents: number): Money {
  return { cents, currency: "EUR", taxMode: "inclusive", taxRatePercent: 19 };
}

/* The 12 cell matrix. Two cells were never made, two are sold out, one is on
   backorder against lot 27, two are low. This is the availability proof. */
const MARSCHDECKE_VARIANTS: Variant[] = [
  {
    id: "md-mad-130",
    sku: "MD-24-MAD-130",
    optionValues: { Colour: "Madder", Size: "130x190" },
    dye: "madder",
    size: "130x190",
    price: price(18900),
    dyeLot: "24",
    vattedOn: "2026-04-18",
    madeInThisCombination: true,
    inventory: stock({ onHand: 8, committed: 2 }),
  },
  {
    id: "md-mad-160",
    sku: "MD-24-MAD-160",
    optionValues: { Colour: "Madder", Size: "160x220" },
    dye: "madder",
    size: "160x220",
    price: price(24900),
    dyeLot: "24",
    vattedOn: "2026-04-18",
    madeInThisCombination: true,
    inventory: stock({ onHand: 3, committed: 1 }),
  },
  {
    id: "md-mad-200",
    sku: "MD-24-MAD-200",
    optionValues: { Colour: "Madder", Size: "200x240" },
    dye: "madder",
    size: "200x240",
    price: price(31900),
    dyeLot: "24",
    vattedOn: "2026-04-18",
    madeInThisCombination: true,
    inventory: stock({
      onHand: 0,
      backorderable: true,
      policy: "continue",
      restockExpected: "2026-09-14 to 2026-09-21",
    }),
  },
  {
    id: "md-wel-130",
    sku: "MD-25-WEL-130",
    optionValues: { Colour: "Weld", Size: "130x190" },
    dye: "weld",
    size: "130x190",
    price: price(18900),
    dyeLot: "25",
    vattedOn: "2026-05-06",
    madeInThisCombination: true,
    inventory: stock({ onHand: 5, committed: 1 }),
  },
  {
    id: "md-wel-160",
    sku: "MD-25-WEL-160",
    optionValues: { Colour: "Weld", Size: "160x220" },
    dye: "weld",
    size: "160x220",
    price: price(24900),
    dyeLot: "25",
    vattedOn: "2026-05-06",
    madeInThisCombination: true,
    inventory: stock({ onHand: 0, restockExpected: "2026-09-14 to 2026-09-21" }),
  },
  {
    id: "md-wel-200",
    sku: "MD-25-WEL-200",
    optionValues: { Colour: "Weld", Size: "200x240" },
    dye: "weld",
    size: "200x240",
    madeInThisCombination: false,
    notMadeReason:
      "Weld is dyed in the 1,800 litre vat. A 200 by 240 cloth needs room to move or it stripes, so this size is not made in weld at all.",
    inventory: stock({ onHand: 0 }),
  },
  {
    id: "md-woa-130",
    sku: "MD-24-WOA-130",
    optionValues: { Colour: "Woad", Size: "130x190" },
    dye: "woad",
    size: "130x190",
    price: price(18900),
    dyeLot: "24",
    vattedOn: "2026-04-18",
    madeInThisCombination: true,
    inventory: stock({ onHand: 11, committed: 2 }),
  },
  {
    id: "md-woa-160",
    sku: "MD-24-WOA-160",
    optionValues: { Colour: "Woad", Size: "160x220" },
    dye: "woad",
    size: "160x220",
    price: price(24900),
    dyeLot: "24",
    vattedOn: "2026-04-18",
    madeInThisCombination: true,
    inventory: stock({ onHand: 6, committed: 1 }),
  },
  {
    id: "md-woa-200",
    sku: "MD-24-WOA-200",
    optionValues: { Colour: "Woad", Size: "200x240" },
    dye: "woad",
    size: "200x240",
    price: price(31900),
    dyeLot: "24",
    vattedOn: "2026-04-18",
    madeInThisCombination: true,
    inventory: stock({ onHand: 1 }),
  },
  {
    id: "md-wal-130",
    sku: "MD-26-WAL-130",
    optionValues: { Colour: "Walnut", Size: "130x190" },
    dye: "walnut",
    size: "130x190",
    madeInThisCombination: false,
    notMadeReason:
      "Walnut comes from one hull harvest. The single size was dropped in 2025 so the bigger cloths could be finished from the same bath.",
    inventory: stock({ onHand: 0 }),
  },
  {
    id: "md-wal-160",
    sku: "MD-26-WAL-160",
    optionValues: { Colour: "Walnut", Size: "160x220" },
    dye: "walnut",
    size: "160x220",
    price: price(24900),
    dyeLot: "26",
    vattedOn: "2026-06-02",
    madeInThisCombination: true,
    inventory: stock({
      onHand: 0,
      restockUnknownNote:
        "We do not know yet. The hulls fall in late September and we count them then. Leave an address and you get one message when the vat is up, nothing else.",
    }),
  },
  {
    id: "md-wal-200",
    sku: "MD-26-WAL-200",
    optionValues: { Colour: "Walnut", Size: "200x240" },
    dye: "walnut",
    size: "200x240",
    price: price(31900),
    dyeLot: "26",
    vattedOn: "2026-06-02",
    madeInThisCombination: true,
    inventory: stock({ onHand: 4, committed: 1 }),
  },
];

/* =========================================================================
   The catalogue
   ========================================================================= */

export const PRODUCTS: Product[] = [
  {
    id: "p-marschdecke",
    handle: "marschdecke",
    title: "Marschdecke",
    gloss: "marsh blanket",
    subtitle:
      "640 gsm lambswool in a 2 by 2 twill, dyed in the lot printed on the packet and finished flat.",
    productType: "Blanket",
    rail: "A",
    status: "active",
    launchedAt: "2023-10-02",
    seo: {
      title: "Marschdecke, plant dyed lambswool blanket, 640 gsm",
      description:
        "A 640 gsm lambswool blanket dyed with madder, weld, woad or walnut. Lot number, vat date and blue wool fastness grade printed on every packet.",
    },
    materials: [
      {
        component: "Body",
        composition: [{ fibre: "Lambswool", percent: 100 }],
        weight: { value: 640, unit: "gsm" },
        mill: "Spinnerei Kollmar, Kollmar",
        countryOfOrigin: "DE",
        certifications: [],
      },
      {
        component: "Edge stitch",
        composition: [{ fibre: "Wool", percent: 100 }],
        countryOfOrigin: "DE",
        certifications: [],
      },
    ],
    construction: [
      "Woven 2 by 2 twill on a 190 cm loom",
      "Blanket stitched by hand in undyed yarn, about 40 minutes an edge",
      "Fulled once, dried flat, never tumbled",
    ],
    madeIn: "DE",
    factory: { name: "Weberei Wilster", city: "Wilster", countryCode: "DE", workers: 11 },
    careInstructions: [
      "Wash at 30 on a wool programme, spin no higher than 600.",
      "Dry flat and out of the sun. A line dries it faster and puts a crease down the middle.",
      "Airing beats washing. Two hours outside on a damp morning takes the smell out.",
      "No bleach and no fabric softener. Softener coats the fibre and the cloth stops breathing.",
    ],
    expectedBehaviour: [
      "It loses about 3 percent in length on the first wash, so we weave it long and quote the finished size.",
      "Two cloths from different lots will not match. Lot 24 madder is browner than lot 22 was.",
      "Woad rubs off on a white pillowcase for the first week. It stops.",
      "The edge stitch relaxes in the first month and the corners sit flatter.",
    ],
    lifespanNote:
      "The oldest one we have back for repair is from 2019 and is on its second edge. The cloth itself has not thinned.",
    repairable: true,
    repairNote:
      "We restitch an edge for 28 EUR plus postage, both ways paid by us inside Germany. Send it dirty, we wash it.",
    loomWidthCm: 190,
    sizes: MARSCHDECKE_SIZES,
    sizeChart: {
      method: "garment_flat",
      units: "cm",
      tolerance: "plus or minus 2 cm",
      howMeasured:
        "Laid flat on the cutting bench after washing and drying, measured edge to edge with a steel tape, not including the blanket stitch.",
    },
    media: [
      { plate: 1, alt: "The whole cloth flat on the cutting bench, madder lot 24, seen from above.", kind: "flat_lay", dye: "madder" },
      { plate: 2, alt: "Corner detail at 1 to 1, showing the blanket stitch in undyed yarn and the twill line.", kind: "detail" },
      { plate: 3, alt: "The same cloth folded on a bed, 160 by 220, for scale against a standard pillow.", kind: "scale_reference" },
      { plate: 4, alt: "Woad lot 24 and madder lot 24 side by side under a north window, unretouched.", kind: "studio", dye: "woad" },
      { plate: 5, alt: "The packet as it arrives: kraft sleeve, cotton tie, lot card tucked under the tie.", kind: "packaging" },
    ],
    price: price(18900),
    giftWrapAvailable: false,
    compliance: {
      hsCode: "6301.20",
      euResponsiblePerson: RP,
      warnings: [],
      packagingRecycling: PACKAGING,
    },
    shipping: {
      shipsFrom: { warehouse: "Wilster", countryCode: "DE" },
      handlingDays: 2,
      restrictions: [],
    },
    variants: MARSCHDECKE_VARIANTS,
    updatedAt: "2026-07-23",
  },

  /* ---------------- RAIL B ---------------- */
  {
    id: "p-deichlaeufer",
    handle: "deichlaeufer",
    title: "Deichlaeufer",
    gloss: "dyke walker",
    subtitle: "380 gsm lambswool throw, the same yarn at half the weight, for a chair rather than a bed.",
    productType: "Throw",
    rail: "B",
    status: "active",
    launchedAt: "2024-03-11",
    seo: {
      title: "Deichlaeufer, plant dyed lambswool throw, 380 gsm",
      description: "A 380 gsm lambswool throw in madder, woad or walnut, with the lot and fastness grade printed.",
    },
    materials: [
      {
        component: "Body",
        composition: [{ fibre: "Lambswool", percent: 100 }],
        weight: { value: 380, unit: "gsm" },
        mill: "Spinnerei Kollmar, Kollmar",
        countryOfOrigin: "DE",
        certifications: [],
      },
    ],
    construction: ["Woven plain on a 160 cm loom", "Hand knotted fringe, 8 cm", "Fulled once, dried flat"],
    madeIn: "DE",
    factory: { name: "Weberei Wilster", city: "Wilster", countryCode: "DE", workers: 11 },
    careInstructions: [
      "Wash at 30 on a wool programme, spin no higher than 600.",
      "Comb the fringe out flat while it is damp or it dries in a rope.",
    ],
    expectedBehaviour: [
      "Lighter than the Marschdecke and it pills at the fold for the first two months. Comb it, do not shave it.",
      "The fringe shortens by about 1 cm as the knots tighten.",
    ],
    repairable: true,
    repairNote: "We reknot a fringe for 18 EUR plus postage.",
    loomWidthCm: 160,
    sizes: [
      {
        name: "130x180",
        label: "Chair",
        finishedCm: { width: 130, length: 180 },
        priceCents: 13900,
        packedWeightG: 1120,
        shippingClass: "Parcel, up to 5 kg",
      },
      {
        name: "150x200",
        label: "Sofa",
        finishedCm: { width: 150, length: 200 },
        priceCents: 16900,
        packedWeightG: 1420,
        shippingClass: "Parcel, up to 5 kg",
      },
    ],
    sizeChart: {
      method: "garment_flat",
      units: "cm",
      tolerance: "plus or minus 2 cm",
      howMeasured: "Flat after washing, measured without the fringe.",
    },
    media: [
      { plate: 1, alt: "Throw flat on the bench, walnut lot 26, fringe combed straight.", kind: "flat_lay", dye: "walnut" },
      { plate: 2, alt: "Fringe knot detail at 1 to 1.", kind: "detail" },
    ],
    price: price(13900),
    giftWrapAvailable: false,
    compliance: { hsCode: "6301.20", euResponsiblePerson: RP, warnings: [], packagingRecycling: PACKAGING },
    shipping: { shipsFrom: { warehouse: "Wilster", countryCode: "DE" }, handlingDays: 2, restrictions: [] },
    variants: [
      {
        id: "dl-mad-130",
        sku: "DL-24-MAD-130",
        optionValues: { Colour: "Madder", Size: "130x180" },
        dye: "madder",
        size: "130x180",
        price: price(13900),
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 14, committed: 3 }),
      },
      {
        id: "dl-mad-150",
        sku: "DL-24-MAD-150",
        optionValues: { Colour: "Madder", Size: "150x200" },
        dye: "madder",
        size: "150x200",
        price: price(16900),
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 2 }),
      },
      {
        id: "dl-woa-130",
        sku: "DL-24-WOA-130",
        optionValues: { Colour: "Woad", Size: "130x180" },
        dye: "woad",
        size: "130x180",
        price: price(13900),
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 9, committed: 1 }),
      },
      {
        id: "dl-woa-150",
        sku: "DL-24-WOA-150",
        optionValues: { Colour: "Woad", Size: "150x200" },
        dye: "woad",
        size: "150x200",
        price: price(16900),
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 0, restockExpected: "2026-08-25 to 2026-08-29" }),
      },
      {
        id: "dl-wal-130",
        sku: "DL-26-WAL-130",
        optionValues: { Colour: "Walnut", Size: "130x180" },
        dye: "walnut",
        size: "130x180",
        price: price(13900),
        dyeLot: "26",
        vattedOn: "2026-06-02",
        madeInThisCombination: true,
        inventory: stock({ onHand: 6 }),
      },
      {
        id: "dl-wal-150",
        sku: "DL-26-WAL-150",
        optionValues: { Colour: "Walnut", Size: "150x200" },
        dye: "walnut",
        size: "150x200",
        price: price(16900),
        dyeLot: "26",
        vattedOn: "2026-06-02",
        madeInThisCombination: true,
        inventory: stock({ onHand: 3, committed: 1 }),
      },
    ],
    updatedAt: "2026-07-21",
  },
  {
    id: "p-tagesdecke",
    handle: "leinen-tagesdecke",
    title: "Leinen Tagesdecke",
    gloss: "linen day cover",
    subtitle: "Washed linen at 240 gsm. It goes over the bed in the day and off it at night.",
    productType: "Coverlet",
    rail: "B",
    status: "active",
    launchedAt: "2025-04-08",
    seo: {
      title: "Leinen Tagesdecke, plant dyed washed linen coverlet",
      description: "A 240 gsm washed linen coverlet in weld or woad, stone washed before dyeing.",
    },
    materials: [
      {
        component: "Body",
        composition: [{ fibre: "Linen", percent: 100 }],
        weight: { value: 240, unit: "gsm" },
        mill: "Weberei Meissner, Zittau",
        countryOfOrigin: "DE",
        certifications: [],
      },
    ],
    construction: ["Plain weave", "Stone washed before dyeing so the shrinkage is spent", "Mitred corners, double turned hem"],
    madeIn: "DE",
    factory: { name: "Weberei Wilster", city: "Wilster", countryCode: "DE", workers: 11 },
    careInstructions: [
      "Wash at 40. Linen likes it hotter than wool does.",
      "Take it out damp and it presses itself on the bed.",
    ],
    expectedBehaviour: [
      "It creases and that is the material, not a fault.",
      "Weld on linen sits lighter than weld on wool. The shade card shows both.",
      "It softens for about a year and then stops changing.",
    ],
    repairable: true,
    loomWidthCm: 260,
    sizes: [
      {
        name: "180x260",
        label: "Double",
        finishedCm: { width: 180, length: 260 },
        priceCents: 21900,
        packedWeightG: 1240,
        shippingClass: "Parcel, up to 5 kg",
      },
      {
        name: "240x260",
        label: "King",
        finishedCm: { width: 240, length: 260 },
        priceCents: 26900,
        packedWeightG: 1660,
        shippingClass: "Parcel, up to 5 kg",
      },
    ],
    sizeChart: {
      method: "garment_flat",
      units: "cm",
      tolerance: "plus or minus 3 cm, linen moves more than wool",
      howMeasured: "Flat after washing, hem to hem.",
    },
    media: [
      { plate: 1, alt: "Coverlet on a made bed, weld lot 25, morning light from the left.", kind: "in_use", dye: "weld" },
      { plate: 2, alt: "Mitred corner and double turned hem at 1 to 1.", kind: "detail" },
    ],
    price: price(21900),
    giftWrapAvailable: false,
    compliance: { hsCode: "6302.29", euResponsiblePerson: RP, warnings: [], packagingRecycling: PACKAGING },
    shipping: { shipsFrom: { warehouse: "Wilster", countryCode: "DE" }, handlingDays: 2, restrictions: [] },
    variants: [
      {
        id: "td-wel-180",
        sku: "TD-25-WEL-180",
        optionValues: { Colour: "Weld", Size: "180x260" },
        dye: "weld",
        size: "180x260",
        price: price(21900),
        dyeLot: "25",
        vattedOn: "2026-05-06",
        madeInThisCombination: true,
        inventory: stock({ onHand: 7, committed: 1 }),
      },
      {
        id: "td-wel-240",
        sku: "TD-25-WEL-240",
        optionValues: { Colour: "Weld", Size: "240x260" },
        dye: "weld",
        size: "240x260",
        price: price(26900),
        dyeLot: "25",
        vattedOn: "2026-05-06",
        madeInThisCombination: true,
        inventory: stock({ onHand: 3 }),
      },
      {
        id: "td-woa-180",
        sku: "TD-24-WOA-180",
        optionValues: { Colour: "Woad", Size: "180x260" },
        dye: "woad",
        size: "180x260",
        price: price(21900),
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 5 }),
      },
      {
        id: "td-woa-240",
        sku: "TD-24-WOA-240",
        optionValues: { Colour: "Woad", Size: "240x260" },
        dye: "woad",
        size: "240x260",
        price: price(26900),
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 0, backorderable: true, policy: "continue", restockExpected: "2026-09-01 to 2026-09-05" }),
      },
    ],
    updatedAt: "2026-07-22",
  },

  /* ---------------- RAIL C ---------------- */
  {
    id: "p-kissenbezug",
    handle: "kissenbezug",
    title: "Kissenbezug",
    gloss: "cushion cover",
    subtitle: "The blanket cloth cut down, backed in undyed linen, closed with a wooden button.",
    productType: "Cushion cover",
    rail: "C",
    status: "active",
    launchedAt: "2024-09-19",
    seo: {
      title: "Kissenbezug, plant dyed wool cushion cover",
      description: "Cushion cover in the 640 gsm blanket cloth, linen backed, 40 by 40 or 50 by 50.",
    },
    materials: [
      {
        component: "Face",
        composition: [{ fibre: "Lambswool", percent: 100 }],
        weight: { value: 640, unit: "gsm" },
        mill: "Spinnerei Kollmar, Kollmar",
        countryOfOrigin: "DE",
        certifications: [],
      },
      {
        component: "Back",
        composition: [{ fibre: "Linen", percent: 100 }],
        weight: { value: 240, unit: "gsm" },
        countryOfOrigin: "DE",
        certifications: [],
      },
    ],
    construction: ["Cut from blanket offcuts, so the lot varies within a size", "Horn button, 20 mm", "Inner flap, no zip"],
    madeIn: "DE",
    factory: { name: "Weberei Wilster", city: "Wilster", countryCode: "DE", workers: 11 },
    careInstructions: ["Wash at 30 on a wool programme.", "Take the button off before a hot wash. It is horn, it will craze."],
    expectedBehaviour: [
      "Cut from offcuts, so the shade can differ from the blanket you own. Say the word in the order note and we match it or we tell you we cannot.",
    ],
    repairable: true,
    sizes: [
      {
        name: "40x40",
        label: "Small",
        finishedCm: { width: 40, length: 40 },
        priceCents: 5900,
        packedWeightG: 320,
        shippingClass: "Small parcel, up to 2 kg",
      },
      {
        name: "50x50",
        label: "Standard",
        finishedCm: { width: 50, length: 50 },
        priceCents: 6900,
        packedWeightG: 440,
        shippingClass: "Small parcel, up to 2 kg",
      },
    ],
    sizeChart: { method: "garment_flat", units: "cm", tolerance: "plus or minus 1 cm", howMeasured: "Flat, seam to seam, empty." },
    media: [
      { plate: 1, alt: "Cover flat, madder lot 24 face up, horn button centred.", kind: "flat_lay", dye: "madder" },
      { plate: 2, alt: "Back of the cover showing the undyed linen and the inner flap.", kind: "detail" },
    ],
    price: price(5900),
    giftWrapAvailable: false,
    compliance: { hsCode: "6304.92", euResponsiblePerson: RP, warnings: [], packagingRecycling: PACKAGING },
    shipping: { shipsFrom: { warehouse: "Wilster", countryCode: "DE" }, handlingDays: 2, restrictions: [] },
    variants: [
      {
        id: "kb-mad-40",
        sku: "KB-24-MAD-40",
        optionValues: { Colour: "Madder", Size: "40x40" },
        dye: "madder",
        size: "40x40",
        price: price(5900),
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 22, committed: 4 }),
      },
      {
        id: "kb-mad-50",
        sku: "KB-24-MAD-50",
        optionValues: { Colour: "Madder", Size: "50x50" },
        dye: "madder",
        size: "50x50",
        price: price(6900),
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 17, committed: 2 }),
      },
      {
        id: "kb-woa-40",
        sku: "KB-24-WOA-40",
        optionValues: { Colour: "Woad", Size: "40x40" },
        dye: "woad",
        size: "40x40",
        price: price(5900),
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 2 }),
      },
      {
        id: "kb-woa-50",
        sku: "KB-24-WOA-50",
        optionValues: { Colour: "Woad", Size: "50x50" },
        dye: "woad",
        size: "50x50",
        price: price(6900),
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 12, committed: 1 }),
      },
      {
        id: "kb-wal-40",
        sku: "KB-26-WAL-40",
        optionValues: { Colour: "Walnut", Size: "40x40" },
        dye: "walnut",
        size: "40x40",
        price: price(5900),
        dyeLot: "26",
        vattedOn: "2026-06-02",
        madeInThisCombination: true,
        inventory: stock({ onHand: 0, restockExpected: "2026-10-06 to 2026-10-17" }),
      },
      {
        id: "kb-wal-50",
        sku: "KB-26-WAL-50",
        optionValues: { Colour: "Walnut", Size: "50x50" },
        dye: "walnut",
        size: "50x50",
        price: price(6900),
        dyeLot: "26",
        vattedOn: "2026-06-02",
        madeInThisCombination: true,
        inventory: stock({ onHand: 8 }),
      },
    ],
    updatedAt: "2026-07-20",
  },
  {
    id: "p-kuechentuch",
    handle: "kuechentuch",
    title: "Kuechentuch",
    gloss: "kitchen cloth",
    subtitle: "Half linen, waffle woven, 50 by 70. It dries a glass without leaving anything behind.",
    productType: "Kitchen cloth",
    rail: "C",
    status: "active",
    launchedAt: "2023-06-01",
    seo: {
      title: "Kuechentuch, plant dyed half linen kitchen cloth",
      description: "Waffle woven half linen kitchen cloth, 50 by 70 cm, in all four dye plants.",
    },
    materials: [
      {
        component: "Body",
        composition: [
          { fibre: "Linen", percent: 60 },
          { fibre: "Cotton", percent: 40 },
        ],
        weight: { value: 210, unit: "gsm" },
        mill: "Weberei Meissner, Zittau",
        countryOfOrigin: "DE",
        certifications: [],
      },
    ],
    construction: ["Waffle weave, 6 mm cell", "Hanging loop at one corner", "Overlocked and turned hem"],
    madeIn: "DE",
    factory: { name: "Weberei Wilster", city: "Wilster", countryCode: "DE", workers: 11 },
    careInstructions: ["Wash at 60. This one is meant to be boiled if it needs it.", "No softener, it kills the absorbency."],
    expectedBehaviour: [
      "The first two washes it barely absorbs. The finish has to come off. From the third it works.",
      "Weld fades fastest of the four in a sunny kitchen. Grade 4 of 8.",
    ],
    repairable: false,
    sizes: [
      {
        name: "50x70",
        label: "One size",
        finishedCm: { width: 50, length: 70 },
        priceCents: 2400,
        packedWeightG: 130,
        shippingClass: "Letter parcel, up to 1 kg",
      },
    ],
    sizeChart: { method: "garment_flat", units: "cm", tolerance: "plus or minus 2 cm", howMeasured: "Flat after washing, hem to hem." },
    media: [
      { plate: 1, alt: "Four cloths overlapped, one of each dye, on the bench under a north window.", kind: "flat_lay" },
      { plate: 2, alt: "Waffle cell at 1 to 1 with a 10 mm scale bar.", kind: "detail" },
    ],
    price: price(2400),
    giftWrapAvailable: false,
    compliance: { hsCode: "6302.60", euResponsiblePerson: RP, warnings: [], packagingRecycling: PACKAGING },
    shipping: { shipsFrom: { warehouse: "Wilster", countryCode: "DE" }, handlingDays: 1, restrictions: [] },
    variants: [
      {
        id: "kt-mad",
        sku: "KT-24-MAD-50",
        optionValues: { Colour: "Madder", Size: "50x70" },
        dye: "madder",
        size: "50x70",
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 48, committed: 6, low: 6 }),
      },
      {
        id: "kt-wel",
        sku: "KT-25-WEL-50",
        optionValues: { Colour: "Weld", Size: "50x70" },
        dye: "weld",
        size: "50x70",
        dyeLot: "25",
        vattedOn: "2026-05-06",
        madeInThisCombination: true,
        inventory: stock({ onHand: 31, committed: 4, low: 6 }),
      },
      {
        id: "kt-woa",
        sku: "KT-24-WOA-50",
        optionValues: { Colour: "Woad", Size: "50x70" },
        dye: "woad",
        size: "50x70",
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 5, low: 6 }),
      },
      {
        id: "kt-wal",
        sku: "KT-26-WAL-50",
        optionValues: { Colour: "Walnut", Size: "50x70" },
        dye: "walnut",
        size: "50x70",
        dyeLot: "26",
        vattedOn: "2026-06-02",
        madeInThisCombination: true,
        inventory: stock({ onHand: 26, committed: 2, low: 6 }),
      },
    ],
    updatedAt: "2026-07-24",
  },
  {
    id: "p-serviette",
    handle: "serviette-vier",
    title: "Serviette, set of four",
    gloss: "napkins",
    subtitle: "45 by 45 in the coverlet linen. Four to a sleeve, all from the same bath.",
    productType: "Napkin set",
    rail: "C",
    status: "active",
    launchedAt: "2025-04-08",
    seo: {
      title: "Linen napkins, set of four, plant dyed",
      description: "Four 45 by 45 washed linen napkins from a single dye bath, so the set matches.",
    },
    materials: [
      {
        component: "Body",
        composition: [{ fibre: "Linen", percent: 100 }],
        weight: { value: 190, unit: "gsm" },
        mill: "Weberei Meissner, Zittau",
        countryOfOrigin: "DE",
        certifications: [],
      },
    ],
    construction: ["Mitred corners", "Hand rolled hem on two sides"],
    madeIn: "DE",
    factory: { name: "Weberei Wilster", city: "Wilster", countryCode: "DE", workers: 11 },
    careInstructions: ["Wash at 60 with the tablecloth.", "Wine comes out with cold water first, then a hot wash. Not the other way round."],
    expectedBehaviour: ["Four from one bath match each other. They will not match a set you bought last year."],
    repairable: false,
    sizes: [
      {
        name: "45x45",
        label: "Set of four",
        finishedCm: { width: 45, length: 45 },
        priceCents: 5600,
        packedWeightG: 260,
        shippingClass: "Letter parcel, up to 1 kg",
      },
    ],
    sizeChart: { method: "garment_flat", units: "cm", tolerance: "plus or minus 1 cm", howMeasured: "Flat after washing." },
    media: [{ plate: 1, alt: "Four napkins fanned, woad lot 24, showing the rolled hem.", kind: "flat_lay", dye: "woad" }],
    price: price(5600),
    giftWrapAvailable: false,
    compliance: { hsCode: "6302.51", euResponsiblePerson: RP, warnings: [], packagingRecycling: PACKAGING },
    shipping: { shipsFrom: { warehouse: "Wilster", countryCode: "DE" }, handlingDays: 1, restrictions: [] },
    variants: [
      {
        id: "sv-wel",
        sku: "SV-25-WEL-45",
        optionValues: { Colour: "Weld", Size: "45x45" },
        dye: "weld",
        size: "45x45",
        dyeLot: "25",
        vattedOn: "2026-05-06",
        madeInThisCombination: true,
        inventory: stock({ onHand: 14, committed: 2, low: 4 }),
      },
      {
        id: "sv-woa",
        sku: "SV-24-WOA-45",
        optionValues: { Colour: "Woad", Size: "45x45" },
        dye: "woad",
        size: "45x45",
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 0, restockExpected: "2026-08-25 to 2026-08-29", low: 4 }),
      },
      {
        id: "sv-wal",
        sku: "SV-26-WAL-45",
        optionValues: { Colour: "Walnut", Size: "45x45" },
        dye: "walnut",
        size: "45x45",
        dyeLot: "26",
        vattedOn: "2026-06-02",
        madeInThisCombination: true,
        inventory: stock({ onHand: 9, low: 4 }),
      },
    ],
    updatedAt: "2026-07-19",
  },
  {
    id: "p-tischlaeufer",
    handle: "tischlaeufer",
    title: "Tischlaeufer",
    gloss: "table runner",
    subtitle: "45 by 180, cut from the coverlet warp so the shade matches the Tagesdecke exactly.",
    productType: "Table runner",
    rail: "C",
    status: "active",
    launchedAt: "2025-09-02",
    seo: {
      title: "Linen table runner, plant dyed, 45 by 180",
      description: "A 45 by 180 washed linen runner cut from the coverlet warp, in madder or woad.",
    },
    materials: [
      {
        component: "Body",
        composition: [{ fibre: "Linen", percent: 100 }],
        weight: { value: 240, unit: "gsm" },
        mill: "Weberei Meissner, Zittau",
        countryOfOrigin: "DE",
        certifications: [],
      },
    ],
    construction: ["Cut from the coverlet warp", "Double turned hem all round"],
    madeIn: "DE",
    factory: { name: "Weberei Wilster", city: "Wilster", countryCode: "DE", workers: 11 },
    careInstructions: ["Wash at 40, press damp."],
    expectedBehaviour: ["Same warp as the Tagesdecke, so a runner and a coverlet from the same lot match. Different lots will not."],
    repairable: false,
    sizes: [
      {
        name: "45x180",
        label: "One size",
        finishedCm: { width: 45, length: 180 },
        priceCents: 6400,
        packedWeightG: 290,
        shippingClass: "Letter parcel, up to 1 kg",
      },
    ],
    sizeChart: { method: "garment_flat", units: "cm", tolerance: "plus or minus 2 cm", howMeasured: "Flat after washing, hem to hem." },
    media: [{ plate: 1, alt: "Runner down the length of a scrubbed pine table, madder lot 24.", kind: "in_use", dye: "madder" }],
    price: price(6400),
    giftWrapAvailable: false,
    compliance: { hsCode: "6302.51", euResponsiblePerson: RP, warnings: [], packagingRecycling: PACKAGING },
    shipping: { shipsFrom: { warehouse: "Wilster", countryCode: "DE" }, handlingDays: 1, restrictions: [] },
    variants: [
      {
        id: "tl-mad",
        sku: "TL-24-MAD-45",
        optionValues: { Colour: "Madder", Size: "45x180" },
        dye: "madder",
        size: "45x180",
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 11, committed: 1, low: 4 }),
      },
      {
        id: "tl-woa",
        sku: "TL-24-WOA-45",
        optionValues: { Colour: "Woad", Size: "45x180" },
        dye: "woad",
        size: "45x180",
        dyeLot: "24",
        vattedOn: "2026-04-18",
        madeInThisCombination: true,
        inventory: stock({ onHand: 3, low: 4 }),
      },
    ],
    updatedAt: "2026-07-24",
  },
  {
    id: "p-farbkarte",
    handle: "farbkarte",
    title: "Farbkarte",
    gloss: "shade card",
    subtitle: "The four dyes on wool and on linen, eight chips, stapled at one edge. Hex on a screen lies about wool.",
    productType: "Shade card",
    rail: "C",
    status: "active",
    launchedAt: "2023-06-01",
    seo: {
      title: "Farbkarte, plant dye shade card, eight chips",
      description: "Eight real cloth chips, four dyes on wool and on linen, with the lot and fastness grade on the back of each.",
    },
    materials: [
      {
        component: "Chips",
        composition: [
          { fibre: "Lambswool", percent: 50 },
          { fibre: "Linen", percent: 50 },
        ],
        countryOfOrigin: "DE",
        certifications: [],
      },
      {
        component: "Card",
        composition: [{ fibre: "Recycled board", percent: 100 }],
        weight: { value: 350, unit: "gsm" },
        countryOfOrigin: "DE",
        certifications: [],
      },
    ],
    construction: ["Eight chips, 60 by 40 mm", "Stapled at one edge so they fan", "Lot and grade printed on the back of each chip"],
    madeIn: "DE",
    factory: { name: "Weberei Wilster", city: "Wilster", countryCode: "DE", workers: 11 },
    careInstructions: ["Keep it out of the sun or it becomes a lightfastness experiment."],
    expectedBehaviour: ["Chips are cut from the current lot. Order it again next year and it will be a different card."],
    repairable: false,
    sizes: [
      {
        name: "60x40",
        label: "Eight chips",
        finishedCm: { width: 6, length: 4 },
        priceCents: 600,
        packedWeightG: 45,
        shippingClass: "Letter, up to 500 g",
      },
    ],
    sizeChart: { method: "garment_flat", units: "cm", tolerance: "plus or minus 0.2 cm", howMeasured: "Chip size, cut with a rotary blade." },
    media: [{ plate: 1, alt: "The card fanned open, eight chips, wool row above linen row.", kind: "studio" }],
    price: price(600),
    giftWrapAvailable: false,
    compliance: { hsCode: "6307.90", euResponsiblePerson: RP, warnings: [], packagingRecycling: PACKAGING },
    shipping: { shipsFrom: { warehouse: "Wilster", countryCode: "DE" }, handlingDays: 1, restrictions: [] },
    variants: [
      {
        id: "fk-all",
        sku: "FK-2026-ALL",
        optionValues: { Colour: "All four", Size: "60x40" },
        dye: "woad",
        size: "60x40",
        dyeLot: "24, 25, 26",
        vattedOn: "2026-06-02",
        madeInThisCombination: true,
        inventory: stock({ onHand: 140, committed: 12, low: 20 }),
      },
    ],
    updatedAt: "2026-07-24",
  },
];

/* =========================================================================
   Shop policy. The trust surface: who pays the return, where it goes back to,
   who is liable in the EU, and what a customs bill looks like per zone.
   ========================================================================= */

export const SHOP = {
  name: "Faerbergarten Wilster",
  strapline: "Dye garden and weaving shed, Wilster, Schleswig-Holstein",
  rackTitle: "Rack 2026",
  lotRange: "Lots 24 to 26",
  lotsOpen: [
    { lot: "24", vattedOn: "2026-04-18", dyes: ["madder", "woad"] as DyeId[], closedOn: "2026-04-30" },
    { lot: "25", vattedOn: "2026-05-06", dyes: ["weld"] as DyeId[], closedOn: "2026-05-14" },
    { lot: "26", vattedOn: "2026-06-02", dyes: ["walnut"] as DyeId[], closedOn: "2026-06-09" },
  ],
  nextLot: { lot: "27", vattingFrom: "2026-09-09", dyes: ["madder", "woad"] as DyeId[] },
  illustrative:
    "Illustrative catalogue built for the Gmira proof. The garden, the mill, the lot numbers and every stock figure on this rack are invented. Nothing here is for sale.",
  company: {
    legalName: "Faerbergarten Wilster GmbH",
    register: "HRB 00000 Amtsgericht Pinneberg",
    vatId: "DE000000000",
    address: "Deichreihe 4, 25554 Wilster, Germany",
    email: "post@faerbergarten-wilster.example",
    phone: "+49 4823 000000",
  },
  returns: {
    windowDays: 30,
    condition: "Unwashed and unused, with the lot card. A cloth you slept under for a night is fine, we wash it.",
    whoPaysReturn: "brand_within_eu" as const,
    outsideEuNote: "Outside the EU you pay the label and we refund the item, not the postage.",
    exchangeAvailable: true,
    exclusions: ["Shade cards, because they are cut to order", "Cloths cut to a length you specified"],
    address: "Faerbergarten Wilster GmbH, Retouren, Deichreihe 4, 25554 Wilster, Germany",
    refundProcessingDays: 5,
  },
  delivery: [
    {
      zone: "Germany",
      carrier: "DHL",
      service: "Paket",
      freeOverCents: 15000,
      priceCents: 495,
      estimateBusinessDays: { min: 1, max: 3 },
      dutiesHandling: "DDP" as const,
      note: "Ships Monday to Thursday from Wilster. An order placed Thursday after 12:00 leaves Monday.",
    },
    {
      zone: "EU",
      carrier: "DHL",
      service: "Paket International",
      freeOverCents: 35000,
      priceCents: 1290,
      estimateBusinessDays: { min: 3, max: 6 },
      dutiesHandling: "DDP" as const,
      note: "VAT is in the price shown. No further bill on delivery.",
    },
    {
      zone: "Switzerland and United Kingdom",
      carrier: "DHL",
      service: "Paket International",
      freeOverCents: 0,
      priceCents: 2490,
      estimateBusinessDays: { min: 4, max: 8 },
      dutiesHandling: "DAP" as const,
      note: "German VAT comes off at checkout and your own import VAT and duty are billed by the carrier on delivery. On a 249 EUR blanket to Switzerland that has run between 22 and 31 CHF.",
    },
  ],
  holdMinutes: 10,
  updatedAt: "2026-07-25",
};

export type Zone = (typeof SHOP.delivery)[number]["zone"];

/* --------------------------------------------------------------------------- */

/** Deterministic on server and client. Intl would risk a separator mismatch. */
export function eur(cents: number): string {
  const neg = cents < 0;
  const abs = Math.abs(cents);
  const int = Math.floor(abs / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const frac = String(abs % 100).padStart(2, "0");
  return `${neg ? "-" : ""}${int},${frac} EUR`;
}

/** VAT contained in a gross figure, at the given rate. Integer cents throughout. */
export function vatContained(grossCents: number, ratePercent: number): number {
  return Math.round(grossCents - grossCents / (1 + ratePercent / 100));
}

export function productByHandle(handle: string): Product | undefined {
  return PRODUCTS.find((p) => p.handle === handle);
}

export function variantOf(p: Product, dye: DyeId, size: string): Variant | undefined {
  return p.variants.find((v) => v.dye === dye && v.size === size);
}

export function dyesOf(p: Product): DyeId[] {
  return DYE_ORDER.filter((d) => p.variants.some((v) => v.dye === d));
}

export function priceRange(p: Product): { low: number; high: number } {
  const cents = p.variants
    .filter((v) => v.madeInThisCombination)
    .map((v) => v.price?.cents ?? p.price.cents);
  return { low: Math.min(...cents), high: Math.max(...cents) };
}

export function stockSummary(p: Product): { onRack: number; cells: number; madeCells: number } {
  const made = p.variants.filter((v) => v.madeInThisCombination);
  return {
    onRack: made.reduce((n, v) => n + Math.max(0, v.inventory.available), 0),
    cells: p.variants.length,
    madeCells: made.length,
  };
}
