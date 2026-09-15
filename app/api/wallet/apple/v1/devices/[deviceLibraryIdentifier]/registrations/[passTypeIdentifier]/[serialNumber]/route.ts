import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorizedApplePass } from '@/lib/wallet/appleWebService'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Context = {
  params: Promise<{
    deviceLibraryIdentifier: string
    passTypeIdentifier: string
    serialNumber: string
  }>
}

export async function POST(request: NextRequest, { params }: Context) {
  const { deviceLibraryIdentifier, passTypeIdentifier, serialNumber } = await params
  const walletPass = await authorizedApplePass(request, passTypeIdentifier, serialNumber)
  if (!walletPass || walletPass.status !== 'ACTIVE') return new NextResponse(null, { status: 401 })
  const body = await request.json().catch(() => null)
  const pushToken = typeof body?.pushToken === 'string' ? body.pushToken.trim() : ''
  if (
    !/^[A-Za-z0-9_-]{8,256}$/.test(deviceLibraryIdentifier) ||
    !/^[A-Fa-f0-9]{16,256}$/.test(pushToken)
  ) {
    return new NextResponse(null, { status: 400 })
  }
  const existing = await prisma.appleWalletRegistration.findUnique({
    where: {
      walletPassId_deviceLibraryIdentifier: {
        walletPassId: walletPass.id,
        deviceLibraryIdentifier,
      },
    },
    select: { id: true },
  })
  await prisma.appleWalletRegistration.upsert({
    where: {
      walletPassId_deviceLibraryIdentifier: {
        walletPassId: walletPass.id,
        deviceLibraryIdentifier,
      },
    },
    create: {
      walletPassId: walletPass.id,
      deviceLibraryIdentifier,
      pushToken,
    },
    update: { pushToken },
  })
  return new NextResponse(null, { status: existing ? 200 : 201 })
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const { deviceLibraryIdentifier, passTypeIdentifier, serialNumber } = await params
  const walletPass = await authorizedApplePass(request, passTypeIdentifier, serialNumber)
  if (!walletPass) return new NextResponse(null, { status: 401 })
  await prisma.appleWalletRegistration.deleteMany({
    where: { walletPassId: walletPass.id, deviceLibraryIdentifier },
  })
  return new NextResponse(null, { status: 200 })
}
