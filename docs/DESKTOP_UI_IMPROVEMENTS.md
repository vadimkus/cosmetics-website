# Desktop UI Improvements — Living Log

Tracks the desktop UX polish initiative for genosys.ae. Each entry below corresponds to a single, focused commit that has shipped to `main`. Mobile / PWA paths are intentionally untouched in this stream of work.

The original audit (P0 → P2 backlog) is captured in chat history; this file logs only what has actually shipped.

---

## Shipped

### #D9 — Header icon hit areas: shared shell with hover surface + focus ring
**Date:** 2026-04-17  ·  **File:** `components/header/HeaderDesktopIcons.tsx`
**Change:** Every icon link/button in the desktop header now routes through a single shared `iconShell` className string instead of the five slightly-different copies that existed before.

- Shell: `h-10 w-10 rounded-full hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white min-h-[44px] min-w-[44px] touch-manipulation`.
- Adds a **visible hover surface** (circular gray background) — previously the icons only changed colour on hover which read as dead space on a busy header.
- Adds a proper **`focus-visible` ring** — previously keyboard focus was barely perceptible, which was WCAG 2.4.7 borderline.
- **Fixes inconsistency**: profile and logout icon-buttons were missing `min-h-[44px] min-w-[44px]` / `touch-manipulation` entirely. Now every header target has the same 44×44 hit box.
- `LanguageSwitcher` button is deliberately NOT wrapped in the shell — it's a text pill (EN / AR / RU) and should stay visually distinct from icon targets. Its existing `hover:bg-gray-100` is kept.
- No layout shift: the circular hover bg renders inside the existing padding box.

**Why:** Closes audit item #14 ("Icon hit areas have no hover surface"). On a wide header with five interactive icons and nothing between them, the lack of hover/focus feedback made the header feel unfinished. Consolidating five slightly-different className strings into one also removes a future maintenance trap.

**Risk:** desktop-only component. Mobile header (separate file) untouched. Badge positioning / cart + favorites counters unchanged — they still render as absolute children inside each icon shell.

---

### #D8 — `/products` desktop: trust-strip wrap + end-of-grid footer
**Date:** 2026-04-17  ·  **File:** `app/products/ProductsPageClient.tsx`
**Change:** Two separate desktop fixes shipped in one commit against the products listing page.

- **#15 — Trust strip wrap:** The brand-promise strip under the search bar (`Free shipping over AED 1,000` · `Authentic Korean dermacosmetics` · `All prices VAT inclusive`) used `overflow-x-auto` with `whitespace-nowrap` on each of three pills and `gap-5 md:gap-10`. On 1024–1280px laptops running the Russian locale, the three items exceeded container width and got clipped to an invisible horizontal scroll (no scrollbar visible because `scrollbar-hide`). Added `md:flex-wrap gap-y-2 md:overflow-visible`; below `md` the strip keeps its original horizontal scroll (3 pills on one row is the designed mobile look), at `md+` long translations now wrap to a second line cleanly.
- **#11 — End-of-grid footer:** The products grid renders all ~50 products in a single pass (correct for SEO — all product nodes live in the initial HTML). Long lists previously just ended abruptly with no summary or way to scroll back up. Added a desktop-only (`hidden md:flex`) footer below the grid: `Showing X of Y products` on the left, arrow-up `Back to top` button on the right. Localised for `ar` / `ru`. Proper `focus-visible` ring. Click does `window.scrollTo({ top: 0, behavior: 'smooth' })`. No new state, no new deps.
- Decorative SVGs inside the trust pills now get `aria-hidden="true"`.

**Why:** The audit flagged "no pagination or Load more" on `/products`. Artificial pagination would harm SEO (crawlers see fewer products) and would also require a new state-management layer. The lighter fix is better: keep all products in the initial HTML, but give long lists a clear terminus and a one-click return-to-top. The trust-strip overflow fix is more urgent — it was actively hiding content from Russian users on common 1280px laptop widths.

**Risk:** desktop-only. Mobile and PWA grids unchanged. Wrapped the existing `isPWA ? (...) : (...)` grid ternary in a `<>` fragment so the new footer renders for both paths when there are results.

---

### #D7 — PDP desktop: premium trust card + left-aligned h1
**Date:** 2026-04-17  ·  **Files:** `components/product/TrustBadges.tsx`, `app/products/[id]/ProductPageClientRefactored.tsx`
**Change:** Two desktop PDP items shipped together because they rebalance the same left column.

- **#10 — Trust badges: stacked strip → premium trust card:** The `layout="stacked"` variant of `TrustBadges` (used under the desktop Add to Cart button) was a plain gray-50 strip with three gray rows. It read as filler. Rewritten as a bordered white card with `shadow-sm`, `rounded-2xl` corners, and one icon-well per row:
  - shipping → `bg-primary-50` well + `text-primary-600` truck icon
  - authentic → `bg-emerald-50` well + `text-emerald-600` check-shield icon
  - VAT → `bg-blue-50` well + `text-blue-600` receipt icon
  - Copy unchanged (same `TRUST_COPY` en/ar/ru map). Horizontal layout untouched. Decorative SVGs all get `aria-hidden="true"`. Verified via grep that the stacked variant is only used once in the codebase (PDP).
- **#12 — Product title: centered `text-2xl` → left-aligned `text-3xl xl:text-4xl`:** Desktop header was center-aligned with a 24px h1 — it read small on laptop widths and the centered midline made the whole column zig-zag between image thumbnails, title, price, and cart button. Category pill + h1 + rating row now all left-align on `lg+` (with proper RTL mirroring to `text-right` / `justify-end` in Arabic). H1 bumped to `text-3xl xl:text-4xl` with `tracking-tight` — the product name becomes the clear hierarchy anchor.

**Why:** The PDP left column on desktop was visually unsettled: a centered-midline title, a small 24px h1, and a drab gray trust strip that did nothing for conversion. Anchoring the title to the left edge (matching every other block in the column) and upgrading the trust block to a proper card gives the column a single reading axis and a conversion-anchor reassurance block next to the CTA.

**Risk:** desktop-only for both items. Mobile PDP, mobile sticky footer, PWA PDP header all unchanged. No other `TrustBadges` call-sites exist in the codebase (grep-verified).

---

### #D6 — Homepage hero: eyebrow, tighter h1, proof strip, muted app badges
**Date:** 2026-04-17  ·  **File:** `components/Hero.tsx`
**Change:** Two desktop hero audit items shipped together — both edit the `hidden md:block` desktop branch, mobile hero branch is byte-identical.

- **#8 — Build credibility + pace before the h1:**
  - Added eyebrow `TRUSTED KOREAN DERMACOSMETICS · SINCE 2019` (localised for `ar` / `ru`) in primary-red, small-caps, `tracking-[0.18em]`.
  - H1 at `lg+` bumps from `text-display-md` to `lg:text-[56px] lg:leading-[1.05]` with `tracking-tight` for better line economy on 1280–1536px screens.
  - Below the CTA + social-proof line, a 3-up proof strip renders in a rounded panel with `divide-x` separators: `30+ UAE clinics` · `Pro dermacosmetics · Korea` · `Official distributor · Since 2019`. Gives the hero a scannable credibility beat before it hands off to the featured products section.
- **#9 — App-store badges: demote from third CTA to soft cross-promo:**
  - Badges were `text-xl App Store / Google Play` with 28px icons — visually as heavy as the primary CTA and competed for attention.
  - Now framed with a muted eyebrow `PREFER THE APP?` above the row; badges downsized to `text-base` + `w-6 h-6` icons (matching mobile) so they read as a secondary channel, not a conversion target.
  - Added proper `aria-label` per badge and `aria-hidden="true"` on decorative SVGs.

**Why:** Desktop hero previously had three competing CTAs (Start Analysis, Shop Products, App Store, Google Play) and no credential signal before the h1 — a brand-new visitor saw the product name, a video, and four buttons with no reason to trust the brand. The eyebrow + proof strip front-load legitimacy; demoting the app badges restores the hero's CTA hierarchy (Analysis = primary, Shop = secondary, app download = tertiary).

**Risk:** desktop-only. Mobile hero unchanged. No translation-file changes — all new strings inline so no i18n plumbing required.

---

### #D5 — `/contact`: TDRA document added to Official Documents
**Date:** 2026-04-17  ·  **File:** `app/contact/ContactClient.tsx`
**Change:** Added a fourth credential pill to the Official Documents row on `/contact`. The row now reads `License · TRN · TDRA · D-U-N-S®`.

- Uses the existing `public/documents/TDRA_NOC.pdf` (562 KB) — the same file `/about` already links to — via the shared `PDFLinkButton` so the PDF opens inline on desktop and downloads as `GENOSYS-TDRA-NOC.pdf` elsewhere.
- Pill inherits the identical bordered gray-50 chip styling as TRN — no new CSS, no layout shift on any breakpoint.

**Why:** `/about` already surfaced the TDRA NOC, but `/contact` (the page most likely to be checked by partners vetting us against UAE regulators) did not. Adding TDRA completes the credential row and gives prospective clinic/partner visitors all four key documents in one place.

**Risk:** zero — purely additive. No other breakpoints or components touched.

---

### #D4 — `/training` desktop: premium refresh
**Date:** 2026-04-17  ·  **File:** `app/training/TrainingClient.tsx`
**Change:** Fourth and final of the four-page marketing polish sweep. Desktop-only — every change is behind `md:` / `lg:` utilities; the PWA / mobile-web header + list layout are byte-identical.

- Container widened: `max-w-4xl` → `max-w-4xl lg:max-w-6xl`. Gains back ~280px of width at `lg+` for the document lists.
- Desktop hero rebuilt (hidden on `isAppLikeMode`): logo (52–60px wide) + `TRAINING LIBRARY` eyebrow + `text-4xl lg:text-5xl` h1 + descriptive subhead. Below the hero, a desktop-only 3-up stats strip renders live counts of Guides / Product sheets / Videos (`{trainingDocuments.length}`, `{productDocuments.length}`, `{trainingVideos.length}`). Same rounded-container + 1px dividers treatment used in `/delivery` `#D1`.
- Section headers (Training Documents / Product Documentation / Training Videos): centered small icon row replaced with left-aligned at `md+` — larger icon badge (`h-10 w-10 rounded-xl bg-{tint}-50`), heading, and a neutral count pill (`{n}` in a gray rounded-full chip). Icons upgraded from `h-4` to `h-5` and badge tints normalised to `emerald-50` for training + `red-50` for product/video.
- Training Documents list: collapses from a 1-column stack to a `md:grid-cols-2` grid at `md+`. Items gain bordered white cards with an emerald-tinted `FileText` badge on the left.
- Product Documentation list (24 items): same `md:grid-cols-2` treatment. Product thumbnail bumped from `md:w-10` → `md:w-12`. Items use the page's primary-red accent (`hover:border-red-300`).
- Download buttons: dropped both red→red and green→green gradients in favour of solid `bg-emerald-600` / `bg-primary-600` (consistent with `#P1.1` / `#7` brand foundation). Icon size bumped to `h-3.5 w-3.5`, padding up to `py-2`, weight raised from `font-medium` → `font-semibold`, rounded to `rounded-lg`.
- Training Videos: card grid changed from 1-col to `md:grid-cols-2`. Each card gets a white background, border, and rounded-2xl at `md+`. Video title is now left-aligned `text-lg` inside the card instead of centered `text-2xl`. The "Duration" / "Level" text rows became proper pills (gray chip + red chip). Coming-soon placeholder restyled as a dashed-border card that fills the grid gap cleanly.

**Why:** Previous desktop version was a single narrow column with 32+ documents stacked vertically — scroll length was the primary UX issue. A 2-col grid for both document lists cuts that scroll in half; the stats hero gives new visitors an immediate read on what's available without reading down the page; gradient buttons are replaced with the single brand-red / emerald-green solids that now run across the rest of the site.

**Risk:** desktop-only. All grid and hero additions are behind `md:` utilities; `isAppLikeMode` still renders its own compact sticky-header layout unchanged. Mobile document lists keep their original `space-y-1.5` single-column layout.

---

### #D3 — `/about` desktop: premium refresh
**Date:** 2026-04-17  ·  **File:** `app/about/AboutPageClient.tsx`
**Change:** Third of the four-page marketing polish sweep. Edits are scoped strictly to the desktop branch of the `isAppLikeMode ? (app-like) : (desktop)` ternary; the app-like mobile/PWA branch is byte-identical.

- Container widened inside the desktop branch: `max-w-4xl` → `max-w-4xl lg:max-w-6xl`.
- Hero re-ordered and re-weighted: logo now sits at the top, under it an `ABOUT US` eyebrow in primary-red small-caps, then the company name as h1, then a descriptive desktop-only subhead ("Official UAE distributor of GENOSYS Korean dermacosmetics — since 2019."). Replaces the previous bare h1+logo block that read as a disconnected heading stack.
- About Us + Mission cards: added tinted icon badges at `md+` (`Sparkles` for About Us, `Target` for Mission, both in `h-11 w-11 rounded-xl bg-primary-50`). Headings shifted from centered `text-2xl` to left-aligned `text-xl` paired with the badge — tighter and more confident.
- Legal Info 3-col: each card now leads with an icon badge (`Building2` / `PhoneIcon` / `ShieldCheck`). At `md+` the inner content renders as a proper `<dl>` with `divide-y + divide-gray-100`, muted labels on the left, bold values/links on the right. Below `md` the original inline "Label: value" format is preserved.
- "Get in Touch" CTA panel: bumped to `bg-gray-50 rounded-2xl p-10` at `md+`, heading tightened to `tracking-tight`, CTAs rounded to `rounded-xl` with `shadow-sm` on the primary button. No colour changes — both CTAs stay on `bg-primary-600` / outlined primary.
- Section divider: added `COMPANY` eyebrow above the "Legal Information & Contact" heading to link the section to the rest of the narrative, matching the eyebrow style from `#D1` and `#D2`.

**Why:** The desktop branch was an ~880px column with bare cards, centered everything, and no iconography or visual anchor for the three legal cards. It read as a compliance dump rather than the "official distributor since 2019" narrative the page actually tells. The new layout is wider (6xl at `lg+`), uses icon badges to separate concerns, and has a consistent eyebrow pattern tying it to `/delivery` and `/contact`.

**Risk:** changes land only inside the `isAppLikeMode ? (A) : (B)` desktop branch. Below `md` the definition-list styles (`md:flex`, `md:divide-y`) inactive — the inline "Label: value" spans render as before. The app-like mobile branch is unchanged.

---

### #D2 — `/contact` desktop: premium refresh
**Date:** 2026-04-17  ·  **File:** `app/contact/ContactClient.tsx`
**Change:** Second of the four-page marketing polish sweep. Desktop-only — all edits sit behind `md:` / `lg:` utilities; the PWA / mobile-web paths are untouched.

- Container widened: `max-w-4xl` → `max-w-4xl lg:max-w-6xl`.
- Hero: added `GET IN TOUCH` eyebrow (localised, tracked small-caps primary-red) + a desktop-only descriptive subhead ("We're here for questions about products, orders, and personalised skin advice.").
- Contact tiles (6): upgraded from flat grey squares to bordered white cards on `md+`. Each tile now has a circular colour-tinted icon well (`h-14 w-14 rounded-full bg-{channel}-50`) sitting above the title, a channel-specific hover border + shadow, and an explicit CTA line (e.g. "Message us →", "Send email →", "Follow →", "Open in Maps →"). Entire tile is a single `<a>` so the whole card is clickable on desktop — previously only the icon was.
- Official Distributor section: restructured as a two-column panel on `md+`. Left column is a tinted `ShieldCheck` badge + the "Official distributor" heading + legitimacy copy; right column is a divider-separated "OFFICIAL DOCUMENTS" eyebrow + the three credential pills (License / TRN / D-U-N-S®). Background flipped from `primary-50` to white with border + `shadow-sm` to feel less promotional and more institutional. On mobile the section keeps the original single-column primary-50 treatment.
- Pills themselves got a size bump on `md+` (`px-3 py-2 rounded-lg` with a neutral `bg-gray-50 + border`) so they read as chip links, not shouty buttons.

**Why:** The previous desktop version was a mobile layout scaled up — narrow column, tiny icons, inert text under them. Clicking anywhere except the icon did nothing. The new tiles behave like proper premium contact cards: scannable, each channel gets a clear "what happens if I click this" affordance, and the credentials row no longer competes visually with the primary contact channels.

**Risk:** desktop-only; every `md:` utility is additive. Below 768px the page is byte-identical (flat tiles, primary-50 distributor block).

---

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
