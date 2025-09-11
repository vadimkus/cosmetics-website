'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Only track on client side
    if (typeof window === 'undefined' || !pathname) return

    // Track page view when pathname changes
    const trackPageView = async (page: string) => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'pageview',
            page,
            userAgent: navigator.userAgent,
            referrer: document.referrer
          })
        })
        console.log('✅ Page view tracked:', page)
      } catch (error) {
        console.error('Error tracking page view:', error)
      }
    }

    trackPageView(pathname)
  }, [pathname])

  return null // This component doesn't render anything
}
