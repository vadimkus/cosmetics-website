# Pricing & Discount Calculation Audit

> **Date**: February 6, 2026
> **Scope**: Full audit of pricing logic across all checkout channels (Web Desktop, Mobile Web, Native Mobile App)
> **Status**: All issues identified and fixed

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Discount Types](#discount-types)
3. [Discount Exclusion Rules](#discount-exclusion-rules)
4. [Single Sources of Truth](#single-sources-of-truth)
5. [Web Checkout Flow (Desktop + Mobile Web)](#web-checkout-flow)
6. [Native Mobile App Flow](#native-mobile-app-flow)
7. [Email & Notification Consistency](#email--notification-consistency)
8. [Audit Findings & Fixes](#audit-findings--fixes)
9. [Calculation Logic Reference](#calculation-logic-reference)
10. [Database Schema](#database-schema)
11. [Testing Checklist](#testing-checklist)

---

## Architecture Overview

Orders can be placed through **three channels**, all writing to the same database and using the same email templates:

```
┌─────────────────────────────────────────────────────────────┐
│                     CHECKOUT CHANNELS                       │
├─────────────────┬───────────────────┬───────────────────────┤
│  Desktop Web    │  Mobile Web       │  Native Mobile App    │
│  (Chrome, etc.) │  (Safari/Chrome   │  (iOS/Android app)    │
│                 │   on phone)       │                       │
├─────────────────┴───────────────────┴───────────────────────┤
│                                                             │
│  Desktop + Mobile Web share the SAME routes:                │
│  ┌─────────────────────────────────────────────┐            │
│  │  CheckoutClient.tsx (frontend)              │            │
│  │  ├─ /api/orders/cod-confirmation   (COD)    │            │
│  │  ├─ /api/orders/support-link       (Link)   │            │
│  │  ├─ /api/stripe/create-payment-intent       │            │
│  │  └─ /api/webhooks/stripe           (confirm)│            │
│  └─────────────────────────────────────────────┘            │
│                                                             │
│  Native Mobile App uses SEPARATE routes:                    │
│  ┌─────────────────────────────────────────────┐            │
│  │  React Native app (frontend)                │            │
│  │  ├─ /api/mobile/orders             (COD)    │            │
│  │  ├─ /api/mobile/checkout/stripe    (Card)   │            │
│  │  ├─ /api/mobile/payments/applepay  (Apple)  │            │
│  │  └─ /api/webhooks/stripe           (confirm)│            │
│  └─────────────────────────────────────────────┘            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    SHARED INFRASTRUCTURE                    │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ Prisma   │  │ Email        │  │ Stripe             │    │
│  │ Database │  │ Templates    │  │ Webhooks           │    │
│  └──────────┘  └──────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Key Principle: Mobile Web = Desktop Web

Users on Safari/Chrome on their phone visit `genosys.ae` and use the **exact same** `CheckoutClient.tsx` component and web API routes as desktop users. The responsive design handles layout differences, but the pricing logic is identical.

---

## Discount Types

### 1. User (VIP) Discount

- **Stored in**: `User.discountPercentage` (e.g., `50` for 50% off)
- **Applied to**: All eligible products (see exclusions below)
- **When**: Applied first, before bundle discount

### 2. Bundle Discount (Web only)

- **Source**: Bundle Builder feature (`/bundle-builder`)
- **Tiers**: 2 items = 5%, 3 = 10%, 4 = 15%, 5+ = 20%
- **Applied to**: Items added via Bundle Builder
- **When**: Applied second, after user discount (sequential/waterfall)
- **Native app**: Not currently supported (no Bundle Builder in native app)

### 3. Black Friday Discount

- **Stored in**: `lib/blackFridayUtils.ts`
- **Applied**: Only when active, as an alternative to user discount
- **Exclusions**: Same rules as user discount

---

## Discount Exclusion Rules

The following products are **excluded from user/VIP discounts**:

| Product Category | Examples | Reason |
|-----------------|----------|--------|
| **Beauty Boxes** | Any product with category "beauty boxes" or name containing "beauty box" | Already bundled at a discount |
| **Devices** | GenoLED, Hair Gentron, HairGen Booster | High-value hardware items |
| **Hydro Cool Modelling Mask** | Name containing "hydro", "cool", and "mask" | Special pricing |
| **noDiscount products** | Any product with `noDiscount: true` | Explicitly excluded |

### Single Source of Truth

All exclusion logic is centralized in:

```
lib/mobileDiscountRules.ts
```

This file exports:
- `isUserDiscountExcludedProduct(product)` - main exclusion check
- `isBeautyBoxProduct(product)` - beauty box detection
- `isDeviceProduct(product)` - device detection
- `isHydroCoolMask(product)` - hydro cool mask detection

**Consumed by**:
- `lib/discountUtils.ts` (frontend `calculateDiscountedPrice`)
- `app/api/mobile/orders/route.ts` (native app COD)
- `app/api/mobile/checkout/stripe/route.ts` (native app Stripe)
- `app/api/mobile/payments/applepay/intent/route.ts` (native app Apple Pay)
- `app/api/orders/cod-confirmation/route.ts` (web COD)
- `app/api/orders/support-link/route.ts` (web support link)

---

## Single Sources of Truth

| Concern | File | Used By |
|---------|------|---------|
| **Discount exclusions** | `lib/mobileDiscountRules.ts` | All frontend + backend routes |
| **Shipping rates & VAT** | `lib/mobileCheckoutConfig.ts` | All checkout routes, `CheckoutClient.tsx` |
| **Email types** | `lib/email/types.ts` | All email senders |
| **Order number format** | `lib/orderNumber.ts` | All order creation routes |

### Shipping Configuration (`lib/mobileCheckoutConfig.ts`)

```typescript
{
  currency: 'AED',
  vatRate: 0.05,              // 5% UAE VAT (included in prices)
  freeShippingThreshold: 1000, // Free shipping over AED 1000
  emirates: [
    { name: 'Dubai', shippingCost: 45 },
    { name: 'Abu Dhabi', shippingCost: 70 },
    { name: 'Sharjah', shippingCost: 70 },
    // ... all 7 emirates
  ]
}
```

Exported functions:
- `calculateMobileShipping(subtotal, emirate)` - returns shipping cost (0 if above threshold)
- `calculateVatIncluded(total)` - extracts VAT portion from total (VAT is **included** in prices)

---

## Web Checkout Flow

### Frontend Price Calculation

1. **`lib/discountUtils.ts` → `calculateDiscountedPrice(product, user)`**
   - Checks exclusion via `isUserDiscountExcludedProduct(product)`
   - Applies user discount percentage if eligible
   - Returns `{ originalPrice, discountedPrice, discountAmount, discountPercentage, hasDiscount }`

2. **`lib/cartStore.ts` → `getTotalPrice(user)`**
   - For each cart item: gets discounted price, then applies bundle discount if applicable
   - Accumulates into subtotal
   - Bundle discount is applied **sequentially** on top of user discount

3. **`CheckoutClient.tsx`**
   - Calculates shipping via `calculateMobileShipping(subtotal, emirate)`
   - Calculates VAT via `calculateVatIncluded(total)`
   - Sends item-level `bundleDiscount` percentage to backend

### Backend Calculation (Web Routes)

**COD** (`/api/orders/cod-confirmation`) and **Support-Link** (`/api/orders/support-link`):
- Frontend sends **already-discounted prices** per item
- Backend performs **two-step reverse calculation** to derive discount amounts:

```
Step 1: Reverse bundle discount → price after user discount only
  priceBeforeBundleDiscount = itemPrice / (1 - bundleDiscount/100)

Step 2: Reverse user discount → original list price
  originalPrice = priceBeforeBundleDiscount / (1 - userDiscount/100)
```

**Stripe** (`/api/stripe/create-payment-intent`):
- Same two-step reverse calculation
- Item-level `fromBundle` and `bundleDiscountPercent` flags enable per-item logic

**Stripe Webhook** (`/api/webhooks/stripe`):
- Reads `discountPercentage`, `bundleDiscountPercentage`, `bundleDiscountAmount` from stored order
- Passes to email templates for waterfall display

---

## Native Mobile App Flow

### Server-Authoritative Pricing

Unlike the web flow (which sends pre-calculated prices), the native mobile app routes are **server-authoritative**:

1. App sends `productId` + `quantity` for each item
2. Server looks up the product's current price from the database
3. Server applies user discount using the same `isUserDiscountExcludedProduct` rules
4. Server calculates shipping and VAT from shared config

### Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/mobile/orders` | POST | COD order creation |
| `/api/mobile/orders` | GET | Order history (list + detail) |
| `/api/mobile/checkout/stripe` | POST | Stripe checkout session |
| `/api/mobile/payments/applepay/intent` | POST | Apple Pay payment intent |
| `/api/mobile/payments/applepay/status` | POST | Payment status check |

### Server-Side Calculation Pattern (all 3 creation routes)

```typescript
// For each item:
const baseUnit = isPromo ? 0 : Number(variant?.price ?? product.price)
const hasUserDiscount = Number.isFinite(pct) && pct > 0 && pct < 100
const excluded = isUserDiscountExcludedProduct(product)
const discountedUnit = (!isPromo && !excluded && hasUserDiscount)
  ? baseUnit * (1 - pct / 100)
  : baseUnit

// After loop - round to prevent floating-point drift:
subtotal = Math.round(subtotal * 100) / 100
discountAmount = Math.round(discountAmount * 100) / 100

// Shipping & VAT from shared config:
const shipping = calculateMobileShipping(subtotal, emirate)
const total = subtotal + shipping
const vat = calculateVatIncluded(total)
```

### Bundle Discounts in Native App

The native mobile app **does not currently support** customer-built bundles (Bundle Builder is web-only). All three mobile order creation routes include comments noting this. If bundles are added to the mobile app in the future, the calculation must be updated to match the web checkout's sequential discount application.

---

## Email & Notification Consistency

### Waterfall Discount Display

All order confirmation emails (customer + admin) display discounts in a **waterfall** format:

```
Retail Price:               AED 1,200.00
VIP Discount (50%):        -AED   600.00
Subtotal after VIP:         AED   600.00
Bundle Discount (20%):     -AED   120.00
Net Subtotal:               AED   480.00
Shipping:                   AED    45.00
Total (incl. 5% VAT):      AED   525.00
```

### Email Data Flow

All routes pass these fields to `sendOrderConfirmationEmail()` and `sendAdminNewOrderNotification()`:

| Field | Type | Description |
|-------|------|-------------|
| `discountPercentage` | `number?` | User's VIP discount % at time of order |
| `discountAmount` | `number?` | Total VIP discount amount in AED |
| `bundleDiscountPercentage` | `number?` | Bundle discount % (null for non-bundle orders) |
| `bundleDiscountAmount` | `number?` | Total bundle discount amount in AED |

### Email Type Interfaces

Defined in `lib/email/types.ts`:
- `OrderConfirmationEmailData` - customer email
- `AdminNewOrderEmailData` - admin notification
- `OrderHTMLData` - HTML generation for admin dashboard

All three interfaces include `bundleDiscountPercentage` and `bundleDiscountAmount` as optional fields.

---

## Audit Findings & Fixes

### Phase 1: Web Routes (February 5, 2026)

#### Critical Issues Found & Fixed

| # | Route | Issue | Fix |
|---|-------|-------|-----|
| 1 | `/api/orders/cod-confirmation` | No bundle discount handling; incorrect reverse-calculation for bundle items | Implemented two-step reverse calculation matching Stripe route |
| 2 | `/api/orders/support-link` | Same as above | Same fix applied |
| 3 | `/api/webhooks/stripe` | `OrderWithItems` interface missing `bundleDiscountPercentage` and `bundleDiscountAmount` | Extended interface; passed fields to email functions |
| 4 | `CheckoutClient.tsx` | COD/Support-Link payloads missing bundle discount data | Added `bundleDiscountPercentage` and `bundleDiscountAmount` to payloads |
| 5 | `CheckoutClient.tsx` | Stripe items payload missing `fromBundle` and `bundleDiscountPercent` | Added item-level bundle flags |

#### Medium Issues Found & Fixed

| # | Location | Issue | Fix |
|---|----------|-------|-----|
| 6 | `lib/discountUtils.ts` | Discount exclusion logic duplicated (not using shared rules) | Imported `isUserDiscountExcludedProduct` from `mobileDiscountRules.ts` |
| 7 | `CheckoutClient.tsx` | Hardcoded shipping rates and VAT calculation | Replaced with `calculateMobileShipping` and `calculateVatIncluded` from shared config |
| 8 | `CheckoutClient.tsx` | VAT not rounded to 2 decimal places | Added explicit rounding |

### Phase 2: Native Mobile App Routes (February 6, 2026)

#### Issues Found & Fixed

| # | Route | Issue | Fix |
|---|-------|-------|-----|
| 1 | `/api/mobile/orders` (POST) | `discountPercentage` not stored in DB | Now stores `discountPercentage` from user profile |
| 2 | `/api/mobile/orders` (POST) | `discountAmount` and `subtotal` not rounded | Added `Math.round(x * 100) / 100` after accumulation |
| 3 | `/api/mobile/orders` (POST) | Email missing `bundleDiscountPercentage/Amount` | Added to both customer and admin email calls |
| 4 | `/api/mobile/orders` (GET) | Response missing `discountPercentage`, `bundleDiscountPercentage`, `bundleDiscountAmount` | Added all three fields to single-order, list, and POST response formats |
| 5 | `/api/mobile/checkout/stripe` | `discountPercentage` not stored in DB | Added to both CREATE and UPDATE paths |
| 6 | `/api/mobile/checkout/stripe` | `discountAmount` and `serverSubtotal` not rounded | Added rounding |
| 7 | `/api/mobile/payments/applepay/intent` | `discountPercentage` not stored in DB | Added to both CREATE and UPDATE paths |
| 8 | `/api/mobile/payments/applepay/intent` | `discountAmount` and `serverSubtotal` not rounded | Added rounding |

#### Already Correct (No Changes Needed)

| Item | Status |
|------|--------|
| All 3 mobile routes use `isUserDiscountExcludedProduct` from shared rules | Correct |
| All 3 mobile routes use `calculateMobileShipping` and `calculateVatIncluded` | Correct |
| `/api/mobile/payments/applepay/status` (status-only, no pricing) | Correct |
| Promo item detection (price=0, `__PROMO__` marker) | Correct |
| Variant price resolution (size/color) | Correct |

---

## Calculation Logic Reference

### Forward Calculation (Frontend → Display Price)

```
originalPrice = product.price (from DB or variant)

Step 1: Apply user discount (if eligible)
  discountedPrice = originalPrice * (1 - userDiscountPct / 100)

Step 2: Apply bundle discount (if applicable, web only)
  finalPrice = discountedPrice * (1 - bundleDiscountPct / 100)

Step 3: Sum all items
  subtotal = Σ (finalPrice × quantity)

Step 4: Shipping
  shipping = calculateMobileShipping(subtotal, emirate)

Step 5: Total
  total = subtotal + shipping

Step 6: VAT (included in total)
  vat = total * 0.05 / 1.05
```

### Reverse Calculation (Backend → Reconstruct Discount Amounts)

Used by web COD and Support-Link routes where frontend sends already-discounted prices:

```
For bundle items:
  Step 1: priceBeforeBundleDiscount = finalPrice / (1 - bundleDiscountPct / 100)
  Step 2: bundleDiscountAmount += (priceBeforeBundleDiscount - finalPrice) × qty
  Step 3: originalPrice = priceBeforeBundleDiscount / (1 - userDiscountPct / 100)
  Step 4: userDiscountAmount += (originalPrice - priceBeforeBundleDiscount) × qty

For non-bundle items with user discount:
  Step 1: originalPrice = finalPrice / (1 - userDiscountPct / 100)
  Step 2: userDiscountAmount += (originalPrice - finalPrice) × qty
```

### Rounding Strategy

All routes round accumulated values to 2 decimal places before storage:

```typescript
subtotal = Math.round(subtotal * 100) / 100
discountAmount = Math.round(discountAmount * 100) / 100
bundleDiscountAmount = Math.round(bundleDiscountAmount * 100) / 100
```

---

## Database Schema

### Order Model (relevant pricing fields)

```prisma
model Order {
  subtotal                Float
  discountPercentage      Float?    // User's VIP discount % at time of order
  discountAmount          Float     @default(0)
  bundleDiscountPercentage Float?   // Bundle discount % (e.g., 20% for 5+ items)
  bundleDiscountAmount    Float     @default(0)  // Bundle discount amount in AED
  shipping                Float     @default(0)
  vat                     Float
  total                   Float
}
```

### Field Population by Route

| Route | `discountPercentage` | `discountAmount` | `bundleDiscountPercentage` | `bundleDiscountAmount` |
|-------|---------------------|-------------------|---------------------------|------------------------|
| Web COD | Yes | Yes (reversed) | Yes (reversed) | Yes (reversed) |
| Web Support-Link | Yes | Yes (reversed) | Yes (reversed) | Yes (reversed) |
| Web Stripe | Yes | Yes (reversed) | Yes (reversed) | Yes (reversed) |
| Mobile COD | Yes | Yes (server-calc) | null (no bundles) | 0 (default) |
| Mobile Stripe | Yes | Yes (server-calc) | null (no bundles) | 0 (default) |
| Mobile Apple Pay | Yes | Yes (server-calc) | null (no bundles) | 0 (default) |

---

## Testing Checklist

### Web Checkout (Desktop + Mobile Web)

- [ ] COD order with VIP discount shows correct waterfall in email
- [ ] COD order with VIP + bundle discount shows both discount lines
- [ ] Stripe order with VIP discount → confirmation email has waterfall
- [ ] Stripe order with VIP + bundle → both discount lines in email
- [ ] Support-Link order with discounts → correct email
- [ ] Excluded products (GenoLED, Hair Gentron, HairGen, Hydro Cool Mask) get no discount
- [ ] Beauty Box products get no user discount
- [ ] Products with `noDiscount: true` get no discount
- [ ] Order success page shows correct waterfall breakdown
- [ ] Admin notification shows correct discount details

### Native Mobile App

- [ ] COD order with VIP discount → `discountPercentage` stored in DB
- [ ] COD order email shows VIP discount line
- [ ] Stripe order with VIP discount → `discountPercentage` stored in DB
- [ ] Apple Pay order with VIP discount → `discountPercentage` stored in DB
- [ ] Excluded products get no discount in mobile orders
- [ ] GET `/api/mobile/orders` returns `discountPercentage`, `bundleDiscountPercentage`, `bundleDiscountAmount`
- [ ] Subtotal and discountAmount are properly rounded (no 187.4999999 values)

### Cross-Channel Consistency

- [ ] Same product, same user, same quantity → same total regardless of channel
- [ ] Emails from all channels use the same waterfall format
- [ ] Admin dashboard shows consistent discount data for all order sources

---

## Files Modified

### Phase 1 (Web - Feb 5, 2026)

| File | Changes |
|------|---------|
| `app/api/orders/cod-confirmation/route.ts` | Two-step reverse calc, bundle discount support |
| `app/api/orders/support-link/route.ts` | Same as COD |
| `app/api/webhooks/stripe/route.ts` | Extended `OrderWithItems` interface |
| `app/checkout/CheckoutClient.tsx` | Bundle flags in payloads, shared config imports |
| `lib/discountUtils.ts` | Import from shared `mobileDiscountRules.ts` |

### Phase 2 (Mobile - Feb 6, 2026)

| File | Changes |
|------|---------|
| `app/api/mobile/orders/route.ts` | Rounding, `discountPercentage` storage, email fields, GET response fields |
| `app/api/mobile/checkout/stripe/route.ts` | Rounding, `discountPercentage` storage |
| `app/api/mobile/payments/applepay/intent/route.ts` | Rounding, `discountPercentage` storage |

### Shared Libraries (unchanged, already correct)

| File | Purpose |
|------|---------|
| `lib/mobileDiscountRules.ts` | Discount exclusion rules (single source of truth) |
| `lib/mobileCheckoutConfig.ts` | Shipping rates + VAT (single source of truth) |
| `lib/email/types.ts` | Email data interfaces with bundle discount fields |
| `lib/email/senders.ts` | Email sending functions |
| `lib/email/htmlGenerators.ts` | HTML email generation with waterfall display |
| `lib/email/templates.ts` | Email templates with waterfall display |

---

*Last updated: February 6, 2026*
