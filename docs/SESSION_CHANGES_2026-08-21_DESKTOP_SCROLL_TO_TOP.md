# Desktop scroll-to-top navigation

**Date:** 21 August 2026

## Change

- Extended the existing mobile-web return-to-top control to desktop web.
- Preserved the same circular `ArrowUp` icon, 1.5-viewport reveal threshold, localized accessible label, reduced-motion handling, and smooth-scroll behavior.
- On desktop the button sits 24px from the bottom and on the side opposite the Genie chat button. Arabic placement remains mirrored.
- The installed PWA remains unchanged.

## Verification

- Focused component tests: 2 passed.
- ESLint passed for the changed component and test.
- Production Next.js build completed successfully (449 static pages).
- Browser-verified on the desktop product 66 page: 44px control, 24px left offset, visible after scrolling, and returns to `scrollY = 0`.
