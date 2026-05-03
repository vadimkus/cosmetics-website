# Session: Newsletter welcome email not delivered (2026-04-25)

## Context

- **Report:** A user subscribed via the homepage newsletter block (`HomeNewsletter` in `components/home/HomeDesktopSections.tsx`). The UI showed success copy: *"Thanks — check your inbox for a welcome email"* but **no email arrived**.
- **Visible copy on site (EN):**
  - Kicker: `Newsletter · 1 email per month`
  - Headline: `Join the GENOSYS insiders`
  - Body: `One email a month. Skincare guides written by clinicians, new product launches, and subscriber-only offers — from our Dubai team.`
  - Success: `Thanks — check your inbox for a welcome email.`
  - Footer: `Unsubscribe in one click. We respect your privacy.`

## Root cause

`POST /api/newsletter/subscribe` saved the subscriber to Postgres correctly, then triggered the welcome send like this (simplified):

```ts
sendNewsletterWelcomeEmail({ ... }).catch(err => errorLog(...))
return NextResponse.json({ ok: true, ... })
```

On **Vercel serverless**, the runtime often **freezes or terminates the function** as soon as the HTTP response is returned. A **fire-and-forget** promise (not awaited, not registered with the platform) does not reliably run to completion. The Gmail SMTP round-trip takes longer than the response lifecycle, so **`sendMail` was effectively dropped** — no exception, no user-visible error, and often no log line.

This pattern differs from routes that **await** email (e.g. `app/api/auth/register/route.ts` uses `await sendWelcomeEmail(...)`) or use **`after()`** from `next/server` for work that must finish after the response (used elsewhere: checkout, COD confirmation, mobile orders, admin newsletter campaigns).

## Fix

**Commit:** `9199844d` on `main`

**File:** `app/api/newsletter/subscribe/route.ts`

1. Import `after` from `next/server`.
2. Wrap `sendNewsletterWelcomeEmail` in `after(async () => { ... })` for:
   - **New** subscribers (after `newsletterSubscriber.create`)
   - **Reactivated** subscribers (after `update` when `isActive` was false)
3. Inside the `after` callback, inspect the return value from `sendEmail` (`{ success, messageId, error }`) and log:
   - Success: `debugLog('[newsletter/subscribe] welcome email sent (new|resubscribe):', email, messageId)`
   - Failure: `errorLog('...', email, error)`

**Unchanged behavior:**

- **Already active** subscriber (`existing.isActive === true`): still returns `{ ok: true, alreadySubscribed: true }` with **no** second welcome email (by design, idempotent).
- Honeypot, rate limit, validation, and DB logic unchanged.

## Verification (production)

After deploy to Vercel:

1. Subscribe with a test address from the homepage block.
2. Within ~5–30s, inbox should receive the welcome message from `lib/email/templates.ts` → `newsletterWelcome` (check spam/promotions).
3. **Vercel Function Logs** for `/api/newsletter/subscribe` should show either a **sent** line with `messageId` or a **failed** line with the SMTP error (e.g. missing `GMAIL_APP_PASSWORD`, quota, etc.).

If logs show failure, fix **environment variables** (`EMAIL_USER`/`GMAIL_USER` + `EMAIL_PASSWORD`/`GMAIL_APP_PASSWORD`) per `lib/email/transporter.ts` — that is a separate issue from the lifecycle bug.

## Related documentation

- [NEWSLETTER_SYSTEM.md](./NEWSLETTER_SYSTEM.md) — full newsletter architecture (updated to require `after()` for welcome send on serverless).
- [EMAIL_CHANGELOG.md](./EMAIL_CHANGELOG.md) — entry for this delivery fix.

## Files touched in this session

| File | Change |
|------|--------|
| `app/api/newsletter/subscribe/route.ts` | Welcome email scheduled with `after()`; structured logging |
| `docs/SESSION_CHANGES_2026-04-25_NEWSLETTER_WELCOME_EMAIL_FIX.md` | This document |
| `docs/README.md` | Index entry |
| `docs/NEWSLETTER_SYSTEM.md` | §3.2–3.3 serverless note |
| `docs/EMAIL_CHANGELOG.md` | Changelog entry |

## Follow-up: repeat subscribe UX (2026-05-03)

**Report:** `f.this.that@gmail.com` was submitted through the homepage newsletter form; the UI said to check inbox, but no welcome email was visible.

**Production check:** `POST https://genosys.ae/api/newsletter/subscribe` returned:

```json
{"ok":true,"alreadySubscribed":true}
```

This confirms the public API/database path is working and the address is already active. By design, already-active subscribers do **not** receive a second welcome email, but the homepage UI previously ignored `alreadySubscribed` and always displayed the normal welcome-email success message.

**Fix:** `components/home/HomeDesktopSections.tsx` now reads the API JSON response and shows a distinct already-subscribed message:

- EN: `You’re already on the list. If you missed the welcome email, check Spam or Promotions.`
- AR/RU equivalents added inline with the existing localized newsletter copy.

**Verification:** Focused IDE lints for `components/home/HomeDesktopSections.tsx` showed no errors. Recent Vercel error logs showed no newsletter SMTP failure entries; success logs are debug-only unless `DEBUG_LOG=true`.
