# Session Changes - January 15, 2026

## Summary

This session focused on major infrastructure upgrades: Node.js 22, React Compiler, View Transitions, and Tailwind CSS v4 migration.

---

## 1. Node.js 22 LTS Upgrade

### Files Changed

| File | Change |
|------|--------|
| `.nvmrc` | Created with `22` |
| `package.json` | Added `"engines": { "node": ">=22.0.0" }` |

### Vercel Configuration

Vercel automatically detects and uses Node.js 22 LTS for:
- Build process
- Serverless functions
- Edge functions

---

## 2. React Compiler Enabled

### Configuration

**File**: `next.config.js`

```javascript
// React Compiler for automatic optimization (Next.js 16+)
reactCompiler: true,
```

### Benefits

- Automatic component optimization
- Reduces unnecessary re-renders
- No manual `useMemo`/`useCallback` needed
- Compiler analyzes and optimizes React code

### Dependencies Added

```bash
npm install babel-plugin-react-compiler
```

---

## 3. View Transitions API

### Configuration

**File**: `next.config.js`

```javascript
experimental: {
  viewTransition: true,
}
```

### CSS Animations

**File**: `app/globals.css`

| Device | Animation | Duration |
|--------|-----------|----------|
| Desktop | Fade in/out | 200ms |
| Mobile | Slide left/right | 200ms |

### Fixed Elements (No Animation)

These elements stay fixed during page transitions:

| Element | CSS Class |
|---------|-----------|
| Header | `.main-header`, `.mobile-web-header` |
| Footer | `.mobile-footer-nav` |

### CSS Implementation

```css
@supports (view-transition-name: none) {
  /* Header stays fixed */
  .main-header, .mobile-web-header {
    view-transition-name: main-header;
  }
  
  ::view-transition-old(main-header),
  ::view-transition-new(main-header) {
    animation: none;
  }

  /* Mobile slide transitions */
  @media (max-width: 767px) {
    ::view-transition-old(root) {
      animation: slide-out-left 200ms ease-out;
    }
    ::view-transition-new(root) {
      animation: slide-in-right 200ms ease-out;
    }
  }
}
```

### Utility Functions

**File**: `lib/viewTransitions.ts` (NEW)

```typescript
// Check if View Transitions API is supported
export function supportsViewTransitions(): boolean

// Start a view transition with fallback
export async function startViewTransition(callback): Promise<void>

// Navigate with view transition
export function navigateWithTransition(router, url): void
```

---

## 4. Data Caching with `unstable_cache`

### Implementation

Using Next.js `unstable_cache` for server-side data caching.

| Page | Cache Key | Revalidation | Tags |
|------|-----------|--------------|------|
| Blog List | `blog-posts` | 60 seconds | `blog` |
| Product Detail | `product-{id}` | 60 seconds | `products`, `product-{id}` |

### Blog Page

**File**: `app/blog/page.tsx`

```typescript
import { unstable_cache } from 'next/cache'

const getBlogPosts = unstable_cache(
  async (): Promise<BlogPostListItem[]> => {
    // ... fetch logic
  },
  ['blog-posts'],
  { revalidate: 60, tags: ['blog'] }
)
```

### Product Page

**File**: `app/products/[id]/page.tsx`

```typescript
const getProduct = (id: string) => unstable_cache(
  async (): Promise<Product | null> => {
    // ... fetch logic
  },
  [`product-${id}`],
  { revalidate: 60, tags: ['products', `product-${id}`] }
)()
```

---

## 5. Tailwind CSS v4 Migration

### Overview

Complete migration from Tailwind CSS v3 to v4 with CSS-first configuration.

### Breaking Changes

| Before (v3) | After (v4) |
|-------------|------------|
| `tailwind.config.js` | CSS `@theme` block |
| `@tailwind base;` | `@import "tailwindcss";` |
| `@tailwind components;` | (included in import) |
| `@tailwind utilities;` | (included in import) |
| `tailwindcss` PostCSS plugin | `@tailwindcss/postcss` |
| Separate `autoprefixer` | Built into Tailwind |

### Files Removed

- `tailwind.config.js` - No longer needed in v4

### Files Updated

| File | Changes |
|------|---------|
| `package.json` | `tailwindcss@4`, `@tailwindcss/postcss@4`, removed `autoprefixer` |
| `postcss.config.js` | Changed plugin from `tailwindcss` to `@tailwindcss/postcss` |
| `app/globals.css` | New import syntax + `@theme` block |

### PostCSS Configuration

**File**: `postcss.config.js`

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    // cssnano for production...
  },
}
```

### Theme Configuration (CSS-native)

**File**: `app/globals.css`

```css
@import "tailwindcss";

@theme {
  /* Custom breakpoint */
  --breakpoint-xs: 475px;
  
  /* Primary color palette (red) */
  --color-primary-50: #fef2f2;
  --color-primary-100: #fee2e2;
  --color-primary-200: #fecaca;
  --color-primary-300: #fca5a5;
  --color-primary-400: #f87171;
  --color-primary-500: #ef4444;
  --color-primary-600: #dc2626;
  --color-primary-700: #b91c1c;
  --color-primary-800: #991b1b;
  --color-primary-900: #7f1d1d;
  
  /* Rose color palette */
  --color-rose-50: #fff1f2;
  /* ... all shades ... */
  --color-rose-900: #881337;
  
  /* Gold color palette */
  --color-gold-50: #fffbeb;
  /* ... all shades ... */
  --color-gold-900: #78350f;
}
```

### Benefits of Tailwind v4

| Feature | Improvement |
|---------|-------------|
| Build Speed | ~10x faster with Oxide engine |
| Configuration | CSS-native, no JavaScript |
| Content Detection | Automatic (no content paths needed) |
| Bundle Size | Smaller output |
| CSS Layers | Native cascade layers |
| Autoprefixing | Built-in |
| Hot Reload | Faster development |

---

## Files Modified

### Configuration

| File | Status |
|------|--------|
| `.nvmrc` | NEW |
| `package.json` | Modified |
| `next.config.js` | Modified |
| `postcss.config.js` | Modified |
| `tailwind.config.js` | DELETED |

### CSS & Utilities

| File | Status |
|------|--------|
| `app/globals.css` | Modified |
| `lib/viewTransitions.ts` | NEW |

### Pages with Caching

| File | Status |
|------|--------|
| `app/blog/page.tsx` | Modified |
| `app/products/[id]/page.tsx` | Modified |

---

## Package Changes

### Added

| Package | Version |
|---------|---------|
| `tailwindcss` | 4.x |
| `@tailwindcss/postcss` | 4.x |
| `babel-plugin-react-compiler` | 1.0.0 |

### Removed

| Package | Reason |
|---------|--------|
| `tailwindcss` | Replaced by v4 |
| `autoprefixer` | Built into Tailwind v4 |

---

## Testing Checklist

- [x] Node.js 22 - `.nvmrc` created
- [x] React Compiler - Enabled in config
- [x] View Transitions - Desktop fade, mobile slide
- [x] Data Caching - Blog and product pages
- [x] Tailwind v4 - CSS-first config
- [x] Build - Passing (261 pages)

---

## Build Verification

```
✓ Compiled successfully
✓ TypeScript check passed
✓ Generated 261 static pages
```

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Files Created | 2 |
| Files Modified | 6 |
| Files Deleted | 1 |
| Build Status | ✅ Passing |

### Version Upgrades

| Technology | Before | After |
|------------|--------|-------|
| Node.js | 20.x | 22 LTS |
| Tailwind CSS | 3.4.18 | 4.x |
| React Compiler | Disabled | Enabled |
| View Transitions | Disabled | Enabled |

---

*Session completed: January 15, 2026*
