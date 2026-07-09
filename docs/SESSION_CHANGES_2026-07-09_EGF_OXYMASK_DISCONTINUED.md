# Session Changes — EGF Repair Oxymask Cream (Product 26) Discontinued

**Date:** 2026-07-09
**Scope:** Website + Mobile app
**Reason:** Product discontinued by manufacturer — removed from all customer-facing surfaces. Order history preserved.

## Database (production)

- Product `26` (EGF REPAIR OXYMASK CREAM): `isHidden: true`, `inStock: false`.
- This automatically removes it from: web catalog, web PDP (404), search, skin-analysis recommendations, mobile products list, mobile PDP, sitemap.
- The product row is NOT deleted — past orders, invoices, and reviews stay intact.

## Website code changes

| File | Change |
|---|---|
| `lib/products.ts` | Static fallback entry marked `isHidden: true`, `inStock: false` |
| `lib/productRoutines.ts` | Removed product 26's own routine entry |
| `lib/routineStepLinks.ts` | Removed `routineEGFOxymaskTitle: '26'` mapping — the EGF step in the Sensitive Skin Beauty Box (62) routine now renders as plain text (no dead link) |
| `data/productConfig.ts` | Removed `'26'` pricing/images entry |
| `components/product/ProductContentDisplay.tsx` | Removed EGF kit-item link mapping (was incorrectly pointing to product 52 anyway) |
| `lib/chatbot/config.ts` | Removed EGF Repair Oxymask from Genie's product catalog (ingredient-level EGF mentions kept — other products contain EGF) |
| `lib/concernsData.ts` | Scars evening routine step 3 replaced Oxymask → SKIN REBOOT PDRN MASK PACK (52, 400 AED) in EN/AR/RU. Anti-aging evening step 4 now recommends ND Cell only. FAQ answers rewritten; the "Oxymask vs Postcream" FAQ deleted in all 3 locales. |

## Mobile app changes (OTA)

| File | Change |
|---|---|
| `components/product/BeautyBoxDetails.js` | Removed `/oxymask|egf repair/` → 26 link pattern; beauty box kit line renders unlinked |
| `data/productConfig.js` | Removed `'26'` images/video entry |

OTA published to both runtimes: 1.11.0 (main) and 1.10.5 (release branch).

## Intentionally NOT changed

- `lib/moysklad.ts` and `lib/moyskladBeautyBoxExplosion.ts` — MoySklad mapping kept for back-office/consignment operations and for exploding Sensitive Skin Beauty Box (62), which still physically contains the EGF mask while stock lasts.
- `lib/orderSizeDefaults.ts` — historical orders/invoices still reference the product name.
- Box 62 description and its routine step text (i18n `routineEGFOxymask*` keys) — the box still ships with the mask from existing stock. **Open question for Vadim:** when box 62 stock built with EGF mask runs out, the box composition needs to be redefined (replacement item + price).
- `messages/*.json` routine keys and `data/productTranslations*.ts` — kept because box 62 still references them; product 26's own translations are dead data (product hidden) and harmless.
