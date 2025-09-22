'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import ErrorPage from '@/components/ErrorPage'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { Product } from '@/types'
import ProductsListSchema from '@/components/ProductsListSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

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
        setError(null)
        console.log('Fetching products...')
        
        const response = await fetch('/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const productsData = await response.json()
        console.log('Products fetched successfully:', productsData.length)
        
        if (!Array.isArray(productsData)) {
          throw new Error('Invalid response format: expected array')
        }
        
        setProducts(productsData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products'
        console.error('Error fetching products:', err)
        setError(errorMessage)
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
    
    // Handle special cases where category ID doesn't match the exact transformation
    const categoryMapping: Record<string, string> = {
      'toner-mist': 'Toner/Mist',
      'pro-solution': 'PRO Solution',
      'cushion-bb': 'Cushion BB',
      'scalp-hair': 'Scalp/Hair',
      'eye-care': 'Eye care'
    }
    
    const expectedCategory = categoryMapping[activeCategory] || 
      activeCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    
    return products.filter(product => product.category === expectedCategory)
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
        </div>
      </div>
    )
  }

  console.log('Products loaded:', products.length, 'Filtered:', filteredProducts.length, 'Active category:', activeCategory)

  return (
    <div className="bg-white min-h-screen">
      <ProductsListSchema products={filteredProducts} category={activeCategory !== 'all' ? activeCategory : undefined} />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' }
        ]}
      />
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
          <Link 
            href="/"
            className="hover:text-primary-600 transition-colors flex items-center"
          >
            Home
          </Link>
          <span className="flex items-center">/</span>
          <span className="text-gray-900 font-medium flex items-center">
            Products
          </span>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            GENOSYS Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional Korean dermacosmetics
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
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
