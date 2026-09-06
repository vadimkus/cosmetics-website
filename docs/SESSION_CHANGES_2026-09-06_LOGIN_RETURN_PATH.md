# 2026-09-06: Return to the same page after logging in

## Request
Tapping "Log in to shop" on a product page and signing in landed on /products. It should land back on the product.

## How it works now
- `lib/loginReturn.ts`: `loginPathWithReturn(locale)` builds `/login?redirect=<current path + query>`; `isSafeReturnPath` accepts only same-origin absolute paths and rejects auth pages (no loops), `//`, `:` and CR/LF.
- Every guest-to-login hop now uses it: generic product client, `useProductActions`, all ~50 bespoke product pages, `ProductInfo`, `ProductPriceDisplay`, `ProductReviews`, `ProductRecommendation`, cart, checkout, orders, profile, profile/edit, skin-recommendation, mobile web and PWA header user icon. Favorites and PartnerGuard already passed their own redirect.
- `app/login/LoginClient.tsx`: reads `?redirect=` for email login and for the Google `success=google_signin` return.
- Google / Apple: `AuthProvider` forwards `redirect` to `/api/auth/{google,apple}`, which store it in an httpOnly `post-login-redirect` cookie (10 min). The callbacks redirect there instead of `/products` and clear the cookie.

## Verified live
- `/products/7` and `/products/12` "Log in to shop" -> `/login?redirect=%2Fproducts%2F7` (browser check).
- `GET /api/auth/google?redirect=%2Fproducts%2F7` sets `post-login-redirect` cookie.

## Commits
`686522d3`, `43cadac0` (also fixed an em dash in `lib/moysklad.ts` that was failing the house-style test).
