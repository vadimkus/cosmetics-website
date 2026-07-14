'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Product } from '@/types'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { ROUTINE_STEP_PRODUCT_IDS } from '@/lib/routineStepLinks'
import { PRODUCT_ROUTINES, type ProductRoutine } from '@/lib/productRoutines'
import { getRoutineStepImage } from '@/lib/routineStepImages'

/** Cerabarrier 66 is intentionally outside PRODUCT_ROUTINES (bespoke block). */
const CERABARRIER_ROUTINE: ProductRoutine = {
  headingKey: 'recommendedBarrierCareRoutine',
  steps: [
    { titleKey: 'routineCerabarrierCleanserTitle', descKey: 'routineCerabarrierCleanserDesc' },
    { titleKey: 'routineMicrobiomeMistTitle', descKey: 'routineMicrobiomeMistDesc' },
    { titleKey: 'routineAllForSensitiveSerumTitle', descKey: 'routineAllForSensitiveSerumDesc' },
    { titleKey: 'routineSkinBarrierCreamTitle', descKey: 'routineSkinBarrierCreamDesc' },
    { titleKey: 'routineMultiSunCreamTitle', descKey: 'routineMultiSunCreamDesc' },
  ],
}

function resolveRoutine(product: Product): ProductRoutine | null {
  const key = String(product.productNumber || product.id)
  if (key === '66') return CERABARRIER_ROUTINE
  return PRODUCT_ROUTINES[key] || null
}

interface ProductRoutineCardProps {
  product: Product
  /** Visibility / spacing classes, e.g. `hidden md:block mt-4` or `md:hidden mt-4` */
  className?: string
}

/**
 * Shared Recommended Routine card for PDPs.
 * Pass `hidden md:block` for desktop left column, `md:hidden` for mobile content column.
 */
export default function ProductRoutineCard({ product, className = '' }: ProductRoutineCardProps) {
  const { t, locale, dir } = useTranslation()
  const routine = resolveRoutine(product)
  if (!routine) return null

  const routineTitle = (key: string) => {
    const pid = ROUTINE_STEP_PRODUCT_IDS[key]
    const label = t(`product.${key}`)
    if (!pid || String(product.id) === pid || String(product.productNumber || '') === pid) return label
    return (
      <Link
        href={getLocalizedPath(`/products/${pid}`, locale)}
        className="underline decoration-gray-300 underline-offset-2 transition-colors hover:text-primary-700 hover:decoration-primary-400"
      >
        {label}
      </Link>
    )
  }

  const RoutineStepMarker = ({ n, titleKey }: { n: number; titleKey: string }) => {
    const img = getRoutineStepImage(titleKey)
    const numberCircle = (
      <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">
        {n}
      </span>
    )
    if (!img) return numberCircle
    const pid = ROUTINE_STEP_PRODUCT_IDS[titleKey]
    const isSelf = !pid || String(product.id) === pid || String(product.productNumber || '') === pid
    const thumb = (
      <Image
        src={img}
        alt=""
        width={56}
        height={56}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-gray-200 bg-white"
      />
    )
    return (
      <span className={`flex-shrink-0 flex items-start gap-1.5 sm:gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        {numberCircle}
        {isSelf ? (
          <span className="flex-shrink-0 block mt-0.5">{thumb}</span>
        ) : (
          <Link
            href={getLocalizedPath(`/products/${pid}`, locale)}
            className="flex-shrink-0 block mt-0.5 transition-opacity hover:opacity-80"
            aria-label={t(`product.${titleKey}`)}
          >
            {thumb}
          </Link>
        )}
      </span>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md ${className}`.trim()}>
      <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary-600 flex-shrink-0" />
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">
          {t(`product.${routine.headingKey}`)}
        </h3>
      </div>
      <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
        {routine.steps.map((routineStep, idx) => (
          <div
            key={routineStep.titleKey}
            className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}
          >
            <RoutineStepMarker n={idx + 1} titleKey={routineStep.titleKey} />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">
                {routineTitle(routineStep.titleKey)}
              </h4>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">
                {t(`product.${routineStep.descKey}`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
