'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'
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
    return calculateDiscountedPrice(product, user)
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
          <span className={showCheck ? 'text-green-600 font-semibold' : 'text-primary-600 font-semibold'}>
            AED {pricing.discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span className="text-gray-400 line-through text-[10px]">
            {pricing.originalPrice.toLocaleString()}
          </span>
        </>
      )
    }

    if (pricing) {
      return (
        <span className={showCheck ? 'text-green-600' : 'text-gray-500'}>
          AED {pricing.originalPrice.toLocaleString()}
        </span>
      )
    }

    return (
      <span className={showCheck ? 'text-green-600' : 'text-gray-500'}>
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
          ? 'bg-green-50 border-green-200 ring-1 ring-green-100'
          : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
      }`}
      title={product ? (showCheck ? 'Click to remove · Hold to view product' : 'Click to add to bag · Hold to view product') : ''}
    >
      {showCheck && (
        <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
      )}
      <span
        className={`font-medium ${showCheck ? 'text-green-700' : 'text-gray-800'}`}
      >
        {name}
      </span>
      <span className={showCheck ? 'text-green-400' : 'text-gray-400'}>·</span>
      {renderPrice()}
    </button>
  )
}
