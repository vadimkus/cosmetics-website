# Session — Partner Portal: Consignment + Payment Options (Jul 10, 2026)

Partner checkout now has three settlement options on web AND the iOS app, with
consignment gated by a per-account agreement flag mirrored from MoySklad.

## What shipped

### 1. Consignment agreement flag (DB + admin)
- `users.consignmentActive` (bool), `users.moyskladCounterpartyId`, `users.moyskladContractId` — `prisma db push` applied.
- Flag flows automatically into the web session user and all mobile auth payloads (full-user serializers).
- Admin → Customers → profile: new **Consignment** row (Activate/Deactivate) next to Price Access/Discount.
- `PATCH /api/admin/users/[id]` accepts `consignmentActive` (boolean validated).

### 2. MoySklad matcher (one-off, executed)
- `scripts/moysklad-match-consignment-partners.js` (dry-run / `--commit`).
- Match keys: phone (last-9-digit, any number in the field) + email; ambiguity is never auto-written unless exactly one candidate holds a Commission contract.
- **Committed results:** 1073 counterparties, 66 active Commission contracts, 88 site partner accounts →
  - **5 partners consignment-activated**: dashkalinina@gmail.com, Lizaarnatskaya@gmail.com, val.prokudina@gmail.com, klimenko.viktoria12@icloud.com, zhannaklusova@icloud.com
  - 25 partners linked to counterparty (no consignment contract)
  - 12 ambiguous (duplicate counterparties in MoySklad — manual review)
  - 46 site partners unmatched (mostly retail VIPs, no MoySklad record)
  - 61 consignment clinics have **no site account yet** (WhatsApp-only — invite pipeline)

### 3. Partner order payment options (server)
- `POST /api/partners/order` (web) + `POST /api/mobile/partner/order` (app) accept `paymentOption`: `consignment` | `online` | `cod` (default cod).
- Consignment is server-gated: 403 unless `user.consignmentActive`.
- DB `paymentMethod`: `partner_consignment` / `partner_online` / `partner_cod` (PART… order numbers unchanged).
- **Online**: creates a Stripe hosted Checkout session (new `createOrderCheckoutSession` in `lib/stripe.ts`), stores `stripeSessionId`, returns `paymentUrl`. Existing webhook marks paid via session id. Idempotency-bucket-anchored `expires_at` (~35 min).
- Mobile Stripe resume flow patched: PART… orders keep **free shipping** on resume (no retail shipping re-derivation).

### 4. Web portal UI
- Order page: **Settlement selector** (consignment card — amber, only when agreement active; online; COD), button label adapts (Add to consignment stock / Continue to payment / Place order).
- Online → redirect to Stripe; success/cancel land on `/pay/success|cancel`.
- Success screen variants per option; consignment shows amber chip + monthly-report wording.
- Dashboard: **Consignment badge** in desktop header + mobile hero for flagged partners.

### 5. App (Expo OTA)
- `app/partner-portal.js`: same 3-option settlement selector, consignment chip in header, success variants. Consignment flag re-fetched fresh via `/api/mobile/auth/validate` on screen mount (stale stored user handled).
- Online → pushes existing in-app `/payment/stripe` screen with the hosted URL (polling + success UI already there).
- `services/api.js`: `submitPartnerOrder` passes `paymentOption`.
- Order detail: friendly labels for `partner_consignment` (Consignment stock), `partner_cod` (COD), `partner` (Partner order); `partner_online` uses card-like path → unpaid ones show **Pay** (resume works).

### 6. Admin visibility
- Email: **🏬 PARTNER CONSIGNMENT** amber banner (settle via monthly report — no payment due) vs **🤝 PARTNER ORDER** red banner (online/COD noted); subject prefix matches.
- Admin orders list: partner detection now by `PART…` prefix (or legacy `partner` method); extra amber **Consignment** chip; filter tab counts updated.

## Testing done
- `tsc` clean, eslint 0 errors (7 pre-existing warnings), babel-parse of all app files OK.
- Live smoke (local dev + prod DB): unauth 401 ✓, non-partner 403 ✓, consignment without agreement 403 ✓, consignment with agreement passes gating ✓.
- Stripe helper live-tested: session created, 16500 fils for 165 AED, sane expiry (test session, no order, expires unused).
- Matcher dry-run reviewed, then committed (30 user rows written).

## Files
Web: `prisma/schema.prisma`, `types/user.ts`, `lib/userStorageDb.ts`, `lib/stripe.ts`, `lib/email/templates.ts`, `app/api/admin/users/[id]/route.ts`, `app/api/partners/order/route.ts`, `app/api/mobile/partner/order/route.ts`, `app/api/mobile/checkout/stripe/route.ts`, `app/partner-portal/page.tsx`, `app/partner-portal/order/page.tsx`, `components/CustomerProfile.tsx`, `components/admin/AdminOrdersManager.tsx`, `components/auth/AuthProvider.tsx`, `scripts/moysklad-match-consignment-partners.js`, `scripts/smoke-partner-consignment.ts`.
App: `app/partner-portal.js`, `services/api.js`, `app/profile/orders/[id].js`.

## Follow-ups
- 12 ambiguous matches: re-run matcher after merging duplicate counterparties in MoySklad, or set flags manually in Admin.
- 61 consignment clinics without site accounts → invitation campaign target list (matcher prints it).
- Optional: partner-order push of consignment orders into MoySklad as commission orders (still manual via admin).
