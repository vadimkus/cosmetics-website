# Language Switcher — Mobile Web Fix (2026-04-17)

## Problem

User reported: on mobile web (genosys.ae), tapping the header language
switcher could not switch to Russian or Arabic. English → EN worked,
but EN → RU and EN → AR did nothing.

## Root Cause

`components/LanguageSwitcher.tsx` used `router.replace(newPath)` wrapped
in `startTransition`. On mobile (especially installed PWAs on iOS Safari):

- The `document.cookie = "NEXT_LOCALE=ru"` was set correctly.
- The transition was queued, but the client-side route change did not
  reliably complete — the user stayed on the current locale.
- Service-worker navigation handling + React transition + PWA navigation
  stack combined to swallow the update.

Locally in a normal mobile Chrome browser the old code worked; the bug
only reproduced on production PWA / iOS installed-app conditions.

## Fix

`switchLanguage` now performs a **hard navigation** via
`window.location.assign(fullPath)` instead of `router.replace`. This:

- Guarantees the new `NEXT_LOCALE` cookie is sent on the next request.
- Makes the service worker treat the request as a plain navigation
  (network-first in `public/sw.js`).
- Forces the server to render the correct locale layout and `dir`.
- Eliminates the React-transition / router interaction entirely.

Trade-off: no in-app soft transition between locales. Acceptable because
switching locale is rare and always changes the entire document.

## Files Changed

- `components/LanguageSwitcher.tsx`
  - removed `useRouter`, `startTransition` usage
  - `switchLanguage` now sets cookie and calls `window.location.assign(path)`

## Verification

Local Next.js dev server + mobile viewport (390×844):

- EN → RU: URL `http://localhost:3007/ru`, Russian content ✓
- RU → AR: URL `http://localhost:3007/ar`, Arabic with RTL ✓
- AR → EN: URL `http://localhost:3007/`, English + LTR ✓

No new console errors. Existing `useTranslation` fallback warning unchanged.
