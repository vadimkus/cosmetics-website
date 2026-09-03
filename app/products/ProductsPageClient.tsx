'use client'

/**
 * /products - the catalogue.
 *
 * Reworked onto the editorial system in Aug 2026. This is a restyle: the
 * filtering, sorting, URL syncing, search analytics and PWA branches all behave
 * exactly as before, and the class hooks other code keys on
 * (`products-layout`, `products-header`, `products-clear-filters`,
 * `products-breadcrumb`) are preserved.
 *
 * ProductCard itself is deliberately untouched. It is shared with /favorites
 * and one of its files has unrelated uncommitted work in it, so it is a
 * separate job rather than a passenger on this one.
 */

import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

import { debugLog, errorLog } from '@/lib/logger'

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
import ConcernShowcase from '@/components/concerns/ConcernShowcase'
import { CONCERN_PAGES } from '@/lib/concernsData'
import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Product } from '@/types'
import ProductsListSchema from '@/components/schema/ProductsListSchema'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import {
  filterProductsBySearch,
  getProductSearchRelevance,
} from '@/lib/productSearch'
import { trackSearch } from '@/lib/analytics'
import NewsletterSignup from '@/components/NewsletterSignup'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useIsMobile } from '@/hooks/useIsMobile'
import { isNewCategoryFilterId } from '@/lib/productBadges'

// Catalog order: discovery tool first, then skincare routine flow, then specialty.
// "New" badges are product-level only - see lib/productBadges.ts.
/**
 * The three brand claims. Rendered twice with different layouts - a wrapping row under the
 * search field on desktop, a stacked block below the grid on mobile - so they are declared
 * once here rather than as two copies of the same markup.
 */
const TRUST_ITEMS = [
  { key: 'products.trustShipping', path: 'M3 7h13l4 5v5h-2a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7z' },
  { key: 'products.trustAuthentic', path: 'M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'products.trustVat', path: 'M3 10h18M7 15h4m-6 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
] as const

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
  // No Holiday kits entry: the seasonal box was the only product in that
  // category and was retired in Aug 2026. This list is written out by hand
  // rather than derived from what is in stock, so a category with nothing left
  // in it would still offer the filter and then return an empty grid.
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
  /** Live per-concern product counts, so the concern cards can lead the
   *  skin-concern view instead of being stranded below the fold. */
  concernCounts?: Record<string, number> | undefined
}

export default function ProductsPageClient({
  initialProducts = [],
  concernCounts,
}: ProductsPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, locale, dir } = useTranslation()
  const isRTL = dir === 'rtl'
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

  /* Set once the URL has been read into state. The effect below writes the URL from
     state, and on locales where the page ships without server products it used to fire
     first - 300 ms after mount, while /api/products was still in flight - replacing the
     URL with one built from empty filters and destroying the very parameters this effect
     was about to read. Any shared link carrying ?categories=, ?search=, ?rating= or
     ?inStock= silently lost its filter on /ar/products and /ru/products. */
  const filtersInitialisedFromUrlRef = useRef(false)

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
      filtersInitialisedFromUrlRef.current = true
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

  /* The "Shop by skin concern" block is rendered by the server page as a sibling of
     this component, so it cannot be reordered from here. In concern mode the cards are
     rendered above instead, and this flag lets CSS hide the server copy rather than
     showing the same eight cards twice. A body attribute rather than searchParams on
     the page, because reading searchParams there would opt the whole listing out of
     static rendering for the sake of one view. */
  const inConcernMode = filters.categories.includes('skin-concern')
  useEffect(() => {
    const { body } = document
    if (inConcernMode) body.dataset.productsConcernMode = 'true'
    else delete body.dataset.productsConcernMode
    return () => {
      delete document.body.dataset.productsConcernMode
    }
  }, [inConcernMode])

  // Debounce timer ref to prevent URL updates from interrupting touch events
  const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Update URL when filters/search/sort change - debounced to not interrupt touch events
  useEffect(() => {
    // Never write the URL before it has been read, or the read is destroyed. See
    // filtersInitialisedFromUrlRef above.
    if (!filtersInitialisedFromUrlRef.current) return

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

    // Search filter (tokenized, locale-agnostic - see lib/productSearch.ts)
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
      if (searchQuery.trim()) {
        const relevanceDifference =
          getProductSearchRelevance(b, searchQuery) -
          getProductSearchRelevance(a, searchQuery)
        if (relevanceDifference !== 0) return relevanceDifference
      }

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
    <div className={`cera-page genosys-page min-h-[100dvh]`} suppressHydrationWarning>
      <ProductsListSchema products={filteredAndSortedProducts} category="" />
      <BreadcrumbSchema 
        items={[
          { name: t('navigation.home'), url: getLocalizedPath('/', locale) },
          { name: t('navigation.products'), url: getLocalizedPath('/products', locale) }
        ]}
      />
      {/* Breadcrumb sits above the content container so it lands at the same
          place as every other route. Hidden in PWA and on mobile web. */}
      {!isPWA && !isMobile && (
        <PageBreadcrumb
          items={[
            { name: t('navigation.home'), href: getLocalizedPath('/', locale) },
            { name: t('navigation.products') },
          ]}
        />
      )}
      <div className="container mx-auto px-4 pt-4 pb-28 md:py-8 lg:py-16">
        
        {/* "Back to Home" removed on desktop - breadcrumb above already provides the nav path.
           Kept breadcrumb as the single source of truth for going back. */}

        {/* Header. The catalogue had no h1 at all before the rework - just a
            logo image and a subtitle.
            The logo is gone now. `prd_logo.png` carries an alpha channel that
            is filled opaque white, so on the cream page it painted a white
            rectangle. Swapping in genosys-logo-transparent.png would have
            fixed that, but it would still be the word GENOSYS three times in
            three typefaces within 100px: the site header, the mark, and the
            heading directly below it. */}
        <div className={`text-center ${isMobile ? 'mb-4' : 'mb-6 md:mb-10'}`}>
          <h1 className="cera-serif text-[28px] leading-[1.08] sm:text-[36px] md:text-[44px]">
            {t('products.title')}
          </h1>
          <p className="mx-auto mt-3 hidden max-w-[56ch] text-[15px] leading-relaxed text-[var(--cera-muted)] md:block md:text-[16px]">
            {t('products.subtitle')}
          </p>
          {/* Black Friday Mini Counter - hide on mobile */}
          {!isMobile && (
            <div className="mt-4 flex justify-center">
              <BlackFridayMini />
            </div>
          )}
        </div>

        {/* Search Bar */}
        <ProductSearch
          products={products}
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
        />

        {/* Trust strip, desktop only.
     
            On a phone this used to sit right here, between the search field and the
            category filters, as a single non-wrapping row inside overflow-x-auto with the
            scrollbar hidden. Three problems: it put a row of static brand claims inside the
            browse task, where the job is search then filter then scan; centring content that
            overflows makes the start of it unreachable by scrolling in several browsers; and
            with no scrollbar there was no cue anything was scrollable, so the third item
            simply read as text chopped mid-word.
     
            The claims still matter on mobile - the site footer is suppressed below 768px, so
            this is their only appearance - so they moved below the grid, where they close the
            page instead of interrupting it. See the block after the product grid. */}
        <div className="mb-5 hidden flex-wrap items-center justify-center gap-x-10 gap-y-2 border-y border-[var(--cera-line)] bg-white py-3 text-[14px] text-[var(--cera-body)] md:flex">
          {TRUST_ITEMS.map(item => (
            <span key={item.key} className="flex items-center gap-2">
              <svg className="h-4 w-4 flex-shrink-0 text-[var(--cera-rose)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
              </svg>
              {t(item.key)}
            </span>
          ))}
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
                  className={`relative flex min-h-[40px] min-w-[48px] flex-shrink-0 snap-start select-none items-center justify-center whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95 ${
                    isActive
                      ? 'border-[var(--cera-ink)] bg-[var(--cera-cta)] text-white'
                      : 'border-[var(--cera-line)] bg-white text-[var(--cera-body)] active:bg-[var(--cera-cream-deep)]'
                  }`}
                  style={{ 
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {showNewBadge && (
                    <span
                      className={`pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase leading-none tracking-wide shadow-sm ${
                        isActive
                          ? 'bg-white text-[var(--cera-rose-ink)]'
                          : 'bg-[var(--cera-rose)] text-white'
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
              /* Skin Concern view. The cards lead, because they carry imagery,
                 a description and a live product count; the face map follows as a
                 secondary way in. Audited 17 Aug: previously the face map led and
                 the cards sat two screens below it.

                 The header row is not decoration - selecting this "category"
                 replaces the grid, which also removed the sort control, the result
                 count and the clear-filters link, leaving no visible way back to
                 the products. The exit below restores that. */
              <>
                <div className="products-header mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <p className="text-[14px] text-[var(--cera-muted)]">
                    {t('products.concernModeCount', { count: CONCERN_PAGES.length })}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setFilters({
                        categories: [],
                        priceRange: [priceRange.min, priceRange.max],
                        minRating: 0,
                        inStockOnly: false,
                      })
                    }}
                    className="products-clear-filters font-semibold text-[var(--cera-rose-ink)] underline underline-offset-2 hover:opacity-70"
                  >
                    {t('products.concernModeExit')}
                  </button>
                </div>

                <ConcernShowcase
                  locale={locale}
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  concernCounts={concernCounts}
                  headingId="products-concern-heading"
                  showCta={false}
                />

                <ConcernFaceMap locale={locale} />
              </>
            ) : (
              /* Regular Products View */
              <>
                {/* Results Header with Sort */}
                <div className="products-header mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="text-[14px] text-[var(--cera-muted)]">
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
                            className="products-clear-filters ms-2 font-semibold text-[var(--cera-rose-ink)] underline underline-offset-2 hover:opacity-70"
                          >
                            {t('products.clearFilters')}
                          </button>
                        )}
                      </span>
                    )}
                  </div>
                  {/* Sort - now visible on mobile too (was hidden md:block) */}
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

                    {/* Trust marks, mobile only - the same three claims that sit under the
                        search field on desktop. Placed after the grid so they read as
                        closing reassurance rather than an obstacle between the search field
                        and the filters, and stacked so the copy is never truncated. They
                        cannot simply be dropped on mobile: the site footer returns null
                        below 768px, so this is the only place a phone visitor sees them. */}
                    <ul className="mt-8 space-y-3 rounded-[22px] border border-[var(--cera-line)] bg-white p-5 md:hidden">
                      {TRUST_ITEMS.map(item => (
                        <li key={item.key} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[var(--cera-blush)]">
                            <svg className="h-4 w-4 text-[var(--cera-rose-ink)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                            </svg>
                          </span>
                          <span className="pt-[6px] text-[14px] leading-snug text-[var(--cera-body)]">{t(item.key)}</span>
                        </li>
                      ))}
                    </ul>

                    {/* End-of-grid footer - desktop only. Gives long lists (50+ items)
                        a clear terminus + a quick way back to the filters. Hidden on
                        mobile web / PWA because those already have a scroll-to-top
                        gesture (and the mobile bottom nav). */}
                    <div className="mt-10 hidden items-center justify-between gap-4 border-t border-[var(--cera-line)] pt-6 text-[14px] text-[var(--cera-muted)] md:flex">
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
                        className="inline-flex items-center gap-1.5 rounded px-1 font-semibold text-[var(--cera-rose-ink)] transition-opacity hover:opacity-70"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                        {locale === 'ar' ? 'العودة إلى الأعلى' : locale === 'ru' ? 'Наверх' : 'Back to top'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="cera-card px-6 py-14 text-center">
                    <p className="cera-serif text-[22px] text-[var(--cera-ink)]">{t('products.noProductsFound')}</p>
                    <p className="mx-auto mt-2 max-w-[44ch] text-[14px] text-[var(--cera-muted)]">
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
                      className="ed-cta mt-5 px-6 py-2.5 text-[14px]"
                    >
                      {t('products.clearAllFilters')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Newsletter signup - this is the page mobile/PWA visitors land on
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
