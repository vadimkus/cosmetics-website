# Product 34: new main packshot

**Date:** 2 September 2026

SKIN RESCUE OVERNIGHT CREAM MASK. New studio shot supplied as `Main_new.jpeg`
(1254 x 1254, 66 KB), saved as `public/images/overnight/main-v2.jpeg`: a new
filename because `/images` is served immutable for a year, and not `Main.jpeg`
because that would sit beside `main.jpeg` on a case-sensitive host.

Cutout rebuilt as `34-v2.webp` (revision bumped in `build-cutouts.py`), manifest
regenerated. Repointed: `lib/products.ts`, `routineStepImages`, `OrderHistory`
fallback, training catalogue (web and mobile API), `DownloadsSection`.
`blogImageDimensions` gained the new path and keeps the old one, since posts in
the database still embed it. The old `main.jpeg` stays on disk for the same
reason and for order emails already sent.

Order of operations: code and files pushed first, database switched only after
the CDN returned 200 for both new files (`scripts/set-product-34-main-20260902.ts`
checks that before writing). Verified: mobile API returns `main-v2`, the product
page references only `main-v2` once the 5-minute ISR window passed.
