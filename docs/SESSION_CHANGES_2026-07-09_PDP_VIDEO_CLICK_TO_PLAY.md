# Session Changes — PDP Video: Click-to-Play Button

**Date:** 2026-07-09
**Scope:** Website product detail page

## What changed

The product video on the PDP (e.g. `/products/51` BIO-FERMENT AGE DEFYING POWDER MASK) no longer renders a full-height black `<video>` player on page load. Instead:

- A compact grey circular play button (64px, `bg-gray-200`, dark `Play` icon) with the caption "Watch product video" renders in its place.
- Clicking it mounts the `<video>` element with `autoPlay` + `preload="auto"` — the video loads and starts playing immediately.
- The portrait/landscape `aspectRatio` adoption via `onLoadedMetadata` is preserved.
- No video bytes are downloaded until the user taps play (previously `preload="metadata"` fetched moov atom + poster box reserved ~65vh of black space).

## Files

| File | Change |
|---|---|
| `app/products/[id]/ProductPageClientRefactored.tsx` | Added `videoOpen` state; play-button ↔ player swap; `Play` icon import |
| `messages/en.json` / `ar.json` / `ru.json` | Added `product.watchVideo` ("Watch product video" / "مشاهدة فيديو المنتج" / "Смотреть видео о продукте") |

## Verified

- Initial SSR HTML contains the button + caption and **no** `<video>` tag.
- `tsc --noEmit`, ESLint, JSON validity all pass.

## Related

- Mobile app already uses this exact pattern (`ProductVideo` in `app/product/[id].js`: thumbnail + play button, player mounts on tap) — web now matches mobile UX.
- iOS 1.11.0 (build 103) submitted to App Store review this evening; expected live within ~48h.
