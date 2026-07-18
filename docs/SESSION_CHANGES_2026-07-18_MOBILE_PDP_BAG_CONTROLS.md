# Mobile PDP Bag Controls

**Date:** 2026-07-18

## Changes

- Mobile web product pages no longer render the floating Genie chat button, preventing overlap with the sticky purchase controls.
- Once a product is in the bag, the center of the green PDP quantity control is now an explicit localized **View Bag** action.
- Added EN, AR, and RU labels for the new action.

## Verification

- TypeScript: passed (`npx tsc --noEmit`)
- Targeted ESLint: passed
- Mobile viewport smoke: product PDP renders with no Genie chat button
- Production build: `npx next build`
