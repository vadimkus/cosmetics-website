/**
 * Error Boundaries
 * 
 * Granular error boundaries for different features.
 * Each boundary provides feature-specific error UI and recovery options.
 * 
 * Usage:
 * ```tsx
 * import { CartErrorBoundary } from '@/components/error-boundaries'
 * 
 * <CartErrorBoundary>
 *   <Cart />
 * </CartErrorBoundary>
 * ```
 */

export { BaseErrorBoundary } from './BaseErrorBoundary'
export type { ErrorBoundaryConfig, BaseErrorBoundaryProps } from './BaseErrorBoundary'

export { CartErrorBoundary } from './CartErrorBoundary'
export { CheckoutErrorBoundary } from './CheckoutErrorBoundary'
export { ProductsErrorBoundary } from './ProductsErrorBoundary'
export { ProfileErrorBoundary } from './ProfileErrorBoundary'
export { OrdersErrorBoundary } from './OrdersErrorBoundary'
export { BlogErrorBoundary } from './BlogErrorBoundary'
