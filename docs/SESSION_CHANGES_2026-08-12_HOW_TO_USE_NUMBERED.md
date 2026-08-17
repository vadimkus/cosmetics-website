# Session — How to Use numbered formatting (2026-08-12)

## Goal

Unify PDP **How to Use** body to Cerabarrier-style numbered lists:

```
1. …
2. …
3. …
4. …
```

## Changes

- DB `product.howToUse`: converted JSON step arrays + plain paragraphs → numbered plain text (58 updates; 6 kits still empty).
- AR `data/productTranslations.ts` and RU `data/productTranslationsRu.ts` howToUse normalized the same way (translated copy kept).
- Script: `scripts/normalize-how-to-use-numbered.ts` (`--apply` to write).

## Verify

- Live EN: 60 products with ≥1 numbered step, 0 empty `1.` lines, 6 kits empty (54–59).
- Product 66 kept intro + numbered steps + trailing note.
- Title remains **How to Use** (prior UI unify commit).
