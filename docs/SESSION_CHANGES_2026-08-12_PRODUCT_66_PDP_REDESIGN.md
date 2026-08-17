# Product 66 — CERABARRIER BIOME GEL CLEANSER PDP redesign

Date: 2026-08-12
Scope: local only (`http://localhost:3100/products/66`). Nothing deployed, nothing committed.

## What was built

A bespoke, premium product page used **only** by `productNumber === '66'`. Every other
product keeps `ProductPageClientRefactored` untouched.

### New files

| File | Purpose |
|---|---|
| `components/product/cerabarrier/CerabarrierProductPage.tsx` | The page itself (all sections) |
| `components/product/cerabarrier/CeraGallery.tsx` | Thumbnail rail, stage, lightbox, keyboard nav |
| `components/product/cerabarrier/CeraPrimitives.tsx` | `CeraReveal`, `CeraSectionHeader`, `CeraAccordion` |
| `components/product/cerabarrier/cerabarrierCopy.ts` | EN / AR / RU copy, self-contained |
| `components/product/cerabarrier/cerabarrier.css` | Page-scoped styles, all nested under `.cera-page` |
| `components/product/cerabarrier/ceraFont.ts` | Cormorant Garamond, `preload: false` |

### Route gate

`app/products/[id]/page.tsx` returns `CerabarrierProductPage` for product 66 and
`ProductPageClientRefactored` for everything else. Server component, ISR unchanged.

## Sections

Hero gallery + size selector + CTA + trust badges → stats strip → four science cards →
texture story (foam photograph + gel/water/foam steps) → CERABARRIER BIOME™ Complex →
numbered How to Use → nine actives + collapsible Full INCI → proof (145.8% / 2.4×) +
"what you will feel" → 200 ml vs 600 ml comparison + spec table + brochure →
complete-the-routine (5 products) → FAQ (6) → existing `ProductReviews`.

## Reused, not reimplemented

`useCart()`, `useAuth()` / `canUserSeePrices`, `getProductSizeOptions`, `getPriceForSize`,
`PRODUCT_ROUTINES['66']`, `routineStepLinks` / `routineStepImages`, `ProductReviews`,
`useTranslation`. Cart call is `addItem({ ...product, price }, qty, undefined, selectedSize)`.

## Copy sourcing

All claims come from the product DB record and Intertek source documents. Verified figures
used on the page: **+145.8% immediate hydration**, **2.4× increase in skin hydration**,
5 ceramides (NP, AS, AP, NS, EOP), 33-ingredient Full INCI printed unedited.
Prices: 200 ml AED 380 (homecare), 600 ml AED 620 (professional).

## Visual QA findings and fixes

Screenshot + interaction audit at 1440×900 and 390×844.

1. **Cropped marketing images.** Every `public/images/cera/*.jpeg` is 1:1 with baked-in text.
   The How-to-Use and Proof frames were `aspect-[4/5]`, which cut the wording
   ("OW IT WORKS", "el-to-Foam"). Both are now `aspect-square`.
2. **Full-bleed banner removed.** `main_wide.jpeg` in a 21/9 frame cropped badly, and the
   shot duplicated the hero image. Removed; ~780 px of scroll saved.
3. **Texture section rebuilt.** Was three centred CSS orbs. Now a two-column editorial:
   `cera.jpeg` (bottle in foam) beside the gel → water → foam steps, headed
   "Gel. Water. Foam." instead of repeating the science card title.
4. **Duplicate eyebrow.** Product details section said "Choose your size", same as the hero
   selector. Added a dedicated `details.eyebrow` ("Two sizes" / "حجمان" / "Два объёма").
5. **Mobile sticky cart.** Was always on screen, including while the inline CTA was visible.
   Now driven by the same IntersectionObserver sentinel as the desktop bar, with
   `inert` + `aria-hidden` when hidden.
6. **Tap target.** Brochure link was 20 px tall; now `min-h-[44px]`.
7. **Lightbox stacking (reported from the browser).** The overlay carried `z-[9999]` but
   the gallery sits inside stacking contexts (the sticky hero column, `CeraReveal`
   transforms), so the site header and the 200/600 ml size cards painted over it. The
   lightbox is now rendered with `createPortal` into `document.body`, behind a `mounted`
   guard for SSR.
8. **Hero rebalanced.** Measured: the packshot rendered at 381 px inside a 1152 px hero
   (33%), because the 76 px thumb rail plus 32 px of stage padding ate the column — and
   `main2.jpeg` already carries its own whitespace, so that padding was a margin on a
   margin. Grid is now `1.45fr / 1fr`, stage padding `p-3 sm:p-4`. Packshot renders at
   **512 px, 44% of the hero**; the copy column is 444 px and the h1 still breaks over the
   same three lines.
9. **Thumbnail rail curated.** Was four frames, two of which (S1 "HOW IT WORKS", S4/S5 spec
   cards) are text-heavy and unreadable at 68 px. Rail is now three visually distinct
   frames — duo packshot, model, Pink Ceramide complex — at 72/80 px. The dropped
   infographics are already shown full-width in How to Use and Product details.
   Note: `cera.jpeg` and `main_wide.jpeg` are on disk but **not** in the product's DB
   `images` field, so they are used only in editorial sections. Adding them to the rail
   would require a DB write, which is shared with production and the mobile app.
10. **Lightbox controls.** The prev/next buttons came before the image in the DOM at the
   same z-layer, so on mobile the packshot covered them; and `bg-white/10` was invisible
   against a white product shot. Controls are now `z-10` with a dark translucent fill and
   a `ring-white/25` edge.

## Verified

- `/products/66`, `/products/60`, `/products/44` all return 200.
- 0 px horizontal overflow at both widths; 0 broken images; 0 console errors.
- Size switch updates price; Full INCI accordion toggles `aria-expanded`; 6 FAQ accordions;
  4 gallery thumbnails switch with `aria-pressed`; desktop sticky bar appears past the hero.
- `npx tsc --noEmit` — no errors in any cerabarrier file. The only 5 errors in the repo are
  pre-existing, in `utils/formatProductDisplayName.tsx` (unrelated uncommitted work).
- `npx eslint components/product/cerabarrier app/products/[id]/page.tsx` — clean.

## Readability pass (after first review)

Feedback was that body copy was too small to read, the usage steps did not read as
steps, and the cards were too cramped.

- **Text colours darkened.** `--cera-body` `#4a4340` → `#3d3734`, `--cera-muted`
  `#857b76` → `#665e59`. The muted tone was ~4.0:1 on cream, below comfortable reading
  contrast at small sizes; it is now ~5.6:1. Eyebrow labels 11 px → 12 px.
- **Body copy raised to 15–16 px** across science cards, texture steps, complex points,
  actives, proof, size notes, hero bullets, details table and Full INCI. Most of it was
  13.5–14 px in muted grey, which is what made the page hard to read.
- **How to Use steps are now cards.** Each step is a `cera-card` with a filled rose
  numeral badge (48 px mobile / 56 px desktop, white numeral) instead of a thin outlined
  circle in a bare list. Titles 21–24 px, body 15–16 px in `--cera-body`.
- **Science cards: 4-across → 2-across** inside a 1040 px column, padding 6/7 → 7/8.
  At four columns each card was ~285 px wide, so 16 px copy would have wrapped every
  ~13 characters.
- **Routine rebuilt as a numbered sequence.** Was a 5-across grid of ~215 px cards with
  `line-clamp-4` at 12.5 px, which cut every description mid-sentence. Now full-width
  stacked cards (max 920 px): large `01`–`05` numeral, 124 px packshot, untruncated
  description, and a `VIEW PRODUCT ›` affordance. On phones the numeral and packshot sit
  above the copy so the description gets the full card width instead of a ~190 px column.

Re-verified: `/products/66` returns 200, 0 px horizontal overflow at 1440 and 390,
eslint clean on `components/product/cerabarrier`.

## Gallery shows the full set again

The earlier curation pass introduced a hardcoded `HERO_IMAGE_ORDER` allowlist that
intersected with the product's images, which silently dropped `S1`, `S4` and `S5` —
only 3 of the 6 available images reached the thumbnail rail.

That also violated the `product-gallery-images` rule: the DB `images` field is the one
source of truth and the main image is prepended by the page, not stored in the array.
The allowlist is gone; `galleryImages` is now `product.image` + `parseJsonArray(product.images)`,
de-duplicated, in DB order. Product 66 resolves to 6 thumbnails:

`main2.jpeg` (main) + `S1 · S2 · S3 · S4 · S5`

Note `S4`/`S5` are still reused as the 200 ml / 600 ml spec shots in the size-comparison
section; appearing in both places is intentional. Verified 6 thumbnails at 1440 and 390
with 0 px horizontal overflow.

## Seamless gallery stage

The stage was drawing two competing rectangles: a cream `.cera-glow` card with a
`--cera-line` border and `28/34 px` corners, and inside it the photo at `object-contain`
with `p-3/p-4`. Because the packshot sweeps are not pure white (`main2` samples
`#eeeeee`, `S1`–`S3` around `#ededed`–`#f2f4f3`, only `S4`/`S5` are `#ffffff`), the
photo's own edge stayed visible as a grey rectangle floating inside the cream frame.

- All six images are 1024 × 1024, and the stage is `aspect-square`, so the image can be
  `object-cover` with no padding and crop nothing. The photo now *is* the card surface.
- Border removed. New `.cera-stage` gives the card a soft drop shadow plus a
  `::after` hairline at `z-index: 2` — an `inset` box-shadow on the element itself would
  be painted under the fill image and never show.
- Background kept at `#f1efee` as a fallback in case a non-square image is ever added.
- The IN STOCK badge is now rendered only on the first slide. Edge-to-edge images made it
  collide with the top-left headline on the `S1`/`S4`/`S5` infographics.

`mix-blend-multiply` was considered and rejected: the grey sweeps are darker than the
cream page, so multiplying would have deepened the rectangle rather than dissolving it.

## Add to cart from the size-comparison cards

Those cards previously only offered "Choose your size", which set the hero selector and
scrolled back to the top — three interactions to buy the size you were already looking at.

- `addToCart(qty, size = selectedSize)` now takes an explicit size, so a card can add its
  own format without touching the hero selection. Everything else (login redirect, price
  lookup via `getPriceForSize`, `trackAddToCart`) is the same code path as the hero CTA.
- Each card has its own `Add to bag` button with independent busy/added state
  (`sizeAdding` / `sizeAdded` keyed by size value), so adding the 600 ml does not flip the
  200 ml button into a spinner.
- `Choose your size` was dropped from these cards entirely: with a direct add button next
  to the price, a second control that only moved the hero selector was noise. The hero
  selector remains the way to change the size shown in the gallery.
- Cards show `In bag · N × 600ml` when that size has a cart line, read per size via
  `findSelectedStandardCartLine`.
- Labels reuse the existing `addToBag` / `adding` / `added` / `loginToShop` / `outOfStock` /
  `inBag` copy keys, so EN, AR and RU were already covered with no copy changes.

Verified logged out: the card button renders `Log in to shop` and clicking it lands on
`/login`, matching the hero. Logged-in add still needs a click-through on your account.

## Routine section rebuilt as a shoppable strip

The routine was five full-width stacked rows, roughly 950 px of page for what is a
cross-sell, and nothing in it could be bought. Both problems came from the same cause:
each row carried a full paragraph of layering copy, which forced the row wide and left no
room for commerce.

What the research says (Baymard product-page cross-sell studies, plus current beauty-DTC
practice):

- Minimum item attributes for a cross-sell are thumbnail, **fully visible** title, price
  and rating. Long body copy is not on that list — it belongs on the linked product page.
- Use a direct add-to-cart for low-cost, high-dependency complements, in **secondary**
  styling so it never competes with the primary buy box.
- Keep it in the natural scroll path below the product info, 2–3 items per row on mobile,
  inside the thumb zone.
- Label it for the use case ("Complete the routine"), not "You may also like".

Applied:

- Five compact cards, `grid-cols-2` on phones and `grid-cols-5` on desktop: square
  packshot with a small step number, product name, price, then the action pinned to the
  card bottom with `mt-auto` so all buttons line up regardless of title wrap.
- The step paragraphs were removed from the cards. The section intro still frames the
  routine and each card links through to the full product page.
- Steps 2–5 get an outlined `Add to bag` pill (secondary styling, `h-10`, full card
  width). Step 1 is the product you are on, so it shows a `You are here` chip instead.
- Height went from about 950 px to **363 px** on desktop.

Wiring:

- `app/products/[id]/page.tsx` now resolves the routine's products server-side for 66 only,
  via the existing `getProductsByNumbers`, and passes them as `routineProducts`. Doing it
  on the server means the strip is render-complete on first paint instead of fetching four
  products client-side the way `ProductRecommendation` does.
- Routine products for 66 are 14, 19, 27 and 40. All four are single-variant SKUs
  (`getProductSizeOptions` returns `[]`), so a single tap adds them with no size dialog.
- Prices run through `getPricingDisplay(item, user)`, the same helper as the main buy box,
  so a customer on a tier discount is not quoted list price. Discounted items show the
  original struck through. `canUserSeePrices` gating is unchanged.
- `handleAddRoutineProduct` mirrors the hero: login redirect for logged-out users,
  `trackAddToCart`, per-item busy/added state keyed on product id, and `In bag · N` read
  via `findSelectedStandardCartLine`.
- Legacy products carry the catalogue number in `id` with `productNumber` null, newer ones
  the reverse, so the lookup map keys on `String(p.productNumber ?? p.id)`.

Verified: page 200, zero horizontal overflow at 1440 and 390, no console or page errors,
four add buttons present in the strip, and clicking one while logged out lands on `/login`.
ESLint clean on the Cerabarrier files and the route; `tsc` reports nothing for either.

## Not done

Not committed, not pushed, not deployed. Unrelated uncommitted work in the tree
(`data/productTranslations*.ts`, `messages/*.json`, `utils/formatProductDisplayName.tsx`,
`stash@{0}` from 2025-11-25) was left alone.
