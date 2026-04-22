# Favorites Empty-State UI Sweep — 2026-04-22

Audit of the mobile browser Favorites page (empty state) found 10+ issues
ranging from bugs (wrong arrow direction) to dead space (no secondary
engagement when the user has no favorites). This session shipped the
entire P0–P3 backlog in one sweep.

## What shipped

### P0 — Correctness (must-fix)

**1. Arrow on "Browse Products" now points forward.**
Previously `<ArrowLeft />` (←) was used, which semantically reads as
"go back." The user is moving **into** the shop, not back from it.
Replaced with `<ArrowRight />` (→) and placed **after** the label for
LTR — the icon flips via `rotate-180` in RTL so Arabic users see it
naturally on the left side pointing left.

Fixed in two places: the main empty-state CTA and the secondary
"products may no longer be available" CTA in the filtered-empty branch.

**2. Added "Tap ♡ on any product" guidance.**
The page now explains *how* favorites work, not just that there aren't
any. New `favorites.heroSubtitle` i18n key: *"Tap the heart on any
product to keep it close."* (EN/RU/AR).

### P1 — Conversion + dead space

**3. "Popular right now" shelf.**
Server pages now fetch the 6 highest-rated, in-stock, visible products
and inject them into the empty state as a `<ProductCard />` grid under
the CTA. This:

- Fills the ~400px of dead white space below the CTA that made the
  page feel abandoned.
- Gives the user a one-tap path to add their *first* favorite (tap ♡
  on any card).
- Turns a bounce page into a discovery surface.

Implementation:
- New `app/favorites/recommended.ts` with `getRecommendedForEmptyFavorites()`
  wrapped in `unstable_cache` tagged `products` — invalidated automatically
  when stock/prices change.
- All three entry pages (`/favorites`, `/ar/favorites`, `/ru/favorites`)
  converted to `async` server components and pass the recommended list
  as a prop to `FavoritesClient`.
- `FavoritesClient` now accepts `recommendedProducts?: Product[]` (optional
  for resilience — empty array is the safe fallback).

**4. Login nudge for logged-out guests.**
When `!user`, a secondary line now reads *"Sign in to sync your
favorites across devices"* followed by a red **Sign in** action with
a `LogIn` icon. Link targets `/login?redirect=/favorites` (localized)
so users return straight back after auth.

Favorites are currently stored locally via `FavoritesProvider`, which
means signed-out users lose them when they switch devices. This nudge
exposes that benefit of signing in at the exact moment it matters.

### P2 — Visual hierarchy + voice

**5. Warmer copy.**
- `favorites.heroTitle` → *"Save What You Love"* (EN), *"Сохраняйте то,
  что вам нравится"* (RU), *"احفظ ما تحبّه"* (AR).
- The original `favorites.empty` ("No Favorites Yet") is preserved as
  a fallback key in case anything else consumes it.

**6. Typography + CTA sizing.**
- Heading: `text-base md:text-2xl` → **`text-xl md:text-3xl`**.
- Uni image: `210x210` → **`180x180`** (rebalances weight so the
  headline leads, not the mascot).
- CTA: `px-3 py-1.5 rounded-lg text-xs` → **`px-6 py-3 rounded-xl
  text-sm md:text-base font-semibold shadow-sm active:scale-[0.98]`**.
  Matches the weight of iOS/Android primary buttons.

### P3 — Accessibility + polish

**7. Respect `prefers-reduced-motion`.**
Wired `useReducedMotion()` — the Uni float, the 3 particle bursts,
and the heart-pulse interval all now honour the OS-level motion
preference in addition to the existing `animationStore` + PWA gates.

**8. Uni image is now decorative.**
Changed `alt="No favorites"` → `alt="" aria-hidden="true"`. Uni is
pure decoration; the heading already carries the meaning. Screen
readers no longer announce redundant text.

**9. ChatWidget over empty space — auto-resolved.**
The live-chat bubble used to float over a blank page because there
was nothing beneath the CTA. With "Popular right now" now filling
that space with real products, the chat bubble sits naturally over
content — no component change required.

## Files touched

| Area | File |
|------|------|
| Client component | `app/favorites/FavoritesClient.tsx` |
| Server pages | `app/favorites/page.tsx`, `app/ar/favorites/page.tsx`, `app/ru/favorites/page.tsx` |
| New helper | `app/favorites/recommended.ts` |
| i18n | `messages/en.json`, `messages/ru.json`, `messages/ar.json` |

## Verification

- `npx tsc --noEmit` — zero new errors in touched files (pre-existing
  User/Order type errors in unrelated files remain; not our scope).
- `npx eslint <touched>` — clean.
- Breadcrumb schema, metadata, RTL handling all preserved.
- Favorites-present (non-empty) view is untouched except for the
  secondary "products unavailable" CTA arrow fix.

## Key design decisions

- **Server-side fetch beats client-side fetch.** Using `unstable_cache`
  with the `products` tag means the recommendation list invalidates
  the instant admin changes stock/price — we piggyback on the same
  cache layer the product pages already use. No new cache hierarchy.
- **Graceful degradation.** If `getAllProducts()` throws, the helper
  returns `[]` and the empty state simply skips the "Popular" section.
  The empty state must never break.
- **Icon, not Sparkles.** Tempted to use `<Sparkles />` like the AI CTA,
  but that would visually overlap with the AI Skin Analysis promotion
  elsewhere in the app. `<ArrowRight />` is the universal "go forward"
  and pairs well with the primary CTA pattern used in checkout,
  product cards, and the cart.
- **"Popular right now" vs "Bestsellers".** We don't have a real
  bestsellers ranking (no order-count sort), so we surface top-rated
  + in-stock as a proxy. Copy says "Popular right now" rather than
  "Bestsellers" to stay honest.
