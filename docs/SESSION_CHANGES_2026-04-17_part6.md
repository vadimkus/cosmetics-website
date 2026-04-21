# Session Changes — April 17, 2026 (Part 6)

## Summary

Design & UX refresh of the **`/products`** listing page. A full walk-through of
the live page was done against the design system, followed by a targeted,
low-risk set of improvements aimed at: **faster discovery of new categories,
stronger brand trust signals, and fewer redundant UI elements**. Ends with
full i18n wiring so every string renders in EN / AR / RU.

No schema, API, or data changes. Pure front-end polish.

Items addressed:

1. Default sort → **Newest First** (was *Name A–Z*)
2. Mobile category pills → single **horizontally-scrolling row** with snap
3. New category group (**Skin Concern**, **Cream**, **Beauty Boxes**) moved to the **front** of the list, right after *All Products*, and tagged with a green **NEW** badge (mobile pills + desktop sidebar)
4. **Trust strip** added below search — `Free shipping over AED 1,000 · Authentic Korean dermacosmetics · All prices VAT inclusive`
5. Mobile: **sort dropdown now visible** (was desktop-only)
6. Product card description: **always 2 lines** (was 4 on mobile, 2 on desktop)
7. Guest CTA on product cards softened from solid-red to **outlined/ghost** red — less aggressive before login
8. Removed redundant "← Back to Home" desktop link — breadcrumb is the single source of truth now
9. **Full i18n** for the new trust-strip copy (EN / AR / RU)

---

## Files modified

| File | Change |
|---|---|
| `app/products/ProductsPageClient.tsx` | Default sort, mobile category scroll, category order, trust strip, mobile sort visible, removed back-to-home link + `ArrowLeft` import, trust strip wired to `t()` |
| `components/ProductCard/ProductInfo.tsx` | Description `line-clamp-4 md:line-clamp-2` → `line-clamp-2` |
| `components/ProductCard/ProductActions.tsx` | Guest "Login to see price" button → outlined/ghost style |
| `components/products/ProductFilters.tsx` | Green NEW badge beside Skin Concern / Cream / Beauty Boxes in sidebar |
| `messages/en.json` · `messages/ar.json` · `messages/ru.json` | +3 new keys under `products`: `trustShipping`, `trustAuthentic`, `trustVat` |

---

## 1. Default sort → Newest First

`/products` was opening with **Name (A–Z)**, which surfaced the oldest catalog
items first. For a skincare catalog where new launches (Beauty Boxes, Creams,
Skin-Concern sets) drive conversion, this buries what we most want visitors to
see.

```tsx
// app/products/ProductsPageClient.tsx
- const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'name-asc')
+ const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'newest')

- if (sortBy !== 'name-asc') params.set('sort', sortBy)
+ if (sortBy !== 'newest') params.set('sort', sortBy)
```

URL-param logic updated so the new default doesn't leave a `?sort=newest` tag
on bare `/products` URLs.

---

## 2. Mobile category pills → horizontal scroll

Was: pills wrapped onto 3–4 lines on phones, pushing the product grid far
below the fold. Now: one scrollable row with snap scrolling, matching the
pattern used by mobile-native storefronts.

```tsx
// app/products/ProductsPageClient.tsx
- <div className="md:hidden mb-4">
-   <div className="flex flex-wrap gap-2">
+ <div className="md:hidden mb-4 -mx-4 px-4">
+   <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-3 pb-1 snap-x snap-mandatory">
```

The `pt-3` is intentional — the absolutely-positioned green **NEW** badges
on the first pills were overlapping the trust strip (see §4) without it.

Each pill got `flex-shrink-0 snap-start` so they don't compress and they land
cleanly at the viewport edge when scrolled.

---

## 3. NEW categories grouped + badged

The category order was alphabetical-ish. Reordered so the three **new**
categories appear immediately after *All Products* — the highest-signal slots
in a vertical list.

```tsx
const getCategories = (t) => [
  { id: 'all', name: t('products.allProducts') },
  // NEW — grouped together right after "All Products"
  { id: 'skin-concern',  name: t('products.skinConcern') },
  { id: 'cream',         name: t('products.cream') },
  { id: 'beauty-boxes',  name: t('products.beautyBoxes') },
  // ...rest follow as before
]
```

A small green **NEW** badge was added in **two places**:

- **Mobile pills** (already existed, ordering fixed)
- **Desktop filter sidebar** — added now for visual consistency

```tsx
// components/products/ProductFilters.tsx
const isNew = category.id === 'skin-concern'
          || category.id === 'cream'
          || category.id === 'beauty-boxes'

<span className="text-gray-900 flex items-center gap-1.5">
  {category.name}
  {isNew && (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px]
                     font-bold tracking-wide uppercase bg-green-500 text-white
                     leading-none">
      {t('common.new')}
    </span>
  )}
</span>
```

---

## 4. Trust strip

New row directly below the search bar with three value-prop icons and copy.
Purpose: address the three most common pre-purchase doubts (shipping cost,
product authenticity, tax transparency) on the listing page itself, before
the user commits to a PDP click.

```tsx
<div className="mb-4 flex items-center justify-center gap-5 md:gap-10
                text-xs md:text-sm font-medium text-gray-800
                border-y border-gray-200 bg-gray-50 py-3
                overflow-x-auto scrollbar-hide">
  <span className="flex items-center gap-2 whitespace-nowrap">
    <svg className="w-4 h-4 text-primary-600 flex-shrink-0" ... />
    {t('products.trustShipping')}
  </span>
  <span className="flex items-center gap-2 whitespace-nowrap">
    <svg className="w-4 h-4 text-primary-600 flex-shrink-0" ... />
    {t('products.trustAuthentic')}
  </span>
  <span className="flex items-center gap-2 whitespace-nowrap">
    <svg className="w-4 h-4 text-primary-600 flex-shrink-0" ... />
    {t('products.trustVat')}
  </span>
</div>
```

Styling evolved over iterations — **final** version uses `bg-gray-50` fill
+ `border-y border-gray-200` + `font-medium` + `strokeWidth={2.2}` icons so
the strip reads as a distinct band rather than fading into the page.

---

## 5. Mobile sort visible

The `<ProductSort />` dropdown was hidden on phones (`hidden md:block`) —
meaning mobile users had no way to switch from the default sort. Now visible
on all breakpoints.

```tsx
- <div className="hidden md:block">
-   <ProductSort sortBy={sortBy} onSortChange={handleSortChange} />
- </div>
+ <div className="w-full sm:w-auto">
+   <ProductSort sortBy={sortBy} onSortChange={handleSortChange} />
+ </div>
```

---

## 6. Product card description — 2 lines everywhere

Mobile was showing up to **4 lines** of description, which ballooned card
height on small screens and reduced the number of products visible
above the fold.

```tsx
// components/ProductCard/ProductInfo.tsx
- className="... line-clamp-4 md:line-clamp-2"
+ className="... line-clamp-2"
```

---

## 7. Guest "Login to see price" → outlined

Before: every card showed a full solid-red CTA for logged-out users, which
made the grid feel shouty and competed with real *Add to Cart* buttons on
the authenticated view.

After: outlined/ghost style — still branded, still primary-colored, but
visually calmer. Actual purchase CTAs for logged-in users remain solid red
(intentional — that's the conversion button).

```tsx
// components/ProductCard/ProductActions.tsx
- className={`${baseButtonStyles} bg-primary-600 text-white hover:bg-primary-700`}
+ className={`${baseButtonStyles} bg-white text-primary-700 border border-primary-600 hover:bg-primary-50`}
```

**Why different styles?** Logged-in users see a real transactional CTA ("Add
to Cart") — solid red is correct for a conversion click. Logged-out users
see an auth gate, not a buy button — outlined style signals "you need to
sign in first, no commitment yet," reducing the friction of showing login
modal on every product in the grid.

---

## 8. Removed "← Back to Home" link

The page already shows a breadcrumb at the top (`Home / Products`). Having
both a breadcrumb *and* a back arrow is redundant, and on desktop it was
taking up vertical space above the fold.

```tsx
- {!isPWA && (
-   <Link href={getLocalizedPath('/', locale)}
-         className="hidden md:inline-flex items-center gap-1 ...">
-     <ArrowLeft className="h-4 w-4" />
-     <span>{t('navigation.backToHome')}</span>
-   </Link>
- )}
+ {/* "Back to Home" removed on desktop — breadcrumb is the single source of truth now */}
```

`ArrowLeft` import from `lucide-react` also removed (was orphaned).

---

## 9. Full i18n for the trust strip

The first implementation of the strip hard-coded English. Fixed: 3 new keys
added under `products` in all three locale files.

### Translations

| Key | EN | AR | RU |
|---|---|---|---|
| `trustShipping` | Free shipping over AED 1,000 | شحن مجاني للطلبات فوق 1,000 درهم | Бесплатная доставка от 1 000 AED |
| `trustAuthentic` | Authentic Korean dermacosmetics | مستحضرات تجميل كورية أصلية | Оригинальная корейская дермакосметика |
| `trustVat` | All prices VAT inclusive | جميع الأسعار شاملة ضريبة القيمة المضافة | Все цены включают НДС |

### Translation notes

- **AR**: *"مستحضرات تجميل كورية أصلية"* = literally *"authentic Korean
  cosmetics"*. The word *"dermacosmetics"* has no clean single-word Arabic
  equivalent; *"مستحضرات تجميل طبية"* (medical cosmetics) reads too
  clinical. Dropped without loss of meaning.
- **AR**: Used *"درهم"* (dirham) for the currency — matches how it reads
  aloud in Arabic. If we ever want consistency with checkout (which uses
  *"AED"* as a Latin code), change to `"شحن مجاني للطلبات فوق 1,000 AED"`.
- **RU**: `1 000` uses a narrow non-breaking space — correct Russian
  thousands typography. *"Дермакосметика"* is the accepted transliteration
  on the Russian professional-skincare market. *"AED"* left as a Latin code
  — standard practice for currency codes in Russian commerce.

### Wiring

```tsx
// Before
Free shipping over <strong>AED 1,000</strong>
Authentic Korean <span className="hidden sm:inline">dermacosmetics</span>
All prices <span className="hidden sm:inline">VAT&nbsp;</span>inclusive

// After
{t('products.trustShipping')}
{t('products.trustAuthentic')}
{t('products.trustVat')}
```

The responsive `hidden sm:inline` spans were dropped — translations are
short enough to fit without truncation on mobile. RTL flip on `/ar` works
automatically because the page root already carries `dir="rtl"`.

---

## Verification

- `git diff --stat` — 7 files, +74 / -39
- Ran `node` parse-check on all 3 locale JSON files → all valid, new keys
  resolve correctly
- `npm run dev` — compiles clean, no lint errors, no TS errors
- Visual check on `http://localhost:3000/products` on desktop + mobile
  viewport → all 9 items rendering as described

---

## Related docs

- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — colors, typography, primary red definition
- [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) — general patterns, i18n setup
