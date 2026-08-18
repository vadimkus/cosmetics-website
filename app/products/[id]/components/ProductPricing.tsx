'use client'

import { Product } from '@/types'
import { useProductPricing } from '@/hooks/useProductPricing'
import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'

interface ProductPricingProps {
  product: Product
  selectedSize?: string
  selectedColor?: string
}

export default function ProductPricing({ 
  product, 
  selectedSize, 
  selectedColor 
}: ProductPricingProps) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const { currentPrice } = useProductPricing(product, selectedSize, selectedColor)

  if (!user) {
    return (
      <div className="flex items-center text-[var(--cera-muted)]">
        <span className="text-sm">{t('errors.loginToViewPricing')}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-2xl font-bold text-[var(--cera-ink)]">
        {currentPrice.toFixed(2)} AED
      </div>
      <div className="text-sm font-normal text-[var(--cera-body)]">(VAT included)</div>
    </div>
  )
}
