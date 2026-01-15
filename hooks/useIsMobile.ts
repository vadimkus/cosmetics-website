'use client'

import { useState, useEffect } from 'react'

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }
    
    // Initial check
    checkMobile()
    
    // Listen for resize
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return { isMobile, isClient }
}
