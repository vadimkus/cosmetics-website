import { Suspense } from 'react'
import StripeSuccessClient from './StripeSuccessClient'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Successful - GENOSYS Professional Korean Dermacosmetics | Genosys Middle East FZ-LLC',
  description: 'Your GENOSYS order has been successfully processed. Thank you for your purchase of professional Korean dermacosmetics.',
  keywords: 'GENOSYS payment success, order confirmation, Korean dermacosmetics purchase, successful payment',
  robots: {
    index: false, // Don't index success pages
    follow: true,
  },
}

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Checkout', url: '/checkout' },
          { name: 'Success', url: '/checkout/success' }
        ]}
      />
      
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      }>
        <StripeSuccessClient />
      </Suspense>
    </div>
  )
}