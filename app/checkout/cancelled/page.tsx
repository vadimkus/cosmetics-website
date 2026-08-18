import CheckoutCancelledClient from './CheckoutCancelledClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout Cancelled - GENOSYS Professional Korean Dermacosmetics',
  description: 'Your GENOSYS checkout was cancelled. You can return to complete your purchase of professional Korean dermacosmetics.',
  robots: {
    index: false, // Don't index cancel pages
    follow: true,
  },
}

export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-screen">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Checkout', url: '/checkout' },
          { name: 'Cancelled', url: '/checkout/cancelled' }
        ]}
      />
      
      <CheckoutCancelledClient />
    </div>
  )
}