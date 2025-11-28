'use client'
import { useEffect } from 'react'
import { useAuth } from './AuthProvider'

export function useUserRefresh() {
  const { user, refreshUser } = useAuth()

  useEffect(() => {
    // Only run on client side and when user exists
    if (typeof window === 'undefined' || !user) return
    
    // Refresh user data every 5 minutes to get latest permissions
    // Reduced frequency to avoid excessive API calls
    const interval = setInterval(() => {
      refreshUser()
    }, 300000) // 5 minutes (300000 ms)

    return () => {
      clearInterval(interval)
    }
  }, [user, refreshUser])
}
