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
