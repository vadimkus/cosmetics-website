'use client'

import { Product } from '@/types'
import { useCart } from './CartProvider'
import { useFavorites } from './FavoritesProvider'
import { useAuth } from './AuthProvider'
import { ShoppingCart, Heart, Lock, User } from 'lucide-react'
import { useState, memo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LoginModal from './LoginModal'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'
import { debugLog, errorLog } from '@/lib/logger'

interface ProductCardProps {
  product: Product
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()
  const [isAdding, setIsAdding] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)

  const handleAddToCart = useCallback(async () => {
    setIsAdding(true)
    addItem(product, 1, '', '')
    // Simulate a brief loading state
    setTimeout(() => setIsAdding(false), 500)
  }, [addItem, product])

  const handleFavorite = useCallback(async (e?: React.MouseEvent | React.TouchEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setIsTogglingFavorite(true)
    toggleFavorite(product)
    // Brief delay for visual feedback
    setTimeout(() => setIsTogglingFavorite(false), 300)
  }, [toggleFavorite, product])

  const handleLoginClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowLoginModal(true)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Link href={`/products/${product.productNumber || product.id}`} className="block">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover cursor-pointer hover:scale-105 transition-transform"
            placeholder="empty"
            priority={false}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized={true}
            onError={(e) => {
              errorLog('Image failed to load:', product.image, e)
            }}
            onLoad={() => {
              debugLog('Image loaded successfully:', product.image)
            }}
          />
        </Link>
        <button 
          onClick={handleFavorite}
          onTouchStart={(e: React.TouchEvent<HTMLButtonElement>) => {
            e.preventDefault()
            handleFavorite(e)
          }}
          disabled={isTogglingFavorite}
          className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors touch-manipulation z-20 min-h-[44px] min-w-[44px] flex items-center justify-center ${
            isTogglingFavorite ? 'opacity-50' : ''
          }`}
          title={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
          aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
          style={{ touchAction: 'manipulation' }}
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isFavorite(product.id) 
                ? 'text-red-500 fill-current' 
                : 'text-gray-600 hover:text-red-500'
            }`}
            aria-hidden="true"
          />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm md:text-base">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-3 md:p-4">
        <div className="mb-2">
          <span className="text-xs md:text-sm text-primary-600 font-medium">{product.category}</span>
        </div>
        
        <div className="mb-2">
          <Link href={`/products/${product.productNumber || product.id}`}>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>
        </div>
        
        {(product.size || product.id === '37') && (
          <div className="mb-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
              Size: {product.id === '37' ? '38g x 5ea (5 masks, 1 box)' : product.size}
            </span>
          </div>
        )}
        
        <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
          {product.description ? product.description.replace(/<[^>]*>/g, '').trim() : ''}
        </p>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {canUserSeePrices(user) ? (
              <div>
                {(() => {
                  const pricing = calculateDiscountedPrice(product, user)
                  return (
                    <div>
                      {pricing.hasDiscount ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-primary-600">
                              {pricing.discountedPrice.toFixed(2)} AED
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {pricing.originalPrice.toFixed(2)} AED
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-green-600 font-medium">
                              {pricing.discountPercentage}% OFF
                            </span>
                            <span className="text-xs text-gray-500">VAT included</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-base font-bold text-primary-600">
                            {pricing.originalPrice.toFixed(2)} AED
                          </span>
                          <p className="text-xs text-gray-500">VAT included</p>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            ) : user ? (
              <div className="flex items-center text-gray-500">
                <Lock className="h-4 w-4 mr-1" />
                <span className="text-sm">Price locked</span>
              </div>
            ) : (
              <span className="text-base font-bold text-gray-500">
                Login to see price
              </span>
            )}
            
            {product.inStock && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {product.id === '47' ? 'Order by Request' : 'In Stock'}
              </span>
            )}
          </div>
          
          {!user ? (
            <button
              onClick={handleLoginClick}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors touch-manipulation w-full bg-primary-600 text-white hover:bg-primary-700 min-h-[44px]"
              aria-label="Login to see price for this product"
            >
              <User className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm">Login to see price</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              aria-label={isAdding ? "Adding to cart..." : `Add ${product.name} to cart`}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors touch-manipulation w-full min-h-[44px] ${
                product.inStock && !isAdding
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm">
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          isLoginMode={isLoginMode}
          setIsLoginMode={setIsLoginMode}
        />
      )}
    </div>
  )
})

export default ProductCard
