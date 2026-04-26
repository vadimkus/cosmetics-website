# Android Chrome Cart Scroll Fix

Date: 2026-04-26

## Context

Customer reported that on Android Chrome, after adding an item to the cart, the Bag page would not scroll far enough to reveal the checkout/proceed button. The same flow worked on iPhone Chrome.

The screenshot matched the mobile web/PWA Bag UI (`app/cart/CartClient.tsx`), not the native Expo Bag screen.

## Root Cause

The mobile cart card used `overflow-hidden cart-container momentum-scroll`, and global CSS applies `overscroll-behavior: contain` to `.cart-container`. On Android Chrome, touch gestures that start inside this large card can be trapped instead of chaining to the page scroll, which makes the user feel stuck before reaching the order summary.

The order summary card was also sticky on mobile and forced `overflow: hidden`, which can create the same problem on small Android viewports.

## Change

- Removed the mobile scroll trap from the cart panel by using `overflow-visible` on mobile and keeping clipping only from `md` upward.
- Made the order summary sticky only on desktop (`lg:sticky`), with mobile overflow visible.
- Increased app-like cart bottom padding so the summary/checkout area has space above the mobile bottom navigation.

## Verification

- `npx eslint app/cart/CartClient.tsx`

## Rollback

Revert `app/cart/CartClient.tsx` to restore the previous cart panel classes and mobile order summary behavior.
