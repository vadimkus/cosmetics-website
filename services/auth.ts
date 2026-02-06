/**
 * Auth service – centralized API calls for authentication.
 */

import { api } from './api'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SessionUser {
  id: string
  email: string
  name?: string
  role?: string
  image?: string
  phone?: string
  discountPercent?: number
}

export interface AuthSession {
  user: SessionUser | null
  authenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/**
 * Check the current session.
 */
export async function checkSession() {
  return api.get<AuthSession>('/api/auth/session')
}

/**
 * Log in with email/password.
 */
export async function login(credentials: LoginCredentials) {
  return api.post<AuthSession>('/api/auth/login', credentials as unknown as Record<string, unknown>)
}

/**
 * Register a new user.
 */
export async function register(data: RegisterData) {
  return api.post<AuthSession>('/api/auth/register', data as unknown as Record<string, unknown>)
}

/**
 * Refresh the auth token.
 */
export async function refreshToken() {
  return api.post<AuthSession>('/api/auth/refresh')
}

/**
 * Log out the current user.
 */
export async function logout() {
  return api.post<{ success: boolean }>('/api/auth/logout')
}

/**
 * Request a password reset email.
 */
export async function forgotPassword(email: string) {
  return api.post<{ success: boolean }>('/api/auth/forgot-password', { email })
}

/**
 * Reset password using a token.
 */
export async function resetPassword(token: string, password: string) {
  return api.post<{ success: boolean }>(`/api/auth/reset-password/${token}`, { password })
}

/**
 * Validate a password reset token.
 */
export async function validateResetToken(token: string) {
  return api.get<{ valid: boolean }>(`/api/auth/reset-password/${token}`)
}
