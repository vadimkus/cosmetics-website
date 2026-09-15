import { NextRequest, NextResponse } from 'next/server'
import {
  getClientIdentifierFromNextRequest,
  rateLimitSimple,
} from '@/lib/rateLimitSimple'
import { prisma } from '@/lib/prisma'
import { loadCanonicalWalletData, WalletRequestError } from '@/lib/wallet/domain'
import { renderApplePass } from '@/lib/wallet/apple'
import { renderAppleInstallLanding } from '@/lib/wallet/appleInstall'
import { isWalletProviderReady } from '@/lib/wallet/config'
import { createGoogleSaveUrl, upsertGoogleLoyaltyObject } from '@/lib/wallet/google'
import { markWalletPassPublished, walletContentFingerprint } from '@/lib/wallet/sync'
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
    if (payload.provider === 'APPLE' && request.nextUrl.searchParams.get('status') === '1') {
      const requestedSince = Number(request.nextUrl.searchParams.get('since'))
      const issuedAtMs = payload.iat * 1000
      const now = Date.now()
      const since = Number.isFinite(requestedSince)
        && requestedSince >= issuedAtMs
        && requestedSince <= now + 1000
        ? requestedSince
        : issuedAtMs
      const walletPass = await prisma.walletPass.findUnique({
        where: { externalId: payload.pass },
        select: {
          provider: true,
          status: true,
          appleRegistrations: {
            orderBy: { updatedAt: 'desc' },
            select: { updatedAt: true },
            take: 1,
          },
        },
      })
      if (!walletPass || walletPass.provider !== 'APPLE' || walletPass.status !== 'ACTIVE') {
        return NextResponse.json(
          { success: false, error: 'PASS_NOT_FOUND' },
          { status: 404, headers: { 'Cache-Control': 'private, no-store' } },
        )
      }
      const latestRegistration = walletPass.appleRegistrations[0]?.updatedAt
      return NextResponse.json(
        {
          success: true,
          activeInWallet: Boolean(latestRegistration),
          added: Boolean(
            latestRegistration && latestRegistration.getTime() >= since,
          ),
        },
        { headers: { 'Cache-Control': 'private, no-store' } },
      )
    }

    if (payload.provider === 'APPLE' && request.nextUrl.searchParams.get('download') !== '1') {
      const encodedToken = encodeURIComponent(token!)
      const route = request.nextUrl.pathname
      const startedAt = Date.now()
      const html = renderAppleInstallLanding({
        locale: payload.locale,
        passUrl: `${route}?token=${encodedToken}&download=1`,
        statusUrl: `${route}?token=${encodedToken}&status=1&since=${startedAt}`,
        nativeApp: request.nextUrl.searchParams.get('source') === 'native',
      })
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'private, no-store, max-age=0',
          'Content-Security-Policy':
            "default-src 'none'; connect-src 'self'; frame-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'",
          'Referrer-Policy': 'no-referrer',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
        },
      })
    }

    const data = await loadCanonicalWalletData(payload.pass, payload.provider)
    if (payload.provider === 'APPLE') {
      const pass = await renderApplePass(data)
      await markWalletPassPublished(data.externalId, data.revision, walletContentFingerprint(data))
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
    await upsertGoogleLoyaltyObject(data)
    await markWalletPassPublished(data.externalId, data.revision, walletContentFingerprint(data))
    return NextResponse.redirect(createGoogleSaveUrl(data.externalId), {
      status: 302,
      headers: {
        'Cache-Control': 'private, no-store, max-age=0',
        'Referrer-Policy': 'no-referrer',
      },
    })
  } catch (error) {
    if (error instanceof WalletRequestError) {
      return NextResponse.json({ success: false, error: error.code }, { status: error.status })
    }
    return NextResponse.json({ success: false, error: 'PASS_GENERATION_FAILED' }, { status: 500 })
  }
}
