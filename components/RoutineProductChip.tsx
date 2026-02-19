'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import type { Product } from '@/types'

interface RoutineProductChipProps {
  product: Product | null
  name: string
  price: string
  url: string
}

const DOUBLE_CLICK_MS = 350

export default function RoutineProductChip({
  product,
  name,
  price,
  url,
}: RoutineProductChipProps) {
  const router = useRouter()
  const { addItem, items } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clickCount = useRef(0)

  const inCart =
    product &&
    items.some(
      (i) => String(i.product?.id) === String(product.id)
    )

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      clickCount.current += 1

      if (clickCount.current === 1) {
        clickTimer.current = setTimeout(() => {
          clickCount.current = 0
          router.push(url)
        }, DOUBLE_CLICK_MS)
      } else if (clickCount.current >= 2) {
        if (clickTimer.current) clearTimeout(clickTimer.current)
        clickCount.current = 0

        if (product && !product.isPriceOnRequest && product.inStock !== false) {
          addItem(product, 1, '', '')
          setJustAdded(true)
          setTimeout(() => setJustAdded(false), 1200)
        } else {
          router.push(url)
        }
      }
    },
    [addItem, product, router, url]
  )

  const showCheck = justAdded || inCart

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-xs rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer border ${
        showCheck
          ? 'bg-green-50 border-green-200 ring-1 ring-green-100'
          : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
      }`}
      title={product ? 'Double-click to add to bag' : ''}
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
      <span className={showCheck ? 'text-green-600' : 'text-gray-500'}>
        {price}
      </span>
    </button>
  )
}
