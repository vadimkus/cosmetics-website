'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'

export default function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Only track on client side
    if (typeof window === 'undefined' || !pathname) return

    // Track page view when pathname changes
    const trackPageViewData = async (page: string) => {
      try {
        // Track in Google Analytics
        trackPageView(page)
        
        // Track in database
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'pageview',
            page,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height
          })
        })
        console.log('✅ Page view tracked in both Google Analytics and database:', page)
      } catch (error) {
        console.error('Error tracking page view:', error)
      }
    }

    trackPageViewData(pathname)
  }, [pathname])

  return null // This component doesn't render anything
}
