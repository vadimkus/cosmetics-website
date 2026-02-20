# Session Changes — February 20, 2026

## Fix: Routine Chip Remove for Products with Size Variants (Web)

### Problem

On the web `RoutineProductChip`, the `removeItem` call always passed empty strings for `selectedColor` and `selectedSize`. If a user added a product from its product page (where a specific size is selected), the chip would show it as "in cart" (because `inCart` checks by product ID only), but clicking to remove would fail silently (because `removeItem` tried to match `selectedSize: ''` against the stored `selectedSize: '50g'`).

### Fix

**File:** `components/RoutineProductChip.tsx`

When removing, the chip now looks up the actual cart entry and passes its stored `selectedColor` and `selectedSize` to `removeItem`, ensuring the exact match succeeds regardless of how the item was originally added.

### Why This is Safe

- The `inCart` check (by product ID) is unchanged
- The `addItem` call (with empty size) is unchanged — web `addItem` does not auto-normalize sizes
- Only the `removeItem` path changed: it now passes the real stored values instead of empty strings
- No changes to the cart store itself

---

## Fix: MoySklad Cushion Color Variant Mapping

### Problem

When syncing an order with multiple SKIN CARING BLEMISH BALM CUSHION items in different colors (e.g. Ivory + Beige) to MoySklad, both items appeared as Ivory. The `OrderItem.color` field was stored in the database but never passed to the MoySklad product mapper, and `PRODUCT_MAP` had only one entry for the cushion (Ivory).

### Fix

**Files:** `lib/moysklad.ts`, `app/api/admin/orders/[id]/push-moysklad/route.ts`

1. **COLOR_VARIANT_MAP** — New map for products with color variants. Key format: `"PRODUCT NAME | color"`. Added Ivory, Beige, Camel for the cushion.
2. **getMoySkladProductId(productName, color?)** — Now accepts optional `color`; checks color-specific variant first, then falls back to base product.
3. **MoySkladOrderItem** — Added optional `color?: string | null`.
4. **push-moysklad route** — Passes `item.color` when mapping order items.

### MoySklad UUIDs (from product edit URLs)

| Color | MoySklad UUID |
|-------|---------------|
| Ivory (#1) | `8e55b3ff-d092-11ec-0a80-022900a6db36` |
| Beige (#2) | `aca38da4-d092-11ec-0a80-013600a5ed6b` |
| Camel (#3) | `374eb073-a7cd-11ef-0a80-07b3001b04d5` |

### Backward Compatibility

- `color` is optional — products without color variants work unchanged
- Base `PRODUCT_MAP` entry for cushion remains as Ivory fallback when no color is specified

---

*Files changed:*
- `components/RoutineProductChip.tsx` — pass actual cart entry's size/color to removeItem
- `lib/moysklad.ts` — COLOR_VARIANT_MAP, getMoySkladProductId(color), MoySkladOrderItem.color
- `app/api/admin/orders/[id]/push-moysklad/route.ts` — pass item.color to createMoySkladOrder
