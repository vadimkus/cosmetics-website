# Session Changes — April 17, 2026 (Newsletter Admin)

## Summary

Shipped the **admin composer page** for the newsletter system as a new **Newsletter tab**
inside `/admin` (not a standalone route — per explicit ask "do this as part of admin
dashboard"). This is the follow-up to the public subscribe/unsubscribe flow that shipped
earlier in the day.

What the admin can now do, end-to-end, from one tab:

1. See live stats: total active subscribers + breakdown per locale (EN / AR / RU).
2. Compose a campaign in **Markdown**, preview it in a modal, filter the audience by
   locale + source, send a **test** to any email, then blast to the full filtered
   segment with a confirm-before-send dialog.
3. Watch the campaign fly — the history table polls every 2 seconds and shows
   `N sent / failed` update live.
4. Manage subscribers — search, filter, manually add, per-row unsubscribe.
5. Export any filtered slice as a UTF-8 CSV (Excel-clean) in one click.

All of it is security-hardened (admin session + CSRF + XSS-safe renderer + token
rotation) and fully documented in the new
[NEWSLETTER_SYSTEM.md](./NEWSLETTER_SYSTEM.md).

---

## What shipped

### Data layer

- New Prisma model `NewsletterCampaign` — audit log for every admin send.
- Migration `prisma/migrations/20260417_add_newsletter_campaigns/migration.sql`.
- Schema pushed to local DB via `npx prisma db push`; client regenerated.

### Shared libs

- `lib/newsletterMarkdown.ts` — hand-rolled, XSS-safe Markdown → HTML.
  - Supports headings, bold, italic, lists, blockquotes, `---`, links
    (http/https/mailto only), bare-URL autolinks, paragraphs with `<br>` on single newlines.
  - HTML-escapes everything first. No raw tags survive.
  - 11/11 tests pass in `scripts/check-newsletter-markdown.ts`, including `<script>`,
    `<img onerror>`, `javascript:` and `data:` URI attempts.
- `lib/email/templates.ts` — added `newsletterCampaign` template: Apple-style wrapper,
  localized footer (EN/AR/RU), per-subscriber unsubscribe link.
- `lib/email/senders.ts` — added `sendNewsletterCampaignEmail` (builds template args
  with `locale` only when defined to satisfy `exactOptionalPropertyTypes: true`).

### Admin APIs

All require admin auth (signed `admin-session` cookie preferred, `X-Admin-Email` legacy
fallback) + CSRF header on writes.

| Route | Purpose |
|---|---|
| `GET /api/admin/newsletter/subscribers` | Paginated list + aggregate stats. Query: `locale`, `isActive=true\|false`, `source`, `search`, `limit` (≤500), `offset`. Returns `{ rows, total, stats: { totalActive, totalInactive, byLocale } }`. |
| `POST /api/admin/newsletter/subscribers` | Manual add. Idempotent — re-adds reactivate with a **fresh token**. Auto-links `userId` if email matches a user. |
| `DELETE /api/admin/newsletter/subscribers/[id]` | Soft unsubscribe. |
| `PATCH /api/admin/newsletter/subscribers/[id]` | Flip `isActive`, change `locale`. Rotates token on reactivation. |
| `GET /api/admin/newsletter/subscribers/export` | UTF-8 CSV with BOM. Filename `genosys-subscribers-YYYY-MM-DD.csv`. Auth via cookie (for `window.open`). |
| `GET /api/admin/newsletter/campaigns` | List newest 20. |
| `POST /api/admin/newsletter/campaigns` | Create + send (test or production). See below. |
| `GET /api/admin/newsletter/campaigns/[id]` | Single campaign — used for status polling. |

### Campaign send flow

**Test send** (`isTest: true`):
- Synchronous — waits for the single SMTP call, updates the campaign row with
  `status=sent|failed`, returns the final record.
- `testEmail` required and validated.
- Does **not** touch any subscriber's `lastSentAt`.

**Production send** (`isTest: false`):
- Creates the campaign row with `status=sending` and returns **immediately**.
- Actual sending runs via Next.js 16 `after()` on the same invocation.
- Paginates subscribers 100 at a time using a cursor on `id` (stable ordering).
- 150 ms throttle between sends (safe under Gmail SMTP limits).
- Persists `sentCount`, `failedCount`, truncated `errors` JSON **after each page** —
  so progress survives even if the function times out.
- Hard cap: **2,000 recipients per campaign**. Refuses pre-flight above that.

### Admin UI

- `components/admin/AdminTabNavigation.tsx` — new `'newsletter'` tab with `Mail` icon.
- `components/admin/NewsletterTab.tsx` — the whole feature in one ~630-line client
  component, loaded via `next/dynamic` with `ssr: false` (matches Chatbot/Blog tabs).
- `app/admin/page.tsx` — `activeTab` state extended, `NewsletterTab` wired with
  `getAdminHeaders` + `showToast` (signatures matched existing callers exactly).

Sections inside the tab:

1. **Stats header** — dark "Active subscribers" tile + three locale tiles.
2. **Composer card** — subject (200 max), markdown body (50k max), live preview modal,
   locale + source filters with live recipient count, test-email row, test + production
   send buttons.
3. **Recent campaigns table** — last 10, polls every 2 s while any `sending`.
4. **Subscribers table** — manual add row, search + filters, per-row unsubscribe,
   CSV export button in the header.

---

## Design decisions (and why)

### Newsletter tab, not standalone route

Original ask had been "dedicated page only". Flipped on the follow-up message
("do this as part of admin dashboard") — so it lives next to Users / Orders / Blog
rather than at `/admin/newsletter`. Upside: same navigation, same auth, same toast
system, zero extra layout scaffolding. Downside: admin page JS bundle grows a little.
The dynamic import keeps it lazy so unaffected tabs stay fast.

### Hand-rolled markdown vs `marked`/`remark`

Pulling in a full MD stack would add ~40 kB and overshoot the surface we need. Our
renderer is ~170 lines, does exactly what newsletters need (headings, bold, italic,
links, lists, quotes), escapes HTML first so raw tags are safe by construction, and
whitelists URL schemes. 11/11 XSS + happy-path tests document the boundary.

### `NewsletterCampaign` table even for test sends

Could have stored only production campaigns. Kept every send (including tests) because:
- Audit — "did we already send this?" has a definitive answer.
- Resume-after-timeout — `sentCount`/`failedCount` persist per-page, so partial
  deliveries are visible in the UI rather than silently dropped.
- `sentByEmail` gives us a forensic trail without building separate audit infra.

### `after()` + poll-for-status

Options considered:

1. **Synchronous send** — blocks HTTP response up to 50+ seconds, trips Vercel timeouts.
2. **Server-sent events / WebSockets** — adds infra for a feature that will send maybe
   5 campaigns a week.
3. **Background job queue (Inngest)** — overkill for v1.
4. **`after()` + client polling** — response returns instantly; sender runs
   post-response in the same invocation; client polls every 2 s for status. ✓

The 2,000-recipient cap exists because `after()` still dies on function timeout. When
we cross that threshold, we migrate to Inngest without changing the schema (documented
in `NEWSLETTER_SYSTEM.md` § 10).

### Confirm dialog, not typed-confirmation gate

Native `confirm()` with filter + count is enough friction for a ~5-campaigns-a-week
tool. A Github-style "type the campaign subject to confirm" is future scope if we
see accidental sends.

### CSV export via `window.open` + cookie

Cleaner than blob-download-with-headers from React. The `admin-session` cookie is
already httpOnly and scoped to the same origin, so `window.open` sends it automatically
on a GET. No client-side auth juggling needed.

---

## Verification

### Type check & lint

- `npx tsc --noEmit` — **zero new errors** in my code. The only errors in the project
  (`BrandIcons.tsx` and pre-existing `exactOptionalPropertyTypes` in test files) were
  already there before this session.
- `ReadLints` across all 11 new/touched files — **clean**.

### Unit / smoke tests

- `scripts/check-newsletter-markdown.ts` — 11/11 pass:
  - `<script>` tag escaped
  - `<img onerror=>` escaped
  - `[click](javascript:…)` rejected
  - `[click](data:text/html,…)` rejected
  - Safe `[shop](https://…)` renders `<a href>`
  - `mailto:` links work
  - Bold + italic + headings + lists + quotes + autolinks all render

### HTTP smoke tests

All four new admin endpoints return `401 Unauthorized` without credentials. Verified
via `curl`:

```
subscribers GET (unauth): 401
campaigns GET (unauth):   401
export GET (unauth):      401
campaigns POST (unauth):  401
```

`GET /admin` compiles and renders (`200`) with the new tab present.

---

## Files changed

| File | Change |
|---|---|
| `prisma/schema.prisma` | +`NewsletterCampaign` model |
| `prisma/migrations/20260417_add_newsletter_campaigns/migration.sql` | **New** migration |
| `lib/newsletterMarkdown.ts` | **New** — XSS-safe MD renderer |
| `lib/email/templates.ts` | +`newsletterCampaign` template |
| `lib/email/senders.ts` | +`sendNewsletterCampaignEmail` |
| `app/api/admin/newsletter/subscribers/route.ts` | **New** — list + add |
| `app/api/admin/newsletter/subscribers/[id]/route.ts` | **New** — delete + patch |
| `app/api/admin/newsletter/subscribers/export/route.ts` | **New** — CSV |
| `app/api/admin/newsletter/campaigns/route.ts` | **New** — list + send |
| `app/api/admin/newsletter/campaigns/[id]/route.ts` | **New** — status polling |
| `components/admin/NewsletterTab.tsx` | **New** — entire admin UI |
| `components/admin/AdminTabNavigation.tsx` | +`newsletter` tab |
| `app/admin/page.tsx` | Dynamic-import `NewsletterTab`, extend tab union, render case |
| `scripts/check-newsletter-markdown.ts` | **New** — 11 smoke tests |
| `docs/NEWSLETTER_SYSTEM.md` | **New** — full feature docs |
| `docs/SESSION_CHANGES_2026-04-17_NEWSLETTER_ADMIN.md` | **New** — this file |
| `docs/README.md` | Quick Links + Admin Portal + Email System + Session Logs updated |

---

## Known limitations (documented in code + `NEWSLETTER_SYSTEM.md` § 10)

- 2,000 recipients per campaign. Migrate to Inngest when we cross this.
- No open/click tracking, no scheduled sends, no drip series — all additive,
  no schema changes needed.
- Single-segment targeting (locale + source). Tag system later if needed.

---

## Next possible iterations (not done; user can pick any)

- Scheduled sends (`scheduledFor` column + Vercel cron sweeper).
- Open/click tracking (pixel + redirect endpoint + `campaign_recipients` row per send).
- Tag system on subscribers for richer segmentation.
- Import CSV (we have export — reverse direction is 1 endpoint + deduping).
- Per-campaign "approve before send" workflow for teams bigger than one.
- Move sending to Inngest when list grows past the current cap.
