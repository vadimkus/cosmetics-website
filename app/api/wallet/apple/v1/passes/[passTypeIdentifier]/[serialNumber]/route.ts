import { NextRequest, NextResponse } from 'next/server'
import { authorizedApplePass } from '@/lib/wallet/appleWebService'
import { loadCanonicalWalletData } from '@/lib/wallet/domain'
import { renderApplePass } from '@/lib/wallet/apple'
import { markWalletPassPublished, walletContentFingerprint } from '@/lib/wallet/sync'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ passTypeIdentifier: string; serialNumber: string }> },
) {
  const { passTypeIdentifier, serialNumber } = await params
  const walletPass = await authorizedApplePass(request, passTypeIdentifier, serialNumber)
  if (!walletPass) return new NextResponse(null, { status: 401 })

  const etag = `"apple-${walletPass.externalId}-${walletPass.contentRevision}"`
  const modifiedSince = request.headers.get('if-modified-since')
  const modifiedSinceMs = modifiedSince ? Date.parse(modifiedSince) : Number.NaN
  if (
    request.headers.get('if-none-match') === etag ||
    (Number.isFinite(modifiedSinceMs) &&
      walletPass.contentUpdatedAt.getTime() <= modifiedSinceMs + 999)
  ) {
    return new NextResponse(null, { status: 304, headers: { ETag: etag } })
  }

  const data = await loadCanonicalWalletData(walletPass.externalId, 'APPLE', {
    allowInactive: true,
    allowIneligible: true,
  })
  const pass = await renderApplePass(data)
  await markWalletPassPublished(
    data.externalId,
    data.revision,
    walletContentFingerprint(data),
  )
  return new NextResponse(new Uint8Array(pass), {
    headers: {
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': 'inline; filename="GENOSYS-Rewards.pkpass"',
      'Cache-Control': 'private, no-store, max-age=0',
      'Last-Modified': walletPass.contentUpdatedAt.toUTCString(),
      ETag: etag,
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
