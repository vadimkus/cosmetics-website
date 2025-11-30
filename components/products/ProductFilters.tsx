'use client'

import { useState, useEffect } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
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

export default function ProductFilters({ 
  products,
  categories, 
  onFiltersChange, 
  activeFilters 
}: ProductFiltersProps) {
  const { t, dir } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<FilterState>(activeFilters)
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
  
  // Update local filters when activeFilters change (e.g., from URL)
  useEffect(() => {
    setLocalFilters(activeFilters)
  }, [activeFilters])

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = localFilters.categories.includes(categoryId)
      ? localFilters.categories.filter(c => c !== categoryId)
      : [...localFilters.categories, categoryId]
    
    const updated = { ...localFilters, categories: newCategories }
    setLocalFilters(updated)
    onFiltersChange(updated)
  }

  const handlePriceChange = (index: number, value: number) => {
    const newRange: [number, number] = [...localFilters.priceRange]
    newRange[index] = value
    if (newRange[0] > newRange[1]) {
      const otherIndex = 1 - index
      newRange[index] = newRange[otherIndex] || value
    }
    const updated = { ...localFilters, priceRange: newRange }
    setLocalFilters(updated)
    onFiltersChange(updated)
  }

  const handleRatingChange = (rating: number) => {
    const updated = { ...localFilters, minRating: rating }
    setLocalFilters(updated)
    onFiltersChange(updated)
  }

  const handleStockToggle = () => {
    const updated = { ...localFilters, inStockOnly: !localFilters.inStockOnly }
    setLocalFilters(updated)
    onFiltersChange(updated)
  }

  const clearAllFilters = () => {
    const cleared: FilterState = {
      categories: [],
      priceRange: [priceRange.min, priceRange.max] as [number, number],
      minRating: 0,
      inStockOnly: false
    }
    setLocalFilters(cleared)
    onFiltersChange(cleared)
  }

  const hasActiveFilters = 
    localFilters.categories.length > 0 ||
    localFilters.priceRange[0] !== priceRange.min ||
    localFilters.priceRange[1] !== priceRange.max ||
    localFilters.minRating > 0 ||
    localFilters.inStockOnly

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const FilterContent = () => (
    <div className="space-y-4 text-gray-900">
      {/* Categories */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('category')}
          className={`w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3 py-2 touch-manipulation min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
        >
          <span>{t('products.categories')}</span>
          {expandedSections.category ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-primary-600"
              >
                <input
                  type="checkbox"
                  checked={localFilters.categories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 accent-primary-600 cursor-pointer"
                />
                <span className="text-gray-900">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('price')}
          className={`w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3 py-2 touch-manipulation min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
        >
          <span>{t('products.priceRange')}</span>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={localFilters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white placeholder:text-gray-400"
                placeholder={t('products.min')}
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={localFilters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white placeholder:text-gray-400"
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
          className={`w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3 py-2 touch-manipulation min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
        >
          <span>{t('products.minimumRating')}</span>
          {expandedSections.rating ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
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
                  checked={localFilters.minRating === rating}
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
          className={`w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3 py-2 touch-manipulation min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
        >
          <span>{t('products.availability')}</span>
          {expandedSections.stock ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.stock && (
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-primary-600">
            <input
              type="checkbox"
              checked={localFilters.inStockOnly}
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
          className="w-full py-3 px-4 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors touch-manipulation min-h-[44px]"
        >
          {t('products.clearAllFilters')}
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(true)
        }}
        className={`md:hidden fixed bottom-20 ${dir === 'rtl' ? 'left-3' : 'right-3'} z-40 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 active:bg-primary-800 transition-all flex items-center justify-center relative touch-manipulation min-h-[56px] min-w-[56px] w-14 h-14`}
        aria-label={t('products.filters')}
        type="button"
      >
        <Filter className="h-6 w-6" />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold leading-none border-2 border-white">
            {localFilters.categories.length + (localFilters.minRating > 0 ? 1 : 0) + (localFilters.inStockOnly ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className={`md:hidden fixed inset-y-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} w-5/6 max-w-sm bg-white z-50 shadow-xl overflow-y-auto text-gray-900`}>
            <div className={`sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <h2 className="text-lg font-semibold text-gray-900">{t('products.filters')}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={t('common.close')}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 text-gray-900">
              <FilterContent />
            </div>
          </div>
        </>
      )}

      {/* Desktop Filter Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className={`flex items-center justify-between mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <h2 className="text-lg font-semibold text-gray-900">{t('products.filters')}</h2>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary-600 hover:text-primary-700 py-2 px-2 touch-manipulation min-h-[44px]"
              >
                {t('products.clear')}
              </button>
            )}
          </div>
          <FilterContent />
        </div>
      </div>
    </>
  )
}

