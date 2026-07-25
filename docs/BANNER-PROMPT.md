# Banner brief

Hand this to an image model (Midjourney, Nano Banana, Ideogram, Flux, Seedream, whatever you use).
Attach the reference screenshots listed at the bottom.

Target file when it comes back: `docs/banner.png`, referenced at the top of both READMEs.

---

## Specification

**Canvas:** 2400 x 1260 px, exported at 1200 x 630 for the README and the GitHub social preview.
GitHub crops social previews to roughly 1280 x 640, so keep every word inside the middle 80 percent.

**The word that must be readable at thumbnail size:**

```
GMIRA
```

Set large, confident, and in a grotesque or a wood-type face. Beside or beneath it, smaller:

```
ܓܡܝܪܐ
```

That is Syriac and it reads right to left. **Do not let the model redraw, stylise, or "improve" the
Syriac.** Image models mangle non-Latin script constantly. If it cannot reproduce those five
characters exactly, tell it to leave a clean empty box where they go and composite the real glyphs
in afterwards.

**Subtitle line, small:**

```
21 skills. Four verticals. No shared house style.
```

---

## The prompt

> A playful editorial banner for an open source developer tool called GMIRA.
>
> The concept: four completely different printed artifacts pinned to one workshop wall, overlapping
> slightly, as if someone tore them from four different worlds and put them side by side. From left
> to right they are: an industrial auction catalogue page with lot numbers and a rotated red
> condition stamp, a machine shop job traveller card in dark olive with punched binder holes down
> its edge, a goldenrod boxing fight poster in heavy black wood type, and a seed packet rack card in
> sage and natural dye colours with a punched hang hole and a wire running through it.
>
> The four artifacts must look like they come from genuinely different centuries and industries.
> That contrast is the entire point of the image: one tool, four worlds, nothing shared between them.
>
> Across the middle, the word GMIRA set large in a confident grotesque, slightly overlapping the
> artifacts, printed as if screen printed on top of them in a single dense ink. Underneath in small
> type: "21 skills. Four verticals. No shared house style."
>
> Style: flat, printed, tactile. Real paper texture and visible ink. Playful but precise, like a
> letterpress studio poster, not a SaaS landing page. Slight misregistration between ink layers.
>
> Hard constraints: no gradients, no glow, no 3D render, no glassmorphism, no floating UI cards, no
> generic dark dashboard, no blue-to-purple, no neural network imagery, no circuit traces, no robot,
> no brain, no lightbulb. Nothing that looks like AI stock art, because the tool exists to remove
> exactly that look.
>
> Flat vector plus print texture. High contrast. Legible at 400 px wide.

---

## Colour, taken from the four real proofs

Give the model these hexes so the banner matches what the tool actually produces.

| Artifact | Colours |
|---|---|
| Auction catalogue | paper `#efece4`, ink `#16150f`, stamp red `#a8321e`, rule `#c9c4b5` |
| Job traveller | board `#22241d`, card `#d9d2b8`, ink `#16150f`, released green `#1f5f3f` |
| Fight poster | goldenrod `#e0b224`, press black `#101010`, oxblood `#7a1f1a` |
| Seed packet rack | sage `#b3b39a`, paper `#e8e3d2`, woad `#2f4f7a`, madder `#9c3327` |

---

## Reference screenshots to attach

All paths are relative to the repository root.

1. `proofs/proof-car/1440x900.png` , the auction catalogue lot list
2. `proofs/school/1440x900.png` , the job traveller routing card
3. `proofs/ads/1440x900.png` , the fight poster card
4. `proofs/shop/1440x900.png` , the seed packet rack

Tell the model: **use these only as world and colour reference. Do not reproduce the layouts,
do not copy any text from them, and do not draw browser windows or device frames.**

---

## A second image worth generating

The before and after pair from Finding 01 is the single most persuasive thing in the repo, and it
already exists as two real screenshots:

- `proofs/finding-01/01-defaults-slop.png` , the rainbow blob with the blown out white centre
- `proofs/finding-01/02-tamed.png` , the same component, same brief, same palette props, tamed

A simple side by side at 1200 x 630 with the labels "installed" and "tamed", plus one line of
caption, needs no image model at all. It is honest, it is the actual output, and it will do more
work on social than any illustration.

If you only make one image, make that one.
