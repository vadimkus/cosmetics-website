'use client'

import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'
import { useFavorites } from '@/components/FavoritesProvider'
import ProductCard from '@/components/ProductCard'

export default function FavoritesPage() {
  const { favorites } = useFavorites()

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Your Favorites
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {favorites.length === 0 
                ? "Your favorite products will appear here. Start adding products to your wishlist to see them in this section."
                : `You have ${favorites.length} favorite product${favorites.length === 1 ? '' : 's'}.`
              }
            </p>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center">
              <div className="mb-8">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              </div>
              <Link
                href="/products"
                className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
