# Email Templates Documentation

> **Last Updated**: February 6, 2026

## Overview

This document describes the unified email template system used for order confirmations and notifications across the GENOSYS Professional cosmetics website. All email templates feature product images, per-item price breakdowns with original price strikethrough, discount badges, and full i18n support (EN, AR, RU).

## Template Types

| Template | Recipient | Trigger | File Location |
|----------|-----------|---------|---------------|
| COD Order Confirmation | Customer | Cash on Delivery order placed | `lib/email/htmlGenerators.ts` → `generateCODOrderHTML()` |
| Stripe Order Confirmation | Customer | Successful Stripe payment | `lib/email/templates.ts` → `emailTemplates.orderConfirmation()` |
| Support-Link Order Confirmation | Customer | Support-link order submitted | `lib/email/htmlGenerators.ts` → `generateSupportLinkOrderHTML()` |
| Stripe Payment Confirmed | Customer | Stripe webhook confirms payment | `lib/email/htmlGenerators.ts` → `generateStripePaymentConfirmationHTML()` |
| Admin New Order Notification | Admin | Any new order created | `lib/email/templates.ts` → `emailTemplates.adminNewOrder()` |
| Order Status Update | Customer | Order shipped/delivered | `lib/email/statusUpdate.ts` |

## Architecture

```
lib/email/
├── types.ts              # TypeScript interfaces (OrderConfirmationEmailData, AdminNewOrderEmailData, OrderHTMLData, OrderHTMLItem)
├── utils.ts              # Shared utilities (loadEmailTranslations, LOGO_URL, getTrackOrderUrl)
├── htmlGenerators.ts     # COD, Support-Link, Stripe HTML generators + shared renderEnhancedItemRows()
├── templates.ts          # Stripe orderConfirmation + adminNewOrder templates
├── statusUpdate.ts       # Order status update emails (shipped, delivered)
└── index.ts              # Re-exports
```

### Shared Item Renderer

All email templates use a shared `renderEnhancedItemRows()` function (in `htmlGenerators.ts`) that generates consistent per-item HTML matching the success page layout. This ensures a single source of truth for item formatting.

## Unified Item Format (Per-Line Breakdown)

Each order item in every email template now displays:

```
┌───────┬──────────────────────────────────┬─────────────┐
│ IMAGE │  PRODUCT NAME (UPPERCASE, BOLD)  │  AED 330.00 │ ← strikethrough original
│ 56×56 │  Quantity: 1 • 180ml             │  AED 132.00 │ ← green discounted price
│       │  (60% OFF)                       │             │ ← green combined discount %
│       │  [-50% VIP] [-20% Bundle]        │             │ ← colored discount badges
└───────┴──────────────────────────────────┴─────────────┘
```

**Key Rules:**
- **Product image**: 56×56px rounded thumbnail (absolute URL using `SITE_URL`)
- **Product name**: UPPERCASE, bold, 14px
- **Detail line**: "Quantity: X • size • color" combined on one line
- **Combined discount %**: "(60% OFF)" in green - computed from original vs final price
- **Discount badges**: Purple `-50% VIP` and/or green `-20% Bundle` pill badges
- **Price column**:
  - Original price struck through (gray) if discounted
  - Final price in bold green below
  - "FREE" label for free items
- Prices are **per-item totals** (price × quantity)
- All text is localized for EN, AR (RTL), RU

### Price Calculation (Reverse)

Email templates reverse-calculate the original price from the stored discounted price:

```
originalPrice = item.price / (1 - userDiscountPct/100) / (1 - bundleDiscountPct/100)
```

This uses `order.discountPercentage` and `order.bundleDiscountPercentage` passed from the API routes.

### Discount Badges

| Badge | Color | Condition |
|-------|-------|-----------|
| `-50% VIP` | Purple (`#9333ea` on `#f3e8ff`) | User has VIP discount |
| `-20% Bundle` | Green (`#16a34a` on `#dcfce7`) | Order has bundle discount |
| `FREE` | Green (`#16a34a`) | Item price is 0 or name contains "(free)" |

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
