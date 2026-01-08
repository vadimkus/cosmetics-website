'use client'

import { useState, useEffect } from 'react'

/**
 * NetworkStatus Component
 * 
 * Displays a subtle, non-intrusive indicator when the user goes offline.
 * The indicator automatically hides when the connection is restored.
 * 
 * Features:
 * - Shows only when offline
 * - Smooth fade-in/fade-out animations
 * - Non-blocking UI (fixed position at bottom)
 * - Accessible with proper ARIA attributes
 */
export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)
    
    // If initially offline, show indicator immediately
    if (!navigator.onLine) {
      setShowIndicator(true)
    }

    const handleOnline = () => {
      setIsOnline(true)
      // Delay hiding to allow user to see "Back online" message
      setTimeout(() => {
        setShowIndicator(false)
      }, 2000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowIndicator(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Don't render anything if online and indicator is hidden
  if (isOnline && !showIndicator) {
    return null
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`
        fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-auto
        z-50 transition-all duration-300 ease-in-out
        ${showIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
          ${isOnline 
            ? 'bg-green-600 text-white' 
            : 'bg-amber-500 text-white'
          }
        `}
      >
        {/* Icon */}
        {isOnline ? (
          // Online icon (WiFi)
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 13a10 10 0 0 1 14 0" />
            <path d="M8.5 16.5a5 5 0 0 1 7 0" />
            <path d="M2 8.82a15 15 0 0 1 20 0" />
            <line x1="12" x2="12.01" y1="20" y2="20" />
          </svg>
        ) : (
          // Offline icon (WiFi Off)
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h.01" />
            <path d="M8.5 16.429a5 5 0 0 1 7 0" />
            <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
            <path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
            <path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
            <path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
            <path d="m2 2 20 20" />
          </svg>
        )}
        
        {/* Message */}
        <span className="text-sm font-medium">
          {isOnline 
            ? '✓ Back online' 
            : 'You\'re offline — browsing cached content'
          }
        </span>
      </div>
    </div>
  )
}
