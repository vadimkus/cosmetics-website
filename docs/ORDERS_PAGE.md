# Orders Page Documentation

## Overview

The Orders page (`app/orders/page.tsx`) displays customer order history with a unified format matching the email templates. It works across desktop, PWA, and mobile web.

## Features

- Expandable order cards with chevron toggle
- Red header banner with order number
- Unified item display format
- Discount labels per item
- Free item handling
- Summary with item counts
- Delivery information
- Payment method display
- Quick reorder functionality
- WhatsApp support integration

## Unified Order Display Format

When expanded, each order displays in this format:

```
┌─────────────────────────────────────────────────┐
│ Order  #  GEN2601254914          (red header)   │
├─────────────────────────────────────────────────┤
│ ITEMS:                                          │
│                                                 │
│ ALL FOR SENSITIVE SERUM          AED 165.00    │
│ Qty: 1  (50% OFF)                              │
│ Size: 30ml                                      │
│                                                 │
│ ANTI-AGING BEAUTY BOX           AED 1181.50    │
│ Qty: 1  (15% OFF - Bundle Discount)            │
│ Size: 1 kit                                     │
│                                                 │
│ SOOTHING BOMB SEA ALGAE MASK         FREE      │
│ Qty: 1                                          │
│ Size: 23g                                       │
│─────────────────────────────────────────────────│
│ Subtotal: (2 items)              AED 1346.50   │
│ + 2 free masks                                  │
│                                                 │
│ 🚚 Shipping to Dubai                  FREE     │
│ VAT (5%)                          AED 64.12    │
│ ┌─────────────────────────────────────────┐    │
│ │    All prices include 5% VAT           │    │
│ └─────────────────────────────────────────┘    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Total:                        AED 1346.50      │
│                                  (red)         │
└─────────────────────────────────────────────────┘
```

## Discount Label Logic

The discount label is determined using this priority:

```typescript
// Priority order for discount percentage:
// 1. Stored order.discountPercentage (for new orders)
// 2. User's current discountPercentage (for old orders)

if (isFreeItem) {
  // No discount label for free items
  discountLabel = ''
} else if (isBundle) {
  // Fixed 15% for bundles
  discountLabel = '(15% OFF - Bundle Discount)'
} else if (order.discountAmount > 0) {
  // Only show if discount was actually applied
  if (order.discountPercentage > 0) {
    discountLabel = `(${order.discountPercentage}% OFF)`
  } else if (user?.discountPercentage > 0) {
    // Fallback for old orders
    discountLabel = `(${user.discountPercentage}% OFF)`
  }
}
```

### Why the Fallback?

Orders created before the `discountPercentage` field was added to the database have `null` for this field. The fallback uses the user's current discount percentage from their profile to display the correct label for these historical orders.

## Database Schema

The Order model includes discount fields:

```prisma
model Order {
  // ... other fields
  subtotal           Float
  discountPercentage Float?    // User's discount % at time of order
  discountAmount     Float     @default(0)
  // ... other fields
}
```

## Item Detection

### Free Items
```typescript
const isFreeItem = Number(item.price) === 0 || 
                   item.productName.toLowerCase().includes('(free)')
```

### Bundle Items
```typescript
const isBundle = item.productName.toLowerCase().includes('beauty box') || 
                 item.productName.toLowerCase().includes('bundle')
```

## Summary Section

The summary calculates:

```typescript
// Paid items (exclude free)
const paidItems = order.items.filter(item => 
  Number(item.price) > 0 && !item.productName.toLowerCase().includes('(free)')
)

// Free items
const freeItems = order.items.filter(item => 
  Number(item.price) === 0 || item.productName.toLowerCase().includes('(free)')
)

// Counts
const paidItemCount = paidItems.reduce((sum, item) => sum + item.quantity, 0)
const freeItemCount = freeItems.reduce((sum, item) => sum + item.quantity, 0)
```

## Styling

### Colors
| Element | Color | Tailwind Class |
|---------|-------|----------------|
| Order header | Red | `bg-red-600` |
| Discount labels | Green | `text-green-600` |
| Free price | Green | `text-green-600` |
| Shipping FREE | Green | `text-green-600` |
| Total amount | Red | `text-red-600` |
| VAT notice | Amber | `bg-amber-50 text-amber-700` |

### Typography
- Product names: `font-bold uppercase tracking-wide`
- Quantities: `text-xs text-gray-500`
- Prices: `font-medium`
- Total: `font-bold text-lg`

## Localization

Supports three locales:
- `en` - English (default)
- `ar` - Arabic (RTL)
- `ru` - Russian

RTL support:
```typescript
const isRTL = dir === 'rtl'
// Flex direction reverses for RTL
className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}
```

## Related Files

| File | Purpose |
|------|---------|
| `app/orders/page.tsx` | Main orders page component |
| `lib/orderStorageDb.ts` | Database operations for orders |
| `components/AuthProvider.tsx` | User auth context with discountPercentage |
| `prisma/schema.prisma` | Order model definition |

## API Endpoints

### Fetch Orders
```
GET /api/orders?email={email}&contactEmail={contactEmail}
```

Returns orders for the specified email(s).

### Cancel Order
```
POST /api/orders/{orderId}/cancel
```

Cancels a pending order.

## Troubleshooting

### Orders Not Loading

1. Check database connection
2. Verify Prisma schema is synced: `npx prisma db push`
3. Check Vercel logs for errors

### Discount Shows Wrong Percentage

1. Check if `order.discountPercentage` is stored
2. Verify user's `discountPercentage` in database
3. Ensure order has `discountAmount > 0`

### Free Items Showing Discount

Free items should never show discount labels. Check the `isFreeItem` detection logic.
