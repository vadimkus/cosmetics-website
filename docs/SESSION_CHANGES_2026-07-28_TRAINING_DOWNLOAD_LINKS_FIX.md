# Training page download links fix — 2026-07-28

## Problem

On https://genosys.ae/training (and RU/AR/mobile/PWA surfaces) many PDF
"View PDF" buttons did not download anything.

## Root cause

Two broken URL patterns:

1. **Legacy `app/training/data/trainingData.ts`** used kebab-case URLs
   (`/documents/home-care-guide-2026.pdf`, …) that never existed → hard 404
   (27 of 28 links dead).
2. **Everything else** (`TrainingClient`, RU/AR pages, mobile API,
   `DownloadsSection`, `concernsData`, `productConfig`) linked to lowercase
   `/documents/ppt/<file>` while the real folder is **`public/documents/PPT/`**
   (case-sensitive on Vercel). Lowercase URLs fell through to the
   `app/documents/ppt/[filename]` viewer route whose hardcoded `validPDFs`
   whitelist was stale → most files returned notFound, and the viewer iframe
   pointed back at the same broken lowercase URL.

## Fix

- Flipped **all** `/documents/ppt/` → `/documents/PPT/` (direct static PDFs,
  `content-type: application/pdf`) in:
  - `app/training/TrainingClient.tsx` (32)
  - `app/ru/training/page.tsx` (31)
  - `app/ar/training/ArabicTrainingPageClient.tsx` (31)
  - `app/api/mobile/training/route.ts` (32)
  - `components/profile/DownloadsSection.tsx` (28)
  - `lib/concernsData.ts` (8 protocol PDFs)
  - `app/documents/page.tsx` (+ fixed `SKIN REBOOT PDRN MASK PACK` → real
    `GENOSYS SKIN REBOOT PDRN MASK PACK.pdf`)
  - `data/productConfig.ts` (35 documentation links)
- Rewrote the 27 dead kebab-case URLs in legacy `trainingData.ts` to the real
  static files.
- `app/documents/ppt/[filename]/page.tsx` (viewer): dropped the stale
  hardcoded whitelist — now checks the file actually exists in
  `public/documents/PPT/` (with path-traversal guard) and points the iframe at
  the real uppercase static file. Keeps old lowercase bookmarks working.

## Verification

- Script cross-check: **46 unique /documents URLs referenced in code — all
  exist on disk**.
- Post-deploy curl: all training links return 200 `application/pdf`
  (previously 27/28 EN links were 404).
