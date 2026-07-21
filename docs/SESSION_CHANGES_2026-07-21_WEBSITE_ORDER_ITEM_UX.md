# Website order-item UX refinement

**Date:** 2026-07-21  
**Scope:** Website, mobile web, and website PWA only. Native apps are intentionally deferred until Vadim approves the website behavior.

## What changed

- Product cards now use a green, 48 px quantity stepper after an item is added.
- The first add gives immediate visible “Added to Bag” confirmation.
- A card edits quantity only when it maps to one exact, non-bundle cart line.
- Products with multiple cart variants show **Choose options** and open the product page instead of silently adding a default variant.
- Products represented by multiple cart lines show **View Bag (N)** instead of changing an arbitrary size or colour.
- Legacy variant configuration resolves through `productNumber` when database product IDs differ.
- The product list includes mobile bottom safe space so final-row actions are not covered by the fixed navigation.
- Pressing minus at quantity one removes that exact product line and restores the **Add to Bag/Cart** action.
- Mobile bag controls now sit below item information, with 48 px minus/plus targets and a separate labelled **Remove** action.
- Removing an item shows a five-second **Undo** snackbar, including when removal empties the bag.
- Cart headings and subtotal item counts use the same reactive quantity total, so both update immediately after removal.
- Desktop cart rows place line price, VAT/discount detail, and reward estimate beneath the quantity controls, using the previously empty right column and reducing row height. Mobile web keeps pricing in the product-information flow.
- Cart and checkout totals now derive directly from the subscribed `items` array. This prevents React Compiler from caching stable Zustand getter calls and leaving subtotal, VAT, total, rewards, promotions, or checkout item counts stale after quantity changes.
- Cart variant controls now resolve legacy configuration through `productNumber` instead of a database CUID. Revita Glow therefore exposes both `#01 Bright` and `#02 Natural` in the cart and persists shade changes correctly.
- Cart, checkout, profile routes, Partner Portal, skin recommendation, training, and every admin route now share one enclosed minimal footer: compact trust cues, payment marks, legal links, and copyright.
- Genie is completely removed from cart and checkout on desktop, mobile web, and PWA so it cannot compete with purchase actions.
- Cart headers now include a localized trash action that clears every cart line in one operation after a confirmation prompt. The desktop control uses icon plus label; compact mobile/PWA layouts retain a 44 px icon target.
- Existing promotion rewards remain visually separate from paid cart lines and do not receive paid-item quantity controls.
- Added EN/RU/AR labels for Choose options, item removed, and Undo.

## Verification

- `npx tsc --noEmit`
- ESLint on all changed TypeScript/TSX files
- IDE diagnostics: no errors
- Mobile browser pass at 390 × 844:
  - final-row product actions remain reachable above the fixed footer;
  - single-SKU add transitions through “Added to Bag” to a 48 × 48 px stepper;
  - multi-variant cart state displays “View Bag (2)” instead of an ambiguous stepper;
  - quantity controls and remove action render without squeezing item content;
  - remove transitions to the empty bag;
  - Undo restores the same product, quantity, and line identity.
- Desktop visual pass confirmed the compact price/control stack and reduced cart-row height.
- Responsive check at 390 × 844 confirmed one visible price block, a 332 px cart row, and no horizontal overflow.
- Live quantity regression check: quantity `1 → 2` updated the line from AED 150 → AED 300, subtotal from AED 150 → AED 300, VAT from AED 9.29 → AED 16.43, and order total from AED 195 → AED 345 without a reload.
- Live Revita Glow check: changed `#02 Natural → #01 Bright → #02 Natural` directly in the cart; each selection persisted as one cart line.
- Desktop cart check confirmed only the compact checkout-style footer remains: payment/security cues, privacy, terms, and copyright; sitemap sections are removed.
- Training check confirmed the exact same compact footer structure and content as cart/checkout.
- Cart accessibility snapshot confirmed no Genie/chat trigger is rendered.
- Clear-cart accessibility snapshot confirmed the control is labelled and positioned in the cart-card header without shifting item content.

## Next step

After website approval, port the accepted interaction model to the native mobile app rather than maintaining two competing patterns.
