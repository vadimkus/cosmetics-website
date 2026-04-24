# Bestsellers rail — honor user discount on homepage

**Date:** 2026-04-17
**Scope:** Desktop homepage "What's popular right now" section

## Problem

The Bestsellers rail on the desktop homepage (`components/home/HomeDesktopSections.tsx`) was rendering the raw catalog price:

```tsx
<p className="text-sm font-semibold text-gray-900">
  AED {product.price}
</p>
```

This ignored every discount layer the rest of the site respects:

- **Black Friday** sale discount (when active)
- **User tier** discount (`user.discountType` + `user.discountPercentage`, e.g. Gold / VIP)
- **Beauty Box** built-in 15% bundle discount

The result: a logged-in VIP customer with a 20% discount saw the same `AED 580` as everyone else on the homepage, but then saw `AED 464` on the PDP / category page / cart. Confusing, and it made the homepage feel disconnected from the rest of the catalog.

## Fix

`HomeDesktopSections.tsx` now runs the same `calculateDiscountedPrice(product, user)` pipeline used by `ProductCard/ProductPrice`. When a discount applies, the rail renders:

- **Discounted price** (bold, primary color)
- **Original price** (strikethrough, small)
- **Percent off** badge — translated to AR/RU/EN

When no discount applies, it falls back to the plain `AED 580.00` line exactly as before.

All other states — price-on-request, authenticated-but-locked, guest login prompt — are unchanged.

### Before

```tsx
) : userCanSeePrices ? (
  <p className="text-sm font-semibold text-gray-900">
    AED {product.price}
  </p>
) : user ? (
```

### After

```tsx
) : userCanSeePrices ? (
  (() => {
    const pricing = calculateDiscountedPrice(product, user)
    if (pricing.hasDiscount) {
      return (
        <div>
          <div className="flex items-center gap-2 flex-wrap …">
            <span className="text-sm font-bold text-primary-600">
              AED {pricing.discountedPrice.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 line-through">
              AED {pricing.originalPrice.toFixed(2)}
            </span>
          </div>
          <span className="mt-0.5 inline-block text-[10px] font-semibold text-green-600">
            {pricing.discountPercentage}% {locale === 'ar' ? 'خصم' : locale === 'ru' ? 'скидка' : 'off'}
          </span>
        </div>
      )
    }
    return (
      <p className="text-sm font-semibold text-gray-900">
        AED {pricing.originalPrice.toFixed(2)}
      </p>
    )
  })()
) : user ? (
```

## Why this utility and not re-implement

`calculateDiscountedPrice` is the single source of truth the PDP (`ProductCard/ProductPrice.tsx`), the cart, and the checkout all use. Using it here guarantees:

- Same rounding rules (`Math.round(x * 100) / 100`)
- Same exclusions (devices, Hydro Cool Mask, `noDiscount=true`, Beauty Boxes vs. user tier)
- Same priority order (Beauty Box > Black Friday > user tier)
- Same behavior if any of those rules change later — only one place to edit

## Files touched

- `components/home/HomeDesktopSections.tsx`
  - Import `calculateDiscountedPrice` alongside `canUserSeePrices`
  - Replace raw `AED {product.price}` with discounted/original + percent-off block

## Testing

- `npm run build` ✓
- Verified guest → still sees "Login to see price"
- Verified logged-in user without price permission → still sees "Price locked"
- Verified logged-in user with discount → sees both prices + % off on the Bestsellers rail, matching PDP
- Verified logged-in user without discount → sees single `AED x.xx` line (no change visually from before)
