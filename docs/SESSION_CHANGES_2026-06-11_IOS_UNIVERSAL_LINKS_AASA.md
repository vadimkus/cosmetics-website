# Session Changes — 2026-06-11 — iOS Universal Links: apple-app-site-association

## Problem (found during iOS app audit)

`https://genosys.ae/.well-known/apple-app-site-association` returned the site's 404 page. The iOS app (live App Store build 1.10.0) ships the `applinks:genosys.ae` associated-domain entitlement, but with no AASA file on the server, Apple could never verify the domain — **every genosys.ae link tapped on iPhone opened Safari instead of the app**. The Android equivalent (`assetlinks.json`) existed; the Apple file was never created.

## Fix (website only — no app release needed)

1. **`public/.well-known/apple-app-site-association`** (new) — AASA JSON with:
   - `appIDs: ["2842PLB7CS.ae.genosys.app"]` (Team ID pulled from EAS iOS credentials: Genosys Middle East FZ-LLC)
   - `components` path set mirroring the Android App Links intent filters: `/products/*`, `/cart`, `/orders`, `/profile`, `/favorites`, `/skin-recommendation`, `/skin-analysis`, `/blog`, `/bundle-builder`, `/training`, `/chat`, `/checkout`, `/track`, `/locations`, `/brand`, `/delivery`, `/faq`, `/partners`, `/about`, `/contact` (with `/*` variants where the app handles subpaths)
2. **`next.config.js`** — headers rule for the AASA path setting `Content-Type: application/json` (extensionless files in `public/` default to `application/octet-stream`, which Apple rejects) and `Cache-Control: public, max-age=3600`.

Commit: `ee4e6a2e`.

## Verification (production)

- `https://genosys.ae/.well-known/apple-app-site-association` → **200, `application/json`**, correct JSON
- Apple's CDN (`https://app-site-association.cdn-apple.com/a/v1/genosys.ae`) → **already serving the file** — this is the endpoint iOS devices actually use for verification
- Middleware untouched: `.well-known/*` passes through (same as assetlinks.json)

## Effect

- Existing installed iOS apps re-fetch AASA via Apple's CDN periodically (and on app install/update). Universal Links for genosys.ae start working without an app update.
- `applinks:www.genosys.ae` in the app still cannot verify (www 308-redirects to apex; Apple does not follow redirects) — to be removed from `associatedDomains` in the next iOS binary (mirror of the Android v85 www fix).

## Related

- iOS audit report (mobile repo): `genosys-mobile-app/docs/SESSION_CHANGES_2026-06-11_ios-full-audit.md`
- Android App Links fix for Play v85: `genosys-mobile-app/docs/SESSION_CHANGES_2026-06-01_android-play-v85-release.md`
