# Session Changes — February 26, 2026 (Part 2)

> Skin Concern Pages: Native App Parity — CTA, Collapsible Sections, Pricing Fixes

**Platforms affected**: Desktop Web, Mobile Web, PWA (all 3 locales: EN, AR, RU)

---

## 1. Replace "Complete Your Routine" with "Start Your Routine Today" CTA

### Summary

Removed the static "Complete Your Routine" essentials block (Cleanser, Booster, SPF cards with prices) and replaced it with a dynamic **"Start Your Routine Today"** CTA section — matching the native app (`genosys-mobile-app/app/concern-detail.js`).

### Before

A 3-column grid showing SNOW O₂ CLEANSER, SNOW BOOSTER, and ULTRA SHIELD SPF 50+ with dynamic pricing via `ConcernEssentialPrice`. Only appeared for non-hair-loss concerns.

### After

A centered CTA block with:
- **Title**: "Start Your Routine Today" (localized)
- **Subtitle**: "Tap products in the routine above to add them to your bag" (localized)
- **View Bag** button (primary, disabled when cart is empty, shows item count)
- **AI Skin Analysis** button (secondary, links to `/skin-recommendation`)

Appears on **all** concern pages (including hair-loss) on all screen sizes.

### Files Changed

| File | Change |
|------|--------|
| `components/ConcernCTA.tsx` | **NEW** — Client component with cart-aware View Bag button + AI Skin Analysis link. Localized labels for EN/AR/RU. |
| `app/products/concern/[slug]/page.tsx` | Replaced "Complete Your Routine" block with `<ConcernCTA locale="en" />`. Removed `ConcernEssentialPrice` import. Removed `essentialNums` product fetch. |
| `app/ar/products/concern/[slug]/page.tsx` | Same replacement with `<ConcernCTA locale="ar" />` |
| `app/ru/products/concern/[slug]/page.tsx` | Same replacement with `<ConcernCTA locale="ru" />` |

### Cleanup

- `components/ConcernEssentialPrice.tsx` is now **unused** (no imports remain). Can be deleted.
- Essential product IDs (`'10'`, `'16'`, `'39'`) are no longer fetched separately for concern pages.
- `productById` map is still used by `RoutineProductChip` so it remains.

### CTA Translations

| Locale | Title | Subtitle | View Bag | AI Skin Analysis |
|--------|-------|----------|----------|-----------------|
| EN | Start Your Routine Today | Tap products in the routine above to add them to your bag | View Bag | AI Skin Analysis |
| AR | ابدأي روتينك اليوم | اضغطي على المنتجات في الروتين أعلاه لإضافتها إلى حقيبتك | عرض الحقيبة | تحليل البشرة بالذكاء الاصطناعي |
| RU | Начните уход сегодня | Нажимайте на продукты в рутине выше, чтобы добавить их в корзину | Перейти в корзину | AI-анализ кожи |

---

## 2. Documentation Section — Match Header Height to "Why" Section

### Summary

The collapsible "Documentation" (protocol PDF) section header was visually smaller than the "Why" section header. Updated to match.

### Before

```
text-sm font-semibold text-gray-700 hover:text-gray-900  + px-1
```

### After

```
text-lg font-semibold text-gray-900
```

Same typography as the `ConcernWhySection` button header: `text-lg font-semibold text-gray-900`.

### Files Changed

| File | Label |
|------|-------|
| `app/products/concern/[slug]/page.tsx` | "Documentation" |
| `app/ar/products/concern/[slug]/page.tsx` | "التوثيق" |
| `app/ru/products/concern/[slug]/page.tsx` | "Документация" |

---

## 3. "Why" Section — Collapsible on All Screen Sizes (Desktop + Mobile)

### Summary

The "Why" section (e.g., "Why Sun Protection Is Essential in the UAE") was only collapsible on mobile (`< 768px`). On desktop it was always expanded with no toggle. Updated to be collapsible on **all screen sizes**, matching the native app behavior.

### Before

- Mobile: Collapsible with button + chevron, collapsed by default
- Desktop: Always expanded, no toggle, centered title

### After

- **All screens**: Collapsible with button + chevron, collapsed by default
- Removed `isMobile` state, `useEffect` resize listener, and the desktop-only code path

### File Changed

| File | Change |
|------|--------|
| `components/ConcernWhySection.tsx` | Removed `useState(false)` for `isMobile`, removed `useEffect` resize listener. Single render path for all screen sizes: collapsible button with chevron, collapsed by default. Removed `useEffect` import. |

### Native App Reference

```javascript
// genosys-mobile-app/app/concern-detail.js (lines 226-248)
<TouchableOpacity onPress={() => setWhyExpanded(prev => !prev)}>
  <Text>{why.title}</Text>
  <Ionicons name={whyExpanded ? 'chevron-up' : 'chevron-down'} />
</TouchableOpacity>
{whyExpanded && <View>{why.items.map(...)}</View>}
```

Website now mirrors this exact behavior.

---

## 4. Skin Recommendation Page — Remove "View Recommended Products" Button

### Summary

Removed the standalone **"View Recommended Products"** button and subtitle text that appeared below the skin analysis report on `/skin-recommendation`. Product recommendations are now only accessible through the **AI Expert Analysis** section.

### Before

After the analysis report + AI Expert Analysis card, a large CTA button appeared:
- "View Recommended Products →"
- "GENOSYS products tailored for your skin type"
- Clicking it fetched product recommendations via `/api/skin-recommendations`

### After

Button and subtitle completely removed. The analysis report flows directly into the form/questionnaire section.

### File Changed

| File | Change |
|------|--------|
| `app/skin-recommendation/SkinRecommendationClient.tsx` | Removed the entire "Get Recommendations Button" block (~50 lines) including the `onClick` handler, loading state, button, and subtitle text. |

---

## 5. AI Expert Analysis — Fix Discounted Price Display

### Summary

Product recommendations inside the AI Expert Analysis section were showing **retail price** regardless of user discount. Fixed to apply `calculateDiscountedPrice()` and respect `canUserSeePrices()`.

### Before

```tsx
<p className="text-primary-600 font-bold">
  AED {Number(productDetails.price).toFixed(0)}
</p>
```

Always showed retail price (e.g., AED 330 for a user with 50% discount).

### After

```tsx
const pricing = calculateDiscountedPrice(productDetails, user)
// Shows: AED 165 (strikethrough 330) for 50% discount user
```

### Price Display Logic

| User State | Display |
|------------|---------|
| Guest (not logged in) | No price shown |
| Logged in, no discount | `AED {originalPrice}` |
| Logged in, with discount | `AED {discountedPrice}` + strikethrough `{originalPrice}` |

### File Changed

| File | Change |
|------|--------|
| `app/skin-recommendation/SkinRecommendationClient.tsx` | Replaced static `productDetails.price` with `calculateDiscountedPrice()` + `canUserSeePrices()`. Shows discounted price with strikethrough original when discount applies. Hides price entirely for guests. |

---

## Summary of All Files Changed

| File | Changes |
|------|---------|
| `components/ConcernCTA.tsx` | **NEW** — "Start Your Routine Today" CTA with View Bag + AI Skin Analysis buttons |
| `components/ConcernWhySection.tsx` | Collapsible on all screens (removed desktop-only always-expanded path) |
| `app/products/concern/[slug]/page.tsx` | Replaced Complete Your Routine → ConcernCTA; Documentation header sizing; removed essentials fetch |
| `app/ar/products/concern/[slug]/page.tsx` | Same as EN page |
| `app/ru/products/concern/[slug]/page.tsx` | Same as EN page |
| `app/skin-recommendation/SkinRecommendationClient.tsx` | Removed "View Recommended Products" button; fixed AI Expert Analysis pricing |

### Files Now Unused (can be deleted)

| File | Reason |
|------|--------|
| `components/ConcernEssentialPrice.tsx` | Was only used in "Complete Your Routine" blocks, which are now removed |

---

*All changes verified with `npx next build` — build passes with exit code 0.*
