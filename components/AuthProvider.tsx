'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
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
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
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
          console.error('Error parsing saved user:', error)
          localStorage.removeItem('genosys_user')
        }
      }
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
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

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
            console.error('Error parsing existing user data:', error)
          }
        }
      }

      setUser(mergedUser)
      return true
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please check your connection and try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Registration failed. Please try again.')
        return false
      }

      setUser(data.user)
      return true
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please check your connection and try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }


  const refreshUser = useCallback(async (): Promise<void> => {
    if (!user) return
    
    try {
      console.log('🔄 Refreshing user data for:', user.email)
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
          // Server data takes precedence for critical fields like canSeePrices
          // Only preserve non-critical client-side data
          const mergedUser = { 
            ...user, 
            ...data.user,
            // Ensure server data overrides these critical fields
            canSeePrices: data.user.canSeePrices,
            isAdmin: data.user.isAdmin
          }
          console.log('✅ User data refreshed:', { 
            email: mergedUser.email, 
            canSeePrices: mergedUser.canSeePrices,
            isAdmin: mergedUser.isAdmin 
          })
          setUser(mergedUser)
        }
      } else {
        console.log('❌ Refresh failed with status:', response.status)
        // Don't throw error, just log it to avoid breaking the app
      }
    } catch (error) {
      console.error('❌ Error refreshing user data:', error)
      // Don't throw error, just log it to avoid breaking the app
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
    isLoading
  }

  // Prevent hydration mismatch by not rendering children until client-side
  if (!isClient) {
    return (
      <AuthContext.Provider value={{
        user: null,
        login: async () => false,
        register: async () => false,
        logout: () => {},
        refreshUser: async () => {},
        isLoading: true
      }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
