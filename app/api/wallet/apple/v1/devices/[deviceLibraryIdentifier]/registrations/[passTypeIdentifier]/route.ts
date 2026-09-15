import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validApplePassType } from '@/lib/wallet/appleWebService'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ deviceLibraryIdentifier: string; passTypeIdentifier: string }> },
) {
  const { deviceLibraryIdentifier, passTypeIdentifier } = await params
  if (
    !validApplePassType(passTypeIdentifier) ||
    !/^[A-Za-z0-9_-]{8,256}$/.test(deviceLibraryIdentifier)
  ) {
    return new NextResponse(null, { status: 404 })
  }
  const rawTag = request.nextUrl.searchParams.get('passesUpdatedSince')
  const tag = rawTag && /^\d+$/.test(rawTag) ? Number(rawTag) : 0
  const changedAfter = new Date(Number.isFinite(tag) && tag >= 0 && tag <= Date.now() ? tag : 0)
  const registrations = await prisma.appleWalletRegistration.findMany({
    where: {
      deviceLibraryIdentifier,
      walletPass: {
        provider: 'APPLE',
        status: { in: ['ACTIVE', 'INACTIVE'] },
        contentUpdatedAt: { gt: changedAfter },
      },
    },
    select: {
      walletPass: {
        select: { externalId: true, contentUpdatedAt: true },
      },
    },
  })
  if (registrations.length === 0) return new NextResponse(null, { status: 204 })

  const lastUpdated = Math.max(
    ...registrations.map(item => item.walletPass.contentUpdatedAt.getTime()),
  )
  return NextResponse.json({
    serialNumbers: registrations.map(item => item.walletPass.externalId),
    lastUpdated: String(lastUpdated),
  }, {
    headers: { 'Cache-Control': 'private, no-store' },
  })
}
