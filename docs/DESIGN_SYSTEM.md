# GENOSYS Design System

A comprehensive design system for the GENOSYS cosmetics website and PWA, inspired by Apple Human Interface Guidelines and modern design principles.

## Table of Contents

1. [Typography System](#typography-system)
2. [Dark Mode](#dark-mode)
3. [Color System](#color-system)
4. [Shadow & Elevation](#shadow--elevation)
5. [Vibrancy & Glassmorphism](#vibrancy--glassmorphism)
6. [Border Radius](#border-radius)
7. [Touch Targets](#touch-targets)
8. [Component Presets](#component-presets)
9. [Theme Hook](#theme-hook)
10. [Usage Examples](#usage-examples)

---

## Typography System

### Font Strategy

The design system uses a sophisticated font stack that provides SF Pro on Apple devices while falling back to Inter for cross-platform consistency.

```css
/* Headings - SF Pro Display with Inter fallback */
--font-display: "SF Pro Display", var(--font-inter, "Inter"), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

/* Body - SF Pro Text with Inter fallback */
--font-body: "SF Pro Text", var(--font-inter, "Inter"), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

/* Code - SF Mono with system monospace fallback */
--font-mono: "SF Mono", ui-monospace, SFMono-Regular, "Roboto Mono", Menlo, Monaco, Consolas, monospace;
```

### Typography Scale

All typography uses `clamp()` for fluid responsive sizing that respects user preferences (Dynamic Type on iOS).

#### Display Sizes (Hero Headlines)

| Token | Size Range | CSS Variable |
|-------|------------|--------------|
| Display Large | 40px → 72px | `--text-display-lg` |
| Display Medium | 32px → 56px | `--text-display-md` |
| Display Small | 28px → 40px | `--text-display-sm` |

#### Heading Sizes

| Token | Size Range | CSS Variable |
|-------|------------|--------------|
| H1 | 28px → 36px | `--text-h1` |
| H2 | 24px → 30px | `--text-h2` |
| H3 | 20px → 24px | `--text-h3` |
| H4 | 18px → 20px | `--text-h4` |
| H5 | 16px → 18px | `--text-h5` |
| H6 | 14px → 16px | `--text-h6` |

#### Body Sizes

| Token | Size Range | CSS Variable |
|-------|------------|--------------|
| Body Large | 17px → 18px | `--text-body-lg` |
| Body Medium | 15px → 16px | `--text-body-md` |
| Body Small | 13px → 14px | `--text-body-sm` |
| Body XS | 11px → 12px | `--text-body-xs` |

### Typography Classes

```html
<!-- Display typography -->
<h1 class="text-display-lg">Hero Headline</h1>
<h2 class="text-display-md">Large Title</h2>
<h3 class="text-display-sm">Section Title</h3>

<!-- Heading typography -->
<h1 class="text-heading-1">Page Title</h1>
<h2 class="text-heading-2">Section Heading</h2>
<h3 class="text-heading-3">Subsection</h3>

<!-- Body typography -->
<p class="text-body-lg">Large body text</p>
<p class="text-body-md">Default body text</p>
<p class="text-body-sm">Small text / captions</p>
<span class="text-body-xs">Extra small / legal</span>
```

### Font Weights

| Weight | Value | Class |
|--------|-------|-------|
| Thin | 100 | `.font-weight-thin` |
| Extra Light | 200 | `.font-weight-extralight` |
| Light | 300 | `.font-weight-light` |
| Normal | 400 | `.font-weight-normal` |
| Medium | 500 | `.font-weight-medium` |
| Semibold | 600 | `.font-weight-semibold` |
| Bold | 700 | `.font-weight-bold` |
| Extra Bold | 800 | `.font-weight-extrabold` |
| Black | 900 | `.font-weight-black` |

### Line Heights

| Token | Value | Class |
|-------|-------|-------|
| Tight | 1.15 | `.leading-display` |
| Snug | 1.3 | `.leading-heading` |
| Normal | 1.5 | `.leading-body` |
| Relaxed | 1.65 | `.leading-reading` |
| Loose | 1.85 | `.leading-spacious` |

### Letter Spacing

| Token | Value | Class |
|-------|-------|-------|
| Tighter | -0.03em | `.tracking-headline` |
| Tight | -0.015em | `.tracking-subheading` |
| Normal | 0 | `.tracking-body` |
| Wide | 0.015em | `.tracking-caption` |
| Wider | 0.03em | `.tracking-label` |
| Widest | 0.06em | `.tracking-uppercase` |

### TypeScript Helpers

```typescript
import { heading, body, display, cn } from '@/lib/typography'

// Generate heading class with modifiers
const h1Class = heading(1, { weight: 'bold', tracking: 'headline' })
// Output: "text-heading-1 font-weight-bold tracking-headline"

// Generate body class
const bodyClass = body('lg', { weight: 'medium', leading: 'reading' })
// Output: "text-body-lg font-weight-medium leading-reading"

// Display typography
const heroClass = display('lg')
// Output: "text-display-lg"
```

---

## Dark Mode

### Automatic System Detection

Dark mode automatically activates based on the user's system preference via `prefers-color-scheme: dark`.

### Manual Toggle

Users can override system preference using the `data-theme` attribute on the `<html>` element:

```html
<!-- Force light mode -->
<html data-theme="light">

<!-- Force dark mode -->
<html data-theme="dark">

<!-- Follow system (default) -->
<html>
```

### Theme Persistence

The theme preference is persisted to `localStorage` under the key `genosys-theme`.

---

## Color System

### Semantic Color Tokens

The design system uses semantic color tokens that automatically adapt to light/dark mode.

#### Background Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-bg-primary` | `#ffffff` | `#000000` | Main background |
| `--color-bg-secondary` | `#f9fafb` | `#1c1c1e` | Secondary areas |
| `--color-bg-tertiary` | `#f3f4f6` | `#2c2c2e` | Tertiary areas |
| `--color-bg-elevated` | `#ffffff` | `#1c1c1e` | Elevated surfaces |
| `--color-bg-grouped` | `#f2f2f7` | `#000000` | Grouped content |

#### Surface Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-surface` | `#ffffff` | `#1c1c1e` | Cards, modals |
| `--color-surface-secondary` | `#f9fafb` | `#2c2c2e` | Secondary surfaces |
| `--color-surface-tertiary` | `#f3f4f6` | `#3a3a3c` | Tertiary surfaces |
| `--color-surface-overlay` | `rgba(255,255,255,0.9)` | `rgba(28,28,30,0.9)` | Overlays |

#### Text Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-text-primary` | `#111827` | `#ffffff` | Primary text |
| `--color-text-secondary` | `#4b5563` | `#ebebf5` | Secondary text |
| `--color-text-tertiary` | `#9ca3af` | `#ebebf599` | Tertiary text |
| `--color-text-quaternary` | `#d1d5db` | `#ebebf54d` | Disabled text |
| `--color-text-inverse` | `#ffffff` | `#000000` | Inverse text |

#### Border Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-border-primary` | `#e5e7eb` | `#38383a` | Primary borders |
| `--color-border-secondary` | `#d1d5db` | `#48484a` | Secondary borders |
| `--color-border-tertiary` | `#f3f4f6` | `#2c2c2e` | Subtle borders |
| `--color-border-focus` | `#dc2626` | `#ef4444` | Focus rings |

### CSS Classes

```html
<!-- Backgrounds -->
<div class="bg-primary">Primary background</div>
<div class="bg-secondary">Secondary background</div>
<div class="bg-surface">Surface (card)</div>

<!-- Text -->
<p class="text-primary">Primary text</p>
<p class="text-secondary">Secondary text</p>
<p class="text-tertiary">Tertiary text</p>

<!-- Borders -->
<div class="border border-primary">Primary border</div>
<div class="border border-secondary">Secondary border</div>
```

### Brand Colors

The primary brand color palette (red) remains consistent across modes:

```css
--color-primary-50: #fef2f2;
--color-primary-100: #fee2e2;
--color-primary-200: #fecaca;
--color-primary-300: #fca5a5;
--color-primary-400: #f87171;
--color-primary-500: #ef4444;
--color-primary-600: #dc2626;  /* Primary brand color */
--color-primary-700: #b91c1c;
--color-primary-800: #991b1b;
--color-primary-900: #7f1d1d;
```

---

## Shadow & Elevation

### Elevation System

Inspired by Apple's layered interface design, the elevation system provides depth hierarchy:

| Level | CSS Variable | Class | Use Case |
|-------|--------------|-------|----------|
| 0 | `--shadow-none` | `.elevation-0` | Flat elements |
| 1 | `--shadow-sm` | `.elevation-1` | Cards, inputs |
| 2 | `--shadow-md` | `.elevation-2` | Raised cards, dropdowns |
| 3 | `--shadow-lg` | `.elevation-3` | Modals, popovers |
| 4 | `--shadow-xl` | `.elevation-4` | Sheets, overlays |
| 5 | `--shadow-2xl` | `.elevation-5` | Critical overlays |

### Shadow Tokens

```css
/* Subtle shadows */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);

/* Standard shadows */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05);

/* Dramatic shadows */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.15);

/* Branded shadows */
--shadow-primary: 0 4px 14px 0 rgba(220, 38, 38, 0.25);
--shadow-primary-lg: 0 10px 25px 0 rgba(220, 38, 38, 0.3);

/* Inner shadows */
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
--shadow-inner-lg: inset 0 4px 6px 0 rgba(0, 0, 0, 0.1);
```

### Usage

```html
<!-- Semantic elevation -->
<div class="elevation-1">Subtle elevation</div>
<div class="elevation-3">Modal elevation</div>
<div class="elevation-5">Maximum elevation</div>

<!-- Direct shadow classes -->
<div class="shadow-sm">Small shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-primary">Branded shadow</div>

<!-- Inner shadows -->
<div class="shadow-inner">Inset element</div>
```

---

## Vibrancy & Glassmorphism

### Blur Intensities

```css
--blur-none: 0;
--blur-sm: 4px;
--blur-DEFAULT: 8px;
--blur-md: 12px;
--blur-lg: 16px;
--blur-xl: 24px;
--blur-2xl: 40px;
--blur-3xl: 64px;
```

### Vibrancy Backgrounds

Translucent backgrounds with blur for frosted glass effects:

| Class | Opacity | Blur | Usage |
|-------|---------|------|-------|
| `.vibrancy-ultra-thin` | 30% | 24px | Subtle overlay |
| `.vibrancy-thin` | 50% | 16px | Light overlay |
| `.vibrancy` | 70% | 12px | Default vibrancy |
| `.vibrancy-thick` | 85% | 8px | Prominent overlay |
| `.vibrancy-chrome` | 90% | 4px | Chrome/toolbar |

### Overlay Backgrounds

For modal/sheet backdrops:

| Class | Opacity | Blur |
|-------|---------|------|
| `.modal-overlay` | 50% | 4px |
| `.modal-overlay-heavy` | 60% | 8px |
| `.sheet-background` | 90% | 24px |

### Backdrop Blur Classes

```html
<div class="backdrop-blur-sm">Subtle blur</div>
<div class="backdrop-blur-md">Medium blur</div>
<div class="backdrop-blur-xl">Strong blur</div>
```

### Pre-built Components

```html
<!-- Modal with vibrancy -->
<div class="modal-overlay-heavy">
  <div class="modal-surface-vibrancy p-6">
    Modal content
  </div>
</div>

<!-- Card with vibrancy -->
<div class="card-vibrancy p-4">
  Card content
</div>

<!-- Navigation with vibrancy -->
<nav class="nav-vibrancy">
  Navigation content
</nav>
```

---

## Border Radius

### System-Native Radii

Inspired by iOS and macOS design language for a native feel:

| Token | Size | CSS Variable | Class |
|-------|------|--------------|-------|
| None | 0 | `--radius-none` | `.rounded-none` |
| Small | 6px | `--radius-sm` | `.rounded-sm` |
| Default | 8px | `--radius-DEFAULT` | `.rounded` |
| Medium | 12px | `--radius-md` | `.rounded-md` |
| Large | 16px | `--radius-lg` | `.rounded-lg` |
| XL | 20px | `--radius-xl` | `.rounded-xl` |
| 2XL | 24px | `--radius-2xl` | `.rounded-2xl` |
| 3XL | 32px | `--radius-3xl` | `.rounded-3xl` |
| Full | 9999px | `--radius-full` | `.rounded-full` |

### System Radii (iOS/macOS Feel)

| Token | Size | CSS Variable | Class |
|-------|------|--------------|-------|
| System | 16px | `--radius-system` | `.rounded-system` |
| System Large | 22px | `--radius-system-lg` | `.rounded-system-lg` |
| System XL | 24px | `--radius-system-xl` | `.rounded-system-xl` |

### Per-Corner Utilities

```html
<!-- Top corners only -->
<div class="rounded-t-system">Top rounded</div>
<div class="rounded-t-system-xl">Top rounded large</div>

<!-- Bottom corners only -->
<div class="rounded-b-system">Bottom rounded</div>
<div class="rounded-b-system-xl">Bottom rounded large</div>
```

### Usage Recommendations

| Element | Recommended Radius |
|---------|-------------------|
| Buttons | `.rounded-system` (16px) |
| Cards | `.rounded-system` (16px) |
| Inputs | `.rounded-md` (12px) |
| Modals | `.rounded-system-xl` (24px) |
| Sheets | `.rounded-t-system-xl` (24px top) |
| Badges | `.rounded-full` (pill) |
| Avatars | `.rounded-full` (circle) |

---

## Touch Targets

### Apple HIG Compliance

All interactive elements should meet the 44pt minimum touch target per Apple Human Interface Guidelines.

### Touch Target Sizes

| Token | Size | CSS Variable | Class |
|-------|------|--------------|-------|
| Minimum | 44px | `--touch-target-min` | `.touch-target-min` |
| Comfortable | 48px | `--touch-target-comfortable` | `.touch-target-comfortable` |
| Spacious | 56px | `--touch-target-spacious` | `.touch-target-spacious` |

### Usage

```html
<!-- Minimum touch target -->
<button class="touch-target-min">Tap me</button>

<!-- Comfortable touch target -->
<button class="touch-target-comfortable">Easy tap</button>

<!-- Inline touch target (for links) -->
<a href="#" class="touch-target-inline">Link</a>

<!-- Expanded tap area (invisible) -->
<button class="touch-target-area">Small visual, large tap</button>
```

### Automatic Touch Targets

On touch devices (`hover: none` and `pointer: coarse`), the following elements automatically get minimum touch targets:

- All `<button>` elements
- Elements with `role="button"`
- Checkboxes and radio buttons
- Select dropdowns
- Navigation links

To exempt an element from automatic sizing:

```html
<button class="touch-target-exempt">Small button</button>
```

---

## Component Presets

### Cards

```html
<!-- Standard card -->
<div class="card p-4">
  Card content
</div>

<!-- Elevated card -->
<div class="card-elevated p-4">
  Elevated content
</div>

<!-- Inset card -->
<div class="card-inset p-4">
  Inset content
</div>

<!-- Card with vibrancy -->
<div class="card-vibrancy p-4">
  Glass card
</div>
```

### Modals

```html
<!-- Standard modal -->
<div class="modal-overlay">
  <div class="modal-surface p-6">
    Modal content
  </div>
</div>

<!-- Vibrancy modal -->
<div class="modal-overlay-heavy">
  <div class="modal-surface-vibrancy p-6">
    Glass modal
  </div>
</div>
```

### Buttons

```html
<!-- Elevated button with depth -->
<button class="btn-elevated bg-primary-600 text-white px-4 py-2 rounded-system">
  Submit
</button>

<!-- Button with branded shadow -->
<button class="bg-primary-600 text-white px-4 py-2 rounded-system shadow-primary hover:shadow-primary-lg">
  CTA Button
</button>
```

### Inputs

```html
<!-- Surface input -->
<input class="input-surface px-3 py-2" placeholder="Enter text" />
```

---

## Theme Hook

### Installation

The theme hook is available at `hooks/useTheme.ts`.

### Basic Usage

```tsx
'use client'

import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme}>
      Current: {resolvedTheme}
    </button>
  )
}
```

### API Reference

```typescript
interface UseThemeReturn {
  /** Current theme setting ('light', 'dark', or 'system') */
  theme: 'light' | 'dark' | 'system'
  
  /** Resolved theme value ('light' or 'dark') - what's actually applied */
  resolvedTheme: 'light' | 'dark'
  
  /** Set theme to a specific value */
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  /** Toggle between light and dark mode */
  toggleTheme: () => void
  
  /** Cycle through all theme options */
  cycleTheme: () => void
  
  /** Whether the current theme follows system preference */
  isSystemTheme: boolean
  
  /** Whether we're running on the client (for SSR safety) */
  isClient: boolean
}
```

### Theme Selector Example

```tsx
'use client'

import { useTheme } from '@/hooks/useTheme'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setTheme('light')}
        className={theme === 'light' ? 'bg-primary-100' : ''}
      >
        <Sun className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={theme === 'dark' ? 'bg-primary-100' : ''}
      >
        <Moon className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={theme === 'system' ? 'bg-primary-100' : ''}
      >
        <Monitor className="w-5 h-5" />
      </button>
    </div>
  )
}
```

---

## Usage Examples

### Complete Modal Example

```tsx
'use client'

import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 modal-overlay-heavy flex items-center justify-center z-50 p-4">
      <div className="modal-surface-vibrancy p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading-3 text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="touch-target-min flex items-center justify-center text-tertiary hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="text-body-md text-secondary">
          {children}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-system border border-primary text-secondary hover:bg-surface-secondary transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-3 rounded-system bg-primary-600 text-white shadow-primary hover:shadow-primary-lg transition-all min-h-[44px]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Card Component Example

```tsx
interface CardProps {
  title: string
  description: string
  elevated?: boolean
  vibrancy?: boolean
}

export function Card({ title, description, elevated, vibrancy }: CardProps) {
  const cardClass = vibrancy 
    ? 'card-vibrancy' 
    : elevated 
      ? 'card-elevated' 
      : 'card'

  return (
    <div className={`${cardClass} p-4`}>
      <h3 className="text-heading-4 text-primary mb-2">{title}</h3>
      <p className="text-body-md text-secondary">{description}</p>
    </div>
  )
}
```

### Button Component Example

```tsx
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function Button({ children, variant = 'primary', size = 'md', onClick }: ButtonProps) {
  const baseClasses = 'rounded-system font-semibold transition-all duration-200 min-h-[44px]'
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white shadow-primary hover:shadow-primary-lg hover:bg-primary-700',
    secondary: 'bg-surface border border-primary text-primary hover:bg-surface-secondary elevation-1 hover:elevation-2',
    ghost: 'text-primary hover:bg-surface-secondary',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-body-sm',
    md: 'px-4 py-3 text-body-md',
    lg: 'px-6 py-4 text-body-lg',
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </button>
  )
}
```

---

## File Structure

```
cosmetics-website/
├── app/
│   ├── globals.css          # Design system CSS
│   └── layout.tsx           # Theme initialization
├── hooks/
│   └── useTheme.ts          # Theme management hook
├── lib/
│   └── typography.ts        # Typography utility functions
└── docs/
    └── DESIGN_SYSTEM.md     # This documentation
```

---

## Browser Support

The design system supports all modern browsers:

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

### Progressive Enhancement

- `backdrop-filter` is used with `-webkit-backdrop-filter` for Safari compatibility
- CSS custom properties (variables) are fully supported
- `prefers-color-scheme` media query is supported in all modern browsers

---

## Accessibility

### Color Contrast

All text colors meet WCAG 2.1 AA contrast requirements:
- Primary text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum

### Touch Targets

All interactive elements meet the 44pt minimum touch target requirement per Apple HIG.

### Reduced Motion

The design system respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0ms !important;
    transition-duration: 0ms !important;
  }
}
```

### High Contrast

Additional font weight is applied when `prefers-contrast: more`:

```css
@media (prefers-contrast: more) {
  body {
    font-weight: var(--font-weight-medium);
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: var(--font-weight-extrabold);
  }
}
```

---

## Migration Guide

### From Tailwind Default Classes

| Before | After |
|--------|-------|
| `text-gray-900` | `text-primary` |
| `text-gray-600` | `text-secondary` |
| `text-gray-400` | `text-tertiary` |
| `bg-white` | `bg-primary` or `bg-surface` |
| `bg-gray-50` | `bg-secondary` |
| `border-gray-200` | `border-primary` |
| `rounded-lg` | `rounded-system` |
| `shadow-lg` | `elevation-3` |

### Adding Dark Mode to Components

1. Replace hardcoded colors with semantic tokens
2. Use CSS variables instead of Tailwind color classes
3. Test in both light and dark modes

---

## Changelog

### v1.0.0 (January 2026)

- Initial design system release
- Typography system with SF Pro / Inter font stack
- Dark mode with automatic system preference detection
- Shadow depth hierarchy (6 levels)
- Vibrancy/glassmorphism effects
- System-native border radii (16-24px)
- Touch target utilities (44pt minimum)
- Theme management hook with persistence
- Component presets (cards, modals, buttons, inputs)
