# Blog: "Does the Collagen You Drink Reach Your Face?" (31 Oct 2026)

Live EN/RU/AR post, slug `collagen-drink-myth-what-reaches-your-face`:

- https://genosys.ae/blog/collagen-drink-myth-what-reaches-your-face
- https://genosys.ae/ru/blog/collagen-drink-myth-what-reaches-your-face
- https://genosys.ae/ar/blog/collagen-drink-myth-what-reaches-your-face

## Story

Myth vs fact: drunk collagen is digested into amino acids and small fragments, the body shares them out by its own
priorities, and the cleanest trials show no clear skin effect. Then the shorter way to the face: BIO-MESO PDRN,
"No needles. Just hands.", Expert Ampoule 60000 in clinic and Homecare Ampoule 5000 at home (products 60, 65; mask 52).

## Sources

- Myung & Park, Am J Med 2025;138(9):1264-1277, doi 10.1016/j.amjmed.2025.04.034 (23 RCTs, 1,474 people). The industry
  dispute of its funding classification is stated in the article.
- Product facts: `data/product60LocalizedCopy.ts`, `data/product65LocalizedCopy.ts`, Instagram brief
  `Insta_Olga/02_PRODUCTS/60_BIO_MESO_PDRN_60000/NO_NEEDLES_2026-10/02_DOCS/BRIEF_v1.md`. No collagen-production,
  growth-factor or DTS clinical-percentage claims; no prices.

## Media

- `public/images/collagen_myth_blog/`: clean plates (no type) from the live Instagram row of 29 Oct (PROOF 60000,
  PRODUCT 5000) and the myth deck (not yet posted). Cover = square crop of the myth cover plate. The PROOF slide with the
  60000 applicator at the face is left out (no syringe-like tools to buyers).
- `public/videos/biomeso-no-needles-reel-web.mp4`: the live reel (DfESRTeKvsu) at 720p, 3.3 MB; poster `reel-poster.jpg`.
- Links to the three live Instagram posts in the article.

## Script

`scripts/create-collagen-myth-bio-meso-blog.ts` (idempotent upsert). Push and deploy before running it: its Tailwind
classes must be in the build. Display headings sit in a `font-light` span because `.cera-page :where(h2)` forces 600.

Not announced to push/newsletter subscribers (`announcedAt` empty).
