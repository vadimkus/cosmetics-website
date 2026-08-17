# Product 26 — EGF Repair Oxymask Cream: page retired

**Date:** 2026-08-17
**Trigger:** Owner confirmed the discontinuation is permanent.
**Prior context:** `SESSION_CHANGES_2026-07-09_EGF_OXYMASK_DISCONTINUED.md` hid the
product and recorded an open question — what replaces it in Beauty Box 62.
`SESSION_CHANGES_2026-08-13_BOX62_EGF_REPLACEMENT.md` answered it. Both were acted
on earlier today, when box 62 was reworked and the replacement went live.

A bespoke page for this product was built earlier today, before the discontinuation
was known. It was never reachable: the record has been `isHidden: true` since July,
so the route 404s. That page is now deleted rather than left in the tree.

## Removed

| File | Change |
|---|---|
| `components/product/oxymask/OxymaskProductPage.tsx` | Deleted (~39 KB) |
| `components/product/oxymask/oxymaskCopy.ts` | Deleted (~64 KB, EN/AR/RU) |
| `components/product/oxymask/oxymask.css` | Deleted |
| `components/product/bespokePdp.tsx` | Removed the import, the `'26'` registry entry and the `'26'` companion list |
| `app/products/[id]/page.tsx` + `ar` + `ru` | Removed `'26'` from the three bespoke route allow-lists |
| `messages/{en,ar,ru}.json` | Removed `routineEGFOxymaskTitle` and `routineEGFOxymaskDesc`. These were kept in July *because box 62 still referenced them*; that stopped being true today when the routine step became the overnight mask, so they were shipped dead weight in every page bundle |
| `app/products/[id]/ProductPageClientRefactored.tsx` | Deleted the 53-line hardcoded "Sensitive Skin Beauty Box" routine block, which was the only consumer of those two keys |
| `app/prof/page.tsx` | Removed the product from the professional cost-per-procedure table |
| `lib/productsDb.ts` | Removed the `targetConcerns` mapping |
| `docs/CHATBOT_KNOWLEDGE.md` | Removed from the creams table, count corrected 10 → 9 |

### Note on the deleted legacy routine block

`useLegacyBeautyBoxRoutine` is defined as `!PRODUCT_ROUTINES[productNumber]`. Box 62
has a routine entry, so the block evaluated to `false` and could never render. Five
sibling blocks for boxes 55–59 remain and are dead for the same reason; only the 62
one was removed here because it was the one holding the EGF keys alive. **The
remaining five (~250 lines) are still worth deleting as a separate cleanup.**

## Deliberately kept, and why

Each of these now carries an inline comment so a future cleanup does not remove it:

| File | Reason |
|---|---|
| `lib/products.ts` | The static fallback row stays, `inStock: false` / `isHidden: true`. Past orders resolve the product name and image through it |
| `public/images/EGF.jpg` | **8 past order items point at this path.** Deleting it would leave dead images in order history and invoices |
| `lib/moysklad.ts` | The product UUID is still needed for historical demands, returns and consignment reports |
| `lib/orderSizeDefaults.ts` | Past orders carry the name with a null `size`; this is what renders "50g" on them |
| `components/product/overnight/*`, `beautybox/copy/charmingLook.ts` | Sourcing warnings telling future work **not** to borrow this product's formula, SA or COA for the Overnight Cream Mask. These are the reason a real mix-up was avoided; they stay |
| `components/product/beautybox/copy/sensitiveSkin.ts` | Its sourcing header records why the substitution happened, and the FAQ answers the customer question "what happened to the EGF mask?" in all three languages |
| `data/productTranslationsRu.ts` | The product's own Russian entry is dead data behind a hidden record. Left alone, as in July: removing it is cosmetic and carries more structural risk than value |
| All `docs/` and `scripts/` history | Order, consignment and restock records. Never rewrite these |

## Verified

- Order history intact: 8 `OrderItem` rows still resolve name, price, image and size.
  Order items store their own `productName`, `price` and `image`, so they do not
  depend on the catalogue row at all.
- Product row still present: `{ id: 26, inStock: false, isHidden: true }`.
- Typecheck, lint and all 68 Jest suites pass.
- Clean-checkout production build compiles.
- `/products/26` 404s in all three locales, as it has since July.
- `/products/62` unaffected: still six item cards, zero console errors, all locales.
