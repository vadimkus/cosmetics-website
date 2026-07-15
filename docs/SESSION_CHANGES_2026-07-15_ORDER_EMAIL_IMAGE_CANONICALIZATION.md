# Session — Order email image canonicalization (2026-07-15)

## Problem

Order emails could show “preview unavailable” after a product image migration.
Order creation trusted `item.image` from the client before the current
server-side `product.image`. A persisted mobile cart could therefore write a
deleted URL into a brand-new order after the database and app were updated.

The reported Sea Algae order contained `/images/SEA.jpg`, deleted on July 11.

## Permanent fix

- Added `lib/orderItemImage.ts`.
- All six server-priced order channels now persist
  `canonicalOrderItemImage(product)`:
  - web COD
  - native direct/COD order
  - native Stripe Checkout
  - native Apple Pay
  - web partner order
  - native partner order
- Client/cart image snapshots are no longer trusted for persisted order items.
- The valid neutral fallback is `/images/genosys-logo-transparent.png`;
  nonexistent `placeholder.jpg` / `default-product.jpg` fallbacks were removed
  from the touched order and notification paths.
- Regression tests inspect every order-creation route and reject the old
  `item.image || product.image` pattern.

## Historical database repair

`repair-dead-order-item-images.ts` scans every order item, checks whether its
local asset still exists, resolves the current product by DB id, product number,
or normalized name, and replaces only dead paths with the current DB main image.

Applied July 15:

- Products scanned: **66**
- Order items scanned: **1,727**
- Broken rows repaired: **75**
- Unresolved rows: **0**
- Post-repair audit: **0 broken local image rows**

Largest repaired groups:

- Revita old `/images/bright.jpg`: 23
- Shampoo old `/images/Second/Sham.jpg`: 12
- Bio Meso 60000 old `/images/Second/Prof_Meso.jpg`: 8
- Mist old absolute `/images/mist.jpg`: 4
- Sea Algae old `/images/SEA.jpg`: 1 (the reported order)
- Missing generic placeholder rows: 27, all replaced with their product’s
  current canonical image

## Image migration workflow

The persistent product-gallery rule now requires the audit/repair script after
main-image deletions and forbids client image snapshots for order records.
