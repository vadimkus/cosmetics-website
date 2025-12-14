# Mobile App Order Deletion Feature - Summary & Backend Requirements

## What Changed in Mobile App

### UI Changes
✅ **New Delete Button**
- Added small trash/basket icon button under the "Details" pill on each order card
- Only visible for **pending/unpaid orders**
- Shows "Cannot delete" message for paid/shipped/delivered orders

### User Flow
1. User taps trash icon on a pending order
2. Confirmation popup appears: "Are you sure you want to delete this order?"
3. User confirms deletion
4. Order is deleted from backend
5. Order card is removed from list immediately (optimistic UI update)

### Code Changes in Mobile App

**File: `services/api.js`**
```javascript
deleteUserOrder(orderId) {
  // Tries two endpoints:
  // 1. DELETE /api/mobile/orders/:id
  // 2. DELETE /api/mobile/user/orders/:id (fallback)
}
```

**File: `app/profile/orders.js`**
- Integrated deleteUserOrder() function
- Added confirmation dialog
- Added optimistic UI update (removes card immediately)
- Shows error toast if deletion fails

---

## Backend Status

### Current Endpoints

✅ **`GET /api/mobile/orders`** - List user's orders (EXISTS)
✅ **`GET /api/mobile/orders?orderId=xxx`** - Get specific order (EXISTS)
✅ **`POST /api/mobile/orders`** - Create new order (EXISTS)
❌ **`DELETE /api/mobile/orders/:id`** - Delete order (**MISSING**)

### Existing Cancel Endpoint (Web)
- **`POST /api/orders/:id/cancel`** - Cancels order (sets status to 'CANCELLED')
- Not a DELETE endpoint - just changes status
- Requires CSRF token (web-only security)
- Not suitable for mobile app

---

## What Needs to Be Done

### Create DELETE Endpoint for Mobile App

**File to Create:** `app/api/mobile/orders/[id]/route.ts`

**Requirements:**
1. ✅ Authenticate user with JWT token + API key
2. ✅ Verify order belongs to the authenticated user
3. ✅ Only allow deletion of pending/unpaid orders
4. ✅ Prevent deletion of paid/shipped/delivered orders
5. ✅ Soft delete (set status to 'DELETED') or hard delete (remove from DB)
6. ✅ Return clear error messages for invalid deletions

---

## Implementation

### Current Order Schema

```prisma
model Order {
  id              String   @id @default(cuid())
  orderNumber     String   @unique
  customerEmail   String
  customerName    String
  customerPhone   String
  status          String   @default("pending")  // pending, paid, shipped, delivered, cancelled
  paymentStatus   String   @default("unpaid")   // unpaid, paid, refunded
  paymentMethod   String   // cod, stripe, etc.
  total           Float
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  // ... other fields
  
  items OrderItem[]
  
  @@map("orders")
}
```

### Deletable Order Statuses
- ✅ `pending` + `unpaid` → **CAN DELETE**
- ❌ `paid` → **CANNOT DELETE** (payment processed)
- ❌ `shipped` → **CANNOT DELETE** (already in transit)
- ❌ `delivered` → **CANNOT DELETE** (already completed)
- ❌ `cancelled` → **CANNOT DELETE** (already cancelled)

---

## Mobile App Error Handling

The mobile app expects these response formats:

### Success Response
```json
{
  "success": true,
  "message": "Order deleted successfully"
}
```

### Error Response - Cannot Delete
```json
{
  "success": false,
  "error": "Cannot delete paid orders"
}
```

### Error Response - Not Found
```json
{
  "success": false,
  "error": "Order not found"
}
```

### Error Response - Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized - This order does not belong to you"
}
```

---

## Security Considerations

1. **Authentication Required**
   - Must provide valid `x-api-key` header
   - Must provide valid JWT token in `Authorization: Bearer <token>` header

2. **Authorization Check**
   - Verify order's `customerEmail` matches authenticated user's email
   - Prevent users from deleting other users' orders

3. **Status Validation**
   - Only allow deletion of `pending` + `unpaid` orders
   - Prevent deletion of orders that have financial implications

4. **Audit Trail** (Optional but Recommended)
   - Instead of hard delete, consider soft delete (set status to 'DELETED')
   - Keeps order history for admin review
   - Can be purged later by admin

---

## Next Steps

1. **Create** `app/api/mobile/orders/[id]/route.ts` with DELETE method
2. **Test** the endpoint with the mobile app
3. **Verify** security checks work correctly
4. **Deploy** to production

---

## Questions to Answer

1. **Hard Delete vs Soft Delete?**
   - Hard Delete: Permanently removes order from database
   - Soft Delete: Sets status to 'DELETED' (recommended for audit trail)

2. **Delete Order Items?**
   - If hard delete, should delete associated `OrderItem` records
   - Prisma cascade delete might handle this automatically

3. **Send Email Notification?**
   - Should admin receive notification when user deletes an order?
   - Should user receive confirmation email?

---

## Status

🔴 **BLOCKING MOBILE APP**: The DELETE endpoint must be created before the mobile app's delete feature works.

**Priority:** HIGH - User cannot delete orders in mobile app until this is implemented.
