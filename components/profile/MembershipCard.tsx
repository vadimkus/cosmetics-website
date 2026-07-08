'use client'

import { useEffect, useState } from 'react'
import { Award, Building, Gift, TrendingUp } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

type Tier = 'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM'

interface MembershipData {
  success: boolean
  track: 'REWARDS' | 'PARTNER'
  memberNumber: string | null
  tier?: Tier
  multiplier?: number
  points?: { balance: number; valueAed: number }
  tierProgress?: {
    currentSpent: number
    nextTier: Tier | null
    nextTierAt: number
    progressPercent: number
  }
  stats?: { totalOrders: number; totalSpent: number }
  partner?: { discountType: string | null; discountPercentage: number | null }
}

const TIER_STYLES: Record<Tier, { badge: string; bar: string }> = {
  MEMBER: { badge: 'bg-gray-100 text-gray-700', bar: 'bg-gray-400' },
  SILVER: { badge: 'bg-slate-200 text-slate-700', bar: 'bg-slate-400' },
  GOLD: { badge: 'bg-amber-100 text-amber-800', bar: 'bg-amber-400' },
  PLATINUM: { badge: 'bg-gray-900 text-white', bar: 'bg-gray-900' },
}

export default function MembershipCard() {
  const { t } = useTranslation()
  const [data, setData] = useState<MembershipData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/user/membership', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : null))
      .then(json => {
        if (!cancelled && json?.success) setData(json)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-xl border border-gray-100 p-4 md:p-6 mb-3 md:mb-6 lg:mb-8 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
        <div className="h-8 bg-gray-100 rounded w-1/2" />
      </div>
    )
  }

  if (!data) return null

  // Professional Partner track
  if (data.track === 'PARTNER') {
    return (
      <div className="bg-gray-900 text-white rounded-xl md:rounded-2xl shadow-sm md:shadow-xl p-4 md:p-6 mb-3 md:mb-6 lg:mb-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{t('rewards.professionalPartner')}</p>
              <p className="text-xs text-gray-400">
                {data.partner?.discountPercentage}% {t('rewards.partnerPricing')}
              </p>
            </div>
          </div>
          {data.memberNumber && (
            <span className="text-[10px] md:text-xs text-gray-400 tracking-widest">{data.memberNumber}</span>
          )}
        </div>
      </div>
    )
  }

  const tier = data.tier || 'MEMBER'
  const style = TIER_STYLES[tier]
  const progress = data.tierProgress

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-xl border border-gray-100 p-4 md:p-6 mb-3 md:mb-6 lg:mb-8">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary-600" />
          <h3 className="text-sm md:text-base font-semibold text-gray-900">{t('rewards.title')}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${style.badge}`}>
          {t(`rewards.tier.${tier.toLowerCase()}`)}
        </span>
      </div>

      {/* Points balance */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <p className="text-3xl md:text-4xl font-bold text-gray-900">
            {(data.points?.balance ?? 0).toLocaleString()}
            <span className="text-sm md:text-base font-medium text-gray-500 ml-1.5">{t('rewards.points')}</span>
          </p>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            ≈ AED {(data.points?.valueAed ?? 0).toLocaleString()} {t('rewards.inValue')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 flex items-center gap-1 justify-end">
            <TrendingUp className="h-3.5 w-3.5" />
            {data.multiplier}x {t('rewards.earnRate')}
          </p>
          {data.memberNumber && (
            <p className="text-[10px] md:text-xs text-gray-400 tracking-widest mt-1">{data.memberNumber}</p>
          )}
        </div>
      </div>

      {/* Progress to next tier */}
      {progress?.nextTier ? (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>
              AED {progress.currentSpent.toLocaleString()} {t('rewards.spent')}
            </span>
            <span>
              {t(`rewards.tier.${progress.nextTier.toLowerCase()}`)} {t('rewards.atSpend')} AED{' '}
              {progress.nextTierAt.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${style.bar} transition-all`}
              style={{ width: `${Math.min(progress.progressPercent, 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Gift className="h-3.5 w-3.5" />
          {t('rewards.topTier')}
        </p>
      )}
    </div>
  )
}
