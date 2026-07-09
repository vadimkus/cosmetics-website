# Session Changes — 2026-07-09 — PWA / Favicon Icons Regenerated

## Why

The old PWA icon set was derived from a rough 512px raster (jagged edges, dark halo around the logo). The native app just got a crisp white icon (see mobile repo `docs/SESSION_CHANGES_2026-07-09_white-app-icon-ios26.md`), so the web icons were rebuilt from the same clean source.

## Source

`genosys-mobile-app/assets/app-icon-1024-pwa-flat-no-alpha.png` — sharp 1024px master, red logo on white, clean 2px anti-aliased edges.

## Regenerated files (all in `public/`)

| File | Notes |
|---|---|
| `favicon-16x16.png`, `favicon-32x32.png` | logo ~72% of canvas |
| `favicon.ico` | multi-size 16/32/48 |
| `icon-192x192.png`, `icon-512x512.png` | logo ~73% (matches previous look) |
| `apple-touch-icon.png`, `apple-icon-180x180.png` | 180px home-screen tiles |
| `icon-192x192-maskable.png`, `icon-512x512-maskable.png` | logo 59% — inside maskable safe zone |
| `favicon/favicon.svg` | now a transparent red-glyph (was a generic dark-circle "G") — reads correctly on dark browser tabs |
| `favicon/genosys-official-favicon.ico`, `favicon/genosys-official.ico` | refreshed transparent glyph, 16/32/48 |

## Also

- `manifest.json` version bumped 3.3.0 → 3.3.1 so installed PWAs re-fetch icons.
- Untouched: `*-black-bg.png` variants (not referenced anywhere in code).

## Verification

- Deployed to production; all icon URLs return 200 with new payloads (512 icon shrank 68KB → 21KB).
- Glyph previewed on dark background — center hole transparent, no halo.

## Note for users with the PWA already installed

iOS home-screen icons are cached at install time; existing installs may keep the old icon until the PWA is removed and re-added. New installs get the new set immediately.
