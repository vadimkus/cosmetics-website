# Liudmila Stepanova — GENCardM2606211312 MoySklad fix (2026-06-21)

**Customer:** Liudmila Stepanova · stepanovaliudmila04@gmail.com · +971526800378  
**Web order:** **GENCardM2606211312** · **1,580.30 AED** paid (Stripe) · free shipping

## Problem

Admin push synced only **460 AED** (BB Cushion Beige + Microbiome Mist + 2 promo masks). **Deep Moisturizing Beauty Box** had no MoySklad SKU → skipped → partial chain marked “Synced” in admin.

| Doc | Partial (trashed) | Fixed |
|---|---:|---:|
| Order | 460 | **1,580.30** |
| Invoice | 04707 @ 460 | **04707 @ 1,580.30** |
| Shipment | 06395 @ 460 | **06395 @ 1,580.30** |
| Payment in | 05805 @ 460 | **05805 @ 1,580.30** |

MoySklad order ID: `584932fd-6d99-11f1-0a80-0bf30066ce76`

## Cart → warehouse picks

| Website line | MoySklad picks |
|---|---|
| Deep Moisturizing Beauty Box ×1 | 00021×1, 00022×1, 00195×1, 54458×1, 00140×3 (each −15%) |
| BB Cushion Beige ×1 | 00144 ×1 @ 300 |
| Microbiome Mist ×1 | 00188 ×1 @ 160 |
| Collagen mask FREE | 00063 ×1 @ 0 |
| Sea algae mask FREE | 00140 ×1 @ 0 |

## Code fix (future orders)

- `lib/moyskladBeautyBoxExplosion.ts` — explode all 6 beauty boxes to retail SKUs
- `lib/moysklad.ts` — use explosion on push; **block sync** if unmapped lines or total mismatch
- Admin push route — auto-trash **partial** prior sync and re-push; pass 15% box discount to explosion

## Script

`scripts/moysklad-create-liudmila-stepanova-order-invoice-demand-paymentin-20260621.js --commit`

## PDF

`~/Desktop/orders/GENOSYS_Liudmila_Stepanova_04707.pdf`

## Links

- [Order GENCardM2606211312](https://online.moysklad.ru/app/#customerorder/edit?id=584932fd-6d99-11f1-0a80-0bf30066ce76)
