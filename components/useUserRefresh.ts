'use client'

import { useEffect } from 'react'
import { useAuth } from './AuthProvider'

export function useUserRefresh() {
  const { user, refreshUser } = useAuth()

  useEffect(() => {
    if (!user) return

    console.log('🔄 Setting up user refresh interval for:', user.email)
    
    // Refresh user data every 60 seconds to get latest permissions
    const interval = setInterval(() => {
      console.log('⏰ Interval triggered - refreshing user data')
      refreshUser()
    }, 60000) // 60 seconds

    return () => {
      console.log('🧹 Clearing user refresh interval')
      clearInterval(interval)
    }
  }, [user, refreshUser])
}
