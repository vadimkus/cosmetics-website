# Product 3 — HairGen BOOSTER: bespoke page built

The powered device the HR³ MATRIX hair system is built around, and the last member of
that range to get a page. Source audit was done earlier the same day
(`SESSION_CHANGES_2026-08-18_PRODUCT_3_HAIRGEN_BOOSTER_AUDIT.md`); the record was
corrected then, so this session was the page.

| File | |
|---|---|
| `components/product/hr3/hairGenBoosterCopy.ts` | EN / AR / RU copy |
| `components/product/hr3/HairGenBoosterProductPage.tsx` | layout |
| `components/product/bespokePdp.tsx` | registered `'3'`, companions `['45','64','47','46']` |
| `app/products/[id]/page.tsx` + `ar` + `ru` | opted `'3'` into the bespoke list |

## A device page, not a cosmetic one

No INCI, no formula, no certificate — it is hardware. The **specification** does the job
the formula table does on the other pages, the same way product 49's dosimetry table
does: 52 microneedles, three speeds at 280/330/400 per minute, a ten-minute cutoff, 14
LEDs through 48 light bumps, 5 V / 2 A, 24-month warranty.

## The amber block quotes the leaflet and refuses it

The 2021 sales leaflet is the strongest claim document in this range. It is subtitled
**"Automicroneedling LED Device for Alopecia Treatment"** and opens with a section headed
"Clinical Trials" showing before/after photographs captioned **alopecia areata** and
androgenic alopecia. **Alopecia areata is an autoimmune disease.** It also claims new
vessel formation, wound healing, collagen production, anagen/telogen/catagen mechanics,
and — for the ampoule — inhibition of the enzyme that converts testosterone to DHT.

None of it is carried. Following the precedent set on products 44, 46 and 47, the page
quotes the leaflet and refuses it out loud rather than staying silent, because a buyer who
searches the product name will find that leaflet.

## The running cost is the commercial point

The device is AED 1,800 once, and then **every session needs a fresh AED 92.50 ampoule and
a fresh AED 75 stamp — about AED 167.50 a treatment**. That is the fact a buyer most needs
before committing, and no manufacturer document volunteers it. It has its own table,
gated behind `canSeePrices` like every other price on the site, with the two FAQ answers
that quote figures gated alongside it.

The table also points at the honest alternative: the Mesopecia Kit is the manual version
of the same idea — a 0.5 mm roller with the peeling and six of the same ampoules, AED
1,100 all in.

## ★ The needle depth, and a contradiction caught before it shipped

The page was first written saying the depth is unpublished, because neither the leaflet
nor the user manual states one. **That was wrong, and it would have contradicted product
64's page**, which states **0.3 mm** on the distributor's instruction to match the product
artwork.

The resolution is that the depth belongs to the **consumable, not the device** — the
handpiece has no depth of its own, it is whatever stamp is fitted. So the page now says
0.3 mm, carries the same caveat product 64's page carries (the figure is on the artwork
and in neither manufacturer document; confirmation requested from DTS MG in writing), and
states that if the answer differs both pages change together.

It also says explicitly that this is **not** the Mesopecia Kit's 0.5 mm, which belongs to
the roller in that box.

## Two problems found while verifying, both fixed

`scripts/fix-hairgen-consumable-claims-20260818.ts`.

### 1. My own `productDetails` leaked prices to signed-out visitors

The `consumables` field written earlier in the day read *"Roughly AED 167 per session at
list prices — AED 92.50 for a vial and AED 75 for a stamp"*. The page never renders
`productDetails`, but **the whole product record is serialised into the RSC payload**, so
those figures were in the HTML for logged-out users — defeating the gate the page was
carefully built around. The field is now price-free; the arithmetic lives only in the
gated table.

Worth remembering generally: gating a section in the layout does not gate the record.

### 2. ★ Product 64 still carried the leaflet's drug mechanism

Found because 64 is a companion on this page and its record surfaced in the payload. The
stamp's description repeated the leaflet almost verbatim:

> The micro-injuries also trigger the skin's natural **wound-healing response**, supporting
> **scalp regeneration**, **improved blood circulation** and a healthier **environment for
> hair growth**.

with matching benefits lines. Also removed: "dramatically increasing skin permeability",
"delivered directly to the hair follicles and surrounding tissue", and **"gentle"** — the
same word refused on product 46.

Kept, because documented: 52 microneedles (the 2021 leaflet says "52EA"), single use,
eight per box, the ten-minute session, Korean manufacture. Its `productDetails` now also
records the 0.3 mm with its provenance and the outstanding confirmation request.

**A device page whose own consumable contradicts it is the product-47 problem again** — a
bundle contradicting its components — and it is the second time this week that checking a
companion record caught it.

## Verified

- `tsc --noEmit` and `eslint` clean.
- `/products/3`, `/ar/products/3`, `/ru/products/3` all 200 with the specification, the
  0.3 mm, the leaflet refusal and the contraindications present.
- No angiogenesis, vasodilation, anagen, 5α-reductase or blood-circulation claim in any
  of the three.
- Prices absent from the signed-out HTML in all three languages.

One incidental catch: the copy was first written with `**bold**` and `<b>` markup inside
plain strings, which React renders literally. Stripped — these copy files carry no markup.

## ★ Closed the same evening — product 64 page aligned

The owner call was: the record is the corrected one. The wound-healing /
circulation cards and the **medical-grade** needle line are off the page, in EN,
AR and RU. 0.3 mm stays with the artwork caveat. See
`SESSION_CHANGES_2026-08-18_PRODUCT_64_CLAIMS_ALIGN.md`.

## The hair range is now complete

43 tonic · 44 shampoo · 45 solution · 46 peeling · 47 kit · 3 booster · 61 brush · 64
stamp all have bespoke pages.

**Correction, same evening: 48 (Hair-GENTRON) now has one too.** This page originally said
it could not, "until DTS MG supplies a manual, a specification sheet or any document at
all". That was wrong — the manual, the EU Declaration of Conformity and a 105-page
IEC 60335-2-32 test report were already on disk in
`~/Desktop/Drive/Genosys/Registration/Gentron/`. See
`SESSION_CHANGES_2026-08-18_PRODUCT_48_HAIR_GENTRON_PAGE.md`, which also lists three
record fields this session's script never touched on product 3 either.
