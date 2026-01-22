'use client'

import { useState, useEffect, useCallback } from 'react'
import { startRegistration, startAuthentication, browserSupportsWebAuthn } from '@simplewebauthn/browser'

// Simple client-side logging
const isDev = process.env.NODE_ENV === 'development'
const debugLog = (...args: unknown[]) => isDev && console.log('[PASSKEY]', ...args)
const errorLog = (...args: unknown[]) => console.error('[PASSKEY]', ...args)

export interface Passkey {
  id: string
  deviceName: string | null
  deviceType: string | null
  backedUp: boolean
  createdAt: string
  lastUsedAt: string | null
}

interface UsePasskeyReturn {
  // Feature detection
  isSupported: boolean
  isPlatformAuthenticatorAvailable: boolean
  isLoading: boolean
  error: string | null
  
  // Check if email has passkeys
  checkPasskeyExists: (email: string) => Promise<boolean>
  
  // Registration (for logged-in users)
  registerPasskey: () => Promise<boolean>
  
  // Authentication (for login)
  loginWithPasskey: (email: string) => Promise<{ user: unknown } | null>
  
  // Passkey management
  passkeys: Passkey[]
  loadPasskeys: () => Promise<void>
  deletePasskey: (passkeyId: string) => Promise<boolean>
  
  // Clear error
  clearError: () => void
}

export function usePasskey(): UsePasskeyReturn {
  const [isSupported, setIsSupported] = useState(false)
  const [isPlatformAuthenticatorAvailable, setIsPlatformAuthenticatorAvailable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passkeys, setPasskeys] = useState<Passkey[]>([])

  // Check WebAuthn support on mount
  useEffect(() => {
    const checkSupport = async () => {
      // Check basic WebAuthn support
      const supported = browserSupportsWebAuthn()
      setIsSupported(supported)
      
      if (supported && window.PublicKeyCredential) {
        try {
          // Check if a platform authenticator (Face ID, Touch ID) is available
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
          setIsPlatformAuthenticatorAvailable(available)
          debugLog('[PASSKEY] Platform authenticator available:', available)
        } catch {
          setIsPlatformAuthenticatorAvailable(false)
        }
      }
    }
    
    checkSupport()
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /**
   * Check if an email has passkeys registered
   */
  const checkPasskeyExists = useCallback(async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/passkey/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      return data.hasPasskeys || false
    } catch {
      return false
    }
  }, [])

  /**
   * Register a new passkey for the currently logged-in user
   */
  const registerPasskey = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Passkeys are not supported on this device')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      // 1. Get registration options from server
      const optionsRes = await fetch('/api/auth/passkey/register-options', {
        method: 'POST',
        credentials: 'include',
      })

      if (!optionsRes.ok) {
        const errorData = await optionsRes.json()
        throw new Error(errorData.error || 'Failed to get registration options')
      }

      const options = await optionsRes.json()
      debugLog('[PASSKEY] Got registration options')

      // 2. Create credential with Face ID/Touch ID
      let credential
      try {
        credential = await startRegistration({ optionsJSON: options })
        debugLog('[PASSKEY] Created credential')
      } catch (regError) {
        // User cancelled or other error
        if ((regError as Error).name === 'NotAllowedError') {
          throw new Error('Passkey registration was cancelled')
        }
        throw regError
      }

      // 3. Verify with server
      const verifyRes = await fetch('/api/auth/passkey/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credential),
        credentials: 'include',
      })

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json()
        throw new Error(errorData.error || 'Failed to register passkey')
      }

      debugLog('[PASSKEY] Passkey registered successfully')
      
      // Refresh the passkeys list
      await loadPasskeys()
      
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to register passkey'
      errorLog('[PASSKEY] Registration error:', message)
      setError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [isSupported])

  /**
   * Log in with a passkey
   */
  const loginWithPasskey = useCallback(async (email: string): Promise<{ user: unknown } | null> => {
    if (!isSupported) {
      setError('Passkeys are not supported on this device')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      // 1. Get authentication options
      const optionsRes = await fetch('/api/auth/passkey/login-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      })

      if (!optionsRes.ok) {
        const errorData = await optionsRes.json()
        throw new Error(errorData.error || 'Failed to get login options')
      }

      const options = await optionsRes.json()
      debugLog('[PASSKEY] Got authentication options')

      // 2. Authenticate with Face ID/Touch ID
      let credential
      try {
        credential = await startAuthentication({ optionsJSON: options })
        debugLog('[PASSKEY] Got authentication credential')
      } catch (authError) {
        if ((authError as Error).name === 'NotAllowedError') {
          throw new Error('Passkey authentication was cancelled')
        }
        throw authError
      }

      // 3. Verify with server
      const verifyRes = await fetch('/api/auth/passkey/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credential),
        credentials: 'include',
      })

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json()
        throw new Error(errorData.error || 'Failed to verify passkey')
      }

      const result = await verifyRes.json()
      debugLog('[PASSKEY] Login successful')
      
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Passkey login failed'
      errorLog('[PASSKEY] Login error:', message)
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isSupported])

  /**
   * Load user's passkeys
   */
  const loadPasskeys = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/passkey', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setPasskeys(data.passkeys || [])
      }
    } catch {
      // Silently fail - user might not be logged in
    }
  }, [])

  /**
   * Delete a passkey
   */
  const deletePasskey = useCallback(async (passkeyId: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/passkey', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkeyId }),
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete passkey')
      }

      // Refresh the passkeys list
      await loadPasskeys()
      
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete passkey'
      setError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [loadPasskeys])

  return {
    isSupported,
    isPlatformAuthenticatorAvailable,
    isLoading,
    error,
    checkPasskeyExists,
    registerPasskey,
    loginWithPasskey,
    passkeys,
    loadPasskeys,
    deletePasskey,
    clearError,
  }
}
