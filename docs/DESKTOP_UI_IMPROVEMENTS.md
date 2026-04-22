# Desktop UI Improvements — Living Log

Tracks the desktop UX polish initiative for genosys.ae. Each entry below corresponds to a single, focused commit that has shipped to `main`. Mobile / PWA paths are intentionally untouched in this stream of work.

The original audit (P0 → P2 backlog) is captured in chat history; this file logs only what has actually shipped.

---

## Shipped

### #1 — Products grid: 4 columns at 2xl (≥1536px)
**Date:** 2026-04-17  ·  **Commit:** `586ceebc`
**File:** `app/products/ProductsPageClient.tsx`
**Change:** Added `2xl:grid-cols-4` to the desktop product grid (the `motion.div` branch — the PWA branch is unchanged at 3 columns).

**Why:** On 27" / ultra-wide monitors the catalog rendered with only 3 columns, leaving large empty gutters. With `container mx-auto` capping at 1536px, four columns give ~366px per card after gaps — matches the density expected from premium e-commerce sites.

**Breakpoint behaviour after change:**

| Breakpoint | Width | Columns |
|---|---|---|
| base | < 640px | 2 |
| sm | ≥ 640px | 2 |
| md | ≥ 768px | 2 |
| lg | ≥ 1024px | 3 |
| xl | ≥ 1280px | 3 |
| **2xl** | **≥ 1536px** | **4 (new)** |

**Risk:** none — additive Tailwind utility on a single grid.

---

### #4 — PDP: `md:grid-cols-2` to fix the 768–1023px awkward stack
**Date:** 2026-04-17  ·  **Commit:** `149cd384`
**File:** `app/products/[id]/ProductPageClientRefactored.tsx`
**Change:** The unified PDP grid changed from `grid-cols-1 lg:grid-cols-2` to `grid-cols-1 md:grid-cols-2` with `md:gap-8 lg:gap-12`. RTL flow (`md:grid-flow-row-dense`) and column-placement utilities (`md:col-start-2`, `md:col-start-1 md:row-start-1`) retargeted from `lg:` to `md:`.

**Why:** Between 768 and 1023px (iPad portrait, 13" laptops, split-screen) the PDP was single-column with image-on-top → huge vertical scroll through buy box and content. Two columns kick in one breakpoint earlier and eliminate that stack.

**Risk:** low — below 768px nothing changes. Existing image and buy-box widths already handled half-column widths.

---

### #5 — Checkout: readable order pill on `md+`
**Date:** 2026-04-17  ·  **Commit:** `ae91cd0e`
**File:** `app/checkout/CheckoutClient.tsx`
**Change:** The only line-item that lacked a desktop font-size override was the order-summary pill ("Order # NNNN" + AED total):
- Eyebrow: `text-[11px]` → `text-[11px] md:text-xs` (12px on md+)
- Pill total: `text-base` → `text-base md:text-lg`

**Why:** Audit flagged desktop checkout as too small. Inspection showed every other summary line already had `md:text-sm` / `md:text-xs` floors — only the pill eyebrow and total were missing them.

**Risk:** minimal — two utility additions on a single informational pill.

---

### #3 — PDP: bigger main image at xl/2xl + vertical thumb rail at lg+
**Date:** 2026-04-17  ·  **Commit:** `3742f37f`
**File:** `components/product/ProductImageGallery.tsx`
**Change:** Gallery switches from vertical stack to `lg:flex lg:gap-4 lg:items-start` at `lg+`. Thumbnails become a vertical rail on the left via `lg:order-1 + lg:flex-col`; under `dir="rtl"` they auto-flip to the right. Main image max-width raised: `lg:max-w-[420px] xl:max-w-[480px] 2xl:max-w-[560px]`. Thumbnail buttons grow to `lg:w-16 lg:h-16`. `next/image` `sizes` attribute tightened for accurate srcset selection. Added `aria-label` + `aria-pressed` on thumb buttons.

**Why:** Image was capped at 400px through xl/2xl and thumbs lived below the image. On 27"+ displays the image looked small and the image↔thumb relationship felt disconnected. Column math at lg: image 420 + gap 16 + thumbs 64 = ~500px, fits inside the ~512px grid column.

**Risk:** layout change gated behind `lg:` — tablet portrait and mobile are untouched.

---

### #6 — Footer: social + payment trust row at `md+`
**Date:** 2026-04-17  ·  **Commit:** `d1dec7db`
**Files:** `components/footer/Footer.tsx`, `messages/{en,ar,ru}.json`
**Change:** Added two elements above the existing copyright block (desktop-only since Footer returns null on mobile/PWA):

- **Social:** Instagram + Facebook circular icon buttons linking to the canonical handles (`@genosys.uae`, `/genosys.ae`). Hover tints to respective brand colours. `aria-label` on each.
- **Payments:** "WE ACCEPT" eyebrow + pill list (Visa, Mastercard, Amex, Apple Pay, Google Pay, Tabby, Tamara) matching checkout options. `<ul>` with `aria-label` for SR users.

Translation key: `footer.weAccept` added to en/ar/ru.

**Why:** Desktop footer had only nav + logo + copyright — zero social proof or payment trust signals, which premium e-commerce sites always surface.

**Deliberate non-choices:** no newsletter signup (mailing system isn't wired up); text pills instead of logo images (no vector assets in `/public`; keeps footer dependency-free and fully translatable).

**Risk:** additive, desktop-only, no new deps.

---

### #2 — Site-wide search in desktop header
**Date:** 2026-04-17  ·  **Commit:** `475a6520`
**Files:** `components/header/HeaderDesktopSearch.tsx` (new), `components/header/HeaderDesktopIcons.tsx`, `components/header/HeaderRussianDesktop.tsx`
**Change:** New `HeaderDesktopSearch` component:
- Rounded pill input with Search icon + Clear (X) affordance
- Responsive widths: `w-44` → `lg:w-56` → `xl:w-72`
- RTL-aware (icon position, padding, text-align all mirror)
- Keyboard shortcut `/` focuses the input when not already typing
- `role="search"` + `aria-label` + explicit `<label>` wiring for SR users
- Submits to `/products?search=QUERY` via `getLocalizedPath('/products', locale)` — re-uses the existing `ProductsPageClient` search param logic, no backend change

Wired into both `HeaderDesktopIcons` (EN/AR) and `HeaderRussianDesktop` so all three languages get parity. Reuses existing `common.search` / `common.searchPlaceholder` translations.

**Why:** No way to search the catalog from any page other than `/products`. Basic e-commerce affordance.

**Risk:** low — new component; no existing code paths changed except the import list inside each header variant.

---

### #7 — Brand-red foundation: tokens + shared `<Button>` primitive
**Date:** 2026-04-17  ·  **Commit:** `18a806b2`
**Files:** `app/globals.css`, `components/ui/Button.tsx` (new)
**Change:**
- `app/globals.css` `@theme` block gained semantic brand tokens:
  - `--brand-red` (default CTA)
  - `--brand-red-hover` / `--brand-red-active` (interaction states)
  - `--brand-red-soft` / `--brand-red-ink` (tinted bg / text on soft)
  - `--brand-red-ring` (focus ring tint)

  Values intentionally match the existing `--color-primary-*` scale so `bg-primary-600` Tailwind utilities stay in sync until call-sites migrate.

- `components/ui/Button.tsx` — accessible primitive:
  - Variants: `primary` (brand red), `secondary` (slate), `ghost`, `outline`, `danger`
  - Sizes: `sm` / `md` / `lg` — size `md` enforces 44px minimum touch target
  - `loading` prop with spinner, optional leading/trailing icon slots
  - `focus-visible:ring-2` with the brand token
  - `disabled:` styles + `aria-busy` when loading
  - Uses `forwardRef` so it plays well with form libraries

**Why:** Audit flagged inconsistent reds across CTAs (raw `#dc2626`, `bg-red-600`, `bg-primary-600`, and `red-500→red-600` gradients). This commit establishes one source of truth without migrating existing buttons.

**Explicitly NOT in this commit:** migration of existing buttons. ~dozens of callsites use different red shades; migrating all of them is a separate risk-tiered PR (brand pages first, then checkout, then PDP). Shipping the foundation first lets those migrations reference a stable primitive and token set.

**Risk:** zero — purely additive. No existing file behaves differently.

---

## Backlog (in priority order)

### P1 — desktop polish
- #8 — Hero flat on desktop
- #9 — App-store badges crowd commerce CTAs
- #10 — PDP trust badges stacked
- #11 — Products — no pagination or "Load more"
- #12 — PDP title centered + `text-2xl`
- #13 — Profile layout is a horizontal tab scroller
- #14 — Icon hit areas have no hover surface
- #15 — Trust strip on `/products` scrolls horizontally on small laptops

### P2 — nice-to-have
- #16 — No image zoom in lightbox
- #17 — Legal pages lack TOC
- #18 — PDP accordions all collapsed by default
- #19 — Hero video has no pause/mute
- #20 — No keyboard focus rings on product cards
- #21 — FAQ category chips — weak selected state
- #22 — Homepage has just the hero

### Follow-on from #7 (brand-red migration)
- Migrate brand / marketing page CTAs to `<Button variant="primary">`
- Migrate checkout + cart CTAs to `<Button variant="primary">`
- Migrate PDP "Add to Cart" to `<Button variant="primary">`
- Audit and remove raw `#dc2626` / `bg-red-600` / `from-red-500` gradients

Each will ship as its own focused commit with a corresponding entry here.
