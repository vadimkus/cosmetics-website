# Anti-Aging Beauty Box (product 58) - bespoke page, and a shared layout for all six boxes

13 Aug 2026. Follows `SESSION_CHANGES_2026-08-13_ANTI_AGING_BOX_58_CLAIMS.md`, which
corrected the copy for this product; this session builds the page that shows it.

## What was decided

Product 59 already had a bespoke kit page. Rather than write a second one, that
page became a shared layout, because all six beauty boxes make the same argument:
five products that already have their own pages, sold together for less than the
sum of the parts. Only the words, the accent colour and the five products differ.

## New structure

```
components/product/beautybox/
  BeautyBoxProductPage.tsx   the layout, one per box via configuration
  beautyBoxCopy.ts           the copy contract every box module implements
  beautyBoxes.ts             the registry: which box, which copy, which palette
  beautybox.css              one palette class per box, plus shared rules
  copy/antiAging.ts          product 58, en + ru + ar
  copy/deepMoisturizing.ts   product 59, en + ru + ar (moved, not rewritten)
```

`components/product/deepmoisture/` was removed; nothing else referenced it.

Adding the remaining four boxes (55, 56, 57, 62) is now a copy module, a palette
block and two lines in the registry.

### The registry cannot drift from the routes

`BeautyBoxProductPage` reads its copy and palette from `BEAUTY_BOXES` and has no
fallback if the entry is missing. So `bespokePdp.tsx` carries a type-level check
that every registered box also has a route:

```ts
type Routed<T extends BespokeProductNumber> = T
export type RoutedBeautyBoxNumber = Routed<BeautyBoxNumber>
```

Registering a box without routing it is a compile error rather than a blank page.

## What changed for product 59

Two deliberate changes, both improvements, and worth knowing about since 59 was
already reviewed and signed off:

1. **The gallery gained two real packshots.** It now composes as: the box shot,
   then the five items in the order they are used, then anything the box record
   lists. Before, it was the box shot plus the three paths written into the
   record, which omitted the cleanser and the cream. Composing from the member
   records means a member packshot that gets replaced is replaced here too.
2. **The fragrance advice was corrected.** The page told a fragrance-sensitive
   reader to consider the Sensitive Skin Beauty Box instead. Every one of the six
   boxes is built around the same fragranced Snow O₂ cleanser, so that was wrong.
   All three languages now say so and point the reader at individual products
   instead. Product 62 was removed from the alternatives list.

## Two names corrected site-wide (pushed, commit `f45bdb98`)

Visible on the standard PDP routine strips of products 22, 32, 53, 55, 56, 57,
58 and 62, not only on the new page:

| Key | Was | Now | Source |
|---|---|---|---|
| `routineAntiWrinkleCreamTitle` (en) | Multifunctional Anti-Wrinkle Cream | Multi Functional Anti-Wrinkle Cream | carton, and the catalogue record |
| `routineCollagenMaskTitle` (en) | Collagen Mask | Intensive Repair Collagen Mask | carton, and the catalogue record |
| `routineCollagenMaskTitle` (ru) | Коллагеновая маска | Коллагеновая маска Intensive Repair | same |
| `routineCollagenMaskTitle` (ar) | قناع الكولاجين | قناع الكولاجين Intensive Repair | same |

The serum key beside them already used the carton spelling, so the cream and the
mask were the odd ones out.

## Database

There is one database. `.env` and `.env.local` both point at the same Neon
instance, so the description fix from the earlier session is already live and
there is no second copy to sync.

## Two more artwork corrections logged

Added to `~/Desktop/genosys-artwork-corrections.html`, which now holds 7 rows for
product 58. Unlike the first five, these two are about the **printed cartons**,
so they go to the next print run rather than to a designer:

1. **Serum carton** understates its own registration. The Korean panel declares
   `[미백, 주름개선 2중 기능성 화장품]`, a dual-function cosmetic for brightening and
   wrinkle improvement. Every non-Korean panel prints only "Function
   Anti-wrinkle". The cream carton from the same family prints both. This is the
   one correction on the sheet that gains a claim rather than removing one.
2. **Mask carton, Russian panel** claims three things the formula does not carry:
   `морского` collagen (the INCI is Hydrolyzed Collagen with no source stated),
   `микроэлементов` (no trace-element ingredient exists in the formula) and
   `антиоксидантное действие` (nothing measures it). The English and Korean
   panels of the same carton claim none of the three.

## Still open

- The P&K skin age index study report has not been received from DTS MG. The
  citation is quoted on the page with no percentage attached to it.
- The five rendered bottle labels on `/images/bbox_age/main.jpg` still carry
  invented text. Logged; needs a designer.
