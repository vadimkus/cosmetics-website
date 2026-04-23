# Cart UX Fixes — 2026-04-23 (Mobile Web + App Parity)

Three small but visible UX issues were reported on iOS app, Android app, and
mobile web. They all relate to how the catalog and bag present state to the
user. This note documents what was changed, where, and why.

## Issues reported

1. **Free (promo) items order in the bag** — when a bundle was added, two free
   masks appeared; adding another bundle caused the new bundle line to render
   *below* the promo items. Expected behaviour: free items should always sit at
   the bottom of the bag.
2. **"Add to bag" button state on the products page** — once a product was in
   the bag, the button reverted to its neutral red "Add to Bag" state, giving
   no feedback about what is already in the bag. Expected: the button should
   turn green and say "In Bag (N)" (or "In Cart (N)" on PWA / desktop), and
   tapping it again should add one more unit.
3. **Russian "Новинка" badge overlap** — on category pills, the longer Russian
   translation of the "NEW" badge was wrapping and overlapping with adjacent
   pills (see screenshot). Expected: the badge should center cleanly above its
   pill, never wrap, and never touch the next pill.

## Scope

Mobile web (`cosmetics-website/`) and mobile app (`genosys-mobile-app/`).
Desktop web was not in scope, but the "In Bag (N)" feedback is rendered by
the same `ProductCard` component, so it also benefits on desktop.

---

## Fix 1 — Free items always render last

### Mobile app (`genosys-mobile-app/contexts/CartContext.js`)

The `CartContext` already auto-applies "buy a bundle, get masks free" promotions.
The effect that reconciles promo items had an early-return that only triggered
a re-render when the set of promo items changed:

```js
if (toAdd.length === 0 && keptPromo.length === prevPromo.length) return prev
```

This meant that when the user added another bundle, promo items were kept in
their original array position (earlier than the new bundle), so the new bundle
line appeared *after* the promos.

The fix rebuilds the cart as `[...nonPromo, ...keptPromo, ...toAdd]` on every
reconciliation, and only bails out if the resulting array is structurally
identical to the previous one (same refs, same order). This guarantees the
invariant "promo items are at the tail" regardless of the order the user
added regular items.

### Mobile web (`cosmetics-website/app/cart/CartClient.tsx`)

The web cart store does not currently auto-apply free promo items the way the
app does, but to keep behaviour consistent *and* to cover any future
promo/bundle wiring, the cart page now sorts items at display time:

```ts
const isFreeCartItem = (item) => {
  const price = Number(item?.product?.price)
  if (Number.isFinite(price) && price <= 0) return true
  const bundlePct = Number(item?.bundleDiscountPercent)
  if (item?.fromBundle && Number.isFinite(bundlePct) && bundlePct >= 100) return true
  return Boolean(item?.isPromotionItem)
}
const displayItems = [...items].sort(
  (a, b) => (isFreeCartItem(a) ? 1 : 0) - (isFreeCartItem(b) ? 1 : 0),
)
```

Rendering uses `displayItems` instead of the raw `items` array. The underlying
store is untouched, so checkout logic, quantity updates, and deletes continue
to operate on the original item identity.

---

## Fix 2 — "In Bag (N)" green state on the products page

### Mobile web (`ProductCard` family)

Three surgical edits in the shared product card component:

- `components/ProductCard/hooks/useProductCard.ts` now pulls `items` out of
  `useCart()` and derives `inCartQty` (sum of `quantity` for lines whose
  `product.id` matches the current product). The hook returns `inCartQty`.
- `components/ProductCard/types.ts` adds `inCartQty: number` to
  `UseProductCardReturn` and `ProductActionsProps`.
- `components/ProductCard/ProductActions.tsx` uses `inCartQty > 0` to switch
  the button into a persistent "in bag" state: green background
  (`bg-green-600 hover:bg-green-700`), a `Check` icon instead of the cart
  icon, and label `"In Bag (N)"` / `"In Cart (N)"` (PWA uses the bag label,
  desktop/classic mobile uses the cart label). Clicking it still calls
  `onAddToCart`, which adds one more unit — matching the requested behaviour.

New translation keys `product.inBag` and `product.inCart` were added to
`messages/en.json`, `messages/ar.json`, `messages/ru.json`.

### Mobile app (`genosys-mobile-app/app/(tabs)/shop.js`)

The shop screen renders its own button (not `ProductGridItem`). It now:

- Destructures `getItemQuantity` from `useCart()` in addition to `addItem`.
- Computes `qtyInBag = getItemQuantity?.(product.id, '', '') || 0` for the
  logged-in user.
- Switches the button to a green "pill" style (`#F0FDF4` bg, `#BBF7D0` border,
  `#15803D` text + checkmark icon) when `qtyInBag > 0` and not out of stock.
- Renders `"В корзине (N)"` / `"في الحقيبة (N)"` / `"In Bag (N)"` via the new
  `shop.inBag` translation in `i18n/messages/{en,ar,ru}.json`.
- Tapping again still calls `handleAddToCart`, which adds one more unit.

`components/ProductGridItem.js` (used on favourites / detail screens) now
accepts an optional `inCartQty` prop and, when `inCart` is true, appends
`(N)` to the "In Bag" label. Existing callers (e.g. `concern-detail.js`) that
don't pass `inCartQty` continue to render `"In Bag ✓"` as before (default
`inCartQty = 0`).

---

## Fix 3 — Russian "Новинка" badge no longer overlaps

### Mobile app (`genosys-mobile-app/app/(tabs)/shop.js`)

The badge was absolutely positioned with a hard-coded `translateX: -14`,
which worked for the English 3-letter "NEW" but not for the 7-letter
"Новинка". The badge wrapped to two lines and overlapped the next pill.

Changes:

- New wrapper style `categoryNewBadgeWrapper` with `left: 0; right: 0;
  alignItems: 'center'; overflow: 'visible'`. The badge now centers over the
  pill regardless of text length, with no magic offset.
- `categoryNewBadge` dropped its fixed `translateX` and `maxWidth: '100%'`
  so it can grow to fit its text.
- The badge `<Text>` now uses `numberOfLines={1}` and
  `allowFontScaling={false}` to guarantee a single line.
- `categoryItem` margin increased from 8 → 14 px so the wider localised
  badge has room to overflow without touching the next pill.

### Mobile web (`cosmetics-website/app/products/ProductsPageClient.tsx`)

The web badge sits above each category pill with `-translate-x-1/2`. The
wrapper allowed text wrapping and the pills were packed with `gap-2`, so the
longer Russian label touched the next pill. Changes:

- Badge span now has `whitespace-nowrap`, `leading-none`, `uppercase`,
  `tracking-wide`, `pointer-events-none`, and a subtle `shadow-sm` for
  visual consistency with the app.
- The horizontal scroller around the pills went from `gap-2` to `gap-3` to
  give the overflowing badge breathing room.

No copy changes — `common.new` in `messages/ru.json` already resolves to
"Новинка".

---

## Files changed

**cosmetics-website** (mobile web)

- `app/cart/CartClient.tsx`
- `app/products/ProductsPageClient.tsx`
- `components/ProductCard/hooks/useProductCard.ts`
- `components/ProductCard/index.tsx`
- `components/ProductCard/types.ts`
- `components/ProductCard/ProductActions.tsx`
- `messages/en.json`, `messages/ar.json`, `messages/ru.json`
- `docs/CART_UX_FIXES_2026-04-23.md` (this file)

**genosys-mobile-app** (iOS + Android)

- `contexts/CartContext.js`
- `app/(tabs)/shop.js`
- `components/ProductGridItem.js`
- `i18n/messages/en.json`, `i18n/messages/ar.json`, `i18n/messages/ru.json`

## Verification

- `npx tsc --noEmit` — no new type errors introduced by these changes.
  Pre-existing failures are limited to `__tests__/` (jest-dom matcher types
  and some test fixtures) and are out of scope.
- `npm run build` (Next.js) — completes successfully, all locale routes
  compile.
- Manual smoke test:
  1. Add a bundle → confirm two free masks appear *below* the bundle.
  2. Add another bundle → confirm the new bundle line renders *above* the
     free masks, and the free masks remain at the bottom.
  3. From `/products`, tap "Add to Bag" — the button turns green and shows
     "In Bag (1)". Tap again → "In Bag (2)". Open bag → quantity matches.
  4. Switch app language to Russian → open the products screen → "Новинка"
     centers above each pill and never touches the adjacent pill.
