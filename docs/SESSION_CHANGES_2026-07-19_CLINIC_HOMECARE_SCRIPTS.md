# Clinic Homecare Scripts — local implementation

Date: 2026-07-19
Status: implemented and verified locally; application deployment pending

## Delivered

- Partner-only Homecare Scripts page on desktop, mobile web, and PWA.
- Native iOS/Android clinic workflow through authenticated API routes.
- Retail-only product selection with optional patient reference and product-use notes.
- Immutable recommendation versions: editing a sent recommendation creates a new version.
- Private 32-character bearer link at `/r/{token}` with no patient PII in the public payload.
- Native share sheet, copy-link fallback, and WhatsApp click-to-chat.
- Responsive patient page showing current price/availability and adding attributed lines to cart.
- Server-authoritative attribution in COD and Stripe PaymentIntent checkout.
- Latest valid explicitly-added script wins the order; only matching script/version lines earn points.
- Clinic Points at 5% of eligible VAT-exclusive paid product value.
- Self-referral rejection, 14-day pending period, idempotent awards, and proportional refund reversal.
- Daily Vercel cron route for mature-point release.
- Clinic Points redemption on partner web/PWA and native orders at `1 point = AED 1`.
- Redemption is server-authoritative, balance-capped, serializable, ledger-backed, and excluded from consignment stock orders.
- Spent points are restored proportionally on refunds and fully on cancellation; retry paths are idempotent.
- Web self-cancel and both native delete routes also restore redeemed Clinic Points; failed unpaid native orders are deletable. A retryable Stripe payment failure deliberately keeps points reserved until the order is retried or cancelled, preventing a later successful retry from receiving an unbacked discount.
- Clinic-facing transaction history and admin-facing ledger, balance, and signed manual adjustments.
- Order and confirmation-email totals show Clinic Points separately from retail GENOSYS Rewards.

## Data model

Migration: `prisma/migrations/20260719113000_homecare_scripts/migration.sql`

New tables:

- `homecare_scripts`
- `homecare_script_versions`
- `homecare_script_items`
- `clinic_point_transactions`

Orders and order items retain immutable attribution IDs and eligible amounts. Orders also retain `clinicPointsRedeemed` and `clinicPointsDiscountAmount`. Clinic Points are a separate ledger and never mix with retail `loyaltyPoints`.

## Security and privacy

- Partner APIs require partner access. Web mutations require CSRF; native mutations require API key plus bearer token.
- Public links are random, rate-limited, `noindex`, `nofollow`, `noarchive`, `no-store`, and use `no-referrer`.
- Public responses exclude patient references.
- Product eligibility, script ownership, token, version, product, size, status, expiry, stock, and hidden state are revalidated server-side.

## Local verification

- Prisma schema format, validation, generation, and TypeScript: pass.
- Full Jest suite: 47 suites; 299 passed, 3 skipped.
- Next production build: pass.
- Isolated local Prisma Postgres:
  - current schema push: pass;
  - Homecare migration applied to a pre-feature baseline: pass;
  - migration-to-schema diff: no difference;
  - lifecycle smoke (`scripts/smoke-homecare.ts`): create, version, public read, attribution, award, duplicate prevention, maturity, partial reversal, admin adjustment, redemption, partial refund restoration, and cancellation restoration all pass.
- Authenticated Playwright lifecycle (`e2e/homecare-lifecycle.spec.ts`): real clinic login, private script creation/open, patient COD checkout, real admin login, payment receipt, delivery, pending award, cron maturity, partial refund, and final ledger balance all pass.
- Universal-link contract: iOS AASA explicitly excludes `/r/*` and Android intent filters do not claim it, so an installed app does not intercept the patient website. The native intent guard opens manually invoked `/r/*` links in a browser context, never the generic app WebView. `npm run verify:homecare-links` passes.
- Browser smoke:
  - invalid private link has a graceful desktop/mobile state;
  - partner routes redirect unauthenticated users correctly;
  - no Homecare runtime crash.
- Patient recommendation and partner Homecare portal buttons now provide clear desktop hover, press, keyboard-focus, and disabled feedback. Primary actions lift slightly, shift to the GENOSYS red treatment, and gain a restrained brand shadow; WhatsApp keeps its green treatment, destructive actions become solid red, and touch behavior remains unchanged.
- The local manual-test server is hosted in a detached `screen` session (`genosys-homecare`) so it remains available while the feature is reviewed. At the owner's request, it now uses the production database through `.env.local`.
- A dedicated non-admin production partner test account (`clinic-test@genosys.local`) was created with Partner Portal access. Browser verification confirmed authentication, Homecare navigation, and loading of the production retail catalog without creating a recommendation.
- Existing unrelated login `LanguageSwitcher` hydration warning remains; it does not originate in this feature.

## Important repository note

The historical migration directory cannot bootstrap a completely empty database because its earliest tracked migration assumes the `products` table already exists. This predates Homecare Scripts. The new migration itself was validated independently against an isolated local pre-feature baseline.

## Deployment state

No Vercel deployment or OTA update was performed. The production database schema was already Homecare-ready; the only production data mutation in this testing step was creation of the dedicated partner test account described above.
