# Meta Pixel + Conversions API (genosys.ae)

Added 2 Oct 2026 so Meta ads can optimise for and report website sales.

## IDs

- Dataset (Pixel) **genosys.ae**, ID `1644419117314458`, owner business portfolio `148659003111195`,
  connected to ad account `1123989471745207`. Created in Events Manager; no dataset category.
- The Pixel ID is public and lives in `lib/metaPixel.ts` (`META_PIXEL_ID`), like the GA4 ID.

## Browser (`lib/metaPixel.ts`)

- `fbevents.js` is loaded only after the cookie banner is accepted (`genosys_cookie_consent = accepted`).
  Before that nothing is sent and no `_fbp` cookie exists. Declining later calls `fbq('consent','revoke')`
  (`lib/consent.ts`).
- Events mirror GA4 from `lib/analytics.ts`: PageView (`trackPageView`), ViewContent (`trackProductView`,
  fired by `components/ProductViewTracker.tsx` on EN/RU/AR product pages; this also fixed GA4 `view_item`,
  which never fired before), AddToCart, InitiateCheckout, Purchase.
- Purchase uses `eventID = purchase_<orderNumber>` (success page, card and COD).

## Server (`lib/metaCapi.ts`)

- Purchase only, `event_id = purchase_<orderNumber>` → Meta deduplicates it against the browser event.
- Sent only when `META_CAPI_ACCESS_TOKEN` is set and the buyer accepted cookies (`metaConsent: true` in the
  checkout request).
- Card: `create-payment-intent` stores `_fbp`, `_fbc`, IP, user agent and page URL in the PaymentIntent
  metadata (`meta_*` keys); `webhooks/stripe` → `payment_intent.succeeded` sends the Purchase after the
  confirmation emails, on every succeeded event (the payment-status poll can claim the order first).
- COD: `orders/cod-confirmation` sends it in the existing `after()` block, after the emails.
- Email, phone (normalised to 971…), emirate as city, and country `ae` are SHA-256 hashed.
- Best-effort: never throws, 4 s timeout, errors logged.
- Mobile app orders are not sent (would need the Meta app SDK).

## Environment (Vercel → Production)

| Variable | Value |
|---|---|
| `META_CAPI_ACCESS_TOKEN` | Events Manager → dataset genosys.ae → Settings → Conversions API → Generate access token |
| `META_CAPI_TEST_EVENT_CODE` | optional, from Test events tab; remove after testing |
| `META_GRAPH_VERSION` | optional, default `v24.0` |

Without the token the server side is a no-op; the browser pixel works on its own.

## Tests

`__tests__/lib/metaCapi.test.ts`, `__tests__/lib/metaPixel.test.ts`.
