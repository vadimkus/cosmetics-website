# Session Changes — Partner Portal (2026-07-10)

## Summary
Built `genosys.ae/partner-portal` — a corporate partner portal for clinics/salons to log in, view past orders, and place new orders at their **account-based partner price**. Plus admin reorder reminders and a mobile (app) ordering endpoint.

> Route note: the public **`/partners`** page (SEO "our partners in UAE" directory) is unchanged. The ordering portal is **`/partner-portal`** (+ `/partner-portal/order`) to avoid clobbering it. Mobile app route is `/partner-portal` too.

## Pricing rule (IMPORTANT)
- **Account-based only.** Partner price = the account's own `discountPercentage` off retail (via `calculateDiscountedPrice`). Every partner's discount is **assigned manually** in admin → Users. No automatic default anywhere.
- Devices/Beauty Boxes/`noDiscount` items stay at retail (existing exclusion in `discountUtils`).
- Display badges show the account's actual % dynamically. Order totals are recomputed server-side from the account's discount in both web and mobile order APIs.

## Web (live, testable in prod)
- `app/partner-portal/page.tsx` — corporate dashboard: dark GENOSYS hero, "Verified Partner" + "−50%" badges, stats strip (orders / total AED / days since last), reorder nudge (30d+), primary New Order, **order history with expandable item detail**, welcome toast, sign-out confirm.
- `app/partners/order/page.tsx` — product picker, partner price w/ strikethrough + −50% badge, qty steppers, notes, sticky total, submit → success screen. Mobile-web + PWA optimized.
- `components/partners/PartnerGuard.tsx` — gates to CLINIC/VIP; corporate loading + "Partners only" access screen.
- `app/api/partners/order/route.ts` — cookie-session (web) order create: server-priced at 50%, CSRF + rate-limited, saves `PENDING`/`paymentMethod:'partner'`, emails admin.
- Entry points: Partner Portal card in **desktop profile** (`app/profile/page.tsx`) and **mobile/PWA profile** (`components/pwa/PWAProfilePage.tsx`), shown only for CLINIC/VIP.

## Admin — reorder reminders (live)
- `app/api/admin/partners/reorder-due/route.ts` — admin-only; per-clinic days-since-last-order, overdue flag (30/45/60d), WhatsApp reminder link.
- `app/admin/partners/page.tsx` — overdue/no-orders/on-track counts, threshold switcher, per-clinic "Remind" (WhatsApp) button. Uses existing `AdminLogin`.

## Apple / Android app
- **Architecture (confirmed):** native Expo app, API-driven (not a WebView). It authenticates with `x-api-key` + `Authorization: Bearer` (no cookies) → could NOT use the web cookie endpoint.
- **Done:** `app/api/mobile/partner/order/route.ts` — Bearer-auth mirror of the web partner order endpoint (50% pricing, same DB write + admin email). Ships via Vercel deploy.
- **Viewing past partner orders already works** in the app (they come back via `/api/mobile/orders`, tagged `PARTNER ORDER —`).
- **DONE (native app, OTA-shippable):** built `genosys-mobile-app/app/partner-portal.js` (corporate dark header, search, product list at −50% with retail strikethrough, qty steppers, notes, sticky total, success screen, partner access guard). Added `submitPartnerOrder()` in `services/api.js` (POSTs `/api/mobile/partner/order` with Bearer + api-key). Registered `/partner-portal` in `app/AuthWrapper.js` (protected + chat-hidden). Added a conditional "Partner Portal" entry in `app/profile.js` (shown only when `discountType` is CLINIC/VIP). Pricing uses the shared `utils/pricingDisplay` adapter (server-priced), same as the shop. All four files pass `babel-preset-expo` compile. No new native modules → **ships via `eas update --branch production`** (no App Store review; runtimeVersion 1.11.0 fixed).
- **Ship order:** deploy the website first (so `/api/mobile/partner/order` exists), then `eas update`.

## Verification
- `npx tsc --noEmit` clean. `npx eslint` clean on all new files.
- Dev smoke: `/partners`, `/partners/order`, `/admin/partners` → 200; `/api/partners/order` (no CSRF) → 403; `/api/admin/partners/reorder-due` (no admin) → 401; `/api/mobile/partner/order` (no auth) → 401.

## Not yet (future)
- Native app partner screen (above).
- Auto-push partner orders to MoySklad (needs User↔counterparty link) — currently you push with the existing admin button.
- MoySklad-fed reorder reminders for consignment-only clinics (portal reminders cover portal orders today).
