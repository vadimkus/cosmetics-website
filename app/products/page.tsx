'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import ErrorPage from '@/components/ErrorPage'
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image 
                src="/images/genosys-logo.png" 
                alt="Genosys Logo" 
                width={400} 
                height={200} 
                className="object-contain"
                priority
              />
            </div>
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
              <div className="py-12">
                <ErrorPage
                  title="Products Unavailable"
                  message="We're having trouble loading our product catalog. This might be due to a network issue or server maintenance."
                  error={error}
                  type="network"
                  onRetry={() => {
                    setError(null)
                    setLoading(true)
                    // Re-fetch products
                    const fetchProducts = async () => {
                      try {
                        const response = await fetch(`${window.location.origin}/api/products`)
                        if (!response.ok) {
                          throw new Error('Failed to fetch products')
                        }
                        const data = await response.json()
                        setProducts(data)
                      } catch (err) {
                        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products'
                        setError(errorMessage)
                      } finally {
                        setLoading(false)
                      }
                    }
                    fetchProducts()
                  }}
                  showBack={false}
                  showHome={false}
                />
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
