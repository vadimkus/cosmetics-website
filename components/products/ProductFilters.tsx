'use client'

import { useState, useCallback, memo } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Product } from '@/types'
import { useTranslation } from '@/hooks/useTranslation'

interface FilterState {
  categories: string[]
  priceRange: [number, number]
  minRating: number
  inStockOnly: boolean
}

interface ProductFiltersProps {
  products: Product[]
  categories: Array<{ id: string; name: string }>
  onFiltersChange: (filters: FilterState) => void
  activeFilters: FilterState
}

const ProductFilters = memo(function ProductFilters({ 
  products,
  categories, 
  onFiltersChange, 
  activeFilters 
}: ProductFiltersProps) {
  const { t, dir } = useTranslation()
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    stock: true
  })

  // Calculate price range from products
  const priceRange = products.length > 0
    ? products.reduce(
        (acc, product) => {
          const price = product.price || 0
          return {
            min: Math.min(acc.min, price),
            max: Math.max(acc.max, price)
          }
        },
        { min: Infinity, max: 0 }
      )
    : { min: 0, max: 10000 }

  const handleCategoryToggle = useCallback((categoryId: string) => {
    const newCategories = activeFilters.categories.includes(categoryId)
      ? activeFilters.categories.filter(c => c !== categoryId)
      : [...activeFilters.categories, categoryId]
    
    onFiltersChange({ ...activeFilters, categories: newCategories })
  }, [activeFilters, onFiltersChange])

  const handlePriceChange = useCallback((index: number, value: number) => {
    const newRange: [number, number] = [...activeFilters.priceRange]
    newRange[index] = value
    if (newRange[0] > newRange[1]) {
      const otherIndex = 1 - index
      newRange[index] = newRange[otherIndex] || value
    }
    onFiltersChange({ ...activeFilters, priceRange: newRange })
  }, [activeFilters, onFiltersChange])

  const handleRatingChange = useCallback((rating: number) => {
    onFiltersChange({ ...activeFilters, minRating: rating })
  }, [activeFilters, onFiltersChange])

  const handleStockToggle = useCallback(() => {
    onFiltersChange({ ...activeFilters, inStockOnly: !activeFilters.inStockOnly })
  }, [activeFilters, onFiltersChange])

  const clearAllFilters = useCallback(() => {
    onFiltersChange({
      categories: [],
      priceRange: [priceRange.min, priceRange.max] as [number, number],
      minRating: 0,
      inStockOnly: false
    })
  }, [priceRange.min, priceRange.max, onFiltersChange])

  const hasActiveFilters = 
    activeFilters.categories.length > 0 ||
    activeFilters.priceRange[0] !== priceRange.min ||
    activeFilters.priceRange[1] !== priceRange.max ||
    activeFilters.minRating > 0 ||
    activeFilters.inStockOnly

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }, [])

  return (
    <>
      {/* Desktop Filter Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Header - Fixed */}
            <div className={`flex items-center justify-between p-4 border-b border-gray-100 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <h2 className="text-lg font-semibold text-gray-900">{t('products.filters')}</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 py-1 px-2"
                >
                  {t('products.clear')}
                </button>
              )}
            </div>
            
            {/* Scrollable Content */}
            <div 
              className="p-4 overflow-y-auto overscroll-contain"
              style={{ maxHeight: 'calc(100vh - 10rem)' }}
            >
              <div className="space-y-4 text-gray-900">
                {/* Categories */}
                <div className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => toggleSection('category')}
                    className={`w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3 py-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                  >
                    <span>{t('products.categories')}</span>
                    {expandedSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {expandedSections.category && (
                    <div className="space-y-2">
                      {categories.filter(c => c.id !== 'all').map((category) => {
                        // Mark these as NEW — matches the mobile pill badges for consistency
                        const isNew = category.id === 'skin-concern' || category.id === 'cream' || category.id === 'beauty-boxes' || category.id === 'bio-meso'
                        return (
                          <label
                            key={category.id}
                            className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-primary-600"
                          >
                            <input
                              type="checkbox"
                              checked={activeFilters.categories.includes(category.id)}
                              onChange={() => handleCategoryToggle(category.id)}
                              className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 accent-primary-600 cursor-pointer"
                            />
                            <span className="text-gray-900 flex items-center gap-1.5">
                              {category.name}
                              {isNew && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase bg-green-500 text-white leading-none">
                                  {t('common.new')}
                                </span>
                              )}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => toggleSection('price')}
                    className={`w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3 py-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                  >
                    <span>{t('products.priceRange')}</span>
                    {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {expandedSections.price && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          id="price-min"
                          name="price-min"
                          type="number"
                          min={priceRange.min}
                          max={priceRange.max}
                          value={activeFilters.priceRange[0]}
                          onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white"
                          placeholder={t('products.min')}
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          id="price-max"
                          name="price-max"
                          type="number"
                          min={priceRange.min}
                          max={priceRange.max}
                          value={activeFilters.priceRange[1]}
                          onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white"
                          placeholder={t('products.max')}
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        {t('products.range', { min: priceRange.min.toFixed(0), max: priceRange.max.toFixed(0) })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => toggleSection('rating')}
                    className={`w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3 py-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                  >
                    <span>{t('products.minimumRating')}</span>
                    {expandedSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {expandedSections.rating && (
                    <div className="space-y-2">
                      {[4, 3, 2, 1, 0].map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-primary-600"
                        >
                          <input
                            type="radio"
                            name="rating"
                            checked={activeFilters.minRating === rating}
                            onChange={() => handleRatingChange(rating)}
                            className="w-4 h-4 text-primary-600 bg-white border-gray-300 focus:ring-primary-500 accent-primary-600 cursor-pointer"
                          />
                          <span className="text-gray-900">
                            {rating === 0 ? t('products.anyRating') : t('products.stars', { rating })}
                            {rating > 0 && (
                              <span className={`${dir === 'rtl' ? 'mr-1' : 'ml-1'} text-yellow-500`}>
                                {'★'.repeat(rating)}
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stock Status */}
                <div className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => toggleSection('stock')}
                    className={`w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3 py-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                  >
                    <span>{t('products.availability')}</span>
                    {expandedSections.stock ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {expandedSections.stock && (
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-primary-600">
                      <input
                        type="checkbox"
                        checked={activeFilters.inStockOnly}
                        onChange={handleStockToggle}
                        className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 accent-primary-600 cursor-pointer"
                      />
                      <span className="text-gray-900">{t('products.inStockOnly')}</span>
                    </label>
                  )}
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full py-3 px-4 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors"
                  >
                    {t('products.clearAllFilters')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
})

export default ProductFilters
