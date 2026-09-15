import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { requireCsrfToken } from '@/lib/csrf'
import { verifySessionToken } from '@/lib/jwt'
import {
  getClientIdentifierFromNextRequest,
  rateLimitSimple,
} from '@/lib/rateLimitSimple'
import { issueWalletInstallLink, WalletRequestError } from '@/lib/wallet/domain'
import { normalizeWalletLocale } from '@/lib/wallet/tokens'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const limiter = rateLimitSimple({
  name: 'wallet-web-issue',
  windowMs: 10 * 60 * 1000,
  max: 12,
})

export async function POST(request: NextRequest) {
  const csrf = await requireCsrfToken(request)
  if (!csrf.valid) return csrf.response!

  const limited = await limiter(getClientIdentifierFromNextRequest(request))
  if (!limited.success) {
    return NextResponse.json({ success: false, error: 'RATE_LIMITED' }, { status: 429 })
  }

  try {
    const sessionCookie = (await cookies()).get('genosys_session')
    const session = sessionCookie?.value ? verifySessionToken(sessionCookie.value) : null
    if (!session?.id) {
      return NextResponse.json({ success: false, error: 'AUTHENTICATION_REQUIRED' }, { status: 401 })
    }
    const body = await request.json().catch(() => ({}))
    const provider = body?.provider
    if (provider !== 'APPLE' && provider !== 'GOOGLE') {
      return NextResponse.json({ success: false, error: 'INVALID_PROVIDER' }, { status: 400 })
    }

    const result = await issueWalletInstallLink({
      userId: session.id,
      provider,
      locale: normalizeWalletLocale(body?.locale),
    })
    return NextResponse.json({ success: true, ...result }, {
      headers: { 'Cache-Control': 'private, no-store' },
    })
  } catch (error) {
    if (error instanceof WalletRequestError) {
      return NextResponse.json({ success: false, error: error.code }, { status: error.status })
    }
    return NextResponse.json({ success: false, error: 'WALLET_ISSUANCE_FAILED' }, { status: 500 })
  }
}
