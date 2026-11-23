# New blog post: SPF cushion, "one press, three jobs" (23 Nov 2026)

## Request

Vadim: "we need to create a new blog post / select product from our range and use pics from
website of that product and see trends online - what people need to see and what they blog
about - use style/dynamics etc... / then create super post on out website and post it"

## What was done

1. **Product chosen**: SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++] (product **41**) — no
   existing blog post covered it, and it's one of the most frequently ordered products this
   quarter (63 September order mentions per the Instagram grid plan, "top seller").
2. **Trend research** (live web search, Nov 2026): the beauty press this year (NewBeauty, Vogue
   Arabia, FASHION Magazine) runs the same dermatologist line — a cushion is a reapplication
   layer, not a replacement for a proper morning sunscreen, because SPF testing uses far more
   product than a few light taps ever deposit. The article leans into that honestly instead of
   overselling the cushion as a full sunscreen.
3. **Images**: 100% real, already-live artwork — no new generation. Reused the 30 Sep 2026
   "ONE PRESS" campaign (`public/images/cushion_art/s1,s4b,s5b,s6,s8,s9,s10,s11,s13.jpg`,
   `public/images/cushion_campaign/main.jpg`) and the live reel
   (`public/videos/cushion-reel-web.mp4`, 720×1280, 20s, poster `reel-poster.jpg`). The campaign's
   own lines ("The spare is in the box", "Back in two hours", "Press. Pat. Build.") already
   anticipated this exact angle, so the article builds directly on them.
4. **Library check** (`creative-library-first.mdc`): read `docs/GENOSYS_CREATIVE_PLAYBOOK.md` and
   `~/Desktop/Library/00-index/CHEATSHEET_slides_video.md` before writing. Structure follows the
   carousel job table: hero = DESIRE (one line, no clutter); "a top-up, not a base" and "the spare
   is in the box" = DISCOVERY (problem + mechanism, Schwartz/Hopkins); the stats block = DISCOVERY
   proof, one documented figure per card (Hopkins, "being specific"); the 3-step "Press. Pat.
   Build." = DISCOVERY ritual; the closer = CONVERSION with facts and where to buy, no price push.
5. **Script**: `scripts/create-cushion-spf-top-up-blog.ts`, built on the exact pattern of
   `scripts/create-collagen-myth-bio-meso-blog.ts` (same helper functions: hero, feature, stats,
   steps, videoBlock, instagram, fit, faq, cta, sources, img, link, extLink). Trilingual (EN/RU/AR),
   Arabic Latin terms wrapped in `L()` (U+2066/U+2069) for RTL stability. Idempotent upsert on
   `slug: 'spf-cushion-one-press-three-jobs'`.
6. **Cross-sell**: the "right order" section and CTA link to the real base sunscreens already in
   the catalog — Multi Sun Cream SPF40 (product 40) and Ultra Shield SPF50+ (product 39) — so the
   honest "cushion is a top-up" framing turns into a second product mentioned, not a dead end.
7. **Sources** cited in the article itself (external press, not a dossier): NewBeauty, Vogue
   Arabia, FASHION Magazine, 2026, plus the product's own registered spec (5 UV filters, SPF50+
   PA++++, niacinamide 2%, adenosine 0.04%, 15 g + 15 g refill, 3 shades).
8. **Instagram cross-link**: confirmed live via `docs/2026-09-29_instagram-grid-plan.md` before
   linking — carousel `instagram.com/genosys.uae/p/Dd6R_5YjCJ9/` and reel
   `instagram.com/genosys.uae/reel/Dd6T-4dqjI_/`, both posted 30 Sep 2026.

## Verification

- `npx tsc --noEmit` clean.
- No em/en dashes in the rendered EN/RU/AR content (3 dashes found were only in the script's own
  top comment block, which `__tests__/lib/noDashes.test.ts` doesn't scan).
- Every Tailwind arbitrary-color class used (`bg-[#F8E9E4]`, `text-[#8A5A4E]`,
  `shadow-[#5B4A2E]/15`, etc.) already exists verbatim in the already-deployed collagen-myth blog
  script, so no new CSS needed to compile — confirmed live immediately, no cache wait.
- Ran `npx tsx --env-file=.env --env-file=.env.local scripts/create-cushion-spf-top-up-blog.ts` →
  created `cmwspsqik0000w1box46294bl`, `published: true`.
- Live and verified in-browser, all three locales, 200 status:
  - EN: https://genosys.ae/blog/spf-cushion-one-press-three-jobs
  - RU: https://genosys.ae/ru/blog/spf-cushion-one-press-three-jobs
  - AR: https://genosys.ae/ar/blog/spf-cushion-one-press-three-jobs
- Screenshots confirmed: hero, stats block, feature cards, 3-step "Press. Pat. Build.", video
  block, fit-for section, FAQ, Instagram links, closer CTA, sources — all render with real images
  and correct styling in EN; Arabic RTL layout and isolated Latin terms confirmed correct.

## Files

- New: `scripts/create-cushion-spf-top-up-blog.ts`
- DB: `BlogPost` row, slug `spf-cushion-one-press-three-jobs`, `published: true`
