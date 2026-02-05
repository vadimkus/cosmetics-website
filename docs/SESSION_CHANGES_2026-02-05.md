# Session Changes - February 5, 2026

## Summary

Major enhancements to the Bundle Builder feature focusing on UX improvements, discount visibility, and mobile interactions.

---

## Bundle Builder Enhancements

### 1. Bundle Discount Progress Bar

**Location**: Below step indicator (sticky header area)

Added a visual progress bar showing progress toward maximum bundle discount:

- **Progress Track**: Horizontal bar with green gradient fill
- **Milestone Markers**: Dots at 2, 3, 4, 5 items (turn green when reached)
- **Labels**: `0` - `2=5%` - `3=10%` - `4=15%` - `5=20%`
- **Status Badge**: Shows current items count and discount percentage
- **Animated**: Smooth fill animation as items are added/removed

```
Progress: ████████░░░░░░░░░░░░ (40%)
          0    2=5%   3=10%  4=15%  5=20%
                              3 items • 10% off
```

**Files Modified**:
- `app/bundle-builder/BundleBuilderClient.tsx`

---

### 2. Detailed Discount Breakdown

**Location**: "Your Bundle" summary (desktop sidebar & mobile bottom sheet)

When user has a personal discount, the pricing summary now shows a complete breakdown:

| Line | Example | Color |
|------|---------|-------|
| Retail Price | ~~620.00 AED~~ | Gray (struck) |
| Your Discount | -310.00 AED | Purple |
| Subtotal | 310.00 AED | Black |
| Bundle Discount (5%) | -15.50 AED | Green |
| **Total** | **294.50 AED** | Bold |
| 5% VAT included | | Gray |
| You save 325.50 AED | | Green badge |

**Files Modified**:
- `app/bundle-builder/BundleBuilderClient.tsx`
- `messages/en.json` (added `retailPrice`, `yourDiscount`)
- `messages/ru.json` (added translations)
- `messages/ar.json` (added translations)

---

### 3. Product Detail Bottom Sheet (Mobile)

**Trigger**: Single tap on product card opens detail sheet

**Features**:
- Centered product image (max 200px × 200px)
- Product size displayed below image
- Full product name
- Bundle discount badge showing % that will apply
- "when added" hint for items not yet in bundle
- Full localized description (not truncated)
- Price with all applicable discounts
- "Add to Set" / "Added to Set" button
- "Continue Browsing" link

**Double-tap**: Quick add/remove for power users
**First-time hint**: "Double-tap to quick add" shown via localStorage flag

**Files Modified**:
- `app/bundle-builder/BundleBuilderClient.tsx`
- `messages/en.json`, `messages/ru.json`, `messages/ar.json`

---

### 4. Bottom Sheet Swipe Gesture Improvements

Made swipe-down-to-close more sensitive:

| Setting | Before | After |
|---------|--------|-------|
| Distance threshold | 100px | 50px |
| Velocity detection | None | Fast swipe (0.3px/ms) closes with 20px |
| Drag handle size | Small | Larger (12px × 1.5px bar) |

**Files Modified**:
- `components/ui/BottomSheet.tsx`

---

### 5. Per-Item Bundle Discount Display

Each item in "Your Bundle" summary now shows:

- Product image with size below
- Product name and category
- Bundle discount badge (✨ -X%)
- Discounted price with original struck through

**Files Modified**:
- `app/bundle-builder/BundleBuilderClient.tsx`

---

## UI Improvements

### Header
- **Centered title**: "Build Your Set" now perfectly centered using absolute positioning
- **Removed duplicate**: "X items Y% OFF" removed from header (kept in progress bar)

### Product Cards
- **Centered "+ Add" button**: Changed from right-aligned to centered

### Pricing Text
- **VAT text**: Changed from "VAT included" to "5% VAT included"

### Mobile Bag Icon
- **Smaller badge**: Reduced item count digit size from default to `text-[10px]`

---

## Bug Fixes

| Issue | Fix |
|-------|-----|
| Unused `itemPricing` variable | Removed unused variable |
| Unused `user` prop in BundleSummary | Removed from component and call sites |
| TypeScript error in useEffect | Restructured with early returns |
| Touch event undefined check | Added null check for `e.touches[0]` |

---

## Chatbot

- Hidden chatbot on `/bundle-builder` page on mobile web for cleaner UX

**Files Modified**:
- `components/ChatWidget.tsx`

---

## Files Changed

### Core Changes
```
app/bundle-builder/BundleBuilderClient.tsx  # Major updates
components/ui/BottomSheet.tsx               # Swipe improvements
components/ChatWidget.tsx                   # Hide on bundle-builder
```

### Translations
```
messages/en.json                            # New keys
messages/ru.json                            # New keys
messages/ar.json                            # New keys
```

### Documentation
```
docs/BUNDLE_BUILDER.md                      # Updated changelog
docs/SESSION_CHANGES_2026-02-05.md          # This file
```

---

## Git Commits

1. `feat: Show bundle discount per item in Your Bundle summary`
2. `fix: Center '+ Add' button on bundle builder product cards`
3. `fix: Make bottom sheet swipe-down more sensitive`
4. `feat: Show detailed discount breakdown in bundle builder`
5. `fix: Remove unused itemPricing variable`
6. `feat: Add bundle discount progress bar below steps`
7. `fix: Remove unused user prop from BundleSummary`
8. `fix: Center product image in bundle detail sheet`
9. `fix: Remove duplicate items/discount display in desktop header`
10. `fix: Add 5% to VAT included text in bundle builder`
11. `fix: Center 'Build Your Set' title in header`

---

## Testing Checklist

- [ ] Desktop: Progress bar displays correctly
- [ ] Desktop: Discount breakdown shows all tiers
- [ ] Desktop: "Build Your Set" title centered
- [ ] Mobile: Single tap opens product detail sheet
- [ ] Mobile: Double tap quick-adds product
- [ ] Mobile: Swipe down closes bottom sheet (50px or fast swipe)
- [ ] Mobile: Product image centered in detail sheet
- [ ] Mobile: Chatbot hidden on bundle builder
- [ ] All languages: New translations display correctly
- [ ] User with discount: Both discounts shown in breakdown
- [ ] User without discount: Only bundle discount shown

---

*Last updated: February 5, 2026*
