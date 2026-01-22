'use client'

import { ReactNode } from 'react'
import { ClipboardList, WifiOff } from 'lucide-react'
import { BaseErrorBoundary, ErrorBoundaryConfig } from './BaseErrorBoundary'

interface OrdersErrorBoundaryProps {
  children: ReactNode
  /** Custom error handler */
  onError?: ErrorBoundaryConfig['onError']
}

/**
 * OrdersErrorBoundary
 * 
 * Error boundary for order history and order tracking pages.
 * Provides order-specific error messaging and support options.
 */
export function OrdersErrorBoundary({ children, onError }: OrdersErrorBoundaryProps) {
  const config: ErrorBoundaryConfig = {
    featureName: 'Orders',
    title: 'Unable to load orders',
    description: "We couldn't retrieve your order history. Your orders are safe - please try again or contact support.",
    icon: (
      <div className="relative">
        <ClipboardList className="h-16 w-16 text-gray-400 mx-auto" />
        <WifiOff className="absolute -bottom-1 -right-1 h-8 w-8 text-orange-400" />
      </div>
    ),
    primaryAction: {
      label: 'Contact Support',
      href: 'https://wa.me/971585487665',
    },
    secondaryAction: {
      label: 'Go to Profile',
      href: '/profile',
    },
    bgColor: 'bg-orange-50',
    accentColor: 'text-orange-500',
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

export default OrdersErrorBoundary
