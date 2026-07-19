import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { extractTokenFromHeader, validateMobileAuth, verifySessionToken } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'

export interface HomecarePartnerAuth {
  user: NonNullable<Awaited<ReturnType<typeof findUserByEmail>>>
  mobile: boolean
}

export async function requireHomecarePartner(
  request: NextRequest,
): Promise<{ auth?: HomecarePartnerAuth; error?: string; status?: number }> {
  const bearer = extractTokenFromHeader(request.headers.get('authorization'))
  if (bearer) {
    const mobileAuth = validateMobileAuth(request.headers.get('x-api-key'), bearer)
    if (!mobileAuth.valid || !mobileAuth.payload?.email) {
      return {
        error: mobileAuth.error || 'Authentication required',
        status: mobileAuth.status || 401,
      }
    }
    const user = await findUserByEmail(mobileAuth.payload.email)
    if (!user) return { error: 'Account not found', status: 401 }
    if (!user.partnerPortalAccess) return { error: 'Partner access only', status: 403 }
    return { auth: { user, mobile: true } }
  }

  const cookieStore = await cookies()
  const session = verifySessionToken(cookieStore.get('genosys_session')?.value || '')
  if (!session?.email) return { error: 'Please log in', status: 401 }
  const user = await findUserByEmail(session.email)
  if (!user) return { error: 'Account not found', status: 401 }
  if (!user.partnerPortalAccess) return { error: 'Partner access only', status: 403 }
  return { auth: { user, mobile: false } }
}

export const HOMECARE_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, x-csrf-token',
}
