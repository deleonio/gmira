// ILLUSTRATIVE TEACHING DATA. Read this before you read anything else in this folder.
//
// Every advertiser, ad library id, teardown and performance figure below is synthetic.
// No real brand, creator, student or ad account appears here, and no figure on this page
// was measured in a real ad account. Doctrine G7 forbids invented metrics, testimonials,
// logos and client names presented as real, and the playbook for this vertical calls
// fabricated proof the exact accusation the audience arrives with. So the synthetic half
// is labelled on the surface, not in a tooltip: every performance block carries
// isIllustrative: true and the page renders a visible tag next to it.
//
// The half that is real and usable: the programme structure, the weekly output quota,
// the price and payment terms, the refund wording, the rate card mechanics, the usage
// rights model, the deliverable specs and the compliance list. Those are craft, not claims.
//
// Field names follow the content model in references/playbooks/gtm-ugc-school.md.

export type Iso = string;

export type Platform =
  | "meta"
  | "tiktok"
  | "youtube"
  | "snapchat"
  | "pinterest"
  | "reddit"
  | "linkedin";

export const PLATFORM_LABEL: Record<Platform, string> = {
  meta: "Meta",
  tiktok: "TikTok",
  youtube: "YouTube",
  snapchat: "Snapchat",
  pinterest: "Pinterest",
  reddit: "Reddit",
  linkedin: "LinkedIn",
};

export type HookArchetype =
  | "problem_agitate"
  | "pattern_interrupt"
  | "pov"
  | "unboxing"
  | "testimonial"
  | "listicle"
  | "comparison"
  | "green_screen"
  | "stitch"
  | "day_in_life"
  | "founder_direct";

export const ARCHETYPE_LABEL: Record<HookArchetype, string> = {
  problem_agitate: "Problem, agitate",
  pattern_interrupt: "Pattern interrupt",
  pov: "POV",
  unboxing: "Unboxing",
  testimonial: "Testimonial",
  listicle: "Listicle",
  comparison: "Comparison",
  green_screen: "Green screen",
  stitch: "Stitch",
  day_in_life: "Day in the life",
  founder_direct: "Founder direct",
};

export interface AdAsset {
  id: string;

  /* proof that it existed */
  platform: Platform;
  adLibraryId?: string;
  adLibraryUrl?: string;
  creativeCenterUrl?: string;
  ranFrom?: Iso;
  ranTo?: Iso;
  advertiser: { name: string; permissionOnFile: boolean; logoUrl?: string };
  archivedCopy: { videoSrc?: string; posterSrc?: string; capturedAt: Iso; note: string };

  /* what it physically is */
  format: "video" | "static" | "carousel" | "collection" | "story";
  aspectRatio: "9:16" | "4:5" | "1:1" | "16:9";
  resolution: { width: number; height: number };
  durationS?: number;
  hasSound: boolean;
  burnedInCaptions: boolean;
  languageCode: string;
  shotOn: "phone" | "camera" | "screen_capture" | "mixed" | "ai_generated";
  productionCost?: { amount: number; currency: string; note: string };

  /* the craft, broken down */
  hook: {
    firstFrameDescription: string;
    spokenOpener?: string;
    onScreenText?: string;
    archetype: HookArchetype;
    lengthMs: number;
  };
  beats: Array<{
    atS: number;
    label: string;
    purpose: "retain" | "prove" | "objection" | "cta";
    note: string;
  }>;
  cta: {
    spoken?: string;
    onScreen?: string;
    atS: number;
    destination: "pdp" | "lp" | "app" | "form" | "dm";
  };
  objectionsAddressed: string[];
  socialProofDevice?: "review_overlay" | "duet" | "ugc_stack" | "before_after" | "none";

  performance?: Performance;
}

export interface Performance {
  source:
    | "meta_ads_manager"
    | "tiktok_ads_manager"
    | "triple_whale"
    | "northbeam"
    | "client_reported";
  sourceScreenshot?: string;
  window: { from: Iso; to: Iso };
  spend?: { amount: number; currency: string };
  impressions?: number;
  hookRatePercent?: number;
  holdRatePercent?: number;
  outboundCtrPercent?: number;
  cpm?: number;
  cpa?: number;
  roas?: number;
  isIllustrative: boolean;
}

export const PERF_SOURCE_LABEL: Record<Performance["source"], string> = {
  meta_ads_manager: "Meta Ads Manager",
  tiktok_ads_manager: "TikTok Ads Manager",
  triple_whale: "Triple Whale",
  northbeam: "Northbeam",
  client_reported: "Client reported",
};

export interface Teardown {
  id: string;
  slug: string;
  adAssetId: string;
  authorId: string;
  billing: string; // how this bout is billed on the card
  briefId?: string; // the brief that produced it
  boutName: string; // the ad, billed
  opponent: string; // what it was actually fighting
  thesis: string;
  annotations: Array<{ atS: number; note: string; frameSrc?: string }>;
  whatToSteal: string[];
  whatNotToCopy: string[];
  rebuildBrief?: string;
  rebuildSpecId?: string;
  /* extension to the playbook model: the tale of the tape needs the thing it beat,
     and a figure without the thing it beat is half a figure. */
  controlComparison?: {
    controlLabel: string;
    sharedWindow: { from: Iso; to: Iso };
    sharedSource: Performance["source"];
    isIllustrative: boolean;
    rows: Array<{
      metric: string;
      unit: string;
      thisAd: number;
      control: number;
      betterIs: "higher" | "lower";
      denominator: string;
    }>;
  };
  publishedAt: Iso;
  isPublic: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  doesWhat: string;
  note: string;
}

export interface DeliverableSpec {
  id: string;
  name: string;
  platform: Platform;
  placements: string[];
  aspectRatio: "9:16" | "4:5" | "1:1" | "16:9";
  resolution: { width: number; height: number };
  maxDurationS: number;
  maxFileMb: number;
  container: "mp4" | "mov";
  codec: string;
  safeZones: { topPx: number; bottomPx: number; leftPx: number; rightPx: number; note: string };
  captionRequirement: "burned_in" | "srt" | "either";
  audioRequirement: "must_work_muted" | "sound_on";
  brandAssetsProvided: string[];
  namingConvention: string;
  checkedOn: Iso;
}

export interface UsageRights {
  organic: boolean;
  paid: boolean;
  whitelisting: boolean;
  termDays: 30 | 60 | 90 | 180 | 365 | -1;
  territory: string[];
  exclusivityDays: number;
  creditRequired: boolean;
  renegotiationTerms?: string;
}

export interface Brief {
  id: string;
  brandId: string;
  campaign: string;
  objective: "prospecting" | "retargeting" | "retention" | "launch";
  audience: {
    description: string;
    painPoint: string;
    currentSolution: string;
    objection: string;
  };
  offer: string;
  mandatoryClaims: string[];
  prohibitedClaims: string[];
  toneReferences: Array<{ url: string; whatToTake: string }>;
  concepts: Array<{ name: string; hookIdea: string; angle: string }>;
  deliverableSpecIds: string[];
  variantCount: number;
  revisionRounds: number;
  dueOn: Iso;
  usageRights: UsageRights;
  rate: { amount: number; currency: string; perDeliverable: boolean };
}

export interface RateCardLine {
  deliverable: string;
  baseRate: { amount: number; currency: string };
  modifiers: Array<{ condition: string; multiplier: number }>;
  includesRevisions: number;
  rushFeePercent?: number;
}

export interface GtmPlay {
  id: string;
  name: string;
  motion:
    | "plg"
    | "sales_led"
    | "community_led"
    | "paid_acquisition"
    | "partnerships"
    | "outbound";
  icp: { segment: string; sizeBand: string; trigger: string; buyer: string; blocker: string };
  positioning: { category: string; against: string; claim: string; proof: string };
  channels: Array<{ name: string; role: "acquire" | "nurture" | "convert" | "expand"; cadence: string }>;
  funnel: Array<{ stage: string; definition: string; instrumentedBy: string }>;
  economics: {
    aov?: number;
    cac?: number;
    paybackMonths?: number;
    mer?: number;
    currency: string;
    isIllustrative: boolean;
  };
  artifacts: Array<{ kind: "brief" | "sequence" | "landing_page" | "sheet" | "dashboard"; label: string }>;
  failureModes: string[];
}

export type ForWhom =
  | "freelance_creator"
  | "in_house_marketer"
  | "agency_owner"
  | "founder"
  | "media_buyer";

export interface Program {
  slug: string;
  title: string;
  forWhom: ForWhom[];
  notForYouIf: string[];
  durationWeeks: number;
  weeklyCommitment: { liveHours: number; productionHours: number };
  format: "live_cohort" | "self_paced" | "hybrid";
  outputQuota: { hooksPerWeek: number; editsPerWeek: number; postedPerWeek: number };
  modules: Array<{
    index: number;
    title: string;
    thesis: string;
    deliverable: string;
    outputCount: number; // drives the billing size on the card
    outputUnit: string;
    teardownIds: string[];
    critiqueFormat: string;
  }>;
  toolsTaught: Array<{ name: string; version?: string; costToStudent?: string; required: boolean }>;
  adSpendRequired?: { amount: number; currency: string; note: string };
  portfolioOutcome: string;
  swipeFile: { entryCount: number; publicSampleUrl?: string; updateCadence: string };
  community: { platform: string; size?: number; moderated: boolean; retentionAfterProgram: string };
}

export interface Offer {
  listPrice: { amount: number; currency: string; taxNote: string };
  paymentOptions: Array<{
    kind: "upfront" | "instalments";
    count?: number;
    amountEach?: number;
    feePercent?: number;
    total: number;
    note: string;
  }>;
  deadline?: { closesAt: Iso; reason: string };
  bonuses: Array<{ name: string; description: string; realStandaloneValue?: number }>;
  bonusValueNote: string;
  guarantee?: {
    statement: string;
    conditions: string[];
    windowDays: number;
    claimProcess: string;
    contractUrl: string;
  };
  guaranteeAbsence: string;
  refundPolicy: { quotedVerbatim: string; windowDays: number; conditions: string };
}

export interface ProofItem {
  kind:
    | "ad_library_link"
    | "platform_screenshot"
    | "student_ad"
    | "brand_permission"
    | "video_testimonial"
    | "document";
  claimSupported: string;
  subject: string;
  status: "real_in_this_build" | "synthetic_in_this_build";
  wouldCarry: string;
}

/* ------------------------------------------------------------------ *
 * The card
 * ------------------------------------------------------------------ */

export const CARD = {
  promoter: "Halbe Sekunde",
  promoterLine: "Creative and go to market, taught by the bout",
  title: "Six Weeks On The Card",
  strap: "A working programme in paid creative. You write, you cut, you post, you get read.",
  venue: "Live on Tuesdays and Thursdays, 18:00 to 19:30 CET, plus one critique block",
  city: "Remote, run from Hamburg",
  cohortOpens: "2026-09-14",
  cohortCloses: "2026-10-23",
  doorsClose: "2026-09-04",
  seatsPerCohort: 18,
  seatsHeld: 11,
  overprint: {
    line1: "Illustrative card",
    line2:
      "Every advertiser, ad library id and performance figure on this page is synthetic teaching data.",
  },
};

export const INSTRUCTORS: Instructor[] = [
  {
    id: "ins-mk",
    name: "M. Kroll",
    doesWhat: "Buys media for two direct to consumer accounts and cuts their hook variants",
    note: "Teaches weeks 1, 2 and 6. Runs the critique block.",
  },
  {
    id: "ins-ab",
    name: "A. Baumgart",
    doesWhat: "Freelance creator, invoices brands directly, negotiates her own usage terms",
    note: "Teaches weeks 3 and 5. Wrote the rate card template.",
  },
];

/* ------------------------------------------------------------------ *
 * The creative library. Synthetic. See the file header.
 * ------------------------------------------------------------------ */

export const AD_ASSETS: AdAsset[] = [
  {
    id: "ad-kapsel-4am",
    platform: "tiktok",
    adLibraryId: "ILLUSTRATIVE-TT-4471082",
    creativeCenterUrl: undefined,
    ranFrom: "2026-03-01",
    ranTo: "2026-04-12",
    advertiser: { name: "Kapsel Coffee Co. (synthetic)", permissionOnFile: false },
    archivedCopy: {
      capturedAt: "2026-04-14",
      note: "The archived MP4 is not part of this proof build.",
    },
    format: "video",
    aspectRatio: "9:16",
    resolution: { width: 1080, height: 1920 },
    durationS: 27,
    hasSound: true,
    burnedInCaptions: true,
    languageCode: "de-DE",
    shotOn: "phone",
    productionCost: {
      amount: 0,
      currency: "EUR",
      note: "Self shot in a kitchen. One light, one phone, no crew.",
    },
    hook: {
      firstFrameDescription:
        "Hand pouring water into a mug, framed tight, the pour already in motion before the first frame lands.",
      spokenOpener: "I have made this wrong for four years.",
      onScreenText: "wrong for 4 years",
      archetype: "pattern_interrupt",
      lengthMs: 1200,
    },
    beats: [
      { atS: 0.0, label: "Pour already in motion", purpose: "retain", note: "Motion at frame zero. Nothing to wait for." },
      { atS: 1.2, label: "Name the mistake", purpose: "prove", note: "The specific error, said in eight words. No preamble." },
      { atS: 6.5, label: "Show the grind side by side", purpose: "prove", note: "Two piles in one frame. No cut, so nothing can be hidden in the edit." },
      { atS: 13.0, label: "Answer the price objection out loud", purpose: "objection", note: "States the per cup cost before the viewer can." },
      { atS: 21.0, label: "Hand reaches for the bag", purpose: "cta", note: "The product enters last, held, not presented." },
    ],
    cta: {
      spoken: "The bag is 14 euro and it lasts me a month.",
      onScreen: "14 EUR / month of mornings",
      atS: 21.0,
      destination: "pdp",
    },
    objectionsAddressed: [
      "Too expensive for a daily habit",
      "I do not want another gadget",
      "Specialty coffee is a personality, not a product",
    ],
    socialProofDevice: "none",
    performance: {
      source: "tiktok_ads_manager",
      window: { from: "2026-03-01", to: "2026-04-12" },
      spend: { amount: 4820, currency: "EUR" },
      impressions: 1284500,
      hookRatePercent: 31.4,
      holdRatePercent: 24.8,
      outboundCtrPercent: 1.9,
      cpm: 3.75,
      cpa: 18.4,
      roas: 2.9,
      isIllustrative: true,
    },
  },
  {
    id: "ad-nordwand-socks",
    platform: "meta",
    adLibraryId: "ILLUSTRATIVE-META-908314772",
    ranFrom: "2026-01-08",
    ranTo: "2026-02-19",
    advertiser: { name: "Nordwand Boots (synthetic)", permissionOnFile: false },
    archivedCopy: {
      capturedAt: "2026-02-20",
      note: "The archived MP4 is not part of this proof build.",
    },
    format: "video",
    aspectRatio: "9:16",
    resolution: { width: 1080, height: 1920 },
    durationS: 34,
    hasSound: true,
    burnedInCaptions: true,
    languageCode: "de-DE",
    shotOn: "phone",
    productionCost: {
      amount: 180,
      currency: "EUR",
      note: "One half day, one creator, one pair of boots destroyed on purpose.",
    },
    hook: {
      firstFrameDescription:
        "A wet sock being wrung out over a boot, water hitting the boot leather, shot from above.",
      spokenOpener: "Your boots are not leaking. Your socks are.",
      onScreenText: "not the boots",
      archetype: "problem_agitate",
      lengthMs: 900,
    },
    beats: [
      { atS: 0.0, label: "Water hits leather", purpose: "retain", note: "Sound and motion together. Works muted because the water is visible." },
      { atS: 0.9, label: "Reverse the assumption", purpose: "retain", note: "The viewer came to blame the boot. The line takes the blame away." },
      { atS: 8.0, label: "Cut the boot open", purpose: "prove", note: "Destroys the product on camera. Nobody fakes this to sell a boot." },
      { atS: 17.0, label: "Membrane close up with the seam count", purpose: "prove", note: "A number the viewer can check on the product page." },
      { atS: 24.0, label: "Return policy said plainly", purpose: "objection", note: "Removes the wrong size risk before the click." },
      { atS: 29.5, label: "Size guide card", purpose: "cta", note: "The click is to a size guide, not to a cart. Lower intent step, higher completion." },
    ],
    cta: {
      spoken: "Measure your foot before you order, the guide is in the link.",
      onScreen: "size guide, not a cart",
      atS: 29.5,
      destination: "lp",
    },
    objectionsAddressed: [
      "I will order the wrong size",
      "Waterproof claims are always marketing",
      "Returns will be a fight",
    ],
    socialProofDevice: "before_after",
    performance: {
      source: "meta_ads_manager",
      window: { from: "2026-01-08", to: "2026-02-19" },
      spend: { amount: 9640, currency: "EUR" },
      impressions: 2140000,
      hookRatePercent: 27.8,
      holdRatePercent: 19.1,
      outboundCtrPercent: 1.4,
      cpm: 4.5,
      cpa: 41.3,
      roas: 2.2,
      isIllustrative: true,
    },
  },
  {
    id: "ad-kapsel-founder",
    platform: "meta",
    adLibraryId: "ILLUSTRATIVE-META-908417265",
    ranFrom: "2026-04-20",
    ranTo: "2026-05-01",
    advertiser: { name: "Kapsel Coffee Co. (synthetic)", permissionOnFile: false },
    archivedCopy: {
      capturedAt: "2026-05-02",
      note: "The archived MP4 is not part of this proof build.",
    },
    format: "video",
    aspectRatio: "9:16",
    resolution: { width: 1080, height: 1920 },
    durationS: 48,
    hasSound: true,
    burnedInCaptions: false,
    languageCode: "de-DE",
    shotOn: "camera",
    productionCost: {
      amount: 950,
      currency: "EUR",
      note: "Hired an operator and a light kit. The budget is part of why it hurt.",
    },
    hook: {
      firstFrameDescription:
        "The founder seated in a roastery, mid sentence, arms folded, a rack of bags behind him in soft focus.",
      spokenOpener: "When we started Kapsel in 2019, we asked ourselves a simple question.",
      onScreenText: undefined,
      archetype: "founder_direct",
      lengthMs: 4100,
    },
    beats: [
      { atS: 0.0, label: "Founder in a chair", purpose: "retain", note: "No motion at frame zero. Nothing is happening and the thumb knows it." },
      { atS: 4.1, label: "Origin story", purpose: "prove", note: "Nineteen seconds of history before a single product claim." },
      { atS: 23.0, label: "Sourcing", purpose: "prove", note: "True, verifiable, and the viewer left at second six." },
      { atS: 41.0, label: "Website call to action", purpose: "cta", note: "Arrives after the audience has gone." },
    ],
    cta: { spoken: "Have a look at what we do.", atS: 41.0, destination: "lp" },
    objectionsAddressed: [],
    socialProofDevice: "none",
    performance: {
      source: "meta_ads_manager",
      window: { from: "2026-04-20", to: "2026-05-01" },
      spend: { amount: 1150, currency: "EUR" },
      impressions: 402300,
      hookRatePercent: 11.2,
      holdRatePercent: 9.4,
      outboundCtrPercent: 0.4,
      cpm: 2.86,
      cpa: 91.2,
      roas: 0.6,
      isIllustrative: true,
    },
  },
  {
    id: "ad-halbwert-static",
    platform: "meta",
    adLibraryId: "ILLUSTRATIVE-META-911002458",
    ranFrom: "2026-05-04",
    ranTo: "2026-06-30",
    advertiser: { name: "Halbwert Sleep (synthetic)", permissionOnFile: false },
    archivedCopy: {
      capturedAt: "2026-07-01",
      note: "Static asset. The original file is not part of this proof build.",
    },
    format: "static",
    aspectRatio: "4:5",
    resolution: { width: 1080, height: 1350 },
    hasSound: false,
    burnedInCaptions: false,
    languageCode: "de-DE",
    shotOn: "phone",
    productionCost: { amount: 40, currency: "EUR", note: "Shot on a phone on a hotel bed, retouched in ten minutes." },
    hook: {
      firstFrameDescription:
        "Two identical bedside tables photographed at the same angle, one with a phone on it, one with a book.",
      onScreenText: "23:40 vs 23:40",
      archetype: "comparison",
      lengthMs: 0,
    },
    beats: [
      { atS: 0, label: "Two panels, one difference", purpose: "retain", note: "The whole argument is legible at thumbnail size." },
      { atS: 0, label: "Timestamp repeated", purpose: "prove", note: "Same time on both, so the variable is isolated." },
    ],
    cta: { onScreen: "read the 14 night test", atS: 0, destination: "lp" },
    objectionsAddressed: ["Sleep products are placebo", "I am not going to give up my phone"],
    socialProofDevice: "none",
  },
  {
    id: "ad-pfand-returns",
    platform: "tiktok",
    adLibraryId: "ILLUSTRATIVE-TT-4488310",
    ranFrom: "2026-06-02",
    ranTo: "2026-07-18",
    advertiser: { name: "Pfand Studio (synthetic)", permissionOnFile: false },
    archivedCopy: {
      capturedAt: "2026-07-19",
      note: "The archived MP4 is not part of this proof build.",
    },
    format: "video",
    aspectRatio: "9:16",
    resolution: { width: 1080, height: 1920 },
    durationS: 19,
    hasSound: true,
    burnedInCaptions: true,
    languageCode: "de-DE",
    shotOn: "screen_capture",
    productionCost: { amount: 0, currency: "EUR", note: "Screen recording plus a talking head, cut in a phone editor." },
    hook: {
      firstFrameDescription:
        "A returns policy on screen behind the creator, one clause already highlighted in yellow before she speaks.",
      spokenOpener: "This returns policy was written by someone who has never posted a parcel.",
      onScreenText: "clause 4.2",
      archetype: "green_screen",
      lengthMs: 1400,
    },
    beats: [
      { atS: 0.0, label: "Highlighted clause on screen", purpose: "retain", note: "The highlight is already there at frame zero, so the eye lands on it." },
      { atS: 1.4, label: "Read the clause out loud", purpose: "prove", note: "The document does the arguing." },
      { atS: 9.0, label: "Show our own clause next to it", purpose: "objection", note: "Comparison without naming a competitor. Compliant and still pointed." },
      { atS: 15.5, label: "Ten word summary", purpose: "cta", note: "One sentence a viewer can repeat to a friend." },
    ],
    cta: { spoken: "Ours is one line. Read it.", onScreen: "one line", atS: 15.5, destination: "lp" },
    objectionsAddressed: ["Returns will cost me money", "The small print will catch me out"],
    socialProofDevice: "none",
  },
];

export const TEARDOWNS: Teardown[] = [
  {
    id: "td-01",
    slug: "kapsel-4am",
    adAssetId: "ad-kapsel-4am",
    authorId: "ins-mk",
    billing: "Main event",
    briefId: "brief-01",
    boutName: "Kapsel, cold brew at four",
    opponent: "The thumb",
    thesis:
      "The pour is already moving in frame one, so the ad never asks for patience it has not earned.",
    annotations: [
      { atS: 0.0, note: "Frame zero has motion and no face. A face reads as an ad. A pour reads as a video." },
      { atS: 1.2, note: "The hook ends here. Eight words, one admission, no product." },
      { atS: 6.5, note: "Two grinds in one unbroken frame. The proof is the absence of a cut." },
      { atS: 13.0, note: "Price objection answered before the viewer forms it. This is the beat most creators skip." },
      { atS: 21.0, note: "Product enters at 78 percent of the runtime. Held, not presented." },
    ],
    whatToSteal: [
      "Start the physical action before the first frame, not on it",
      "Admit the mistake yourself instead of accusing the viewer of it",
      "Answer the price objection out loud, in the currency the viewer thinks in",
    ],
    whatNotToCopy: [
      "The four year timeframe. It works because the account has a four year posting history to back it",
      "The bare kitchen. On a brand with a studio look this reads as a costume",
    ],
    rebuildBrief:
      "Rebuild this for a product you have in your kitchen right now. Same structure, your own mistake, your own number. 27 seconds, 9:16, captions burned in. The first frame must contain motion that started before the clip did.",
    rebuildSpecId: "spec-tt-infeed",
    controlComparison: {
      controlLabel: "Control: talking head opener, same offer, same audience",
      sharedWindow: { from: "2026-03-01", to: "2026-04-12" },
      sharedSource: "tiktok_ads_manager",
      isIllustrative: true,
      rows: [
        { metric: "Hook rate", unit: "%", thisAd: 31.4, control: 18.2, betterIs: "higher", denominator: "3 second views over impressions" },
        { metric: "Hold rate", unit: "%", thisAd: 24.8, control: 15.6, betterIs: "higher", denominator: "Thruplays over 3 second views" },
        { metric: "Outbound CTR", unit: "%", thisAd: 1.9, control: 1.1, betterIs: "higher", denominator: "Outbound clicks over impressions" },
        { metric: "CPM", unit: "EUR", thisAd: 3.75, control: 4.1, betterIs: "lower", denominator: "Spend over impressions, times 1000" },
        { metric: "CPA", unit: "EUR", thisAd: 18.4, control: 29.8, betterIs: "lower", denominator: "Spend over purchases" },
        { metric: "ROAS", unit: "x", thisAd: 2.9, control: 1.7, betterIs: "higher", denominator: "Attributed revenue over spend, 7 day click" },
      ],
    },
    publishedAt: "2026-05-06",
    isPublic: true,
  },
  {
    id: "td-02",
    slug: "nordwand-socks",
    adAssetId: "ad-nordwand-socks",
    authorId: "ins-ab",
    billing: "Co feature",
    briefId: "brief-02",
    boutName: "Nordwand, not the boots",
    opponent: "The size chart",
    thesis:
      "It destroys the product on camera, which is the one thing a viewer is sure a brand would not fake.",
    annotations: [
      { atS: 0.0, note: "Water is the loudest silent event available. It reads muted, which is how it will be watched." },
      { atS: 0.9, note: "The line takes blame off the product and gives the viewer a new question." },
      { atS: 8.0, note: "The cut through the boot is the whole ad. Everything before it buys the eight seconds." },
      { atS: 17.0, note: "A seam count is checkable on the product page. Checkable beats impressive." },
      { atS: 24.0, note: "Return terms stated inside the creative, not left for the landing page." },
    ],
    whatToSteal: [
      "Destroy the product to prove a construction claim",
      "Send the click to a size guide instead of a cart when sizing is the real objection",
      "Put the return terms in the ad, where the doubt actually forms",
    ],
    whatNotToCopy: [
      "The destruction device on a product with no internal construction to show",
      "The 34 second runtime on a cold prospecting audience without this much proof to spend it on",
    ],
    rebuildBrief:
      "Take a product claim you cannot prove with a shot of the product, and find the destructive test that proves it. 30 seconds, 9:16, the destructive beat before second 10.",
    rebuildSpecId: "spec-meta-reels",
    controlComparison: {
      controlLabel: "Control: studio product spin, same offer, same audience",
      sharedWindow: { from: "2026-01-08", to: "2026-02-19" },
      sharedSource: "meta_ads_manager",
      isIllustrative: true,
      rows: [
        { metric: "Hook rate", unit: "%", thisAd: 27.8, control: 14.9, betterIs: "higher", denominator: "3 second views over impressions" },
        { metric: "Hold rate", unit: "%", thisAd: 19.1, control: 10.2, betterIs: "higher", denominator: "Thruplays over 3 second views" },
        { metric: "Outbound CTR", unit: "%", thisAd: 1.4, control: 0.9, betterIs: "higher", denominator: "Outbound clicks over impressions" },
        { metric: "CPM", unit: "EUR", thisAd: 4.5, control: 4.2, betterIs: "lower", denominator: "Spend over impressions, times 1000" },
        { metric: "CPA", unit: "EUR", thisAd: 41.3, control: 68.4, betterIs: "lower", denominator: "Spend over purchases" },
        { metric: "ROAS", unit: "x", thisAd: 2.2, control: 1.3, betterIs: "higher", denominator: "Attributed revenue over spend, 7 day click" },
      ],
    },
    publishedAt: "2026-03-11",
    isPublic: true,
  },
  {
    id: "td-03",
    slug: "kapsel-founder-cut",
    adAssetId: "ad-kapsel-founder",
    authorId: "ins-mk",
    billing: "The loss",
    briefId: "brief-01",
    boutName: "Kapsel, founder cut",
    opponent: "Four seconds of nothing",
    thesis:
      "Same brand, same offer, four seconds of nothing at the front, and the account paid 91 euro per purchase to learn it.",
    annotations: [
      { atS: 0.0, note: "A seated man with folded arms is a stock photograph that happens to move." },
      { atS: 4.1, note: "The hook is 4.1 seconds long. The audience decides at 1.2." },
      { atS: 23.0, note: "The sourcing claim is true and it is the best material in the ad. It is 23 seconds too late." },
      { atS: 41.0, note: "By the call to action the ad is talking to the 9 percent who stayed." },
    ],
    whatToSteal: [
      "Nothing structural. The failure is the point of publishing it",
      "The one usable asset is the sourcing claim at 23.0, which was later cut as a 9 second standalone",
    ],
    whatNotToCopy: [
      "Origin story openers on cold traffic",
      "Spending 950 euro on production before a 0 euro version has been tested",
      "Shipping without burned in captions on a talking piece",
    ],
    rebuildBrief:
      "Take the strongest 8 seconds out of a long ad you already have and rebuild it as the whole ad. Nothing new is shot. This is the cheapest exercise in the programme and the one students argue with most.",
    rebuildSpecId: "spec-meta-reels",
    publishedAt: "2026-05-20",
    isPublic: true,
  },
  {
    id: "td-04",
    slug: "pfand-returns",
    adAssetId: "ad-pfand-returns",
    authorId: "ins-ab",
    billing: "Undercard",
    boutName: "Pfand, clause four two",
    opponent: "The small print",
    thesis:
      "The document is the proof, so the creator only has to read it out. Cheapest ad on the card to make.",
    annotations: [
      { atS: 0.0, note: "The highlight is applied before the first frame. The eye has somewhere to land instantly." },
      { atS: 1.4, note: "Reading a real clause out loud is a proof device that costs nothing and cannot be argued with." },
      { atS: 9.0, note: "Comparison without naming a competitor keeps this inside platform policy and inside German competition law." },
      { atS: 15.5, note: "The closing line is short enough to be repeated. Repeatable beats memorable." },
    ],
    whatToSteal: [
      "Let a document carry the argument so the creator only has to perform the reaction",
      "Highlight before the first frame, not during",
      "Compare to a category practice rather than to a named brand",
    ],
    whatNotToCopy: [
      "The tone on a category where the competitor practice is not actually worse",
      "Screen recordings of anything containing a customer name or order id",
    ],
    rebuildBrief:
      "Find a document in your category that is against the customer. Terms, a warranty, a size chart, a fee schedule. Read one clause out loud and answer it with yours. 20 seconds, 9:16, no music.",
    rebuildSpecId: "spec-tt-infeed",
    publishedAt: "2026-07-02",
    isPublic: true,
  },
];

/* ------------------------------------------------------------------ *
 * Deliverable specs. Craft, not claims. Dated, and students re-check them.
 * ------------------------------------------------------------------ */

export const SPECS: DeliverableSpec[] = [
  {
    id: "spec-tt-infeed",
    name: "TikTok in feed, 9:16, 30 s",
    platform: "tiktok",
    placements: ["In feed"],
    aspectRatio: "9:16",
    resolution: { width: 1080, height: 1920 },
    maxDurationS: 60,
    maxFileMb: 500,
    container: "mp4",
    codec: "H.264, AAC 128 kbps, 30 fps",
    safeZones: {
      topPx: 200,
      bottomPx: 480,
      leftPx: 60,
      rightPx: 240,
      note: "The right column carries the interface icons and the bottom band carries the handle, the caption and the call to action button. Nothing you need read goes in either.",
    },
    captionRequirement: "burned_in",
    audioRequirement: "must_work_muted",
    brandAssetsProvided: ["Logo, SVG and PNG", "Product shots, raw", "Brand type, licensed for paid use"],
    namingConvention: "brand_concept_hook_variant_YYYYMMDD.mp4",
    checkedOn: "2026-06-01",
  },
  {
    id: "spec-meta-reels",
    name: "Meta Reels, 9:16, 30 s",
    platform: "meta",
    placements: ["Reels", "Stories"],
    aspectRatio: "9:16",
    resolution: { width: 1080, height: 1920 },
    maxDurationS: 90,
    maxFileMb: 4000,
    container: "mp4",
    codec: "H.264 high profile, AAC 128 kbps, 30 fps",
    safeZones: {
      topPx: 250,
      bottomPx: 500,
      leftPx: 60,
      rightPx: 60,
      note: "The bottom band is taken by the profile row and the call to action. Assume it is covered on every device and do not fight it.",
    },
    captionRequirement: "burned_in",
    audioRequirement: "must_work_muted",
    brandAssetsProvided: ["Logo, SVG and PNG", "Product shots, raw", "Approved claim list"],
    namingConvention: "brand_concept_hook_variant_YYYYMMDD.mp4",
    checkedOn: "2026-06-01",
  },
  {
    id: "spec-meta-feed-45",
    name: "Meta feed, 4:5 static",
    platform: "meta",
    placements: ["Feed", "Explore"],
    aspectRatio: "4:5",
    resolution: { width: 1080, height: 1350 },
    maxDurationS: 0,
    maxFileMb: 30,
    container: "mp4",
    codec: "PNG or JPG, sRGB, no transparency",
    safeZones: {
      topPx: 0,
      bottomPx: 0,
      leftPx: 40,
      rightPx: 40,
      note: "No interface overlay in feed, but the asset is cropped to 1:1 in some surfaces. Keep the argument inside the centre square.",
    },
    captionRequirement: "either",
    audioRequirement: "must_work_muted",
    brandAssetsProvided: ["Logo, SVG", "Product shots, raw", "Approved claim list"],
    namingConvention: "brand_concept_angle_variant_YYYYMMDD.png",
    checkedOn: "2026-06-01",
  },
  {
    id: "spec-yt-shorts",
    name: "YouTube Shorts, 9:16, 45 s",
    platform: "youtube",
    placements: ["Shorts"],
    aspectRatio: "9:16",
    resolution: { width: 1080, height: 1920 },
    maxDurationS: 60,
    maxFileMb: 2000,
    container: "mp4",
    codec: "H.264, AAC 192 kbps, 30 fps",
    safeZones: {
      topPx: 160,
      bottomPx: 420,
      leftPx: 60,
      rightPx: 200,
      note: "Shorts keeps a persistent title and channel row at the bottom. The right column carries the action stack.",
    },
    captionRequirement: "either",
    audioRequirement: "sound_on",
    brandAssetsProvided: ["Logo, SVG and PNG", "Product shots, raw"],
    namingConvention: "brand_concept_hook_variant_YYYYMMDD.mp4",
    checkedOn: "2026-06-01",
  },
];

/* ------------------------------------------------------------------ *
 * Briefs
 * ------------------------------------------------------------------ */

export const DEFAULT_RIGHTS: UsageRights = {
  organic: true,
  paid: true,
  whitelisting: false,
  termDays: 90,
  territory: ["DE", "AT", "CH"],
  exclusivityDays: 0,
  creditRequired: false,
  renegotiationTerms:
    "The term renews at 60 percent of the original fee. Renewal is agreed before the term expires, not after it.",
};

export const BRIEFS: Brief[] = [
  {
    id: "brief-01",
    brandId: "kapsel",
    campaign: "Spring prospecting, cold",
    objective: "prospecting",
    audience: {
      description: "Drinks coffee daily at home, owns a grinder, does not own scales",
      painPoint: "The cup is inconsistent and they cannot say why",
      currentSolution: "Supermarket beans and a guess",
      objection: "Specialty coffee is a hobby with an entry fee",
    },
    offer: "First bag 14 EUR, cancel any time, no starter kit",
    mandatoryClaims: ["Roasted in Hamburg", "Cancel any time"],
    prohibitedClaims: [
      "Any health claim, including energy, focus and metabolism",
      "Comparative superiority against a named competitor",
      "Organic, unless the certificate id is on screen",
      "Any price claim not currently live on the product page",
    ],
    toneReferences: [
      { url: "internal://swipe/kitchen-direct", whatToTake: "Handheld, one room, no music bed" },
      { url: "internal://swipe/admission-opener", whatToTake: "The opener admits a fault before it sells" },
    ],
    concepts: [
      { name: "Four years wrong", hookIdea: "Admit the mistake in the first line", angle: "Self correction" },
      { name: "Two piles", hookIdea: "Two grinds in one unbroken frame", angle: "Visible proof" },
      { name: "Cost per morning", hookIdea: "Open on the number, not the product", angle: "Price reframe" },
    ],
    deliverableSpecIds: ["spec-tt-infeed", "spec-meta-reels"],
    variantCount: 3,
    revisionRounds: 1,
    dueOn: "2026-02-24",
    usageRights: DEFAULT_RIGHTS,
    rate: { amount: 220, currency: "EUR", perDeliverable: true },
  },
  {
    id: "brief-02",
    brandId: "nordwand",
    campaign: "Winter retargeting, size objection",
    objective: "retargeting",
    audience: {
      description: "Visited a product page in the last 30 days, did not add to cart",
      painPoint: "Cannot judge fit online and has been burned by a return before",
      currentSolution: "Buying in a shop, or not buying",
      objection: "I will order the wrong size and the return will be a fight",
    },
    offer: "Free returns for 60 days, size guide before checkout",
    mandatoryClaims: ["Free returns within 60 days", "Measured size guide, not a conversion chart"],
    prohibitedClaims: [
      "Fully waterproof, unless the IP rating is on screen with the test standard",
      "Lifetime guarantee",
      "Comparative claims against a named competitor",
      "Any environmental claim without the certification body named",
    ],
    toneReferences: [
      { url: "internal://swipe/destructive-test", whatToTake: "The product is cut open on camera" },
      { url: "internal://swipe/size-guide-cta", whatToTake: "Click goes to a guide, not to a cart" },
    ],
    concepts: [
      { name: "Not the boots", hookIdea: "Reverse the blame in the first line", angle: "Assumption break" },
      { name: "Cut it open", hookIdea: "Destroy the product to show the seam", angle: "Construction proof" },
      { name: "Measure first", hookIdea: "A tape measure on a foot, no product for six seconds", angle: "Risk removal" },
    ],
    deliverableSpecIds: ["spec-meta-reels", "spec-meta-feed-45"],
    variantCount: 4,
    revisionRounds: 2,
    dueOn: "2026-01-05",
    usageRights: { ...DEFAULT_RIGHTS, whitelisting: true, termDays: 180, exclusivityDays: 90 },
    rate: { amount: 340, currency: "EUR", perDeliverable: true },
  },
];

/* ------------------------------------------------------------------ *
 * Rate card. The half nobody teaches.
 * ------------------------------------------------------------------ */

export const RATE_CARD: RateCardLine[] = [
  {
    deliverable: "One 9:16 video ad, up to 30 s, one concept",
    baseRate: { amount: 220, currency: "EUR" },
    modifiers: [
      { condition: "Whitelisting, runs from your handle", multiplier: 1.5 },
      { condition: "Term extended to 180 days", multiplier: 1.25 },
      { condition: "Perpetual term", multiplier: 2.5 },
      { condition: "Category exclusivity, 90 days", multiplier: 1.8 },
    ],
    includesRevisions: 1,
    rushFeePercent: 40,
  },
  {
    deliverable: "Three hook variants of one approved concept",
    baseRate: { amount: 380, currency: "EUR" },
    modifiers: [
      { condition: "Whitelisting, runs from your handle", multiplier: 1.5 },
      { condition: "Term extended to 180 days", multiplier: 1.25 },
    ],
    includesRevisions: 1,
    rushFeePercent: 40,
  },
  {
    deliverable: "One 4:5 static, one concept, two crops",
    baseRate: { amount: 120, currency: "EUR" },
    modifiers: [
      { condition: "Perpetual term", multiplier: 2.5 },
      { condition: "Print and out of home added", multiplier: 2.0 },
    ],
    includesRevisions: 2,
  },
  {
    deliverable: "Five frame carousel from an existing shoot",
    baseRate: { amount: 260, currency: "EUR" },
    modifiers: [{ condition: "Term extended to 180 days", multiplier: 1.25 }],
    includesRevisions: 1,
  },
  {
    deliverable: "Shoot day, up to six concepts, raw handed over",
    baseRate: { amount: 1450, currency: "EUR" },
    modifiers: [
      { condition: "Raw footage ownership transferred", multiplier: 1.6 },
      { condition: "Second creator on camera", multiplier: 1.35 },
    ],
    includesRevisions: 0,
    rushFeePercent: 25,
  },
  {
    deliverable: "Scripts only, three concepts, no shoot",
    baseRate: { amount: 160, currency: "EUR" },
    modifiers: [{ condition: "Written for a creator who is not you", multiplier: 1.3 }],
    includesRevisions: 2,
  },
];

/* ------------------------------------------------------------------ *
 * The go to market half
 * ------------------------------------------------------------------ */

export const GTM_PLAYS: GtmPlay[] = [
  {
    id: "play-01",
    name: "Creative led paid acquisition on one channel",
    motion: "paid_acquisition",
    icp: {
      segment: "Direct to consumer brand, one product line, ships within the DACH region",
      sizeBand: "150 k to 2 m EUR annual revenue",
      trigger: "Blended return has fallen for two consecutive months on flat spend",
      buyer: "Founder, or the one marketer who owns the ad account",
      blocker: "The agency that made the current creative is also the one reporting on it",
    },
    positioning: {
      category: "Creative supply for paid social",
      against: "A retainer agency that produces four assets a month",
      claim: "Volume of tested concepts is the input, not production polish",
      proof: "Concept count shipped per month, and the kill rate alongside it",
    },
    channels: [
      { name: "Meta Advantage campaign, one ad set", role: "acquire", cadence: "New concept batch every 14 days" },
      { name: "TikTok Spark Ads from the creator handle", role: "acquire", cadence: "Weekly" },
      { name: "Email flow on the size guide opt in", role: "nurture", cadence: "Four messages over ten days" },
      { name: "Product page", role: "convert", cadence: "Reviewed monthly against the winning ad's promise" },
    ],
    funnel: [
      { stage: "Impression", definition: "Served to a person in the target region", instrumentedBy: "Platform reporting" },
      { stage: "Three second view", definition: "The hook survived the thumb", instrumentedBy: "Platform reporting" },
      { stage: "Outbound click", definition: "Left the platform", instrumentedBy: "Platform plus UTM" },
      { stage: "Session with add to cart", definition: "Intent, before purchase", instrumentedBy: "Analytics, server side" },
      { stage: "Purchase", definition: "Paid order, refunds netted", instrumentedBy: "Shop backend, not the ad platform" },
    ],
    economics: { aov: 54, cac: 21, paybackMonths: 0, mer: 2.4, currency: "EUR", isIllustrative: true },
    artifacts: [
      { kind: "brief", label: "Concept brief, one page, with the prohibited claims block" },
      { kind: "sheet", label: "Concept tracker: concept, hook, variant, spend, kill or scale" },
      { kind: "landing_page", label: "Size guide page, which is the click target, not the cart" },
    ],
    failureModes: [
      "Judging a concept on a spend too small to say anything",
      "Rebuilding a winner as a higher production version and losing the reason it won",
      "Reporting platform attributed revenue as though it were the shop's revenue",
    ],
  },
  {
    id: "play-02",
    name: "Founder led outbound into a narrow list",
    motion: "outbound",
    icp: {
      segment: "Brands already running paid social with in house creative and no creative pipeline",
      sizeBand: "Two to fifteen people",
      trigger: "A new ad account, or a hiring post for a video editor",
      buyer: "Founder",
      blocker: "They believe creative is a taste problem, so they want a portfolio, not a process",
    },
    positioning: {
      category: "Creative operations, not production",
      against: "Hiring one in house editor",
      claim: "A pipeline that ships twelve tested concepts a month beats one editor shipping four",
      proof: "The tracker, shown live, including the concepts that were killed",
    },
    channels: [
      { name: "Direct email, one list of 60, researched by hand", role: "acquire", cadence: "Twelve per week, no automation" },
      { name: "A public teardown of their own current ad", role: "nurture", cadence: "One per prospect, sent unrequested" },
      { name: "A paid pilot of three concepts", role: "convert", cadence: "Two week turnaround" },
    ],
    funnel: [
      { stage: "Researched account", definition: "You have watched their live ads", instrumentedBy: "A sheet, by hand" },
      { stage: "Reply", definition: "Any human reply, including a no", instrumentedBy: "Inbox label" },
      { stage: "Teardown call", definition: "Thirty minutes on their creative, not on your offer", instrumentedBy: "Calendar" },
      { stage: "Paid pilot", definition: "Three concepts, invoiced", instrumentedBy: "Invoice" },
      { stage: "Retainer", definition: "Monthly concept quota agreed", instrumentedBy: "Contract" },
    ],
    economics: { aov: 1800, cac: 240, paybackMonths: 1, currency: "EUR", isIllustrative: true },
    artifacts: [
      { kind: "sequence", label: "Three message sequence, no follow up automation" },
      { kind: "brief", label: "Pilot brief, three concepts, fixed fee" },
      { kind: "dashboard", label: "Reply rate by trigger type" },
    ],
    failureModes: [
      "Sending the teardown as a pitch instead of as a teardown",
      "Pricing the pilot low enough that the retainer cannot be priced up from it",
      "Building a list of brands who cannot spend enough for creative volume to matter",
    ],
  },
];

/* ------------------------------------------------------------------ *
 * The programme
 * ------------------------------------------------------------------ */

export const PROGRAM: Program = {
  slug: "six-weeks-on-the-card",
  title: "Six Weeks On The Card",
  forWhom: ["freelance_creator", "in_house_marketer", "agency_owner", "founder"],
  notForYouIf: [
    "You want a portfolio without posting anything publicly",
    "You cannot put four to six production hours a week on the calendar",
    "You are looking for a following. This programme is about ads a media buyer will scale, which is a different job",
    "You want templates you can run without watching what they do",
    "You need the qualification more than the work",
  ],
  durationWeeks: 6,
  weeklyCommitment: { liveHours: 3, productionHours: 5 },
  format: "live_cohort",
  outputQuota: { hooksPerWeek: 40, editsPerWeek: 12, postedPerWeek: 3 },
  modules: [
    {
      index: 1,
      title: "Hooks",
      thesis:
        "The hook is the first 1.2 seconds. Everything after it is retention maintenance.",
      deliverable: "40 written hooks, 12 shot, 3 cut into a single reel and posted",
      outputCount: 40,
      outputUnit: "written hooks",
      teardownIds: ["td-01", "td-03"],
      critiqueFormat: "Live, on your own footage, 8 minutes each, camera on",
    },
    {
      index: 2,
      title: "Retention",
      thesis:
        "Every second after the hook is a decision to keep watching, and you can see exactly where they stopped.",
      deliverable: "One 30 second edit with beat markers and a written retention plan",
      outputCount: 24,
      outputUnit: "beat marked cuts",
      teardownIds: ["td-01", "td-02"],
      critiqueFormat: "Retention graph read live, your curve on the screen",
    },
    {
      index: 3,
      title: "Objection and offer",
      thesis:
        "An ad that never names the objection is asking the landing page to do the hard half.",
      deliverable: "Two ads, each answering one named objection, with the objection written on the brief",
      outputCount: 14,
      outputUnit: "objection scripts",
      teardownIds: ["td-02", "td-04"],
      critiqueFormat: "Paired review, you argue the other person's objection back at them",
    },
    {
      index: 4,
      title: "Static and carousel",
      thesis:
        "Static is not the cheap option. It is the format where the argument has to survive at thumbnail size.",
      deliverable: "One 4:5 static and one five frame carousel from the same brief",
      outputCount: 9,
      outputUnit: "static assets",
      teardownIds: ["td-04"],
      critiqueFormat: "Thumbnail test, reviewed at 120 px wide before anything is opened",
    },
    {
      index: 5,
      title: "Brief, rate card and rights",
      thesis:
        "Whitelisting, term and category exclusivity are three separate prices. Most creators charge for none of them.",
      deliverable: "Your own rate card and a usage rights schedule ready to attach to an invoice",
      outputCount: 5,
      outputUnit: "commercial documents",
      teardownIds: [],
      critiqueFormat: "Line by line on your rate card, in front of the group",
    },
    {
      index: 6,
      title: "The scale test",
      thesis:
        "A winner is a concept that survives three variants against a control, not a video you liked.",
      deliverable: "Three variants of one winner, launched against a control, with a written read",
      outputCount: 3,
      outputUnit: "launched variants",
      teardownIds: ["td-01", "td-03"],
      critiqueFormat: "Read the result together, including the ones that lost",
    },
  ],
  toolsTaught: [
    { name: "CapCut", costToStudent: "Free tier is enough", required: true },
    { name: "DaVinci Resolve", version: "19 or later", costToStudent: "Free", required: false },
    { name: "Meta Ads Manager", costToStudent: "Free, an account is required", required: true },
    { name: "TikTok Ads Manager", costToStudent: "Free, an account is required", required: false },
    { name: "Meta Ad Library", costToStudent: "Free, no account", required: true },
    { name: "A phone with a working camera", costToStudent: "The one you have", required: true },
  ],
  adSpendRequired: {
    amount: 200,
    currency: "EUR",
    note: "Across the six weeks, on your own account. If you cannot spend it, take the self paced route, which does not need it.",
  },
  portfolioOutcome:
    "Nine posted ads, one rebuilt loser, one rate card, one rights schedule and a tracker with your own kill rate in it.",
  swipeFile: { entryCount: 340, updateCadence: "New entries every Friday, older entries dated and kept" },
  community: {
    platform: "One Discord server, one channel per cohort",
    moderated: true,
    retentionAfterProgram: "Your cohort channel stays open. You keep read and write access with no further payment.",
  },
};

export const SELF_PACED = {
  title: "Self paced",
  price: 690,
  currency: "EUR",
  durationWeeks: 0,
  liveHours: 0,
  productionHours: 5,
  critique: "None. Written feedback on two submissions.",
  adSpend: 0,
  cohort: "Start any day",
  quota: "Same brief set, no deadline enforced",
};

export const OFFER: Offer = {
  listPrice: {
    amount: 1450,
    currency: "EUR",
    taxNote: "Net. Plus 19 percent VAT. German consumers pay 1725,50 EUR gross.",
  },
  paymentOptions: [
    { kind: "upfront", total: 1450, note: "Paid once, before the cohort opens." },
    {
      kind: "instalments",
      count: 3,
      amountEach: 510,
      feePercent: 5.5,
      total: 1530,
      note: "Three payments, 30 days apart. The 80 EUR difference is the finance fee, stated here rather than hidden in the total.",
    },
  ],
  deadline: {
    closesAt: "2026-09-04",
    reason:
      "Critique groups are formed on 4 September and the running order for all six weeks is set from them. There is no seat to add after that date, and the page will say closed rather than reopen.",
  },
  bonuses: [
    {
      name: "The spec sheet, kept current",
      description:
        "Deliverable specs by platform and placement with safe zones, re-checked quarterly. You keep access after the cohort.",
    },
    {
      name: "The rate card template",
      description:
        "The modifier model on this page as an editable document, with the usage rights schedule attached.",
    },
  ],
  bonusValueNote:
    "We do not attach a standalone value to either of these. A struck through number that was never charged is not a discount.",
  guaranteeAbsence:
    "There is no results guarantee. Nobody can guarantee what your ads will do, and a guarantee that depends on your output is a guarantee on your work, not on ours. What exists is the refund window below, quoted in full.",
  refundPolicy: {
    quotedVerbatim:
      "You may cancel within 14 days of purchase and receive a full refund, including after you have attended the first live session. After day 14 no refund is issued and any remaining instalments remain due.",
    windowDays: 14,
    conditions: "Cancel by email. No form, no call, no retention offer.",
  },
};

export const AUDIENCE_PATHS: Array<{
  key: ForWhom;
  weightClass: string;
  who: string;
  startsAt: string;
  changesForYou: string;
  skip: string;
}> = [
  {
    key: "freelance_creator",
    weightClass: "Freelance creator",
    who: "You shoot and cut, you invoice brands, and you have never priced whitelisting separately",
    startsAt: "Week 1, then week 5 matters most",
    changesForYou:
      "Week 5 is the one that changes your invoice. You leave with a rate card that prices term, exclusivity and whitelisting as three separate lines.",
    skip: "Nothing. This route is the default running order.",
  },
  {
    key: "in_house_marketer",
    weightClass: "In house marketer",
    who: "You own the ad account and you are the bottleneck on creative volume",
    startsAt: "Week 1, with week 6 read early",
    changesForYou:
      "You stop briefing for polish and start briefing for concept count. The tracker from week 6 becomes your weekly report.",
    skip: "Week 5 is optional. You are not invoicing for the work.",
  },
  {
    key: "agency_owner",
    weightClass: "Agency owner",
    who: "You bill for creative and your team ships four assets a month",
    startsAt: "Week 2, then week 5 and week 6",
    changesForYou:
      "The brief and the rate card become your commercial model, not your production process. Week 6 is what you sell.",
    skip: "Week 1 if your team already writes at volume. Watch the critique anyway.",
  },
  {
    key: "founder",
    weightClass: "Founder",
    who: "You are the account, the creative and the person paying for the test spend",
    startsAt: "Week 1, then week 3",
    changesForYou:
      "Week 3 is the one. Your objection list becomes the brief, and the brief stops being about your product story.",
    skip: "Week 5 unless you are hiring creators. Then it is the most useful week on the card.",
  },
];

export const COMPLIANCE = {
  intro:
    "Compliance is part of the deliverable, not a legal afterthought. An ad that gets an account restricted is a failed ad regardless of its hook rate.",
  prohibited: [
    "Health, medical and weight claims without the substantiation on screen",
    "Before and after images in any health, fitness or skin category",
    "Personal attributes: writing as though you know something about the viewer",
    "Comparative claims against a named competitor, which is a competition law question in Germany, not only a platform one",
    "Countdown devices or scarcity that is not structurally true",
    "Any earnings claim, including implied ones through lifestyle framing",
  ],
  disclosure: [
    "Paid partnership disclosure at the platform level, not only in the caption",
    "Werbung or Anzeige labelling on organic posts under German rules, in the first line and not behind a fold",
    "Affiliate relationships named in the creative when the click is affiliate",
  ],
  taught:
    "Week 3 covers the prohibited claim block on the brief, and week 5 covers disclosure and the rights schedule. Both are on the card because accounts get restricted for both.",
};

export const PROOF_LEDGER: ProofItem[] = [
  {
    kind: "ad_library_link",
    claimSupported: "The ads on this card ran, for these advertisers, between these dates",
    subject: "Every teardown on this page",
    status: "synthetic_in_this_build",
    wouldCarry:
      "A Meta Ad Library permalink or a TikTok Creative Center permalink that a stranger opens without an account and without trusting us.",
  },
  {
    kind: "platform_screenshot",
    claimSupported: "The hook rate, hold rate, CPA and return figures in each tale of the tape",
    subject: "Every performance figure on this page",
    status: "synthetic_in_this_build",
    wouldCarry:
      "An uncropped Ads Manager export with the account name, the date range and the spend visible in the same frame as the return.",
  },
  {
    kind: "student_ad",
    claimSupported: "Students finish holding nine posted ads",
    subject: "Cohort work",
    status: "synthetic_in_this_build",
    wouldCarry:
      "The student's own ad library entry, their cohort id and the post date, published with their written consent.",
  },
  {
    kind: "brand_permission",
    claimSupported: "The brands named on the teardowns agreed to be named",
    subject: "Advertiser names",
    status: "synthetic_in_this_build",
    wouldCarry:
      "A signed permission on file per advertiser, plus a statement of who funded the media spend behind each figure.",
  },
  {
    kind: "document",
    claimSupported: "The price, the payment terms, the refund wording and the close date",
    subject: "The ticket band on this page",
    status: "real_in_this_build",
    wouldCarry: "The terms as written here, and nothing quoted differently at checkout.",
  },
  {
    kind: "document",
    claimSupported: "The deliverable specs, safe zones, rate card mechanics and rights schedule",
    subject: "The spec sheet and the rate card",
    status: "real_in_this_build",
    wouldCarry:
      "The dated spec sheet itself, re-checked against the platform documentation on the date shown.",
  },
];

/* ------------------------------------------------------------------ *
 * Lookups and formatting
 * ------------------------------------------------------------------ */

export const adById = (id: string) => AD_ASSETS.find((a) => a.id === id);
export const teardownBySlug = (slug: string) => TEARDOWNS.find((t) => t.slug === slug);
export const briefById = (id?: string) => BRIEFS.find((b) => b.id === id);
export const specById = (id?: string) => SPECS.find((s) => s.id === id);
export const instructorById = (id: string) => INSTRUCTORS.find((i) => i.id === id);

export const fmtInt = (n: number) => n.toLocaleString("de-DE");
export const fmtMoney = (n: number) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtSeconds = (s: number) => `${s.toFixed(1)} s`;
export const timecode = (s: number) => {
  const whole = Math.floor(s);
  const frac = Math.round((s - whole) * 10);
  const mm = String(Math.floor(whole / 60)).padStart(2, "0");
  const ss = String(whole % 60).padStart(2, "0");
  return `${mm}:${ss}.${frac}`;
};
