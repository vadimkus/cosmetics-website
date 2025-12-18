# 🐛 Mobile COD Email Bug Investigation

## Issue Report
**User:** Vadim Sagatdinov  
**Email:** deleted+cmjbfpd7z00dxgzhmfn6vi44o@genosys.local  
**Contact Email (in profile):** sales@genosys.ae  
**Problem:** COD order confirmation email delivery failed  
**Error:** Mail sent to incomplete address "5856825" instead of "sales@genosys.ae"

---

## Code Analysis

### Line 433 `/app/api/mobile/orders/route.ts`
```typescript
const preferredEmail = getPreferredEmail(user)
```
✅ **CORRECT**: Fetches `contactEmail` if set, else `user.email`

### Line 438
```typescript
customerEmail: preferredEmail,  // Use preferred email for notifications
```
❌ **POTENTIAL BUG**: Saves `preferredEmail` to `order.customerEmail`

### Lines 464 & 491
```typescript
customerEmail: order.customerEmail,
```
✅ **CORRECT**: Uses the stored `customerEmail` from order

---

## Root Cause Analysis

The bug is **NOT** in the code logic - the logic is correct!

The bug is likely:
1. **User's `contactEmail` in database is corrupt/incomplete** (e.g., "5856825" instead of "sales@genosys.ae")
2. **OR** `getPreferredEmail()` is returning the user's deleted email instead of contactEmail

---

## Required Actions

1. ✅ Check user's actual `contactEmail` value in database
2. ✅ Update profile form to show contactEmail field for deleted accounts (DONE)
3. ⚠️  **FIX**: The mobile orders endpoint should use `user.email` for `order.customerEmail` (database record), but `preferredEmail` for EMAIL SENDING only

---

## Correct Implementation

The order should be stored with the **login email** (`user.email`), but emails should be sent to **preferred email** (`getPreferredEmail(user)`).

**Current (WRONG):**
```typescript
const preferredEmail = getPreferredEmail(user)
const order = await prisma.order.create({
  data: {
    customerEmail: preferredEmail,  // ❌ WRONG - loses original email
    ...
  }
})

sendOrderConfirmationEmail({
  customerEmail: order.customerEmail,  // Sends to preferredEmail
  ...
})
```

**Fixed (CORRECT):**
```typescript
const preferredEmail = getPreferredEmail(user)
const order = await prisma.order.create({
  data: {
    customerEmail: user.email,  // ✅ Store original login email
    ...
  }
})

sendOrderConfirmationEmail({
  customerEmail: preferredEmail,  // ✅ Send to preferred email
  ...
})
```

---

## Impact

- Orders are being saved with `contactEmail` instead of login email
- If `contactEmail` is corrupt/missing, emails fail
- Order history loses association with original user email
- Admin sees wrong email in order records

