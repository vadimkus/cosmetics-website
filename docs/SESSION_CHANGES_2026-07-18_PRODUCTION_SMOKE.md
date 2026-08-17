# Production smoke — 2026-07-18 (post `15241cb3`)

Target: `https://genosys.ae` (Vercel deploy live; health OK, 66 products).

## Verdict

Production is healthy for the shipped features. Automated false failures were re-checked manually/Playwright with corrected selectors.

## Pass

| Area | Result |
|---|---|
| Blog EN/AR/RU (3 posts × 3 locales) | HTTP 200; square / portrait / landscape heroes correct |
| Blog duplicate opening hero | No near-duplicate hero (false positive in first script) |
| Blog overnight video | Play button → native player + controls |
| Arabic blog RTL | `lang=ar` `dir=rtl` |
| Product card → PDP | Chromium + WebKit (66, 52, 11) |
| Quick Facts EN/AR/RU | Opens; source disclaimer present; no “verified store sales” |
| Accordion + gallery | Toggle + thumbs on PDP |
| Mobile overflow | Home, products, blog, AR, checkout — no horizontal scroll |
| Guide reading progress | `scaleX` advances on scroll |
| Home reveals | 6 sections; animate; re-arm after leave/return |
| Reduced motion | Reveals remain visible |
| Login modal stacking | Opens, z-index 10000 |
| Checkout / Stripe / COD APIs | Reachable; unauth returns 401/403 as expected |
| Mobile APIs (with `x-api-key`) | products 64, blog 18, overnight slug OK |
| Health | `{"status":"healthy","database":"connected","products":66}` |

## Skipped (needs real customer session)

- Full loyalty redeem → Stripe settle → points ledger once
- Order history “You saved” after live payment
- Live AR/RU order confirmation email pts labels (unit-tested in deploy; not re-sent)

## Minor notes (non-blocking)

- Arabic overnight post still shows English “Watch product video” button label.
- Mobile routes correctly require `x-api-key` (401 without it).
- PWA “Update Available” toast appeared after deploy (expected cache bump).

## Cleanup

One-off script: `scripts/tmp-prod-smoke-20260718.mjs` (local only; not required in repo permanently).
