# Product quick-facts disclosure redesign

**Date:** 2026-07-21  
**Scope:** GENOSYS website product pages only.

## UX basis

- W3C and WebAIM disclosure guidance: use a real button, expose expanded state, associate the trigger and panel, and remove collapsed content from the accessibility tree.
- Nielsen Norman Group and ecommerce PDP guidance: make the full header row tappable, keep labels descriptive, use a clear state indicator, and keep revealed content concise and scannable.
- Core purchasing information such as price, stock, and options remains outside the disclosure.

## What changed

- Replaced the small pill and floating dialog-style panel with an inline, full-width product disclosure.
- Added a 64 px minimum trigger, product snapshot label, useful-detail count, product name, gradient icon, and rotating chevron.
- Formatted facts as responsive visual cards: one column on mobile and two columns from the small breakpoint.
- Added distinct icons, stronger title/body hierarchy, subtle hover states, and an official-information footer.
- Removed the redundant close button and dialog role. The same header opens and closes the region using `aria-expanded`, `aria-controls`, and `aria-labelledby`.
- Preserved English, Russian, Arabic, and RTL behavior.

## Verification

- Component tests: 6/6 passed.
- ESLint: passed.
- TypeScript: passed.
- Desktop visual check on product 65.
- Responsive DOM check at 390 × 844: 366 px component width, one-column facts, 81 px trigger, and no horizontal overflow.

## Duplicate-fact follow-up

- Audited all 66 database products in English, Russian, and Arabic: 198
  product/locale combinations.
- Found repeated source claims in 121 combinations, mainly where `keyFeatures`,
  `benefits`, `productDetails`, and size metadata describe the same fact.
- Benefit strings such as `Rapid Recovery - ...` are now parsed into a heading
  and body, allowing them to match structured feature headings.
- The display removes repeated normalized headings or bodies while retaining
  source priority: richer key features win over duplicate benefits/details.
- Candidate benefits/details are deduplicated before the six-card limit, so a
  later distinct claim replaces an early duplicate.
- Post-fix audit result: **0 duplicate headings or bodies across all 198
  product/locale combinations**.
