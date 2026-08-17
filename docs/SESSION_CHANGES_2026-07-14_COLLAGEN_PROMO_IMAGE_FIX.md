# Session — Collagen free-mask promo image fix (2026-07-14)

## Symptom

Admin order email showed a broken thumbnail for **INTENSIVE REPAIR COLLAGEN MASK** (FREE / `Size: __PROMO__`) while paid lines rendered fine.

## Cause

1. Jul 9 image update deleted `/images/in.png` and pointed product 53 at `/images/collagen_mask/Main.jpeg`.
2. Mobile app free-mask promo still hardcoded `/images/in.png` in `CartContext.js` + `bag.js`.
3. `__PROMO__` size on the order line confirmed the order came from the **mobile app**; email embeds the stored `orderItem.image` → 404.

Sea algae had already been updated to `/images/sea_algae/Main.jpeg`; collagen was missed.

## Fix

1. **Mobile** — both refs → `/images/collagen_mask/Main.jpeg`; commit `7b2f463` + EAS OTA production (`513e9fdd-f632-4800-9b68-3b5babcedfbc`, runtime 1.11.0).
2. **DB** — repointed **352** historical `orderItem` rows with `in.png` → `/images/collagen_mask/Main.jpeg`.

## Note

Already-sent emails keep the old HTML `src`; new orders after OTA, and reopened order history / status emails that re-read DB images, use the new path.
