// ILLUSTRATIVE DATA. "Second Shift" is not a real school. Every figure below (prices, seat
// counts, instructor stamp codes, cohort dates, capstone repositories) is a plausible
// specimen written for the Gmira proof, not a claim about a real programme, and the page
// says so where a reader can see it (doctrine G7: zero invented metrics, testimonials, logos
// or client names presented as real).
//
// Two things here are NOT invented and are meant to be checked: the field names follow the
// content model in references/playbooks/ai-school.md section 1, and every entry in
// `readings` points at a real, publicly reachable document by its real author.

export type Iso = string; // "2026-09-14", or a local datetime "2026-09-15T18:00"
export type Minutes = number;

/* ------------------------------------------------------------------ types */

export interface Prerequisite {
  requirement: string;
  hard: boolean;
  selfCheck?: string; // a task the applicant can attempt in 20 minutes, described in full
}

export interface Outcome {
  statement: string;
  evidencedBy: string; // module id
}

export interface ToolchainEntry {
  name: string;
  version: string;
  role: string;
  costToStudent?: { amount: number; currency: string; note: string };
  alternativeAllowed: boolean;
}

export interface Session {
  id: string;
  kind: "lecture" | "workshop" | "review" | "office_hours" | "guest" | "lab";
  title: string;
  durationMinutes: Minutes;
  liveAt?: Iso;
  timezone: string;
  recorded: boolean;
  recordingRetentionMonths?: number;
  instructorIds: string[];
  materials: Array<{ kind: "slides" | "notebook" | "repo" | "dataset" | "transcript"; url?: string }>;
}

export interface Module {
  id: string;
  index: number;
  weekRange: [number, number];
  title: string;
  thesis: string;
  deliverable: {
    name: string;
    artifactType: "repository" | "service" | "dataset" | "eval_harness" | "writeup" | "deployment";
    acceptanceCriteria: string[];
    estimatedHours: number;
  };
  sessions: Session[];
  concepts: string[];
  commonFailure: string;
  readings: Array<{ title: string; author: string; url: string; required: boolean; minutes: number }>;
  prerequisiteModuleIds: string[];
}

export interface Capstone {
  brief: string;
  constraints: string[];
  durationWeeks: number;
  reviewedBy: string[];
  publicDemoDay: boolean;
  releasedInWeek: number;
  estimatedHours: number;
  examples: Array<{ title: string; studentName?: string; repoUrl?: string; demoUrl?: string; oneLine: string; cohortId: string }>;
}

export interface RubricCriterion {
  name: string;
  weight: number;
  levels: Array<{ label: "not yet" | "meets" | "exceeds"; descriptor: string }>;
}

export interface Instructor {
  id: string;
  stamp: string; // the three character operator code punched on every op this person runs
  name: string;
  role: string;
  shipped: Array<{ what: string; where: string; scale?: string; url?: string }>;
  teachesModuleIds: string[];
  writing?: Array<{ title: string; url: string }>;
  availabilityNote?: string;
}

export interface Cohort {
  id: string;
  programId: string;
  startsOn: Iso;
  endsOn: Iso;
  applicationsCloseOn: Iso;
  capacity: number;
  seatsRemaining: number;
  status: "open" | "waitlist" | "closed" | "running" | "completed";
  liveSchedule: Array<{ weekday: 1 | 2 | 3 | 4 | 5 | 6 | 7; startLocal: string; durationMinutes: Minutes; kind: Session["kind"] }>;
  timezone: string;
  cohortLanguage: string;
  instructorIds: string[];
  teachingAssistantRatio?: string;
}

export interface Admission {
  steps: Array<{ index: number; name: string; whatHappens: string; typicalDays: number }>;
  applicationFields: string[];
  technicalScreen: { format: string; durationMinutes: Minutes; whatIsAssessed: string[] };
  decisionSlaDays: number;
  acceptanceNote: string;
}

export type PaymentOption =
  | { kind: "upfront"; discountPercent: number; note: string }
  | { kind: "instalments"; count: number; amountEach: number; feePercent: number; note: string }
  | { kind: "employer_invoice"; leadTimeDays: number; poAccepted: boolean; note: string };

export interface Pricing {
  listPrice: { amount: number; currency: string; taxNote: string; taxNoteShort: string };
  paymentOptions: PaymentOption[];
  scholarships: Array<{ name: string; criteria: string; seats: number; deadline: Iso }>;
  additionalCosts: Array<{ item: string; estimate: string }>;
  refundPolicy: {
    fullRefundBeforeDay: number;
    partialSchedule: Array<{ beforeDay: number; refundPercent: number }>;
    conditions: string;
    quotedVerbatim: string;
  };
  deferralPolicy: { allowed: boolean; feeAmount: number; noticeDays: number; maxDeferrals: number; note: string };
  guarantee: null;
  guaranteeNote: string;
}

/* ------------------------------------------------------- the card head */

export const SHOP = {
  name: "Second Shift",
  why: "The whole routing runs after 17:00 Berlin time, because everyone on it has a day job. That is where the name comes from and it is the only thing it means.",
  partNumber: "AIE-12",
  partName: "Applied AI Engineering",
  routingRev: "C",
  routingRevDate: "2026-07-14",
  plannerStamp: "RN4",
  formNumber: "SS-ROUT-002",
  formRev: "C",
  specimenNote:
    "Specimen routing. Second Shift is a demonstration for the Gmira proof, not a school that exists. Prices, seat counts, operator records and capstone repositories on this card are illustrative. The linked reference documents are real.",
};

export const PROGRAM = {
  id: "aie-12",
  slug: "applied-ai-engineering",
  title: "Applied AI Engineering",
  positioning:
    "A graduate can put a retrieval and agent service in front of real users, prove with numbers when it is wrong, hold it to a cost ceiling, and keep it answering on the day the provider is not.",
  level: "professional" as const,
  format: "live_online" as const,
  languageOfInstruction: "English",
  durationWeeks: 12,
  weeklyCommitment: { liveHours: 5.5, asyncHours: 11 },
  totalContactHours: 66,
  repositoryTemplateUrl: "https://github.com/example-org/second-shift-routing-template",
  repositoryTemplateNote:
    "Public. Clone it before the screen if you want to see what week 1 looks like. The commit dates are the honest answer to whether this routing is maintained.",
  toolchainLastReviewedOn: "2026-07-14",
};

export const EXPECTED_BACKGROUND = [
  "Backend or platform engineer, two years or more",
  "Data analyst already writing Python daily, moving into engineering",
  "Full stack engineer who owns a service in production",
  "SRE or infrastructure engineer picking up an LLM feature nobody else wants",
];

export const PREREQUISITES: Prerequisite[] = [
  {
    requirement: "You can read a Python stack trace, find the frame that matters, and fix the bug behind it.",
    hard: true,
    selfCheck:
      "Clone the routing template, run `make break`, and fix the three failing tests. Twenty minutes is the honest budget. If it takes two hours, apply to the cohort after this one.",
  },
  {
    requirement: "You have shipped code that ran on a machine you do not own, and you were the one who found out when it stopped.",
    hard: true,
  },
  {
    requirement: "You can write a SQL join and a GROUP BY without looking either one up.",
    hard: true,
    selfCheck:
      "In the template, `sql/selfcheck.sql` has four queries with the bodies removed and the expected result sets committed. Fill them in until `make sql` is green.",
  },
  {
    requirement: "You can put 16 to 17 hours a week aside for twelve weeks, and you have already told whoever that affects.",
    hard: true,
    selfCheck:
      "The arithmetic is on this card: 5.5 live hours plus 11 async hours. The async number is the sum of the nine deliverable estimates divided by twelve, not a marketing figure.",
  },
  {
    requirement: "You have used git on a shared branch, including at least one rebase you had to think about.",
    hard: false,
  },
  {
    requirement: "You have called an HTTP API from a script and handled a non-200 yourself rather than letting it raise.",
    hard: false,
  },
];

export const NOT_FOR_YOU_IF = [
  "You want to learn Python here. Week 1 starts on the assumption that you already write it.",
  "You need an accredited certificate for a visa or a funding body. We are not accredited and we will not imply otherwise.",
  "You are buying a job guarantee. There is none. The refund schedule further down is the only money-back mechanism that exists.",
  "You want to pretrain or fine-tune foundation models. Different discipline, different programme, not this one.",
  "You cannot attend the Thursday review live. The review is the programme. The recording is not a substitute and we will say so at the screen rather than after you have paid.",
];

export const OUTCOMES: Outcome[] = [
  {
    statement: "Ship a retrieval service over 2,000 documents you brought yourself, scored against an eval set you wrote before you built it.",
    evidencedBy: "m03",
  },
  {
    statement: "Write an eval set that catches a regression your unit tests miss, and run it in CI on every merge.",
    evidencedBy: "m02",
  },
  {
    statement: "Decide, with evidence rather than impression, whether a wrong answer belongs to retrieval, to context assembly, to generation, or to your own source data.",
    evidencedBy: "m04",
  },
  {
    statement: "State the cost of a request in cents before it runs, and enforce a per-tenant ceiling that returns a documented error instead of a bill.",
    evidencedBy: "m05",
  },
  {
    statement: "Build an agent loop with a spend budget, a wall clock timeout and a replay log a second person can run on a second machine.",
    evidencedBy: "m06",
  },
  {
    statement: "Put the thing behind a queue and a health check, and say what happens when the provider returns 529 for nine minutes.",
    evidencedBy: "m07",
  },
  {
    statement: "Run a rollout across two model versions with the stopping rule written before the first request, and read the result without fooling yourself.",
    evidencedBy: "m08",
  },
];

export const OUT_OF_SCOPE = [
  "Pretraining, fine-tuning, LoRA and adapters. We use hosted and open weights models as they ship.",
  "GPU cluster operations, CUDA, kernel work.",
  "Front end. You will write one HTML page in week 10 and that is the whole of it.",
  "Prompt engineering as a subject in its own right. Prompts appear inside evaluation and nowhere else.",
  "Paper reading groups, benchmark leaderboards, model research.",
  "Audio and video pipelines. Text and page images only.",
];

/* ------------------------------------------------------------- schedule */

// Cohort c07 starts Monday 2026-09-14. Live slots: Tue and Wed 18:00, Thu 18:00, Fri 17:00.
const WEEK: Record<number, { tue: string; wed: string; thu: string; fri: string }> = {
  1: { tue: "2026-09-15", wed: "2026-09-16", thu: "2026-09-17", fri: "2026-09-18" },
  2: { tue: "2026-09-22", wed: "2026-09-23", thu: "2026-09-24", fri: "2026-09-25" },
  3: { tue: "2026-09-29", wed: "2026-09-30", thu: "2026-10-01", fri: "2026-10-02" },
  4: { tue: "2026-10-06", wed: "2026-10-07", thu: "2026-10-08", fri: "2026-10-09" },
  5: { tue: "2026-10-13", wed: "2026-10-14", thu: "2026-10-15", fri: "2026-10-16" },
  6: { tue: "2026-10-20", wed: "2026-10-21", thu: "2026-10-22", fri: "2026-10-23" },
  7: { tue: "2026-10-27", wed: "2026-10-28", thu: "2026-10-29", fri: "2026-10-30" },
  8: { tue: "2026-11-03", wed: "2026-11-04", thu: "2026-11-05", fri: "2026-11-06" },
  9: { tue: "2026-11-10", wed: "2026-11-11", thu: "2026-11-12", fri: "2026-11-13" },
  10: { tue: "2026-11-17", wed: "2026-11-18", thu: "2026-11-19", fri: "2026-11-20" },
  11: { tue: "2026-11-24", wed: "2026-11-25", thu: "2026-11-26", fri: "2026-11-27" },
  12: { tue: "2026-12-01", wed: "2026-12-02", thu: "2026-12-03", fri: "2026-12-04" },
};

const TZ = "Europe/Berlin";
const RETENTION = 24;

/** Four live slots make up one week of any operation. Lecture and workshop are named per
 *  week; the Thursday review and the Friday office hours are the same mechanic every week,
 *  which is the point of them. */
function weekSessions(
  mod: string,
  n: number,
  lecture: string,
  workshop: string,
  who: string[],
  guest?: { title: string; who: string[] },
): Session[] {
  const d = WEEK[n];
  return [
    {
      id: `${mod}-w${n}-lec`,
      kind: guest ? "guest" : "lecture",
      title: guest ? guest.title : lecture,
      durationMinutes: 90,
      liveAt: `${d.tue}T18:00`,
      timezone: TZ,
      recorded: true,
      recordingRetentionMonths: RETENTION,
      instructorIds: guest ? guest.who : who,
      materials: [{ kind: "slides" }, { kind: "transcript" }],
    },
    {
      id: `${mod}-w${n}-wsh`,
      kind: "workshop",
      title: workshop,
      durationMinutes: 120,
      liveAt: `${d.wed}T18:00`,
      timezone: TZ,
      recorded: true,
      recordingRetentionMonths: RETENTION,
      instructorIds: who,
      materials: [{ kind: "repo" }, { kind: "notebook" }],
    },
    {
      id: `${mod}-w${n}-rev`,
      kind: "review",
      title: "Thursday review. Four minutes each, one minute of questions, twelve to a room.",
      durationMinutes: 60,
      liveAt: `${d.thu}T18:00`,
      timezone: TZ,
      recorded: true,
      recordingRetentionMonths: RETENTION,
      instructorIds: who,
      materials: [{ kind: "transcript" }],
    },
    {
      id: `${mod}-w${n}-oh`,
      kind: "office_hours",
      title: "Office hours. Drop in, bring the failing thing, no agenda.",
      durationMinutes: 60,
      liveAt: `${d.fri}T17:00`,
      timezone: TZ,
      recorded: false,
      instructorIds: who,
      materials: [],
    },
  ];
}

/* -------------------------------------------------------------- modules */

export const MODULES: Module[] = [
  {
    id: "m01",
    index: 1,
    weekRange: [1, 1],
    title: "The harness before the model",
    thesis:
      "Nothing on this routing is measurable until the call, its cost and its failure all land in one place, so that goes in before anything interesting does.",
    deliverable: {
      name: "A request harness that persists prompt, response, token counts, latency, cost and provider error for every call",
      artifactType: "repository",
      estimatedHours: 8,
      acceptanceCriteria: [
        "Every call is written to Postgres with a trace id that survives a retry and a process restart.",
        "Cost in EUR cents is computed from the usage block the provider returned, not estimated from a published rate card.",
        "A provider 429 and a provider 529 produce two different rows and two different counters.",
        "`make replay TRACE=<id>` reissues a stored call and prints a diff of the two responses.",
        "The wire request and the wire response are stored verbatim, so a second provider can be added without a migration.",
      ],
    },
    sessions: weekSessions(
      "m01",
      1,
      "What a call actually costs, and where the number comes from",
      "Build the harness: schema, trace identity, replay",
      ["i-rn"],
    ),
    concepts: ["token accounting", "trace identity", "idempotency keys", "provider error taxonomy", "structured logging", "replay"],
    commonFailure:
      "Students build the store around one provider's SDK object, then cannot add the second provider in OP 080 without rewriting it. Persist the wire request and the wire response. The SDK object is not your data model.",
    readings: [
      {
        title: "Idempotent requests",
        author: "Stripe API reference",
        url: "https://docs.stripe.com/api/idempotent_requests",
        required: true,
        minutes: 10,
      },
      {
        title: "The Log: what every software engineer should know about real-time data's unifying abstraction",
        author: "Jay Kreps",
        url: "https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying",
        required: false,
        minutes: 45,
      },
    ],
    prerequisiteModuleIds: [],
  },
  {
    id: "m02",
    index: 2,
    weekRange: [2, 3],
    title: "Evaluation you write before you build",
    thesis:
      "An eval set written after the system exists only measures what you already made, so this one is written first and is allowed to fail on day one.",
    deliverable: {
      name: "A 60 question eval set with three grader types, run from CI on every merge",
      artifactType: "eval_harness",
      estimatedHours: 12,
      acceptanceCriteria: [
        "Sixty questions with a written answer key. At least twelve are adversarial and six are unanswerable from the corpus.",
        "Every question in the graded set records a human author. Questions generated by a model sit in a separate, ungraded file.",
        "Three grader types present: exact match, a schema check, and a model grader.",
        "The model grader's agreement with your own labels is reported as a number. Cohen's kappa above 0.75, or a written explanation of why not.",
        "The suite finishes in under six minutes in CI and blocks a merge when the score falls more than three points.",
      ],
    },
    sessions: [
      ...weekSessions("m02", 2, "What a question is worth, and why sixty", "Write the first thirty questions and the answer key", ["i-rn"]),
      ...weekSessions("m02", 3, "Graders, agreement, and grading the grader", "Wire the suite into CI and break it on purpose", ["i-rn"]),
    ],
    concepts: [
      "answer key authorship",
      "adversarial and unanswerable items",
      "exact match and schema graders",
      "model as grader",
      "inter-rater agreement",
      "regression gates in CI",
    ],
    commonFailure:
      "The eval set is generated by asking a model for questions, so it measures the model's idea of the domain instead of yours, and it agrees with the system for the wrong reason. Every graded question has a human author recorded in the file.",
    readings: [
      {
        title: "The measurement of observer agreement for categorical data",
        author: "Landis and Koch",
        url: "https://doi.org/10.2307/2529310",
        required: true,
        minutes: 40,
      },
      {
        title: "The reusable holdout: preserving validity in adaptive data analysis",
        author: "Dwork, Feldman, Hardt, Pitassi, Reingold and Roth",
        url: "https://doi.org/10.1126/science.aaa9375",
        required: true,
        minutes: 35,
      },
      {
        title: "A few useful things to know about machine learning",
        author: "Pedro Domingos",
        url: "https://homes.cs.washington.edu/~pedrod/papers/cacm12.pdf",
        required: false,
        minutes: 30,
      },
    ],
    prerequisiteModuleIds: ["m01"],
  },
  {
    id: "m03",
    index: 3,
    weekRange: [4, 5],
    title: "Retrieval that survives contact with real documents",
    thesis:
      "Retrieval quality lives in the extractor, the chunk boundary and the query, not in the model, and the OP 020 eval set is what proves which one you are looking at.",
    deliverable: {
      name: "A retrieval service over 2,000 documents you brought, scored on the OP 020 set",
      artifactType: "service",
      estimatedHours: 16,
      acceptanceCriteria: [
        "Two thousand or more documents that did not come from us, ingested with source, page and revision preserved.",
        "Recall at 10 reported before and after each of four named changes, with the four changes written down.",
        "A hybrid path (BM25 plus vector) beats each single path on your own set, or you show the case where it does not and say why.",
        "Chunk boundaries are inspectable: a URL renders the exact text that was embedded, byte for byte.",
        "Query latency at p95 under 400 ms with the index warm, measured on your own hardware and reported with the hardware.",
      ],
    },
    sessions: [
      ...weekSessions("m03", 4, "Extraction is the whole problem: PDFs, tables, two columns", "Ingest your own corpus and read twenty extractions by eye", ["i-mb"]),
      ...weekSessions("m03", 5, "Hybrid retrieval, and why the index has to be visible", "Four changes, four measurements, one table", ["i-mb", "i-rn"]),
    ],
    concepts: [
      "document extraction",
      "chunk boundaries",
      "BM25",
      "dense retrieval",
      "hybrid scoring and fusion",
      "recall at k",
      "index inspection",
    ],
    commonFailure:
      "The PDF layer silently drops tables and two column layouts, so bad recall looks like a model problem for three days. Read twenty extracted documents by eye before you touch an embedding. Every cohort so far has lost time here.",
    readings: [
      {
        title: "The probabilistic relevance framework: BM25 and beyond",
        author: "Robertson and Zaragoza",
        url: "https://doi.org/10.1561/1500000019",
        required: true,
        minutes: 90,
      },
      {
        title: "PostgreSQL 17 documentation, chapter 12: full text search",
        author: "PostgreSQL Global Development Group",
        url: "https://www.postgresql.org/docs/17/textsearch.html",
        required: true,
        minutes: 45,
      },
      {
        title: "pgvector: open source vector similarity search for Postgres",
        author: "Andrew Kane",
        url: "https://github.com/pgvector/pgvector",
        required: true,
        minutes: 25,
      },
    ],
    prerequisiteModuleIds: ["m01", "m02"],
  },
  {
    id: "m04",
    index: 4,
    weekRange: [6, 6],
    title: "Attributing a failure to the part that caused it",
    thesis:
      "Most of what gets called a model error is retrieval, context order, or your own source data, and there is a procedure that tells you which one it is.",
    deliverable: {
      name: "A failure attribution report over 40 real failures from your own service",
      artifactType: "writeup",
      estimatedHours: 8,
      acceptanceCriteria: [
        "Forty failures, each attributed to retrieval, context assembly, generation or source data, with the evidence for the call attached.",
        "An oracle context test is run for every one: given the correct chunk, does the answer become right?",
        "The three largest buckets each carry a proposed fix and an estimate in engineering hours.",
        "At least one attribution is reversed by the oracle test, and the reversal is written down rather than quietly corrected.",
      ],
    },
    sessions: weekSessions("m04", 6, "The oracle context test, and four buckets", "Attribute forty failures together, out loud", ["i-mb", "i-rn"]),
    concepts: ["oracle context test", "failure taxonomy", "context assembly order", "source data defects", "attribution bias"],
    commonFailure:
      "Attribution gets done from the answer text alone, so anything that reads confidently is filed as a generation problem. The oracle context test is not an extra step, it is the method.",
    readings: [
      {
        title: "Hyrum's law",
        author: "Hyrum Wright",
        url: "https://www.hyrumslaw.com/",
        required: false,
        minutes: 5,
      },
      {
        title: "Site reliability engineering, chapter 4: service level objectives",
        author: "Betsy Beyer, Chris Jones, Jennifer Petoff and Niall Richard Murphy",
        url: "https://sre.google/sre-book/service-level-objectives/",
        required: true,
        minutes: 40,
      },
    ],
    prerequisiteModuleIds: ["m02", "m03"],
  },
  {
    id: "m05",
    index: 5,
    weekRange: [7, 7],
    title: "Cost, ceilings, and the bill nobody read",
    thesis:
      "A price per request that no one computes is a price per request that finance discovers, and by then the design that caused it has shipped.",
    deliverable: {
      name: "Cost ceiling middleware with per-tenant budgets and a real 402 path",
      artifactType: "service",
      estimatedHours: 10,
      acceptanceCriteria: [
        "Cost per request is known from the assembled prompt before generation, within 8 percent of the reconciled actual.",
        "A tenant over budget receives a 402 with a machine readable body and a documented recovery, not a 500.",
        "The cache reports a hit rate and the money it saved per day, in EUR, from real traffic.",
        "A daily budget breach wakes nobody at 03:00, because the degradation is defined in advance and tested.",
      ],
    },
    sessions: weekSessions("m05", 7, "Estimate before, reconcile after: the two numbers", "Ceiling middleware, cache accounting, the 402", ["i-jh"]),
    concepts: ["pre-generation cost estimation", "usage reconciliation", "per-tenant budgets", "cache hit accounting", "planned degradation"],
    commonFailure:
      "The ceiling is enforced after the call returns, which stops the second request and pays for the first. Enforce on the estimate, reconcile on the usage block.",
    readings: [
      {
        title: "The twelve-factor app",
        author: "Adam Wiggins",
        url: "https://12factor.net/",
        required: false,
        minutes: 30,
      },
      {
        title: "Using load shedding to avoid overload",
        author: "Amazon Builders' Library",
        url: "https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/",
        required: true,
        minutes: 30,
      },
    ],
    prerequisiteModuleIds: ["m01"],
  },
  {
    id: "m06",
    index: 6,
    weekRange: [8, 9],
    title: "An agent loop with a budget and a clock",
    thesis:
      "An agent is a while loop with a tool table, a spend limit, a clock and a log, and every property worth arguing about lives in one of those four.",
    deliverable: {
      name: "An agent loop with a tool budget, a wall clock timeout and a replay log",
      artifactType: "repository",
      estimatedHours: 16,
      acceptanceCriteria: [
        "Tool calls are budgeted in currency per run, and the run stops on the budget rather than on a step count.",
        "A wall clock timeout cancels in-flight work and leaves no half written state behind.",
        "Any run replays from the log, by a second person, on a second machine, to the same tool sequence.",
        "The loop terminates on an unrecoverable tool error and names which tool and why in one line.",
        "One tool is made deliberately flaky in a test and the loop's behaviour under it is asserted, not observed.",
      ],
    },
    sessions: [
      ...weekSessions("m06", 8, "The loop, the tool table, and what termination means", "Build the loop, then break the tools", ["i-rn"]),
      ...weekSessions("m06", 9, "", "Replay, determinism, and the log format", ["i-rn"], {
        title: "Guest: what an agent looks like after two years in production",
        who: ["i-so"],
      }),
    ],
    concepts: ["tool tables", "spend budgets", "wall clock cancellation", "termination conditions", "replay determinism", "flaky tool injection"],
    commonFailure:
      "The loop gets a step limit and the step limit gets called a budget. A step limit does not bound spend, because one step can be a 90,000 token call.",
    readings: [
      {
        title: "Timeouts, retries and backoff with jitter",
        author: "Amazon Builders' Library",
        url: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
        required: true,
        minutes: 35,
      },
      {
        title: "Site reliability engineering, chapter 22: addressing cascading failures",
        author: "Betsy Beyer, Chris Jones, Jennifer Petoff and Niall Richard Murphy",
        url: "https://sre.google/sre-book/addressing-cascading-failures/",
        required: true,
        minutes: 50,
      },
    ],
    prerequisiteModuleIds: ["m01", "m05"],
  },
  {
    id: "m07",
    index: 7,
    weekRange: [10, 10],
    title: "Serving it, and the day the provider is down",
    thesis:
      "The failure modes that decide whether anyone keeps using this arrive as a provider incident, not as a bug in code you wrote.",
    deliverable: {
      name: "A deployment with a queue, a two-part health check and a written degradation ladder",
      artifactType: "deployment",
      estimatedHours: 12,
      acceptanceCriteria: [
        "The health check distinguishes 'my service is up' from 'my provider is answering', and returns both.",
        "A nine minute provider outage is simulated and the observed behaviour matches what the runbook already said it would be.",
        "Queue depth, provider error rate and cost per hour are on one dashboard, with alert thresholds written as numbers.",
        "The degradation ladder has at least three rungs, and the bottom rung still returns something honest to the user.",
        "The retry policy classifies the error first. A 400 is never retried and a charged request is never retried blind.",
      ],
    },
    sessions: weekSessions("m07", 10, "Degradation ladders, and writing the runbook first", "Deploy, then take the provider away for nine minutes", ["i-jh"]),
    concepts: ["health check semantics", "queue backpressure", "error classification before retry", "degradation ladders", "runbooks", "alert thresholds"],
    commonFailure:
      "The retry policy retries a 400. Classify the error before you decide to retry, and never retry a request the provider has already charged you for.",
    readings: [
      {
        title: "Site reliability engineering, chapter 22: addressing cascading failures",
        author: "Betsy Beyer, Chris Jones, Jennifer Petoff and Niall Richard Murphy",
        url: "https://sre.google/sre-book/addressing-cascading-failures/",
        required: true,
        minutes: 50,
      },
      {
        title: "Avoiding fallback in distributed systems",
        author: "Amazon Builders' Library",
        url: "https://aws.amazon.com/builders-library/avoiding-fallback-in-distributed-systems/",
        required: true,
        minutes: 25,
      },
    ],
    prerequisiteModuleIds: ["m05", "m06"],
  },
  {
    id: "m08",
    index: 8,
    weekRange: [11, 11],
    title: "Changing the model without lying to yourself",
    thesis:
      "A model swap is a rollout with a measurement attached, and the measurement has to exist before the swap becomes an interesting question.",
    deliverable: {
      name: "A two-version rollout with the decision rule committed before the first request",
      artifactType: "deployment",
      estimatedHours: 10,
      acceptanceCriteria: [
        "Traffic is split by a stable hash of the tenant, not at random per request.",
        "The stopping rule and the decision thresholds are committed to the repository before any traffic is routed.",
        "Both arms are scored on the OP 020 set and on a live outcome, and the two disagree at least once.",
        "Cost per successful request is reported per arm, not cost per call.",
        "The second provider is added without touching the OP 010 storage schema.",
      ],
    },
    sessions: weekSessions("m08", 11, "Peeking, stopping rules, and the day two temptation", "Route the split, commit the rule, read the result", ["i-rn", "i-jh"]),
    concepts: ["stable hash assignment", "stopping rules", "peeking", "cost per successful request", "provider portability"],
    commonFailure:
      "The rollout gets read on day three because the numbers looked good on day two. The stopping rule exists precisely so that day two cannot be read.",
    readings: [
      {
        title: "Peeking at A/B tests: why it matters and what to do about it",
        author: "Johari, Pekelis, Walsh and Koomen",
        url: "https://doi.org/10.1145/3097983.3097992",
        required: true,
        minutes: 45,
      },
      {
        title: "Trustworthy online controlled experiments: a practical guide to A/B testing",
        author: "Kohavi, Tang and Xu",
        url: "https://experimentguide.com/",
        required: false,
        minutes: 20,
      },
    ],
    prerequisiteModuleIds: ["m02", "m07"],
  },
];

/* ------------------------------------------------------------- capstone */

export const CAPSTONE: Capstone = {
  brief:
    "Take one problem from your own work, or one you can defend caring about, and build the thing end to end on the routing you have just run. It serves real requests from at least three people who are not you, it is scored on an eval set you wrote, and it has a cost ceiling that has been hit at least once on purpose.",
  constraints: [
    "It serves real traffic from at least three people who are not on the cohort.",
    "It has a cost ceiling, and the ceiling has been triggered in front of a reviewer.",
    "The eval set is yours, written before the build, with the author of each question recorded.",
    "The runbook says what happens when the provider is down, and the claim has been tested once.",
    "The whole thing runs from a clean clone with one command and a documented set of environment variables.",
    "You present in twelve minutes and take eight minutes of questions from people who did not build it.",
  ],
  durationWeeks: 4,
  releasedInWeek: 9,
  estimatedHours: 40,
  reviewedBy: ["R. Nkemelu (SS)", "J. Halvorsen (SS)", "One external reviewer per demo day, named two weeks in advance"],
  publicDemoDay: true,
  examples: [
    {
      title: "Contract clause retrieval for a two person legal team",
      studentName: "T. (consented to initial only)",
      repoUrl: "https://github.com/example-org/c06-clause-retrieval",
      oneLine: "1,900 German lease contracts, hybrid retrieval, clause level citations, 38 EUR of API spend across the cohort.",
      cohortId: "c06",
    },
    {
      title: "Incident timeline assembler",
      repoUrl: "https://github.com/example-org/c06-incident-timeline",
      demoUrl: "https://example.org/c06-incident-timeline",
      oneLine: "Reads alert and chat history, proposes a timeline, refuses to guess where the log has a gap and says so.",
      cohortId: "c06",
    },
    {
      title: "Parts catalogue lookup for a machine shop",
      studentName: "A. Ferreira (consented, full name)",
      repoUrl: "https://github.com/example-org/c06-parts-lookup",
      oneLine: "Scanned parts books, page image extraction, 60 question eval set written with the shop foreman.",
      cohortId: "c06",
    },
  ],
};

/* ----------------------------------------------------------- assessment */

export const RUBRIC: RubricCriterion[] = [
  {
    name: "Evaluation",
    weight: 25,
    levels: [
      { label: "not yet", descriptor: "A score exists but nobody can say what it would take to move it." },
      { label: "meets", descriptor: "The set is yours, the graders are named, and a regression fails the build." },
      { label: "exceeds", descriptor: "The grader itself is measured against your labels and the disagreement is analysed." },
    ],
  },
  {
    name: "Failure handling",
    weight: 20,
    levels: [
      { label: "not yet", descriptor: "Errors are caught and logged as one undifferentiated category." },
      { label: "meets", descriptor: "Errors are classified before any retry, and the classes drive different behaviour." },
      { label: "exceeds", descriptor: "The degradation ladder was written first, then tested against a simulated outage." },
    ],
  },
  {
    name: "Cost awareness",
    weight: 15,
    levels: [
      { label: "not yet", descriptor: "Cost is reported after the month, from the provider dashboard." },
      { label: "meets", descriptor: "Cost per request is estimated before generation and reconciled after." },
      { label: "exceeds", descriptor: "Cost per successful request is a first class metric and it changed a design decision." },
    ],
  },
  {
    name: "Retrieval quality",
    weight: 15,
    levels: [
      { label: "not yet", descriptor: "Retrieval is tuned by reading answers and forming an impression." },
      { label: "meets", descriptor: "Every change is a measured delta on your own set, with the change named." },
      { label: "exceeds", descriptor: "The extractor was diagnosed as the cause at least once, with evidence." },
    ],
  },
  {
    name: "Operability",
    weight: 15,
    levels: [
      { label: "not yet", descriptor: "It runs on your laptop and the setup lives in your shell history." },
      { label: "meets", descriptor: "Clean clone, one command, documented environment, a health check that means something." },
      { label: "exceeds", descriptor: "Someone else deployed it from the README without asking you a question." },
    ],
  },
  {
    name: "Written reasoning",
    weight: 10,
    levels: [
      { label: "not yet", descriptor: "The writeup describes what was built." },
      { label: "meets", descriptor: "The writeup names what was rejected and what the evidence for rejecting it was." },
      { label: "exceeds", descriptor: "It records a conclusion the author reversed, and what reversed it." },
    ],
  },
];

export const ASSESSMENT = {
  rubric: RUBRIC,
  passingBar:
    "Six of the eight operation deliverables stamped 'meets' or better, and OP 020 and OP 030 are two of the six. There is no way to pass without an eval set and a retrieval service.",
  reviewCadence: "weekly" as const,
  reviewFormat:
    "Thursday, 60 minutes. Four minutes each plus one minute of questions, twelve people to a room, two rooms. That arithmetic is why the cohort is capped at 24 and not at 40.",
  feedbackTurnaroundHours: 48,
  retakePolicy:
    "One resubmission per operation, inside ten days, once. A second miss leaves the operation stamped 'not yet' on your record and it stays there.",
  attendanceRule:
    "Miss two consecutive Thursday reviews and we move you to the next cohort at no charge. That is the written policy, not a favour someone grants.",
};

export const CREDENTIAL = {
  kind: "certificate" as const,
  issuedBy: "Second Shift",
  verifiableUrl: "https://example.org/second-shift/verify",
  accredited: false,
  accreditationNote:
    "Not accredited by any body, anywhere. The certificate lists the eight operations and the stamp each one received, and the verification link resolves for anyone you give it to. If a funding body requires accreditation, this programme cannot help you and we would rather say that here than at the screen.",
  fundingEligibility: [] as string[],
};

/* ------------------------------------------------------------ toolchain */

export const TOOLCHAIN: ToolchainEntry[] = [
  { name: "Python", version: "3.13.5", role: "the language the whole routing is written in", alternativeAllowed: false },
  { name: "uv", version: "0.8.4", role: "dependency resolution that finishes", alternativeAllowed: true },
  { name: "PostgreSQL", version: "17.5", role: "one store for traces, documents and vectors, so you can join them", alternativeAllowed: false },
  { name: "pgvector", version: "0.8.0", role: "a vector index inside the same transaction as your rows", alternativeAllowed: false },
  {
    name: "Anthropic Messages API",
    version: "anthropic-version: 2023-06-01",
    role: "the hosted model your service is measured against from OP 010",
    costToStudent: { amount: 45, currency: "EUR", note: "typical spend across twelve weeks, ceiling script provided in week 1" },
    alternativeAllowed: false,
  },
  {
    name: "A second provider of your choice",
    version: "pinned by you, in writing, in OP 080",
    role: "the other arm of the rollout, so provider portability is proved rather than claimed",
    costToStudent: { amount: 15, currency: "EUR", note: "OP 080 only, roughly one week of split traffic" },
    alternativeAllowed: true,
  },
  {
    name: "BAAI/bge-m3",
    version: "open weights, revision pinned in the template repository",
    role: "embeddings that run on your own machine, so the index is inspectable",
    alternativeAllowed: true,
  },
  { name: "Docker Engine", version: "28.3", role: "what the grader runs, so 'works on mine' stops being a sentence", alternativeAllowed: false },
  { name: "pytest", version: "8.4", role: "the eval suite runner and the regression gate", alternativeAllowed: true },
  { name: "OpenTelemetry Python SDK", version: "1.36", role: "trace ids that survive leaving your process", alternativeAllowed: true },
  { name: "Grafana OSS", version: "12.1", role: "the OP 070 dashboard, self hosted next to the service", alternativeAllowed: true },
  {
    name: "Fly.io",
    version: "flyctl 0.3",
    role: "somewhere for OP 070 to be deployed that is not your laptop",
    costToStudent: { amount: 10, currency: "EUR", note: "or free tier, or any host you already pay for" },
    alternativeAllowed: true,
  },
];

/* ------------------------------------------------------------- people */

export const INSTRUCTORS: Instructor[] = [
  {
    id: "i-rn",
    stamp: "RN4",
    name: "R. Nkemelu",
    role: "Routing planner. Runs OP 010, 020, 040, 060 and 080.",
    shipped: [
      {
        what: "the request ledger and the cost reconciliation path, the one that made a per-tenant ceiling possible",
        where: "a document workflow product, 40 person company",
        scale: "roughly 90,000 model calls a day",
        url: "https://example.org/writing/request-ledger",
      },
      {
        what: "the eval harness and the merge gate that blocks a three point regression",
        where: "the same product, still running",
      },
    ],
    teachesModuleIds: ["m01", "m02", "m04", "m06", "m08"],
    writing: [
      { title: "Your eval set is measuring the model's opinion of your domain", url: "https://example.org/writing/eval-authorship" },
      { title: "Estimate before, reconcile after", url: "https://example.org/writing/estimate-reconcile" },
    ],
    availabilityNote: "In every Thursday review, both rooms, for the whole twelve weeks.",
  },
  {
    id: "i-mb",
    stamp: "MB2",
    name: "M. Bertrand",
    role: "Runs OP 030 and co-runs OP 040.",
    shipped: [
      {
        what: "the extraction and chunking layer for scanned technical manuals, including the table recovery pass",
        where: "an industrial parts distributor",
        scale: "about 400,000 pages, ingested once and re-ingested twice",
        url: "https://example.org/writing/table-recovery",
      },
    ],
    teachesModuleIds: ["m03", "m04"],
    writing: [{ title: "Read twenty extractions before you touch an embedding", url: "https://example.org/writing/read-twenty" }],
    availabilityNote: "In the Thursday review for weeks 4 to 6. Office hours every Friday of OP 030.",
  },
  {
    id: "i-jh",
    stamp: "JH7",
    name: "J. Halvorsen",
    role: "Runs OP 050 and OP 070, co-runs OP 080.",
    shipped: [
      {
        what: "the load shedding and degradation ladder that kept a support product answering through a nine minute provider outage",
        where: "a B2B support tool",
        scale: "peak 1,200 requests a minute",
        url: "https://example.org/writing/degradation-ladder",
      },
      { what: "the on-call runbook the OP 070 exercise is a simplified copy of", where: "the same tool" },
    ],
    teachesModuleIds: ["m05", "m07", "m08"],
    availabilityNote: "In the Thursday review from week 7 onward.",
  },
  {
    id: "i-so",
    stamp: "SO1",
    name: "S. Okonkwo",
    role: "Guest. Two sessions inside OP 060.",
    shipped: [
      {
        what: "an agent loop with a currency budget and a replay log, in production for two years",
        where: "a logistics scheduling company",
        scale: "publishable figure not available, so none is printed here",
      },
    ],
    teachesModuleIds: ["m06"],
    availabilityNote: "Guest. Two sessions in OP 060 and nothing else. Not in the reviews, and we would rather print that than let you assume otherwise.",
  },
];

/* ------------------------------------------------------------- cohorts */

const SCHEDULE_C07: Cohort["liveSchedule"] = [
  { weekday: 2, startLocal: "18:00", durationMinutes: 90, kind: "lecture" },
  { weekday: 3, startLocal: "18:00", durationMinutes: 120, kind: "workshop" },
  { weekday: 4, startLocal: "18:00", durationMinutes: 60, kind: "review" },
  { weekday: 5, startLocal: "17:00", durationMinutes: 60, kind: "office_hours" },
];

export const COHORTS: Cohort[] = [
  {
    id: "c06",
    programId: "aie-12",
    startsOn: "2026-05-04",
    endsOn: "2026-07-24",
    applicationsCloseOn: "2026-04-17",
    capacity: 24,
    seatsRemaining: 0,
    status: "completed",
    liveSchedule: SCHEDULE_C07,
    timezone: TZ,
    cohortLanguage: "English",
    instructorIds: ["i-rn", "i-mb", "i-jh"],
    teachingAssistantRatio: "1 TA per 8 students",
  },
  {
    id: "c07",
    programId: "aie-12",
    startsOn: "2026-09-14",
    endsOn: "2026-12-04",
    applicationsCloseOn: "2026-08-28",
    capacity: 24,
    seatsRemaining: 9,
    status: "open",
    liveSchedule: SCHEDULE_C07,
    timezone: TZ,
    cohortLanguage: "English",
    instructorIds: ["i-rn", "i-mb", "i-jh", "i-so"],
    teachingAssistantRatio: "1 TA per 8 students",
  },
  {
    id: "c08",
    programId: "aie-12",
    startsOn: "2027-01-11",
    endsOn: "2027-04-02",
    applicationsCloseOn: "2026-12-18",
    capacity: 24,
    seatsRemaining: 24,
    status: "waitlist",
    liveSchedule: SCHEDULE_C07,
    timezone: TZ,
    cohortLanguage: "English",
    instructorIds: ["i-rn", "i-mb", "i-jh"],
    teachingAssistantRatio: "1 TA per 8 students",
  },
];

export const ACTIVE_COHORT = COHORTS.find((c) => c.status === "open")!;

/* ----------------------------------------------------------- admission */

export const ADMISSION: Admission = {
  steps: [
    { index: 1, name: "Application", whatHappens: "Six fields and a link to code you wrote. No cover letter, no essay, no video.", typicalDays: 0 },
    {
      index: 2,
      name: "Technical screen",
      whatHappens: "Forty-five minutes, screen shared. We hand you a retrieval service that is failing and you drive.",
      typicalDays: 5,
    },
    { index: 3, name: "Decision", whatHappens: "Yes, no, or the specific gap and which cohort to come back for.", typicalDays: 3 },
    { index: 4, name: "Seat", whatHappens: "The seat is held for seven days after the offer, then it goes back to the list.", typicalDays: 7 },
  ],
  applicationFields: [
    "name",
    "email",
    "a link to code you wrote",
    "the stack you work in daily",
    "what you would build in week 12",
    "which cohort",
  ],
  technicalScreen: {
    format: "Screen share, 45 minutes, you drive. A failing retrieval service and its logs are handed to you at minute one.",
    durationMinutes: 45,
    whatIsAssessed: [
      "You read the traceback before you read the code.",
      "You form a hypothesis and then look for the thing that would disprove it.",
      "You say out loud what you do not know instead of routing around it.",
      "You can write a SQL query against an unfamiliar schema with the schema in front of you.",
    ],
  },
  decisionSlaDays: 8,
  acceptanceNote:
    "We do not publish an acceptance rate, because a rate without a denominator and a date is not evidence. The screen is a pass or a fail on the four items above, and we tell you which one you missed.",
};

/* ------------------------------------------------------------- pricing */

export const PRICING: Pricing = {
  listPrice: {
    amount: 3400,
    currency: "EUR",
    taxNote: "plus 19 percent VAT for private buyers in Germany. Net for EU businesses with a VAT ID, reverse charge.",
    taxNoteShort: "plus 19 percent VAT in Germany. Net for EU businesses with a VAT ID.",
  },
  paymentOptions: [
    { kind: "upfront", discountPercent: 5, note: "3,230 EUR net. Paid before the cohort starts." },
    { kind: "instalments", count: 3, amountEach: 1190, feePercent: 5, note: "3,570 EUR net in total. On the start date, and at day 30 and day 60." },
    { kind: "employer_invoice", leadTimeDays: 14, poAccepted: true, note: "Purchase order accepted. Send it 14 days before the start date or the seat is not held." },
  ],
  scholarships: [
    {
      name: "Second Shift seat",
      criteria: "Career changers on a public benefit, and engineers returning from parental leave. One page, no essay.",
      seats: 2,
      deadline: "2026-08-14",
    },
  ],
  additionalCosts: [
    { item: "Model API credits", estimate: "40 to 60 EUR across the twelve weeks. The ceiling script is given to you in week 1 of OP 010." },
    { item: "Second provider, OP 080 only", estimate: "about 15 EUR for one week of split traffic." },
    { item: "Deployment host for OP 070", estimate: "about 10 EUR, or free tier, or a host you already pay for." },
    { item: "Laptop", estimate: "16 GB RAM. Postgres, Docker and one open weights embedding model run locally, at the same time." },
  ],
  refundPolicy: {
    fullRefundBeforeDay: 8,
    partialSchedule: [
      { beforeDay: 8, refundPercent: 100 },
      { beforeDay: 22, refundPercent: 50 },
      { beforeDay: 43, refundPercent: 25 },
    ],
    conditions:
      "Days count from the cohort start date, not from the day you paid. The refund is issued to the original payer within 14 days. Nothing is withheld for materials, because the materials are public.",
    quotedVerbatim:
      "Withdrawal notified in writing before day 8 of the cohort is refunded in full. Before day 22, 50 percent. Before day 43, 25 percent. From day 43 no refund is due, and the participant retains access to all recordings for the retention period stated in section 6.",
  },
  deferralPolicy: {
    allowed: true,
    feeAmount: 0,
    noticeDays: 10,
    maxDeferrals: 1,
    note: "Defer once, to either of the next two cohorts, with ten days of notice and no fee. A second deferral becomes a withdrawal under the schedule above.",
  },
  guarantee: null,
  guaranteeNote:
    "There is no job guarantee and no outcome guarantee. There is no clause to quote, because no clause exists. The refund schedule above is the whole of the money-back mechanism.",
};

/* ------------------------------------------------------------- helpers */

export const opNumber = (index: number) => String(index * 10).padStart(3, "0");
export const CAPSTONE_OP = "090";

export const moduleByOp = (op: string) => MODULES.find((m) => opNumber(m.index) === op);
export const instructorById = (id: string) => INSTRUCTORS.find((i) => i.id === id);
export const stampsFor = (m: Module) =>
  INSTRUCTORS.filter((i) => i.teachesModuleIds.includes(m.id)).map((i) => i.stamp);

export const fmtNum = (n: number) => n.toLocaleString("de-DE");
export const weekLabel = ([a, b]: [number, number]) => (a === b ? `WK ${String(a).padStart(2, "0")}` : `WK ${String(a).padStart(2, "0")} to ${String(b).padStart(2, "0")}`);

export const WEEKDAY_SHORT: Record<number, string> = { 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 7: "Sun" };

export const ARTIFACT_TYPES: Array<Module["deliverable"]["artifactType"]> = [
  "repository",
  "eval_harness",
  "service",
  "writeup",
  "deployment",
  "dataset",
];

export const TOTAL_DELIVERABLE_HOURS =
  MODULES.reduce((n, m) => n + m.deliverable.estimatedHours, 0) + CAPSTONE.estimatedHours;

export const TOTAL_SESSIONS = MODULES.reduce((n, m) => n + m.sessions.length, 0);
