'use client'

import { ChevronDown } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest'

interface ProductSortProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

const getSortOptions = (t: (key: string) => string): Array<{ value: SortOption; label: string }> => [
  { value: 'newest', label: t('products.newestFirst') },
  { value: 'name-asc', label: t('products.nameAsc') },
  { value: 'name-desc', label: t('products.nameDesc') },
  { value: 'price-asc', label: t('products.priceLowToHigh') },
  { value: 'price-desc', label: t('products.priceHighToLow') },
  { value: 'rating-desc', label: t('products.highestRated') },
]

export default function ProductSort({ sortBy, onSortChange }: ProductSortProps) {
  const { t, dir } = useTranslation()
  const sortOptions = getSortOptions(t)
  
  return (
    <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
      <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
        {t('products.sortBy')}
      </label>
      <div className="relative">
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={`appearance-none bg-white border border-gray-300 rounded-md px-4 py-3 ${dir === 'rtl' ? 'pl-8 pr-4' : 'pr-8'} text-sm md:text-base text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer touch-manipulation min-h-[44px]`}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={`absolute ${dir === 'rtl' ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none`} />
      </div>
    </div>
  )
}

