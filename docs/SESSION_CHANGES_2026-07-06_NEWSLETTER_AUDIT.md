# Session Changes — Newsletter Signup Audit + Mobile Capture Fix (2026-07-06)

Commit `fb60d7ca`.

## Investigation

Traced the newsletter feature end to end. The earlier home-page audit had
flagged the signup form as "stubbed — no backend wiring yet." That is **not
true** — the backend is fully live:

- `POST /api/newsletter/subscribe` — validates email, honeypot (`website`
  field), IP rate-limit (10 / 10 min), idempotent resubscribe, links to an
  existing user when the email matches, and sends the welcome email via Next
  16 `after()` (survives the serverless response lifecycle).
- `NewsletterSubscriber` + `NewsletterCampaign` Prisma models.
- Unsubscribe page (`app/newsletter/unsubscribe`) with token + resubscribe.
- Admin tab: list / filter / export subscribers, send campaigns (capped 2000,
  CSRF-protected — verified in the earlier admin audit).

Live checks: honeypot path returns `{ok:true}` and creates nothing; invalid
email returns 400. Production DB has 4 active subscribers, all `source:
homepage` (most recent Apr 27).

## The real gap (fixed)

The only public signup form was the **desktop-only** homepage hero
(`HomeDesktopSections` is `hidden md:block`). Mobile web visitors are
redirected to `/products` by `MobileRedirect` and the content footer is hidden
on mobile — so **mobile/PWA users had no way to subscribe at all**. On a
mobile-majority store that's most of the audience.

### Fix
- **`components/NewsletterSignup.tsx` (new)** — compact, self-contained signup
  card (mail icon + heading + body + pill input/button + privacy line). Same
  `/api/newsletter/subscribe` endpoint, same honeypot, full EN/AR/RU + RTL,
  success / already-subscribed / rate-limit / error states.
- **`app/products/ProductsPageClient.tsx`** — renders the card at the bottom of
  the product list (`source: 'products'`), so the page every mobile visitor
  lands on now captures emails. Also shows on desktop `/products` (harmless;
  distinct page from the homepage form).
- **`HomeDesktopSections.tsx`** — corrected the stale "stubbed" comment.

## Verification
- `tsc --noEmit` + production build clean (433 pages).
- Local `next start`: card is server-rendered on `/products`, verified on-brand
  at mobile width via screenshot.
- Endpoint confirmed working against production (honeypot + invalid-email paths).

## Not changed (by design)
- No newsletter signup in the native app — app users are already logged-in
  customers reachable via push/order emails; adding a newsletter form there is
  a product decision, not a gap. Documented here for future consideration.
- Single opt-in (subscriber active immediately + welcome email) — standard for
  this market; left as-is.
