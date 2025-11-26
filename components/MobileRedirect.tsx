'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface MobileRedirectProps {
  to: string
  children: React.ReactNode
}

export default function MobileRedirect({ to, children }: MobileRedirectProps) {
  const router = useRouter()

  useEffect(() => {
    // Check if mobile (screen width < 768px)
    const isMobile = window.innerWidth < 768
    
    if (isMobile) {
      router.replace(to)
    }
  }, [router, to])

  // Show children (will flash briefly on mobile before redirect)
  return <>{children}</>
}

