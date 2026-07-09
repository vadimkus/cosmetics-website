# Session Changes — 2026-07-09 — Routines for All Products + Revita Glow Blog Post

## Task 1 — Recommended Routine on every retail product

### Coverage

Previously only 8 products had routine cards (beauty boxes 55-59, 62,
Revita Glow 63, Cerabarrier 66). Now **46 more products** have tailored
routines — every visible retail product. Deliberately excluded: Power
Solutions 4-9 and SRS 13 (professional clinic protocols), professional
devices 48 Hair-GENTRON / 49 GENO-LED, Bio Meso 60000 (professional
strength), Holiday Kit 54 (out of stock).

### Architecture — data-driven instead of 46 more hardcoded JSX blocks

- **`lib/productRoutines.ts` (new)**: `PRODUCT_ROUTINES` maps product slug →
  `{ headingKey, steps: [{ titleKey, descKey }] }`. Routines are tailored:
  the product sits at its natural step of a real GENOSYS regimen, surrounded
  by the products it combines with (e.g. Hair Tonic: scalp peeling →
  medicated shampoo → tonic → scalp brush; Microneedle Roller: cleanse →
  roller → PDRN ampoule → postcream).
- **Generic renderer** in `ProductPageClientRefactored.tsx` (same neutral
  card style as the bespoke blocks); steps deep-link via the existing
  `routineTitle()` helper, self-links skipped automatically.
- `ROUTINE_STEP_PRODUCT_IDS` extended with 21 new step keys (eye care,
  postcream, sun creams, masks, hair line, roller, ampoule…).
- i18n: 6 new routine headings + 22 new step title/desc pairs added to
  **en/ar/ru**.

### Validation

Script-verified: every heading/title/desc key exists in all three locales,
every step link targets an existing visible product, and every routine
contains the product itself. Browser-verified SSR on products 1, 22, 25,
39, 41, 43 (correct headings, linked steps, unlinked self).

### Routine template map (products → routine)

- Brightening: 10, 16, 21, 31
- Problem skin: 15, 20, 30
- Anti-aging: 22, 23 (ND Cell finish), 32, 37 (peptide mask), 53
- Deep moisturizing: 18, 28 (hydro soothing finish), 29, 34 (overnight), 35
- Sensitive/barrier: 19, 27; recovery: 25, 26 (EGF+PDRN), 36
- Renewal: 12, 38 (CO₂), 51 (bio-ferment), 52 (PDRN mask)
- Sun: 39, 40; BB/makeup: 41, 42, 11 (double cleanse)
- Eye: 17, 24, 33, 50 (kit)
- Hair: 3, 43, 44, 45, 46, 47 (kit), 61, 64
- Microneedling: 1, 65

## Task 2 — Revita Glow blog post

- Slug: `revita-glow-bb-cream-glass-skin-spf38`, published, author GENOSYS
  Team, featured image `/images/revita/main.jpg`.
- Uses all 5 product gallery images (main + s1-s4) across sections:
  vitamins/herbs, two shades, the micro air-cell puff, SPF 38 section, and
  the Radiant Glow routine with links to products 10/16/21/29 and a CTA to
  /products/63. Closes with the "review = 50 points" nudge.
- Full EN/AR/RU content (title, excerpt, body in each language).
- Created via `scripts/create-revita-glow-blog-post.ts` (idempotent,
  committed for reference).

## Also fixed en route

The header "Customer Reviews / Write a Review" duplication fix and review
CTA from the previous session were already live; no changes needed there.
