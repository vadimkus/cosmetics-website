# Email & Orders System Changelog

## Version 2.1.0 - Orders Page Unified Format (January 26, 2026)

### New Features

#### Orders Page Redesign
The customer-facing Orders page (`app/orders/page.tsx`) now matches the email template format:

1. **Red header banner** with order number in monospace font
2. **ITEMS section** with:
   - Product names in UPPERCASE bold
   - Qty line with discount labels `(50% OFF)`, `(15% OFF - Bundle Discount)`
   - Prices on right (or `FREE` in green for free items)
   - Size/color variants displayed
3. **Summary section** with:
   - `Subtotal: (X items)` with count
   - `+ Y free masks` notation
   - Shipping with truck icon - `FREE` in green
   - VAT (5%) amount
   - Yellow "All prices include 5% VAT" notice
   - Bold black divider line
   - Total in bold red

### Database Changes

**New field added to Order model:**
```prisma
discountPercentage Float?  // User's discount % at time of order
```

**Migration:** Run `npx prisma db push` to sync schema.

### Discount Label Logic

Priority for determining discount percentage:
1. **Stored `order.discountPercentage`** - For new orders
2. **User's current `discountPercentage`** - Fallback for old orders

This ensures old orders (created before the field existed) still display the correct discount label.

### Files Changed

| File | Changes |
|------|---------|
| `prisma/schema.prisma` | Added `discountPercentage` to Order model |
| `lib/orderStorageDb.ts` | Added `discountPercentage` to OrderData interface, addOrder(), readOrders() |
| `app/orders/page.tsx` | Complete redesign of expanded order view |
| `app/api/orders/cod-confirmation/route.ts` | Save discountPercentage to database |
| `app/api/orders/support-link/route.ts` | Save discountPercentage to database |
| `app/api/stripe/create-checkout-session/route.ts` | Save discountPercentage to database |

### Bug Fixes

1. **Fixed discount showing wrong percentage** - Was calculating blended average (11%) instead of actual user discount (50%)
2. **Fixed orders not loading** - Query failed when `discountPercentage` column was missing from database
3. **Fixed old orders** - Fallback to user's current discount for historical orders

---

## Version 2.0.0 - Unified Format (January 2026)

### Breaking Changes

- **Item prices now show discounted amounts** instead of original prices
- **Removed separate "Discount" line** from summary section
- Discount information now shown per-item via labels

### New Features

#### Unified Template Format
All email templates (COD, Stripe, Support-Link, Admin) now use consistent formatting:

1. **Items display discounted prices** (what customer pays)
2. **Free items show "FREE"** in green instead of AED 0.00
3. **Discount labels** appear below quantity line:
   - User discounts: `(50% OFF)`
   - Bundle discounts: `(15% OFF - Bundle Discount)`
   - Free items: no label
4. **Summary section** shows:
   - `Subtotal: (X items)` with discounted total
   - `+ Y free masks` on separate line if applicable
   - `🚚 Shipping to [Emirate]` with FREE in green if zero
   - `VAT (5%)` amount
   - Yellow info box: "All prices include 5% VAT"
5. **Total in bold red** color for visual emphasis

#### Accurate Item Counting
- Paid items counted separately from free items
- Summary shows "(X items)" for paid items
- Free items noted as "+ Y free masks"

### Bug Fixes

1. **Fixed bundle discount labels** - Bundles now correctly show "15% OFF - Bundle Discount"
2. **Fixed free item labels** - Free masks no longer show user discount percentage
3. **Fixed admin template** - Now uses same unified format as customer templates
4. **Fixed discount calculation** - `discountAmount` properly stored in database

### Technical Changes

#### `lib/email.ts`

**`generateCODOrderHTML()`**
- Removed `itemsWithOriginalPrices` calculation
- Added `paidItems` and `freeItems` filtering
- Added `paidItemCount` and `freeItemCount` calculations
- Updated `itemsHTML` to show discounted prices and discount labels
- Updated summary to show item counts and "All prices include 5% VAT" notice
- Changed Total styling to red (#dc2626)

**`emailTemplates.orderConfirmation()`**
- Same changes as COD template

**`generateSupportLinkOrderHTML()`**
- Same changes as COD template

**`emailTemplates.adminNewOrder()`**
- Updated items section to show discounted prices
- Added FREE styling for free items
- Updated summary section format
- Added "All prices include 5% VAT" notice
- Changed Total styling to red

#### API Routes

**`app/api/orders/cod-confirmation/route.ts`**
- Added `discountLabel` calculation per item
- Added item type detection (free, bundle, regular)

**`app/api/webhooks/stripe/route.ts`**
- Added `discountLabel` calculation per item
- Added item type detection (free, bundle, regular)

**`app/api/orders/support-link/route.ts`**
- Added `discountLabel` calculation per item
- Added item type detection (free, bundle, regular)

### Migration Notes

No database migrations required. Changes are purely presentational in email templates.

---

## Version 1.5.0 - Discount Support (January 2026)

### Features Added

1. **User discount tracking** - Users can have personal discount percentages
2. **Discount display in emails** - Shows discount percentage and amount saved
3. **Admin discount visibility** - Admin notifications include discount information
4. **Database recording** - `discountAmount` and `discountPercentage` stored in orders

### Technical Changes

- Added `discountPercentage` and `discountAmount` to `OrderHTMLData` interface
- Added `discountLabel` and `originalPrice` to `OrderHTMLItem` interface
- Updated all email sending functions to accept discount parameters

---

## Version 1.0.0 - Initial Release

### Features

- Basic order confirmation emails
- Multi-language support (EN, AR, RU)
- RTL support for Arabic
- Apple-style minimalist design
- Admin new order notifications
