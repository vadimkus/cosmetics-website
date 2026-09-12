# Mobile: beauty boxes show member products in the gallery (13 Sep 2026)

Problem: the app showed only the main kit shot for boxes 55-59 and 62. The website builds the box gallery on the client from the catalogue (packshot of every member product, in `contents.items` order); the DB `images` field for the boxes is empty, and the app reads the API, so it got nothing.

Fix: `lib/beautyBoxGallery.ts` derives the same list server-side from the members' *current* main images. Wired into `/api/mobile/products` (uses the already-loaded catalogue) and `/api/mobile/products/[id]` (one extra query for the members). DB `images` entries, if any, are appended and deduped. Not a box -> untouched. No app release needed.

## Fix 00:35 — kit shot missing
The app renders `images` as the whole gallery (it does not prepend `image`); the pricing engine normally merges main + gallery, but the box helper replaced that merged list. Helper now leads with the box's main image, then members.
