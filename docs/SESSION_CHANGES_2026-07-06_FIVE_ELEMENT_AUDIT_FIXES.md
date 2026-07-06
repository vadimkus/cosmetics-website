# Session Changes — Five-Element Audit + Fixes (2026-07-06)

Five parallel audits (cart/checkout, favorites/wishlist, profile/account,
push notifications, admin panel) followed by a fix pass. Web commit
`ca680443`, app commit `602dc38` + OTA update (runtime 1.10.5). All fixes
verified live on production.

## CRITICAL — fixed

| # | Finding | Fix |
|---|---|---|
| 1 | **Profile IDOR + privilege escalation** — `/api/profile/update` trusted a body-provided `userId` and passed un-allowlisted fields to `updateUser` (any logged-in user could set `isAdmin: true` on any account) | Session-bound (body `userId` ignored); strict allowlist: name, phone, address, birthday, contactEmail, profilePicture. Email changes no longer possible via this route |
| 2 | **Unauthenticated push route** — `/api/push/order-status` logged failed auth and continued; also dead code (zero callers) | Route deleted |
| 3 | **Wishlist stored in a process Map** — all mobile favorites lost on every deploy/cold start | New `wishlist_items` table (Prisma model + prod DDL via `scripts/create-wishlist-table.ts`); route rewritten to DB. GET returns LIVE product name/image/price (fixes stale-price finding too) and self-heals rows for deleted products |
| 4 | **Mobile wishlist DELETE hit a 404** — client sent path param, server expects query param | Client fixed to `?productId=` (app repo) |

## HIGH — fixed

- **Admin logout left the httpOnly cookie valid for 24h** — new
  `/api/auth/admin-logout` expires it; admin UI calls it on logout. Vestigial
  `X-Admin-Email` header removed from admin fetches.
- **Account deletion left PII** — `anonymizeUser` now also deletes saved
  addresses + push subscriptions, clears `contactEmail`, and bumps
  `tokenVersion` (revokes all sessions). Mobile deletion path unified onto the
  same function (was an incomplete inline copy).
- **COD WhatsApp button quoted a never-persisted order number** — checkout now
  generates ONE `CODW…` number at mount used for display, WhatsApp, and the
  persisted order. When paying by card the number is hidden (server assigns
  the real one at payment-intent creation).
- **Order notes silently dropped** — three-layer fix: checkout form now reads
  the `notes` field and sends it on both COD + Stripe paths; both APIs accept
  `orderNotes` (trimmed, 1000-char cap); `addOrder` finally persists it
  (it was declared in `OrderData` but never written to the DB).
- **No phone validation on web checkout** — UAE phone regex (mobile-app
  parity) with localized error (`checkout.invalidPhone`, EN/AR/RU).
- **Guest favorites overwritten on mobile login** — sync now merges local
  favorites into the server list before applying it (app repo).
- **Logout didn't clear push token (app)** — next device user could receive
  the previous user's order pushes; now cleared server-side on logout.

## MEDIUM/LOW — fixed

- `/api/push/subscribe` DELETE: session required + only deletes caller's own
  subscription (was: anyone could unsubscribe anyone by endpoint URL).
- Admin: users list `?limit=` capped at 5000; admin-login 500 no longer leaks
  internal error details in production; CSRF on segments POST/PUT/DELETE
  (+ `UserSegmentation` UI sends the token).
- Cart: 99-per-line quantity cap (`MAX_LINE_QUANTITY`, matches app);
  bundle-aware React keys (same product as bundle + solo no longer collides);
  Black Friday countdown no longer runs a 1-second interval year-round;
  checkout order summary shows selected color for ANY product (was hardcoded
  to products 41/63).
- Favorites page count label localized (`favorites.itemCountOne/Many`).
- Push: notification taps deep-link to `/profile/orders/[id]` (was the list);
  Android `orders` channel created at registration (app repo).
- Mobile addresses: deleting one address no longer empties the whole list.

## Verified sound by the audits (no action needed)

- All 36 admin API routes protected by `requireAdminAuth`; admin brute-force
  rate limiting; discount bounds validation; product ISR revalidation.
- Money paths: double-submit guards both platforms, cart clearing on success,
  free-shipping threshold consistency, server-authoritative pricing,
  variant validation, emirate validation.
- Apple account-deletion compliance: MET (in-app Danger Zone → server
  anonymization; now with complete PII erasure).
- Mobile i18n: all checked key sets complete in EN/AR/RU.

## Deferred (documented, not fixed — with rationale)

1. **Web ↔ app favorites sync** — web favorites remain localStorage-only.
   Server API is now DB-backed, so wiring the web to it is possible; larger
   feature (login merge UX) — schedule separately.
2. **Expo push receipt polling** (`checkPushReceipts` is implemented but
   uncalled) — needs a cron + ticket storage; ticket-level
   `DeviceNotRegistered` cleanup already works.
3. **Stale prices in persisted web carts** — display-only risk (server
   recomputes at checkout); a cart re-price on hydration is a nice-to-have.
4. **Admin UI pages have no server-side gate** (APIs are all protected; only
   UI chrome/JS bundle is exposed). A root `middleware.ts` gating `/admin/*`
   is the fix if desired.
5. **CLV report unbounded `findMany`** — should become a SQL GROUP BY;
   works today at current order volume.
6. **Marketing opt-out for PWA broadcasts**; **profile pictures as base64 in
   DB**; **CSRF on 5 one-off admin utility routes** (sameSite=lax already
   blocks cross-site POST; adding the header requirement could break the
   owner's curl workflows).

## Follow-up (same day): warmer order-cancelled copy

Commit `c8a2e60d` — user flagged the cancelled push as cold. Rewrote the
CANCELLED copy in all three languages across push (`lib/expoPush.ts`), status
email (`orderEmail.statusUpdate.statusMessages.CANCELLED` in `messages/*.json`
+ hardcoded fallback in `lib/email/statusUpdate.ts`), and WhatsApp
(`lib/twilio.ts`). Dropped the incorrect "as requested" phrasing — admin
cancellations aren't customer-requested — for an apology-neutral message that
invites a reply / WhatsApp and offers to place a new order.

## Files touched (web)

`app/api/profile/update/route.ts`, `app/api/push/order-status/route.ts` (deleted),
`app/api/push/subscribe/route.ts`, `app/api/auth/admin-logout/route.ts` (new),
`app/admin/page.tsx`, `app/api/admin/users/route.ts`, `app/api/auth/admin-login/route.ts`,
`app/api/admin/segments/*`, `components/UserSegmentation.tsx`, `lib/userStorageDb.ts`,
`app/api/mobile/user/account/route.ts`, `app/api/mobile/user/wishlist/route.ts`,
`app/checkout/CheckoutClient.tsx`, `app/api/orders/cod-confirmation/route.ts`,
`app/api/stripe/create-payment-intent/route.ts`, `lib/orderStorageDb.ts`,
`lib/cartStore.ts`, `app/cart/CartClient.tsx`, `app/favorites/FavoritesClient.tsx`,
`messages/*.json`, `prisma/schema.prisma`, `scripts/create-wishlist-table.ts`

## Files touched (app — OTA-safe, no native rebuild)

`services/databaseService.js`, `contexts/FavoritesContext.js`,
`contexts/AuthContext.js`, `contexts/NotificationContext.js`,
`services/pushNotificationsService.js`, `app/profile/addresses.js`
