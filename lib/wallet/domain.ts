import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { computeTier, type MemberTier } from '@/lib/membership'
import { getLedgerBalance, loyaltyTrackForUser, POINT_VALUE_AED, TIER_MULTIPLIERS } from '@/lib/loyalty'
import {
  isWalletProviderReady,
  walletSiteOrigin,
  type WalletProvider,
} from '@/lib/wallet/config'
import {
  createInstallToken,
  createWalletQrValue,
  normalizeWalletLocale,
  type WalletLocale,
} from '@/lib/wallet/tokens'

export class WalletRequestError extends Error {
  constructor(
    public readonly code:
      | 'PROVIDER_NOT_CONFIGURED'
      | 'MEMBERSHIP_NOT_FOUND'
      | 'INELIGIBLE_ACCOUNT'
      | 'PASS_NOT_FOUND',
    public readonly status: number,
  ) {
    super(code)
    this.name = 'WalletRequestError'
  }
}

const providerPrefix = (provider: WalletProvider) => provider === 'APPLE' ? 'a' : 'g'

function newExternalId(provider: WalletProvider): string {
  return `${providerPrefix(provider)}_${crypto.randomBytes(18).toString('base64url')}`
}

export async function issueWalletInstallLink(input: {
  userId: string
  provider: WalletProvider
  locale?: unknown
}) {
  if (!isWalletProviderReady(input.provider)) {
    throw new WalletRequestError('PROVIDER_NOT_CONFIGURED', 503)
  }

  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: {
      id: true,
      memberNumber: true,
      discountType: true,
      discountPercentage: true,
    },
  })
  if (!user?.memberNumber) throw new WalletRequestError('MEMBERSHIP_NOT_FOUND', 404)
  if (loyaltyTrackForUser(user) !== 'REWARDS') {
    throw new WalletRequestError('INELIGIBLE_ACCOUNT', 403)
  }

  const locale = normalizeWalletLocale(input.locale)
  const walletPass = await prisma.walletPass.upsert({
    where: { userId_provider: { userId: user.id, provider: input.provider } },
    create: {
      userId: user.id,
      provider: input.provider,
      externalId: newExternalId(input.provider),
      locale,
    },
    update: {
      locale,
      status: 'ACTIVE',
    },
    select: { externalId: true },
  })
  const signed = createInstallToken({
    externalId: walletPass.externalId,
    provider: input.provider,
    locale,
  })
  return {
    provider: input.provider,
    installUrl: `${walletSiteOrigin()}/api/wallet/install?token=${encodeURIComponent(signed.token)}`,
    expiresAt: signed.expiresAt.toISOString(),
  }
}

export type CanonicalWalletData = {
  externalId: string
  provider: WalletProvider
  locale: WalletLocale
  status: 'ACTIVE' | 'INACTIVE' | 'REVOKED'
  revision: number
  name: string
  memberNumber: string
  memberSince: Date
  tier: MemberTier
  multiplier: number
  points: number
  valueAed: number
  totalSpent: number
  totalOrders: number
  qrValue: string
}

export async function loadCanonicalWalletData(
  externalId: string,
  expectedProvider?: WalletProvider,
  options: { allowInactive?: boolean; allowIneligible?: boolean } = {},
): Promise<CanonicalWalletData> {
  const walletPass = await prisma.walletPass.findUnique({
    where: { externalId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          memberNumber: true,
          memberSince: true,
          createdAt: true,
          discountType: true,
          discountPercentage: true,
        },
      },
    },
  })
  if (
    !walletPass ||
    (!options.allowInactive && walletPass.status !== 'ACTIVE') ||
    (expectedProvider && walletPass.provider !== expectedProvider)
  ) {
    throw new WalletRequestError('PASS_NOT_FOUND', 404)
  }
  if (!walletPass.user.memberNumber) {
    throw new WalletRequestError('MEMBERSHIP_NOT_FOUND', 404)
  }
  if (!options.allowIneligible && loyaltyTrackForUser(walletPass.user) !== 'REWARDS') {
    throw new WalletRequestError('INELIGIBLE_ACCOUNT', 403)
  }

  const [orders, points] = await Promise.all([
    prisma.order.aggregate({
      where: { customerEmail: walletPass.user.email, status: 'DELIVERED' },
      _sum: { total: true },
      _count: true,
    }),
    getLedgerBalance(walletPass.user.id),
  ])
  const totalSpent = orders._sum.total ?? 0
  const totalOrders = orders._count ?? 0
  const tier = computeTier(totalSpent, totalOrders)

  return {
    externalId: walletPass.externalId,
    provider: walletPass.provider,
    locale: normalizeWalletLocale(walletPass.locale),
    status: walletPass.status,
    revision: walletPass.contentRevision,
    name: walletPass.user.name,
    memberNumber: walletPass.user.memberNumber,
    memberSince: walletPass.user.memberSince || walletPass.user.createdAt,
    tier,
    multiplier: TIER_MULTIPLIERS[tier],
    points,
    valueAed: Math.round(points * POINT_VALUE_AED * 100) / 100,
    totalSpent: Math.round(totalSpent * 100) / 100,
    totalOrders,
    qrValue: createWalletQrValue(walletPass.externalId),
  }
}
