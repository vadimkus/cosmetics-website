'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Search, X, Mic, MicOff } from 'lucide-react'
import { Product } from '@/types'
import { useTranslation } from '@/hooks/useTranslation'
import { useVoiceSearch } from '@/hooks/useVoiceSearch'
import { filterProductsBySearch } from '@/lib/productSearch'
import { translateCategory } from '@/utils/categoryTranslations'

interface ProductSearchProps {
  products: Product[]
  onSearchChange: (query: string) => void
  searchQuery: string
}

export default function ProductSearch({ products, onSearchChange, searchQuery }: ProductSearchProps) {
  const { t, dir, locale, messages } = useTranslation()
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Map locale to speech recognition language
  const getSpeechLanguage = (loc: string) => {
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'ru': 'ru-RU',
      'ar': 'ar-AE'
    }
    return languageMap[loc] || 'en-US'
  }

  const { 
    isListening, 
    status, 
    transcript, 
    error, 
    isSupported,
    startListening,
    stopListening
  } = useVoiceSearch({
    language: getSpeechLanguage(locale),
    onResult: (result) => {
      onSearchChange(result)
      // Focus the input after voice search
      inputRef.current?.focus()
    }
  })

  // Update search with interim transcript
  useEffect(() => {
    if (isListening && transcript) {
      onSearchChange(transcript)
    }
  }, [transcript, isListening, onSearchChange])

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

    // Stop voice search if user starts typing
    if (isListening) {
      stopListening()
    }

    if (query.length > 0) {
      // Rank direct product-name matches above bundles or descriptions that
      // merely mention the search term.
      const filtered = filterProductsBySearch(products, query).slice(0, 5)
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
    if (isListening) {
      stopListening()
    }
  }

  const handleVoiceClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isListening) {
      // Start listening
      setIsFocused(true)
      startListening()
    } else {
      // Stop listening
      stopListening()
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto mb-6">
      <div className="relative">
        <Search className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--cera-muted)]`} />
        <input
          ref={inputRef}
          id="product-search"
          name="product-search"
          type="text"
          placeholder={isListening ? t('voiceSearch.listening') : t('products.searchPlaceholder')}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          /* Deliberately not .ed-field: that class sets its horizontal padding
             in a shorthand, which fights the asymmetric ps-12/pe-24 this input
             needs for the icon on one flank and two buttons on the other. */
          className={`w-full rounded-full border bg-white py-3 text-[15px] text-[var(--cera-ink)] transition-all duration-200 placeholder:text-[var(--cera-muted)]/70 focus:border-[var(--cera-rose)] focus:outline-none focus:ring-2 focus:ring-[var(--cera-rose)]/15 ${
            dir === 'rtl' ? 'pe-12 ps-24' : 'ps-12 pe-24'
          } ${isListening ? 'border-[var(--cera-rose)] ring-2 ring-[var(--cera-blush-deep)]' : 'border-[var(--cera-line)]'}`}
          aria-label={t('products.searchPlaceholder')}
          autoComplete="off"
        />
        
        {/* Voice Search Button */}
        {isSupported && (
          <button
            type="button"
            onClick={handleVoiceClick}
            className={`absolute ${dir === 'rtl' ? 'left-12' : 'right-12'} top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 select-none items-center justify-center rounded-full p-2 transition-all duration-200 touch-manipulation ${
              isListening
                ? 'animate-pulse bg-[var(--cera-blush)] text-[var(--cera-rose)]'
                : 'text-[var(--cera-muted)] hover:bg-[var(--cera-cream-deep)] hover:text-[var(--cera-ink)]'
            }`}
            aria-label={isListening ? t('voiceSearch.stopListening') : t('voiceSearch.startListening')}
            title={isListening ? t('voiceSearch.stopListening') : t('voiceSearch.startListening')}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
        )}

        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={clearSearch}
            className={`absolute ${dir === 'rtl' ? 'left-2' : 'right-2'} top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center p-2 text-[var(--cera-muted)] touch-manipulation hover:text-[var(--cera-ink)]`}
            aria-label={t('common.close')}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Voice Search Status Indicator */}
      {isListening && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-sm text-red-500">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          {t('voiceSearch.listening')}...
        </div>
      )}

      {/* Voice Search Error */}
      {status === 'error' && error && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-red-500 whitespace-nowrap">
          {error}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {isFocused && suggestions.length > 0 && !isListening && (
        <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-[var(--cera-line)] bg-white shadow-[0_18px_40px_-24px_rgba(23,20,15,0.45)]">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSuggestionClick(product)}
              className="min-h-[44px] w-full border-b border-[var(--cera-line)] px-4 py-3 text-start transition-colors last:border-b-0 touch-manipulation hover:bg-[var(--cera-cream)]"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={product.image}
                  alt={`${product.name} - GENOSYS Korean ${product.category || 'dermacosmetics'} product`}
                  className="w-10 h-10 object-contain bg-white rounded"
                  width={40}
                  height={40}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-[var(--cera-ink)]">{product.name}</p>
                  <p className="text-[12px] text-[var(--cera-muted)]">{translateCategory(product.category, messages)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
