'use client'

import { useState, useCallback } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import type { Product } from '@/types'

interface ConcernAddToCartProps {
  product: Product
  label: string
  addedLabel: string
  soldOutLabel: string
}

/**
 * ConcernAddToCart - Client Component
 * 
 * Small "Add to Cart" button for concern/category landing page product cards.
 * Adds item directly to cart without navigation.
 * Shows brief "Added!" confirmation feedback.
 */
export default function ConcernAddToCart({
  product,
  label,
  addedLabel,
  soldOutLabel,
}: ConcernAddToCartProps) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const [added, setAdded] = useState(false)

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.inStock || product.isPriceOnRequest) return

    addItem(product, 1, '', '')
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }, [addItem, product])

  // Don't show button for price-on-request products
  if (product.isPriceOnRequest) return null

  // Out of stock
  if (!product.inStock) {
    return (
      <div className="mt-2 text-center">
        <span className="text-[10px] sm:text-xs text-gray-400">{soldOutLabel}</span>
      </div>
    )
  }

  // Only show for logged-in users who can purchase
  if (!user) return null

  return (
    <button
      onClick={handleClick}
      className={`mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all duration-200 ${
        added
          ? 'bg-green-50 text-green-600 border border-green-200'
          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 active:scale-95'
      }`}
    >
      {added ? (
        <>
          <Check className="h-3 w-3" />
          {addedLabel}
        </>
      ) : (
        <>
          <ShoppingCart className="h-3 w-3" />
          {label}
        </>
      )}
    </button>
  )
}
