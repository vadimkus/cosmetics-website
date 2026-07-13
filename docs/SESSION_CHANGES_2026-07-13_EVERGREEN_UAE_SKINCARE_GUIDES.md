# Session Changes — 2026-07-13 — Evergreen UAE Skincare Guides

## Goal

Expand non-branded organic search coverage without publishing thin or
keyword-cannibalizing blog posts. Three existing evergreen guides were
strengthened and three missing guides were created in English, Russian, and
Arabic.

## New guides

- `/guides/microneedling-aftercare-routine`
- `/guides/pdrn-skincare-benefits`
- `/guides/ceramide-cleanser-skin-barrier`

Each has matching `/ru/guides/...` and `/ar/guides/...` routes with fully
localized copy and internal links.

## Strengthened guides

- `/guides/korean-skincare-dubai`
- `/guides/dermacosmetics-for-clinics-uae`
- `/guides/korean-sunscreen-uae`

The previous versions were short two-section landing pages. Each now has:

- a direct-answer introduction and four key takeaways;
- four substantial educational sections;
- four relevant product cards with local, existing product images;
- four FAQs;
- contextual internal links;
- independent safety/evidence references where health claims are involved.

## Accuracy decisions

- Microneedling copy repeatedly defers to the treating professional, avoids a
  universal hour-by-hour aftercare schedule, lists warning signs, and cites
  FDA/AAD guidance.
- PDRN copy distinguishes topical, spicule, and injectable delivery and does
  not transfer injectable evidence to cosmetics. Sources: PubMed/PMC reviews.
- Ceramide copy explains that gentle cleansing is only part of barrier care
  and does not imply that a cleanser alone treats dermatitis. Sources include
  a randomized trial and skin-barrier reviews.
- Sunscreen copy uses AAD guidance: broad-spectrum, water-resistant SPF 30+;
  reapply about every two hours outdoors and after swimming/sweating.
- Clinic copy distinguishes brand education from licensing, device training,
  infection control, medical oversight, and manufacturer instructions.

## UI and SEO

- New shared `components/guides/GuideArticle.tsx` renders:
  - responsive product-image collage;
  - key-points panel;
  - readable editorial sections;
  - image-led product cards;
  - FAQ, sources, next steps, and CTA.
- The component supports RTL and was visually checked on an Arabic mobile
  viewport.
- `RouteStructuredData` now resolves localized guide data for EN/RU/AR instead
  of emitting English FAQ/WebPage content on localized routes; `inLanguage`
  and guide breadcrumb labels are localized.
- Guide hreflang now includes `x-default`.
- Sitemap editorial `lastModified` bumped to 2026-07-13 and guide product
  images are included in image-sitemap entries.

## Verification

- All 15 referenced image files exist.
- TypeScript: passed.
- ESLint on touched guide/SEO files: passed.
- Production build: passed, 450/450 pages generated.
- Build generated all 11 guide OG and Twitter image routes (8 existing + 3
  new).
- Local smoke tests:
  - EN microneedling guide: headings, images, product cards, FAQs, and sources
    present.
  - AR ceramide guide at 390px: RTL content and image collage render correctly.

## Deployment

Production deployment is performed by pushing the scoped guide commit to
`main` (Vercel). Post-deploy checks cover all 18 strengthened/new localized
guide routes, the three guide indexes, localized structured data, image URLs,
and sitemap inclusion.
