# GMIRA repo SEO package

Ready to run. Nothing here has been applied. Method and provenance: [`research/seo-playbook.md`](research/seo-playbook.md), extracted from the `planning-with-files` harvest.

Target repo: `github.com/OthmanAdi/gmira`, public, MIT.

---

## 1. Description

### Primary, 327 characters

```
21 Claude Code skills for building web interfaces that do not look AI-generated. Forces a written visual direction before any element is placed, wires 7 shadcn registries (514 components), sets a GPU performance floor for WebGL and canvas work, and gates every build with Playwright at 5 viewports. Next.js, React, Tailwind v4.
```

Against the four slot formula:

| Slot | Text | Job |
|---|---|---|
| 1. Category plus audience | "21 Claude Code skills for building web interfaces that do not look AI-generated" | Names the thing, the host, and the outcome. Forward-looking, no origin story |
| 2. Concrete mechanisms | "Forces a written visual direction before any element is placed, wires 7 shadcn registries (514 components), sets a GPU performance floor for WebGL and canvas work, and gates every build with Playwright at 5 viewports" | Four real capabilities, each carrying a searchable noun. Delete any keyword and the clause breaks |
| 3. Lineage or hook | omitted | No lineage a stranger would recognise. The slot is better spent on stack names |
| 4. Stack and ecosystem | "Next.js, React, Tailwind v4" | Developers search by the stack in front of them |

Real numbers only: 21, 7, 514, 5.

### Shorter alternative, 235 characters

```
21 Claude Code skills for web surfaces that do not look AI-generated. A written visual direction before any element is placed, 7 shadcn registries, 514 components, a GPU floor for WebGL and canvas, and a Playwright gate at 5 viewports.
```

Use this one if the primary gets truncated in a listing, a card, or a third-party index. It survives a 240 character cut with the mechanisms intact.

### Consistency check

One sentence, four renderings. These must not drift:

| Surface | Where |
|---|---|
| Repo description | this file, applied via `gh repo edit` |
| README positioning paragraph | `README.en.md` slot 4 and `README.zh.md` slot 4 |
| `llms.txt` blockquote | `llms.txt` line 3 |
| `CITATION.cff` abstract | `CITATION.cff` |

---

## 2. Topics: exactly 20

GitHub caps topics at 20. Treat it as a budget. Every slot is justified in one line, and every term was chosen because someone would plausibly type it, not because the integration is real.

### Host and ecosystem (5)

| # | Topic | Why |
|---|---|---|
| 1 | `claude-code` | The host. Highest-intent term available, because people search by the tool in front of them |
| 2 | `claude-skills` | The category as most people write it |
| 3 | `claude-code-skills` | The near-synonym variant. The prior harvest shipped both forms deliberately because the audience is split between them |
| 4 | `agent-skills` | The open standard the packaging follows, so it also catches non-Claude hosts |
| 5 | `ai-agents` | The broad category page where people browsing agent tooling land |

### Stack (4)

| # | Topic | Why |
|---|---|---|
| 6 | `shadcn-ui` | Seven wired registries and a repair pass over 514 components. Canonical topic string; bare `shadcn` is the smaller page |
| 7 | `tailwindcss` | Stack term, and the craft floor is written against v4 |
| 8 | `nextjs` | Stack term. The lab and all four proof routes are Next 16 |
| 9 | `react` | The widest stack page that still describes the output honestly |

### Discipline and category (5)

| # | Topic | Why |
|---|---|---|
| 10 | `frontend` | The discipline term used by people who do not search by framework |
| 11 | `web-design` | What the thing produces |
| 12 | `ui-design` | The sibling term for the same intent. The two pages draw different crowds |
| 13 | `design-system` | The craft floor, the colour strategy, and the type scale are a system, not a theme |
| 14 | `design-engineering` | The term the target audience self-identifies with, and a far less crowded page than `web-design` |

### Technique (2)

| # | Topic | Why |
|---|---|---|
| 15 | `webgl` | The GPU floor is this project's original contribution, and this is the term for it |
| 16 | `creative-coding` | Where shader and canvas work actually gets browsed |

### Gate (2)

| # | Topic | Why |
|---|---|---|
| 17 | `playwright` | The verify gate is real Playwright at five viewports, so the term is earned, not aspirational |
| 18 | `accessibility` | Measured contrast, focus order by real focus, canvas fallback readability |

### Problem names (2)

| # | Topic | Why |
|---|---|---|
| 19 | `anti-slop` | The problem name. The prior harvest reserved slots for symptom searchers (`context-rot`, `session-recovery`); this is the equivalent |
| 20 | `ai-slop` | The second phrasing of the same symptom. Different people type different forms of one idea |

### Adjustments to the candidate list, and why

| Change | Reason |
|---|---|
| `shadcn` becomes `shadcn-ui` | `shadcn-ui` is the canonical GitHub topic with the larger browse page |
| `canvas` dropped | Ambiguous with Canvas LMS. `webgl` plus `creative-coding` cover the intent without the collision |
| `generative-ui` dropped | The term means LLM-generated UI at runtime. GMIRA argues against the generated look, so the topic mis-signals the positioning |
| `typography` dropped | A large, established page where a 21 skill library cannot rank, and typeset is one skill of 21, not the pitch |
| `claude-code-skills` added | Near-synonym variant, per the prior harvest's split-audience rule |
| `design-engineering` added | Discipline term with a smaller, better-matched page |
| `ai-slop` added | Second problem-name slot, per the symptom-searcher rule |

### Held in reserve

Not in the 20, worth swapping in if a slot frees up: `claude`, `shaders`, `landing-page`, `visual-regression-testing`, `web-performance`, `llm-agents`, `agent-skills-standard`.

Before any of these takes a slot, open its GitHub topic page. A topic with a few dozen repos on it is a slot spent on nothing.

---

## 3. The command

Run after the repo exists and after Ahmad approves the description.

```bash
gh repo edit OthmanAdi/gmira \
  --description "21 Claude Code skills for building web interfaces that do not look AI-generated. Forces a written visual direction before any element is placed, wires 7 shadcn registries (514 components), sets a GPU performance floor for WebGL and canvas work, and gates every build with Playwright at 5 viewports. Next.js, React, Tailwind v4." \
  --add-topic claude-code \
  --add-topic claude-skills \
  --add-topic claude-code-skills \
  --add-topic agent-skills \
  --add-topic ai-agents \
  --add-topic shadcn-ui \
  --add-topic tailwindcss \
  --add-topic nextjs \
  --add-topic react \
  --add-topic frontend \
  --add-topic web-design \
  --add-topic ui-design \
  --add-topic design-system \
  --add-topic design-engineering \
  --add-topic webgl \
  --add-topic creative-coding \
  --add-topic playwright \
  --add-topic accessibility \
  --add-topic anti-slop \
  --add-topic ai-slop
```

PowerShell, single line, if the backslash continuations are inconvenient:

```powershell
gh repo edit OthmanAdi/gmira --description "21 Claude Code skills for building web interfaces that do not look AI-generated. Forces a written visual direction before any element is placed, wires 7 shadcn registries (514 components), sets a GPU performance floor for WebGL and canvas work, and gates every build with Playwright at 5 viewports. Next.js, React, Tailwind v4." --add-topic claude-code --add-topic claude-skills --add-topic claude-code-skills --add-topic agent-skills --add-topic ai-agents --add-topic shadcn-ui --add-topic tailwindcss --add-topic nextjs --add-topic react --add-topic frontend --add-topic web-design --add-topic ui-design --add-topic design-system --add-topic design-engineering --add-topic webgl --add-topic creative-coding --add-topic playwright --add-topic accessibility --add-topic anti-slop --add-topic ai-slop
```

Verify live afterwards, do not assume:

```bash
gh repo view OthmanAdi/gmira --json description,repositoryTopics,homepageUrl
```

---

## 4. Homepage URL

Leave empty at first publish. Nothing is deployed, and a homepage field pointing at a 404 is worse than an empty one.

Set it the moment a proof route is live. Priority order:

1. A deployed proof index listing all four verticals, which is the strongest possible landing page for this project because the product is the output.
2. A single deployed proof (`/proof/car`) if only one is ready.
3. The GitHub Pages render of the README, which is the weakest option and duplicates the repo page.

The homepage field is a click surface on the repo card and on every topic browse page, so it is worth more than one extra topic.

---

## 5. Social preview image

GitHub renders the social preview at 1280x640 (2:1) and crops anything else. It appears on X, LinkedIn, Slack, and Discord unfurls, which is where a repo like this actually spreads.

The proposal, in priority order:

1. **The before and after pair, side by side.** `proofs/finding-01/01-defaults-slop.png` next to `02-tamed.png`, with the word GMIRA and the Syriac ܓܡܝܪܐ set small in a corner. This is the only asset that makes the argument without a caption, and the distribution research is explicit that a screenshotable demo moment is one of the four levers that actually moves adoption.
2. **The car proof at 1440x900**, cropped to 2:1 on the lot list. It shows an output nobody would guess was generated, which is the whole claim.
3. A typographic card with the wordmark and the one-line hook. Weakest, because it argues instead of showing.

Constraints: it must stay legible at 640x320 in a timeline card, so no body copy, and no text under roughly 28px in the source. Test it at half size before committing.

Upload path: repo Settings, General, Social preview.

---

## 6. The About section

The right sidebar on the repo page. Four things to set, all cheap:

| Field | Value |
|---|---|
| Description | Section 1 above |
| Website | Section 4 above. Empty until a proof deploys |
| Topics | The 20 in section 2 |
| Sidebar toggles | Uncheck Releases, Packages, and Environments while they are empty. An empty sidebar block reads as an abandoned repo |

Also worth doing at publish, all from the same harvest:

- **`README.md` is the Chinese file.** Per `PLAN.md`, at publish time `README.zh.md` content becomes `README.md` so GitHub renders Chinese by default, and `README.en.md` stays as the English switch target. Keep the switcher line correct in both after the copy.
- **Ship `llms.txt` and `CITATION.cff` at the root.** Both are in this directory. `CITATION.cff` gives GitHub the "Cite this repository" button, which is free credibility on the repo page.
- **Alt text is a search surface.** Every image in both READMEs carries a full descriptive sentence. Keep that true on any image added later.
- **The FAQ headings are literal search queries** in both READMEs. That section is the highest-yield SEO surface in the document and it is also what a retrieval model quotes.
- **Pin the repo** on the `OthmanAdi` profile.

---

## 7. Process

From the prior harvest, where the SEO package sat staged for a day before it ran:

1. Nothing in this file is applied. It is a proposal.
2. Each outward step gets its own approval: create the repo, push, `gh repo edit`, social preview upload, profile pin.
3. Verify live after applying, with the `gh repo view` command in section 3.
4. If the description changes later, update all four surfaces in the consistency table in the same commit.
