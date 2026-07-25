# The repo SEO playbook

Extracted from the `planning-with-files` harvest, not re-derived. Sources read in full:

| Source | What it contributed |
|---|---|
| `.planning/v3-design/seo-proposal.md` | The description formula, the keep / drop / add topic accounting, the README head alignment rule, the exact `gh repo edit` command shape |
| `.planning/v3-design/v3-architecture.md` | Positioning as a gap table rather than a feature list |
| `.planning/v3-design/progress-log.md` | What actually got applied, and that SEO was staged and held until the owner approved it |
| `.planning/2026-05-21-.../research_competitors.md` | 4,593 words of teardown across 13 projects, and the distribution-move column |
| `.planning/2026-05-21-.../proposal_v2_40.md` | The four distribution levers and the finding that the star gap was never feature parity |
| `.planning/2026-07-18-repo-audit-strengthen/` | Discoverability as a shipping surface: the standard install path, the registry submissions, the trigger-rate finding |
| `README.md`, `llms.txt`, `CITATION.cff` | The applied result, which is where the formula is visible in production |
| `gh repo view` | The 20 topics and the description live today, which differ from the draft in instructive ways |

---

## 1. The description formula

The live description on `OthmanAdi/planning-with-files`, 325 characters:

> Persistent file-based planning for AI coding agents and long-running tasks. Crash-proof markdown plans, session recovery after /clear and compaction, per-turn re-injection against context rot, deterministic completion gate. Manus-style. Claude Code, Codex, Cursor, Kiro, OpenCode and 60+ agents via the Agent Skills standard.

Four slots, in this order:

1. **Category plus audience, forward-looking.** "Persistent file-based planning for AI coding agents and long-running tasks." Names the thing and who it is for. No origin story.
2. **Three or four concrete mechanisms, comma separated.** Each one carries a searchable noun and each one is a real capability, not an adjective. "Crash-proof markdown plans, session recovery after /clear and compaction, per-turn re-injection against context rot, deterministic completion gate."
3. **The lineage or memetic hook, two words.** "Manus-style." Optional. Only worth a slot if the reference is one a stranger recognises.
4. **Named hosts or stack, plus the standard it rides.** "Claude Code, Codex, Cursor, Kiro, OpenCode and 60+ agents via the Agent Skills standard." Developers search by the tool they already use.

### The rules the draft made explicit

The draft named four defects in the previous description and each one generalises:

- **Backward-looking is a defect.** The old text sold the Manus acquisition story instead of a user benefit. The story belongs in the README, not in 350 characters of index text.
- **Missing positioning keywords is a defect.** The v3 line was long-running and multi-agent; neither word appeared. The description has to match the positioning you are currently claiming, not the one you shipped two versions ago.
- **Missing host names is a defect.** Host names are the highest-intent search terms available.
- **Em dashes are a defect.** No dashes as pause, anywhere.

### Additional rules visible in the applied version

- **Ship a shorter alternative next to the primary.** The draft carried a 273-character primary and a 199-character alternative. The shorter one survives truncation in listings, cards, and third-party indexes.
- **Numbers earn their place.** "60+ agents" is one number doing the work of a paragraph. Only real numbers.
- **Owner requirements are not negotiable.** Hermes was in the description because the owner required it, not because a keyword tool ranked it. Note them explicitly in the proposal so they do not get optimised away.
- **The description and the README tagline are the same sentence.** See section 3.

---

## 2. Topic selection

GitHub allows 20 topics. The draft treated the cap as a budget and did explicit accounting: **drop 6, add 6, land at 19 of 20, keep one slot spare.**

### The decision rule per topic

| Verdict | Criterion |
|---|---|
| **Keep** | The term is either browsed by real people, or required by the owner for a partnership or ecosystem reason |
| **Drop** | A long-tail host or vendor name nobody browses by. It occupies a slot that a category term could use |
| **Add** | A term that matches the positioning you are claiming right now, and that someone would plausibly type |

The dropped set was `adal`, `kilocode`, `openclaw`, `openclaw-skills`, `antigravity`, `mastra`. All six were real integrations. Being real is not the test. Being searched is the test.

### The five buckets, read off the 20 that shipped

The live set is `claude`, `claude-code`, `claude-skills`, `claude-code-skills`, `agent-skills`, `manus`, `planning`, `autonomous-agents`, `codex`, `cursor`, `github-copilot`, `multi-agent-systems`, `coding-agent`, `llm-agents`, `long-running-agents`, `context-engineering`, `context-rot`, `session-recovery`, `hermes-plugin`, `hermes-skill`.

| Bucket | Purpose | Examples in the shipped set |
|---|---|---|
| **Host and platform names** | Highest intent. People search by the tool in front of them | `claude-code`, `codex`, `cursor`, `github-copilot` |
| **Category and ecosystem** | How the thing is classified | `agent-skills`, `claude-skills`, `claude-code-skills`, `llm-agents`, `coding-agent` |
| **Positioning and capability** | What you claim to be, this version | `planning`, `autonomous-agents`, `multi-agent-systems`, `long-running-agents`, `context-engineering` |
| **Problem names** | Symptom searchers, who describe the pain not the category | `context-rot`, `session-recovery` |
| **Lineage and required** | Memetic or owner-mandated | `manus`, `hermes-plugin`, `hermes-skill` |

### Two lessons the shipped set teaches that the draft did not

- **Problem-name topics were added after the draft.** `context-rot` and `session-recovery` are not in `seo-proposal.md`. They name the failure the user is living through. A person whose agent just lost its plan types the symptom, not the category. Reserve two slots for this.
- **Near-synonym variants are not waste.** `claude-skills` and `claude-code-skills` both shipped, as did `hermes-plugin` and `hermes-skill`. Different people type different forms of the same idea, and GitHub treats them as separate topics with separate browse pages. Spend a slot on the variant when the variant is what half the audience types.

### Naming discipline

Use the exact string GitHub already has a browse page for. Check the topic page before committing a slot: a topic with 40 repos on it is a slot spent on nothing. Prefer the canonical form (`shadcn-ui` over `shadcn`, `tailwindcss` over `tailwind`) unless the shorter form demonstrably has the larger page.

---

## 3. The README head

Read off the applied README, top to bottom. The head is everything above the first `---`.

```
1  Banner image, centered, width 100%, alt text written as a full descriptive sentence
2  <h1 align="center"> with the human-readable title
3  One bold line: the memetic hook, not a description
4  One centered paragraph: the positioning, keyword dense, with <code> on file and command names
5  Badge row A: social proof   (stars, release, installs, downloads)
6  Badge row B: evidence       (benchmark, A/B result, license)
7  Nav row: anchor links to the four or five sections that matter, plus the deep doc
8  ---
```

The applied example, slots 3 and 4:

> **Your agent's context window dies. The plan does not.**
>
> Persistent file-based planning for AI coding agents and long-running agent tasks: the skill keeps `task_plan.md`, `findings.md`, and `progress.md` on disk and re-injects them every turn, so the plan survives context loss, `/clear`, crashes, and compaction.

Slot 3 is the sentence someone quotes. Slot 4 is the sentence the index reads. They do different jobs and neither can do the other's.

### The head alignment rule, stated in the draft

> Tagline under title gets the same positioning sentence.

The repo description, the README paragraph in slot 4, the `llms.txt` blockquote, and the `CITATION.cff` abstract are four renderings of one sentence. Write the sentence once, then adapt length per surface. Drift between them is the most common and most avoidable SEO defect in a repo.

### Body order after the head

The applied README puts evidence before explanation:

```
Before / After           the screenshot or transcript, first, no preamble
The Problem              the failure modes as a bulleted list
The Solution             the named pattern
How It Works             a numbered ladder, then a diagram
Install                  fast, copy-paste, one block per route, plus a route matrix
Commands / surface       tables
Platform coverage        tables, tiered honestly by what each tier actually gets
Why this exists          the story and the lineage
Evidence                 methodology note FIRST, then the numbers
FAQ                      each H3 is a literal search query
<details> Releases       collapsed
<details> Community      collapsed
Documentation            a table of docs with a what-it-covers column
Acknowledgments / Contributing / License / Author
```

Two structural points worth copying:

- **The methodology note comes before the number, not after.** The benchmark section opens with what the number does not measure. This is what makes the number credible instead of promotional.
- **Long tables and release histories go in `<details>`.** The head stays scannable; the depth stays available.

---

## 4. Weaving keywords without stuffing

The draft's instruction was one line: keywords woven into intro prose, naturally, not stuffed. The applied README shows the four techniques that make that true.

### Technique 1: the deletion test

Every keyword sits inside a clause that carries information on its own. Delete the keyword and the sentence breaks:

> the plan survives context loss, `/clear`, crashes, and compaction

Four search terms, one list, and every item is a real event the reader has experienced. Compare with a stuffed version, which reads as a list of terms with a verb bolted on. **If removing a keyword leaves the sentence still saying the same thing, the keyword was decoration.**

### Technique 2: the FAQ is the keyword vehicle

Each FAQ heading is a literal long-tail query, written the way a person types it:

- "How do I stop my coding agent from losing its plan after /clear or a crash?"
- "What is the difference between planning-with-files and an agent memory tool?"
- "How does this prevent context rot?"

The first sentence of each answer restates the query's terms in declarative form. This serves three consumers at once: a reader skimming, a search index matching the query, and a retrieval model looking for a self-contained passage. This is the highest-yield section in the whole document and it costs nothing but honesty.

### Technique 3: problem names used as nouns

"Context rot", "goal drift", "context stuffing", "volatile memory" appear as ordinary nouns in prose. Naming the failure gives the symptom searcher a landing point, and it gives the reader vocabulary. The same principle appears in this project's own doctrine, Part 7.4: named failures are findable failures.

### Technique 4: the same number at three depths

A headline number appears in a badge, in a scannable block, and in a table. A skimmer, a scanner, and a reader each hit it once. Repetition across formats is not stuffing; repetition inside one paragraph is.

### Alt text is a search surface

Every image in the applied README carries a full sentence of alt text describing what the image shows, including the numbers in it. This is accessibility and indexing with one edit.

---

## 5. `llms.txt`

Five sections, in this order:

```
# <repo-name>

> One paragraph, roughly 60 words, plain text, no links. The description expanded.

## Docs
- [Name](absolute GitHub URL): one line on what it covers
  (README, the canonical spec file, migration, evidence, citation)

## Key facts
- Category:        what it is, AND explicitly what it is not
- Pattern:         the named mechanism
- Evidence:        the number, with its scope
- Differentiators: what only this does
- Problem it solves
- License

## FAQ
### <the same questions as the README>
Answers rewritten tighter and fully self-contained. No "see above", no relative links.
```

The sharpest move in the file is the negative half of the category line:

> Category: persistent planning for AI coding agents. Not a memory or retrieval system: it manages planning continuity for the active task.

That single clause pre-empts the wrong classification a model would otherwise make. Write the "not a X" clause for whatever adjacent category you keep getting confused with.

Two other constraints: absolute URLs only, because the file is read out of context, and no marketing adjectives, because the consumer is a model deciding whether the project is relevant.

---

## 6. `CITATION.cff`

```yaml
cff-version: 1.2.0
message: "If you use this software, please cite it using the metadata below."
type: software
title: "<repo-name>"
abstract: "<two sentences: what it is, then the mechanism list>"
authors:
  - family-names: <>
    given-names: <>
    alias: <github handle>
version: "<semver>"
date-released: "<YYYY-MM-DD>"
license: MIT
url: "https://github.com/<owner>/<repo>"
repository-code: "https://github.com/<owner>/<repo>"
keywords:
  - <10 to 14 entries>
```

The keyword list is **not** a copy of the GitHub topics. It overlaps deliberately but adds the longer phrases that a topic slot cannot hold (`long-running-agents`, `context-engineering`, `session-recovery`, `manus-style`). Topics are for browsing; CFF keywords are for citation indexes and have no cap pressure.

---

## 7. Distribution, which outranks all of the above

`proposal_v2_40.md` states the finding without hedging: the star gap was never feature parity. Four levers, from the competitor teardown:

1. **Timing.** Superpowers shipped on the day the plugin marketplace opened, and hit number one on trending inside 24 hours. Ship into an opening surface, not into a quiet week.
2. **Methodology framing over tool framing.** Spec-Kit named a methodology and put a logo behind it. Cline named "Memory Bank" and explicitly said it was a pattern anyone could implement, which is what let it spread. Aider published architect/editor as a finding with a benchmark, then shipped the tool as the proof. Lead the README with the thing people should be doing, not with the install command.
3. **A single evocative name beats a descriptive one.** The teardown's own conclusion: "Cline did not ship better tech, they shipped better naming." A name that describes the mechanism does not sell the methodology.
4. **A screenshotable demo moment.** Value that is invisible does not spread. The note in the proposal is blunt: three markdown files are not screenshotable, so ship a 30 second recording instead.

The one-line summary from the teardown: **technical excellence is not a distribution lever.** Every project above it won on framing, brand, or category naming.

### Discoverability items the July audit added

- Ship the ecosystem's **standard discovery path in-tree**, so tools find the project from a plain clone with no per-tool setup. This turned into the `.agents/skills/` mirror and was described as "instant discoverability".
- **Registry and awesome-list submissions are a real channel** and need their own tracking file. One submission was rejected for submitting the whole codebase instead of a link.
- **The trigger phrasing of the entry point is an SEO surface.** The eval found the skill fired 60 percent of the time on unforced prompts against 100 percent for a rules-file arm, and the description phrasing was named as a fix candidate. The `description:` field of a skill is read by a router, so it is search text with a machine as the searcher.

---

## 8. Process rules

From `progress-log.md`, where the SEO work sat staged for a day before it ran:

- **Write the proposal as a file, apply nothing.** The draft carried the current text, the problems with it, the proposed text, the accounting, and the paste-ready command. Nothing ran until the owner said so.
- **Every outward step is separately approved.** Push, merge, tag, `gh repo edit`, and registry upload were five decisions, not one.
- **Verify live after applying.** The log records the topics and description being confirmed live after the edit, not assumed.

---

## 9. The checklist

```
DESCRIPTION
  [ ] under 350 chars, and a shorter alternative drafted next to it
  [ ] slot 1 category + audience, forward-looking
  [ ] slot 2 three or four concrete mechanisms
  [ ] slot 3 lineage or hook, only if a stranger would recognise it
  [ ] slot 4 named hosts or stack, plus the standard or ecosystem
  [ ] zero dashes as pause
  [ ] matches the positioning claimed by the current version

TOPICS
  [ ] exactly 20, or 19 with one slot held
  [ ] every topic checked against its GitHub browse page before it takes a slot
  [ ] at least 4 host or stack names
  [ ] at least 2 problem names
  [ ] near-synonym variants included where the audience is split
  [ ] each one justified in one line, in writing

README
  [ ] head follows the 8 slot order
  [ ] slot 4 is the description, adapted
  [ ] evidence before explanation in the body
  [ ] FAQ headings are literal search queries
  [ ] alt text on every image is a descriptive sentence
  [ ] long tables collapsed into <details>

CONSISTENCY
  [ ] description, README slot 4, llms.txt blockquote, CITATION abstract all render one sentence

FILES
  [ ] llms.txt with the "not a X" category clause
  [ ] CITATION.cff with keywords that are broader than the topics

PROCESS
  [ ] proposal written to a file, nothing applied
  [ ] paste-ready command included
  [ ] owner approves each outward step separately
  [ ] verify live after applying
```
