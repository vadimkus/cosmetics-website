# Desktop Profile Redesign

Date: 2026-07-19

## Outcome

The authenticated desktop `/profile` experience is now a utility-first customer dashboard. Mobile web and installed-PWA users continue to receive the existing `PWAProfilePage`; no native-app code was changed.

**Skin analysis (2026-07-19 follow-up):** Overview “Start analysis” now navigates to `/skin-recommendation` (same entry as the homepage), instead of opening a profile-only camera modal.

## Design direction

- Adapted the quiet identity rail and spacious task canvas seen in Awwwards' Houston Drip Factory account example without copying its artwork.
- Applied GENOSYS typography, neutral surfaces, restrained elevation, red interaction accents, and consistent 44px+ controls.
- Prioritized rewards, latest-order status, favorites, shipping, billing, skin analysis, documents, and support.
- Replaced the generic welcome banner with a black **GENOSYS Member** panel showing the real registration date, phone, address, and most recent order payment method; missing values are stated explicitly rather than fabricated. The panel carries the GENOSYS Professional mark in a white-on-black treatment. Its live membership badge follows `/api/user/membership`: Member uses an award, Silver and Gold use tier-colored medals, Platinum uses a crown, and professional accounts retain their Partner identity.
- Kept primary dashboard views distinct from standalone destinations.

Research references:

- [Awwwards — Houston Drip Factory eCommerce My account page](https://www.awwwards.com/inspiration/ecommerce-my-account-page-houston-drip-factory-1)
- [Baymard — Accounts & Self-Service UX Best Practices 2025](https://baymard.com/blog/current-state-accounts-selfservice)
- [Baymard — Order Tracking UX](https://baymard.com/blog/integrate-tracking-info)

## Information architecture

The sticky desktop account rail contains:

- Overview
- Orders
- Favorites
- Personal details
- Shipping addresses
- Billing
- Security & privacy
- Documents
- Partner Portal for eligible clinic/VIP accounts
- Sign out, separated from normal navigation

Overview, orders, favorites, personal details, shipping addresses, billing, and security use deep links such as `/profile?tab=addresses`. Favorites, address management, and billing reuse their existing functional content inside the account canvas so the identity rail stays visible. Documents and Partner Portal remain real routes.

Address creation and editing also stay inside that canvas through `/profile?tab=addresses&mode=add` and `/profile?tab=addresses&edit=…`; cancel/save returns to the embedded address list without dropping the desktop sidebar. Existing standalone address routes remain intact for mobile and PWA flows.

## Functional changes

- **2026-07-21 follow-up:** `/profile`, every nested profile route, `/skin-recommendation`, and `/training` now use the same compact trust/payment/legal footer as cart and checkout instead of the full retail sitemap.
- Added `components/profile/desktop/DesktopProfileShell.tsx`.
- Added `components/profile/desktop/ProfileOverview.tsx`.
- Added `components/profile/desktop/DesktopSecurityPanel.tsx`.
- Added a deduplicated `useMembershipData` hook so the rail and rewards card use the real membership API.
- Removed the browser-local fake customer-number generator.
- Reused existing order, profile-edit, passkey, privacy, account deletion, and skin-analysis flows.
- Removed the nonfunctional theme control from the exposed desktop experience.
- Replaced duplicate in-profile document listings with `/training`.
- Replaced obsolete order-image placeholders with `/images/genosys-logo-transparent.png`.
- Removed dead profile copies:
  - `app/ar/profile/ProfilePageClient.tsx`
  - `components/profile/ProfileHeader.backup.tsx`
- Added all dashboard copy to EN/RU/AR message bundles.

## Verification

- Jest: 2 focused suites, 7 tests passed.
- TypeScript: `npx tsc --noEmit` passed.
- Targeted ESLint: passed without errors or warnings after cleanup.
- Production: `npx next build` passed (454 static pages generated).
- Playwright: authenticated profile-access smoke passed. The full legacy profile suite was updated for the current login form and deep links; a later full local run was blocked by Turbopack serving stale/404 API chunks after the production build replaced the active dev cache.
- `git diff --check`: passed for profile-related changes.
- Authenticated browser checks at desktop width:
  - overview and partner visibility
  - personal-details deep link
  - edit mode and safe cancel
  - real rewards/member data
  - EN, RU, and AR labels
  - Arabic profile canvas uses `dir="rtl"`
- Mobile regression at 390 × 844:
  - existing account/PWA profile rendered
  - new desktop account rail was absent

Focused tests cover active navigation, deep-link destinations, real member number, partner eligibility, RTL, favorites count, empty orders, recent-order tracking, neutral image fallback, and skin-analysis launch.
