# Ksenia Novikova — GENCardW2609267134 / 05111 (26 Sep 2026)

Paid website order. Pushed to MoySklad. Website `moySkladOrderId` linked.

- Customer: Ksenia Novikova, ksenis.legal.mb@gmail.com, +971522749335
- Address: Business bay, Damac Maison Prive A, 314, Dubai
- Item: SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++] Beige ×1, AED 300
- Totals: subtotal 300 + ship 45 + VAT 16.43 (included) = 345
- Stripe paid 26/09/2026, 8:51:58 AM
- SO **GENCardW2609267134** `31a8c3a1-b96a-11f1-0a80-1e4b0058dafc` **Оплачен - Ждет доставки**
- INV **05111** / SHIP **06917** / PAY **06293** / **345 AED**
- Retail PDF `~/Desktop/orders/GENOSYS_Ksenia Novikova_05111.pdf`. Not printed.
- WhatsApp Russian (Дорогая Ksenia)

## "0 purchases" on her profile (fixed 26 Sep 2026)

The order was correct in the DB under her login email and `/api/orders` returned it. The
count was stale client state, not missing data.

- Web: the profile (`app/profile/page.tsx`, `components/pwa/PWAProfilePage.tsx`) and
  `app/orders/page.tsx` fetched orders once on mount. Mobile Safari's back-forward cache
  restored the pre-checkout page without re-running effects. They now refetch on
  `pageshow` / `visibilitychange` (and focus on the PWA page) with `cache: 'no-store'`.
  Commit `952409bd7`, deployed.
- App: `app/profile.js` refetched only when the token changed (the tab stays mounted), and
  counted only pending/completed/delivered or paid orders, so `processing` / `shipped`
  orders were missed. Now `useFocusEffect` refetch, counting every order except
  cancelled/canceled/deleted. Commit `ba6adcb`; OTA Android `eff28edc`, iOS `9ed9281e`
  (runtime 1.13).

## Email typo corrected (26 Sep 2026)

She signed up as `ksenis.legal.mb@gmail.com`; correct address is `ksenia.legal.mb@gmail.com`.
`scripts/fix-ksenia-email-20260926.ts --apply` moved the user (tokenVersion bumped), the order,
analytics rows and the MoySklad counterparty to the new address, then sent welcome, order
confirmation (GENCardW2609267134) and a password-reset link to it. All three accepted by SMTP.
Her own signup password still works with the new email.
