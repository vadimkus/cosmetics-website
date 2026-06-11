# Session Changes — 2026-06-11 — Performance Pass: Blog Images + 3D Defer

## Context

Follow-up to the SEO P0 work (SSR blackout fix raised production homepage Lighthouse 31 → 74).
This pass targets the next two Lighthouse findings: blog images bypassing the Next.js
image optimizer, and the three.js hero bundle competing with LCP.

## Changes

### 1. Blog featured images — removed `unoptimized` (5 files)

All blog featured images are local files (`/blog/*`, `/images/*`), and `next.config.js`
already whitelists those paths in `images.localPatterns`, so the `unoptimized` prop was
serving raw multi-hundred-KB originals for no reason. Removed in:

- `app/blog/[slug]/page.tsx`
- `app/ru/blog/RussianBlogPageClient.tsx`
- `app/ru/blog/[slug]/RussianBlogPostClient.tsx`
- `app/ar/blog/ArabicBlogPageClient.tsx`
- `app/ar/blog/[slug]/ArabicBlogPostClient.tsx`

Also added proper `sizes` to the AR/RU blog card images (3-column grid).

### 2. EN blog list — raw `<img>` → `next/image` (`app/blog/BlogPageClient.tsx`)

The featured-article hero and the article-grid cards used plain `<img>` tags
(full-size originals). Converted both to `next/image` with `fill`, `sizes`, and
`priority` on the featured hero (it is the blog index LCP element).
Removed the `eslint-disable @next/next/no-img-element` that covered them.

### 3. In-content blog images — new optimizer rewrite (`lib/blogContentImages.ts`)

Blog post bodies are CMS HTML rendered via `dangerouslySetInnerHTML`, so their `<img>`
tags never went through the optimizer (e.g. `/blog/12.png` shipped 1.36 MB raw).

New helper `optimizeBlogContentImages(html)`:

- rewrites local `<img src="/blog/...">` / `/images/...` to `/_next/image?url=...&w=1080&q=75`
- adds `srcset` (640 / 1080 / 1920 — matches `deviceSizes`), `sizes`, `decoding="async"`
- adds `loading="lazy"` unless the tag already sets `loading`
- skips external URLs, SVG/GIF, and already-optimized sources
- runs AFTER `sanitizeHtml()` (the sanitizer strips `srcset`/`decoding` attributes)

Wired into all three locales:

- `app/blog/[slug]/page.tsx`
- `app/ru/blog/[slug]/RussianBlogPostClient.tsx`
- `app/ar/blog/[slug]/ArabicBlogPostClient.tsx`

Measured: `/blog/12.png` 1.36 MB → **69 KB AVIF** (~95% smaller).

### 4. three.js hero deferred until idle (`components/desktop-experience/DesktopHero3DVisual.tsx`)

`AtomFieldScene` (react-three-fiber + three.js, only reachable from the homepage hero)
was already `dynamic(..., { ssr: false })` and desktop-gated, but the chunk still loaded
immediately on hydration, competing with LCP. Added an `idleReady` gate using
`requestIdleCallback` (4 s timeout; 2.5 s `setTimeout` fallback) so the chunk only
downloads after the browser is idle. Mobile behaviour unchanged (never loads there).

## Verification

- `next build` clean (type check + 393 static pages)
- ESLint clean on all touched files
- Jest: 29 suites, 248 passed / 3 skipped
- Local prod server checks:
  - blog index: 0 raw local `<img>`, all via `/_next/image`
  - blog post: 6/6 body images optimized, lazy-loaded, all render (browser-verified)
  - RU + AR posts: 200, transform applied
  - homepage: hero renders, atom-field canvas mounts after idle (browser-verified, no console errors)
- Local Lighthouse (cold optimizer cache, no CDN — pessimistic vs production):
  home 69–71, post 70, `uses-optimized-images` audit: **no flagged savings** (previously the main offender)
- Production numbers should be re-measured via PageSpeed Insights after Vercel deploy
  (Vercel caches optimized images on its CDN; local on-demand optimization skews LCP).

## Production verification (post-deploy, commit 84a305a8)

- All routes 200: `/`, `/blog`, blog post, `/ru/blog`, `/ar/blog`, `/products/60`, `/api/health`
- Body images served as AVIF from CDN: `pd2.jpeg` → 50 KB, `12.png` → 69 KB (was 1.36 MB)
- Blog post page: `uses-optimized-images` Lighthouse audit clean (no flagged savings)
- Server TTFB stable ~0.4 s; hero image 26 KB AVIF from CDN cache
- Local Lighthouse runs against production were too noisy to score (FCP varied
  1.5 s → 5.6 s across runs on unchanged HTML — machine/network variance);
  PSI API daily quota exhausted — re-measure via PageSpeed Insights when it resets.
  First post-deploy run: perf 68, LCP 3.8 s (in line with the 74 baseline).

## Production-behaviour notes

- No API, auth, payment, or order code touched. Pure rendering-layer changes.
- First request to each new `/_next/image` variant after deploy pays a one-time
  optimization cost; subsequent requests are CDN-cached.
