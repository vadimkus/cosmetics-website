# Recommended Routine Step Badges

**Date:** 2026-07-19
**Scope:** Shared PDP `ProductRoutineCard` on desktop web, mobile web, and PWA

## Context

The numbered circles in Recommended Routine cards occupied a separate column from
the product thumbnails. This made the numbers look detached from the products and
used unnecessary horizontal space, especially on narrow screens.

## Design decision

- Treat the routine as an ordered sequence, not an interactive checkout stepper.
- Overlay each number on its product thumbnail to create one clear visual anchor.
- Use the GENOSYS primary red, a white contrast ring, tabular digits, and a subtle
  shadow so steps 1–5 remain legible over varied product photography.
- Increase thumbnails to 56px on mobile and 64px from the small breakpoint.
- Preserve a comfortable linked-image target, visible keyboard focus, and RTL
  badge placement.
- Use semantic `<ol>` / `<li>` markup so assistive technology communicates the
  order independently of the decorative badge.

## Research basis

- W3C WAI recommends ordered-list semantics for known step-by-step sequences:
  https://www.w3.org/WAI/tutorials/forms/multi-page/
- U.S. Web Design System notes that counters strongly communicate progression and
  should not rely on color alone:
  https://designsystem.digital.gov/components/step-indicator/
- Baymard's PDP guidance emphasizes clear information hierarchy and meaningful
  product imagery:
  https://baymard.com/blog/current-state-ecommerce-product-page-ux

## Verification

- Targeted ESLint passed for `components/product/ProductRoutineCard.tsx`.
- Targeted `git diff --check` passed.
- Browser-verified locally on product 40 at desktop and 390px mobile widths.
- Accessibility snapshot exposes each routine as ordered list items.
- Arabic page was checked to confirm RTL-aware badge positioning.
