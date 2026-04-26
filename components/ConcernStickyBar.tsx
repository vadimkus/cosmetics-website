'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, ChevronUp, ChevronDown, X } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import { canUserSeePrices } from '@/lib/discountUtils'
import { getPricingDisplay } from '@/lib/pricingDisplay'
import { getLocalizedPath } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

interface ConcernStickyBarProps {
  locale?: Locale
}

export default function ConcernStickyBar({ locale = 'en' }: ConcernStickyBarProps) {
  const router = useRouter()
  const { items } = useCart()
  const { user } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  )

  const canSee = canUserSeePrices(user)

  const { retailTotal, discountTotal, savings } = useMemo(() => {
    if (!canSee) return { retailTotal: 0, discountTotal: 0, savings: 0 }
    let retail = 0
    let disc = 0
    for (const item of items) {
      const pricing = getPricingDisplay(item.product, user)
      retail += (pricing.originalPrice || pricing.displayPrice) * item.quantity
      disc += pricing.displayPrice * item.quantity
    }
    return {
      retailTotal: Math.round(retail),
      discountTotal: Math.round(disc),
      savings: Math.round(retail - disc),
    }
  }, [items, user, canSee])

  const handleViewBag = useCallback(() => {
    router.push(getLocalizedPath('/cart', locale))
  }, [router, locale])

  if (!isClient || totalItems === 0) return null

  const labels = {
    en: { viewBag: 'View Bag', items: 'items', item: 'item', youSave: 'You save', aed: 'AED', freeShipping: 'Free shipping over AED 200' },
    ar: { viewBag: 'عرض الحقيبة', items: 'عناصر', item: 'عنصر', youSave: 'توفير', aed: 'درهم', freeShipping: 'شحن مجاني فوق 200 درهم' },
    ru: { viewBag: 'Корзина', items: 'товаров', item: 'товар', youSave: 'Экономия', aed: 'AED', freeShipping: 'Бесплатная доставка от 200 AED' },
  }
  const t = labels[locale] || labels.en

  return (
    <>
      {/* Spacer to prevent content from being hidden */}
      <div className="h-[72px] md:hidden" aria-hidden="true" />

      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Expanded panel */}
        {expanded && (
          <div className="bg-white border-t border-gray-200 shadow-lg px-4 pt-3 pb-2 max-h-[50vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-900">
                {totalItems} {totalItems === 1 ? t.item : t.items}
              </span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item, idx) => {
                const pricing = canSee ? getPricingDisplay(item.product, user) : null
                return (
                  <div key={`${item.product.id}-${idx}`} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 truncate max-w-[60%]">
                      {item.product.name} {item.quantity > 1 && <span className="text-gray-400">x{item.quantity}</span>}
                    </span>
                    {pricing && (
                      <span className="flex items-center gap-1.5 flex-shrink-0">
                        {pricing.hasDiscount ? (
                          <>
                            <span className="font-semibold text-primary-600">
                              {t.aed} {(pricing.displayPrice * item.quantity).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                            {pricing.originalPrice ? (
                              <span className="text-gray-400 line-through text-xs">
                                {(pricing.originalPrice * item.quantity).toLocaleString()}
                              </span>
                            ) : null}
                          </>
                        ) : (
                          <span className="font-medium text-gray-900">
                            {t.aed} {(pricing.displayPrice * item.quantity).toLocaleString()}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            {canSee && savings > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-sm">
                <span className="text-green-600 font-medium">{t.youSave}</span>
                <span className="text-green-600 font-semibold">{t.aed} {savings.toLocaleString()}</span>
              </div>
            )}
            {canSee && discountTotal < 200 && (
              <p className="text-[10px] text-gray-400 mt-1">{t.freeShipping}</p>
            )}
          </div>
        )}

        {/* Collapsed bar */}
        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="relative flex-shrink-0"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            </button>

            {canSee && (
              <div className="flex-1 min-w-0">
                {savings > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {t.aed} {discountTotal.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      {retailTotal.toLocaleString()}
                    </span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                      -{Math.round((savings / retailTotal) * 100)}%
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-bold text-gray-900">
                    {t.aed} {retailTotal.toLocaleString()}
                  </span>
                )}
              </div>
            )}

            {!canSee && (
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-600">
                  {totalItems} {totalItems === 1 ? t.item : t.items}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-gray-400 flex-shrink-0"
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleViewBag}
              className="flex-shrink-0 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 active:scale-95 transition-all"
            >
              {t.viewBag}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
