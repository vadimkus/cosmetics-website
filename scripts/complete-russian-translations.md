# Professional Russian Translation Guide

## Current Status
- ✅ Product 1 (Microneedle Roller) - **COMPLETED** with professional Russian translation
- ⚠️ Products 2-58 - Need professional Russian translations

## Translation Approach

### Option 1: Professional Translation Service (Recommended)
Use DeepL API or Google Cloud Translation API for high-quality translations:

```bash
# Example using DeepL API (requires API key)
# Translate all product descriptions, features, benefits, etc.
```

### Option 2: Manual Professional Translation
Hire a native Russian speaker with skincare/cosmetics expertise to translate all products.

### Option 3: Hybrid Approach
1. Use translation API for initial translations
2. Have native speaker review and refine
3. Ensure professional, natural Russian

## Translation Checklist

For each product, translate:
- [ ] `description` - Product description
- [ ] `productDetails` - JSON object with product specifications
- [ ] `keyFeatures` - Array of feature objects with title and description
- [ ] `benefits` - Array of benefit strings
- [ ] `ingredients` - Array of ingredient objects (if applicable)
- [ ] `howToUse` - Array of usage step objects or string
- [ ] `directions` - Usage directions text

## Key Terminology

| English | Russian |
|---------|---------|
| Professional | Профессиональный |
| Device | Устройство |
| Serum | Сыворотка |
| Cream | Крем |
| Toner | Тоник |
| Cleanser | Очищающее средство |
| Mask | Маска |
| Peeling | Пилинг |
| Moisturizing | Увлажняющий |
| Anti-aging | Антивозрастной |
| Brightening | Осветляющий |
| Firming | Укрепляющий |
| Soothing | Успокаивающий |
| Apply | Нанесите |
| Cleanse | Очистите |
| Massage | Помассируйте |
| Rinse | Смойте |
| Use | Используйте |
| Store | Храните |
| South Korea | Южная Корея |
| For best results | Для достижения наилучших результатов |
| Suitable for | Подходит для |
| All skin types | Всех типов кожи |
| Dermatologically tested | Дерматологически протестировано |

## Quality Standards

✅ **DO:**
- Use proper Russian grammar and syntax
- Maintain professional, formal tone
- Ensure natural, fluent Russian
- Keep product names and technical terms consistent
- Preserve JSON structure exactly
- Use appropriate skincare terminology

❌ **DON'T:**
- Mix English and Russian words
- Use literal word-for-word translation
- Use informal or casual language
- Change JSON structure
- Translate product names (keep original)

## Example: Product 1 Translation

**Before (BAD):**
```
"Профессиональный microneedling устройство с patented..."
```

**After (GOOD):**
```
"Профессиональное устройство для микронидлинга с запатентованной системой..."
```

## Next Steps

1. Review `data/productTranslationsRu.ts`
2. Translate remaining 57 products using professional approach
3. Test translations on website (`/ru/products/...`)
4. Get native speaker review
5. Update file with final professional translations

## File Location
`data/productTranslationsRu.ts`



