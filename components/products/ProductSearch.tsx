'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Search, X, Mic, MicOff } from 'lucide-react'
import { Product } from '@/types'
import { useTranslation } from '@/hooks/useTranslation'
import { useVoiceSearch } from '@/hooks/useVoiceSearch'

interface ProductSearchProps {
  products: Product[]
  onSearchChange: (query: string) => void
  searchQuery: string
}

export default function ProductSearch({ products, onSearchChange, searchQuery }: ProductSearchProps) {
  const { t, dir, locale } = useTranslation()
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
        <Search className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
        <input
          ref={inputRef}
          type="text"
          placeholder={isListening ? t('voiceSearch.listening') : t('products.searchPlaceholder')}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          className={`w-full ${dir === 'rtl' ? 'pr-12 pl-24' : 'pl-12 pr-24'} py-3 border ${isListening ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base text-gray-900 bg-white placeholder:text-gray-400 transition-all duration-200`}
          aria-label={t('products.searchPlaceholder')}
        />
        
        {/* Voice Search Button */}
        {isSupported && (
          <button
            type="button"
            onClick={handleVoiceClick}
            className={`absolute ${dir === 'rtl' ? 'left-12' : 'right-12'} top-1/2 transform -translate-y-1/2 p-2 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all duration-200 select-none ${
              isListening 
                ? 'text-red-500 bg-red-50 animate-pulse' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:bg-gray-200'
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
            className={`absolute ${dir === 'rtl' ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center`}
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
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSuggestionClick(product)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 touch-manipulation min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={product.image}
                  alt={`${product.name} - GENOSYS Korean ${product.category || 'dermacosmetics'} product`}
                  className="w-10 h-10 object-cover rounded"
                  width={40}
                  height={40}
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
