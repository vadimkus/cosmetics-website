# Session Changes — 2026-07-10 — Product 60 Main Image Fix

## Context

Product 60 (Bio Meso PDRN Ampoule 60000, `/products/60`) showed a gray
"Image not available" placeholder for the main image on web and mobile,
after the old main image `/images/Second/Prof_Meso.jpg` was deleted on
2026-07-09 (commit `2bcc7614`).

## Root cause

`data/productConfig.ts` still had a legacy `images` gallery for key `'60'`
whose **first entry was the deleted `/images/Second/Prof_Meso.jpg`**.
Config galleries win over the DB in both `ProductImageGallery.tsx` (web)
and `lib/pricingEngine.ts` (mobile API), so the page kept requesting the
deleted file. The 2026-07-06 swap to `/images/6000/main.jpg` only updated
the DB and `lib/products.ts` static fallback — the config override was
missed, and the 2026-07-09 pre-deletion check only searched for `Prof_Meso`
in DB `image`/`images` fields, not in `productConfig.ts` galleries.

## Fix

- Removed the `images` array from `productConfig.ts` entry `'60'`
  (pricing + documentation kept). Gallery is now **DB-only**:
  `product.image = /images/6000/main.jpg` prepended automatically +
  `product.images = S1–S6.jpeg`.
- Commit `fbccd5ca` "Fix product 60 broken main image: drop stale config
  gallery", pushed, Vercel deploy verified Ready.

## Verification (live)

- Page HTML preloads `/_next/image?url=%2Fimages%2F6000%2Fmain.jpg...` — 200, image/jpeg
- Zero `Prof_Meso` references remain in the served page
- Browser screenshot confirms main photo + 7 thumbnails render correctly
- Mobile API uses the same merge logic in `pricingEngine.ts` → fixed automatically, no OTA

## Lesson

Per the product-gallery rule: when a product has a **legacy config gallery**,
any main-image swap must update the config too (or migrate it to DB-only).
Before deleting an image file, grep `data/productConfig.ts` in addition to
DB fields.
