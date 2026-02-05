'use client'
import { debugLog, errorLog } from '@/lib/logger'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAnimationStore } from '@/lib/animationStore'
import ProductCard from '@/components/ProductCard'
import ErrorPage from '@/components/ErrorPage'
import LoadingSpinner from '@/components/LoadingSpinner'
import ProductSearch from '@/components/products/ProductSearch'
import ProductFilters from '@/components/products/ProductFilters'
import ProductSort, { SortOption } from '@/components/products/ProductSort'
import BlackFridayMini from '@/components/BlackFridayMini'
import BuildYourSetBanner from '@/components/products/BuildYourSetBanner'
import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Product } from '@/types'
import ProductsListSchema from '@/components/schema/ProductsListSchema'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'

const getCategories = (t: (key: string) => string): Array<{ id: string; name: string }> => [
  { id: 'all', name: t('products.allProducts') },
  { id: 'microneedling', name: t('products.microneedling') },
  { id: 'pro-solution', name: t('products.proSolution') },
  { id: 'cleanser', name: t('products.cleanser') },
  { id: 'peeling', name: t('products.peeling') },
  { id: 'toner-mist', name: t('products.tonerMist') },
  { id: 'serum', name: t('products.serum') },
  { id: 'cream', name: t('products.cream') },
  { id: 'mask', name: t('products.mask') },
  { id: 'sun', name: t('products.sun') },
  { id: 'cushion-bb', name: t('products.cushionBb') },
  { id: 'scalp-hair', name: t('products.scalpHair') },
  { id: 'eye-care', name: t('products.eyeCare') },
  { id: 'device', name: t('products.device') },
  { id: 'bio-meso', name: t('products.bioMeso') },
  { id: 'kits', name: t('products.holidayKits') },
  { id: 'beauty-boxes', name: t('products.beautyBoxes') }
]

interface FilterState {
  categories: string[]
  priceRange: [number, number]
  minRating: number
  inStockOnly: boolean
}

interface ProductsPageClientProps {
  initialProducts?: Product[]
}

export default function ProductsPageClient({ initialProducts = [] }: ProductsPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, locale } = useTranslation()
  const { enabled: animationsEnabled } = useAnimationStore()
  const { isPWA } = usePWAMode()
  
  // Use initial products from server, no need for loading state if provided
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(initialProducts.length === 0)
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
  
  const [isMobile, setIsMobile] = useState(true) // Default to mobile for SSR, will update on client
  
  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize filters from URL params when products are available (server or client)
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p: Product) => p.price)
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
      setLoading(false)
    }
  }, [products.length, searchParams])

  // Fetch products from API only if no initial products were provided (fallback)
  useEffect(() => {
    // Skip if we already have products from server
    if (initialProducts.length > 0) {
      return
    }
    
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        debugLog('Fetching products (client fallback)...')
        
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
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products'
        errorLog('Error fetching products:', err)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [initialProducts.length])

  // Debounce timer ref to prevent URL updates from interrupting touch events
  const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Update URL when filters/search/sort change - debounced to not interrupt touch events
  useEffect(() => {
    // Clear any pending URL update
    if (urlUpdateTimeoutRef.current) {
      clearTimeout(urlUpdateTimeoutRef.current)
    }
    
    // Debounce URL update by 300ms to prevent interrupting touch interactions
    urlUpdateTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams()
      
      if (searchQuery) params.set('search', searchQuery)
      if (sortBy !== 'name-asc') params.set('sort', sortBy)
      if (filters.categories.length > 0) params.set('categories', filters.categories.join(','))
      if (products.length > 0 && (filters.priceRange[0] !== Math.min(...products.map(p => p.price)) || filters.priceRange[1] !== Math.max(...products.map(p => p.price)))) {
        params.set('priceMin', filters.priceRange[0].toString())
        params.set('priceMax', filters.priceRange[1].toString())
      }
      if (filters.minRating > 0) params.set('rating', filters.minRating.toString())
      if (filters.inStockOnly) params.set('inStock', 'true')
      
      const basePath = getLocalizedPath('/products', locale)
      const newUrl = params.toString() ? `${basePath}?${params.toString()}` : basePath
      router.replace(newUrl, { scroll: false })
    }, 300)
    
    return () => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current)
      }
    }
  }, [searchQuery, sortBy, filters, router, products, locale])

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
        'bio-meso': 'Bio Meso',
        'kits': 'kits',
        'beauty-boxes': 'Beauty Boxes'
      }
      
      // Hair/Scalp related device products that should also show in Scalp/Hair category
      const hairDeviceProducts = ['3', '48'] // HairGen BOOSTER (3), Hair-GENTRON (48)
      
      filtered = filtered.filter(product => {
        return filters.categories.some(catId => {
          const expectedCategory = categoryMapping[catId] || 
            catId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
          
          // Special handling: Show hair devices in Scalp/Hair category
          if (catId === 'scalp-hair' && hairDeviceProducts.includes(product.id)) {
            return true
          }
          
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
    return <LoadingSpinner fullScreen text={t('common.loading')} size="xl" />
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
    <div className="bg-white min-h-[100dvh]" suppressHydrationWarning>
      <ProductsListSchema products={filteredAndSortedProducts} category="" />
      <BreadcrumbSchema 
        items={[
          { name: t('navigation.home'), url: getLocalizedPath('/', locale) },
          { name: t('navigation.products'), url: getLocalizedPath('/products', locale) }
        ]}
      />
      <div className="container mx-auto px-4 py-4 md:py-8 lg:py-16">
        {/* Navigation Breadcrumb - Hide in PWA mode and mobile web */}
        {!isPWA && !isMobile && (
          <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4 products-breadcrumb" aria-label="Breadcrumb">
            <Link 
              href={getLocalizedPath('/', locale)}
              className="hover:text-primary-600 transition-colors"
            >
              {t('navigation.home')}
            </Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">
              {t('navigation.products')}
            </span>
          </nav>
        )}
        
        {/* Back to Home - Desktop only, hide in PWA */}
        {!isPWA && (
          <Link 
            href={getLocalizedPath('/', locale)}
            className="hidden md:inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('navigation.backToHome')}</span>
          </Link>
        )}

        {/* Header - Show logo on desktop only, hide company text on mobile web */}
        <div className={`text-center ${isMobile ? 'mb-2' : 'mb-4 md:mb-8'}`}>
          {/* Desktop only: show logo */}
          {!isMobile && (
            <div className="flex justify-center mb-3">
              <Image
                src="/images/prd_logo.png"
                alt="GENOSYS Logo"
                width={200}
                height={80}
                className="object-contain"
                priority
              />
            </div>
          )}
          {/* Black Friday Mini Counter - hide on mobile */}
          {!isMobile && (
            <div className="flex justify-center mb-2">
              <BlackFridayMini />
            </div>
          )}
          <p className="hidden md:block text-lg text-gray-600 max-w-2xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <ProductSearch
          products={products}
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
        />

        {/* Mobile Categories - Below Search */}
        <div className="md:hidden mb-4">
          <div className="flex flex-wrap gap-2">
            {getCategories(t).map((category) => {
              const isActive = filters.categories.includes(category.id) || (category.id === 'all' && filters.categories.length === 0)
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    // Use functional update for stable state updates
                    if (category.id === 'all') {
                      setFilters(prev => ({
                        ...prev,
                        categories: []
                      }))
                    } else {
                      setFilters(prev => {
                        const wasActive = prev.categories.includes(category.id)
                        const newCategories = wasActive
                          ? prev.categories.filter(c => c !== category.id)
                          : [...prev.categories.filter(c => c !== 'all'), category.id]
                        return {
                          ...prev,
                          categories: newCategories
                        }
                      })
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap min-h-[44px] min-w-[48px] flex items-center justify-center select-none transition-all duration-150 active:scale-95 relative ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 active:bg-gray-300'
                  }`}
                  style={{ 
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {category.id === 'beauty-boxes' && (
                    <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-white text-primary-600' 
                        : 'bg-green-500 text-white'
                    }`}>
                      {t('common.new')}
                    </span>
                  )}
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Filters and Products Layout */}
        <div className="flex flex-col md:flex-row gap-6 products-layout">
          {/* Desktop Filters Sidebar */}
          <ProductFilters
            products={products}
            categories={getCategories(t)}
            onFiltersChange={handleFiltersChange}
            activeFilters={filters}
          />

          {/* Products Section */}
          <div className="flex-1">
            {/* Results Header with Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 products-header">
              <div className="text-sm text-gray-600">
                {filteredAndSortedProducts.length === products.length ? (
                  <span>{t('products.showingAll', { count: filteredAndSortedProducts.length })}</span>
                ) : (
                  <span>
                    {t('products.showing', { filtered: filteredAndSortedProducts.length, total: products.length })}
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
                        className="ml-2 text-primary-600 hover:text-primary-700 underline products-clear-filters"
                      >
                        {t('products.clearFilters')}
                      </button>
                    )}
                  </span>
                )}
              </div>
              <div className="hidden md:block">
                <ProductSort sortBy={sortBy} onSortChange={handleSortChange} />
              </div>
            </div>

            {/* Build Your Set Banner - Show when Beauty Boxes category is selected */}
            {filters.categories.includes('beauty-boxes') && (
              <div className="mb-6">
                <BuildYourSetBanner />
              </div>
            )}

            {/* Products Grid */}
            {filteredAndSortedProducts.length > 0 ? (
              // Disable motion wrapper animations in PWA mode to prevent touch event interference
              isPWA ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <div key={product.id}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-4 md:gap-6"
                  initial={animationsEnabled ? "hidden" : {}}
                  animate={animationsEnabled ? "show" : {}}
                  variants={animationsEnabled ? {
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.1
                      }
                    }
                  } : {}}
                >
                  {filteredAndSortedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={animationsEnabled ? {
                        hidden: { opacity: 0, y: 30, scale: 0.9 },
                        show: { 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                          transition: { 
                            duration: 0.4,
                            ease: "easeOut"
                          }
                        }
                      } : {}}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              )
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-2">{t('products.noProductsFound')}</p>
                <p className="text-gray-500 text-sm mb-4">
                  {t('products.tryAdjustingFilters')}
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
                  {t('products.clearAllFilters')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
