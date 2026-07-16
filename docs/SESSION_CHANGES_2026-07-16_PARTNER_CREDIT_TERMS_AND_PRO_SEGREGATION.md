# Session — Partner credit terms, retail/pro segregation, payment tracking, partner login (2026-07-16)

## What was built (4 tasks)

### 1. Credit terms (30/45/60/90 days) alongside consignment

- **Schema** (`20260716070000_partner_credit_terms`, applied to prod):
  - `users.creditActive` (bool), `users.creditDays` (30/45/60/90)
  - `orders.creditDays`, `orders.paymentDueDate`
- **Admin → Customer Profile**: new "Credit terms" row under Consignment —
  days selector + Activate/Deactivate (no email sent on toggle).
- **Partner checkout**: new blue "Credit N days" pill (shown only when
  active). Credit orders get `paymentMethod partner_credit`,
  `paymentDueDate = now + N days`, settlement label in order notes and
  admin email: `CREDIT 45 DAYS (due 30/08/2026)`.

### 2. Retail vs professional segregation (partner portal only)

- **`lib/partnerCatalog.ts`** — single source of truth, easy to edit:
  - `PROFESSIONAL_PRODUCT_IDS`: Power Solutions (4–9), SRS 13, Hydro Cool 35,
    Mesopecia 47, Bio-Ferment 51, PDRN pack 52, Bio Meso 60000, Hair Stamp
  - `PROFESSIONAL_SIZES`: big size of dual-size cards → PRO
    (10:500ml, 15:500ml, 16:1000ml, 25:100g, 28–32:250g/230g, Cerabarrier:600ml)
  - Equipment = category contains "device" (HairGen, Hair-GENTRON, GENO-LED)
- **Portal UI**: partners see ALL products; PRO badge on professional
  products/sizes, Equipment badge on devices. With consignment selected,
  non-retail lines show "Not for consignment" instead of Add; the
  consignment pill refuses to activate while pro items are in the cart
  (lists offenders); submit double-checks.
- **Server enforcement** in BOTH partner order APIs (web + mobile):
  consignment orders 403 with the product name if any line is
  professional/equipment. Credit/online/cod orders may contain anything.

### 3. Admin payment tracking (consignment + credit)

- **Orders tab**: new filters — Consignment (amber) and Credit (blue) next
  to Partner Portal. Credit badge shows term (`Credit 45d`); unpaid orders
  show `Due date` (red **OVERDUE** when past), consignment shows
  "Payment pending"; paid ones show `Paid · date`.
- **Mark payment received**: green $ button on unpaid consignment/credit
  orders → `PUT /api/admin/orders/[id]` with `{ paymentReceived: true }` →
  sets `paymentStatus=paid`, `paidAt=now` (no status change, no emails).

### 4. Partner access on the main login page

- `/login` now has a "Partner Access — Clinics" link (mobile + desktop
  cards) → `/login?redirect=/partner-portal`.
- Login honors a safe internal `?redirect=` param post-login.
- `PartnerGuard` sends logged-out visitors to `/login?redirect=/partner-portal`
  so they land straight in the portal after signing in.

## Plumbing

- `types/user.ts`, `lib/userStorageDb.ts`, admin user GET/PUT routes carry
  `creditActive`/`creditDays` (validated to 30/45/60/90).
- `AuthProvider` persists the flags; `/api/auth/session` already returns
  full DB user so the portal sees them immediately.
- `lib/orderStorageDb.ts` OrderData + create support the new order fields.

## Verification

- `tsc --noEmit` clean; eslint 0 errors on changed files
- Classification sanity-checked (Snow O₂ 180/500, Power HES, devices,
  Cerabarrier 200/600, roller sizes, Bio Meso 60000)
- `useProfileState` suite 7/7 passed

## Follow-up (same day): Partner Portal access gate

- New `users.partnerPortalAccess` flag (migration
  `20260716080000_partner_portal_access`, applied) — **the only thing that
  lets an account into /partner-portal** (guard + both order APIs).
  Discount type/percent alone no longer grants access.
- Admin → Customer Profile: new **"Partner Portal"** Grant/Revoke row above
  Consignment. New users default to NO access — Vadim verifies manually.
- Backfill: all accounts with a 50% discount were granted access
  (54 accounts) + explicitly `support@genesis-dubai.com` and
  `admin@genosys.ae` → 56 total.
- Partner login modal on /login unchanged — accounts without the flag now
  see the "Partners only / Request Access" screen after signing in.

## Follow-up: collapsible category sections (web + app)

- Partner order list is now grouped into collapsible sections — Cleansers,
  Toners & Mists, Serums, Creams, Eye Care, Masks, Sun & BB, Peeling,
  Microneedling, Bio Meso, PRO Solutions, Scalp & Hair, Beauty Boxes, Kits,
  Devices — with product counts and a red ×N badge for selected items.
  Sections start collapsed; search shows a flat list; reorder prefills
  auto-open their sections. (`lib/partnerCatalog.ts` →
  `PARTNER_CATEGORY_GROUPS` + `partnerGroupKey`.)
- **Mobile app fully aligned** (`genosys-mobile-app`, commit `ec31e85`):
  same category sections, Credit N-days pill, PRO/Equipment badges,
  retail-only consignment gating, and access via `partnerPortalAccess`
  (fresh profile fetch; legacy discount fallback until re-login).
  `utils/partnerCatalog.js` in the app mirrors the web lib — keep in sync.
- **OTA published**: runtime 1.11.0, update group
  `dbb336ca-def7-40ed-b87a-86db589398cf` (iOS + Android, production).
- Mobile web + PWA use the same web page — nothing extra needed.

## How to adjust the pro/retail mapping

Edit `lib/partnerCatalog.ts` — add/remove product ids in
`PROFESSIONAL_PRODUCT_IDS` or sizes in `PROFESSIONAL_SIZES`. Both the
portal UI and the two order APIs pick it up automatically.
