'use client'

import { ReactNode } from 'react'
import { CreditCard } from 'lucide-react'
import { BaseErrorBoundary, ErrorBoundaryConfig } from './BaseErrorBoundary'

interface PaymentErrorBoundaryProps {
  children: ReactNode
  /** Custom error handler */
  onError?: ErrorBoundaryConfig['onError']
}

/**
 * PaymentErrorBoundary
 * 
 * Error boundary for payment-related pages (success, confirmation, etc.).
 * Provides payment-specific error messaging and recovery options.
 */
export function PaymentErrorBoundary({ children, onError }: PaymentErrorBoundaryProps) {
  const config: ErrorBoundaryConfig = {
    featureName: 'Payment',
    title: 'Unable to load payment details',
    description: "We couldn't load the payment information. Your payment may have been processed successfully - please check your email for confirmation or contact support.",
    icon: (
      <div className="relative">
        <CreditCard className="h-16 w-16 text-gray-400 mx-auto" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
      </div>
    ),
    primaryAction: {
      label: 'View Order History',
      href: '/profile/orders',
    },
    secondaryAction: {
      label: 'Go to Homepage',
      href: '/',
    },
    bgColor: 'bg-gray-50',
    accentColor: 'text-green-500',
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

export default PaymentErrorBoundary
