# Newsletter System

Full reference for the GENOSYS newsletter system: the public subscribe/unsubscribe flow
and the admin composer & subscriber management tab inside `/admin`.

> **Scope**: subscriber capture, unsubscribe, admin subscriber management, campaign
> composer, test-send, batched production send, CSV export, campaign history/audit.
>
> **Explicitly out of scope** (not built): scheduled sends, click tracking, open
> tracking, A/B testing, segments beyond locale+source, drip automations. All of
> those can be layered on top later without schema changes.

---

## 1. Architecture at a glance

```
┌─────────────────────────────┐        ┌──────────────────────────────────┐
│  Public homepage / footer   │        │  Admin → /admin → "Newsletter"   │
│  HomeNewsletter form        │        │  NewsletterTab.tsx               │
│  (honeypot + rate limit)    │        │  Stats · Composer · History      │
└──────────────┬──────────────┘        └──────────────┬───────────────────┘
               │                                      │
               │ POST /api/newsletter/subscribe       │ GET/POST /api/admin/newsletter/*
               │                                      │
               ▼                                      ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                            Prisma · Postgres                              │
│   NewsletterSubscriber   (email, locale, source, token, isActive, …)      │
│   NewsletterCampaign     (subject, bodyMarkdown, bodyHtml, status, …)     │
└──────────────────────┬────────────────────────────────────────────────────┘
                       │
                       ▼
                ┌─────────────────────────────────┐
                │  lib/email (Gmail SMTP sender)  │
                │  newsletterWelcome template     │
                │  newsletterCampaign template    │
                └─────────────────────────────────┘
```

Public subscribe and admin send share:

- `lib/newsletter.ts` — email validation, locale/source normalization, crypto unsubscribe token
- `lib/newsletterMarkdown.ts` — XSS-safe markdown → HTML (used for preview **and** production render)
- `lib/email/templates.ts` → `newsletterCampaign` — branded Apple-style wrapper, localized footer, per-subscriber unsubscribe link
- `lib/email/senders.ts` → `sendNewsletterCampaignEmail`, `sendNewsletterWelcomeEmail`

---

## 2. Data model

### 2.1 `NewsletterSubscriber`

Table: `newsletter_subscribers` (Prisma: `NewsletterSubscriber`).

| Column | Type | Notes |
|---|---|---|
| `id` | `cuid` | Primary key |
| `email` | `text` | **Unique**. Always lowercased/trimmed on write. |
| `locale` | `en` \| `ar` \| `ru` | Used for localized welcome + campaign filtering. Default `en`. |
| `source` | `homepage` \| `footer` \| `checkout` \| `admin` \| `import` | How/where they subscribed. |
| `isActive` | `boolean` | Soft-delete flag. Unsubscribe sets this to `false` rather than deleting the row. |
| `unsubscribeToken` | `text` | **Unique**. `crypto.randomBytes(24).toString('base64url')`. Rotated on resubscribe. |
| `userId` | `text?` | Optional FK-by-value link to `users.id` if email matches a registered account. |
| `subscribedAt` | `timestamp` | Set on subscribe or resubscribe. |
| `unsubscribedAt` | `timestamp?` | Set on unsubscribe, cleared on resubscribe. |
| `lastSentAt` | `timestamp?` | Updated after every successful campaign send for that subscriber. |
| `ipAddress` | `text?` | Best-effort from `X-Forwarded-For` at signup time; may be `null`. |
| `userAgent` | `text?` | First 500 chars at signup time. |

**Indexes**: `isActive`, `(locale, isActive)`, `email`. The composite index is what makes
"all active English subscribers" counts + scans fast; most campaign queries hit it.

### 2.2 `NewsletterCampaign`

Table: `newsletter_campaigns` (Prisma: `NewsletterCampaign`).

Added **2026-04-17**. Migration: `prisma/migrations/20260417_add_newsletter_campaigns/`.

Every admin send — test or production — creates exactly one row. This is the audit log.

| Column | Type | Notes |
|---|---|---|
| `id` | `cuid` | |
| `subject` | `text` | Max 200 chars (enforced API-side). |
| `bodyMarkdown` | `text` | Raw markdown from composer. Max 50,000 chars. |
| `bodyHtml` | `text` | Rendered snippet (inner HTML; branded wrapper added at send time). |
| `localeFilter` | `en` \| `ar` \| `ru` \| `null` | `null` = all locales. |
| `sourceFilter` | `text?` | e.g. `homepage`, or `null` for all sources. |
| `isTest` | `boolean` | `true` for test-to-my-email sends. |
| `testEmail` | `text?` | Only set when `isTest=true`. |
| `totalRecipients` | `int` | Pre-send count. |
| `sentCount` | `int` | Incremented after each successful send; persisted every page (100 rows). |
| `failedCount` | `int` | Same cadence. |
| `status` | `draft` \| `sending` \| `sent` \| `failed` \| `cancelled` | Transition: `sending` → `sent`/`failed`. |
| `sentByEmail` | `text` | The admin who triggered the send (from signed session). |
| `startedAt` | `timestamp?` | Set when status flips to `sending`. |
| `completedAt` | `timestamp?` | Set on terminal status. |
| `errors` | `text?` | JSON array `[{ email, error }]`, capped at 50 entries to avoid bloat. |

**Indexes**: `status`, `createdAt` — admin history view is `ORDER BY createdAt DESC LIMIT 20`.

---

## 3. Public subscribe flow

### 3.1 UI

`components/home/HomeNewsletter` (inside `components/home/HomeDesktopSections.tsx`) renders on:

- Homepage "Join the GENOSYS insiders" section (desktop)
- Any component that mounts it

States:
- `idle` → form visible
- `loading` → button shows "Subscribing…" spinner, input disabled
- `success` → form replaced with a green success panel
- `error` → inline red message beneath the form

Hidden **honeypot** input `website` — off-screen, `tabindex=-1`, `aria-hidden`. Humans never
see it; naïve bots fill it and get silently 200'd (see server behavior below).

### 3.2 API

`POST /api/newsletter/subscribe` — public endpoint, no auth required.

Request body:
```json
{
  "email": "user@example.com",
  "locale": "en|ar|ru",
  "source": "homepage|footer|checkout|admin|import",
  "website": ""
}
```

Response:
- `200 { ok: true, alreadySubscribed: true|false }` — success or idempotent re-submit
- `400 { error: "…" }` — invalid email
- `429 { error: "Too many attempts…" }` — rate limit hit

**Protections** (defense in depth):

1. **Body size limit** via `requireBodySizeLimit` — refuses >default cap.
2. **IP+UA rate limit** via `rateLimitSimple` — 10 attempts per 10 minutes per client.
3. **Honeypot** — if `website` is non-empty, returns 200 silently. Bots think they
   succeeded; we never insert the row.
4. **Email validation** via `lib/newsletter.ts::isValidEmail` — pragmatic regex, SMTP
   is the real truth.
5. **No CSRF** — by design. Public write, non-destructive, auth-less. Rate limit +
   honeypot are the right-sized defenses (matches the industry newsletter pattern).
6. **Idempotent** — same email twice is a silent reactivation, not an error.

7. **Welcome email must use `after()` on Vercel** — The handler returns JSON as soon
   as the DB write succeeds. The actual SMTP send is wrapped in Next.js 16's
   `after()` from `next/server` (same pattern as `/api/auth/register` post-response
   work, `/api/checkout`, admin campaign batching, etc.). A plain fire-and-forget
   `sendNewsletterWelcomeEmail(...).catch(...)` **does not complete** on serverless:
   the runtime freezes after `NextResponse.json`, so subscribers never get mail.
   See [SESSION_CHANGES_2026-04-25_NEWSLETTER_WELCOME_EMAIL_FIX.md](./SESSION_CHANGES_2026-04-25_NEWSLETTER_WELCOME_EMAIL_FIX.md).

### 3.3 Welcome email

Template: `emailTemplates.newsletterWelcome` in `lib/email/templates.ts`.

- Apple-style layout (centered, 580px max-width, `-apple-system` font stack)
- Localized EN / AR / RU (dir + textAlign switch for AR)
- Footer contains the unsubscribe link built via `buildUnsubscribeUrl`

Send is **best-effort for the subscriber's UX** (HTTP 200 once the row is saved),
but the implementation **must** schedule SMTP inside `after()` so delivery actually
runs on Vercel. Errors are logged (`success` / `messageId` vs `error`); they do not
fail the HTTP response.

### 3.4 Unsubscribe page

Route: `app/newsletter/unsubscribe/page.tsx` (server component) + `actions.ts`
(server actions for confirm / resubscribe).

Three states driven by the `token` query param and subscriber row:

1. Valid token + active subscriber → "Confirm unsubscribe" UI with big primary button
2. Valid token but already inactive OR `?done=1` → success panel with "Resubscribe" + "Back home"
3. Missing / bogus token → generic "Invalid link" message

**Security notes:**
- Server actions are idempotent and **fail silently** on bad tokens — we intentionally
  don't leak whether a token exists.
- Resubscribe action regenerates the row's `unsubscribeToken`, meaning any old forwarded
  unsubscribe link stops working.
- Page is `noindex, nofollow` — never serve unsubscribe URLs in sitemaps or to crawlers.
- Localized from the subscriber's stored locale, not the browser locale.

---

## 4. Admin composer & subscriber management

### 4.1 Entry point

Admin dashboard → **Newsletter** tab. Added to `components/admin/AdminTabNavigation.tsx`
with the `Mail` icon. Tab contents live in `components/admin/NewsletterTab.tsx`
(loaded via `next/dynamic`, SSR off — same pattern as chatbot/blog tabs).

Auth is inherited from the main admin page:
- Prefers signed `admin-session` httpOnly cookie (set on admin login)
- Falls back to `X-Admin-Email` header for legacy callers
- CSRF token sent via `X-CSRF-Token` header for every write

### 4.2 Sections

```
┌─────────────────────────────────────────────┐
│ Stats header · Active · EN · AR · RU counts │
├─────────────────────────────────────────────┤
│ Composer                                    │
│   Subject (max 200)                         │
│   Body (markdown, live preview modal)       │
│   Locale filter · Source filter · Count     │
│   Test email + "Send test"                  │
│   "Send to N subscribers" (confirm dialog)  │
├─────────────────────────────────────────────┤
│ Recent campaigns (last 10)                  │
│   Polling updates status during sending     │
├─────────────────────────────────────────────┤
│ Subscribers table                           │
│   Manual add · Search · Locale/status filter│
│   Per-row Unsubscribe · CSV export          │
└─────────────────────────────────────────────┘
```

### 4.3 Markdown composer

Supported syntax (via `lib/newsletterMarkdown.ts`):

| Syntax | Output |
|---|---|
| `# H1`, `## H2`, `### H3` | Styled heading |
| `**bold**` or `__bold__` | `<strong>` |
| `*italic*` or `_italic_` | `<em>` |
| `[text](https://…)` or `[text](mailto:…)` | Safe `<a>` (only http/https/mailto schemes) |
| `- item` | `<ul><li>` list |
| `> quote` | Styled blockquote |
| `---` on its own line | `<hr>` |
| Bare URLs (`https://…`) | Autolinked |
| Blank line | Paragraph break |
| Single newline inside paragraph | `<br>` |

Explicitly **not** supported (deliberate, safety > flexibility):
- Raw HTML — all HTML is escaped first; `<script>`, `<img onerror>`, etc. render as
  literal text. Verified by 11/11 tests in `scripts/check-newsletter-markdown.ts`.
- Images — email image handling is its own beast (CIDs, blocked-by-default in Gmail);
  add later when we have a CDN-hosted image story.
- Tables, numbered lists, code blocks — not newsletter constructs.
- Any URL scheme other than `http`, `https`, `mailto` — blocks `javascript:`, `data:`, etc.

### 4.4 Filters

| Filter | Values |
|---|---|
| `localeFilter` | `all` (null) · `en` · `ar` · `ru` |
| `sourceFilter` | `all` (null) · `homepage` · `footer` · `checkout` · `admin` |

Combined with the hard constraint that only `isActive = true` subscribers receive
campaigns (including re-subscribers whose token was rotated).

The composer displays a live "Recipients: N" count driven by the stats payload,
so the admin always knows the blast radius before pressing send.

### 4.5 Test send vs production send

| Mode | Behavior |
|---|---|
| **Test** | Requires `testEmail` (validated). Sends **synchronously**, returns final campaign row with `status=sent\|failed`. Does NOT update any subscriber's `lastSentAt`. Campaign row has `isTest=true`. |
| **Production** | Creates campaign row with `status=sending`, returns immediately. Actual sending runs via `next/server` `after()` on the same invocation. Frontend polls `GET /api/admin/newsletter/campaigns/[id]` every 2 s until `status !== 'sending'`. |

Production send behavior:

- Paginates subscribers 100 at a time (cursor-based, stable ordering by `id`)
- Throttles 150 ms between sends (≈ 6.6 emails/sec; comfortably under Gmail SMTP limits)
- Persists progress (`sentCount`, `failedCount`, truncated `errors` JSON) after each page
- Updates each subscriber's `lastSentAt` on successful send
- Hard cap: **2,000 recipients per campaign** — refuses pre-flight. Narrow the filter
  or split the send.

### 4.6 Confirm-before-send dialog

Clicking "Send to N subscribers" triggers a native `confirm()` with:
- Estimated recipient count
- Active locale and source filter
- "This cannot be undone"

Deliberately kept minimalist — admins will be sending at most a handful of campaigns
per week; a full modal with a typed-confirmation gate would be overkill.

### 4.7 CSV export

`GET /api/admin/newsletter/subscribers/export?locale=…&isActive=…`

- Authenticates via the `admin-session` httpOnly cookie (set on admin login);
  `window.open` auto-sends it on same-origin GETs.
- Filters respect the table's locale + status filters (not the search box).
- Emits UTF-8 CSV with BOM (`\uFEFF`) so Excel renders Cyrillic/Arabic cleanly.
- Columns: `email, locale, source, isActive (yes|no), subscribedAt, unsubscribedAt, lastSentAt`.
- Cache-Control `no-store` so sensitive list never gets cached by any proxy.
- Filename: `genosys-subscribers-YYYY-MM-DD.csv`.

---

## 5. API reference

All admin endpoints require:
- Signed admin session (cookie) **or** `X-Admin-Email` header for a known admin account
- CSRF token via `X-CSRF-Token` on writes

### 5.1 Public

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/newsletter/subscribe` | Public subscribe form target |

### 5.2 Admin — subscribers

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/admin/newsletter/subscribers` | Paginated list + aggregate stats. Query: `locale`, `isActive=true\|false`, `source`, `search`, `limit` (≤500, default 100), `offset`. |
| `POST` | `/api/admin/newsletter/subscribers` | Manual add. Idempotent reactivate with fresh token if email exists. |
| `DELETE` | `/api/admin/newsletter/subscribers/[id]` | Soft unsubscribe. |
| `PATCH` | `/api/admin/newsletter/subscribers/[id]` | Flip `isActive`, change `locale`. Rotates token on reactivation. |
| `GET` | `/api/admin/newsletter/subscribers/export` | UTF-8 CSV download. |

### 5.3 Admin — campaigns

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/admin/newsletter/campaigns` | List newest 20 by default. |
| `POST` | `/api/admin/newsletter/campaigns` | Create + send (test or production). Body: `{ subject, bodyMarkdown, localeFilter, sourceFilter, isTest, testEmail? }`. |
| `GET` | `/api/admin/newsletter/campaigns/[id]` | Single campaign for status polling. |

### 5.4 Public — unsubscribe

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/newsletter/unsubscribe?token=…` | Unsubscribe page (three states). |
| `POST` | same, via `unsubscribeAction` server action | Confirm unsubscribe. |
| `POST` | same, via `resubscribeAction` server action | Resubscribe from success state. |

---

## 6. Security model

| Surface | Controls |
|---|---|
| Public subscribe | Rate limit (10/10min per IP+UA) · Honeypot · Body size cap · Email validation |
| Unsubscribe | Cryptographic token (24 bytes base64url) · Token rotation on resubscribe · Idempotent silent-fail on bad token · `noindex` |
| Admin reads | Signed session cookie (HMAC-SHA256, 24h) or legacy header auth |
| Admin writes | Above + CSRF header |
| Campaign body | HTML escaped first · whitelist-only URL schemes · no raw HTML rendered · XSS tests in `scripts/check-newsletter-markdown.ts` |
| CSV export | Auth-gated · `Cache-Control: no-store` · same-origin only (cookie scope) |

### Threat model notes

- **Subscriber list poisoning** (attacker signs up victims): rate limit + honeypot cut
  this to annoyance-level. Every welcome email includes a one-click unsubscribe.
- **Stolen unsubscribe link**: rotated on every resubscribe, so forwarded-link abuse
  has a bounded window.
- **Admin account compromise**: every send records `sentByEmail`; CSRF header stops
  classic CSRF. No recovery from a full credential compromise other than rotating
  admin session secret.
- **XSS in newsletter body**: renderer escapes HTML first; all 11 smoke tests green.

---

## 7. Operations runbook

### 7.1 Sending a campaign — happy path

1. Log in to `/admin` as an admin user.
2. Click the **Newsletter** tab.
3. Draft subject + body in the composer. Use **Preview** to see rendered HTML.
4. Choose locale/source filters. Watch the "Recipients: N" indicator.
5. Enter your own email under "Test email" → click **Send test**.
6. Check your inbox — verify copy, links, Arabic/Russian rendering if targeting those locales.
7. Click **Send to N subscribers** → confirm the dialog.
8. Watch "Recent campaigns" table — status flips from "Sending…" → "Sent" with live
   `sent/total` count updating every ~2 s.

### 7.2 Something went wrong — diagnostics

| Symptom | Where to look |
|---|---|
| Test email didn't arrive | Spam folder → Gmail SMTP credentials (`GMAIL_USER`/`GMAIL_APP_PASSWORD`) → Sentry for `[email]` breadcrumbs → campaign row `errors` column |
| Campaign stuck in "Sending…" | Serverless function likely timed out mid-send. Query DB for `sentCount` — anything already sent won't resend. Create a new campaign targeting only the not-yet-sent emails if needed. |
| `Recipient count exceeds per-campaign cap` | Narrow the filter (try locale-only) or split into two campaigns |
| Unsubscribe link 404s on live site | Check `NEXT_PUBLIC_SITE_URL` — `buildUnsubscribeUrl` uses it to prefix the path |
| Export button downloads a 401 page | Admin session cookie missing/expired — log out and back in at `/admin/login` |

### 7.3 Scaling past 2,000 subscribers

The 2,000 cap is intentional — above that, Vercel's per-invocation timeout (60 s on Pro
with current delays) becomes a hard limit and you'll get silent partial sends.

**Migration path when we cross this**:

1. Extract the `runProductionSend` function into a background job (Inngest / Trigger.dev
   / Vercel Cron + self-resuming cursor).
2. Keep the campaign row schema untouched — it was designed to be pagination-friendly.
3. Drop the cap, or raise it (e.g., to 50,000) and let the job resume via cursor.

Until then: split larger sends by locale or by time (e.g., send to AR today, EN tomorrow).

---

## 8. Files reference

### Data & libraries

| File | Purpose |
|---|---|
| `prisma/schema.prisma` | `NewsletterSubscriber` + `NewsletterCampaign` models |
| `prisma/migrations/20260417_add_newsletter_subscribers/` | Initial subscriber table |
| `prisma/migrations/20260417_add_newsletter_campaigns/` | Campaign audit table |
| `lib/newsletter.ts` | Email normalization, validation, token generation, unsubscribe URL builder |
| `lib/newsletterMarkdown.ts` | XSS-safe Markdown → HTML renderer |
| `lib/email/templates.ts` | `newsletterWelcome`, `newsletterCampaign` |
| `lib/email/senders.ts` | `sendNewsletterWelcomeEmail`, `sendNewsletterCampaignEmail` |

### Public surface

| File | Purpose |
|---|---|
| `app/api/newsletter/subscribe/route.ts` | Public subscribe POST |
| `app/newsletter/unsubscribe/page.tsx` | Unsubscribe UI (three states) |
| `app/newsletter/unsubscribe/actions.ts` | Server actions for confirm/resubscribe |
| `components/home/HomeDesktopSections.tsx` | `HomeNewsletter` form (desktop homepage) |

### Admin surface

| File | Purpose |
|---|---|
| `app/admin/page.tsx` | Adds `'newsletter'` to tab state and renders `NewsletterTab` |
| `components/admin/AdminTabNavigation.tsx` | Newsletter tab with `Mail` icon |
| `components/admin/NewsletterTab.tsx` | Stats, composer, preview modal, history, subscribers table |
| `app/api/admin/newsletter/subscribers/route.ts` | `GET` list + stats, `POST` add |
| `app/api/admin/newsletter/subscribers/[id]/route.ts` | `DELETE` (soft), `PATCH` |
| `app/api/admin/newsletter/subscribers/export/route.ts` | UTF-8 CSV download |
| `app/api/admin/newsletter/campaigns/route.ts` | `GET` list, `POST` create + send (test/prod) |
| `app/api/admin/newsletter/campaigns/[id]/route.ts` | `GET` single campaign for polling |

### Test helpers

| File | Purpose |
|---|---|
| `scripts/check-newsletter-verify.ts` | Inspect latest subscribers in DB (`list` \| `token`) |
| `scripts/check-newsletter-markdown.ts` | 11 XSS + happy-path smoke tests for the markdown renderer |

---

## 9. Environment variables

Reuses the existing email stack — nothing newsletter-specific required.

| Var | Used for |
|---|---|
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Nodemailer transporter in `lib/email/transporter.ts` |
| `NEXT_PUBLIC_SITE_URL` | Unsubscribe URL prefix; falls back to `https://genosys.ae` |
| `ADMIN_SESSION_SECRET` / `JWT_SECRET` | Signed admin session token HMAC |

---

## 10. Known limitations (and their planned fixes)

| Limitation | Fix when needed |
|---|---|
| 2,000 recipient cap per campaign | Move `runProductionSend` into Inngest/Trigger.dev |
| No open or click tracking | Add pixel + redirect link per campaign (requires `campaign_recipients` table) |
| No scheduled sends | Trivial — add `scheduledFor` column + Vercel cron sweeper |
| No drip automations (welcome series, post-purchase) | Requires rules engine; out of scope for v1 |
| Admin-only campaigns — no approval workflow | v1 assumes admin == marketer == sender |
| Single-segment filtering (locale + source) | Add tag system if we need richer targeting |

---

## 11. Changelog

| Date | Change |
|---|---|
| 2026-04-17 | **v1 admin composer shipped.** `NewsletterCampaign` model + migration. Admin `/admin` → Newsletter tab with composer, preview, test/production send, history polling, subscribers table, CSV export. Markdown renderer with 11/11 XSS tests. |
| 2026-04-17 | `NewsletterSubscriber` model + migration. Public `POST /api/newsletter/subscribe` with rate limit + honeypot. Welcome email (EN/AR/RU). Unsubscribe page with three states + token rotation. `HomeNewsletter` wired on desktop homepage. |
