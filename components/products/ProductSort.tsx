'use client'

import { ChevronDown } from 'lucide-react'

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest'

interface ProductSortProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'newest', label: 'Newest First' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
]

export default function ProductSort({ sortBy, onSortChange }: ProductSortProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Sort by:
      </label>
      <div className="relative">
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}

