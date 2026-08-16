# Product 50 EyeCell EYE ZONE CARE KIT - audit and bespoke page - 2026-08-16

## What
Same rolling pass as products 4-10, 12, 17, 19, 24, 33, 34, 35, 37, 38 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU.

This is a **registered DTS MG four-piece kit**, not a UAE-assembled beauty box. Closest layout analog is the beauty-box page (contents + live prices + how-to across pieces + value math). It is not registered in `BEAUTY_BOXES`.

Live target: https://genosys.ae/products/50

Artwork worklist: `~/Desktop/genosys-artwork-corrections.html` (product 50 block)

## Sources
- `Registration DOC/Artwork/[GENOSYS]EYECELL KIT.pdf` (Feb 2025) - system source of truth. Function: Anti-wrinkle, Eye bag relief, Dark circle relief, Soothing. Contents: serum 10ml, cream 20g, patch 101g, Eye Roller 0.25mm x 1ea. How-to: cleanse; serum then roll; patches 20 minutes; cream. English precautions include avoid pregnancy / lactation.
- Older `Intertek/Label/[GENOSYS]EYECELL EYE ZONE CARE KIT.pdf` - patch 98g, older INCI. Not preferred. Use 101g from the 2025 artwork and product 33.
- Shipped component pages, not contradicted: 17 (Arbutin 2% + Adenosine 0.04%), 24 (same pair; peanut oil; retinyl palmitate; orange peel + limonene), 33 (Niacinamide 2% + Adenosine 0.04%; 20-40 min then remove; peptide 46.5 ppb; Parfum).
- Clinic / export list: GENOSYS Eye Roller one-body, 0.25mm, 60 needles, EBT025 / GRME025. Not product 1 (450-needle Standard Detachable).

No kit-level clinical trial is on file. Do not invent a wrinkle % or a collagen %.

## Distinctive fact
Four-piece eye-zone sequence. Serum + 0.25mm / 60-needle eye roller, patches 20-40 minutes, then cream. Korean functional pair on serum and cream is **Arbutin 2% + Adenosine 0.04%**. On the patch **Niacinamide 2% + Adenosine 0.04%**. The roller is kit-only.

Not a peptide kit. Not Botox. Not product 1. Not a beauty box. Own EAN `8809046298035`.

Value math is live: 17 + 24 + 33 versus kit 980 AED. The roller is not in the separate sum. Saving hides if the three ever cost less than the kit.

## Cut from live copy
- Collagen activation / medical microneedling delivery
- Peptide / Haloxyl / callus / stem-cell as the engine
- Patented thermo-sensitive / transdermal patches
- Efficacy test on the kit as a whole
- 3-step system that drops the roller
- All skin types / fragrance-free / pregnancy-safe
- Product 1 face-roller story and 230 AED in the separate total
- Contract manufacturers (COTDE, GENIC). DTS MG only.
- Lot / batch codes
- 10 Years Back as a headline (it stays on the physical packs in photographs)

## Images
Hero stays `/images/eye_kit/main.jpeg`.

Gallery (main not included):
- `/images/eye_kit/contents.jpeg` - current four-piece group, copied from `Second/ekit_big.jpg`
- `/images/eye_serum/main.jpeg` - product 17 packshot
- `/images/eye_cream/main.jpeg` - product 24 packshot
- `/images/patch/main.jpeg` - product 33 packshot
- `/images/eye_kit/roller.jpeg` - Intertek `Genosys_Eye_Roller_025mm.png`, converted

Claim-graphic slides from 17 / 24 / 33 were not used. Product 1 roller photos were not used. Older Intertek kit shots (white jar, old carton) were not used.

Video stays `/videos/kit.mp4`.

## Page
`components/product/eyekit/` - Cerabarrier primitives + charcoal / Pantone 187 C crimson (`#a6192e`) on cool grey paper. Kept clear of 17 silver, 24 champagne, 33 burgundy, and beauty-box garnet.

Sections: contents (live 17 / 24 / 33 + kit-only roller) -> how to (four carton steps + video) -> evidence (two functional pairs + 0.25mm) -> suited / not -> details with kit EAN -> FAQ.

Wired in `bespokePdp.tsx` via `BESPOKE_COMPANIONS['50'] = ['17','24','33']` and the EN / AR / RU product routes. Cache key bumped to `product-by-id-v20`.

`PRODUCT_ROUTINES['50']` left as cleanse / patch / serum / cream so the mask-before-leave-on test still holds. The bespoke page how-to follows the kit carton (serum + roll, then patches).

## Files
- `components/product/eyekit/eyekitCopy.ts`
- `components/product/eyekit/EyeKitProductPage.tsx`
- `components/product/eyekit/eyekit.css`
- `public/images/eye_kit/contents.jpeg`
- `public/images/eye_kit/roller.jpeg`
- `scripts/update-product-50-eye-zone-care-kit-selling-copy-20260816.ts`
