'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function PageViewTracker() {
  const pathname = usePathname()
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    // Track page view when pathname changes
    if (pathname && typeof window !== 'undefined') {
      try {
        trackPageView(pathname)
      } catch (error) {
        console.error('Error tracking page view:', error)
      }
    }
  }, [pathname, trackPageView])

  return null // This component doesn't render anything
}
