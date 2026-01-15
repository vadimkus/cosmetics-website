/**
 * View Transitions API utilities for smooth page navigation
 * 
 * Next.js 16+ supports View Transitions API natively when enabled
 * in next.config.js with experimental.viewTransition = true
 * 
 * This file provides utilities for custom transition effects
 */

// Check if View Transitions API is supported
export function supportsViewTransitions(): boolean {
  if (typeof document === 'undefined') return false
  return 'startViewTransition' in document
}

// CSS for view transitions - add to globals.css
export const viewTransitionStyles = `
/* View Transitions - Smooth page navigation */
@supports (view-transition-name: none) {
  /* Default fade transition */
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0.25s;
    animation-timing-function: ease-in-out;
  }

  /* Slide transition for mobile navigation */
  @media (max-width: 767px) {
    ::view-transition-old(root) {
      animation: slide-out-left 0.25s ease-in-out;
    }
    
    ::view-transition-new(root) {
      animation: slide-in-right 0.25s ease-in-out;
    }
  }

  /* Product card transitions */
  .product-card {
    view-transition-name: product-card;
  }

  /* Header stays fixed during transition */
  .main-header {
    view-transition-name: main-header;
  }

  ::view-transition-old(main-header),
  ::view-transition-new(main-header) {
    animation: none;
    mix-blend-mode: normal;
  }

  /* Footer stays fixed during transition */
  .mobile-footer-nav {
    view-transition-name: mobile-footer;
  }

  ::view-transition-old(mobile-footer),
  ::view-transition-new(mobile-footer) {
    animation: none;
    mix-blend-mode: normal;
  }
}

/* Slide animations */
@keyframes slide-out-left {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-30%);
    opacity: 0;
  }
}

@keyframes slide-in-right {
  from {
    transform: translateX(30%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }
}
`

// View Transitions API types are now built into TypeScript
// No need for custom declarations

/**
 * Start a view transition if supported
 * Falls back to immediate execution if not supported
 */
export async function startViewTransition(callback: () => void | Promise<void>): Promise<void> {
  if (supportsViewTransitions() && 'startViewTransition' in document) {
    const transition = (document as Document & { startViewTransition: (cb: () => void | Promise<void>) => { finished: Promise<void> } }).startViewTransition(callback)
    await transition.finished
  } else {
    await callback()
  }
}

/**
 * Navigate with view transition
 * Use this for programmatic navigation with smooth transitions
 */
export function navigateWithTransition(
  router: { push: (url: string) => void },
  url: string
): void {
  if (supportsViewTransitions() && 'startViewTransition' in document) {
    (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
      router.push(url)
    })
  } else {
    router.push(url)
  }
}
