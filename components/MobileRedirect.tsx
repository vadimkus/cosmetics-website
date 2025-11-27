'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface MobileRedirectProps {
  to: string
  children: React.ReactNode
}

function MobileRedirectContent({ to, children }: MobileRedirectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if mobile (screen width < 768px)
    const isMobile = window.innerWidth < 768
    
    // Skip redirect if ?full=true is present (from hamburger menu Home link)
    const showFull = searchParams.get('full') === 'true'
    
    if (isMobile && !showFull) {
      router.replace(to)
    }
  }, [router, to, searchParams])

  return <>{children}</>
}

export default function MobileRedirect({ to, children }: MobileRedirectProps) {
  return (
    <Suspense fallback={<>{children}</>}>
      <MobileRedirectContent to={to}>{children}</MobileRedirectContent>
    </Suspense>
  )
}

