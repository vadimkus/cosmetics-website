import { OrdersErrorBoundary } from '@/components/error-boundaries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Orders - GENOSYS Professional Korean Dermacosmetics',
  description: 'View and track your GENOSYS orders. Manage order history, track shipments, and reorder your favorite professional skincare products.',
  // Private account area — keep out of the index (matches AR/RU locales)
  robots: { index: false, follow: false },
}

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OrdersErrorBoundary>
      {children}
    </OrdersErrorBoundary>
  )
}
