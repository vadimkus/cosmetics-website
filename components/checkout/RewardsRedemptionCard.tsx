'use client'

import { Award, Minus, Plus } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface RewardsRedemptionCardProps {
  balance: number
  selectedPoints: number
  maxPoints: number
  blockPoints: number
  blockAed: number
  maxOrderFraction: number
  eligible: boolean
  disabledReason?: string | null
  onChange: (points: number) => void
}

export default function RewardsRedemptionCard({
  balance,
  selectedPoints,
  maxPoints,
  blockPoints,
  blockAed,
  maxOrderFraction,
  eligible,
  disabledReason,
  onChange,
}: RewardsRedemptionCardProps) {
  const { t, dir } = useTranslation()
  const isRtl = dir === 'rtl'
  const applied = selectedPoints > 0
  const selectedAed = (selectedPoints / blockPoints) * blockAed
  const balanceValueAed = (balance / blockPoints) * blockAed
  const canApply = eligible && maxPoints >= blockPoints

  const clamp = (points: number) => {
    const blocks = Math.floor(Math.max(0, Math.min(points, maxPoints)) / blockPoints)
    onChange(blocks * blockPoints)
  }

  const toggle = () => onChange(applied ? 0 : maxPoints)
  const unavailableMessage =
    disabledReason === 'ACCOUNT_DISCOUNT'
      ? t('rewards.redemptionAccountDiscount')
      : disabledReason === 'PARTNER_PRICING'
        ? t('rewards.redemptionPartnerPricing')
        : balance < blockPoints
          ? t('rewards.redemptionMinimum', { points: blockPoints.toLocaleString() })
          : t('rewards.redemptionOrderMinimum')

  return (
    <section
      className={`cera-card p-4 md:p-6 ${isRtl ? 'text-right' : ''}`}
      aria-labelledby="checkout-rewards-title"
    >
      <div className={`flex items-start justify-between gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-start gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <span className="ed-mark ed-mark--tactile ed-mark--round h-10 w-10 shrink-0">
            <Award className="h-5 w-5 text-[var(--status-blue)]" aria-hidden="true" />
          </span>
          <div>
            <h2 id="checkout-rewards-title" className="font-semibold text-[var(--color-text-primary)]">
              {t('rewards.title')}
            </h2>
            <p className="mt-0.5 text-xs md:text-sm text-[var(--color-text-secondary)]">
              {t('rewards.availableBalance', {
                points: balance.toLocaleString(),
                value: balanceValueAed.toFixed(2),
              })}
            </p>
          </div>
        </div>

        {canApply && (
          <label className={`flex shrink-0 cursor-pointer items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <input
              type="checkbox"
              checked={applied}
              onChange={toggle}
              className="h-5 w-5 rounded border-[var(--color-border-secondary)] text-[var(--status-blue)] focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-[var(--status-blue)]">
              {t('rewards.apply')}
            </span>
          </label>
        )}
      </div>

      {canApply ? (
        <>
          {applied && (
            <div className="mt-4 rounded-xl border border-[var(--cera-line)] bg-white p-3">
              <div className={`flex items-center justify-between gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className="text-sm font-semibold text-[var(--status-blue)]">
                    {selectedPoints.toLocaleString()} {t('rewards.points')}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    {t('rewards.redemptionValue', { value: selectedAed.toFixed(2) })}
                  </p>
                </div>
                <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="button"
                    onClick={() => clamp(selectedPoints - blockPoints)}
                    disabled={selectedPoints <= blockPoints}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-secondary)] text-[var(--color-text-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={t('rewards.decreaseRedemption')}
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => clamp(selectedPoints + blockPoints)}
                    disabled={selectedPoints >= maxPoints}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-secondary)] text-[var(--color-text-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={t('rewards.increaseRedemption')}
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {maxPoints > blockPoints && (
                <input
                  type="range"
                  min={blockPoints}
                  max={maxPoints}
                  step={blockPoints}
                  value={selectedPoints}
                  onChange={(event) => clamp(Number(event.target.value))}
                  className="mt-3 w-full accent-blue-600"
                  aria-label={t('rewards.redemptionAmount')}
                />
              )}

              <div className={`mt-2 flex justify-between text-[11px] text-[var(--color-text-tertiary)] ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span>{blockPoints.toLocaleString()} {t('rewards.points')}</span>
                <button
                  type="button"
                  onClick={() => onChange(maxPoints)}
                  className="font-semibold text-[var(--status-blue)] hover:text-[var(--cera-ink)]"
                >
                  {t('rewards.useMaximum')} ({maxPoints.toLocaleString()} {t('rewards.points')})
                </button>
              </div>
            </div>
          )}

          <p className="mt-3 text-xs leading-5 text-[var(--color-text-secondary)]">
            {t('rewards.redemptionRules', {
              points: blockPoints.toLocaleString(),
              value: blockAed.toFixed(0),
              percent: Math.round(maxOrderFraction * 100),
            })}
          </p>
        </>
      ) : (
        <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs leading-5 text-[var(--color-text-secondary)]">
          {unavailableMessage}
        </p>
      )}
    </section>
  )
}
