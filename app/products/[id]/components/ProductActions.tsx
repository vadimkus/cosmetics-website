'use client'

import { Product } from '@/types'
import { useProductActions } from '@/hooks/useProductActions'
import { ShoppingCart, Heart, Minus, Plus, MessageCircle } from 'lucide-react'
import ProductShareButton from '@/components/ProductShareButton'
import { useTranslation } from '@/hooks/useTranslation'

interface ProductActionsProps {
  product: Product
  selectedSize?: string
  selectedColor?: string
  isFavorite: boolean
  onToggleFavorite: () => void
}

export default function ProductActions({ 
  product, 
  selectedSize, 
  selectedColor, 
  isFavorite, 
  onToggleFavorite 
}: ProductActionsProps) {
  const {
    quantity,
    isAdding,
    incrementQuantity,
    decrementQuantity,
    handleAddToCart
  } = useProductActions()
  const { t } = useTranslation()

  const handleAddToCartClick = async () => {
    await handleAddToCart(product, selectedSize, selectedColor)
  }

  // WhatsApp request quote
  const handleRequestQuote = () => {
    const message = encodeURIComponent(`Hi, I'm interested in ${product.name}. Could you please provide pricing information?`)
    window.open(`https://wa.me/971509096498?text=${message}`, '_blank')
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector - Hide for price on request products */}
      {!product.isPriceOnRequest && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Quantity:</label>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
            <button
              onClick={incrementQuantity}
              disabled={quantity >= 99}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          {product.isPriceOnRequest ? (
            <button
              onClick={handleRequestQuote}
              className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              {t('products.requestQuote') || 'Request Quote'}
            </button>
          ) : (
            <button
              onClick={handleAddToCartClick}
              disabled={isAdding}
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          )}
          
          <button
            onClick={onToggleFavorite}
            className={`p-3 rounded-lg border-2 transition-colors ${
              isFavorite
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-gray-300 hover:border-gray-400 text-gray-600'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        {/* Share Button */}
        <ProductShareButton
          product={product}
          variant="button"
          size="md"
          className="w-full"
          showPrice={true}
        />
      </div>
    </div>
  )
}
