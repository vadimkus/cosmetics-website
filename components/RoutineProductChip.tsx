'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
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
  const [justAdded, setJustAdded] = useState(false)

  const inCart =
    product &&
    items.some(
      (i) => String(i.product?.id) === String(product.id)
    )

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
      <span className={showCheck ? 'text-green-600' : 'text-gray-500'}>
        {price}
      </span>
    </button>
  )
}
