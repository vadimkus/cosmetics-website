# Session Changes — Guides Soft-404 Fix

**Date:** 2026-06-12
**Scope:** `proxy.ts` only (middleware)
**Risk:** Zero — affects only unknown guide slugs; all valid routes verified unchanged.

## Problem

Unknown guide URLs (`/guides/anything`, `/ar/guides/anything`, `/ru/guides/anything`) returned the styled 404 page with **HTTP 200** (soft 404). Guide pages render dynamically (the root layout forces dynamic rendering), so the page-level `notFound()` fires after streaming has started with a 200 status — the `dynamicParams = false` + `notFound()`-in-`generateMetadata` pattern only produces a real 404 for statically generated routes. Soft 404s let Google index junk URLs and waste crawl budget.

## Fix

Guide slugs are a small build-time list, so middleware can validate them before routing:

- `proxy.ts` imports `SEO_LANDING_PAGES` and builds a `GUIDE_SLUGS` set (8 slugs, shared by EN/AR/RU since localized slugs are identical).
- A path matching `/(ar|ru)?/guides/<slug>` with an unknown slug is rewritten to `/__not-found` — an unrouteable path — so Next's global not-found handler responds with a **genuine HTTP 404** and the styled 404 page (`noindex` already present).

## Verification (local prod build + after deploy)

| URL | Before | After |
|---|---|---|
| `/guides/fake-slug` | 200 | **404** |
| `/ar/guides/fake-slug` | 200 | **404** |
| `/ru/guides/fake-slug` | 200 | **404** |
| `/guides/fake-slug/` | — | 308 → non-slash URL → 404 (standard Next trailing-slash redirect) |
| All 27 valid guide URLs (EN/AR/RU index + details) | 200 | 200 |
| `/guides/<slug>/opengraph-image` | 200 | 200 |

- 404 body is the styled not-found page with `robots: noindex`.
- `tsc`, ESLint, full build, Jest (29 suites / 248 tests) all pass.

## Known remaining soft 404s (same root cause, NOT fixed here)

- `/products/<bad-id>` → 200 (product ids come from the DB, not a static list — needs a different approach, e.g. middleware DB check is not viable; would need route-level restructuring)
- `/blog/<bad-slug>` → 200 (same)

These are tracked as follow-up candidates.
