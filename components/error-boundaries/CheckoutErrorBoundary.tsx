'use client'

import { ReactNode } from 'react'
import { CreditCard, ShieldAlert } from 'lucide-react'
import { BaseErrorBoundary, ErrorBoundaryConfig } from './BaseErrorBoundary'

interface CheckoutErrorBoundaryProps {
  children: ReactNode
  /** Custom error handler */
  onError?: ErrorBoundaryConfig['onError']
}

/**
 * CheckoutErrorBoundary
 * 
 * Error boundary specifically for the checkout process.
 * Provides reassuring messaging about payment security and order safety.
 */
export function CheckoutErrorBoundary({ children, onError }: CheckoutErrorBoundaryProps) {
  const config: ErrorBoundaryConfig = {
    featureName: 'Checkout',
    title: 'Checkout temporarily unavailable',
    description: "Don't worry - no payment was processed. Your cart items are saved. Please try again or contact support if the issue persists.",
    icon: (
      <div className="relative">
        <CreditCard className="h-16 w-16 text-gray-400 mx-auto" />
        <ShieldAlert className="absolute -bottom-1 -right-1 h-8 w-8 text-amber-500" />
      </div>
    ),
    primaryAction: {
      label: 'Return to Cart',
      href: '/cart',
    },
    secondaryAction: {
      label: 'Contact Support',
      href: 'https://wa.me/971585487665',
    },
    bgColor: 'bg-amber-50',
    accentColor: 'text-amber-600',
    showHomeLink: true,
    showRetry: true,
    onError,
  }

  return (
    <BaseErrorBoundary config={config}>
      {children}
    </BaseErrorBoundary>
  )
}

export default CheckoutErrorBoundary
