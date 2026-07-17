'use client'
import { debugLog, errorLog } from '@/lib/logger'

import Link from 'next/link'
import Image from 'next/image'
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
import ConcernFaceMap from '@/components/products/ConcernFaceMap'
import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Product } from '@/types'
import ProductsListSchema from '@/components/schema/ProductsListSchema'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { filterProductsBySearch } from '@/lib/productSearch'
import { trackSearch } from '@/lib/analytics'
import NewsletterSignup from '@/components/NewsletterSignup'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useIsMobile } from '@/hooks/useIsMobile'
import { isNewCategoryFilterId } from '@/lib/productBadges'

// Catalog order: discovery tool first, then skincare routine flow, then specialty.
// "New" badges are product-level only — see lib/productBadges.ts.
const getCategories = (t: (key: string) => string): Array<{ id: string; name: string }> => [
  { id: 'all', name: t('products.allProducts') },
  { id: 'skin-concern', name: t('products.skinConcern') },
  { id: 'cleanser', name: t('products.cleanser') },
  { id: 'toner-mist', name: t('products.tonerMist') },
  { id: 'serum', name: t('products.serum') },
  { id: 'cream', name: t('products.cream') },
  { id: 'mask', name: t('products.mask') },
  { id: 'eye-care', name: t('products.eyeCare') },
  { id: 'sun', name: t('products.sun') },
  { id: 'cushion-bb', name: t('products.cushionBb') },
  { id: 'peeling', name: t('products.peeling') },
  { id: 'microneedling', name: t('products.microneedling') },
  { id: 'pro-solution', name: t('products.proSolution') },
  { id: 'scalp-hair', name: t('products.scalpHair') },
  { id: 'bio-meso', name: t('products.bioMeso') },
  { id: 'beauty-boxes', name: t('products.beautyBoxes') },
  { id: 'kits', name: t('products.holidayKits') },
  { id: 'device', name: t('products.device') },
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
  // Default sort: newest first (brings fresh launches + featured SKUs to the top)
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'newest')
  
  // Initialize filters - will be updated after products load
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 10000],
    minRating: 0,
    inStockOnly: false
  })
  
  // Default to `true` before hydration for mobile-first SSR rendering;
  // `useIsMobile` returns false pre-hydration, so we OR with `!isClient`
  // to keep the same "mobile until proven otherwise" behavior.
  const { isMobile: isMobileClient, isClient: isMobileClientReady } = useIsMobile()
  const isMobile = !isMobileClientReady || isMobileClient

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
  }, [products, searchParams])

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
      if (sortBy !== 'newest') params.set('sort', sortBy)
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

    // Search filter (tokenized, locale-agnostic — see lib/productSearch.ts)
    if (searchQuery) {
      filtered = filterProductsBySearch(filtered, searchQuery)
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
        case 'newest': {
          // Higher productNumber = newer product
          const aNum = a.productNumber ? parseInt(a.productNumber) : 0
          const bNum = b.productNumber ? parseInt(b.productNumber) : 0
          return bNum - aNum
        }
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchQuery, filters, sortBy])

  // Debounced search analytics: report settled queries (with result count,
  // so zero-result searches are visible in GA)
  const searchResultsCountRef = useRef(0)
  searchResultsCountRef.current = filteredAndSortedProducts.length
  useEffect(() => {
    const query = searchQuery.trim()
    if (query.length < 2) return
    const timeout = setTimeout(() => {
      trackSearch(query, searchResultsCountRef.current)
    }, 1200)
    return () => clearTimeout(timeout)
  }, [searchQuery])

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
        
        {/* "Back to Home" removed on desktop — breadcrumb above already provides the nav path.
           Kept breadcrumb as the single source of truth for going back. */}

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

        {/* Trust strip — brand promise line under search. Below md the items scroll
            horizontally (3 pills on one line with no wrap); at md+ we switch to
            flex-wrap so long localisations (e.g. Russian "Оригинальная корейская
            космецевтика") wrap cleanly to a second line on 1024–1280px laptops
            instead of overflowing the container and hiding content. */}
        <div className="mb-4 flex items-center justify-center gap-5 md:gap-10 md:flex-wrap gap-y-2 text-xs md:text-sm font-medium text-gray-800 border-y border-gray-200 bg-gray-50 py-3 overflow-x-auto md:overflow-visible scrollbar-hide">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h13l4 5v5h-2a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7z" /></svg>
            {t('products.trustShipping')}
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {t('products.trustAuthentic')}
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h4m-6 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            {t('products.trustVat')}
          </span>
        </div>

        {/* Mobile Categories - Below Search. Horizontal scroll keeps it to ONE row. */}
        {/* pt/gap leave room if a category is temporarily re-enabled in lib/productBadges.ts */}
        <div className="md:hidden mb-4 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-2 pb-1 snap-x snap-mandatory">
            {getCategories(t).map((category) => {
              const isActive = filters.categories.includes(category.id) || (category.id === 'all' && filters.categories.length === 0)
              const showNewBadge = isNewCategoryFilterId(category.id)
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    if (category.id === 'all') {
                      setFilters(prev => ({
                        ...prev,
                        categories: []
                      }))
                    } else if (category.id === 'skin-concern') {
                      setFilters(prev => ({
                        ...prev,
                        categories: prev.categories.includes('skin-concern') ? [] : ['skin-concern']
                      }))
                    } else {
                      setFilters(prev => {
                        const wasActive = prev.categories.includes(category.id)
                        const newCategories = wasActive
                          ? prev.categories.filter(c => c !== category.id)
                          : [...prev.categories.filter(c => c !== 'all'), category.id].filter(c => c !== 'skin-concern')
                        return {
                          ...prev,
                          categories: newCategories
                        }
                      })
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap min-h-[40px] min-w-[48px] flex items-center justify-center select-none transition-all duration-150 active:scale-95 relative flex-shrink-0 snap-start ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 active:bg-gray-300'
                  }`}
                  style={{ 
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {showNewBadge && (
                    <span
                      className={`pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-bold leading-none px-1.5 py-0.5 rounded-full whitespace-nowrap uppercase tracking-wide shadow-sm ${
                        isActive
                          ? 'bg-white text-primary-600'
                          : 'bg-green-500 text-white'
                      }`}
                    >
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
            {filters.categories.includes('skin-concern') ? (
              /* Skin Concern — interactive face map (chips inside cover direct
                 access; the site-wide "Shop by Skin Concern" section below the
                 grid keeps the full card list for scrollers + SEO) */
              <ConcernFaceMap locale={locale} />
            ) : (
              /* Regular Products View */
              <>
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
                  {/* Sort — now visible on mobile too (was hidden md:block) */}
                  <div className="w-full sm:w-auto">
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
                  <>
                    {isPWA ? (
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                        {filteredAndSortedProducts.map((product) => (
                          <div key={product.id}>
                            <ProductCard product={product} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6"
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
                    )}

                    {/* End-of-grid footer — desktop only. Gives long lists (50+ items)
                        a clear terminus + a quick way back to the filters. Hidden on
                        mobile web / PWA because those already have a scroll-to-top
                        gesture (and the mobile bottom nav). */}
                    <div className="hidden md:flex items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100 text-sm text-gray-500">
                      <span>
                        {t('products.showing', { filtered: filteredAndSortedProducts.length, total: products.length })}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-gray-600 hover:text-primary-600 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded px-1"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                        {locale === 'ar' ? 'العودة إلى الأعلى' : locale === 'ru' ? 'Наверх' : 'Back to top'}
                      </button>
                    </div>
                  </>
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
              </>
            )}
          </div>
        </div>

        {/* Newsletter signup — this is the page mobile/PWA visitors land on
            (the homepage redirects them here and the content footer is hidden
            on mobile), so it's the primary email-capture surface off desktop. */}
        {!loading && (
          <div className="max-w-2xl mx-auto mt-10 md:mt-14">
            <NewsletterSignup locale={locale} isRtl={locale === 'ar'} source="products" />
          </div>
        )}
      </div>
    </div>
  )
}
