# Desktop UI Improvements — Living Log

Tracks the desktop UX polish initiative for genosys.ae. Each entry below corresponds to a single, focused commit that has shipped to `main`. Mobile / PWA paths are intentionally untouched in this stream of work.

The original audit (P0 → P2 backlog) is captured in chat history; this file logs only what has actually shipped.

---

## Shipped

### #D1 — `/delivery` desktop: premium refresh
**Date:** 2026-04-17  ·  **File:** `app/delivery/DeliveryPageClient.tsx`
**Change:** First of a four-page marketing / support page polish sweep (`/delivery`, `/contact`, `/about`, `/training`). Desktop-only — every change sits behind `md:` / `lg:` utilities, the mobile-web and PWA branches are untouched.

- Container widened: `max-w-4xl` → `max-w-4xl lg:max-w-6xl`. On 1400–2000px monitors the page was pinned at 896px with huge side gutters.
- New hero eyebrow: `SHIPPING & RETURNS` (localised) tracked tight, above the h1, in primary-red small-caps. Establishes section context that was missing.
- New desktop-only stats strip under the hero — a 4-up dl (`Dubai 1 hour` / `UAE-wide 24–36 hr` / `Free shipping 1,000 AED+` / `Returns 10 days`) rendered as a single rounded container with 1px grid dividers. Hidden below `md`.
- Delivery Time + Partner cards: added tinted icon badges (`h-11 w-11 rounded-xl bg-primary-50`) at `md+`, bumped to `rounded-2xl + shadow-md`, indented the body text to align under the badge. Titles dropped from `text-2xl` → `text-lg` to fit the new density.
- Delivery Details: the inline 2-col stat list became a 4-up stat grid on `md+`, with each cell wrapped in its own white rounded card for clearer legibility against the `primary-50` tinted section.
- Free Shipping + Return Policy: the two promo sections now sit side-by-side from `lg+` (`grid-cols-1 lg:grid-cols-2`) instead of stacking vertically. Gradients softened to `bg-gradient-to-br from-emerald-50 to-emerald-100/70` / `blue-50 → blue-100/70` + 1px colour-matched borders. Inner "proof" cards now `shadow-sm`.
- Help section: added a desktop-only descriptive subhead ("We're ready to answer any question about your order or delivery."), buttons kept at primary-red / WhatsApp green, rounded corners nudged to `rounded-xl` at `md+`.

**Why:** The page read like a mobile page blown up — narrow column, hero without eyebrow, two small promo blocks stacked awkwardly on wide screens. Above changes give the page the same density and hierarchy as `/products` and the refreshed `/profile`.

**Risk:** desktop-only; all edits are under `md:` / `lg:` utilities or mobile-preserving overrides. Mobile layout is byte-identical below 768px.

---

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

### #6 — Footer: social + payment trust row at `md+` (partially reverted)
**Date:** 2026-04-17  ·  **Commits:** `d1dec7db` (ship), `<revert>` (partial revert)
**Files:** `components/footer/Footer.tsx`, `messages/{en,ar,ru}.json`
**Original change:** Added social row (Instagram + Facebook) AND a "WE ACCEPT" payment-methods pill list to the desktop footer.

**Revert (2026-04-23):** The "WE ACCEPT" payments row was removed at user request — visual noise outweighed the trust-signal benefit on desktop. The `footer.weAccept` translation keys were removed from en/ar/ru. The social row (Instagram + Facebook) is retained.

**Risk:** none — pure removal.

---

### #P1.5 — `/profile`: Account Status fallback tile
**Date:** 2026-04-23  ·  **Files:** `components/profile/ProfileForm.tsx`, `messages/{en,ar,ru}.json`
**Change:** The Account Status section uses a `md:grid-cols-2` grid: Price Access (always rendered) + Discount Level (only if `user.discountType` is set). For the large majority of accounts without a discount type, the right column was empty — the section rendered as a lopsided half-grid on desktop.

Added a neutral fallback tile that renders when `user.discountType` is null:

> **Account type: Standard**
> Contact us to apply for clinic-partner pricing.

- Uses `Shield` (lucide) + gray colour palette to read as informational, not promotional.
- Hint paragraph is `hidden md:block` so the fallback stays compact on mobile (where the Account Status grid already collapses to 1-col).
- i18n: added `profile.accountType`, `profile.standardAccount`, `profile.standardAccountHint` to en/ar/ru.

**Why:** A half-empty 2-col grid reads as a broken component, not an intentional layout. Giving the empty slot meaningful content (and a call to upgrade to clinic-partner pricing) turns it into a gentle upsell path without being pushy.

**Risk:** minimal — only changes what shows when `discountType` is null. Users with a discount type see the exact same Discount Level tile as before.

---

### #P1.4 — `/profile`: Editing-mode banner inside Personal Information
**Date:** 2026-04-23  ·  **Files:** `components/profile/ProfileForm.tsx`, `messages/{en,ar,ru}.json`
**Change:** When `isEditing` is true, the Personal Information card now renders an amber banner immediately under the card header:

> **Editing mode.** Make your changes, then press Save. Your sign-in email cannot be edited here.

- Icon: `Edit3` (lucide).
- Semantics: `role="status"` + `aria-live="polite"` so screen readers announce the state change when the Edit button is pressed.
- i18n: added `profile.editingMode` and `profile.editingHint` to `messages/{en,ar,ru}.json`.

**Why:** Previously the only visual signal that edit-mode was active was the inputs in the form turning editable (plus a small red "Cancel" pill in the tab action row far above). First-time users frequently didn't notice the mode change — especially on desktop where the card is wider and the input ↔ static-value visual diff is subtle. The banner makes the state unmistakable, explains which fields are off-limits, and guides the user to the Save button.

**Risk:** minimal — additive conditional block, banner only renders in edit mode. No change to form behaviour or submitted payload.

---

### #P1.3 — `/profile` desktop: Support + Skin Recommendation side-by-side
**Date:** 2026-04-23  ·  **File:** `components/profile/ProfileForm.tsx`
**Change:** The two bottom cards on the Profile tab — "Need Help?" (WhatsApp support) and "Skin Recommendation" — were two full-width cards stacking vertically on desktop. Wrapped them in a `grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 lg:gap-8` container so they sit side-by-side at `md+`. On mobile they still stack (single column grid).

Additional tightening:
- Bullet lists inside each card changed from `grid-cols-3` (horizontal, often clipping at half-column widths) to `flex flex-col gap-2` — readable regardless of card width.
- Card headings stepped down from `text-2xl` to `text-xl` to match the now-narrower column width.
- Subheading descriptions now `text-sm` at `md+` instead of `text-base`.
- `transition-all` → `transition-colors` on the CTA buttons (smaller GPU work, no layout animation was actually happening).

**Why:** Two near-identical full-width CTA cards stacking below the personal info form wasted most of the desktop width and pushed the footer content too far down.

**Risk:** desktop-only layout change (below `md` the grid collapses to single column). CTAs, destinations, and copy unchanged.

---

### #P1.2 — `/profile` desktop: left-aligned hero, smaller title, no gradient clip
**Date:** 2026-04-23  ·  **File:** `components/profile/ProfileHeader.tsx`
**Change:** Reworked the desktop profile header card:
- Layout: `md:flex flex-col lg:flex-row items-center` → `md:flex md:flex-row md:items-center`. The avatar and info block are side-by-side from `md+` instead of stacking+centering until `lg+`.
- Info block: `text-center lg:text-left` → `text-left` at all desktop widths.
- Title: `text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent` → `text-2xl lg:text-3xl font-bold text-gray-900 truncate`. The gradient-clip trick was harming readability (lower contrast + fractional anti-aliasing) with no brand payoff. Plain `text-gray-900` renders sharper and passes WCAG AA cleanly.
- Email paragraph font dropped from `text-base lg:text-lg` → `text-sm lg:text-base` — matches the calmer hero density.
- Avatar: `w-28 h-28 lg:w-32 lg:h-32 shadow-2xl` → `w-24 h-24 lg:w-28 lg:h-28 shadow-xl`. Proportional with the smaller title; `next/image` width/height synced to 112.
- "Family Member #N" pill: red gradient + `shadow-lg` → solid `bg-primary-600 + shadow-sm`, matching the tab foundation from #P1.1.
- Edit-mode upload/remove buttons: red gradient pills → solid `bg-primary-600` for upload, bordered neutral pill (`bg-white + border-gray-200`) for remove. Smaller icons (`h-3.5 w-3.5`) to fit the new avatar scale.
- Badges (price access / discount / member since) trimmed from `text-sm` → `text-xs lg:text-sm` and icon size to `h-3.5`.

**Why:** The old hero rendered as a 4xl centered title with a gradient-clipped heading and a giant avatar — it was a mobile blow-up on desktop. Left-aligned with a right-sized title gives the same information in ≈40% of the vertical space and lines up with the left-edge of the tab bar below.

**Risk:** desktop-only (`hidden md:flex` block). Mobile hero untouched.

---

### #P1.1 — `/profile` desktop: calmer tab bar + wrap behaviour
**Date:** 2026-04-23  ·  **File:** `app/profile/page.tsx`
**Change:**
- Active tab chip: `bg-gradient-to-r from-red-600 to-red-700 + shadow-lg + px-6 py-3 rounded-xl` → `bg-primary-600 + shadow-sm + px-4 lg:px-5 py-2.5 rounded-lg + text-sm`
- Container: `flex gap-2 overflow-x-auto scrollbar-hide` → `flex md:flex-wrap md:items-center gap-2`. The Refresh/Edit action group now uses `md:ml-auto` so it still pins right at comfortable widths but drops to its own row when tabs wrap — no more horizontal scroll at narrow desktop widths (≈1024–1100px).
- Refresh / Edit buttons rewritten as bordered neutral pills (`bg-white border border-gray-200`) with a bordered red variant for the active "Cancel" state. Softer than the prior `bg-white/50` floating pills.
- Added `aria-pressed` to both the tab buttons and the Edit toggle.

**Why:** Backlog #13. The original bar was loud and forced horizontal scroll any time the viewport wasn't wide enough for all five tabs plus the right-aligned action group. Calmer styling also aligns the tab chip with the `--color-primary-600` foundation shipped in #7.

**Risk:** desktop-only (`hidden md:flex` block). Mobile icon tabs untouched.

---

### #2 — Site-wide search in desktop header (reverted)
**Date:** 2026-04-17  ·  **Commits:** `475a6520` (ship), `<revert>` (revert)
**Files:** `components/header/HeaderDesktopSearch.tsx` (deleted), `components/header/HeaderDesktopIcons.tsx`, `components/header/HeaderRussianDesktop.tsx`
**Original change:** New `HeaderDesktopSearch` component providing a pill search input in the desktop header, wired into both LTR (EN/AR) and Russian desktop header variants.

**Revert (2026-04-23):** Removed at user request. The component file was deleted and its import + render removed from both header variants. The shared `common.search` / `common.searchPlaceholder` translations were retained (they're consumed by `ProductFilters` on `/products`).

**Risk:** none — pure removal. Search on `/products` is unaffected.

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
- ~~#13 — Profile layout is a horizontal tab scroller~~ **done** — see #P1.1 (tab bar wrap) and the full #P1.1–P1.5 series which re-ground the desktop `/profile` layout
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
