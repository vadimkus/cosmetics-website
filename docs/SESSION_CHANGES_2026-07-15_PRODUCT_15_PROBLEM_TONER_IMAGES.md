# Session Changes — 2026-07-15 — Product 15 Problem Control Toner new images

## Context

New 1024×1024 studio set for **INTENSIVE PROBLEM CONTROL TONER**
(`/products/15`), dropped into `public/images/problem/`: `Main.jpg` +
gallery `S1–S6.jpg`.

## Changes

- Renamed files to `Main.jpg` / `S1–S6.jpg`; compressed gallery
  (~560–625 KB → ~175–198 KB each). Main left at 469 KB.
- **DB**: `image` → `/images/problem/Main.jpg`; `images` → S1–S6 only
  (main prepended automatically by web + mobile).
- **Removed legacy config gallery** from `data/productConfig.ts` ('15')
  so DB gallery wins (same lesson as overnight / product 34).
- Static fallback `lib/products.ts` + training/downloads thumbs updated.
- **20 historical order items** repointed from `/images/PRS.jpg` → new
  main (so admin/customer order emails keep working previews).
- Old files deleted: `/images/PRS.jpg`, `/images/Second/problem_both.jpg`.
  Left alone: `/images/PRB.jpg` + `/images/Second/problem_duo.jpg`
  (still used by product 30 cream).

## Email / order safety

New orders already persist `canonicalOrderItemImage(product)` from DB
(`lib/orderItemImage.ts`). Historical rows for this SKU were repaired
before deleting the old main asset.
