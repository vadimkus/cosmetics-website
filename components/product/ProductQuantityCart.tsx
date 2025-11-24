'use client'

import { User } from '@/types/user'
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

interface ProductQuantityCartProps {
  user: User | null
  onAddToCart: (quantity: number) => Promise<void>
  onToggleFavorite: () => void
  isFavorite: boolean
  inStock?: boolean
}

export default function ProductQuantityCart({
  user,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  inStock = true
}: ProductQuantityCartProps) {
  const { t, dir } = useTranslation()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleIncrease = () => setQuantity(prev => prev + 1)
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await onAddToCart(quantity)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-4" dir={dir}>
      {/* Quantity Selector */}
      <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <label className="text-sm font-medium text-gray-700">{t('product.quantity')}:</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={handleDecrease}
            className="p-2 hover:bg-gray-100 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={t('product.decreaseQuantity')}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            className="p-2 hover:bg-gray-100 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={t('product.increaseQuantity')}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={handleAddToCart}
          disabled={isAdding || !user || !inStock}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 touch-manipulation min-h-[44px] ${
            !inStock || !user || isAdding
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
          {!inStock ? t('product.outOfStock') : isAdding ? t('product.adding') : t('product.addToCart')}
        </button>
        
        <button
          onClick={onToggleFavorite}
          disabled={!user}
          className={`px-6 py-3 rounded-lg font-medium transition-colors border-2 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${
            isFavorite
              ? 'bg-red-50 border-red-500 text-red-600 hover:bg-red-100'
              : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isFavorite ? t('product.removeFromFavorites') : t('product.addToFavorites')}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  )
}



