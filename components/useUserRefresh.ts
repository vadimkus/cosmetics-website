'use client'
import { debugLog } from '@/lib/logger'

import { useEffect } from 'react'
import { useAuth } from './AuthProvider'

export function useUserRefresh() {
  const { user, refreshUser } = useAuth()

  useEffect(() => {
    // Only run on client side and when user exists
    if (typeof window === 'undefined' || !user) return

    debugLog('🔄 Setting up user refresh interval for:', user.email)
    
    // Refresh user data every 60 seconds to get latest permissions
    const interval = setInterval(() => {
      debugLog('⏰ Interval triggered - refreshing user data')
      refreshUser()
    }, 60000) // 60 seconds

    return () => {
      debugLog('🧹 Clearing user refresh interval')
      clearInterval(interval)
    }
  }, [user, refreshUser])
}
