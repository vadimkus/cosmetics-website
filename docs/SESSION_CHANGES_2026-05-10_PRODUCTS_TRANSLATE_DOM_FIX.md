# Session Changes - 2026-05-10 - Products Google Translate DOM Fix

## Context

Sentry issue `JAVASCRIPT-NEXTJS-V` reported one production event on `https://genosys.ae/products`:

- Exception: `NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.`
- Event ID: `6271118b8e1445ff85e9492cd47a9d5e`
- Browser: Chrome Mobile 148 on Android
- User locale: Turkish
- Navigation path in breadcrumbs: `/products/41` -> `/products`

## Root Cause

The Sentry breadcrumbs showed `ui.click` targets containing `font > font`, and the page title had been machine-translated into Turkish. This is the known Chrome / Google Translate failure mode where the browser translator mutates React-owned text nodes by inserting nested `<font>` elements. During route navigation, React then tries to remove a node that the translator already replaced, causing `removeChild` to throw.

No app-owned code was directly calling `removeChild`; the stack was only minified React / Next.js chunk frames.

## Fix

- Added `translate="no"` and `className="notranslate"` to the root `<html>` element.
- Added `<meta name="google" content="notranslate" />`.
- Added `translate="no"` and `notranslate` to `<body>`.
- Added a narrow Sentry client-side filter for the exact Google Translate signature:
  - `NotFoundError`
  - `removeChild` / `not a child of this node`
  - stack only in `_next/static/chunks`
  - `ui.click` breadcrumb containing `font > font`

This prevents browser auto-translation from mutating the React app and keeps any cached/pre-fix repeats from triggering high-priority alerts.

## Verification

- `npx eslint app/layout.tsx instrumentation-client.ts`
- `npm run build`

Both passed.
