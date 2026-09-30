# Session changes - 30 Sep 2026 - Product 69 GENOSYS Eye Roller 0.25mm

New catalogue product with its own "For your eyes only." art campaign. Live at
https://genosys.ae/products/69 (also `/ru`, `/ar`).

## Product

| Field | Value |
|---|---|
| id / productNumber | `69` / `69` |
| Name | Eye Roller · RU `Роллер для глаз GENOSYS 0,25 мм` · AR `رولر العين GENOSYS بطول 0.25 مم` |
| Price | 210 AED (MoySklad retail), one variant `0.25mm` |
| MoySklad | `Genosys Eye Roller 0,25mm`, code `00084`, article `EBT025`, id `2c882b4c-6397-11ea-0a80-05560009d0e4`, 15 in stock on 30 Sep |
| Category | Microneedling |
| Source photos | `~/Desktop/eye/EYE ROLLER.png`, `EYE ROLLER_outer box.jpg` |

## Facts used (and left out)

From the product 50 audit (`SESSION_CHANGES_2026-08-21_PRODUCT_50_EYE_ZONE_CARE_KIT_LOCALIZATION_AUDIT.md`) and the DTS MG roller brochure:

- one-piece body, 0.25 mm (shortest GENOSYS length), 60 stainless-steel needles
- roll over EyeCell Eye Contour Serum, horizontally then vertically, a few minutes, no pressing
- personal and reusable: 5 minutes in chlorhexidine before each reuse, never share
- not with keloid tendency, stainless-steel allergy or dermatitis; not on damaged, infected or irritated skin
- made in Korea by DTS MG

Left out on purpose: sterile / single use (it is reusable), needle thickness, steel grade, CE and
the Korean licence (the CE certificate lists MEDI, REJUVE, Body, HEAD, STAMP, FB, MD; the MFDS
free-sale list has no eye model), face-roller needle counts, any frequency, and any channel,
penetration or collagen claim. `__tests__/data/product69LocalizedCopy.test.ts` enforces this.

## Code

- `data/product69LocalizedCopy.ts` - EN/RU/AR copy (un-ignored in `.gitignore`)
- `components/product/eyeroller/` - page on the shared `DtsToolProductPage`, pairing card = product 17
- Registered in `bespokePdp.tsx` (companions 17, 33, 24, 50), `productTranslations(.Ru).ts`,
  `lib/products.ts` fallback, `lib/moysklad.ts` (`EYE ROLLER | 0.25mm`, `Eye Roller`),
  `productBadges.ts` (New), `productQuickFactsCatalog.ts`, `localizedProductImages.ts`,
  `routineStepImages.ts`, `productCutouts.ts` (`cutout/69.webp`), chatbot catalogue
- `scripts/create-product-69-eye-roller.ts` - DB create (applied), also syncs product 50 RU/AR descriptions

## Product 50 correction

The roller is no longer kit-only. Removed "exclusive / kit only / only here" from the EyeKit page
copy (EN/RU/AR), `product50LocalizedCopy.ts`, quick facts and the DB RU/AR descriptions. The kit's
roller item stays unlinked so the "bought separately" total still counts serum, cream and patches only.

## Campaign - "FOR YOUR EYES ONLY."

Pack red `#B8242F` + powder blue `#CFE0EA`, product only on main and slide 12. Workspace
`~/Desktop/Insta_Olga/eyeroller69/campaign/` (`c69_*` scripts). Exports `public/images/eyeroller_art/`
(main + s1-s12, `ru/`, `ar/`; 37 files).

| # | Visual | EN headline |
|---|---|---|
| 1 | keyhole with light | FOR YOUR EYES ONLY. |
| 2 | five nesting dolls | 0.25 MM · THE SMALLEST OF FIVE. |
| 3 | needle and red thread | 60 · FINE NEEDLES. |
| 4 | dropper into silver spoon | THE SERUM GOES FIRST. |
| 5 | red/white ribbon weave | ACROSS, THEN DOWN. |
| 6 | soap bubble on silk | NO PRESSURE. |
| 7 | egg timer and glass bowl | FIVE MINUTES OF CARE. |
| 8 | toothbrush in a glass | YOURS ALONE. |
| 9 | four silver spoons | FOUR STEPS. ONE RITUAL. |
| 10 | reading glasses | READ BEFORE YOU ROLL. |
| 11 | silver crescent | MADE FOR THE CURVE. |
| 12 | the roller, card | FOR YOUR EYES ONLY. |

## Deploy and checks

- Commits `5cc3b7f38` (product, art, kit fix), `838185a85` (cut-out)
- DB: product 69 created, variant `0.25mm:210`, gallery 12; product 50 RU/AR descriptions synced
- Revalidated `products` tag and `/products/69`, `/products/50` in all locales
- Live: EN/RU/AR pages 200 with localized headline and 12 localized slides; mobile API returns
  main + 12 slides, `locale=ar` returns `ar/` slides
- Tests: 149 suites, 1610 passed
