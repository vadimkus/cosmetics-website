# Embedded Stripe Checkout with Bottom Sheet

**Date:** February 5, 2026  
**Status:** Implemented and deployed

## Overview

Replaced the Stripe hosted checkout redirect with an embedded payment experience using a bottom sheet modal. Users now stay on the checkout page while entering payment details, providing a more seamless checkout experience.

## Previous Flow (Hosted Checkout)

1. User clicks "Complete Order"
2. Browser redirects to Stripe's hosted checkout page
3. User enters payment details on Stripe's domain
4. Browser redirects back to success/cancel page

## New Flow (Embedded Checkout)

1. User clicks "Complete Order"
2. Bottom sheet slides up from below (75% height on mobile, 65% on desktop)
3. User enters payment details in embedded Payment Element
4. On success, sheet closes and redirects to success page
5. Original checkout page remains visible behind semi-transparent overlay

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CheckoutClient.tsx                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Click "Complete Order" (Stripe)                         ││
│  │         │                                               ││
│  │         ▼                                               ││
│  │ POST /api/stripe/create-payment-intent                  ││
│  │         │                                               ││
│  │         ▼                                               ││
│  │ Receive clientSecret + orderId + total                  ││
│  │         │                                               ││
│  │         ▼                                               ││
│  │ Open BottomSheet with StripeProvider + PaymentForm      ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      BottomSheet                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   StripeProvider                        ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │                  PaymentForm                        │││
│  │  │  - Order summary (order #, total)                   │││
│  │  │  - Stripe PaymentElement (Card, Apple Pay, Link)    │││
│  │  │  - "Pay AED X.XX" button                            │││
│  │  │  - Security badge                                   │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Files Created

### 1. `components/ui/BottomSheet.tsx`

Reusable bottom sheet modal component with:
- Slide-up animation from bottom
- Semi-transparent backdrop overlay
- Configurable height: `auto`, `medium`, `large`, `full`
- Close on backdrop click or Escape key
- Drag handle indicator
- Higher z-index (z-[60]) to cover chat widget

```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Secure Payment"
  height="large"
>
  {children}
</BottomSheet>
```

### 2. `components/stripe/StripeProvider.tsx`

Stripe Elements wrapper with:
- Lazy loading of Stripe.js
- Custom appearance theming matching site design
- Locale support (English/Arabic)
- Loading spinner while Stripe initializes

```tsx
<StripeProvider clientSecret={clientSecret} locale="en">
  <PaymentForm ... />
</StripeProvider>
```

### 3. `components/stripe/PaymentForm.tsx`

Payment form using Stripe Payment Element:
- Order summary display (order number, total)
- Payment Element with Card, Apple Pay, Link options
- Error message display
- Loading states for processing
- RTL support for Arabic
- Security badge

### 4. `app/api/stripe/create-payment-intent/route.ts`

New API endpoint that:
- Creates Stripe PaymentIntent (instead of Checkout Session)
- Handles CSRF protection
- Calculates totals, shipping, VAT
- Creates order in database with PENDING status
- Returns `clientSecret`, `orderId`, `total`
- Includes duplicate order detection

## Files Modified

### 1. `lib/stripe.ts`

Added `createPaymentIntent` helper function:

```typescript
export async function createPaymentIntent(params: {
  amount: number
  customerEmail: string
  customerName: string
  customerPhone: string
  customerEmirate: string
  orderNumber: string
  locale: string
  description?: string
}): Promise<Stripe.PaymentIntent>
```

### 2. `app/checkout/CheckoutClient.tsx`

- Added imports for BottomSheet, StripeProvider, PaymentForm
- Added state variables: `isPaymentSheetOpen`, `paymentClientSecret`, `paymentOrderId`, `paymentTotal`
- Modified Stripe payment flow to open bottom sheet instead of redirecting
- Added BottomSheet component with payment form at end of JSX

### 3. `app/checkout/success/StripeSuccessClient.tsx`

- Now handles both `session_id` (hosted checkout) and `payment_intent` (embedded checkout)
- Added `paymentIntentId` and `orderId` from search params
- Updated API call to include payment_intent parameter

### 4. `app/api/stripe/payment-status/route.ts`

- Added support for `payment_intent` query parameter
- Added `handlePaymentIntentStatus()` function
- Maps PaymentIntent statuses to order statuses
- Maintains backward compatibility with session_id

### 5. `app/api/stripe/create-checkout-session/route.ts`

- Fixed bug: duplicate order detection now retrieves and returns the session URL
- Previously returned sessionId without URL, causing "No checkout URL received" error

## Dependencies Added

```json
{
  "@stripe/stripe-js": "^latest",
  "@stripe/react-stripe-js": "^latest"
}
```

## Environment Variables

No new environment variables required. Uses existing:
- `STRIPE_SECRET_KEY` - Server-side Stripe API key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Client-side Stripe publishable key
- `NEXT_PUBLIC_BASE_URL` - Base URL for return URLs

## Bug Fixes

### Duplicate Order Detection (Pre-existing bug fixed)

**Issue:** When a user retried checkout within 5 minutes with the same email and total, the system detected it as a duplicate and returned the existing session ID but **without the checkout URL**, causing "No checkout URL received from Stripe" error.

**Fix:** Now retrieves the existing session from Stripe to get its URL, and checks if the session is still active before reusing it. If expired, creates a new session.

## UI/UX Considerations

1. **Bottom sheet height:** 75% on mobile, 65% on desktop
2. **Backdrop:** Semi-transparent dark overlay (bg-black/50 with backdrop-blur)
3. **Animation:** Slide up from bottom (300ms ease-out transition)
4. **Chat widget:** Hidden behind payment sheet (z-index: 60 vs 50)
5. **Payment methods:** Card, Apple Pay, Link (handled by Stripe Payment Element)
6. **Localization:** Supports English and Arabic (RTL)

## Testing Checklist

- [ ] Click "Complete Order" opens bottom sheet
- [ ] Order number and total displayed correctly
- [ ] Card input works and validates
- [ ] Apple Pay appears on supported devices
- [ ] Error messages display properly
- [ ] Successful payment redirects to success page
- [ ] Cart is cleared after successful payment
- [ ] Confetti celebration shows on success
- [ ] Chat widget is hidden behind payment sheet
- [ ] Close button and backdrop click close the sheet
- [ ] ESC key closes the sheet
- [ ] Arabic locale shows RTL layout
- [ ] Duplicate order within 5 minutes handled correctly

## Related Documentation

- [Stripe Payment Element](https://stripe.com/docs/payments/payment-element)
- [Stripe PaymentIntent API](https://stripe.com/docs/api/payment_intents)
- [Stripe React Components](https://stripe.com/docs/stripe-js/react)
