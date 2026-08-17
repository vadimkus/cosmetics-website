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
      <label htmlFor="sort" className="whitespace-nowrap text-[13px] font-medium text-[var(--cera-muted)]">
        {t('products.sortBy')}
      </label>
      <div className="relative">
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={`ed-field min-h-[44px] cursor-pointer appearance-none touch-manipulation ${dir === 'rtl' ? 'ps-9' : 'pe-9'}`}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={`pointer-events-none absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--cera-muted)]`} />
      </div>
    </div>
  )
}

