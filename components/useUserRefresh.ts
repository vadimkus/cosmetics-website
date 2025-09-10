'use client'

import { useEffect } from 'react'
import { useAuth } from './AuthProvider'

export function useUserRefresh() {
  const { user, refreshUser } = useAuth()

  useEffect(() => {
    if (!user) return

    console.log('🔄 Setting up user refresh interval for:', user.email)
    
    // Refresh user data every 30 seconds to get latest permissions
    const interval = setInterval(() => {
      console.log('⏰ Interval triggered - refreshing user data')
      refreshUser()
    }, 10000) // 10 seconds for testing

    return () => {
      console.log('🧹 Clearing user refresh interval')
      clearInterval(interval)
    }
  }, [user, refreshUser])
}
