# Email Templates Documentation

## Overview

This document describes the unified email template system used for order confirmations and notifications across the GENOSYS Professional cosmetics website.

## Template Types

| Template | Recipient | Trigger | File Location |
|----------|-----------|---------|---------------|
| COD Order Confirmation | Customer | Cash on Delivery order placed | `lib/email.ts` → `generateCODOrderHTML()` |
| Stripe Order Confirmation | Customer | Successful Stripe payment | `lib/email.ts` → `emailTemplates.orderConfirmation()` |
| Support-Link Order Confirmation | Customer | Support-link order submitted | `lib/email.ts` → `generateSupportLinkOrderHTML()` |
| Admin New Order Notification | Admin | Any new order created | `lib/email.ts` → `emailTemplates.adminNewOrder()` |

## Unified Format Specification

All templates follow a consistent format for displaying order information:

### Items Section

```
PRODUCT NAME                              AED XXX.XX
Qty: 1  (50% OFF)

BEAUTY BOX                                AED XXX.XX
Qty: 1  (15% OFF - Bundle Discount)

FREE MASK                                 FREE
Qty: 1
```

**Key Rules:**
- Product names are displayed in **UPPERCASE** with bold styling
- Prices shown are **discounted prices** (what the customer actually pays)
- Free items display "FREE" in green instead of "AED 0.00"
- Quantity is shown on a separate line below the product name
- Discount labels appear inline with quantity in green text

### Discount Labels

| Item Type | Discount Label | Example |
|-----------|----------------|---------|
| Regular item with user discount | `(XX% OFF)` | `(50% OFF)` |
| Bundle/Beauty Box | `(15% OFF - Bundle Discount)` | Fixed 15% bundle discount |
| Free promotional item | No label | Free masks show no discount label |

### Summary Section

```
Subtotal: (4 items)                       AED 2763.50
+ 2 free masks
🚚 Shipping to Dubai                      FREE
VAT (5%)                                  AED 131.60
┌─────────────────────────────────────────────────────┐
│         All prices include 5% VAT                   │
└─────────────────────────────────────────────────────┘
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total:                                    AED 2763.50
```

**Key Rules:**
- Subtotal shows count of paid items only
- Free items counted separately with "+ X free masks" notation
- Shipping shows "FREE" in green when zero
- VAT amount displayed without "(incl.)" label
- Yellow info box states "All prices include 5% VAT"
- Total displayed in **bold red** color

## Discount System

### User Discounts

Users can have a personal discount percentage stored in the database:

```typescript
// User model
interface User {
  id: string
  email: string
  discountPercentage?: number  // e.g., 50 for 50% off
  // ...
}
```

### Discount Application Rules

1. **User discounts** apply to regular products only
2. **Bundle discounts** (15%) are fixed and take precedence
3. **Excluded products** (devices, certain items) don't receive user discounts
4. **Free items** have no discount applied

### Discount Calculation Flow

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Cart)                    │
│  - Calculates discounted prices                      │
│  - Applies user discount to eligible items           │
│  - Shows discounted prices to customer               │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                   API Route                          │
│  - Looks up user by email                           │
│  - Determines discount percentage                    │
│  - Calculates discountAmount for record             │
│  - Assigns discountLabel to each item               │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                   Database                           │
│  - Stores order with discountAmount                 │
│  - Stores order with discountPercentage             │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                   Email Template                     │
│  - Displays discounted prices                        │
│  - Shows discount labels per item                    │
│  - Calculates item/free counts for summary          │
└─────────────────────────────────────────────────────┘
```

## API Routes

### COD Orders
**Endpoint:** `POST /api/orders/cod-confirmation`

```typescript
// Key discount handling
const user = await findUserByEmail(customerEmail)
const userDiscountPct = Number(user?.discountPercentage || 0)
const hasUserDiscount = userDiscountPct > 0 && userDiscountPct < 100

// Item mapping with discount labels
items.map(item => {
  const isFreeItem = item.price === 0
  const isBundle = item.name.toLowerCase().includes('beauty box')
  
  if (isFreeItem) {
    discountLabel = undefined
  } else if (isBundle) {
    discountLabel = '15% OFF - Bundle Discount'
  } else if (hasUserDiscount && !isExcluded) {
    discountLabel = `${userDiscountPct}% OFF`
  }
})
```

### Stripe Orders
**Endpoint:** `POST /api/webhooks/stripe`

Same discount handling logic applied in the webhook handler.

### Support-Link Orders
**Endpoint:** `POST /api/orders/support-link`

Same discount handling logic applied.

## Localization

Templates support multiple locales:
- `en` - English (default)
- `ar` - Arabic (RTL support)
- `ru` - Russian

RTL layouts automatically flip text alignment for Arabic.

## Styling

### Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Primary text | Dark gray | `#1d1d1f` |
| Secondary text | Medium gray | `#6b7280` |
| Success/Free | Green | `#34c759` |
| Discount labels | Green | `#34c759` |
| Total amount | Red | `#dc2626` |
| VAT notice background | Amber | `#fef3c7` |
| VAT notice text | Amber | `#d97706` |

### Typography

- Font family: Apple system fonts (`-apple-system, BlinkMacSystemFont, 'SF Pro Text'`)
- Product names: 15px, bold, uppercase
- Quantity/labels: 13px
- Summary labels: 15px
- Total: 18px, bold

## Testing

To test email templates:

1. Create a test order with:
   - A user account with discount percentage set
   - Mix of regular items, bundles, and free masks

2. Verify:
   - Customer receives confirmation email
   - Admin receives notification email
   - All prices show discounted amounts
   - Discount labels appear correctly
   - Free items show "FREE"
   - Summary counts are accurate
   - Total is displayed in red

## Troubleshooting

### Emails Not Sending

Check Vercel logs for:
```
🎟️ COD DISCOUNT DEBUG: {...}
📧 Sending order confirmation email...
```

### Discount Not Applied

1. Verify user exists in database with correct email
2. Check `discountPercentage` field is set
3. Ensure product is not in exclusion list

### Template Rendering Issues

Common causes:
- Missing required fields in order data
- Null/undefined values not handled
- Locale not properly passed

## Related Files

- `lib/email.ts` - All email templates and sending functions
- `lib/mobileDiscountRules.ts` - Discount exclusion rules
- `lib/userStorageDb.ts` - User lookup functions
- `app/api/orders/cod-confirmation/route.ts` - COD order processing
- `app/api/webhooks/stripe/route.ts` - Stripe payment processing
- `app/api/orders/support-link/route.ts` - Support link order processing
