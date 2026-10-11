# Delivery times: one standard everywhere (11 Oct 2026)

Vadim: the FAQ wording is the standard, use it everywhere. **Dubai 1-2 hours, other emirates 24-36 hours.**

## Website (EN / RU / AR)

- `messages/*.json`: checkout estimate (was 1-3 business days), success page other-emirates time (was 1-2 business
  days), order-confirmation processing line (was "ship within 1-2 business days"), delivery description (EN/AR said
  "1 hour").
- `app/success/SuccessClient.tsx`, `app/checkout/CheckoutClient.tsx`: English fallbacks (were 1-2 / 2-3 business days).
- `components/schema/GeoFaqSchema.tsx`: SEO FAQ answer in three languages (was 1-3 business days).
- `app/delivery/DeliveryPageClient.tsx`: hero (was same-day / next day) and timing card (was "one hour").
- `app/locations/LocationsPageClient.tsx`, `app/locations/[city]/page.tsx`: other emirates (was 48 hours via Quiqup).
- `public/llms.txt`.

## Mobile app (`genosys-mobile-app`)

- `i18n/messages/en.json` FAQ a2 and a5 (were 1-3 business days; Sharjah 1-2 hours, others 48 hours);
  `ru.json` / `ar.json` a3 (were 1-3 business days, next-day express). Reaches users with the next OTA.

## Not changed (flagged)

- Returns differ: site FAQ 7 days, `app/delivery/page.tsx` schema 10 days, app RU/AR FAQ 30 days.
