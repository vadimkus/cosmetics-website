# K-Beauty Blog Image Route Fix

Date: 2026-05-17

## Context

The Russian article page `/ru/blog/k-beauty-delivery-tech-pdrn-exosomes-spicules-2026` showed the hero image alt text instead of the image.

## Root Cause

The blog post stored `featuredImage` as `/blog/kbeauty-delivery-tech-2026.jpg`. Because the site also has the dynamic blog route `/blog/[slug]`, requests for `/blog/kbeauty-delivery-tech-2026.jpg` were handled as a blog slug rather than a static image and returned a 500.

## Fix

- Moved the image asset to `public/images/blog/kbeauty-delivery-tech-2026.jpg`.
- Added a compatibility route at `app/blog/kbeauty-delivery-tech-2026.jpg/route.ts` so the currently stored DB image URL still returns `image/jpeg`.
- Updated the article upsert script to use `/images/blog/kbeauty-delivery-tech-2026.jpg` for future writes.

## Verification

- `/blog/kbeauty-delivery-tech-2026.jpg` returned `200 image/jpeg` locally.
- `/images/blog/kbeauty-delivery-tech-2026.jpg` returned `200 image/jpeg` locally.
- Next image optimizer URL for `/blog/kbeauty-delivery-tech-2026.jpg` returned `200 image/jpeg` locally.
- `npx tsc --noEmit` passed.
- Focused ESLint on the new route passed.

## Follow-Up: Blog Listing Preview Images

After production deploy, the Russian blog listing still showed image alt text in some desktop browsers while direct image URLs returned `200 image/jpeg`. To avoid stale Next image optimizer/cache behavior on blog index cards, blog listing images were switched to direct image delivery with `unoptimized` on:

- `app/ru/blog/RussianBlogPageClient.tsx`
- `app/ar/blog/ArabicBlogPageClient.tsx`
- `app/blog/BlogPageClient.tsx`

Verification:

- Focused ESLint on the three blog list components passed.
- `npx tsc --noEmit` passed.

## Follow-Up: Shared Blog Listing Direct Images

After the RU and AR blog pages were moved to the shared `BlogPageClient`, the listing preview images regressed again and displayed alt text in production. Direct image URLs still returned `200 image/jpeg`, so the issue was isolated to `next/image` rendering/optimization behavior on the shared blog listing component.

Updated `app/blog/BlogPageClient.tsx` to render blog listing preview images with plain `<img>` tags and direct image URLs for both the featured article and grid cards. This intentionally bypasses `next/image` for the blog index only; individual article hero components remain separate.

Verification:

- `npx eslint "app/blog/BlogPageClient.tsx"` passed.
- `npx tsc --noEmit` passed.

## Follow-Up: Locale Blog Layout Parity

The English `/blog` page used the newer editorial `BlogPageClient`, while `/ru/blog` and `/ar/blog` still used older locale-specific grid components. Updated the RU and AR blog pages to reuse the shared `BlogPageClient`, mapping localized titles/excerpts before rendering so all three locales now share the same structure.

## Follow-Up: Article Hero Images (Detail Pages)

User reported the hero image on `/ru/blog/uae-summer-skincare-survival-guide-2026` rendered as alt text instead of the image (screenshot 2026-05-17 22:09). Same root cause class as the listing fix: stale/inconsistent Next image optimizer behavior on some desktop browsers while the source asset (`/blog/summer-splash.jpg`) and the `_next/image` URL both returned `200 image/jpeg`.

Applied the same `unoptimized` mitigation to the article hero `<Image>` on all three locales for consistency:

- `app/ru/blog/[slug]/RussianBlogPostClient.tsx`
- `app/ar/blog/[slug]/ArabicBlogPostClient.tsx`
- `app/blog/[slug]/page.tsx`

Verification:

- `npx tsc --noEmit` passed.
