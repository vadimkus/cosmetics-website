# Product 64 — HR³ MATRIX HAIR STAMP bespoke PDP

**Date:** 12 Aug 2026
**Scope:** local only — no commit, no push, no deploy
**Product:** 64 · Hair Stamp For HAIRGEN BOOSTER · `cmqep332d00gef4ej9y2ajz41` · 600 AED

Third product to get a bespoke editorial layout, after 66 (Cerabarrier) and 65
(Bio-Meso). Live at `/products/64`, `/ru/products/64` and `/ar/products/64`.

---

## ⚠ Open issue — needle count and depth are contradicted by our own sources

This is the one thing to resolve before the page goes to production.

| Claim | Source | Type |
|---|---|---|
| **Microneedles 52EA** | `Desktop/Drive/Genosys/Training Materials/HairGen_Booster/210617_Hairgen Booster leaflet-small.pdf`, "GENOSYS HAIR STAMP" panel | Official DTS MG leaflet, 17 Jun 2021 |
| **140 needles · 0.25 mm depth** | `public/images/needles/s1.jpg` and `s3.jpg`; also the product record `productDetails.needles` | Our own marketing graphics — **not** a manufacturer document |

0.25 mm appears nowhere in manufacturer documentation. The only needle depth in
official artwork is 0.5 mm, and that belongs to the older flat derma stamp in
the MESOPECIA kit, which is a different product. Needle material is
undocumented; "medical-grade" also comes only from our graphics.

The photography could not settle it — `main.jpeg` is a genuine product shot and
confirms 8 stamps per box, but the stamps sit needle-side down.

**Decision (Vadim, 12 Aug):** omit needle count, depth and material from the
page copy entirely and build on verified facts only.

**Consequence still outstanding:** `s1.jpg` and `s3.jpg` remain in the gallery
per Vadim's choice to keep the images in all languages, so the page still
*displays* "140 needles · 0.25mm depth" inside those two graphics even though no
copy repeats it. Both should be regenerated once DTS MG confirms the current
spec. Until then the page text and the images disagree.

---

## What the page is built from (all verified)

Manufacturer leaflet and user's manual, same folder as above:

- 8 stamps per box, single use — "Each treatment, a new set of solution +
  applicator should be installed"
- 10-minute session; "The device automatically stops after 10 minutes"
- Stamping speeds — Level 1 · 280 RPM, Level 2 · 330 RPM, Level 3 · 400 RPM
- "No pain during treatment – Massaging sensation instead of needling sensation"
- "Hair solutionα is absorbed within 10 mins"
- Mechanism: physical pathways → increased permeability → transdermal delivery →
  wound-healing response (collagen and elastin) → angiogenesis and vasodilation
- The seven usage steps, condensed to six on the page
- Contraindications a–d quoted almost verbatim in the safety section
- DTS MG Co., Ltd., Seoul · Made in Korea

**Deliberately absent:** clinical percentages (the leaflet's clinical section is
before/after photos only — no hair counts, densities or subject numbers exist)
and treatment frequency (undocumented for the Booster + stamp combination; the
FAQ says so plainly rather than inventing a cadence).

---

## Files added

| File | Purpose |
|---|---|
| `components/product/hairstamp/HairStampProductPage.tsx` | The layout |
| `components/product/hairstamp/hairstampCopy.ts` | EN/AR/RU copy + sourcing rules |
| `components/product/hairstamp/hairstamp.css` | Graphite/steel palette |

## Files changed

| File | Change |
|---|---|
| `components/product/bespokePdp.tsx` | Registered `'64'` in `BESPOKE_PDP_LAYOUTS` |
| `app/products/[id]/page.tsx` | Allowlist → `['64', '65', '66']` |
| `app/ru/products/[id]/page.tsx` | Same |
| `app/ar/products/[id]/page.tsx` | Same |

---

## How it differs from products 65 and 66

This is a device consumable, not a formula, so the section set changed:

- **No ingredients or INCI section.** The product record holds a single
  "ingredient" describing the stamp head, which would look absurd under an
  actives heading. Product 64 has no `Full INCI` row and should never get one.
- **A specification table instead** — box contents, compatibility, session
  length, speeds. What a buyer actually needs here.
- **An "automatic, not manual" section**, because the reason to buy this rather
  than a hand roller is that the Booster drives it at a fixed speed.
- **No size selector.** Single SKU.
- **The routine strip is the argument for the product** — the stamp does nothing
  without the Booster and the solution, so the cross-sell is informative rather
  than an upsell.

Structural CSS, primitives and the gallery all still come from
`../cerabarrier`; only the palette is restated, scoped to
`.cera-page.hairstamp-page`.

## Notes for the next product

- **Routine product IDs are `id`, not `productNumber`, for legacy records.** 49
  of 66 products have `productNumber = null` and carry the catalogue number in
  `id` (HairGen Booster is `'3'`, the solution `'45'`, the shampoo `'44'`).
  `getProductsByNumbers` matches on either, which is why the routine resolves.
- **Every routine in `PRODUCT_ROUTINES` includes the product itself.** The
  bespoke layouts render that as a non-interactive "This product" card, so 64's
  four steps produce three add-to-bag buttons and one self card.
- **`product.size` is English prose** ("1 box - 8 pcs of hair stamp") and reads
  badly on the RU and AR pages. This layout states the pack from `copy.packSize`
  instead. Worth doing for any future product whose size field is a sentence.
- **`/documents/ppt/<file>.pdf` is a viewer route, not a static path.** It is an
  app route that reads from `public/documents/PPT/`. The lowercase `ppt` in the
  brochure links on products 64 and 65 is correct — do not "fix" it to match the
  folder casing.

---

## Verification

Playwright, `localhost:3100`, desktop 1440×1000 and mobile 390×844, all three
locales — 6/6 pass:

- HTTP 200, bespoke layout mounted, correct `dir` (`rtl` for AR)
- Localized headline present; no English leakage on RU/AR
- No occurrence of `140`, `0.25mm`, `52EA` or `medical-grade` in page *text*
- 4 routine cards resolved, no console errors, no failed requests
- No horizontal overflow, no broken images, all reveals shown

Also checked: `/documents/ppt/Protocol_Hair_Loss.pdf` → 200, and no regression
on `/products/65`, `/products/66`, `/ru/products/66`, `/ar/products/65`,
`/products/52`.

`npx eslint` clean on all touched files. `npx tsc --noEmit` shows only the four
pre-existing errors in `utils/formatProductDisplayName.tsx`, unrelated.
