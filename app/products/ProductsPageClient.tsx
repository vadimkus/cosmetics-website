'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import ErrorPage from '@/components/ErrorPage'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { Product } from '@/types'
import ProductsListSchema from '@/components/ProductsListSchema'

const CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'microneedling', name: 'Microneedling' },
  { id: 'pro-solution', name: 'PRO Solution' },
  { id: 'cleanser', name: 'Cleanser' },
  { id: 'peeling', name: 'Peeling' },
  { id: 'toner-mist', name: 'Toner/Mist' },
  { id: 'serum', name: 'Serum' },
  { id: 'cream', name: 'Cream' },
  { id: 'mask', name: 'Mask' },
  { id: 'sun', name: 'Sun' },
  { id: 'cushion-bb', name: 'Cushion BB' },
  { id: 'scalp-hair', name: 'Scalp/Hair' },
  { id: 'eye-care', name: 'Eye care' },
  { id: 'device', name: 'Device' }
] as const

export default function ProductsPageClient() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const productsData = await response.json()
        setProducts(productsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on active category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') {
      return products
    }
    return products.filter(product => 
      product.category.toLowerCase().replace(/\s+/g, '-') === activeCategory
    )
  }, [products, activeCategory])

  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorPage />
  }

  return (
    <div className="bg-white min-h-screen">
      <ProductsListSchema products={filteredProducts} category={activeCategory !== 'all' ? activeCategory : undefined} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            GENOSYS Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional Korean dermacosmetics for exceptional skincare results
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No Products Message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
