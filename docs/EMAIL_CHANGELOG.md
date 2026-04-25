# Email & Orders System Changelog

## Version 3.0.2 - Newsletter welcome email delivery on Vercel (April 25, 2026)

### Summary

Subscribers who completed the homepage newsletter form saw *"Thanks — check your inbox for a welcome email"* but **received no message**. The database row was created; SMTP never ran reliably.

### Root cause

`POST /api/newsletter/subscribe` called `sendNewsletterWelcomeEmail` as a detached promise and immediately returned `NextResponse.json`. On Vercel serverless, the execution context ends when the response is finalized, so the Gmail send was **dropped before completion**.

### Fix

Schedule the welcome send with Next.js 16 **`after()`** from `next/server` (same pattern as registration, checkout, and admin newsletter batch sends). Log `messageId` on success and `error` on failure for Vercel log correlation.

### Files modified

| File | Change |
|------|--------|
| `app/api/newsletter/subscribe/route.ts` | `after()` wrapper + structured logging |

### Reference

- [SESSION_CHANGES_2026-04-25_NEWSLETTER_WELCOME_EMAIL_FIX.md](./SESSION_CHANGES_2026-04-25_NEWSLETTER_WELCOME_EMAIL_FIX.md)
- [NEWSLETTER_SYSTEM.md](./NEWSLETTER_SYSTEM.md) §3.2–3.3

---

## Version 3.0.1 - Single Discount Display (February 13, 2026)

### Summary

Fixed duplicate discount display in order confirmation emails. Previously, VIP and bundle discounts showed both `(50% OFF)` in green text and `-50% VIP` (or `-20% Bundle`) as a badge — redundant. Now only one is shown: the badge when present, otherwise the generic `(XX% OFF)` text.

### Problem

For VIP customers, order confirmation emails (customer + admin) displayed:
1. Green text: `(50% OFF)`
2. Purple badge: `-50% VIP`

Both conveyed the same discount, causing visual clutter.

### Fix Applied

**Logic change:** Show the discount badge (VIP, Bundle, or Box) when available; otherwise show the generic `(XX% OFF)` text. Never both.

| Scenario | Before | After |
|----------|--------|-------|
| VIP discount | `(50% OFF)` + `-50% VIP` | `-50% VIP` only |
| Bundle discount | `(15% OFF)` + `-15% Bundle` | `-15% Bundle` only |
| Beauty Box | `(15% OFF)` + `-15% Box` | `-15% Box` only |
| Other discount (no badge) | `(XX% OFF)` | `(XX% OFF)` (unchanged) |

### Files Modified

| File | Location | Change |
|------|----------|--------|
| `lib/email/htmlGenerators.ts` | `renderEnhancedItemRows()` | Badge takes priority; `(XX% OFF)` only when no badge |
| `lib/email/templates.ts` | COD order confirmation item renderer | Same logic |
| `lib/email/templates.ts` | Admin new order item renderer | Same logic |

### Affected Emails

- COD order confirmation (customer)
- Stripe order confirmation (customer)
- Support-link order confirmation (customer)
- Admin new order notification

### Deployment

Vercel auto-deploy on push to main. No database or config changes.

---

## Version 3.0.0 - Enhanced Per-Item Breakdown with Product Images (February 6, 2026)

### Summary

Major upgrade to all email templates and the order success page. Every item now displays a product image, per-item price breakdown with original price strikethrough, combined discount percentage, and colored discount badges — matching a unified visual format across all customer-facing surfaces.

### What Changed

#### New: Shared Item Renderer (`renderEnhancedItemRows()`)
- Created in `lib/email/htmlGenerators.ts` as a single source of truth for item rendering
- Used by all 3 HTML generators: COD, Support-Link, Stripe
- Generates consistent per-item rows matching the success page layout

#### Per-Item Format (All Templates)

Each item now shows:
1. **Product image** (56×56px, rounded, light gray background)
2. **Product name** (uppercase, bold)
3. **Detail line**: "Quantity: 1 • 180ml" (qty + size/color combined)
4. **Combined discount %**: "(60% OFF)" in green
5. **Discount badges**: purple "-50% VIP" and/or green "-20% Bundle"
6. **Price**: original strikethrough + discounted in green (or "FREE")

#### Files Modified

| File | Changes |
|------|---------|
| `lib/email/htmlGenerators.ts` | Added `renderEnhancedItemRows()` shared function; refactored all 3 generators to use it |
| `lib/email/templates.ts` | Updated `orderConfirmation` item format (image + badges + strikethrough); updated `adminNewOrder` item format (image + badges + 3-col table) |
| `lib/email/statusUpdate.ts` | Updated shipped/delivered email items with image + improved layout |
| `app/success/SuccessClient.tsx` | Restored product images; redesigned item layout to flex with image + detail + price |

#### Localization

- Item rendering is fully localized for EN, AR (RTL), RU
- "Quantity" label translates to "Количество" (RU) / "الكمية" (AR)
- "FREE" label translates to "БЕСПЛАТНО" (RU) / "مجاني" (AR)
- RTL padding and alignment handled automatically

#### Admin Email Changes
- Reduced from 4 columns (Product, Qty, Price, Total) to 3 columns (Product, Qty, Total)
- Product column now includes image, name, size/color, discount %, badges
- Total column shows strikethrough original + green discounted price

---

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

## Version 1.7.0 - Mobile Route Discount Parity (February 6, 2026)

### Fixes

1. **Mobile COD emails now include bundle discount fields** - `bundleDiscountPercentage` and `bundleDiscountAmount` passed to both customer and admin email functions for template consistency
2. **Mobile COD admin notifications** now pass bundle discount fields
3. **`discountPercentage` stored for all mobile orders** - Previously missing from mobile COD, Stripe, and Apple Pay routes; now stored in DB so emails can display "VIP X% OFF" waterfall line

### Technical Changes

- `app/api/mobile/orders/route.ts` - Email calls now pass `bundleDiscountPercentage` and `bundleDiscountAmount`
- All 3 mobile order creation routes now store `discountPercentage` in the Order record

---

## Version 1.6.0 - Bundle Discount Waterfall & Cross-Route Consistency (February 5, 2026)

### Features Added

1. **Waterfall discount display** in all emails - Shows sequential breakdown: Retail → VIP Discount → Bundle Discount → Net Subtotal
2. **Bundle discount support in COD and Support-Link routes** - Two-step reverse calculation to derive both user and bundle discount amounts from already-discounted frontend prices
3. **Stripe webhook bundle discount passthrough** - `OrderWithItems` interface extended; bundle discount data now flows from DB to confirmation emails

### Fixes

1. **COD route** - Previously couldn't calculate bundle discount amounts (didn't receive bundle data from frontend)
2. **Support-Link route** - Same issue; now mirrors the Stripe route's correct two-step reverse-calculation
3. **Stripe webhook** - Confirmation emails now include bundle discount waterfall lines
4. **Frontend payloads** - `CheckoutClient.tsx` now sends `bundleDiscountPercentage`, `bundleDiscountAmount`, and item-level `fromBundle`/`bundleDiscountPercent` to all backend routes

### Technical Changes

- Centralized discount exclusion rules via `lib/mobileDiscountRules.ts` (single source of truth)
- Centralized shipping/VAT via `lib/mobileCheckoutConfig.ts` (single source of truth)
- All email types (`OrderConfirmationEmailData`, `AdminNewOrderEmailData`, `OrderHTMLData`) support `bundleDiscountPercentage` and `bundleDiscountAmount`

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
