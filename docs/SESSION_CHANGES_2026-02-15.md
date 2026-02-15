# Session Changes — February 15, 2026

## Part 1: MoySklad Refactor — Automatic to Manual Admin Push

### Problem

The automatic MoySklad order sync (implemented Feb 14) was unreliable on Vercel's serverless runtime. Despite multiple attempts (fire-and-forget promises, `next/server` `after()`, direct `await` before response), real checkout orders were not consistently being created in MoySklad, even though a standalone test endpoint worked perfectly.

**Root cause**: Vercel serverless functions can terminate unpredictably after the HTTP response is sent, and even blocking the response with `await` was inconsistent for external API calls to MoySklad.

### Solution

Switched from automatic sync to a **manual admin push button**:

1. **Removed** automatic MoySklad calls from all 3 checkout routes
2. **Added** `moySkladOrderId` and `moySkladSyncedAt` columns to the Order model
3. **Created** `POST /api/admin/orders/[id]/push-moysklad` endpoint with admin auth + CSRF
4. **Added** "Push to MoySklad" button to the admin order detail view (`OrderDetails.tsx`)
5. **Deleted** the temporary `/api/test-moysklad` debug endpoint

### Files Changed

| File | Change |
|------|--------|
| `app/api/checkout/route.ts` | Removed `createMoySkladOrder` import and call |
| `app/api/webhooks/stripe/route.ts` | Removed `createMoySkladOrder` import and call |
| `app/api/mobile/orders/route.ts` | Removed `createMoySkladOrder` import and call |
| `prisma/schema.prisma` | Added `moySkladOrderId` (String?) and `moySkladSyncedAt` (DateTime?) to Order model |
| `app/api/admin/orders/[id]/push-moysklad/route.ts` | **NEW** — Admin endpoint to push order to MoySklad |
| `components/admin/OrderDetails.tsx` | Added "Push to MoySklad" button + "Synced to MoySklad" badge |
| `app/admin/page.tsx` | Passed `getAdminHeaders`, `showToast`, `onMoySkladPushed` props to OrderDetails |
| `app/api/orders/cod-confirmation/route.ts` | Added `moySkladOrderId: null` to fallback order object (TypeScript) |
| `app/api/orders/support-link/route.ts` | Added `moySkladOrderId: null` to fallback order object (TypeScript) |
| `app/api/test-moysklad/route.ts` | **DELETED** — Debug endpoint no longer needed |
| `docs/MOYSKLAD_INTEGRATION.md` | Updated to reflect manual push workflow |

### Admin UI

- **Before push**: Orange "Push to MoySklad" button appears below the order Total
- **After push**: Green "Synced to MoySklad" badge replaces the button
- **Already pushed**: API returns 409 to prevent duplicate orders
- Toast notifications show success or error messages

### Risk Assessment

- **Zero risk to checkout flow**: MoySklad is completely decoupled from all checkout routes
- **Zero risk to emails**: Email confirmations are unchanged
- **Zero risk to existing orders**: The new columns are nullable, existing orders unaffected
- **Database migration**: Used `prisma db push` (additive only — two nullable columns)

---

## Part 2: PCS Product Gallery Images

### Change

Added second and third gallery images for **POWER SOLUTION PCS** (product ID: 7) on [genosys.ae/products/7](https://genosys.ae/products/7).

### Files Changed

| File | Change |
|------|--------|
| `lib/products.ts` | Changed `images: null` to `images: JSON.stringify(['/images/PCS.jpg', '/images/Second/pcs_big1.jpg', '/images/Second/pcs_big2.jpg'])` for product 7 |
| `public/images/Second/pcs_big1.jpg` | **NEW** — Second product image |
| `public/images/Second/pcs_big2.jpg` | **NEW** — Third product image |

### Pattern

Follows the same pattern as other PRO Solution products:
- **CVS** (product 5): `[CVS.jpg, cvs_big1.jpg, cvs_big2.jpg]`
- **CTS** (product 6): `[CTS.jpg, cts_big.jpg, cts_big2.jpg]`
- **PCS** (product 7): `[PCS.jpg, pcs_big1.jpg, pcs_big2.jpg]` ← new

---

## Part 3: Fix Duplicate Discount Display on Order Success Page

### Problem

On the order confirmation page (`/success`), the VIP discount was shown **twice**:

1. **Per-item**: Strikethrough original price (AED 580.00), green discounted price (AED 290.00), "(50% OFF)" text, and "-50% VIP" badge
2. **Breakdown section**: "Retail Price (1 item) → 580.00 AED" (strikethrough), then "Your Discount (50%) → -290.00 AED", then "Net Subtotal → 290.00 AED"

This was redundant and confusing — the customer sees the same discount info in two places.

### Fix

The "waterfall" breakdown (Retail → Discount → Net Subtotal) is now only shown when there is a **bundle discount** (where it adds clarity for the multi-step discount calculation). For **VIP-only discounts**, the breakdown shows a simple "Net Subtotal" line since the per-item display already clearly communicates the discount with strikethrough prices and badges.

### Files Changed

| File | Change |
|------|--------|
| `app/success/SuccessClient.tsx` | Show waterfall only for bundle discounts; VIP-only shows simple "Net Subtotal" |

### Before vs After (VIP-only order)

**Before:**
```
POWER SOLUTION PCS          AED 580.00 → AED 290.00
  (50% OFF)  -50% VIP

Retail Price (1 item)         580.00 AED  ← duplicate
Your Discount (50%)          -290.00 AED  ← duplicate
Net Subtotal                  290.00 AED
Shipping (Dubai)               45.00 AED
VAT (5%)                       15.95 AED
Total                         350.95 AED
```

**After:**
```
POWER SOLUTION PCS          AED 580.00 → AED 290.00
  (50% OFF)  -50% VIP

Net Subtotal                  290.00 AED
Shipping (Dubai)               45.00 AED
VAT (5%)                       15.95 AED
Total                         350.95 AED
You saved: 290.00 AED
```

Bundle orders still show the full waterfall breakdown.

---

## Commits

| Hash | Message |
|------|---------|
| `bf8fa75b` | refactor: switch MoySklad from auto-sync to manual admin push button |
| `9adf3fac` | fix: add Push to MoySklad button to the actual OrderDetails view |
| `8cc35bcf` | add gallery images for POWER SOLUTION PCS (product 7) |
| `3034a16b` | fix: remove duplicate discount display on order success page |
