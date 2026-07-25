# Surface: shop (e-commerce store proof)

Slug `shop`. Mode: **Operate** on every route built here (PLP, PDP, checkout step).
Effect budget near zero. No canvas, no WebGL, no shader, no scroll choreography, no animated
counters. Doctrine 2.1 and gmira-flow step 1.

## Step 1: the rut and the counter, both excluded

THE RUT (ecommerce.md section 6). Full-bleed lifestyle photograph, model mid-laugh, warm grade.
Sticky bar promising free shipping over 50. Display serif headline over the image, one ghost
button. Four-up product grid, every crop 1:1, hover swaps to image two, 14px medium title, price
under it, a "New" pill. Three-icon value row. Founder story with a signature graphic. Instagram
embed. Newsletter modal at 15 seconds. Display serif plus Inter. One accent, terracotta or sage.

THE COUNTER, also excluded. Unstyled HTML, Times New Roman, a left-aligned text-only product list,
one 8rem lowercase wordmark, "buy" as a plain link. And its second reflex: brutalist grid,
Helvetica, black on white, oversized numerals.

## Step 2: the world was drawn, not picked

```
node -e "const s='ecommerce|2026-07-25';let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;console.log(h, h%5)"
-> 1015729786   index 1
```

Index 1 read as a zero-based index into the five material worlds in ecommerce.md section 6 selects
**world 2: a seed packet rack**. Front is an illustration and a name, back is sowing depth,
spacing, germination days, harvest window and a packed-by date. The reverse of the packet is the
whole product data model, printed small and dense. The rack is the collection page.

Seven candidates, three material families:

| # | Candidate | Family | Verdict |
|---|---|---|---|
| 1 | Seed packet rack | printed ephemera | DRAWN, kept |
| 2 | Fabric swatch book (Kvadrat sample card) | textile trade | kept |
| 3 | Hardware store bin label system | retail fixture | discarded, collides with the brutalist counter |
| 4 | Chemist dispensary label | printed ephemera | discarded, apothecary is now a wellness default |
| 5 | Museum wall label and object file | institutional print | discarded, renders as the quiet-minimal rut |
| 6 | Dyer shade card and ball band | textile trade | kept |
| 7 | Nursery bare-root order form and plant stake | horticultural | kept, folded into 1 |

Fusion: **1 plus 6**. Judged on the two axes.

1. Truth: the goods are dyed with plants grown from seed. The packet grammar (variety, lot, vatted
   on, expected behaviour, fastness figure) is literally how this product data behaves. It carries
   the truth rather than fighting it.
2. Buildable this week in CSS: yes. A punched hang hole, a rail line, a dye band, and a fastness
   scale drawn as filled boxes. No canvas, which the vertical bans on commerce anyway.

## Step 3: the contract

Emitted verbatim as a comment at the top of `src/app/proof/shop/layout.tsx`.

```
THESIS          A dyed cloth is a dated batch with a measured fastness, not a colourway.
OWN-WORLD       A seed packet rack fused with a dyer shade card. Kraft stock, two ink colours
                per packet, the dense reverse carrying the whole data model at 11px.
                TELL: every product hangs from a rail. A 1px rail line crosses the full row and
                each packet has a punched hang hole straddling it. Every colour carries a
                lightfastness figure drawn as eight boxes filled to the blue wool grade.
STORY           Opens as a rack read across three rails, resolves into one packet turned over.
FIRST VIEWPORT  Rack header with the dye lot range, the four dye plants with their fastness
                figures, rail A label, and the lead packet already hanging. No photograph.
FORM            A rack, never a grid. Three rails of decreasing format: one packet, two packets
                of unequal width, then small goods as rows. Colour lives on paper, never on the
                board. Nothing centered. Square corners on every packet, round only on the hole.
```

## Step 4: specificity, applied per section

| Section | Could an unrelated product use it unchanged? |
|---|---|
| Rack header | No. It states a dye lot range and a fastness key, which only a dyed-goods store has |
| Dye key | No. Blue wool scale 1 to 8 and ISO 105-C06 wash grades are textile standards |
| Rail A lead packet | No. Front and reverse side by side is the packet, and the reverse is a lot record |
| Rail B, C | No. Rows carry lot code, vatted date and per-size availability, not a title and a price |
| PDP variant panel | No. Three availability semantics keyed to vat size and harvest volume |
| PDP reverse | No. Composition, gsm, loom width, fastness, shrinkage, packed dimensions |
| Checkout step | Partly. A delivery form is a delivery form. It carries the dye lot hold and the DAP or DDP line, which are this store |

## The standing exit

The conventional option remains available: a Shopify Dawn theme with a 1:1 product grid ships in a
day and converts acceptably. It is not weighed here, and it is not recommended.

## The three availability semantics, as built

| Concept | Where it is | Why |
|---|---|---|
| `disabled`, the real attribute | The option for a combination that was never made (weld at 200x240, walnut at 130x190) | Out of the tab order because there is no date, no list and no price behind it. Reason printed under the axis |
| `aria-disabled="true"` | The add control only, when the selected cell is sold out | Present, focusable, announces as unavailable, and names the reason instead of doing nothing |
| out of stock | Neither. A data state | A sold out option stays fully operable, because selecting it is how the restock date appears. Zero with a next lot behind it is fully buyable, ship date on the button |

Caught during the functional pass: `aria-disabled` on an option that still selects makes Playwright
refuse to click it, which is the right complaint. A control that acts must not claim to be disabled.

## Notes

- All catalogue data is illustrative and labelled as such on every route (doctrine G7).
- Certifications are empty everywhere by design. The store prints no badge it does not hold.
- No product photography exists for this proof, so media is rendered as a written plate index
  rather than as a placeholder image. Alt text is written per frame in the data model.
