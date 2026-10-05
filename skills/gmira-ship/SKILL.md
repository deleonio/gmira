---
name: gmira-ship
description: "Use when a web surface is finished and needs to be built, staged, or deployed, and when preparing a release of the work. Covers the production build, bundle and asset checks, metadata and social cards, robots and sitemap, redirects, environment separation, and the staging handoff. Also use when someone asks to publish, push live, or deploy, because this skill holds the rule that deployment needs an explicit human go."
---

# Ship

Build locally, stage the deploy, wait for the order.

Load `../gmira/references/DOCTRINE.md`.

## The rule that overrides everything else here

**Never publish, push, or deploy without an explicit go from the person who owns the site.**

Not implied by "finish the site". Not implied by "get it ready". Not implied by having credentials
that work. Build it, stage it, describe exactly what would happen, and wait.

This is on record because an unauthorized deploy in a predecessor project caused real damage. A
deploy is outward-facing and hard to reverse: caches, indexes, and people's inboxes do not roll back
when you `git revert`.

```
INCORRECT   "The site is done, so I deployed it to production and here is the URL."
CORRECT     "The site is built and passing. Staged and ready. Deploying would publish to
            <host> at <domain>, replacing the current live version. Say the word and I will."
```

## Before you build

Every gate in `gmira-verify` green, on every route, not just the one you worked on last. A route
nobody looked at is a route that ships broken.

## Build

```bash
pnpm build          # must exit 0 with zero type errors and zero lint errors
pnpm start          # run the production build locally, not just the dev server
```

Verify against the **production** build, not dev. Things that only appear in production:

- Real bundle sizes and code splitting
- Static generation failures on dynamic routes with bad `generateStaticParams`
- Hydration mismatches that dev overlays hide
- `NODE_ENV`-gated code paths
- Image optimization actually running
- Effects that were fast with an unminified React and are not fast now

Re-run `gmira-verify` against `pnpm start` before you call it done.

## The pre-flight list

| Item | Check |
|---|---|
| Metadata | Real `title` and `description` per route, not the framework default. Grep for "Create Next App". |
| Social card | `openGraph` and `twitter` images that exist and are the right dimensions. Open the file. |
| Favicon | Present, and not the framework's. |
| `robots.txt` | Present and correct for the environment. A staging site must be `Disallow: /`. |
| Sitemap | Generated, and every URL in it returns 200. |
| Canonical URLs | Set, and pointing at the production host, not localhost or a preview URL. |
| 404 and error | Real pages that match the site's world, not the framework defaults. |
| Redirects | Old paths mapped if this replaces an existing site. A broken inbound link is lost traffic. |
| Env vars | Nothing secret in `NEXT_PUBLIC_*`. Grep for keys, tokens, and connection strings in the client bundle. |
| Analytics | Present if asked for, absent if not. Never add tracking nobody requested. |
| Fonts | Self-hosted or `next/font`, so no layout shift and no third-party request on first paint. |
| Remote assets | No demo host left in a default prop. Registry components ship unsplash and framerusercontent URLs. |
| Console | Zero errors and zero warnings on the production build. |

## The things that only bite in production

- **Registry components hotlinking demo assets.** `collection-surfer`, `infinite-image-field`,
  `ripple-transition`, `sticky-scroll-cards`, `scroll-split-card`, `github-calendar`, `music-player`
  all ship remote URLs in default props. Grep the built output for `unsplash`, `framerusercontent`,
  and any third-party API host before you ship a client site that depends on someone else's uptime.
- **A leaked WebGL context.** Fine in dev where you reload constantly, fatal in a session where a
  user visits eight routes. Test with 20 route changes on the production build.
- **Fonts loading from Google at runtime** instead of being self-hosted by `next/font`.

## Staging handoff

State these four things, in this order, and then stop:

1. What is built, and which routes.
2. Where it is staged, and how to look at it.
3. What deploying would do: which host, which domain, what it replaces, and what is not reversible.
4. The exact command you would run.

Then wait.

## Repository rules for this project

- Author of record is the repo owner only. **No `Co-Authored-By` trailer on any commit, ever.**
  Contributors get credit in CHANGELOG and CONTRIBUTORS.md, not in commit trailers.
- No dashes as pause in commit bodies, PR text, release notes, or CHANGELOG prose. Compound hyphens
  are fine. Sachlich tone.
- Feature work does not bump versions or write changelog entries. Bumping is a release step.
- Commit or push only when asked. If on the default branch, branch first.

## Checks before this skill is done

- [ ] Every route green in `gmira-verify`, against the production build
- [ ] `pnpm build` exits 0, zero type errors, zero lint errors
- [ ] Full pre-flight table walked, not skimmed
- [ ] Client bundle grepped for secrets and for third-party asset hosts
- [ ] 20 route changes on the production build, WebGL context count flat
- [ ] Staged, with the four handoff facts stated
- [ ] Nothing deployed, because nobody has said go yet
