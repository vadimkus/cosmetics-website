'use client'

import { ReactNode } from 'react'
import { ShoppingCart } from 'lucide-react'
import { BaseErrorBoundary, ErrorBoundaryConfig } from './BaseErrorBoundary'

interface CartErrorBoundaryProps {
  children: ReactNode
  /** Custom error handler */
  onError?: ErrorBoundaryConfig['onError']
}

/**
 * CartErrorBoundary
 * 
 * Error boundary specifically for the shopping cart feature.
 * Provides cart-specific error messaging and recovery options.
 */
export function CartErrorBoundary({ children, onError }: CartErrorBoundaryProps) {
  const config: ErrorBoundaryConfig = {
    featureName: 'Cart',
    title: 'Unable to load your cart',
    description: "We couldn't load your shopping cart. Your items are safe - please try again or continue shopping.",
    icon: (
      <div className="relative">
        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
      </div>
    ),
    primaryAction: {
      label: 'Continue Shopping',
      href: '/products',
    },
    secondaryAction: {
      label: 'Go to Homepage',
      href: '/',
    },
    bgColor: 'bg-gray-50',
    accentColor: 'text-primary-500',
    showHomeLink: false,
    showRetry: true,
    onError,
  }

  return (
    <BaseErrorBoundary config={config}>
      {children}
    </BaseErrorBoundary>
  )
}

export default CartErrorBoundary
