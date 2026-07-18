# Web Platform Polish — local implementation — 2026-07-18

**Status:** finalized + fully tested locally — **not committed / not pushed**.

## Scope
CSS progressive-enhancement polish on genosys.ae (web + PWA browser). **No mobile app changes.** No payment/auth logic changes.

## Phase checklist
| Phase | Feature | Status |
|---|---|---|
| 1A | `text-wrap: balance` on headings (+ `pretty` on article paragraphs) | Done + verified |
| 1B | Reading progress bar on blog (EN/AR/RU) + guides | Done + verified |
| 1C | Home section scroll reveals (IntersectionObserver — CSS `view()` was too subtle / Safari-limited) | Done + fixed morning |
| 2A | `:has()` form focus/valid/invalid polish (checkout, login, newsletter) | Done + verified (login) |
| 2B | `field-sizing: content` on checkout address + notes (`auto-grow`) | Done (CSS present; checkout gated behind login) |
| 2C | Accordion height animation (grid 0fr→1fr) on PDP | Done + verified |
| 3A | Container queries on product cards | Done + verified (65 cards) |
| 3B | PDP gallery `view-transition-name: product-gallery-main` | Done + verified |
| 4 | OKLCH `color-mix` for brand soft/ring tokens (hex fallback kept) | Done + verified |

## Key files
- **`app/platform-polish.v3.css`** — all polish CSS (v3 cache-bust; includes blog video sizing)
- `app/layout.tsx` — imports `platform-polish.v3.css` after `globals.css`
- `components/blog/BlogContentHtml.tsx` — accessible play control, metadata aspect ratio, fitted portrait player
- `components/blog/BlogFeaturedImage.tsx` — natural-aspect responsive blog heroes
- `lib/blogImageDimensions.server.ts` — cached server-side image dimensions
- `components/home/HomeScrollRevealsV2.tsx` — native view timeline + IntersectionObserver fallback
- `components/ui/ReadingProgressV3.tsx` — rAF-throttled scroll → `scaleX` on the bar
- `components/guides/GuideArticle.tsx`
- `app/blog/[slug]/page.tsx`, AR/RU blog clients
- `components/home/HomeDesktopSections.tsx` — `reveal-on-view` sections
- `components/product/ProductInfoAccordion.tsx`
- `components/ProductCard/*` — `product-card-cq`
- `components/product/ProductImageGallery.tsx` — `product-gallery-main`
- `app/checkout/CheckoutClient.tsx` — `form-enhanced` / `form-field` / `auto-grow`
- `app/login/LoginClient.tsx` — `form-enhanced`
- `components/NewsletterSignup.tsx` — `form-enhanced`

## Local test results (2026-07-18 night, Cursor browser)

| Route | Result |
|---|---|
| `/` | `text-wrap: balance`; home sections fade/slide up on scroll via IO + `.is-in-view`; OKLCH soft token |
| `/guides/korean-skincare-dubai` | Reading bar mounts; progress updates on real scroll |
| `/blog/skin-rescue-overnight-cream-mask-night-ritual` | Reading bar ~80% scale mid/late scroll; H1 balance |
| `/products` | 65× `product-card-cq`, `container-type: inline-size` |
| `/products/11` | Gallery VT name + image load; accordion `0fr`→`1fr` open/close; thumb swap |
| `/login` | Form intact; invalid email border `#fca5a5`; valid `#86efac` — **no submit** |
| `/checkout` | Correctly shows “Login Required” when logged out — auth gate intact |
| `/ar` | `dir=rtl` `lang=ar`; balance + reveals OK |

**Payments:** polish files do not touch Stripe/COD/payment selectors.

**Known noise (pre-existing):** Next.js “Issues” badge / `LanguageSwitcher` hydration mismatch under automation — not introduced by polish logic.

## Morning validation
```bash
cd /Users/vadimkus/cosmetics-website && npm run dev
```
Then open: `/`, `/guides/korean-skincare-dubai`, `/blog/skin-rescue-overnight-cream-mask-night-ritual`, `/products`, `/products/11`, `/checkout`, `/login`, `/ar`. Optionally enable OS “Reduce motion” and confirm animations stop.

## Home reveals — stronger + bidirectional (2026-07-18 morning)
- Was: one-shot (`unobserve`), subtle `translateY(32px)` — only first scroll-down.
- Now: enter/leave toggle; `translateY(64px) + scale(0.97) + blur(2px)` over 0.9s; re-arms when section leaves viewport so scroll-up then down animates again.

## Blog video sizing fix (2026-07-18 morning)
- Cause: portrait `/videos/overnight.mp4` laid out from square poster; sanitize stripped `style`; forced featured `aspectRatio: 1522/922` letterboxed portrait hero.
- Fix: `BlogContentHtml` sets aspect from metadata (same as PDP `/products/52`); sanitize allows video layout styles; polish CSS → `platform-polish.v3.css`.
- Follow-up: restored featured hero `1522/922` gray landscape box; video wrapper matches PDP exactly (`max-w-sm` → `rounded-xl overflow-hidden shadow-lg bg-black` + `w-auto max-w-full max-h-[65vh]`) — no forced width/9:16 letterbox bars.
- Final interaction: `BlogContentHtml` mirrors product 52 — initial circular “Watch product video” button, click opens/autoplays native controls (including settings), and video completion collapses back to the button. Verified locally.
- Black-side-frame fix: player wrapper now uses `width: fit-content`; when `max-h-[65vh]` shrinks the portrait video on shorter screens, the wrapper shrinks with it. Verified wrapper and video bounds are identical (zero left/right gap).
- Overnight article hero now follows its square source at a responsive `42rem` maximum (**672×672px** desktop); no forced landscape crop.

## All published blog images audit (2026-07-18)
- Audited **18 published posts**, **159 image references**, and **59 unique image paths** across EN/AR/RU.
- Added `BlogFeaturedImage` + server-side `sharp` dimension lookup. Every blog hero now uses its real aspect ratio:
  - landscape → full article width;
  - square-ish → balanced 42rem maximum;
  - portrait → centered and capped at 72vh.
- Repaired missing K-beauty delivery-tech hero:
  - `/blog/kbeauty-delivery-tech-2026.jpg` (missing) → `/images/6000/main.jpg`.
- Repaired deleted Snow O₂ image in the UAE summer post, all three languages:
  - `/images/SNOW.jpg` → `/images/cleanser/Main.jpg`.
- Added repeatable read-only audit: `scripts/audit-blog-images.ts`.
- Added idempotent repair script: `scripts/repair-blog-image-paths-20260718.ts`.
- Post-repair audit: **0 broken local paths**, **0 unverified remote paths**.
- Route smoke test: **54/54** localized blog routes return successfully.
- Validation: `npx tsc --noEmit` passes; changed application files have 0 ESLint errors.

## Morning browser regression test (2026-07-18)
- `/`: heading balance passes; first reveal passes; newsletter gets a visible brighter/white focus treatment. **Repeat reveal fails** — sections keep `is-in-view` after leaving the viewport.
- `/guides/korean-skincare-dubai`: **reading progress fails** — bar exists but remains `scaleX(0)` after real scroll.
- Overnight Mask blog: progress moves `0 → 0.25244`, H1 balance passes, images load, initial video play button is present.
- `/products`: product cards render and use `container-type: inline-size`.
- `/products/11`: main image, thumbnail swap, and accordion open/close pass.
- `/login`: invalid email border `rgb(252,165,165)`; valid email `rgb(134,239,172)`; no submit.
- `/checkout`: logged-out “Login Required” gate passes.
- `/ar`: `lang=ar`, `dir=rtl`, RTL rendering pass.
- Reduced motion: home reveals are immediately visible with no motion; PDP accordion opens/closes without animation.
- Corrected `native-ios-app-coming-january-2026` publication date from **14 Dec 2024** to **14 Dec 2025** (the post was created in Dec 2025).

## Product-card login modal stacking fix
- Cause: each product card rendered `LoginModal` inside an animated/card stacking context, so neighboring cards painted above the fixed overlay.
- Fix: `LoginModal` now portals to `document.body` and enforces `z-index: 10000`; all modal import sites use the consolidated component directly.
- Verified from `/products` → first “Login to see price”:
  - modal parent is `BODY`;
  - computed z-index is `10000`;
  - center hit-test belongs to the modal;
  - no product cards overlap the login surface.
- `npx tsc --noEmit` and targeted ESLint pass.

## Final consolidation and regression verification

- Removed temporary cache-bust modules:
  - consolidated `BlogContentHtmlV2` into `BlogContentHtml`;
  - restored all imports directly to the portaled `LoginModal`;
  - removed the temporary `LoginModalV2` re-export.
- Removed the obsolete shared `product-gallery-main` transition name; the
  committed per-product transition implementation remains authoritative.
- Removed brittle cross-file reveal overrides. Native CSS view timelines and the
  IntersectionObserver fallback now operate independently.
- Added complete accordion semantics (`aria-controls`, linked region IDs,
  `aria-hidden`, and `inert` while closed).
- Replaced the fixed 800-character featured-image removal heuristic with a
  shared helper that removes only a genuinely leading duplicate. Web EN/AR/RU
  and the mobile blog API use the same logic.
- Added regression tests for blog video interaction, sanitizer video styles,
  duplicate featured images, and accordion accessibility.

Final local results:

- Full Jest suite: **46 suites passed; 293 passed, 3 skipped, 0 failed**.
- `npx tsc --noEmit`: passed.
- Targeted ESLint: 0 errors.
- Production build: passed.
- Blog audit: **18 posts, 159 references, 59 unique paths, 0 broken local paths**.
- Browser checks passed on EN/AR/RU, RTL, progress bars, blog video, login modal
  portal/stacking, product gallery, accordion, checkout auth gate, and repeated
  home reveals.
- Mobile browser viewport `390×844`: no horizontal overflow on home, Arabic
  home, products, PDP, blog, or checkout.

## Vercel function-size deployment fix

- Initial deployment of commit `279e08f2` compiled successfully but Vercel
  rejected `/ar/blog/[slug]` at **535.98 MB uncompressed** (250 MB limit).
- Cause: the blog route imported `sharp` at runtime to inspect hero dimensions,
  so Vercel traced the native image binaries into each localized function.
- Fix: replaced the runtime `sharp` lookup with the audited dimensions of all 18
  published blog hero images. `sharp` remains only in the read-only audit script
  and is no longer reachable from a route bundle.
- Verification: TypeScript, targeted ESLint, and the full production build pass.
