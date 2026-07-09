# Session Changes — 2026-07-09 — Post-Delivery Review Request Email (Cron)

## What

Daily cron that emails customers ~5 days after their order is DELIVERED:
"How was your order?" with each product linked to its review section and the
+50 points per review incentive front and center.

## Pieces

1. **Schema**: `Order.reviewRequestSentAt DateTime?` + migration
   `20260709030000_add_order_review_request_sent` (applied by
   `prisma migrate deploy` during the Vercel build).
2. **Email** (`lib/email/loyalty.ts` → `sendReviewRequestEmail`): Apple-clean
   template matching the loyalty suite — star icon, order number, product
   rows (thumbnail + name + "Rate it" button linking to
   `/products/{id}#reviews`), copy: 50 pts per review, 100 pts = AED 5.
3. **Cron route** `app/api/cron/review-requests/route.ts`:
   - Auth: `Authorization: Bearer CRON_SECRET` (same as analytics cron;
     secret already present in Vercel env).
   - Selection: `status = DELIVERED`, `reviewRequestSentAt IS NULL`,
     `updatedAt` 4–8 days ago (updatedAt ≈ when DELIVERED was set).
   - Skips (stamped, no email): partner-track accounts, Apple relay
     addresses, orders where every product is already reviewed.
   - Filters: paid lines only (free promo masks excluded), de-duplicated,
     minus already-reviewed products, max 6 per email.
   - Idempotent: every processed order gets `reviewRequestSentAt` stamped;
     failed sends stay unstamped and retry while inside the window.
   - Caps at 40 emails/run, `maxDuration 60`.
4. **vercel.json**: cron `/api/cron/review-requests` daily at 05:00 UTC
   (09:00 UAE) + 60s function duration.

## Verification

- tsc clean (two Order-shape fixtures updated with the new field:
  `useProfileState` test mock and the COD fallback object), affected Jest
  suite passes (7 tests).
- Test email sent successfully to Vadim (f.this.that@gmail.com),
  order `TEST-REVIEW-REQUEST`, products 53 + 66.

## Notes

- The email the user received earlier tonight was the existing
  "points earned" DELIVERED email — this review-request email is new and
  starts flowing to real customers on the first cron run after deploy
  (orders delivered 4–8 days prior).
