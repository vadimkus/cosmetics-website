'use client'

import { CartItem as CartItemType } from '@/types'
import { useCart } from './CartProvider'
import { useAuth } from './AuthProvider'
import { Minus, Plus, Trash2, Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const { user } = useAuth()
  const { product, quantity } = item

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity)
  }

  const handleRemove = () => {
    removeItem(product.id)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <Link href={`/products/${product.id}`} className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 mx-auto sm:mx-0 hover:opacity-80 transition-opacity">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg cursor-pointer"
          />
        </Link>
        
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 truncate hover:text-primary-600 transition-colors cursor-pointer">{product.name}</h3>
          </Link>
          <p className="text-xs md:text-sm text-gray-600">{product.category}</p>
          {user && user.canSeePrices ? (
            <p className="text-base md:text-lg font-bold text-primary-600">{product.price.toFixed(2)} AED</p>
          ) : (
            <div className="flex items-center text-gray-500">
              <Lock className="h-4 w-4 mr-1" />
              <span className="text-sm">Price access required</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center sm:justify-end space-x-3">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-3 sm:p-2 hover:bg-gray-100 transition-colors touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-gray-700 hover:text-gray-900"
              disabled={quantity <= 1}
            >
              <Minus className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
            <span className="px-3 md:px-4 py-3 sm:py-2 font-medium text-sm md:text-base text-black text-center min-w-[50px] sm:min-w-0">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-3 sm:p-2 hover:bg-gray-100 transition-colors touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-gray-700 hover:text-gray-900"
            >
              <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
          </div>
          
          <button
            onClick={handleRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-center sm:text-right">
          {user && user.canSeePrices ? (
            <p className="text-base md:text-lg font-semibold text-gray-800">
              {(product.price * quantity).toFixed(2)} AED
            </p>
          ) : (
            <div className="flex items-center justify-center text-gray-500">
              <Lock className="h-4 w-4 mr-1" />
              <span className="text-sm">Price access required</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
