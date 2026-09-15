import { NextRequest, NextResponse } from 'next/server'
import {
  getClientIdentifierFromNextRequest,
  rateLimitSimple,
} from '@/lib/rateLimitSimple'
import { loadCanonicalWalletData, WalletRequestError } from '@/lib/wallet/domain'
import { renderApplePass } from '@/lib/wallet/apple'
import { isWalletProviderReady } from '@/lib/wallet/config'
import { verifyInstallToken } from '@/lib/wallet/tokens'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const limiter = rateLimitSimple({
  name: 'wallet-install',
  windowMs: 60 * 1000,
  max: 30,
  memoryOnly: true,
})

export async function GET(request: NextRequest) {
  const limited = await limiter(getClientIdentifierFromNextRequest(request))
  if (!limited.success) {
    return NextResponse.json({ success: false, error: 'RATE_LIMITED' }, { status: 429 })
  }

  const token = request.nextUrl.searchParams.get('token')
  const payload = token ? verifyInstallToken(token) : null
  if (!payload) {
    return NextResponse.json({ success: false, error: 'INVALID_OR_EXPIRED_LINK' }, { status: 401 })
  }
  if (!isWalletProviderReady(payload.provider)) {
    return NextResponse.json({ success: false, error: 'PROVIDER_NOT_CONFIGURED' }, { status: 503 })
  }

  try {
    const data = await loadCanonicalWalletData(payload.pass, payload.provider)
    if (payload.provider === 'APPLE') {
      const pass = await renderApplePass(data)
      return new NextResponse(new Uint8Array(pass), {
        headers: {
          'Content-Type': 'application/vnd.apple.pkpass',
          'Content-Disposition': 'inline; filename="GENOSYS-Rewards.pkpass"',
          'Cache-Control': 'private, no-store, max-age=0',
          'X-Content-Type-Options': 'nosniff',
          ETag: `"apple-${data.externalId}-${data.revision}"`,
        },
      })
    }
    return NextResponse.json({ success: false, error: 'PROVIDER_NOT_IMPLEMENTED' }, { status: 503 })
  } catch (error) {
    if (error instanceof WalletRequestError) {
      return NextResponse.json({ success: false, error: error.code }, { status: error.status })
    }
    return NextResponse.json({ success: false, error: 'PASS_GENERATION_FAILED' }, { status: 500 })
  }
}
