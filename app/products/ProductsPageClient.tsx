'use client'
import { debugLog, errorLog } from '@/lib/logger'

import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import ErrorPage from '@/components/ErrorPage'
import LoadingSpinner from '@/components/LoadingSpinner'
import ProductSearch from '@/components/products/ProductSearch'
import ProductFilters from '@/components/products/ProductFilters'
import ProductSort, { SortOption } from '@/components/products/ProductSort'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { Product } from '@/types'
import ProductsListSchema from '@/components/ProductsListSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import { useRouter, useSearchParams } from 'next/navigation'

const CATEGORIES: Array<{ id: string; name: string }> = [
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
  { id: 'device', name: 'Device' },
  { id: 'kits', name: 'Holiday kits' },
  { id: 'beauty-boxes', name: 'Beauty Boxes' }
]

interface FilterState {
  categories: string[]
  priceRange: [number, number]
  minRating: number
  inStockOnly: boolean
}

export default function ProductsPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'name-asc')
  
  // Initialize filters - will be updated after products load
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 10000],
    minRating: 0,
    inStockOnly: false
  })

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        debugLog('Fetching products...')
        
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
        debugLog('Products fetched successfully:', productsData.length)
        
        if (!Array.isArray(productsData)) {
          throw new Error('Invalid response format: expected array')
        }
        
        setProducts(productsData)
        
        // Initialize filters from URL or defaults after products load
        if (productsData.length > 0) {
          const prices = productsData.map((p: Product) => p.price)
          const minPrice = Math.min(...prices)
          const maxPrice = Math.max(...prices)
          
          const priceMin = searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : minPrice
          const priceMax = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : maxPrice
          const categories = searchParams.get('categories')?.split(',').filter(Boolean) || []
          const minRating = searchParams.get('rating') ? Number(searchParams.get('rating')) : 0
          const inStockOnly = searchParams.get('inStock') === 'true'
          
          setFilters({
            categories,
            priceRange: [priceMin, priceMax],
            minRating,
            inStockOnly
          })
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products'
        errorLog('Error fetching products:', err)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Update URL when filters/search/sort change
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (searchQuery) params.set('search', searchQuery)
    if (sortBy !== 'name-asc') params.set('sort', sortBy)
    if (filters.categories.length > 0) params.set('categories', filters.categories.join(','))
    if (filters.priceRange[0] !== Math.min(...products.map(p => p.price)) || filters.priceRange[1] !== Math.max(...products.map(p => p.price))) {
      params.set('priceMin', filters.priceRange[0].toString())
      params.set('priceMax', filters.priceRange[1].toString())
    }
    if (filters.minRating > 0) params.set('rating', filters.minRating.toString())
    if (filters.inStockOnly) params.set('inStock', 'true')
    
    const newUrl = params.toString() ? `/products?${params.toString()}` : '/products'
    router.replace(newUrl, { scroll: false })
  }, [searchQuery, sortBy, filters, router, products])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes('all')) {
      const categoryMapping: Record<string, string> = {
        'toner-mist': 'Toner/Mist',
        'pro-solution': 'PRO Solution',
        'cushion-bb': 'Cushion BB',
        'scalp-hair': 'Scalp/Hair',
        'eye-care': 'Eye care',
        'kits': 'kits',
        'beauty-boxes': 'Beauty Boxes'
      }
      
      filtered = filtered.filter(product => {
        return filters.categories.some(catId => {
          const expectedCategory = categoryMapping[catId] || 
            catId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
          return product.category.toLowerCase().includes(expectedCategory.toLowerCase())
        })
      })
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(product =>
        (product.rating || 0) >= filters.minRating
      )
    }

    // Stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.inStock)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0)
        case 'newest':
          // Prioritize products 51 and 52 first, then sort by productNumber (newest first)
          const isProduct51 = a.productNumber === '51' || a.id === '51'
          const isProduct52 = a.productNumber === '52' || a.id === '52'
          const isBProduct51 = b.productNumber === '51' || b.id === '51'
          const isBProduct52 = b.productNumber === '52' || b.id === '52'
          
          // If one is product 51 or 52 and the other isn't, prioritize it
          if ((isProduct51 || isProduct52) && !(isBProduct51 || isBProduct52)) {
            return -1 // a comes first
          }
          if (!(isProduct51 || isProduct52) && (isBProduct51 || isBProduct52)) {
            return 1 // b comes first
          }
          
          // If both are 51/52, prioritize 51 over 52
          if (isProduct51 && isBProduct52) return -1
          if (isProduct52 && isBProduct51) return 1
          
          // For other products, sort by productNumber descending (higher numbers = newer)
          const aNum = a.productNumber ? parseInt(a.productNumber) : 0
          const bNum = b.productNumber ? parseInt(b.productNumber) : 0
          return bNum - aNum
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchQuery, filters, sortBy])

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  const handleSortChange = useCallback((sort: SortOption) => {
    setSortBy(sort)
  }, [])

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading products..." size="xl" />
  }

  if (error) {
    return <ErrorPage error={error} />
  }

  // Calculate price range for filters
  const priceRange = products.length > 0
    ? products.reduce(
        (acc, product) => ({
          min: Math.min(acc.min, product.price),
          max: Math.max(acc.max, product.price)
        }),
        { min: Infinity, max: 0 }
      )
    : { min: 0, max: 10000 }

  debugLog('Products loaded:', products.length, 'Filtered:', filteredAndSortedProducts.length)

  return (
    <div className="bg-white min-h-screen">
      <ProductsListSchema products={filteredAndSortedProducts} category="" />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' }
        ]}
      />
      <div className="container mx-auto px-4 py-4 md:py-8 lg:py-16">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm lg:text-base text-gray-600 mb-4 md:mb-6 lg:mb-8" aria-label="Breadcrumb">
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
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            GENOSYS Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional Korean dermacosmetics
          </p>
        </div>

        {/* Search Bar */}
        <ProductSearch
          products={products}
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
        />

        {/* Filters and Products Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Filters Sidebar */}
          <ProductFilters
            products={products}
            categories={CATEGORIES}
            onFiltersChange={handleFiltersChange}
            activeFilters={filters}
          />

          {/* Products Section */}
          <div className="flex-1">
            {/* Results Header with Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="text-sm text-gray-600">
                {filteredAndSortedProducts.length === products.length ? (
                  <span>Showing all {filteredAndSortedProducts.length} products</span>
                ) : (
                  <span>
                    Showing {filteredAndSortedProducts.length} of {products.length} products
                    {(searchQuery || filters.categories.length > 0 || filters.minRating > 0 || filters.inStockOnly) && (
                      <button
                        onClick={() => {
                          setSearchQuery('')
                          setFilters({
                            categories: [],
                            priceRange: [priceRange.min, priceRange.max],
                            minRating: 0,
                            inStockOnly: false
                          })
                        }}
                        className="ml-2 text-primary-600 hover:text-primary-700 underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </span>
                )}
              </div>
              <ProductSort sortBy={sortBy} onSortChange={handleSortChange} />
            </div>

            {/* Products Grid */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-2">No products found</p>
                <p className="text-gray-500 text-sm mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilters({
                      categories: [],
                      priceRange: [priceRange.min, priceRange.max],
                      minRating: 0,
                      inStockOnly: false
                    })
                  }}
                  className="text-primary-600 hover:text-primary-700 underline text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
