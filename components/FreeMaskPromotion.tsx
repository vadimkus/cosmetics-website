'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Gift, Clock } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface FreeMaskPromotionProps {
  subtotal: number
}

export default function FreeMaskPromotion({ subtotal }: FreeMaskPromotionProps) {
  const { t, locale, dir } = useTranslation()
  const THRESHOLD_500 = 500
  const THRESHOLD_700 = 700

  // Calculate how much more is needed
  const remainingTo500 = Math.max(0, THRESHOLD_500 - subtotal)
  const remainingTo700 = Math.max(0, THRESHOLD_700 - subtotal)

  // Determine current status
  const qualifiesFor500 = subtotal >= THRESHOLD_500
  const qualifiesFor700 = subtotal >= THRESHOLD_700

  // Calculate progress percentages
  const progressTo500 = Math.min(100, (subtotal / THRESHOLD_500) * 100)
  const progressTo700 = Math.min(100, (subtotal / THRESHOLD_700) * 100)

  return (
    <div className={`border-t border-gray-200 pt-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
      <div className="mb-4">
        <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <Gift className={`h-5 w-5 ${qualifiesFor500 || qualifiesFor700 ? 'text-green-600' : 'text-primary-600'}`} />
          <h3 className={`text-lg font-semibold text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}>
            {t('cart.freeMaskPromotion')}
          </h3>
        </div>
        <div className={`mt-1.5 ${dir === 'rtl' ? 'text-right' : ''}`}>
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-gray-600 px-2.5 py-1 text-xs font-medium ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            {t('cart.validUntil')}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* 500 AED Threshold */}
        <div className={`p-4 border border-gray-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
          <div className={`flex items-center justify-between mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <span className={`text-sm font-medium text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t('cart.spendAed500')}
            </span>
            {qualifiesFor500 ? (
              <span className="text-xs font-semibold text-green-600">
                {t('cart.unlocked')}
              </span>
            ) : (
              <span className="text-xs text-gray-600">
                {remainingTo500 > 0 ? `AED ${remainingTo500.toFixed(2)} ${t('cart.more')}` : ''}
              </span>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                qualifiesFor500 ? 'bg-green-600' : 'bg-gray-400'
              }`}
              style={{ width: `${progressTo500}%` }}
            />
          </div>

          <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Link href={getLocalizedPath('/products/53', locale)} className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded border border-gray-200 overflow-hidden bg-gray-50 hover:border-primary-500 transition-colors">
              <Image
                src="/images/collagen_mask/Main.jpeg"
                alt="GENOSYS Collagen Mask - Free Korean dermacosmetics skincare product"
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </Link>
            <Link href={getLocalizedPath('/products/53', locale)} className={`text-sm text-gray-700 hover:text-primary-600 transition-colors ${dir === 'rtl' ? 'text-right' : ''}`}>
              {qualifiesFor500 ? (
                <span className="font-medium text-green-600">
                  {t('cart.oneFreeCollagenMask')}
                </span>
              ) : (
                <span>{t('cart.oneFreeCollagenMask')}</span>
              )}
            </Link>
          </div>
        </div>

        {/* 700 AED Threshold */}
        <div className={`p-4 border border-gray-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
          <div className={`flex items-center justify-between mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <span className={`text-sm font-medium text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t('cart.spendAed700')}
            </span>
            {qualifiesFor700 ? (
              <span className="text-xs font-semibold text-green-600">
                {t('cart.unlocked')}
              </span>
            ) : (
              <span className="text-xs text-gray-600">
                {remainingTo700 > 0 ? `AED ${remainingTo700.toFixed(2)} ${t('cart.more')}` : ''}
              </span>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                qualifiesFor700 ? 'bg-green-600' : 'bg-gray-400'
              }`}
              style={{ width: `${progressTo700}%` }}
            />
          </div>

          <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Link href={getLocalizedPath('/products/36', locale)} className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded border border-gray-200 overflow-hidden bg-gray-50 hover:border-primary-500 transition-colors">
                <Image
                  src="/images/SEA.jpg"
                  alt="GENOSYS Sea Algae Mask - Free Korean dermacosmetics skincare product"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </Link>
              <Link href={getLocalizedPath('/products/53', locale)} className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded border border-gray-200 overflow-hidden bg-gray-50 hover:border-primary-500 transition-colors">
                <Image
                  src="/images/collagen_mask/Main.jpeg"
                  alt="GENOSYS Collagen Mask - Free Korean dermacosmetics skincare product"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
            <Link href={getLocalizedPath('/products/36', locale)} className={`text-sm text-gray-700 hover:text-primary-600 transition-colors ${dir === 'rtl' ? 'text-right' : ''}`}>
              {qualifiesFor700 ? (
                <span className="font-medium text-green-600">
                  {t('cart.twoFreeMasks')}
                </span>
              ) : (
                <span>{t('cart.twoFreeMasks')}</span>
              )}
            </Link>
          </div>
        </div>

        {/* Current Status Summary */}
        {(qualifiesFor500 || qualifiesFor700) && (
          <div className={`mt-4 p-3 bg-green-50 border border-green-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
            <p className={`text-sm font-medium text-green-800 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {qualifiesFor700
                ? t('cart.qualifyForTwoFreeMasks')
                : t('cart.qualifyForOneFreeMask')}
            </p>
            <p className={`text-xs text-green-700 mt-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t('cart.freeMasksAutoAdded')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

