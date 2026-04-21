# Session Changes — April 21, 2026

## Summary

Fixed a long-standing MoySklad sync bug where **size variants were silently mapped to the wrong product** in MoySklad. Reported case: order `#2zkpco0h` (customer ordered `INTENSIVE PROBLEM CONTROL CREAM 250g`) pushed to MoySklad as the 50g variant (code 00035 instead of 00036).

Root cause: `lib/moysklad.ts` had `PRODUCT_MAP` and `COLOR_VARIANT_MAP` but **no size-aware mapping**. The admin push-moysklad route wasn't even passing `item.size` to the integration. Every multi-size product on genosys.ae was at risk of the same mismatch.

This is NOT a one-off — any order with 250g cream, 500ml toner/cleanser, 1000ml booster, 100g postcream, 230g radiance cream, or 0.5–2.0mm rollers would have been affected.

---

## 1. Bug Reproduction

Order `#2zkpco0h` → MoySklad `CODM2604219272`:

| Field | genosys.ae DB | MoySklad (before fix) |
|---|---|---|
| Product | `INTENSIVE PROBLEM CONTROL CREAM` | ✓ matched |
| Size | `250g` | ✗ **ignored** |
| Resulting SKU | — | `00035 Problem Control Cream 50g` |
| Price | 210 AED (correct for 250g) | 210 AED on the 50g line ← obvious mismatch |

Stock would have been decremented from the wrong warehouse row, and the customer's delivery slip / invoice would have shown the wrong jar size.

---

## 2. Fix

### `lib/moysklad.ts`

1. **New `SIZE_VARIANT_MAP`** mirroring the `COLOR_VARIANT_MAP` pattern. Key format: `"PRODUCT NAME | size"` (size normalized: whitespace-stripped, lowercased).

   Covers all 9 multi-size products currently offered:

   | Webapp ID | Product | Sizes |
   |---|---|---|
   | 10 | SNOW O₂ CLEANSER | 180ml, 500ml |
   | 15 | INTENSIVE PROBLEM CONTROL TONER | 200ml, 500ml |
   | 16 | SNOW BOOSTER | 200ml, 1000ml |
   | 25 | SOOTHING REPAIR POSTCREAM | 20g, 100g |
   | 28 | INTENSIVE HYDRO SOOTHING CREAM | 50g, 250g |
   | 29 | MOISTURE REPLENISHING HYALURON CREAM | 50g, 250g |
   | 30 | INTENSIVE PROBLEM CONTROL CREAM | 50g, 250g |
   | 31 | MULTI VITA RADIANCE CREAM | 50g, 230g |
   | 32 | MULTI FUNCTIONAL ANTI-WRINKLE CREAM | 50g, 250g |
   | 1  | MICRONEEDLE ROLLER | 0.25 / 0.5 / 1.0 / 1.5 / 2.0 mm |

2. **`getMoySkladProductId(productName, color?, size?)`** — added `size` parameter. Lookup precedence:

   1. `SIZE_VARIANT_MAP` (name + size) — highest priority for multi-size products
   2. `COLOR_VARIANT_MAP` (name + color)
   3. `PRODUCT_MAP` (name only) — fallback default

   Special-cases the `__PROMO__` size sentinel used by promotional / free gift items (ignored for size matching so they fall through to the base product).

3. **`MoySkladOrderItem`** — added optional `size?: string | null`.

4. **Unmapped-item log** now includes both size and color for debugging:
   `"INTENSIVE PROBLEM CONTROL CREAM (250g)"` instead of just the product name.

### `app/api/admin/orders/[id]/push-moysklad/route.ts`

Added `size: item.size` to the `items.map(...)` call. Without this, the integration would never see the DB `size` field even after the map was in place.

---

## 3. In-Flight Data Fix

The already-pushed MoySklad order `CODM2604219272` (UUID `5d1b56e6-3d89-11f1-0a80-0b450023e348`) was corrected in place — the wrong 50g position (`456e3fbd-...`) was swapped for the 250g product (`7f4736b3-...`, code 00036). Price stays at 210 AED.

Verification:
```
- 00036    Genosys Intensive Problem Control Cream 250g   qty=1  price=210 AED  ← fixed
- 00143    Genosys Skin Caring Blemish Balm Cushion #1 Ivory   qty=1  price=150 AED
- 54467    Genosys Skin Reboot PDRN mask Pack (30 sheets)   qty=1  price=200 AED
- 00063    Genosys Intensive Repair Collagen Mask 23g   qty=1  price=0 AED (promo)
- 00089    Excellent Delivery Dubai   qty=1  price=45 AED
```

---

## 4. Files Changed

| File | Change |
|---|---|
| `lib/moysklad.ts` | Added `SIZE_VARIANT_MAP`, `normalizeSize()`, size arg in `getMoySkladProductId()`, `size?` on `MoySkladOrderItem`, improved unmapped-item label |
| `app/api/admin/orders/[id]/push-moysklad/route.ts` | Pass `size: item.size` through to `createMoySkladOrder` |

No other call sites — automatic checkout → MoySklad sync was already removed in Feb 2026 session; all MoySklad pushes go through the admin button.

---

## 5. Future-Proofing Notes

**When adding a new multi-size product:**

1. Find both MoySklad UUIDs (search `/entity/product?search=<name>`).
2. Add both size keys to `SIZE_VARIANT_MAP` in `lib/moysklad.ts` — **always both**, never rely on the `PRODUCT_MAP` default.
3. If the default entry in `PRODUCT_MAP` is still needed for backward compatibility or single-size promos, leave it — `SIZE_VARIANT_MAP` takes precedence when size is provided.

**Audit check:** grep `utils/productPricing.ts → getProductSizeOptions()` for any product IDs that don't have corresponding `SIZE_VARIANT_MAP` entries. Those are latent bugs.
