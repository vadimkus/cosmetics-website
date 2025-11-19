'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { debugLog, errorLog } from '@/lib/logger'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  birthday?: string
  profilePicture?: string
  createdAt: string
  isAdmin?: boolean
  canSeePrices?: boolean
  discountType?: string | null
  discountPercentage?: number | null
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, phone: string, address: string, emirate: string, birthday?: string) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
  forceRefreshUser: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side before accessing localStorage
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('genosys_user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          errorLog('Error parsing saved user:', error)
          localStorage.removeItem('genosys_user')
        }
      }
      
      // Fetch CSRF token on mount
      fetchCsrfToken().catch(err => {
        errorLog('Failed to fetch CSRF token:', err)
      })
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage whenever user changes (only on client)
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('genosys_user', JSON.stringify(user))
      } else {
        localStorage.removeItem('genosys_user')
      }
    }
  }, [user, isClient])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert('Security error: Could not verify request. Please refresh the page and try again.')
        setIsLoading(false)
        return false
      }

      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      let response
      try {
        response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: getCsrfHeaders(),
          body: JSON.stringify(addCsrfToBody({ email, password })),
          signal: controller.signal
        })
      } catch (error) {
        clearTimeout(timeoutId)
        if (error instanceof Error && error.name === 'AbortError') {
          alert('Login request timed out. Please check your connection and try again.')
        } else {
          throw error
        }
        return false
      }
      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Login failed. Please try again.')
        return false
      }

      // Merge API user data with any existing localStorage data (like profile picture)
      let mergedUser = data.user
      
      if (isClient && typeof window !== 'undefined') {
        const existingUser = localStorage.getItem('genosys_user')
        if (existingUser) {
          try {
            const parsedExistingUser = JSON.parse(existingUser)
            // Only merge if it's the same user (same email)
            if (parsedExistingUser.email === data.user.email) {
              mergedUser = { ...data.user, ...parsedExistingUser }
            }
          } catch (error) {
            errorLog('Error parsing existing user data:', error)
          }
        }
      }

      setUser(mergedUser)
      return true
    } catch (error) {
      errorLog('Login error:', error)
      alert('Login failed. Please check your connection and try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, phone: string, address: string, emirate: string, birthday?: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert('Security error: Could not verify request. Please refresh the page and try again.')
        return false
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: getCsrfHeaders(),
        body: JSON.stringify(addCsrfToBody({ name, email, password, phone, address, emirate, birthday: birthday || '' })),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Registration failed. Please try again.')
        return false
      }

      setUser(data.user)
      return true
    } catch (error) {
      errorLog('Registration error:', error)
      alert('Registration failed. Please check your connection and try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }


  const refreshUser = useCallback(async (): Promise<void> => {
    if (!user) return
    
    try {
      debugLog('🔄 Refreshing user data for:', user.email)
      // Fetch the latest user data from the server
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          // Server data takes precedence for all fields
          // Only preserve client-side data that shouldn't be overridden
          const mergedUser = { 
            ...user, 
            ...data.user,
            // Ensure server data overrides these critical fields
            canSeePrices: data.user.canSeePrices,
            isAdmin: data.user.isAdmin,
            // Ensure all server fields are included (like birthday)
            birthday: data.user.birthday,
            name: data.user.name,
            phone: data.user.phone,
            address: data.user.address
          }
          debugLog('✅ User data refreshed:', { 
            email: mergedUser.email, 
            canSeePrices: mergedUser.canSeePrices,
            isAdmin: mergedUser.isAdmin,
            birthday: mergedUser.birthday
          })
          setUser(mergedUser)
        }
      } else {
        debugLog('❌ Refresh failed with status:', response.status)
        // Don't throw error, just log it to avoid breaking the app
      }
    } catch (error) {
      errorLog('❌ Error refreshing user data:', error)
      // Don't throw error, just log it to avoid breaking the app
    }
  }, [user])

  const forceRefreshUser = useCallback(async (): Promise<void> => {
    if (!user) return
    
    try {
      debugLog('🔄 Force refreshing user data for:', user.email)
      // Fetch the latest user data from the server
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          // Use server data directly without merging with existing data
          debugLog('✅ User data force refreshed:', { 
            email: data.user.email, 
            canSeePrices: data.user.canSeePrices,
            isAdmin: data.user.isAdmin,
            birthday: data.user.birthday
          })
          setUser(data.user)
        }
      } else {
        debugLog('❌ Force refresh failed with status:', response.status)
      }
    } catch (error) {
      errorLog('❌ Error force refreshing user data:', error)
    }
  }, [user])

  const logout = () => {
    setUser(null)
    // Redirect to login page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    refreshUser,
    forceRefreshUser,
    isLoading
  }

  // Always return the same structure to prevent hooks order issues
  return (
    <AuthContext.Provider value={!isClient ? {
      user: null,
      login: async () => false,
      register: async (_name: string, _email: string, _password: string, _phone: string, _address: string, _emirate: string, _birthday?: string) => false,
      logout: () => {},
      refreshUser: async () => {},
      forceRefreshUser: async () => {},
      isLoading: true
    } : value}>
      {children}
    </AuthContext.Provider>
  )
}
