import { NextRequest, NextResponse } from 'next/server'
import { extractTokenFromHeader, validateMobileAuth } from '@/lib/jwt'
import {
  getClientIdentifierFromNextRequest,
  rateLimitSimple,
} from '@/lib/rateLimitSimple'
import { issueWalletInstallLink, WalletRequestError } from '@/lib/wallet/domain'
import { normalizeWalletLocale } from '@/lib/wallet/tokens'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const limiter = rateLimitSimple({
  name: 'wallet-mobile-issue',
  windowMs: 10 * 60 * 1000,
  max: 12,
})

export async function POST(request: NextRequest) {
  const limited = await limiter(getClientIdentifierFromNextRequest(request))
  if (!limited.success) {
    return NextResponse.json({ success: false, error: 'RATE_LIMITED' }, { status: 429 })
  }

  try {
    const auth = validateMobileAuth(
      request.headers.get('x-api-key'),
      extractTokenFromHeader(request.headers.get('authorization')),
    )
    if (!auth.valid || !auth.payload) {
      return NextResponse.json(
        { success: false, error: auth.error || 'AUTHENTICATION_REQUIRED' },
        { status: auth.status || 401 },
      )
    }
    const body = await request.json().catch(() => ({}))
    const provider = body?.provider
    if (provider !== 'APPLE' && provider !== 'GOOGLE') {
      return NextResponse.json({ success: false, error: 'INVALID_PROVIDER' }, { status: 400 })
    }

    const result = await issueWalletInstallLink({
      userId: auth.payload.userId,
      provider,
      locale: normalizeWalletLocale(body?.locale),
    })
    const installUrl = new URL(result.installUrl)
    installUrl.searchParams.set('source', 'native')
    return NextResponse.json({ success: true, ...result, installUrl: installUrl.toString() }, {
      headers: { 'Cache-Control': 'private, no-store' },
    })
  } catch (error) {
    if (error instanceof WalletRequestError) {
      return NextResponse.json({ success: false, error: error.code }, { status: error.status })
    }
    return NextResponse.json({ success: false, error: 'WALLET_ISSUANCE_FAILED' }, { status: 500 })
  }
}
