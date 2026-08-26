'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Product } from '@/types'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { ROUTINE_STEP_PRODUCT_IDS } from '@/lib/routineStepLinks'
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import { getRoutineStepImage } from '@/lib/routineStepImages'

function resolveRoutine(product: Product) {
  const key = String(product.productNumber || product.id)
  return PRODUCT_ROUTINES[key] || null
}

interface ProductRoutineCardProps {
  product: Product
  /** Visibility / spacing classes, e.g. `hidden md:block mt-4` or `md:hidden mt-4` */
  className?: string
}

/**
 * Shared Recommended Routine card for every routine in PRODUCT_ROUTINES.
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
      <span
        aria-hidden="true"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold tabular-nums text-white shadow-sm ring-2 ring-white sm:h-8 sm:w-8 sm:text-sm"
      >
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
        className="h-14 w-14 rounded-xl border border-[var(--color-border-primary)] bg-white object-cover shadow-sm sm:h-16 sm:w-16"
      />
    )
    return (
      <span className="relative block h-14 w-14 flex-shrink-0 sm:h-16 sm:w-16">
        {isSelf ? (
          <span className="block">{thumb}</span>
        ) : (
          <Link
            href={getLocalizedPath(`/products/${pid}`, locale)}
            className="block rounded-xl transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            aria-label={t(`product.${titleKey}`)}
          >
            {thumb}
          </Link>
        )}
        <span className={`pointer-events-none absolute -top-1.5 ${dir === 'rtl' ? '-right-1.5' : '-left-1.5'}`}>
          {numberCircle}
        </span>
      </span>
    )
  }

  return (
    <div className={`bg-white border border-[var(--color-border-primary)] rounded-xl p-3 sm:p-4 md:p-6 shadow-md ${className}`.trim()}>
      <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary-600 flex-shrink-0" />
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-[var(--color-text-primary)] leading-tight">
          {t(`product.${routine.headingKey}`)}
        </h3>
      </div>
      <ol className="list-none space-y-3 sm:space-y-4">
        {routine.steps.map((routineStep, idx) => (
          <li
            key={routineStep.titleKey}
            className={`flex items-start gap-3 sm:gap-4 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}
          >
            <RoutineStepMarker n={idx + 1} titleKey={routineStep.titleKey} />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[var(--color-text-primary)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">
                {routineTitle(routineStep.titleKey)}
              </h4>
              <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm leading-relaxed break-words">
                {t(`product.${routineStep.descKey}`)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
