'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import { canUserSeePrices } from '@/lib/discountUtils'
import { getPricingDisplay } from '@/lib/pricingDisplay'
import type { Product } from '@/types'

interface RoutineProductChipProps {
  product: Product | null
  name: string
  price: string
  url: string
}

export default function RoutineProductChip({
  product,
  name,
  price,
  url,
}: RoutineProductChipProps) {
  const router = useRouter()
  const { addItem, removeItem, items } = useCart()
  const { user } = useAuth()
  const [justAdded, setJustAdded] = useState(false)

  const inCart =
    product &&
    items.some(
      (i) => String(i.product?.id) === String(product.id)
    )

  const pricing = useMemo(() => {
    if (!product || product.isPriceOnRequest) return null
    if (!canUserSeePrices(user)) return null
    return getPricingDisplay(product, user)
  }, [product, user])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!product || product.isPriceOnRequest || product.inStock === false) {
        router.push(url)
        return
      }

      if (inCart) {
        const cartEntry = items.find(
          (i) => String(i.product?.id) === String(product.id)
        )
        removeItem(
          String(product.id),
          cartEntry?.selectedColor ?? '',
          cartEntry?.selectedSize ?? ''
        )
      } else {
        addItem(product, 1, '', '')
        setJustAdded(true)
        setTimeout(() => setJustAdded(false), 1200)
      }
    },
    [addItem, removeItem, inCart, items, product, router, url]
  )

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      router.push(url)
    },
    [router, url]
  )

  const showCheck = justAdded || inCart

  const renderPrice = () => {
    if (!canUserSeePrices(user)) return null

    if (pricing?.hasDiscount) {
      return (
        <>
          <span className={showCheck ? 'text-[var(--cera-ok)] font-semibold' : 'text-primary-600 font-semibold'}>
            AED {pricing.displayPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          {pricing.originalPrice ? (
            <span className="text-gray-400 line-through text-[10px]">
              {pricing.originalPrice.toLocaleString()}
            </span>
          ) : null}
        </>
      )
    }

    if (pricing) {
      return (
        <span className={showCheck ? 'text-[var(--cera-ok)]' : 'text-gray-500'}>
          AED {pricing.displayPrice.toLocaleString()}
        </span>
      )
    }

    return (
      <span className={showCheck ? 'text-[var(--cera-ok)]' : 'text-gray-500'}>
        {price}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`inline-flex items-center gap-1.5 text-xs rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer border select-none ${
        showCheck
          ? 'bg-[var(--cera-ok-bg)] border-[var(--cera-ok-line)] ring-1 ring-[var(--cera-ok-line)]'
          : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
      }`}
      title={product ? (showCheck ? 'Click to remove · Hold to view product' : 'Click to add to bag · Hold to view product') : ''}
    >
      {showCheck && (
        <Check className="h-3 w-3 text-[var(--cera-ok)] flex-shrink-0" />
      )}
      <span
        className={`font-medium ${showCheck ? 'text-[var(--cera-ok)]' : 'text-gray-800'}`}
      >
        {name}
      </span>
      <span className={showCheck ? 'text-[var(--cera-ok)]' : 'text-gray-400'}>·</span>
      {renderPrice()}
    </button>
  )
}
