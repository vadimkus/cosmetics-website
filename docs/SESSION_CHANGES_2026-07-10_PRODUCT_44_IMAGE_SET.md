# Session Changes — 2026-07-10 — Product 44 New Image Set

## Context

New 1024x1024 studio image set for product 44 (HR³ MATRIX MEDI SCALP
SHAMPOO α, `/products/44`): `Main.jpg` + gallery `S1–S6.jpg`, dropped by
Vadim into `public/images/Shampoo/`.

## Changes

- Folder renamed to lowercase `public/images/shampoo/` (Vercel is
  case-sensitive; gallery rule requires new folders lowercase)
- Gallery S1–S6 compressed with `sips` (≈600–760 KB → ≈150–300 KB each);
  Main.jpg left as-is (388 KB)
- DB (`scripts/update-product-44-images.ts`):
  - `image` → `/images/shampoo/Main.jpg`
  - `images` → `["/images/shampoo/S1.jpg", … "S6.jpg"]` (gallery only,
    main is prepended automatically by web + mobile)
- Static fallback `lib/products.ts` id '44' updated to match
- **Checked `data/productConfig.ts` first** (lesson from product 60 fix):
  no `images` gallery exists for key '44' — nothing to migrate
- Old main `/images/Second/Sham.jpg` deleted — verified zero DB and code
  references before deletion. NOTE: the training pages use a *different*
  file `/images/Sham.jpg` (root folder) — untouched, still needed.

## Commit

`3d037f25` "Product 44 (HR3 MATRIX MEDI SCALP SHAMPOO): new image set,
delete old main" — pushed, Vercel deploy Ready.

## Verification (live)

- `/images/shampoo/Main.jpg` and `S1–S6.jpg` all return 200
- Old `/images/Second/Sham.jpg` returns 404
- Page HTML (post-ISR expiry) references only the new set, zero `Sham.jpg`
- Browser runtime check: all 8 `<img>` elements report `complete: true`
  with non-zero naturalWidth (main + 7 thumbnails)
- Mobile: DB-driven, no OTA needed
