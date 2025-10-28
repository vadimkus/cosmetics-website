'use client'

import { User } from '@/types/user'
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react'
import { useState } from 'react'

interface ProductQuantityCartProps {
  user: User | null
  onAddToCart: (quantity: number) => Promise<void>
  onToggleFavorite: () => void
  isFavorite: boolean
}

export default function ProductQuantityCart({
  user,
  onAddToCart,
  onToggleFavorite,
  isFavorite
}: ProductQuantityCartProps) {
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
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Quantity:</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={handleDecrease}
            className="p-2 hover:bg-gray-100 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            className="p-2 hover:bg-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isAdding || !user}
          className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-5 w-5" />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
        
        <button
          onClick={onToggleFavorite}
          disabled={!user}
          className={`px-6 py-3 rounded-lg font-medium transition-colors border-2 ${
            isFavorite
              ? 'bg-red-50 border-red-500 text-red-600 hover:bg-red-100'
              : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  )
}



