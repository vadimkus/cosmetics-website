'use client'

import { useState } from 'react'
import { Award, Building, ChevronDown, Gift, TrendingUp } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { MembershipTier, useMembershipData } from '@/hooks/useMembershipData'

const TIER_STYLES: Record<MembershipTier, { badge: string; bar: string }> = {
  MEMBER: { badge: 'bg-[var(--cera-cream-deep)] text-[var(--cera-body)]', bar: 'bg-[var(--cera-blush-deep)]' },
  SILVER: { badge: 'bg-slate-200 text-slate-700', bar: 'bg-slate-400' },
  GOLD: { badge: 'bg-amber-100 text-amber-800', bar: 'bg-amber-400' },
  PLATINUM: { badge: 'bg-[var(--cera-cta)] text-white', bar: 'bg-[var(--cera-cta)]' },
}

const TIERS: MembershipTier[] = ['MEMBER', 'SILVER', 'GOLD', 'PLATINUM']

export default function MembershipCard() {
  const { t, dir } = useTranslation()
  const { data, loading } = useMembershipData()
  const [expanded, setExpanded] = useState(false)

  if (loading) {
    return (
      <div className="animate-pulse rounded-3xl border border-[var(--cera-line)] bg-white p-5 shadow-[0_14px_40px_-28px_rgba(23,20,15,0.26)] md:p-6">
        <div className="h-4 bg-[var(--cera-cream-deep)] rounded w-1/3 mb-3" />
        <div className="h-8 bg-[var(--cera-cream-deep)] rounded w-1/2" />
      </div>
    )
  }

  if (!data) return null

  // Professional Partner track
  if (data.track === 'PARTNER') {
    return (
      <div className="overflow-hidden rounded-3xl bg-[var(--cera-cta)] text-white shadow-[0_14px_40px_-26px_rgba(23,20,15,0.5)]">
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
          className={`w-full p-5 md:p-6 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t('rewards.professionalPartner')}</p>
                <p className="text-xs text-white/55">
                  {data.partner?.discountPercentage}% {t('rewards.partnerPricing')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {data.memberNumber && (
                <span className="text-[10px] md:text-xs text-white/55 tracking-widest">{data.memberNumber}</span>
              )}
              <ChevronDown className={`h-4 w-4 text-white/55 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </button>

        {expanded && (
          <div className="px-4 md:px-6 pb-5 md:pb-6 border-t border-white/10">
            <p className="text-xs uppercase tracking-widest text-white/55 mt-4 mb-3">{t('rewards.partnerStatusTitle')}</p>
            <div className="bg-white/5 rounded-xl p-4 text-center mb-4">
              <p className="text-xs text-white/55">{t('rewards.partnerPricingLabel')}</p>
              <p className="text-3xl font-bold mt-1">{data.partner?.discountPercentage}% {t('rewards.off')}</p>
              <p className="text-xs text-white/55 mt-1">{t('rewards.partnerAppliedAuto')}</p>
            </div>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed">{t('rewards.partnerThanks')}</p>
          </div>
        )}
      </div>
    )
  }

  const tier = data.tier || 'MEMBER'
  const style = TIER_STYLES[tier]
  const progress = data.tierProgress

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--cera-line)] bg-white shadow-[0_14px_40px_-28px_rgba(23,20,15,0.26)]">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        className={`w-full p-5 md:p-6 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[var(--cera-rose-ink)]" />
            <h3 className="text-sm font-semibold text-[var(--cera-ink)] md:text-base">{t('rewards.title')}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${style.badge}`}>
              {t(`rewards.tier.${tier.toLowerCase()}`)}
            </span>
            <ChevronDown className={`h-4 w-4 text-[var(--cera-muted)] transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Points balance */}
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <p className="cera-serif cera-numeral text-[32px] leading-none text-[var(--cera-ink)] md:text-[38px]">
              {(data.points?.balance ?? 0).toLocaleString()}
              <span className="text-sm md:text-base font-medium text-[var(--cera-muted)] ml-1.5">{t('rewards.points')}</span>
            </p>
            <p className="text-xs md:text-sm text-[var(--cera-muted)] mt-0.5">
              ≈ AED {(data.points?.valueAed ?? 0).toLocaleString()} {t('rewards.inValue')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--cera-muted)] flex items-center gap-1 justify-end">
              <TrendingUp className="h-3.5 w-3.5" />
              {data.multiplier}x {t('rewards.earnRate')}
            </p>
            {data.memberNumber && (
              <p className="text-[10px] md:text-xs text-[var(--cera-muted)] tracking-widest mt-1">{data.memberNumber}</p>
            )}
          </div>
        </div>

        {/* Progress to next tier */}
        {progress?.nextTier ? (
          <div>
            <div className="flex justify-between text-xs text-[var(--cera-muted)] mb-1.5">
              <span>
                AED {progress.currentSpent.toLocaleString()} {t('rewards.spent')}
              </span>
              <span>
                {t(`rewards.tier.${progress.nextTier.toLowerCase()}`)} {t('rewards.atSpend')} AED{' '}
                {progress.nextTierAt.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2 bg-[var(--cera-cream-deep)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${style.bar} transition-all`}
                style={{ width: `${Math.min(progress.progressPercent, 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-[var(--cera-muted)] flex items-center gap-1">
            <Gift className="h-3.5 w-3.5" />
            {t('rewards.topTier')}
          </p>
        )}
      </button>

      {/* Expanded: how it works + tier table */}
      {expanded && (
        <div className="px-4 md:px-6 pb-5 md:pb-6 border-t border-[var(--cera-line)]">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--cera-muted)] mt-4 mb-2">
            {t('rewards.howItWorksTitle')}
          </p>
          <p className="text-xs md:text-sm text-[var(--cera-body)] leading-relaxed mb-4">{t('rewards.howItWorksBody')}</p>

          <div className="rounded-xl border border-[var(--cera-line)] overflow-hidden">
            {TIERS.map((tr, i) => {
              const isCurrent = tr === tier
              return (
                <div
                  key={tr}
                  className={`flex items-start gap-3 px-3 py-2.5 ${i > 0 ? 'border-t border-[var(--cera-line)]' : ''} ${
                    isCurrent ? 'bg-[var(--cera-blush)]' : 'bg-white'
                  }`}
                >
                  <span
                    className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${TIER_STYLES[tr].badge}`}
                  >
                    {t(`rewards.tier.${tr.toLowerCase()}`)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] md:text-xs text-[var(--cera-muted)]">{t(`rewards.tierReq.${tr.toLowerCase()}`)}</p>
                    <p className="text-[11px] md:text-xs text-[var(--cera-ink)] font-medium">
                      {t(`rewards.tierPerk.${tr.toLowerCase()}`)}
                      {isCurrent && (
                        <span className="ml-1.5 text-[var(--cera-rose-ink)] font-semibold">• {t('rewards.yourTier')}</span>
                      )}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
