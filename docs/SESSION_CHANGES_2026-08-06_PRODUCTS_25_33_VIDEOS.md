# Products 25 and 33 videos — 2026-08-06

## Change

Added portrait product videos for:

- **SOOTHING REPAIR POSTCREAM (product 25)** →
  `/videos/soothing-repair-postcream-20260806.mp4`
- **EyeCell EYE PEPTIDE GEL PATCH (product 33)** →
  `/videos/eyecell-eye-peptide-gel-patch-20260806.mp4`

Both products previously had `videoUrl: null` in production, so no existing
product video was replaced.

## Compression

Both untracked 1080 × 1920 H.264/AAC sources were compressed with
`scale=720:-2`, H.264 CRF 28, the slow preset, `yuv420p`, AAC 96 kbps, and
`faststart`. Full decode checks completed without errors. The large source
files were removed after validation.

- `soothing.mp4`: 8,485,447 bytes / 19.17 s → 1,917,997 bytes / 19.18 s
- `patch.mp4`: 63,695,044 bytes / 26.90 s → 1,816,599 bytes / 26.90 s

Both final assets are 720 × 1280 at 30 fps.

## Deployment and integration

- Asset commit: `cf11c056`
- Asset deployment: `dpl_2PjE926QeUJCM8YinAWwBpTRKjLj` — Ready
- Both production asset URLs returned HTTP 200, `video/mp4`, and exact expected
  content lengths before the database was changed.
- Production database, `data/productConfig.ts`, and `lib/products.ts` now use
  the same cache-safe paths.
- Web, PWA, and the native mobile app consume the existing product APIs. No
  native client change or OTA release is required.

