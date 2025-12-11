'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to prevent hydration mismatches by ensuring client-side only rendering
 * Returns true only after the component has mounted on the client
 */
export const useClientOnly = (): boolean => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}