// Illustrative stock for the Gmira car-shop proof. These are plausible lots, not a real
// dealer's inventory: the sale header labels them as illustrative so nothing here reads as a
// claim (doctrine G7). Field names follow the content model in
// references/playbooks/car-shop.md so the page renders what a real DMS export actually carries.

export type Grade = "A" | "B" | "C" | "D";

export const GRADE_KEY: Record<Grade, { label: string; note: string }> = {
  A: { label: "A", note: "No advisories. Paint original throughout, no rectification due." },
  B: { label: "B", note: "Cosmetic only. Listed marks, no mechanical work outstanding." },
  C: { label: "C", note: "Rectification identified and quoted. Sold with the quote attached." },
  D: { label: "D", note: "Sold as inspected. Known faults itemised. Trade bidders only." },
};

export type Energy =
  | {
      kind: "electric";
      batteryNetKwh: number;
      batteryGrossKwh: number;
      chemistry: "NMC" | "LFP" | "NCA";
      stateOfHealthPercent?: number;
      sohMeasuredAt?: string;
      sohMethod?: string;
      rangeWltpKm: number;
      rangeMeasured?: { km: number; conditions: string; measuredAt: string };
      dcPeakKw: number;
      dcTenToEightyMinutes: number;
      acOnboardChargerKw: 3.7 | 7.4 | 11 | 22;
      heatPump: boolean;
    }
  | {
      kind: "combustion";
      fuel: "petrol" | "diesel";
      displacementCcm: number;
      cylinders: number;
      consumptionCombinedL100: number;
      co2CombinedGkm: number;
      emissionsClass: string;
    };

export interface Lot {
  lot: number;
  stockNumber: string;
  vinLast6: string;
  make: string;
  model: string;
  trim: string;
  bodyStyle: string;
  exteriorColor: { name: string; hex: string; finish: string };
  interior: string;
  modelYear: number;
  firstRegistration: string;
  mileage: { value: number; unit: "km"; readAt: string };
  priorOwners: number;
  previousUse: "private" | "company" | "rental" | "demo" | "driving_school";
  power: { kw: number; hp: number };
  transmission: string;
  drivetrain: "fwd" | "rwd" | "awd";
  energy: Energy;
  inspectionDue: string;
  serviceComplete: boolean;
  serviceEntries: Array<{ date: string; mileage: number; workshop: string; work: string }>;
  grade: Grade;
  advisories: Array<{ item: string; detail: string; quoteEur?: number }>;
  tyres: { frontMm: number; rearMm: number; season: "summer" | "winter" | "allseason"; secondSetIncluded: boolean };
  estimate: { low: number; high: number };
  vat: { kind: "margin_scheme"; statute: "§25a UStG" } | { kind: "deductible"; ratePercent: 19 };
  location: string;
  updatedAt: string;
  status: "available" | "reserved" | "sold";
}

export const SALE = {
  number: 14,
  title: "Kraftfahrzeuge",
  location: "Neumünster",
  viewingFrom: "2026-08-03",
  saleDate: "2026-08-07",
  lotsTotal: 8,
  note: "Illustrative lot list built for the Gmira proof. Not a real sale.",
};

export const LOTS: Lot[] = [
  {
    lot: 101,
    stockNumber: "K-2291",
    vinLast6: "418823",
    make: "Volkswagen",
    model: "ID.4",
    trim: "Pro Performance 77 kWh",
    bodyStyle: "SUV",
    exteriorColor: { name: "Stonewash Blue", hex: "#4a5a68", finish: "metallic" },
    interior: "Cloth, anthracite",
    modelYear: 2021,
    firstRegistration: "2021-06",
    mileage: { value: 78420, unit: "km", readAt: "2026-07-18" },
    priorOwners: 2,
    previousUse: "private",
    power: { kw: 150, hp: 204 },
    transmission: "Single speed",
    drivetrain: "rwd",
    energy: {
      kind: "electric",
      batteryNetKwh: 77,
      batteryGrossKwh: 82,
      chemistry: "NMC",
      stateOfHealthPercent: 94,
      sohMeasuredAt: "2026-06-12",
      sohMethod: "Aviloo Flash, protocol attached as PDF",
      rangeWltpKm: 512,
      rangeMeasured: { km: 340, conditions: "130 km/h, 4 C, heating on", measuredAt: "2026-02-19" },
      dcPeakKw: 135,
      dcTenToEightyMinutes: 36,
      acOnboardChargerKw: 11,
      heatPump: true,
    },
    inspectionDue: "2028-04",
    serviceComplete: true,
    serviceEntries: [
      { date: "2025-06-04", mileage: 61200, workshop: "VW Zentrum Kiel", work: "Inspection, brake fluid, cabin filter" },
      { date: "2023-07-11", mileage: 32100, workshop: "VW Zentrum Kiel", work: "Inspection, software 3.2 update" },
    ],
    grade: "B",
    advisories: [
      { item: "Driver door, lower edge", detail: "Scratch 40 mm, through clearcoat only. Photographed as plate 18." },
      { item: "Charge flap", detail: "Return spring weak, closes on second attempt." },
    ],
    tyres: { frontMm: 6.5, rearMm: 7.0, season: "summer", secondSetIncluded: true },
    estimate: { low: 23500, high: 26000 },
    vat: { kind: "margin_scheme", statute: "§25a UStG" },
    location: "Neumünster, Halle 2",
    updatedAt: "2026-07-22",
    status: "available",
  },
  {
    lot: 102,
    stockNumber: "K-2288",
    vinLast6: "770145",
    make: "Skoda",
    model: "Octavia Combi",
    trim: "2.0 TDI Style DSG",
    bodyStyle: "Estate",
    exteriorColor: { name: "Graphite Grey", hex: "#4c4e50", finish: "metallic" },
    interior: "Part leather, black",
    modelYear: 2020,
    firstRegistration: "2020-03",
    mileage: { value: 164900, unit: "km", readAt: "2026-07-15" },
    priorOwners: 1,
    previousUse: "company",
    power: { kw: 110, hp: 150 },
    transmission: "7 speed DSG",
    drivetrain: "fwd",
    energy: {
      kind: "combustion",
      fuel: "diesel",
      displacementCcm: 1968,
      cylinders: 4,
      consumptionCombinedL100: 4.9,
      co2CombinedGkm: 129,
      emissionsClass: "Euro 6d-TEMP",
    },
    inspectionDue: "2027-03",
    serviceComplete: true,
    serviceEntries: [
      { date: "2026-01-22", mileage: 158400, workshop: "Autohaus Möller", work: "Service, DSG oil, timing belt renewed" },
      { date: "2024-05-30", mileage: 121000, workshop: "Autohaus Möller", work: "Service, front discs and pads" },
    ],
    grade: "B",
    advisories: [
      { item: "Rear bumper, offside", detail: "Parking scuff 120 mm, painted plastic, not repaired." },
    ],
    tyres: { frontMm: 4.0, rearMm: 5.5, season: "allseason", secondSetIncluded: false },
    estimate: { low: 11800, high: 13400 },
    vat: { kind: "deductible", ratePercent: 19 },
    location: "Neumünster, Hof",
    updatedAt: "2026-07-20",
    status: "available",
  },
  {
    lot: 103,
    stockNumber: "K-2301",
    vinLast6: "203994",
    make: "Renault",
    model: "Zoe",
    trim: "R135 Z.E. 50",
    bodyStyle: "Hatchback",
    exteriorColor: { name: "Titanium Grey", hex: "#6d6f72", finish: "metallic" },
    interior: "Cloth, black",
    modelYear: 2020,
    firstRegistration: "2020-09",
    mileage: { value: 51300, unit: "km", readAt: "2026-07-19" },
    priorOwners: 1,
    previousUse: "private",
    power: { kw: 100, hp: 135 },
    transmission: "Single speed",
    drivetrain: "fwd",
    energy: {
      kind: "electric",
      batteryNetKwh: 52,
      batteryGrossKwh: 55,
      chemistry: "NMC",
      stateOfHealthPercent: 89,
      sohMeasuredAt: "2026-07-02",
      sohMethod: "Aviloo Flash, protocol attached as PDF",
      rangeWltpKm: 395,
      rangeMeasured: { km: 245, conditions: "Mixed, 12 C", measuredAt: "2026-04-08" },
      dcPeakKw: 46,
      dcTenToEightyMinutes: 56,
      acOnboardChargerKw: 22,
      heatPump: false,
    },
    inspectionDue: "2026-09",
    serviceComplete: false,
    serviceEntries: [
      { date: "2024-11-14", mileage: 41000, workshop: "Renault Neumünster", work: "Service, brake fluid" },
    ],
    grade: "C",
    advisories: [
      { item: "Battery ownership", detail: "Battery is on a rental contract. Buyer takes over at 74 EUR per month or buys out." },
      { item: "Inspection", detail: "HU expires 09/2026. Presented and quoted.", quoteEur: 190 },
      { item: "No heat pump", detail: "Winter range drops accordingly. Stated rather than omitted." },
    ],
    tyres: { frontMm: 3.5, rearMm: 4.0, season: "summer", secondSetIncluded: false },
    estimate: { low: 8200, high: 9600 },
    vat: { kind: "margin_scheme", statute: "§25a UStG" },
    location: "Neumünster, Halle 2",
    updatedAt: "2026-07-23",
    status: "available",
  },
  {
    lot: 104,
    stockNumber: "K-2274",
    vinLast6: "551208",
    make: "BMW",
    model: "320d Touring",
    trim: "G21 xDrive Advantage",
    bodyStyle: "Estate",
    exteriorColor: { name: "Alpine White", hex: "#e9e9e6", finish: "solid" },
    interior: "Leather Vernasca, mocha",
    modelYear: 2019,
    firstRegistration: "2019-11",
    mileage: { value: 198700, unit: "km", readAt: "2026-07-11" },
    priorOwners: 2,
    previousUse: "company",
    power: { kw: 140, hp: 190 },
    transmission: "8 speed automatic",
    drivetrain: "awd",
    energy: {
      kind: "combustion",
      fuel: "diesel",
      displacementCcm: 1995,
      cylinders: 4,
      consumptionCombinedL100: 5.4,
      co2CombinedGkm: 142,
      emissionsClass: "Euro 6d-TEMP",
    },
    inspectionDue: "2026-11",
    serviceComplete: true,
    serviceEntries: [
      { date: "2025-09-08", mileage: 184000, workshop: "BMW Kiel", work: "Service, oil, filters, injector 3 renewed" },
    ],
    grade: "D",
    advisories: [
      { item: "Turbo", detail: "Whine under load from 2500 rpm. Not investigated. Sold as inspected." },
      { item: "Nearside front arch", detail: "Corrosion bubbling 60 mm under the trim." },
      { item: "Mileage", detail: "198,700 km. Priced against it rather than around it." },
    ],
    tyres: { frontMm: 3.0, rearMm: 3.0, season: "winter", secondSetIncluded: false },
    estimate: { low: 7400, high: 9000 },
    vat: { kind: "deductible", ratePercent: 19 },
    location: "Neumünster, Hof",
    updatedAt: "2026-07-19",
    status: "available",
  },
  {
    lot: 105,
    stockNumber: "K-2310",
    vinLast6: "884471",
    make: "Hyundai",
    model: "Ioniq 5",
    trim: "72.6 kWh Techniq RWD",
    bodyStyle: "Hatchback",
    exteriorColor: { name: "Cyber Grey", hex: "#5d6165", finish: "metallic" },
    interior: "Vegan leather, dark",
    modelYear: 2022,
    firstRegistration: "2022-04",
    mileage: { value: 44100, unit: "km", readAt: "2026-07-21" },
    priorOwners: 1,
    previousUse: "demo",
    power: { kw: 168, hp: 229 },
    transmission: "Single speed",
    drivetrain: "rwd",
    energy: {
      kind: "electric",
      batteryNetKwh: 72.6,
      batteryGrossKwh: 77.4,
      chemistry: "NMC",
      stateOfHealthPercent: 97,
      sohMeasuredAt: "2026-07-01",
      sohMethod: "Aviloo Flash, protocol attached as PDF",
      rangeWltpKm: 481,
      rangeMeasured: { km: 368, conditions: "120 km/h, 9 C", measuredAt: "2026-03-30" },
      dcPeakKw: 233,
      dcTenToEightyMinutes: 18,
      acOnboardChargerKw: 11,
      heatPump: true,
    },
    inspectionDue: "2028-04",
    serviceComplete: true,
    serviceEntries: [
      { date: "2026-04-16", mileage: 39800, workshop: "Hyundai Neumünster", work: "Service, cabin filter, HV check" },
    ],
    grade: "A",
    advisories: [],
    tyres: { frontMm: 7.5, rearMm: 7.0, season: "summer", secondSetIncluded: true },
    estimate: { low: 27500, high: 30500 },
    vat: { kind: "deductible", ratePercent: 19 },
    location: "Neumünster, Halle 1",
    updatedAt: "2026-07-23",
    status: "reserved",
  },
  {
    lot: 106,
    stockNumber: "K-2263",
    vinLast6: "119076",
    make: "Dacia",
    model: "Duster",
    trim: "TCe 130 Comfort",
    bodyStyle: "SUV",
    exteriorColor: { name: "Arizona Orange", hex: "#b45a24", finish: "solid" },
    interior: "Cloth, grey",
    modelYear: 2021,
    firstRegistration: "2021-08",
    mileage: { value: 91600, unit: "km", readAt: "2026-07-14" },
    priorOwners: 3,
    previousUse: "driving_school",
    power: { kw: 96, hp: 130 },
    transmission: "6 speed manual",
    drivetrain: "fwd",
    energy: {
      kind: "combustion",
      fuel: "petrol",
      displacementCcm: 1332,
      cylinders: 4,
      consumptionCombinedL100: 6.4,
      co2CombinedGkm: 145,
      emissionsClass: "Euro 6d",
    },
    inspectionDue: "2027-08",
    serviceComplete: true,
    serviceEntries: [
      { date: "2026-02-03", mileage: 86200, workshop: "Freie Werkstatt Ahrens", work: "Service, clutch renewed" },
    ],
    grade: "C",
    advisories: [
      { item: "Previous use", detail: "Driving school car. Clutch renewed at 86,200 km, invoice attached." },
      { item: "Interior wear", detail: "Driver seat bolster worn through on the outer edge.", quoteEur: 320 },
    ],
    tyres: { frontMm: 5.0, rearMm: 6.0, season: "allseason", secondSetIncluded: false },
    estimate: { low: 10200, high: 11600 },
    vat: { kind: "margin_scheme", statute: "§25a UStG" },
    location: "Neumünster, Hof",
    updatedAt: "2026-07-18",
    status: "available",
  },
  {
    lot: 107,
    stockNumber: "K-2255",
    vinLast6: "640332",
    make: "Volvo",
    model: "V60",
    trim: "B4 Momentum Pro",
    bodyStyle: "Estate",
    exteriorColor: { name: "Denim Blue", hex: "#3c4756", finish: "metallic" },
    interior: "Leather, charcoal",
    modelYear: 2021,
    firstRegistration: "2021-02",
    mileage: { value: 112400, unit: "km", readAt: "2026-07-16" },
    priorOwners: 1,
    previousUse: "private",
    power: { kw: 145, hp: 197 },
    transmission: "8 speed automatic",
    drivetrain: "fwd",
    energy: {
      kind: "combustion",
      fuel: "petrol",
      displacementCcm: 1969,
      cylinders: 4,
      consumptionCombinedL100: 6.9,
      co2CombinedGkm: 157,
      emissionsClass: "Euro 6d",
    },
    inspectionDue: "2027-02",
    serviceComplete: true,
    serviceEntries: [
      { date: "2025-11-27", mileage: 104000, workshop: "Volvo Kiel", work: "Service, gearbox oil, rear pads" },
    ],
    grade: "A",
    advisories: [],
    tyres: { frontMm: 6.0, rearMm: 6.5, season: "summer", secondSetIncluded: true },
    estimate: { low: 19800, high: 22400 },
    vat: { kind: "deductible", ratePercent: 19 },
    location: "Neumünster, Halle 1",
    updatedAt: "2026-07-21",
    status: "available",
  },
  {
    lot: 108,
    stockNumber: "K-2240",
    vinLast6: "007519",
    make: "Fiat",
    model: "500e",
    trim: "42 kWh Icon",
    bodyStyle: "Hatchback",
    exteriorColor: { name: "Mineral Green", hex: "#6a7a67", finish: "pearl" },
    interior: "Cloth, ivory",
    modelYear: 2022,
    firstRegistration: "2022-07",
    mileage: { value: 28900, unit: "km", readAt: "2026-07-20" },
    priorOwners: 1,
    previousUse: "private",
    power: { kw: 87, hp: 118 },
    transmission: "Single speed",
    drivetrain: "fwd",
    energy: {
      kind: "electric",
      batteryNetKwh: 37.3,
      batteryGrossKwh: 42,
      chemistry: "NMC",
      stateOfHealthPercent: 96,
      sohMeasuredAt: "2026-06-28",
      sohMethod: "Aviloo Flash, protocol attached as PDF",
      rangeWltpKm: 320,
      rangeMeasured: { km: 214, conditions: "Urban and Landstrasse, 14 C", measuredAt: "2026-05-11" },
      dcPeakKw: 85,
      dcTenToEightyMinutes: 26,
      acOnboardChargerKw: 11,
      heatPump: false,
    },
    inspectionDue: "2028-07",
    serviceComplete: true,
    serviceEntries: [
      { date: "2025-07-30", mileage: 21400, workshop: "Fiat Neumünster", work: "Service, HV check, brake fluid" },
    ],
    grade: "B",
    advisories: [
      { item: "Nearside mirror cap", detail: "Kerbed, cap only. Replacement quoted.", quoteEur: 95 },
    ],
    tyres: { frontMm: 6.0, rearMm: 6.5, season: "summer", secondSetIncluded: false },
    estimate: { low: 12400, high: 14200 },
    vat: { kind: "margin_scheme", statute: "§25a UStG" },
    location: "Neumünster, Halle 1",
    updatedAt: "2026-07-22",
    status: "available",
  },
];

export const fmtKm = (n: number) => n.toLocaleString("de-DE");
export const fmtEur = (n: number) => n.toLocaleString("de-DE");
