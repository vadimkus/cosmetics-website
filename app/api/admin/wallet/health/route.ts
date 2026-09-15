import crypto from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'
import { decodeBase64Secret, getWalletCapabilities } from '@/lib/wallet/config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function appleCertificateHealth() {
  if (!process.env.APPLE_PASS_CERT_PEM_B64) return { configured: false }
  try {
    const certificate = new crypto.X509Certificate(decodeBase64Secret('APPLE_PASS_CERT_PEM_B64'))
    const expiresAt = new Date(certificate.validTo)
    return {
      configured: true,
      expiresAt: expiresAt.toISOString(),
      daysRemaining: Math.floor((expiresAt.getTime() - Date.now()) / 86_400_000),
    }
  } catch {
    return { configured: true, valid: false }
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const [byProviderStatus, pending, failed, oldestPending] = await Promise.all([
    prisma.walletPass.groupBy({
      by: ['provider', 'status'],
      _count: true,
    }),
    prisma.walletPass.count({ where: { nextSyncAt: { not: null } } }),
    prisma.walletPass.count({ where: { lastError: { not: null } } }),
    prisma.walletPass.findFirst({
      where: { nextSyncAt: { not: null } },
      orderBy: { nextSyncAt: 'asc' },
      select: { nextSyncAt: true },
    }),
  ])

  return NextResponse.json({
    success: true,
    capabilities: getWalletCapabilities(),
    requested: {
      master: process.env.WALLET_PASSES_ENABLED === 'true',
      apple: process.env.APPLE_WALLET_ENABLED === 'true',
      google: process.env.GOOGLE_WALLET_ENABLED === 'true',
    },
    appleCertificate: appleCertificateHealth(),
    passes: byProviderStatus.map(row => ({
      provider: row.provider,
      status: row.status,
      count: row._count,
    })),
    sync: {
      pending,
      failed,
      oldestPendingAt: oldestPending?.nextSyncAt?.toISOString() || null,
    },
  }, {
    headers: { 'Cache-Control': 'private, no-store' },
  })
}
