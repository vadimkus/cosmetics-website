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
    addItem(product)
    // Simulate a brief loading state
    setTimeout(() => setIsAdding(false), 500)
  }, [addItem, product])

  const handleFavorite = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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
        <Link href={`/products/${product.id}`} className="block">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={256}
            className="w-full h-48 sm:h-56 md:h-64 object-cover cursor-pointer hover:scale-105 transition-transform"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        <button 
          onClick={handleFavorite}
          onTouchStart={(e) => {
            e.preventDefault()
            handleFavorite(e as any)
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
          />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm md:text-base">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-3 md:p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs md:text-sm text-primary-600 font-medium">{product.category}</span>
          {product.inStock && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              In Stock
            </span>
          )}
        </div>
        
        <Link href={`/products/${product.id}`}>
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {user && user.canSeePrices ? (
            <span className="text-sm md:text-base font-bold text-primary-600">
              {product.price.toFixed(2)} AED
            </span>
          ) : user ? (
            <div className="flex items-center text-gray-500">
              <Lock className="h-4 w-4 mr-1" />
              <span className="text-sm">Price locked</span>
            </div>
          ) : (
            <span className="text-sm md:text-base font-bold text-gray-500">
              Login to see price
            </span>
          )}
          
          {!user ? (
            <button
              onClick={handleLoginClick}
              className="flex items-center justify-center space-x-2 px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium transition-colors touch-manipulation w-full sm:w-auto bg-primary-600 text-white hover:bg-primary-700"
            >
              <User className="h-4 w-4" />
              <span className="text-xs md:text-sm">Login</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className={`flex items-center justify-center space-x-2 px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium transition-colors touch-manipulation w-full sm:w-auto ${
                product.inStock && !isAdding
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-xs md:text-sm">
                {isAdding ? 'Adding...' : 'Order'}
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
