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

## Returns: 10 days everywhere (Vadim, 22:22)

- Website FAQ (EN/RU/AR, two answers each) and `app/terms/TermsClient.tsx` were 7 days; Google return schema
  (`merchantReturnDays` in Product, ProductsList, HomeItemList, CollectionPage schemas) was 14. All now 10, matching
  the delivery page and `returnPeriodValue`.
- App: EN FAQ a6/a10, terms p1, return checklist were 7 days; RU/AR FAQ a2 said 30 days (14 opened). All now 10 days,
  unopened, original packaging.
- Still different (not asked): refund processing 3-5 business days (delivery page) vs 5-7 (FAQ).
- The live FAQ reads `FaqItem` rows from the DB, not `messages/*.json`: two items (return policy, return or exchange)
  updated in EN/RU/AR by `scripts/faq-returns-10-days-20261011.ts --apply`, then `faq` tag and `/faq`, `/ru/faq`,
  `/ar/faq` revalidated. Chatbot facts (`lib/chatbot/config.ts`) also 10 days. Live check: 8 × "within 10 days", 0 × 7.
