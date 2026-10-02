'use client'

import { useEffect } from 'react'
import { trackProductView } from '@/lib/analytics'

/** GA4 view_item + Meta ViewContent, once per product page view. */
export default function ProductViewTracker({ id, name, category, price }: {
  id: string
  name: string
  category: string
  price: number
}) {
  useEffect(() => {
    try {
      trackProductView({ id, name, category, price })
    } catch { /* analytics is best-effort */ }
  }, [id, name, category, price])

  return null
}
