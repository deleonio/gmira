# Gmira: plan of record

Live document. Updated 2026-07-25. If something here disagrees with `MISSION.md`, this file wins.

---

## Where it stands right now

| Phase | State | Evidence |
|---|---|---|
| P1 Acquire arsenal | **done** | 4 repos cloned, 7 registries wired, all verified reachable, 514 components |
| P2 Study sources | **done** | `research/` holds 264 KB extracted from 5 sources |
| P3 Doctrine | **done** | `research/SYNTHESIS.md`, mirrored to `skills/gmira/references/DOCTRINE.md` |
| P4 Skill library | **done** | 21 skills, 5 playbooks, 40 worlds. Installed to `~/.claude/skills/` |
| P5 Proofs | **1 of 4 done** | car shop green on both routes. school / ads / shop in progress |
| P6 Harvest | **running** | Voyage index over 17,499 saves |
| P7 Publish | **not started** | Authorized as a new PUBLIC repo. Blocked on the name |

---

## Open items, in priority order

### 1. Name. DECIDED: GMIRA.

**ܓܡܝܪܐ, gmīrā, Syriac for perfect, complete, finished.** Root g-m-r, to complete. It is the word
the Peshitta uses for "perfect" in Matthew 5:48. Ahmad chose it 2026-07-25.

Rename is scripted and dry-run clean (58 files, 21 skill directories, the mission folder). It runs
**after** the three vertical agents finish and the dev server stops, because renaming directories
underneath a running Turbopack server and three writing agents is how you get the exact stale-module
error we already hit once today.

Rename covered the skill directories, the reference paths, the in-code taming comments, every prose
occurrence, the surface-contract directory, the installed copies in `~/.claude/skills/`, and the
mission folder itself. Verified: zero occurrences of the working name remain outside `proofs/`,
which holds generated report headers.

### 2. Finish the three remaining proofs

Three subagents are building `school`, `ads`, and `shop`. Each one draws its own material world by
external hash index, writes its own direction contract, builds two or three routes, and has to pass
the five-viewport gate with zero console errors before it reports back.

Risk: an agent produces something that passes the mechanical gate but is visually weak. **I will
read every screenshot myself before any of it ships.** A green gate is not the same as a good page.

### 3. The Voyage harvest. DONE.

`research/harvest-voyage.md`, 752 lines. 32 themes across 112 query phrasings, no rate limits.
The index has grown to **17,647 rows** since your handoff doc said 17,499, of which 2,499 are
GitHub URLs. 91 unique repos pulled out and clustered.

Scope, stated honestly because your handoff doc says this question keeps coming up: this used the
**Voyage vector index plus local keyword grep only**. Graphify and Neo4j were not used. They are
separate layers.

**The finding that matters most:** across all 17,647 saves there are **zero hits for
`prefers-reduced-motion`**, zero for Open Props, zero for Locomotive Scroll. Your saved corpus is
purely additive. Nothing in 17,647 bookmarks argues for fewer effects, frame-0 discipline, GPU
teardown, or a verification gate. That is precisely the gap this library fills, and it is now
evidence rather than an assertion.

**Two real gaps it found in the library**, both worth a follow-up pass:
- **WebGPU and TSL.** Six independent practitioners in your saves are doing node-based shading,
  compute-pass simulation, and WebGPU inspectors in R3F. The GPU floor is WebGL only.
- **View Transitions.** `gmira-motion` names the API and ships no recipe.

It also surfaced a larger competing anti-slop corpus than expected (hallmark, taste-skill,
emilkowalski/skills, google-labs-code/design.md, nexu-io/open-design, rams.ai). Worth reading before
the next revision, not before the first publish.

### 4. Bilingual README and full repo SEO

Added 2026-07-25 on Ahmad's instruction. **Reusing prior work rather than redoing it.**

Located in `planning-with-files/.planning/`:
- `v3-design/seo-proposal.md` - the description formula, the keep/drop/add topic logic, the
  README head alignment rule, and the exact `gh repo edit` command shape.
- `2026-05-21-pwf-v2-40-.../research_competitors.md` - 4,593 words of competitor teardown across
  obra/superpowers, anthropics/skills, spec-kit, BMAD, Kiro, Cline, Aider, RooCode, claude-flow and
  nine more, with star counts and distribution analysis.
- `2026-05-21-.../proposal_v2_40.md` - the four distribution levers, including the finding that the
  star gap was never about feature parity.
- `2026-07-18-repo-audit-strengthen/` - the repo hardening pass.

Deliverables:
- `README.zh.md` in **Simplified Chinese for the mainland market**, and it is the **default**.
  Mainland vocabulary enforced (组件, 内存, 默认, 项目, 数据, 服务器), not Taiwanese Traditional.
- `README.en.md` in English. Both carry a language switcher at the top.
- `SEO.md` with the proposed description, exactly 20 justified topics, and the paste-ready
  `gh repo edit` command.
- `llms.txt` and `CITATION.cff` following the planning-with-files patterns.

At publish time `README.md` becomes the Chinese file so GitHub renders Chinese by default.

### 5. The commit series

Ahmad asked for a logical series, not one dump commit. Order matters: **the rename runs before
commit 1**, so the history reads as GMIRA from the first line rather than carrying a working name
through eighteen commits and a confusing rename at the end.

| # | Commit | Contents |
|---|---|---|
| 1 | `chore: MIT license, gitignore, plugin manifest` | `LICENSE`, `.gitignore`, `.claude-plugin/` |
| 2 | `docs: mission charter and plan of record` | `MISSION.md`, `PLAN.md` |
| 3 | `research: extract technique from five design sources` | `research/impeccable.md`, `canvas-ui.md`, `bklit-ui.md`, `chanhdai.md`, `componentry.md`, `CATALOG.md` |
| 4 | `research: two findings proven by build, not by reading` | both `FINDING-*.md`, `proofs/finding-01/`, `proofs/finding-02/` |
| 5 | `research: the doctrine` | `research/SYNTHESIS.md` |
| 6 | `research: harvest 17,647 saved bookmarks` | `research/harvest-voyage.md` |
| 7 | `research: reuse the prior SEO harvest` | `research/seo-playbook.md` |
| 8 | `skills: router, doctrine, and the decide tier` | `gmira`, `gmira-brief`, `gmira-direction`, `gmira-palette`, `gmira-typeset` |
| 9 | `skills: the build tier` | hero, scroll, catalog, detail, flow, proof, nav |
| 10 | `skills: the craft tier` | arsenal, canvas, motion, states |
| 11 | `skills: the gate tier` | slop, a11y, perf, verify, ship |
| 12 | `skills: vertical playbooks and 40 material worlds` | `references/playbooks/` |
| 13 | `skills: runnable world draw and verify gate` | `scripts/draw.mjs`, `scripts/verify.mjs` |
| 14 | `lab: scaffold with seven component registries wired` | lab config, `components.json`, root layout, index |
| 15 | `lab: car dealership proof, industrial auction catalogue` | `proof/car/` |
| 16 | `lab: AI school proof, machine shop job traveller` | `proof/school/` |
| 17 | `lab: ads school proof, boxing fight poster` | `proof/ads/` |
| 18 | `lab: store proof, fabric swatch book` | `proof/shop/` |
| 19 | `proofs: five-viewport verification output` | `proofs/` |
| 20 | `docs: bilingual README, SEO package, llms.txt, citation` | `README.md` (Chinese), `README.en.md`, `SEO.md`, `llms.txt`, `CITATION.cff` |

Commit rules, from BRAIN.md and confirmed against the live config:
- Author is **Ahmad only**. `git config user.email` is `github_me@outlook.de`, `gh auth` is
  `OthmanAdi`. Both verified.
- **No `Co-Authored-By` trailer on any commit, ever.** This overrides the default agent behaviour.
- No dashes as pause in any commit body.

Push happens once, after the series, to a fresh public repo.

### 6. Publish

New public repo under `OthmanAdi`. Contents: `skills/`, `research/`, `proofs/`, `lab/`, `README.md`,
`MISSION.md`, this file, `LICENSE` (MIT), `.claude-plugin/plugin.json`.

Commit rules already confirmed against your BRAIN.md:
- `gh auth status` shows `OthmanAdi`, `git config user.email` shows `github_me@outlook.de`. Verified.
- Author is you only. **No `Co-Authored-By` trailer, ever.**
- No dashes as pause in any commit body, README, or release note.

`lab/node_modules` and `.next` get gitignored. `_sources/` (the four cloned reference repos) stays
out of the repo: it is 4,800 files of other people's code, and the extracted technique is already
in `research/`.

---

## Things I got wrong so far, and what I did about them

Keeping this section honest because you asked me to plan better rather than just move fast.

1. **I deleted the two `smoke-*` routes while the dev server was running.** Turbopack held a stale
   module reference and anyone with that tab open saw `Module not found: Can't resolve './page.tsx'`.
   Not a defect in the deliverable and not caused by the subagents. Verified: `/`, `/proof/car`, and
   `/proof/car/K-2291` all return 200, `/smoke-liquid` correctly returns 404. Lesson: clean up
   routes before starting the server the agents depend on, not during.
2. **I shipped a first pass with 450 contrast failures.** The auction-catalogue palette used
   `#9b9585` for labels, which measures 2.53:1 against the paper. My own gate caught it. Fixed by
   darkening two tints and taking hierarchy from size and weight instead, which is what the doctrine
   says to do anyway.
3. **My verify script had three false-positive classes** and would have trained everyone to ignore
   it: it flagged `sr-only` text as overflow, read focus styles in the resting state so every
   correct page failed, and flagged rotated elements that clip nothing. All three fixed. A gate that
   cries wolf is worse than no gate.
4. **I ran two agents that both wrote `worlds.md`.** Caught it before the second could clobber the
   first, stopped the duplicate, verified the surviving file has all 40 entries. Lesson: check the
   task list before launching, not after.

---

## What I am explicitly not doing unless you say so

- Deploying anything anywhere. Publishing a repo is not deploying a site.
- Touching the `vitrine` skill or the live md-stack site.
- Renaming or removing anything in `~/.claude/skills/` other than the 21 `gmira-*` entries I added.
- Adding the four cloned reference repos to the published repo.
