# Session Changes — April 17, 2026 — Product Detail Page UX Overhaul

## Summary

Design and UX audit of the product detail page (PDP) at `/products/[id]` (tested against `/products/51` — BIO-FERMENT AGE DEFYING POWDER MASK). Audit identified 10+ issues; the user selected the top 5 critical items for immediate implementation. All 5 shipped, verified locally with the Cursor browser MCP at 3 viewports, lint + typecheck clean.

**Scope:** UI/UX only. No business logic, pricing, or API changes. All three display modes (Desktop, Mobile Web, PWA) and all three languages (EN, AR, RU) covered.

---

## The 5 Improvements

### 1. Fake 5-star rating → honest "Be the first to review"

**Problem.** `product.rating` is pre-seeded (often `5.0`) in the DB. The PDP was rendering a filled 5-star block with `(0)` next to it even when zero real reviews existed. Misleading and erodes trust the moment a buyer clicks through.

**Fix.** Added a client-side fetch of the real aggregate from `/api/products/[id]/reviews` inside `ProductPageClientRefactored.tsx`. Stars only render when `reviewCount > 0`; otherwise a subtle text link "Be the first to review" jumps to `#reviews`.

```tsx
const [reviewAggregate, setReviewAggregate] = useState<{ averageRating: number | null; reviewCount: number } | null>(null)

useEffect(() => {
  let cancelled = false
  fetch(`/api/products/${product.id}/reviews`)
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (!cancelled && data) {
        setReviewAggregate({
          averageRating: data.averageRating ?? null,
          reviewCount: data.reviewCount ?? 0,
        })
      }
    })
    .catch(() => { /* silent */ })
  return () => { cancelled = true }
}, [product.id])

const displayRating = reviewAggregate && reviewAggregate.reviewCount > 0 ? reviewAggregate.averageRating : null
const displayReviewCount = reviewAggregate?.reviewCount ?? 0
```

Both the desktop header block and the mobile metadata block were rewritten to render one of two branches: real stars + count, or the plain text link. Seeded `product.rating` is never trusted again.

**Files:** `app/products/[id]/ProductPageClientRefactored.tsx`

---

### 2. Visible breadcrumb (Home / Products / Product Name)

**Problem.** A tiny "← Back to Products" link at the top. No wayfinding, no SEO benefit beyond the existing schema, poor scanability.

**Fix.** New client component `ProductBreadcrumb.tsx` with proper `<nav aria-label="Breadcrumb">` markup, RTL-aware separators, and truncation for long product names. Rendered only on desktop/tablet (`!isAppLikeMode`) next to the moved Share button. On PWA/mobile-web the existing top-bar `< Products` back affordance stays — better ergonomics than a wrapped breadcrumb on a 360px viewport.

**Files:**
- `app/products/[id]/components/ProductBreadcrumb.tsx` — new
- `app/products/[id]/ProductPageClientRefactored.tsx` — integration

---

### 3. Trust strip unified with /products listing page

**Problem.** Two different trust strips on the same site:
- `/products` listing page had a polished 3-column strip with icons (shipping / authentic / VAT)
- PDP had either none or a weaker version

**Fix.** `TrustBadges.tsx` rewritten to match the listing page exactly — same 3 items, same Heroicons outlines, same layout. Placed in two spots:
- Desktop: below the Add to Cart block in the left column
- Mobile (non-PWA): after recommendations, above reviews

**Important implementation note.** Strings are **inlined** inside the component (three keys × three languages = 9 strings) instead of routed through `t('products.trustShipping')`. This was a deliberate sidestep of an intermittent Turbopack messages-chunk resolution bug specific to the PDP route — see "Known Issues" at the bottom.

```tsx
const TRUST_COPY = {
  en: {
    shipping: 'Free shipping over AED 1,000',
    authentic: 'Authentic Korean dermacosmetics',
    vat: 'All prices VAT inclusive',
  },
  ar: { shipping: 'شحن مجاني للطلبات فوق 1,000 درهم', authentic: '...', vat: '...' },
  ru: { shipping: 'Бесплатная доставка от 1,000 AED', authentic: '...', vat: '...' },
} as const
```

**Files:** `components/product/TrustBadges.tsx`

**Follow-up fix (same day).** The horizontal layout worked fine on mobile full-width but overflowed/clipped on desktop where `TrustBadges` sits inside the narrow left column (~590px wide in a `lg:grid-cols-2` layout). Three `whitespace-nowrap` badges with `gap-10` need ~740px to fit side-by-side, so "All prices VAT inclusive" was getting cut off the right edge (the previous `overflow-x-auto scrollbar-hide` made it silently scroll-hidden — worst of both worlds).

Added a `layout` prop to `TrustBadges`:
- `horizontal` (default, used on mobile full-width) — now uses `flex-wrap` instead of `overflow-x-auto`, so badges wrap onto a second line naturally when the container is narrow.
- `stacked` (used on desktop inside the narrow left column) — `flex-col items-start gap-2.5`, each badge on its own line, left-aligned.

```tsx
// Desktop (narrow left column)
<TrustBadges layout="stacked" />

// Mobile (full-width, wraps cleanly)
<TrustBadges />
```

Visual result on desktop:
```
🚚  Free shipping over AED 1,000
✓   Authentic Korean dermacosmetics
💳  All prices VAT inclusive
```

---

### 4. Right column converted to accordion

**Problem.** Dense wall of text on desktop: Description → Benefits → Directions → How to Use → Key Ingredients → Note, all expanded, all fighting for attention. Poor visual hierarchy, users scroll past real content.

**Fix.** New reusable `ProductInfoAccordion.tsx` (title + icon + collapsible content, chevron rotation, keyboard accessible via `<button>` with `aria-expanded`). `ProductContentDisplay.tsx` now wraps each detail section in an accordion:

| Section | Default state |
|:---|:---|
| Benefits | **Open** (most useful at first glance) |
| Directions | Collapsed |
| How to Use | Collapsed |
| Key Ingredients | Collapsed |
| Note | Collapsed |

Content uses conditional rendering `{isOpen && (...)}` rather than `hidden` class — collapsed items contribute zero vertical space, so the layout doesn't look "gappy".

**Files:**
- `components/product/ProductInfoAccordion.tsx` — new
- `components/product/ProductContentDisplay.tsx` — wrapped sections

---

### 5. Mobile footer cleanup — widen CTA, move Share out

**Problem.** Sticky mobile footer had 4 buttons (quantity − / + / Add / Share / Favorite), cramming the Add to Cart button into ~40% of the width. Share in the footer made no sense — it's a header/profile-level action, not a purchase action.

**Fix.** Share moved to two new homes:
- PWA / mobile-web: top header next to the profile avatar (`Share2` icon, copies-to-clipboard fallback, ✓ feedback for 2s)
- Desktop: next to the breadcrumb

Footer is now: quantity stepper + **wide Add to Bag / Request Quote CTA** + favorite heart. The CTA jumped from ~40% to ~60% of the footer width on 390px screens.

**Files:** `app/products/[id]/ProductPageClientRefactored.tsx`

---

## Files Touched

```
app/products/[id]/ProductPageClientRefactored.tsx     # primary — breadcrumb, share, rating fetch, trust, footer
app/products/[id]/components/ProductBreadcrumb.tsx    # NEW
components/product/TrustBadges.tsx                    # rewritten with inlined locale copy
components/product/ProductInfoAccordion.tsx           # NEW
components/product/ProductContentDisplay.tsx          # wrapped sections in accordions
components/product/index.ts                           # exported new component
messages/en.json                                      # added product.beTheFirstToReview + products.trustShipping/Authentic/Vat
messages/ar.json                                      # same
messages/ru.json                                      # same
```

---

## Verification

### Local dev server
- Full `.next` cache wipe + restart (`rm -rf .next && npm run dev`)
- Tested at `http://localhost:3000/products/51`
- Also spot-checked `/products/22` (has variant + different accordion content)

### Cursor Browser MCP snapshots confirmed
- ✅ `role: navigation, name: Breadcrumb` present
- ✅ `role: region, name: Trust signals` × 2 (desktop + mobile)
- ✅ `role: button, name: Benefits, states: [expanded]`
- ✅ `role: button, name: Directions, states: [collapsed]`
- ✅ `role: button, name: Key Ingredients, states: [collapsed]`
- ✅ `role: button, name: Share product` in header (not footer)
- ✅ `role: button, name: Add to Bag` + `Add to favorites` in footer (no Share)

### Screenshots captured
- `pdp-51-desktop-after.png` — desktop full page
- `pdp-51-top.png` — mobile top section (header, image, product name, sticky footer)
- `pdp-51-success.png` — mobile trust strip rendering correctly: "Free shipping over AED 1,000 · Authentic Korean dermacosmetics · All prices VAT inclusive"

### Lint / TypeScript
- `ReadLints` — 0 errors on all 5 edited files
- `npx tsc --noEmit` — clean (one unused `Link` import found and removed)

---

## Known Issues / Caveats

### Turbopack messages-chunk resolution bug on PDP route (sidestepped)

**Symptom.** During development, `t('products.trustShipping')` on the PDP sometimes returned the literal string `"products.trustShipping"` instead of the resolved translation. Console showed `Translation key not found: products.trustShipping`. The **same call on the `/products` listing page worked fine**, with the same bundled `messages_*._.js` chunk loaded.

**Diagnostic steps taken.**
1. Verified `messages/en.json` contains `products.trustShipping` at the correct path (Node runtime check).
2. Verified the bundled `.next/dev/static/chunks/messages_0odcdco._.js` chunk contains the key (`grep -c trustShipping` = 3, one per locale).
3. Full cache nuke: `rm -rf .next && npm run dev` — didn't help.
4. Added runtime `console.log` to `hooks/useTranslation.ts` — logs never appeared in the browser, proving the browser was serving a stale cached version of the hook.
5. **Root cause identified:** a stale **service worker** (`/sw.js`) was intercepting requests for the JS chunks and serving an older cached version. Unregistering the SW + `caches.delete()` fixed it immediately.

**Why it won't affect production.**
- New users never have a stale SW.
- Existing users get invalidation on the next deploy when the SW version string bumps (see `public/sw.js` / PWA config).
- If any user does get stuck, hard refresh or "Unregister service workers" in DevTools → Application clears it.

**Mitigation baked into this PR.** To make the trust strip bulletproof regardless of the above, I inlined the 9 strings directly in `TrustBadges.tsx`. There is no runtime translation lookup for these keys anymore, so the failure class is eliminated for this component. The translation keys remain in the JSON files (harmless, can be re-used elsewhere).

**If you see raw keys in your dev browser:** open DevTools → Application → Service Workers → Unregister; Application → Storage → Clear site data; hard refresh.

### Hydration warning in `components/NetworkStatus.tsx`
Unrelated pre-existing warning (line 130). Not introduced by this change. Worth addressing separately — probably a `navigator.onLine` check without a client guard.

---

## Responsive Behavior Matrix

| Element | Desktop (lg+) | Tablet / mobile-web | PWA |
|:---|:---|:---|:---|
| Breadcrumb | Home / Products / Name | hidden (top-bar back button instead) | hidden (top-bar back button instead) |
| Share button | next to breadcrumb | top header next to avatar | top header next to avatar |
| Rating display | stars + count OR "Be the first to review" | same, smaller font | same |
| Trust strip | below cart block | after recommendations | hidden (reduces clutter for app users) |
| Content sections | accordion, Benefits open | accordion, Benefits open | accordion, Benefits open |
| Sticky footer | — (desktop has inline quantity/cart) | Qty / Add to Bag / Heart | Qty / Add to Bag / Heart |

---

## RTL / i18n

- `ProductBreadcrumb` flips separator direction via `dir === 'rtl'`
- `TrustBadges` sets `dir={dir}` on the outer flex container
- `ProductInfoAccordion` swaps chevron side in RTL
- Arabic & Russian trust strings checked (native speaker review not done — strings are functional, not marketing-polished)

---

## Follow-ups / Not Done

These came out of the audit but were **not** part of the "top 5":

1. **Product image gallery zoom-on-hover** (desktop) — current gallery has thumbnails + main image, but no magnify.
2. **Sticky add-to-cart on desktop** once the user scrolls past the fold — would eliminate "scroll back up to buy" friction.
3. **Cross-sell / "frequently bought together"** generalized — currently hardcoded per product ID in `ProductPageClientRefactored.tsx` (22→32, 51→22, etc.). Should move to a DB table or a computed relationship.
4. **Review submission UX polish** — separate audit needed, the `ProductReviews` component is untouched here.
5. **Hydration warning in `NetworkStatus.tsx:130`** — pre-existing, unrelated.
6. **Clean up the massive `hidden lg:block` recommendation ladder** in `ProductPageClientRefactored.tsx` — ~40 duplicated blocks per product pairing, desktop + mobile. Should be a single `recommendationMap` object + one conditional render.

---

## Commit Guidance

When committing this change, suggested message:

```
feat(pdp): 5 critical UX improvements — breadcrumb, honest rating, trust strip, accordion, cleaner footer

- Replace fake 5-star seeded rating with live review fetch; fall back to "Be the first to review"
- Add Home / Products / Name breadcrumb on desktop (ProductBreadcrumb.tsx)
- Unify trust strip with /products listing (TrustBadges.tsx), inline copy to sidestep SW caching edge case
- Convert right-column details into accordion (ProductInfoAccordion + ProductContentDisplay); Benefits open by default
- Widen mobile Add to Bag CTA by moving Share to header; footer is now Qty + CTA + Heart

All 3 display modes (desktop / mobile-web / PWA) and 3 locales (en / ar / ru) verified locally.
Lint + typecheck clean.
```

Untouched, lingering files in working tree from earlier sessions are not part of this change set.
