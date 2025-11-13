'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Gift } from 'lucide-react'

interface FreeMaskPromotionProps {
  subtotal: number
}

export default function FreeMaskPromotion({ subtotal }: FreeMaskPromotionProps) {
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
    <div className="border-t border-gray-200 pt-6">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Free Mask Promotion
          </h3>
        </div>
        <p className="text-xs font-bold text-red-600 mt-1">
          Valid until 01/12/2025
        </p>
      </div>

      <div className="space-y-4">
        {/* 500 AED Threshold */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">
              Spend AED 500
            </span>
            {qualifiesFor500 ? (
              <span className="text-xs font-semibold text-green-600">
                ✓ Unlocked
              </span>
            ) : (
              <span className="text-xs text-gray-600">
                {remainingTo500 > 0 ? `AED ${remainingTo500.toFixed(2)} more` : ''}
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

          <div className="flex items-center gap-2">
            <Link href="/products/53" className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded border border-gray-200 overflow-hidden bg-gray-50 hover:border-primary-500 transition-colors">
              <Image
                src="/images/in.png"
                alt="Collagen Mask"
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </Link>
            <Link href="/products/53" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
              {qualifiesFor500 ? (
                <span className="font-medium text-green-600">
                  1 Free Collagen Mask
                </span>
              ) : (
                <span>1 Free Collagen Mask</span>
              )}
            </Link>
          </div>
        </div>

        {/* 700 AED Threshold */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">
              Spend AED 700
            </span>
            {qualifiesFor700 ? (
              <span className="text-xs font-semibold text-green-600">
                ✓ Unlocked
              </span>
            ) : (
              <span className="text-xs text-gray-600">
                {remainingTo700 > 0 ? `AED ${remainingTo700.toFixed(2)} more` : ''}
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

          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Link href="/products/36" className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded border border-gray-200 overflow-hidden bg-gray-50 hover:border-primary-500 transition-colors">
                <Image
                  src="/images/SEA.jpg"
                  alt="Sea Algae Mask"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </Link>
              <Link href="/products/53" className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded border border-gray-200 overflow-hidden bg-gray-50 hover:border-primary-500 transition-colors">
                <Image
                  src="/images/in.png"
                  alt="Collagen Mask"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
            <Link href="/products/36" className="text-sm text-gray-700 hover:text-primary-600 transition-colors">
              {qualifiesFor700 ? (
                <span className="font-medium text-green-600">
                  2 Free Masks (Sea Algae Mask + Collagen Mask)
                </span>
              ) : (
                <span>2 Free Masks (Sea Algae Mask + Collagen Mask)</span>
              )}
            </Link>
          </div>
        </div>

        {/* Current Status Summary */}
        {(qualifiesFor500 || qualifiesFor700) && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800">
              {qualifiesFor700
                ? 'You qualify for 2 Free Masks!'
                : 'You qualify for 1 Free Mask!'}
            </p>
            <p className="text-xs text-green-700 mt-1">
              Free masks will be automatically added to your order at checkout
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

