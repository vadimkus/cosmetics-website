# HR³ MATRIX SCALP BRUSH blog post — 2026-08-20

## Published article

- Slug: `hr3-matrix-scalp-brush-where-shampoo-works`
- Post id: `cmt0ztsj300005u8ogk2bt60l`
- English: https://genosys.ae/blog/hr3-matrix-scalp-brush-where-shampoo-works
- Russian: https://genosys.ae/ru/blog/hr3-matrix-scalp-brush-where-shampoo-works
- Arabic: https://genosys.ae/ar/blog/hr3-matrix-scalp-brush-where-shampoo-works
- Product: https://genosys.ae/products/61
- Publishing script: `scripts/create-hr3-scalp-brush-blog.ts`

## Live product check

`https://genosys.ae/products/61` returned 200 and already served the August set:

- `/images/brush_o/Main2.jpeg`
- `/images/brush_o/s1.jpeg` … `s7.jpeg`
- `/videos/brush.mp4`

All nine assets returned 200 on the CDN before the article was written. The old July set in `/images/brush/` is not used.

## Images in the article

| Asset | Role |
|---|---|
| `Main2.jpeg` | Featured packshot (square, HR³ MATRIX mark legible) |
| `s2.jpeg` | Scalp-first section |
| `s1.jpeg` | Soft silicone section |
| `s7.jpeg` | Grip and flexible tips |
| `brush.mp4` | Close-up of the head and the flex in the tips |
| `/images/shampoo/Main.jpg` | Wash-time pairing card |
| `/images/hair_tonic/main-v2.jpeg` | After-wash pairing card |

`s3`–`s6` stay off the article. They still print absorption, a Hair Tonic pairing, and a 2–3 minute duration that the DTS MG deck does not support. They remain in the product gallery only, same rule as the PDP.

## Editorial approach

Long-form EN/RU/AR post that:

1. Frames the product as a shower tool that takes shampoo to the scalp.
2. Cites the AAD rule: apply shampoo to the scalp, not the lengths.
3. Repeats the four documented deck effects (foam, cleanse, blood flow, volume).
4. Shows the new video and describes the object, not an invented effect.
5. Puts the brush with MEDI SCALP SHAMPOO α at wash time, and HAIR TONIC α after rinsing, with fingertips.

## Claim controls

Same list as `scalpBrushCopy.ts`. The article does not say:

- absorption, at any strength of wording
- KFDA / hair-loss approval (that badge belongs to the shampoo)
- medical-grade or hypoallergenic silicone
- a timed 2–3 minute ritual
- dry-brush routine
- dandruff
- microneedling prep
- any efficacy percentage

## Publishing behavior

Prisma script is idempotent by slug: create on first run; later runs update content and preserve original `publishedAt`.

Genie (`lib/chatbot/config.ts`) now points to the article when the customer asks about product 61.
