# Email System Changelog

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
