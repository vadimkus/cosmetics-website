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

*Files changed:*
- `components/RoutineProductChip.tsx` — pass actual cart entry's size/color to removeItem
