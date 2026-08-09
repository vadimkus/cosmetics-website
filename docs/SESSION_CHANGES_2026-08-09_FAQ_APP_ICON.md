# Session Changes — 2026-08-09 — FAQ app download banner icon

## Goal

Replace the generic Lucide smartphone glyph on the FAQ “Get answers faster in the GENOSYS app” banner with the official GENOSYS mobile app logo.

## Change

- Source: mobile app master `genosys-mobile-app/assets/app-icon-1024-pwa-flat-no-alpha.png` (white background, red GENOSYS mark — same as live iOS/PWA icon).
- Copied to website: `public/images/app-icon.png` (1024×1024 PNG, ~34 KB).
- `app/faq/FAQClient.tsx`: desktop decorative panel now renders `next/image` of `/images/app-icon.png` inside an iOS-style rounded square with subtle border/shadow.
- EN / RU / AR alt text added. Category “Mobile App” filter still uses the Lucide smartphone icon (intentional — filter chip, not brand mark).

## Why `/images/app-icon.png`

Next.js 16 `images.localPatterns` allows `/images/**` but not root `/icon-512x512.png`, so a content-path asset was required for `next/image`.

## Verification

- Local FAQ banner screenshot confirms app icon `currentSrc` includes `app-icon.png`, 128×128 rendered, no Lucide smartphone glyph in the banner.
- Shared `FAQClient` powers `/faq`, `/ar/faq`, `/ru/faq`.

## Status

Committed and pushed to `main`.
