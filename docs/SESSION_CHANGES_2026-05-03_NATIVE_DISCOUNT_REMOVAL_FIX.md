# Native App Discount Removal Fix

Date: 2026-05-03

## Context

The native Apple app continued showing a 50% user discount for `f.this.that@gmail.com` after the discount was removed in the website admin. Restarting the app did not clear it.

## Root Cause

- The admin profile editor could clear `discountType` while leaving the old `discountPercentage` in component state.
- `updateUser` accepted that orphan state, so the database could contain `discountType = null` and `discountPercentage = 50`.
- Native app UI paths treated `discountPercentage > 0` as an active discount even when no `discountType` existed.
- The native app also persisted user profile data and product catalog data across restarts, so stale personalized pricing could survive a cold launch.

## Changes

- Website user storage now normalizes discount fields as a pair: no type or invalid percentage clears both fields.
- Website admin discount save now clears percentage when "No Discount" is selected.
- Mobile checkout, Apple Pay, and mobile order creation only record user discount percentage when `discountType` is active.
- Native app session storage sanitizes user discount data before saving or rehydrating profile state.
- Native app clears the cached product catalog when the user's discount signature changes.
- Native product, bag, checkout, profile, order-history, and cart fallback paths now require an active `discountType` before using `discountPercentage`.

## Verification

- `cosmetics-website`: `npx tsc --noEmit --pretty false` passed.
- `cosmetics-website`: focused ESLint on edited files passed with existing `no-explicit-any` warnings only.
- `cosmetics-website`: `npm run smoke:pricing-contract` passed.
- `genosys-mobile-app`: `npm run smoke:cart-pricing-contract` passed.
- `genosys-mobile-app`: `npm run smoke:order-payload-pricing-contract` passed.
- `genosys-mobile-app`: `npm run smoke:pricing-display` passed.
