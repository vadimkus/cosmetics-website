'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog, debugLog } from '@/lib/logger'
import { useToast } from '@/components/ToastProvider'
import { useTranslation } from '@/hooks/useTranslation'

// Type extension for iOS Safari PWA detection
// Safari adds a non-standard 'standalone' property to navigator
interface NavigatorStandalone extends Navigator {
  standalone?: boolean
}

interface User {
  id: string
  email: string
  contactEmail?: string
  appleSub?: string | null  // Apple Sign-In user identifier
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
  loginWithGoogle: () => Promise<void>
  loginWithApple: () => Promise<void>
  register: (name: string, email: string, password: string, phone: string, address: string, emirate: string, birthday?: string, promoCode?: string) => Promise<boolean>
  logout: (redirectUrl?: string) => Promise<void>
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
  const { showToast } = useToast()
  const { t } = useTranslation()
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side before accessing localStorage
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      // First, try to get user from session cookie (for Google OAuth or server-set sessions)
      // This ensures profilePicture from Google is included
      fetch('/api/auth/session')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            // Session user includes profilePicture from database
            setUser(data.user)
            setIsLoading(false)
            return
          }
          
          // Fallback to localStorage
          const savedUser = localStorage.getItem('genosys_user')
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser)
              // If we have a session cookie but no user from session API, 
              // try refreshing once more (might be a timing issue after Google login)
              const sessionCookie = document.cookie.split(';').find(c => c.trim().startsWith('genosys_session='))
              if (sessionCookie && !data.user) {
                // Session cookie exists but no user returned - try again after a short delay
                setTimeout(() => {
                  fetch('/api/auth/session')
                    .then(res => res.json())
                    .then(refreshData => {
                      if (refreshData.user) {
                        setUser(refreshData.user)
                      } else {
                        setUser(parsedUser)
                      }
                    })
                    .catch(() => setUser(parsedUser))
                }, 500)
              } else {
                setUser(parsedUser)
              }
            } catch (error) {
              errorLog('Error parsing saved user:', error)
              localStorage.removeItem('genosys_user')
            }
          }
          setIsLoading(false)
        })
        .catch(() => {
          // Fallback to localStorage if session check fails
          const savedUser = localStorage.getItem('genosys_user')
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser))
            } catch (error) {
              errorLog('Error parsing saved user:', error)
              localStorage.removeItem('genosys_user')
            }
          }
          setIsLoading(false)
        })
      
      // Fetch CSRF token on mount
      fetchCsrfToken().catch(err => {
        errorLog('Failed to fetch CSRF token:', err)
      })
    } else {
      setIsLoading(false)
    }
  }, [])

  // Save user to localStorage whenever user changes (only on client)
  // Only store essential user data to avoid quota exceeded errors
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      try {
        if (user) {
          // Only store essential fields to minimize localStorage usage
          const essentialUserData = {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            isAdmin: user.isAdmin,
            canSeePrices: user.canSeePrices,
            discountType: user.discountType,
            discountPercentage: user.discountPercentage,
            birthday: user.birthday
            // Exclude: address, profilePicture, createdAt (not needed for session)
          }
          localStorage.setItem('genosys_user', JSON.stringify(essentialUserData))
        } else {
          localStorage.removeItem('genosys_user')
        }
      } catch (error) {
        // Handle quota exceeded or other storage errors
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          errorLog('localStorage quota exceeded, clearing old data...')
          try {
            // Clear old/unnecessary data first (keep user and cart)
            try {
              // Clear old offline actions (keep only last 20)
              const actionsKey = 'genosys_offline_actions'
              const actions = localStorage.getItem(actionsKey)
              if (actions) {
                try {
                  const parsedActions = JSON.parse(actions)
                  if (Array.isArray(parsedActions) && parsedActions.length > 20) {
                    const recentActions = parsedActions.slice(-20)
                    localStorage.setItem(actionsKey, JSON.stringify(recentActions))
                  }
                } catch (error) {
                  localStorage.removeItem(actionsKey)
                }
              }
            } catch (error) {
              // Ignore errors when cleaning up
            }

            // Try storing user data again
            if (user) {
              const essentialUserData = {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                isAdmin: user.isAdmin,
                canSeePrices: user.canSeePrices,
                discountType: user.discountType,
                discountPercentage: user.discountPercentage,
                birthday: user.birthday
              }
              localStorage.setItem('genosys_user', JSON.stringify(essentialUserData))
            }
          } catch (retryError) {
            errorLog('Failed to store user data in localStorage after cleanup:', retryError)
            // If still failing, clear everything except critical data
            try {
              localStorage.clear()
              if (user) {
                const minimalUserData = {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  isAdmin: user.isAdmin,
                  canSeePrices: user.canSeePrices
                }
                localStorage.setItem('genosys_user', JSON.stringify(minimalUserData))
              }
            } catch (finalError) {
              errorLog('Failed to store minimal user data:', finalError)
              // User can still use the app, just won't persist session on refresh
            }
          }
        } else {
          errorLog('Error storing user data in localStorage:', error)
        }
      }
    }
  }, [user, isClient])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        showToast(t('auth.securityErrorCsrf'), 'error')
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
          showToast(t('auth.loginTimeout'), 'error')
        } else {
          throw error
        }
        return false
      }
      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        showToast(data.error || t('auth.loginFailed'), 'error')
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
      showToast(t('auth.loginFailedConnection'), 'error')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, phone: string, address: string, emirate: string, birthday?: string, promoCode?: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        showToast('Security error: Could not verify request. Please refresh the page and try again.', 'error')
        return false
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: getCsrfHeaders(),
        body: JSON.stringify(addCsrfToBody({ name, email, password, phone, address, emirate, birthday: birthday || '', promoCode: promoCode || '' })),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast(data.error || t('auth.registerFailed'), 'error')
        return false
      }

      setUser(data.user)
      return true
    } catch (error) {
      errorLog('Registration error:', error)
      showToast('Registration failed. Please check your connection and try again.', 'error')
      return false
    } finally {
      setIsLoading(false)
    }
  }


  const refreshUser = useCallback(async (): Promise<void> => {
    if (!user) return
    
    try {
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
          setUser(mergedUser)
        }
      } else if (response.status === 404) {
        // User not found - might have been deleted, but don't log as error
        // This can happen during development or if user was removed
        return
      }
      // For other errors, silently fail to avoid breaking the app
    } catch (error) {
      // Only log actual network errors, not 404s
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error - don't log in production to reduce noise
        if (process.env.NODE_ENV === 'development') {
          errorLog('❌ Network error refreshing user data:', error)
        }
      }
      // Don't throw error, just log it to avoid breaking the app
    }
  }, [user])

  const forceRefreshUser = useCallback(async (): Promise<void> => {
    try {
      // First try to get user from session cookie (works for Google OAuth and regular login)
      const sessionResponse = await fetch('/api/auth/session')
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json()
        if (sessionData.user) {
          // Debug: Log profile picture (always log for troubleshooting)
          debugLog('🔍 AuthProvider - User from session API:', {
            email: sessionData.user.email,
            profilePicture: sessionData.user.profilePicture,
            hasProfilePicture: !!sessionData.user.profilePicture,
            profilePictureLength: sessionData.user.profilePicture?.length || 0
          })
          // Use session data directly - includes profilePicture from database
          setUser(sessionData.user)
          return
        }
      }
      
      // Fallback to refresh endpoint if user email is available
      if (user?.email) {
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
            // Debug: Log profile picture in development
            if (process.env.NODE_ENV === 'development') {
              debugLog('AuthProvider - Refreshed user from refresh endpoint:', {
                email: data.user.email,
                profilePicture: data.user.profilePicture,
                hasProfilePicture: !!data.user.profilePicture
              })
            }
            // Use server data directly without merging with existing data
            setUser(data.user)
          }
        } else if (response.status === 404) {
          // User not found - might have been deleted
          return
        }
      }
      // For other errors, silently fail
    } catch (error) {
      // Only log actual network errors in development
      if (process.env.NODE_ENV === 'development' && error instanceof TypeError && error.message.includes('fetch')) {
        errorLog('❌ Error force refreshing user data:', error)
      }
    }
  }, [user])

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true)
      // Redirect to Google OAuth endpoint
      if (typeof window !== 'undefined') {
        const sp = new URLSearchParams(window.location.search || '')
        const promo = String(sp.get('promo') || '').trim()
        // Detect PWA mode to pass flag for proper error redirect
        const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as NavigatorStandalone).standalone === true
        const params = new URLSearchParams()
        if (promo) params.set('promo', promo)
        if (isPWA) params.set('from_pwa', 'true')
        const queryString = params.toString()
        window.location.href = queryString ? `/api/auth/google?${queryString}` : '/api/auth/google'
      }
    } catch (error) {
      errorLog('Google login error:', error)
      showToast(t('auth.googleSignInFailed'), 'error')
      setIsLoading(false)
    }
  }

  const loginWithApple = async (): Promise<void> => {
    try {
      setIsLoading(true)
      if (typeof window !== 'undefined') {
        const sp = new URLSearchParams(window.location.search || '')
        const promo = String(sp.get('promo') || '').trim()
        // Detect PWA mode to pass flag for proper error redirect
        const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as NavigatorStandalone).standalone === true
        const params = new URLSearchParams()
        if (promo) params.set('promo', promo)
        if (isPWA) params.set('from_pwa', 'true')
        const queryString = params.toString()
        window.location.href = queryString ? `/api/auth/apple?${queryString}` : '/api/auth/apple'
      }
    } catch (error) {
      errorLog('Apple login error:', error)
      showToast(t('auth.appleSignInFailed'), 'error')
      setIsLoading(false)
    }
  }

  const logout = async (redirectUrl?: string) => {
    try {
      // Clear session cookie on server
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      // Even if API call fails, continue with logout
      errorLog('Error calling logout API:', error)
    }
    
    // Clear local state
    setUser(null)
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem('genosys_user')
      
      // Clear ALL PWA-related sessionStorage flags
      // This is critical for iOS PWA which may persist sessionStorage across restarts
      sessionStorage.removeItem('pwa_splash_shown')
      sessionStorage.clear() // Nuclear option - clear everything
      
      // Redirect to specified URL or default login page
      // Check if in PWA mode for appropriate login page
      const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                    (window.navigator as NavigatorStandalone).standalone === true
      
      if (redirectUrl) {
        window.location.href = redirectUrl
      } else if (isPWA) {
        window.location.href = '/pwa-login'
      } else {
        window.location.href = '/login'
      }
    }
  }

  const value = {
    user,
    login,
    loginWithGoogle,
    loginWithApple,
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
      loginWithGoogle: async () => {},
      loginWithApple: async () => {},
      register: async (_name: string, _email: string, _password: string, _phone: string, _address: string, _emirate: string, _birthday?: string) => false,
      logout: async (_redirectUrl?: string) => {},
      refreshUser: async () => {},
      forceRefreshUser: async () => {},
      isLoading: true
    } : value}>
      {children}
    </AuthContext.Provider>
  )
}
