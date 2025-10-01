'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { Star, ShoppingCart, Minus, Plus } from 'lucide-react'
import { Product } from '@/types'

interface ProductInfoProps {
  product: Product
  selectedSize: string
  setSelectedSize: (size: string) => void
  quantity: number
  setQuantity: (qty: number) => void
  onAddToCart: () => void
  isAdding: boolean
}

export default function ProductInfo({ 
  product, 
  selectedSize, 
  setSelectedSize, 
  quantity, 
  setQuantity, 
  onAddToCart, 
  isAdding 
}: ProductInfoProps) {
  const { user } = useAuth()
  const router = useRouter()

  const getPriceForSize = (size: string) => {
    if (product.id === '1') return 230
    if (product.id === '10') return size === '180ml' ? 330 : 510
    if (product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31') {
      return size === '50g' ? 290 : 420
    }
    if (product.id === '15') return size === '200ml' ? 260 : 490
    if (product.id === '16') return size === '200ml' ? 260 : 490
    if (product.id === '25') return size === '20g' ? 190 : 420
    return product.price
  }

  const sizeOptions = [
    { size: '180ml', price: 330 },
    { size: '500ml', price: 510 },
    { size: '50g', price: 290 },
    { size: '250g', price: 420 },
    { size: '200ml', price: 260 },
    { size: '1000ml', price: 490 },
    { size: '20g', price: 190 },
    { size: '100g', price: 420 },
  ].filter(option => {
    if (product.id === '10') return ['180ml', '500ml'].includes(option.size)
    if (product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31') {
      return ['50g', '250g'].includes(option.size)
    }
    if (product.id === '15' || product.id === '16') return ['200ml', '1000ml'].includes(option.size)
    if (product.id === '25') return ['20g', '100g'].includes(option.size)
    return false
  })

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <span className="text-sm text-gray-600">(4.8) • 127 reviews</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4 mt-12 pt-4">
        {(product.size || product.id === '1' || product.id === '41' || product.id === '10' || product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31' || product.id === '24' || product.id === '16' || product.id === '25') && (
          <div className="text-sm font-medium text-gray-700">
            Size: {product.id === '1' ? '0.25mm/0.5mm/0.1mm/0.15mm/0.2mm' : product.id === '41' ? '15g' : product.id === '10' ? '180ml/500ml' : product.id === '31' ? '50g/230g' : (product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28') ? '50g/250g' : product.id === '15' ? '200ml/500ml' : product.id === '16' ? '200ml/1000ml' : product.id === '25' ? '20g/100g' : product.id === '24' ? '20g' : product.size}
          </div>
        )}
        {user ? (
          <>
            <div className="text-2xl md:text-3xl font-bold text-primary-600">
              {getPriceForSize((product.id === '1' || product.id === '10' || product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31' || product.id === '15' || product.id === '16' || product.id === '25') ? selectedSize : 'default').toFixed(2)} AED
            </div>
            <div className="text-sm font-normal text-gray-600">(VAT included)</div>
          </>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Login to see price
          </button>
        )}
      </div>

      {/* Size Selection */}
      {sizeOptions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">Size</h3>
          <div className="grid grid-cols-2 gap-3">
            {sizeOptions.map((option) => (
              <button
                key={option.size}
                onClick={() => setSelectedSize(option.size)}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  selectedSize === option.size
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">{option.size}</div>
                {user ? (
                  <div className="text-sm text-gray-500">{option.price} AED</div>
                ) : (
                  <div className="text-sm text-gray-400">Login to see price</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="flex gap-4">
        <button
          onClick={onAddToCart}
          disabled={!product.inStock || isAdding}
          className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-5 w-5" />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2 text-sm">
        {product.inStock ? (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700">In Stock</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-700">Out of Stock</span>
          </>
        )}
      </div>
    </div>
  )
}
