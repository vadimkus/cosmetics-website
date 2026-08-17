# Session — Beauty Box title line break (2026-08-09)

## Request
Product card titles for Beauty Boxes should always show **Beauty Box** on line 2:

```
Problem Skin Care
Beauty Box
```

Previously CSS wrapping put mid-words on line 2 (e.g. `CARE BEAUTY BOX`).

## Change
- Added `utils/formatProductDisplayName.tsx` — splits names ending in `Beauty Box` into two block lines; non-breaking space inside the suffix.
- Wired into:
  - `components/ProductCard/ProductInfo.tsx` (category grid cards)
  - `app/products/[id]/ProductPageClientRefactored.tsx` (PDP titles)
  - `components/home/HomeDesktopSections.tsx` (home product rails)
- Test: `__tests__/utils/formatProductDisplayName.test.tsx`

## Note
Casing left as stored in DB (typically ALL CAPS). Only line structure changed.

---

## Follow-up — option sheet hint copy

Replaced generic **Required field** on Choose Options with:
- EN: **Select size** / **Select color**
- RU: Выберите размер / Выберите цвет
- AR: اختر الحجم / اختر اللون

Files: `ProductOptionDialog.tsx`, `messages/{en,ru,ar}.json`, option-dialog tests.
