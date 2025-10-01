'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const AnalyticsDashboard = dynamic(() => import('./AnalyticsDashboard'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading analytics dashboard...</p>
      </div>
    </div>
  ),
  ssr: false
})

interface AnalyticsDashboardWrapperProps {
  onCustomerClick?: (customerId: string) => void
}

export default function AnalyticsDashboardWrapper({ onCustomerClick }: AnalyticsDashboardWrapperProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    }>
      <AnalyticsDashboard onCustomerClick={onCustomerClick || (() => {})} />
    </Suspense>
  )
}
