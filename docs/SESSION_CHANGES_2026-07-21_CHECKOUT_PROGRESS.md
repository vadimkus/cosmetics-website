# Checkout progress indicator

**Date:** 2026-07-21  
**Scope:** GENOSYS website cart, checkout, and unified order-success flow.

## UX basis

- Baymard checkout guidance: keep checkout effort understandable, use a short flow, preserve the order summary, and avoid introducing unexpected stages.
- Nielsen Norman Group guidance: named and numbered checkout steps provide strong “you are here” orientation.
- Accessibility guidance: represent progress as an ordered navigation list, mark the active item with `aria-current="step"`, and communicate completed/current/upcoming state with text rather than color alone.

## Implementation

- Added a compact three-step flow: **Cart → Details & payment → Confirmation**.
- Each completed/current stage receives a green segment; upcoming stages remain neutral gray.
- Displays **Step N of 3** and a secure-checkout cue.
- Completed stages use a checkmark; current and upcoming stages retain numbered markers.
- From checkout, the completed Cart stage links back for editing. Confirmation does not link back to the now-completed purchase flow.
- Added English, Russian, Arabic, and RTL labels.
- Reduced excess top spacing on cart and checkout so the indicator occupies the previously empty area beneath the website header.

## Verification

- TypeScript and ESLint passed.
- Checkout progress tests: 3/3 passed.
- Desktop cart visual pass completed.
- Responsive check at 390 px: 358 px indicator width, three 114 px segments, and no horizontal overflow.
