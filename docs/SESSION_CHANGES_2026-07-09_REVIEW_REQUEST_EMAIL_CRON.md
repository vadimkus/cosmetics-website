# Session Changes — 2026-07-09 — Post-Delivery Review Request Email (Cron)

## What

Daily cron that emails customers ~5 days after delivery: "How was your
order?" with each unreviewed product from the order and a "Rate · +50 pts"
button linking straight to that product's reviews section. Completes the
honest-ratings strategy (review points bonus shipped 2026-07-08).

## Pieces

### Schema (migration `20260709030000_add_order_review_request_fields`)

- `Order.deliveredAt` — stamped on the FIRST transition to DELIVERED
  (`updateOrderStatus` in `lib/orderStorageDb.ts`; never moved on re-marking).
- `Order.reviewRequestSentAt` — idempotency stamp for the email.
- Migration applied to production manually (same `migrate deploy` the build
  runs).

### Email (`lib/email/reviewRequest.ts`)

Apple-clean template matching the loyalty suite: product rows with image,
name, and a dark "Rate · +50 pts" pill linking to
`{SITE_URL}/products/{slug}#reviews`; headline points math ("up to N points
= AED X off"). English-only, like the other loyalty emails.

### Cron (`app/api/cron/review-requests/route.ts`)

- Schedule: daily 05:00 UTC = 09:00 UAE (`vercel.json`), CRON_SECRET auth
  (secret already present in Vercel env), maxDuration 60.
- Window: orders first DELIVERED **5–21 days ago** (fallback to `updatedAt`
  for orders delivered before `deliveredAt` existed). Older orders never
  send — no blast at rollout.
- One email per customer per run; multiple qualifying orders merge into a
  single email and all get stamped.
- Stamped-without-sending (never reprocessed): guests (no account → can't
  review), partner-track accounts (points pitch doesn't apply), Apple-relay
  emails, orders whose paid products are all reviewed or hidden.
- Free promo lines (price 0) excluded from the product list.
- Cap: 40 emails/run.
- Test hooks (secret-protected): `?dryRun=1` (report only, no stamps),
  `?testEmail=x@y.com` (sends the first candidate's email to that address,
  no stamps).

## Verified

- tsc/ESLint clean; `useProfileState` test fixture updated for the new
  Order fields (7/7 pass); cod-confirmation fallback literal updated.
- Live dry-run against production DB: 31 candidate orders → 23 would-send,
  5 skips (Apple relay etc.). Numbers look sane.
- Test email sent to f.this.that@gmail.com (sample rendered from a real
  candidate's data).

## First-Run Note

On its first production run (09:00 UAE the morning after deploy) the cron
sends to the ~23 eligible customers currently in the 5–21-day window, then
settles into a small daily trickle.
