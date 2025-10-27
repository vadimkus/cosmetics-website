'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Zap, Sparkles } from 'lucide-react'

interface ProductRecommendationsProps {}

export default function ProductRecommendations({}: ProductRecommendationsProps) {
  const products = [
    {
      id: '1',
      name: 'GENOSYS MICRONEEDLE ROLLER',
      price: 230,
      image: '/images/MICRONEEDLE.jpg',
      description: 'Professional microneedling device for advanced skincare treatment',
      features: ['0.25mm needles', 'Stainless steel', 'Professional grade']
    },
    {
      id: '2', 
      name: 'GENOSYS EGF REPAIR SERUM',
      price: 180,
      image: '/images/EGF.jpg',
      description: 'Epidermal Growth Factor serum for skin regeneration',
      features: ['EGF technology', 'Anti-aging', 'Skin repair']
    },
    {
      id: '3',
      name: 'GENOSYS VITAMIN C SERUM',
      price: 150,
      image: '/images/VITAMIN-C.jpg',
      description: 'High-potency Vitamin C for brightening and protection',
      features: ['20% Vitamin C', 'Brightening', 'Antioxidant']
    }
  ]

  return (
    <div className="space-y-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Recommended for You</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-200">
              <div className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-800">
                    ${product.price}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/products/${product.id}`}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200"
          >
            <Zap className="h-5 w-5" />
            View All Products
          </Link>
        </div>
      </div>
    </div>
  )
}
