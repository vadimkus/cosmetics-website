# Newsletter send to ordering customers — 2026-08-24

## Ask

Send the newsletter to all registered users.

## What the numbers showed

| Segment | Count |
|---|---|
| Registered accounts | 973 |
| Never subscribed to the newsletter | 968 |
| Active newsletter subscribers | 12 |
| Ever unsubscribed | 0 |
| Distinct addresses with an order | 246 |

Three things made "all 973" the wrong default:

1. Those accounts were created to shop. 968 of them never asked for marketing.
2. Everything sends through one Gmail mailbox — order confirmations, invoices,
   password resets and campaigns share `smtp.gmail.com`. 973 fits inside the
   2,000/day Workspace cap, but spam complaints on a cold blast degrade the
   reputation of the mailbox that carries transactional mail.
3. 968 had no unsubscribe token, since tokens live on `newsletter_subscribers`
   rows. They were not sendable without creating those rows first.

Vadim chose the 246 with a purchase history.

## Sent

`power-solution-sws-arbutin-2-percent` to 244 customers — 246 minus 2 already on
the list.

| Locale | Sent | Failed |
|---|---|---|
| EN | 233 | 0 |
| RU | 10 | 0 |
| AR | 1 | 0 |

Active newsletter list: 12 → 256.

Logged as three `NewsletterCampaign` rows with `sourceFilter: 'import'`, so the
admin history shows the subject each language group received.

## New

`scripts/send-blog-to-customers.ts` — sends a published post to addresses with
order history. Creates a subscriber row per recipient before sending so every
email carries a working unsubscribe link. Skips anyone already on the list in
either state, so active subscribers are not sent the post twice and opt-outs
stay out. Locale comes from the most recent order. Capped at 600 per run to
leave daily quota for transactional mail.

## Not done

Registered accounts with no order history (~727) were not emailed and no script
reaches them.

## Also this session

- Vercel production deployment failed on `P1001: Can't reach database server`
  during `prisma migrate deploy`. Transient Neon cold start, not a code fault —
  the next build went green with no intervention.
- Test mobile push sent to `f.this.that@gmail.com` to verify the notification
  tap routing OTA. That address is on the newsletter list but has no orders, so
  the customer send correctly skipped it.
