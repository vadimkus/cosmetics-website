# Cart Size Selection for Bundle Items

Date: 2026-05-03

## Context

Desktop cart size selection already existed, but mobile web/PWA and native cart behavior needed to be safer for Build Your Set items. The same product can appear in the cart as a normal line and as a bundle line; variant changes must not merge or mutate the wrong row, and the bundle discount must remain active after a size switch.

## Website / PWA Changes

- `lib/cartStore.ts` now matches cart operations by product, color, size, and bundle identity.
- `removeItem()`, `updateQuantity()`, `updateColor()`, and `updateSize()` accept optional bundle line identity so bundle rows do not collide with normal rows.
- `components/cart/CartItem.tsx` passes the row's bundle identity through all quantity, remove, color, and size actions.
- Mobile cart size chips now wrap on narrow screens for better touch usability.
- `types/index.ts` adds `CartLineIdentity` and updates cart operation signatures.

## Native App Pairing

The paired native app update preserves variants on Build Your Set lines, defaults bundle rows to a selected size when available, and reruns bundle reconciliation after size/color changes so the discount tier stays applied.

## Verification

- Website: `npx eslint "lib/cartStore.ts" "components/cart/CartItem.tsx" "types/index.ts"` passed.
- Website: `npx tsc --noEmit` passed.
- Website: `npm run smoke:pricing-contract` passed.
- Native: `npm run smoke:cart-pricing-contract` passed.
- Native: `npm run smoke:order-payload-pricing-contract` passed.
- Native: `npm run smoke:pricing-display` passed.
