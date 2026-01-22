'use client'

import { ReactNode } from 'react'
import { Package, SearchX } from 'lucide-react'
import { BaseErrorBoundary, ErrorBoundaryConfig } from './BaseErrorBoundary'

interface ProductsErrorBoundaryProps {
  children: ReactNode
  /** Custom error handler */
  onError?: ErrorBoundaryConfig['onError']
}

/**
 * ProductsErrorBoundary
 * 
 * Error boundary for product listing and product detail pages.
 * Provides product-specific error messaging and navigation options.
 */
export function ProductsErrorBoundary({ children, onError }: ProductsErrorBoundaryProps) {
  const config: ErrorBoundaryConfig = {
    featureName: 'Products',
    title: 'Unable to load products',
    description: "We're having trouble loading the products. Please try again or browse our categories.",
    icon: (
      <div className="relative">
        <Package className="h-16 w-16 text-gray-400 mx-auto" />
        <SearchX className="absolute -bottom-1 -right-1 h-8 w-8 text-red-400" />
      </div>
    ),
    primaryAction: {
      label: 'Browse All Products',
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

export default ProductsErrorBoundary
