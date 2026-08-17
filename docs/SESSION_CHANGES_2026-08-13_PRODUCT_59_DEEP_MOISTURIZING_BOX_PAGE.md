# Product 59 - DEEP MOISTURIZING BEAUTY BOX: bespoke page, claim clean-up, gallery

**Date:** 13 Aug 2026
**Product:** #59 DEEP MOISTURIZING BEAUTY BOX, 1,120.30 AED
**Scope:** live database copy, live gallery, new bespoke PDP in EN/AR/RU, one shared-component fix across six pages

---

## 1. What was wrong before

The product record described a box whose contents were partly invented. Five claims did not
trace to any manufacturer document:

| Claim in the old copy | What the documents actually say |
|---|---|
| "Coconut Water Complex (78%)" | The DTS MG sales deck says 78%. The formula signed by DTS MG's own R&D manager puts Cocos Nucifera Water at **0.79595%**. A sales slide does not outrank the registered ingredient declaration. |
| "oxygen therapy mechanism" (Snow O₂) | The label says "naturally generated oxygen bubbles". "Oxygen therapy" appears in no Snow O₂ document. |
| "Phytolex SC" as a Snow O₂ ingredient | In no Snow O₂ formula, label or COA. The only GENOSYS label carrying the name is a Russian Snow Booster one, for a different product. |
| "MultiEx Phytrogen" | Same: in no document for either product. |
| "Hyaluronan 11 Multi-Complex", read as 11 types | Both DTS MG decks list **8** hyaluronate INCI names. The complex name is the manufacturer's; the count was ours. |
| "72-hour hydration" attributed to the serum | The 72-hour test is the **cream's**. The serum deck measures immediately after use only. |

`descriptionRu` and `descriptionAr` carried the same claims in translation.

## 2. Sources used

Everything on the new page traces to one of these, all under
`~/Desktop/Drive/Genosys/Registration/Intertek`:

- **Snow O₂ 180ml** - label artwork + INCI, COA WIE048 (pH 5.86)
- **Snow Booster 200ml** - label artwork + INCI, COA WID041 (pH 6.08)
- **Hyaluron Serum 30ml** - DTS MG 15-slide deck + formula (22 Jun 2024), COA (pH 5.08)
- **Hyaluron Cream 50g** - DTS MG 22-slide deck + 250g artwork INCI, COA (pH 6.00, 12M)
- **Sea Algae Mask 25g** - Ingredient Report, COA (pH 5.69), artwork

Clinical figures kept, both from the manufacturer's own tests on **21 adult women aged 20-59,
single application**:

- Cream: hydration **+82%** immediately after use, still significantly above baseline at
  **72 hours** ("72-hour hydration persistence effect")
- Serum: deep skin hydration **significantly improved immediately after use** (50.81 to 52.238).
  No 72-hour figure exists for the serum, so none is published.

The page states plainly that the cleanser, toner and mask carry no clinical measurements, and
that the instrument and testing laboratory are not named in the documentation.

## 3. Changes made

### Live data

| What | How |
|---|---|
| English `description` rewritten, 4,014 to 2,911 chars | `scripts/fix-product-59-deep-moisturizing-box-claims-20260813.ts --commit` (backup at `/tmp/product-59-description-backup-2026-08-13.json`) |
| Arabic `description` rewritten | `data/productTranslations.ts` |
| Russian `description` rewritten | `data/productTranslationsRu.ts` |
| Gallery added: 5 member packshots | `scripts/set-product-59-gallery-20260813.ts --commit` |
| Gallery cut to 3 after review | `scripts/fix-product-59-gallery-drop-dual-size-20260813.ts --commit` |

The gallery was empty, so the box had a single image and no way to look at any one item in it.
It now holds member packshots in routine order, per
`.cursor/rules/product-gallery-images.mdc`: DB `images` only, main image not repeated, no new
asset files, and the mobile app picks it up with no release.

Reviewing the slides one at a time, two of the five had to come back out. `cleanser/Main.jpg`
shows the 180ml homecare bottle **and** the 500ml professional one; `hyaluron/main.jpeg` shows the
50g **and** the 250g. On products 10 and 29 those are the right main images, because both sizes
are sold there and the size selector is on the same screen. In this box's gallery, with no text
beside them, they read as contents - and the box holds one 180ml and one 50g. The gallery is now
the composite box shot plus the three single-unit packshots (toner, serum, mask), so nothing shown
is absent from the box.

The S1-S6 alternates for both products were considered as replacements and rejected: they are
marketing infographics stating **"PHYTOLEX SC"**, **"MULTIEX PHYTROGEN"** and **"11 Types of
Hyaluronic Acid"** - the same three claims removed from this box's copy today, for the same reason
(no formula lists either complex; both hyaluronate decks list 8 INCI names). See the artwork
section below.

### New bespoke page

- `components/product/deepmoisture/deepMoistureCopy.ts` - trilingual copy with the sourcing
  rules and the removed claims recorded at the top of the file
- `components/product/deepmoisture/DeepMoistureProductPage.tsx`
- `components/product/deepmoisture/deepmoisture.css` - water-blue palette, scoped to
  `.deepmoisture-page`
- Wired into `components/product/bespokePdp.tsx` and opted in on all three routes

A kit sells differently from a single product, so the layout differs from the other five
bespoke pages:

- **Contents replaces both the ingredients section and the routine strip.** The contents *are*
  the routine; rendering both would show the same five products twice. Each row carries the
  live price, size, stock, its own EAN and a link to its own page.
- **The arithmetic is computed from the five member records**, not written into copy, so a price
  change on any member updates the comparison. Today: 1,318.00 separately, 1,120.30 in the box,
  197.70 saved (-15%).
- **No barcode row in the details table.** The box is assembled in the UAE and has no EAN of its
  own, which `data/productBarcodes.ts` already documents for #54-#59; the five real barcodes are
  printed against the items that carry them.
- **The "look elsewhere if" list links the three boxes it names** (#62 Sensitive Skin, #55
  Problem Skin Care, #56 Skin Brightening). Telling a shopper to buy a different box and making
  them search for it is a dead end.
- **Fragrance is stated, not buried.** Snow O₂ contains fragrance and limonene; the cream
  contains Pelargonium Graveolens Flower Oil, citronellol and geraniol. Reactive skin is pointed
  at #62.
- **Pregnancy answered per item.** The manufacturer states the serum and cream are safe for
  pregnant and breastfeeding women and children, and says nothing either way about the other
  three. The page says exactly that.

### Shared fixes, affecting other pages

| Fix | Files |
|---|---|
| `−15%` badge rendered as `15%−` in Arabic. Added `dir="ltr"`. | All six bespoke pages (`biomeso` serves both #60 and #65) |
| `CeraClosingCta` cropped tall images. Added `imageFit` prop, default `cover` so nothing else changes. | `components/product/cerabarrier/CeraClosingCta.tsx` |
| Desktop chat bubble sat on top of the sticky buy bar's own button on every PDP. Raised to `md:bottom-28` on product routes. | `components/ChatWidget.tsx` |
| Footer brand line used an em dash. | `components/footer/Footer.tsx` |

The kit shot is a 4:5 group photo where every item is load-bearing, so `cover` was slicing products
out of the closing band, and fitting the whole frame into a landscape panel instead just moved the
problem: a hard-edged white tile stamped on a tinted band. `imageFit="blend"` drops the panel
entirely and multiplies the shot into the band, so its white background *becomes* the band and only
the five products remain. It is only safe on a genuinely white shot; a studio grey would come
through as a grey block, which is why `cover` stays the default for the other five pages.

The chat fix is a real bug, not cosmetics: the sticky bar's add-to-bag button is bottom-right, which
is exactly where the bubble lives, so on desktop the widget covered the one control the page exists
to offer. Mobile web already sidesteps it by hiding the widget on PDPs; the dead `bottom-36` branch
left over from that was removed.

### Hero stage

The other bespoke pages tint `.cera-stage`, which is free for them: their packshots are square and
fill the stage edge to edge, so the tint is never actually on screen. This box was shot 4:5 on pure
white, so it letterboxes on a square stage, and against a blue tint that read as a white rectangle
floating inside a blue one - two frames around one photograph. The stage is now white, matching the
shot's own background, so there is nothing for the letterboxing to reveal and the products appear to
sit directly on the panel. The shadow lost its blue cast for the same reason. The three member
slides are square and still fill the stage completely, so they are unaffected.

## 4. Artwork discrepancies

Nothing on the physical box artwork contradicts the documents. The box lid carries only the
GENOSYS mark, "BEAUTY BOX" and the "DEEP MOISTURIZING" band; it makes no numeric or ingredient
claim, so there is nothing to correct at the printer. All five removed claims were website copy
only, most likely lifted from DTS MG sales decks rather than from the labels.

### Found while sourcing gallery slides: web artwork on products 10 and 29

These are website marketing images, not printed labels, so they are fixable in-house. Each of them
states a claim that was deleted from #59's text today, which means the site currently contradicts
itself: the same claim is denied in one place and illustrated in another.

| Asset | On | Claim | Why it fails |
|---|---|---|---|
| `/images/cleanser/S3.jpg` | #10 Snow O₂ | "PHYTOLEX SC", "MULTIEX PHYTROGEN" | Neither appears in any Snow O₂ formula, label or COA. The only label carrying Phytolex is a Russian Snow Booster one, for a different product. |
| `/images/hyaluron/s1.jpeg` | #29 Hyaluron Cream | "11 MULTI-COMPLEX - 11 HA types" | Both DTS MG hyaluronate decks list 8 hyaluronate INCI names. The complex name is defensible; the count is not. |
| `/images/hyaluron/s6.jpeg` | #29 Hyaluron Cream | "11 HA TYPES" | Same. |

Also on those two sets, lower priority: `/images/cleanser/S1.jpg`, `S2.jpg`, `S4.jpg`, `S6.jpg` and
`/images/hyaluron/s5.jpeg` use em dashes throughout, against the house rule for hyphens.

Not fixed here, because it needs the artwork re-exported rather than a code change, and #29's
`s1`/`s6` are that product's own ingredient story - deleting them leaves a gap in its gallery.

### Delivery claim

The page said "Free delivery across the UAE" in the hero and again in the closing band. Delivery is
free over 1,000 AED (`freeShippingThreshold`, `lib/mobileCheckoutConfig.ts`), and while the box
lists at 1,120.30, a clinic tier discount takes it under the threshold. It now reads "Free delivery
over AED 1,000 · Dispatched from Dubai" in all three languages, which is what the other five bespoke
pages say and what the footer trust row says two rows below it.

## 5. Flagged, not changed

1. **`BEAUTY_BOX_REGULAR_PRICES` in `lib/discountUtils.ts` is hardcoded.** It puts #59's
   "separately" total at 1,318, which is exactly what the five member records sum to today, so
   the hero strikethrough and the new panel agree. If any member price changes, the hero will
   show a stale 1,318 while the panel shows the true total, and the same page will contradict
   itself. Deriving that table from the member records would touch all six boxes and the pricing
   contract, so it is not something to change quietly.
2. **Arabic sizes render in English site-wide.** `utils/sizeTranslations.ts` only translates for
   Russian, so Arabic shoppers see "180ml" and "1 sheet (25g)". Fixing it for this page alone
   would make #59 inconsistent with every other product; it is a site-wide i18n decision.
3. **The contents rows still use the two dual-size packshots.** They were pulled from the gallery
   but not from the contents list, because each row prints the size ("180ml", "50g") and the unit
   price directly beside the thumbnail, which the gallery could not do. Replacing them would mean
   deviating from the catalogue image for those two products.
4. **The three sheet masks are a rescue, not a routine.** Three sheets against a product whose
   own page recommends two to three uses a week is roughly one week's supply. The page says so
   rather than implying the box covers masking indefinitely.

## 6. Verification

- `npx tsc --noEmit` clean, `npx eslint` clean on all touched files
- Screenshots at 1440px in EN, RU and AR, and at 390px, signed in and as a guest. No console
  errors in any locale.
- Arabic mirrors correctly: gallery, price line, contents rows, alternative-box chips
- Guest view hides every price, including the saving line and the whole comparison panel
- Live prices confirmed against the records: 330 + 260 + 330 + 290 + (3 x 36) = 1,318.00, box at
  1,120.30, saving 197.70
