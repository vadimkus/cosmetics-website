'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { Product } from '@/types'

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

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${window.location.origin}/api/products`)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        console.log('Fetched products:', data.length, 'items')
        setProducts(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products'
        setError(errorMessage)
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])
  
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId)
  }, [])

  // Filter products based on category
  const filteredProducts = useMemo(() => {
    // Safety check: return empty array if products is not loaded yet
    if (!products || products.length === 0) {
      return []
    }
    
    let filtered = products
    
    // Apply category filter
    if (activeCategory !== 'all') {
      const categoryMap: Record<string, string> = {
        'microneedling': 'Microneedling',
        'pro-solution': 'PRO Solution',
        'cleanser': 'Cleanser',
        'peeling': 'Peeling',
        'toner-mist': 'Toner/Mist',
        'serum': 'Serum',
        'cream': 'Cream',
        'mask': 'Mask',
        'sun': 'Sun',
        'cushion-bb': 'Cushion BB',
        'scalp-hair': 'Scalp/Hair',
        'eye-care': 'Eye care',
        'device': 'Device'
      }
      
      const categoryName = categoryMap[activeCategory]
      if (categoryName) {
        filtered = filtered.filter(product => product.category === categoryName)
      }
    }
    
    return filtered
  }, [activeCategory, products])

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Genosys Products
            </h1>
          </div>

          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Category Content */}
          <div className="text-center">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
