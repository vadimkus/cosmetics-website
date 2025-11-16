'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Product } from '@/types'

interface ProductSearchProps {
  products: Product[]
  onSearchChange: (query: string) => void
  searchQuery: string
}

export default function ProductSearch({ products, onSearchChange, searchQuery }: ProductSearchProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    onSearchChange(query)

    if (query.length > 0) {
      // Generate suggestions based on product names and categories
      const filtered = products
        .filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (product: Product) => {
    onSearchChange(product.name)
    setSuggestions([])
    setIsFocused(false)
  }

  const clearSearch = () => {
    onSearchChange('')
    setSuggestions([])
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base text-gray-900 bg-white placeholder:text-gray-400"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSuggestionClick(product)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

