# Session — Radiance Serum Restock (2026-05-15)

- **Product:** `MULTI VITA RADIANCE SERUM`, website product `21`, 30ml, 330 AED.
- **Request:** stock arrived; enable product for website sales.
- **Finding:** hardcoded catalogue `lib/products.ts` already had `inStock: true`, but live DB `Product.inStock` was `false`.
- **Action:** updated DB product `21` to `inStock: true`, `isHidden: false`, `isPriceOnRequest: false`, `price: 330`, `size: 30ml`.
- **Variant:** existing default variant was already `available: true`, `isDefault: true`, `price: 330`; kept available.
- **Cache:** no `REVALIDATE_SECRET` in local env, so live site will refresh via normal products ISR/cache window.
