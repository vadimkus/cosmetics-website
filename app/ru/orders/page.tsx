// Russian Orders Page - Reuses the main orders page component
import type { Metadata } from 'next'

/**
 * The English route is kept out of the index by app/orders/layout.tsx, but that layout
 * does not wrap this file - /ru/orders sits outside the app/orders/ subtree, so without
 * its own metadata it inherited the root layout's `index: true` and a customer's order
 * history was crawlable. Same for /ar/orders.
 */
export const metadata: Metadata = {
  title: 'Мои заказы - GENOSYS',
  description: 'Просматривайте и отслеживайте заказы GENOSYS, управляйте историей и повторяйте покупки.',
  robots: { index: false, follow: false },
}

export { default } from '@/app/orders/page'
