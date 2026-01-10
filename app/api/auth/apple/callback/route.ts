import { NextRequest, NextResponse } from 'next/server'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { debugLog, errorLog } from '@/lib/logger'
import { exchangeAppleCodeForTokens, getAppleWebClientId, getAppleWebRedirectUri } from '@/lib/appleWebAuth'
import { verifyAppleIdentityToken } from '@/lib/appleIdentityToken'
import { addUser, findUserByAppleSub, findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { prisma } from '@/lib/database'
import { createSessionToken } from '@/lib/jwt'
import { Prisma } from '@prisma/client'
import { sendAdminNewUserNotification } from '@/lib/email'

// Types for Apple OAuth responses
interface AppleTokenResponse {
  id_token?: string
  access_token?: string
  refresh_token?: string
  token_type?: string
  expires_in?: number
}

interface AppleIdTokenClaims {
  sub: string
  email?: string
  email_verified?: boolean
  is_private_email?: boolean
  nonce?: string
  aud?: string
  iss?: string
  exp?: number
  iat?: number
}

const appleCallbackLimiter = rateLimitSimple({
  windowMs: 15 * 60 * 1000,
  max: 20,
})

function normalizeOrigin(origin: string): string {
  let normalized = origin
  if (normalized.includes('0.0.0.0')) normalized = normalized.replace('0.0.0.0', 'localhost')
  if (normalized.includes('localhost') || normalized.includes('127.0.0.1')) {
    normalized = normalized.replace('https://', 'http://')
  } else {
    normalized = normalized.replace('http://', 'https://')
  }
  // Normalize www → apex domain to avoid cookie/redirect_uri mismatches.
  try {
    const u = new URL(normalized)
    if (u.hostname.startsWith('www.')) {
      u.hostname = u.hostname.replace(/^www\./, '')
      normalized = u.origin
    }
  } catch (error) {
    // ignore
  }
  return normalized
}

function getLocaleRedirectPath(request: NextRequest) {
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
  const referer = request.headers.get('referer') || ''
  let redirectPath = '/products'
  if (localeCookie === 'ru') redirectPath = '/ru/products'
  else if (localeCookie === 'ar') redirectPath = '/ar/products'
  else if (referer.includes('/ru/')) redirectPath = '/ru/products'
  else if (referer.includes('/ar/')) redirectPath = '/ar/products'
  return redirectPath
}

/**
 * POST /api/auth/apple/callback
 * Handles Apple OAuth callback (response_mode=form_post).
 */
async function handleAppleCallback(request: NextRequest, params: {
  code: string
  state: string
  idTokenFromPost?: string
  userJson?: string
  oauthError?: string
}) {
  const startTime = Date.now()
  debugLog('[APPLE_CALLBACK] Request started')

  const normalizedOrigin = normalizeOrigin(request.nextUrl.origin)
  
  // Check if request came from PWA
  const isFromPWA = request.cookies.get('oauth-from-pwa')?.value === 'true'
  const loginPath = isFromPWA ? '/pwa-login' : '/login'

  // Helper function to create error redirect and clean up cookies
  const createErrorRedirect = (errorCode: string) => {
    const response = NextResponse.redirect(
      new URL(`${loginPath}?error=${errorCode}`, normalizedOrigin),
      303 // Use 303 to force GET on redirect
    )
    // Clean up OAuth cookies
    response.cookies.delete('apple-oauth-state')
    response.cookies.delete('apple-oauth-nonce')
    response.cookies.delete('apple-oauth-promo')
    response.cookies.delete('oauth-from-pwa')
    return response
  }

  try {
    const now = new Date()
    let clientIdentifier: string
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (error) {
      errorLog('[APPLE_CALLBACK] Rate limit identifier error:', error)
      clientIdentifier = 'unknown'
    }

    const rateLimitResult = await appleCallbackLimiter(clientIdentifier)
    if (!rateLimitResult || !rateLimitResult.success) {
      return createErrorRedirect('apple_rate_limit')
    }

    const code = String(params.code || '')
    const state = String(params.state || '')
    const idTokenFromPost = String(params.idTokenFromPost || '')
    const userJson = String(params.userJson || '')
    const oauthError = String(params.oauthError || '')

    if (oauthError) {
      errorLog('[APPLE_CALLBACK] OAuth error:', oauthError)
      return createErrorRedirect('apple_oauth_failed')
    }

    if (!code || !state) {
      return createErrorRedirect('apple_invalid_request')
    }

    // Verify state
    const storedState = request.cookies.get('apple-oauth-state')?.value
    if (!storedState || storedState !== state) {
      return createErrorRedirect('apple_invalid_state')
    }

    const promoFromCookie = String(request.cookies.get('apple-oauth-promo')?.value || '').trim().toUpperCase()

    const clientId = getAppleWebClientId()
    if (!clientId) {
      return createErrorRedirect('apple_not_configured')
    }

    const redirectUri = getAppleWebRedirectUri(normalizedOrigin)

    // Exchange code for tokens (server-to-server)
    let tokenResponse: AppleTokenResponse | null = null
    try {
      tokenResponse = await exchangeAppleCodeForTokens({
        code,
        origin: normalizedOrigin,
        redirectUri,
        clientId,
      })
    } catch (error) {
      errorLog('[APPLE_CALLBACK] Token exchange failed:', error)
      return createErrorRedirect('apple_token_exchange_failed')
    }

    const idToken = String(tokenResponse?.id_token || idTokenFromPost || '')
    if (!idToken) {
      return createErrorRedirect('apple_token_missing')
    }

    // Verify id_token signature + claims
    let claims: AppleIdTokenClaims | undefined
    try {
      const verified = await verifyAppleIdentityToken(idToken, { audience: clientId })
      claims = verified?.claims as AppleIdTokenClaims | undefined
    } catch (error) {
      errorLog('[APPLE_CALLBACK] id_token verification failed:', error)
      return createErrorRedirect('apple_token_verification_failed')
    }

    // Optional nonce check
    const nonce = request.cookies.get('apple-oauth-nonce')?.value
    if (nonce && claims?.nonce && String(claims.nonce) !== String(nonce)) {
      return createErrorRedirect('apple_invalid_nonce')
    }

    if (!claims) {
      return createErrorRedirect('apple_token_verification_failed')
    }

    const appleSub = String(claims.sub || '').trim()
    const emailRaw = String(claims.email || '').trim().toLowerCase()
    const email = emailRaw || `apple+${appleSub}@genosys.local`

    // Name is only provided in `user` on first consent
    let fullName = ''
    try {
      if (userJson) {
        const parsed = JSON.parse(userJson)
        const given = parsed?.name?.firstName || ''
        const family = parsed?.name?.lastName || ''
        fullName = [given, family].filter(Boolean).join(' ').trim()
      }
    } catch (error) {
      // ignore
    }
    
    // Fallback name logic:
    // 1. If no name from Apple, use a user-friendly default instead of the obfuscated email prefix
    // 2. For private relay emails (privaterelay.appleid.com), use "Apple User" as default
    // 3. For regular emails, extract the prefix (but this is still not ideal)
    if (!fullName) {
      if (email.includes('@privaterelay.appleid.com')) {
        fullName = 'Apple User'
      } else {
        fullName = email.split('@')[0] || 'Apple User'
      }
    }

    // Find or create/link user
    let user = await findUserByAppleSub(appleSub)

    // If not found by appleSub, try linking by email (common for existing accounts).
    if (!user && emailRaw) {
      const byEmail = await findUserByEmail(email)
      if (byEmail) {
        // If email user already linked to another appleSub, prefer the appleSub record (if any),
        // otherwise keep the existing account and avoid throwing.
        if (byEmail.appleSub && String(byEmail.appleSub) !== appleSub) {
          const bySub = await findUserByAppleSub(appleSub)
          if (bySub) user = bySub
          else user = byEmail
        } else {
          // Link account (guard against unique constraint errors)
          try {
            await updateUser(byEmail.id, { appleSub })
          } catch (error) {
            errorLog('[APPLE_CALLBACK] Failed to link appleSub to existing email user:', error)
          }
          user = (await findUserByAppleSub(appleSub)) || (await findUserByEmail(email)) || byEmail
        }
      }
    }

    // If still no user, create a new one. Handle duplicates gracefully (common on retries / private relay).
    let isNewUser = false
    if (!user) {
      try {
        // Apply promo code at account creation time (if provided from /login?promo=...).
        // Use transaction so usedCount increments only if user is created.
        if (promoFromCookie) {
          user = await prisma.$transaction(async (tx) => {
            let discountType: string | null = null
            let discountPercentage: number | null = null

            const promo = await tx.promoCode.findUnique({ where: { code: promoFromCookie } })
            if (promo?.isActive) {
              const okExpiry = !promo.expiresAt || promo.expiresAt > now
              const okUses = promo.maxUses == null || promo.usedCount < promo.maxUses
              if (okExpiry && okUses) {
                const maxUsesGuard =
                  promo.maxUses == null
                    ? []
                    : [{ usedCount: { lt: promo.maxUses } }]
                const updated = await tx.promoCode.updateMany({
                  where: {
                    id: promo.id,
                    isActive: true,
                    AND: [
                      { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
                      ...maxUsesGuard,
                    ],
                  },
                  data: { usedCount: { increment: 1 } },
                })
                if (updated.count === 1) {
                  discountType = promo.discountType
                  discountPercentage = promo.discountPercent
                }
              }
            }

            return await tx.user.create({
              data: {
                name: fullName,
                email,
                appleSub,
                password: null,
                profilePicture: null,
                phone: null,
                address: null,
                isAdmin: false,
                canSeePrices: true,
                discountType,
                discountPercentage,
                lastLoginAt: now,
              } as Prisma.UserCreateInput,
            })
          })
          isNewUser = true
        } else {
          user = await addUser({
            name: fullName,
            email,
            appleSub,
            password: null,
            profilePicture: null,
            phone: null,
            address: null,
            isAdmin: false,
            canSeePrices: true,
            lastLoginAt: new Date().toISOString(),
          })
          isNewUser = true
        }
      } catch (error) {
        errorLog('[APPLE_CALLBACK] User create failed, attempting recovery:', error)
        user =
          (await findUserByAppleSub(appleSub)) ||
          (emailRaw ? await findUserByEmail(email) : null)

        if (!user) {
          return createErrorRedirect('apple_user_creation_failed')
        }

        // Best-effort: ensure appleSub is linked
        if (!user.appleSub) {
          try {
            await updateUser(user.id, { appleSub })
          } catch (linkErr) {
            errorLog('[APPLE_CALLBACK] Recovery link appleSub failed:', linkErr)
          }
        }
      }
    } else {
      try {
        await updateUser(user.id, { lastLoginAt: new Date().toISOString() })
      } catch (error) {
        errorLog('[APPLE_CALLBACK] Failed to update lastLoginAt:', error)
        // don't fail login
      }

      // SAFE FALLBACK: if promo is present and the account was JUST created (bug window),
      // and no discount is set yet, apply promo once.
      try {
        const createdAt = user?.createdAt ? new Date(user.createdAt) : null
        const ageMs = createdAt ? (now.getTime() - createdAt.getTime()) : Number.POSITIVE_INFINITY
        const hasNoDiscount = !user?.discountPercentage && !user?.discountType
        if (promoFromCookie && hasNoDiscount && Number.isFinite(ageMs) && ageMs >= 0 && ageMs <= 10 * 60 * 1000) {
          await prisma.$transaction(async (tx) => {
            const promo = await tx.promoCode.findUnique({ where: { code: promoFromCookie } })
            if (!promo?.isActive) return
            const okExpiry = !promo.expiresAt || promo.expiresAt > now
            const okUses = promo.maxUses == null || promo.usedCount < promo.maxUses
            if (!okExpiry || !okUses) return
            const maxUsesGuard =
              promo.maxUses == null
                ? []
                : [{ usedCount: { lt: promo.maxUses } }]
            const updated = await tx.promoCode.updateMany({
              where: {
                id: promo.id,
                isActive: true,
                AND: [
                  { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
                  ...maxUsesGuard,
                ],
              },
              data: { usedCount: { increment: 1 } },
            })
            if (updated.count !== 1) return
            await tx.user.update({
              where: { id: user!.id },
              data: { discountType: promo.discountType, discountPercentage: promo.discountPercent },
            })
          })
        }
      } catch (error) {
        errorLog('[APPLE_CALLBACK] Failed to apply promo fallback:', error)
      }
    }

    // Send admin notification for new Apple Sign-In user (non-blocking)
    if (isNewUser && user) {
      try {
        debugLog('[APPLE_CALLBACK] 📧 Attempting to send admin notification for new Apple user...')
        const adminResult = await sendAdminNewUserNotification(
          user.name,
          user.email,
          undefined, // phone
          undefined, // address
          'Apple Sign-In (Web)'
        )
        
        if (adminResult && adminResult.success) {
          debugLog('[APPLE_CALLBACK] ✅ Admin notification sent successfully for new Apple user:', user.email)
          debugLog('[APPLE_CALLBACK] ✅ Notification message ID:', adminResult.messageId)
        } else {
          errorLog('[APPLE_CALLBACK] ❌ FAILED to send admin notification')
          errorLog('[APPLE_CALLBACK] ❌ Error:', adminResult?.error || 'Unknown error')
        }
      } catch (emailError) {
        errorLog('[APPLE_CALLBACK] ❌ EXCEPTION sending admin notification:', emailError)
        // Don't fail registration if email fails
      }
    }

    const redirectPath = getLocaleRedirectPath(request)
    // IMPORTANT: This callback is typically a cross-site POST (response_mode=form_post).
    // NextResponse.redirect defaults to 307 which preserves the method, causing a POST to /products → 405.
    // Use 303 See Other to force a GET on the redirected page.
    const response = NextResponse.redirect(new URL(redirectPath, normalizedOrigin), 303)

    // Clear oauth cookies
    response.cookies.delete('apple-oauth-state')
    response.cookies.delete('apple-oauth-nonce')
    response.cookies.delete('apple-oauth-promo')
    response.cookies.delete('oauth-from-pwa')

    // Create signed session token (prevents tampering)
    // Fallback to legacy JSON if JWT creation fails
    let sessionToken: string
    try {
      sessionToken = createSessionToken({
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin || false,
        canSeePrices: user.canSeePrices !== undefined ? user.canSeePrices : true,
        profilePicture: user.profilePicture || null,
      })
      debugLog('[APPLE_CALLBACK] Created signed session token')
    } catch (jwtError) {
      errorLog('[APPLE_CALLBACK] JWT creation failed, using legacy format:', jwtError)
      sessionToken = JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin || false,
        canSeePrices: user.canSeePrices !== undefined ? user.canSeePrices : true,
        profilePicture: user.profilePicture || null,
      })
    }
    
    // Set session cookie
    response.cookies.set('genosys_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })

    debugLog('[APPLE_CALLBACK] Success', Date.now() - startTime, 'ms')
    return response
  } catch (error) {
    errorLog('[APPLE_CALLBACK] Error:', error)
    // Check if request came from PWA for error redirect
    const isPWA = request.cookies.get('oauth-from-pwa')?.value === 'true'
    const errorLoginPath = isPWA ? '/pwa-login' : '/login'
    const errorResponse = NextResponse.redirect(
      new URL(`${errorLoginPath}?error=apple_internal_error`, normalizedOrigin),
      303
    )
    errorResponse.cookies.delete('apple-oauth-state')
    errorResponse.cookies.delete('apple-oauth-nonce')
    errorResponse.cookies.delete('apple-oauth-promo')
    errorResponse.cookies.delete('oauth-from-pwa')
    return errorResponse
  }
}

export async function POST(request: NextRequest) {
  const form = await request.formData()
  return handleAppleCallback(request, {
    code: String(form.get('code') || ''),
    state: String(form.get('state') || ''),
    idTokenFromPost: String(form.get('id_token') || ''),
    userJson: String(form.get('user') || ''),
    oauthError: String(form.get('error') || ''),
  })
}

/**
 * Some Apple flows can return to the callback using GET (response_mode=query).
 * Handle GET as well to avoid HTTP 405 pages.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const code = String(sp.get('code') || '')
  const state = String(sp.get('state') || '')
  const oauthError = String(sp.get('error') || '')

  // If this isn't an OAuth callback, just bounce to login.
  if (!code || !state) {
    const normalizedOrigin = normalizeOrigin(request.nextUrl.origin)
    const isFromPWA = request.cookies.get('oauth-from-pwa')?.value === 'true'
    const loginPath = isFromPWA ? '/pwa-login' : '/login'
    const response = NextResponse.redirect(new URL(`${loginPath}?error=apple_invalid_request`, normalizedOrigin))
    response.cookies.delete('oauth-from-pwa')
    return response
  }

  return handleAppleCallback(request, {
    code,
    state,
    oauthError,
    // Apple typically won't include these in query mode; we can still exchange code for tokens.
    idTokenFromPost: String(sp.get('id_token') || ''),
    userJson: String(sp.get('user') || ''),
  })
}


