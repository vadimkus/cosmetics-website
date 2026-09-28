# No email to Apple Private Relay addresses (28 Sep 2026)

Vadim: stop all mail notifications to `…@privaterelay.appleid.com` (Hide My Email). They are useless.

## Change

- `lib/email/transporter.ts`: `sendEmail` and `createBulkMailer().send` return
  `{ success: true, skipped: true }` for any address `isApplePrivateRelayEmail()` matches
  (relay domain, plus the existing `@genosys.local` / `apple+` / `deleted+` placeholders), without
  opening SMTP. Covers order confirmations, status updates, reviews, loyalty, newsletter, blog
  announcements. New `EmailSendResult` type.
- `lib/certificate-email.tsx` (own transport): same guard.
- Recipient lists exclude the relay domain via `EXCLUDE_APPLE_RELAY` (`lib/emailHelpers.ts`), so
  counts and campaign stats stay honest: `lib/blogAnnounce.ts`, admin newsletter campaigns (count +
  send), `scripts/announce-blog-post.ts` audience, `scripts/resume-blog-announcement-email.ts`,
  `scripts/send-blog-to-customers.ts`.
- Users who saved a real contact email still get mail there (`getPreferredEmail`), untouched.
- Push notifications (app + web) are not email and are unchanged.
- Test `__tests__/lib/appleRelayEmailSkip.test.ts`; 166 email/newsletter/order tests pass, tsc clean.

## Data at the time

10 active newsletter subscribers on the relay domain (all `source: import`), 141 relay user
accounts (8 with a contact email), 15 orders with a relay `customerEmail`. Rows left as they are;
the filter is reversible.
