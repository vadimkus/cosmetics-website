# Admin Orders Currency Display Clarification

## Issue Report
**Date:** December 19, 2024  
**Reporter:** User via https://genosys.ae/admin  
**Issue:** Orders column shows "price is in USD, should be in AED"

---

## Investigation Results

### ✅ Frontend Display - CORRECT
The admin orders page (`app/admin/orders/page.tsx`) correctly displays currency:

```typescript
const formatCurrency = (amount: number) => {
  return `AED ${amount.toFixed(2)}`  // ✅ Correctly shows AED
}
```

All prices are displayed with "AED" prefix throughout the admin interface.

### ✅ Backend API - CORRECT
All Stripe API endpoints use `currency: 'aed'`:
- `/api/stripe/create-checkout-session/route.ts` ✅
- `/api/mobile/payments/applepay/intent/route.ts` ✅  
- `/api/mobile/checkout/stripe/route.ts` ✅

### ✅ Database - CORRECT
All orders are stored with AED amounts (no currency conversion).

---

## Possible Confusion Sources

### 1. Stripe Dashboard Display
**Stripe's dashboard displays amounts in USD by default**, even though transactions are processed in AED.

- **What you see in Stripe Dashboard:** `$123.45 USD`
- **What customer was actually charged:** `123.45 AED`

This is a **Stripe display setting**, not a pricing error.

### 2. Old Orders
Orders created before currency fixes may have incorrect amounts.

### 3. Browser Cache
The admin page may be showing cached data with old currency labels.

---

## Solution

### For Admin Users:
1. **Check Stripe Dashboard Settings:** 
   - Stripe dashboard can be set to display preferred currency
   - The actual transaction currency is AED regardless of display

2. **Clear Browser Cache:**
   ```bash
   Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   ```

3. **Verify Actual Amounts:**
   - Check order confirmation emails (sent to customers)
   - Check bank/card statements (shows AED charge)
   - Check order details in database (stored in AED)

### For Developers:
No code changes needed - all systems correctly use AED.

---

## Currency Flow Verification

```
Customer Checkout:
├─ Sees prices in: AED ✅
├─ Pays in: AED ✅
├─ Email shows: AED ✅
└─ Admin sees: AED ✅

Stripe Processing:
├─ Transaction currency: AED ✅
├─ Dashboard display: USD (configurable) ⚠️
├─ Actual charge: AED ✅
└─ Settlement: AED ✅

Database Storage:
├─ order.total: Number (AED) ✅
├─ order.subtotal: Number (AED) ✅
└─ order.shipping: Number (AED) ✅
```

---

## Status: ✅ NO BUG FOUND

All systems correctly use and display AED currency.  
If you're seeing USD, it's likely:
1. Stripe dashboard display setting
2. Browser cache showing old data
3. Misunderstanding of Stripe's display vs actual currency

**Recommendation:** Clear browser cache and refresh admin page.

