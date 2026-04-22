# Desktop UI Improvements — Living Log

Tracks the desktop UX polish initiative for genosys.ae. Each entry below corresponds to a single, focused change that has shipped to `main`. Mobile / PWA paths are intentionally untouched in this stream of work.

The original audit (P0 → P2 backlog) is captured in chat history; this file logs only what has actually shipped.

---

## Shipped

### #1 — Products grid: 4 columns at 2xl (≥1536px)
**Date:** 2026-04-22
**File:** `app/products/ProductsPageClient.tsx`
**Change:** Added `2xl:grid-cols-4` to the desktop product grid (the `motion.div` branch — the PWA branch is unchanged at 3 columns).

**Why:** On 27" / ultra-wide monitors the catalog rendered with only 3 columns, leaving large empty gutters and making the catalog look sparse. With `container mx-auto` capping at the 2xl breakpoint (1536px), four columns give ~366px per card after gaps — comfortable for the existing card layout and matches the density expected from premium e-commerce sites.

**Breakpoint behaviour after change:**

| Breakpoint | Width | Columns |
|---|---|---|
| base | < 640px | 2 |
| sm | ≥ 640px | 2 |
| md | ≥ 768px | 2 |
| lg | ≥ 1024px | 3 |
| xl | ≥ 1280px | 3 |
| **2xl** | **≥ 1536px** | **4 (new)** |

**Risk / regression surface:** none — purely additive Tailwind utility on a single grid. No layout shift below 1536px.

---

## Backlog (in priority order)

The remaining P0 items are queued and will be shipped one by one with the same pattern (single focused change → build → push → log here).

- #2 — Add site-wide search to header (`HeaderDesktopNav` / new `HeaderSearch`)
- #3 — PDP: enlarge main image at xl/2xl + vertical thumbnail rail at lg+
- #4 — PDP: introduce `md:grid-cols-2` to fix the 768–1023px awkward stack
- #5 — Checkout: floor secondary text at `text-xs` (12px) on `md+`
- #6 — Footer: payment icons row, social row, optional newsletter
- #7 — Brand red unification: single `--brand-red` token + shared `<Button>`

P1 / P2 items live in chat history and will be promoted into this file as we work through them.
