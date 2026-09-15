import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyApplePassAuthenticationToken } from '@/lib/wallet/apple'

export function applePassAuthorization(request: NextRequest): string | null {
  const value = request.headers.get('authorization')
  return value?.startsWith('ApplePass ') ? value.slice('ApplePass '.length).trim() : null
}

export function validApplePassType(candidate: string): boolean {
  return Boolean(process.env.APPLE_PASS_TYPE_ID && candidate === process.env.APPLE_PASS_TYPE_ID)
}

export async function authorizedApplePass(
  request: NextRequest,
  passTypeIdentifier: string,
  serialNumber: string,
) {
  if (!validApplePassType(passTypeIdentifier)) return null
  const token = applePassAuthorization(request)
  if (!token) return null
  const walletPass = await prisma.walletPass.findFirst({
    where: {
      externalId: serialNumber,
      provider: 'APPLE',
      status: { in: ['ACTIVE', 'INACTIVE'] },
    },
  })
  if (!walletPass || !verifyApplePassAuthenticationToken(walletPass.externalId, token)) return null
  return walletPass
}
