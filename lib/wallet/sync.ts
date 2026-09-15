import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { loadCanonicalWalletData, type CanonicalWalletData } from '@/lib/wallet/domain'
import { isWalletProviderReady } from '@/lib/wallet/config'
import { sendApplePassPush } from '@/lib/wallet/applePush'
import { deactivateGoogleLoyaltyObject, upsertGoogleLoyaltyObject } from '@/lib/wallet/google'
import { loyaltyTrackForUser } from '@/lib/loyalty'
import { deactivateWalletPasses } from '@/lib/wallet/dirty'

const MAX_BACKOFF_MS = 6 * 60 * 60 * 1000

export function walletContentFingerprint(data: CanonicalWalletData): string {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify({
      status: data.status,
      locale: data.locale,
      name: data.name,
      memberNumber: data.memberNumber,
      memberSince: data.memberSince.toISOString(),
      tier: data.tier,
      multiplier: data.multiplier,
      points: data.points,
      valueAed: data.valueAed,
    }))
    .digest('hex')
}

export async function markWalletPassPublished(
  externalId: string,
  revision: number,
  fingerprint: string,
): Promise<void> {
  await prisma.walletPass.updateMany({
    where: { externalId, contentRevision: revision },
    data: {
      publishedRevision: revision,
      contentFingerprint: fingerprint,
      lastSyncedAt: new Date(),
      nextSyncAt: null,
      retryCount: 0,
      lastError: null,
    },
  })
}

async function recordFailure(passId: string, retryCount: number, error: unknown) {
  const nextRetry = Math.min(MAX_BACKOFF_MS, 60_000 * (2 ** Math.min(retryCount, 8)))
  await prisma.walletPass.update({
    where: { id: passId },
    data: {
      retryCount: { increment: 1 },
      nextSyncAt: new Date(Date.now() + nextRetry),
      lastError: (error instanceof Error ? error.message : 'provider sync failed').slice(0, 500),
    },
  })
}

async function syncApplePass(pass: {
  id: string
  externalId: string
  contentRevision: number
  retryCount: number
}) {
  const data = await loadCanonicalWalletData(pass.externalId, 'APPLE', {
    allowInactive: true,
    allowIneligible: true,
  })
  const registrations = await prisma.appleWalletRegistration.findMany({
    where: { walletPassId: pass.id },
    select: { id: true, pushToken: true },
  })
  const failures: string[] = []
  for (const registration of registrations) {
    const result = await sendApplePassPush(registration.pushToken)
    if (result.gone) {
      await prisma.appleWalletRegistration.delete({ where: { id: registration.id } })
    } else if (!result.ok) {
      failures.push(result.reason || `HTTP ${result.status}`)
    }
  }
  if (failures.length) throw new Error(`Apple pass push failed: ${failures[0]}`)
  await markWalletPassPublished(
    pass.externalId,
    pass.contentRevision,
    walletContentFingerprint(data),
  )
}

async function syncGooglePass(pass: {
  externalId: string
  status: 'ACTIVE' | 'INACTIVE' | 'REVOKED'
  contentRevision: number
}) {
  if (pass.status === 'ACTIVE') {
    const data = await loadCanonicalWalletData(pass.externalId, 'GOOGLE')
    await upsertGoogleLoyaltyObject(data)
    await markWalletPassPublished(
      pass.externalId,
      pass.contentRevision,
      walletContentFingerprint(data),
    )
    return
  }
  await deactivateGoogleLoyaltyObject(pass.externalId)
  const fingerprint = crypto
    .createHash('sha256')
    .update(`${pass.status}:${pass.externalId}`)
    .digest('hex')
  await markWalletPassPublished(pass.externalId, pass.contentRevision, fingerprint)
}

export async function processPendingWalletPasses(limit = 25) {
  const passes = await prisma.walletPass.findMany({
    where: {
      status: { in: ['ACTIVE', 'INACTIVE'] },
      nextSyncAt: { lte: new Date() },
    },
    orderBy: { nextSyncAt: 'asc' },
    take: limit,
    select: {
      id: true,
      provider: true,
      externalId: true,
      status: true,
      contentRevision: true,
      retryCount: true,
    },
  })
  let processed = 0
  let failed = 0
  let deferred = 0
  for (const pass of passes) {
    if (!isWalletProviderReady(pass.provider)) {
      deferred += 1
      continue
    }
    try {
      if (pass.provider === 'APPLE') await syncApplePass(pass)
      else await syncGooglePass(pass)
      processed += 1
    } catch (error) {
      failed += 1
      await recordFailure(pass.id, pass.retryCount, error)
    }
  }
  return { found: passes.length, processed, failed, deferred }
}

/**
 * Rotates through active cards and catches direct DB/script changes that did
 * not call markWalletPassesDirty.
 */
export async function reconcileWalletPasses(limit = 50) {
  const passes = await prisma.walletPass.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { lastSyncedAt: { sort: 'asc', nulls: 'first' } },
    take: limit,
    select: {
      id: true,
      userId: true,
      provider: true,
      externalId: true,
      contentFingerprint: true,
      user: {
        select: { discountType: true, discountPercentage: true },
      },
    },
  })
  let dirty = 0
  for (const pass of passes) {
    try {
      if (loyaltyTrackForUser(pass.user) !== 'REWARDS') {
        await deactivateWalletPasses(pass.userId, 'reconciliation-ineligible')
        dirty += 1
        continue
      }
      const data = await loadCanonicalWalletData(pass.externalId, pass.provider)
      const fingerprint = walletContentFingerprint(data)
      if (pass.contentFingerprint && pass.contentFingerprint !== fingerprint) {
        await prisma.walletPass.update({
          where: { id: pass.id },
          data: {
            contentRevision: { increment: 1 },
            contentUpdatedAt: new Date(),
            nextSyncAt: new Date(),
            retryCount: 0,
            lastError: null,
          },
        })
        dirty += 1
      } else {
        await prisma.walletPass.update({
          where: { id: pass.id },
          data: { contentFingerprint: fingerprint, lastSyncedAt: new Date() },
        })
      }
    } catch {
      // The normal sync path owns provider-visible failures. Reconciliation
      // remains bounded and continues to the next pass.
    }
  }
  return { checked: passes.length, dirty }
}
