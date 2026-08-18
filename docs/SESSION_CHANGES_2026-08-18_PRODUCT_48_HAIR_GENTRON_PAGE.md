# Product 48 — Hair-GENTRON: audit, record correction and bespoke page

The last product in the HR³ MATRIX hair range without a page. It was parked this morning
as undocumented. That was wrong, and finding out why is the useful part of this session.

| File | |
|---|---|
| `components/product/hr3/hairGentronCopy.ts` | EN / AR / RU copy |
| `components/product/hr3/HairGentronProductPage.tsx` | layout |
| `components/product/bespokePdp.tsx` | registered `'48'`, companions `['47','3','45','46']` |
| `app/products/[id]/page.tsx` + `ar` + `ru` | opted `'48'` into the bespoke list |
| `scripts/fix-product-48-gentron-record-20260818.ts` | record rewritten from the documents |
| `scripts/fix-hair-device-howto-and-locale-descriptions-20260818.ts` | the fields the earlier scripts missed |

## ★ We do have the documents. The record said we did not.

This morning's `fix-hair-devices-claims-20260818.ts` correctly stripped "professional hair
loss treatment", "promote hair growth" and "improve scalp circulation" from product 48.
But the replacement text said **"We hold no manual, no leaflet and no efficacy study for
this device"**, and `productDetails.evidence` repeated it. That was written without
looking. `~/Desktop/Drive/Genosys/Registration/Gentron/` holds:

- **User's manual** (EN / KR / JP) — the full specification, the operating sequence and
  eight contraindications
- **EU Declaration of Conformity**, 17 Dec 2019, EMC 2014/30/EU + LVD 2014/35/EU
- **IEC/EN 60335-2-32 test report** LR500121912U, 105 pages
- EMC and EMS test reports
- The sales brochure, also at `public/documents/PPT/HAIR GENTRON.pdf`

Saying "no evidence" when the evidence is on disk is its own kind of inaccuracy. The
record now carries the real specification.

## The certificate is the argument

The 105-page LVD report tests this as **"Safety of household and similar electrical
appliances — Part 2: Particular requirements for massage appliance"**. That single line
settles what the device is regulatorily, and it is more useful to a clinic buyer than
anything on the brochure.

## What the manual gave us that was on no surface of our site

Model **HGHY01** · helmet 230 × 240 × 300 mm · controller 158 × 68 × 42 mm · **1.0 kg** ·
four LED modes (red + infrared / blue / off / all three) · **10, 20 or 30 minutes** with a
**30-minute maximum** · one-second hold starts a ten-minute preset of massage, heat, all
three lights and music · adaptor 5 V 1.5 A or **4 × AA, not included** · storage 5–40 °C ·
24-month warranty.

And **eight groups who must consult a doctor first**: anyone under medical treatment,
anyone with an implanted electronic medical device, heart disease, disease of the head,
pregnancy, osteoporosis or a fractured spine, circulation problems from diabetes or
another disease, and body temperature over 38 °C. None of that was anywhere on the site
for a AED 3,300 device.

## The brochure is refused, in the amber block

Same treatment as products 3, 44, 46 and 47. It claims the light is absorbed by follicle
mitochondria, extends the growth phase, and stimulates anagen re-entry / prolongs anagen /
prevents premature catagen, plus improved blood flow and nutrients to the follicle. The
page quotes that and says plainly that we do not carry it, because a buyer who searches
the product name will find the brochure.

Having a document is not the same as the document being true.

## No dosimetry table, deliberately

Product 49 publishes irradiance, fluence and treatment time per wavelength. This one
cannot. The **brochure** prints 840 / 640 / 420 nm; the **manual** prints no wavelength, no
LED count and no irradiance; and third-party listings quote **850 / 620 / 470 nm and 60
LEDs**, which contradicts the brochure. So the page has a "numbers we will not invent"
section instead, in the slot where product 3 puts its needle depth.

## The running-cost table is inverted

Product 3's page exists partly to warn that every session costs ~AED 167 in consumables.
This helmet's version of that table is the other way round: **AED 3,300 once and no
consumable**. After about nine HairGen sessions the consumables have covered the gap
between the two devices. Gated behind `canSeePrices` like every other price.

## ★ Three fields the earlier scripts never touched

Found by grepping the rendered `/products/48` HTML rather than trusting the layout.
`description`, `benefits`, `keyFeatures` and `productDetails` had been rewritten. These
had not:

| Field | Was still saying |
|---|---|
| `howToUse` (48) | "LED lights stimulate hair follicles", "improves blood circulation", "increases blood flow" |
| `howToUse` (3) | "Light therapy stimulates hair follicles", "essential nutrients for hair growth", "Natural wound healing process promotes collagen" |
| `descriptionAr` (48) | "تحسين الدورة الدموية"، "بيئة أفضل لنمو الشعر" |
| `descriptionRu` (48) | "улучшить микроциркуляцию", "среду для роста волос" |
| `descriptionAr` (3) | "دعم برامج تقليل تساقط الشعر" |
| `descriptionRu` (3) | "поддержать программы против выпадения волос" |

**`descriptionAr` / `descriptionRu` are database columns and are not the same thing as
`data/productTranslations*.ts`.** `lib/seo.ts` prefers the columns for the localized meta
description, so a page can read clean in the body and still ship the old claim to Google
in Arabic and Russian. Worth remembering: a product row has eight claim-bearing surfaces,
not four.

Both products are now clean across all eight.

## Translations and the static fallback

`data/productTranslations.ts` and `productTranslationsRu.ts` repeated the false "no manual,
no leaflet" line, so the mobile app would have kept serving it. Rewritten. `lib/products.ts`
still had the original "to treat hair loss ... promoting hair growth ... improve blood
circulation in scalp" paragraph in the static outage fallback; rewritten too, the same
trap caught on product 64 earlier today.

Cache key `product-by-id-v55` → **`v56`**, because the row was written outside the admin API.

## Verified

- `tsc --noEmit` and `eslint` clean.
- `/products/48`, `/ar/products/48`, `/ru/products/48` all 200 with the specification,
  the certification line, HGHY01 and the contraindications present.
- No stray hair-growth, circulation or follicle-stimulation claim in any of the three.
  The only occurrences of the brochure's vocabulary are inside the block that refuses it.
- AR and RU translation JSON parses; product 64's validator still passes.

## The hair range is complete

43 tonic · 44 shampoo · 45 solution · 46 peeling · 47 kit · 3 booster · 48 helmet ·
61 brush · 64 stamp. All nine have bespoke pages.

## Note for whoever is next

Product 48's gallery is one photograph (`/images/gen.jpg`) and no `images` array, so the
how-to section carries the video instead. Four more product shots exist at
`~/Desktop/Drive/Genosys/Artwork/Art_Work/Gentron/` (`gentron.jpg`, `gentron2.jpg`,
`gentron3.jpg`, plus three LED close-ups) and would make a real gallery if they are worth
compressing.
